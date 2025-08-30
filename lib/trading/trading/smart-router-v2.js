"use strict";
// lib/trading/smart-router-v2.ts
/**
 * 🚀 HybridSmartRouter V2 - 주문량 분할 처리 버전
 *
 * 핵심 개선사항:
 * 1. 하나의 Market 주문을 여러 청크로 분할 처리
 * 2. 각 청크마다 AMM vs 오더북 최적 선택
 * 3. AMM 가격 변동을 실시간 반영
 * 4. 무한루프 및 모든 엣지케이스 방지
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HybridSmartRouterV2 = void 0;
const hypervm_amm_1 = require("../blockchain/hypervm-amm");
const ultra_performance_orderbook_1 = require("../orderbook/ultra-performance-orderbook");
class HybridSmartRouterV2 {
    constructor() {
        // 안전장치 설정
        this.MAX_ITERATIONS = 100;
        this.MIN_CHUNK_SIZE = 0.001;
        this.MAX_AMM_CHUNK_SIZE = 1000; // 최대 AMM 청크 크기 (슬리피지 방지)
        // HyperVMAMM with Real Deployed Contracts (2025-08-12)
        this.amm = new hypervm_amm_1.HyperVMAMM('https://rpc.hyperliquid-testnet.xyz/evm', {
            router: process.env.HYPEREVM_ROUTER_ADDRESS || '0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A',
            factory: process.env.HYPEREVM_FACTORY_ADDRESS || '0x73bF19534DA1c60772E40136A4e5E77921b7a632',
            hyperIndex: process.env.HYPERINDEX_TOKEN_ADDRESS || '0x6065Ab1ec8334ab6099aF27aF145411902EAef40',
            usdc: process.env.USDC_TOKEN_ADDRESS || '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3',
            pair: process.env.HYPERINDEX_USDC_PAIR_ADDRESS || '0x5706084ad9Cac84393eaA1Eb265Db9b22bA63cd1'
        });
        this.matchingEngine = ultra_performance_orderbook_1.UltraPerformanceOrderbook.getInstance();
    }
    static getInstance() {
        if (!HybridSmartRouterV2.instance) {
            HybridSmartRouterV2.instance = new HybridSmartRouterV2();
        }
        return HybridSmartRouterV2.instance;
    }
    /**
     * 🚀 V2 핵심: 주문량 분할 처리를 통한 하이브리드 라우팅
     */
    async processHybridOrder(order) {
        console.log(`🚀 V2 Processing hybrid order:`, {
            id: order.id,
            side: order.side,
            type: order.type,
            amount: order.amount,
            price: order.price
        });
        if (order.type === 'limit') {
            return await this.processLimitOrder(order);
        }
        else {
            return await this.processMarketOrderInChunks(order);
        }
    }
    /**
     * 🔥 V2 핵심: Market 주문을 청크 단위로 분할 처리
     */
    /**
     * 🔥 V2 핵심: Market 주문을 청크 단위로 분할 처리
     * 개선사항:
     * - 가격 기반 동적 청킹 (다음 오더북 가격까지만)
     * - AMM = 오더북일 때 오더북 완전 소진
     * - 연속적 가격 추적 및 재평가
     */
    async processMarketOrderInChunks(order) {
        let remainingAmount = parseFloat(order.amount);
        const fills = [];
        const routing = [];
        let iteration = 0;
        let chunkIndex = 0;
        console.log(`🎯 V2 Improved Market order processing - Amount: ${remainingAmount}`);
        while (remainingAmount > this.MIN_CHUNK_SIZE && iteration < this.MAX_ITERATIONS) {
            iteration++;
            chunkIndex++;
            // 1. 현재 상황 실시간 파악
            const ammPrice = await this.amm.getSpotPrice(order.pair);
            const orderbook = await this.matchingEngine.getOrderbook(order.pair, 10);
            const bestOrderbookPrice = await this.getBestOrderbookPrice(order.pair, order.side);
            const nextOrderbookPrice = await this.getNextOrderbookPrice(order.pair, order.side);
            console.log(`📊 Chunk ${chunkIndex} - AMM: ${ammPrice}, Best OB: ${bestOrderbookPrice || 'N/A'}, Next OB: ${nextOrderbookPrice || 'N/A'}, Remaining: ${remainingAmount}`);
            // 2. 가격 비교 및 소스 선택
            if (!bestOrderbookPrice) {
                // 시나리오 1: 오더북 호가 없음 → AMM 전량 처리
                const chunkResult = await this.processAMMChunk(order, remainingAmount, ammPrice, null, chunkIndex);
                if (chunkResult && chunkResult.actualAmount > 0) {
                    fills.push(chunkResult.fill);
                    routing.push(chunkResult.routing);
                    remainingAmount -= chunkResult.actualAmount;
                    console.log(`✅ AMM only chunk ${chunkIndex}: ${chunkResult.actualAmount}, remaining: ${remainingAmount}`);
                }
                else {
                    console.log(`⚠️ AMM chunk ${chunkIndex} failed, breaking loop`);
                    break;
                }
            }
            else if (Math.abs(ammPrice - bestOrderbookPrice) < 0.0001) {
                // 시나리오 2: AMM = 오더북 가격 → 오더북 우선 완전 소진
                console.log(`🔄 AMM = Orderbook (${ammPrice}), prioritizing orderbook exhaustion`);
                // 해당 가격 레벨 오더북 전량 처리
                const orderbookAvailable = await this.getOrderbookAvailableAtPrice(order.pair, bestOrderbookPrice, order.side);
                if (orderbookAvailable > 0) {
                    const chunkResult = await this.processOrderbookPriceLevel(order, Math.min(remainingAmount, orderbookAvailable), bestOrderbookPrice, chunkIndex);
                    if (chunkResult && chunkResult.actualAmount > 0) {
                        fills.push(chunkResult.fill);
                        routing.push(chunkResult.routing);
                        remainingAmount -= chunkResult.actualAmount;
                        console.log(`✅ Orderbook priority chunk ${chunkIndex}: ${chunkResult.actualAmount} @ ${bestOrderbookPrice}, remaining: ${remainingAmount}`);
                    }
                }
            }
            else if ((order.side === 'buy' && ammPrice < bestOrderbookPrice) ||
                (order.side === 'sell' && ammPrice > bestOrderbookPrice)) {
                // 시나리오 3: AMM이 더 유리 → 다음 오더북 가격까지만 AMM 처리
                console.log(`🏦 AMM better (${ammPrice} vs ${bestOrderbookPrice}), processing until next price`);
                const chunkResult = await this.processAMMUntilPrice(order, remainingAmount, ammPrice, bestOrderbookPrice, chunkIndex);
                if (chunkResult && chunkResult.actualAmount > 0) {
                    fills.push(chunkResult.fill);
                    routing.push(chunkResult.routing);
                    remainingAmount -= chunkResult.actualAmount;
                    console.log(`✅ AMM dynamic chunk ${chunkIndex}: ${chunkResult.actualAmount}, AMM price moved to ${await this.amm.getSpotPrice(order.pair)}`);
                }
                else {
                    console.log(`⚠️ AMM chunk ${chunkIndex} failed`);
                    break;
                }
            }
            else {
                // 시나리오 4: 오더북이 더 유리 → 오더북 처리
                console.log(`📖 Orderbook better (${bestOrderbookPrice} vs ${ammPrice})`);
                const orderbookAvailable = await this.getOrderbookAvailableAtPrice(order.pair, bestOrderbookPrice, order.side);
                const chunkSize = Math.min(remainingAmount, orderbookAvailable);
                const chunkResult = await this.processOrderbookPriceLevel(order, chunkSize, bestOrderbookPrice, chunkIndex);
                if (chunkResult && chunkResult.actualAmount > 0) {
                    fills.push(chunkResult.fill);
                    routing.push(chunkResult.routing);
                    remainingAmount -= chunkResult.actualAmount;
                    console.log(`✅ Orderbook chunk ${chunkIndex}: ${chunkResult.actualAmount} @ ${bestOrderbookPrice}, remaining: ${remainingAmount}`);
                }
                else {
                    console.log(`⚠️ Orderbook chunk ${chunkIndex} failed`);
                    break;
                }
            }
            // 무한루프 조기 감지
            if (iteration > 50 && remainingAmount > parseFloat(order.amount) * 0.9) {
                console.warn(`⚠️ Potential infinite loop detected at iteration ${iteration}`);
                break;
            }
        }
        // 결과 계산
        const totalFilled = fills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0);
        const weightedPriceSum = fills.reduce((sum, fill) => sum + (parseFloat(fill.price) * parseFloat(fill.amount)), 0);
        const averagePrice = totalFilled > 0 ? weightedPriceSum / totalFilled : 0;
        console.log(`🎉 V2 Improved Market order completed:`, {
            totalFilled,
            averagePrice,
            chunks: fills.length,
            iterations: iteration,
            ammChunks: (fills || []).filter(f => f?.source === 'AMM').length,
            orderbookChunks: (fills || []).filter(f => f?.source === 'Orderbook').length
        });
        return {
            fills,
            totalFilled: totalFilled.toString(),
            averagePrice: averagePrice.toString(),
            routing,
            executionStats: {
                totalChunks: (fills || []).length,
                ammChunks: (fills || []).filter(f => f?.source === 'AMM').length,
                orderbookChunks: (fills || []).filter(f => f?.source === 'Orderbook').length,
                iterations: iteration
            }
        };
    }
    /**
     * 🆕 다음 오더북 가격 조회 (두 번째 호가)
     */
    async getNextOrderbookPrice(pair, side) {
        try {
            const orderbook = await this.matchingEngine.getOrderbook(pair, 2);
            if (side === 'buy') {
                return orderbook.asks.length > 1 ? parseFloat(orderbook.asks[1].price) : null;
            }
            else {
                return orderbook.bids.length > 1 ? parseFloat(orderbook.bids[1].price) : null;
            }
        }
        catch (error) {
            console.error('Failed to get next orderbook price:', error);
            return null;
        }
    }
    /**
     * 🆕 특정 가격 레벨의 오더북 가용 수량 조회
     */
    async getOrderbookAvailableAtPrice(pair, price, side) {
        try {
            const orderbook = await this.matchingEngine.getOrderbook(pair, 10);
            const levels = side === 'buy' ? orderbook.asks : orderbook.bids;
            const availableAmount = levels
                .filter(level => Math.abs(parseFloat(level.price) - price) < 0.0001)
                .reduce((sum, level) => sum + parseFloat(level.amount), 0);
            return availableAmount;
        }
        catch (error) {
            console.error('Failed to get orderbook available at price:', error);
            return 0;
        }
    }
    /**
     * 🆕 오더북 특정 가격 레벨 전체 처리
     */
    async processOrderbookPriceLevel(order, amount, price, chunkIndex) {
        try {
            console.log(`📖 Processing orderbook price level: ${amount} @ ${price}`);
            // 오더북에 Market 주문 전송
            const orderbookOrder = {
                id: `ob-level-${chunkIndex}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                userId: order.userId,
                pair: order.pair,
                side: order.side,
                type: 'market',
                amount: amount.toString(),
                price: price.toString(),
                remaining: amount.toString(),
                status: 'active',
                timestamp: Date.now()
            };
            const matchResult = await this.matchingEngine.processOrder(orderbookOrder);
            if (matchResult.trades.length > 0) {
                // 해당 가격 레벨의 모든 거래를 하나의 Fill로 집계
                const totalAmount = matchResult.trades.reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const weightedPrice = matchResult.trades.reduce((sum, t) => sum + (parseFloat(t.price) * parseFloat(t.amount)), 0) / totalAmount;
                const fill = {
                    id: `ob-fill-${chunkIndex}-${Date.now()}`,
                    orderId: order.id,
                    price: weightedPrice.toString(),
                    amount: totalAmount.toString(),
                    side: order.side,
                    source: 'Orderbook',
                    timestamp: Date.now(),
                    chunkIndex
                };
                const routing = {
                    source: 'Orderbook',
                    amount: fill.amount,
                    price: fill.price,
                    chunkIndex
                };
                await this.recordTrade(fill, undefined, order.userId);
                return { fill, routing, actualAmount: totalAmount };
            }
            return null;
        }
        catch (error) {
            console.error(`❌ Orderbook price level processing failed:`, error);
            return null;
        }
    }
    /**
     * 🆕 AMM을 특정 가격까지만 실행
     */
    async processAMMUntilPrice(order, remainingAmount, currentAmmPrice, targetPrice, chunkIndex) {
        try {
            // 목표 가격까지 도달하는데 필요한 수량 계산
            const amountToReachPrice = await this.amm.getAmountToReachPrice(order.pair, targetPrice, order.side);
            const optimalAmount = Math.min(remainingAmount, Math.max(0, amountToReachPrice), this.MAX_AMM_CHUNK_SIZE);
            if (optimalAmount <= 0) {
                return null;
            }
            console.log(`🏦 AMM until price: ${optimalAmount} (${currentAmmPrice} → ${targetPrice})`);
            // AMM 스왑 실행 (목표 가격까지만)
            const swapResult = await this.amm.executeSwapUntilPrice(order.pair, order.side, optimalAmount, targetPrice);
            // Fill 생성
            const fill = {
                id: `amm-until-${chunkIndex}-${Date.now()}`,
                orderId: order.id,
                price: swapResult.effectivePrice.toString(),
                amount: swapResult.actualInputAmount ? swapResult.actualInputAmount.toString() : optimalAmount.toString(),
                side: order.side,
                source: 'AMM',
                timestamp: Date.now(),
                chunkIndex
            };
            const routing = {
                source: 'AMM',
                amount: fill.amount,
                price: fill.price,
                priceImpact: swapResult.priceImpact,
                chunkIndex
            };
            await this.recordTrade(fill, swapResult, order.userId);
            const actualAmount = parseFloat(fill.amount);
            return { fill, routing, actualAmount };
        }
        catch (error) {
            console.error(`❌ AMM until price processing failed:`, error);
            return null;
        }
    }
    /**
     * 최적 소스 선택 로직
     */
    selectBestSource(ammPrice, orderbookPrice, side) {
        if (!orderbookPrice) {
            return 'AMM'; // 오더북 호가 없으면 AMM
        }
        // 사용자에게 더 유리한 가격 선택
        if (side === 'buy') {
            return ammPrice <= orderbookPrice ? 'AMM' : 'Orderbook'; // 더 싼 가격
        }
        else {
            return ammPrice >= orderbookPrice ? 'AMM' : 'Orderbook'; // 더 비싼 가격
        }
    }
    /**
     * 🔥 AMM 청크 처리 - 오더북 가격까지만 제한적 처리
     */
    async processAMMChunk(order, remainingAmount, currentAmmPrice, nextOrderbookPrice, chunkIndex) {
        try {
            // 최적 청크 크기 계산
            const optimalChunkSize = this.calculateOptimalAMMChunk(remainingAmount, currentAmmPrice, nextOrderbookPrice, order.side);
            if (optimalChunkSize <= 0) {
                return null;
            }
            console.log(`🏦 AMM chunk ${chunkIndex}: processing ${optimalChunkSize} (${currentAmmPrice} → ${nextOrderbookPrice || 'unlimited'})`);
            // AMM 스왑 실행
            const swapResult = nextOrderbookPrice
                ? await this.amm.executeSwapUntilPrice(order.pair, order.side, optimalChunkSize, nextOrderbookPrice)
                : await this.amm.executeSwap(order.pair, order.side, optimalChunkSize);
            // Fill 생성
            const fill = {
                id: `amm-v2-${chunkIndex}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                orderId: order.id,
                price: swapResult.effectivePrice.toString(),
                amount: swapResult.actualInputAmount ? swapResult.actualInputAmount.toString() : optimalChunkSize.toString(),
                side: order.side,
                source: 'AMM',
                timestamp: Date.now(),
                chunkIndex
            };
            console.log(`🔍 AMM Fill Debug - Chunk ${chunkIndex}:`, {
                inputAmount: swapResult.actualInputAmount || optimalChunkSize,
                outputAmount: swapResult.outputAmount,
                effectivePrice: swapResult.effectivePrice,
                fillPrice: fill.price,
                fillAmount: fill.amount,
                side: order.side
            });
            // 라우팅 정보
            const routing = {
                source: 'AMM',
                amount: fill.amount,
                price: fill.price,
                priceImpact: swapResult.priceImpact,
                chunkIndex
            };
            // Redis와 PostgreSQL에 저장
            await this.recordTrade(fill, swapResult, order.userId);
            const actualAmount = parseFloat(fill.amount);
            return { fill, routing, actualAmount };
        }
        catch (error) {
            console.error(`❌ AMM chunk ${chunkIndex} processing failed:`, error);
            return null;
        }
    }
    /**
     * 🔥 오더북 청크 처리 - 해당 가격 레벨 전체 처리
     */
    async processOrderbookChunk(order, remainingAmount, orderbookPrice, chunkIndex) {
        try {
            // 해당 가격 레벨의 가용 수량 확인
            const availableAmount = await this.getOrderbookAvailableAmount(order.pair, orderbookPrice, order.side);
            const chunkSize = Math.min(remainingAmount, availableAmount);
            if (chunkSize <= 0) {
                return null;
            }
            console.log(`📖 Orderbook chunk ${chunkIndex}: processing ${chunkSize} at ${orderbookPrice}`);
            // 오더북에 Market 주문 전송
            const orderbookOrder = {
                id: `ob-v2-${chunkIndex}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                userId: order.userId,
                pair: order.pair,
                side: order.side,
                type: 'market',
                amount: chunkSize.toString(),
                price: orderbookPrice.toString(),
                remaining: chunkSize.toString(),
                status: 'active',
                timestamp: Date.now()
            };
            const matchResult = await this.matchingEngine.processOrder(orderbookOrder);
            if (matchResult.trades.length > 0) {
                const trade = matchResult.trades[0];
                const fill = {
                    id: trade.id,
                    orderId: order.id,
                    price: trade.price,
                    amount: trade.amount,
                    side: order.side,
                    source: 'Orderbook',
                    timestamp: trade.timestamp,
                    chunkIndex
                };
                const routing = {
                    source: 'Orderbook',
                    amount: fill.amount,
                    price: fill.price,
                    chunkIndex
                };
                // 오더북 거래도 PostgreSQL에 저장
                await this.recordTrade(fill, undefined, order.userId);
                const actualAmount = parseFloat(fill.amount);
                return { fill, routing, actualAmount };
            }
            return null;
        }
        catch (error) {
            console.error(`❌ Orderbook chunk ${chunkIndex} processing failed:`, error);
            return null;
        }
    }
    /**
     * 최적 AMM 청크 크기 계산
     */
    /**
     * 최적 AMM 청크 크기 계산 (개선됨)
     * - 다음 오더북 가격까지만 처리
     * - 슬리피지 고려
     */
    async calculateOptimalAMMChunk(remainingAmount, currentAmmPrice, nextOrderbookPrice, side) {
        if (!nextOrderbookPrice) {
            // 오더북 호가가 없으면 적당한 크기로 분할 (슬리피지 방지)
            const maxChunk = Math.min(this.MAX_AMM_CHUNK_SIZE, remainingAmount * 0.1); // 10%씩
            return Math.min(remainingAmount, maxChunk);
        }
        try {
            // 목표: 다음 오더북 가격까지만 AMM 실행
            const amountToReachPrice = await this.amm.getAmountToReachPrice('HYPERINDEX-USDC', nextOrderbookPrice, side);
            // 실제 실행량은 잔량과 계산된 양 중 작은 값
            const optimalAmount = Math.min(remainingAmount, Math.max(0, amountToReachPrice));
            // 너무 큰 청크는 슬리피지 위험이 있으므로 제한
            const safeAmount = Math.min(optimalAmount, this.MAX_AMM_CHUNK_SIZE);
            console.log(`🧮 AMM chunk calculation:`, {
                remaining: remainingAmount,
                toReachPrice: amountToReachPrice,
                optimal: optimalAmount,
                safe: safeAmount,
                currentPrice: currentAmmPrice,
                targetPrice: nextOrderbookPrice
            });
            return safeAmount;
        }
        catch (error) {
            console.error('Failed to calculate optimal AMM chunk:', error);
            // 에러 시 안전한 작은 청크 사용
            return Math.min(remainingAmount, 100);
        }
    }
    /**
     * 오더북 최우선 호가 조회
     */
    async getBestOrderbookPrice(pair, side) {
        try {
            const orderbook = await this.matchingEngine.getOrderbook(pair, 1);
            if (side === 'buy') {
                return orderbook.asks.length > 0 ? parseFloat(orderbook.asks[0].price) : null;
            }
            else {
                return orderbook.bids.length > 0 ? parseFloat(orderbook.bids[0].price) : null;
            }
        }
        catch (error) {
            console.error('Failed to get orderbook price:', error);
            return null;
        }
    }
    /**
     * 오더북 특정 가격 레벨의 가용 수량 조회
     */
    async getOrderbookAvailableAmount(pair, price, side) {
        try {
            const orderbook = await this.matchingEngine.getOrderbook(pair, 10);
            const levels = side === 'buy' ? orderbook.asks : orderbook.bids;
            const availableAmount = levels
                .filter(level => Math.abs(parseFloat(level.price) - price) < 0.0001)
                .reduce((sum, level) => sum + parseFloat(level.amount), 0);
            return availableAmount;
        }
        catch (error) {
            console.error('Failed to get orderbook available amount:', error);
            return 0;
        }
    }
    /**
     * 거래 기록 저장 (Redis + PostgreSQL)
     */
    async recordTrade(fill, swapResult, userId) {
        try {
            // V2: Redis 저장을 위해 RedisOrderbook에 직접 접근
            const { RedisOrderbook } = await Promise.resolve().then(() => require('../orderbook/redis-orderbook'));
            const redisOrderbook = new RedisOrderbook();
            await redisOrderbook.saveTrade('HYPERINDEX-USDC', {
                id: fill.id,
                pair: 'HYPERINDEX-USDC',
                price: fill.price,
                amount: fill.amount,
                side: fill.side,
                buyOrderId: fill.source === 'AMM' ? 'amm' : fill.orderId,
                sellOrderId: fill.source === 'AMM' ? 'amm' : fill.orderId,
                timestamp: fill.timestamp,
                source: fill.source
            });
            // PostgreSQL 저장 (AMM과 Orderbook 모두)
            await this.saveTradeToDatabase(fill, swapResult, userId);
            console.log(`💾 V2 Trade recorded: ${fill.id} (${fill.source})`);
        }
        catch (error) {
            console.warn('Failed to record trade:', error);
        }
    }
    /**
     * PostgreSQL 저장 - 마이그레이션 후 정상 동작
     */
    async saveTradeToDatabase(fill, swapResult, userId) {
        try {
            const { createClient } = await Promise.resolve().then(() => require('@supabase/supabase-js'));
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
            const tradeData = {
                pair: 'HYPERINDEX-USDC',
                price: parseFloat(fill.price),
                amount: parseFloat(fill.amount),
                side: fill.side,
                source: fill.source,
                user_id: userId,
                buyer_order_id: fill.source === 'AMM' ? 'amm' : fill.orderId,
                seller_order_id: fill.source === 'AMM' ? 'amm' : fill.orderId,
                buyer_fee: 0,
                seller_fee: 0,
                redis_trade_id: fill.id,
                executed_at: new Date(fill.timestamp).toISOString()
            };
            // AMM 추가 데이터 (있는 경우만)
            if (fill.source === 'AMM' && swapResult) {
                Object.assign(tradeData, {
                    price_impact: swapResult.priceImpact || 0,
                    amm_reserves_before: swapResult.reservesBefore || null,
                    amm_reserves_after: swapResult.reservesAfter || null
                });
            }
            console.log('💾 Saving trade to PostgreSQL:', {
                id: fill.id,
                source: fill.source,
                hasAMMData: fill.source === 'AMM' && swapResult
            });
            const { error } = await supabase
                .from('trade_history')
                .insert(tradeData);
            if (error) {
                console.error('💥 PostgreSQL insert failed:', error);
                throw new Error(`Database insert failed: ${error.message}`);
            }
            console.log('✅ Trade saved to PostgreSQL successfully');
        }
        catch (error) {
            console.error('💥 saveTradeToDatabase failed:', error);
            // 거래 기록 실패가 전체 거래를 막지 않도록 warning으로 처리  
            console.warn('⚠️ Trade will continue without PostgreSQL record');
        }
    }
    /**
     * 지정가 주문 처리 (기존 로직 유지)
     */
    async processLimitOrder(order) {
        const ammPrice = await this.amm.getSpotPrice(order.pair);
        const limitPrice = parseFloat(order.price);
        // AMM 가격 검증
        if ((order.side === 'buy' && limitPrice > ammPrice) ||
            (order.side === 'sell' && limitPrice < ammPrice)) {
            throw new Error(`Limit price crosses market price. Place market order instead.`);
        }
        // 오더북에 등록
        const matchResult = await this.matchingEngine.processOrder(order);
        const fills = matchResult.trades.map((trade, index) => ({
            id: trade.id,
            orderId: order.id,
            price: trade.price,
            amount: trade.amount,
            side: order.side,
            source: 'Orderbook',
            timestamp: trade.timestamp,
            chunkIndex: index + 1
        }));
        const totalFilled = fills.reduce((sum, fill) => sum + parseFloat(fill.amount), 0);
        const averagePrice = fills.length > 0 ? parseFloat(fills[0].price) : parseFloat(order.price);
        return {
            fills,
            totalFilled: totalFilled.toString(),
            averagePrice: averagePrice.toString(),
            routing: fills.map((fill, index) => ({
                source: 'Orderbook',
                amount: fill.amount,
                price: fill.price,
                chunkIndex: index + 1
            })),
            executionStats: {
                totalChunks: fills.length,
                ammChunks: 0,
                orderbookChunks: fills.length,
                iterations: 1
            }
        };
    }
    /**
     * 최적 거래 경로 추천 (V2 업데이트)
     */
    async getOptimalRoute(pair, side, amount) {
        const ammPrice = await this.amm.getSpotPrice(pair);
        const orderbookPrice = await this.getBestOrderbookPrice(pair, side);
        const amountNum = parseFloat(amount);
        // 간단한 시뮬레이션으로 청크 수 추정
        let estimatedChunks = 1;
        if (amountNum > this.MAX_AMM_CHUNK_SIZE) {
            estimatedChunks = Math.ceil(amountNum / this.MAX_AMM_CHUNK_SIZE);
        }
        let recommended = 'AMM';
        if (orderbookPrice) {
            const bestSource = this.selectBestSource(ammPrice, orderbookPrice, side);
            if (bestSource === 'AMM' && estimatedChunks > 3) {
                recommended = 'Hybrid';
            }
            else if (bestSource === 'Orderbook') {
                recommended = 'Orderbook';
            }
        }
        // 가격 영향 계산
        const simulation = await this.amm.calculateSwapOutput(pair, side, Math.min(amountNum, 1000));
        return {
            recommended,
            ammPrice,
            orderbookPrice,
            priceImpact: simulation.priceImpact,
            estimatedChunks,
            estimatedGas: (estimatedChunks * 0.001).toString()
        };
    }
}
exports.HybridSmartRouterV2 = HybridSmartRouterV2;
