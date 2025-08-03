import { RedisOrderbook } from './redis-orderbook';
import { Order, Trade, MatchResult } from '../types/orderbook';
import { PrecisionMath, TradingPairPrecision } from '../utils/precision';
import { v4 as uuidv4 } from 'uuid';

export class MatchingEngine {
  private orderbook: RedisOrderbook;

  constructor() {
    this.orderbook = new RedisOrderbook();
  }

  /**
   * 새 주문을 처리하고 매칭 수행
   */
  async processOrder(order: Order): Promise<MatchResult> {
    // 🔥 주문 검증
    const validationError = this.validateOrder(order);
    if (validationError) {
      throw new Error(`Invalid order: ${validationError}`);
    }

    const result: MatchResult = {
      trades: [],
      updatedOrders: [],
      cancelledOrders: []
    };

    // Market order의 경우 즉시 매칭 시도
    if (order.type === 'market') {
      return await this.matchMarketOrder(order);
    }

    // Limit order의 경우 매칭 가능한 주문 찾기
    const oppositeSide = order.side === 'buy' ? 'sell' : 'buy';
    const matchingOrders = await this.findMatchingOrders(order, oppositeSide);

    for (const matchingOrder of matchingOrders) {
      if (PrecisionMath.isZero(order.remaining)) break;

      // 🔢 정밀도 기반 매칭 수량 계산
      const { base } = TradingPairPrecision.getPairInfo(order.pair);
      const orderRemaining = order.remaining;
      const matchOrderRemaining = matchingOrder.remaining;
      
      const matchAmount = PrecisionMath.min(
        orderRemaining, 
        matchOrderRemaining, 
        base.decimals
      );

      // 0인 경우 스킵
      if (PrecisionMath.isZero(matchAmount)) continue;

      // 거래 생성
      const trade = await this.createTrade(order, matchingOrder, matchAmount);
      result.trades.push(trade);

      // 🔢 정밀한 주문 업데이트
      await this.orderbook.updateOrderFill(order.id, matchAmount);
      await this.orderbook.updateOrderFill(matchingOrder.id, matchAmount);

      // 🔢 정밀한 나머지 수량 계산
      order.remaining = PrecisionMath.subtract(order.remaining, matchAmount, base.decimals);
      
      // 나머지 수량을 유효한 단위로 조정
      const adjustResult = TradingPairPrecision.adjustRemainingAmount(
        order.amount, 
        PrecisionMath.subtract(order.amount, order.remaining, base.decimals),
        order.pair
      );
      
      order.remaining = adjustResult.remaining;

      // 거래 기록
      await this.orderbook.recordTrade(trade);

      // 🔢 정밀한 상대방 주문 나머지 계산
      const { base: matchBase } = TradingPairPrecision.getPairInfo(matchingOrder.pair);
      const matchingRemaining = PrecisionMath.subtract(
        matchingOrder.remaining, 
        matchAmount, 
        matchBase.decimals
      );
      
      if (PrecisionMath.isZero(matchingRemaining)) {
        result.cancelledOrders.push(matchingOrder.id);
      }
    }

    // 남은 수량이 있으면 오더북에 추가
    if (!PrecisionMath.isZero(order.remaining)) {
      const updatedOrder: Order = {
        ...order,
        status: 'active'
      };
      
      await this.orderbook.addOrder(updatedOrder);
      result.updatedOrders.push(updatedOrder);
    } else {
      // 완전 체결
      const { base } = TradingPairPrecision.getPairInfo(order.pair);
      const filledAmount = PrecisionMath.subtract(order.amount, order.remaining, base.decimals);
      
      result.updatedOrders.push({
        ...order,
        remaining: '0',
        filled: filledAmount,
        status: 'filled'
      });
    }

    return result;
  }

