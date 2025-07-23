'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IndexCard } from './IndexCard'
import { ChevronRight, Flame } from 'lucide-react'

interface CategorySectionsProps {
  filters: {
    timeframe: string
    sortBy: string
    category: string
  }
}

// Mock 데이터
const mockIndexes = {
  animal_memes: [
    {
      symbol: 'DOG_INDEX',
      name: 'Doggy Meme Index',
      emoji: '🐕',
      price: 2.847,
      change24h: 34.82,
      volume24h: 2847000,
      marketCap: 847000000,
      rank: 1,
      description: 'The ultimate collection of dog-themed meme coins including DOGE, SHIB, and emerging pups',
      category: 'animal_memes',
      trendingScore: 95
    },
    {
      symbol: 'CAT_INDEX',
      name: 'Kitty Meme Index',
      emoji: '🐱',
      price: 1.234,
      change24h: 67.8,
      volume24h: 1890000,
      marketCap: 456000000,
      rank: 2,
      description: 'Purr-fect portfolio of cat-themed tokens making waves in the meme space',
      category: 'animal_memes',
      trendingScore: 88
    },
    {
      symbol: 'FROG_INDEX',
      name: 'Pepe Ecosystem Index',
      emoji: '🐸',
      price: 0.856,
      change24h: 23.45,
      volume24h: 1234000,
      marketCap: 234000000,
      rank: 5,
      description: 'Rare Pepe and frog-themed meme coins collection',
      category: 'animal_memes',
      trendingScore: 76
    }
  ],
  gaming: [
    {
      symbol: 'GAME_INDEX',
      name: 'Gaming Metaverse Index',
      emoji: '🎮',
      price: 4.567,
      change24h: 12.34,
      volume24h: 3456000,
      marketCap: 1200000000,
      rank: 3,
      description: 'Top gaming and metaverse tokens powering the future of play-to-earn',
      category: 'gaming',
      trendingScore: 82
    },
    {
      symbol: 'NFT_GAME_INDEX',
      name: 'NFT Gaming Index',
      emoji: '🕹️',
      price: 2.345,
      change24h: 8.92,
      volume24h: 1567000,
      marketCap: 678000000,
      rank: 7,
      description: 'Leading NFT gaming projects and play-to-earn ecosystems',
      category: 'gaming',
      trendingScore: 71
    }
  ],
  ai_tech: [
    {
      symbol: 'AI_INDEX',
      name: 'AI Revolution Index',
      emoji: '🤖',
      price: 6.789,
      change24h: 15.67,
      volume24h: 4567000,
      marketCap: 1890000000,
      rank: 4,
      description: 'Cutting-edge AI and machine learning tokens shaping the future',
      category: 'ai_tech',
      trendingScore: 79
    },
    {
      symbol: 'TECH_INDEX',
      name: 'Web3 Tech Index',
      emoji: '💻',
      price: 3.456,
      change24h: 6.78,
      volume24h: 2345000,
      marketCap: 890000000,
      rank: 8,
      description: 'Infrastructure and technology tokens powering Web3',
      category: 'ai_tech',
      trendingScore: 68
    }
  ],
  brainrot: [
    {
      symbol: 'BRAINROT_INDEX',
      name: 'BrainRot Meme Index',
      emoji: '🧠',
      price: 0.420,
      change24h: 69.42,
      volume24h: 6900000,
      marketCap: 420000000,
      rank: 6,
      description: 'The most unhinged and viral meme coins that broke the internet',
      category: 'brainrot',
      isNew: true,
      trendingScore: 94
    }
  ],
  defi: [
    {
      symbol: 'DEFI_BLUE_INDEX',
      name: 'DeFi Blue Chip Index',
      emoji: '📈',
      price: 12.345,
      change24h: 4.56,
      volume24h: 5678000,
      marketCap: 2340000000,
      rank: 9,
      description: 'Established DeFi protocols with proven track records',
      category: 'defi',
      trendingScore: 65
    }
  ]
}

const categories = [
  { 
    id: 'trending_now', 
    title: 'Trending Now', 
    emoji: '🔥', 
    description: 'Hottest indexes right now',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'animal_memes', 
    title: 'Animal Memes', 
    emoji: '🐕', 
    description: 'Dog, cat, and other animal-themed meme coins',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'gaming', 
    title: 'Gaming Tokens', 
    emoji: '🎮', 
    description: 'Gaming and metaverse projects',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'brainrot', 
    title: 'BrainRot Memes', 
    emoji: '🧠', 
    description: 'The most viral and unhinged memes',
    color: 'from-green-500 to-blue-500'
  },
  { 
    id: 'ai_tech', 
    title: 'AI & Tech', 
    emoji: '🤖', 
    description: 'Artificial intelligence and technology tokens',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'defi', 
    title: 'DeFi Blue Chips', 
    emoji: '📈', 
    description: 'Established DeFi protocols',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    id: 'new_listings', 
    title: 'New Listings', 
    emoji: '✨', 
    description: 'Recently launched indexes',
    color: 'from-emerald-500 to-teal-500'
  }
]

export function CategorySections({ filters }: CategorySectionsProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['trending_now'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getFilteredIndexes = (categoryId: string) => {
    if (categoryId === 'trending_now') {
      // Trending Now는 모든 카테고리에서 트렌딩 스코어 높은 순으로
      const allIndexes = Object.values(mockIndexes).flat()
      return allIndexes
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
        .slice(0, 8)
    }
    
    if (categoryId === 'new_listings') {
      // New Listings는 isNew 플래그가 있는 것들
      const allIndexes = Object.values(mockIndexes).flat()
      return allIndexes.filter(index => index.isNew)
    }

    return mockIndexes[categoryId as keyof typeof mockIndexes] || []
  }

  const filteredCategories = filters.category === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === filters.category)

  return (
    <div className="space-y-8">
      {filteredCategories.map((category) => {
        const indexes = getFilteredIndexes(category.id)
        const isExpanded = expandedCategories.includes(category.id)
        const displayIndexes = isExpanded ? indexes : indexes.slice(0, 4)

        if (indexes.length === 0) return null

        return (
          <div key={category.id} className="space-y-4">
            {/* 카테고리 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}>
                  {category.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {category.title}
                    {category.id === 'trending_now' && <Flame className="w-5 h-5 text-orange-400" />}
                  </h2>
                  <p className="text-slate-400 text-sm">{category.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{indexes.length} indexes</span>
                {indexes.length > 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    {isExpanded ? 'Show Less' : 'View All'}
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                )}
              </div>
            </div>

            {/* 인덱스 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayIndexes.map((index) => (
                <IndexCard key={index.symbol} index={index} />
              ))}
            </div>

            {/* 더 많은 항목이 있을 때 힌트 */}
            {!isExpanded && indexes.length > 4 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => toggleCategory(category.id)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  + {indexes.length - 4} more indexes
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}