// Supabase Helper Functions
// Common patterns and utilities for Supabase operations

import Decimal from 'decimal.js';
import { AppError } from '../utils/httpError.js';

/**
 * Supabase 쿼리 에러 핸들러
 *
 * 사용 예:
 * const { data, error } = await supabase.from('table').select()
 * if (error) return handleSupabaseError(error, 'functionName')
 */
export function handleSupabaseError(error: any, context: string): never {
  console.error(`[${context}] Supabase Error:`, error);
  throw new AppError(500, {
    code: 'DATABASE_ERROR',
    message: `Database operation failed: ${error.message}`
  });
}

/**
 * PGRST116 에러 체크 (레코드 없음)
 */
export function isNotFoundError(error: any): boolean {
  return error?.code === 'PGRST116';
}

/**
 * Decimal 계산 헬퍼
 * null, undefined, invalid values를 안전하게 처리
 */
export function safeDecimal(value: any, defaultValue: string = '0'): string {
  try {
    return new Decimal(value || defaultValue).toString();
  } catch {
    return defaultValue;
  }
}

/**
 * 404 Not Found 에러 생성 헬퍼
 */
export function createNotFoundError(resource: string, id: string): never {
  throw new AppError(404, {
    code: 'NOT_FOUND',
    message: `${resource} ${id} not found`
  });
}

/**
 * 날짜 계산 헬퍼 (일 단위 차이)
 */
export function daysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 진행률 계산 헬퍼 (0-100%)
 */
export function calculateProgress(current: string, required: string): string {
  try {
    const currentDec = new Decimal(current);
    const requiredDec = new Decimal(required);

    if (requiredDec.equals(0)) return '100';

    const progress = currentDec.dividedBy(requiredDec).times(100);
    return Decimal.min(progress, 100).toString();
  } catch {
    return '0';
  }
}