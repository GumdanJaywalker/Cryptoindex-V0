// Bonding Curve Service - Quadratic Implementation
// Price calculation for L3 indices with PostgreSQL integration

import Decimal from 'decimal.js';
import { supabase } from '../lib/supabase.js';
import { handleSupabaseError, isNotFoundError, createNotFoundError, safeDecimal } from '../lib/supabase-helpers.js';
import { AppError } from '../utils/httpError.js';
import type { BondingCurveParams, PricePoint } from '../types/index.js';
import { getDefaultQuadraticParams as getDefaults, QUADRATIC_CURVE_DEFAULTS } from '../types/index.js';

// ============================================================
// 1. 가격 계산 함수 (Pure Functions)
// ============================================================

/**
 * 특정 공급량에서의 가격 계산
 *
 * Linear: P(s) = basePrice + a*s
 * Quadratic: P(s) = basePrice + a*s + b*s²
 *
 * @param params Bonding curve parameters
 * @param supply Current token supply
 * @returns Price at given supply
 */
function calculatePriceAtSupply(
  params: BondingCurveParams,
  supply: string
): string {
  const s = new Decimal(supply);
  const base = new Decimal(params.basePrice);
  const a = new Decimal(params.linearCoefficient);

  if (params.curveType === 'linear') {
    // P(s) = base + a*s
    return base.plus(a.times(s)).toString();
  } else {
    // P(s) = base + a*s + b*s²
    const b = new Decimal(params.quadraticCoefficient);
    return base
      .plus(a.times(s))
      .plus(b.times(s.pow(2)))
      .toString();
  }
}

// ============================================================
// 2. 구매 비용 계산 (적분)
// ============================================================

/**
 * 구매 비용 계산
 *
 * Linear: Cost = base*amount + a*(s1² - s0²)/2
 * Quadratic: Cost = base*amount + a*(s1² - s0²)/2 + b*(s1³ - s0³)/3
 *
 * @param indexId Index ID
 * @param tokenAmount Amount of tokens to buy
 * @returns Total cost in USDC/HYPE
 */
export async function calculateBuyPrice(
  indexId: string,
  tokenAmount: string
): Promise<string> {
  // Get bonding curve parameters
  const params = await getBondingCurveParams(indexId);

  // Get current supply from database
  // @ts-ignore - Supabase type inference limitation
  const { data: index, error } = await supabase
    .from('indices')
    .select('total_value_locked')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(error, 'calculateBuyPrice');
  }

  // Calculate integral from s0 to s1
  const s0 = new Decimal(safeDecimal((index as any).total_value_locked, '0'));
  const amount = new Decimal(tokenAmount);
  const s1 = s0.plus(amount);

  const a = new Decimal(params.linearCoefficient);
  const base = new Decimal(params.basePrice);

  if (params.curveType === 'linear') {
    // Cost = base*amount + a*(s1² - s0²)/2
    const linearCost = a
      .times(s1.pow(2).minus(s0.pow(2)))
      .dividedBy(2);
    const baseCost = base.times(amount);

    return baseCost.plus(linearCost).toString();
  } else {
    // Cost = base*amount + a*(s1² - s0²)/2 + b*(s1³ - s0³)/3
    const b = new Decimal(params.quadraticCoefficient);

    const baseCost = base.times(amount);
    const linearCost = a
      .times(s1.pow(2).minus(s0.pow(2)))
      .dividedBy(2);
    const quadraticCost = b
      .times(s1.pow(3).minus(s0.pow(3)))
      .dividedBy(3);

    return baseCost.plus(linearCost).plus(quadraticCost).toString();
  }
}

// ============================================================
// 3. 판매 수익 계산
// ============================================================

/**
 * 판매 수익 계산
 *
 * @param indexId Index ID
 * @param tokenAmount Amount of tokens to sell
 * @returns Total revenue in USDC/HYPE
 */
export async function calculateSellPrice(
  indexId: string,
  tokenAmount: string
): Promise<string> {
  const params = await getBondingCurveParams(indexId);

  // Get current supply
  // @ts-ignore - Supabase type inference limitation
  const { data: index, error } = await supabase
    .from('indices')
    .select('total_value_locked')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(error, 'calculateSellPrice');
  }

  const s1 = new Decimal(safeDecimal((index as any).total_value_locked, '0'));
  const amount = new Decimal(tokenAmount);
  const s0 = s1.minus(amount);

  // Validate sufficient supply
  if (s0.lessThan(0)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Not enough supply to sell'
    });
  }

  // Calculate integral (same as buy, but from s0 to s1)
  const a = new Decimal(params.linearCoefficient);
  const base = new Decimal(params.basePrice);

  if (params.curveType === 'linear') {
    const linearRevenue = a
      .times(s1.pow(2).minus(s0.pow(2)))
      .dividedBy(2);
    const baseRevenue = base.times(amount);

    return baseRevenue.plus(linearRevenue).toString();
  } else {
    const b = new Decimal(params.quadraticCoefficient);

    const baseRevenue = base.times(amount);
    const linearRevenue = a
      .times(s1.pow(2).minus(s0.pow(2)))
      .dividedBy(2);
    const quadraticRevenue = b
      .times(s1.pow(3).minus(s0.pow(3)))
      .dividedBy(3);

    return baseRevenue.plus(linearRevenue).plus(quadraticRevenue).toString();
  }
}

// ============================================================
// 4. 헬퍼 함수들
// ============================================================

/**
 * 현재 가격 조회
 */
export async function getPriceAtSupply(
  indexId: string,
  supply: string
): Promise<string> {
  const params = await getBondingCurveParams(indexId);
  return calculatePriceAtSupply(params, supply);
}

