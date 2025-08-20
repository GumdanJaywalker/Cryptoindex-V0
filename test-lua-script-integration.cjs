#!/usr/bin/env node

/**
 * Redis Lua Script Integration Test
 * 
 * 실제 Redis Lua Script 연동 테스트
 * Created: 2025-08-20
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api';
const AUTH_TOKEN = 'dev-token';

console.log('🔥 Testing Real HOOATS with Lua Scripts...');
console.log(`📍 API Base URL: ${API_BASE_URL}`);
console.log('');

async function testLuaScriptIntegration() {
  try {
    console.log('=== 1. Health Check with Lua Script Status ===');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health:', {
      status: healthResponse.data.status,
      mode: healthResponse.data.mode,
      orderbook_tps: healthResponse.data.services.orderbook?.tps?.toLocaleString(),
      latency_p50: healthResponse.data.services.orderbook?.latency_p50?.toFixed(2) + 'ms'
    });
    console.log('');

    console.log('=== 2. Redis Lua Script Test ===');
    const redisResponse = await axios.get(`${API_BASE_URL}/redis/status`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    console.log('✅ Redis with Lua Scripts:', {
      connected: redisResponse.data.connected,
      mode: redisResponse.data.mode,
      shards: redisResponse.data.shardCount,
      tps: redisResponse.data.metrics?.tps?.toLocaleString()
    });
    console.log('');

    console.log('=== 3. Real Redis Orderbook Query ===');
    const orderbookResponse = await axios.get(`${API_BASE_URL}/trading/v1/orderbook?pair=HYPERINDEX-USDC&depth=10`);
    console.log('✅ Real Redis Orderbook:', {
      mode: orderbookResponse.data.orderbook.mode,
      bids_count: orderbookResponse.data.orderbook.bids.length,
      asks_count: orderbookResponse.data.orderbook.asks.length,
      spread: orderbookResponse.data.orderbook.spread,
      sample_bid: orderbookResponse.data.orderbook.bids[0],
      sample_ask: orderbookResponse.data.orderbook.asks[0]
    });
    console.log('');

    console.log('=== 4. V2 Order with Lua Script Matching ===');
    const orderStartTime = Date.now();
    const orderResponse = await axios.post(`${API_BASE_URL}/trading/v2/orders`, {
      pair: 'HYPERINDEX-USDC',
      side: 'buy',
      type: 'market',
      amount: '1000'
    }, {
      headers: { 
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const orderEndTime = Date.now();
    
    console.log('✅ V2 Order with Lua Scripts:', {
      order_id: orderResponse.data.order.id,
      status: orderResponse.data.order.status,
      mode: orderResponse.data.mode,
      total_filled: orderResponse.data.summary.totalFilled,
      average_price: orderResponse.data.summary.averagePrice,
      total_chunks: orderResponse.data.summary.totalChunks,
      amm_chunks: orderResponse.data.summary.ammChunks,
      orderbook_chunks: orderResponse.data.summary.orderbookChunks,
      execution_time: orderResponse.data.executionStats.executionTime?.toFixed(2) + 'ms',
      api_response_time: (orderEndTime - orderStartTime) + 'ms'
    });
    console.log('');

    console.log('=== 5. Large Order Lua Script Performance ===');
    const largeOrderStartTime = Date.now();
    const largeOrderResponse = await axios.post(`${API_BASE_URL}/trading/v2/orders`, {
      pair: 'HYPERINDEX-USDC',
      side: 'sell',
      type: 'market',
      amount: '10000'
    }, {
      headers: { 
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const largeOrderEndTime = Date.now();
    
    console.log('✅ Large Order Lua Performance:', {
      total_filled: largeOrderResponse.data.summary.totalFilled,
      average_price: largeOrderResponse.data.summary.averagePrice,
      total_chunks: largeOrderResponse.data.summary.totalChunks,
      execution_time: largeOrderResponse.data.executionStats.executionTime?.toFixed(2) + 'ms',
      total_gas_used: largeOrderResponse.data.executionStats.totalGasUsed?.toLocaleString(),
      avg_price_impact: (largeOrderResponse.data.executionStats.avgPriceImpact * 100).toFixed(4) + '%',
      api_response_time: (largeOrderEndTime - largeOrderStartTime) + 'ms',
      lua_script_active: 'Checking...'
    });
    console.log('');

    console.log('=== 6. Final Performance Check ===');
    const finalHealthResponse = await axios.get(`${API_BASE_URL}/health`);
    const metrics = finalHealthResponse.data.services.orderbook;
    
    console.log('✅ Final Lua Script Performance:', {
      tps: metrics.tps?.toLocaleString(),
      latency_p50: metrics.latency_p50?.toFixed(2) + 'ms',
      mode: finalHealthResponse.data.mode,
      lua_script_integration: metrics.luaScriptActive ? 'ACTIVE' : 'FALLBACK'
    });
    console.log('');

    // Performance Assessment
    console.log('📊 REDIS LUA SCRIPT INTEGRATION ASSESSMENT:');
    if (finalHealthResponse.data.mode === 'real-hooats') {
      if (metrics.tps >= 15000) {
        console.log('   🚀 EXCELLENT: TPS target achieved with Lua Scripts');
      } else if (metrics.tps >= 12000) {
        console.log('   ⚡ GOOD: Strong performance, approaching target');
      } else {
        console.log('   📊 BASELINE: Working towards optimization');
      }
      
      if (metrics.luaScriptActive) {
        console.log('   ✅ Real Redis Lua Scripts are ACTIVE');
        console.log('   🔥 Ultra Performance Orderbook operational');
        console.log('   ⚡ Atomic matching with Redis scripts');
      } else {
        console.log('   ⚠️ Lua Scripts in FALLBACK mode');
        console.log('   💡 Performance could be higher with real Lua scripts');
      }
    } else {
      console.log('   ❌ System not running in real-hooats mode');
    }
    
    console.log('');
    console.log('🎉 Lua Script integration test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    process.exit(1);
  }
}

// 서버 시작 대기
setTimeout(async () => {
  await testLuaScriptIntegration();
  process.exit(0);
}, 2000);