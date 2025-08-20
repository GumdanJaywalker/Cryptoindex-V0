// lib/utils/trading-errors.ts
/**
 * 🚨 Standardized Error Handling for Trading System
 */
export var TradingErrorCode;
(function (TradingErrorCode) {
    // Order errors
    TradingErrorCode["INVALID_ORDER_AMOUNT"] = "INVALID_ORDER_AMOUNT";
    TradingErrorCode["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
    TradingErrorCode["ORDER_NOT_FOUND"] = "ORDER_NOT_FOUND";
    // Market errors
    TradingErrorCode["PAIR_NOT_SUPPORTED"] = "PAIR_NOT_SUPPORTED";
    TradingErrorCode["INSUFFICIENT_LIQUIDITY"] = "INSUFFICIENT_LIQUIDITY";
    TradingErrorCode["PRICE_IMPACT_TOO_HIGH"] = "PRICE_IMPACT_TOO_HIGH";
    // System errors
    TradingErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    TradingErrorCode["REDIS_CONNECTION_FAILED"] = "REDIS_CONNECTION_FAILED";
    TradingErrorCode["ORACLE_UNAVAILABLE"] = "ORACLE_UNAVAILABLE";
    // Settlement errors
    TradingErrorCode["SETTLEMENT_FAILED"] = "SETTLEMENT_FAILED";
    TradingErrorCode["INSUFFICIENT_ALLOWANCE"] = "INSUFFICIENT_ALLOWANCE";
    TradingErrorCode["TRANSACTION_REVERTED"] = "TRANSACTION_REVERTED";
})(TradingErrorCode || (TradingErrorCode = {}));
export class TradingError extends Error {
    code;
    context;
    isRetryable;
    constructor(code, message, context, isRetryable = false) {
        super(`[${code}] ${message}`);
        this.code = code;
        this.context = context;
        this.isRetryable = isRetryable;
        this.name = 'TradingError';
    }
    static invalidAmount(amount) {
        return new TradingError(TradingErrorCode.INVALID_ORDER_AMOUNT, `Invalid order amount: ${amount}`, { amount }, false);
    }
    static insufficientLiquidity(pair, amount) {
        return new TradingError(TradingErrorCode.INSUFFICIENT_LIQUIDITY, `Insufficient liquidity in ${pair} for amount ${amount}`, { pair, amount }, false);
    }
    static databaseError(operation, originalError) {
        return new TradingError(TradingErrorCode.DATABASE_ERROR, `Database operation failed: ${operation}`, { operation, originalError }, true // Database errors might be retryable
        );
    }
}
/**
 * 🔄 Retry mechanism for recoverable errors
 */
export class RetryableOperation {
    maxRetries;
    baseDelayMs;
    constructor(maxRetries = 3, baseDelayMs = 1000) {
        this.maxRetries = maxRetries;
        this.baseDelayMs = baseDelayMs;
    }
    async execute(operation, isRetryable = (e) => e instanceof TradingError && e.isRetryable) {
        let lastError;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (!isRetryable(error) || attempt === this.maxRetries) {
                    throw error;
                }
                const delay = this.baseDelayMs * Math.pow(2, attempt);
                console.warn(`Operation failed, retrying in ${delay}ms:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
}
/**
 * 🚨 Circuit breaker for external services
 */
export class CircuitBreaker {
    threshold;
    timeout;
    failures = 0;
    lastFailTime = 0;
    state = 'CLOSED';
    constructor(threshold = 5, timeout = 60000 // 1 minute
    ) {
        this.threshold = threshold;
        this.timeout = timeout;
    }
    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailTime > this.timeout) {
                this.state = 'HALF_OPEN';
            }
            else {
                throw new TradingError(TradingErrorCode.DATABASE_ERROR, 'Circuit breaker is OPEN - service temporarily unavailable', { state: this.state, failures: this.failures }, false);
            }
        }
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    onFailure() {
        this.failures++;
        this.lastFailTime = Date.now();
        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
        }
    }
    getStatus() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailTime: this.lastFailTime
        };
    }
}
