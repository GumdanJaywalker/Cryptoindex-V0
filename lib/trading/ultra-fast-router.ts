// lib/trading/ultra-fast-router.ts
/**
 * 🚀 Ultra-Fast Trading Router
 * 목표: 15,000+ TPS
 * 
 * 최적화 기법:
 * 1. High-Performance Orderbook 활용
 * 2. 비동기 병렬 처리
 * 3. 배치 거래 처리
 * 4. 메모리 캐싱
 */

import { HighPerformanceOrderbook } from '../orderbook/high-performance-orderbook';
import { getMockAMM, MockAMM } from './mock-amm';
import { AsyncDBWriter } from '../utils/async-db-writer';

interface UltraOrder {
  id: string;
  userId: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: string;
  price: string;
  timestamp: number;
}

interface UltraFill {
  id: string;
  orderId: string;
  price: string;
  amount: string;
  side: 'buy' | 'sell';
  source: 'AMM' | 'Orderbook';
  timestamp: number;
}

interface UltraRoutingResult {
  orderId: string;
  fills: UltraFill[];
  totalFilled: string;
  averagePrice: string;
  executionStats: {
    orderbookFills: number;
    ammFills: number;
    totalLatency: number;
    routingDecisions: number;
  };
}

export class UltraFastRouter {
  private static instance: UltraFastRouter;
  private orderbook: HighPerformanceOrderbook;
  private amm: MockAMM;
  private dbWriter: AsyncDBWriter;
  
  // 고성능 캐시
  private priceCache = new Map<string, { price: number; timestamp: number }>();
  private CACHE_TTL = 100; // 100ms 캐시
  
  // 성능 메트릭
  private metrics = {
    totalOrders: 0,
    totalLatency: 0,
    peakTPS: 0,
    orderbookRoutes: 0,
    ammRoutes: 0,
    hybridRoutes: 0
  };

  private constructor() {
    this.orderbook = HighPerformanceOrderbook.getInstance();
    this.amm = getMockAMM();
    this.dbWriter = AsyncDBWriter.getInstance();
  }

  static getInstance(): UltraFastRouter {
    if (!UltraFastRouter.instance) {
      UltraFastRouter.instance = new UltraFastRouter();
    }
    return UltraFastRouter.instance;
  }

