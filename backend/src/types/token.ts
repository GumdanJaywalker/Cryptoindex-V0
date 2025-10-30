// Native Token Types and Economics

/**
 * Native token symbol and decimals
 */
export const NATIVE_TOKEN = {
  symbol: 'HI',
  name: 'HyperIndex Token',
  decimals: 18,
  totalSupply: '1000000000', // 1 billion tokens (string for precision)
};

/**
 * Token allocation breakdown
 * Note: Amount uses string type for decimal precision
 */
export interface TokenAllocation {
  category: 'team' | 'investors' | 'community' | 'foundation' | 'treasury';
  percentage: number;
  amount: string;           // Decimal string for precision
  vestingMonths: number;
  cliffMonths: number;
}

/**
 * Default token allocation (based on industry standards)
 */
export const DEFAULT_TOKEN_ALLOCATION: TokenAllocation[] = [
  {
    category: 'team',
    percentage: 20,
    amount: '200000000',      // 200M tokens
    vestingMonths: 36,
    cliffMonths: 12,
  },
  {
    category: 'investors',
    percentage: 20,
    amount: '200000000',      // 200M tokens
    vestingMonths: 24,
    cliffMonths: 6,
  },
  {
    category: 'community',
    percentage: 35,
    amount: '350000000',      // 350M tokens
    vestingMonths: 48,
    cliffMonths: 0, // Immediate distribution starts
  },
  {
    category: 'foundation',
    percentage: 15,
    amount: '150000000',      // 150M tokens
    vestingMonths: 48,
    cliffMonths: 0,
  },
  {
    category: 'treasury',
    percentage: 10,
    amount: '100000000',      // 100M tokens
    vestingMonths: 0,
    cliffMonths: 0, // Liquid for operations
  },
];

/**
 * Funding round details
 * Note: All monetary values use string type for decimal precision
 */
export interface FundingRound {
  id: string;
  name: 'seed' | 'strategic' | 'public';
  pricePerToken: string;      // Decimal string for precision
  discountPercent: string;    // Decimal string for precision
  minInvestment: string;      // Decimal string for precision
  maxInvestment: string;      // Decimal string for precision
  targetRaise: string;        // Decimal string for precision
  currentRaise: string;       // Decimal string for precision
  startTime: number;          // Unix timestamp in milliseconds
  endTime: number;            // Unix timestamp in milliseconds
  vestingMonths: number;      // Integer months
  cliffMonths: number;        // Integer months
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

/**
 * Default funding rounds (MVP)
 */
export const DEFAULT_FUNDING_ROUNDS: Omit<FundingRound, 'id' | 'currentRaise' | 'status'>[] = [
  {
    name: 'seed',
    pricePerToken: '0.01',      // $0.01 per token
    discountPercent: '70',      // 70% discount from public price
    minInvestment: '1000',      // $1k minimum
    maxInvestment: '50000',     // $50k maximum
    targetRaise: '500000',      // $500k target
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    vestingMonths: 12,
    cliffMonths: 3,
  },
  {
    name: 'strategic',
    pricePerToken: '0.02',       // $0.02 per token
    discountPercent: '40',       // 40% discount
    minInvestment: '10000',      // $10k minimum
    maxInvestment: '500000',     // $500k maximum
    targetRaise: '2000000',      // $2M target
    startTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days
    vestingMonths: 18,
    cliffMonths: 6,
  },
  {
    name: 'public',
    pricePerToken: '0.05',       // $0.05 per token (base price)
    discountPercent: '0',        // No discount
    minInvestment: '100',        // $100 minimum
    maxInvestment: '100000',     // $100k maximum
    targetRaise: '5000000',      // $5M target
    startTime: Date.now() + 60 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
    vestingMonths: 6,
    cliffMonths: 0, // Immediate TGE
  },
];

/**
 * Investor participation in funding round
 * Note: All monetary values use string type for decimal precision
 */
export interface Investment {
  id: string;
  userId: string;
  roundId: string;
  roundName: 'seed' | 'strategic' | 'public';
  investmentAmount: string;   // USD (decimal string)
  tokenAmount: string;        // HI tokens (decimal string)
  pricePerToken: string;      // Decimal string
  timestamp: number;          // Unix timestamp
  
