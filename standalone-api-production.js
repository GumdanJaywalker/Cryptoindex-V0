#!/usr/bin/env node

/**
 * 🚀 HOOATS Production API Server
 * 
 * Real implementation with UltraPerformanceOrderbook
 * Target: 15,000-20,000 TPS
 * 
 * Created: 2025-08-22
 */

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const Redis = require('ioredis');
const cluster = require('cluster');
const os = require('os');

// Check if we should use cluster mode
const USE_CLUSTER = process.env.USE_CLUSTER === 'true';
const WORKER_COUNT = parseInt(process.env.WORKER_COUNT || os.cpus().length);

// Express app initialization
const app = express();
const PORT = process.env.PORT || 3001;

// Redis clients
let redisClient;
let redisPub;
let redisSub;

// HOOATS Components
const {
  HybridSmartRouterV2,
  ParallelMatchingEngine,
  UltraPerformanceOrderbook,
  AsyncDBWriter
} = require('./lib/trading/smart-router-v2-fixed');

// Component instances
let hybridRouter;
let parallelEngine;
let ultraOrderbook;
let asyncWriter;

// Performance metrics
const metrics = {
  startTime: Date.now(),
  totalOrders: 0,
  successfulOrders: 0,
  failedOrders: 0,
  totalTrades: 0,
  averageLatency: 0,
  latencies: [],
  currentTPS: 0,
  peakTPS: 0,
  lastTPSCalculation: Date.now(),
  ordersInLastSecond: []
};

// Middleware
app.use(cors());
app.use(express.json());

