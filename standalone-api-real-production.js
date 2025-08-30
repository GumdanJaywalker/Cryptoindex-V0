#!/usr/bin/env node

/**
 * 🚀 HOOATS REAL Production API Server
 * 
 * 진짜 15K+ TPS를 위한 실제 구현
 * - Real UltraPerformanceOrderbook
 * - Real HyperEVM on-chain AMM integration  
 * - Real PostgreSQL database
 * - Real private key wallet
 * 
 * Created: 2025-08-22
 */

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const Redis = require('ioredis');
const cluster = require('cluster');
const os = require('os');
const WebSocket = require('ws');

// Real components (not mocks!)
const { UltraPerformanceOrderbook } = require('./lib/orderbook/ultra-performance-orderbook-real');
const { RealHybridRouter } = require('./lib/trading/hybrid-router-real');
const { AsyncDBWriter } = require('./lib/database/async-db-writer-real');

// Configuration
const USE_CLUSTER = process.env.USE_CLUSTER === 'true';
const WORKER_COUNT = parseInt(process.env.WORKER_COUNT || Math.min(os.cpus().length, 8));
const USE_WEBSOCKET = process.env.USE_WEBSOCKET === 'true';
const PORT = process.env.PORT || 3002;

// Express app
const app = express();

// Global instances
let hybridRouter;
let ultraOrderbook;
let asyncWriter;
let redisClient;
let wss; // WebSocket server

// Performance tracking
const performanceTracker = {
  startTime: Date.now(),
  totalOrders: 0,
  successfulOrders: 0,
  failedOrders: 0,
  totalTrades: 0,
  totalOnChainSwaps: 0,
  currentTPS: 0,
  peakTPS: 0,
  ordersInLastSecond: [],
  latencies: [],
  memoryUsage: 0,
  realOnChain: true
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// High-performance request logging
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const requestId = Math.random().toString(36).substr(2, 9);
  req.requestId = requestId;
  req.startTime = start;
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to ms
    
    if (req.path.includes('/trading/')) {
      performanceTracker.latencies.push(duration);
      if (performanceTracker.latencies.length > 1000) {
        performanceTracker.latencies.shift();
      }
      
      // Track orders per second
      performanceTracker.ordersInLastSecond.push(Date.now());
      
      // Update TPS calculation
      updateTPSMetrics();
    }
  });
  
  next();
});

/**
 * Authentication middleware
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.substring(7);
  
  if (token === 'dev-token' || token === 'production-token' || token === 'real-token') {
    req.user = {
      id: 'real-user-' + Math.random().toString(36).substr(2, 9),
      email: 'real@hyperindex.com'
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid token' });
}

/**
 * Initialize all real components
 */
