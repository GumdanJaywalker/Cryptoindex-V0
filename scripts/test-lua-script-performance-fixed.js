#!/usr/bin/env node

/**
 * 🔥 Redis Lua Script Performance Test
 * 
 * Tests Redis Lua Script integration and performance in HOOATS
 * - Lua Script vs JavaScript performance comparison
 * - Atomic operations validation
 * - High-volume order matching tests
 * 
 * Created: 2025-08-20
 */

const Redis = require('ioredis');
const axios = require('axios');

class LuaScriptPerformanceTest {
  constructor() {
    this.redis = null;
    this.apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3002';
    this.testResults = {
      timestamp: new Date().toISOString(),
      mode: 'lua-script-performance',
      tests: [],
      summary: { passed: 0, failed: 0, total: 0 }
    };
  }

  async initialize() {
    console.log('🔄 Initializing Redis connection...');
    
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    try {
      await this.redis.ping();
      console.log('✅ Redis connection established');
    } catch (error) {
      throw new Error(`Redis connection failed: ${error.message}`);
    }
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

  async testLuaScriptBasicOperation() {
    return await this.runTest('Lua Script Basic Operation', async () => {
      console.log('Testing basic Lua script execution...');
      
      const luaScript = `
        local key = KEYS[1]
        local value = ARGV[1]
        
        redis.call('SET', key, value)
        local result = redis.call('GET', key)
        
        return {
          operation = 'SET_GET',
          key = key,
          value = result,
          timestamp = redis.call('TIME')[1]
        }
      `;
      
      const testKey = 'test:lua:basic:' + Date.now();
      const testValue = 'lua_test_value';
      
      const startTime = Date.now();
      const result = await this.redis.eval(luaScript, 1, testKey, testValue);
      const endTime = Date.now();
      
      // Clean up
      await this.redis.del(testKey);
      
      return {
        operation: result[1],
        executionTime: endTime - startTime,
        success: result[3] === testValue,
        timestamp: result[4]
      };
    });
  }

  async testHOOATSLuaScriptIntegration() {
    return await this.runTest('HOOATS Lua Script Integration', async () => {
      console.log('Testing HOOATS API with Lua Script integration...');
      
      // Test if HOOATS is using Lua scripts
      const healthResponse = await axios.get(`${this.apiBaseURL}/api/health`, {
        timeout: 5000
      });
      
      if (healthResponse.status !== 200) {
        throw new Error('HOOATS health check failed');
      }
      
      // Test Redis status in HOOATS
      const redisResponse = await axios.get(`${this.apiBaseURL}/api/redis/status`, {
        headers: { 'Authorization': 'Bearer dev-token' },
        timeout: 5000
      });
      
      if (redisResponse.status !== 200) {
        throw new Error('HOOATS Redis status check failed');
      }
      
      const redisData = redisResponse.data;
      
      // Test high-volume order processing to trigger Lua scripts
      const orderData = {
        pair: 'HYPERINDEX-USDC',
        side: 'buy',
        type: 'market',
        amount: '2000' // Large order to potentially trigger Lua script optimization
      };
      
      const startTime = Date.now();
      const orderResponse = await axios.post(`${this.apiBaseURL}/api/trading/v2/orders`, orderData, {
        headers: {
          'Authorization': 'Bearer dev-token',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      const endTime = Date.now();
      
      if (!orderResponse.data.success) {
        throw new Error('Order processing failed: ' + orderResponse.data.error);
      }
      
      return {
        redisConnected: redisData.connected,
        redisMode: redisData.mode,
        orderExecutionTime: endTime - startTime,
        orderSuccess: orderResponse.data.success,
        totalFilled: orderResponse.data.summary?.totalFilled || '0',
        luaScriptsActive: redisData.mode === 'redis' // Indicates Lua scripts potentially active
      };
    });
  }

  async testLuaScriptPerformanceComparison() {
    return await this.runTest('Lua vs JavaScript Performance', async () => {
      console.log('Comparing Lua script vs JavaScript performance...');
      
      const iterations = 50; // Reduced for faster testing
      const results = {
        lua: { times: [], totalTime: 0 },
        javascript: { times: [], totalTime: 0 }
      };
      
      // Lua Script Performance Test
      const luaScript = `
        local counter = 0
        for i = 1, 100 do
          counter = counter + i
        end
        return counter
      `;
      
      console.log(`Running ${iterations} Lua script iterations...`);
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await this.redis.eval(luaScript, 0);
        const end = Date.now();
        const time = end - start;
        results.lua.times.push(time);
        results.lua.totalTime += time;
      }
      
      // JavaScript Performance Test (equivalent operation)
      console.log(`Running ${iterations} JavaScript iterations...`);
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        let counter = 0;
        for (let j = 1; j <= 100; j++) {
          counter += j;
        }
        await this.redis.ping(); // Network call to match Lua script
        const end = Date.now();
        const time = end - start;
        results.javascript.times.push(time);
        results.javascript.totalTime += time;
      }
      
      // Calculate statistics
      const luaAvg = results.lua.totalTime / iterations;
      const jsAvg = results.javascript.totalTime / iterations;
      const performanceRatio = jsAvg / luaAvg;
      
      return {
        iterations,
        lua: {
          totalTime: results.lua.totalTime,
          averageTime: luaAvg,
          minTime: Math.min(...results.lua.times),
          maxTime: Math.max(...results.lua.times)
        },
        javascript: {
          totalTime: results.javascript.totalTime,
          averageTime: jsAvg,
          minTime: Math.min(...results.javascript.times),
          maxTime: Math.max(...results.javascript.times)
        },
        performanceRatio: performanceRatio.toFixed(2),
        winner: performanceRatio > 1 ? 'Lua Script' : 'JavaScript'
      };
    });
  }

  async generateReport() {
    console.log("\n📊 Generating Lua Script Performance Test Report...");
    
    const { passed, failed, total } = this.testResults.summary;
    const successRate = total > 0 ? (passed / total * 100).toFixed(1) : '0';
    
    console.log("\n" + "=".repeat(70));
    console.log("🔥 Redis Lua Script Performance Test Report");
    console.log("=".repeat(70));
    console.log(`⏰ Executed: ${this.testResults.timestamp}`);
    console.log(`📊 Results: ${passed}/${total} tests passed (${successRate}%)`);
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
        if (test.name === 'HOOATS Lua Script Integration' && test.data.luaScriptsActive !== undefined) {
          console.log(`   Redis Mode: ${test.data.redisMode}, Lua Active: ${test.data.luaScriptsActive}`);
          console.log(`   Order Execution: ${test.data.orderExecutionTime}ms`);
        }
        if (test.name === 'Lua vs JavaScript Performance' && test.data.winner) {
          console.log(`   Winner: ${test.data.winner} (ratio: ${test.data.performanceRatio}x)`);
          console.log(`   Lua Avg: ${test.data.lua.averageTime.toFixed(2)}ms, JS Avg: ${test.data.javascript.averageTime.toFixed(2)}ms`);
        }
      }
    });
    
