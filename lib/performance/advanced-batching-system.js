#!/usr/bin/env node

/**
 * 🚀 Advanced Batching System - Intelligent Order Processing
 * 
 * Dynamic batch sizing based on market conditions
 * Priority queue for order urgency
 * Cross-shard load balancing
 * Predictive batch optimization
 * 
 * Created: 2025-08-22
 */

const { EventEmitter } = require('events');
const { UltraMemoryPoolManager } = require('../orderbook/ultra-memory-pool-manager');

class AdvancedBatchingSystem extends EventEmitter {
  static instance = null;
  
  constructor() {
    super();
    
    this.memoryPool = UltraMemoryPoolManager.getInstance();
    this.priorityQueues = {
      urgent: [],     // Market orders, liquidations
      high: [],       // Large limit orders  
      normal: [],     // Regular limit orders
      low: []         // Background operations
    };
    
    this.batchingConfig = {
      minBatchSize: 10,
      maxBatchSize: 500,
      targetLatency: 10, // ms
      adaptiveSizing: true,
      loadBalancing: true,
      priorityWeighting: true
    };
    
    this.dynamicSettings = {
      currentBatchSize: 50,
      batchTimeout: 5, // ms
      throughputTarget: 15000, // TPS
      latencyThreshold: 15, // ms
      loadThreshold: 0.8
    };
    
    this.shards = [];
    this.currentShard = 0;
    this.shardCount = 4;
    
    this.metrics = {
      totalBatchesProcessed: 0,
      averageBatchSize: 0,
      averageLatency: 0,
      throughputAchieved: 0,
      adaptiveAdjustments: 0,
      priorityDistribution: {
        urgent: 0,
        high: 0, 
        normal: 0,
        low: 0
      },
      shardUtilization: [],
      batchEfficiency: 0
    };
    
    this.isActive = false;
    this.initializeShards();
    this.startAdaptiveOptimizer();
    this.startMetricsCollection();
  }
  
  static getInstance() {
    if (!AdvancedBatchingSystem.instance) {
      AdvancedBatchingSystem.instance = new AdvancedBatchingSystem();
    }
    return AdvancedBatchingSystem.instance;
  }
  
  initializeShards() {
    console.log('🔧 Initializing Advanced Batching Shards...');
    
    for (let i = 0; i < this.shardCount; i++) {
      this.shards.push({
        id: i,
        queue: [],
        processing: false,
        load: 0,
        completedBatches: 0,
        averageLatency: 0,
        lastProcessed: Date.now(),
        worker: null // Will be assigned from memory pool workers
      });
    }
    
    this.metrics.shardUtilization = new Array(this.shardCount).fill(0);
    console.log(`✅ ${this.shardCount} processing shards initialized`);
  }
  
  start() {
    if (this.isActive) return;
    
    console.log('🚀 Starting Advanced Batching System...');
    
    this.isActive = true;
    this.startBatchProcessor();
    this.startPriorityManager();
    this.startLoadBalancer();
    
    console.log('✅ Advanced Batching System active');
  }
  
  stop() {
    this.isActive = false;
    console.log('📴 Advanced Batching System stopped');
  }
  
  // Priority-based order queuing
  enqueueOrder(order, priority = 'normal') {
    const orderObj = this.memoryPool.borrowOrder();
    
    // Copy order data to pooled object
    Object.assign(orderObj, order);
    orderObj.queuedAt = Date.now();
    orderObj.priority = priority;
    
    // Add to appropriate priority queue
    if (this.priorityQueues[priority]) {
      this.priorityQueues[priority].push(orderObj);
      this.metrics.priorityDistribution[priority]++;
    } else {
      this.priorityQueues.normal.push(orderObj);
      this.metrics.priorityDistribution.normal++;
    }
    
    // Trigger immediate processing for urgent orders
    if (priority === 'urgent' && this.priorityQueues.urgent.length >= 5) {
      this.processUrgentBatch();
    }
    
    return orderObj.id;
  }
  
