import Redis from 'ioredis';
import { redis, redisPubSub } from '../redis/client';
import { 
  Order, 
  OrderbookSnapshot, 
  OrderbookLevel, 
  Trade, 
  REDIS_KEYS,
  OrderbookUpdate 
} from '../types/orderbook';
import { PrecisionMath, TradingPairPrecision } from '../utils/precision';

export class RedisOrderbook {
  private redis: Redis;
  private pubsub: Redis;

  constructor() {
    this.redis = redis;
    this.pubsub = redisPubSub;
  }

  /**
   * 새 주문을 오더북에 추가
   */
  async addOrder(order: Order): Promise<void> {
    const pipe = this.redis.pipeline();
    
    // 1. 주문 데이터 저장
    pipe.hset(REDIS_KEYS.ORDER(order.id), {
      ...order,
      timestamp: order.timestamp.toString(),
      expiresAt: order.expiresAt?.toString() || '',
    });

    // 2. 사용자 주문 목록에 추가
    pipe.sadd(REDIS_KEYS.USER_ORDERS(order.userId), order.id);

    // 3. 오더북에 추가 (가격별 정렬)
    const bookKey = order.side === 'buy' 
      ? REDIS_KEYS.BIDS(order.pair)
      : REDIS_KEYS.ASKS(order.pair);

    // 가격을 score로 사용 (buy는 내림차순, sell은 오름차순을 위해 부호 조정)
    const score = order.side === 'buy' 
      ? -parseFloat(order.price) // 높은 가격이 우선
      : parseFloat(order.price);  // 낮은 가격이 우선
    
    pipe.zadd(bookKey, score, `${order.id}:${order.timestamp}`);

    // 4. 🔢 정밀한 가격 레벨별 집계
    const priceLevelKey = REDIS_KEYS.PRICE_LEVEL(order.pair, order.side, order.price);
    const { base } = TradingPairPrecision.getPairInfo(order.pair);
    const remainingInt = PrecisionMath.toInteger(order.remaining, base.decimals);
    pipe.hincrby(priceLevelKey, 'amount', remainingInt.toString());
    pipe.hincrby(priceLevelKey, 'orders', 1);
    pipe.sadd(`${priceLevelKey}:orderIds`, order.id);

    await pipe.exec();

    // 5. 실시간 업데이트 발행
    await this.publishUpdate({
      type: 'order_added',
      pair: order.pair,
      data: order,
      timestamp: Date.now()
    });
  }

  /**
   * 주문 취소
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const orderData = await this.redis.hgetall(REDIS_KEYS.ORDER(orderId));
    if (!orderData || !orderData.id) {
      return false;
    }

    const order: Order = {
      ...orderData,
      timestamp: parseInt(orderData.timestamp),
      expiresAt: orderData.expiresAt ? parseInt(orderData.expiresAt) : undefined,
    } as Order;

    const pipe = this.redis.pipeline();

    // 1. 오더북에서 제거
    const bookKey = order.side === 'buy' 
      ? REDIS_KEYS.BIDS(order.pair)
      : REDIS_KEYS.ASKS(order.pair);
    
    pipe.zrem(bookKey, `${orderId}:${order.timestamp}`);

    // 2. 🔢 정밀한 가격 레벨 업데이트
    const priceLevelKey = REDIS_KEYS.PRICE_LEVEL(order.pair, order.side, order.price);
    const { base } = TradingPairPrecision.getPairInfo(order.pair);
    const remainingInt = PrecisionMath.toInteger(order.remaining, base.decimals);
    pipe.hincrby(priceLevelKey, 'amount', (-remainingInt).toString());
    pipe.hincrby(priceLevelKey, 'orders', -1);
    pipe.srem(`${priceLevelKey}:orderIds`, orderId);

    // 3. 주문 상태 업데이트
    pipe.hset(REDIS_KEYS.ORDER(orderId), 'status', 'cancelled');

    await pipe.exec();

    // 4. 실시간 업데이트 발행
    await this.publishUpdate({
      type: 'order_cancelled',
      pair: order.pair,
      data: { orderId, order },
      timestamp: Date.now()
    });

    return true;
  }

  /**
   * 오더북 스냅샷 조회
   */
  async getOrderbook(pair: string, depth: number = 20): Promise<OrderbookSnapshot> {
    const [bidsData, asksData] = await Promise.all([
      this.redis.zrange(REDIS_KEYS.BIDS(pair), 0, depth - 1, 'WITHSCORES'),
      this.redis.zrange(REDIS_KEYS.ASKS(pair), 0, depth - 1, 'WITHSCORES')
    ]);

    // Bids 처리 (높은 가격부터)
    const bids = await this.processOrderbookSide(bidsData, pair, 'buy');
    
    // Asks 처리 (낮은 가격부터)
    const asks = await this.processOrderbookSide(asksData, pair, 'sell');

    return {
      pair,
      bids,
      asks,
      lastUpdate: Date.now()
    };
  }

