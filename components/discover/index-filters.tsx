'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Zap,
  Rocket,
  Flame,
} from 'lucide-react'
import type { FilterOptions, DEFAULT_FILTER_PRESETS } from '@/lib/types/discover'

interface IndexFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onClose?: () => void
}

export function IndexFilters({ filters, onFilterChange, onClose }: IndexFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
    onClose?.()
  }

  const handleResetFilters = () => {
    const defaultFilters: FilterOptions = {
      layers: ['layer-1', 'layer-2', 'layer-3'],
      searchQuery: '',
      compositionFilters: [],
      navFilter: null,
      performanceFilter: null,
      rebalancingFilter: null,
      battleFilter: null,
      graduationFilter: null,
    }
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const addCompositionFilter = () => {
    setLocalFilters({
      ...localFilters,
      compositionFilters: [
        ...localFilters.compositionFilters,
        { assetSymbol: '', minAllocation: undefined, maxAllocation: undefined },
      ],
    })
  }

  const removeCompositionFilter = (index: number) => {
    setLocalFilters({
      ...localFilters,
      compositionFilters: localFilters.compositionFilters.filter((_, i) => i !== index),
    })
  }

  const updateCompositionFilter = (
    index: number,
    field: 'assetSymbol' | 'minAllocation' | 'maxAllocation',
    value: string | number | undefined
  ) => {
    const updated = [...localFilters.compositionFilters]
    updated[index] = { ...updated[index], [field]: value }
    setLocalFilters({ ...localFilters, compositionFilters: updated })
  }

  return (
    <Card className="bg-slate-900 border-slate-800 max-w-4xl mx-auto">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Filter className="w-5 h-5 text-brand" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Advanced Filters</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Refine your index discovery with powerful filters
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Quick Presets */}
        <div>
          <Label className="text-sm text-slate-300 mb-3 block">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-purple-500/20 hover:border-purple-400/50 transition-colors"
              onClick={() => {
                setLocalFilters({
                  ...localFilters,
                  layers: ['layer-2'],
                  battleFilter: { status: 'active', hasActiveBattle: true },
                })
              }}
            >
              <Flame className="w-3 h-3 mr-1" />
              Hot Battles
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-brand/20 hover:border-brand/50 transition-colors"
              onClick={() => {
                setLocalFilters({
                  ...localFilters,
                  layers: ['layer-3'],
                  graduationFilter: { stage: 'lp-round', minProgress: 80, maxProgress: 100 },
                })
              }}
            >
              <Rocket className="w-3 h-3 mr-1" />
              Graduating Soon
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-green-500/20 hover:border-green-400/50 transition-colors"
              onClick={() => {
                setLocalFilters({
                  ...localFilters,
                  performanceFilter: { timeframe: '30d', minReturn: 50 },
                })
              }}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              High Performance
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors"
              onClick={() => {
                setLocalFilters({
                  ...localFilters,
                  navFilter: { minPremiumDiscount: -20, maxPremiumDiscount: -1 },
                })
              }}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Undervalued
            </Badge>
          </div>
        </div>

        {/* Composition Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Composition Assets</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addCompositionFilter}
              className="h-7 text-xs border-slate-700 hover:border-brand hover:bg-brand/10"
            >
              + Add Asset
            </Button>
          </div>

          {localFilters.compositionFilters.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">
              No composition filters. Click &quot;Add Asset&quot; to filter by specific assets.
            </p>
          )}

          {localFilters.compositionFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <Input
                placeholder="Asset Symbol (e.g., DOGE)"
                value={filter.assetSymbol}
                onChange={(e) =>
                  updateCompositionFilter(index, 'assetSymbol', e.target.value.toUpperCase())
                }
                className="flex-1 bg-slate-900 border-slate-700 text-white"
              />
              <Input
                type="number"
                placeholder="Min %"
                value={filter.minAllocation ?? ''}
                onChange={(e) =>
                  updateCompositionFilter(
                    index,
                    'minAllocation',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-24 bg-slate-900 border-slate-700 text-white"
              />
              <Input
                type="number"
                placeholder="Max %"
                value={filter.maxAllocation ?? ''}
                onChange={(e) =>
                  updateCompositionFilter(
                    index,
                    'maxAllocation',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-24 bg-slate-900 border-slate-700 text-white"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCompositionFilter(index)}
                className="text-slate-400 hover:text-red-400 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Performance Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
              Timeframe
            </Label>
            <Select
              value={localFilters.performanceFilter?.timeframe ?? 'none'}
              onValueChange={(value) => {
                if (value === 'none') {
                  setLocalFilters({ ...localFilters, performanceFilter: null })
                } else {
                  setLocalFilters({
                    ...localFilters,
                    performanceFilter: {
                      timeframe: value as any,
                      minReturn: localFilters.performanceFilter?.minReturn,
                      maxReturn: localFilters.performanceFilter?.maxReturn,
                    },
                  })
                }
              }}
            >
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Filter</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-300">Min Return %</Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={localFilters.performanceFilter?.minReturn ?? ''}
              onChange={(e) => {
                if (!localFilters.performanceFilter) return
                setLocalFilters({
                  ...localFilters,
                  performanceFilter: {
                    ...localFilters.performanceFilter,
                    minReturn: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }}
              className="bg-slate-900 border-slate-700 text-white"
              disabled={!localFilters.performanceFilter}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-300">Max Return %</Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={localFilters.performanceFilter?.maxReturn ?? ''}
              onChange={(e) => {
                if (!localFilters.performanceFilter) return
                setLocalFilters({
                  ...localFilters,
                  performanceFilter: {
                    ...localFilters.performanceFilter,
                    maxReturn: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }}
              className="bg-slate-900 border-slate-700 text-white"
              disabled={!localFilters.performanceFilter}
            />
          </div>
        </div>

        {/* NAV Filter */}
        <div className="space-y-3">
          <Label className="text-sm text-slate-300">
            <DollarSign className="w-3.5 h-3.5 inline mr-1.5" />
            NAV Premium/Discount Range
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Min %</Label>
              <Input
                type="number"
                placeholder="e.g., -20"
                value={localFilters.navFilter?.minPremiumDiscount ?? ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : -100
                  setLocalFilters({
                    ...localFilters,
                    navFilter: {
                      minPremiumDiscount: value,
                      maxPremiumDiscount: localFilters.navFilter?.maxPremiumDiscount ?? 100,
                    },
                  })
                }}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Max %</Label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={localFilters.navFilter?.maxPremiumDiscount ?? ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : 100
                  setLocalFilters({
                    ...localFilters,
                    navFilter: {
                      minPremiumDiscount: localFilters.navFilter?.minPremiumDiscount ?? -100,
                      maxPremiumDiscount: value,
                    },
                  })
                }}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Rebalancing Filter */}
        <div className="space-y-2">
          <Label className="text-sm text-slate-300">
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />
            Next Rebalancing
          </Label>
          <Select
            value={localFilters.rebalancingFilter?.nextRebalancing ?? 'any'}
            onValueChange={(value) => {
              if (value === 'any') {
                setLocalFilters({ ...localFilters, rebalancingFilter: null })
              } else {
                setLocalFilters({
                  ...localFilters,
                  rebalancingFilter: { nextRebalancing: value as any },
                })
              }
            }}
          >
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Select rebalancing window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Time</SelectItem>
              <SelectItem value="within-24h">Within 24 Hours</SelectItem>
              <SelectItem value="within-week">Within 1 Week</SelectItem>
              <SelectItem value="within-month">Within 1 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volume & Liquidity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-slate-300">Min 24h Volume</Label>
            <Input
              type="number"
              placeholder="e.g., 1000000"
              value={localFilters.minVolume24h ?? ''}
              onChange={(e) => {
                setLocalFilters({
                  ...localFilters,
                  minVolume24h: e.target.value ? Number(e.target.value) : undefined,
                })
              }}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-slate-300">Min Liquidity (TVL)</Label>
            <Input
              type="number"
              placeholder="e.g., 5000000"
              value={localFilters.minLiquidity ?? ''}
              onChange={(e) => {
                setLocalFilters({
                  ...localFilters,
                  minLiquidity: e.target.value ? Number(e.target.value) : undefined,
                })
              }}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1 border-slate-700 hover:bg-slate-800"
          >
            Reset All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-brand hover:bg-brand/90 text-slate-950 font-medium"
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
