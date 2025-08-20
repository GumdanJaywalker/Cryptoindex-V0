#!/usr/bin/env node

/**
 * HOOATS Standalone API Server (Mock Version)
 * 
 * 실제 HOOATS 로직을 시뮬레이션하는 Mock 버전
 * TypeScript 모듈 로딩 문제를 우회하여 빠른 테스트 환경 구축
 * 
 * Created: 2025-08-20
 */

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const Redis = require('ioredis');

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 3000;

// Redis 클라이언트 초기화
let redisClient;

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

// =============================================================================
// Mock HOOATS 클래스들 - 실제 로직을 시뮬레이션
// =============================================================================

/**
 * Mock HybridSmartRouterV2 - V2 하이브리드 라우팅 시뮬레이션
 */
class MockHybridSmartRouterV2 {
  static instance = null;
  
  static getInstance() {
    if (!MockHybridSmartRouterV2.instance) {
      MockHybridSmartRouterV2.instance = new MockHybridSmartRouterV2();
    }
    return MockHybridSmartRouterV2.instance;
  }

  async processHybridOrder(order) {
    console.log('🚀 Mock V2 Processing order:', order.id);
    
    // Mock 주문 처리 로직
    const amount = parseFloat(order.amount);
    const isMarketOrder = order.type === 'market';
    
    // Mock AMM 가격 계산
    const mockPrice = order.side === 'buy' ? '1.00050' : '0.99950';
    const priceImpact = Math.min(amount / 10000 * 0.1, 2.0); // Mock price impact
    
    // Mock 청크 분할 로직 (V2 특징)
    const chunkSize = Math.min(amount / 3, 1000); // 최대 3개 청크
    const chunks = [];
    let remaining = amount;
    let chunkIndex = 0;
    
    while (remaining > 0.01 && chunkIndex < 10) { // 최대 10번 반복 방지
      const chunkAmount = Math.min(remaining, chunkSize);
      const chunkSource = chunkIndex % 2 === 0 ? 'AMM' : 'Orderbook'; // 교대로 사용
      
      chunks.push({
        source: chunkSource,
        amount: chunkAmount.toString(),
        price: mockPrice,
        priceImpact: chunkSource === 'AMM' ? priceImpact : 0,
        chunkIndex: chunkIndex
      });
      
      remaining -= chunkAmount;
      chunkIndex++;
    }
    
    // Mock 거래 체결 생성
    const fills = chunks.map((chunk, index) => ({
      id: randomUUID(),
      orderId: order.id,
      price: chunk.price,
      amount: chunk.amount,
      side: order.side,
      source: chunk.source,
      timestamp: Date.now() + index,
      chunkIndex: chunk.chunkIndex,
      priceImpact: chunk.priceImpact || null,
      ammReservesBefore: chunk.source === 'AMM' ? { base: '1000000', quote: '1000000' } : null,
      ammReservesAfter: chunk.source === 'AMM' ? { base: '999000', quote: '1001000' } : null
    }));
    
    const totalFilled = fills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0);
    const weightedPriceSum = fills.reduce((sum, fill) => sum + (parseFloat(fill.price) * parseFloat(fill.amount)), 0);
    const averagePrice = (weightedPriceSum / totalFilled).toFixed(8);
    
    // Mock 실행 통계
    const executionStats = {
      totalChunks: chunks.length,
      ammChunks: chunks.filter(c => c.source === 'AMM').length,
      orderbookChunks: chunks.filter(c => c.source === 'Orderbook').length,
      iterations: chunks.length,
      totalGasUsed: chunks.length * 50000, // Mock gas
      avgPriceImpact: chunks.reduce((sum, c) => sum + (c.priceImpact || 0), 0) / chunks.length,
      executionTime: Math.random() * 100 + 50 // Mock execution time
    };
    
    console.log('✅ Mock V2 Order completed:', {
      orderId: order.id,
      totalFilled: totalFilled.toString(),
      averagePrice,
      chunks: chunks.length
    });
    
    return {
      fills,
      totalFilled: totalFilled.toString(),
      averagePrice,
      routing: chunks,
      executionStats,
      gasEstimate: (executionStats.totalGasUsed * 1.1).toString()
    };
  }
}

/**
 * Mock ParallelMatchingEngine - 병렬 매칭 엔진 시뮬레이션
 */
class MockParallelMatchingEngine {
  static instance = null;
  
  static getInstance() {
    if (!MockParallelMatchingEngine.instance) {
      MockParallelMatchingEngine.instance = new MockParallelMatchingEngine();
    }
    return MockParallelMatchingEngine.instance;
  }

