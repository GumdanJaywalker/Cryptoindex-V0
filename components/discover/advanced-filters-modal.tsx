'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, DollarSign, Activity, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Available coins for composition filtering
const POPULAR_COINS = [
  'DOGE', 'SHIB', 'PEPE', 'BONK', 'WIF', 'FLOKI',
  'SAMO', 'MYRO', 'WEN', 'POPCAT', 'MEW', 'BRETT'
]

export interface AdvancedFilters {
  // Composition filters
  compositionCoins: string[]
  compositionMatchMode: 'any' | 'all'

  // NAV (Net Asset Value) range
  navMin?: number
  navMax?: number

  // Performance ranges
  performance24hMin?: number
  performance24hMax?: number
  performance7dMin?: number
  performance7dMax?: number
  performance30dMin?: number
  performance30dMax?: number

  // Volume & Liquidity
  volumeMin?: number
  liquidityMin?: number
}

interface AdvancedFiltersModalProps {
  open: boolean
  onClose: () => void
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
}

export function AdvancedFiltersModal({
  open,
  onClose,
  filters,
  onFiltersChange
}: AdvancedFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters)
  const [performanceTab, setPerformanceTab] = useState<'24h' | '7d' | '30d'>('24h')

  // Sync with external filters when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters)
    }
  }, [open, filters])

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: AdvancedFilters = {
      compositionCoins: [],
      compositionMatchMode: 'any',
    }
    setLocalFilters(emptyFilters)
  }

  const toggleCompositionCoin = (coin: string) => {
    setLocalFilters(prev => ({
      ...prev,
      compositionCoins: prev.compositionCoins.includes(coin)
        ? prev.compositionCoins.filter(c => c !== coin)
        : [...prev.compositionCoins, coin]
    }))
  }

  const setPresetNAV = (min?: number, max?: number) => {
    setLocalFilters(prev => ({ ...prev, navMin: min, navMax: max }))
  }

  const setPresetPerformance = (min: number, max?: number) => {
    const updates: Partial<AdvancedFilters> = {}
    if (performanceTab === '24h') {
      updates.performance24hMin = min
      updates.performance24hMax = max
    } else if (performanceTab === '7d') {
      updates.performance7dMin = min
      updates.performance7dMax = max
    } else {
      updates.performance30dMin = min
      updates.performance30dMax = max
    }
    setLocalFilters(prev => ({ ...prev, ...updates }))
  }

  const setPresetVolume = (min: number) => {
    setLocalFilters(prev => ({ ...prev, volumeMin: min }))
  }

  const setPresetLiquidity = (min: number) => {
    setLocalFilters(prev => ({ ...prev, liquidityMin: min }))
  }

  const activeFilterCount = [
    localFilters.compositionCoins.length > 0,
    localFilters.navMin !== undefined || localFilters.navMax !== undefined,
    localFilters.performance24hMin !== undefined || localFilters.performance24hMax !== undefined ||
    localFilters.performance7dMin !== undefined || localFilters.performance7dMax !== undefined ||
    localFilters.performance30dMin !== undefined || localFilters.performance30dMax !== undefined,
    localFilters.volumeMin !== undefined || localFilters.liquidityMin !== undefined,
  ].filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">Advanced Filters</DialogTitle>
              <DialogDescription className="text-slate-400 text-sm mt-1">
                Fine-tune your index discovery with detailed criteria
              </DialogDescription>
            </div>
            {activeFilterCount > 0 && (
              <Badge className="bg-brand text-slate-950 px-2 py-1">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 1. Composition Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-white">Composition Filters</h3>
            </div>
            <p className="text-xs text-slate-400">
              Filter indices that contain specific coins
            </p>

            {/* Match Mode Toggle */}
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-xs text-slate-400">Match mode:</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={localFilters.compositionMatchMode === 'any' ? 'default' : 'ghost'}
                  className={cn(
                    "text-xs h-7 px-3",
                    localFilters.compositionMatchMode === 'any'
                      ? "bg-brand text-black"
                      : "text-slate-400 hover:text-white"
                  )}
                  onClick={() => setLocalFilters(prev => ({ ...prev, compositionMatchMode: 'any' }))}
                >
                  Match Any
                </Button>
                <Button
                  size="sm"
                  variant={localFilters.compositionMatchMode === 'all' ? 'default' : 'ghost'}
                  className={cn(
                    "text-xs h-7 px-3",
                    localFilters.compositionMatchMode === 'all'
                      ? "bg-brand text-black"
                      : "text-slate-400 hover:text-white"
                  )}
                  onClick={() => setLocalFilters(prev => ({ ...prev, compositionMatchMode: 'all' }))}
                >
                  Match All
                </Button>
              </div>
            </div>

            {/* Coin Selection */}
            <div className="grid grid-cols-4 gap-2">
              {POPULAR_COINS.map(coin => (
                <Button
                  key={coin}
                  size="sm"
                  variant={localFilters.compositionCoins.includes(coin) ? 'default' : 'outline'}
                  className={cn(
                    "text-xs h-8",
                    localFilters.compositionCoins.includes(coin)
                      ? "bg-brand text-black hover:bg-brand/90"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  )}
                  onClick={() => toggleCompositionCoin(coin)}
                >
                  {coin}
                </Button>
              ))}
            </div>
          </div>

          {/* 2. NAV Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-white">NAV Range</h3>
            </div>
            <p className="text-xs text-slate-400">
              Filter by Net Asset Value (total value of index assets)
            </p>

            {/* Preset Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                onClick={() => setPresetNAV(undefined, 1000000)}
              >
                &lt; $1M
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                onClick={() => setPresetNAV(1000000, 10000000)}
              >
                $1M - $10M
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                onClick={() => setPresetNAV(10000000, undefined)}
              >
                &gt; $10M
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                onClick={() => setPresetNAV(undefined, undefined)}
              >
                Clear
              </Button>
            </div>

            {/* Custom Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Min NAV ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 100000"
                  value={localFilters.navMin || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    navMin: e.target.value ? parseFloat(e.target.value) : undefined
                  }))}
                  className="bg-slate-800 border-slate-700 text-white text-sm h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Max NAV ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 10000000"
                  value={localFilters.navMax || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    navMax: e.target.value ? parseFloat(e.target.value) : undefined
                  }))}
                  className="bg-slate-800 border-slate-700 text-white text-sm h-9"
                />
              </div>
            </div>
          </div>

          {/* 3. Performance Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-white">Performance Range</h3>
            </div>
            <p className="text-xs text-slate-400">
              Filter by price change percentage over different timeframes
            </p>

            {/* Timeframe Tabs */}
            <Tabs value={performanceTab} onValueChange={(v) => setPerformanceTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="24h" className="text-xs data-[state=active]:bg-brand data-[state=active]:text-black">
                  24h
                </TabsTrigger>
                <TabsTrigger value="7d" className="text-xs data-[state=active]:bg-brand data-[state=active]:text-black">
                  7d
                </TabsTrigger>
                <TabsTrigger value="30d" className="text-xs data-[state=active]:bg-brand data-[state=active]:text-black">
                  30d
                </TabsTrigger>
              </TabsList>

              <TabsContent value={performanceTab} className="mt-3 space-y-3">
                {/* Preset Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                    onClick={() => setPresetPerformance(0, 10)}
                  >
                    0-10%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                    onClick={() => setPresetPerformance(10, 50)}
                  >
                    10-50%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                    onClick={() => setPresetPerformance(50)}
                  >
                    &gt; 50%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                    onClick={() => setPresetPerformance(-50, 0)}
                  >
                    -50% to 0%
                  </Button>
                </div>

                {/* Custom Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Min Change (%)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., -10"
                      value={
                        performanceTab === '24h' ? localFilters.performance24hMin || '' :
                        performanceTab === '7d' ? localFilters.performance7dMin || '' :
                        localFilters.performance30dMin || ''
                      }
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined
                        setLocalFilters(prev => ({
                          ...prev,
                          ...(performanceTab === '24h' ? { performance24hMin: val } :
                             performanceTab === '7d' ? { performance7dMin: val } :
                             { performance30dMin: val })
                        }))
                      }}
                      className="bg-slate-800 border-slate-700 text-white text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Max Change (%)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      value={
                        performanceTab === '24h' ? localFilters.performance24hMax || '' :
                        performanceTab === '7d' ? localFilters.performance7dMax || '' :
                        localFilters.performance30dMax || ''
                      }
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined
                        setLocalFilters(prev => ({
                          ...prev,
                          ...(performanceTab === '24h' ? { performance24hMax: val } :
                             performanceTab === '7d' ? { performance7dMax: val } :
                             { performance30dMax: val })
                        }))
                      }}
                      className="bg-slate-800 border-slate-700 text-white text-sm h-9"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* 4. Volume & Liquidity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-white">Volume & Liquidity</h3>
            </div>
            <p className="text-xs text-slate-400">
              Set minimum thresholds for trading activity
            </p>

            {/* Volume Presets */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Min 24h Volume</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetVolume(100000)}
                >
                  &gt; $100K
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetVolume(1000000)}
                >
                  &gt; $1M
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetVolume(10000000)}
                >
                  &gt; $10M
                </Button>
              </div>
              <Input
                type="number"
                placeholder="Custom volume threshold ($)"
                value={localFilters.volumeMin || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  volumeMin: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                className="bg-slate-800 border-slate-700 text-white text-sm h-9"
              />
            </div>

            {/* Liquidity Presets */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Min Liquidity (TVL)</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetLiquidity(100000)}
                >
                  &gt; $100K
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetLiquidity(1000000)}
                >
                  &gt; $1M
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-slate-700 hover:bg-slate-800"
                  onClick={() => setPresetLiquidity(10000000)}
                >
                  &gt; $10M
                </Button>
              </div>
              <Input
                type="number"
                placeholder="Custom liquidity threshold ($)"
                value={localFilters.liquidityMin || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  liquidityMin: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                className="bg-slate-800 border-slate-700 text-white text-sm h-9"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Reset All
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-brand text-black hover:bg-brand/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
