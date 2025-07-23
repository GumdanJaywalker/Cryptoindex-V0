'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'

interface FilterSearchProps {
  filters: {
    search: string
    category: string
    sortBy: string
    riskLevel: string
    minAum: number
  }
  onFiltersChange: (filters: any) => void
}

const categories = [
  { value: 'all', label: 'All Categories', count: 127 },
  { value: 'protocol', label: 'Protocol Vaults', count: 8 },
  { value: 'index', label: 'Index Focused', count: 45 },
  { value: 'meme', label: 'Meme Coins', count: 32 },
  { value: 'defi', label: 'DeFi Strategies', count: 21 },
  { value: 'ai', label: 'AI Trading', count: 15 },
  { value: 'conservative', label: 'Conservative', count: 6 }
]

const sortOptions = [
  { value: 'aum', label: 'Assets Under Management' },
  { value: 'apy', label: 'APY (High to Low)' },
  { value: 'pnl', label: 'Recent Performance' },
  { value: 'age', label: 'Vault Age' },
  { value: 'followers', label: 'Most Followed' },
  { value: 'sharpe', label: 'Sharpe Ratio' }
]

const riskLevels = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
  { value: 'extreme', label: 'Extreme Risk' }
]

export function FilterSearch({ filters, onFiltersChange }: FilterSearchProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      sortBy: 'aum',
      riskLevel: 'all',
      minAum: 0
    })
  }

  const hasActiveFilters = filters.search || filters.category !== 'all' || 
                          filters.riskLevel !== 'all' || filters.minAum > 0

  return (
    <div className="mt-8 space-y-4">
      {/* 검색 바 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search vaults, managers, or strategies..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Advanced</span>
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* 필터 옵션들 */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        {/* 카테고리 */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-slate-400 font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category.value}
                variant={filters.category === category.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('category', category.value)}
                className={`h-8 px-2 sm:px-3 text-xs font-medium ${
                  filters.category === category.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {category.label}
                <Badge variant="outline" className="ml-2 text-xs border-slate-600">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* 정렬 & 위험도 */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-400 font-medium">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white">
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

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-400 font-medium">Risk Level</label>
            <Select value={filters.riskLevel} onValueChange={(value) => updateFilter('riskLevel', value)}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {riskLevels.map((risk) => (
                  <SelectItem key={risk.value} value={risk.value} className="text-white hover:bg-slate-700">
                    {risk.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 최소 AUM */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-slate-400 font-medium">
            Min AUM: ${filters.minAum >= 1000000 ? (filters.minAum / 1000000).toFixed(1) + 'M' : filters.minAum.toLocaleString()}
          </label>
          <div className="w-48">
            <Slider
              value={[filters.minAum]}
              onValueChange={(value) => updateFilter('minAum', value[0])}
              max={10000000}
              min={0}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>$0</span>
              <span>$10M</span>
            </div>
          </div>
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="text-blue-400 border-blue-400/30">
              Search: "{filters.search}"
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              Category: {categories.find(c => c.value === filters.category)?.label}
            </Badge>
          )}
          {filters.riskLevel !== 'all' && (
            <Badge variant="outline" className="text-orange-400 border-orange-400/30">
              Risk: {riskLevels.find(r => r.value === filters.riskLevel)?.label}
            </Badge>
          )}
          {filters.minAum > 0 && (
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              Min AUM: ${filters.minAum >= 1000000 ? (filters.minAum / 1000000).toFixed(1) + 'M' : filters.minAum.toLocaleString()}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}