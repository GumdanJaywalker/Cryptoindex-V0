// Graduation Service - Supabase version
// L3 to L2 migration logic with PostgreSQL integration

import Decimal from 'decimal.js';
import { supabase, type Database } from '../lib/supabase.js';
import { handleSupabaseError, isNotFoundError, createNotFoundError, daysDifference, calculateProgress } from '../lib/supabase-helpers.js';
import { AppError } from '../utils/httpError.js';
import type { GraduationCriteria } from '../types/index.js';
import { calculateMarketCap } from './bondingCurve.supabase.js';

/**
 * Graduation criteria constants
 * MVP values (scaled down from production)
 */
const GRADUATION_CRITERIA = {
  MIN_TVL: new Decimal('100000'),      // $100K TVL
  MIN_AGE_DAYS: 30,                     // 30 days
  MIN_VOLUME: new Decimal('500000'),    // $500K total volume
} as const;

/**
 * Check graduation eligibility
 *
 * Processing order:
 * 1. Query indexes table for index info:
 *    - SELECT id, tvl, created_at, status, layer
 *    - WHERE id = indexId
 * 2. TVL check: tvl >= $100,000
 * 3. Age check:
 *    - Current time - created_at >= 30 days
 *    - JavaScript Date calculation
 * 4. Volume check:
 *    - SELECT SUM(volume) FROM trading_volume WHERE index_id = indexId
 *    - Sum >= $500,000
 * 5. Return result:
 *    - eligible: boolean (all 3 conditions met)
 *    - reasons: string[] (failed conditions)
 *    - progress: percentage for each condition
 *
 * Errors:
 * - index not found → 404 INDEX_NOT_FOUND
 * - DB error → handleSupabaseError()
 */
export async function checkGraduationEligibility(
  indexId: string
): Promise<{
  eligible: boolean;
  reasons: string[];
  progress: {
    tvl: { current: string; required: string; percentage: string };
    age: { current: number; required: number; percentage: string };
    volume: { current: string; required: string; percentage: string };
  };
}> {
  // 1. Get index data
  // @ts-ignore - Supabase type inference limitation
  const { data: indexData, error: indexError } = await supabase
    .from('indices')
    .select('id, total_value_locked, created_at, status, layer')
    .eq('id', indexId)
    .single();

  if (indexError) {
    if (isNotFoundError(indexError)) {
      createNotFoundError('Index', indexId);
    }
    handleSupabaseError(indexError, 'checkGraduationEligibility');
  }

  // Check if it's L3 index
  const indexInfo = indexData as any;
  if (indexInfo.layer !== 'L3') {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Only L3 indices can graduate to L2'
    });
  }

  // 2. Get current TVL (using total_value_locked as proxy)
  const currentTvl = new Decimal(indexInfo.total_value_locked || '0');

  // 3. Calculate age in days
  const createdAt = new Date(indexInfo.created_at);
  const now = new Date();
  const ageInDays = daysDifference(createdAt, now);

  // 4. Get total volume from trading_volume table
  // @ts-ignore - Supabase type inference limitation
  const { data: volumeData, error: volumeError } = await supabase
    .from('trading_volume')
    .select('volume')
    .eq('index_id', indexId);

  if (volumeError) {
    handleSupabaseError(volumeError, 'checkGraduationEligibility');
  }

  const totalVolume = (volumeData || []).reduce(
    (sum, row) => new Decimal(sum).plus((row as any).volume || '0').toString(),
    '0'
  );

  // 5. Check each criterion
  const reasons: string[] = [];

  // TVL check
  const tvlMet = currentTvl.greaterThanOrEqualTo(GRADUATION_CRITERIA.MIN_TVL);
  if (!tvlMet) {
    reasons.push(
      `TVL: $${currentTvl.toNumber().toLocaleString()} / $${GRADUATION_CRITERIA.MIN_TVL.toNumber().toLocaleString()}`
    );
  }

  // Age check
  const ageMet = ageInDays >= GRADUATION_CRITERIA.MIN_AGE_DAYS;
  if (!ageMet) {
    reasons.push(`Age: ${ageInDays} days / ${GRADUATION_CRITERIA.MIN_AGE_DAYS} days`);
  }

  // Volume check
  const volumeMet = new Decimal(totalVolume).greaterThanOrEqualTo(GRADUATION_CRITERIA.MIN_VOLUME);
  if (!volumeMet) {
    reasons.push(
      `Volume: $${new Decimal(totalVolume).toNumber().toLocaleString()} / $${GRADUATION_CRITERIA.MIN_VOLUME.toNumber().toLocaleString()}`
    );
  }

  // 6. Calculate progress percentages
  const tvlProgress = calculateProgress(currentTvl.toString(), GRADUATION_CRITERIA.MIN_TVL.toString());
  const ageProgress = calculateProgress(ageInDays.toString(), GRADUATION_CRITERIA.MIN_AGE_DAYS.toString());
  const volumeProgress = calculateProgress(totalVolume, GRADUATION_CRITERIA.MIN_VOLUME.toString());

  return {
    eligible: reasons.length === 0,
    reasons,
    progress: {
      tvl: {
        current: currentTvl.toString(),
        required: GRADUATION_CRITERIA.MIN_TVL.toString(),
        percentage: tvlProgress,
      },
      age: {
        current: ageInDays,
        required: GRADUATION_CRITERIA.MIN_AGE_DAYS,
        percentage: ageProgress,
      },
      volume: {
        current: totalVolume,
        required: GRADUATION_CRITERIA.MIN_VOLUME.toString(),
        percentage: volumeProgress,
      },
    },
  };
}

