// Index and Layer Types for MVP

/**
 * Layer definitions
 * L1: Major market indices (50+ tokens)
 * L2: Themed indices (smaller scope)
 * L3: User-launched indices (bonding curve)
 */
export type Layer = 'L1' | 'L2' | 'L3';

/**
 * Index status
 */
export type IndexStatus = 'active' | 'paused' | 'graduated' | 'deprecated';

/**
 * Token component in an index
 */
export interface IndexComponent {
  symbol: string;
  address: string;
  weight: string; // Percentage (0-1), sum should be 1.0
  chainId?: number; // For future multi-chain support
}

/**
 * Index metadata
 */
export interface Index {
  id: string;
  layer: Layer;
  symbol: string; // e.g., "HI-MAJOR", "HI-DEFI"
  name: string; // e.g., "HyperCore Major Index"
  description: string;
  components: IndexComponent[];
  
  // Fees
  managementFee: string; // Annual % (e.g., '0.007' = 0.7%)
  performanceFee?: string; // % of profits (for L3)
  
  // Status
  status: IndexStatus;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  createdBy?: string; // User ID (for L3)
  
  // Layer-specific
  totalValueLocked?: string; // TVL in USD
  holders?: number;
  volume24h?: string;
}

/**
 * Layer configuration
 */
export interface LayerConfig {
  layer: Layer;
  minComponents: number;
  maxComponents: number;
  tradingMechanism: 'amm' | 'bonding-curve';
  managementFee: string; // Default fee
  rebalancingFrequency?: 'monthly' | 'weekly' | 'user-controlled';
  permissionless: boolean; // Can users create?
}

/**
 * Layer 1 Configuration
 * Major market indices with 50+ tokens
 */
export const L1_CONFIG: LayerConfig = {
  layer: 'L1',
  minComponents: 50,
  maxComponents: 100,
  tradingMechanism: 'amm',
  managementFee: '0.007', // 0.7% annually
  rebalancingFrequency: 'monthly',
  permissionless: false, // Admin only
};

/**
 * Layer 2 Configuration
 * Themed indices
 */
export const L2_CONFIG: LayerConfig = {
  layer: 'L2',
  minComponents: 5,
  maxComponents: 50,
  tradingMechanism: 'amm',
  managementFee: '0.01', // 1% annually
  rebalancingFrequency: 'weekly',
  permissionless: false, // Admin or graduated L3
};

/**
 * Layer 3 Configuration
 * User-launched indices with bonding curve
 */
export const L3_CONFIG: LayerConfig = {
  layer: 'L3',
  minComponents: 2,
  maxComponents: 20,
  tradingMechanism: 'bonding-curve',
  managementFee: '0.02', // 2% annually
  rebalancingFrequency: 'user-controlled',
  permissionless: true, // Anyone can create
};

/**
 * Bonding Curve parameters (Layer 3 only)
 *
 * Quadratic Formula: P(s) = basePrice + a*s + b*s²
 * - 초기: Linear 주도 (안정적 시작)
 * - 후기: Quadratic 주도 (빠른 졸업 유도)
 * - 가격 상한: 없음 (Graduation이 자연스럽게 제한)
 */
export interface BondingCurveParams {
  /** Curve type: 'linear' or 'quadratic' */
  curveType: 'linear' | 'quadratic';

  /** Initial price at supply = 0 (e.g., "0.001") */
  basePrice: string;

  /** Linear coefficient (a in P(s) = a*s + b*s²) */
  linearCoefficient: string;

  /** Quadratic coefficient (b in P(s) = a*s + b*s²). Required for quadratic curve. */
  quadraticCoefficient: string;

  /** Target market cap for graduation (e.g., "1000000000" = $1B) */
  targetMarketCap: string;

  /** Graduation threshold in token supply (e.g., "800000000" = 800M tokens) */
  graduationThreshold: string;
}

/**
 * 기본 Quadratic 파라미터 상수
 */
