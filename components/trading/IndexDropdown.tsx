'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Star, ChevronUp, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getAllTradingIndexes } from '@/lib/data/launched-indexes'
import { IndexLogo } from '@/components/trading/IndexLogo'

interface IndexDropdownProps {
  open: boolean
  onClose: () => void
  onSelectIndex: (symbol: string) => void
  currentSymbol?: string
  favorites: Set<string>
  onToggleFavorite: (symbol: string) => void
  anchorEl: HTMLElement | null
}

type FilterTab = 'all' | 'L1' | 'L2' | 'L3' | 'favorites' | 'vs-battles' | 'user-launched' | 'new'
type SortColumn = 'symbol' | 'name' | 'price' | 'change24h' | 'volume24h'
type SortDirection = 'asc' | 'desc'

export function IndexDropdown({
  open,
  onClose,
  onSelectIndex,
  currentSymbol,
  favorites,
  onToggleFavorite,
  anchorEl,
}: IndexDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [sortColumn, setSortColumn] = useState<SortColumn>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  // Get all indexes
  const allIndexes = getAllTradingIndexes()

  // Calculate dropdown position based on anchor element
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4, // 4px gap below button
        left: rect.left,
      })
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

  // Filter indexes based on active tab and search
  const filteredIndexes = allIndexes
    .filter((idx) => {
      // Tab filter
      if (activeTab === 'favorites') {
        if (!favorites.has(idx.symbol)) return false
      } else if (activeTab === 'vs-battles') {
        // TODO: Filter for VS Battles indexes (placeholder)
        return true
      } else if (activeTab === 'user-launched') {
        // Filter for user-created indexes
        if (!(idx as any).isLaunched) return false
      } else if (activeTab === 'new') {
        // TODO: Filter for new indexes (placeholder)
        return true
      } else if (activeTab !== 'all') {
        // Layer filter (L1, L2, L3)
        if (idx.layer !== activeTab) return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          idx.symbol.toLowerCase().includes(query) ||
          idx.name.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortColumn) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol) * direction
        case 'name':
          return a.name.localeCompare(b.name) * direction
        case 'price':
          return ((a.currentPrice || 0) - (b.currentPrice || 0)) * direction
        case 'change24h':
          return ((a.change24h || 0) - (b.change24h || 0)) * direction
        case 'volume24h':
          return ((a.volume24h || 0) - (b.volume24h || 0)) * direction
        default:
          return 0
      }
    })

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectIndex = (symbol: string) => {
    onSelectIndex(symbol)
    onClose()
    setSearchQuery('')
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
        className="fixed z-50 w-[600px] bg-teal-base border border-teal rounded-lg shadow-2xl animate-fadeIn animate-slideInFromTop"
        style={{ top: position.top, left: position.left }}
      >
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
          {(['all', 'L1', 'L2', 'L3', 'favorites', 'vs-battles', 'user-launched', 'new'] as FilterTab[]).map((tab) => {
            const getTabLabel = (t: FilterTab) => {
              switch (t) {
                case 'all': return 'All'
                case 'favorites': return 'Favorites'
                case 'vs-battles': return 'VS Battles'
                case 'user-launched': return 'User Launched'
                case 'new': return 'New'
                default: return `Layer ${t.slice(1)}`
              }
            }

            return (
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
            )
          })}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-teal-card/50 border-b border-teal text-xs font-medium text-slate-400">
          <div className="col-span-1"></div> {/* Star icon */}
          <button
            onClick={() => handleSort('symbol')}
            className="col-span-4 text-left hover:text-white transition-colors cursor-pointer"
          >
            Index <SortIcon column="symbol" />
          </button>
          <div className="col-span-1 text-left">
            Layer
          </div>
          <button
            onClick={() => handleSort('price')}
            className="col-span-2 text-right hover:text-white transition-colors cursor-pointer"
          >
            Price (HYPE) <SortIcon column="price" />
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
        </div>

        {/* Table Body */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredIndexes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No indexes found
            </div>
          ) : (
            filteredIndexes.map((index) => (
              <div
                key={index.symbol}
                className={cn(
                  "grid grid-cols-12 gap-2 px-3 py-2.5 text-sm transition-colors cursor-pointer border-b border-teal/50 last:border-b-0",
                  currentSymbol === index.symbol
                    ? "bg-brand/10 border-l-2 border-l-brand"
                    : "hover:bg-teal-elevated/50"
                )}
                onClick={() => handleSelectIndex(index.symbol)}
              >
                {/* Favorite Star */}
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(index.symbol)
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        favorites.has(index.symbol)
                          ? "text-brand fill-current"
                          : "text-slate-500"
                      )}
                    />
                  </button>
                </div>

                {/* Logo + 2-line Info */}
                <div className="col-span-4 flex items-center gap-2">
                  <IndexLogo
                    symbol={index.symbol}
                    logoUrl={(index as any).logoUrl}
                    logoGradient={(index as any).logoGradient}
                    size={20}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="font-medium text-white">
                      {index.symbol.replace('_INDEX', '')}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {(index as any).fullName || index.name}
                    </div>
                  </div>
                </div>

                {/* Layer */}
                <div className="col-span-1 text-slate-300 flex items-center">
                  {(index as any).layer || '-'}
                </div>

                {/* Price (HYPE) */}
                <div className="col-span-2 text-right text-slate-200 font-mono flex items-center justify-end">
                  {index.currentPrice ? index.currentPrice.toFixed(4) : '-'}
                </div>

                {/* 24h Change */}
                <div className="col-span-2 text-right font-mono flex items-center justify-end">
                  {index.change24h !== undefined ? (
                    <span className={cn(
                      "font-medium",
                      index.change24h >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {index.change24h >= 0 ? '+' : ''}{index.change24h.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>

                {/* Volume */}
                <div className="col-span-2 text-right text-slate-300 font-mono flex items-center justify-end">
                  {index.volume24h ? (
                    index.volume24h >= 1_000_000
                      ? `${(index.volume24h / 1_000_000).toFixed(2)}M`
                      : `${(index.volume24h / 1_000).toFixed(0)}K`
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
