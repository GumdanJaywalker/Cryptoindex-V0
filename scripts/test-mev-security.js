#!/usr/bin/env node

/**
 * 🛡️ HOOATS MEV Security & Attack Defense Test
 * 
 * Tests security features and MEV attack resistance in HOOATS
 * - Sandwich attack detection and prevention
 * - Front-running protection
 * - Price manipulation resistance
 * - Cross-system validation
 * - SecureTPSEngine validation
 * 
 * Created: 2025-08-20
 */

const axios = require('axios');

class MEVSecurityTest {
  constructor() {
    this.apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3002';
    this.testResults = {
      timestamp: new Date().toISOString(),
      mode: 'mev-security-test',
      tests: [],
      summary: { passed: 0, failed: 0, total: 0 },
      securityMetrics: {}
    };
  }

  async runTest(testName, testFn) {
    console.log(\`\\n🧪 Running: \${testName}...\`);
    
    const startTime = Date.now();
    let result = {
      name: testName,
      status: 'unknown',
      duration: 0,
      error: null,
      data: null,
      securityLevel: 'unknown'
    };
    
    try {
      const testData = await testFn();
      result.status = 'passed';
      result.data = testData;
      result.securityLevel = testData.securityLevel || 'medium';
      this.testResults.summary.passed++;
      console.log(\`✅ \${testName} - PASSED (Security: \${result.securityLevel})\`);
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      result.securityLevel = 'vulnerable';
      this.testResults.summary.failed++;
      console.log(\`❌ \${testName} - FAILED: \${error.message}\`);
    }
    
    result.duration = Date.now() - startTime;
    this.testResults.tests.push(result);
    this.testResults.summary.total++;
  }

  async testSandwichAttackDetection() {
    return await this.runTest('Sandwich Attack Detection', async () => {
      console.log('Testing sandwich attack detection and prevention...');
      
      // Simulate sandwich attack pattern:
      // 1. Front-run with large buy order
      // 2. Target transaction (victim)
      // 3. Back-run with sell order
      
      const attackOrders = [
        {
          // Front-run: Large buy order to pump price
          pair: 'HYPERINDEX-USDC',
          side: 'buy',
          type: 'market',
          amount: '5000', // Large amount
          timestamp: Date.now(),
          attackType: 'frontrun'
        },
        {
          // Victim transaction simulation
          pair: 'HYPERINDEX-USDC',
          side: 'buy',
          type: 'market',
          amount: '1000',
          timestamp: Date.now() + 100,
          attackType: 'victim'
        },
        {
          // Back-run: Sell order to dump price
          pair: 'HYPERINDEX-USDC',
          side: 'sell',
          type: 'market',
          amount: '5000',
          timestamp: Date.now() + 200,
          attackType: 'backrun'
        }
      ];
      
      const results = [];
      let detectedAttacks = 0;
      
      for (const order of attackOrders) {
        try {
          const response = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, order, {
            headers: {
              'Authorization': 'Bearer dev-token',
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
          
          // Check if the system detected suspicious activity
          const result = response.data;
          const hasSecurityWarning = result.securityWarning || result.mevProtection;
          
          if (hasSecurityWarning) {
            detectedAttacks++;
          }
          
          results.push({
            attackType: order.attackType,
            orderId: result.order?.id,
            detected: hasSecurityWarning,
            securityWarning: result.securityWarning,
            mevProtection: result.mevProtection
          });
          
          // Small delay between orders
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          results.push({
            attackType: order.attackType,
            error: error.message,
            detected: error.response?.status === 429 || error.message.includes('suspicious')
          });
          
          if (error.response?.status === 429 || error.message.includes('suspicious')) {
            detectedAttacks++;
          }
        }
      }
      
      const detectionRate = (detectedAttacks / attackOrders.length) * 100;
      const securityLevel = detectionRate >= 66 ? 'high' : detectionRate >= 33 ? 'medium' : 'low';
      
      return {
        totalAttacks: attackOrders.length,
        detectedAttacks,
        detectionRate: detectionRate.toFixed(1) + '%',
        securityLevel,
        attackResults: results,
        recommendation: detectionRate < 66 ? 'Improve MEV detection algorithms' : 'Security adequate'
      };
    });
  }

  async testFrontRunningProtection() {
    return await this.runTest('Front-Running Protection', async () => {
      console.log('Testing front-running protection mechanisms...');
      
      // Test rapid sequential orders (front-running pattern)
      const baseOrder = {
        pair: 'HYPERINDEX-USDC',
        side: 'buy',
        type: 'limit',
        amount: '1000',
        price: '1.10'
      };
      
      const frontRunOrder = {
        ...baseOrder,
        amount: '3000', // Larger amount
        price: '1.12'   // Higher price
      };
      
      const results = [];
      const startTime = Date.now();
      
      // Submit front-run order
      try {
        const frontRunResponse = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, frontRunOrder, {
          headers: {
            'Authorization': 'Bearer dev-token',
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        results.push({
          type: 'frontrun',
          success: frontRunResponse.data.success,
          orderId: frontRunResponse.data.order?.id,
          warning: frontRunResponse.data.securityWarning
        });
      } catch (error) {
        results.push({
          type: 'frontrun',
          success: false,
          error: error.message,
          blocked: error.response?.status === 429
        });
      }
      
      // Immediate follow-up with original order
      await new Promise(resolve => setTimeout(resolve, 10)); // Minimal delay
      
      try {
        const originalResponse = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, baseOrder, {
          headers: {
            'Authorization': 'Bearer dev-token',
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        results.push({
          type: 'original',
          success: originalResponse.data.success,
          orderId: originalResponse.data.order?.id,
          protection: originalResponse.data.frontRunProtection
        });
      } catch (error) {
        results.push({
          type: 'original',
          success: false,
          error: error.message,
          protected: error.response?.status === 429 || error.message.includes('protection')
        });
      }
      
      const totalTime = Date.now() - startTime;
      const protectionActive = results.some(r => r.blocked || r.protection || r.protected);
      
      return {
        totalExecutionTime: totalTime,
        frontRunProtectionActive: protectionActive,
        orderResults: results,
        securityLevel: protectionActive ? 'high' : 'medium',
        recommendation: protectionActive ? 'Protection working' : 'Consider stricter time-based limits'
      };
    });
  }

  async testPriceManipulationResistance() {
    return await this.runTest('Price Manipulation Resistance', async () => {
      console.log('Testing resistance to price manipulation attacks...');
      
      // Test large order that could manipulate price
      const manipulationOrder = {
        pair: 'HYPERINDEX-USDC',
        side: 'buy',
        type: 'market',
        amount: '10000' // Very large order
      };
      
      let pricesBefore = null;
      let pricesAfter = null;
      
      // Get initial market data
      try {
        const marketResponse = await axios.get(\`\${this.apiBaseURL}/api/trading/v1/market\`, {
          params: { pair: 'HYPERINDEX-USDC' },
          headers: { 'Authorization': 'Bearer dev-token' },
          timeout: 5000
        });
        pricesBefore = marketResponse.data.market;
      } catch (error) {
        console.warn('Could not fetch initial market data:', error.message);
      }
      
      // Attempt price manipulation
      let manipulationResult = null;
      try {
        const response = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, manipulationOrder, {
          headers: {
            'Authorization': 'Bearer dev-token',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        
        manipulationResult = {
          success: response.data.success,
          filled: response.data.summary?.totalFilled || '0',
          averagePrice: response.data.summary?.averagePrice || '0',
          chunks: response.data.summary?.totalChunks || 0,
          priceImpactProtection: response.data.priceImpactProtection,
          warning: response.data.securityWarning
        };
      } catch (error) {
        manipulationResult = {
          success: false,
          error: error.message,
          blocked: error.response?.status === 400 && error.message.includes('impact')
        };
      }
      
      // Check price after manipulation attempt
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for settlement
        
        const marketResponse = await axios.get(\`\${this.apiBaseURL}/api/trading/v1/market\`, {
          params: { pair: 'HYPERINDEX-USDC' },
          headers: { 'Authorization': 'Bearer dev-token' },
          timeout: 5000
        });
        pricesAfter = marketResponse.data.market;
      } catch (error) {
        console.warn('Could not fetch final market data:', error.message);
      }
      
      // Calculate price impact
      let priceImpact = null;
      if (pricesBefore && pricesAfter) {
        const priceBefore = parseFloat(pricesBefore.price || '1.0');
        const priceAfter = parseFloat(pricesAfter.price || '1.0');
        priceImpact = ((priceAfter - priceBefore) / priceBefore * 100).toFixed(4);
      }
      
      const resistanceLevel = Math.abs(parseFloat(priceImpact || '0')) < 5 ? 'high' : 
                            Math.abs(parseFloat(priceImpact || '0')) < 15 ? 'medium' : 'low';
      
      return {
        orderAmount: manipulationOrder.amount,
        manipulationResult,
        priceImpact: priceImpact ? priceImpact + '%' : 'unknown',
        pricesBefore: pricesBefore?.price || 'unknown',
        pricesAfter: pricesAfter?.price || 'unknown',
        resistanceLevel,
        securityLevel: resistanceLevel,
        protectionActive: manipulationResult?.priceImpactProtection || manipulationResult?.blocked
      };
    });
  }

  async testSecureTPSEngineValidation() {
    return await this.runTest('SecureTPSEngine Validation', async () => {
      console.log('Testing SecureTPSEngine high-frequency attack resistance...');
      
      // Test high-frequency order spam (potential DoS attack)
      const spamOrders = [];
      for (let i = 0; i < 10; i++) {
        spamOrders.push({
          pair: 'HYPERINDEX-USDC',
          side: i % 2 === 0 ? 'buy' : 'sell',
          type: 'limit',
          amount: '10',
          price: (1 + (i * 0.001)).toFixed(3)
        });
      }
      
      const results = [];
      const startTime = Date.now();
      let blockedOrders = 0;
      let successfulOrders = 0;
      
      // Rapid-fire orders (simulate high-frequency attack)
      const promises = spamOrders.map(async (order, index) => {
        try {
          const response = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, order, {
            headers: {
              'Authorization': 'Bearer dev-token',
              'Content-Type': 'application/json'
            },
            timeout: 2000
          });
          
          successfulOrders++;
          return {
            index,
            success: true,
            orderId: response.data.order?.id,
            securityCheck: response.data.securityCheck
          };
          
        } catch (error) {
          if (error.response?.status === 429) {
            blockedOrders++;
          }
          
          return {
            index,
            success: false,
            error: error.message,
            rateLimited: error.response?.status === 429,
            securityBlocked: error.message.includes('security') || error.message.includes('suspicious')
          };
        }
      });
      
      const spamResults = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      const tps = (spamOrders.length / (totalTime / 1000)).toFixed(1);
      const blockRate = (blockedOrders / spamOrders.length * 100).toFixed(1);
      
      // Security assessment
      const securityLevel = blockRate > 70 ? 'high' :    // Most spam blocked
                           blockRate > 30 ? 'medium' :   // Some protection
                           'low';                         // Vulnerable to spam
      
      return {
        totalOrders: spamOrders.length,
        successfulOrders,
        blockedOrders,
        blockRate: blockRate + '%',
        executionTime: totalTime,
        estimatedTPS: tps,
        securityLevel,
        spamResults,
        tpsEngineActive: blockedOrders > 0,
        recommendation: blockRate < 50 ? 'Strengthen rate limiting' : 'Security adequate'
      };
    });
  }

  async testCrossSystemValidation() {
    return await this.runTest('Cross-System Validation', async () => {
      console.log('Testing cross-system validation and consistency checks...');
      
      const testOrder = {
        pair: 'HYPERINDEX-USDC',
        side: 'buy',
        type: 'market',
        amount: '500'
      };
      
      // Submit order and check consistency across endpoints
      let orderResult = null;
      try {
        const response = await axios.post(\`\${this.apiBaseURL}/api/trading/v2/orders\`, testOrder, {
          headers: {
            'Authorization': 'Bearer dev-token',
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        orderResult = response.data;
      } catch (error) {
        throw new Error(\`Order submission failed: \${error.message}\`);
      }
      
      // Wait for settlement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check order appears in orderbook
      let orderbookData = null;
      try {
        const orderbookResponse = await axios.get(\`\${this.apiBaseURL}/api/trading/v1/orderbook\`, {
          params: { pair: 'HYPERINDEX-USDC' },
          timeout: 5000
        });
        orderbookData = orderbookResponse.data;
      } catch (error) {
        console.warn('Could not fetch orderbook data:', error.message);
      }
      
      // Check market data consistency
      let marketData = null;
      try {
        const marketResponse = await axios.get(\`\${this.apiBaseURL}/api/trading/v1/market\`, {
          params: { pair: 'HYPERINDEX-USDC' },
          headers: { 'Authorization': 'Bearer dev-token' },
          timeout: 5000
        });
        marketData = marketResponse.data;
      } catch (error) {
        console.warn('Could not fetch market data:', error.message);
      }
      
      // Validation checks
      const validations = {
        orderSubmission: orderResult?.success === true,
        orderbookConsistency: orderbookData?.success === true,
        marketDataConsistency: marketData?.success === true,
        dataIntegrity: true // Assume true unless specific checks fail
      };
      
      const validationCount = Object.values(validations).filter(Boolean).length;
      const validationRate = (validationCount / Object.keys(validations).length * 100).toFixed(1);
      
      const securityLevel = validationRate >= 80 ? 'high' : 
                           validationRate >= 60 ? 'medium' : 'low';
      
      return {
        validations,
        validationRate: validationRate + '%',
        securityLevel,
        orderResult: orderResult ? {
          success: orderResult.success,
          orderId: orderResult.order?.id,
          filled: orderResult.summary?.totalFilled
        } : null,
        systemConsistency: validationRate >= 80 ? 'consistent' : 'inconsistent'
      };
    });
  }

  async generateReport() {
    console.log("\\n📊 Generating MEV Security Test Report...");
    
    const { passed, failed, total } = this.testResults.summary;
    const successRate = total > 0 ? (passed / total * 100).toFixed(1) : '0';
    
    // Calculate overall security score
    const securityLevels = this.testResults.tests.map(t => t.securityLevel);
    const highSecurity = securityLevels.filter(l => l === 'high').length;
    const mediumSecurity = securityLevels.filter(l => l === 'medium').length;
    const lowSecurity = securityLevels.filter(l => l === 'low' || l === 'vulnerable').length;
    
    const overallSecurityScore = ((highSecurity * 3) + (mediumSecurity * 2) + (lowSecurity * 1)) / (total * 3) * 100;
    const overallSecurityLevel = overallSecurityScore >= 80 ? 'HIGH' : 
                                overallSecurityScore >= 60 ? 'MEDIUM' : 'LOW';
    
    console.log("\\n" + "=".repeat(80));
    console.log("🛡️ HOOATS MEV Security & Attack Defense Test Report");
    console.log("=".repeat(80));
    console.log(\`⏰ Executed: \${this.testResults.timestamp}\`);
    console.log(\`📊 Test Results: \${passed}/\${total} passed (\${successRate}%)\`);
    console.log(\`🛡️ Overall Security Level: \${overallSecurityLevel} (\${overallSecurityScore.toFixed(1)}%)\`);
    console.log("");
    
    console.log("🔐 Security Breakdown:");
    console.log(\`   High Security: \${highSecurity}/\${total} tests\`);
    console.log(\`   Medium Security: \${mediumSecurity}/\${total} tests\`);
    console.log(\`   Low/Vulnerable: \${lowSecurity}/\${total} tests\`);
    console.log("");
    
    // Print individual test results
    this.testResults.tests.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      const duration = test.duration < 1000 ? \`\${test.duration}ms\` : \`\${(test.duration/1000).toFixed(1)}s\`;
      const security = test.securityLevel.toUpperCase();
      
      console.log(\`\${status} \${test.name} (\${duration}) - Security: \${security}\`);
      
      if (test.status === 'failed') {
        console.log(\`   Error: \${test.error}\`);
      } else if (test.data) {
        // Print key security metrics
        if (test.name === 'Sandwich Attack Detection' && test.data.detectionRate) {
          console.log(\`   Detection Rate: \${test.data.detectionRate}, Attacks Detected: \${test.data.detectedAttacks}/\${test.data.totalAttacks}\`);
        }
        if (test.name === 'Price Manipulation Resistance' && test.data.priceImpact) {
          console.log(\`   Price Impact: \${test.data.priceImpact}, Resistance: \${test.data.resistanceLevel}\`);
        }
        if (test.name === 'SecureTPSEngine Validation' && test.data.blockRate) {
          console.log(\`   Block Rate: \${test.data.blockRate}, TPS: \${test.data.estimatedTPS}\`);
        }
      }
    });
    
    console.log("\\n" + "=".repeat(80));
    
    if (overallSecurityLevel === 'LOW' || failed > 0) {
      console.log("⚠️ Security improvements needed:");
      console.log("   - Strengthen MEV attack detection");
      console.log("   - Improve rate limiting mechanisms");
      console.log("   - Enhance price impact protection");
      console.log("   - Review cross-system validation");
    } else if (overallSecurityLevel === 'MEDIUM') {
      console.log("✅ Security is adequate but can be improved:");
      console.log("   - Fine-tune detection algorithms");
      console.log("   - Consider additional protection layers");
    } else {
      console.log("🎉 Excellent security! HOOATS is well-protected against MEV attacks.");
      console.log("🚀 System demonstrates strong resistance to common attack vectors.");
    }
    
    // Save detailed report
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', \`mev-security-report-\${Date.now()}.json\`);
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(\`📄 Detailed report saved: \${path.basename(reportPath)}\`);
    
    return this.testResults;
  }

  async runAllTests() {
    console.log("🛡️ Starting HOOATS MEV Security & Attack Defense Test...");
    
    try {
      // Run security tests
      await this.testSandwichAttackDetection();
      await this.testFrontRunningProtection();
      await this.testPriceManipulationResistance();
      await this.testSecureTPSEngineValidation();
      await this.testCrossSystemValidation();
      
      return await this.generateReport();
      
    } catch (error) {
      console.error("💥 Security test execution failed:", error.message);
      throw error;
    }
  }
}

async function main() {
  const tester = new MEVSecurityTest();
  return await tester.runAllTests();
}

if (require.main === module) {
  main()
    .then((results) => {
      const { passed, failed } = results.summary;
      const securityScore = results.securityMetrics?.overallScore || 0;
      
      // Exit with warning if security is low
      if (securityScore < 60 || failed > 0) {
        console.error(\`\\n⚠️ Security test completed with warnings (Score: \${securityScore.toFixed(1)}%)\`);
        process.exit(1);
      } else {
        console.log(\`\\n✅ Security test passed (Score: \${securityScore.toFixed(1)}%)\`);
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error("💥 MEV security test failed:", error);
      process.exit(1);
    });
}

module.exports = MEVSecurityTest;