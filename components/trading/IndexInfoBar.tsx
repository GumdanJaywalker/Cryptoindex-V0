'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, SearchIcon, StarIcon, Droplets } from 'lucide-react'
import NumberTicker from '@/components/magicui/number-ticker'
import { CurrencyNumberTicker } from '@/components/ui/currency-number-ticker'
import BorderBeam from '@/components/magicui/border-beam'
import LiquidityModal from '@/components/trading/LiquidityModal'
import GraduationProgress from '@/components/trading/GraduationProgress'
import { IndexDropdown } from '@/components/trading/IndexDropdown'
import { IndexLogo } from '@/components/trading/IndexLogo'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { getAllTradingIndexes } from '@/lib/data/launched-indexes'
import { useTradingStore } from '@/lib/store/trading-store'

export function IndexInfoBar() {
  const { formatPrice, formatVolume, formatGas, currency } = useCurrency()

  // 🆕 Subscribe to Trading Store SSOT
  const selectedIndex = useTradingStore(state => state.selectedIndexSymbol)
  const setSelectedIndexSymbol = useTradingStore(state => state.setSelectedIndexSymbol)
  const selectedTimeframe = useTradingStore(state => state.selectedTimeframe)
  const currentPrice = useTradingStore(state => state.currentPrice)
  const priceChange24h = useTradingStore(state => state.priceChange24h)
  const priceChange24hAbsolute = useTradingStore(state => state.priceChange24hAbsolute)
  const volume24h = useTradingStore(state => state.volume24h)
  const marketCap = useTradingStore(state => state.marketCap)
  const favoritesArray = useTradingStore(state => state.favorites)
  const toggleFavorite = useTradingStore(state => state.toggleFavorite)

  // Convert favorites array to Set for IndexDropdown compatibility
  const favorites = new Set(favoritesArray)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [liquidityOpen, setLiquidityOpen] = useState(false)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)

  // Get all indexes (mock + launched)
  const allIndexes = getAllTradingIndexes()

  // Find currently selected index
  const currentIndex = allIndexes.find(idx => idx.symbol === selectedIndex)
  const isLayer3 = currentIndex && (currentIndex as any).layer === 'L3'

  // Mock graduation data per selected index (since InfoBar is mock‑driven here)
  const selectedGraduation = (() => {
    const hash = Array.from(selectedIndex).reduce((a, c) => a + c.charCodeAt(0), 0)
    const lp = (hash * 7) % 100
    const sp = (hash * 13) % 100
    const avg = (lp + sp) / 2
    const status = avg >= 100 ? 'graduated' : avg >= 70 ? 'near-graduation' : avg >= 30 ? 'recruiting-liquidity' : 'launching'
    return { liquidityProgress: lp, salesProgress: sp, status } as const
  })()

  // Mock gas fee oracle (for tooltip + est. gas USD)
  const [gasInfo, setGasInfo] = useState({
    gasPriceGwei: 18, // mock base
    ethUsd: 3200,     // mock ETH price
    gasLimit: 120_000 // indicative for a trade
  })

  useEffect(() => {
    const id = setInterval(() => {
      setGasInfo(prev => ({
        ...prev,
        gasPriceGwei: Math.max(8, Math.min(60, prev.gasPriceGwei + (Math.random() - 0.5) * 2))
      }))
    }, 5000)
    return () => clearInterval(id)
  }, [])
  




  const handleSelectIndex = (symbol: string) => {
    setSelectedIndexSymbol(symbol)
  }

  return (
    <>
    <div className="h-[72px] flex items-center px-5 text-sm" style={{ background: 'var(--hl-bg-primary)', borderBottom: '1px solid var(--hl-border)' }}>
      {/* Index Selector - Opens Dropdown */}
      <div className="relative index-dropdown">
        <button
          ref={dropdownButtonRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 transition-opacity hover:opacity-70"
        >
          <IndexLogo
            symbol={selectedIndex}
            logoUrl={(currentIndex as any)?.logoUrl}
            logoGradient={(currentIndex as any)?.logoGradient}
            size={20}
          />
          <div className="flex flex-col items-start">
            <span className="font-medium text-white text-lg">{selectedIndex.replace('_INDEX', '')}</span>
            <span className="text-xs text-slate-400">{(currentIndex as any)?.fullName || currentIndex?.name}</span>
          </div>
          <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Price Info - 🆕 Using SSOT from Store (no animations) */}
      <div className="ml-8 flex items-center space-x-8">
        <div>
          <div className="text-xs hl-text-secondary">Current Price</div>
          <div className="text-base font-medium text-white tabular-nums" style={{ fontFamily: 'Arial, sans-serif' }}>
            {formatPrice(currentPrice)}
          </div>
        </div>

        <div>
          <div className="text-xs hl-text-secondary">
            {selectedTimeframe === '1m' && '1m Change'}
            {selectedTimeframe === '5m' && '5m Change'}
            {selectedTimeframe === '15m' && '15m Change'}
            {selectedTimeframe === '1h' && '1h Change'}
            {selectedTimeframe === '4h' && '4h Change'}
            {selectedTimeframe === '1d' && '24h Change'}
            {selectedTimeframe === '1w' && '7d Change'}
          </div>
          <div className={`text-base font-medium tabular-nums ${priceChange24h >= 0 ? 'text-brand' : 'text-white'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            {formatPrice(priceChange24hAbsolute)}
            <span className="text-xs ml-1 text-slate-400">
              ({priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs hl-text-secondary">24h Volume</div>
          <div className="text-base font-medium text-white tabular-nums" style={{ fontFamily: 'Arial, sans-serif' }}>
            {formatVolume(volume24h)}
          </div>
        </div>

        <div>
          <div className="text-xs hl-text-secondary">Market Cap</div>
          <div className="text-base font-medium text-white tabular-nums" style={{ fontFamily: 'Arial, sans-serif' }}>
            {(marketCap / 1_000_000_000).toFixed(2)}B
            <span className="ml-1 text-xs text-slate-400">HYPE</span>
          </div>
        </div>
        {/* Graduation (compact) - Only show for Layer 3 bonding curve indexes */}
        {isLayer3 && selectedGraduation.status !== 'graduated' && (
          <GraduationProgress data={selectedGraduation} variant="compact" />
        )}

        {/* Provide Liquidity CTA - Show for all indexes */}
        <div>
          <button
            onClick={() => setLiquidityOpen(true)}
            className="glass-button-brand px-3 py-1 rounded flex items-center gap-1"
          >
            <Droplets className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">Provide Liquidity</span>
          </button>
        </div>

      </div>


    </div>

    {/* Dropdown + Modals */}
    <IndexDropdown
      open={isDropdownOpen}
      onClose={() => setIsDropdownOpen(false)}
      onSelectIndex={handleSelectIndex}
      currentSymbol={selectedIndex}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      anchorEl={dropdownButtonRef.current}
    />
    <LiquidityModal open={liquidityOpen} onOpenChange={setLiquidityOpen} indexSymbol={selectedIndex} />
    </>
  )
}
