/**
 * HOOATS Ultra-Performance Integration Test
 * Testing the integration of Ultra-Performance Orderbook with existing HOOATS system
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');
const HybridRouterReal = require('./hooats-core/hybrid-router-real');

class HOOATSUltraIntegrationTest {
  constructor() {
    this.results = {
      standardSystem: { tps: 0, latency: 0, errors: 0 },
      ultraSystem: { tps: 0, latency: 0, errors: 0 },
      improvement: { tps: 0, latency: 0 }
    };
    this.ultraOrderbook = null;
    this.standardRouter = null;
  }

  async initialize() {
    console.log('🚀 Initializing HOOATS Ultra Integration Test...');
    
    try {
      // Initialize Ultra-Performance Orderbook
      this.ultraOrderbook = UltraPerformanceOrderbook.getInstance();
      
      // Initialize Standard HOOATS Router
      this.standardRouter = new HybridRouterReal();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Both systems initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }

  generateTestOrder(id, prefix = 'test') {
    const pairs = ['HYPERINDEX-USDC', 'DOGE-USDC', 'PEPE-USDC'];
    const sides = ['buy', 'sell'];
    
    return {
      id: `${prefix}_order_${id}`,
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      type: 'limit',
      price: (Math.random() * 2 + 1).toFixed(6),
      amount: (Math.random() * 100 + 10).toFixed(6),
      userId: `user_${Math.floor(Math.random() * 50)}`,
      timestamp: Date.now()
    };
  }

  async testStandardHOOATS(orderCount = 1000) {
    console.log(`📊 Testing Standard HOOATS System (${orderCount} orders)...`);
    
    const startTime = Date.now();
    let successful = 0;
    let failed = 0;
    const latencies = [];

    for (let i = 0; i < orderCount; i++) {
      const order = this.generateTestOrder(i, 'standard');
      const orderStart = process.hrtime.bigint();
      
      try {
        // Use existing hybrid router's orderbook processing
        await this.standardRouter.processHybridOrderUltraFast(order);
        successful++;
        
        const orderEnd = process.hrtime.bigint();
        latencies.push(Number(orderEnd - orderStart) / 1000000);
        
      } catch (error) {
        failed++;
      }
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const tps = (orderCount / totalTime) * 1000;
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    
    this.results.standardSystem = {
      tps,
      latency: avgLatency,
      errors: failed,
      successful,
      totalTime
    };
    
    console.log(`   TPS: ${tps.toFixed(2)}`);
    console.log(`   Average Latency: ${avgLatency.toFixed(3)}ms`);
    console.log(`   Success Rate: ${((successful / orderCount) * 100).toFixed(1)}%`);
    
    return this.results.standardSystem;
  }

  async testUltraHOOATS(orderCount = 1000) {
    console.log(`⚡ Testing Ultra-Performance HOOATS System (${orderCount} orders)...`);
    
    const startTime = Date.now();
    let successful = 0;
    let failed = 0;
    const latencies = [];

    // Create all orders first for burst processing
    const orders = [];
    for (let i = 0; i < orderCount; i++) {
      orders.push(this.generateTestOrder(i, 'ultra'));
    }

    // Process orders in ultra-performance mode
    const promises = orders.map(async (order) => {
      const orderStart = process.hrtime.bigint();
      
      try {
        await this.ultraOrderbook.addOrderUltra(order);
        
        const orderEnd = process.hrtime.bigint();
        const latency = Number(orderEnd - orderStart) / 1000000;
        
        return { success: true, latency };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        successful++;
        latencies.push(result.value.latency);
      } else {
        failed++;
      }
    });
    
    const totalTime = endTime - startTime;
    const tps = (orderCount / totalTime) * 1000;
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    
    this.results.ultraSystem = {
      tps,
      latency: avgLatency,
      errors: failed,
      successful,
      totalTime
    };
    
    console.log(`   TPS: ${tps.toFixed(2)}`);
    console.log(`   Average Latency: ${avgLatency.toFixed(3)}ms`);
    console.log(`   Success Rate: ${((successful / orderCount) * 100).toFixed(1)}%`);
    
    return this.results.ultraSystem;
  }

  async comparePerformance() {
    console.log('\n🔄 Running Performance Comparison...');
    
    const testSize = 2000; // Test with 2K orders each
    
    // Test standard system
    await this.testStandardHOOATS(testSize);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test ultra system
    await this.testUltraHOOATS(testSize);
    
    // Calculate improvements
    this.results.improvement = {
      tps: this.results.ultraSystem.tps / this.results.standardSystem.tps,
      latency: this.results.standardSystem.latency / this.results.ultraSystem.latency
    };
  }

  async testCompatibility() {
    console.log('\n🔧 Testing Interface Compatibility...');
    
    const testOrder = this.generateTestOrder('compat', 'compatibility');
    
    try {
      // Test if ultra-performance orderbook has compatible interface
      const result = await this.ultraOrderbook.processOrderUltraFast(testOrder);
      
      console.log('✅ Compatibility Test Results:');
      console.log(`   Order ID: ${result.orderId}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Trades: ${result.trades.length}`);
      console.log(`   Execution Time: ${result.executionTime}ms`);
      
      return { compatible: true, result };
    } catch (error) {
      console.log('❌ Compatibility Issue:', error.message);
      return { compatible: false, error: error.message };
    }
  }

  printFinalResults() {
    console.log('\n🎯 HOOATS ULTRA INTEGRATION TEST RESULTS');
    console.log('==========================================');
    
    console.log('\n📊 Performance Comparison:');
    console.log(`Standard HOOATS:`);
    console.log(`   TPS: ${this.results.standardSystem.tps.toFixed(2)}`);
    console.log(`   Latency: ${this.results.standardSystem.latency.toFixed(3)}ms`);
    console.log(`   Success Rate: ${((this.results.standardSystem.successful / (this.results.standardSystem.successful + this.results.standardSystem.errors)) * 100).toFixed(1)}%`);
    
    console.log(`\nUltra HOOATS:`);
    console.log(`   TPS: ${this.results.ultraSystem.tps.toFixed(2)}`);
    console.log(`   Latency: ${this.results.ultraSystem.latency.toFixed(3)}ms`);
    console.log(`   Success Rate: ${((this.results.ultraSystem.successful / (this.results.ultraSystem.successful + this.results.ultraSystem.errors)) * 100).toFixed(1)}%`);
    
    console.log(`\n🚀 Performance Improvements:`);
    console.log(`   TPS Improvement: ${this.results.improvement.tps.toFixed(1)}x faster`);
    console.log(`   Latency Improvement: ${this.results.improvement.latency.toFixed(1)}x faster`);
    
    // Evaluation
    if (this.results.improvement.tps > 10) {
      console.log('\n🎉 EXCELLENT: Ultra system shows exceptional improvement!');
    } else if (this.results.improvement.tps > 5) {
      console.log('\n✅ GOOD: Significant performance improvement achieved');
    } else if (this.results.improvement.tps > 2) {
      console.log('\n⚠️ MODERATE: Some improvement but optimization needed');
    } else {
      console.log('\n❌ POOR: Minimal improvement - needs investigation');
    }
  }

  async runFullIntegrationTest() {
    console.log('🎯 HOOATS Ultra-Performance Integration Test Starting...\n');
    
    // Initialize both systems
    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Test aborted due to initialization failure');
      return;
    }
    
    // Test compatibility first
    const compatibility = await this.testCompatibility();
    if (!compatibility.compatible) {
      console.log('❌ Test aborted due to compatibility issues');
      return;
    }
    
    // Run performance comparison
    await this.comparePerformance();
    
    // Print final results
    this.printFinalResults();
    
    // Cleanup
    try {
      await this.ultraOrderbook.shutdown();
      console.log('\n✅ Test completed successfully');
    } catch (error) {
      console.log('⚠️ Cleanup warning:', error.message);
    }
  }
}

// Run the integration test
async function runTest() {
  const test = new HOOATSUltraIntegrationTest();
  await test.runFullIntegrationTest();
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️ Test interrupted by user');
  process.exit(0);
});

// Start test
runTest().catch(error => {
  console.error('💥 Integration test failed:', error);
  process.exit(1);
});