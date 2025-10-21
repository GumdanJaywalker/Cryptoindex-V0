import type { FilterOptions, SortOption, IndexLayer } from '@/lib/types/discover'

/**
 * URL State Sync Utility
 * Enables shareable filter states by encoding/decoding to/from URL query parameters
 */

// Encode filters to URL query string
export function encodeFiltersToURL(
  filters: FilterOptions,
  sortOption: SortOption,
  selectedLayer: IndexLayer | 'all'
): URLSearchParams {
  const params = new URLSearchParams()

  // Layer selection
  if (selectedLayer !== 'all') {
    params.set('layer', selectedLayer)
  }

  // Search query
  if (filters.searchQuery) {
    params.set('q', filters.searchQuery)
  }

  // Composition filters
  if (filters.compositionFilters.length > 0) {
    const compositionData = filters.compositionFilters.map((cf) => ({
      asset: cf.assetSymbol,
      min: cf.minAllocation,
      max: cf.maxAllocation,
    }))
    params.set('composition', JSON.stringify(compositionData))
  }

  // NAV filter
  if (filters.navFilter) {
    params.set('nav', filters.navFilter.type)
    if (filters.navFilter.minPremium !== undefined) {
      params.set('navMin', filters.navFilter.minPremium.toString())
    }
    if (filters.navFilter.maxPremium !== undefined) {
      params.set('navMax', filters.navFilter.maxPremium.toString())
    }
  }

  // Performance filter
  if (filters.performanceFilter) {
    if (filters.performanceFilter.min24hChange !== undefined) {
      params.set('perf24hMin', filters.performanceFilter.min24hChange.toString())
    }
    if (filters.performanceFilter.max24hChange !== undefined) {
      params.set('perf24hMax', filters.performanceFilter.max24hChange.toString())
    }
    if (filters.performanceFilter.min7dChange !== undefined) {
      params.set('perf7dMin', filters.performanceFilter.min7dChange.toString())
    }
    if (filters.performanceFilter.max7dChange !== undefined) {
      params.set('perf7dMax', filters.performanceFilter.max7dChange.toString())
    }
  }

  // Rebalancing filter
  if (filters.rebalancingFilter) {
    params.set('rebalance', filters.rebalancingFilter.frequency)
    if (filters.rebalancingFilter.nextRebalanceWithin) {
      params.set('rebalanceWithin', filters.rebalancingFilter.nextRebalanceWithin.toString())
    }
  }

  // Battle filter
  if (filters.battleFilter) {
    if (filters.battleFilter.status) {
      params.set('battleStatus', filters.battleFilter.status)
    }
    if (filters.battleFilter.hasActiveBattle !== undefined) {
      params.set('hasActiveBattle', filters.battleFilter.hasActiveBattle.toString())
    }
  }

  // Graduation filter
  if (filters.graduationFilter) {
    if (filters.graduationFilter.stage) {
      params.set('gradStage', filters.graduationFilter.stage)
    }
    if (filters.graduationFilter.minProgress !== undefined) {
      params.set('gradMin', filters.graduationFilter.minProgress.toString())
    }
    if (filters.graduationFilter.maxProgress !== undefined) {
      params.set('gradMax', filters.graduationFilter.maxProgress.toString())
    }
  }

  // Volume filter
  if (filters.minVolume24h !== undefined) {
    params.set('volMin', filters.minVolume24h.toString())
  }

  // Liquidity filter
  if (filters.minLiquidity !== undefined) {
    params.set('liqMin', filters.minLiquidity.toString())
  }

  // Age filter
  if (filters.minAge !== undefined) {
    params.set('ageMin', filters.minAge.toString())
  }
  if (filters.maxAge !== undefined) {
    params.set('ageMax', filters.maxAge.toString())
  }

  // Sort option
  params.set('sort', sortOption.field)
  params.set('sortDir', sortOption.direction)

  return params
}

