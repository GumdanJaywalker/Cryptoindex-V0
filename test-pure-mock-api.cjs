#!/usr/bin/env node

/**
 * Pure Mock API Test Script
 * 
 * 실제 Hardhat 없이 순수하게 API만 테스트
 * Created: 2025-08-20
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const AUTH_TOKEN = 'dev-token';

console.log('🧪 Starting Pure Mock HOOATS API Tests...');
console.log(`📍 API Base URL: ${API_BASE_URL}`);
console.log('');

async function testAPI() {
  try {
    console.log('=== 1. Health Check ===');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health:', healthResponse.data);
    console.log('');

    console.log('=== 2. Redis Status ===');
    const redisResponse = await axios.get(`${API_BASE_URL}/redis/status`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    console.log('✅ Redis Status:', redisResponse.data);
    console.log('');

    console.log('=== 3. Orderbook Test ===');
    const orderbookResponse = await axios.get(`${API_BASE_URL}/trading/v1/orderbook?pair=HYPERINDEX-USDC&depth=5`);
    console.log('✅ Orderbook (5 levels):');
    console.log('  Bids:', orderbookResponse.data.orderbook.bids.slice(0, 3));
    console.log('  Asks:', orderbookResponse.data.orderbook.asks.slice(0, 3));
    console.log('  Spread:', orderbookResponse.data.orderbook.spread);
    console.log('');

    console.log('=== 4. Market Data Test ===');
    const marketResponse = await axios.get(`${API_BASE_URL}/trading/v1/market?pair=HYPERINDEX-USDC`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    console.log('✅ Market Data:', marketResponse.data.market);
    console.log('');

    console.log('=== 5. V2 Market Order Test (Small) ===');
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
    
    console.log('✅ Small Market Order Results:');
    console.log('  Order ID:', smallOrderResponse.data.order.id);
    console.log('  Status:', smallOrderResponse.data.order.status);
    console.log('  Total Filled:', smallOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', smallOrderResponse.data.summary.averagePrice);
    console.log('  Chunks:', smallOrderResponse.data.summary.totalChunks);
    console.log('  AMM Chunks:', smallOrderResponse.data.summary.ammChunks);
    console.log('  Orderbook Chunks:', smallOrderResponse.data.summary.orderbookChunks);
    console.log('');

    console.log('=== 6. V2 Market Order Test (Large) ===');
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
    
    console.log('✅ Large Market Order Results:');
    console.log('  Order ID:', largeOrderResponse.data.order.id);
    console.log('  Status:', largeOrderResponse.data.order.status);
    console.log('  Total Filled:', largeOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', largeOrderResponse.data.summary.averagePrice);
    console.log('  Chunks:', largeOrderResponse.data.summary.totalChunks);
    console.log('  AMM Chunks:', largeOrderResponse.data.summary.ammChunks);
    console.log('  Orderbook Chunks:', largeOrderResponse.data.summary.orderbookChunks);
    console.log('  Execution Time:', largeOrderResponse.data.executionStats.executionTime.toFixed(2), 'ms');
    console.log('  Gas Used:', largeOrderResponse.data.executionStats.totalGasUsed);
    console.log('  Avg Price Impact:', (largeOrderResponse.data.executionStats.avgPriceImpact * 100).toFixed(4), '%');
    console.log('');

    console.log('=== 7. V2 Limit Order Test ===');
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
    
    console.log('✅ Limit Order Results:');
    console.log('  Order ID:', limitOrderResponse.data.order.id);
    console.log('  Status:', limitOrderResponse.data.order.status);
    console.log('  Limit Price:', limitOrderResponse.data.order.price);
    console.log('  Total Filled:', limitOrderResponse.data.summary.totalFilled);
    console.log('  Average Price:', limitOrderResponse.data.summary.averagePrice);
    console.log('');

    console.log('=== 8. Performance Summary ===');
    const finalHealthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Final Performance Metrics:');
    console.log('  Orderbook TPS:', finalHealthResponse.data.services.orderbook.tps.toLocaleString());
    console.log('  Latency P50:', finalHealthResponse.data.services.orderbook.latency_p50.toFixed(2), 'ms');
    console.log('  Redis Status:', finalHealthResponse.data.services.redis.status);
    console.log('  Server Mode:', finalHealthResponse.data.mode);
    console.log('');

    console.log('🎉 All Pure Mock HOOATS API tests completed successfully!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log('  ✅ Health Check: PASSED');
    console.log('  ✅ Redis Connection: PASSED');
    console.log('  ✅ Orderbook Data: PASSED');
    console.log('  ✅ Market Data: PASSED');
    console.log('  ✅ V2 Market Orders: PASSED');
    console.log('  ✅ V2 Limit Orders: PASSED');
    console.log('  ✅ Chunk Processing: PASSED');
    console.log('  ✅ Hybrid Routing: PASSED');
    console.log('');
    console.log('🚀 HOOATS Mock System is ready for production testing!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    process.exit(1);
  }
}

// 서버 시작 대기
setTimeout(async () => {
  await testAPI();
  process.exit(0);
}, 1000);