  /**
   * Market Order 매칭
   */
  private async matchMarketOrder(order: Order): Promise<MatchResult> {
    const result: MatchResult = {
      trades: [],
      updatedOrders: [],
      cancelledOrders: []
    };

    const oppositeSide = order.side === 'buy' ? 'sell' : 'buy';
    const { base } = TradingPairPrecision.getPairInfo(order.pair);
    let remainingAmount = order.amount;

    // 오더북에서 최적 가격부터 차례로 매칭
    const snapshot = await this.orderbook.getOrderbook(order.pair, 100);
    const oppositeLevels = order.side === 'buy' ? snapshot.asks : snapshot.bids;

    for (const level of oppositeLevels) {
      if (PrecisionMath.isZero(remainingAmount)) break;

      const ordersAtPrice = await this.orderbook.getOrdersAtPrice(
        order.pair, 
        oppositeSide, 
        level.price
      );

      for (const matchingOrder of ordersAtPrice) {
        if (PrecisionMath.isZero(remainingAmount)) break;

        const matchAmount = PrecisionMath.min(
          remainingAmount,
          matchingOrder.remaining,
          base.decimals
        );

        // 🔢 정밀한 거래 생성 (시장가는 상대방 가격으로 체결)
        const trade = await this.createTrade(
          { ...order, price: matchingOrder.price }, 
          matchingOrder, 
          matchAmount
        );
        result.trades.push(trade);

        // 🔢 정밀한 주문 업데이트
        await this.orderbook.updateOrderFill(matchingOrder.id, matchAmount);

        remainingAmount = PrecisionMath.subtract(remainingAmount, matchAmount, base.decimals);

        // 거래 기록
        await this.orderbook.recordTrade(trade);

        // 🔢 정밀한 상대방 주문 체결 확인
        const matchingRemaining = PrecisionMath.subtract(
          matchingOrder.remaining, 
          matchAmount, 
          base.decimals
        );
        
        if (PrecisionMath.isZero(matchingRemaining)) {
          result.cancelledOrders.push(matchingOrder.id);
        }
      }
    }

    // 🔢 정밀한 Market order 결과 계산
    const filledAmount = PrecisionMath.subtract(order.amount, remainingAmount, base.decimals);
    result.updatedOrders.push({
      ...order,
      filled: filledAmount,
      remaining: remainingAmount,
      status: PrecisionMath.isZero(remainingAmount) ? 'filled' : 'cancelled' // 시장가는 미체결분 취소
    });

    return result;
  }

  /**
   * 매칭 가능한 주문들 찾기 (Price-Time Priority + 자기매칭 방지)
   */
  private async findMatchingOrders(order: Order, oppositeSide: 'buy' | 'sell'): Promise<Order[]> {
    const snapshot = await this.orderbook.getOrderbook(order.pair, 100);
    const oppositeLevels = order.side === 'buy' ? snapshot.asks : snapshot.bids;
    
    const matchingOrders: Order[] = [];
    const { quote } = TradingPairPrecision.getPairInfo(order.pair);

    for (const level of oppositeLevels) {
      // 🔢 정밀한 가격 비교
      const canMatch = order.side === 'buy' 
        ? PrecisionMath.compare(order.price, level.price, quote.decimals) >= 0  // 구매가 >= 판매가
        : PrecisionMath.compare(order.price, level.price, quote.decimals) <= 0; // 판매가 <= 구매가

      if (!canMatch) break; // 더 이상 매칭 불가

      // 해당 가격의 모든 주문 가져오기 (시간순 정렬됨)
      const ordersAtPrice = await this.orderbook.getOrdersAtPrice(
        order.pair,
        oppositeSide,
        level.price
      );

      // 🔥 자기매칭 방지: 같은 사용자 주문 필터링
      const validOrders = ordersAtPrice.filter(matchOrder => 
        matchOrder.userId !== order.userId
      );

      matchingOrders.push(...validOrders);
    }

    return matchingOrders;
  }

  /**
   * 거래 생성 (정밀도 보장)
   */
  private async createTrade(
    takerOrder: Order, 
    makerOrder: Order, 
    amount: string
  ): Promise<Trade> {
    return {
      id: uuidv4(),
      pair: takerOrder.pair,
      price: makerOrder.price, // Maker의 가격으로 체결
      amount: amount, // 이미 정밀도 조정된 문자열
      side: takerOrder.side, // Taker의 방향
      buyOrderId: takerOrder.side === 'buy' ? takerOrder.id : makerOrder.id,
      sellOrderId: takerOrder.side === 'sell' ? takerOrder.id : makerOrder.id,
      timestamp: Date.now()
    };
  }

