// Bonding Curve Service - Price calculation for L3 indices

import Decimal from 'decimal.js';
import { AppError } from '../utils/httpError.js';

/**
 * Bonding curve types
 */
export type CurveType = 'linear' | 'exponential' | 'sigmoid' | 'hybrid';

/**
 * Bonding curve parameters
 */
export interface BondingCurveParams {
  curveType: CurveType;

  // Linear parameters
  basePrice: string;          // Initial price
  linearSlope?: string;       // k1 for linear growth

  // Sigmoid parameters
  maxPrice?: string;          // L: Upper price limit
  sigmoidSlope?: string;      // k2: Sigmoid steepness
  midpoint?: string;          // x0: Inflection point

  // Hybrid parameters
  transitionPoint?: string;   // Supply threshold for linear→sigmoid

  // Reserve parameters
  reserveRatio?: string;      // For Bancor-style (0-1)

  // Target
  targetMarketCap: string;    // Graduation target
}

/**
 * Calculate price using Linear bonding curve
 * P = basePrice + k * supply
 */
function calculateLinearPrice(
  supply: string,
  params: BondingCurveParams
): string {
  const supplyDec = new Decimal(supply);
  const k = new Decimal(params.linearSlope || '0.0001');
  const basePrice = new Decimal(params.basePrice);

  return basePrice.plus(k.times(supplyDec)).toString();
}

/**
 * Calculate price using Exponential bonding curve
 * P = basePrice * e^(k * supply)
 */
function calculateExponentialPrice(
  supply: string,
  params: BondingCurveParams
): string {
  const supplyDec = new Decimal(supply);
  const k = new Decimal(params.linearSlope || '0.00001');
  const basePrice = new Decimal(params.basePrice);

  // Use approximation for exponential since Decimal.js doesn't have native exp
  const exponent = k.times(supplyDec);
  const expApprox = new Decimal(Math.exp(exponent.toNumber()));

  return basePrice.times(expApprox).toString();
}

/**
 * Calculate price using Sigmoid bonding curve
 * P = L / (1 + e^(-k * (supply - midpoint)))
 */
function calculateSigmoidPrice(
  supply: string,
  params: BondingCurveParams
): string {
  const supplyDec = new Decimal(supply);
  const targetMarketCap = new Decimal(params.targetMarketCap);
  const L = params.maxPrice ? new Decimal(params.maxPrice) : targetMarketCap.dividedBy(10000);
  const k = new Decimal(params.sigmoidSlope || '0.0001');
  const x0 = new Decimal(params.midpoint || '10000');

  // Sigmoid approximation
  const exponent = k.times(supplyDec.minus(x0)).negated();
  const expApprox = new Decimal(Math.exp(exponent.toNumber()));

  return L.dividedBy(new Decimal(1).plus(expApprox)).toString();
}

/**
 * Calculate price using Hybrid bonding curve (Recommended)
 * Phase 1 (supply < transitionPoint): Linear
 * Phase 2 (supply >= transitionPoint): Sigmoid
 */
function calculateHybridPrice(
  supply: string,
  params: BondingCurveParams
): string {
  const supplyDec = new Decimal(supply);
  const transition = new Decimal(params.transitionPoint || '5000');

  if (supplyDec.lessThan(transition)) {
    // Linear phase for fair initial distribution
    return calculateLinearPrice(supply, params);
  } else {
    // Sigmoid phase for stability and growth
    const sigmoidParams = {
      ...params,
      basePrice: calculateLinearPrice(transition.toString(), params), // Smooth transition
    };
    return calculateSigmoidPrice(supply, sigmoidParams);
  }
}

/**
 * Calculate buy price for a given supply
 */
export function calculateBuyPrice(
  currentSupply: string,
  amount: string,
  params: BondingCurveParams
): {
  pricePerToken: string;
  totalCost: string;
  averagePrice: string;
  newSupply: string;
} {
  const currentSupplyDec = new Decimal(currentSupply);
  const amountDec = new Decimal(amount);
  let totalCost = new Decimal(0);
  const newSupply = currentSupplyDec.plus(amountDec);

  // Calculate integral (area under curve)
  // For simplicity, use rectangular approximation
  const steps = Math.ceil(amountDec.toNumber());
  const stepSize = amountDec.dividedBy(steps);

  for (let i = 0; i < steps; i++) {
    const supply = currentSupplyDec.plus(stepSize.times(i));
    const price = new Decimal(getPriceAtSupply(supply.toString(), params));
    totalCost = totalCost.plus(price.times(stepSize));
  }

  const finalPrice = getPriceAtSupply(newSupply.toString(), params);
  const averagePrice = totalCost.dividedBy(amountDec);

  return {
    pricePerToken: finalPrice,
    totalCost: totalCost.toString(),
    averagePrice: averagePrice.toString(),
    newSupply: newSupply.toString(),
  };
}

