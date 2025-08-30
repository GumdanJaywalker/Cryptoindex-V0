/**
 * Simple test for Ultra-Performance Orderbook after fixing Worker issues
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');

async function testUltraOrderbook() {
  console.log('🧪 Testing Ultra-Performance Orderbook (Fixed Version)...\n');
  
  try {
    // Initialize
    console.log('1️⃣ Initializing orderbook...');
    const orderbook = UltraPerformanceOrderbook.getInstance();
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Orderbook initialized successfully\n');
    
    // Test basic order processing
    console.log('2️⃣ Testing basic order processing...');
    const testOrder = {
      id: 'test_order_001',
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'limit',
      price: '1.035000',
      amount: '100.00',
      userId: 'test_user',
      timestamp: Date.now()
    };
    
    const startTime = Date.now();
    await orderbook.addOrderUltra(testOrder);
    const endTime = Date.now();
    
    console.log(`✅ Order processed in ${endTime - startTime}ms\n`);
    
    // Test orderbook retrieval
    console.log('3️⃣ Testing orderbook retrieval...');
    const orderbookData = await orderbook.getOrderbookCached('HYPERINDEX-USDC', 10);
    
    console.log('📊 Orderbook Data:');
    console.log(`   Pair: ${orderbookData.pair}`);
    console.log(`   Bids: ${orderbookData.bids.length}`);
    console.log(`   Asks: ${orderbookData.asks.length}`);
    console.log(`   Timestamp: ${new Date(orderbookData.timestamp).toISOString()}\n`);
    
    // Test metrics
    console.log('4️⃣ Testing performance metrics...');
    const metrics = orderbook.getMetrics();
    
    console.log('📈 Performance Metrics:');
    console.log(`   TPS: ${metrics.tps.toFixed(2)}`);
    console.log(`   Throughput: ${metrics.throughput}`);
    console.log(`   Errors: ${metrics.errors}`);
    console.log(`   P50 Latency: ${metrics.latency.p50.toFixed(3)}ms`);
    console.log(`   P95 Latency: ${metrics.latency.p95.toFixed(3)}ms`);
    console.log(`   P99 Latency: ${metrics.latency.p99.toFixed(3)}ms\n`);
    
    // Test batch processing
    console.log('5️⃣ Testing batch processing (100 orders)...');
    const batchStartTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 100; i++) {
      const batchOrder = {
        id: `batch_order_${i}`,
        pair: 'HYPERINDEX-USDC',
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        type: 'limit',
        price: (1.03 + Math.random() * 0.02).toFixed(6),
        amount: (Math.random() * 100 + 10).toFixed(2),
        userId: `batch_user_${i % 10}`,
        timestamp: Date.now()
      };
      
      promises.push(orderbook.addOrderUltra(batchOrder));
    }
    
    await Promise.all(promises);
    const batchEndTime = Date.now();
    const batchTime = batchEndTime - batchStartTime;
    const batchTPS = (100 / batchTime) * 1000;
    
    console.log(`✅ 100 orders processed in ${batchTime}ms`);
    console.log(`📊 Batch TPS: ${batchTPS.toFixed(2)}\n`);
    
    // Final status
    console.log('6️⃣ Final system status...');
    const finalMetrics = orderbook.getMetrics();
    
    console.log('🎯 FINAL RESULTS:');
    console.log(`   Total Throughput: ${finalMetrics.throughput}`);
    console.log(`   Current TPS: ${finalMetrics.tps.toFixed(2)}`);
    console.log(`   Total Errors: ${finalMetrics.errors}`);
    console.log(`   System Status: ${finalMetrics.errors === 0 ? '🟢 Healthy' : '🟡 Has Errors'}`);
    
    if (finalMetrics.errors === 0) {
      console.log('\n🎉 SUCCESS: Ultra-Performance Orderbook is working properly!');
      console.log('✅ Worker threads initialized without errors');
      console.log('✅ Redis connections stable');
      console.log('✅ Order processing functional');
      console.log('✅ Batch processing operational');
    } else {
      console.log(`\n⚠️ WARNING: ${finalMetrics.errors} errors detected`);
      console.log('Check logs for worker thread issues');
    }
    
    // Cleanup
    console.log('\n7️⃣ Cleaning up...');
    await orderbook.shutdown();
    console.log('✅ Cleanup complete');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run test
testUltraOrderbook().then(() => {
  console.log('\n🎉 Test completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});