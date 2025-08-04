import { AdvancedPrecisionMath, TradingPairHelper, TRADING_PAIR_CONFIGS } from '@/lib/utils/precision-v2';
import type { Order } from '@/lib/types/trading';

export interface OrderValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
  suggestions?: {
    adjustedPrice?: string;
    adjustedAmount?: string;
    adjustedValue?: string;
    reason?: string;
  };
}

export interface BalanceInfo {
  available: string;
  locked: string;
  total: string;
}

/**
 * 고급 주문 검증 클래스
 */
export class AdvancedOrderValidator {
  
  /**
   * 종합 주문 검증
   */
  static async validateOrder(
    order: Partial<Order>,
    userBalances?: Record<string, BalanceInfo>
  ): Promise<OrderValidationResult> {
    const { pair, side, type, price, amount } = order;
    
    if (!pair || !side || !type || !amount) {
      return {
        valid: false,
        error: 'Missing required fields: pair, side, type, amount'
      };
    }
    
    // 거래쌍 설정 가져오기
    let config;
    try {
      config = TradingPairHelper.getConfig(pair);
    } catch (error) {
      return {
        valid: false,
        error: `Unsupported trading pair: ${pair}`
      };
    }
    
    const warnings: string[] = [];
    const result: OrderValidationResult = { valid: true, warnings };
    
    // 1. 기본 형식 검증
    const formatResult = this.validateFormat(price, amount, type);
    if (!formatResult.valid) {
      return formatResult;
    }
    
    // 2. 가격 검증 (Limit 주문의 경우)
    if (type === 'limit' && price) {
      const priceResult = this.validatePrice(price, config);
      if (!priceResult.valid) {
        return priceResult;
      }
      
      if (priceResult.suggestions?.adjustedPrice) {
        warnings.push(`Price adjusted to nearest tick: ${priceResult.suggestions.adjustedPrice}`);
        result.suggestions = { 
          adjustedPrice: priceResult.suggestions.adjustedPrice,
          reason: 'Snapped to valid tick size'
        };
      }
    }
    
    // 3. 수량 및 금액 검증
    const actualPrice = price || '0'; // Market 주문은 실제 매칭 시점에 가격 결정
    if (type === 'limit') {
      const amountResult = this.validateAmount(actualPrice, amount, config);
      if (!amountResult.valid) {
        return amountResult;
      }
      
      if (amountResult.suggestions) {
        warnings.push(`Amount adjusted for exact USDC value: ${amountResult.suggestions.adjustedAmount}`);
        result.suggestions = {
          ...result.suggestions,
          ...amountResult.suggestions,
          reason: 'Adjusted to avoid USDC dust'
        };
      }
    }
    
    // 4. 잔액 검증
    if (userBalances) {
      const balanceResult = await this.validateBalance(order, userBalances, config);
      if (!balanceResult.valid) {
        return balanceResult;
      }
      
      if (balanceResult.warnings) {
        warnings.push(...balanceResult.warnings);
      }
    }
    
    // 5. 시장 상황 검증 (예: 극단적 가격)
    if (type === 'limit' && price) {
      const marketResult = this.validateMarketConditions(price, config);
      if (marketResult.warnings) {
        warnings.push(...marketResult.warnings);
      }
    }
    
    return result;
  }
  
