// lib/redis/fallback-client.ts
/**
 * 🚀 Redis Fallback Client
 * Redis 연결 실패 시 메모리 기반 fallback 제공
 * 외부 환경에서 개발할 때 유용
 */
export class RedisFallbackClient {
    data = {};
    orderbook = {};
    recentTrades = {};
    constructor() {
        console.log('⚠️ Using Redis Fallback Mode (Memory-based)');
        this.initializeMockData();
    }
    initializeMockData() {
        // Mock orderbook data
        this.orderbook['HYPERINDEX-USDC'] = {
            bids: [
                { price: '0.98', amount: '1000', orderId: 'mock-bid-1' },
                { price: '0.97', amount: '2000', orderId: 'mock-bid-2' },
                { price: '0.96', amount: '1500', orderId: 'mock-bid-3' }
            ],
            asks: [
                { price: '1.02', amount: '1200', orderId: 'mock-ask-1' },
                { price: '1.03', amount: '1800', orderId: 'mock-ask-2' },
                { price: '1.04', amount: '2200', orderId: 'mock-ask-3' }
            ]
        };
        // Mock recent trades
        this.recentTrades['HYPERINDEX-USDC'] = [
            {
                id: 'mock-trade-1',
                price: '1.00',
                amount: '500',
                side: 'buy',
                source: 'AMM',
                timestamp: Date.now() - 1000
            },
            {
                id: 'mock-trade-2',
                price: '0.99',
                amount: '300',
                side: 'sell',
                source: 'Orderbook',
                timestamp: Date.now() - 2000
            }
        ];
    }
    // Redis 호환 메서드들
    async get(key) {
        return this.data[key] || null;
    }
    async set(key, value) {
        this.data[key] = value;
    }
    async hget(key, field) {
        const hash = this.data[key] || {};
        return hash[field] || null;
    }
    async hset(key, field, value) {
        if (!this.data[key])
            this.data[key] = {};
        this.data[key][field] = value;
    }
    async hgetall(key) {
        return this.data[key] || {};
    }
    async zadd(key, score, member) {
        if (!this.data[key])
            this.data[key] = [];
        this.data[key].push({ score, member });
        // Sort by score
        this.data[key].sort((a, b) => a.score - b.score);
    }
    async zrange(key, start, stop) {
        const sorted = this.data[key] || [];
        return sorted.slice(start, stop + 1).map((item) => item.member);
    }
    async zrevrange(key, start, stop) {
        const sorted = this.data[key] || [];
        return sorted.slice().reverse().slice(start, stop + 1).map((item) => item.member);
    }
    async lpush(key, ...values) {
        if (!this.data[key])
            this.data[key] = [];
        this.data[key].unshift(...values);
    }
    async lrange(key, start, stop) {
        const list = this.data[key] || [];
        return list.slice(start, stop === -1 ? undefined : stop + 1);
    }
    async ltrim(key, start, stop) {
        if (this.data[key]) {
            this.data[key] = this.data[key].slice(start, stop + 1);
        }
    }
    async del(key) {
        delete this.data[key];
    }
    async exists(key) {
        return key in this.data;
    }
    // Orderbook 전용 메서드들
    async getOrderbook(pair, depth = 10) {
        const book = this.orderbook[pair] || { bids: [], asks: [] };
        return {
            bids: book.bids.slice(0, depth),
            asks: book.asks.slice(0, depth)
        };
    }
    async addOrder(pair, side, price, amount, orderId) {
        if (!this.orderbook[pair]) {
            this.orderbook[pair] = { bids: [], asks: [] };
        }
        const order = { price, amount, orderId };
        if (side === 'buy') {
            this.orderbook[pair].bids.push(order);
            // Sort bids by price descending
            this.orderbook[pair].bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        else {
            this.orderbook[pair].asks.push(order);
            // Sort asks by price ascending
            this.orderbook[pair].asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
    }
    async getRecentTrades(pair, limit = 10) {
        const trades = this.recentTrades[pair] || [];
        return trades.slice(-limit).reverse(); // Most recent first
    }
    async addTrade(pair, trade) {
        if (!this.recentTrades[pair]) {
            this.recentTrades[pair] = [];
        }
        this.recentTrades[pair].push({
            ...trade,
            timestamp: Date.now()
        });
        // Keep only last 100 trades
        if (this.recentTrades[pair].length > 100) {
            this.recentTrades[pair] = this.recentTrades[pair].slice(-100);
        }
    }
    // Lua script support (mock implementation)
    async script(command, script) {
        if (command === 'LOAD') {
            // 간단한 해시 생성 (실제 Redis SHA1과 다르지만 fallback 용도로 충분)
            const hash = 'fallback_' + Math.random().toString(36).substring(7);
            console.log(`📜 Fallback script loaded: ${hash}`);
            return hash;
        }
        throw new Error(`Script command ${command} not supported in fallback mode`);
    }
    async evalsha(hash, numKeys, ...args) {
        console.log(`🔄 Fallback evalsha: ${hash} with ${args.length} args`);
        // Ultra simulator에서 사용하는 주요 스크립트들에 대한 fallback 구현
        if (hash.startsWith('fallback_')) {
            return this.mockLuaScriptExecution(hash, args);
        }
        throw new Error(`Script ${hash} not found in fallback mode`);
    }
    mockLuaScriptExecution(hash, args) {
        // ADD_ORDER 스크립트 모킹
        if (args.length >= 9) {
            const [orderId, userId, pair, side, price, amount, remaining, orderType, timestamp] = args;
            // 간단한 주문 추가 시뮬레이션
            const orderKey = `order:${orderId}`;
            this.data[orderKey] = {
                id: orderId,
                userId,
                pair,
                side,
                type: orderType,
                price,
                amount,
                remaining,
                status: 'active',
                timestamp
            };
            // 오더북에 추가
            this.addOrder(pair, side, price, remaining, orderId);
            return 'OK';
        }
        // FAST_MATCH 스크립트 모킹
        if (args.length >= 6) {
            const [pair, side, price, amount] = args;
            // 간단한 매칭 시뮬레이션
            const matches = [];
            const remainingAmount = parseFloat(amount);
            // 30% 확률로 매칭 성공
            if (Math.random() > 0.7) {
                const matchAmount = Math.min(remainingAmount, Math.random() * remainingAmount);
                matches.push({
                    trade_id: `fallback_trade_${Date.now()}`,
                    price: parseFloat(price),
                    amount: matchAmount,
                    taker_order_id: args[4] || 'fallback_taker',
                    maker_order_id: `fallback_maker_${Date.now()}`,
                    maker_user_id: 'fallback_user'
                });
            }
            return JSON.stringify({
                matches,
                remaining: remainingAmount - (matches[0]?.amount || 0)
            });
        }
        // EXECUTE_TRADES 스크립트 모킹
        if (args.length >= 2) {
            try {
                const trades = JSON.parse(args[0]);
                return JSON.stringify(trades); // 그대로 반환
            }
            catch (e) {
                return JSON.stringify([]);
            }
        }
        // GET_ORDERBOOK_FAST 스크립트 모킹
        if (args.length >= 1) {
            const pair = args[0];
            const depth = parseInt(args[1]) || 20;
            const book = this.orderbook[pair] || { bids: [], asks: [] };
            return JSON.stringify({
                pair,
                bids: book.bids.slice(0, depth),
                asks: book.asks.slice(0, depth),
                timestamp: Date.now()
            });
        }
        // 기본 응답
        return 'OK';
    }
    // Status methods
    getStatus() {
        return {
            connected: true,
            mode: 'fallback',
            keys: Object.keys(this.data).length,
            orderbooks: Object.keys(this.orderbook),
            luaScriptSupport: true,
            message: 'Running in fallback mode with Lua script simulation - data will not persist'
        };
    }
}