  // Vesting details
  vestingSchedule: VestingSchedule;
  claimedAmount: string;      // Decimal string
  remainingAmount: string;    // Decimal string
}

/**
 * Vesting schedule
 * Note: All token amounts use string type for decimal precision
 */
export interface VestingSchedule {
  totalAmount: string;        // Decimal string
  startTime: number;          // Unix timestamp
  cliffEndTime: number;       // Unix timestamp
  endTime: number;            // Unix timestamp
  claimedAmount: string;      // Decimal string
}

/**
 * Fee structure in native token
 * Note: All percentages use string type for decimal precision
 */
export interface FeeCollectionConfig {
  // Trading fees (collected in native token)
  swapFeePercent: string;          // e.g., '0.3' for 0.3% of swap value
  rebalancingFeePercent: string;   // e.g., '0.5' for 0.5% of rebalancing
  
  // Index management fees (annual, in native token)
  l1ManagementFee: string;         // '0.7' for 0.7% annually
  l2ManagementFee: string;         // '1' for 1% annually
  l3ManagementFee: string;         // '2' for 2% annually
  l3PerformanceFee: string;        // '20' for 20% of profits
  
  // Distribution
  treasuryShare: string;           // % to treasury
  buybackShare: string;            // % for buyback
  stakingRewardShare: string;      // % for stakers
}

export const DEFAULT_FEE_CONFIG: FeeCollectionConfig = {
  swapFeePercent: '0.3',           // 0.3%
  rebalancingFeePercent: '0.5',    // 0.5%
  l1ManagementFee: '0.7',          // 0.7%
  l2ManagementFee: '1',            // 1%
  l3ManagementFee: '2',            // 2%
  l3PerformanceFee: '20',          // 20%
  treasuryShare: '40',             // 40% to treasury
  buybackShare: '30',              // 30% for buyback
  stakingRewardShare: '30',        // 30% for staking rewards
};

/**
 * Buy-back configuration
 * Note: All monetary values and percentages use string type for decimal precision
 */
export interface BuybackConfig {
  enabled: boolean;
  minTreasuryBalance: string;      // Min balance before buyback (decimal string)
  buybackPercentPerWeek: string;   // % of treasury to use weekly (decimal string)
  priceThreshold: string;          // Only buyback below this price (decimal string)
  burnPercentage: string;          // % to burn vs LP (decimal string)
}

export const DEFAULT_BUYBACK_CONFIG: BuybackConfig = {
  enabled: true,
  minTreasuryBalance: '10000',     // $10k minimum
  buybackPercentPerWeek: '10',     // 10% per week
  priceThreshold: '0.04',          // Buyback if < $0.04
  burnPercentage: '50',            // 50% burn, 50% LP
};

/**
 * Token holder information
 * Note: All token amounts use string type for decimal precision
 */
export interface TokenHolder {
  userId: string;
  balance: string;                 // Available balance (decimal string)
  locked: string;                  // Vesting/locked balance (decimal string)
  staked: string;                  // Staked balance (decimal string)
  rewards: string;                 // Unclaimed rewards (decimal string)
  investments: Investment[];       // Funding round investments
}

/**
 * Token transaction
 * Note: Amount uses string type for decimal precision
 */
export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'mint' | 'burn' | 'transfer' | 'claim' | 'stake' | 'unstake' | 'reward';
  amount: string;                  // Decimal string for precision
  from?: string;
  to?: string;
  reason: string;
  timestamp: number;               // Unix timestamp
  txHash?: string;
}

/**
 * Staking configuration
 * Note: All token amounts and percentages use string type for decimal precision
 */
export interface StakingConfig {
  enabled: boolean;
  minStakeAmount: string;          // Decimal string for precision
  lockPeriodDays: number;          // Integer days
  aprPercent: string;              // Annual percentage rate (decimal string)
  earlyUnstakePenalty: string;     // % penalty for early unstake (decimal string)
}

export const DEFAULT_STAKING_CONFIG: StakingConfig = {
  enabled: true,
  minStakeAmount: '100',           // 100 HI minimum
  lockPeriodDays: 30,              // 30 days lock
  aprPercent: '15',                // 15% APR
  earlyUnstakePenalty: '10',       // 10% penalty
};

/**
 * Token metrics
 * Note: All monetary and token amounts use string type for decimal precision
 */
export interface TokenMetrics {
  totalSupply: string;             // Decimal string
  circulatingSupply: string;       // Decimal string
  burnedAmount: string;            // Decimal string
  stakedAmount: string;            // Decimal string
  treasuryBalance: string;         // Decimal string
  priceUsd: string;                // Decimal string
  marketCap: string;               // Decimal string
  holders: number;                 // Integer count
}