  getMetrics() {
    return {
      queueUtilization: Math.random() * 0.3 + 0.1, // 10-40% 사용률
      tps: Math.floor(Math.random() * 5000 + 10000), // 10K-15K TPS
      shards: Array.from({ length: 4 }, (_, i) => ({
        id: i,
        utilization: Math.random() * 0.5 + 0.2
      })),
      latency: {
        p50: Math.random() * 10 + 5,
        p95: Math.random() * 20 + 20,
        p99: Math.random() * 30 + 40
      }
    };
  }

  async getOrderbook(pair, depth = 20) {
    // Mock 오더북 데이터 생성
    const bids = [];
    const asks = [];
    
    let basePrice = 1.0;
    
    // Mock bids (매수 주문)
    for (let i = 0; i < depth; i++) {
      const price = (basePrice - (i * 0.001)).toFixed(6);
      const amount = (Math.random() * 1000 + 100).toFixed(4);
      bids.push({ price, amount, total: amount });
    }
    
    // Mock asks (매도 주문)
    for (let i = 0; i < depth; i++) {
      const price = (basePrice + 0.001 + (i * 0.001)).toFixed(6);
      const amount = (Math.random() * 1000 + 100).toFixed(4);
      asks.push({ price, amount, total: amount });
    }
    
    return { bids, asks };
  }

  async getMarketData(pair) {
    const now = Date.now();
    return {
      pair,
      price: '1.00025',
      volume24h: (Math.random() * 1000000 + 500000).toFixed(2),
      change24h: ((Math.random() - 0.5) * 10).toFixed(2),
      high24h: '1.05',
      low24h: '0.95',
      lastUpdate: now,
      trades24h: Math.floor(Math.random() * 10000 + 5000)
    };
  }
}

/**
 * Mock UltraPerformanceOrderbook - 고성능 오더북 시뮬레이션
 */
class MockUltraPerformanceOrderbook {
  static instance = null;
  
  static getInstance() {
    if (!MockUltraPerformanceOrderbook.instance) {
      MockUltraPerformanceOrderbook.instance = new MockUltraPerformanceOrderbook();
    }
    return MockUltraPerformanceOrderbook.instance;
  }

  getMetrics() {
    return {
      tps: Math.floor(Math.random() * 8000 + 12000), // 12K-20K TPS
      latency: {
        p50: Math.random() * 5 + 2,
        p95: Math.random() * 15 + 10,
        p99: Math.random() * 25 + 20
      },
      memoryUsage: Math.random() * 500 + 200, // MB
      activeOrders: Math.floor(Math.random() * 5000 + 1000)
    };
  }
}

/**
 * Mock AsyncDBWriter - 비동기 DB 쓰기 시뮬레이션
 */
class MockAsyncDBWriter {
  static instance = null;
  
  static getInstance() {
    if (!MockAsyncDBWriter.instance) {
      MockAsyncDBWriter.instance = new MockAsyncDBWriter();
    }
    return MockAsyncDBWriter.instance;
  }

  queueOrderHistory(orderData) {
    console.log('📝 Mock DB Queue - Order History:', orderData.redis_order_id);
    // Mock DB 큐 처리 - 실제로는 PostgreSQL에 저장
    return Promise.resolve();
  }

  queueTradeHistory(tradeData) {
    console.log('📝 Mock DB Queue - Trade History:', tradeData.id);
    // Mock DB 큐 처리 - 실제로는 PostgreSQL에 저장
    return Promise.resolve();
  }
}

// =============================================================================
// Redis 연결 초기화
// =============================================================================

