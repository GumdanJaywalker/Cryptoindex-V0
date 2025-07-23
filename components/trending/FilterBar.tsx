'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface FilterBarProps {
  filters: {
    timeframe: string
    sortBy: string
    category: string
  }
  onFiltersChange: (filters: any) => void
}

const timeframes = [
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' }
]

const sortOptions = [
  { value: 'volume', label: 'Volume' },
  { value: 'price_change', label: 'Price Change' },
  { value: 'market_cap', label: 'Market Cap' },
  { value: 'trending', label: 'Trending Score' }
]

const categories = [
  { value: 'all', label: 'All Categories', emoji: '🌟' },
  { value: 'animal_memes', label: 'Animal Memes', emoji: '🐕' },
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'brainrot', label: 'BrainRot', emoji: '🧠' },
  { value: 'ai_tech', label: 'AI & Tech', emoji: '🤖' },
  { value: 'defi', label: 'DeFi Blue Chips', emoji: '📈' },
  { value: 'new_listings', label: 'New Listings', emoji: '✨' }
]

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="mb-8 space-y-4">
      {/* 상단 제목 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trending Indexes</h1>
          <p className="text-slate-400 mt-1">Discover the hottest meme coin indexes</p>
        </div>
        <Badge variant="outline" className="text-blue-400 border-blue-400/30">
          Live Data
        </Badge>
      </div>

      {/* 필터 바 */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        {/* 시간대 필터 */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-slate-400 font-medium">Timeframe</label>
          <div className="flex gap-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={filters.timeframe === timeframe.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('timeframe', timeframe.value)}
                className={`h-8 px-3 text-xs font-medium ${
                  filters.timeframe === timeframe.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-slate-400 font-medium">Sort By</label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-col space-y-2 flex-1">
          <label className="text-sm text-slate-400 font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={filters.category === category.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('category', category.value)}
                className={`h-8 px-3 text-xs font-medium ${
                  filters.category === category.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}