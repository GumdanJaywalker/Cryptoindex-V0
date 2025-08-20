/**
 * Memory Pool Manager for Ultra-High Performance
 * Reduces GC pressure and improves allocation speed
 */
/**
 * Generic object pool implementation
 */
class ObjectPool {
    pool = [];
    factory;
    reset;
    config;
    allocated = 0;
    constructor(factory, reset, config) {
        this.factory = factory;
        this.reset = reset;
        this.config = config;
        this.preallocate();
    }
    /**
     * Preallocate objects to pool
     */
    preallocate() {
        for (let i = 0; i < this.config.initialSize; i++) {
            this.pool.push(this.factory());
        }
    }
    /**
     * Acquire object from pool
     */
    acquire() {
        if (this.pool.length > 0) {
            this.allocated++;
            return this.pool.pop();
        }
        // Pool empty, create new if under limit
        if (this.allocated < this.config.maxSize) {
            this.allocated++;
            return this.factory();
        }
        // Over limit, force GC and retry
        if (global.gc)
            global.gc();
        throw new Error('Object pool exhausted');
    }
    /**
     * Release object back to pool
     */
    release(obj) {
        this.reset(obj);
        this.allocated--;
        if (this.pool.length < this.config.maxSize) {
            this.pool.push(obj);
        }
    }
    /**
     * Get pool statistics
     */
    getStats() {
        return {
            available: this.pool.length,
            allocated: this.allocated,
            total: this.pool.length + this.allocated,
            maxSize: this.config.maxSize
        };
    }
}
/**
 * Connection pool for Redis connections
 */
export class RedisConnectionPool {
    connections = [];
    available = new Set();
    inUse = new Map();
    config;
    constructor(config) {
        this.config = {
            min: config.min || 5,
            max: config.max || 20,
            idleTimeout: config.idleTimeout || 30000,
            acquireTimeout: config.acquireTimeout || 1000
        };
        this.initialize();
    }
    /**
     * Initialize connection pool
     */
    async initialize() {
        const Redis = require('ioredis');
        for (let i = 0; i < this.config.min; i++) {
            const conn = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
                lazyConnect: true, // Enable lazy connect to prevent immediate failures
                enableOfflineQueue: true, // Enable offline queue for better error handling
                maxRetriesPerRequest: 3,
                connectTimeout: 5000,
                // Performance optimizations
                dropBufferSupport: true,
                enableAutoPipelining: true
            });
            await conn.connect();
            this.connections.push(conn);
            this.available.add(conn);
            // Setup idle timeout
            this.setupIdleTimeout(conn);
        }
    }
    /**
     * Acquire connection from pool
     */
    async acquire(id) {
        const startTime = Date.now();
        while (Date.now() - startTime < this.config.acquireTimeout) {
            // Try to get available connection
            if (this.available.size > 0) {
                const conn = this.available.values().next().value;
                this.available.delete(conn);
                const connId = id || `conn_${Date.now()}`;
                this.inUse.set(connId, conn);
                return conn;
            }
            // Try to create new connection if under limit
            if (this.connections.length < this.config.max) {
                const conn = await this.createConnection();
                const connId = id || `conn_${Date.now()}`;
                this.inUse.set(connId, conn);
                return conn;
            }
            // Wait a bit and retry
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        throw new Error('Connection pool timeout');
    }
    /**
     * Release connection back to pool
     */
    release(connOrId) {
        let conn;
        if (typeof connOrId === 'string') {
            conn = this.inUse.get(connOrId);
            this.inUse.delete(connOrId);
        }
        else {
            conn = connOrId;
            // Find and remove from inUse
            for (const [id, c] of this.inUse) {
                if (c === conn) {
                    this.inUse.delete(id);
                    break;
                }
            }
        }
        if (conn && !this.available.has(conn)) {
            this.available.add(conn);
            this.setupIdleTimeout(conn);
        }
    }
    /**
     * Create new connection
     */
    async createConnection() {
        const Redis = require('ioredis');
        const conn = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
            lazyConnect: true, // Enable lazy connect to prevent immediate failures
            enableOfflineQueue: true, // Enable offline queue for better error handling
            dropBufferSupport: true,
            enableAutoPipelining: true
        });
        await conn.connect();
        this.connections.push(conn);
        return conn;
    }
    /**
     * Setup idle timeout for connection
     */
    setupIdleTimeout(conn) {
        if (conn._idleTimer) {
            clearTimeout(conn._idleTimer);
        }
        conn._idleTimer = setTimeout(() => {
            if (this.available.has(conn) && this.connections.length > this.config.min) {
                this.available.delete(conn);
                const index = this.connections.indexOf(conn);
                if (index > -1) {
                    this.connections.splice(index, 1);
                }
                conn.quit();
            }
        }, this.config.idleTimeout);
    }
    /**
     * Get pool statistics
     */
    getStats() {
        return {
            total: this.connections.length,
            available: this.available.size,
            inUse: this.inUse.size,
            min: this.config.min,
            max: this.config.max
        };
    }
    /**
     * Drain and close all connections
     */
    async drain() {
        // Wait for all connections to be released
        const timeout = Date.now() + 5000;
        while (this.inUse.size > 0 && Date.now() < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // Close all connections
        for (const conn of this.connections) {
            await conn.quit();
        }
        this.connections = [];
        this.available.clear();
        this.inUse.clear();
    }
}
/**
 * Memory pool manager singleton
 */
export class MemoryPoolManager {
    static instance;
    orderPool;
    tradePool;
    bufferPool;
    arrayPool;
    // Pre-allocated buffers for binary operations
    binaryBuffers = new Map();
    constructor() {
        // Initialize order pool
        this.orderPool = new ObjectPool(() => ({}), (order) => {
            // Reset order object
            Object.keys(order).forEach(key => delete order[key]);
        }, { initialSize: 1000, maxSize: 10000, growthFactor: 2 });
        // Initialize trade pool
        this.tradePool = new ObjectPool(() => ({}), (trade) => {
            Object.keys(trade).forEach(key => delete trade[key]);
        }, { initialSize: 500, maxSize: 5000, growthFactor: 2 });
        // Initialize buffer pool (for binary protocol)
        this.bufferPool = new ObjectPool(() => Buffer.allocUnsafe(1024), (buffer) => buffer.fill(0), { initialSize: 100, maxSize: 1000, growthFactor: 1.5 });
        // Initialize array pool
        this.arrayPool = new ObjectPool(() => [], (arr) => arr.length = 0, { initialSize: 100, maxSize: 500, growthFactor: 1.5 });
        // Pre-allocate common buffer sizes
        this.preallocateBinaryBuffers();
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!MemoryPoolManager.instance) {
            MemoryPoolManager.instance = new MemoryPoolManager();
        }
        return MemoryPoolManager.instance;
    }
    /**
     * Pre-allocate binary buffers
     */
    preallocateBinaryBuffers() {
        const sizes = [64, 128, 256, 512, 1024, 2048, 4096];
        for (const size of sizes) {
            const buffers = [];
            for (let i = 0; i < 10; i++) {
                buffers.push(Buffer.allocUnsafe(size));
            }
            this.binaryBuffers.set(size, buffers);
        }
    }
    /**
     * Acquire order object
     */
    acquireOrder() {
        return this.orderPool.acquire();
    }
    /**
     * Release order object
     */
    releaseOrder(order) {
        this.orderPool.release(order);
    }
    /**
     * Acquire trade object
     */
    acquireTrade() {
        return this.tradePool.acquire();
    }
    /**
     * Release trade object
     */
    releaseTrade(trade) {
        this.tradePool.release(trade);
    }
    /**
     * Acquire buffer
     */
    acquireBuffer(size) {
        if (size && this.binaryBuffers.has(size)) {
            const buffers = this.binaryBuffers.get(size);
            if (buffers.length > 0) {
                return buffers.pop();
            }
        }
        return this.bufferPool.acquire();
    }
    /**
     * Release buffer
     */
    releaseBuffer(buffer) {
        const size = buffer.length;
        if (this.binaryBuffers.has(size)) {
            const buffers = this.binaryBuffers.get(size);
            if (buffers.length < 20) {
                buffer.fill(0);
                buffers.push(buffer);
                return;
            }
        }
        this.bufferPool.release(buffer);
    }
    /**
     * Acquire array
     */
    acquireArray() {
        return this.arrayPool.acquire();
    }
    /**
     * Release array
     */
    releaseArray(arr) {
        this.arrayPool.release(arr);
    }
    /**
     * Create order with pooled object
     */
    createOrder(data) {
        const order = this.acquireOrder();
        Object.assign(order, data);
        return order;
    }
    /**
     * Create trade with pooled object
     */
    createTrade(data) {
        const trade = this.acquireTrade();
        Object.assign(trade, data);
        return trade;
    }
    /**
     * Batch acquire orders
     */
    acquireOrderBatch(count) {
        const orders = this.acquireArray();
        for (let i = 0; i < count; i++) {
            orders.push(this.acquireOrder());
        }
        return orders;
    }
    /**
     * Batch release orders
     */
    releaseOrderBatch(orders) {
        for (const order of orders) {
            this.releaseOrder(order);
        }
        this.releaseArray(orders);
    }
    /**
     * Get memory statistics
     */
    getStats() {
        return {
            orders: this.orderPool.getStats(),
            trades: this.tradePool.getStats(),
            buffers: this.bufferPool.getStats(),
            arrays: this.arrayPool.getStats(),
            binaryBuffers: Array.from(this.binaryBuffers.entries()).map(([size, buffers]) => ({
                size,
                available: buffers.length
            }))
        };
    }
    /**
     * Force garbage collection if available
     */
    forceGC() {
        if (global.gc) {
            global.gc();
        }
    }
}
/**
 * Helper function to use memory pool in async context
 */
export async function withPooledOrder(fn) {
    const pool = MemoryPoolManager.getInstance();
    const order = pool.acquireOrder();
    try {
        return await fn(order);
    }
    finally {
        pool.releaseOrder(order);
    }
}
/**
 * Helper function for batch operations with pooled objects
 */
export async function withPooledBatch(count, fn) {
    const pool = MemoryPoolManager.getInstance();
    const orders = pool.acquireOrderBatch(count);
    try {
        return await fn(orders);
    }
    finally {
        pool.releaseOrderBatch(orders);
    }
}