  /**
   * 주문 취소
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    return await this.orderbook.cancelOrder(orderId);
  }

  /**
   * 오더북 조회
   */
  async getOrderbook(pair: string, depth?: number) {
    return await this.orderbook.getOrderbook(pair, depth);
  }

  /**
   * 사용자 주문 조회
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    // Redis에서 사용자의 모든 주문 ID 가져오기
    const orderIds = await this.orderbook['redis'].smembers(`user:${userId}:orders`);
    
    const orders: Order[] = [];
    for (const orderId of orderIds) {
      const orderData = await this.orderbook['redis'].hgetall(`order:${orderId}`);
      if (orderData.id) {
        orders.push({
          ...orderData,
          timestamp: parseInt(orderData.timestamp),
          expiresAt: orderData.expiresAt ? parseInt(orderData.expiresAt) : undefined,
        } as Order);
      }
    }

    return orders.sort((a, b) => b.timestamp - a.timestamp); // 최신순
  }

  /**
   * 최근 거래 내역 조회
   */
  async getRecentTrades(pair: string, limit: number = 50): Promise<Trade[]> {
    const tradesData = await this.orderbook['redis'].lrange(
      `trades:${pair}`, 
      0, 
      limit - 1
    );

    return tradesData.map(data => JSON.parse(data) as Trade);
  }

  /**
   * 주문 검증
   */
  private validateOrder(order: Order): string | null {
    // 필수 필드 검증
    if (!order.id || order.id.trim() === '') {
      return 'Order ID is required';
    }
    
    if (!order.userId || order.userId.trim() === '') {
      return 'User ID is required';
    }
    
    if (!order.pair || order.pair.trim() === '') {
      return 'Trading pair is required';
    }
    
    // 주문 타입 검증
    if (!['buy', 'sell'].includes(order.side)) {
      return 'Side must be "buy" or "sell"';
    }
    
    if (!['market', 'limit'].includes(order.type)) {
      return 'Type must be "market" or "limit"';
    }
    
    // 수량 검증
    const amount = parseFloat(order.amount);
    if (isNaN(amount) || amount <= 0) {
      return 'Amount must be a positive number';
    }
    
    // 가격 검증 (Limit order인 경우)
    if (order.type === 'limit') {
      const price = parseFloat(order.price);
      if (isNaN(price) || price <= 0) {
        return 'Price must be a positive number for limit orders';
      }
    }
    
    // 최대 주문 크기 제한 (예: 1,000,000)
    if (amount > 1000000) {
      return 'Order amount exceeds maximum limit (1,000,000)';
    }
    
    // 최소 주문 크기 제한 (예: 0.001)
    if (amount < 0.001) {
      return 'Order amount below minimum limit (0.001)';
    }
    
    return null; // 검증 통과
  }

  /**
   * 시장 현황 조회
   */
  async getMarketStats(pair: string) {
    const [tickerData, recentTrades] = await Promise.all([
      this.orderbook['redis'].hgetall(`ticker:${pair}`),
      this.getRecentTrades(pair, 100)
    ]);

    if (!tickerData.lastPrice) {
      return null;
    }

    // 24시간 통계 계산
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const dayTrades = recentTrades.filter(t => t.timestamp > dayAgo);
    
    const volume24h = dayTrades.reduce((sum, trade) => 
      sum + parseFloat(trade.amount), 0
    );

    const prices = dayTrades.map(t => parseFloat(t.price));
    const high24h = prices.length > 0 ? Math.max(...prices) : parseFloat(tickerData.lastPrice);
    const low24h = prices.length > 0 ? Math.min(...prices) : parseFloat(tickerData.lastPrice);

    return {
      pair,
      lastPrice: tickerData.lastPrice,
      high24h: high24h.toFixed(8),
      low24h: low24h.toFixed(8),
      volume24h: volume24h.toFixed(8),
      trades24h: dayTrades.length,
      lastUpdate: parseInt(tickerData.lastUpdate)
    };
  }
}