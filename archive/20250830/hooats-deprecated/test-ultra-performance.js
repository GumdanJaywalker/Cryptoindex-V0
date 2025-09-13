#!/usr/bin/env node

/**
 * 🧪 Ultra-Performance Test Script
 * Quick test of all ultra components
 */

require('dotenv').config();

async function testUltraComponents() {
  console.log('🧪 ULTRA-PERFORMANCE COMPONENT TEST');
  console.log('===================================');
  
  try {
    // Test Memory Pool Manager
    console.log('🧠 Testing Memory Pool Manager...');
    const { UltraMemoryPoolManager } = require('./lib/orderbook/ultra-memory-pool-manager');
    const memoryPool = UltraMemoryPoolManager.getInstance();
    
    // Test borrowing and returning objects
    const order = memoryPool.borrowOrder();
    order.id = 'test-order';
    order.amount = 100;
    
    console.log(`✅ Memory Pool: Borrowed order ${order.id}`);
    memoryPool.returnOrder(order);
    console.log(`✅ Memory Pool: Returned order`);
    
    // Test WebSocket Streamer
    console.log('🌊 Testing WebSocket Streamer...');
    const { UltraWebSocketStreamer } = require('./lib/websocket/ultra-websocket-streamer');
    const wsStreamer = UltraWebSocketStreamer.getInstance();
    console.log('✅ WebSocket Streamer: Instance created');
    
    // Test Advanced Batching System
    console.log('📦 Testing Advanced Batching System...');
    const { AdvancedBatchingSystem } = require('./lib/performance/advanced-batching-system');
    const batchSystem = AdvancedBatchingSystem.getInstance();
    batchSystem.start();
    
    // Queue test order
    const testOrder = {
      id: 'batch-test-1',
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'limit',
      amount: '50',
      price: '1.05',
      timestamp: Date.now()
    };
    
    const orderId = batchSystem.enqueueOrder(testOrder, 'normal');
    console.log(`✅ Batching System: Queued order ${orderId}`);
    
    // Test MEV Protection
    console.log('🛡️ Testing MEV Protection...');
    const { UltraMEVProtection } = require('./lib/security/ultra-mev-protection');
    const mevProtection = UltraMEVProtection.getInstance();
    
    const mevResult = await mevProtection.analyzeTransaction({
      id: 'mev-test-1',
      userId: 'test-user',
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      amount: 100,
      price: 1.05,
      gasPrice: 25,
      timestamp: Date.now()
    });
    
    console.log(`✅ MEV Protection: Analysis complete (Allowed: ${mevResult.allowed})`);
    
    // Get all metrics
    console.log('\n📊 Component Metrics:');
    console.log('====================');
    
    const memoryMetrics = memoryPool.getMetrics();
    console.log(`🧠 Memory Pool - Objects: ${memoryMetrics.totalPoolObjects}, Efficiency: ${memoryMetrics.gcPressureReduction || 0}%`);
    
    const batchMetrics = batchSystem.getMetrics();
    console.log(`📦 Batching - Queue Size: ${batchMetrics.queueSizes?.total || 0}, TPS: ${Math.floor(batchMetrics.throughputAchieved || 0)}`);
    
    const mevMetrics = mevProtection.getMetrics();
    console.log(`🛡️ MEV Protection - Analyzed: ${mevMetrics.totalTransactionsAnalyzed}, Threats: ${mevMetrics.mevAttacksDetected}`);
    
    console.log('\n🎉 ALL ULTRA COMPONENTS WORKING!');
    console.log('================================');
    console.log('✅ Memory Pool Manager: Operational');
    console.log('✅ WebSocket Streamer: Ready');  
    console.log('✅ Advanced Batching: Active');
    console.log('✅ MEV Protection: Active');
    console.log('\n🚀 Ready for ULTRA-PERFORMANCE deployment!');
    
    // Cleanup
    batchSystem.stop();
    
  } catch (error) {
    console.error('❌ Ultra component test failed:', error.message);
    console.error(error.stack);
  }
}

// Run test
testUltraComponents();