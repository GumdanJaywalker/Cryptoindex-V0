/**
 * Filter Utilities for Index Discovery
 *
 * Handles all filtering logic for the Discover page
 */

import type { MemeIndex } from '@/lib/types/index-trading'
import type { FilterOptions, SortOption, IndexLayer } from '@/lib/types/discover'

// ============================================================================
// Core Filter Functions
// ============================================================================

/**
 * Filter indexes by search query
 * Searches in: name, symbol, description, asset symbols
 */
export function filterBySearch(indexes: MemeIndex[], query: string): MemeIndex[] {
  if (!query.trim()) return indexes

  const searchLower = query.toLowerCase().trim()

  return indexes.filter((index) => {
    // Search in index name
    if (index.name.toLowerCase().includes(searchLower)) return true

    // Search in symbol
    if (index.symbol.toLowerCase().includes(searchLower)) return true

    // Search in description
    if (index.description.toLowerCase().includes(searchLower)) return true

    // Search in asset symbols (composition search)
    const hasAsset = index.assets.some((asset) =>
      asset.symbol.toLowerCase().includes(searchLower)
    )
    if (hasAsset) return true

    // Search in asset names
    const hasAssetName = index.assets.some((asset) =>
      asset.name.toLowerCase().includes(searchLower)
    )
    if (hasAssetName) return true

    return false
  })
}

/**
 * Filter indexes by layer
 */
export function filterByLayer(
  indexes: MemeIndex[],
  selectedLayer: IndexLayer | 'all'
): MemeIndex[] {
  if (selectedLayer === 'all') return indexes

  return indexes.filter((index) => index.layerInfo?.layer === selectedLayer)
}

/**
 * Filter indexes by composition assets
 * Returns indexes that contain ANY of the specified assets
 */
export function filterByComposition(
  indexes: MemeIndex[],
  compositionFilters: FilterOptions['compositionFilters']
): MemeIndex[] {
  if (!compositionFilters || compositionFilters.length === 0) return indexes

  return indexes.filter((index) => {
    return compositionFilters.some((filter) => {
      const asset = index.assets.find(
        (a) => a.symbol.toLowerCase() === filter.assetSymbol.toLowerCase()
      )

      if (!asset) return false

      // Check allocation constraints if specified
      if (filter.minAllocation !== undefined && asset.allocation < filter.minAllocation) {
        return false
      }
      if (filter.maxAllocation !== undefined && asset.allocation > filter.maxAllocation) {
        return false
      }

      return true
    })
  })
}

/**
 * Filter indexes by NAV premium/discount
 * Note: NAV calculation would require real data, using mock for now
 */
export function filterByNAV(
  indexes: MemeIndex[],
  navFilter: FilterOptions['navFilter']
): MemeIndex[] {
  if (!navFilter) return indexes

  return indexes.filter((index) => {
    // Mock NAV premium calculation
    // In production, would calculate: ((price - nav) / nav) * 100
    const mockNAVPremium = (Math.random() - 0.5) * 40 // -20% to +20%

    return (
      mockNAVPremium >= navFilter.minPremiumDiscount &&
      mockNAVPremium <= navFilter.maxPremiumDiscount
    )
  })
}

/**
 * Filter indexes by performance
 */
export function filterByPerformance(
  indexes: MemeIndex[],
  performanceFilter: FilterOptions['performanceFilter']
): MemeIndex[] {
  if (!performanceFilter) return indexes

  return indexes.filter((index) => {
    let performanceValue: number

    switch (performanceFilter.timeframe) {
      case '24h':
        performanceValue = index.change24h
        break
      case '7d':
        performanceValue = index.change7d
        break
      case '30d':
      case '90d':
      case '1y':
      case 'all':
        // Use 7d as fallback for now (would need real data)
        performanceValue = index.change7d
        break
      default:
        performanceValue = index.change24h
    }

    if (
      performanceFilter.minReturn !== undefined &&
      performanceValue < performanceFilter.minReturn
    ) {
      return false
    }

    if (
      performanceFilter.maxReturn !== undefined &&
      performanceValue > performanceFilter.maxReturn
    ) {
      return false
    }

    return true
  })
}

/**
 * Filter indexes by rebalancing schedule
 */
