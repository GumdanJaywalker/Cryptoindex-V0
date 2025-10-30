// Balance service - Supabase version
// User portfolio and token balances with PostgreSQL

import Decimal from 'decimal.js';
import { supabase } from '../lib/supabase.js';
import { AppError } from '../utils/httpError.js';

interface TokenBalance {
  tokenId: string;
  symbol: string;
  balance: string;
  valueUSDC: string;
  currentPrice: string;
}

/**
 * Get user's token balances across all tokens
 * @param userId User ID
 * @returns List of token balances with USD values
 */
export async function getUserBalances(userId: string): Promise<TokenBalance[]> {
  if (!userId) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'User ID is required'
    });
  }

  // Query token_holders joined with tokens table
  const { data, error } = await supabase
    .from('token_holders')
    .select(`
      balance,
      token_id,
      tokens (
        id,
        symbol,
        current_price
      )
    `)
    .eq('user_id', userId)
    .gt('balance', '0'); // Only show tokens with balance > 0

  if (error) {
    throw new AppError(500, {
      code: 'DATABASE_ERROR',
      message: `Failed to fetch balances: ${error.message}`
    });
  }

  // Transform data
  const balances: TokenBalance[] = (data as any[])?.map((holder: any) => {
    const balance = new Decimal(holder.balance);
    const price = new Decimal(holder.tokens.current_price || '0');
    const valueUSDC = balance.times(price);

    return {
      tokenId: holder.tokens.id,
      symbol: holder.tokens.symbol,
      balance: balance.toString(),
      currentPrice: price.toString(),
      valueUSDC: valueUSDC.toString(),
    };
  }) || [];

  return balances;
}

/**
 * Get balance for a specific token
 * @param userId User ID
 * @param tokenId Token ID
 * @returns Token balance with USD value
 */
export async function getTokenBalance(
  userId: string,
  tokenId: string
): Promise<TokenBalance> {
  if (!userId || !tokenId) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'User ID and token ID are required'
    });
  }

  // Query specific token balance
  const { data, error } = await supabase
    .from('token_holders')
    .select(`
      balance,
      token_id,
      tokens (
        id,
        symbol,
        current_price
      )
    `)
    .eq('user_id', userId)
    .eq('token_id', tokenId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No balance found - return zero balance
      const { data: token } = await supabase
        .from('tokens')
        .select('id, symbol, current_price')
        .eq('id', tokenId)
        .single();

      if (!token) {
        throw new AppError(404, {
          code: 'NOT_FOUND',
          message: 'Token not found'
        });
      }

      return {
        tokenId: (token as any).id,
        symbol: (token as any).symbol,
        balance: '0',
        currentPrice: (token as any).current_price || '0',
        valueUSDC: '0',
      };
    }

    throw new AppError(500, {
      code: 'DATABASE_ERROR',
      message: `Failed to fetch balance: ${error.message}`
    });
  }

  // Calculate value
  const balance = new Decimal((data as any).balance);
  const price = new Decimal((data as any).tokens.current_price || '0');
  const valueUSDC = balance.times(price);

  return {
    tokenId: (data as any).tokens.id,
    symbol: (data as any).tokens.symbol,
    balance: balance.toString(),
    currentPrice: price.toString(),
    valueUSDC: valueUSDC.toString(),
  };
}

/**
 * Get total portfolio value in USD
 * @param userId User ID
 * @returns Total value in USDC
 */
export async function getPortfolioValue(userId: string): Promise<string> {
  if (!userId) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'User ID is required'
    });
  }

  const balances = await getUserBalances(userId);
  
  // Sum all token values
  const total = balances.reduce((sum, balance) => {
    return sum.plus(new Decimal(balance.valueUSDC));
  }, new Decimal(0));

  return total.toString();
}

/**
 * Get detailed portfolio breakdown
 * @param userId User ID
 * @returns Portfolio details with percentages
 */
export async function getPortfolioBreakdown(userId: string): Promise<{
  totalValue: string;
  tokens: Array<TokenBalance & { percentage: string }>;
}> {
  const balances = await getUserBalances(userId);
  const totalValue = await getPortfolioValue(userId);
  const totalDec = new Decimal(totalValue);

  // Calculate percentages
  const tokens = balances.map(balance => {
    const valueDec = new Decimal(balance.valueUSDC);
    const percentage = totalDec.isZero() 
      ? '0' 
      : valueDec.dividedBy(totalDec).times(100).toString();

    return {
      ...balance,
      percentage,
    };
  });

  return {
    totalValue,
    tokens,
  };
}