/**
 * Get graduation progress (simplified)
 *
 * Processing order:
 * 1. Call checkGraduationEligibility()
 * 2. Extract progress only
 *
 * Reuses: checkGraduationEligibility() logic
 */
export async function getGraduationProgress(
  indexId: string
): Promise<{
  tvlProgress: string;
  ageProgress: string;
  volumeProgress: string;
}> {
  const eligibility = await checkGraduationEligibility(indexId);

  return {
    tvlProgress: eligibility.progress.tvl.percentage,
    ageProgress: eligibility.progress.age.percentage,
    volumeProgress: eligibility.progress.volume.percentage,
  };
}

/**
 * Execute index graduation
 *
 * Processing order:
 * 1. Call checkGraduationEligibility()
 * 2. If eligible === false, throw error
 * 3. Begin DB transaction:
 *    a. UPDATE indices SET status = 'graduated', graduated_at = NOW()
 *    b. INSERT INTO graduation_history (index_id, graduated_at, metadata)
 * 4. Return success message
 *
 * Security:
 * - TODO: Admin permission check needed (RLS or explicit check)
 *
 * Errors:
 * - not eligible → 400 NOT_ELIGIBLE
 * - DB error → handleSupabaseError()
 */
export async function graduateIndex(
  indexId: string
): Promise<{ success: boolean; message: string }> {
  // 1. Check eligibility
  const eligibility = await checkGraduationEligibility(indexId);

  if (!eligibility.eligible) {
    throw new AppError(400, {
      code: 'BAD_REQUEST',
      message: 'Index does not meet graduation criteria',
      details: {
        missing: eligibility.reasons,
      },
    });
  }

  // 2. Update index status to graduated
  // @ts-ignore - Supabase type inference limitation
  const { error: updateError } = await supabase
    .from('indices')
    // @ts-ignore - Supabase update type limitation
    .update({
      status: 'graduated',
      updated_at: new Date().toISOString(),
    })
    .eq('id', indexId);

  if (updateError) {
    handleSupabaseError(updateError, 'graduateIndex');
  }

  // 3. Record graduation in history table
  const { error: historyError } = await supabase
    .from('graduation_history')
    .insert({
      index_id: indexId,
      graduated_at: new Date().toISOString(),
      metadata: {
        criteria_met: eligibility.progress,
        graduation_reason: 'Automatic graduation - all criteria met',
      },
    } as any);

  if (historyError) {
    handleSupabaseError(historyError, 'graduateIndex');
  }

  return {
    success: true,
    message: `Index ${indexId} successfully graduated to L2`,
  };
}

/**
 * Estimate graduation time
 *
 * Processing order:
 * 1. Call checkGraduationEligibility()
 * 2. Calculate missing requirements for each criterion:
 *    - TVL: (required - current) / daily_avg_growth
 *    - Age: required_days - current_days
 *    - Volume: (required - current) / daily_avg_volume
 * 3. Return maximum days needed (slowest criterion)
 *
 * Note:
 * - daily_avg_growth, daily_avg_volume use estimated values
 * - In production, use historical data for better accuracy
 *
 * Returns: number (estimated days)
 */
export async function estimateGraduationTime(
  indexId: string
): Promise<number> {
  const eligibility = await checkGraduationEligibility(indexId);

  if (eligibility.eligible) {
    return 0; // Already eligible
  }

  // Calculate days needed for each criterion
  const estimates: number[] = [];

  // TVL estimation (assume $1K daily growth)
  const tvlGap = GRADUATION_CRITERIA.MIN_TVL.minus(eligibility.progress.tvl.current);
  if (tvlGap.greaterThan(0)) {
    const dailyTvlGrowth = 1000; // $1K per day assumption
    const tvlDays = tvlGap.dividedBy(dailyTvlGrowth).toNumber();
    estimates.push(Math.ceil(tvlDays));
  }

  // Age estimation (straightforward)
  const ageGap = GRADUATION_CRITERIA.MIN_AGE_DAYS - eligibility.progress.age.current;
  if (ageGap > 0) {
    estimates.push(ageGap);
  }

  // Volume estimation (assume $10K daily volume)
  const volumeGap = GRADUATION_CRITERIA.MIN_VOLUME.minus(eligibility.progress.volume.current);
  if (volumeGap.greaterThan(0)) {
    const dailyVolumeGrowth = 10000; // $10K per day assumption
    const volumeDays = volumeGap.dividedBy(dailyVolumeGrowth).toNumber();
    estimates.push(Math.ceil(volumeDays));
  }

  // Return the maximum (slowest criterion)
  return estimates.length > 0 ? Math.max(...estimates) : 0;
}

/**
 * Get graduation criteria (for reference)
 */
export function getGraduationCriteria(): {
  minTvl: string;
  minAgeDays: number;
  minVolume: string;
} {
  return {
    minTvl: GRADUATION_CRITERIA.MIN_TVL.toString(),
    minAgeDays: GRADUATION_CRITERIA.MIN_AGE_DAYS,
    minVolume: GRADUATION_CRITERIA.MIN_VOLUME.toString(),
  };
}

/**
 * Check if index has graduated
 */
export async function isIndexGraduated(indexId: string): Promise<boolean> {
  // @ts-ignore - Supabase type inference limitation
  const { data: indexData, error } = await supabase
    .from('indices')
    .select('status')
    .eq('id', indexId)
    .single();

  if (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    handleSupabaseError(error, 'isIndexGraduated');
  }

  return (indexData as any).status === 'graduated';
}