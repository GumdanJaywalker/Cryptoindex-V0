'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rocket, TrendingUp, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import IndexDetailsModal, { IndexDetails } from './IndexDetailsModal'

type LaunchedIndex = {
  id: string
  name: string
  symbol: string
  description: string
  socialLink: string
  assets: Array<{
    symbol: string
    name: string
    side: 'long' | 'short'
    leverage: number
    allocation: number
  }>
  totalInvestment: number
  fee: number
  launchedAt: string
  status: 'bonding' | 'funding' | 'lp' | 'graduated'
}

export function LaunchedIndexes() {
  const [launchedIndexes, setLaunchedIndexes] = useState<LaunchedIndex[]>([])
  const [selectedIndex, setSelectedIndex] = useState<IndexDetails | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Load launched indexes from localStorage
    const stored = localStorage.getItem('launched-indexes')
    if (stored) {
      try {
        const indexes = JSON.parse(stored)
        setLaunchedIndexes(indexes)
      } catch (error) {
        console.error('Failed to parse launched indexes:', error)
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bonding':
        return 'bg-brand/20 text-brand border-brand/30'
      case 'funding':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
      case 'lp':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/30'
      case 'graduated':
        return 'bg-green-400/20 text-green-400 border-green-400/30'
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bonding':
        return 'Bonding Curve'
      case 'funding':
        return 'Funding Round'
      case 'lp':
        return 'LP Round'
      case 'graduated':
        return 'Graduated'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  if (launchedIndexes.length === 0) {
    return (
      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Rocket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No Launched Indexes Yet</h3>
            <p className="text-slate-400 text-sm mb-4">
              Create and launch your first index to see it here
            </p>
            <Link href="/launch">
              <Button className="bg-brand text-slate-950 font-medium hover:bg-brand/90">
                Launch Your First Index
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/40 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-brand" />
            <h3 className="text-white font-semibold text-lg">My Launched Indexes</h3>
            <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
              {launchedIndexes.length}
            </Badge>
          </div>
          <Link href="/launch">
            <Button
              variant="outline"
              size="sm"
              className="border-brand/30 bg-brand/10 text-brand hover:bg-brand/20"
            >
              Launch New
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launchedIndexes.map((index) => (
            <Card
              key={index.id}
              className="bg-slate-900 border-slate-700 hover:border-brand/30 transition-colors"
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-bold text-lg mb-1">{index.name}</div>
                    <div className="text-slate-400 text-xs">{index.symbol}</div>
                  </div>
                  <Badge className={cn('text-xs border', getStatusColor(index.status))}>
                    {getStatusLabel(index.status)}
                  </Badge>
                </div>

                {/* Description */}
                {index.description && (
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {index.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Assets</div>
                    <div className="text-white font-medium">{index.assets.length}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Investment</div>
                    <div className="text-white font-medium">{index.totalInvestment.toFixed(0)} HYPE</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Launched
                    </div>
                    <div className="text-white font-medium">{formatDate(index.launchedAt)}</div>
                  </div>
                </div>

                {/* Assets Preview */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {index.assets.slice(0, 5).map((asset, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300"
                    >
                      {asset.symbol}
                      <span
                        className={cn(
                          'ml-1',
                          asset.side === 'long' ? 'text-green-400' : 'text-red-400'
                        )}
                      >
                        {asset.side === 'long' ? '↑' : '↓'}
                      </span>
                      {asset.leverage > 1 && (
                        <span className="text-slate-500 ml-0.5">{asset.leverage}x</span>
                      )}
                    </div>
                  ))}
                  {index.assets.length > 5 && (
                    <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-400">
                      +{index.assets.length - 5} more
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={() => {
                      setSelectedIndex(index)
                      setShowModal(true)
                    }}
                  >
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    View Details
                  </Button>
                  {index.socialLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                      asChild
                    >
                      <a href={index.socialLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Index Details Modal */}
        <IndexDetailsModal
          open={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedIndex(null)
          }}
          index={selectedIndex}
        />
      </CardContent>
    </Card>
  )
}
