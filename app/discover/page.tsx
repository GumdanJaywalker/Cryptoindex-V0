'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { StickyFooter } from '@/components/layout/Footer'
import { LayerTabs } from '@/components/discover/layer-tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, TrendingUp, Flame, Rocket } from 'lucide-react'
import type { IndexLayer } from '@/lib/types/discover'

export default function DiscoverPage() {
  const [selectedLayer, setSelectedLayer] = useState<IndexLayer | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] 2xl:grid-cols-[320px_1fr] gap-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="pt-16 px-4 lg:px-6 pb-20 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Discover Indexes
                  </h1>
                  <p className="text-lg text-slate-400">
                    Explore curated meme coin indexes across 3 layers
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-brand border-brand/30 px-3 py-1">
                    <Flame className="w-3 h-3 mr-1" />
                    127 Active Indexes
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 1</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                        Institutional
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-slate-500">Low Risk • Monthly Rebalance</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 2</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                        Battle
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">68</div>
                    <div className="text-xs text-slate-500">Medium Risk • VS Battles</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Layer 3</span>
                      <Badge variant="outline" className="text-brand border-brand/30 text-xs">
                        Launchpad
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white">35</div>
                    <div className="text-xs text-slate-500">High Risk • Bonding Curve</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search indexes or composition assets (e.g., 'DOGE')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors"
                  />
                </div>

                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Layer Navigation Tabs */}
            <LayerTabs
              selectedLayer={selectedLayer}
              onLayerChange={setSelectedLayer}
            />

            {/* Content Area - Will be filled in next phases */}
            <div className="mt-6">
              {selectedLayer === 'all' && (
                <div className="space-y-8">
                  <PlaceholderSection title="All Indexes" count={127} />
                </div>
              )}

              {selectedLayer === 'layer-1' && (
                <div className="space-y-8">
                  <PlaceholderSection title="Layer 1: Institutional Indexes" count={24} />
                </div>
              )}

              {selectedLayer === 'layer-2' && (
                <div className="space-y-8">
                  <PlaceholderSection title="Layer 2: Battle Indexes" count={68} />
                  <PlaceholderSection title="Active VS Battles" count={8} variant="battle" />
                </div>
              )}

              {selectedLayer === 'layer-3' && (
                <div className="space-y-8">
                  <PlaceholderSection title="Layer 3: Launchpad Indexes" count={35} />
                  <PlaceholderSection title="Graduation Tracker" count={12} variant="graduation" />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <StickyFooter />
    </div>
  )
}

// Placeholder component for development
function PlaceholderSection({
  title,
  count,
  variant = 'default'
}: {
  title: string
  count: number
  variant?: 'default' | 'battle' | 'graduation'
}) {
  const getIcon = () => {
    switch (variant) {
      case 'battle':
        return <Flame className="w-5 h-5 text-purple-400" />
      case 'graduation':
        return <Rocket className="w-5 h-5 text-brand" />
      default:
        return <TrendingUp className="w-5 h-5 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (variant) {
      case 'battle':
        return 'border-purple-400/30'
      case 'graduation':
        return 'border-brand/30'
      default:
        return 'border-slate-700'
    }
  }

  return (
    <Card className={`bg-slate-900/30 ${getBorderColor()}`}>
      <CardContent className="p-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {getIcon()}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <p className="text-center text-slate-400 mb-6">
          {count} items will be displayed here
        </p>
        <div className="text-center text-sm text-slate-500">
          Component implementation coming in next phases
        </div>
      </CardContent>
    </Card>
  )
}
