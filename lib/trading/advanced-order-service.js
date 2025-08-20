// lib/trading/advanced-order-service.ts
import { createClient } from '@supabase/supabase-js';
export class AdvancedOrderService {
    static instance;
    supabase;
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    static getInstance() {
        if (!AdvancedOrderService.instance) {
            AdvancedOrderService.instance = new AdvancedOrderService();
        }
        return AdvancedOrderService.instance;
    }
    /**
     * Create advanced order with full validation
     */
    async createAdvancedOrder(request) {
        try {
            console.log(`🔄 Creating ${request.type} order: ${request.side} ${request.amount} ${request.tokenAddress}`);
            // Validate order request
            const validation = await this.validateOrderRequest(request);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }
            // Generate unique order ID
            const orderId = this.generateOrderId();
            const clientOrderId = request.clientOrderId || this.generateClientOrderId();
            // Check for duplicate client order ID
            if (request.clientOrderId) {
                const existingOrder = await this.getOrderByClientId(request.userId, request.clientOrderId);
                if (existingOrder) {
                    return {
                        success: false,
                        error: 'Duplicate client order ID'
                    };
                }
            }
            // Prepare order data
            const orderData = {
                id: orderId,
                userId: request.userId,
                tokenAddress: request.tokenAddress,
                symbol: await this.getTokenSymbol(request.tokenAddress),
                type: request.type,
                side: request.side,
                amount: request.amount,
                filledAmount: '0',
                remainingAmount: request.amount,
                price: request.price,
                triggerPrice: request.triggerPrice,
                triggerCondition: request.triggerCondition,
                trailAmount: request.trailAmount,
                trailPercent: request.trailPercent,
                timeInForce: request.timeInForce || 'GTC',
                expireTime: request.expireTime,
                status: this.getInitialOrderStatus(request.type),
                reduceOnly: request.reduceOnly || false,
                postOnly: request.postOnly || false,
                clientOrderId,
                ocoGroup: request.ocoGroup,
                linkedOrderId: request.linkedOrderId,
                visibleSize: request.visibleSize,
                leverage: request.leverage,
                marginType: request.marginType,
                averagePrice: '0',
                totalFees: '0',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // Handle special order types
            await this.preprocessSpecialOrders(request, orderData);
            // Save order to database
            const { error: dbError } = await this.supabase
                .from('advanced_orders')
                .insert({
                id: orderData.id,
                user_id: orderData.userId,
                token_address: orderData.tokenAddress,
                symbol: orderData.symbol,
                order_type: orderData.type,
                side: orderData.side,
                amount: orderData.amount,
                filled_amount: orderData.filledAmount,
                remaining_amount: orderData.remainingAmount,
                price: orderData.price,
                trigger_price: orderData.triggerPrice,
                trigger_condition: orderData.triggerCondition,
                trail_amount: orderData.trailAmount,
                trail_percent: orderData.trailPercent,
                current_trail_price: orderData.currentTrailPrice,
                time_in_force: orderData.timeInForce,
                expire_time: orderData.expireTime?.toISOString(),
                status: orderData.status,
                reduce_only: orderData.reduceOnly,
                post_only: orderData.postOnly,
                client_order_id: orderData.clientOrderId,
                oco_group: orderData.ocoGroup,
                linked_order_id: orderData.linkedOrderId,
                visible_size: orderData.visibleSize,
                leverage: orderData.leverage,
                margin_type: orderData.marginType,
                average_price: orderData.averagePrice,
                total_fees: orderData.totalFees,
                created_at: orderData.createdAt.toISOString(),
                updated_at: orderData.updatedAt.toISOString()
            });
            if (dbError) {
                console.error('❌ Database error:', dbError);
                return {
                    success: false,
                    error: 'Failed to save order'
                };
            }
            // Process order based on type
            const processResult = await this.processOrder(orderData);
            if (!processResult.success) {
                // Cancel order if processing failed
                await this.cancelOrder(orderId, 'Processing failed: ' + processResult.error);
                return {
                    success: false,
                    error: processResult.error
                };
            }
            console.log(`✅ ${request.type} order created: ${orderId}`);
            return {
                success: true,
                order: orderData
            };
        }
        catch (error) {
            console.error('❌ Order creation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Process order based on its type
     */
    async processOrder(order) {
        try {
            switch (order.type) {
                case 'market':
                    return await this.processMarketOrder(order);
                case 'limit':
                    return await this.processLimitOrder(order);
                case 'stop_loss':
                case 'stop_limit':
                    return await this.processStopOrder(order);
                case 'take_profit':
                case 'take_limit_profit':
                    return await this.processTakeProfitOrder(order);
                case 'trailing_stop':
                    return await this.processTrailingStopOrder(order);
                case 'oco':
                    return await this.processOCOOrder(order);
                case 'iceberg':
                    return await this.processIcebergOrder(order);
                default:
                    return {
                        success: false,
                        error: `Unsupported order type: ${order.type}`
                    };
            }
        }
        catch (error) {
            console.error(`❌ Order processing failed for ${order.id}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Processing failed'
            };
        }
    }
    /**
     * Process market order (immediate execution)
     */
    async processMarketOrder(order) {
        console.log(`🏃 Processing market order ${order.id}`);
        try {
            // Get current market price
            const marketPrice = await this.getCurrentMarketPrice(order.tokenAddress);
            if (!marketPrice) {
                return {
                    success: false,
                    error: 'Market price unavailable'
                };
            }
            // Calculate slippage for market order
            const slippage = this.calculateMarketSlippage(order.amount, order.side);
            const executionPrice = this.applySlippage(marketPrice, slippage, order.side);
            // Execute immediately
            const execution = await this.executeOrder(order, executionPrice, order.amount);
            if (execution.success) {
                await this.updateOrderStatus(order.id, 'filled', {
                    filledAmount: order.amount,
                    remainingAmount: '0',
                    averagePrice: executionPrice,
                    executedAt: new Date()
                });
                console.log(`✅ Market order ${order.id} executed at ${executionPrice}`);
                return { success: true };
            }
            else {
                return {
                    success: false,
                    error: execution.error
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Market order execution failed'
            };
        }
    }
    /**
     * Process limit order (specific price)
     */
    async processLimitOrder(order) {
        console.log(`📋 Processing limit order ${order.id} at ${order.price}`);
        if (!order.price) {
            return {
                success: false,
                error: 'Limit price required for limit order'
            };
        }
        try {
            // Check if limit order can be filled immediately
            const currentPrice = await this.getCurrentMarketPrice(order.tokenAddress);
            const canFillImmediately = this.canLimitOrderFillImmediately(order.side, order.price, currentPrice);
            if (canFillImmediately) {
                // Handle Time-in-Force
                if (order.timeInForce === 'IOC' || order.timeInForce === 'FOK') {
                    // Try to fill immediately
                    const availableLiquidity = await this.getAvailableLiquidity(order.tokenAddress, order.side === 'buy' ? 'sell' : 'buy', order.price);
                    if (order.timeInForce === 'FOK' && availableLiquidity < parseFloat(order.amount)) {
                        // FOK: Fill entire order or cancel
                        await this.cancelOrder(order.id, 'FOK order cannot be filled completely');
                        return { success: true }; // Not an error, just cancelled
                    }
                    // Execute available amount
                    const fillAmount = Math.min(availableLiquidity, parseFloat(order.amount)).toString();
                    const execution = await this.executeOrder(order, order.price, fillAmount);
                    if (execution.success) {
                        const remainingAmount = (parseFloat(order.amount) - parseFloat(fillAmount)).toString();
                        if (remainingAmount === '0') {
                            // Fully filled
                            await this.updateOrderStatus(order.id, 'filled', {
                                filledAmount: fillAmount,
                                remainingAmount: '0',
                                averagePrice: order.price,
                                executedAt: new Date()
                            });
                        }
                        else if (order.timeInForce === 'IOC') {
                            // IOC: Cancel remaining
                            await this.updateOrderStatus(order.id, 'partially_filled', {
                                filledAmount: fillAmount,
                                remainingAmount
                            });
                            await this.cancelOrder(order.id, 'IOC order partially filled, remaining cancelled');
                        }
                    }
                }
                else {
                    // GTC: Add to order book
                    await this.addToOrderBook(order);
                    await this.updateOrderStatus(order.id, 'open');
                }
            }
            else {
                // Cannot fill immediately, add to order book
                if (order.timeInForce === 'IOC' || order.timeInForce === 'FOK') {
                    // IOC/FOK orders that cannot fill immediately are cancelled
                    await this.cancelOrder(order.id, `${order.timeInForce} order cannot be filled immediately`);
                    return { success: true };
                }
                await this.addToOrderBook(order);
                await this.updateOrderStatus(order.id, 'open');
            }
            console.log(`✅ Limit order ${order.id} processed`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Limit order processing failed'
            };
        }
    }
    /**
     * Process stop loss order
     */
    async processStopOrder(order) {
        console.log(`🛑 Processing stop order ${order.id} with trigger ${order.triggerPrice}`);
        if (!order.triggerPrice) {
            return {
                success: false,
                error: 'Trigger price required for stop order'
            };
        }
        try {
            // Add to stop order monitoring
            await this.addToStopOrderMonitoring(order);
            await this.updateOrderStatus(order.id, 'open');
            console.log(`✅ Stop order ${order.id} added to monitoring`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Stop order processing failed'
            };
        }
    }
    /**
     * Process take profit order
     */
    async processTakeProfitOrder(order) {
        console.log(`🎯 Processing take profit order ${order.id} with trigger ${order.triggerPrice}`);
        if (!order.triggerPrice) {
            return {
                success: false,
                error: 'Trigger price required for take profit order'
            };
        }
        try {
            // Add to take profit monitoring
            await this.addToTakeProfitMonitoring(order);
            await this.updateOrderStatus(order.id, 'open');
            console.log(`✅ Take profit order ${order.id} added to monitoring`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Take profit order processing failed'
            };
        }
    }
    /**
     * Process trailing stop order
     */
    async processTrailingStopOrder(order) {
        console.log(`📈 Processing trailing stop order ${order.id}`);
        if (!order.trailAmount && !order.trailPercent) {
            return {
                success: false,
                error: 'Trail amount or trail percent required for trailing stop'
            };
        }
        try {
            // Initialize trailing stop
            const currentPrice = await this.getCurrentMarketPrice(order.tokenAddress);
            const initialTrailPrice = this.calculateInitialTrailPrice(currentPrice, order.side, order.trailAmount, order.trailPercent);
            // Update order with initial trail price
            await this.updateOrderTrailPrice(order.id, initialTrailPrice);
            // Add to trailing stop monitoring
            await this.addToTrailingStopMonitoring(order);
            await this.updateOrderStatus(order.id, 'open');
            console.log(`✅ Trailing stop order ${order.id} initialized with trail price ${initialTrailPrice}`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Trailing stop processing failed'
            };
        }
    }
    /**
     * Process OCO (One-Cancels-Other) order
     */
    async processOCOOrder(order) {
        console.log(`🔄 Processing OCO order ${order.id} in group ${order.ocoGroup}`);
        if (!order.ocoGroup) {
            return {
                success: false,
                error: 'OCO group required for OCO order'
            };
        }
        try {
            // Add to OCO group management
            await this.addToOCOGroup(order);
            // Process the underlying order type
            const underlyingResult = await this.processUnderlyingOrder(order);
            if (underlyingResult.success) {
                await this.updateOrderStatus(order.id, 'open');
                console.log(`✅ OCO order ${order.id} processed`);
            }
            return underlyingResult;
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'OCO order processing failed'
            };
        }
    }
    /**
     * Process iceberg order
     */
    async processIcebergOrder(order) {
        console.log(`🧊 Processing iceberg order ${order.id} with visible size ${order.visibleSize}`);
        if (!order.visibleSize) {
            return {
                success: false,
                error: 'Visible size required for iceberg order'
            };
        }
        try {
            // Create first chunk of iceberg order
            await this.createIcebergChunk(order, order.visibleSize);
            await this.updateOrderStatus(order.id, 'open');
            console.log(`✅ Iceberg order ${order.id} first chunk created`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Iceberg order processing failed'
            };
        }
    }
    // Helper methods continue in next part...
    /**
     * Validate order request
     */
    async validateOrderRequest(request) {
        // Validate required fields
        if (!request.userId || !request.tokenAddress || !request.type || !request.side || !request.amount) {
            return {
                isValid: false,
                error: 'Missing required fields'
            };
        }
        // Validate amounts
        if (parseFloat(request.amount) <= 0) {
            return {
                isValid: false,
                error: 'Amount must be positive'
            };
        }
        // Validate prices
        if (request.price && parseFloat(request.price) <= 0) {
            return {
                isValid: false,
                error: 'Price must be positive'
            };
        }
        if (request.triggerPrice && parseFloat(request.triggerPrice) <= 0) {
            return {
                isValid: false,
                error: 'Trigger price must be positive'
            };
        }
        // Validate order type specific requirements
        const typeValidation = await this.validateOrderTypeRequirements(request);
        if (!typeValidation.isValid) {
            return typeValidation;
        }
        // Validate token exists and is tradeable
        const tokenValidation = await this.validateToken(request.tokenAddress);
        if (!tokenValidation.isValid) {
            return tokenValidation;
        }
        // Validate user balance (if not reduce-only)
        if (!request.reduceOnly && request.side === 'buy') {
            const balanceValidation = await this.validateUserBalance(request.userId, request.tokenAddress, request.amount, request.price);
            if (!balanceValidation.isValid) {
                return balanceValidation;
            }
        }
        return { isValid: true };
    }
    async validateOrderTypeRequirements(request) {
        switch (request.type) {
            case 'limit':
            case 'stop_limit':
            case 'take_limit_profit':
                if (!request.price) {
                    return {
                        isValid: false,
                        error: `Price required for ${request.type} order`
                    };
                }
                break;
            case 'stop_loss':
            case 'stop_limit':
            case 'take_profit':
            case 'take_limit_profit':
                if (!request.triggerPrice) {
                    return {
                        isValid: false,
                        error: `Trigger price required for ${request.type} order`
                    };
                }
                break;
            case 'trailing_stop':
                if (!request.trailAmount && !request.trailPercent) {
                    return {
                        isValid: false,
                        error: 'Trail amount or trail percent required for trailing stop'
                    };
                }
                break;
            case 'oco':
                if (!request.ocoGroup) {
                    return {
                        isValid: false,
                        error: 'OCO group required for OCO order'
                    };
                }
                break;
            case 'iceberg':
                if (!request.visibleSize) {
                    return {
                        isValid: false,
                        error: 'Visible size required for iceberg order'
                    };
                }
                if (parseFloat(request.visibleSize) >= parseFloat(request.amount)) {
                    return {
                        isValid: false,
                        error: 'Visible size must be less than total amount'
                    };
                }
                break;
        }
        return { isValid: true };
    }
    // Placeholder implementations for helper methods
    generateOrderId() {
        return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateClientOrderId() {
        return `cloid_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }
    async getTokenSymbol(tokenAddress) {
        // Get from database or default
        const { data } = await this.supabase
            .from('index_tokens')
            .select('symbol')
            .eq('token_address', tokenAddress)
            .single();
        return data?.symbol || 'UNKNOWN';
    }
    getInitialOrderStatus(orderType) {
        switch (orderType) {
            case 'market':
                return 'pending'; // Will be filled immediately
            case 'stop_loss':
            case 'stop_limit':
            case 'take_profit':
            case 'take_limit_profit':
            case 'trailing_stop':
                return 'pending'; // Waiting for trigger
            default:
                return 'pending'; // Standard orders start as pending
        }
    }
    // More helper methods would be implemented here...
    async preprocessSpecialOrders(request, orderData) {
        // Handle special preprocessing for different order types
    }
    async getOrderByClientId(userId, clientOrderId) {
        const { data } = await this.supabase
            .from('advanced_orders')
            .select('*')
            .eq('user_id', userId)
            .eq('client_order_id', clientOrderId)
            .single();
        return data ? this.mapDbOrderToOrder(data) : null;
    }
    mapDbOrderToOrder(dbOrder) {
        return {
            id: dbOrder.id,
            userId: dbOrder.user_id,
            tokenAddress: dbOrder.token_address,
            symbol: dbOrder.symbol,
            type: dbOrder.order_type,
            side: dbOrder.side,
            amount: dbOrder.amount,
            filledAmount: dbOrder.filled_amount,
            remainingAmount: dbOrder.remaining_amount,
            price: dbOrder.price,
            triggerPrice: dbOrder.trigger_price,
            triggerCondition: dbOrder.trigger_condition,
            trailAmount: dbOrder.trail_amount,
            trailPercent: dbOrder.trail_percent,
            currentTrailPrice: dbOrder.current_trail_price,
            timeInForce: dbOrder.time_in_force,
            expireTime: dbOrder.expire_time ? new Date(dbOrder.expire_time) : undefined,
            status: dbOrder.status,
            reduceOnly: dbOrder.reduce_only,
            postOnly: dbOrder.post_only,
            clientOrderId: dbOrder.client_order_id,
            ocoGroup: dbOrder.oco_group,
            linkedOrderId: dbOrder.linked_order_id,
            visibleSize: dbOrder.visible_size,
            leverage: dbOrder.leverage,
            marginType: dbOrder.margin_type,
            averagePrice: dbOrder.average_price,
            totalFees: dbOrder.total_fees,
            createdAt: new Date(dbOrder.created_at),
            updatedAt: new Date(dbOrder.updated_at),
            executedAt: dbOrder.executed_at ? new Date(dbOrder.executed_at) : undefined,
            cancelledAt: dbOrder.cancelled_at ? new Date(dbOrder.cancelled_at) : undefined
        };
    }
    // Placeholder methods for market operations
    async getCurrentMarketPrice(tokenAddress) {
        // Mock price - in real implementation, get from price feed
        return (Math.random() * 100 + 1).toFixed(6);
    }
    calculateMarketSlippage(amount, side) {
        // Simple slippage calculation - in real implementation, use order book depth
        const baseSlippage = parseFloat(amount) * 0.001; // 0.1% base slippage
        return Math.min(baseSlippage, 0.05); // Max 5% slippage
    }
    applySlippage(price, slippage, side) {
        const basePrice = parseFloat(price);
        const slippageMultiplier = side === 'buy' ? (1 + slippage) : (1 - slippage);
        return (basePrice * slippageMultiplier).toFixed(6);
    }
    async executeOrder(order, price, amount) {
        // Mock execution - in real implementation, execute against order book
        console.log(`🔥 Executing ${amount} ${order.symbol} at ${price}`);
        return { success: true };
    }
    async updateOrderStatus(orderId, status, updates = {}) {
        const updateData = {
            status,
            updated_at: new Date().toISOString()
        };
        if (updates.filledAmount)
            updateData.filled_amount = updates.filledAmount;
        if (updates.remainingAmount)
            updateData.remaining_amount = updates.remainingAmount;
        if (updates.averagePrice)
            updateData.average_price = updates.averagePrice;
        if (updates.executedAt)
            updateData.executed_at = updates.executedAt.toISOString();
        if (updates.cancelledAt)
            updateData.cancelled_at = updates.cancelledAt.toISOString();
        await this.supabase
            .from('advanced_orders')
            .update(updateData)
            .eq('id', orderId);
    }
    async cancelOrder(orderId, reason) {
        await this.updateOrderStatus(orderId, 'cancelled', {
            cancelledAt: new Date()
        });
        console.log(`❌ Order ${orderId} cancelled: ${reason}`);
    }
    canLimitOrderFillImmediately(side, limitPrice, marketPrice) {
        const limit = parseFloat(limitPrice);
        const market = parseFloat(marketPrice);
        if (side === 'buy') {
            return limit >= market; // Buy limit at or above market price
        }
        else {
            return limit <= market; // Sell limit at or below market price
        }
    }
    async getAvailableLiquidity(tokenAddress, side, price) {
        // Mock liquidity - in real implementation, query order book
        return Math.random() * 1000 + 100;
    }
    // Additional placeholder methods for order book and monitoring
    async addToOrderBook(order) {
        console.log(`📚 Adding ${order.type} order ${order.id} to order book`);
    }
    async addToStopOrderMonitoring(order) {
        console.log(`🔍 Adding stop order ${order.id} to monitoring`);
    }
    async addToTakeProfitMonitoring(order) {
        console.log(`🎯 Adding take profit order ${order.id} to monitoring`);
    }
    async addToTrailingStopMonitoring(order) {
        console.log(`📈 Adding trailing stop order ${order.id} to monitoring`);
    }
    async addToOCOGroup(order) {
        console.log(`🔄 Adding OCO order ${order.id} to group ${order.ocoGroup}`);
    }
    async createIcebergChunk(order, chunkSize) {
        console.log(`🧊 Creating iceberg chunk ${chunkSize} for order ${order.id}`);
    }
    async processUnderlyingOrder(order) {
        // Process the underlying order type for OCO orders
        return { success: true };
    }
    calculateInitialTrailPrice(currentPrice, side, trailAmount, trailPercent) {
        const price = parseFloat(currentPrice);
        if (trailAmount) {
            const trail = parseFloat(trailAmount);
            return side === 'buy' ? (price + trail).toFixed(6) : (price - trail).toFixed(6);
        }
        else if (trailPercent) {
            const trail = price * (parseFloat(trailPercent) / 100);
            return side === 'buy' ? (price + trail).toFixed(6) : (price - trail).toFixed(6);
        }
        return currentPrice;
    }
    async updateOrderTrailPrice(orderId, trailPrice) {
        await this.supabase
            .from('advanced_orders')
            .update({
            current_trail_price: trailPrice,
            updated_at: new Date().toISOString()
        })
            .eq('id', orderId);
    }
    async validateToken(tokenAddress) {
        // Check if token is tradeable
        const { data } = await this.supabase
            .from('index_tokens')
            .select('is_tradeable')
            .eq('token_address', tokenAddress)
            .single();
        if (!data || !data.is_tradeable) {
            return {
                isValid: false,
                error: 'Token is not tradeable'
            };
        }
        return { isValid: true };
    }
    async validateUserBalance(userId, tokenAddress, amount, price) {
        // Mock balance validation - in real implementation, check user balance
        return { isValid: true };
    }
}
export default AdvancedOrderService;