  /**
   * 오더북 한쪽 사이드 처리 (정밀도 보장)
   */
  private async processOrderbookSide(
    data: string[], 
    pair: string, 
    side: 'buy' | 'sell'
  ): Promise<OrderbookLevel[]> {
    const levels: Map<string, OrderbookLevel> = new Map();
    const { base, quote } = TradingPairPrecision.getPairInfo(pair);

    // data는 [orderInfo, score, orderInfo, score, ...] 형태
    for (let i = 0; i < data.length; i += 2) {
      const orderInfo = data[i];
      const [orderId] = orderInfo.split(':');
      
      const orderData = await this.redis.hgetall(REDIS_KEYS.ORDER(orderId));
      if (!orderData.price || orderData.status !== 'active') continue;

      const price = orderData.price;
      const amount = orderData.remaining;

      if (levels.has(price)) {
        const level = levels.get(price)!;
        // 🔢 정밀한 수량 합계
        level.amount = PrecisionMath.add(level.amount, amount, base.decimals);
        level.orders += 1;
      } else {
        levels.set(price, {
          price,
          amount: amount,
          orders: 1
        });
      }
    }

    // 🔢 정밀한 가격별 정렬
    const sortedLevels = Array.from(levels.values()).sort((a, b) => {
      const comparison = PrecisionMath.compare(a.price, b.price, quote.decimals);
      return side === 'buy' ? -comparison : comparison; // buy는 내림차순, sell은 오름차순
    });

    return sortedLevels;
  }

  /**
   * 특정 가격의 주문들 가져오기 (매칭용)
   */
  async getOrdersAtPrice(pair: string, side: 'buy' | 'sell', price: string): Promise<Order[]> {
    const priceLevelKey = REDIS_KEYS.PRICE_LEVEL(pair, side, price);
    const orderIds = await this.redis.smembers(`${priceLevelKey}:orderIds`);
    
    const orders: Order[] = [];
    for (const orderId of orderIds) {
      const orderData = await this.redis.hgetall(REDIS_KEYS.ORDER(orderId));
      if (orderData.id && orderData.status === 'active') {
        orders.push({
          ...orderData,
          timestamp: parseInt(orderData.timestamp),
          expiresAt: orderData.expiresAt ? parseInt(orderData.expiresAt) : undefined,
        } as Order);
      }
    }

    // 시간 우선순위 정렬 (먼저 들어온 주문이 우선)
    return orders.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * 거래 기록 저장
   */
  async recordTrade(trade: Trade): Promise<void> {
    const pipe = this.redis.pipeline();

    // 1. 거래 기록 저장
    pipe.lpush(REDIS_KEYS.TRADES(trade.pair), JSON.stringify(trade));
    pipe.ltrim(REDIS_KEYS.TRADES(trade.pair), 0, 999); // 최근 1000개만 보관

    // 2. 시장 데이터 업데이트
    pipe.hset(REDIS_KEYS.TICKER(trade.pair), {
      lastPrice: trade.price,
      lastAmount: trade.amount,
      lastUpdate: trade.timestamp.toString()
    });

    await pipe.exec();

    // 3. 실시간 거래 발행
    await this.publishUpdate({
      type: 'trade_executed',
      pair: trade.pair,
      data: trade,
      timestamp: Date.now()
    });
  }

  /**
   * 주문 부분 체결 처리 (정밀도 보장)
   */
  async updateOrderFill(orderId: string, filledAmount: string): Promise<void> {
    const orderData = await this.redis.hgetall(REDIS_KEYS.ORDER(orderId));
    if (!orderData.id) return;

    // 🔢 정밀한 계산을 위해 거래쌍 정보 가져오기
    const { base } = TradingPairPrecision.getPairInfo(orderData.pair);
    
    const currentFilled = orderData.filled || '0';
    const newFilled = PrecisionMath.add(currentFilled, filledAmount, base.decimals);
    const remaining = PrecisionMath.subtract(orderData.amount, newFilled, base.decimals);

    const pipe = this.redis.pipeline();

    // 주문 상태 업데이트
    pipe.hset(REDIS_KEYS.ORDER(orderId), {
      filled: newFilled,
      remaining: remaining,
      status: PrecisionMath.isZero(remaining) ? 'filled' : 'active'
    });

    // 완전 체결된 경우 오더북에서 제거
    if (PrecisionMath.isZero(remaining)) {
      const order = orderData as Order;
      const bookKey = order.side === 'buy' 
        ? REDIS_KEYS.BIDS(order.pair)
        : REDIS_KEYS.ASKS(order.pair);
      
      pipe.zrem(bookKey, `${orderId}:${order.timestamp}`);

      // 가격 레벨 정리
      const priceLevelKey = REDIS_KEYS.PRICE_LEVEL(order.pair, order.side, order.price);
      pipe.hincrby(priceLevelKey, 'orders', -1);
      pipe.srem(`${priceLevelKey}:orderIds`, orderId);
    }

    await pipe.exec();
  }

  /**
   * 실시간 업데이트 발행
   */
  private async publishUpdate(update: OrderbookUpdate): Promise<void> {
    const channel = REDIS_KEYS.CHANNELS.ORDERBOOK(update.pair);
    await this.pubsub.publish(channel, JSON.stringify(update));
  }

  /**
   * 오더북 정리 (만료된 주문 제거)
   */
  async cleanupExpiredOrders(): Promise<number> {
    const now = Date.now();
    let cleanedCount = 0;

    // 모든 활성 주문 확인 (실제로는 배치 작업으로 처리)
    const allOrderKeys = await this.redis.keys('order:*');
    
    for (const orderKey of allOrderKeys) {
      const orderData = await this.redis.hgetall(orderKey);
      if (orderData.expiresAt && parseInt(orderData.expiresAt) < now) {
        const orderId = orderKey.split(':')[1];
        await this.cancelOrder(orderId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}