// lib/utils/async-db-writer.ts
/**
 * 🚀 비동기 DB 배치 라이터
 * 실제 거래소처럼 주문 처리와 DB 저장을 분리
 * 백그라운드에서 배치로 DB에 저장하여 성능 최적화
 */
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export class AsyncDBWriter {
    static instance;
    orderQueue = [];
    tradeQueue = [];
    isProcessing = false;
    batchSize = 100; // 배치 크기
    flushInterval = 1000; // 1초마다 플러시
    maxQueueSize = 10000; // 최대 큐 크기
    constructor() {
        // 주기적으로 배치 처리
        setInterval(() => {
            this.flushBatches();
        }, this.flushInterval);
    }
    static getInstance() {
        if (!AsyncDBWriter.instance) {
            AsyncDBWriter.instance = new AsyncDBWriter();
        }
        return AsyncDBWriter.instance;
    }
    /**
     * 주문 이력을 큐에 추가 (즉시 반환)
     */
    queueOrderHistory(orderData) {
        if (this.orderQueue.length >= this.maxQueueSize) {
            console.warn('⚠️ Order queue full, forcing flush');
            this.flushBatches();
        }
        this.orderQueue.push({
            ...orderData,
            created_at: new Date()
        });
        console.log(`📝 Queued order: ${orderData.redis_order_id} (Queue: ${this.orderQueue.length})`);
    }
    /**
     * 거래 이력을 큐에 추가 (즉시 반환)
     */
    queueTradeHistory(tradeData) {
        if (this.tradeQueue.length >= this.maxQueueSize) {
            console.warn('⚠️ Trade queue full, forcing flush');
            this.flushBatches();
        }
        this.tradeQueue.push({
            ...tradeData,
            executed_at: new Date()
        });
        console.log(`📊 Queued trade: ${tradeData.id} (Queue: ${this.tradeQueue.length})`);
    }
    /**
     * 배치 플러시 (백그라운드 처리)
     */
    async flushBatches() {
        if (this.isProcessing)
            return;
        if (this.orderQueue.length === 0 && this.tradeQueue.length === 0)
            return;
        this.isProcessing = true;
        const startTime = Date.now();
        try {
            // 현재 큐 복사 후 초기화
            const ordersToProcess = [...this.orderQueue];
            const tradesToProcess = [...this.tradeQueue];
            this.orderQueue = [];
            this.tradeQueue = [];
            console.log(`🚀 Flushing batches: ${ordersToProcess.length} orders, ${tradesToProcess.length} trades`);
            // 주문 배치 처리
            if (ordersToProcess.length > 0) {
                await this.batchInsertOrders(ordersToProcess);
            }
            // 거래 배치 처리
            if (tradesToProcess.length > 0) {
                await this.batchInsertTrades(tradesToProcess);
            }
            const duration = Date.now() - startTime;
            console.log(`✅ Batch flush completed in ${duration}ms`);
        }
        catch (error) {
            console.error('❌ Batch flush error:', error);
            // 실패한 경우 큐에 다시 추가하지 않음 (성능 우선)
        }
        finally {
            this.isProcessing = false;
        }
    }
    /**
     * 주문 배치 삽입
     */
    async batchInsertOrders(orders) {
        try {
            // PostgreSQL의 배치 insert 사용
            const { data, error } = await supabase
                .from('order_history')
                .insert(orders);
            if (error) {
                console.error('❌ Batch order insert failed:', error);
                throw error;
            }
            console.log(`✅ Batch inserted ${orders.length} orders`);
        }
        catch (error) {
            console.error('❌ Order batch insert error:', error);
            throw error;
        }
    }
    /**
     * 거래 배치 삽입
     */
    async batchInsertTrades(trades) {
        try {
            // PostgreSQL의 배치 insert 사용
            const { data, error } = await supabase
                .from('trade_history')
                .insert(trades);
            if (error) {
                console.error('❌ Batch trade insert failed:', error);
                throw error;
            }
            console.log(`✅ Batch inserted ${trades.length} trades`);
        }
        catch (error) {
            console.error('❌ Trade batch insert error:', error);
            throw error;
        }
    }
    /**
     * 강제 플러시 (테스트용)
     */
    async forceFlush() {
        await this.flushBatches();
    }
    /**
     * 큐 상태 조회
     */
    getQueueStatus() {
        return {
            orderQueue: this.orderQueue.length,
            tradeQueue: this.tradeQueue.length,
            isProcessing: this.isProcessing
        };
    }
    /**
     * 설정 업데이트
     */
    updateConfig(config) {
        if (config.batchSize)
            this.batchSize = config.batchSize;
        if (config.flushInterval)
            this.flushInterval = config.flushInterval;
        if (config.maxQueueSize)
            this.maxQueueSize = config.maxQueueSize;
        console.log('⚙️ AsyncDBWriter config updated:', {
            batchSize: this.batchSize,
            flushInterval: this.flushInterval,
            maxQueueSize: this.maxQueueSize
        });
    }
}
