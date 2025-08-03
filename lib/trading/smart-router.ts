import { MatchingEngine } from '../orderbook/matching-engine';
import { Order, Trade } from '../types/orderbook';

// AMM 관련 타입 (기존 AMM 컨트랙트와 연동)
interface AMMQuote {
  path: string[];
  amountIn: string;
  amountOut: string;
  priceImpact: string;
  gasEstimate: string;
}

interface OrderbookQuote {
  price: string;
  amount: string;
  depth: number;
  averagePrice: string;
}

interface RouteOption {
  type: 'amm' | 'orderbook' | 'hybrid';
  quote: AMMQuote | OrderbookQuote | HybridQuote;
  expectedOutput: string;
  gasEstimate: string;
  priceImpact: string;
}

interface HybridQuote {
  ammPortion: number; // 0-1
  orderbookPortion: number; // 0-1
  ammQuote: AMMQuote;
  orderbookQuote: OrderbookQuote;
  totalOutput: string;
  averagePrice: string;
}

export class SmartRouter {
  private matchingEngine: MatchingEngine;
  
  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  /**
   * 최적의 거래 경로 찾기
   */
  async findBestRoute(
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    maxSlippage: number = 0.5 // 0.5%
  ): Promise<RouteOption[]> {
    
    const routes: RouteOption[] = [];

    // 1. AMM 경로 확인
    const ammRoute = await this.getAMMRoute(pair, side, amount);
    if (ammRoute) {
      routes.push(ammRoute);
    }

    // 2. Orderbook 경로 확인
    const orderbookRoute = await this.getOrderbookRoute(pair, side, amount);
    if (orderbookRoute) {
      routes.push(orderbookRoute);
    }

    // 3. 하이브리드 경로 확인
    const hybridRoute = await this.getHybridRoute(pair, side, amount, maxSlippage);
    if (hybridRoute) {
      routes.push(hybridRoute);
    }

    // 4. 최적 경로 정렬 (수익률 기준)
    return routes.sort((a, b) => {
      const outputA = parseFloat(a.expectedOutput);
      const outputB = parseFloat(b.expectedOutput);
      return side === 'buy' ? outputA - outputB : outputB - outputA;
    });
  }

  /**
   * AMM 경로 분석
   */
  private async getAMMRoute(
    pair: string,
    side: 'buy' | 'sell',
    amount: string
  ): Promise<RouteOption | null> {
    try {
      // AMM 컨트랙트와 연동하여 견적 받기
      // 실제로는 HyperIndexRouter 컨트랙트를 호출
      const quote = await this.getAMMQuote(pair, side, amount);
      
      if (!quote) return null;

      return {
        type: 'amm',
        quote,
        expectedOutput: quote.amountOut,
        gasEstimate: quote.gasEstimate,
        priceImpact: quote.priceImpact
      };
    } catch (error) {
      console.error('AMM route error:', error);
      return null;
    }
  }

  /**
   * Orderbook 경로 분석
   */
  private async getOrderbookRoute(
    pair: string,
    side: 'buy' | 'sell',
    amount: string
  ): Promise<RouteOption | null> {
    try {
      const orderbook = await this.matchingEngine.getOrderbook(pair, 50);
      const levels = side === 'buy' ? orderbook.asks : orderbook.bids;
      
      if (levels.length === 0) return null;

      let remainingAmount = parseFloat(amount);
      let totalCost = 0;
      let filledAmount = 0;
      let depth = 0;

      for (const level of levels) {
        if (remainingAmount <= 0) break;
        
        const levelAmount = parseFloat(level.amount);
        const levelPrice = parseFloat(level.price);
        const fillAmount = Math.min(remainingAmount, levelAmount);
        
        if (side === 'buy') {
          totalCost += fillAmount * levelPrice;
        } else {
          totalCost += fillAmount;
        }
        
        filledAmount += fillAmount;
        remainingAmount -= fillAmount;
        depth++;
      }

      if (filledAmount === 0) return null;

      const averagePrice = side === 'buy' 
        ? (totalCost / filledAmount).toFixed(8)
        : (totalCost / filledAmount).toFixed(8);

      const quote: OrderbookQuote = {
        price: averagePrice,
        amount: filledAmount.toFixed(8),
        depth,
        averagePrice
      };

      return {
        type: 'orderbook',
        quote,
        expectedOutput: side === 'buy' ? filledAmount.toFixed(8) : totalCost.toFixed(8),
        gasEstimate: '0', // 오더북은 가스비 없음
        priceImpact: '0'
      };
    } catch (error) {
      console.error('Orderbook route error:', error);
      return null;
    }
  }