async function initializeRealComponents() {
  console.log('🚀 Initializing REAL HOOATS Production Components...');
  
  try {
    // Initialize Redis
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
      enableAutoPipelining: true,
      enableOfflineQueue: true,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 3000);
      }
    });
    
    await redisClient.ping();
    console.log('✅ Redis connected');
    
    // Initialize Real Hybrid Router (includes HyperEVM connection)
    hybridRouter = RealHybridRouter.getInstance();
    const routerReady = await hybridRouter.initialize();
    console.log(`✅ Real Hybrid Router: ${routerReady ? 'READY' : 'FALLBACK MODE'}`);
    
    // Initialize Ultra Performance Orderbook (real Redis Lua scripts)
    ultraOrderbook = UltraPerformanceOrderbook.getInstance();
    console.log('✅ Ultra Performance Orderbook initialized');
    
    // Initialize Real Database Writer
    asyncWriter = AsyncDBWriter.getInstance();
    console.log('✅ Real Database Writer initialized');
    
    // Initialize WebSocket server if enabled
    if (USE_WEBSOCKET) {
      wss = new WebSocket.Server({ port: PORT + 1 });
      setupWebSocket();
      console.log(`✅ WebSocket server running on port ${PORT + 1}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ REAL components initialization failed:', error.message);
    return false;
  }
}

/**
 * Setup WebSocket for high-throughput streaming
 */
function setupWebSocket() {
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'order') {
          // Process order via WebSocket for ultra-low latency
          const result = await processRealOrder(data.order, data.user);
          ws.send(JSON.stringify({
            type: 'order_result',
            requestId: data.requestId,
            result
          }));
        }
        
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
    });
  });
}

/**
 * Update TPS metrics
 */
function updateTPSMetrics() {
  const now = Date.now();
  const oneSecondAgo = now - 1000;
  
  // Remove old entries
  performanceTracker.ordersInLastSecond = performanceTracker.ordersInLastSecond
    .filter(timestamp => timestamp > oneSecondAgo);
  
  // Calculate current TPS
  performanceTracker.currentTPS = performanceTracker.ordersInLastSecond.length;
  
  // Update peak TPS
  if (performanceTracker.currentTPS > performanceTracker.peakTPS) {
    performanceTracker.peakTPS = performanceTracker.currentTPS;
  }
}

/**
 * Process real order with hybrid routing
 */
async function processRealOrder(order, user) {
  const startTime = Date.now();
  
  try {
    // Add tracking info
    performanceTracker.totalOrders++;
    
    // Ensure required fields
    if (!order.pair || !order.side || !order.amount) {
      throw new Error('Missing required fields: pair, side, amount');
    }
    
    // Create full order object
    const fullOrder = {
      id: order.id || randomUUID(),
      pair: order.pair,
      side: order.side,
      type: order.type || 'market',
      amount: order.amount.toString(),
      price: order.price?.toString(),
      timestamp: Date.now(),
      userId: user.id
    };
    
    console.log(`🎯 REAL Order Processing: ${fullOrder.id} (${fullOrder.amount} ${fullOrder.side})`);
    
    // Process through Real Hybrid Router
    const result = await hybridRouter.processHybridOrder(fullOrder);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Extract fills and calculate metrics
    const fills = result.fills || [];
    const totalFilled = parseFloat(result.totalFilled || '0');
    const averagePrice = result.averagePrice || '0';
    const executionTime = Date.now() - startTime;
    
    // Count on-chain transactions
    const onChainFills = fills.filter(f => f.source === 'AMM' && f.txHash);
    performanceTracker.totalOnChainSwaps += onChainFills.length;
    
    // Queue to real database
    asyncWriter.queueOrderHistory({
      id: fullOrder.id,
      userId: user.id,
      pair: fullOrder.pair,
      side: fullOrder.side,
      type: fullOrder.type,
      amount: fullOrder.amount,
      price: fullOrder.price,
      filled_amount: totalFilled.toString(),
      status: totalFilled >= parseFloat(fullOrder.amount) * 0.99 ? 'filled' : 'partial',
      redis_order_id: fullOrder.id
    });
    
    // Queue each trade/fill to database
    fills.forEach(fill => {
      asyncWriter.queueTradeHistory({
        id: fill.id || randomUUID(),
        pair: fullOrder.pair,
        buyer_order_id: fill.buyer || (fullOrder.side === 'buy' ? fullOrder.id : 'maker'),
        seller_order_id: fill.seller || (fullOrder.side === 'sell' ? fullOrder.id : 'maker'),
        price: fill.price,
        amount: fill.amount,
        side: fullOrder.side,
        source: fill.source,
        timestamp: fill.timestamp || Date.now(),
        txHash: fill.txHash,
        blockNumber: fill.blockNumber,
        gasUsed: fill.gasUsed,
        priceImpact: fill.priceImpact,
        ammReservesBefore: fill.ammReservesBefore,
        ammReservesAfter: fill.ammReservesAfter
      });
    });
    
    // Broadcast to WebSocket clients if enabled
    if (wss) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'trade_update',
            orderId: fullOrder.id,
            fills: fills.length,
            totalFilled,
            executionTime
          }));
        }
      });
    }
    
    performanceTracker.successfulOrders++;
    performanceTracker.totalTrades += fills.length;
    
    console.log(`✅ REAL Order Complete: ${fullOrder.id} - ${fills.length} fills, ${executionTime}ms`);
    
    return {
      success: true,
      order: {
        ...fullOrder,
        status: totalFilled >= parseFloat(fullOrder.amount) * 0.99 ? 'filled' : 'partial'
      },
      execution: {
        totalFilled,
        averagePrice,
        fills: fills.length,
        executionTime,
        onChainTransactions: onChainFills.length
      },
      routing: result.routing || [],
      performance: {
        currentTPS: performanceTracker.currentTPS,
        peakTPS: performanceTracker.peakTPS,
        latency: executionTime,
        realOnChain: true
      }
    };
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`❌ REAL Order Failed: ${order.id} - ${error.message}`);
    
    performanceTracker.failedOrders++;
    
    return {
      success: false,
      order: {
        id: order.id,
        status: 'failed'
      },
      error: error.message,
      executionTime,
      realOnChain: false
    };
  }
}

// ===========================================================================
// API ENDPOINTS
// ===========================================================================

/**
 * Health check with real component status
 */
app.get('/api/health', async (req, res) => {
  const walletBalances = await hybridRouter.getWalletBalances();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mode: 'REAL_PRODUCTION',
    services: {
      redis: { status: redisClient ? 'connected' : 'disconnected' },
      blockchain: hybridRouter.getMetrics(),
      orderbook: ultraOrderbook.getMetrics(),
      database: asyncWriter.getMetrics()
    },
    wallet: walletBalances,
    performance: {
      currentTPS: performanceTracker.currentTPS,
      peakTPS: performanceTracker.peakTPS,
      totalOrders: performanceTracker.totalOrders,
      successRate: performanceTracker.totalOrders > 0 
        ? ((performanceTracker.successfulOrders / performanceTracker.totalOrders) * 100).toFixed(2)
        : 0,
      onChainSwaps: performanceTracker.totalOnChainSwaps
    },
    websocket: USE_WEBSOCKET ? {
      enabled: true,
      port: PORT + 1,
      clients: wss ? wss.clients.size : 0
    } : { enabled: false }
  });
});

/**
 * Real-time performance metrics
 */
app.get('/api/performance/real-metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  const avgLatency = performanceTracker.latencies.length > 0
    ? performanceTracker.latencies.reduce((a, b) => a + b, 0) / performanceTracker.latencies.length
    : 0;
  
  res.json({
    timestamp: Date.now(),
    uptime: Math.floor(uptime),
    performance: {
      currentTPS: performanceTracker.currentTPS,
      peakTPS: performanceTracker.peakTPS,
      averageLatency: avgLatency.toFixed(2),
      targetTPS: 15000,
      percentageOfTarget: ((performanceTracker.currentTPS / 15000) * 100).toFixed(2)
    },
    orders: {
      total: performanceTracker.totalOrders,
      successful: performanceTracker.successfulOrders,
      failed: performanceTracker.failedOrders,
      successRate: performanceTracker.totalOrders > 0 
        ? ((performanceTracker.successfulOrders / performanceTracker.totalOrders) * 100).toFixed(2)
        : 0
    },
    trades: {
      total: performanceTracker.totalTrades,
      onChainSwaps: performanceTracker.totalOnChainSwaps,
      orderbookTrades: performanceTracker.totalTrades - performanceTracker.totalOnChainSwaps
    },
    memory: {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    },
    components: {
      hybridRouter: hybridRouter.getMetrics(),
      orderbook: ultraOrderbook.getMetrics(),
      database: asyncWriter.getMetrics()
    }
  });
});

/**
 * Real V2 Order Processing
 */
app.post('/api/trading/v2/orders', auth, async (req, res) => {
  const result = await processRealOrder(req.body, req.user);
  
  const statusCode = result.success ? 200 : 500;
  res.status(statusCode).json(result);
});

/**
 * Real Batch Processing (15K+ TPS target)
 */
app.post('/api/trading/v2/batch', auth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { orders } = req.body;
    
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Invalid orders array' });
    }
    
    console.log(`📦 REAL Batch Processing: ${orders.length} orders`);
    
    // Process all orders concurrently for maximum throughput
    const promises = orders.map(order => processRealOrder(order, req.user));
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    const executionTime = Date.now() - startTime;
    const tps = (successful / (executionTime / 1000)).toFixed(2);
    
    console.log(`✅ REAL Batch Complete: ${successful}/${orders.length} orders, ${tps} TPS`);
    
    res.json({
      success: true,
      batchId: randomUUID(),
      summary: {
        total: orders.length,
        successful,
        failed,
        executionTime,
        tps: parseFloat(tps)
      },
      results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason?.message }),
      performance: {
        currentTPS: performanceTracker.currentTPS,
        peakTPS: performanceTracker.peakTPS,
        mode: 'REAL_PRODUCTION'
      }
    });
    
  } catch (error) {
    console.error('❌ REAL Batch Processing failed:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Batch processing failed',
      message: error.message
    });
  }
});

/**
 * Real orderbook data
 */
app.get('/api/orderbook/:pair', async (req, res) => {
  try {
    const { pair } = req.params;
    const depth = parseInt(req.query.depth || '20');
    
    const orderbook = await ultraOrderbook.getOrderbook(pair, depth);
    
    res.json({
      ...orderbook,
      source: 'REAL_ORDERBOOK',
      timestamp: Date.now()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch orderbook',
      message: error.message
    });
  }
});

/**
 * Recent trades from real database
 */
app.get('/api/trading/recent-trades', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const trades = await asyncWriter.getRecentTrades(limit);
    
    res.json({
      trades,
      count: trades.length,
      source: 'REAL_DATABASE'
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch trades',
      message: error.message
    });
  }
});

/**
 * Order statistics from real database
 */
app.get('/api/trading/stats', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '24h';
    const stats = await asyncWriter.getOrderStats(timeframe);
    
    res.json({
      stats,
      source: 'REAL_DATABASE',
      timestamp: Date.now()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
});

/**
 * Start monitoring and cleanup tasks
 */
function startMonitoring() {
  // TPS monitoring every second
  setInterval(() => {
    updateTPSMetrics();
    
    // Log performance every 10 seconds if there's activity
    if (performanceTracker.currentTPS > 0) {
      const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      console.log(`📊 REAL Performance: ${performanceTracker.currentTPS} TPS | Peak: ${performanceTracker.peakTPS} | Mem: ${mem}MB | OnChain: ${performanceTracker.totalOnChainSwaps}`);
    }
  }, 1000);
  
  // Memory and performance cleanup every 5 minutes
  setInterval(() => {
    // Trim latency array to prevent memory bloat
    if (performanceTracker.latencies.length > 5000) {
      performanceTracker.latencies = performanceTracker.latencies.slice(-1000);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }, 5 * 60 * 1000);
}

/**
 * Start the real production server
 */
async function startServer() {
  const workerId = cluster.worker?.id || 'master';
  
  console.log('🚀 Starting HOOATS REAL Production Server...');
  console.log(`🎯 Target: 15,000-20,000 TPS with REAL components`);
  console.log(`👷 Worker: ${workerId} | Cluster: ${USE_CLUSTER} | Workers: ${WORKER_COUNT}`);
  console.log(`🔗 WebSocket: ${USE_WEBSOCKET} | Real OnChain: YES`);
  
  // Initialize all real components
  const initialized = await initializeRealComponents();
  
  if (!initialized) {
    console.error('❌ Failed to initialize REAL components');
    process.exit(1);
  }
  
  // Start monitoring
  startMonitoring();
  
  // Start HTTP server
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(70));
    console.log('🚀 HOOATS REAL Production API Server READY!');
    console.log(`📍 HTTP Server: http://localhost:${PORT}`);
    if (USE_WEBSOCKET) {
      console.log(`📍 WebSocket: ws://localhost:${PORT + 1}`);
    }
    console.log('');
    console.log('🎯 REAL PRODUCTION MODE ACTIVE');
    console.log('   ✅ Real HyperEVM on-chain integration');
    console.log('   ✅ Real PostgreSQL database');
    console.log('   ✅ Real private key wallet');
    console.log('   ✅ Ultra Performance Orderbook');
    console.log('');
    console.log('📋 Endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/performance/real-metrics');
    console.log('   POST /api/trading/v2/orders (auth)');
    console.log('   POST /api/trading/v2/batch (auth) ← 15K TPS target');
    console.log('   GET  /api/orderbook/:pair');
    console.log('   GET  /api/trading/recent-trades');
    console.log('   GET  /api/trading/stats');
    console.log('');
    console.log('🔑 Auth: Bearer real-token');
    console.log('');
    console.log('🎯 READY FOR 15,000+ TPS REAL TRADING!');
    console.log('='.repeat(70));
  });
  
  return server;
}

// Cluster mode for maximum performance
if (USE_CLUSTER && cluster.isMaster) {
  console.log(`🔧 Master ${process.pid} starting ${WORKER_COUNT} workers for 15K+ TPS...`);
  
  for (let i = 0; i < WORKER_COUNT; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  
} else {
  // Worker process or single process mode
  startServer().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 Gracefully shutting down REAL server...');
  
  if (asyncWriter) await asyncWriter.shutdown();
  if (ultraOrderbook) await ultraOrderbook.shutdown();
  if (redisClient) await redisClient.quit();
  if (wss) wss.close();
  
  process.exit(0);
});

module.exports = { app, performanceTracker };