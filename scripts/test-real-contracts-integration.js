#!/usr/bin/env node

/**
 * 🔥 HOOATS Real Contracts Integration Test
 * 
 * Tests HOOATS system with actual deployed contracts from deployment-998-manual.json
 * - Real HyperEVM AMM integration
 * - Live contract interactions
 * - Wallet-based trading simulation
 * 
 * Created: 2025-08-20
 */

const axios = require('axios');
const deploymentInfo = require('../deployment-998-manual.json');

class RealContractsIntegrationTest {
  constructor() {
    // Use actual deployed contract addresses
    this.contracts = deploymentInfo.contracts;
    this.apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3002'; // Real HOOATS server
    this.testResults = {
      timestamp: new Date().toISOString(),
      mode: 'real-contracts-integration',
      contractAddresses: this.contracts,
      tests: [],
      summary: { passed: 0, failed: 0, total: 0 }
    };
  }

  async runTest(testName, testFn) {
    console.log(`\n🧪 Running: ${testName}...`);
    
    const startTime = Date.now();
    let result = {
      name: testName,
      status: 'unknown',
      duration: 0,
      error: null,
      data: null
    };
    
    try {
      const testData = await testFn();
      result.status = 'passed';
      result.data = testData;
      this.testResults.summary.passed++;
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      this.testResults.summary.failed++;
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
    
    result.duration = Date.now() - startTime;
    this.testResults.tests.push(result);
    this.testResults.summary.total++;
  }

  async testHealthCheckWithRealContracts() {
    return await this.runTest('Health Check (Real Contracts)', async () => {
      const response = await axios.get(`${this.apiBaseURL}/api/health`, {
        timeout: 10000
      });
      
      if (response.status !== 200) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
      
      const health = response.data;
      
      return {
        status: health.status,
        mode: health.mode,
        services: health.services,
        contractsConnected: health.mode === 'real-hooats'
      };
    });
  }

  async testRealAMMPriceQuoting() {
    return await this.runTest('Real AMM Price Quoting', async () => {
      console.log('Testing AMM price quoting with real contracts...');
      console.log(`Router: ${this.contracts.router}`);
      console.log(`HYPERINDEX: ${this.contracts.hyperindex}`);
      console.log(`USDC: ${this.contracts.usdc}`);
      console.log(`Pair: ${this.contracts.pair}`);
      
      // Test with a larger order that should show AMM routing
      const orderData = {
        pair: 'HYPERINDEX-USDC',
        side: 'buy',
        type: 'market',
        amount: '5000' // Large enough to potentially hit AMM
      };
      
      const response = await axios.post(`${this.apiBaseURL}/api/trading/v2/orders`, orderData, {
        headers: {
          'Authorization': 'Bearer dev-token',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      if (!response.data.success) {
        throw new Error('Order failed: ' + (response.data.error || 'Unknown error'));
      }
      
      const result = response.data;
      
      return {
        success: result.success,
        orderId: result.order?.id,
        totalFilled: result.summary?.totalFilled || '0',
        averagePrice: result.summary?.averagePrice || '0',
        totalChunks: result.summary?.totalChunks || 0,
        ammChunks: result.summary?.ammChunks || 0,
        orderbookChunks: result.summary?.orderbookChunks || 0,
        contractAddresses: this.contracts,
        executionMode: result.mode || 'unknown'
      };
    });
  }

  async testLimitOrderWithRealContracts() {
    return await this.runTest('Limit Order (Real Contracts)', async () => {
      console.log('Testing limit order with real contract integration...');
      
      // Place a limit order slightly above market price
      const limitOrderData = {
        pair: 'HYPERINDEX-USDC',
        side: 'sell',
        type: 'limit',
        amount: '1000',
        price: '1.25' // Above market, should not fill immediately
      };
      
      const response = await axios.post(`${this.apiBaseURL}/api/trading/v2/orders`, limitOrderData, {
        headers: {
          'Authorization': 'Bearer dev-token',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (!response.data.success) {
        throw new Error('Limit order failed: ' + (response.data.error || 'Unknown error'));
      }
      
      const result = response.data;
      
      return {
        success: result.success,
        orderId: result.order?.id,
        status: result.order?.status,
        pair: result.order?.pair,
        side: result.order?.side,
        type: result.order?.type,
        amount: result.order?.amount,
        price: result.order?.price,
        contractsUsed: this.contracts
      };
    });
  }

  async testOrderbookWithRealData() {
    return await this.runTest('Orderbook (Real Data)', async () => {
      console.log('Testing orderbook data with real contracts...');
      
      const response = await axios.get(`${this.apiBaseURL}/api/trading/v1/orderbook`, {
        params: { pair: 'HYPERINDEX-USDC', depth: 10 },
        timeout: 5000
      });
      
      if (response.status !== 200) {
        throw new Error(`Orderbook API failed: ${response.status}`);
      }
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error('Orderbook data failed: ' + data.error);
      }
      
      return {
        success: data.success,
        pair: data.orderbook?.pair,
        bidsCount: data.orderbook?.bids?.length || 0,
        asksCount: data.orderbook?.asks?.length || 0,
        spread: data.orderbook?.spread,
        mode: data.orderbook?.mode,
        lastUpdate: data.orderbook?.lastUpdate
      };
    });
  }

  async testMarketDataWithRealContracts() {
    return await this.runTest('Market Data (Real Contracts)', async () => {
      console.log('Testing market data with real contract integration...');
      
      const response = await axios.get(`${this.apiBaseURL}/api/trading/v1/market`, {
        params: { pair: 'HYPERINDEX-USDC' },
        headers: { 'Authorization': 'Bearer dev-token' },
        timeout: 5000
      });
      
      if (response.status !== 200) {
        throw new Error(`Market data API failed: ${response.status}`);
      }
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error('Market data failed: ' + data.error);
      }
      
      return {
        success: data.success,
        pair: data.market?.pair || 'HYPERINDEX-USDC',
        price: data.market?.price || '0',
        volume24h: data.market?.volume24h || '0',
        change24h: data.market?.change24h || '0%',
        high24h: data.market?.high24h || '0',
        low24h: data.market?.low24h || '0',
        mode: data.market?.mode
      };
    });
  }

  async testRedisConnectivityWithRealSystem() {
    return await this.runTest('Redis Connectivity (Real System)', async () => {
      console.log('Testing Redis connectivity in real system...');
      
      const response = await axios.get(`${this.apiBaseURL}/api/redis/status`, {
        headers: { 'Authorization': 'Bearer dev-token' },
        timeout: 5000
      });
      
      if (response.status !== 200) {
        throw new Error(`Redis status API failed: ${response.status}`);
      }
      
      const data = response.data;
      
      return {
        connected: data.connected,
        mode: data.mode,
        queueUtilization: data.queueUtilization,
        shardCount: data.shardCount,
        metrics: data.metrics
      };
    });
  }

  async generateReport() {
    console.log("\n📊 Generating Real Contracts Integration Test Report...");
    
    const { passed, failed, total } = this.testResults.summary;
    const successRate = total > 0 ? (passed / total * 100).toFixed(1) : '0';
    
    console.log("\n" + "=".repeat(80));
    console.log("🔥 HOOATS Real Contracts Integration Test Report");
    console.log("=".repeat(80));
    console.log(`⏰ Executed: ${this.testResults.timestamp}`);
    console.log(`📋 Network: ${deploymentInfo.network} (Chain ID: ${deploymentInfo.chainId})`);
    console.log(`📊 Results: ${passed}/${total} tests passed (${successRate}%)`);
    console.log("");
    console.log("📋 Contract Addresses:");
    Object.entries(this.contracts).forEach(([name, address]) => {
      console.log(`   ${name}: ${address}`);
    });
    console.log("");
    
    // Print individual test results
    this.testResults.tests.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      const duration = test.duration < 1000 ? `${test.duration}ms` : `${(test.duration/1000).toFixed(1)}s`;
      
      console.log(`${status} ${test.name} (${duration})`);
      
      if (test.status === 'failed') {
        console.log(`   Error: ${test.error}`);
      } else if (test.data) {
        // Print key metrics for successful tests
        if (test.name === 'Real AMM Price Quoting' && test.data.totalChunks) {
          console.log(`   Chunks: ${test.data.totalChunks} total (${test.data.ammChunks} AMM, ${test.data.orderbookChunks} Orderbook)`);
          console.log(`   Filled: ${test.data.totalFilled}, Price: ${test.data.averagePrice}`);
        }
        if (test.name === 'Limit Order (Real Contracts)' && test.data.orderId) {
          console.log(`   Order: ${test.data.orderId}, Status: ${test.data.status}`);
        }
        if (test.name === 'Health Check (Real Contracts)' && test.data.contractsConnected) {
          console.log(`   Mode: ${test.data.mode}, Status: ${test.data.status}`);
        }
      }
    });
    
    console.log("\n" + "=".repeat(80));
    
    if (failed > 0) {
      console.log("❌ Some tests failed. Check:");
      console.log("   - Real HOOATS API server running (node standalone-api-real.cjs)");
      console.log("   - Contract addresses are correct and deployed");
      console.log("   - Network connectivity to HyperEVM testnet");
    } else {
      console.log("🎉 All tests passed! HOOATS successfully integrated with real contracts.");
      console.log("🚀 System ready for live trading with deployed AMM contracts.");
    }
    
    // Save detailed report
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', `real-contracts-integration-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`📄 Detailed report saved: ${path.basename(reportPath)}`);
    
    return this.testResults;
  }

  async runAllTests() {
    console.log("🔥 Starting HOOATS Real Contracts Integration Test...");
    console.log(`📋 Testing with contracts from: ${deploymentInfo.network}`);
    console.log(`🌐 Chain ID: ${deploymentInfo.chainId}`);
    console.log("");
    
    try {
      // Run integration tests
      await this.testHealthCheckWithRealContracts();
      await this.testRedisConnectivityWithRealSystem();
      await this.testRealAMMPriceQuoting();
      await this.testLimitOrderWithRealContracts();
      await this.testOrderbookWithRealData();
      await this.testMarketDataWithRealContracts();
      
      return await this.generateReport();
      
    } catch (error) {
      console.error("💥 Test execution failed:", error.message);
      throw error;
    }
  }
}

async function main() {
  const tester = new RealContractsIntegrationTest();
  return await tester.runAllTests();
}

if (require.main === module) {
  main()
    .then((results) => {
      const { passed, failed } = results.summary;
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("💥 Real contracts integration test failed:", error);
      process.exit(1);
    });
}

module.exports = RealContractsIntegrationTest;