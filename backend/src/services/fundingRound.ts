// Funding Round Service - Investment management

import Decimal from 'decimal.js';
import { AppError } from '../utils/httpError.js';
import type {
  FundingRound,
  Investment,
  VestingSchedule,
} from '../types/token.js';
import { getTokenHolder, lockTokens, mintTokens } from './token.supabase.js';

// Mock database
const fundingRounds = new Map<string, FundingRound>();
const investments = new Map<string, Investment>();

/**
 * Initialize default funding rounds
 */
export function initializeFundingRounds(): void {
  if (fundingRounds.size > 0) return;
  
  const rounds: Omit<FundingRound, 'id' | 'currentRaise' | 'status'>[] = [
    {
      name: 'seed',
      pricePerToken: '0.01',
      discountPercent: '70',
      minInvestment: '1000',
      maxInvestment: '50000',
      targetRaise: '500000',
      startTime: Date.now(),
      endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
      vestingMonths: 12,
      cliffMonths: 3,
    },
    {
      name: 'strategic',
      pricePerToken: '0.02',
      discountPercent: '40',
      minInvestment: '10000',
      maxInvestment: '500000',
      targetRaise: '2000000',
      startTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
      endTime: Date.now() + 60 * 24 * 60 * 60 * 1000,
      vestingMonths: 18,
      cliffMonths: 6,
    },
    {
      name: 'public',
      pricePerToken: '0.05',
      discountPercent: '0',
      minInvestment: '100',
      maxInvestment: '100000',
      targetRaise: '5000000',
      startTime: Date.now() + 60 * 24 * 60 * 60 * 1000,
      endTime: Date.now() + 90 * 24 * 60 * 60 * 1000,
      vestingMonths: 6,
      cliffMonths: 0,
    },
  ];
  
  rounds.forEach((round, index) => {
    const id = `round-${round.name}-${index}`;
    const now = Date.now();
    
    let status: FundingRound['status'];
    if (now < round.startTime) {
      status = 'upcoming';
    } else if (now >= round.startTime && now <= round.endTime) {
      status = 'active';
    } else {
      status = 'completed';
    }
    
    fundingRounds.set(id, {
      id,
      ...round,
      currentRaise: '0',
      status,
    });
  });
  
  console.log(`💎 Initialized ${rounds.length} funding rounds`);
}

/**
 * Get all funding rounds
 */
export function getAllFundingRounds(): FundingRound[] {
  return Array.from(fundingRounds.values());
}

/**
 * Get active funding rounds
 */
export function getActiveFundingRounds(): FundingRound[] {
  const now = Date.now();
  
  return Array.from(fundingRounds.values())
    .filter(round => round.status === 'active' && now >= round.startTime && now <= round.endTime);
}

/**
 * Get funding round by ID
 */
export function getFundingRound(roundId: string): FundingRound {
  const round = fundingRounds.get(roundId);
  
  if (!round) {
    throw new AppError(404, {
      code: 'NOT_FOUND',
      message: `Funding round ${roundId} not found`
    });
  }
  
  return round;
}

/**
 * Participate in funding round
 */
export async function participateInRound(
  userId: string,
  roundId: string,
  investmentAmount: string
): Promise<Investment> {
  const round = getFundingRound(roundId);
  const now = Date.now();
  
  // Check if round is active
  if (round.status !== 'active') {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: `Funding round ${round.name} is not active`
    });
  }
  
  if (now < round.startTime || now > round.endTime) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Funding round is not currently accepting investments'
    });
  }
  
  // Validate investment amount using Decimal.js
  const investmentDec = new Decimal(investmentAmount);
  const minInvestmentDec = new Decimal(round.minInvestment);
  const maxInvestmentDec = new Decimal(round.maxInvestment);
  
  if (investmentDec.lessThan(minInvestmentDec)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: `Minimum investment is $${round.minInvestment}`
    });
  }
  
  if (investmentDec.greaterThan(maxInvestmentDec)) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: `Maximum investment is $${round.maxInvestment}`
    });
  }
  
  // Check if target would be exceeded
  const currentRaiseDec = new Decimal(round.currentRaise);
  const targetRaiseDec = new Decimal(round.targetRaise);
  const newRaiseDec = currentRaiseDec.plus(investmentDec);
  
  if (newRaiseDec.greaterThan(targetRaiseDec)) {
    const remaining = targetRaiseDec.minus(currentRaiseDec);
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: `Funding round target would be exceeded. Only $${remaining.toString()} remaining`
    });
  }
  
  // Calculate token amount with Decimal.js
  const pricePerTokenDec = new Decimal(round.pricePerToken);
  const tokenAmount = investmentDec.dividedBy(pricePerTokenDec).toString();
  
  // Create vesting schedule
  const vestingSchedule: VestingSchedule = {
    totalAmount: tokenAmount,
    startTime: now,
    cliffEndTime: now + round.cliffMonths * 30 * 24 * 60 * 60 * 1000,
    endTime: now + round.vestingMonths * 30 * 24 * 60 * 60 * 1000,
    claimedAmount: '0',
  };
  
  // Create investment record
  const investment: Investment = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    roundId: round.id,
    roundName: round.name,
    investmentAmount,
    tokenAmount,
    pricePerToken: round.pricePerToken,
    timestamp: now,
    vestingSchedule,
    claimedAmount: '0',
    remainingAmount: tokenAmount,
  };
  
  // Update round with Decimal.js
  round.currentRaise = newRaiseDec.toString();
  
  // Check if round is now completed
  if (newRaiseDec.greaterThanOrEqualTo(targetRaiseDec)) {
    round.status = 'completed';
  }
  
  // Store investment
  investments.set(investment.id, investment);
  
  // Add to user's investments
  const holder = await getTokenHolder(userId);
  holder.investments.push(investment);
  
  // Mint and lock tokens
  await mintTokens(userId, tokenAmount, `Investment in ${round.name} round`);
  await lockTokens(userId, tokenAmount);
  
  return investment;
}

