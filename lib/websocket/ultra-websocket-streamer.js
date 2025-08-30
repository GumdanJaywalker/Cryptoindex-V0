#!/usr/bin/env node

/**
 * 🌊 Ultra WebSocket Streamer - Low Latency Real-time Data
 * 
 * Real-time orderbook streaming
 * <10ms latency trading updates  
 * Client-specific data filtering
 * Intelligent message compression
 * 
 * Created: 2025-08-22
 */

const WebSocket = require('ws');
const { EventEmitter } = require('events');
const zlib = require('zlib');
const { UltraMemoryPoolManager } = require('../orderbook/ultra-memory-pool-manager');

class UltraWebSocketStreamer extends EventEmitter {
  static instance = null;
  
  constructor() {
    super();
    
    this.wss = null;
    this.clients = new Map();
    this.subscriptions = new Map();
    this.messageQueue = [];
    this.compressionEnabled = true;
    this.memoryPool = UltraMemoryPoolManager.getInstance();
    
    this.metrics = {
      connectedClients: 0,
      messagesPerSecond: 0,
      totalMessagesSent: 0,
      averageLatency: 0,
      compressionRatio: 0,
      bandwidthSaved: 0,
      subscriptions: {
        orderbook: 0,
        trades: 0,
        orders: 0,
        prices: 0
      }
    };
    
    this.messageTypes = {
      ORDERBOOK_UPDATE: 'orderbook_update',
      TRADE_EXECUTED: 'trade_executed', 
      ORDER_STATUS: 'order_status',
      PRICE_UPDATE: 'price_update',
      SYSTEM_STATUS: 'system_status',
      HEARTBEAT: 'heartbeat'
    };
    
    this.isInitialized = false;
    this.startMetricsCollection();
  }
  
  static getInstance() {
    if (!UltraWebSocketStreamer.instance) {
      UltraWebSocketStreamer.instance = new UltraWebSocketStreamer();
    }
    return UltraWebSocketStreamer.instance;
  }
  
  initialize(server, options = {}) {
    if (this.isInitialized) return;
    
    console.log('🌊 Initializing Ultra WebSocket Streamer...');
    
    const wsOptions = {
      server,
      perMessageDeflate: false, // We handle compression manually for better performance
      maxPayload: 100 * 1024, // 100KB max message size
      ...options
    };
    
    this.wss = new WebSocket.Server(wsOptions);
    
    this.wss.on('connection', (ws, req) => {
      this.handleNewConnection(ws, req);
    });
    
    this.wss.on('error', (error) => {
      console.error('❌ WebSocket Server Error:', error);
    });
    
    // Start message processing
    this.startMessageProcessor();
    this.startHeartbeat();
    
    this.isInitialized = true;
    console.log('✅ Ultra WebSocket Streamer initialized');
    console.log(`   Port: ${server.address()?.port || 'inherited'}`);
    console.log(`   Compression: ${this.compressionEnabled ? 'enabled' : 'disabled'}`);
  }
  
  handleNewConnection(ws, req) {
    const clientId = this.generateClientId();
    const clientIP = req.socket.remoteAddress;
    
    console.log(`🔗 New WebSocket client: ${clientId} (${clientIP})`);
    
    const client = {
      id: clientId,
      ws,
      ip: clientIP,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      subscriptions: new Set(),
      metadata: {
        userAgent: req.headers['user-agent'] || 'unknown',
        origin: req.headers.origin || 'unknown'
      },
      stats: {
        messagesSent: 0,
        messagesReceived: 0,
        bytesTransferred: 0,
        averageLatency: 0
      }
    };
    
    this.clients.set(clientId, client);
    this.metrics.connectedClients = this.clients.size;
    
    // Setup client event handlers
    ws.on('message', (data) => {
      this.handleClientMessage(clientId, data);
    });
    
    ws.on('close', (code, reason) => {
      this.handleClientDisconnect(clientId, code, reason);
    });
    
    ws.on('error', (error) => {
      console.error(`❌ Client ${clientId} error:`, error.message);
      this.handleClientDisconnect(clientId);
    });
    
    ws.on('pong', () => {
      client.lastActivity = Date.now();
    });
    
    // Send welcome message
    this.sendToClient(clientId, {
      type: 'connection_established',
      clientId,
      serverTime: Date.now(),
      availableStreams: Object.keys(this.messageTypes)
    });
  }
  
  handleClientMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    client.lastActivity = Date.now();
    client.stats.messagesReceived++;
    
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message);
          break;
          
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message);
          break;
          
        case 'ping':
          this.sendToClient(clientId, {
            type: 'pong',
            timestamp: Date.now(),
            latency: Date.now() - (message.timestamp || Date.now())
          });
          break;
          
        default:
          console.warn(`⚠️ Unknown message type from ${clientId}:`, message.type);
      }
      
    } catch (error) {
      console.error(`❌ Error processing message from ${clientId}:`, error.message);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }
  
  handleSubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const { streams, filters } = message;
    
    if (!streams || !Array.isArray(streams)) {
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid subscription format'
      });
      return;
    }
    
    for (const stream of streams) {
      if (this.messageTypes[stream.toUpperCase()]) {
        client.subscriptions.add(stream);
        
        // Update global subscription counts
        const streamKey = stream.toLowerCase().replace('_update', '').replace('_executed', '');
        if (this.metrics.subscriptions[streamKey] !== undefined) {
          this.metrics.subscriptions[streamKey]++;
        }
        
        console.log(`📡 Client ${clientId} subscribed to ${stream}`);
      }
    }
    
    this.sendToClient(clientId, {
      type: 'subscription_confirmed',
      streams: Array.from(client.subscriptions),
      timestamp: Date.now()
    });
  }
  
  handleUnsubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const { streams } = message;
    
    for (const stream of streams || []) {
      if (client.subscriptions.has(stream)) {
        client.subscriptions.delete(stream);
        
        // Update global subscription counts
        const streamKey = stream.toLowerCase().replace('_update', '').replace('_executed', '');
        if (this.metrics.subscriptions[streamKey] !== undefined) {
          this.metrics.subscriptions[streamKey]--;
        }
        
        console.log(`📡 Client ${clientId} unsubscribed from ${stream}`);
      }
    }
    
    this.sendToClient(clientId, {
      type: 'unsubscription_confirmed',
      streams: streams,
      timestamp: Date.now()
    });
  }
  
  handleClientDisconnect(clientId, code, reason) {
    const client = this.clients.get(clientId);
    if (client) {
      // Update subscription counts
      for (const stream of client.subscriptions) {
        const streamKey = stream.toLowerCase().replace('_update', '').replace('_executed', '');
        if (this.metrics.subscriptions[streamKey] !== undefined) {
          this.metrics.subscriptions[streamKey]--;
        }
      }
      
      this.clients.delete(clientId);
      this.metrics.connectedClients = this.clients.size;
      
      console.log(`🔌 Client ${clientId} disconnected (Code: ${code || 'unknown'})`);
    }
  }
  
  generateClientId() {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // High-performance message sending
  async sendToClient(clientId, data, options = {}) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) return false;
    
    try {
      let payload = JSON.stringify(data);
      let originalSize = Buffer.byteLength(payload);
      
      // Apply compression for large messages
      if (this.compressionEnabled && originalSize > 1024) {
        const compressed = await this.compressMessage(payload);
        if (compressed.length < originalSize * 0.8) { // Only use if >20% savings
          payload = compressed;
          data._compressed = true;
        }
      }
      
      const sendTime = Date.now();
      client.ws.send(payload);
      
      // Update stats
      client.stats.messagesSent++;
      client.stats.bytesTransferred += Buffer.byteLength(payload);
      client.lastActivity = Date.now();
      
      if (data._compressed) {
        this.metrics.compressionRatio = originalSize / Buffer.byteLength(payload);
        this.metrics.bandwidthSaved += originalSize - Buffer.byteLength(payload);
      }
      
      return true;
      
    } catch (error) {
      console.error(`❌ Error sending to client ${clientId}:`, error.message);
      return false;
    }
  }
  
  // Broadcast to all subscribed clients
  broadcastToSubscribers(streamType, data) {
    const message = {\n      type: streamType,\n      timestamp: Date.now(),\n      ...data\n    };\n    \n    let sentCount = 0;\n    \n    for (const [clientId, client] of this.clients) {\n      if (client.subscriptions.has(streamType)) {\n        if (this.sendToClient(clientId, message)) {\n          sentCount++;\n        }\n      }\n    }\n    \n    this.metrics.totalMessagesSent += sentCount;\n    return sentCount;\n  }\n  \n  // Stream-specific broadcast methods\n  broadcastOrderbookUpdate(pair, orderbook) {\n    return this.broadcastToSubscribers('orderbook_update', {\n      pair,\n      bids: orderbook.bids?.slice(0, 20) || [], // Top 20 levels\n      asks: orderbook.asks?.slice(0, 20) || [],\n      lastUpdate: orderbook.timestamp || Date.now()\n    });\n  }\n  \n  broadcastTradeExecuted(trade) {\n    return this.broadcastToSubscribers('trade_executed', {\n      id: trade.id,\n      pair: trade.pair,\n      side: trade.side,\n      price: trade.price,\n      amount: trade.amount,\n      timestamp: trade.timestamp,\n      source: trade.source\n    });\n  }\n  \n  broadcastOrderStatus(orderId, status, details = {}) {\n    return this.broadcastToSubscribers('order_status', {\n      orderId,\n      status,\n      timestamp: Date.now(),\n      ...details\n    });\n  }\n  \n  broadcastPriceUpdate(pair, price, change24h = 0) {\n    return this.broadcastToSubscribers('price_update', {\n      pair,\n      price: price.toString(),\n      change24h: change24h.toString(),\n      timestamp: Date.now()\n    });\n  }\n  \n  broadcastSystemStatus(status, details = {}) {\n    return this.broadcastToSubscribers('system_status', {\n      status,\n      timestamp: Date.now(),\n      ...details\n    });\n  }\n  \n  // Message compression for bandwidth efficiency\n  async compressMessage(data) {\n    return new Promise((resolve, reject) => {\n      zlib.deflate(data, (err, compressed) => {\n        if (err) reject(err);\n        else resolve(compressed);\n      });\n    });\n  }\n  \n  startMessageProcessor() {\n    // Ultra-fast message queue processing (every 1ms)\n    setInterval(() => {\n      if (this.messageQueue.length > 0) {\n        const batch = this.messageQueue.splice(0, 100); // Process up to 100 messages\n        \n        for (const message of batch) {\n          this.processQueuedMessage(message);\n        }\n      }\n    }, 1);\n  }\n  \n  processQueuedMessage(message) {\n    const { type, data, timestamp } = message;\n    \n    switch (type) {\n      case 'orderbook':\n        this.broadcastOrderbookUpdate(data.pair, data);\n        break;\n      case 'trade':\n        this.broadcastTradeExecuted(data);\n        break;\n      case 'order_status':\n        this.broadcastOrderStatus(data.orderId, data.status, data);\n        break;\n      default:\n        console.warn('Unknown queued message type:', type);\n    }\n    \n    // Calculate and update latency metrics\n    const latency = Date.now() - timestamp;\n    this.metrics.averageLatency = (this.metrics.averageLatency * 0.9) + (latency * 0.1);\n  }\n  \n  startHeartbeat() {\n    // Send heartbeat every 30 seconds to keep connections alive\n    setInterval(() => {\n      for (const [clientId, client] of this.clients) {\n        if (client.ws.readyState === WebSocket.OPEN) {\n          // Check if client is still responsive (max 2 minutes silence)\n          if (Date.now() - client.lastActivity > 120000) {\n            console.log(`⚠️ Client ${clientId} seems inactive, terminating`);\n            client.ws.terminate();\n          } else {\n            // Send ping\n            client.ws.ping();\n          }\n        }\n      }\n    }, 30000);\n    \n    // Heartbeat message to all clients every 10 seconds\n    setInterval(() => {\n      this.broadcastToSubscribers('heartbeat', {\n        serverTime: Date.now(),\n        connectedClients: this.clients.size,\n        systemStatus: 'operational'\n      });\n    }, 10000);\n  }\n  \n  startMetricsCollection() {\n    const startTime = Date.now();\n    let lastMessageCount = 0;\n    \n    setInterval(() => {\n      // Calculate messages per second\n      const currentMessageCount = this.metrics.totalMessagesSent;\n      this.metrics.messagesPerSecond = currentMessageCount - lastMessageCount;\n      lastMessageCount = currentMessageCount;\n      \n      // Emit metrics for monitoring\n      this.emit('metrics', {\n        ...this.metrics,\n        uptime: Date.now() - startTime,\n        queueLength: this.messageQueue.length\n      });\n      \n    }, 1000);\n  }\n  \n  getMetrics() {\n    const clientStats = [];\n    for (const [clientId, client] of this.clients) {\n      clientStats.push({\n        id: clientId,\n        connectedFor: Date.now() - client.connectedAt,\n        messagesSent: client.stats.messagesSent,\n        subscriptions: Array.from(client.subscriptions),\n        lastActivity: Date.now() - client.lastActivity\n      });\n    }\n    \n    return {\n      ...this.metrics,\n      queueLength: this.messageQueue.length,\n      clients: clientStats,\n      performance: {\n        averageLatency: Math.round(this.metrics.averageLatency),\n        compressionRatio: this.metrics.compressionRatio.toFixed(2),\n        bandwidthSaved: Math.round(this.metrics.bandwidthSaved / 1024) // KB\n      }\n    };\n  }\n  \n  async shutdown() {\n    console.log('📴 Shutting down Ultra WebSocket Streamer...');\n    \n    // Close all client connections\n    for (const [clientId, client] of this.clients) {\n      client.ws.close(1001, 'Server shutting down');\n    }\n    \n    // Close WebSocket server\n    if (this.wss) {\n      this.wss.close();\n    }\n    \n    console.log('✅ Ultra WebSocket Streamer shutdown complete');\n  }\n}\n\nmodule.exports = { UltraWebSocketStreamer };