// 오더북 관련 타입 정의
// Redis key patterns
export const REDIS_KEYS = {
    // Orderbook data
    BIDS: (pair) => `orderbook:${pair}:bids`,
    ASKS: (pair) => `orderbook:${pair}:asks`,
    // Order details
    ORDER: (orderId) => `order:${orderId}`,
    USER_ORDERS: (userId) => `user:${userId}:orders`,
    // Price levels
    PRICE_LEVEL: (pair, side, price) => `price:${pair}:${side}:${price}`,
    // Recent trades
    TRADES: (pair) => `trades:${pair}`,
    // Market data
    TICKER: (pair) => `ticker:${pair}`,
    // Real-time channels
    CHANNELS: {
        ORDERBOOK: (pair) => `orderbook:${pair}`,
        TRADES: (pair) => `trades:${pair}`,
        ORDERS: (userId) => `orders:${userId}`,
    }
};
