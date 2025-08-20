/**
 * 🚀 HOOATS High-Performance Batch Processor
 * 
 * HOOATS 시스템 전용 배치 처리기
 * - 실제 V2 Smart Router 연동
 * - Redis Connection Pool 활용
 * - AsyncDBWriter 통합
 * - 실시간 성능 모니터링
 * 
 * Created: 2025-08-20
 */

const { BatchProcessor } = require('./batch-processor');

class HOOATSBatchProcessor extends BatchProcessor {
  constructor(options = {}) {
    super(options);
    
    // HOOATS 컴포넌트들
    this.smartRouter = null;
    this.connectionPool = null;
    this.asyncDBWriter = null;
    
    // HOOATS 전용 메트릭스
    this.hooatsMetrics = {
      ammOrders: 0,
      orderbookOrders: 0,
      hybridOrders: 0,
      totalVolume: 0,
      avgOrderSize: 0,
      priceImpact: 0
    };
  }

  /**
   * 🔧 HOOATS 컴포넌트 초기화
   */
  initializeComponents(smartRouter, connectionPool, asyncDBWriter) {
    this.smartRouter = smartRouter;
    this.connectionPool = connectionPool;
    this.asyncDBWriter = asyncDBWriter;
    
    console.log('✅ HOOATS Batch Processor components initialized');
  }

  /**
   * ⚡ 실제 배치 실행 (HOOATS 버전)
   */
  async executeBatch(batchId, orders) {
    const startTime = Date.now();
    const results = [];
    
    try {
      // 주문 타입별 분류
      const marketOrders = orders.filter(o => o.type === 'market');
      const limitOrders = orders.filter(o => o.type === 'limit');
      
      console.log(`🔥 Processing ${batchId}: ${marketOrders.length} market, ${limitOrders.length} limit orders`);
      
      // 병렬 처리를 위한 Promise 배열
      const processingPromises = [];
      
      // Market Orders 배치 처리 (더 빠른 처리)
      if (marketOrders.length > 0) {
        processingPromises.push(this.processMarketOrdersBatch(marketOrders));
      }
      
      // Limit Orders 배치 처리  
      if (limitOrders.length > 0) {
        processingPromises.push(this.processLimitOrdersBatch(limitOrders));
      }
      
      // 모든 배치 병렬 실행
      const batchResults = await Promise.all(processingPromises);
      
      // 결과 병합
      batchResults.forEach(batchResult => {
        results.push(...batchResult);
      });
      
      // HOOATS 메트릭스 업데이트
      this.updateHOOATSMetrics(orders, results);
      
      const processingTime = Date.now() - startTime;
      console.log(`⚡ Batch ${batchId} completed in ${processingTime}ms`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ Batch ${batchId} execution failed:`, error);
      throw error;
    }
  }

  /**
   * 📈 Market Orders 배치 처리
   */
  async processMarketOrdersBatch(marketOrders) {
    const results = [];
    
    // Market Orders는 즉시 실행 가능하므로 병렬 처리
    const processingPromises = marketOrders.map(async (order) => {
      try {
        const result = await this.processHybridOrder(order);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(processingPromises);
    return batchResults;
  }

  /**
   * 📊 Limit Orders 배치 처리
   */
  async processLimitOrdersBatch(limitOrders) {
    const results = [];
    
    // Limit Orders는 orderbook에 추가하므로 Redis batch 활용
    try {
      if (this.connectionPool) {
        // Redis Pipeline으로 배치 처리
        const redisOperations = limitOrders.map(order => ({
          command: 'zadd',
          args: [
            `orderbook:${order.pair}:${order.side}`,
            parseFloat(order.price),
            JSON.stringify({
              id: order.id,
              userId: order.userId,
              amount: order.amount,
              timestamp: Date.now()
            })
          ]
        }));
        
        const redisResults = await this.connectionPool.executeBatch(redisOperations);
        
        // 각 주문 결과 처리
        limitOrders.forEach((order, index) => {
          const redisResult = redisResults[index];
          if (redisResult[0] === null) { // Redis 성공
            results.push({
              success: true,
              data: {
                orderId: order.id,
                status: 'active',
                pair: order.pair,
                side: order.side,
                type: order.type,
                amount: order.amount,
                price: order.price,
                timestamp: Date.now()
              }
            });
          } else {
            results.push({
              success: false,
              error: 'Redis operation failed: ' + redisResult[0].message
            });
          }
        });
      } else {
        // Fallback: 순차 처리
        for (const order of limitOrders) {
          try {
            const result = await this.processHybridOrder(order);
            results.push({ success: true, data: result });
          } catch (error) {
            results.push({ success: false, error: error.message });
          }
        }
      }
    } catch (error) {
      console.error('❌ Limit orders batch processing failed:', error);
      throw error;
    }
    
    return results;
  }

  /**
   * 🎯 하이브리드 주문 처리 (Smart Router V2 활용)
   */
  async processHybridOrder(order) {
    if (!this.smartRouter) {
      throw new Error('Smart Router not initialized');
    }

    const routingResult = await this.smartRouter.processHybridOrder(order);
    
    // AsyncDBWriter에 결과 저장
    if (this.asyncDBWriter && routingResult.fills) {
      const filledAmount = parseFloat(routingResult.totalFilled);
      const status = filledAmount >= parseFloat(order.amount) * 0.99 ? 'filled' : 'partial';
      
      this.asyncDBWriter.queueOrderHistory({
        user_id: order.userId,
        pair: order.pair,
        side: order.side,
        order_type: order.type,
        price: order.type === 'limit' ? parseFloat(order.price) : 
               (routingResult.averagePrice ? parseFloat(routingResult.averagePrice) : null),
        amount: parseFloat(order.amount),
        filled_amount: filledAmount,
        status: status,
        redis_order_id: order.id
      });

      // Trade history 저장
      routingResult.fills.forEach((fill) => {
        this.asyncDBWriter.queueTradeHistory({
          id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          pair: order.pair,
          buyer_order_id: order.side === 'buy' ? order.id : (fill.source === 'AMM' ? 'amm' : null),
          seller_order_id: order.side === 'sell' ? order.id : (fill.source === 'AMM' ? 'amm' : null),
          price: parseFloat(fill.price),
          amount: parseFloat(fill.amount),
          side: order.side,
          source: fill.source || 'unknown',
          buyer_fee: 0,
          seller_fee: 0,
          price_impact: fill.priceImpact || null,
          amm_reserves_before: fill.ammReservesBefore || null,
          amm_reserves_after: fill.ammReservesAfter || null,
          redis_trade_id: fill.id || null
        });
      });
    }

    return {
      orderId: order.id,
      pair: order.pair,
      side: order.side,
      type: order.type,
      amount: order.amount,
      price: order.price,
      status: 'processed',
      timestamp: Date.now(),
      routing: routingResult,
      executionStats: routingResult.executionStats,
      fills: routingResult.fills,
      summary: {
        totalFilled: routingResult.totalFilled,
        averagePrice: routingResult.averagePrice,
        totalChunks: routingResult.executionStats?.totalChunks || 0,
        ammChunks: routingResult.executionStats?.ammChunks || 0,
        orderbookChunks: routingResult.executionStats?.orderbookChunks || 0
      }
    };
  }

  /**
   * 📊 HOOATS 메트릭스 업데이트
   */
  updateHOOATSMetrics(orders, results) {
    let totalVolume = 0;
    let ammCount = 0;
    let orderbookCount = 0;
    let hybridCount = 0;
    
    results.forEach((result, index) => {
      if (result.success && result.data) {
        const data = result.data;
        const amount = parseFloat(orders[index].amount);
        
        totalVolume += amount;
        
        // 실행 통계 분석
        if (data.summary) {
          if (data.summary.ammChunks > 0 && data.summary.orderbookChunks > 0) {
            hybridCount++;
          } else if (data.summary.ammChunks > 0) {
            ammCount++;
          } else {
            orderbookCount++;
          }
        }
      }
    });
    
    // 메트릭스 업데이트
    this.hooatsMetrics.ammOrders += ammCount;
    this.hooatsMetrics.orderbookOrders += orderbookCount;
    this.hooatsMetrics.hybridOrders += hybridCount;
    this.hooatsMetrics.totalVolume += totalVolume;
    
    const totalOrders = this.hooatsMetrics.ammOrders + this.hooatsMetrics.orderbookOrders + this.hooatsMetrics.hybridOrders;
    if (totalOrders > 0) {
      this.hooatsMetrics.avgOrderSize = this.hooatsMetrics.totalVolume / totalOrders;
    }
  }

  /**
   * 📈 HOOATS 메트릭스 반환
   */
  getHOOATSMetrics() {
    const baseMetrics = this.getMetrics();
    
    return {
      ...baseMetrics,
      hooats: {
        ...this.hooatsMetrics,
        avgOrderSize: Math.round(this.hooatsMetrics.avgOrderSize * 100) / 100,
        ammPercentage: this.hooatsMetrics.ammOrders > 0 ? 
          ((this.hooatsMetrics.ammOrders / (this.hooatsMetrics.ammOrders + this.hooatsMetrics.orderbookOrders + this.hooatsMetrics.hybridOrders)) * 100).toFixed(1) + '%' : '0%',
        orderbookPercentage: this.hooatsMetrics.orderbookOrders > 0 ?
          ((this.hooatsMetrics.orderbookOrders / (this.hooatsMetrics.ammOrders + this.hooatsMetrics.orderbookOrders + this.hooatsMetrics.hybridOrders)) * 100).toFixed(1) + '%' : '0%',
        hybridPercentage: this.hooatsMetrics.hybridOrders > 0 ?
          ((this.hooatsMetrics.hybridOrders / (this.hooatsMetrics.ammOrders + this.hooatsMetrics.orderbookOrders + this.hooatsMetrics.hybridOrders)) * 100).toFixed(1) + '%' : '0%'
      }
    };
  }

  /**
   * 📊 실시간 HOOATS 상태 출력
   */
  printHOOATSStatus() {
    const metrics = this.getHOOATSMetrics();
    console.log('\n🚀 HOOATS Batch Processor Status:');
    console.log(`   TPS: ${metrics.tps}`);
    console.log(`   Total Volume: ${metrics.hooats.totalVolume.toFixed(2)} USDC`);
    console.log(`   Avg Order Size: ${metrics.hooats.avgOrderSize} USDC`);
    console.log(`   AMM Orders: ${metrics.hooats.ammOrders} (${metrics.hooats.ammPercentage})`);
    console.log(`   Orderbook Orders: ${metrics.hooats.orderbookOrders} (${metrics.hooats.orderbookPercentage})`);
    console.log(`   Hybrid Orders: ${metrics.hooats.hybridOrders} (${metrics.hooats.hybridPercentage})`);
    console.log(`   Success Rate: ${metrics.successRate}`);
    console.log(`   Queue Size: ${metrics.currentQueueSize}`);
  }
}

// Singleton 인스턴스
let instance = null;

module.exports = {
  HOOATSBatchProcessor,
  getInstance: (options) => {
    if (!instance) {
      instance = new HOOATSBatchProcessor(options);
    }
    return instance;
  }
};