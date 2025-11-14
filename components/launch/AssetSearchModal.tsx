'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Asset, PositionSide } from '@/lib/types/launch'

interface AssetData extends Asset {
  markPx?: number
  prevDayPx?: number
  change24hPct?: number
  dayNtlVlm?: number
}

type SortColumn = 'symbol' | 'name' | 'price' | 'change24h' | 'volume24h'
type SortDirection = 'asc' | 'desc'

interface AssetSearchModalProps {
  open: boolean
  onClose: () => void
  onSelectAsset: (asset: Asset, side: PositionSide) => void
  onSelectAssets: (assets: Asset[], side: PositionSide) => void
  selectedSymbols: string[]
}

type FilterTab = 'all' | 'high-volume' | 'top-gainers' | 'top-losers'

export function AssetSearchModal({
  open,
  onClose,
  onSelectAsset,
  onSelectAssets,
  selectedSymbols,
}: AssetSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [sortColumn, setSortColumn] = useState<SortColumn>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [assets, setAssets] = useState<AssetData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<Map<string, AssetData>>(new Map())

  // Fetch assets from API
  useEffect(() => {
    if (!open) return

    const fetchAssets = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/launch/assets')
        if (!response.ok) throw new Error('Failed to fetch assets')

        const data: AssetData[] = await response.json()
        setAssets(data)
      } catch (err) {
        console.error('Error fetching assets:', err)
        setError('Failed to load assets')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [open])

  // Filter and sort assets
  const filteredAssets = assets
    .filter((asset) => {
      // Only show spot assets (Phase 0)
      if (asset.marketType !== 'spot') {
        return false
      }

      // Don't show already selected assets
      if (selectedSymbols.includes(asset.symbol)) {
        return false
      }

      // Don't show pending assets
      if (pendingAssets.has(asset.symbol)) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !asset.symbol.toLowerCase().includes(query) &&
          !asset.name.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Search query priority: startsWith > includes
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const aSymbolStarts = a.symbol.toLowerCase().startsWith(query)
        const bSymbolStarts = b.symbol.toLowerCase().startsWith(query)
        const aNameStarts = a.name.toLowerCase().startsWith(query)
        const bNameStarts = b.name.toLowerCase().startsWith(query)

        // Both start with query or both don't - continue to other sorting
        const aStarts = aSymbolStarts || aNameStarts
        const bStarts = bSymbolStarts || bNameStarts

        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
      }

      // Apply filter tab sorting
      if (activeTab === 'high-volume') {
        return (b.dayNtlVlm || 0) - (a.dayNtlVlm || 0)
      } else if (activeTab === 'top-gainers') {
        return (b.change24hPct || 0) - (a.change24hPct || 0)
      } else if (activeTab === 'top-losers') {
        return (a.change24hPct || 0) - (b.change24hPct || 0)
      }

      // Then apply column sorting
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortColumn) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol) * direction
        case 'name':
          return a.name.localeCompare(b.name) * direction
        case 'price':
          return ((a.markPx || 0) - (b.markPx || 0)) * direction
        case 'change24h':
          return ((a.change24hPct || 0) - (b.change24hPct || 0)) * direction
        case 'volume24h':
          return ((a.dayNtlVlm || 0) - (b.dayNtlVlm || 0)) * direction
        default:
          return 0
      }
    })

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleAddToPending = (asset: AssetData) => {
    setPendingAssets(prev => {
      const newMap = new Map(prev)
      newMap.set(asset.symbol, asset)
      return newMap
    })
  }

  const handleRemoveFromPending = (symbol: string) => {
    setPendingAssets(prev => {
      const newMap = new Map(prev)
      newMap.delete(symbol)
      return newMap
    })
  }

  const handleDone = () => {
    // Convert pending assets to simple Asset array
    const assetsToAdd: Asset[] = Array.from(pendingAssets.values()).map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      marketType: asset.marketType,
    }))

    // Add all assets at once
    onSelectAssets(assetsToAdd, 'long')

    // Clear pending and close
    setPendingAssets(new Map())
    onClose()
    setSearchQuery('')
  }

  const handleCancel = () => {
    // Clear pending without adding and close
    setPendingAssets(new Map())
    onClose()
    setSearchQuery('')
  }

  const formatNumber = (num: number | undefined): string => {
    if (!num) return '-'
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatPrice = (price: number | undefined): string => {
    if (!price) return '-'
    return `$${price.toFixed(4)}`
  }

  const formatPercent = (pct: number | undefined): string => {
    if (pct === undefined) return '-'
    const sign = pct >= 0 ? '+' : ''
    return `${sign}${pct.toFixed(2)}%`
  }

  const getTabLabel = (tab: FilterTab): string => {
    switch (tab) {
      case 'all': return 'All'
      case 'high-volume': return 'High Volume'
      case 'top-gainers': return 'Top Gainers'
      case 'top-losers': return 'Top Losers'
    }
  }

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[900px] glass-card border-teal text-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Browse Assets</DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-1">
            Search and add Hyperliquid spot assets to your index
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">

          <div className="flex-1 flex flex-col space-y-4 py-4 px-4 overflow-hidden">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-teal-elevated border-teal text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {(['all', 'high-volume', 'top-gainers', 'top-losers'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-colors",
                  activeTab === tab
                    ? "bg-brand/20 text-brand border border-white/10"
                    : "text-slate-400 hover:text-white hover:bg-teal-card/50 border border-transparent"
                )}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 text-slate-400">Loading assets...</div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-red-400">{error}</div>
          )}

          {/* Assets Table */}
          {!loading && !error && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-teal-card/50 border-b border-teal text-xs font-medium text-slate-400">
                <button
                  onClick={() => handleSort('symbol')}
                  className="col-span-2 text-left hover:text-white transition-colors cursor-pointer"
                >
                  Symbol <SortIcon column="symbol" />
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className="col-span-2 text-left hover:text-white transition-colors cursor-pointer"
                >
                  Name <SortIcon column="name" />
                </button>
                <button
                  onClick={() => handleSort('price')}
                  className="col-span-2 text-right hover:text-white transition-colors cursor-pointer"
                >
                  Price <SortIcon column="price" />
                </button>
                <button
                  onClick={() => handleSort('change24h')}
                  className="col-span-2 text-right hover:text-white transition-colors cursor-pointer"
                >
                  24h % <SortIcon column="change24h" />
                </button>
                <button
                  onClick={() => handleSort('volume24h')}
                  className="col-span-2 text-right hover:text-white transition-colors cursor-pointer"
                >
                  Volume <SortIcon column="volume24h" />
                </button>
                <div className="col-span-1 text-center">Side</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="grid grid-cols-12 gap-2 px-3 py-2.5 text-sm hover:bg-teal-elevated/50 border-b border-teal/50"
                  >
                    {/* Symbol */}
                    <div className="col-span-2 text-white font-medium">
                      {asset.symbol}
                    </div>

                    {/* Name */}
                    <div className="col-span-2 text-slate-400 truncate">
                      {asset.name}
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-right text-white font-mono">
                      {formatPrice(asset.markPx)}
                    </div>

                    {/* 24h Change % */}
                    <div
                      className={cn(
                        'col-span-2 text-right font-medium',
                        (asset.change24hPct || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {formatPercent(asset.change24hPct)}
                    </div>

                    {/* Volume */}
                    <div className="col-span-2 text-right text-slate-300">
                      {formatNumber(asset.dayNtlVlm)}
                    </div>

                    {/* Side - placeholder (hyphen for spot assets) */}
                    <div className="col-span-1 text-center text-slate-400">
                      -
                    </div>

                    {/* Action - Add Button */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleAddToPending(asset)}
                        className="px-3 py-1 bg-brand/20 text-brand hover:bg-brand/30 rounded text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}

                {filteredAssets.length === 0 && !loading && !error && (
                  <div className="text-center py-8 text-slate-500">
                    No assets found matching your criteria
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Assets Section */}
          {pendingAssets.size > 0 && (
            <div className="border-t border-teal pt-3 mt-3">
              <div className="text-xs font-medium text-slate-400 mb-2 px-3">Selected Assets:</div>
              <div className="flex flex-wrap gap-2 px-3 mb-3">
                {Array.from(pendingAssets.values()).map((asset) => (
                  <div
                    key={asset.symbol}
                    className="px-2 py-1 bg-brand/20 text-brand rounded text-xs font-medium border border-white/10 flex items-center gap-2"
                  >
                    <span>{asset.symbol}</span>
                    <button
                      onClick={() => handleRemoveFromPending(asset.symbol)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Done / Cancel Buttons */}
              <div className="flex justify-end gap-2 px-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-teal-card/70 hover:bg-teal-card/60 text-white font-medium rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDone}
                  className="px-6 py-2 bg-brand hover:bg-brand text-slate-900 font-medium rounded transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-brand/50"
                >
                  Done ({pendingAssets.size})
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