async function initializeRedis() {
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  };

  redisClient = new Redis(redisConfig);
  
  try {
    await redisClient.ping();
    console.log('✅ Redis connection established');
    return true;
  } catch (error) {
    console.warn('⚠️ Redis connection failed, using mock data:', error.message);
    redisClient = null;
    return false;
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
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {},
      mode: 'mock' // Mock 버전임을 표시
    };

    // Redis 연결 확인
    try {
      if (redisClient) {
        await redisClient.ping();
        health.services.redis = { status: 'connected' };
      } else {
        health.services.redis = { status: 'mock' };
      }
    } catch (error) {
      health.services.redis = { status: 'disconnected', error: error.message };
    }

    // Mock HOOATS 서비스 상태
    const matchingEngine = MockParallelMatchingEngine.getInstance();
    const metrics = matchingEngine.getMetrics();
    health.services.orderbook = { 
      status: 'active', 
      tps: metrics.tps,
      latency_p50: metrics.latency.p50
    };

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
    const matchingEngine = MockParallelMatchingEngine.getInstance();
    const metrics = matchingEngine.getMetrics();
    
    res.json({
      connected: redisClient !== null,
      mode: redisClient ? 'redis' : 'mock',
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
 * POST /api/trading/v2/orders - V2 하이브리드 주문 처리 (Mock 구현)
 */
app.post('/api/trading/v2/orders', devAuth, async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    // 요청 데이터 검증
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

    console.log('🚀 Mock V2 ORDER PROCESSING:', { 
      pair: pair || 'HYPERINDEX-USDC', 
      type, 
      side, 
      amount, 
      price 
    });

    // Mock HybridSmartRouterV2 사용
    const smartRouterV2 = MockHybridSmartRouterV2.getInstance();
    
    // V2 주문 객체 생성
    const orderId = randomUUID();
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

    // Mock V2 하이브리드 라우팅 실행
    const routingResult = await smartRouterV2.processHybridOrder(orderV2);

    // Mock AsyncDBWriter 사용
    const asyncDBWriter = MockAsyncDBWriter.getInstance();
    
    const filledAmount = parseFloat(routingResult.totalFilled);
    const status = filledAmount >= parseFloat(orderV2.amount) * 0.99 ? 'filled' : 'partial';
    
    // Mock DB 큐에 추가
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

    // Mock 거래 이력들을 큐에 추가
    if (routingResult.fills && routingResult.fills.length > 0) {
      routingResult.fills.forEach((fill) => {
        asyncDBWriter.queueTradeHistory({
          id: randomUUID(),
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

    console.log('✅ Mock V2 ORDER COMPLETED:', {
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
      },
      mode: 'mock' // Mock 버전임을 표시
    });

  } catch (error) {
    console.error('❌ Mock V2 Order processing error:', error);
    
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
 * GET /api/trading/v1/orderbook - Mock 오더북 조회
 */
app.get('/api/trading/v1/orderbook', async (req, res) => {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const pair = searchParams.get('pair') || 'HYPERINDEX-USDC';
    const depth = parseInt(searchParams.get('depth') || '20');

    // Mock ParallelMatchingEngine 사용
    const matchingEngine = MockParallelMatchingEngine.getInstance();
    const orderbook = await matchingEngine.getOrderbook(pair, depth);

    // 스프레드 계산
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
        lastUpdate: Date.now(),
        mode: 'mock'
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
 * GET /api/trading/v1/market - Mock 시장 데이터
 */
app.get('/api/trading/v1/market', devAuth, async (req, res) => {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const pair = searchParams.get('pair') || 'HYPERINDEX-USDC';

    // Mock ParallelMatchingEngine을 통해 시장 데이터 조회
    const matchingEngine = MockParallelMatchingEngine.getInstance();
    const marketData = await matchingEngine.getMarketData(pair);

    return res.json({
      success: true,
      market: { ...marketData, mode: 'mock' }
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
  console.log('🚀 Initializing Mock HOOATS Standalone API Server...');
  
  try {
    // Redis 연결 (선택사항)
    await initializeRedis();

    // Mock 인스턴스들 초기화
    console.log('🔧 Initializing Mock HOOATS services...');
    
    const smartRouter = MockHybridSmartRouterV2.getInstance();
    console.log('✅ Mock HybridSmartRouterV2 initialized');

    const matchingEngine = MockParallelMatchingEngine.getInstance();
    console.log('✅ Mock ParallelMatchingEngine initialized');

    const ultraOrderbook = MockUltraPerformanceOrderbook.getInstance();
    console.log('✅ Mock UltraPerformanceOrderbook initialized');

    const asyncDBWriter = MockAsyncDBWriter.getInstance();
    console.log('✅ Mock AsyncDBWriter initialized');

    console.log('🎉 All Mock HOOATS services initialized successfully');

  } catch (error) {
    console.error('💥 Mock HOOATS initialization failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// 서버 시작
async function startServer() {
  await initializeHOOATS();

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 Mock HOOATS Standalone API Server is running!');
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log('');
    console.log('🧪 Running in MOCK MODE - simulated HOOATS logic');
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
    console.log('🎯 Ready for Mock HOOATS testing!');
    console.log('   Run: npm run test:simple');
    console.log('');
  });
}

// 종료 처리
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Mock HOOATS server...');
  if (redisClient) {
    await redisClient.quit();
  }
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