export function filterByRebalancing(
  indexes: MemeIndex[],
  rebalancingFilter: FilterOptions['rebalancingFilter']
): MemeIndex[] {
  if (!rebalancingFilter || rebalancingFilter.nextRebalancing === 'any') {
    return indexes
  }

  return indexes.filter((index) => {
    if (!index.lastRebalanced) return false

    const now = new Date()
    const lastRebalanced = new Date(index.lastRebalanced)
    const daysSinceRebalance = Math.floor(
      (now.getTime() - lastRebalanced.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Mock rebalancing schedule (Layer-1: monthly, Layer-2: bi-weekly, Layer-3: dynamic)
    const rebalancingCycle =
      index.layerInfo?.layer === 'layer-1'
        ? 30
        : index.layerInfo?.layer === 'layer-2'
          ? 14
          : 7

    const daysUntilNextRebalance = rebalancingCycle - daysSinceRebalance

    switch (rebalancingFilter.nextRebalancing) {
      case 'within-24h':
        return daysUntilNextRebalance <= 1
      case 'within-week':
        return daysUntilNextRebalance <= 7
      case 'within-month':
        return daysUntilNextRebalance <= 30
      default:
        return true
    }
  })
}

/**
 * Filter indexes by battle status (Layer 2)
 */
export function filterByBattle(
  indexes: MemeIndex[],
  battleFilter: FilterOptions['battleFilter']
): MemeIndex[] {
  if (!battleFilter || battleFilter.status === 'all') return indexes

  return indexes.filter((index) => {
    // Only Layer-2 indexes have battles
    if (index.layerInfo?.layer !== 'layer-2') return false

    if (battleFilter.hasActiveBattle !== undefined) {
      return index.hasBattle === battleFilter.hasActiveBattle
    }

    // For status filtering, would need real battle data
    // For now, filter by hasBattle flag
    return index.hasBattle === true
  })
}

/**
 * Filter indexes by graduation progress (Layer 3)
 */
export function filterByGraduation(
  indexes: MemeIndex[],
  graduationFilter: FilterOptions['graduationFilter']
): MemeIndex[] {
  if (!graduationFilter || graduationFilter.stage === 'all') return indexes

  return indexes.filter((index) => {
    // Only Layer-3 indexes have graduation
    if (index.layerInfo?.layer !== 'layer-3') return false
    if (!index.graduation) return false

    // Filter by stage
    const matchesStage =
      graduationFilter.stage === 'graduated'
        ? index.graduation.status === 'graduated'
        : graduationFilter.stage === 'bonding-curve'
          ? index.graduation.status === 'launching'
          : graduationFilter.stage === 'funding-round'
            ? index.graduation.status === 'recruiting-liquidity'
            : graduationFilter.stage === 'lp-round'
              ? index.graduation.status === 'near-graduation'
              : true

    if (!matchesStage) return false

    // Filter by progress percentage
    const avgProgress =
      (index.graduation.liquidityProgress + index.graduation.salesProgress) / 2

    if (
      graduationFilter.minProgress !== undefined &&
      avgProgress < graduationFilter.minProgress
    ) {
      return false
    }

    if (
      graduationFilter.maxProgress !== undefined &&
      avgProgress > graduationFilter.maxProgress
    ) {
      return false
    }

    return true
  })
}

/**
 * Filter indexes by volume
 */
export function filterByVolume(
  indexes: MemeIndex[],
  minVolume?: number
): MemeIndex[] {
  if (!minVolume) return indexes

  return indexes.filter((index) => index.volume24h >= minVolume)
}

/**
 * Filter indexes by liquidity (TVL)
 */
export function filterByLiquidity(
  indexes: MemeIndex[],
  minLiquidity?: number
): MemeIndex[] {
  if (!minLiquidity) return indexes

  return indexes.filter((index) => index.tvl >= minLiquidity)
}

/**
 * Filter indexes by age
 */
export function filterByAge(
  indexes: MemeIndex[],
  minAge?: number,
  maxAge?: number
): MemeIndex[] {
  return indexes.filter((index) => {
    if (!index.createdAt) return true

    const ageInDays = Math.floor(
      (Date.now() - index.createdAt) / (1000 * 60 * 60 * 24)
    )

    if (minAge !== undefined && ageInDays < minAge) return false
    if (maxAge !== undefined && ageInDays > maxAge) return false

    return true
  })
}

// ============================================================================
// Combined Filter Function
// ============================================================================

/**
 * Apply all filters to indexes
 */
export function applyFilters(
  indexes: MemeIndex[],
  filters: FilterOptions,
  selectedLayer: IndexLayer | 'all'
): MemeIndex[] {
  let filtered = indexes

  // Layer filter
  filtered = filterByLayer(filtered, selectedLayer)

  // Search filter
  filtered = filterBySearch(filtered, filters.searchQuery)

  // Composition filters
  filtered = filterByComposition(filtered, filters.compositionFilters)

  // NAV filter
  filtered = filterByNAV(filtered, filters.navFilter)

  // Performance filter
  filtered = filterByPerformance(filtered, filters.performanceFilter)

  // Rebalancing filter
  filtered = filterByRebalancing(filtered, filters.rebalancingFilter)

  // Battle filter
  filtered = filterByBattle(filtered, filters.battleFilter)

  // Graduation filter
  filtered = filterByGraduation(filtered, filters.graduationFilter)

  // Volume filter
  filtered = filterByVolume(filtered, filters.minVolume24h)

  // Liquidity filter
  filtered = filterByLiquidity(filtered, filters.minLiquidity)

  // Age filter
  filtered = filterByAge(filtered, filters.minAge, filters.maxAge)

  return filtered
}

// ============================================================================
// Sort Functions
// ============================================================================

/**
 * Sort indexes by specified option
 */
export function sortIndexes(
  indexes: MemeIndex[],
  sortOption: SortOption
): MemeIndex[] {
  const sorted = [...indexes]

  sorted.sort((a, b) => {
    let compareValue = 0

    switch (sortOption.field) {
      case 'name':
        compareValue = a.name.localeCompare(b.name)
        break

      case 'price':
        compareValue = a.currentPrice - b.currentPrice
        break

      case 'volume-24h':
        compareValue = a.volume24h - b.volume24h
        break

      case 'nav':
        // Mock NAV (would use real data)
        compareValue = a.currentPrice - b.currentPrice
        break

      case 'nav-premium':
        // Mock NAV premium (would calculate real premium)
        compareValue = Math.random() - 0.5
        break

      case 'performance-24h':
        compareValue = a.change24h - b.change24h
        break

      case 'performance-7d':
        compareValue = a.change7d - b.change7d
        break

      case 'performance-30d':
        // Use 7d as fallback
        compareValue = a.change7d - b.change7d
        break

      case 'liquidity':
        compareValue = a.tvl - b.tvl
        break

      case 'age':
        const ageA = a.createdAt || 0
        const ageB = b.createdAt || 0
        compareValue = ageA - ageB
        break

      case 'rebalancing-next':
        // Sort by last rebalanced date
        const dateA = a.lastRebalanced ? new Date(a.lastRebalanced).getTime() : 0
        const dateB = b.lastRebalanced ? new Date(b.lastRebalanced).getTime() : 0
        compareValue = dateA - dateB
        break

      case 'graduation-progress':
        const progressA = a.graduation
          ? (a.graduation.liquidityProgress + a.graduation.salesProgress) / 2
          : 0
        const progressB = b.graduation
          ? (b.graduation.liquidityProgress + b.graduation.salesProgress) / 2
          : 0
        compareValue = progressA - progressB
        break

      default:
        compareValue = 0
    }

    return sortOption.direction === 'asc' ? compareValue : -compareValue
  })

  return sorted
}

// ============================================================================
// Quick Filter Presets
// ============================================================================

/**
 * Get hot trending indexes
 */
export function getHotIndices(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.filter((index) => index.isHot || index.isMooning)
}

/**
 * Get new indexes (created within last 7 days)
 */
export function getNewIndices(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.filter((index) => index.isNew)
}

/**
 * Get indexes with active battles (Layer 2)
 */
export function getBattleIndices(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.filter(
    (index) => index.layerInfo?.layer === 'layer-2' && index.hasBattle
  )
}

/**
 * Get graduating indexes (Layer 3 near graduation)
 */
export function getGraduatingIndices(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.filter(
    (index) =>
      index.layerInfo?.layer === 'layer-3' &&
      index.graduation?.status === 'near-graduation'
  )
}

/**
 * Get top performers (24h change > 20%)
 */
export function getTopPerformers(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.filter((index) => index.change24h > 20)
}
