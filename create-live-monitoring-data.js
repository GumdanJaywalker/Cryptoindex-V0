/**
 * 모니터링 페이지용 실제 데이터 생성 스크립트
 * 실제 주문, 거래, TPS 데이터를 생성하여 /hooats-monitoring 에서 확인 가능
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');

async function createLiveMonitoringData() {
  console.log('🎯 모니터링용 실제 데이터 생성 시작...');
  console.log('📊 이 데이터들이 /hooats-monitoring 페이지에 표시됩니다\n');
  
  try {
    const orderbook = UltraPerformanceOrderbook.getInstance();
    await new Promise(resolve => setTimeout(resolve, 3000)); // 초기화 대기
    
    console.log('1️⃣ 실제 Buy 주문 생성...');
    const buyOrders = [
      { id: 'monitor_buy_1', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'limit', price: '1.035000', amount: '150.75', userId: 'trader_1' },
      { id: 'monitor_buy_2', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'limit', price: '1.034500', amount: '300.50', userId: 'trader_2' },
      { id: 'monitor_buy_3', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'limit', price: '1.034000', amount: '500.25', userId: 'trader_3' },
      { id: 'monitor_buy_4', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'limit', price: '1.033500', amount: '750.00', userId: 'trader_4' },
      { id: 'monitor_buy_5', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'limit', price: '1.033000', amount: '1000.00', userId: 'trader_5' }
    ];
    
    for (const order of buyOrders) {
      const result = await orderbook.addOrderUltra(order);
      console.log(`  ✅ ${order.id}: ${order.side} ${order.amount} @ ${order.price} - ${result ? 'processed' : 'added'}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // 0.1초 간격
    }
    
    console.log('\n2️⃣ 실제 Sell 주문 생성...');
    const sellOrders = [
      { id: 'monitor_sell_1', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.036000', amount: '200.75', userId: 'trader_6' },
      { id: 'monitor_sell_2', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.036500', amount: '400.00', userId: 'trader_7' },
      { id: 'monitor_sell_3', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.037000', amount: '300.50', userId: 'trader_8' },
      { id: 'monitor_sell_4', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.037500', amount: '600.25', userId: 'trader_9' },
      { id: 'monitor_sell_5', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.038000', amount: '800.00', userId: 'trader_10' }
    ];
    
    for (const order of sellOrders) {
      const result = await orderbook.addOrderUltra(order);
      console.log(`  ✅ ${order.id}: ${order.side} ${order.amount} @ ${order.price} - ${result ? 'processed' : 'added'}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // 0.1초 간격
    }
    
    console.log('\n3️⃣ Market 주문으로 실제 거래 생성...');
    const marketOrders = [
      { id: 'monitor_market_1', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'market', amount: '100.00', userId: 'market_trader_1' },
      { id: 'monitor_market_2', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'market', amount: '150.00', userId: 'market_trader_2' },
      { id: 'monitor_market_3', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'market', amount: '200.00', userId: 'market_trader_3' },
      { id: 'monitor_market_4', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'market', amount: '180.00', userId: 'market_trader_4' },
      { id: 'monitor_market_5', pair: 'HYPERINDEX-USDC', side: 'buy', type: 'market', amount: '250.00', userId: 'market_trader_5' }
    ];
    
    for (const order of marketOrders) {
      const result = await orderbook.addOrderUltra(order);
      console.log(`  💰 ${order.id}: ${order.side} ${order.amount} - ${result && result.matched ? '✅ 체결됨' : '⏳ 처리됨'}`);
      await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 간격
    }
    
    console.log('\n4️⃣ 추가 대량 주문으로 TPS 성능 시연...');
    const batchOrders = [];
    for (let i = 1; i <= 50; i++) {
      const side = i % 2 === 0 ? 'buy' : 'sell';
      const basePrice = side === 'buy' ? 1.034 : 1.036;
      const priceOffset = (Math.random() - 0.5) * 0.002;
      
      batchOrders.push({
        id: `batch_${i}`,
        pair: 'HYPERINDEX-USDC',
        side,
        type: 'limit',
        price: (basePrice + priceOffset).toFixed(6),
        amount: (Math.random() * 300 + 50).toFixed(2),
        userId: `batch_user_${i}`
      });
    }
    
    const batchStartTime = Date.now();
    const batchPromises = batchOrders.map(order => orderbook.addOrderUltra(order));
    await Promise.all(batchPromises);
    const batchEndTime = Date.now();
    const batchTime = batchEndTime - batchStartTime;
    const calculatedTPS = (50 / batchTime) * 1000;
    
    console.log(`  ⚡ 50개 주문 배치 처리 완료: ${batchTime}ms → ${calculatedTPS.toFixed(2)} TPS`);
    
    // 최종 상태 확인
    console.log('\n📊 최종 오더북 및 시스템 상태:');
    const finalOrderbook = await orderbook.getOrderbookCached('HYPERINDEX-USDC', 10);
    const finalMetrics = orderbook.getMetrics();
    
    console.log(`   📈 Buy 주문: ${finalOrderbook.bids.length}개`);
    console.log(`   📉 Sell 주문: ${finalOrderbook.asks.length}개`);
    console.log(`   ⚡ 현재 TPS: ${finalMetrics.tps}`);
    console.log(`   📦 총 처리량: ${finalMetrics.throughput}`);
    console.log(`   ❌ 에러 수: ${finalMetrics.errors}`);
    console.log(`   ⏱️  P95 지연시간: ${finalMetrics.latency.p95.toFixed(2)}ms`);
    
    console.log('\n🎉 모니터링 데이터 생성 완료!');
    console.log('🌐 이제 다음 URL에서 실제 데이터를 확인하세요:');
    console.log('   http://localhost:3000/hooats-monitoring');
    console.log('');
    console.log('💡 새로고침(F5)하면 실시간 업데이트 확인 가능');
    console.log('⚡ TPS, Active Orders, Recent Trades 모두 실제 데이터로 표시됩니다');
    
    // 5초 후 종료 (모니터링 확인 시간 제공)
    console.log('\n⏰ 5초 후 자동 종료됩니다...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await orderbook.shutdown();
    console.log('✅ 정상 종료되었습니다.');
    
  } catch (error) {
    console.error('❌ 모니터링 데이터 생성 실패:', error);
    console.error('Error details:', error.stack);
  }
}

// 스크립트 실행
createLiveMonitoringData().then(() => {
  console.log('🏁 스크립트 실행 완료');
  process.exit(0);
}).catch(error => {
  console.error('💥 스크립트 실행 중 오류:', error);
  process.exit(1);
});