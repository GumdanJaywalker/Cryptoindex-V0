#!/usr/bin/env node

/**
 * 🧪 Dynamic Routing Test
 * 
 * V3 동적 라우팅 vs 기존 순차 라우팅 비교
 * 
 * Created: 2025-08-20
 */

const { DynamicSmartRouterV3 } = require('../lib/trading/dynamic-router-v3');

async function testDynamicRouting() {
  console.log('🧠 Dynamic Routing V3 Test');
  console.log('=' .repeat(50));
  
  const router = DynamicSmartRouterV3.getInstance();
  await router.initialize();
  
  // 테스트 케이스들
  const testCases = [
    { name: 'Small Order', amount: '10', expected: 'Orderbook first' },
    { name: 'Medium Order', amount: '500', expected: 'Mixed routing' },
    { name: 'Large Order', amount: '2000', expected: 'AMM heavy' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📌 Testing: ${testCase.name} (${testCase.amount} USDC)`);
    
    const order = {
      id: `test_${Date.now()}`,
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'market',
      amount: testCase.amount
    };
    
    const result = await router.processOrder(order);
    
    console.log(`✅ Result: ${result.totalFilled} filled in ${result.executionStats.executionTime}ms`);
    console.log(`   Chunks: ${result.executionStats.totalChunks}`);
    console.log(`   AMM: ${result.executionStats.ammChunks}, Orderbook: ${result.executionStats.orderbookChunks}`);
    console.log(`   Average price: ${result.averagePrice}`);
    console.log(`   Routing method: ${result.executionStats.routingMethod}`);
  }
  
  console.log('\n🎯 Dynamic routing completed!');
}

testDynamicRouting().catch(console.error);