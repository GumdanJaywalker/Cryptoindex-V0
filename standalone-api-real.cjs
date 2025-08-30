#!/usr/bin/env node

/**
 * HOOATS Real API Server (TypeScript Module Loading)
 * 
 * 실제 HOOATS TypeScript 모듈들을 로딩하는 버전
 * ts-node를 사용하여 TypeScript 모듈을 직접 실행
 * 
 * Created: 2025-08-20
 */

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const Redis = require('ioredis');
const { getInstance: getConnectionPoolManager } = require('./lib/performance/connection-pool-manager');
const { getInstance: getHOOATSBatchProcessor } = require('./lib/performance/hooats-batch-processor');
const path = require('path');

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 3002;

// Connection Pool Manager 초기화
let connectionPool;

// HOOATS Batch Processor 초기화  
let batchProcessor;

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
    req.user = {
      id: 'dev-user-123',
      email: 'dev@test.com'
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid token' });
}

// 실제 HOOATS 모듈들을 동적으로 import
let HybridSmartRouterV2, ParallelMatchingEngine, UltraPerformanceOrderbook, AsyncDBWriter;
let extractPrivyAuthFromRequest;

/**
 * 실제 TypeScript 모듈들을 동적으로 로드
 */
async function loadRealHOOATSModules() {
  try {
    console.log('📦 Loading Real HOOATS JavaScript modules...');

    // JavaScript 버전 직접 로드 (TypeScript 컴파일 문제 우회)
    const projectRoot = process.cwd();
    
    // 모든 모듈을 하나의 JavaScript 파일에서 로드
    try {
      console.log('🔄 Loading HOOATS modules...');
      const smartRouterPath = path.join(projectRoot, 'lib/trading/smart-router-v2.js');
      delete require.cache[smartRouterPath];
      const RouterModule = require(smartRouterPath);
      
      HybridSmartRouterV2 = RouterModule.HybridSmartRouterV2;
      ParallelMatchingEngine = RouterModule.ParallelMatchingEngine;
      UltraPerformanceOrderbook = RouterModule.UltraPerformanceOrderbook;
      AsyncDBWriter = RouterModule.AsyncDBWriter;
      
      console.log('✅ All HOOATS modules loaded from JavaScript version');
    } catch (error) {
      console.error('❌ Failed to load HOOATS modules:', error.message);
      throw error;
    }

    // Auth Module 스킵 (개발 환경에서는 dev-token 사용)
    console.log('⚠️ Auth Module skipped (using dev-token only)');
    extractPrivyAuthFromRequest = null;

    console.log('🎉 All Real HOOATS modules loaded successfully');
    
  } catch (error) {
    console.error('💥 Failed to load Real HOOATS modules:', error);
    console.error('💥 Stack:', error.stack);
    throw error;
  }
}

// =============================================================================
// Redis 연결 초기화
// =============================================================================

