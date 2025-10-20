'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// Temporarily disable wallet UI to stabilize build
import { Button } from '@/components/ui/button'
import { Settings, Search } from 'lucide-react'
import { NotificationsButton } from '@/components/notifications/NotificationsButton'
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton'
import { searchIndexes, type IndexSearchResult } from '@/lib/api/search'
// Logo served from public. Place your official backgroundless text logo at /public/logos/hyperindex-text.svg

const navigation = [
  { name: 'Trading', href: '/trading' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Governance', href: '/governance' },
  { name: 'Launch', href: '/launch' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Referrals', href: '/referrals' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<IndexSearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  // Prefer the official static logo; avoid unnecessary fallbacks to prevent confusion
  const logoSrc = '/10.svg'

  useEffect(() => {
    document.documentElement.classList.add('density-compact')
    return () => {
      document.documentElement.classList.remove('density-compact')
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearchOpen(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchIndexes(query)
      setSearchResults(results)
      setIsSearchOpen(true)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, handleSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleResultClick = (result: IndexSearchResult) => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
    router.push(`/trading?index=${result.id}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex h-16 items-center px-[4vw] lg:px-[3vw]">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            <div className="h-[90px] w-[360px] overflow-visible flex items-center -ml-[150px] mt-[20px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="HyperIndex"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Navigation - Center */}
        <nav className="flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === item.href
                  ? 'text-blue-400'
                  : 'text-slate-300'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - Search + Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search indexes..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              className="w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{result.name}</div>
                        <div className="text-xs text-slate-400">{result.symbol}</div>
                      </div>
                      {result.price && (
                        <div className="text-sm text-slate-300">${result.price.toFixed(2)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {isSearchOpen && searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 z-50">
                <p className="text-sm text-slate-400 text-center">No indexes found</p>
              </div>
            )}
          </div>

          {/* Notifications + Settings + Wallet Connect */}
          <div className="flex items-center gap-2">
            <NotificationsButton />
            <Link
              href="/settings"
              aria-label="Settings"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </Link>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
