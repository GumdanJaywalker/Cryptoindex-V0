/**
 * Discover Page Type Definitions
 *
 * Types for index discovery, filtering, sorting, and comparison features
 */

// ============================================================================
// Layer & Index Types
// ============================================================================

export type IndexLayer = 'layer-1' | 'layer-2' | 'layer-3'

export interface LayerInfo {
  layer: IndexLayer
  label: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  tradingType: 'hooats' | 'standard' | 'launchpad'
  rebalancingFrequency: 'monthly' | 'bi-weekly' | 'dynamic'
}

// ============================================================================
// Filter Types
// ============================================================================

export interface CompositionFilter {
  assetSymbol: string
  minAllocation?: number
  maxAllocation?: number
}

export interface NAVFilter {
  minPremiumDiscount: number // -100 to 100 (negative = discount, positive = premium)
  maxPremiumDiscount: number
}

export interface PerformanceFilter {
  timeframe: '24h' | '7d' | '30d' | '90d' | '1y' | 'all'
  minReturn?: number
  maxReturn?: number
}

export interface RebalancingFilter {
  nextRebalancing: 'within-24h' | 'within-week' | 'within-month' | 'any'
}

export interface BattleFilter {
  status: 'active' | 'upcoming' | 'completed' | 'all'
  hasActiveBattle?: boolean
}

export interface GraduationFilter {
  stage: 'bonding-curve' | 'funding-round' | 'lp-round' | 'graduated' | 'all'
  minProgress?: number // 0-100
  maxProgress?: number
}

export interface FilterOptions {
  // Layer selection
  layers: IndexLayer[]

  // Search
  searchQuery: string

  // Composition filters
  compositionFilters: CompositionFilter[]

  // NAV premium/discount
  navFilter: NAVFilter | null

  // Performance filters
  performanceFilter: PerformanceFilter | null

  // Rebalancing schedule
  rebalancingFilter: RebalancingFilter | null

  // Battle status (Layer 2)
  battleFilter: BattleFilter | null

  // Graduation progress (Layer 3)
  graduationFilter: GraduationFilter | null

  // Volume & Liquidity
  minVolume24h?: number
  minLiquidity?: number

  // Age
  minAge?: number // days
  maxAge?: number
}

// ============================================================================
// Sort Types
// ============================================================================

export type SortField =
  | 'name'
  | 'price'
  | 'volume-24h'
  | 'nav'
  | 'nav-premium'
  | 'performance-24h'
  | 'performance-7d'
  | 'performance-30d'
  | 'liquidity'
  | 'age'
  | 'rebalancing-next'
  | 'graduation-progress'

export type SortDirection = 'asc' | 'desc'

export interface SortOption {
  field: SortField
  direction: SortDirection
  label: string
}

// ============================================================================
// View Types
// ============================================================================

export type ViewMode = 'grid' | 'list' | 'compact'

export interface ViewOptions {
  mode: ViewMode
  itemsPerPage: number
  showBattles: boolean
  showGraduation: boolean
  highlightImportant: boolean
}

// ============================================================================
// State Types
// ============================================================================

export interface DiscoverState {
  // Current layer
  selectedLayer: IndexLayer | 'all'

  // Filters
  filters: FilterOptions

  // Sort
  sortOption: SortOption

  // View
  viewOptions: ViewOptions

  // Comparison
  comparisonList: string[] // Index symbols

  // UI State
  isFilterPanelOpen: boolean
  isComparisonOpen: boolean

  // Pagination
  currentPage: number
  totalPages: number
}

// ============================================================================
// Comparison Types
// ============================================================================

export interface ComparisonItem {
  symbol: string
  name: string
  layer: IndexLayer
  price: number
  nav: number
  navPremium: number
  composition: {
    symbol: string
    allocation: number
  }[]
  fees: {
    creation: number
    redemption: number
    management: number
  }
  performance: {
    '24h': number
    '7d': number
    '30d': number
    '90d': number
    '1y': number
  }
  rebalancing: {
    frequency: string
    nextDate: string
    method: string
  }
  volume24h: number
  liquidity: number
  ageInDays: number
}

export interface ComparisonMetrics {
  items: ComparisonItem[]
  highlightBest: boolean
  highlightWorst: boolean
}

// ============================================================================
// Battle Types (Layer 2)
// ============================================================================

export interface BattleVote {
  assetA: string
  assetB: string
  votesA: number
  votesB: number
  totalVotingPower: number
  proposedChange: string // e.g., "+15% A, -15% B"
  endsAt: string
  status: 'active' | 'upcoming' | 'completed'
}

export interface IndexBattle {
  indexSymbol: string
  indexName: string
  battle: BattleVote
  emoji: string
}

// ============================================================================
// Graduation Types (Layer 3)
// ============================================================================

export type GraduationStage =
  | 'bonding-curve'
  | 'funding-round'
  | 'lp-round'
  | 'graduated'

export interface GraduationProgress {
  stage: GraduationStage
  currentAmount: number
  targetAmount: number
  progress: number // 0-100
  isCircuitBreakerActive: boolean
  estimatedGraduationDate?: string
}

export interface Layer3Index {
  symbol: string
  name: string
  graduationProgress: GraduationProgress
  bondingCurvePrice: number
  nextMilestone: {
    stage: string
    remainingAmount: number
  }
}

// ============================================================================
// URL State Types (for sharing)
// ============================================================================

export interface URLState {
  layer?: IndexLayer | 'all'
  search?: string
  sort?: string // "field:direction" format
  filters?: string // JSON stringified FilterOptions
  compare?: string // comma-separated symbols
  page?: number
}

// ============================================================================
// Helper Types
// ============================================================================

export interface FilterPreset {
  id: string
  name: string
  description: string
  filters: Partial<FilterOptions>
}

export const DEFAULT_FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'hot-battles',
    name: 'Hot Battles',
    description: 'Layer 2 indices with active VS battles',
    filters: {
      layers: ['layer-2'],
      battleFilter: {
        status: 'active',
        hasActiveBattle: true,
      },
    },
  },
  {
    id: 'graduating-soon',
    name: 'Graduating Soon',
    description: 'Layer 3 indices close to graduation',
    filters: {
      layers: ['layer-3'],
      graduationFilter: {
        stage: 'lp-round',
        minProgress: 80,
        maxProgress: 100,
      },
    },
  },
  {
    id: 'undervalued',
    name: 'Undervalued',
    description: 'Trading at discount to NAV',
    filters: {
      navFilter: {
        minPremiumDiscount: -20,
        maxPremiumDiscount: -1,
      },
    },
  },
  {
    id: 'high-performance',
    name: 'High Performance',
    description: '30d return > 50%',
    filters: {
      performanceFilter: {
        timeframe: '30d',
        minReturn: 50,
      },
    },
  },
]

// ============================================================================
// Initial State
// ============================================================================

export const DEFAULT_DISCOVER_STATE: DiscoverState = {
  selectedLayer: 'all',
  filters: {
    layers: ['layer-1', 'layer-2', 'layer-3'],
    searchQuery: '',
    compositionFilters: [],
    navFilter: null,
    performanceFilter: null,
    rebalancingFilter: null,
    battleFilter: null,
    graduationFilter: null,
  },
  sortOption: {
    field: 'volume-24h',
    direction: 'desc',
    label: '24h Volume (High to Low)',
  },
  viewOptions: {
    mode: 'grid',
    itemsPerPage: 12,
    showBattles: true,
    showGraduation: true,
    highlightImportant: true,
  },
  comparisonList: [],
  isFilterPanelOpen: false,
  isComparisonOpen: false,
  currentPage: 1,
  totalPages: 1,
}