  /**
   * 하이브리드 경로 분석 (AMM + Orderbook 조합)
   */
  private async getHybridRoute(
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    maxSlippage: number
  ): Promise<RouteOption | null> {
    try {
      const totalAmount = parseFloat(amount);
      
      // 여러 비율로 테스트해서 최적 조합 찾기
      const ratios = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
      let bestHybrid: RouteOption | null = null;
      let bestOutput = 0;

      for (const ammRatio of ratios) {
        const orderbookRatio = 1 - ammRatio;
        const ammAmount = (totalAmount * ammRatio).toFixed(8);
        const orderbookAmount = (totalAmount * orderbookRatio).toFixed(8);

        // AMM 부분
        const ammQuote = await this.getAMMQuote(pair, side, ammAmount);
        if (!ammQuote) continue;

        // Orderbook 부분
        const orderbookRoute = await this.getOrderbookRoute(pair, side, orderbookAmount);
        if (!orderbookRoute) continue;

        const orderbookQuote = orderbookRoute.quote as OrderbookQuote;
        
        // 전체 결과 계산
        const ammOutput = parseFloat(ammQuote.amountOut);
        const orderbookOutput = parseFloat(orderbookRoute.expectedOutput);
        const totalOutput = ammOutput + orderbookOutput;

        if (totalOutput > bestOutput) {
          bestOutput = totalOutput;
          
          const hybridQuote: HybridQuote = {
            ammPortion: ammRatio,
            orderbookPortion: orderbookRatio,
            ammQuote,
            orderbookQuote,
            totalOutput: totalOutput.toFixed(8),
            averagePrice: side === 'buy' 
              ? (totalAmount / totalOutput).toFixed(8)
              : (totalOutput / totalAmount).toFixed(8)
          };

          bestHybrid = {
            type: 'hybrid',
            quote: hybridQuote,
            expectedOutput: totalOutput.toFixed(8),
            gasEstimate: ammQuote.gasEstimate, // AMM 부분만 가스비 발생
            priceImpact: this.calculateHybridPriceImpact(ammQuote, orderbookQuote, ammRatio)
          };
        }
      }

      return bestHybrid;
    } catch (error) {
      console.error('Hybrid route error:', error);
      return null;
    }
  }

  /**
   * 하이브리드 가격 영향 계산
   */
  private calculateHybridPriceImpact(
    ammQuote: AMMQuote,
    orderbookQuote: OrderbookQuote,
    ammRatio: number
  ): string {
    const ammImpact = parseFloat(ammQuote.priceImpact);
    const orderbookImpact = 0; // 오더북은 기본적으로 가격 영향 없음
    
    const weightedImpact = (ammImpact * ammRatio) + (orderbookImpact * (1 - ammRatio));
    return weightedImpact.toFixed(4);
  }

  /**
   * 경로 실행
   */
  async executeRoute(
    route: RouteOption,
    userId: string,
    pair: string,
    side: 'buy' | 'sell',
    amount: string
  ): Promise<{ success: boolean; trades?: Trade[]; error?: string }> {
    try {
      switch (route.type) {
        case 'orderbook':
          return await this.executeOrderbookRoute(userId, pair, side, amount);
          
        case 'amm':
          return await this.executeAMMRoute(userId, pair, side, amount, route.quote as AMMQuote);
          
        case 'hybrid':
          return await this.executeHybridRoute(userId, pair, side, amount, route.quote as HybridQuote);
          
        default:
          return { success: false, error: 'Unknown route type' };
      }
    } catch (error) {
      console.error('Route execution error:', error);
      return { success: false, error: 'Route execution failed' };
    }
  }

  /**
   * Orderbook 경로 실행
   */
  private async executeOrderbookRoute(
    userId: string,
    pair: string,
    side: 'buy' | 'sell',
    amount: string
  ): Promise<{ success: boolean; trades?: Trade[]; error?: string }> {
    
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      pair,
      side,
      type: 'market', // 시장가로 즉시 실행
      price: '0',
      amount,
      filled: '0',
      remaining: amount,
      status: 'pending',
      timestamp: Date.now()
    };