export const QUADRATIC_CURVE_DEFAULTS = {
  BASE_PRICE: '0.001',
  LINEAR_COEFFICIENT: '0.000000003',           // a = 3e-9
  QUADRATIC_COEFFICIENT: '0.0000000000000000039', // b = 3.9e-18
  TARGET_MARKET_CAP: '4000000000',              // $4B target
  GRADUATION_THRESHOLD: '800000000',           // 800M tokens
} as const;

/**
 * 기본 Quadratic 파라미터
 *
 * 설계 목표:
 * - 시작 가격: $0.001
 * - 800M 토큰 시 가격: ~$4.90
 * - 전환점: ~769M 토큰 (Linear와 Quadratic이 균형)
 * - 초기 단계: Linear 주도 (안정적 시작)
 * - 후기 단계: Quadratic 주도 (빠른 졸업 유도)
 *
 * Formula: P(s) = 0.001 + 3e-9*s + 3.9e-18*s²
 */
export function getDefaultQuadraticParams(): BondingCurveParams {
  return {
    curveType: 'quadratic',
    basePrice: QUADRATIC_CURVE_DEFAULTS.BASE_PRICE,
    linearCoefficient: QUADRATIC_CURVE_DEFAULTS.LINEAR_COEFFICIENT,
    quadraticCoefficient: QUADRATIC_CURVE_DEFAULTS.QUADRATIC_COEFFICIENT,
    targetMarketCap: QUADRATIC_CURVE_DEFAULTS.TARGET_MARKET_CAP,
    graduationThreshold: QUADRATIC_CURVE_DEFAULTS.GRADUATION_THRESHOLD,
  };
}

/**
 * Price trajectory simulation point
 */
export interface PricePoint {
  supply: string;
  price: string;
  marketCap?: string;
}

/**
 * Layer 3 specific: Bonding Curve Index
 */
export interface L3Index extends Index {
  layer: 'L3';
  bondingCurve: {
    params: BondingCurveParams;
    currentPrice: string;
    currentMarketCap: string;
    totalRaised: string;
    progress: string; // % to graduation (0-100)
  };
  fundingRound?: {
    active: boolean;
    startTime: number;
    endTime: number;
    targetAmount: string;
    raisedAmount: string;
  };
}

/**
 * Graduation criteria for L3 → L2
 */
export interface GraduationCriteria {
  minMarketCap: string; // e.g., $1M
  minHolders: number; // e.g., 100
  minVolume24h: string; // e.g., $50k
  minAge: number; // seconds, e.g., 30 days
}

export const DEFAULT_GRADUATION_CRITERIA: GraduationCriteria = {
  minMarketCap: '1000000', // $1M
  minHolders: 100,
  minVolume24h: '50000', // $50k
  minAge: 30 * 24 * 60 * 60, // 30 days
};

/**
 * Request to create a new index
 */
export interface CreateIndexRequest {
  layer: Layer;
  symbol: string;
  name: string;
  description: string;
  components: IndexComponent[];
  
  // Layer 3 specific
  bondingCurveParams?: BondingCurveParams;
}

/**
 * Portfolio position in an index
 */
export interface IndexPosition {
  indexId: string;
  userId: string;
  shares: string; // Amount of index tokens owned
  entryPrice: string; // Average entry price
  currentValue: string; // Current value in USD
  pnl: string; // Profit/Loss
  pnlPercent: number; // PnL %
  entryTime: number;
}

/**
 * Index trade (buy/sell index tokens)
 */
export interface IndexTrade {
  id: string;
  indexId: string;
  userId: string;
  side: 'buy' | 'sell';
  amount: string; // Amount of index tokens
  price: string; // Execution price
  totalValue: string; // Total trade value
  fee: string;
  txHash?: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Rebalancing event
 */
export interface RebalanceEvent {
  id: string;
  indexId: string;
  oldComponents: IndexComponent[];
  newComponents: IndexComponent[];
  executedAt: number;
  executedBy?: string; // User ID or 'system'
  txHash?: string;
}
