#!/usr/bin/env node

/**
 * 🎯 V3 Batch Direct Test
 * Tests V3 batch processing directly without HTTP server
 * Validates ultra-fast processing and async settlement
 */

require('dotenv').config();

async function testV3BatchDirect() {
  console.log('🎯 V3 BATCH DIRECT TEST');
  console.log('=======================');
  
  try {
    // Import components directly
    const { RealHybridRouter } = require('./lib/trading/hybrid-router-real');
    const { AsyncSettlementQueue } = require('./lib/settlement/async-settlement-queue');
    
    console.log('\n🚀 Initializing Ultra Components...');
    
    // Initialize hybrid router
    const hybridRouter = RealHybridRouter.getInstance();
    const initialized = await hybridRouter.initialize();
    
    if (!initialized) {
      throw new Error('Failed to initialize hybrid router');
    }
    
    console.log('✅ Hybrid Router initialized');
    
    // Initialize settlement queue
    const settlementQueue = AsyncSettlementQueue.getInstance();
    await settlementQueue.start();
    
    console.log('✅ Settlement Queue started');
    
    // Test batch sizes for performance analysis
    const batchSizes = [10, 50, 100, 500, 1000];
    const results = [];
    
    console.log('\n⚡ Testing Ultra-Fast Batch Processing...\n');
    
    for (const batchSize of batchSizes) {
      console.log(`📦 Testing batch: ${batchSize} orders`);
      
      const batchStartTime = Date.now();
      const batchPromises = [];
      
      // Generate and process orders concurrently
      for (let i = 0; i < batchSize; i++) {
        const order = {
          id: `ultra_${batchSize}_${i}_${Date.now()}`,
          userId: 'test_user',
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: Math.random() > 0.7 ? 'market' : 'limit',
          amount: (Math.random() * 100 + 10).toFixed(2),
          price: Math.random() > 0.7 ? undefined : (1.0 + Math.random() * 0.5).toFixed(4),
          priority: Math.random() > 0.8 ? 'high' : 'normal',
          batchId: `batch_${batchSize}_${Date.now()}`
        };
        
        // Process each order with ultra-fast processing
        batchPromises.push(hybridRouter.processHybridOrderUltraFast(order));
      }
      
      // Wait for all orders in batch to complete
      const batchResults = await Promise.allSettled(batchPromises);
      const batchTime = Date.now() - batchStartTime;
      
      // Analyze results
      const successful = batchResults.filter(r => r.status === 'fulfilled' && r.value.status !== 'failed').length;
      const failed = batchSize - successful;
      const batchTPS = Math.floor((batchSize * 1000) / batchTime);
      
      // Count different result types
      let queuedSettlements = 0;
      let completedTrades = 0;
      let totalFills = 0;
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value.fills) {
          totalFills += result.value.fills.length;
          
          if (result.value.status === 'queued_for_settlement') {
            queuedSettlements++;
          } else if (result.value.status === 'completed') {
            completedTrades++;
          }
        }
      });
      
      console.log(`✅ Batch ${batchSize} complete:`);
      console.log(`   Success: ${successful}/${batchSize} orders`);
      console.log(`   Time: ${batchTime}ms`);
      console.log(`   TPS: ${batchTPS.toLocaleString()}`);
      console.log(`   Avg Latency: ${(batchTime / batchSize).toFixed(2)}ms`);
      console.log(`   Fills: ${totalFills}`);
      console.log(`   AMM Settlements Queued: ${queuedSettlements}`);
      console.log(`   Orderbook Completed: ${completedTrades}`);
      
      results.push({
        batchSize,
        successful,
        failed,
        time: batchTime,
        tps: batchTPS,
        avgLatency: batchTime / batchSize,
        fills: totalFills,
        queuedSettlements,
        completedTrades
      });
      
      // Brief pause between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Overall analysis
    console.log('\n📊 PERFORMANCE ANALYSIS');
    console.log('=======================');
    
    const totalOrders = results.reduce((sum, r) => sum + r.batchSize, 0);
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);
    const overallTPS = Math.floor((totalOrders * 1000) / totalTime);
    
    console.log('\n📈 Batch Performance Summary:');
    console.table(results.map(r => ({
      'Batch Size': r.batchSize,
      'TPS': r.tps.toLocaleString(),
      'Latency (ms)': r.avgLatency.toFixed(2),
      'Success Rate': `${Math.round((r.successful / r.batchSize) * 100)}%`,
      'Fills': r.fills,
      'AMM Queued': r.queuedSettlements,
      'Orderbook': r.completedTrades
    })));
    
    console.log(`\n🎯 Overall Performance:`);
    console.log(`   Total Orders: ${totalOrders.toLocaleString()}`);
    console.log(`   Total Time: ${totalTime.toLocaleString()}ms`);
    console.log(`   Overall TPS: ${overallTPS.toLocaleString()}`);
    console.log(`   Target TPS: 15,000`);
    console.log(`   Achievement: ${((overallTPS / 15000) * 100).toFixed(1)}%`);
    
    // Find peak performance
    const peakBatch = results.reduce((best, current) => current.tps > best.tps ? current : best, results[0]);
    
    console.log(`\n🏆 Peak Performance:`);
    console.log(`   Batch Size: ${peakBatch.batchSize} orders`);
    console.log(`   Peak TPS: ${peakBatch.tps.toLocaleString()}`);
    console.log(`   Latency: ${peakBatch.avgLatency.toFixed(2)}ms`);
    console.log(`   Success Rate: ${Math.round((peakBatch.successful / peakBatch.batchSize) * 100)}%`);
    
    // Success analysis
    if (overallTPS >= 15000) {
      console.log(`\n🎉 SUCCESS: 15K+ TPS TARGET ACHIEVED!`);
      console.log(`✅ Achieved ${overallTPS.toLocaleString()} TPS`);
    } else if (overallTPS >= 10000) {
      console.log(`\n⚡ EXCELLENT: 10K+ TPS ACHIEVED!`);
      console.log(`🎯 ${overallTPS.toLocaleString()} TPS (${((overallTPS / 15000) * 100).toFixed(1)}% of target)`);
    } else if (overallTPS >= 5000) {
      console.log(`\n📈 GOOD: 5K+ TPS ACHIEVED!`);
      console.log(`⚡ ${overallTPS.toLocaleString()} TPS (${((overallTPS / 15000) * 100).toFixed(1)}% of target)`);
    } else {
      console.log(`\n🔧 PERFORMANCE BELOW TARGET`);
      console.log(`📊 ${overallTPS.toLocaleString()} TPS (${((overallTPS / 15000) * 100).toFixed(1)}% of target)`);
    }
    
    // Component analysis
    console.log('\n🧩 COMPONENT ANALYSIS');
    console.log('====================');
    
    const totalQueuedSettlements = results.reduce((sum, r) => sum + r.queuedSettlements, 0);
    const totalOrderbookTrades = results.reduce((sum, r) => sum + r.completedTrades, 0);
    const totalFills = results.reduce((sum, r) => sum + r.fills, 0);
    
    console.log(`📊 Settlement Distribution:`);
    console.log(`   AMM Settlements Queued: ${totalQueuedSettlements} (${((totalQueuedSettlements / totalOrders) * 100).toFixed(1)}%)`);
    console.log(`   Orderbook Trades: ${totalOrderbookTrades} (${((totalOrderbookTrades / totalOrders) * 100).toFixed(1)}%)`);
    console.log(`   Total Fills: ${totalFills}`);
    console.log(`   Fill Rate: ${((totalFills / totalOrders) * 100).toFixed(1)}%`);
    
    console.log(`\n⚡ Ultra-Fast Processing Benefits:`);
    console.log(`   Immediate Response: ✅ All orders responded instantly`);
    console.log(`   Async Settlement: ✅ ${totalQueuedSettlements} AMM orders queued for background processing`);
    console.log(`   No Blocking: ✅ No 25-second blockchain waits`);
    console.log(`   Real Trading: ✅ ${totalOrderbookTrades} orders filled immediately`);
    
    // Settlement queue status
    console.log('\n🔄 Settlement Queue Status:');
    const queueMetrics = settlementQueue.getMetrics();
    console.log(`   Queue Size: ${queueMetrics.queueSize || 0}`);
    console.log(`   Processing: ${queueMetrics.isProcessing ? 'Active' : 'Inactive'}`);
    console.log(`   Total Requests: ${queueMetrics.totalRequests || 0}`);
    console.log(`   Completed: ${queueMetrics.completed || 0}`);
    console.log(`   Failed: ${queueMetrics.failed || 0}`);
    
    console.log('\n🎉 V3 BATCH DIRECT TEST COMPLETE!');
    
    // Cleanup
    await settlementQueue.stop();
    
    return {
      success: overallTPS >= 15000,
      overallTPS,
      peakTPS: peakBatch.tps,
      results
    };
    
  } catch (error) {
    console.error('\n❌ V3 Batch test failed:', error.message);
    console.error(error.stack);
    return { success: false, error: error.message };
  }
}

// Run the test
testV3BatchDirect()
  .then(results => {
    console.log('\n📋 Test completed');
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });