/**
 * HOOATS Ultra 39K TPS 최고 성능 테스트
 * 이전에 달성한 39,062 TPS 재현 및 돌파 시도
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');

class Ultra39KTpsTest {
  constructor() {
    this.orderbook = null;
    this.isRunning = false;
    this.startTime = null;
    this.totalOrders = 0;
    this.orderCounter = 0;
    
    // Ultra-high performance 설정
    this.targetTPS = 39000; // 39K TPS 목표
    this.intervalMs = 1; // 1ms마다 실행 (극한 성능)
    this.ordersPerBatch = Math.ceil(this.targetTPS * this.intervalMs / 1000); // 배치당 39개
    this.testDurationMs = 120000; // 2분 테스트 (극한 부하)
    
    this.priceBase = 1.036;
    this.priceSpread = 0.01; // 더 큰 스프레드로 매칭 가능성 증가
    
    console.log(`🚀 HOOATS Ultra 39K TPS 테스트 설정:`);
    console.log(`   목표 TPS: ${this.targetTPS.toLocaleString()}`);
    console.log(`   배치 간격: ${this.intervalMs}ms (극한 성능)`);
    console.log(`   배치당 주문: ${this.ordersPerBatch}개`);
    console.log(`   테스트 시간: ${this.testDurationMs/1000}초`);
    console.log(`   예상 총 주문: ${((this.targetTPS * this.testDurationMs / 1000)).toLocaleString()}개`);
    console.log(`   이전 최고 기록: 39,062 TPS`);
  }

  generateUltraOrder() {
    this.orderCounter++;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const type = Math.random() > 0.1 ? 'limit' : 'market'; // 90% limit, 10% market
    
    let price = null;
    if (type === 'limit') {
      // 더 넓은 가격 범위로 매칭 확률 증가
      const priceOffset = (Math.random() - 0.5) * this.priceSpread;
      const sideOffset = side === 'buy' ? 
        -Math.random() * 0.005 : // Buy orders below market
        Math.random() * 0.005;   // Sell orders above market
      price = (this.priceBase + sideOffset + priceOffset).toFixed(6);
    }
    
    const amount = (Math.random() * 1000 + 10).toFixed(2); // 더 큰 주문량
    
    return {
      id: `ultra_${this.orderCounter}`,
      pair: 'HYPERINDEX-USDC',
      side,
      type,
      price,
      amount,
      userId: `ultra_user_${Math.floor(Math.random() * 5000)}`, // 더 많은 사용자
      timestamp: Date.now()
    };
  }

  async processUltraBatch() {
    const orders = [];
    for (let i = 0; i < this.ordersPerBatch; i++) {
      orders.push(this.generateUltraOrder());
    }
    
    try {
      // 극한 병렬 처리
      const batchStartTime = process.hrtime.bigint();
      const promises = orders.map(order => this.orderbook.addOrderUltra(order));
      await Promise.all(promises);
      const batchEndTime = process.hrtime.bigint();
      
      this.totalOrders += orders.length;
      
      const batchLatencyNs = Number(batchEndTime - batchStartTime);
      const batchLatencyMs = batchLatencyNs / 1000000;
      
      return { processed: orders.length, latency: batchLatencyMs };
    } catch (error) {
      console.error(`❌ Ultra 배치 처리 오류:`, error.message);
      return { processed: 0, latency: 999999 };
    }
  }

  async startUltraTesting() {
    console.log('\n🚀 HOOATS Ultra 39K TPS 테스트 시작!\n');
    console.log('⚠️  극한 성능 테스트 - 시스템 리소스 최대 사용');
    
    try {
      // Ultra-Performance Orderbook 초기화
      this.orderbook = UltraPerformanceOrderbook.getInstance();
      await new Promise(resolve => setTimeout(resolve, 5000)); // 충분한 초기화 시간
      
      console.log('🔥 Ultra-Performance 모드 활성화...');
      
      this.isRunning = true;
      this.startTime = Date.now();
      let lastReportTime = this.startTime;
      let lastOrderCount = 0;
      let maxTPS = 0;
      let totalLatency = 0;
      let batchCount = 0;
      
      const ultraInterval = setInterval(async () => {
        if (!this.isRunning) {
          clearInterval(ultraInterval);
          return;
        }
        
        const elapsed = Date.now() - this.startTime;
        
        // 2분 후 종료
        if (elapsed >= this.testDurationMs) {
          clearInterval(ultraInterval);
          await this.stopUltraTesting();
          return;
        }
        
        // Ultra 배치 처리
        const batchResult = await this.processUltraBatch();
        totalLatency += batchResult.latency;
        batchCount++;
        
        // 1초마다 상태 리포트 (고빈도)
        if (elapsed - (lastReportTime - this.startTime) >= 1000) {
          const currentTime = Date.now();
          const timeDiff = (currentTime - lastReportTime) / 1000;
          const ordersDiff = this.totalOrders - lastOrderCount;
          const currentTPS = (ordersDiff / timeDiff).toFixed(2);
          const avgTPS = (this.totalOrders / (elapsed / 1000)).toFixed(2);
          const avgLatency = batchCount > 0 ? (totalLatency / batchCount).toFixed(3) : '0.000';
          
          if (parseFloat(currentTPS) > maxTPS) {
            maxTPS = parseFloat(currentTPS);
          }
          
          const remainingTime = Math.ceil((this.testDurationMs - elapsed) / 1000);
          const progress = (elapsed / this.testDurationMs * 100).toFixed(1);
          
          console.log(`⚡ ${Math.floor(elapsed/1000)}s [${progress}%] | 순간TPS: ${currentTPS} | 평균TPS: ${avgTPS} | 최고TPS: ${maxTPS.toFixed(2)} | 총주문: ${this.totalOrders.toLocaleString()} | 지연: ${avgLatency}ms | 남은: ${remainingTime}s`);
          
          lastReportTime = currentTime;
          lastOrderCount = this.totalOrders;
        }
        
      }, this.intervalMs);
      
    } catch (error) {
      console.error('💥 Ultra 테스트 초기화 실패:', error);
      await this.stopUltraTesting();
    }
  }

  async stopUltraTesting() {
    console.log('\n🛑 Ultra 39K TPS 테스트 종료...\n');
    this.isRunning = false;
    
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    const finalTPS = (this.totalOrders / (totalTime / 1000)).toFixed(2);
    
    try {
      // 최종 메트릭스 수집
      const metrics = this.orderbook.getMetrics();
      const orderbookData = await this.orderbook.getOrderbookCached('HYPERINDEX-USDC', 20);
      
      console.log('🎯 Ultra 39K TPS 테스트 최종 결과:');
      console.log('=' .repeat(60));
      console.log(`⏱️  총 실행시간: ${(totalTime/1000).toFixed(1)}초`);
      console.log(`📦 총 처리 주문: ${this.totalOrders.toLocaleString()}개`);
      console.log(`⚡ 최종 평균 TPS: ${finalTPS}`);
      console.log(`🎯 목표 TPS: ${this.targetTPS.toLocaleString()} (달성률: ${((finalTPS/this.targetTPS)*100).toFixed(1)}%)`);
      console.log(`🏆 이전 최고 기록: 39,062 TPS`);
      
      if (parseFloat(finalTPS) > 39062) {
        console.log(`🎉 NEW RECORD! ${finalTPS} TPS로 이전 기록 갱신!`);
      } else if (parseFloat(finalTPS) > 35000) {
        console.log(`🔥 EXCELLENT! 35K+ TPS 달성!`);
      } else if (parseFloat(finalTPS) > 30000) {
        console.log(`✅ GREAT! 30K+ TPS 달성!`);
      } else if (parseFloat(finalTPS) > 20000) {
        console.log(`⚡ GOOD! 20K+ TPS 달성!`);
      } else {
        console.log(`📊 테스트 완료`);
      }
      
      console.log(`❌ 총 에러: ${metrics.errors}`);
      console.log(`📈 현재 Buy 주문: ${orderbookData.bids.length}개`);
      console.log(`📉 현재 Sell 주문: ${orderbookData.asks.length}개`);
      console.log(`⏱️  P50 지연시간: ${metrics.latency.p50.toFixed(3)}ms`);
      console.log(`⏱️  P95 지연시간: ${metrics.latency.p95.toFixed(3)}ms`);
      console.log(`⏱️  P99 지연시간: ${metrics.latency.p99.toFixed(3)}ms`);
      console.log('=' .repeat(60));
      
      console.log('\n🌐 모니터링에서 Ultra 성능 확인:');
      console.log('   http://localhost:3000/hooats-monitoring');
      console.log('   (새로고침하여 Ultra TPS 데이터 확인)');
      
      await this.orderbook.shutdown();
      
    } catch (error) {
      console.error('❌ 종료 처리 오류:', error);
    }
    
    console.log('\n🏁 HOOATS Ultra 39K TPS 테스트 완료!');
    process.exit(0);
  }
}

// 스크립트 실행
console.log('🔥🔥🔥 HOOATS ULTRA 39K TPS 최고 성능 도전! 🔥🔥🔥');
console.log('📊 실시간 모니터링: /hooats-monitoring\n');

const ultraTest = new Ultra39KTpsTest();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️ 사용자 중단 요청...');
  await ultraTest.stopUltraTesting();
});

// Ultra 테스트 시작
ultraTest.startUltraTesting().catch(error => {
  console.error('💥 Ultra 테스트 실행 오류:', error);
  process.exit(1);
});