/**
 * 현재 가격 조회 (현재 공급량 기준)
 */
export async function getCurrentPrice(indexId: string): Promise<string> {
  // @ts-ignore - Supabase type inference limitation
  const { data: index, error } = await supabase
    .from('indices')
    .select('total_value_locked')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(error, 'getCurrentPrice');
  }

  const params = await getBondingCurveParams(indexId);
  const supply = safeDecimal((index as any).total_value_locked, '0');
  return calculatePriceAtSupply(params, supply);
}

/**
 * 가격 궤적 시뮬레이션
 *
 * @param indexId Index ID
 * @param steps Number of steps to simulate (default: 10)
 * @returns Array of {supply, price, marketCap} points
 */
export async function simulatePriceTrajectory(
  indexId: string,
  steps: number = 10
): Promise<PricePoint[]> {
  const params = await getBondingCurveParams(indexId);
  const maxSupply = new Decimal(params.graduationThreshold);

  // Get current supply
  // @ts-ignore - Supabase type inference limitation
  const { data: index, error } = await supabase
    .from('indices')
    .select('total_value_locked')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(error, 'simulatePriceTrajectory');
  }

  const currentSupply = new Decimal(safeDecimal((index as any).total_value_locked, '0'));
  const stepSize = maxSupply.minus(currentSupply).dividedBy(steps);

  const trajectory: PricePoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const supply = currentSupply.plus(stepSize.times(i));
    const price = calculatePriceAtSupply(params, supply.toString());
    const marketCap = new Decimal(price).times(supply).toString();

    trajectory.push({
      supply: supply.toString(),
      price: price,
      marketCap: marketCap
    });
  }

  return trajectory;
}

/**
 * 현재 시가총액 계산
 */
export async function calculateMarketCap(indexId: string): Promise<string> {
  // @ts-ignore - Supabase type inference limitation
  const { data: index, error } = await supabase
    .from('indices')
    .select('total_value_locked')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(error, 'calculateMarketCap');
  }

  const supply = safeDecimal((index as any).total_value_locked, '0');
  const currentPrice = await getPriceAtSupply(indexId, supply);

  return new Decimal(supply).times(currentPrice).toString();
}

/**
 * 졸업 진행률 계산
 */
export async function calculateGraduationProgress(
  indexId: string
): Promise<string> {
  const params = await getBondingCurveParams(indexId);
  const currentMarketCap = await calculateMarketCap(indexId);

  const currentDec = new Decimal(currentMarketCap);
  const targetDec = new Decimal(params.targetMarketCap);
  const progress = currentDec.dividedBy(targetDec).times(100);

  return Decimal.min(progress, new Decimal(100)).toString();
}

// ============================================================
// 5. 데이터베이스 관련 함수
// ============================================================

/**
 * DB에서 파라미터 가져오기 (없으면 기본값)
 */
async function getBondingCurveParams(
  indexId: string
): Promise<BondingCurveParams> {
  // @ts-ignore - Supabase type inference limitation
  const { data, error } = await supabase
    .from('bonding_curve_params')
    .select('curve_type, base_price, linear_coefficient, quadratic_coefficient, target_market_cap, graduation_threshold')
    .eq('index_id', indexId)
    .maybeSingle();

  if (error) {
    handleSupabaseError(error, 'getBondingCurveParams');
  }

  // 데이터 없음 - 기본값 반환
  if (!data) {
    return getDefaults();
  }

  // Transform DB format to application format
  const paramsData = data as any;
  return {
    curveType: paramsData.curve_type || 'quadratic',
    basePrice: safeDecimal(paramsData.base_price, QUADRATIC_CURVE_DEFAULTS.BASE_PRICE),
    linearCoefficient: safeDecimal(paramsData.linear_coefficient, QUADRATIC_CURVE_DEFAULTS.LINEAR_COEFFICIENT),
    quadraticCoefficient: safeDecimal(paramsData.quadratic_coefficient, QUADRATIC_CURVE_DEFAULTS.QUADRATIC_COEFFICIENT),
    targetMarketCap: safeDecimal(paramsData.target_market_cap, QUADRATIC_CURVE_DEFAULTS.TARGET_MARKET_CAP),
    graduationThreshold: safeDecimal(paramsData.graduation_threshold, QUADRATIC_CURVE_DEFAULTS.GRADUATION_THRESHOLD),
  };
}

/**
 * DB에 파라미터 저장
 */
export async function saveBondingCurveParams(
  indexId: string,
  params: BondingCurveParams
): Promise<void> {
  // @ts-ignore - Supabase type inference limitation
  const { error } = await supabase
    .from('bonding_curve_params')
    // @ts-ignore - Supabase update type limitation
    .upsert({
      index_id: indexId,
      curve_type: params.curveType,
      base_price: params.basePrice,
      linear_coefficient: params.linearCoefficient,
      quadratic_coefficient: params.quadraticCoefficient,
      target_market_cap: params.targetMarketCap,
      graduation_threshold: params.graduationThreshold,
      updated_at: new Date().toISOString()
    });

  if (error) {
    handleSupabaseError(error, 'saveBondingCurveParams');
  }
}

/**
 * 기본 Quadratic 파라미터 조회 (Pure Function)
 *
 * @deprecated Use getDefaultQuadraticParams from types/index.ts instead
 */
export function getDefaultHybridParams(): BondingCurveParams {
  return getDefaults();
}

/**
 * 기본 Quadratic 파라미터 조회 (권장)
 */
export function getDefaultQuadraticParams(): BondingCurveParams {
  return getDefaults();
}