    const result = await this.matchingEngine.processOrder(order);
    
    return {
      success: result.trades.length > 0,
      trades: result.trades
    };
  }

  /**
   * AMM 경로 실행
   */
  private async executeAMMRoute(
    userId: string,
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    quote: AMMQuote
  ): Promise<{ success: boolean; trades?: Trade[]; error?: string }> {
    
    // 실제로는 스마트 컨트랙트 호출
    // 여기서는 시뮬레이션
    try {
      // HyperIndexRouter.swapExactTokensForTokens() 또는 swapTokensForExactTokens() 호출
      console.log('Executing AMM swap:', { userId, pair, side, amount, quote });
      
      // 시뮬레이션된 거래 결과
      const trade: Trade = {
        id: `amm_trade_${Date.now()}`,
        pair,
        price: (parseFloat(amount) / parseFloat(quote.amountOut)).toFixed(8),
        amount: quote.amountOut,
        side,
        buyOrderId: 'amm',
        sellOrderId: 'amm',
        timestamp: Date.now()
      };

      return { success: true, trades: [trade] };
    } catch (error) {
      return { success: false, error: 'AMM execution failed' };
    }
  }

  /**
   * 하이브리드 경로 실행
   */
  private async executeHybridRoute(
    userId: string,
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    quote: HybridQuote
  ): Promise<{ success: boolean; trades?: Trade[]; error?: string }> {
    
    const totalAmount = parseFloat(amount);
    const ammAmount = (totalAmount * quote.ammPortion).toFixed(8);
    const orderbookAmount = (totalAmount * quote.orderbookPortion).toFixed(8);

    const allTrades: Trade[] = [];

    // 1. AMM 부분 실행
    if (quote.ammPortion > 0) {
      const ammResult = await this.executeAMMRoute(userId, pair, side, ammAmount, quote.ammQuote);
      if (ammResult.success && ammResult.trades) {
        allTrades.push(...ammResult.trades);
      }
    }

    // 2. Orderbook 부분 실행
    if (quote.orderbookPortion > 0) {
      const orderbookResult = await this.executeOrderbookRoute(userId, pair, side, orderbookAmount);
      if (orderbookResult.success && orderbookResult.trades) {
        allTrades.push(...orderbookResult.trades);
      }
    }

    return {
      success: allTrades.length > 0,
      trades: allTrades
    };
  }

  /**
   * AMM 견적 받기 (실제로는 컨트랙트 호출)
   */
  private async getAMMQuote(
    pair: string,
    side: 'buy' | 'sell',
    amount: string
  ): Promise<AMMQuote | null> {
    // 실제로는 HyperIndexRouter.getAmountsOut() 호출
    // 여기서는 시뮬레이션
    try {
      const [tokenA, tokenB] = pair.split('-');
      const path = side === 'buy' ? [tokenB, tokenA] : [tokenA, tokenB];
      
      // 간단한 AMM 시뮬레이션 (실제로는 컨트랙트에서 계산)
      const amountIn = parseFloat(amount);
      const amountOut = amountIn * 0.997; // 0.3% 수수료 반영
      const priceImpact = Math.min(amountIn / 100000, 5); // 간단한 가격 영향 계산
      
      return {
        path,
        amountIn: amount,
        amountOut: amountOut.toFixed(8),
        priceImpact: priceImpact.toFixed(4),
        gasEstimate: '21000' // 예상 가스
      };
    } catch {
      return null;
    }
  }

  /**
   * 최적 경로 추천
   */
  async getRecommendedRoute(
    pair: string,
    side: 'buy' | 'sell',
    amount: string,
    userPreference: 'speed' | 'cost' | 'output' = 'output'
  ): Promise<RouteOption | null> {
    
    const routes = await this.findBestRoute(pair, side, amount);
    if (routes.length === 0) return null;

    switch (userPreference) {
      case 'speed':
        // 오더북이 가장 빠름 (가스비 없음)
        return routes.find(r => r.type === 'orderbook') || routes[0];
        
      case 'cost':
        // 가스비가 낮은 순서
        return routes.sort((a, b) => 
          parseFloat(a.gasEstimate) - parseFloat(b.gasEstimate)
        )[0];
        
      case 'output':
      default:
        // 최고 수익률
        return routes[0];
    }
  }
}