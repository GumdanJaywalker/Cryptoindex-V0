'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Asset, PositionSide } from '@/lib/types/launch'

interface AssetData extends Asset {
  markPx?: number
  prevDayPx?: number
  change24hPct?: number
  dayNtlVlm?: number
}

type FilterTab = 'all' | 'high-volume' | 'top-gainers' | 'top-losers'
type SortColumn = 'symbol' | 'name' | 'price' | 'change24h' | 'volume24h'
type SortDirection = 'asc' | 'desc'

interface AssetSearchDropdownProps {
  open: boolean
  onClose: () => void
  onSelectAsset: (asset: Asset, side: PositionSide) => void
  selectedSymbols: string[]
  anchorEl: HTMLElement | null
}

export function AssetSearchDropdown({
  open,
  onClose,
  onSelectAsset,
  selectedSymbols,
  anchorEl,
}: AssetSearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [sortColumn, setSortColumn] = useState<SortColumn>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [assets, setAssets] = useState<AssetData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  // Calculate dropdown position based on anchor element
  useEffect(() => {
    if (open && anchorEl) {
      const updatePosition = () => {
        const rect = anchorEl.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 4, // 4px gap below button, account for scroll
          left: rect.left + window.scrollX,
        })
      }

      updatePosition()

      // Update position on scroll or resize
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [open, anchorEl])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (anchorEl && !anchorEl.contains(event.target as Node)) {
          onClose()
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, anchorEl])

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
      // Apply filter tab sorting first
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

  const handleSelectAsset = (asset: AssetData, side: PositionSide) => {
    const simpleAsset: Asset = {
      symbol: asset.symbol,
      name: asset.name,
      marketType: asset.marketType,
    }
    onSelectAsset(simpleAsset, side)
    // Don't close dropdown - allow multiple selections
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

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 animate-fadeIn"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed z-50 w-[800px] bg-teal-base border border-teal rounded-lg shadow-2xl animate-fadeIn animate-slideInFromTop"
        style={{ top: position.top, left: position.left }}
      >
        {/* Selected Assets Counter */}
        {selectedSymbols.length > 0 && (
          <div className="px-4 py-2 bg-brand/10 border-b border-brand/30 text-sm text-brand rounded-t-lg">
            {selectedSymbols.length} asset{selectedSymbols.length > 1 ? 's' : ''} selected
          </div>
        )}

        {/* Search Input */}
        <div className="p-3 border-b border-teal">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-teal-elevated border-teal text-white h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-teal"
              autoFocus
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
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-teal bg-teal-card/50">
          {(['all', 'high-volume', 'top-gainers', 'top-losers'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors",
                activeTab === tab
                  ? "bg-brand/20 text-brand border border-brand/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
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
          <div className="flex flex-col">
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
            <div className="max-h-[400px] overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="grid grid-cols-12 gap-2 px-3 py-2.5 text-sm hover:bg-teal-elevated/50 border-b border-teal/50 last:border-b-0"
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
                      onClick={() => handleSelectAsset(asset, 'long')}
                      className="px-3 py-1 bg-brand/20 text-brand hover:bg-brand/30 rounded text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {filteredAssets.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No assets found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Assets List */}
        {selectedSymbols.length > 0 && (
          <div className="border-t border-teal pt-3 pb-3 bg-teal-card/30 rounded-b-lg">
            <div className="text-xs font-medium text-slate-400 mb-2 px-3">Selected Assets:</div>
            <div className="flex flex-wrap gap-2 px-3">
              {selectedSymbols.map((symbol) => (
                <div
                  key={symbol}
                  className="px-2 py-1 bg-brand/20 text-brand rounded text-xs font-medium border border-brand/30"
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
