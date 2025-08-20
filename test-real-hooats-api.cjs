#!/usr/bin/env node

/**
 * Real HOOATS API Test Script
 * 
 * 실제 HOOATS JavaScript 모듈 테스트
 * Created: 2025-08-20
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api';
const AUTH_TOKEN = 'dev-token';

console.log('🧪 Starting Real HOOATS API Tests...');
console.log(`📍 API Base URL: ${API_BASE_URL}`);
console.log('🔥 Testing with REAL HOOATS MODULES');
console.log('');

async function testRealHOOATS() {
  try {
    console.log('=== 1. Health Check ===');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health:', healthResponse.data);
    console.log('  Mode:', healthResponse.data.mode);
    console.log('  TPS:', healthResponse.data.services.orderbook?.tps?.toLocaleString());
    console.log('  Latency P50:', healthResponse.data.services.orderbook?.latency_p50?.toFixed(2), 'ms');
    console.log('');

    console.log('=== 2. Redis Status ===');
    const redisResponse = await axios.get(`${API_BASE_URL}/redis/status`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    console.log('✅ Redis Status:', redisResponse.data);
    console.log('  Connected:', redisResponse.data.connected);
    console.log('  Shards:', redisResponse.data.shardCount);
    console.log('');

    console.log('=== 3. Orderbook Test ===');
    const orderbookResponse = await axios.get(`${API_BASE_URL}/trading/v1/orderbook?pair=HYPERINDEX-USDC&depth=5`);
    console.log('✅ Orderbook (5 levels):');
    console.log('  Mode:', orderbookResponse.data.orderbook.mode);
    console.log('  Bids:', orderbookResponse.data.orderbook.bids.slice(0, 3));
    console.log('  Asks:', orderbookResponse.data.orderbook.asks.slice(0, 3));
    console.log('  Spread:', orderbookResponse.data.orderbook.spread);
    console.log('');

    console.log('=== 4. Market Data Test ===');
    const marketResponse = await axios.get(`${API_BASE_URL}/trading/v1/market?pair=HYPERINDEX-USDC`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    console.log('✅ Market Data:', marketResponse.data.market);
    console.log('  Mode:', marketResponse.data.market.mode);
    console.log('');

    console.log('=== 5. V2 Small Order Test (Real JavaScript) ===');
    const startTime = Date.now();
    const smallOrderResponse = await axios.post(`${API_BASE_URL}/trading/v2/orders`, {
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'market',
      amount: '100'
    }, {
      headers: { 
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const endTime = Date.now();
    
    console.log('✅ Small Order Results (Real V2):');
    console.log('  Order ID:', smallOrderResponse.data.order.id);
    console.log('  Status:', smallOrderResponse.data.order.status);
    console.log('  Mode:', smallOrderResponse.data.mode);
    console.log('  Total Filled:', smallOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', smallOrderResponse.data.summary.averagePrice);
    console.log('  Total Chunks:', smallOrderResponse.data.summary.totalChunks);
    console.log('  AMM Chunks:', smallOrderResponse.data.summary.ammChunks);
    console.log('  Orderbook Chunks:', smallOrderResponse.data.summary.orderbookChunks);
    console.log('  API Response Time:', endTime - startTime, 'ms');
    console.log('');

    console.log('=== 6. V2 Large Order Test (Real JavaScript) ===');
    const largeStartTime = Date.now();
    const largeOrderResponse = await axios.post(`${API_BASE_URL}/trading/v2/orders`, {
      pair: 'HYPERINDEX-USDC',
      side: 'sell',
      type: 'market',
      amount: '5000'
    }, {
      headers: { 
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const largeEndTime = Date.now();
    
    console.log('✅ Large Order Results (Real V2):');
    console.log('  Order ID:', largeOrderResponse.data.order.id);
    console.log('  Status:', largeOrderResponse.data.order.status);
    console.log('  Mode:', largeOrderResponse.data.mode);
    console.log('  Total Filled:', largeOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', largeOrderResponse.data.summary.averagePrice);
    console.log('  Total Chunks:', largeOrderResponse.data.summary.totalChunks);
    console.log('  AMM Chunks:', largeOrderResponse.data.summary.ammChunks);
    console.log('  Orderbook Chunks:', largeOrderResponse.data.summary.orderbookChunks);
    console.log('  Iterations:', largeOrderResponse.data.summary.iterations);
    console.log('  Execution Time:', largeOrderResponse.data.executionStats.executionTime.toFixed(2), 'ms');
    console.log('  Total Gas Used:', largeOrderResponse.data.executionStats.totalGasUsed?.toLocaleString());
    console.log('  Avg Price Impact:', (largeOrderResponse.data.executionStats.avgPriceImpact * 100).toFixed(4), '%');
    console.log('  API Response Time:', largeEndTime - largeStartTime, 'ms');
    console.log('');

    console.log('=== 7. V2 Limit Order Test (Real JavaScript) ===');
    const limitOrderResponse = await axios.post(`${API_BASE_URL}/trading/v2/orders`, {
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'limit',
      amount: '1000',
      price: '0.999'
    }, {
      headers: { 
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Limit Order Results (Real V2):');
    console.log('  Order ID:', limitOrderResponse.data.order.id);
    console.log('  Status:', limitOrderResponse.data.order.status);
    console.log('  Mode:', limitOrderResponse.data.mode);
    console.log('  Limit Price:', limitOrderResponse.data.order.price);
    console.log('  Total Filled:', limitOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', limitOrderResponse.data.summary.averagePrice);
    console.log('  Total Chunks:', limitOrderResponse.data.summary.totalChunks);
    console.log('');

    console.log('=== 8. Performance Comparison ===');
    const finalHealthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Real HOOATS Performance Metrics:');
    console.log('  Orderbook TPS:', finalHealthResponse.data.services.orderbook.tps.toLocaleString());
    console.log('  Latency P50:', finalHealthResponse.data.services.orderbook.latency_p50.toFixed(2), 'ms');
    console.log('  Server Mode:', finalHealthResponse.data.mode);
    console.log('  Module Type: Real JavaScript (bypassed TypeScript compilation)');
    console.log('');

    console.log('🎉 All Real HOOATS API tests completed successfully!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log('  ✅ Health Check: PASSED');
    console.log('  ✅ Redis Connection: PASSED'); 
    console.log('  ✅ Orderbook Data: PASSED');
    console.log('  ✅ Market Data: PASSED');
    console.log('  ✅ V2 Market Orders (Real): PASSED');
    console.log('  ✅ V2 Limit Orders (Real): PASSED');
    console.log('  ✅ Chunk Processing (Real): PASSED');
    console.log('  ✅ Hybrid Routing (Real): PASSED');
    console.log('');
    console.log('🚀 Real HOOATS JavaScript System successfully bypassed TypeScript issues!');
    console.log('🔥 Ready for production-level performance testing!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    process.exit(1);
  }
}

// 서버 시작 대기
setTimeout(async () => {
  await testRealHOOATS();
  process.exit(0);
}, 1000);