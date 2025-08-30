/**
 * 🚀 Real HyperEVM Hybrid Router
 * 
 * Actual on-chain AMM + Orderbook integration
 * Uses real private key and blockchain transactions
 * 
 * Created: 2025-08-22
 */

const { ethers } = require('ethers');
const { RealOrderbookEngine } = require('../orderbook/real-orderbook-engine');
const { AsyncSettlementQueue } = require('../settlement/async-settlement-queue');

// Real deployed contract addresses on HyperEVM Testnet (Chain ID: 998)
const CONTRACTS = {
  factory: '0x73bF19534DA1c60772E40136A4e5E77921b7a632',
  router: '0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A',
  pair: '0x5706084ad9Cac84393eaA1Eb265Db9b22bA63cd1',
  hyperindex: '0x6065Ab1ec8334ab6099aF27aF145411902EAef40',
  usdc: '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3',
  settlement: '0x543C050a536457c47c569D26AABd52Fae17cbA4B'
};

// Contract ABIs
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];

class RealHybridRouter {
  static instance = null;
  
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contracts = {};
    this.orderbook = null;
    this.ammReserves = { base: '1000000', quote: '1000000' };
    this.initialized = false;
  }

  static getInstance() {
    if (!RealHybridRouter.instance) {
      RealHybridRouter.instance = new RealHybridRouter();
    }
    return RealHybridRouter.instance;
  }

  async initialize() {
    if (this.initialized) return true;

    try {
      console.log('🔗 Initializing Real HyperEVM connection...');
      
      // Initialize provider
      this.provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid-testnet.xyz/evm');
      
      // Initialize wallet from environment variable
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey || privateKey === 'your_private_key_here_for_testing') {
        throw new Error('❌ PRIVATE_KEY environment variable must be set for real trading');
      }
      
      // Use the real private key from deployment
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      console.log(`🔑 Real wallet loaded for address: ${this.wallet.address}`);
      
      console.log(`💳 Wallet address: ${this.wallet.address}`);
      
      // Verify network
      const network = await this.provider.getNetwork();
      if (network.chainId !== 998n) {
        throw new Error(`Wrong network! Expected Chain ID 998, got ${network.chainId}`);
      }
      console.log('✅ Connected to HyperEVM Testnet');
      
      // Initialize contracts
      this.contracts.router = new ethers.Contract(CONTRACTS.router, ROUTER_ABI, this.wallet);
      this.contracts.pair = new ethers.Contract(CONTRACTS.pair, PAIR_ABI, this.wallet);
      this.contracts.usdc = new ethers.Contract(CONTRACTS.usdc, ERC20_ABI, this.wallet);
      this.contracts.hyperindex = new ethers.Contract(CONTRACTS.hyperindex, ERC20_ABI, this.wallet);
      
      // Initialize REAL orderbook engine
      this.orderbook = RealOrderbookEngine.getInstance();
      await this.orderbook.initialize();
      
      // Initialize async settlement queue
      this.settlementQueue = AsyncSettlementQueue.getInstance();
      await this.settlementQueue.start();
      
      // Load current AMM state
      await this.updateAMMReserves();
      
      this.initialized = true;
      console.log('🚀 Real Hybrid Router initialized successfully!');
      
      return true;
      
    } catch (error) {
      console.error('❌ Real Hybrid Router initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  async updateAMMReserves() {
    try {
      const reserves = await this.contracts.pair.getReserves();
      this.ammReserves = {
        base: ethers.formatEther(reserves[0]),
        quote: ethers.formatEther(reserves[1]),
        lastUpdate: Date.now()
      };
      console.log(`📊 AMM Reserves updated: ${this.ammReserves.base} / ${this.ammReserves.quote}`);
    } catch (error) {
      console.warn('⚠️ Failed to update AMM reserves:', error.message);
    }
  }

  async calculateAMMPrice(pair, side, amount) {
    try {
      const path = side === 'buy' 
        ? [CONTRACTS.usdc, CONTRACTS.hyperindex]
        : [CONTRACTS.hyperindex, CONTRACTS.usdc];
      
      const amountIn = ethers.parseEther(amount.toString());
      const amounts = await this.contracts.router.getAmountsOut(amountIn, path);
      
      const amountOut = ethers.formatEther(amounts[1]);
      const effectivePrice = parseFloat(amount) / parseFloat(amountOut);
      
      // Calculate price impact
      const baseReserve = parseFloat(this.ammReserves.base);
      const quoteReserve = parseFloat(this.ammReserves.quote);
      const currentPrice = quoteReserve / baseReserve;
      const priceImpact = Math.abs((effectivePrice - currentPrice) / currentPrice) * 100;
      
      return {
        amountOut,
        effectivePrice: effectivePrice.toFixed(8),
        priceImpact: priceImpact.toFixed(4),
        gasEstimate: '150000' // Estimated gas
      };
      
    } catch (error) {
      console.error('❌ AMM price calculation failed:', error.message);
      
      // Fallback calculation
      return {
        amountOut: (parseFloat(amount) * 0.999).toString(), // 0.1% slippage
        effectivePrice: '1.001',
        priceImpact: '0.1',
        gasEstimate: '150000',
        error: error.message
      };
    }
  }

  async executeAMMSwap(order) {
    const startTime = Date.now();
    
    try {
      console.log(`🔗 Executing REAL on-chain swap: ${order.amount} ${order.side}`);
      
      const path = order.side === 'buy' 
        ? [CONTRACTS.usdc, CONTRACTS.hyperindex]
        : [CONTRACTS.hyperindex, CONTRACTS.usdc];
      
      const amountIn = ethers.parseEther(order.amount);
      const amounts = await this.contracts.router.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1] * 95n / 100n; // 5% slippage tolerance
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes
      
      // Execute the swap
      const tx = await this.contracts.router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        this.wallet.address,
        deadline,
        {
          gasLimit: 300000,
          gasPrice: ethers.parseUnits('20', 'gwei')
        }
      );
      
      console.log(`📤 Transaction submitted: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      const executionTime = Date.now() - startTime;
      
      console.log(`✅ REAL on-chain swap completed in ${executionTime}ms`);
      console.log(`   Block: ${receipt.blockNumber}, Gas: ${receipt.gasUsed.toString()}`);
      
      // Update reserves after swap
      setTimeout(() => this.updateAMMReserves(), 1000);
      
      const amountOut = ethers.formatEther(amounts[1]);
      
      return {
        id: `amm_${tx.hash.slice(0, 10)}`,
        orderId: order.id,
        price: (parseFloat(order.amount) / parseFloat(amountOut)).toFixed(8),
        amount: amountOut,
        side: order.side,
        source: 'AMM',
        timestamp: Date.now(),
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        executionTime,
        ammReservesBefore: { ...this.ammReserves },
        priceImpact: parseFloat(amountOut) / parseFloat(order.amount) - 1
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ REAL AMM swap failed: ${error.message}`);
      
      return {
        id: `amm_error_${Date.now()}`,
        orderId: order.id,
        error: error.message,
        executionTime,
        source: 'AMM_ERROR'
      };
    }
  }

  async processHybridOrder(order) {
    const startTime = Date.now();
    
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      console.log(`🎯 REAL Hybrid processing: ${order.id} (${order.amount} ${order.side})`);
      
      const amount = parseFloat(order.amount);
      const chunks = [];
      const fills = [];
      
      // Dynamic routing decision based on order size and market conditions
      let orderbookFirst = amount < 1000; // Small orders to orderbook first
      let ammPortion = 0.4; // 40% to AMM for large orders
      
      if (order.type === 'market') {
        // Market orders: prioritize speed
        orderbookFirst = amount < 500;
        ammPortion = 0.6; // 60% to AMM for immediate execution
      }
      
      // Split into chunks
      if (amount <= 100) {
        // Small order - single chunk
        chunks.push({
          amount: amount.toString(),
          source: 'orderbook',
          chunkIndex: 0
        });
      } else {
        // Large order - hybrid chunks
        const chunkSize = Math.min(amount / 3, 500); // Max 500 per chunk
        let remaining = amount;
        let chunkIndex = 0;
        
        while (remaining > 0.01 && chunkIndex < 10) {
          const chunkAmount = Math.min(remaining, chunkSize);
          const useAMM = chunkIndex % 2 === (orderbookFirst ? 1 : 0);
          
          chunks.push({
            amount: chunkAmount.toString(),
            source: useAMM ? 'AMM' : 'orderbook',
            chunkIndex
          });
          
          remaining -= chunkAmount;
          chunkIndex++;
        }
      }
      
      console.log(`📦 Split into ${chunks.length} chunks: ${chunks.map(c => c.source).join(', ')}`);
      
      // Process chunks
      for (const chunk of chunks) {
        try {
          const chunkOrder = {
            ...order,
            id: `${order.id}_chunk_${chunk.chunkIndex}`,
            amount: chunk.amount
          };
          
          let fill;
          
          if (chunk.source === 'AMM') {
            fill = await this.executeAMMSwap(chunkOrder);
          } else {
            // Process through REAL orderbook engine
            const result = await this.orderbook.processOrderUltraFast(chunkOrder);
            
            if (result.trades && result.trades.length > 0) {
              fill = result.trades[0]; // Take first trade for simplicity
              fill.source = 'Orderbook';
              fill.chunkIndex = chunk.chunkIndex;
            } else {
              // No orderbook match, fallback to AMM
              console.log(`📝 Real orderbook miss for chunk ${chunk.chunkIndex}, routing to AMM`);
              fill = await this.executeAMMSwap(chunkOrder);
            }
          }
          
          if (fill && !fill.error) {
            fills.push(fill);
          }
          
        } catch (chunkError) {
          console.error(`❌ Chunk ${chunk.chunkIndex} failed:`, chunkError.message);
        }
      }
      
      const executionTime = Date.now() - startTime;
      const totalFilled = fills.reduce((sum, fill) => sum + parseFloat(fill.amount || 0), 0);
      const weightedPrice = fills.length > 0 
        ? fills.reduce((sum, fill) => sum + (parseFloat(fill.price || 0) * parseFloat(fill.amount || 0)), 0) / totalFilled
        : 0;
      
      console.log(`✅ REAL Hybrid complete: ${fills.length} fills, ${totalFilled.toFixed(4)} filled in ${executionTime}ms`);
      
      return {
        orderId: order.id,
        totalFilled: totalFilled.toString(),
        averagePrice: weightedPrice.toFixed(8),
        fills,
        executionStats: {
          totalChunks: chunks.length,
          ammChunks: chunks.filter(c => c.source === 'AMM').length,
          orderbookChunks: chunks.filter(c => c.source === 'orderbook').length,
          executionTime,
          realOnChain: true
        },
        routing: chunks.map((chunk, i) => ({
          source: chunk.source,
          amount: chunk.amount,
          chunkIndex: i,
          executed: fills.some(f => f.chunkIndex === i || f.orderId.includes(`chunk_${i}`))
        }))
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ REAL Hybrid processing failed:`, error.message);
      
      return {
        orderId: order.id,
        error: error.message,
        executionTime,
        realOnChain: false
      };
    }
  }

  async getWalletBalances() {
    try {
      if (!this.wallet) return null;
      
      const [hypeBalance, usdcBalance, hyperBalance] = await Promise.all([
        this.provider.getBalance(this.wallet.address),
        this.contracts.usdc.balanceOf(this.wallet.address),
        this.contracts.hyperindex.balanceOf(this.wallet.address)
      ]);
      
      return {
        HYPE: ethers.formatEther(hypeBalance),
        USDC: ethers.formatEther(usdcBalance),
        HYPERINDEX: ethers.formatEther(hyperBalance),
        walletAddress: this.wallet.address
      };
    } catch (error) {
      console.error('❌ Failed to get wallet balances:', error.message);
      return null;
    }
  }

  getMetrics() {
    return {
      initialized: this.initialized,
      chainId: 998,
      walletConnected: !!this.wallet,
      contractsLoaded: Object.keys(this.contracts).length,
      ammReserves: this.ammReserves,
      realOnChain: true,
      provider: 'HyperEVM Testnet'
    };
  }

  /**
   * 🚀 ULTRA-FAST Order Processing
   * Processes orders with immediate response and async settlement
   * Enables 15K+ TPS by removing blocking operations
   */
  async processHybridOrderUltraFast(order) {
    const startTime = Date.now();
    
    try {
      console.log(`⚡ ULTRA Processing: ${order.id} (${order.pair} ${order.side} ${order.amount})`);
      
      // Immediate routing decision (no blockchain calls)
      const routingDecision = this.makeInstantRoutingDecision(order);
      
      if (routingDecision.source === 'AMM') {
        // AMM: Queue for async settlement, return immediate response
        const settlementId = await this.settlementQueue.queueSettlement({
          id: `settlement_${order.id}_${Date.now()}`,
          userId: order.userId,
          orderId: order.id,
          batchId: order.batchId,
          pair: order.pair,
          side: order.side,
          amount: order.amount,
          estimatedPrice: routingDecision.estimatedPrice.toString(),
          priority: order.priority || 'normal',
          maxSlippage: 0.05,
          maxRetries: 3
        });
        
        const executionTime = Date.now() - startTime;
        
        return {
          orderId: order.id,
          status: 'queued_for_settlement',
          settlementId: settlementId,
          fills: [{
            price: routingDecision.estimatedPrice.toString(),
            amount: order.amount,
            source: 'AMM',
            estimated: true,
            settlementId: settlementId
          }],
          executionStats: {
            executionTime,
            immediate: true
          }
        };
        
      } else {
        // Orderbook: Process immediately (ultra-fast)
        const orderbookResult = await this.orderbook.processOrderUltraFast({
          id: order.id,
          pair: order.pair,
          side: order.side,
          type: order.type,
          price: order.price,
          amount: order.amount,
          timestamp: Date.now(),
          userId: order.userId
        });
        
        const executionTime = Date.now() - startTime;
        
        return {
          orderId: order.id,
          status: 'completed',
          fills: orderbookResult.trades?.map(trade => ({
            price: trade.price,
            amount: trade.amount,
            source: 'Orderbook',
            tradeId: trade.id
          })) || [],
          executionStats: {
            executionTime,
            immediate: true
          }
        };
      }
      
    } catch (error) {
      console.error(`❌ Ultra-fast processing failed for ${order.id}:`, error);
      return {
        orderId: order.id,
        status: 'failed',
        error: error.message,
        fills: []
      };
    }
  }

  makeInstantRoutingDecision(order) {
    const baseReserve = parseFloat(this.ammReserves.base);
    const quoteReserve = parseFloat(this.ammReserves.quote);
    
    // 현재 AMM 가격 계산
    let currentAmmPrice;
    if (order.side === 'buy') {
      currentAmmPrice = quoteReserve / baseReserve;
    } else {
      currentAmmPrice = baseReserve / quoteReserve;
    }
    
    if (order.type === 'limit') {
      // 지정가 주문: AMM 대비 불리한 가격 차단
      const orderPrice = parseFloat(order.price);
      
      if ((order.side === 'buy' && orderPrice > currentAmmPrice) ||
          (order.side === 'sell' && orderPrice < currentAmmPrice)) {
        return { 
          source: 'REJECTION', 
          estimatedPrice: orderPrice,
          reason: `${order.side === 'buy' ? '매수' : '매도'} 지정가가 AMM 시장가(${currentAmmPrice.toFixed(4)})보다 불리함`
        };
      }
      
      // 정상적인 지정가는 오더북에 등록
      return { source: 'Orderbook', estimatedPrice: orderPrice };
      
    } else {
      // 시장가 주문: 동적 라우팅 (AMM vs 오더북 실시간 비교)
      // 실제로는 오더북 최우선 호가와 비교해야 하지만, 
      // 여기서는 간단히 AMM 우선으로 설정 (추후 개선)
      return { source: 'AMM', estimatedPrice: currentAmmPrice };
    }
  }

  async getSettlementStatus(settlementId) {
    return await this.settlementQueue.getSettlementResult(settlementId);
  }
}

module.exports = { RealHybridRouter };