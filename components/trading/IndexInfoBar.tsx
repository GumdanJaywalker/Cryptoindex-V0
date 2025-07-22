'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, SearchIcon, StarIcon, ClockIcon } from 'lucide-react'
import { IndexInfoModal } from './IndexInfoModal'

const mockIndexes = [
  { symbol: 'DOG_INDEX', name: 'Doggy Index', isFavorite: true },
  { symbol: 'CAT_INDEX', name: 'Catty Index', isFavorite: false }, 
  { symbol: 'MEME_INDEX', name: 'Meme Index', isFavorite: true },
  { symbol: 'AI_INDEX', name: 'AI Index', isFavorite: false },
  { symbol: 'PEPE_INDEX', name: 'Pepe Index', isFavorite: false }
]

export function IndexInfoBar() {
  const [selectedIndex, setSelectedIndex] = useState('DOG_INDEX')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(new Set(['DOG_INDEX', 'MEME_INDEX']))
  
  // Funding countdown timer
  const [fundingCountdown, setFundingCountdown] = useState({
    hours: 2,
    minutes: 34,
    seconds: 12
  })

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setFundingCountdown(prev => {
        let { hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // Reset to next funding period (8 hours)
          hours = 7
          minutes = 59
          seconds = 59
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.index-dropdown')) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  // Filter indexes based on search
  const filteredIndexes = mockIndexes.filter(index =>
    index.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    index.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol)
      } else {
        newFavorites.add(symbol)
      }
      return newFavorites
    })
  }

  return (
    <div className="h-12 flex items-center px-4 text-sm" style={{ background: 'var(--hl-bg-primary)', borderBottom: '1px solid var(--hl-border)' }}>
      {/* Index Selector */}
      <div className="relative index-dropdown">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded transition-colors hover:opacity-80"
          style={{ background: 'var(--hl-bg-tertiary)' }}
        >
          <StarIcon 
            className={`h-3.5 w-3.5 ${favorites.has(selectedIndex) ? 'text-white fill-current' : 'text-slate-400'}`}
          />
          <span className="font-medium text-white text-sm">{selectedIndex}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 rounded-lg shadow-lg z-10 w-80" style={{ background: 'var(--hl-bg-secondary)', border: '1px solid var(--hl-border)' }}>
            {/* Search Box */}
            <div className="p-3" style={{ borderBottom: '1px solid var(--hl-border)' }}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 hl-text-secondary" />
                <input
                  type="text"
                  placeholder="Search indexes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg hl-text-primary placeholder-hl-text-secondary focus:outline-none transition-colors"
                  style={{ background: 'var(--hl-bg-tertiary)', border: '1px solid var(--hl-border)', color: 'var(--hl-text-primary)' }}
                />
              </div>
            </div>
            
            {/* Favorites Section */}
            {Array.from(favorites).length > 0 && (
              <div className="p-2 border-b border-slate-700">
                <div className="text-xs text-slate-400 mb-2 px-2">⭐ Favorites</div>
                {mockIndexes
                  .filter(index => favorites.has(index.symbol))
                  .map((index) => (
                    <div
                      key={`fav-${index.symbol}`}
                      className="flex items-center justify-between px-2 py-2 hover:bg-slate-700 rounded transition-colors"
                    >
                      <button
                        onClick={() => {
                          setSelectedIndex(index.symbol)
                          setIsDropdownOpen(false)
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="text-white font-medium">{index.symbol}</div>
                        <div className="text-xs text-slate-400">{index.name}</div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(index.symbol)
                        }}
                        className="p-1 hover:bg-slate-600 rounded"
                      >
                        <StarIcon className="h-3 w-3 text-white fill-current" />
                      </button>
                    </div>
                  ))
                }
              </div>
            )}
            
            {/* All Indexes */}
            <div className="p-2 max-h-60 overflow-y-auto">
              <div className="text-xs text-slate-400 mb-2 px-2">All Indexes</div>
              {filteredIndexes.map((index) => (
                <div
                  key={index.symbol}
                  className="flex items-center justify-between px-2 py-2 hover:bg-slate-700 rounded transition-colors"
                >
                  <button
                    onClick={() => {
                      setSelectedIndex(index.symbol)
                      setIsDropdownOpen(false)
                      setSearchQuery('')
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="text-white font-medium">{index.symbol}</div>
                    <div className="text-xs text-slate-400">{index.name}</div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(index.symbol)
                    }}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <StarIcon 
                      className={`h-3 w-3 ${
                        favorites.has(index.symbol) 
                          ? 'text-white fill-current' 
                          : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Info */}
      <div className="ml-6 flex items-center space-x-6">
        <div>
          <div className="text-sm font-medium text-white">$1.2345</div>
          <div className="text-xs hl-text-secondary">Current Price</div>
        </div>
        
        <div>
          <div className="text-sm font-medium hl-accent-green">+5.67%</div>
          <div className="text-xs hl-text-secondary">24h Change</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-white">$1.2890</div>
          <div className="text-xs hl-text-secondary">24h High</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-white">$1.1234</div>
          <div className="text-xs hl-text-secondary">24h Low</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-white">$2.34M</div>
          <div className="text-xs hl-text-secondary">24h Volume</div>
        </div>
        
        <div className="relative group">
          <div className="text-sm font-medium text-yellow-400">0.05%</div>
          <div className="text-xs hl-text-secondary flex items-center space-x-1">
            <span>Funding Rate</span>
            <ClockIcon className="h-3 w-3" />
          </div>
          {/* Funding Countdown Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-max">
            <div className="text-center">
              <div className="text-white font-mono text-lg">
                {String(fundingCountdown.hours).padStart(2, '0')}:
                {String(fundingCountdown.minutes).padStart(2, '0')}:
                {String(fundingCountdown.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-400">Until Next Funding</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-white">$12.34M</div>
          <div className="text-xs hl-text-secondary">Open Interest</div>
        </div>
        
        <div className="relative group">
          <div className="text-sm font-medium hl-accent-green">+0.12%</div>
          <div className="text-xs hl-text-secondary">Index Premium</div>
          {/* Premium/Discount Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-max">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-2">Funding Rate History</div>
              <div className="space-y-1">
                <div className="flex justify-between space-x-4 text-xs">
                  <span className="text-slate-400">8h avg:</span>
                  <span className="text-green-400">+0.032%</span>
                </div>
                <div className="flex justify-between space-x-4 text-xs">
                  <span className="text-slate-400">1d avg:</span>
                  <span className="text-yellow-400">+0.045%</span>
                </div>
                <div className="flex justify-between space-x-4 text-xs">
                  <span className="text-slate-400">7d avg:</span>
                  <span className="text-red-400">-0.012%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <div>
            <div className="text-sm hl-accent-green font-medium">OPEN</div>
            <div className="text-xs hl-text-secondary">Market Status</div>
          </div>
        </div>
      </div>

      {/* Info Button */}
      <div className="ml-auto">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded text-black text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--hl-accent-primary)' }}
        >
          Index Info
        </button>
      </div>

      {/* Index Info Modal */}
      <IndexInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        indexSymbol={selectedIndex}
      />
    </div>
  )
}