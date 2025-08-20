// Error types
export var TradingErrorCode;
(function (TradingErrorCode) {
    TradingErrorCode["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
    TradingErrorCode["INVALID_ORDER_SIZE"] = "INVALID_ORDER_SIZE";
    TradingErrorCode["TOKEN_NOT_FOUND"] = "TOKEN_NOT_FOUND";
    TradingErrorCode["TOKEN_NOT_TRADEABLE"] = "TOKEN_NOT_TRADEABLE";
    TradingErrorCode["ORDER_NOT_FOUND"] = "ORDER_NOT_FOUND";
    TradingErrorCode["CANNOT_CANCEL_ORDER"] = "CANNOT_CANCEL_ORDER";
    TradingErrorCode["HYPERCORE_ERROR"] = "HYPERCORE_ERROR";
    TradingErrorCode["INVALID_PRICE"] = "INVALID_PRICE";
    TradingErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    TradingErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
})(TradingErrorCode || (TradingErrorCode = {}));
// Constants
export const TRADING_CONSTANTS = {
    MIN_ORDER_SIZE: '0.000001',
    MAX_ORDER_SIZE: '1000000',
    MAX_PRICE_DEVIATION: 0.1, // 10%
    ORDER_TIMEOUT_MS: 300000, // 5 minutes
    PRICE_UPDATE_INTERVAL_MS: 5000, // 5 seconds
    BALANCE_SYNC_INTERVAL_MS: 30000, // 30 seconds
};
export const SUPPORTED_NETWORKS = {
    HYPERLIQUID: {
        chainId: 999,
        name: 'Hyperliquid',
        rpcUrl: 'https://api.hyperliquid-testnet.xyz/evm',
        nativeCurrency: 'USDC',
        precompileAddress: '0x0000000000000000000000000000000000000808'
    }
};