  /**
   * 🔥 초고속 단일 주문 처리
   */
  async processUltraOrder(order: UltraOrder): Promise<UltraRoutingResult> {
    const startTime = Date.now();
    
    try {
      // 1. 빠른 라우팅 결정
      const routingDecision = await this.makeFastRoutingDecision(order);
      
      let fills: UltraFill[] = [];
      
      if (routingDecision.useOrderbook) {
        // 오더북 라우팅
        const orderbookResult = await this.processOrderbookRoute(order);
        fills.push(...orderbookResult.fills);
        this.metrics.orderbookRoutes++;
      }
      
      if (routingDecision.useAMM && parseFloat(order.amount) > 0) {
        // AMM 라우팅
        const ammResult = await this.processAMMRoute(order, fills);
        fills.push(...ammResult.fills);
        this.metrics.ammRoutes++;
      }
      
      if (fills.length === 0) {
        // 대기 주문으로 추가
        await this.orderbook.addOrderFast({
          id: order.id,
          userId: order.userId,
          pair: order.pair,
          side: order.side,
          type: order.type,
          price: order.price,
          amount: order.amount,
          remaining: order.amount,
          status: 'active',
          timestamp: order.timestamp
        });
      }
      
      // 2. 결과 계산
      const totalFilled = fills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0);
      const weightedPriceSum = fills.reduce((sum, fill) => 
        sum + (parseFloat(fill.price) * parseFloat(fill.amount)), 0
      );
      const averagePrice = totalFilled > 0 ? weightedPriceSum / totalFilled : 0;
      
      const executionTime = Date.now() - startTime;
      this.updateMetrics(executionTime);
      
      // 3. 비동기 DB 저장
      this.queueForAsyncStorage(order, fills);
      
      return {
        orderId: order.id,
        fills,
        totalFilled: totalFilled.toString(),
        averagePrice: averagePrice.toString(),
        executionStats: {
          orderbookFills: fills.filter(f => f.source === 'Orderbook').length,
          ammFills: fills.filter(f => f.source === 'AMM').length,
          totalLatency: executionTime,
          routingDecisions: routingDecision.useOrderbook && routingDecision.useAMM ? 2 : 1
        }
      };
      
    } catch (error) {
      console.error('❌ Ultra-fast routing failed:', error);
      throw error;
    }
  }

  /**
   * 🔥 배치 주문 초고속 처리
   */
  async processBatchOrdersUltra(orders: UltraOrder[]): Promise<{
    results: UltraRoutingResult[];
    batchStats: {
      totalOrders: number;
      successfulOrders: number;
      failedOrders: number;
      totalLatency: number;
      averageTPS: number;
      peakTPS: number;
    };
  }> {
    const batchStartTime = Date.now();
    const batchSize = orders.length;
    
    console.log(`🚀 Ultra-fast batch processing: ${batchSize} orders`);
    
    // 동시 처리를 위한 청크 분할 (CPU 코어 수에 따라 조정)
    const CHUNK_SIZE = 100; // 100개씩 동시 처리
    const chunks = this.chunkArray(orders, CHUNK_SIZE);
    
    const allResults: UltraRoutingResult[] = [];
    let successfulOrders = 0;
    let failedOrders = 0;
    
    // 청크별로 병렬 처리
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (order) => {
        try {
          const result = await this.processUltraOrder(order);
          successfulOrders++;
          return result;
        } catch (error) {
          console.error(`❌ Order ${order.id} failed:`, error);
          failedOrders++;
          return null;
        }
      });
      
      const chunkResults = await Promise.allSettled(chunkPromises);
      
      chunkResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allResults.push(result.value);
        }
      });
    }
    
    const totalLatency = Date.now() - batchStartTime;
    const averageTPS = batchSize / (totalLatency / 1000);
    
    console.log(`✅ Ultra-fast batch completed:`, {
      totalOrders: batchSize,
      successfulOrders,
      failedOrders,
      totalLatency: `${totalLatency}ms`,
      averageTPS: `${averageTPS.toFixed(1)} TPS`
    });
    
    return {
      results: allResults,
      batchStats: {
        totalOrders: batchSize,
        successfulOrders,
        failedOrders,
        totalLatency,
        averageTPS,
        peakTPS: Math.max(this.metrics.peakTPS, averageTPS)
      }
    };
  }

  /**
   * 빠른 라우팅 결정 (캐시 활용)
   */
  private async makeFastRoutingDecision(order: UltraOrder): Promise<{
    useOrderbook: boolean;
    useAMM: boolean;
  }> {
    // 캐시된 가격 정보 활용
    const cachedPrice = this.priceCache.get(order.pair);
    const now = Date.now();
    
    let currentPrice: number;
    
    if (cachedPrice && (now - cachedPrice.timestamp) < this.CACHE_TTL) {
      currentPrice = cachedPrice.price;
    } else {
      // AMM 가격 조회 (빠름)
      currentPrice = this.amm.getSpotPrice(order.pair);
      this.priceCache.set(order.pair, { price: currentPrice, timestamp: now });
    }
    
    if (order.type === 'market') {
      // 시장가는 항상 두 소스 모두 활용
      return { useOrderbook: true, useAMM: true };
    } else {
      // 지정가는 가격에 따라 결정
      const orderPrice = parseFloat(order.price);
      const priceGap = Math.abs(orderPrice - currentPrice) / currentPrice;
      
      if (priceGap < 0.001) { // 0.1% 이내
        return { useOrderbook: true, useAMM: true };
      } else if (priceGap < 0.005) { // 0.5% 이내
        return { useOrderbook: true, useAMM: false };
      } else {
        return { useOrderbook: true, useAMM: false };
      }
    }
  }

  /**
   * 오더북 라우팅 처리
   */
  private async processOrderbookRoute(order: UltraOrder): Promise<{ fills: UltraFill[] }> {
    try {
      const matchResult = await this.orderbook.matchOrderFast({
        id: order.id,
        userId: order.userId,
        pair: order.pair,
        side: order.side,
        type: order.type,
        price: order.price,
        amount: order.amount,
        remaining: order.amount,
        status: 'active',
        timestamp: order.timestamp
      });
      
      const fills: UltraFill[] = matchResult.trades.map(trade => ({
        id: trade.id,
        orderId: order.id,
        price: trade.price,
        amount: trade.amount,
        side: order.side,
        source: 'Orderbook',
        timestamp: trade.timestamp
      }));
      
      return { fills };
      
    } catch (error) {
      console.error('❌ Orderbook routing failed:', error);
      return { fills: [] };
    }
  }

  /**
   * AMM 라우팅 처리
   */
  private async processAMMRoute(order: UltraOrder, existingFills: UltraFill[]): Promise<{ fills: UltraFill[] }> {
    try {
      // 이미 체결된 수량 계산
      const alreadyFilled = existingFills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0);
      const remainingAmount = parseFloat(order.amount) - alreadyFilled;
      
      if (remainingAmount <= 0) {
        return { fills: [] };
      }
      
      // AMM 스왑 실행
      const swapResult = this.amm.executeSwap(order.pair, order.side, remainingAmount);
      
      const ammFill: UltraFill = {
        id: `amm-ultra-${order.id}-${Date.now()}`,
        orderId: order.id,
        price: swapResult.effectivePrice.toString(),
        amount: (swapResult.actualInputAmount || remainingAmount).toString(),
        side: order.side,
        source: 'AMM',
        timestamp: Date.now()
      };
      
      return { fills: [ammFill] };
      
    } catch (error) {
      console.error('❌ AMM routing failed:', error);
      return { fills: [] };
    }
  }

  /**
   * 비동기 DB 저장 큐에 추가
   */
  private queueForAsyncStorage(order: UltraOrder, fills: UltraFill[]): void {
    // 주문 이력 큐에 추가
    this.dbWriter.queueOrderHistory({
      user_id: order.userId,
      pair: order.pair,
      side: order.side,
      order_type: order.type,
      price: order.type === 'limit' ? parseFloat(order.price) : null,
      amount: parseFloat(order.amount),
      filled_amount: fills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0),
      status: fills.length > 0 ? 'filled' : 'active',
      redis_order_id: order.id
    });
    
    // 거래 이력들 큐에 추가
    fills.forEach(fill => {
      this.dbWriter.queueTradeHistory({
        id: fill.id,
        pair: order.pair,
        buyer_order_id: order.side === 'buy' ? order.id : (fill.source === 'AMM' ? 'amm' : null),
        seller_order_id: order.side === 'sell' ? order.id : (fill.source === 'AMM' ? 'amm' : null),
        price: parseFloat(fill.price),
        amount: parseFloat(fill.amount),
        side: order.side,
        source: fill.source,
        buyer_fee: 0,
        seller_fee: 0,
        redis_trade_id: fill.id
      });
    });
  }

  /**
   * 배열을 청크로 분할
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * 성능 메트릭 업데이트
   */
  private updateMetrics(latency: number): void {
    this.metrics.totalOrders++;
    this.metrics.totalLatency += latency;
    
    // TPS 계산 (간소화)
    const avgLatency = this.metrics.totalLatency / this.metrics.totalOrders;
    const estimatedTPS = 1000 / avgLatency;
    this.metrics.peakTPS = Math.max(this.metrics.peakTPS, estimatedTPS);
  }

  /**
   * 메트릭 조회
   */
  getMetrics() {
    return {
      ...this.metrics,
      averageLatency: this.metrics.totalOrders > 0 ? this.metrics.totalLatency / this.metrics.totalOrders : 0
    };
  }
}