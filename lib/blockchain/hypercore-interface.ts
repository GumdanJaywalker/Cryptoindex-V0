// lib/blockchain/hypercore-interface.ts
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

// HyperCore Precompile Address
const HYPERCORE_PRECOMPILE = '0x0000000000000000000000000000000000000808';

interface Order {
  id: string;
  tokenAddress: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: string;
  price?: string;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  userId: string;
  hypercoreOrderId?: string;
}

interface OrderBook {
  symbol: string;
  bids: Array<{ price: string; amount: string }>;
  asks: Array<{ price: string; amount: string }>;
  timestamp: number;
}

interface Balance {
  tokenAddress: string;
  available: string;
  locked: string;
  total: string;
}

interface TradeResult {
  success: boolean;
  orderId?: string;
  txHash?: string;
  error?: string;
}

interface MarketData {
  tokenAddress: string;
  symbol: string;
  price: string;
  change24h: string;
  volume24h: string;
  high24h: string;
  low24h: string;
  lastUpdated: number;
}

export class HyperCoreInterface {
  private static instance: HyperCoreInterface;
  private supabase;
  private provider: ethers.Provider;
  private hypercoreContract: ethers.Contract;

  // HyperCore ABI (simplified for trading functions)
  private readonly HYPERCORE_ABI = [
    // Trading functions
    'function placeOrder(address token, uint256 amount, uint256 price, bool isBuy) external returns (uint256)',
    'function cancelOrder(uint256 orderId) external returns (bool)',
    'function getOrderStatus(uint256 orderId) external view returns (uint8)',
    
    // Balance functions  
    'function getBalance(address user, address token) external view returns (uint256)',
    'function getAvailableBalance(address user, address token) external view returns (uint256)',
    
    // Market data functions
    'function getSpotPrice(address token) external view returns (uint256)',
    'function getOrderBook(address token, uint256 depth) external view returns (uint256[] memory, uint256[] memory, uint256[] memory, uint256[] memory)',
    
    // Events
    'event OrderPlaced(uint256 indexed orderId, address indexed user, address indexed token, uint256 amount, uint256 price, bool isBuy)',
    'event OrderFilled(uint256 indexed orderId, uint256 filledAmount, uint256 remainingAmount)',
    'event OrderCancelled(uint256 indexed orderId, address indexed user)'
  ];

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Initialize Hyperliquid provider
    this.provider = new ethers.JsonRpcProvider(
      process.env.HYPERLIQUID_RPC_URL || 'https://api.hyperliquid-testnet.xyz/evm'
    );

