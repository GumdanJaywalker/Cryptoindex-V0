// lib/trading/order-service.ts
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { getHyperCoreInterface } from '@/lib/blockchain/hypercore-interface';
import { PortfolioService } from './portfolio-service';
import type { Order, TradeResult } from '@/lib/blockchain/hypercore-interface';

interface CreateOrderRequest {
  userId: string;
  tokenAddress: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: string;
  price?: string;
  walletPrivateKey?: string; // For testing - remove in production
}

interface CreateOrderResult {
  success: boolean;
  order?: any;
  error?: string;
}

interface CancelOrderResult {
  success: boolean;
  error?: string;
}

export class TradingOrderService {
  private static instance: TradingOrderService;
  private supabase;
  private hyperCore;
  private portfolioService;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.hyperCore = getHyperCoreInterface();
    this.portfolioService = PortfolioService.getInstance();
  }

  static getInstance(): TradingOrderService {
    if (!TradingOrderService.instance) {
      TradingOrderService.instance = new TradingOrderService();
    }
    return TradingOrderService.instance;
  }

  /**
   * Create a new trading order
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResult> {
    try {
      console.log(`🔄 Creating ${request.side} order for ${request.amount} ${request.tokenAddress}`);

      // Validate amount
      const amountNum = parseFloat(request.amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return {
          success: false,
          error: 'Invalid order amount'
        };
      }

      // Validate price for limit orders
      if (request.type === 'limit') {
        if (!request.price) {
          return {
            success: false,
            error: 'Price is required for limit orders'
          };
        }
        
        const priceNum = parseFloat(request.price);
        if (isNaN(priceNum) || priceNum <= 0) {
          return {
            success: false,
            error: 'Invalid order price'
          };
        }
      }

      // Check user balances for buy orders
      if (request.side === 'buy') {
        const hasBalance = await this.validateBuyOrderBalance(
          request.userId,
          request.tokenAddress,
          request.amount,
          request.price,
          request.type
        );
        
        if (!hasBalance.valid) {
          return {
            success: false,
            error: hasBalance.error
          };
        }
      }

      // Check user position for sell orders
      if (request.side === 'sell') {
        const hasPosition = await this.validateSellOrderPosition(
          request.userId,
          request.tokenAddress,
          request.amount
        );
        
        if (!hasPosition.valid) {
          return {
            success: false,
            error: hasPosition.error
          };
        }
      }

      // Create order record in database
      const { data: orderData, error: dbError } = await this.supabase
        .from('trading_orders')
        .insert({
          user_id: request.userId,
          token_address: request.tokenAddress,
          order_type: request.type,
          side: request.side,
          amount: request.amount,
          price: request.price,
          status: 'pending',
          remaining_amount: request.amount
        })
        .select()
        .single();

      if (dbError || !orderData) {
        console.error('❌ Failed to create order in database:', dbError);
        return {
          success: false,
          error: 'Failed to create order record'
        };
      }

      // Submit order to HyperCore
      const hypercoreResult = await this.submitOrderToHyperCore({
        id: orderData.id,
        tokenAddress: request.tokenAddress,
        type: request.type,
        side: request.side,
        amount: request.amount,
        price: request.price,
        status: 'pending',
        userId: request.userId
      }, request.walletPrivateKey);

      if (!hypercoreResult.success) {
        // Update order status as failed
        await this.supabase
          .from('trading_orders')
          .update({
            status: 'cancelled',
            error_message: hypercoreResult.error,
            cancelled_at: new Date().toISOString()
          })
          .eq('id', orderData.id);

        return {
          success: false,
          error: hypercoreResult.error
        };
      }

      // Update order with HyperCore information
      const { data: updatedOrder, error: updateError } = await this.supabase
        .from('trading_orders')
        .update({
          hypercore_order_id: hypercoreResult.orderId,
          transaction_hash: hypercoreResult.txHash
        })
        .eq('id', orderData.id)
        .select(`
          *,
          index_tokens!inner(symbol, name)
        `)
        .single();

      if (updateError) {
        console.error('❌ Failed to update order with HyperCore info:', updateError);
      }

      // Start monitoring order status
      this.monitorOrderStatus(orderData.id, hypercoreResult.orderId || '');

      console.log(`✅ Order created successfully: ${orderData.id}`);

      return {
        success: true,
        order: {
          id: updatedOrder?.id || orderData.id,
          tokenAddress: request.tokenAddress,
          symbol: updatedOrder?.index_tokens?.symbol || 'UNKNOWN',
          type: request.type,
          side: request.side,
          amount: request.amount,
          price: request.price,
          status: 'pending',
          hypercoreOrderId: hypercoreResult.orderId,
          transactionHash: hypercoreResult.txHash,
          createdAt: orderData.created_at
        }
      };

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Cancel an existing order
   */
  async cancelOrder(orderId: string, userId: string): Promise<CancelOrderResult> {
    try {
      console.log(`🔄 Cancelling order: ${orderId}`);

      // Get order details
      const { data: order, error: orderError } = await this.supabase
        .from('trading_orders')
        .select('id, hypercore_order_id, status, user_id')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (orderError || !order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      if (order.status !== 'pending' && order.status !== 'partial') {
        return {
          success: false,
          error: 'Order cannot be cancelled'
        };
      }

      // Cancel on HyperCore if we have the ID
      if (order.hypercore_order_id) {
        const wallet = this.getTestWallet(); // In production, use user's wallet
        const cancelResult = await this.hyperCore.cancelOrder(
          order.hypercore_order_id,
          wallet
        );

        if (!cancelResult.success) {
          return {
            success: false,
            error: `Failed to cancel on HyperCore: ${cancelResult.error}`
          };
        }
      }

      // Update order status in database
      const { error: updateError } = await this.supabase
        .from('trading_orders')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Failed to update cancelled order:', updateError);
        return {
          success: false,
          error: 'Failed to update order status'
        };
      }

      // Update user balances
      await this.portfolioService.updateUserBalances(userId);

      console.log(`✅ Order cancelled successfully: ${orderId}`);

      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Order cancellation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Submit order to HyperCore
   */
  private async submitOrderToHyperCore(order: Order, walletPrivateKey?: string): Promise<TradeResult> {
    try {
      // In production, this would use the user's connected wallet
      // For testing, we use a test wallet
      const wallet = walletPrivateKey 
        ? new ethers.Wallet(walletPrivateKey)
        : this.getTestWallet();

      return await this.hyperCore.placeOrder(order, wallet);

    } catch (error) {
      console.error('❌ Failed to submit order to HyperCore:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'HyperCore submission failed'
      };
    }
  }

  /**
   * Validate balance for buy orders
   */
  private async validateBuyOrderBalance(
    userId: string,
    tokenAddress: string,
    amount: string,
    price: string | undefined,
    type: 'market' | 'limit'
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // For buy orders, we need USDC balance
      const usdcAddress = '0xA0b86991c431C924b3c27dF22c2F7aD5e8b6d8E67'; // Example USDC address

      // Get current USDC balance
      const { data: balance } = await this.supabase
        .from('user_balances')
        .select('available_balance')
        .eq('user_id', userId)
        .eq('token_address', usdcAddress)
        .single();

      const availableBalance = parseFloat(balance?.available_balance || '0');
      
      // Calculate required amount
      let requiredAmount: number;
      
      if (type === 'market') {
        // For market orders, estimate using current spot price
        const spotPrice = await this.hyperCore.getSpotPrice(tokenAddress);
        requiredAmount = parseFloat(amount) * parseFloat(spotPrice);
      } else {
        // For limit orders, use specified price
        requiredAmount = parseFloat(amount) * parseFloat(price!);
      }

      if (availableBalance < requiredAmount) {
        return {
          valid: false,
          error: `Insufficient USDC balance. Required: ${requiredAmount.toFixed(4)}, Available: ${availableBalance.toFixed(4)}`
        };
      }

      return { valid: true };

    } catch (error) {
      console.error('❌ Balance validation failed:', error);
      return {
        valid: false,
        error: 'Failed to validate balance'
      };
    }
  }

  /**
   * Validate position for sell orders
   */
  private async validateSellOrderPosition(
    userId: string,
    tokenAddress: string,
    amount: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // Get current position
      const { data: position } = await this.supabase
        .from('trading_positions')
        .select('amount')
        .eq('user_id', userId)
        .eq('token_address', tokenAddress)
        .single();

      const availableAmount = parseFloat(position?.amount || '0');
      const requiredAmount = parseFloat(amount);

      if (availableAmount < requiredAmount) {
        return {
          valid: false,
          error: `Insufficient token balance. Required: ${requiredAmount}, Available: ${availableAmount}`
        };
      }

      return { valid: true };

    } catch (error) {
      console.error('❌ Position validation failed:', error);
      return {
        valid: false,
        error: 'Failed to validate position'
      };
    }
  }

  /**
   * Monitor order status changes
   */
  private async monitorOrderStatus(orderId: string, hypercoreOrderId: string): Promise<void> {
    if (!hypercoreOrderId) return;

    try {
      // Check order status every 10 seconds for 5 minutes
      const maxChecks = 30;
      let checks = 0;

      const checkStatus = async () => {
        try {
          const status = await this.hyperCore.getOrderStatus(hypercoreOrderId);
          
          if (status === 'filled' || status === 'partial') {
            // Update order status in database
            await this.updateOrderFromHyperCore(orderId, hypercoreOrderId);
          }
          
          if (status === 'filled' || status === 'cancelled' || checks >= maxChecks) {
            return; // Stop monitoring
          }
          
          checks++;
          setTimeout(checkStatus, 10000); // Check again in 10 seconds
          
        } catch (error) {
          console.error('❌ Order status check failed:', error);
        }
      };

      // Start monitoring
      setTimeout(checkStatus, 10000);

    } catch (error) {
      console.error('❌ Failed to start order monitoring:', error);
    }
  }

  /**
   * Update order from HyperCore status
   */
  private async updateOrderFromHyperCore(orderId: string, hypercoreOrderId: string): Promise<void> {
    try {
      // In a real implementation, you'd query HyperCore for fill information
      // For now, we'll simulate a filled order
      
      const { data: order } = await this.supabase
        .from('trading_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!order) return;

      // Simulate order fill
      const fillAmount = order.amount; // Full fill for simplicity
      const fillPrice = order.price || await this.hyperCore.getSpotPrice(order.token_address);

      // Update order
      await this.supabase
        .from('trading_orders')
        .update({
          status: 'filled',
          filled_amount: fillAmount,
          remaining_amount: '0',
          average_fill_price: fillPrice,
          filled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      // Record trade
      await this.supabase
        .from('trade_history')
        .insert({
          user_id: order.user_id,
          order_id: orderId,
          token_address: order.token_address,
          side: order.side,
          amount: fillAmount,
          price: fillPrice,
          total_value: (parseFloat(fillAmount) * parseFloat(fillPrice)).toString()
        });

      // Update user positions and balances
      await this.portfolioService.updatePositionFromTrade({
        userId: order.user_id,
        tokenAddress: order.token_address,
        side: order.side,
        amount: fillAmount,
        price: fillPrice
      });

      console.log(`✅ Order filled and updated: ${orderId}`);

    } catch (error) {
      console.error('❌ Failed to update order from HyperCore:', error);
    }
  }

  /**
   * Get test wallet for development
   */
  private getTestWallet(): ethers.Wallet {
    const testPrivateKey = process.env.TEST_WALLET_PRIVATE_KEY || 
      '0x' + '1'.repeat(64); // Dummy key for testing
    
    return new ethers.Wallet(testPrivateKey);
  }
}

export default TradingOrderService;