// Request logging with performance tracking
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = randomUUID();
  req.requestId = requestId;
  
  console.log(`[${requestId}] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${requestId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    // Track latency for performance metrics
    if (req.path.includes('/orders')) {
      metrics.latencies.push(duration);
      if (metrics.latencies.length > 1000) {
        metrics.latencies.shift(); // Keep last 1000 latencies
      }
      metrics.averageLatency = metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length;
    }
  });
  
  next();
});

/**
 * Development authentication middleware
 */
function devAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.substring(7);
  
  if (token === 'dev-token' || token === 'production-token') {
    req.user = {
      id: 'dev-user-123',
      email: 'dev@test.com'
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid token' });
}

/**
 * Initialize Redis connections
 */
async function initializeRedis() {
  console.log('🔄 Initializing Redis connections...');
  
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 100, 3000);
    },
    enableAutoPipelining: true,
    enableOfflineQueue: true
  };
  
  try {
    // Main client for general operations
    redisClient = new Redis(redisConfig);
    await redisClient.ping();
    console.log('✅ Redis main client connected');
    
    // Pub/Sub clients for real-time updates
    redisPub = new Redis(redisConfig);
    redisSub = new Redis(redisConfig);
    
    // Subscribe to trade events
    redisSub.subscribe('trades', 'orders', 'metrics');
    redisSub.on('message', (channel, message) => {
      handleRedisMessage(channel, message);
    });
    
    console.log('✅ Redis Pub/Sub initialized');
    return true;
    
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message);
    return false;
  }
}

/**
 * Handle Redis pub/sub messages
 */
function handleRedisMessage(channel, message) {
  try {
    const data = JSON.parse(message);
    
    switch (channel) {
      case 'trades':
        metrics.totalTrades++;
        console.log(`📊 New trade: ${data.id} - ${data.amount} @ ${data.price}`);
        break;
      case 'orders':
        console.log(`📝 Order update: ${data.id} - ${data.status}`);
        break;
      case 'metrics':
        updatePerformanceMetrics(data);
        break;
    }
  } catch (error) {
    console.error('Error handling Redis message:', error.message);
  }
}

/**
 * Initialize HOOATS components
 */
async function initializeHOOATS() {
  console.log('🚀 Initializing HOOATS Production Components...');
  
  try {
    // Initialize core components
    hybridRouter = HybridSmartRouterV2.getInstance();
    parallelEngine = ParallelMatchingEngine.getInstance();
    ultraOrderbook = UltraPerformanceOrderbook.getInstance();
    asyncWriter = AsyncDBWriter.getInstance();
    
    // Ensure Redis is connected for the router
    await hybridRouter.ensureRedisConnected();
    
    console.log('✅ HOOATS components initialized');
    console.log('📊 Target performance: 15,000-20,000 TPS');
    
    return true;
  } catch (error) {
    console.error('❌ HOOATS initialization failed:', error.message);
    return false;
  }
}

/**
 * Calculate current TPS
 */
function calculateTPS() {
  const now = Date.now();
  const oneSecondAgo = now - 1000;
  
  // Remove old entries
  metrics.ordersInLastSecond = metrics.ordersInLastSecond.filter(t => t > oneSecondAgo);
  
  // Calculate TPS
  metrics.currentTPS = metrics.ordersInLastSecond.length;
  
  // Update peak TPS
  if (metrics.currentTPS > metrics.peakTPS) {
    metrics.peakTPS = metrics.currentTPS;
  }
  
  metrics.lastTPSCalculation = now;
  
  return metrics.currentTPS;
}

/**
 * Update performance metrics
 */
function updatePerformanceMetrics(data) {
  if (data.tps) metrics.currentTPS = data.tps;
  if (data.latency) metrics.averageLatency = data.latency;
}

// ===========================================================================
// API ENDPOINTS
// ===========================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      redis: { status: redisClient ? 'connected' : 'disconnected' },
      orderbook: ultraOrderbook ? {
        status: 'active',
        ...ultraOrderbook.getMetrics()
      } : { status: 'inactive' }
    },
    mode: 'production',
    cluster: USE_CLUSTER ? {
      worker: cluster.worker?.id || 'master',
      workers: WORKER_COUNT
    } : null
  };
  
  res.json(health);
});

/**
 * Performance metrics endpoint
 */
app.get('/api/performance/metrics', (req, res) => {
  calculateTPS();
  
  const uptime = Date.now() - metrics.startTime;
  const successRate = metrics.totalOrders > 0 
    ? (metrics.successfulOrders / metrics.totalOrders * 100).toFixed(2)
    : 0;
  
  res.json({
    uptime: Math.floor(uptime / 1000),
    totalOrders: metrics.totalOrders,
    successfulOrders: metrics.successfulOrders,
    failedOrders: metrics.failedOrders,
    totalTrades: metrics.totalTrades,
    successRate: parseFloat(successRate),
    performance: {
      currentTPS: metrics.currentTPS,
      peakTPS: metrics.peakTPS,
      averageLatency: metrics.averageLatency.toFixed(2),
      targetTPS: 15000,
      percentageOfTarget: ((metrics.currentTPS / 15000) * 100).toFixed(2)
    },
    components: {
      router: hybridRouter?.getMetrics() || null,
      orderbook: ultraOrderbook?.getMetrics() || null,
      dbWriter: asyncWriter?.getMetrics() || null
    }
  });
});

/**
 * V2 Order processing endpoint (Production)
 */
app.post('/api/trading/v2/orders', devAuth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { pair, side, type, amount, price } = req.body;
    
    // Validate input
    if (!pair || !side || !type || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['pair', 'side', 'type', 'amount']
      });
    }
    
    // Create order object
    const order = {
      id: randomUUID(),
      pair,
      side,
      type,
      amount: amount.toString(),
      price: price?.toString() || (type === 'market' ? '0' : '1.0'),
      status: 'pending',
      timestamp: Date.now(),
      userId: req.user.id
    };
    
    // Track order for TPS calculation
    metrics.ordersInLastSecond.push(Date.now());
    metrics.totalOrders++;
    
    console.log(`🚀 Processing PRODUCTION order: ${order.id}`);
    
    // Process through UltraPerformanceOrderbook
    const result = await ultraOrderbook.processOrder(order);
    
    // Process trades - ensure it's an array
    const trades = Array.isArray(result.trades) ? result.trades : [];
    const totalFilled = trades.length > 0 
      ? trades.reduce((sum, trade) => sum + parseFloat(trade.amount || 0), 0)
      : 0;
    
    // Calculate average price
    let averagePrice = '0';
    if (totalFilled > 0 && trades.length > 0) {
      const weightedSum = trades.reduce((sum, trade) => 
        sum + (parseFloat(trade.price || 0) * parseFloat(trade.amount || 0)), 0
      );
      averagePrice = (weightedSum / totalFilled).toFixed(8);
    }
    
    // Queue to database
    asyncWriter.queueOrderHistory({
      redis_order_id: order.id,
      ...order,
      filled_amount: totalFilled.toString(),
      status: totalFilled >= parseFloat(amount) ? 'filled' : 'partial'
    });
    
    trades.forEach(trade => {
      asyncWriter.queueTradeHistory({
        id: trade.id,
        pair: order.pair,
        buyer_order_id: trade.buyer,
        seller_order_id: trade.seller,
        price: trade.price,
        amount: trade.amount,
        executed_at: new Date().toISOString()
      });
    });
    
    // Publish to Redis for real-time updates
    if (redisPub) {
      redisPub.publish('orders', JSON.stringify({
        id: order.id,
        status: 'processed',
        filled: totalFilled
      }));
      
      trades.forEach(trade => {
        redisPub.publish('trades', JSON.stringify(trade));
      });
    }
    
    metrics.successfulOrders++;
    
    const executionTime = Date.now() - startTime;
    
    // Build response
    res.json({
      success: true,
      order: {
        ...order,
        status: totalFilled >= parseFloat(amount) ? 'filled' : 
                result.remaining > 0 ? 'partial' : 'filled'
      },
      execution: {
        trades: trades.length,
        totalFilled: totalFilled.toString(),
        averagePrice,
        remaining: result.remaining?.toString() || '0',
        executionTime
      },
      performance: {
        currentTPS: calculateTPS(),
        latency: executionTime,
        mode: 'production'
      }
    });
    
  } catch (error) {
    console.error(`❌ Order processing error: ${error.message}`);
    metrics.failedOrders++;
    
    res.status(500).json({
      error: 'Order processing failed',
      message: error.message,
      requestId: req.requestId
    });
  }
});

/**
 * Batch order processing endpoint
 */
app.post('/api/trading/v2/batch', devAuth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { orders } = req.body;
    
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Invalid orders array' });
    }
    
    console.log(`📦 Processing batch of ${orders.length} orders`);
    
    // Add IDs and timestamps
    const processedOrders = orders.map(order => ({
      ...order,
      id: randomUUID(),
      timestamp: Date.now()
    }));
    
    // Track for TPS
    const now = Date.now();
    processedOrders.forEach(() => {
      metrics.ordersInLastSecond.push(now);
      metrics.totalOrders++;
    });
    
    // Process through ParallelMatchingEngine
    const results = await parallelEngine.processBatch(processedOrders);
    
    metrics.successfulOrders += results.filter(r => r.status === 'processed').length;
    metrics.failedOrders += results.filter(r => r.status !== 'processed').length;
    
    const executionTime = Date.now() - startTime;
    
    res.json({
      success: true,
      batchId: randomUUID(),
      processed: results.length,
      results,
      performance: {
        currentTPS: calculateTPS(),
        batchExecutionTime: executionTime,
        averageTimePerOrder: (executionTime / orders.length).toFixed(2)
      }
    });
    
  } catch (error) {
    console.error(`❌ Batch processing error: ${error.message}`);
    res.status(500).json({
      error: 'Batch processing failed',
      message: error.message
    });
  }
});

/**
 * Get orderbook snapshot
 */
app.get('/api/orderbook/:pair', async (req, res) => {
  try {
    const { pair } = req.params;
    const depth = parseInt(req.query.depth || '10');
    
    if (!redisClient) {
      return res.status(503).json({ error: 'Redis not available' });
    }
    
    // Get bids and asks from Redis
    const [bids, asks] = await Promise.all([
      redisClient.zrevrange(`orderbook:${pair}:buy`, 0, depth - 1, 'WITHSCORES'),
      redisClient.zrange(`orderbook:${pair}:sell`, 0, depth - 1, 'WITHSCORES')
    ]);
    
    // Format orderbook data
    const formatOrders = (orders, side) => {
      const formatted = [];
      for (let i = 0; i < orders.length; i += 2) {
        const orderId = orders[i];
        const price = Math.abs(parseFloat(orders[i + 1]));
        
        // Get order details
        redisClient.hgetall(`order:${orderId}`).then(details => {
          if (details && details.amount) {
            formatted.push({
              price: price.toFixed(8),
              amount: details.amount,
              total: (price * parseFloat(details.amount)).toFixed(8)
            });
          }
        });
      }
      return formatted;
    };
    
    res.json({
      pair,
      timestamp: Date.now(),
      bids: formatOrders(bids, 'buy'),
      asks: formatOrders(asks, 'sell'),
      spread: asks.length > 0 && bids.length > 0 
        ? (Math.abs(parseFloat(asks[1])) - Math.abs(parseFloat(bids[1]))).toFixed(8)
        : '0'
    });
    
  } catch (error) {
    console.error(`❌ Orderbook fetch error: ${error.message}`);
    res.status(500).json({
      error: 'Failed to fetch orderbook',
      message: error.message
    });
  }
});

/**
 * Start performance monitoring
 */
function startPerformanceMonitoring() {
  setInterval(() => {
    const tps = calculateTPS();
    
    if (tps > 0) {
      console.log(`📊 Current TPS: ${tps} | Peak: ${metrics.peakTPS} | Target: 15,000 | Progress: ${(tps/15000*100).toFixed(1)}%`);
    }
    
    // Publish metrics to Redis
    if (redisPub) {
      redisPub.publish('metrics', JSON.stringify({
        tps,
        latency: metrics.averageLatency,
        totalOrders: metrics.totalOrders,
        successRate: metrics.totalOrders > 0 
          ? (metrics.successfulOrders / metrics.totalOrders * 100).toFixed(2)
          : 0
      }));
    }
  }, 1000); // Update every second
}

/**
 * Initialize and start server
 */
async function startServer() {
  console.log('🚀 Starting HOOATS Production API Server...');
  console.log(`📊 Target Performance: 15,000-20,000 TPS`);
  console.log(`⚙️  Worker Threads: ${WORKER_COUNT}`);
  
  // Initialize components
  const redisReady = await initializeRedis();
  const hooatsReady = await initializeHOOATS();
  
  if (!redisReady || !hooatsReady) {
    console.error('❌ Failed to initialize required components');
    process.exit(1);
  }
  
  // Start performance monitoring
  startPerformanceMonitoring();
  
  // Start server
  app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('🚀 HOOATS Production API Server is running!');
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log('');
    console.log('🎯 Production Mode - Real Components Active');
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/performance/metrics');
    console.log('   POST /api/trading/v2/orders (auth required)');
    console.log('   POST /api/trading/v2/batch (auth required)');
    console.log('   GET  /api/orderbook/:pair');
    console.log('');
    console.log('🔑 Auth: Bearer dev-token or Bearer production-token');
    console.log('');
    console.log('🎯 Ready for HIGH-PERFORMANCE testing!');
    console.log('   Target: 15,000-20,000 TPS');
    console.log('='.repeat(60));
  });
}

// Cluster mode for maximum performance
if (USE_CLUSTER && cluster.isMaster) {
  console.log(`🔧 Master process ${process.pid} starting ${WORKER_COUNT} workers...`);
  
  // Fork workers
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
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 Shutting down gracefully...');
  
  if (redisClient) await redisClient.quit();
  if (redisPub) await redisPub.quit();
  if (redisSub) await redisSub.quit();
  
  process.exit(0);
});

module.exports = app;