/**
 * Parallel Matching Engine for Ultra-High Performance
 * Implements sharding and parallel processing for 20,000+ TPS
 */
import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import * as os from 'os';
import { UltraPerformanceOrderbook } from './ultra-performance-orderbook';
export class ParallelMatchingEngine extends EventEmitter {
    shards = new Map();
    pairToShard = new Map();
    taskQueue = new Map();
    orderbook;
    // Performance configuration
    SHARD_COUNT = os.cpus().length;
    MAX_QUEUE_SIZE = 10000;
    TASK_TIMEOUT = 100; // ms
    MAX_RETRIES = 3;
    // Metrics
    metrics = {
        tasksProcessed: 0,
        tasksQueued: 0,
        tasksFailed: 0,
        averageLatency: 0,
        shardUtilization: new Map()
    };
    constructor() {
        super();
        this.orderbook = new UltraPerformanceOrderbook();
        this.initializeShards();
        this.setupLoadBalancer();
    }
    /**
     * Initialize sharding system
     */
    async initializeShards() {
        const pairs = await this.getAllTradingPairs();
        const pairsPerShard = Math.ceil(pairs.length / this.SHARD_COUNT);
        for (let i = 0; i < this.SHARD_COUNT; i++) {
            const shardPairs = pairs.slice(i * pairsPerShard, (i + 1) * pairsPerShard);
            const worker = await this.createWorker(i);
            const shard = {
                id: i,
                pairs: shardPairs,
                worker,
                load: 0
            };
            this.shards.set(i, shard);
            // Map pairs to shards
            shardPairs.forEach(pair => {
                this.pairToShard.set(pair, i);
            });
            // Setup worker communication
            worker.on('message', (message) => {
                this.handleWorkerMessage(i, message);
            });
            worker.on('error', (error) => {
                this.handleWorkerError(i, error);
            });
        }
    }
    /**
     * Create a worker thread for matching
     */
    async createWorker(shardId) {
        const workerCode = `
      const { parentPort } = require('worker_threads');
      const { MatchingLogic } = require('./matching-logic');
      
      const matcher = new MatchingLogic();
      
      parentPort.on('message', async (task) => {
        try {
          const result = await matcher.matchOrder(task.order);
          parentPort.postMessage({
            type: 'MATCH_RESULT',
            taskId: task.id,
            result
          });
        } catch (error) {
          parentPort.postMessage({
            type: 'MATCH_ERROR',
            taskId: task.id,
            error: error.message
          });
        }
      });
    `;
        return new Worker(workerCode, {
            eval: true,
            workerData: { shardId }
        });
    }
    /**
     * Process order with automatic sharding
     */
    async processOrderParallel(order) {
        return new Promise((resolve, reject) => {
            const shardId = this.getShardForPair(order.pair);
            const shard = this.shards.get(shardId);
            if (!shard) {
                reject(new Error(`No shard available for pair ${order.pair}`));
                return;
            }
            // Check queue size
            if (this.taskQueue.size >= this.MAX_QUEUE_SIZE) {
                reject(new Error('Task queue is full'));
                return;
            }
            // Create task
            const task = {
                id: `${order.id}_${Date.now()}`,
                order,
                callback: resolve,
                timestamp: Date.now(),
                retries: 0
            };
            // Add to queue
            this.taskQueue.set(task.id, task);
            this.metrics.tasksQueued++;
            // Send to worker
            shard.worker.postMessage(task);
            shard.load++;
            // Set timeout
            setTimeout(() => {
                if (this.taskQueue.has(task.id)) {
                    this.handleTaskTimeout(task);
                }
            }, this.TASK_TIMEOUT);
        });
    }
    /**
     * Batch process multiple orders
     */
    async processBatch(orders) {
        // Group orders by shard
        const ordersByShard = new Map();
        for (const order of orders) {
            const shardId = this.getShardForPair(order.pair);
            if (!ordersByShard.has(shardId)) {
                ordersByShard.set(shardId, []);
            }
            ordersByShard.get(shardId).push(order);
        }
        // Process each shard's batch in parallel
        const promises = [];
        for (const [shardId, shardOrders] of ordersByShard) {
            promises.push(this.processBatchOnShard(shardId, shardOrders));
        }
        // Wait for all batches
        const results = await Promise.all(promises);
        return results.flat();
    }
    /**
     * Process batch on specific shard
     */
    async processBatchOnShard(shardId, orders) {
        const shard = this.shards.get(shardId);
        if (!shard)
            throw new Error(`Shard ${shardId} not found`);
        return new Promise((resolve, reject) => {
            const batchId = `batch_${Date.now()}_${shardId}`;
            const results = [];
            let completed = 0;
            const batchTask = {
                type: 'BATCH_MATCH',
                batchId,
                orders
            };
            // Setup batch response handler
            const handler = (message) => {
                if (message.batchId === batchId) {
                    results.push(...message.results);
                    completed += message.results.length;
                    if (completed >= orders.length) {
                        shard.worker.off('message', handler);
                        resolve(results);
                    }
                }
            };
            shard.worker.on('message', handler);
            shard.worker.postMessage(batchTask);
            // Batch timeout
            setTimeout(() => {
                shard.worker.off('message', handler);
                reject(new Error('Batch processing timeout'));
            }, this.TASK_TIMEOUT * orders.length);
        });
    }
    /**
     * Get shard ID for a trading pair
     */
    getShardForPair(pair) {
        // Use consistent hashing for better distribution
        let hash = 0;
        for (let i = 0; i < pair.length; i++) {
            hash = ((hash << 5) - hash) + pair.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % this.SHARD_COUNT;
    }
    /**
     * Handle message from worker
     */
    handleWorkerMessage(shardId, message) {
        const shard = this.shards.get(shardId);
        if (!shard)
            return;
        switch (message.type) {
            case 'MATCH_RESULT':
                this.handleMatchResult(message);
                shard.load = Math.max(0, shard.load - 1);
                break;
            case 'MATCH_ERROR':
                this.handleMatchError(message);
                shard.load = Math.max(0, shard.load - 1);
                break;
            case 'METRICS':
                this.updateShardMetrics(shardId, message.metrics);
                break;
        }
    }
    /**
     * Handle successful match result
     */
    handleMatchResult(message) {
        const task = this.taskQueue.get(message.taskId);
        if (!task)
            return;
        this.taskQueue.delete(message.taskId);
        this.metrics.tasksProcessed++;
        // Update latency
        const latency = Date.now() - task.timestamp;
        this.metrics.averageLatency =
            (this.metrics.averageLatency * (this.metrics.tasksProcessed - 1) + latency) /
                this.metrics.tasksProcessed;
        // Execute callback
        task.callback(message.result);
    }
    /**
     * Handle match error
     */
    handleMatchError(message) {
        const task = this.taskQueue.get(message.taskId);
        if (!task)
            return;
        task.retries++;
        if (task.retries < this.MAX_RETRIES) {
            // Retry on different shard
            const newShardId = (this.getShardForPair(task.order.pair) + 1) % this.SHARD_COUNT;
            const newShard = this.shards.get(newShardId);
            if (newShard) {
                newShard.worker.postMessage(task);
                newShard.load++;
            }
        }
        else {
            // Final failure
            this.taskQueue.delete(message.taskId);
            this.metrics.tasksFailed++;
            task.callback({
                success: false,
                trades: [],
                remaining: task.order.amount,
                error: message.error
            });
        }
    }
    /**
     * Handle worker error
     */
    handleWorkerError(shardId, error) {
        console.error(`Worker ${shardId} error:`, error);
        // Restart worker
        this.restartWorker(shardId);
    }
    /**
     * Restart failed worker
     */
    async restartWorker(shardId) {
        const shard = this.shards.get(shardId);
        if (!shard)
            return;
        // Terminate old worker
        await shard.worker.terminate();
        // Create new worker
        const newWorker = await this.createWorker(shardId);
        shard.worker = newWorker;
        shard.load = 0;
        // Re-setup communication
        newWorker.on('message', (message) => {
            this.handleWorkerMessage(shardId, message);
        });
        newWorker.on('error', (error) => {
            this.handleWorkerError(shardId, error);
        });
        console.log(`Worker ${shardId} restarted successfully`);
    }
    /**
     * Handle task timeout
     */
    handleTaskTimeout(task) {
        if (task.retries < this.MAX_RETRIES) {
            task.retries++;
            task.timestamp = Date.now();
            // Retry on same shard
            const shardId = this.getShardForPair(task.order.pair);
            const shard = this.shards.get(shardId);
            if (shard) {
                shard.worker.postMessage(task);
            }
        }
        else {
            // Task failed
            this.taskQueue.delete(task.id);
            this.metrics.tasksFailed++;
            task.callback({
                success: false,
                trades: [],
                remaining: task.order.amount,
                error: 'Task timeout'
            });
        }
    }
    /**
     * Setup load balancer
     */
    setupLoadBalancer() {
        setInterval(() => {
            this.rebalanceShards();
        }, 5000); // Rebalance every 5 seconds
    }
    /**
     * Rebalance load across shards
     */
    rebalanceShards() {
        const loads = Array.from(this.shards.values()).map(s => s.load);
        const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        // If imbalance is significant, redistribute pairs
        if (maxLoad - minLoad > avgLoad * 0.5) {
            console.log('Rebalancing shards due to load imbalance');
            this.redistributePairs();
        }
    }
    /**
     * Redistribute pairs across shards
     */
    redistributePairs() {
        // Get current load distribution
        const shardLoads = new Map();
        this.shards.forEach((shard, id) => {
            shardLoads.set(id, shard.load);
        });
        // Sort shards by load
        const sortedShards = Array.from(shardLoads.entries())
            .sort((a, b) => a[1] - b[1]);
        // Move pairs from overloaded to underloaded shards
        const overloaded = sortedShards.slice(-Math.floor(this.SHARD_COUNT / 4));
        const underloaded = sortedShards.slice(0, Math.floor(this.SHARD_COUNT / 4));
        for (const [overloadedId] of overloaded) {
            const overloadedShard = this.shards.get(overloadedId);
            const pairsToMove = Math.floor(overloadedShard.pairs.length / 4);
            for (let i = 0; i < pairsToMove && i < underloaded.length; i++) {
                const [underloadedId] = underloaded[i];
                const underloadedShard = this.shards.get(underloadedId);
                // Move pair
                const pair = overloadedShard.pairs.pop();
                underloadedShard.pairs.push(pair);
                this.pairToShard.set(pair, underloadedId);
            }
        }
    }
    /**
     * Update shard metrics
     */
    updateShardMetrics(shardId, metrics) {
        this.metrics.shardUtilization.set(shardId, metrics.utilization);
    }
    /**
     * Get all trading pairs
     */
    async getAllTradingPairs() {
        // In production, fetch from database or configuration
        return [
            'HYPERINDEX-USDC',
            'DOGE-USDC',
            'PEPE-USDC',
            'SHIB-USDC',
            'WIF-USDC',
            'BONK-USDC'
        ];
    }
    /**
     * Get performance metrics
     */
    getMetrics() {
        const shardMetrics = Array.from(this.shards.values()).map(shard => ({
            id: shard.id,
            pairs: shard.pairs.length,
            load: shard.load,
            utilization: this.metrics.shardUtilization.get(shard.id) || 0
        }));
        return {
            ...this.metrics,
            shards: shardMetrics,
            totalCapacity: this.MAX_QUEUE_SIZE,
            queueUtilization: (this.taskQueue.size / this.MAX_QUEUE_SIZE) * 100
        };
    }
    /**
     * Graceful shutdown
     */
    async shutdown() {
        // Stop accepting new tasks
        this.taskQueue.clear();
        // Terminate all workers
        for (const shard of this.shards.values()) {
            await shard.worker.terminate();
        }
        // Shutdown orderbook
        await this.orderbook.shutdown();
    }
    static instance;
    static getInstance() {
        if (!ParallelMatchingEngine.instance) {
            ParallelMatchingEngine.instance = new ParallelMatchingEngine();
        }
        return ParallelMatchingEngine.instance;
    }
    /**
     * Get orderbook data (delegates to UltraPerformanceOrderbook)
     */
    async getOrderbook(pair, depth = 20) {
        return await this.orderbook.getOrderbook(pair, depth);
    }
    /**
     * Get market data (delegates to UltraPerformanceOrderbook)
     */
    async getMarketData(pair) {
        return await this.orderbook.getMarketData(pair);
    }
}
