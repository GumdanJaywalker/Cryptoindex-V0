/**
 * Test Ultra-Performance Orderbook Converted JS Version
 * Testing the converted TS->JS ultra-performance orderbook
 * Goal: Verify 15K-20K TPS capability vs current 800 TPS
 */

const { UltraPerformanceOrderbook } = require('./hooats-core/ultra-performance-orderbook-converted');

class UltraConvertedPerformanceTest {
  constructor() {
    this.results = {
      startTime: Date.now(),
      totalOrders: 0,
      successfulOrders: 0,
      failedOrders: 0,
      trades: [],
      errors: [],
      performance: {
        avgLatency: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        maxTPS: 0,
        actualTPS: 0
      }
    };
    this.latencies = [];
    this.orderbook = null;
  }

  async initialize() {
    console.log('🚀 Initializing Ultra-Performance Orderbook (Converted JS)...');
    
    try {
      this.orderbook = UltraPerformanceOrderbook.getInstance();
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Ultra-Performance Orderbook initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize orderbook:', error.message);
      return false;
    }
  }

  generateTestOrder(id) {
    const pairs = ['HYPERINDEX-USDC', 'DOGE-USDC', 'PEPE-USDC'];
    const sides = ['buy', 'sell'];
    const types = ['limit', 'market'];
    
    return {
      id: `ultra_order_${id}`,
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      type: types[Math.floor(Math.random() * types.length)],
      price: (Math.random() * 10 + 0.5).toFixed(6),
      amount: (Math.random() * 1000 + 10).toFixed(6),
      userId: `user_${Math.floor(Math.random() * 100)}`,
      timestamp: Date.now()
    };
  }

  async testBurstOrders(count = 1000) {
    console.log(`🏃‍♂️ Testing burst processing: ${count} orders...`);
    
    const startTime = Date.now();
    const promises = [];
    
    // Create burst of orders
    for (let i = 0; i < count; i++) {
      const order = this.generateTestOrder(i);
      const orderPromise = this.processOrderWithMetrics(order);
      promises.push(orderPromise);
    }
    
    // Wait for all orders to complete
    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    
    // Analyze results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
    
    const totalTime = endTime - startTime;
    const actualTPS = (count / totalTime) * 1000;
    
    console.log(`📊 Burst Test Results:`);
    console.log(`   Total Orders: ${count}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total Time: ${totalTime}ms`);
    console.log(`   Actual TPS: ${actualTPS.toFixed(2)}`);
    
    return {
      totalOrders: count,
      successful,
      failed,
      totalTime,
      actualTPS
    };
  }

  async processOrderWithMetrics(order) {
    const startTime = process.hrtime.bigint();
    
    try {
      await this.orderbook.addOrderUltra(order);
      
      const endTime = process.hrtime.bigint();
      const latency = Number(endTime - startTime) / 1000000; // ms
      
      this.latencies.push(latency);
      this.results.successfulOrders++;
      
      return {
        success: true,
        latency,
        orderId: order.id
      };
    } catch (error) {
      this.results.failedOrders++;
      this.results.errors.push({
        orderId: order.id,
        error: error.message,
        timestamp: Date.now()
      });
      
      return {
        success: false,
        error: error.message,
        orderId: order.id
      };
    }
  }

  async runComprehensiveTest() {
    console.log('🎯 Ultra-Performance Orderbook Conversion Test Starting...\n');
    
    // Initialize
    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Test aborted due to initialization failure');
      return;
    }
    
    // Test burst processing with different scales
    const testConfigs = [
      { orders: 1000, name: '1K Burst' },
      { orders: 5000, name: '5K Burst' },
      { orders: 10000, name: '10K Target Test' }
    ];
    
    const throughputResults = [];
    
    for (const config of testConfigs) {
      console.log(`\n🎯 Running ${config.name}...`);
      const result = await this.testBurstOrders(config.orders);
      throughputResults.push({ ...config, ...result });
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Calculate percentiles
    const percentiles = this.calculatePercentiles();
    
    // Final summary
    console.log('\n🎯 FINAL RESULTS SUMMARY');
    console.log('================================');
    console.log(`Total Orders Processed: ${this.results.successfulOrders}`);
    console.log(`Failed Orders: ${this.results.failedOrders}`);
    
    if (this.results.successfulOrders + this.results.failedOrders > 0) {
      console.log(`Success Rate: ${((this.results.successfulOrders / (this.results.successfulOrders + this.results.failedOrders)) * 100).toFixed(2)}%`);
    }
    
    console.log('\n📈 Performance Analysis:');
    throughputResults.forEach(result => {
      console.log(`   ${result.name}: ${result.actualTPS.toFixed(2)} TPS`);
    });
    
    const maxTPS = Math.max(...throughputResults.map(r => r.actualTPS));
    console.log('\n🚀 PERFORMANCE COMPARISON:');
    console.log(`   Current JS System: ~800 TPS`);
    console.log(`   Ultra-Converted System: ${maxTPS.toFixed(2)} TPS`);
    console.log(`   Performance Improvement: ${(maxTPS / 800).toFixed(1)}x`);
    
    if (maxTPS > 10000) {
      console.log('🎉 SUCCESS: Achieved 10K+ TPS target!');
    } else if (maxTPS > 5000) {
      console.log('✅ GOOD: Significant improvement achieved');
    } else {
      console.log('⚠️ NEEDS OPTIMIZATION: Performance below expectations');
    }
    
    // Cleanup
    try {
      await this.orderbook.shutdown();
      console.log('\n✅ Ultra-Performance Orderbook shutdown complete');
    } catch (error) {
      console.log('⚠️ Shutdown warning:', error.message);
    }
  }

  calculatePercentiles() {
    if (this.latencies.length === 0) return { p50: 0, p95: 0, p99: 0 };
    
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const len = sorted.length;
    
    return {
      p50: sorted[Math.floor(len * 0.5)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)]
    };
  }
}

// Run the test
async function runTest() {
  const test = new UltraConvertedPerformanceTest();
  await test.runComprehensiveTest();
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️ Test interrupted by user');
  process.exit(0);
});

// Start test
runTest().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});