    // Initialize HyperCore contract interface
    this.hypercoreContract = new ethers.Contract(
      HYPERCORE_PRECOMPILE,
      this.HYPERCORE_ABI,
      this.provider
    );
  }

  static getInstance(): HyperCoreInterface {
    if (!HyperCoreInterface.instance) {
      HyperCoreInterface.instance = new HyperCoreInterface();
    }
    return HyperCoreInterface.instance;
  }

  /**
   * Place a new order on HyperCore
   */
  async placeOrder(order: Order, userWallet: ethers.Wallet): Promise<TradeResult> {
    try {
      console.log(`🔄 Placing ${order.side} order for ${order.amount} ${order.tokenAddress}`);

      const signer = userWallet.connect(this.provider);
      const contract = this.hypercoreContract.connect(signer);

      let tx;
      const amountWei = ethers.parseUnits(order.amount, 18);

      if (order.type === 'market') {
        // Market order - use current spot price
        const spotPrice = await this.getSpotPrice(order.tokenAddress);
        const priceWei = ethers.parseUnits(spotPrice, 18);
        
        tx = await contract.placeOrder(
          order.tokenAddress,
          amountWei,
          priceWei,
          order.side === 'buy'
        );
      } else {
        // Limit order - use specified price
        const priceWei = ethers.parseUnits(order.price!, 18);
        
        tx = await contract.placeOrder(
          order.tokenAddress,
          amountWei,
          priceWei,
          order.side === 'buy'
        );
      }

      const receipt = await tx.wait();
      
      // Extract order ID from events
      const orderEvent = receipt.logs.find((log: any) => 
        log.topics[0] === contract.interface.getEvent('OrderPlaced').topicHash
      );
      
      let hypercoreOrderId = '';
      if (orderEvent) {
        const parsedEvent = contract.interface.parseLog(orderEvent);
        hypercoreOrderId = parsedEvent.args.orderId.toString();
      }

      console.log(`✅ Order placed successfully. TX: ${receipt.hash}, OrderID: ${hypercoreOrderId}`);

      return {
        success: true,
        orderId: hypercoreOrderId,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('❌ Failed to place order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Cancel an existing order
   */
  async cancelOrder(orderId: string, userWallet: ethers.Wallet): Promise<TradeResult> {
    try {
      console.log(`🔄 Cancelling order: ${orderId}`);

      const signer = userWallet.connect(this.provider);
      const contract = this.hypercoreContract.connect(signer);

      const tx = await contract.cancelOrder(ethers.getBigInt(orderId));
      const receipt = await tx.wait();

      console.log(`✅ Order cancelled successfully. TX: ${receipt.hash}`);

      return {
        success: true,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('❌ Failed to cancel order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's balance for a specific token
   */
  async getBalance(userAddress: string, tokenAddress: string): Promise<Balance> {
    try {
      const [totalBalance, availableBalance] = await Promise.all([
        this.hypercoreContract.getBalance(userAddress, tokenAddress),
        this.hypercoreContract.getAvailableBalance(userAddress, tokenAddress)
      ]);

      const total = ethers.formatUnits(totalBalance, 18);
      const available = ethers.formatUnits(availableBalance, 18);
      const locked = (parseFloat(total) - parseFloat(available)).toString();

      return {
        tokenAddress,
        available,
        locked,
        total
      };

    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return {
        tokenAddress,
        available: '0',
        locked: '0',
        total: '0'
      };
    }
  }

  /**
   * Get current spot price for a token
   */
  async getSpotPrice(tokenAddress: string): Promise<string> {
    try {
      const price = await this.hypercoreContract.getSpotPrice(tokenAddress);
      return ethers.formatUnits(price, 18);
    } catch (error) {
      console.error('❌ Failed to get spot price:', error);
      return '0';
    }
  }

  /**
   * Get order book data
   */
  async getOrderBook(tokenAddress: string, depth: number = 20): Promise<OrderBook> {
    try {
      const [bidPrices, bidAmounts, askPrices, askAmounts] = await this.hypercoreContract.getOrderBook(
        tokenAddress, 
        depth
      );

      const bids = bidPrices.map((price: bigint, index: number) => ({
        price: ethers.formatUnits(price, 18),
        amount: ethers.formatUnits(bidAmounts[index], 18)
      })).filter(bid => parseFloat(bid.amount) > 0);

      const asks = askPrices.map((price: bigint, index: number) => ({
        price: ethers.formatUnits(price, 18),
        amount: ethers.formatUnits(askAmounts[index], 18)
      })).filter(ask => parseFloat(ask.amount) > 0);

      return {
        symbol: tokenAddress,
        bids: bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)), // Highest bids first
        asks: asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)), // Lowest asks first
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('❌ Failed to get order book:', error);
      return {
        symbol: tokenAddress,
        bids: [],
        asks: [],
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<string> {
    try {
      const status = await this.hypercoreContract.getOrderStatus(ethers.getBigInt(orderId));
      const statusMap = ['pending', 'filled', 'cancelled', 'partial'];
      return statusMap[Number(status)] || 'unknown';
    } catch (error) {
      console.error('❌ Failed to get order status:', error);
      return 'unknown';
    }
  }

  /**
   * Get market data for a token
   */
  async getMarketData(tokenAddress: string): Promise<MarketData> {
    try {
      // Get current price
      const currentPrice = await this.getSpotPrice(tokenAddress);
      
      // Get 24h data from database (stored from previous price updates)
      const { data: priceHistory } = await this.supabase
        .from('market_data_history')
        .select('price, created_at')
        .eq('token_address', tokenAddress)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      let change24h = '0';
      let high24h = currentPrice;
      let low24h = currentPrice;
      let volume24h = '0';

      if (priceHistory && priceHistory.length > 0) {
        const prices = priceHistory.map(p => parseFloat(p.price));
        const price24hAgo = prices[prices.length - 1];
        
        if (price24hAgo > 0) {
          const currentPriceNum = parseFloat(currentPrice);
          change24h = (((currentPriceNum - price24hAgo) / price24hAgo) * 100).toFixed(2);
        }

        high24h = Math.max(...prices).toString();
        low24h = Math.min(...prices).toString();

        // Calculate volume (simplified - sum of all trade amounts)
        const { data: trades } = await this.supabase
          .from('trading_orders')
          .select('amount')
          .eq('token_address', tokenAddress)
          .eq('status', 'filled')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (trades && trades.length > 0) {
          volume24h = trades.reduce((sum, trade) => sum + parseFloat(trade.amount), 0).toString();
        }
      }

      // Get token symbol from database
      const { data: tokenData } = await this.supabase
        .from('index_tokens')
        .select('symbol')
        .eq('token_address', tokenAddress)
        .single();

      const symbol = tokenData?.symbol || tokenAddress.slice(0, 8);

      return {
        tokenAddress,
        symbol,
        price: currentPrice,
        change24h,
        volume24h,
        high24h,
        low24h,
        lastUpdated: Date.now()
      };

    } catch (error) {
      console.error('❌ Failed to get market data:', error);
      return {
        tokenAddress,
        symbol: tokenAddress.slice(0, 8),
        price: '0',
        change24h: '0',
        volume24h: '0',
        high24h: '0',
        low24h: '0',
        lastUpdated: Date.now()
      };
    }
  }

  /**
   * Store price history for 24h calculations
   */
  async storePriceHistory(tokenAddress: string, price: string): Promise<void> {
    try {
      await this.supabase
        .from('market_data_history')
        .insert({
          token_address: tokenAddress,
          price: price,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('❌ Failed to store price history:', error);
    }
  }

  /**
   * Monitor order events
   */
  async monitorOrderEvents(callback: (event: any) => void): Promise<void> {
    try {
      // Listen for order events
      this.hypercoreContract.on('OrderPlaced', (orderId, user, token, amount, price, isBuy, event) => {
        callback({
          type: 'OrderPlaced',
          orderId: orderId.toString(),
          user,
          token,
          amount: ethers.formatUnits(amount, 18),
          price: ethers.formatUnits(price, 18),
          side: isBuy ? 'buy' : 'sell',
          txHash: event.transactionHash
        });
      });

      this.hypercoreContract.on('OrderFilled', (orderId, filledAmount, remainingAmount, event) => {
        callback({
          type: 'OrderFilled',
          orderId: orderId.toString(),
          filledAmount: ethers.formatUnits(filledAmount, 18),
          remainingAmount: ethers.formatUnits(remainingAmount, 18),
          txHash: event.transactionHash
        });
      });

      this.hypercoreContract.on('OrderCancelled', (orderId, user, event) => {
        callback({
          type: 'OrderCancelled',
          orderId: orderId.toString(),
          user,
          txHash: event.transactionHash
        });
      });

      console.log('✅ Order event monitoring started');

    } catch (error) {
      console.error('❌ Failed to setup order event monitoring:', error);
    }
  }

  /**
   * Get all available trading pairs
   */
  async getTradingPairs(): Promise<string[]> {
    try {
      // Get all index tokens from database
      const { data: tokens } = await this.supabase
        .from('index_tokens')
        .select('token_address')
        .eq('is_active', true);

      return tokens?.map(token => token.token_address) || [];

    } catch (error) {
      console.error('❌ Failed to get trading pairs:', error);
      return [];
    }
  }
}

// Export utility functions
export const getHyperCoreInterface = () => HyperCoreInterface.getInstance();

export type {
  Order,
  OrderBook,
  Balance,
  TradeResult,
  MarketData
};