  /**
   * 기본 형식 검증
   */
  private static validateFormat(
    price: string | undefined,
    amount: string,
    type: 'market' | 'limit'
  ): OrderValidationResult {
    // 수량 형식 검증
    if (!/^\d+\.?\d*$/.test(amount) || parseFloat(amount) <= 0) {
      return {
        valid: false,
        error: 'Invalid amount format or amount must be positive'
      };
    }
    
    // Limit 주문의 가격 검증
    if (type === 'limit') {
      if (!price) {
        return {
          valid: false,
          error: 'Price is required for limit orders'
        };
      }
      
      if (!/^\d+\.?\d*$/.test(price) || parseFloat(price) <= 0) {
        return {
          valid: false,
          error: 'Invalid price format or price must be positive'
        };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * 가격 검증 및 틱 스냅
   */
  private static validatePrice(
    price: string,
    config: typeof TRADING_PAIR_CONFIGS[string]
  ): OrderValidationResult {
    try {
      // 틱 사이즈 검증
      if (!AdvancedPrecisionMath.isValidPrice(price, config)) {
        const snappedPrice = TradingPairHelper.snapToTickSize(price, config.pair);
        
        return {
          valid: true,
          suggestions: {
            adjustedPrice: snappedPrice,
            reason: `Price adjusted to nearest tick size: ${config.tickSize}`
          }
        };
      }
      
      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid price format'
      };
    }
  }
  
  /**
   * 수량 및 거래 금액 검증
   */
  private static validateAmount(
    price: string,
    amount: string,
    config: typeof TRADING_PAIR_CONFIGS[string]
  ): OrderValidationResult {
    try {
      // 정밀도 기반 검증
      const validation = AdvancedPrecisionMath.validateOrder(price, amount, config);
      
      if (!validation.valid) {
        return {
          valid: false,
          error: validation.error,
          suggestions: validation.suggestions
        };
      }
      
      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Amount validation failed'
      };
    }
  }
  
  /**
   * 잔액 검증
   */
  private static async validateBalance(
    order: Partial<Order>,
    balances: Record<string, BalanceInfo>,
    config: typeof TRADING_PAIR_CONFIGS[string]
  ): Promise<OrderValidationResult> {
    const { side, amount, price, type } = order;
    const warnings: string[] = [];
    
    try {
      if (side === 'buy') {
        // 매수 주문: USDC 잔액 확인
        const usdcBalance = balances['USDC'];
        if (!usdcBalance) {
          return {
            valid: false,
            error: 'USDC balance information not available'
          };
        }
        
        let requiredUsdc: string;
        if (type === 'market') {
          // Market 주문: 추정치 사용 (실제로는 슬리패지 고려)
          const estimatedPrice = await this.estimateMarketPrice(config.pair, 'buy');
          requiredUsdc = AdvancedPrecisionMath.calculateTradeValue(estimatedPrice, amount!, config);
          
          warnings.push('Market order: final amount may vary due to slippage');
        } else {
          requiredUsdc = AdvancedPrecisionMath.calculateTradeValue(price!, amount!, config);
        }
        
        const availableUsdc = parseFloat(usdcBalance.available);
        const requiredUsdcNum = parseFloat(requiredUsdc);
        
        if (availableUsdc < requiredUsdcNum) {
          return {
            valid: false,
            error: `Insufficient USDC balance. Required: ${requiredUsdc}, Available: ${usdcBalance.available}`
          };
        }
        
        // 잔액 부족 경고 (90% 이상 사용)
        if (requiredUsdcNum > availableUsdc * 0.9) {
          warnings.push('Using more than 90% of available USDC balance');
        }
        
      } else {
        // 매도 주문: 기준 토큰 잔액 확인
        const baseBalance = balances[config.baseToken];
        if (!baseBalance) {
          return {
            valid: false,
            error: `${config.baseToken} balance information not available`
          };
        }
        
        const availableBase = parseFloat(baseBalance.available);
        const requiredBase = parseFloat(amount!);
        
        if (availableBase < requiredBase) {
          return {
            valid: false,
            error: `Insufficient ${config.baseToken} balance. Required: ${amount}, Available: ${baseBalance.available}`
          };
        }
        
        // 잔액 부족 경고
        if (requiredBase > availableBase * 0.9) {
          warnings.push(`Using more than 90% of available ${config.baseToken} balance`);
        }
      }
      
      return { 
        valid: true, 
        warnings: warnings.length > 0 ? warnings : undefined 
      };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Balance validation failed'
      };
    }
  }
  
  /**
   * 시장 상황 검증
   */
  private static validateMarketConditions(
    price: string,
    config: typeof TRADING_PAIR_CONFIGS[string]
  ): { warnings?: string[] } {
    const warnings: string[] = [];
    
    // 여기서는 간단한 예시만 구현
    // 실제로는 현재 시장가와 비교하여 극단적 가격 감지
    const priceNum = parseFloat(price);
    
    if (priceNum > 1000000) {
      warnings.push('Price is extremely high - please double-check');
    }
    
    if (priceNum < 0.000001) {
      warnings.push('Price is extremely low - please double-check');
    }
    
    return warnings.length > 0 ? { warnings } : {};
  }
  
  /**
   * Market 주문용 예상 가격 추정
   */
  private static async estimateMarketPrice(pair: string, side: 'buy' | 'sell'): Promise<string> {
    // 실제 구현에서는 오더북에서 최적 가격 조회
    // 현재는 기본값 반환
    return '1.0'; // 임시값
  }
  
  /**
   * 빠른 검증 (UI용)
   */
  static quickValidate(
    price: string | undefined,
    amount: string,
    type: 'market' | 'limit',
    pair: string
  ): { valid: boolean; message?: string } {
    if (!amount || parseFloat(amount) <= 0) {
      return { valid: false, message: 'Invalid amount' };
    }
    
    if (type === 'limit' && (!price || parseFloat(price) <= 0)) {
      return { valid: false, message: 'Invalid price' };
    }
    
    try {
      const config = TradingPairHelper.getConfig(pair);
      
      if (type === 'limit' && price) {
        const tradeValue = AdvancedPrecisionMath.calculateTradeValue(price, amount, config);
        const minValue = parseFloat(config.minOrderValue);
        
        if (parseFloat(tradeValue) < minValue) {
          return { 
            valid: false, 
            message: `Minimum order value: ${config.minOrderValue} USDC` 
          };
        }
      }
      
      return { valid: true };
      
    } catch (error) {
      return { valid: false, message: 'Validation error' };
    }
  }
}