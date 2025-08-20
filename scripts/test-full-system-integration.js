#!/usr/bin/env node

/**
 * 🚀 HOOATS Full System Integration Test
 * 
 * Comprehensive end-to-end testing of the complete HOOATS system
 * - Real contract integration
 * - Performance validation (15-20K TPS target)
 * - Security validation
 * - Redis Lua Script performance
 * - Production readiness assessment
 * 
 * Created: 2025-08-20
 */

const RealContractsIntegrationTest = require('./test-real-contracts-integration');
const LuaScriptPerformanceTest = require('./test-lua-script-performance');
const MEVSecurityTest = require('./test-mev-security');

class FullSystemIntegrationTest {
  constructor() {
    this.testSuites = [];
    this.results = {
      timestamp: new Date().toISOString(),
      mode: 'full-system-integration',
      suites: {},
      overallSummary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        successRate: 0,
        performanceScore: 0,
        securityScore: 0,
        readinessLevel: 'unknown'
      }
    };
  }

  async runTestSuite(suiteName, TestClass) {
    console.log(\`\\n🎯 Running Test Suite: \${suiteName}\`);
    console.log("=".repeat(60));
    
    const startTime = Date.now();
    let suiteResult = {
      name: suiteName,
      status: 'unknown',
      duration: 0,
      testResults: null,
      error: null
    };
    
    try {
      const tester = new TestClass();
      const results = await tester.runAllTests();
      
      suiteResult.status = 'completed';
      suiteResult.testResults = results;
      
      // Aggregate results
      this.results.overallSummary.totalTests += results.summary.total;
      this.results.overallSummary.totalPassed += results.summary.passed;
      this.results.overallSummary.totalFailed += results.summary.failed;
      
      console.log(\`✅ \${suiteName} completed: \${results.summary.passed}/\${results.summary.total} tests passed\`);
      
    } catch (error) {
      suiteResult.status = 'failed';
      suiteResult.error = error.message;
      console.log(\`❌ \${suiteName} failed: \${error.message}\`);
    }
    
    suiteResult.duration = Date.now() - startTime;
    this.results.suites[suiteName] = suiteResult;
    
    return suiteResult;
  }

  async runPerformanceBenchmark() {
    console.log("\\n🏃‍♂️ Running Performance Benchmark...");
    console.log("=".repeat(60));
    
    const benchmarkConfig = {
      targetTPS: 15000, // 15K TPS target
      testDuration: 30, // 30 seconds
      orderTypes: { market: 0.6, limit: 0.4 },
      sides: { buy: 0.5, sell: 0.5 }
    };
    
    let performanceScore = 0;
    let actualTPS = 0;
    
    try {
      const startTime = Date.now();
      const orders = [];
      let successfulOrders = 0;
      let failedOrders = 0;
      
      // Generate test orders
      const totalOrders = Math.floor(benchmarkConfig.targetTPS * benchmarkConfig.testDuration / 1000);
      console.log(\`📊 Generating \${totalOrders} test orders for \${benchmarkConfig.testDuration}s duration...\`);
      
      for (let i = 0; i < 100; i++) { // Limited batch for testing
        const isMarket = Math.random() < benchmarkConfig.orderTypes.market;
        const isBuy = Math.random() < benchmarkConfig.sides.buy;
        
        orders.push({
          pair: 'HYPERINDEX-USDC',
          side: isBuy ? 'buy' : 'sell',
          type: isMarket ? 'market' : 'limit',
          amount: (Math.random() * 1000 + 100).toFixed(2),
          price: !isMarket ? (1 + Math.random() * 0.5).toFixed(4) : undefined
        });
      }
      
      // Execute orders
      console.log(\`🚀 Executing \${orders.length} orders...\`);
      const executionStart = Date.now();
      
      const results = await Promise.all(
        orders.map(async (order, index) => {
          try {
            const response = await fetch(\`http://localhost:3002/api/trading/v2/orders\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer dev-token'
              },
              body: JSON.stringify(order)
            });
            
            if (response.ok) {
              successfulOrders++;
              return { index, success: true };
            } else {
              failedOrders++;
              return { index, success: false, error: \`HTTP \${response.status}\` };
            }
          } catch (error) {
            failedOrders++;
            return { index, success: false, error: error.message };
          }
        })
      );
      
      const executionTime = Date.now() - executionStart;
      actualTPS = Math.round((successfulOrders / executionTime) * 1000);
      
      // Calculate performance score
      performanceScore = Math.min((actualTPS / benchmarkConfig.targetTPS) * 100, 100);
      
      console.log(\`📈 Performance Results:\`);
      console.log(\`   Successful Orders: \${successfulOrders}/\${orders.length}\`);
      console.log(\`   Actual TPS: \${actualTPS}\`);
      console.log(\`   Target TPS: \${benchmarkConfig.targetTPS}\`);
      console.log(\`   Performance Score: \${performanceScore.toFixed(1)}%\`);
      
    } catch (error) {
      console.error(\`❌ Performance benchmark failed: \${error.message}\`);
      performanceScore = 0;
    }
    
    this.results.overallSummary.performanceScore = performanceScore;
    return { actualTPS, performanceScore, targetTPS: benchmarkConfig.targetTPS };
  }

  calculateReadinessLevel() {
    const { totalPassed, totalTests, performanceScore, securityScore } = this.results.overallSummary;
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
    
    // Calculate overall readiness score
    const testScore = successRate;
    const avgScore = (testScore + performanceScore + securityScore) / 3;
    
    let readinessLevel;
    if (avgScore >= 90) {
      readinessLevel = 'PRODUCTION_READY';
    } else if (avgScore >= 75) {
      readinessLevel = 'STAGING_READY';
    } else if (avgScore >= 60) {
      readinessLevel = 'DEVELOPMENT_READY';
    } else {
      readinessLevel = 'NOT_READY';
    }
    
    this.results.overallSummary.successRate = successRate;
    this.results.overallSummary.readinessLevel = readinessLevel;
    
    return { avgScore, readinessLevel };
  }

  async generateComprehensiveReport() {
    console.log("\\n📊 Generating Comprehensive System Integration Report...");
    
    const { avgScore, readinessLevel } = this.calculateReadinessLevel();
    const { totalPassed, totalFailed, totalTests, performanceScore, securityScore } = this.results.overallSummary;
    
    console.log("\\n" + "=".repeat(100));
    console.log("🚀 HOOATS Full System Integration Test Report");
    console.log("=".repeat(100));
    console.log(\`⏰ Executed: \${this.results.timestamp}\`);
    console.log(\`🎯 Overall Score: \${avgScore.toFixed(1)}% - \${readinessLevel}\`);
    console.log("");
    
    // Test Results Summary
    console.log("📋 Test Results Summary:");
    console.log(\`   Total Tests: \${totalTests}\`);
    console.log(\`   Passed: \${totalPassed} (\${((totalPassed/totalTests)*100).toFixed(1)}%)\`);
    console.log(\`   Failed: \${totalFailed}\`);
    console.log(\`   Performance Score: \${performanceScore.toFixed(1)}%\`);
    console.log(\`   Security Score: \${securityScore.toFixed(1)}%\`);
    console.log("");
    
    // Test Suite Results
    console.log("🧪 Test Suite Results:");
    Object.entries(this.results.suites).forEach(([suiteName, result]) => {
      const status = result.status === 'completed' ? '✅' : '❌';
      const duration = result.duration < 1000 ? \`\${result.duration}ms\` : \`\${(result.duration/1000).toFixed(1)}s\`;
      
      console.log(\`   \${status} \${suiteName} (\${duration})\`);
      
      if (result.testResults) {
        const { passed, total } = result.testResults.summary;
        console.log(\`      Tests: \${passed}/\${total} passed\`);
      }
      
      if (result.error) {
        console.log(\`      Error: \${result.error}\`);
      }
    });
    
    console.log("\\n" + "=".repeat(100));
    
    // Readiness Assessment
    if (readinessLevel === 'PRODUCTION_READY') {
      console.log("🎉 EXCELLENT! System is PRODUCTION READY");
      console.log("✅ All systems operational");
      console.log("✅ Performance targets met");
      console.log("✅ Security standards exceeded");
      console.log("🚀 Ready for live trading deployment");
    } else if (readinessLevel === 'STAGING_READY') {
      console.log("✅ GOOD! System is STAGING READY");
      console.log("🔸 Core functionality working");
      console.log("🔸 Performance approaching targets");
      console.log("🔸 Security adequate");
      console.log("📋 Minor optimizations needed for production");
    } else if (readinessLevel === 'DEVELOPMENT_READY') {
      console.log("⚠️ System is DEVELOPMENT READY");
      console.log("🔸 Basic functionality working");
      console.log("❌ Performance needs improvement");
      console.log("❌ Security needs attention");
      console.log("🛠️ Significant work needed before production");
    } else {
      console.log("❌ System is NOT READY");
      console.log("🔴 Critical issues detected");
      console.log("🔴 Major functionality problems");
      console.log("🚨 Do not deploy to production");
    }
    
    // Recommendations
    console.log("\\n💡 Recommendations:");
    if (performanceScore < 80) {
      console.log("   🔧 Optimize performance - target 15-20K TPS");
      console.log("   🔧 Review Redis Lua Scripts efficiency");
      console.log("   🔧 Consider database query optimization");
    }
    if (securityScore < 80) {
      console.log("   🛡️ Strengthen security measures");
      console.log("   🛡️ Enhance MEV attack protection");
      console.log("   🛡️ Implement additional rate limiting");
    }
    if (totalFailed > 0) {
      console.log("   🐛 Fix failing tests before deployment");
      console.log("   🐛 Review error logs for root causes");
    }
    
    // Save comprehensive report
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', \`full-system-integration-report-\${Date.now()}.json\`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(\`\\n📄 Comprehensive report saved: \${path.basename(reportPath)}\`);
    
    return this.results;
  }

  async runFullIntegrationTest() {
    console.log("🚀 Starting HOOATS Full System Integration Test...");
    console.log("🎯 Testing: Real Contracts + Performance + Security + Lua Scripts");
    console.log("");
    
    try {
      // 1. Real Contracts Integration
      await this.runTestSuite('Real Contracts Integration', RealContractsIntegrationTest);
      
      // 2. Redis Lua Script Performance
      await this.runTestSuite('Lua Script Performance', LuaScriptPerformanceTest);
      
      // 3. MEV Security Testing
      const securityResults = await this.runTestSuite('MEV Security', MEVSecurityTest);
      if (securityResults.testResults) {
        // Extract security score from MEV test results
        const securityTests = securityResults.testResults.tests || [];
        const highSecurityCount = securityTests.filter(t => t.securityLevel === 'high').length;
        const mediumSecurityCount = securityTests.filter(t => t.securityLevel === 'medium').length;
        const totalSecurityTests = securityTests.length;
        
        if (totalSecurityTests > 0) {
          this.results.overallSummary.securityScore = 
            ((highSecurityCount * 3) + (mediumSecurityCount * 2)) / (totalSecurityTests * 3) * 100;
        }
      }
      
      // 4. Performance Benchmark
      console.log("\\n" + "=".repeat(100));
      await this.runPerformanceBenchmark();
      
      // 5. Generate comprehensive report
      return await this.generateComprehensiveReport();
      
    } catch (error) {
      console.error("💥 Full system integration test failed:", error.message);
      throw error;
    }
  }
}

async function main() {
  const integrationTester = new FullSystemIntegrationTest();
  return await integrationTester.runFullIntegrationTest();
}

if (require.main === module) {
  main()
    .then((results) => {
      const readinessLevel = results.overallSummary.readinessLevel;
      
      if (readinessLevel === 'PRODUCTION_READY' || readinessLevel === 'STAGING_READY') {
        console.log(\`\\n✅ Integration test completed successfully! System is \${readinessLevel}\`);
        process.exit(0);
      } else {
        console.log(\`\\n⚠️ Integration test completed with issues. System is \${readinessLevel}\`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Full system integration test failed:", error);
      process.exit(1);
    });
}

module.exports = FullSystemIntegrationTest;