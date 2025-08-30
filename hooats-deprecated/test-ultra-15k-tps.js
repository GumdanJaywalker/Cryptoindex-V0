#!/usr/bin/env node

/**
 * 🎯 Ultra 15K+ TPS Test
 * Tests the new V3 Batch API with ultra-fast processing
 * Validates 15K+ TPS achievement through batch processing
 */

require('dotenv').config();

async function testUltra15kTps() {
  console.log('🎯 ULTRA 15K+ TPS TEST');
  console.log('======================');
  
  const results = {
    batches: [],
    totalOrders: 0,
    totalTime: 0,
    achievedTPS: 0,
    targetTPS: 15000,
    success: false
  };
  
  try {
    const API_BASE = 'http://localhost:3000';
    
    // Test different batch sizes to find optimal performance
    const batchSizes = [100, 500, 1000, 2000, 5000];
    
    console.log('\n🚀 Testing V3 Batch API Performance...\n');
    
    for (const batchSize of batchSizes) {
      console.log(`📦 Testing batch size: ${batchSize} orders`);
      
      const batchStartTime = Date.now();
      
      // Generate test orders
      const orders = [];
      for (let i = 0; i < batchSize; i++) {
        orders.push({
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: Math.random() > 0.7 ? 'market' : 'limit',
          amount: (Math.random() * 100 + 10).toFixed(2),
          price: Math.random() > 0.7 ? undefined : (1.0 + Math.random() * 0.5).toFixed(4),
          priority: Math.random() > 0.8 ? 'high' : 'normal'
        });
      }
      
      const batchRequest = {
        orders: orders,
        batchId: `ultra_test_${batchSize}_${Date.now()}`,
        async: true, // Ultra-fast async processing
        maxLatency: 10, // 10ms target latency
        requireConfirmation: false // Don't wait for blockchain confirmation
      };
      
      try {
        const response = await fetch(`${API_BASE}/api/trading/v3/batch-orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dev-token'
          },
          body: JSON.stringify(batchRequest)
        });
        
        const result = await response.json();
        const batchTime = Date.now() - batchStartTime;
        const batchTPS = Math.floor((batchSize * 1000) / batchTime);
        
        if (response.ok) {
          console.log(`✅ Batch ${batchSize}: ${result.successful}/${result.totalOrders} orders`);
          console.log(`   Time: ${batchTime}ms, TPS: ${batchTPS}, Latency: ${result.averageLatency}ms`);
          console.log(`   Settlement: ${result.results.filter(r => r.status === 'queued_for_settlement' || r.status === 'success').length} queued/completed`);
          
          results.batches.push({
            batchSize,
            successful: result.successful,
            failed: result.failed,
            time: batchTime,
            tps: batchTPS,
            latency: result.averageLatency,
            trades: result.totalTrades,
            settlementQueued: result.results.filter(r => r.status === 'queued_for_settlement').length
          });
          
          results.totalOrders += result.totalOrders;
          results.totalTime += batchTime;
          
        } else {
          console.log(`❌ Batch ${batchSize} failed: ${result.error || result.details || 'Unknown error'}`);
          
          results.batches.push({
            batchSize,
            successful: 0,
            failed: batchSize,
            time: batchTime,
            tps: 0,
            error: result.error || result.details
          });
        }
        
      } catch (error) {
        console.log(`❌ Batch ${batchSize} network error: ${error.message}`);
        
        results.batches.push({
          batchSize,
          successful: 0,
          failed: batchSize,
          time: Date.now() - batchStartTime,
          tps: 0,
          error: error.message
        });
      }
      
      // Brief pause between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Calculate overall performance
    const totalSuccessfulBatches = results.batches.filter(b => b.successful > 0).length;
    results.achievedTPS = results.totalTime > 0 ? Math.floor((results.totalOrders * 1000) / results.totalTime) : 0;
    results.success = results.achievedTPS >= results.targetTPS;
    
    // Performance Analysis
    console.log('\n📊 ULTRA PERFORMANCE ANALYSIS');
    console.log('=============================');
    
    console.log('\n📈 Batch Performance Summary:');
    console.table(results.batches.map(batch => ({
      'Batch Size': batch.batchSize,
      'Success Rate': `${Math.round((batch.successful / (batch.successful + batch.failed)) * 100)}%`,
      'Time (ms)': batch.time,
      'TPS': batch.tps,
      'Avg Latency': `${batch.latency || 0}ms`,
      'Trades': batch.trades || 0,
      'Queued': batch.settlementQueued || 0
    })));
    
    console.log('\n🎯 Overall Performance:');
    console.log(`   Total Orders Processed: ${results.totalOrders.toLocaleString()}`);
    console.log(`   Total Processing Time: ${results.totalTime.toLocaleString()}ms`);
    console.log(`   Achieved TPS: ${results.achievedTPS.toLocaleString()}`);
    console.log(`   Target TPS: ${results.targetTPS.toLocaleString()}`);
    console.log(`   Performance Ratio: ${((results.achievedTPS / results.targetTPS) * 100).toFixed(1)}%`);
    console.log(`   Successful Batches: ${totalSuccessfulBatches}/${results.batches.length}`);
    
    // Find optimal batch size
    const optimalBatch = results.batches
      .filter(b => b.successful > 0)
      .reduce((best, current) => current.tps > best.tps ? current : best, { tps: 0 });
    
    if (optimalBatch.tps > 0) {
      console.log(`\n🏆 Optimal Batch Size: ${optimalBatch.batchSize} orders`);
      console.log(`   Peak TPS: ${optimalBatch.tps.toLocaleString()}`);
      console.log(`   Latency: ${optimalBatch.latency}ms`);
      console.log(`   Success Rate: ${Math.round((optimalBatch.successful / (optimalBatch.successful + optimalBatch.failed)) * 100)}%`);
    }
    
    // Success determination
    if (results.success) {
      console.log(`\n🎉 SUCCESS: 15K+ TPS TARGET ACHIEVED!`);
      console.log(`✅ Achieved ${results.achievedTPS.toLocaleString()} TPS (${((results.achievedTPS / results.targetTPS) * 100).toFixed(1)}% of target)`);
    } else if (results.achievedTPS >= 10000) {
      console.log(`\n🎯 EXCELLENT: 10K+ TPS ACHIEVED!`);
      console.log(`⚡ Achieved ${results.achievedTPS.toLocaleString()} TPS (${((results.achievedTPS / results.targetTPS) * 100).toFixed(1)}% of 15K target)`);
      console.log(`🔧 Optimization needed to reach 15K+ TPS target`);
    } else if (results.achievedTPS >= 5000) {
      console.log(`\n⚡ GOOD: 5K+ TPS ACHIEVED!`);
      console.log(`📈 Achieved ${results.achievedTPS.toLocaleString()} TPS (${((results.achievedTPS / results.targetTPS) * 100).toFixed(1)}% of 15K target)`);
      console.log(`🔧 Significant optimization needed`);
    } else {
      console.log(`\n🔧 NEEDS OPTIMIZATION`);
      console.log(`📉 Achieved only ${results.achievedTPS.toLocaleString()} TPS (${((results.achievedTPS / results.targetTPS) * 100).toFixed(1)}% of 15K target)`);
      console.log(`❌ Major architectural changes required`);
    }
    
    // Architecture Analysis
    console.log('\n🏗️ ARCHITECTURE ANALYSIS');
    console.log('========================');
    
    const avgLatency = results.batches
      .filter(b => b.latency > 0)
      .reduce((sum, b) => sum + b.latency, 0) / results.batches.filter(b => b.latency > 0).length;
    
    const totalSettlementQueued = results.batches.reduce((sum, b) => sum + (b.settlementQueued || 0), 0);
    const totalTrades = results.batches.reduce((sum, b) => sum + (b.trades || 0), 0);
    
    console.log(`📊 System Metrics:`);
    console.log(`   Average Latency: ${avgLatency?.toFixed(1) || 'N/A'}ms`);
    console.log(`   Total Trades Generated: ${totalTrades.toLocaleString()}`);
    console.log(`   Async Settlements Queued: ${totalSettlementQueued.toLocaleString()}`);
    console.log(`   Settlement Ratio: ${totalSettlementQueued > 0 ? ((totalSettlementQueued / results.totalOrders) * 100).toFixed(1) : 0}%`);
    
    if (avgLatency < 10) {
      console.log(`✅ Latency Target Met: ${avgLatency.toFixed(1)}ms < 10ms target`);
    } else if (avgLatency < 50) {
      console.log(`⚠️  Latency Acceptable: ${avgLatency.toFixed(1)}ms < 50ms limit`);  
    } else {
      console.log(`❌ Latency Too High: ${avgLatency.toFixed(1)}ms > 50ms limit`);
    }
    
    // Recommendations
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS');
    console.log('===============================');
    
    if (results.achievedTPS < 5000) {
      console.log('🔧 Critical optimizations needed:');
      console.log('   1. Increase batch sizes (test 10K+ orders per batch)');
      console.log('   2. Optimize database write performance');
      console.log('   3. Implement connection pooling');
      console.log('   4. Add Redis cluster for hot data');
    } else if (results.achievedTPS < 15000) {
      console.log('⚡ Performance optimizations:');
      console.log('   1. Fine-tune batch size (current optimal: ' + optimalBatch.batchSize + ')');
      console.log('   2. Implement WebSocket streaming for real-time updates');
      console.log('   3. Optimize async settlement queue processing');
      console.log('   4. Add parallel processing for batch validation');
    } else {
      console.log('🎉 System is performing excellently!');
      console.log('   1. Monitor performance under sustained load');
      console.log('   2. Add advanced monitoring and alerting');
      console.log('   3. Prepare for production deployment');
      console.log('   4. Consider implementing auto-scaling');
    }
    
    console.log('\n🎯 ULTRA 15K+ TPS TEST COMPLETE!');
    
    return results;
    
  } catch (error) {
    console.error('\n❌ Ultra TPS test failed:', error.message);
    return { ...results, error: error.message };
  }
}

// Run the ultra TPS test
testUltra15kTps()
  .then(results => {
    console.log('\n📋 Test completed');
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });