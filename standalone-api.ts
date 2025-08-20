#!/usr/bin/env node

/**
 * HOOATS Standalone API Server
 * 
 * 실제 HOOATS 시스템을 테스트하기 위한 독립 API 서버
 * Next.js 빌드 문제를 우회하여 실제 lib 모듈들을 직접 사용
 * 
 * Created: 2025-08-19
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 설정
app.use(cors());
app.use(express.json());

// 로깅 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// 실제 HOOATS 모듈들을 동적으로 import
let HybridSmartRouterV2, ParallelMatchingEngine, UltraPerformanceOrderbook, AsyncDBWriter;
let extractPrivyAuthFromRequest;

/**
 * 개발용 인증 미들웨어 (Bearer dev-token)
 */
function devAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.substring(7);
  
  if (token === 'dev-token') {
    // 개발용 사용자 정보 설정
    req.user = {
      id: 'dev-user-123',
      email: 'dev@test.com'
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid token' });
}

/**
 * 실제 모듈들을 동적으로 로드
 */
async function loadHOOATSModules() {
  try {
    console.log('📦 Loading HOOATS modules...');

    // TypeScript 모듈들을 require로 로드
    const SmartRouterModule = require('./lib/trading/smart-router-v2');
    HybridSmartRouterV2 = SmartRouterModule.HybridSmartRouterV2;
    
    const ParallelMatchingModule = require('./lib/orderbook/parallel-matching-engine');
    ParallelMatchingEngine = ParallelMatchingModule.ParallelMatchingEngine;
    
    const UltraOrderbookModule = require('./lib/orderbook/ultra-performance-orderbook');
    UltraPerformanceOrderbook = UltraOrderbookModule.UltraPerformanceOrderbook;
    
    const AsyncDBModule = require('./lib/utils/async-db-writer');
    AsyncDBWriter = AsyncDBModule.AsyncDBWriter;

    const AuthModule = require('./lib/middleware/privy-auth');
    extractPrivyAuthFromRequest = AuthModule.extractPrivyAuthFromRequest;

    console.log('✅ HOOATS modules loaded successfully');
    
  } catch (error) {
    console.error('❌ Failed to load HOOATS modules:', error);
    throw error;
  }
}

// =============================================================================
// API 엔드포인트 정의 (실제 Next.js API 라우트와 동일)
// =============================================================================

/**
 * GET /api/health - 헬스체크
 */
app.get('/api/health', async (req, res) => {
  try {
    // 실제 health route 로직 구현
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {}
    };

    // Redis 연결 확인 (ParallelMatchingEngine 통해)
    try {
      const matchingEngine = ParallelMatchingEngine.getInstance();
      const metrics = matchingEngine.getMetrics();
      health.services.redis = { 
        status: 'connected', 
        queueUtilization: metrics.queueUtilization || 0
      };
    } catch (error) {
      health.services.redis = { status: 'disconnected', error: error.message };
      health.status = 'unhealthy';
    }

    // UltraPerformanceOrderbook 상태 확인
    try {
      const ultraOrderbook = UltraPerformanceOrderbook.getInstance();
      const metrics = ultraOrderbook.getMetrics();
      health.services.orderbook = { 
        status: 'active', 
        tps: metrics.tps || 0,
        latency_p50: metrics.latency?.p50 || 0
      };
    } catch (error) {
      health.services.orderbook = { status: 'error', error: error.message };
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      error: error.message
    });
  }
});

/**
 * GET /api/redis/status - Redis 상태 확인
 */
app.get('/api/redis/status', devAuth, async (req, res) => {
  try {
    const matchingEngine = ParallelMatchingEngine.getInstance();
    const metrics = matchingEngine.getMetrics();
    
    res.json({
      connected: true,
      mode: 'standalone',
      metrics: metrics,
      queueUtilization: metrics.queueUtilization,
      shardCount: metrics.shards?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});

/**
 * POST /api/trading/v2/orders - V2 하이브리드 주문 처리 (실제 구현)
 */
app.post('/api/trading/v2/orders', devAuth, async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    // 요청 데이터 검증 (실제 Next.js API와 동일)
    const { pair, type, side, amount, price } = body;

    if (!pair || !type || !side || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (type === 'limit' && !price) {
      return res.status(400).json({
        success: false,
        error: 'Price is required for limit orders'
      });
    }

    console.log('🚀 V2 ORDER PROCESSING:', { 
      pair: pair || 'HYPERINDEX-USDC', 
      type, 
      side, 
      amount, 
      price 
    });

    // 실제 HybridSmartRouterV2 사용
    const smartRouterV2 = HybridSmartRouterV2.getInstance();
    
    // V2 주문 객체 생성 - UUID 생성 (실제 로직과 동일)
    const orderId = require('crypto').randomUUID();
    const orderV2 = {
      id: orderId,
      userId: user.id,
      pair: pair || 'HYPERINDEX-USDC',
      side: side,
      type: type,
      amount: amount.toString(),
      price: price ? price.toString() : '0',
      remaining: amount.toString(),
      status: 'active',
      timestamp: Date.now()
    };

    // 실제 V2 하이브리드 라우팅 실행
    const routingResult = await smartRouterV2.processHybridOrder(orderV2);

    // 실제 AsyncDBWriter 사용하여 PostgreSQL 저장
    const asyncDBWriter = AsyncDBWriter.getInstance();
    
    const filledAmount = parseFloat(routingResult.totalFilled);
    const status = filledAmount >= parseFloat(orderV2.amount) * 0.99 ? 'filled' : 'partial';
    
    // 실제 DB 큐에 추가 (기존 로직과 동일)
    asyncDBWriter.queueOrderHistory({
      user_id: user.id,
      pair: orderV2.pair,
      side: orderV2.side,
      order_type: orderV2.type,
      price: orderV2.type === 'limit' ? parseFloat(orderV2.price) : 
             (routingResult.averagePrice ? parseFloat(routingResult.averagePrice) : null),
      amount: parseFloat(orderV2.amount),
      filled_amount: filledAmount,
      status: status,
      redis_order_id: orderV2.id
    });

    // 거래 이력들을 큐에 추가 (실제 로직과 동일)
    if (routingResult.fills && routingResult.fills.length > 0) {
      routingResult.fills.forEach((fill) => {
        asyncDBWriter.queueTradeHistory({
          id: require('crypto').randomUUID(),
          pair: orderV2.pair,
          buyer_order_id: orderV2.side === 'buy' ? orderV2.id : (fill.source === 'AMM' ? 'amm' : null),
          seller_order_id: orderV2.side === 'sell' ? orderV2.id : (fill.source === 'AMM' ? 'amm' : null),
          price: parseFloat(fill.price),
          amount: parseFloat(fill.amount),
          side: orderV2.side,
          source: fill.source || 'unknown',
          buyer_fee: 0,
          seller_fee: 0,
          price_impact: fill.priceImpact || null,
          amm_reserves_before: fill.ammReservesBefore || null,
          amm_reserves_after: fill.ammReservesAfter || null,
          redis_trade_id: fill.id || null
        });
      });
    }

    console.log('✅ V2 ORDER COMPLETED:', {
      orderId: orderV2.id,
      totalFilled: routingResult.totalFilled,
      averagePrice: routingResult.averagePrice,
      executionStats: routingResult.executionStats
    });

    // 응답 포맷 (실제 Next.js API와 동일)
    return res.json({
      success: true,
      order: {
        id: orderV2.id,
        pair: orderV2.pair,
        side: orderV2.side,
        type: orderV2.type,
        amount: orderV2.amount,
        price: orderV2.price,
        status: status,
        timestamp: orderV2.timestamp
      },
      routing: routingResult,
      executionStats: routingResult.executionStats,
      fills: routingResult.fills,
      summary: {
        totalFilled: routingResult.totalFilled,
        averagePrice: routingResult.averagePrice,
        totalChunks: routingResult.executionStats.totalChunks,
        ammChunks: routingResult.executionStats.ammChunks,
        orderbookChunks: routingResult.executionStats.orderbookChunks,
        iterations: routingResult.executionStats.iterations
      }
    });

  } catch (error) {
    console.error('❌ V2 Order processing error:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Limit price crosses market price')) {
        errorMessage = error.message;
        statusCode = 400;
      } else if (error.message.includes('Authentication')) {
        errorMessage = 'Authentication failed';
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/trading/v1/orderbook - 실제 오더북 조회
 */
app.get('/api/trading/v1/orderbook', async (req, res) => {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const pair = searchParams.get('pair') || 'HYPERINDEX-USDC';
    const depth = parseInt(searchParams.get('depth') || '20');

    // 실제 ParallelMatchingEngine 사용
    const matchingEngine = ParallelMatchingEngine.getInstance();
    const orderbook = await matchingEngine.getOrderbook(pair, depth);

    // 스프레드 계산 (실제 로직과 동일)
    let spread = null;
    if (orderbook.bids.length > 0 && orderbook.asks.length > 0) {
      const bestBid = parseFloat(orderbook.bids[0].price);
      const bestAsk = parseFloat(orderbook.asks[0].price);
      const spreadValue = bestAsk - bestBid;
      const spreadPercent = (spreadValue / bestBid) * 100;
      
      spread = {
        absolute: spreadValue.toFixed(9),
        percent: spreadPercent.toFixed(4)
      };
    }

    return res.json({
      success: true,
      orderbook: {
        pair,
        bids: orderbook.bids,
        asks: orderbook.asks,
        spread,
        lastUpdate: Date.now()
      }
    });

  } catch (error) {
    console.error('Orderbook fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/trading/v1/market - 실제 시장 데이터
 */
app.get('/api/trading/v1/market', devAuth, async (req, res) => {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const pair = searchParams.get('pair') || 'HYPERINDEX-USDC';

    // 실제 ParallelMatchingEngine을 통해 시장 데이터 조회
    const matchingEngine = ParallelMatchingEngine.getInstance();
    const marketData = await matchingEngine.getMarketData(pair);

    return res.json({
      success: true,
      market: marketData
    });

  } catch (error) {
    console.error('Market data fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// 서버 초기화 및 시작
// =============================================================================

async function initializeHOOATS() {
  console.log('🚀 Initializing HOOATS Standalone API Server...');
  
  try {
    // 실제 HOOATS 모듈들 로드
    await loadHOOATSModules();

    // 실제 인스턴스들 초기화
    console.log('🔧 Initializing HOOATS services...');
    
    const smartRouter = HybridSmartRouterV2.getInstance();
    console.log('✅ HybridSmartRouterV2 initialized');

    const matchingEngine = ParallelMatchingEngine.getInstance();
    console.log('✅ ParallelMatchingEngine initialized');

    const ultraOrderbook = UltraPerformanceOrderbook.getInstance();
    console.log('✅ UltraPerformanceOrderbook initialized');

    const asyncDBWriter = AsyncDBWriter.getInstance();
    console.log('✅ AsyncDBWriter initialized');

    console.log('🎉 All HOOATS services initialized successfully');

  } catch (error) {
    console.error('💥 HOOATS initialization failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// 서버 시작
async function startServer() {
  await initializeHOOATS();

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 HOOATS Standalone API Server is running!');
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/redis/status (auth required)');
    console.log('   POST /api/trading/v2/orders (auth required)');
    console.log('   GET  /api/trading/v1/orderbook');
    console.log('   GET  /api/trading/v1/market (auth required)');
    console.log('');
    console.log('🔑 Auth: Bearer dev-token');
    console.log('');
    console.log('🎯 Ready for HOOATS testing!');
    console.log('   Run: npm run test:simple');
    console.log('');
  });
}

// 종료 처리
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down HOOATS server...');
  console.log('✅ Server shutdown complete');
  process.exit(0);
});

// 예외 처리
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
if (require.main === module) {
  startServer().catch((error) => {
    console.error('💥 Failed to start server:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
}

module.exports = app;