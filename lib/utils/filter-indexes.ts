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
 * Filter indices by search query
 * Searches in: name, symbol, description, asset symbols
 */
export function filterBySearch(indices: MemeIndex[], query: string): MemeIndex[] {
  if (!query.trim()) return indices

  const searchLower = query.toLowerCase().trim()

  return indices.filter((index) => {
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
 * Filter indices by layer
 */
export function filterByLayer(
  indices: MemeIndex[],
  selectedLayer: IndexLayer | 'all'
): MemeIndex[] {
  if (selectedLayer === 'all') return indices

  return indices.filter((index) => index.layerInfo?.layer === selectedLayer)
}

/**
 * Filter indices by composition assets
 * Returns indices that contain ANY of the specified assets
 */
export function filterByComposition(
  indices: MemeIndex[],
  compositionFilters: FilterOptions['compositionFilters']
): MemeIndex[] {
  if (!compositionFilters || compositionFilters.length === 0) return indices

  return indices.filter((index) => {
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
 * Filter indices by NAV premium/discount
 * Note: NAV calculation would require real data, using mock for now
 */
export function filterByNAV(
  indices: MemeIndex[],
  navFilter: FilterOptions['navFilter']
): MemeIndex[] {
  if (!navFilter) return indices

  return indices.filter((index) => {
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
 * Filter indices by performance
 */
export function filterByPerformance(
  indices: MemeIndex[],
  performanceFilter: FilterOptions['performanceFilter']
): MemeIndex[] {
  if (!performanceFilter) return indices

  return indices.filter((index) => {
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
 * Filter indices by rebalancing schedule
 */
export function filterByRebalancing(
  indices: MemeIndex[],
  rebalancingFilter: FilterOptions['rebalancingFilter']
): MemeIndex[] {
  if (!rebalancingFilter || rebalancingFilter.nextRebalancing === 'any') {
    return indices
  }

  return indices.filter((index) => {
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
 * Filter indices by battle status (Layer 2)
 */
export function filterByBattle(
  indices: MemeIndex[],
  battleFilter: FilterOptions['battleFilter']
): MemeIndex[] {
  if (!battleFilter || battleFilter.status === 'all') return indices

  return indices.filter((index) => {
    // Only Layer-2 indices have battles
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
 * Filter indices by graduation progress (Layer 3)
 */
export function filterByGraduation(
  indices: MemeIndex[],
  graduationFilter: FilterOptions['graduationFilter']
): MemeIndex[] {
  if (!graduationFilter || graduationFilter.stage === 'all') return indices

  return indices.filter((index) => {
    // Only Layer-3 indices have graduation
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
 * Filter indices by volume
 */
export function filterByVolume(
  indices: MemeIndex[],
  minVolume?: number
): MemeIndex[] {
  if (!minVolume) return indices

  return indices.filter((index) => index.volume24h >= minVolume)
}

/**
 * Filter indices by liquidity (TVL)
 */
export function filterByLiquidity(
  indices: MemeIndex[],
  minLiquidity?: number
): MemeIndex[] {
  if (!minLiquidity) return indices

  return indices.filter((index) => index.tvl >= minLiquidity)
}

/**
 * Filter indices by age
 */
export function filterByAge(
  indices: MemeIndex[],
  minAge?: number,
  maxAge?: number
): MemeIndex[] {
  return indices.filter((index) => {
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
 * Apply all filters to indices
 */
export function applyFilters(
  indices: MemeIndex[],
  filters: FilterOptions,
  selectedLayer: IndexLayer | 'all'
): MemeIndex[] {
  let filtered = indices

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
 * Sort indices by specified option
 */
export function sortIndices(
  indices: MemeIndex[],
  sortOption: SortOption
): MemeIndex[] {
  const sorted = [...indices]

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
 * Get hot trending indices
 */
export function getHotIndices(indices: MemeIndex[]): MemeIndex[] {
  return indices.filter((index) => index.isHot || index.isMooning)
}

/**
 * Get new indices (created within last 7 days)
 */
export function getNewIndices(indices: MemeIndex[]): MemeIndex[] {
  return indices.filter((index) => index.isNew)
}

/**
 * Get indices with active battles (Layer 2)
 */
export function getBattleIndices(indices: MemeIndex[]): MemeIndex[] {
  return indices.filter(
    (index) => index.layerInfo?.layer === 'layer-2' && index.hasBattle
  )
}

/**
 * Get graduating indices (Layer 3 near graduation)
 */
export function getGraduatingIndices(indices: MemeIndex[]): MemeIndex[] {
  return indices.filter(
    (index) =>
      index.layerInfo?.layer === 'layer-3' &&
      index.graduation?.status === 'near-graduation'
  )
}

/**
 * Get top performers (24h change > 20%)
 */
export function getTopPerformers(indices: MemeIndex[]): MemeIndex[] {
  return indices.filter((index) => index.change24h > 20)
}
