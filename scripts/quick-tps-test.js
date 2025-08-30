#!/usr/bin/env node

/**
 * 🚀 Quick TPS Test for HOOATS API
 * 
 * Tests real HOOATS API server TPS performance
 * Created: 2025-08-22
 */

const axios = require('axios');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000/api';

class TpsTest {
  constructor() {
    this.results = [];
  }

  async runBatch(batchSize = 50) {
    console.log(`🚀 Running batch of ${batchSize} orders...`);
    
    const startTime = Date.now();
    const promises = [];
    
    for (let i = 0; i < batchSize; i++) {
      const order = {
        pair: 'HYPERINDEX-USDC',
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        type: 'market',
        amount: (Math.random() * 100 + 10).toFixed(2)
      };
      
      const promise = axios.post(`${API_BASE}/trading/v2/orders`, order, {
        headers: {
          'Authorization': 'Bearer dev-token',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }).catch(error => ({ error: error.message }));
      
      promises.push(promise);
    }
    
    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    
    const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;
    const failed = batchSize - successful;
    const duration = endTime - startTime;
    const tps = (successful / duration * 1000).toFixed(2);
    
    const batchResult = {
      batchSize,
      successful,
      failed,
      duration,
      tps: parseFloat(tps),
      timestamp: new Date().toISOString()
    };
    
    this.results.push(batchResult);
    console.log(`✅ Batch complete: ${successful}/${batchSize} successful, ${tps} TPS`);
    
    return batchResult;
  }

  async runTest() {
    console.log('🧪 Quick TPS Test Starting...');
    console.log(`📍 API Base: ${API_BASE}`);
    
    // Test health endpoint first
    try {
      const health = await axios.get(`${API_BASE}/health`);
      console.log(`✅ API Health: ${health.data.status}`);
      if (health.data.services?.orderbook) {
        console.log(`📊 Mock TPS: ${health.data.services.orderbook.tps}`);
      }
    } catch (error) {
      console.error(`❌ API not available: ${error.message}`);
      return;
    }
    
    // Run different batch sizes
    const batchSizes = [10, 25, 50, 100];
    
    for (const batchSize of batchSizes) {
      await this.runBatch(batchSize);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay between batches
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TPS Test Results Summary');
    console.log('='.repeat(60));
    
    console.table(this.results);
    
    const totalOrders = this.results.reduce((sum, r) => sum + r.successful, 0);
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgTps = this.results.reduce((sum, r) => sum + r.tps, 0) / this.results.length;
    const maxTps = Math.max(...this.results.map(r => r.tps));
    
    console.log(`\n📈 Performance Summary:`);
    console.log(`   Total successful orders: ${totalOrders}`);
    console.log(`   Total time: ${totalTime}ms`);
    console.log(`   Average TPS: ${avgTps.toFixed(2)}`);
    console.log(`   Peak TPS: ${maxTps.toFixed(2)}`);
    
    const successRate = this.results.reduce((sum, r) => sum + r.successful, 0) / 
                       this.results.reduce((sum, r) => sum + r.batchSize, 0) * 100;
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);
    
    console.log('\n🎯 Comparison with target:');
    console.log(`   Target: 15,000-20,000 TPS`);
    console.log(`   Current peak: ${maxTps.toFixed(2)} TPS`);
    console.log(`   Performance ratio: ${(maxTps / 15000 * 100).toFixed(2)}% of minimum target`);
  }
}

// Run test
async function main() {
  const test = new TpsTest();
  await test.runTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TpsTest };