/**
 * Get user's investments
 */
export function getUserInvestments(userId: string): Investment[] {
  return Array.from(investments.values()).filter(inv => inv.userId === userId);
}

/**
 * Get investment by ID
 */
export function getInvestment(investmentId: string): Investment {
  const investment = investments.get(investmentId);
  
  if (!investment) {
    throw new AppError(404, {
      code: 'NOT_FOUND',
      message: `Investment ${investmentId} not found`
    });
  }
  
  return investment;
}

/**
 * Calculate claimable amount from vesting
 * Returns string for decimal precision
 */
export function calculateClaimableAmount(investment: Investment): string {
  const now = Date.now();
  const schedule = investment.vestingSchedule;
  
  // Before cliff, nothing is claimable
  if (now < schedule.cliffEndTime) {
    return '0';
  }
  
  // After vesting end, everything is claimable
  if (now >= schedule.endTime) {
    return investment.remainingAmount;
  }
  
  // During vesting, calculate linear unlock
  const vestingDuration = schedule.endTime - schedule.cliffEndTime;
  const elapsedTime = now - schedule.cliffEndTime;
  const vestedPercent = new Decimal(elapsedTime).dividedBy(vestingDuration);
  
  // Calculate total vested amount
  const totalVested = new Decimal(schedule.totalAmount).times(vestedPercent);
  
  // Calculate claimable (total vested - already claimed)
  const claimable = totalVested.minus(schedule.claimedAmount);
  
  // Ensure claimable is non-negative and not more than remaining
  const remainingDec = new Decimal(investment.remainingAmount);
  
  if (claimable.lessThanOrEqualTo(0)) {
    return '0';
  }
  
  if (claimable.greaterThanOrEqualTo(remainingDec)) {
    return investment.remainingAmount;
  }
  
  return claimable.toString();
}

/**
 * Get all claimable amounts for user
 */
export function getUserClaimableTokens(userId: string): {
  total: string;
  byInvestment: Array<{
    investmentId: string;
    roundName: string;
    claimable: string;
    totalVested: string;
    totalAmount: string;
  }>;
} {
  const userInvestments = getUserInvestments(userId);
  const now = Date.now();
  
  let total = new Decimal(0);
  
  const byInvestment = userInvestments.map(inv => {
    const claimable = calculateClaimableAmount(inv);
    total = total.plus(claimable);
    
    const schedule = inv.vestingSchedule;
    
    // Calculate vesting progress
    let vestingProgress;
    if (now < schedule.cliffEndTime) {
      vestingProgress = new Decimal(0);
    } else if (now >= schedule.endTime) {
      vestingProgress = new Decimal(1);
    } else {
      const elapsed = now - schedule.cliffEndTime;
      const duration = schedule.endTime - schedule.cliffEndTime;
      vestingProgress = new Decimal(elapsed).dividedBy(duration);
    }
    
    const totalVested = new Decimal(schedule.totalAmount)
      .times(vestingProgress)
      .toString();
    
    return {
      investmentId: inv.id,
      roundName: inv.roundName,
      claimable,
      totalVested,
      totalAmount: schedule.totalAmount,
    };
  });
  
  return { 
    total: total.toString(), 
    byInvestment 
  };
}

/**
 * Get funding round statistics
 */
export function getFundingRoundStats() {
  const rounds = getAllFundingRounds();
  
  // Aggregate totals using Decimal.js
  let totalRaised = new Decimal(0);
  let totalTarget = new Decimal(0);
  
  rounds.forEach(r => {
    totalRaised = totalRaised.plus(r.currentRaise);
    totalTarget = totalTarget.plus(r.targetRaise);
  });
  
  // Calculate overall progress
  const progress = totalTarget.isZero() 
    ? '0' 
    : totalRaised.dividedBy(totalTarget).times(100).toFixed(2);
  
  return {
    totalRounds: rounds.length,
    activeRounds: rounds.filter(r => r.status === 'active').length,
    completedRounds: rounds.filter(r => r.status === 'completed').length,
    totalRaised: totalRaised.toString(),
    totalTarget: totalTarget.toString(),
    progress,
    rounds: rounds.map(r => {
      const raised = new Decimal(r.currentRaise);
      const target = new Decimal(r.targetRaise);
      const roundProgress = target.isZero()
        ? '0'
        : raised.dividedBy(target).times(100).toFixed(2);
      
      return {
        name: r.name,
        status: r.status,
        raised: r.currentRaise,
        target: r.targetRaise,
        progress: roundProgress,
      };
    }),
  };
}
