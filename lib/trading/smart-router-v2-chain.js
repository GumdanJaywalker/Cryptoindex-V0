/**
 * 🚀 HybridSmartRouter V2 with Real Chain Integration
 * 
 * 실제 HyperEVM 체인 AMM + Off-chain Orderbook 하이브리드 라우팅
 * 
 * Created: 2025-08-20
 */

const { randomUUID } = require('crypto');
const { HyperVMChainConnector } = require('../blockchain/hypervm-chain-connector');

class HybridSmartRouterV2WithChain {
  constructor() {
    this.chainConnector = null;
    this.orderbookEngine = null;
    this.chunkSize = 100; // 기본 청크 크기
    this.maxIterations = 10;
    this.priceImpactThreshold = 0.05; // 5% 
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new HybridSmartRouterV2WithChain();
    }
    return this.instance;
  }

  /**
   * 초기화
   */
  async initialize() {
    console.log('🚀 Initializing Hybrid Smart Router V2 with Chain...');
    
    // 체인 연결
    this.chainConnector = HyperVMChainConnector.getInstance();
    const chainConnected = await this.chainConnector.initialize();
    
    if (!chainConnected) {
      console.warn('⚠️ Chain connection failed - AMM will use mock data');
    }
    
    // Orderbook 엔진 초기화 (기존 UltraPerformanceOrderbook 사용)
    try {
      const { UltraPerformanceOrderbook } = require('../orderbook/ultra-performance-orderbook');
      this.orderbookEngine = UltraPerformanceOrderbook.getInstance();
      console.log('✅ Orderbook engine initialized');
    } catch (error) {
      console.warn('⚠️ Orderbook engine not available:', error.message);
    }
    
    return true;
  }

  /**
   * 하이브리드 주문 처리 (청크 기반)
   */
  async processHybridOrder(order) {
    const startTime = Date.now();
    const fills = [];
    let remaining = parseFloat(order.amount);
    let iteration = 0;
    let totalGasUsed = 0;
    
    console.log(`🔄 Processing hybrid order ${order.id}:`, {
      pair: order.pair,
      side: order.side,
      type: order.type,
      amount: order.amount,
      chainConnected: this.chainConnector?.isChainConnected()
    });

    while (remaining > 0 && iteration < this.maxIterations) {
      iteration++;
      
      // 청크 크기 동적 조정
      const chunkAmount = Math.min(remaining, this.calculateOptimalChunkSize(remaining, iteration));
      
      // 1. Orderbook 체크 (Off-chain)
      if (this.orderbookEngine) {
        const orderbookResult = await this.processOrderbookChunk(order, chunkAmount);
        
        if (orderbookResult.filled > 0) {
          fills.push({
            id: randomUUID(),
            orderId: order.id,
            price: orderbookResult.avgPrice.toString(),
            amount: orderbookResult.filled.toString(),
            side: order.side,
            source: 'Orderbook',
            timestamp: Date.now(),
            chunkIndex: iteration - 1,
            matchedOrders: orderbookResult.matchedOrders
          });
          
          remaining -= orderbookResult.filled;
          console.log(`📚 Orderbook filled: ${orderbookResult.filled} @ ${orderbookResult.avgPrice}`);
        }
      }
      
      // 2. AMM 체크 (On-chain 또는 Mock)
      if (remaining > 0) {
        const ammResult = await this.processAMMChunk(order, remaining);
        
        if (ammResult.filled > 0) {
          fills.push({
            id: ammResult.txHash || randomUUID(),
            orderId: order.id,
            price: ammResult.price.toString(),
            amount: ammResult.filled.toString(),
            side: order.side,
            source: 'AMM',
            timestamp: Date.now(),
            chunkIndex: iteration - 1,
            priceImpact: ammResult.priceImpact,
            onChain: ammResult.onChain,
            txHash: ammResult.txHash,
            blockNumber: ammResult.blockNumber,
            gasUsed: ammResult.gasUsed
          });
          
          remaining -= ammResult.filled;
          totalGasUsed += ammResult.gasUsed || 0;
          console.log(`🌊 AMM filled: ${ammResult.filled} @ ${ammResult.price} (${ammResult.onChain ? 'on-chain' : 'mock'})`);
        }
      }
      
      // 더 이상 채울 수 없으면 중단
      if (fills.length === 0 || (fills[fills.length - 1].amount === '0')) {
        break;
      }
    }
    
    // 결과 집계
    const totalFilled = parseFloat(order.amount) - remaining;
    const avgPrice = this.calculateAveragePrice(fills);
    
    const result = {
      fills: fills,
      totalFilled: totalFilled.toString(),
      averagePrice: avgPrice.toString(),
      remaining: remaining.toString(),
      status: remaining === 0 ? 'filled' : (totalFilled > 0 ? 'partial' : 'unfilled'),
      executionStats: {
        executionTime: Date.now() - startTime,
        totalChunks: iteration,
        ammChunks: fills.filter(f => f.source === 'AMM').length,
        orderbookChunks: fills.filter(f => f.source === 'Orderbook').length,
        iterations: iteration,
        totalGasUsed: totalGasUsed,
        avgPriceImpact: this.calculateAvgPriceImpact(fills)
      }
    };
    
    console.log(`✅ Hybrid order ${order.id} completed:`, {
      totalFilled: result.totalFilled,
      averagePrice: result.averagePrice,
      chunks: result.executionStats.totalChunks,
      time: `${result.executionStats.executionTime}ms`
    });
    
    return result;
  }

  /**
   * Orderbook 청크 처리
   */
  async processOrderbookChunk(order, amount) {
    if (!this.orderbookEngine) {
      return { filled: 0, avgPrice: 0, matchedOrders: 0 };
    }
    
    try {
      // UltraPerformanceOrderbook으로 매칭
      const tempOrder = {
        ...order,
        id: `${order.id}_chunk_${Date.now()}`,
        amount: amount.toString()
      };
      
      const result = await this.orderbookEngine.processOrder(tempOrder);
      
      if (result.trades && result.trades.length > 0) {
        const totalFilled = result.trades.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const avgPrice = result.trades.reduce((sum, t) => sum + parseFloat(t.price) * parseFloat(t.amount), 0) / totalFilled;
        
        return {
          filled: totalFilled,
          avgPrice: avgPrice,
          matchedOrders: result.trades.length
        };
      }
      
      return { filled: 0, avgPrice: 0, matchedOrders: 0 };
      
    } catch (error) {
      console.error('Orderbook processing error:', error.message);
      return { filled: 0, avgPrice: 0, matchedOrders: 0 };
    }
  }

  /**
   * AMM 청크 처리 (실제 체인 또는 Mock)
   */
  async processAMMChunk(order, amount) {
    // 체인 연결 확인
    if (this.chainConnector && this.chainConnector.isChainConnected()) {
      try {
        // 실제 체인 AMM
        const tokenIn = order.side === 'buy' ? 'USDC' : 'HYPERINDEX';
        const tokenOut = order.side === 'buy' ? 'HYPERINDEX' : 'USDC';
        
        // 스왑 견적
        const quote = await this.chainConnector.getSwapQuote(tokenIn, tokenOut, amount.toString());
        
        // 가격 영향 체크
        if (parseFloat(quote.priceImpact) > this.priceImpactThreshold * 100) {
          console.log(`⚠️ Price impact too high: ${quote.priceImpact}%`);
          return { filled: 0, price: 0 };
        }
        
        // 실제 스왑 실행 여부 결정
        if (process.env.EXECUTE_REAL_SWAPS === 'true') {
          const swapResult = await this.chainConnector.executeSwap(
            tokenIn,
            tokenOut,
            amount.toString()
          );
          
          return {
            filled: parseFloat(quote.outputAmount),
            price: quote.price,
            priceImpact: parseFloat(quote.priceImpact),
            onChain: true,
            txHash: swapResult.txHash,
            blockNumber: swapResult.blockNumber,
            gasUsed: parseInt(swapResult.gasUsed)
          };
        } else {
          // 시뮬레이션 모드
          return {
            filled: parseFloat(quote.outputAmount),
            price: quote.price,
            priceImpact: parseFloat(quote.priceImpact),
            onChain: false,
            gasUsed: parseInt(quote.gasEstimate)
          };
        }
        
      } catch (error) {
        console.error('On-chain AMM error:', error.message);
        // Fallback to mock
        return this.mockAMMChunk(order, amount);
      }
    } else {
      // Mock AMM
      return this.mockAMMChunk(order, amount);
    }
  }

  /**
   * Mock AMM 청크 처리
   */
  mockAMMChunk(order, amount) {
    // 간단한 AMM 시뮬레이션
    const basePrice = 1.0;
    const priceImpact = (amount / 10000) * 0.01; // 0.01% per 10000 units
    const effectivePrice = basePrice * (1 + priceImpact);
    
    const outputAmount = order.side === 'buy' 
      ? amount / effectivePrice
      : amount * effectivePrice;
    
    return {
      filled: outputAmount,
      price: effectivePrice,
      priceImpact: priceImpact * 100,
      onChain: false,
      gasUsed: 200000
    };
  }

  /**
   * 최적 청크 크기 계산
   */
  calculateOptimalChunkSize(remaining, iteration) {
    // 남은 양이 적으면 한 번에 처리
    if (remaining <= this.chunkSize * 2) {
      return remaining;
    }
    
    // 반복 횟수가 증가할수록 청크 크기 증가
    const scaleFactor = Math.min(iteration, 3);
    return Math.min(remaining, this.chunkSize * scaleFactor);
  }

  /**
   * 평균 가격 계산
   */
  calculateAveragePrice(fills) {
    if (!fills || fills.length === 0) return 0;
    
    const totalValue = fills.reduce((sum, fill) => {
      return sum + (parseFloat(fill.price) * parseFloat(fill.amount));
    }, 0);
    
    const totalAmount = fills.reduce((sum, fill) => {
      return sum + parseFloat(fill.amount);
    }, 0);
    
    return totalAmount > 0 ? totalValue / totalAmount : 0;
  }

  /**
   * 평균 가격 영향 계산
   */
  calculateAvgPriceImpact(fills) {
    const ammFills = fills.filter(f => f.source === 'AMM' && f.priceImpact);
    
    if (ammFills.length === 0) return 0;
    
    const totalImpact = ammFills.reduce((sum, fill) => {
      return sum + (fill.priceImpact || 0);
    }, 0);
    
    return totalImpact / ammFills.length;
  }

  /**
   * 체인 연결 상태 확인
   */
  isChainConnected() {
    return this.chainConnector && this.chainConnector.isChainConnected();
  }

  /**
   * 현재 AMM 리저브 조회
   */
  async getAMMReserves() {
    if (this.chainConnector && this.chainConnector.isChainConnected()) {
      return await this.chainConnector.getReserves();
    }
    
    // Mock reserves
    return {
      hyperindex: '1000000',
      usdc: '1000000',
      blockTimestamp: Date.now()
    };
  }
}

module.exports = { HybridSmartRouterV2WithChain };