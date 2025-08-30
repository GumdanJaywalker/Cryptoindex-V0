#!/usr/bin/env node

/**
 * 🚀 Ultra Performance Test for HOOATS Production API
 * 
 * Tests real orderbook performance with massive concurrent load
 * Target: 15,000-20,000 TPS
 * 
 * Created: 2025-08-22
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001/api';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'production-token';

class UltraPerformanceTest {
  constructor() {
    this.results = [];
    this.trades = [];
    this.errors = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Generate random order
   */
  generateOrder() {
    const pairs = ['HYPERINDEX-USDC', 'HYPERINDEX-ETH', 'HYPERINDEX-BTC'];
    const sides = ['buy', 'sell'];
    const types = ['market', 'limit'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    
    return {
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      side,
      type,
      amount: (Math.random() * 1000 + 10).toFixed(2),
      price: type === 'limit' ? (Math.random() * 0.2 + 0.9).toFixed(4) : undefined
    };
  }

  /**
   * Send single order
   */
  async sendOrder(order) {
    try {
      const response = await axios.post(`${API_BASE}/trading/v2/orders`, order, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000,
        validateStatus: () => true // Don't throw on any status
      });
      
      return {
        success: response.status === 200,
        data: response.data,
        latency: response.data?.performance?.latency || 0,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        latency: 0
      };
    }
  }

  /**
   * Send batch of orders concurrently
   */
  async sendBatch(batchSize, batchId) {
    console.log(`📦 Sending batch ${batchId} with ${batchSize} orders...`);
    
    const batchStart = performance.now();
    const promises = [];
    
    for (let i = 0; i < batchSize; i++) {
      const order = this.generateOrder();
      promises.push(this.sendOrder(order));
    }
    
    const results = await Promise.allSettled(promises);
    const batchEnd = performance.now();
    const batchDuration = batchEnd - batchStart;
    
    // Process results
    let successful = 0;
    let failed = 0;
    let totalLatency = 0;
    let trades = 0;
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        successful++;
        totalLatency += result.value.latency || 0;
        trades += result.value.data?.execution?.trades || 0;
      } else {
        failed++;
        if (result.reason) {
          this.errors.push({
            batchId,
            error: result.reason
          });
        }
      }
    });
    
    const tps = (successful / (batchDuration / 1000)).toFixed(2);
    const avgLatency = successful > 0 ? (totalLatency / successful).toFixed(2) : 0;
    
    const batchResult = {
      batchId,
      batchSize,
      successful,
      failed,
      trades,
      duration: batchDuration.toFixed(2),
      tps: parseFloat(tps),
      avgLatency: parseFloat(avgLatency),
      timestamp: new Date().toISOString()
    };
    
    this.results.push(batchResult);
    console.log(`✅ Batch ${batchId}: ${successful}/${batchSize} orders | ${tps} TPS | ${avgLatency}ms latency`);
    
    return batchResult;
  }

  /**
   * Run sustained load test
   */
  async runSustainedLoad(ordersPerSecond, durationSeconds) {
    console.log(`\n🎯 Sustained Load Test: ${ordersPerSecond} orders/sec for ${durationSeconds} seconds`);
    console.log('='.repeat(70));
    
    const batchSize = Math.min(ordersPerSecond, 100); // Max 100 per batch
    const batchesPerSecond = Math.ceil(ordersPerSecond / batchSize);
    const delayBetweenBatches = 1000 / batchesPerSecond;
    const totalBatches = Math.ceil(durationSeconds * batchesPerSecond);
    
    console.log(`Configuration: ${batchSize} orders/batch, ${batchesPerSecond} batches/sec`);
    
    this.startTime = Date.now();
    
    for (let i = 0; i < totalBatches; i++) {
      const batchPromise = this.sendBatch(batchSize, i + 1);
      
      // Don't wait for batch to complete before starting next one
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      } else {
        // Wait for last batch to complete
        await batchPromise;
      }
    }
    
    this.endTime = Date.now();
    
    console.log('='.repeat(70));
    console.log('✅ Sustained load test complete');
  }

  /**
   * Run burst load test
   */
  async runBurstLoad(totalOrders) {
    console.log(`\n🚀 Burst Load Test: ${totalOrders} orders simultaneously`);
    console.log('='.repeat(70));
    
    this.startTime = Date.now();
    
    // Send all orders at once
    await this.sendBatch(totalOrders, 'BURST');
    
    this.endTime = Date.now();
    
    console.log('='.repeat(70));
    console.log('✅ Burst load test complete');
  }

  /**
   * Get server metrics
   */
  async getServerMetrics() {
    try {
      const response = await axios.get(`${API_BASE}/performance/metrics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get server metrics:', error.message);
      return null;
    }
  }

  /**
   * Print comprehensive results
   */
  async printResults() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 ULTRA PERFORMANCE TEST RESULTS');
    console.log('='.repeat(70));
    
    // Overall statistics
    const totalOrders = this.results.reduce((sum, r) => sum + r.batchSize, 0);
    const successfulOrders = this.results.reduce((sum, r) => sum + r.successful, 0);
    const failedOrders = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalTrades = this.results.reduce((sum, r) => sum + r.trades, 0);
    const totalDuration = this.endTime - this.startTime;
    
    const overallTPS = (successfulOrders / (totalDuration / 1000)).toFixed(2);
    const successRate = ((successfulOrders / totalOrders) * 100).toFixed(2);
    const avgLatency = this.results.reduce((sum, r) => sum + r.avgLatency, 0) / this.results.length;
    
    console.log('\n📈 Overall Performance:');
    console.log(`   Total Orders: ${totalOrders}`);
    console.log(`   Successful: ${successfulOrders} (${successRate}%)`);
    console.log(`   Failed: ${failedOrders}`);
    console.log(`   Total Trades: ${totalTrades}`);
    console.log(`   Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`   Overall TPS: ${overallTPS}`);
    console.log(`   Average Latency: ${avgLatency.toFixed(2)}ms`);
    
    // Peak performance
    const peakTPS = Math.max(...this.results.map(r => r.tps));
    const minLatency = Math.min(...this.results.filter(r => r.avgLatency > 0).map(r => r.avgLatency));
    
    console.log('\n🏆 Peak Performance:');
    console.log(`   Peak TPS: ${peakTPS}`);
    console.log(`   Best Latency: ${minLatency}ms`);
    
    // Get server metrics
    const serverMetrics = await this.getServerMetrics();
    if (serverMetrics) {
      console.log('\n📊 Server Metrics:');
      console.log(`   Server TPS: ${serverMetrics.performance.currentTPS}`);
      console.log(`   Server Peak TPS: ${serverMetrics.performance.peakTPS}`);
      console.log(`   Server Latency: ${serverMetrics.performance.averageLatency}ms`);
      console.log(`   Target Achievement: ${serverMetrics.performance.percentageOfTarget}%`);
      
      if (serverMetrics.components?.orderbook) {
        console.log('\n🎯 Orderbook Metrics:');
        console.log(`   Orderbook TPS: ${serverMetrics.components.orderbook.tps}`);
        console.log(`   Active Orders: ${serverMetrics.components.orderbook.activeOrders}`);
        console.log(`   Memory Usage: ${serverMetrics.components.orderbook.memoryUsage.toFixed(2)}MB`);
      }
    }
    
    // Batch details
    console.log('\n📦 Batch Performance Summary:');
    console.table(this.results.slice(-5)); // Show last 5 batches
    
    // Target comparison
    console.log('\n🎯 Target Comparison:');
    console.log(`   Target TPS: 15,000-20,000`);
    console.log(`   Achieved TPS: ${overallTPS}`);
    console.log(`   Performance Ratio: ${(parseFloat(overallTPS) / 15000 * 100).toFixed(2)}% of minimum target`);
    
    if (parseFloat(overallTPS) >= 15000) {
      console.log('   ✅ TARGET ACHIEVED! 🎉');
    } else if (parseFloat(overallTPS) >= 10000) {
      console.log('   🟡 Good progress - 67% of target');
    } else if (parseFloat(overallTPS) >= 5000) {
      console.log('   🟠 Moderate performance - 33% of target');
    } else {
      console.log('   🔴 Performance needs improvement');
    }
    
    // Error summary
    if (this.errors.length > 0) {
      console.log(`\n⚠️ Errors encountered: ${this.errors.length}`);
      const uniqueErrors = [...new Set(this.errors.map(e => e.error))];
      uniqueErrors.slice(0, 5).forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
  }

  /**
   * Run complete test suite
   */
  async runFullTest() {
    console.log('🚀 HOOATS ULTRA PERFORMANCE TEST SUITE');
    console.log('Target: 15,000-20,000 TPS');
    console.log(`API: ${API_BASE}`);
    console.log('');
    
    // Check server health first
    try {
      const health = await axios.get(`${API_BASE}/health`);
      console.log(`✅ Server Status: ${health.data.status}`);
      console.log(`📊 Mode: ${health.data.mode}`);
      if (health.data.services?.orderbook) {
        console.log(`📈 Orderbook TPS: ${health.data.services.orderbook.tps}`);
      }
    } catch (error) {
      console.error(`❌ Server not available: ${error.message}`);
      return;
    }
    
    // Test 1: Warm-up (100 orders)
    console.log('\n📌 Test 1: Warm-up');
    await this.sendBatch(100, 'WARMUP');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Gradual ramp-up
    console.log('\n📌 Test 2: Gradual Ramp-up');
    for (const size of [100, 250, 500, 1000]) {
      await this.sendBatch(size, `RAMP_${size}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test 3: Sustained load (1000 orders/sec for 10 seconds)
    console.log('\n📌 Test 3: Sustained Load');
    await this.runSustainedLoad(1000, 10);
    
    // Test 4: Burst load (5000 orders at once)
    console.log('\n📌 Test 4: Burst Load');
    await this.runBurstLoad(5000);
    
    // Test 5: Maximum sustained (2000 orders/sec for 5 seconds)
    console.log('\n📌 Test 5: Maximum Sustained Load');
    await this.runSustainedLoad(2000, 5);
    
    // Print results
    await this.printResults();
  }
}

// Main execution
async function main() {
  const test = new UltraPerformanceTest();
  
  console.log('⚠️ WARNING: This will generate massive load on the API server');
  console.log('Make sure the production server is running on port 3001');
  console.log('');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0] || 'full';
  
  switch (command) {
    case 'burst':
      const burstSize = parseInt(args[1]) || 1000;
      await test.runBurstLoad(burstSize);
      await test.printResults();
      break;
      
    case 'sustained':
      const ordersPerSec = parseInt(args[1]) || 500;
      const duration = parseInt(args[2]) || 10;
      await test.runSustainedLoad(ordersPerSec, duration);
      await test.printResults();
      break;
      
    case 'full':
    default:
      await test.runFullTest();
      break;
  }
  
  console.log('\n🎯 Test complete!');
}

// Run test
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { UltraPerformanceTest };