// Decode filters from URL query string
export function decodeFiltersFromURL(searchParams: URLSearchParams): {
  filters: FilterOptions
  sortOption: SortOption
  selectedLayer: IndexLayer | 'all'
} {
  const filters: FilterOptions = {
    layers: ['layer-1', 'layer-2', 'layer-3'],
    searchQuery: searchParams.get('q') || '',
    compositionFilters: [],
    navFilter: null,
    performanceFilter: null,
    rebalancingFilter: null,
    battleFilter: null,
    graduationFilter: null,
  }

  // Layer selection
  const layer = searchParams.get('layer') as IndexLayer | null
  const selectedLayer: IndexLayer | 'all' = layer || 'all'

  // Composition filters
  const compositionData = searchParams.get('composition')
  if (compositionData) {
    try {
      const parsed = JSON.parse(compositionData) as Array<{
        asset: string
        min?: number
        max?: number
      }>
      filters.compositionFilters = parsed.map((item) => ({
        assetSymbol: item.asset,
        minAllocation: item.min,
        maxAllocation: item.max,
      }))
    } catch (e) {
      console.error('Failed to parse composition filters:', e)
    }
  }

  // NAV filter
  const navType = searchParams.get('nav') as 'premium' | 'discount' | 'all' | null
  if (navType) {
    filters.navFilter = {
      type: navType,
      minPremium: searchParams.get('navMin')
        ? parseFloat(searchParams.get('navMin')!)
        : undefined,
      maxPremium: searchParams.get('navMax')
        ? parseFloat(searchParams.get('navMax')!)
        : undefined,
    }
  }

  // Performance filter
  const perf24hMin = searchParams.get('perf24hMin')
  const perf24hMax = searchParams.get('perf24hMax')
  const perf7dMin = searchParams.get('perf7dMin')
  const perf7dMax = searchParams.get('perf7dMax')
  if (perf24hMin || perf24hMax || perf7dMin || perf7dMax) {
    filters.performanceFilter = {
      min24hChange: perf24hMin ? parseFloat(perf24hMin) : undefined,
      max24hChange: perf24hMax ? parseFloat(perf24hMax) : undefined,
      min7dChange: perf7dMin ? parseFloat(perf7dMin) : undefined,
      max7dChange: perf7dMax ? parseFloat(perf7dMax) : undefined,
    }
  }

  // Rebalancing filter
  const rebalanceFreq = searchParams.get('rebalance') as
    | 'daily'
    | 'weekly'
    | 'bi-weekly'
    | 'monthly'
    | null
  if (rebalanceFreq) {
    filters.rebalancingFilter = {
      frequency: rebalanceFreq,
      nextRebalanceWithin: searchParams.get('rebalanceWithin')
        ? parseInt(searchParams.get('rebalanceWithin')!)
        : undefined,
    }
  }

  // Battle filter
  const battleStatus = searchParams.get('battleStatus') as 'active' | 'upcoming' | 'ended' | null
  const hasActiveBattle = searchParams.get('hasActiveBattle')
  if (battleStatus || hasActiveBattle) {
    filters.battleFilter = {
      status: battleStatus || undefined,
      hasActiveBattle: hasActiveBattle ? hasActiveBattle === 'true' : undefined,
    }
  }

  // Graduation filter
  const gradStage = searchParams.get('gradStage') as
    | 'bonding-curve'
    | 'funding-round'
    | 'lp-round'
    | 'graduated'
    | null
  const gradMin = searchParams.get('gradMin')
  const gradMax = searchParams.get('gradMax')
  if (gradStage || gradMin || gradMax) {
    filters.graduationFilter = {
      stage: gradStage || undefined,
      minProgress: gradMin ? parseFloat(gradMin) : undefined,
      maxProgress: gradMax ? parseFloat(gradMax) : undefined,
    }
  }

  // Volume filter
  const volMin = searchParams.get('volMin')
  if (volMin) {
    filters.minVolume24h = parseFloat(volMin)
  }

  // Liquidity filter
  const liqMin = searchParams.get('liqMin')
  if (liqMin) {
    filters.minLiquidity = parseFloat(liqMin)
  }

  // Age filter
  const ageMin = searchParams.get('ageMin')
  const ageMax = searchParams.get('ageMax')
  if (ageMin) {
    filters.minAge = parseInt(ageMin)
  }
  if (ageMax) {
    filters.maxAge = parseInt(ageMax)
  }

  // Sort option
  const sortField = searchParams.get('sort') || 'volume-24h'
  const sortDir = searchParams.get('sortDir') || 'desc'
  const sortOption: SortOption = {
    field: sortField as SortOption['field'],
    direction: sortDir as 'asc' | 'desc',
    label: getSortLabel(sortField as SortOption['field'], sortDir as 'asc' | 'desc'),
  }

  return {
    filters,
    sortOption,
    selectedLayer,
  }
}

// Helper function to generate sort labels
function getSortLabel(field: SortOption['field'], direction: 'asc' | 'desc'): string {
  const fieldLabels: Record<SortOption['field'], string> = {
    'volume-24h': '24h Volume',
    liquidity: 'Liquidity',
    'nav-premium': 'NAV Premium',
    'performance-24h': '24h Performance',
    'performance-7d': '7d Performance',
    'asset-count': 'Asset Count',
    age: 'Age',
    'hot-score': 'Hot Score',
    'graduation-progress': 'Graduation Progress',
  }

  const dirLabel = direction === 'asc' ? 'Low to High' : 'High to Low'
  return `${fieldLabels[field]} (${dirLabel})`
}

// Update URL without page reload
export function updateURL(params: URLSearchParams) {
  const newURL = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newURL)
}

// Get shareable URL
export function getShareableURL(params: URLSearchParams): string {
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
