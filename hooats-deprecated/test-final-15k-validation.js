#!/usr/bin/env node

/**
 * 🎯 Final 15K+ TPS Validation Test
 * Comprehensive test of the complete HOOATS ultra-performance system
 * Validates all optimization components and 15K+ TPS target achievement
 */

require('dotenv').config();

async function validateFinal15kTPS() {
  console.log('🎯 FINAL 15K+ TPS VALIDATION TEST');
  console.log('=================================');
  console.log('Testing complete HOOATS ultra-performance system\n');

  const results = {
    phases: [],
    overallTPS: 0,
    peakTPS: 0,
    systemHealth: 'unknown',
    targetAchievement: 0,
    recommendations: [],
    success: false
  };

  try {
    // Phase 1: System Initialization
    console.log('📋 Phase 1: Ultra System Initialization');
    console.log('======================================');
    
    const phase1Start = Date.now();
    let phase1Success = true;
    const phase1Logs = [];
    
    try {
      // Initialize all ultra components
      console.log('🚀 Initializing ultra components...');
      
      const { RealHybridRouter } = require('./lib/trading/hybrid-router-real');
      const { AsyncSettlementQueue } = require('./lib/settlement/async-settlement-queue');
      
      console.log('  ✅ Components loaded');
      
      // Initialize hybrid router
      const hybridRouter = RealHybridRouter.getInstance();
      const routerInitialized = await hybridRouter.initialize();
      
      if (routerInitialized) {
        console.log('  ✅ Hybrid Router initialized');
        phase1Logs.push('Hybrid Router: ✅ Operational');
      } else {
        console.log('  ❌ Hybrid Router initialization failed');
        phase1Logs.push('Hybrid Router: ❌ Failed');
        phase1Success = false;
      }
      
      // Initialize settlement queue
      const settlementQueue = AsyncSettlementQueue.getInstance();
      await settlementQueue.start();
      console.log('  ✅ Settlement Queue started');
      phase1Logs.push('Settlement Queue: ✅ Active');
      
      console.log('  ✅ All components operational\n');
      
    } catch (error) {
      console.log(`  ❌ Initialization error: ${error.message}`);
      phase1Success = false;
      phase1Logs.push(`Initialization Error: ${error.message}`);
    }
    
    const phase1Time = Date.now() - phase1Start;
    results.phases.push({
      phase: 'System Initialization',
      success: phase1Success,
      time: phase1Time,
      details: phase1Logs,
      tps: 0
    });

    // Phase 2: Component Performance Testing
    console.log('📋 Phase 2: Component Performance Testing');
    console.log('========================================');
    
    const phase2Start = Date.now();
    const componentTests = [];
    
    if (phase1Success) {
      // Test 1: Small batch processing
      console.log('🔬 Test 1: Small Batch Processing (100 orders)');
      const batch100Start = Date.now();
      const batch100Orders = [];
      
      for (let i = 0; i < 100; i++) {
        batch100Orders.push({
          id: `test_100_${i}`,
          userId: 'validation_user',
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: 'limit',
          amount: (50 + Math.random() * 50).toFixed(2),
          price: (1.0 + Math.random() * 0.2).toFixed(4),
          priority: 'normal'
        });
      }
      
      let batch100Success = 0;
      let batch100Failed = 0;
      
      try {
        const batch100Promises = batch100Orders.map(async (order) => {
          try {
            const result = await hybridRouter.processHybridOrderUltraFast(order);
            return result.status !== 'failed' ? 'success' : 'failed';
          } catch (error) {
            return 'failed';
          }
        });
        
        const batch100Results = await Promise.allSettled(batch100Promises);
        batch100Success = batch100Results.filter(r => r.status === 'fulfilled' && r.value === 'success').length;
        batch100Failed = 100 - batch100Success;
        
        const batch100Time = Date.now() - batch100Start;
        const batch100TPS = Math.floor((100 * 1000) / batch100Time);
        
        console.log(`  ✅ 100-order batch: ${batch100Success} successful, ${batch100TPS} TPS`);
        componentTests.push({ test: '100-order batch', tps: batch100TPS, success: batch100Success, failed: batch100Failed });
        
      } catch (error) {
        console.log(`  ❌ 100-order batch failed: ${error.message}`);
        componentTests.push({ test: '100-order batch', tps: 0, success: 0, failed: 100, error: error.message });
      }

      // Test 2: Medium batch processing
      console.log('🔬 Test 2: Medium Batch Processing (500 orders)');
      const batch500Start = Date.now();
      const batch500Orders = [];
      
      for (let i = 0; i < 500; i++) {
        batch500Orders.push({
          id: `test_500_${i}`,
          userId: 'validation_user',
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: Math.random() > 0.3 ? 'limit' : 'market',
          amount: (10 + Math.random() * 90).toFixed(2),
          price: Math.random() > 0.3 ? (1.0 + Math.random() * 0.3).toFixed(4) : undefined,
          priority: Math.random() > 0.7 ? 'high' : 'normal'
        });
      }
      
      let batch500Success = 0;
      let batch500Failed = 0;
      
      try {
        const batch500Promises = batch500Orders.map(async (order) => {
          try {
            const result = await hybridRouter.processHybridOrderUltraFast(order);
            return result.status !== 'failed' ? 'success' : 'failed';
          } catch (error) {
            return 'failed';
          }
        });
        
        const batch500Results = await Promise.allSettled(batch500Promises);
        batch500Success = batch500Results.filter(r => r.status === 'fulfilled' && r.value === 'success').length;
        batch500Failed = 500 - batch500Success;
        
        const batch500Time = Date.now() - batch500Start;
        const batch500TPS = Math.floor((500 * 1000) / batch500Time);
        
        console.log(`  ✅ 500-order batch: ${batch500Success} successful, ${batch500TPS} TPS`);
        componentTests.push({ test: '500-order batch', tps: batch500TPS, success: batch500Success, failed: batch500Failed });
        
      } catch (error) {
        console.log(`  ❌ 500-order batch failed: ${error.message}`);
        componentTests.push({ test: '500-order batch', tps: 0, success: 0, failed: 500, error: error.message });
      }

      // Test 3: Large batch processing
      console.log('🔬 Test 3: Large Batch Processing (1000 orders)');
      const batch1000Start = Date.now();
      const batch1000Orders = [];
      
      for (let i = 0; i < 1000; i++) {
        batch1000Orders.push({
          id: `test_1000_${i}`,
          userId: 'validation_user',
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: Math.random() > 0.2 ? 'limit' : 'market',
          amount: (5 + Math.random() * 95).toFixed(2),
          price: Math.random() > 0.2 ? (1.0 + Math.random() * 0.4).toFixed(4) : undefined,
          priority: Math.random() > 0.8 ? 'urgent' : (Math.random() > 0.5 ? 'high' : 'normal')
        });
      }
      
      let batch1000Success = 0;
      let batch1000Failed = 0;
      
      try {
        const batch1000Promises = batch1000Orders.map(async (order) => {
          try {
            const result = await hybridRouter.processHybridOrderUltraFast(order);
            return result.status !== 'failed' ? 'success' : 'failed';
          } catch (error) {
            return 'failed';
          }
        });
        
        const batch1000Results = await Promise.allSettled(batch1000Promises);
        batch1000Success = batch1000Results.filter(r => r.status === 'fulfilled' && r.value === 'success').length;
        batch1000Failed = 1000 - batch1000Success;
        
        const batch1000Time = Date.now() - batch1000Start;
        const batch1000TPS = Math.floor((1000 * 1000) / batch1000Time);
        
        console.log(`  ✅ 1000-order batch: ${batch1000Success} successful, ${batch1000TPS} TPS`);
        componentTests.push({ test: '1000-order batch', tps: batch1000TPS, success: batch1000Success, failed: batch1000Failed });
        
      } catch (error) {
        console.log(`  ❌ 1000-order batch failed: ${error.message}`);
        componentTests.push({ test: '1000-order batch', tps: 0, success: 0, failed: 1000, error: error.message });
      }
    }
    
    const phase2Time = Date.now() - phase2Start;
    const phase2TPS = componentTests.length > 0 ? Math.max(...componentTests.map(t => t.tps)) : 0;
    const phase2Success = componentTests.length > 0 && componentTests.every(t => t.success > 0);
    
    results.phases.push({
      phase: 'Component Performance Testing',
      success: phase2Success,
      time: phase2Time,
      details: componentTests,
      tps: phase2TPS
    });

    // Phase 3: Ultra High-Volume Testing
    console.log('\n📋 Phase 3: Ultra High-Volume Testing');
    console.log('====================================');
    
    const phase3Start = Date.now();
    let phase3TPS = 0;
    let phase3Success = false;
    const phase3Details = [];
    
    if (phase2Success) {
      console.log('🚀 Testing ultra-high volume (5000 orders)...');
      
      const ultraBatchStart = Date.now();
      const ultraOrders = [];
      
      for (let i = 0; i < 5000; i++) {
        ultraOrders.push({
          id: `ultra_${i}_${Date.now()}`,
          userId: 'ultra_test_user',
          pair: 'HYPERINDEX-USDC',
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          type: Math.random() > 0.1 ? 'limit' : 'market',
          amount: (1 + Math.random() * 99).toFixed(2),
          price: Math.random() > 0.1 ? (0.8 + Math.random() * 0.6).toFixed(4) : undefined,
          priority: Math.random() > 0.9 ? 'urgent' : (Math.random() > 0.6 ? 'high' : 'normal')
        });
      }
      
      try {
        console.log('  📊 Processing 5000 orders concurrently...');
        
        const ultraPromises = ultraOrders.map(async (order, index) => {
          try {
            const result = await hybridRouter.processHybridOrderUltraFast(order);
            return {
              success: result.status !== 'failed',
              latency: result.executionStats?.executionTime || 0,
              fills: result.fills ? result.fills.length : 0
            };
          } catch (error) {
            return { success: false, latency: 0, fills: 0, error: error.message };
          }
        });
        
        const ultraResults = await Promise.allSettled(ultraPromises);
        const ultraTime = Date.now() - ultraBatchStart;
        
        const successfulResults = ultraResults.filter(r => r.status === 'fulfilled' && r.value.success);
        const successCount = successfulResults.length;
        const failureCount = 5000 - successCount;
        
        phase3TPS = Math.floor((5000 * 1000) / ultraTime);
        phase3Success = successCount > 0;
        
        // Calculate statistics
        const latencies = ultraResults
          .filter(r => r.status === 'fulfilled' && r.value.success)
          .map(r => r.value.latency);
        const avgLatency = latencies.length > 0 ? 
          latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length : 0;
        
        const totalFills = ultraResults
          .filter(r => r.status === 'fulfilled')
          .reduce((sum, r) => sum + (r.value.fills || 0), 0);
        
        console.log(`  ✅ Ultra batch complete:`);
        console.log(`     Success: ${successCount}/5000 orders`);
        console.log(`     Time: ${ultraTime}ms`);
        console.log(`     TPS: ${phase3TPS.toLocaleString()}`);
        console.log(`     Avg Latency: ${avgLatency.toFixed(2)}ms`);
        console.log(`     Total Fills: ${totalFills}`);
        
        phase3Details.push({
          test: 'Ultra 5000-order batch',
          success: successCount,
          failed: failureCount,
          time: ultraTime,
          tps: phase3TPS,
          avgLatency: avgLatency.toFixed(2),
          fills: totalFills
        });
        
      } catch (error) {
        console.log(`  ❌ Ultra batch failed: ${error.message}`);
        phase3Details.push({
          test: 'Ultra 5000-order batch',
          error: error.message,
          tps: 0
        });
      }
    } else {
      console.log('  ⏭️  Skipped due to Phase 2 failures');
      phase3Details.push({ test: 'Skipped', reason: 'Phase 2 failures' });
    }
    
    const phase3Time = Date.now() - phase3Start;
    results.phases.push({
      phase: 'Ultra High-Volume Testing',
      success: phase3Success,
      time: phase3Time,
      details: phase3Details,
      tps: phase3TPS
    });

    // Calculate overall results
    const allTPSValues = results.phases.flatMap(p => 
      p.details.map(d => d.tps || 0).filter(tps => tps > 0)
    );
    
    results.overallTPS = allTPSValues.length > 0 ? 
      Math.floor(allTPSValues.reduce((sum, tps) => sum + tps, 0) / allTPSValues.length) : 0;
    results.peakTPS = allTPSValues.length > 0 ? Math.max(...allTPSValues) : 0;
    
    results.targetAchievement = Math.round((results.peakTPS / 15000) * 100);
    results.success = results.peakTPS >= 15000;
    
    // Determine system health
    if (results.phases.every(p => p.success)) {
      results.systemHealth = 'excellent';
    } else if (results.phases.some(p => p.success)) {
      results.systemHealth = 'good';
    } else {
      results.systemHealth = 'needs_improvement';
    }

    // Generate recommendations
    if (results.peakTPS < 15000) {
      results.recommendations.push('Optimize batch processing for larger concurrent loads');
    }
    
    if (results.peakTPS < 5000) {
      results.recommendations.push('Critical: Review system architecture for bottlenecks');
    } else if (results.peakTPS < 10000) {
      results.recommendations.push('Implement advanced caching strategies');
    }
    
    if (!results.phases[0].success) {
      results.recommendations.push('Fix component initialization issues');
    }

    // Final Results
    console.log('\n🎯 FINAL VALIDATION RESULTS');
    console.log('===========================');
    
    console.log('\n📊 Performance Summary:');
    console.table({
      'Overall TPS': results.overallTPS.toLocaleString(),
      'Peak TPS': results.peakTPS.toLocaleString(),
      'Target (15K)': '15,000',
      'Achievement': `${results.targetAchievement}%`,
      'System Health': results.systemHealth.toUpperCase()
    });
    
    console.log('\n📋 Phase Results:');
    results.phases.forEach((phase, i) => {
      const status = phase.success ? '✅' : '❌';
      console.log(`${i + 1}. ${status} ${phase.phase}`);
      console.log(`   Time: ${phase.time}ms | TPS: ${phase.tps.toLocaleString()}`);
      
      if (Array.isArray(phase.details)) {
        phase.details.forEach(detail => {
          if (detail.test && detail.tps !== undefined) {
            console.log(`   - ${detail.test}: ${detail.tps.toLocaleString()} TPS`);
          }
        });
      }
    });

    // Success determination
    console.log('\n🎯 TARGET ACHIEVEMENT ANALYSIS:');
    if (results.success) {
      console.log('🎉 SUCCESS: 15K+ TPS TARGET ACHIEVED!');
      console.log(`✅ Peak Performance: ${results.peakTPS.toLocaleString()} TPS`);
      console.log(`✅ Achievement: ${results.targetAchievement}% of target`);
      console.log('🚀 HOOATS system is ready for ultra-high-frequency trading!');
    } else if (results.peakTPS >= 10000) {
      console.log('⚡ EXCELLENT: 10K+ TPS ACHIEVED!');
      console.log(`🎯 Peak Performance: ${results.peakTPS.toLocaleString()} TPS`);
      console.log(`📈 Achievement: ${results.targetAchievement}% of 15K target`);
      console.log('🔧 Minor optimizations needed to reach 15K+ target');
    } else if (results.peakTPS >= 5000) {
      console.log('📈 GOOD: 5K+ TPS ACHIEVED!');
      console.log(`⚡ Peak Performance: ${results.peakTPS.toLocaleString()} TPS`);
      console.log(`📊 Achievement: ${results.targetAchievement}% of 15K target`);
      console.log('🔧 Significant optimizations needed');
    } else {
      console.log('🔧 NEEDS IMPROVEMENT');
      console.log(`📉 Peak Performance: ${results.peakTPS.toLocaleString()} TPS`);
      console.log(`📊 Achievement: ${results.targetAchievement}% of 15K target`);
      console.log('❌ Major architectural changes required');
    }

    if (results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      results.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }

    console.log('\n🎯 FINAL 15K+ TPS VALIDATION COMPLETE!');
    
    return results;

  } catch (error) {
    console.error('\n❌ VALIDATION TEST FAILED:', error.message);
    console.error(error.stack);
    return { ...results, error: error.message, success: false };
  }
}

// Run the final validation
validateFinal15kTPS()
  .then(results => {
    console.log('\n📋 Final validation completed');
    
    const exitCode = results.success ? 0 : 
                    results.peakTPS >= 10000 ? 1 : 
                    results.peakTPS >= 5000 ? 2 : 3;
    
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('Final validation failed:', error);
    process.exit(4);
  });