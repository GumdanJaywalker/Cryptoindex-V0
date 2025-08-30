/**
 * HOOATS 10분 지속적 TPS 스트림 테스트
 * 실제 거래소와 같은 연속적인 주문 처리 시뮬레이션
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');

class HooatsStreamingTest {
  constructor() {
    this.orderbook = null;
    this.isRunning = false;
    this.startTime = null;
    this.totalOrders = 0;
    this.orderCounter = 0;
    this.targetTPS = 1000; // 목표 TPS
    this.intervalMs = 10; // 10ms마다 실행
    this.ordersPerBatch = Math.ceil(this.targetTPS * this.intervalMs / 1000); // 배치당 주문 수
    
    this.priceBase = 1.036;
    this.priceSpread = 0.002;
    
    console.log(`🎯 10분 스트림 테스트 설정:`);
    console.log(`   목표 TPS: ${this.targetTPS}`);
    console.log(`   배치 간격: ${this.intervalMs}ms`);
    console.log(`   배치당 주문: ${this.ordersPerBatch}개`);
    console.log(`   예상 총 주문: ${this.targetTPS * 600}개 (10분)`);
  }

  generateRealisticOrder() {
    this.orderCounter++;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const type = Math.random() > 0.2 ? 'limit' : 'market';
    
    let price = null;
    if (type === 'limit') {
      const priceOffset = (Math.random() - 0.5) * this.priceSpread;
      const sideOffset = side === 'buy' ? -0.001 : 0.001;
      price = (this.priceBase + sideOffset + priceOffset).toFixed(6);
    }
    
    const amount = (Math.random() * 500 + 50).toFixed(2);
    
    return {
      id: `stream_${this.orderCounter}`,
      pair: 'HYPERINDEX-USDC',
      side,
      type,
      price,
      amount,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now()
    };
  }

  async processBatchOrders() {
    const orders = [];
    for (let i = 0; i < this.ordersPerBatch; i++) {
      orders.push(this.generateRealisticOrder());
    }
    
    try {
      // 배치로 주문 처리
      const promises = orders.map(order => this.orderbook.addOrderUltra(order));
      await Promise.all(promises);
      this.totalOrders += orders.length;
      
      return orders.length;
    } catch (error) {
      console.error(`❌ 배치 처리 오류:`, error.message);
      return 0;
    }
  }

  async startStreaming() {
    console.log('\n🚀 HOOATS 10분 스트림 테스트 시작!\n');
    
    try {
      // Ultra-Performance Orderbook 초기화
      this.orderbook = UltraPerformanceOrderbook.getInstance();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      this.isRunning = true;
      this.startTime = Date.now();
      
      const streamInterval = setInterval(async () => {
        if (!this.isRunning) {
          clearInterval(streamInterval);
          return;
        }
        
        const elapsed = Date.now() - this.startTime;
        
        // 10분 (600초) 후 종료
        if (elapsed >= 600000) {
          clearInterval(streamInterval);
          await this.stopStreaming();
          return;
        }
        
        // 배치 주문 처리
        const processedCount = await this.processBatchOrders();
        
        // 10초마다 상태 리포트
        if (Math.floor(elapsed / 10000) > Math.floor((elapsed - this.intervalMs) / 10000)) {
          const currentTPS = (this.totalOrders / (elapsed / 1000)).toFixed(2);
          const metrics = this.orderbook.getMetrics();
          const remainingTime = Math.ceil((600000 - elapsed) / 1000);
          
          console.log(`⚡ ${Math.floor(elapsed/1000)}s | TPS: ${currentTPS} | 총주문: ${this.totalOrders} | 남은시간: ${remainingTime}s | 에러: ${metrics.errors}`);
        }
        
      }, this.intervalMs);
      
    } catch (error) {
      console.error('💥 스트림 테스트 초기화 실패:', error);
      await this.stopStreaming();
    }
  }

  async stopStreaming() {
    console.log('\n🛑 스트림 테스트 종료...\n');
    this.isRunning = false;
    
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    const finalTPS = (this.totalOrders / (totalTime / 1000)).toFixed(2);
    
    try {
      // 최종 메트릭스 수집
      const metrics = this.orderbook.getMetrics();
      const orderbookData = await this.orderbook.getOrderbookCached('HYPERINDEX-USDC', 10);
      
      console.log('🎯 최종 스트림 테스트 결과:');
      console.log('=' .repeat(50));
      console.log(`⏱️  총 실행시간: ${(totalTime/1000).toFixed(1)}초`);
      console.log(`📦 총 처리 주문: ${this.totalOrders.toLocaleString()}개`);
      console.log(`⚡ 평균 TPS: ${finalTPS}`);
      console.log(`🎯 목표 TPS: ${this.targetTPS} (달성률: ${((finalTPS/this.targetTPS)*100).toFixed(1)}%)`);
      console.log(`❌ 총 에러: ${metrics.errors}`);
      console.log(`📈 현재 Buy 주문: ${orderbookData.bids.length}개`);
      console.log(`📉 현재 Sell 주문: ${orderbookData.asks.length}개`);
      console.log(`⏱️  P50 지연시간: ${metrics.latency.p50.toFixed(2)}ms`);
      console.log(`⏱️  P95 지연시간: ${metrics.latency.p95.toFixed(2)}ms`);
      console.log(`⏱️  P99 지연시간: ${metrics.latency.p99.toFixed(2)}ms`);
      console.log('=' .repeat(50));
      
      if (finalTPS >= this.targetTPS * 0.8) {
        console.log('🎉 성공! 목표 TPS의 80% 이상 달성');
      } else if (finalTPS >= this.targetTPS * 0.5) {
        console.log('⚠️ 부분 성공! 목표 TPS의 50% 이상 달성');  
      } else {
        console.log('❌ 목표 TPS 미달성');
      }
      
      console.log('\n🌐 실시간 모니터링 확인:');
      console.log('   http://localhost:3000/hooats-monitoring');
      console.log('   (새로고침하여 최신 데이터 확인)');
      
      await this.orderbook.shutdown();
      
    } catch (error) {
      console.error('❌ 종료 처리 오류:', error);
    }
    
    console.log('\n✅ HOOATS 10분 스트림 테스트 완료!');
    process.exit(0);
  }
}

// 스크립트 실행
console.log('🔥 HOOATS 10분 지속적 TPS 스트림 테스트');
console.log('📊 모니터링 페이지에서 실시간 확인 가능: /hooats-monitoring\n');

const streamTest = new HooatsStreamingTest();

// Graceful shutdown on Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n⚠️ 사용자 중단 요청...');
  await streamTest.stopStreaming();
});

// 테스트 시작
streamTest.startStreaming().catch(error => {
  console.error('💥 스트림 테스트 실행 오류:', error);
  process.exit(1);
});