async function initializeRedis() {
  console.log('🚀 Initializing High-Performance Connection Pool...');
  
  try {
    connectionPool = getConnectionPoolManager();
    const success = await connectionPool.initialize();
    
    if (success) {
      console.log('✅ Connection Pool initialized successfully');
      return true;
    } else {
      console.warn('⚠️ Connection Pool initialization failed, using fallback');
      return false;
    }
  } catch (error) {
    console.error('❌ Connection Pool initialization error:', error.message);
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
      mode: 'real-hooats'
    };

    // Connection Pool 상태 확인
    try {
      if (connectionPool) {
        const poolMetrics = connectionPool.getMetrics();
        await connectionPool.executeRedis('ping');
        health.services.redis = { 
          status: 'connected',
          poolSize: poolMetrics.poolSize,
          healthyConnections: poolMetrics.healthyConnections,
          poolUtilization: poolMetrics.connectionUtilization,
          avgResponseTime: poolMetrics.averageResponseTime + 'ms',
          totalRequests: poolMetrics.totalRequests
        };
      } else {
        health.services.redis = { status: 'disconnected' };
      }
    } catch (error) {
      health.services.redis = { status: 'error', error: error.message };
    }

    // 실제 UltraPerformanceOrderbook 상태 확인
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
    
    // Connection Pool 메트릭스 추가
    let poolMetrics = {};
    if (connectionPool) {
      poolMetrics = connectionPool.getMetrics();
    }
    
    res.json({
      connected: connectionPool !== null,
      mode: connectionPool ? 'redis-pool' : 'fallback',
      metrics: metrics,
      queueUtilization: metrics.queueUtilization,
      shardCount: metrics.shards?.length || 0,
      connectionPool: {
        poolSize: poolMetrics.poolSize || 0,
        healthyConnections: poolMetrics.healthyConnections || 0,
        totalRequests: poolMetrics.totalRequests || 0,
        avgResponseTime: poolMetrics.averageResponseTime || 0,
        poolUtilization: poolMetrics.connectionUtilization || '0%'
      }
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

    console.log('🚀 REAL V2 BATCH ORDER PROCESSING:', { 
      pair: pair || 'HYPERINDEX-USDC', 
      type, 
      side, 
      amount, 
      price 
    });

    // 🚀 High-Performance Batch Processing 사용
    if (!batchProcessor) {
      return res.status(500).json({
        success: false,
        error: 'Batch processor not initialized'
      });
    }
    
    const orderId = randomUUID();
    const orderV2 = {
      id: orderId,
      userId: user.id,
      pair: pair || 'HYPERINDEX-USDC',
      side: side,
      type: type,
      amount: amount.toString(),
      price: price ? price.toString() : '0',
      status: 'active',
      timestamp: Date.now()
    };

    // 🚀 Batch Processing으로 고성능 처리
    console.log(`⚡ Adding order ${orderId} to batch processor...`);
    const batchResult = await batchProcessor.addOrder(orderV2);
    
    console.log(`✅ Order ${orderId} processed via batch system:`, {
      status: batchResult.status,
      summary: batchResult.summary
    });

    // Handle batch result data structure
    const routingResult = batchResult.result || batchResult;
    const orderStatus = batchResult.status || 'completed';

    // Queue trade history if fills exist
    if (routingResult.fills && routingResult.fills.length > 0) {
      const asyncDBWriter = AsyncDBWriter.getInstance();
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

    console.log('✅ REAL V2 BATCH ORDER COMPLETED:', {
      orderId: orderV2.id,
      totalFilled: routingResult.totalFilled || 0,
      averagePrice: routingResult.averagePrice || 0,
      executionStats: routingResult.executionStats || {},
      batchStatus: batchResult.status
    });

    return res.json({
      success: true,
      order: {
        id: orderV2.id,
        pair: orderV2.pair,
        side: orderV2.side,
        type: orderV2.type,
        amount: orderV2.amount,
        price: orderV2.price,
        status: orderStatus,
        timestamp: orderV2.timestamp
      },
      routing: routingResult,
      executionStats: routingResult.executionStats || {},
      fills: routingResult.fills || [],
      summary: {
        totalFilled: routingResult.totalFilled || '0',
        averagePrice: routingResult.averagePrice || '0',
        totalChunks: routingResult.executionStats?.totalChunks || 0,
        ammChunks: routingResult.executionStats?.ammChunks || 0,
        orderbookChunks: routingResult.executionStats?.orderbookChunks || 0,
        iterations: routingResult.executionStats?.iterations || 0
      },
      batchProcessing: {
        status: batchResult.status,
        processingMode: 'high-performance-batch'
      },
      mode: 'real-hooats-v2-batch'
    });

  } catch (error) {
    console.error('❌ REAL V2 Order processing error:', error);
    
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

    const matchingEngine = ParallelMatchingEngine.getInstance();
    const orderbook = await matchingEngine.getOrderbook(pair, depth);

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
        mode: 'real-hooats'
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

    const matchingEngine = ParallelMatchingEngine.getInstance();
    const marketData = await matchingEngine.getMarketData(pair);

    return res.json({
      success: true,
      market: { ...marketData, mode: 'real-hooats' }
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

async function initializeRealHOOATS() {
  console.log('🚀 Initializing Real HOOATS API Server...');
  
  try {
    // JavaScript 모듈 직접 사용 (ts-node 불필요)
    // Redis 연결 (선택사항)
    await initializeRedis();

    // 실제 HOOATS TypeScript 모듈들 로드
    await loadRealHOOATSModules();

    // 실제 인스턴스들 초기화
    console.log('🔧 Initializing Real HOOATS services...');
    
    const smartRouter = HybridSmartRouterV2.getInstance();
    console.log('✅ Real HybridSmartRouterV2 initialized');

    const matchingEngine = ParallelMatchingEngine.getInstance();
    console.log('✅ Real ParallelMatchingEngine initialized');

    const ultraOrderbook = UltraPerformanceOrderbook.getInstance();
    console.log('✅ Real UltraPerformanceOrderbook initialized');

    const asyncDBWriter = AsyncDBWriter.getInstance();
    console.log('✅ Real AsyncDBWriter initialized');

    // 🚀 High-Performance Batch Processor 초기화
    console.log('🔧 Initializing HOOATS Batch Processor...');
    
    // 실제 스왑 실행 여부 확인
    const executeRealSwaps = process.env.EXECUTE_REAL_SWAPS === 'true';
    console.log(`🔗 Real swaps mode: ${executeRealSwaps ? 'ENABLED' : 'DISABLED'}`);
    
    batchProcessor = getHOOATSBatchProcessor({
      batchSize: parseInt(process.env.BATCH_SIZE) || 100,
      maxWaitTime: parseInt(process.env.MAX_WAIT_TIME) || 50, // 50ms for ultra-fast processing
      maxConcurrentBatches: parseInt(process.env.MAX_CONCURRENT_BATCHES) || 20,
      executeRealSwaps: executeRealSwaps
    });
    
    // HOOATS 컴포넌트들 연결
    batchProcessor.initializeComponents(smartRouter, connectionPool, asyncDBWriter);
    console.log('✅ HOOATS Batch Processor initialized with high-performance settings');

    console.log('🎉 All Real HOOATS services initialized successfully');

  } catch (error) {
    console.error('💥 Real HOOATS initialization failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// 서버 시작
async function startServer() {
  await initializeRealHOOATS();

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 Real HOOATS API Server is running!');
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log('');
    console.log('🔥 Running with REAL HOOATS MODULES');
    console.log('📋 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/redis/status (auth required)');
    console.log('   POST /api/trading/v2/orders (auth required)');
    console.log('   GET  /api/trading/v1/orderbook');
    console.log('   GET  /api/trading/v1/market (auth required)');
    console.log('');
    console.log('🔑 Auth: Bearer dev-token');
    console.log('🎯 Ready for Real HOOATS testing!');
    console.log('');
  });
}

// 종료 처리
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Real HOOATS server...');
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
    console.error('💥 Failed to start Real HOOATS server:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
}

module.exports = app;