/**
 * Calculate sell price for a given supply
 */
export function calculateSellPrice(
  currentSupply: string,
  amount: string,
  params: BondingCurveParams
): {
  pricePerToken: string;
  totalReturn: string;
  averagePrice: string;
  newSupply: string;
} {
  const currentSupplyDec = new Decimal(currentSupply);
  const amountDec = new Decimal(amount);

  if (amountDec.greaterThan(currentSupplyDec)) {
    throw new AppError(400, {
      code: 'INSUFFICIENT_POSITION',
      message: 'Cannot sell more than current supply'
    });
  }

  let totalReturn = new Decimal(0);
  const newSupply = currentSupplyDec.minus(amountDec);

  // Calculate integral (area under curve)
  const steps = Math.ceil(amountDec.toNumber());
  const stepSize = amountDec.dividedBy(steps);

  for (let i = 0; i < steps; i++) {
    const supply = currentSupplyDec.minus(stepSize.times(i));
    const price = new Decimal(getPriceAtSupply(supply.toString(), params));
    totalReturn = totalReturn.plus(price.times(stepSize));
  }

  const finalPrice = getPriceAtSupply(newSupply.toString(), params);
  const averagePrice = totalReturn.dividedBy(amountDec);

  return {
    pricePerToken: finalPrice,
    totalReturn: totalReturn.toString(),
    averagePrice: averagePrice.toString(),
    newSupply: newSupply.toString(),
  };
}

/**
 * Get price at specific supply level
 */
export function getPriceAtSupply(
  supply: string,
  params: BondingCurveParams
): string {
  switch (params.curveType) {
    case 'linear':
      return calculateLinearPrice(supply, params);
    case 'exponential':
      return calculateExponentialPrice(supply, params);
    case 'sigmoid':
      return calculateSigmoidPrice(supply, params);
    case 'hybrid':
      return calculateHybridPrice(supply, params);
    default:
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: `Unknown curve type: ${params.curveType}`
      });
  }
}

/**
 * Calculate current market cap
 */
export function calculateMarketCap(
  supply: string,
  params: BondingCurveParams
): string {
  const supplyDec = new Decimal(supply);
  const currentPrice = new Decimal(getPriceAtSupply(supply, params));
  return supplyDec.times(currentPrice).toString();
}

/**
 * Calculate progress to graduation target
 */
export function calculateGraduationProgress(
  currentMarketCap: string,
  targetMarketCap: string
): string {
  const currentDec = new Decimal(currentMarketCap);
  const targetDec = new Decimal(targetMarketCap);
  const progress = currentDec.dividedBy(targetDec).times(100);

  return Decimal.min(progress, new Decimal(100)).toString();
}

/**
 * Get default hybrid curve parameters (Recommended for MVP)
 */
export function getDefaultHybridParams(targetMarketCap: string): BondingCurveParams {
  const targetDec = new Decimal(targetMarketCap);

  return {
    curveType: 'hybrid',
    basePrice: '0.01',              // $0.01 starting price
    linearSlope: '0.00001',         // Gentle initial slope
    maxPrice: targetDec.dividedBy(5000).toString(),  // Price cap at 5000 tokens
    sigmoidSlope: '0.0002',         // Moderate sigmoid steepness
    midpoint: '7500',               // Inflection at 7500 tokens
    transitionPoint: '5000',        // Switch to sigmoid at 5000 tokens
    targetMarketCap,
  };
}

/**
 * Simulate price trajectory
 */
export function simulatePriceTrajectory(
  params: BondingCurveParams,
  maxSupply: string,
  steps: number = 100
): Array<{ supply: string; price: string; marketCap: string }> {
  const trajectory: Array<{ supply: string; price: string; marketCap: string }> = [];
  const maxSupplyDec = new Decimal(maxSupply);
  const stepSize = maxSupplyDec.dividedBy(steps);

  for (let i = 0; i <= steps; i++) {
    const supply = stepSize.times(i);
    const price = getPriceAtSupply(supply.toString(), params);
    const marketCap = supply.times(price);

    trajectory.push({
      supply: supply.toString(),
      price,
      marketCap: marketCap.toString()
    });
  }

  return trajectory;
}