  // Intelligent batch creation
  createOptimalBatch() {\n    const batch = [];\n    let batchSize = this.dynamicSettings.currentBatchSize;\n    \n    // Priority-weighted selection\n    const selections = {\n      urgent: Math.min(this.priorityQueues.urgent.length, Math.floor(batchSize * 0.4)),\n      high: Math.min(this.priorityQueues.high.length, Math.floor(batchSize * 0.3)),\n      normal: Math.min(this.priorityQueues.normal.length, Math.floor(batchSize * 0.2)),\n      low: Math.min(this.priorityQueues.low.length, Math.floor(batchSize * 0.1))\n    };\n    \n    // Fill batch with prioritized orders\n    for (const [priority, count] of Object.entries(selections)) {\n      for (let i = 0; i < count; i++) {\n        const order = this.priorityQueues[priority].shift();\n        if (order) {\n          batch.push(order);\n        }\n      }\n    }\n    \n    // Fill remaining space with any available orders\n    const remaining = batchSize - batch.length;\n    for (let i = 0; i < remaining; i++) {\n      const order = this.getNextAvailableOrder();\n      if (order) {\n        batch.push(order);\n      } else {\n        break;\n      }\n    }\n    \n    return batch;\n  }\n  \n  getNextAvailableOrder() {\n    // Check queues in priority order\n    const queues = ['urgent', 'high', 'normal', 'low'];\n    \n    for (const priority of queues) {\n      if (this.priorityQueues[priority].length > 0) {\n        return this.priorityQueues[priority].shift();\n      }\n    }\n    \n    return null;\n  }\n  \n  // Load balancing across shards\n  selectOptimalShard() {\n    if (!this.batchingConfig.loadBalancing) {\n      // Simple round-robin\n      const shard = this.currentShard;\n      this.currentShard = (this.currentShard + 1) % this.shardCount;\n      return shard;\n    }\n    \n    // Find shard with lowest load\n    let optimalShard = 0;\n    let lowestLoad = this.shards[0].load;\n    \n    for (let i = 1; i < this.shardCount; i++) {\n      if (this.shards[i].load < lowestLoad) {\n        lowestLoad = this.shards[i].load;\n        optimalShard = i;\n      }\n    }\n    \n    return optimalShard;\n  }\n  \n  async processBatch(batch, shardId) {\n    const shard = this.shards[shardId];\n    const startTime = Date.now();\n    \n    shard.processing = true;\n    shard.load += batch.length;\n    \n    try {\n      console.log(`📦 Processing batch: ${batch.length} orders on shard ${shardId}`);\n      \n      // Use memory pool for worker delegation\n      const results = await this.memoryPool.processOrdersBatch(batch);\n      \n      const processingTime = Date.now() - startTime;\n      \n      // Update shard metrics\n      shard.completedBatches++;\n      shard.averageLatency = (shard.averageLatency * 0.9) + (processingTime * 0.1);\n      shard.lastProcessed = Date.now();\n      shard.load = Math.max(0, shard.load - batch.length);\n      \n      // Update global metrics\n      this.metrics.totalBatchesProcessed++;\n      this.metrics.averageBatchSize = (this.metrics.averageBatchSize * 0.95) + (batch.length * 0.05);\n      this.metrics.averageLatency = (this.metrics.averageLatency * 0.95) + (processingTime * 0.05);\n      \n      // Calculate throughput\n      const tps = (batch.length * 1000) / processingTime;\n      this.metrics.throughputAchieved = (this.metrics.throughputAchieved * 0.9) + (tps * 0.1);\n      \n      console.log(`✅ Batch complete: ${batch.length} orders, ${processingTime}ms, ${Math.floor(tps)} TPS`);\n      \n      // Return orders to memory pool\n      for (const order of batch) {\n        this.memoryPool.returnOrder(order);\n      }\n      \n      // Return results to memory pool\n      for (const result of results) {\n        if (result.reset) {\n          this.memoryPool.returnResult(result);\n        }\n      }\n      \n      this.emit('batch_processed', {\n        shardId,\n        batchSize: batch.length,\n        processingTime,\n        tps: Math.floor(tps),\n        results: results.length\n      });\n      \n      return results;\n      \n    } catch (error) {\n      console.error(`❌ Batch processing error on shard ${shardId}:`, error.message);\n      \n      // Return orders to appropriate queues for retry\n      for (const order of batch) {\n        if (order.priority && this.priorityQueues[order.priority]) {\n          this.priorityQueues[order.priority].unshift(order);\n        } else {\n          this.priorityQueues.normal.unshift(order);\n        }\n      }\n      \n      throw error;\n      \n    } finally {\n      shard.processing = false;\n    }\n  }\n  \n  async processUrgentBatch() {\n    if (this.priorityQueues.urgent.length === 0) return;\n    \n    const urgentBatch = this.priorityQueues.urgent.splice(0, 10);\n    const optimalShard = this.selectOptimalShard();\n    \n    console.log(`🚨 Processing urgent batch: ${urgentBatch.length} orders`);\n    \n    try {\n      await this.processBatch(urgentBatch, optimalShard);\n    } catch (error) {\n      console.error('❌ Urgent batch processing failed:', error.message);\n    }\n  }\n  \n  startBatchProcessor() {\n    const processBatches = async () => {\n      if (!this.isActive) return;\n      \n      const totalQueueSize = Object.values(this.priorityQueues)\n        .reduce((sum, queue) => sum + queue.length, 0);\n      \n      if (totalQueueSize >= this.batchingConfig.minBatchSize) {\n        const batch = this.createOptimalBatch();\n        \n        if (batch.length > 0) {\n          const optimalShard = this.selectOptimalShard();\n          \n          // Don't wait for completion - fire and forget for max throughput\n          this.processBatch(batch, optimalShard).catch(console.error);\n        }\n      }\n      \n      // Adaptive timing based on queue size and latency\n      const nextTimeout = this.calculateOptimalTimeout(totalQueueSize);\n      setTimeout(processBatches, nextTimeout);\n    };\n    \n    setTimeout(processBatches, this.dynamicSettings.batchTimeout);\n  }\n  \n  calculateOptimalTimeout(queueSize) {\n    if (queueSize > 1000) return 1; // 1ms for heavy load\n    if (queueSize > 100) return 3;  // 3ms for medium load\n    if (queueSize > 10) return 5;   // 5ms for light load\n    return 10; // 10ms for idle\n  }\n  \n  startPriorityManager() {\n    setInterval(() => {\n      if (!this.isActive) return;\n      \n      // Age-based priority escalation\n      const now = Date.now();\n      const escalationThreshold = 30000; // 30 seconds\n      \n      // Escalate old normal orders to high priority\n      for (let i = this.priorityQueues.normal.length - 1; i >= 0; i--) {\n        const order = this.priorityQueues.normal[i];\n        if (now - order.queuedAt > escalationThreshold) {\n          this.priorityQueues.normal.splice(i, 1);\n          this.priorityQueues.high.push(order);\n          \n          console.log(`⬆️ Escalated order ${order.id} to high priority`);\n        }\n      }\n      \n      // Escalate old high orders to urgent\n      for (let i = this.priorityQueues.high.length - 1; i >= 0; i--) {\n        const order = this.priorityQueues.high[i];\n        if (now - order.queuedAt > escalationThreshold * 2) {\n          this.priorityQueues.high.splice(i, 1);\n          this.priorityQueues.urgent.push(order);\n          \n          console.log(`🚨 Escalated order ${order.id} to URGENT priority`);\n        }\n      }\n      \n    }, 5000); // Check every 5 seconds\n  }\n  \n  startLoadBalancer() {\n    setInterval(() => {\n      if (!this.isActive) return;\n      \n      // Calculate shard utilization\n      for (let i = 0; i < this.shardCount; i++) {\n        const shard = this.shards[i];\n        this.metrics.shardUtilization[i] = shard.processing ? shard.load / 100 : shard.load / 500;\n      }\n      \n      // Rebalance if needed (move orders from overloaded shards)\n      const avgUtilization = this.metrics.shardUtilization.reduce((a, b) => a + b) / this.shardCount;\n      \n      for (let i = 0; i < this.shardCount; i++) {\n        if (this.metrics.shardUtilization[i] > avgUtilization * 1.5) {\n          console.log(`⚖️ Shard ${i} overloaded (${this.metrics.shardUtilization[i].toFixed(2)}), rebalancing...`);\n          // Rebalancing logic could be implemented here\n        }\n      }\n      \n    }, 2000); // Check every 2 seconds\n  }\n  \n  startAdaptiveOptimizer() {\n    setInterval(() => {\n      if (!this.isActive || !this.batchingConfig.adaptiveSizing) return;\n      \n      const currentLatency = this.metrics.averageLatency;\n      const currentThroughput = this.metrics.throughputAchieved;\n      const targetLatency = this.dynamicSettings.latencyThreshold;\n      const targetThroughput = this.dynamicSettings.throughputTarget;\n      \n      let adjustment = 0;\n      \n      // Optimize for latency vs throughput trade-off\n      if (currentLatency > targetLatency && this.dynamicSettings.currentBatchSize > this.batchingConfig.minBatchSize) {\n        // Reduce batch size to improve latency\n        adjustment = -Math.ceil(this.dynamicSettings.currentBatchSize * 0.1);\n      } else if (currentThroughput < targetThroughput && this.dynamicSettings.currentBatchSize < this.batchingConfig.maxBatchSize) {\n        // Increase batch size to improve throughput\n        adjustment = Math.ceil(this.dynamicSettings.currentBatchSize * 0.05);\n      }\n      \n      if (adjustment !== 0) {\n        this.dynamicSettings.currentBatchSize = Math.max(\n          this.batchingConfig.minBatchSize,\n          Math.min(this.batchingConfig.maxBatchSize, this.dynamicSettings.currentBatchSize + adjustment)\n        );\n        \n        this.metrics.adaptiveAdjustments++;\n        \n        console.log(`🎯 Adaptive adjustment: batch size ${adjustment > 0 ? 'increased' : 'decreased'} to ${this.dynamicSettings.currentBatchSize}`);\n        console.log(`   Latency: ${currentLatency.toFixed(1)}ms, Throughput: ${currentThroughput.toFixed(0)} TPS`);\n      }\n      \n    }, 10000); // Optimize every 10 seconds\n  }\n  \n  startMetricsCollection() {\n    setInterval(() => {\n      // Calculate batch efficiency\n      const totalOrders = Object.values(this.priorityQueues)\n        .reduce((sum, queue) => sum + queue.length, 0);\n      \n      this.metrics.batchEfficiency = totalOrders > 0 \n        ? (this.metrics.averageBatchSize / this.dynamicSettings.currentBatchSize) * 100\n        : 100;\n      \n      // Emit metrics for monitoring\n      this.emit('metrics', {\n        ...this.metrics,\n        queueSizes: {\n          urgent: this.priorityQueues.urgent.length,\n          high: this.priorityQueues.high.length,\n          normal: this.priorityQueues.normal.length,\n          low: this.priorityQueues.low.length,\n          total: totalOrders\n        },\n        dynamicSettings: { ...this.dynamicSettings },\n        shards: this.shards.map(s => ({\n          id: s.id,\n          load: s.load,\n          processing: s.processing,\n          completedBatches: s.completedBatches,\n          averageLatency: Math.round(s.averageLatency)\n        }))\n      });\n      \n    }, 1000);\n  }\n  \n  getMetrics() {\n    const totalOrders = Object.values(this.priorityQueues)\n      .reduce((sum, queue) => sum + queue.length, 0);\n    \n    return {\n      ...this.metrics,\n      isActive: this.isActive,\n      queueSizes: {\n        urgent: this.priorityQueues.urgent.length,\n        high: this.priorityQueues.high.length,\n        normal: this.priorityQueues.normal.length,\n        low: this.priorityQueues.low.length,\n        total: totalOrders\n      },\n      settings: {\n        ...this.dynamicSettings,\n        ...this.batchingConfig\n      },\n      performance: {\n        avgLatency: Math.round(this.metrics.averageLatency),\n        avgThroughput: Math.round(this.metrics.throughputAchieved),\n        batchEfficiency: Math.round(this.metrics.batchEfficiency),\n        adaptiveAdjustments: this.metrics.adaptiveAdjustments\n      }\n    };\n  }\n  \n  async shutdown() {\n    console.log('📴 Shutting down Advanced Batching System...');\n    \n    this.stop();\n    \n    // Return all queued orders to memory pool\n    for (const queue of Object.values(this.priorityQueues)) {\n      for (const order of queue) {\n        this.memoryPool.returnOrder(order);\n      }\n      queue.length = 0;\n    }\n    \n    console.log('✅ Advanced Batching System shutdown complete');\n  }\n}\n\nmodule.exports = { AdvancedBatchingSystem };