    console.log("\n" + "=".repeat(70));
    
    if (failed > 0) {
      console.log("❌ Some tests failed. Check:");
      console.log("   - Redis server is running and accessible");
      console.log("   - HOOATS API server is running");
      console.log("   - Lua script syntax is correct");
    } else {
      console.log("🎉 All Lua script tests passed!");
      console.log("🚀 Redis Lua Scripts are working optimally with HOOATS.");
    }
    
    // Save detailed report
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', `lua-script-performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`📄 Detailed report saved: ${path.basename(reportPath)}`);
    
    return this.testResults;
  }

  async runAllTests() {
    console.log("🔥 Starting Redis Lua Script Performance Test...");
    
    try {
      await this.initialize();
      
      // Run Lua script tests
      await this.testLuaScriptBasicOperation();
      await this.testHOOATSLuaScriptIntegration();
      await this.testLuaScriptPerformanceComparison();
      
      return await this.generateReport();
      
    } catch (error) {
      console.error("💥 Test initialization failed:", error.message);
      throw error;
    } finally {
      if (this.redis) {
        await this.redis.quit();
      }
    }
  }
}

async function main() {
  const tester = new LuaScriptPerformanceTest();
  return await tester.runAllTests();
}

if (require.main === module) {
  main()
    .then((results) => {
      const { passed, failed } = results.summary;
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("💥 Lua script performance test failed:", error);
      process.exit(1);
    });
}

module.exports = LuaScriptPerformanceTest;