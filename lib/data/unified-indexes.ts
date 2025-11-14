/**
 * Unified Index Data Source
 * Combines launched indexes (from Launch page) with mock indexes
 */

import { MemeIndex } from '@/lib/types/index-trading'
import { allMockIndexes } from './mock-indexes'
import { LaunchedIndexesStorage } from '@/lib/storage/launchedIndexes'
import { convertIndexDataToMemeIndex } from '@/lib/utils/index-converter'

/**
 * Get all available indexes (launched + mock)
 * This is the single source of truth for all index data across the app
 */
export function getAllIndexes(): MemeIndex[] {
  if (typeof window === 'undefined') {
    // Server-side: return only mock indexes
    return allMockIndexes
  }

  try {
    // Get launched indexes from localStorage
    const launchedIndexes = LaunchedIndexesStorage.get()

    // Convert to MemeIndex format
    const convertedLaunched = launchedIndexes.map(convertIndexDataToMemeIndex)

    // Combine with mock indexes, ensuring no duplicates by ID
    const mockIds = new Set(allMockIndexes.map(idx => idx.id))
    const uniqueLaunched = convertedLaunched.filter(idx => !mockIds.has(idx.id))

    // Launched indexes first (newest), then mock indexes
    return [...uniqueLaunched, ...allMockIndexes]
  } catch (error) {
    console.error('Failed to load unified indexes:', error)
    return allMockIndexes
  }
}

/**
 * Get a single index by ID or symbol
 */
export function getIndexByIdOrSymbol(idOrSymbol: string): MemeIndex | null {
  const allIndexes = getAllIndexes()
  return allIndexes.find(
    idx => idx.id === idOrSymbol || idx.symbol === idOrSymbol
  ) || null
}

/**
 * Get only launched indexes (created via Launch page)
 */
export function getLaunchedIndexes(): MemeIndex[] {
  if (typeof window === 'undefined') return []

  try {
    const launchedIndexes = LaunchedIndexesStorage.get()
    return launchedIndexes.map(convertIndexDataToMemeIndex)
  } catch (error) {
    console.error('Failed to load launched indexes:', error)
    return []
  }
}

/**
 * Check if an index was user-created (vs mock data)
 */
export function isUserCreatedIndex(indexId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const launchedIndexes = LaunchedIndexesStorage.get()
    return launchedIndexes.some(idx => idx.id === indexId)
  } catch {
    return false
  }
}
