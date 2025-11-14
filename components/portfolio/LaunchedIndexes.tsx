'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import IndexDetailsModal from './IndexDetailsModal'
import { getStatusColor, getStatusLabel, formatRelativeTime } from '@/lib/utils/indexStatus'
import { IndexData } from '@/lib/types/index'
import { LaunchedIndexesStorage } from '@/lib/storage/launchedIndexes'
import GraduationProgress, { type GraduationData } from '@/components/trading/GraduationProgress'
import { useCurrency } from '@/lib/hooks/useCurrency'

export function LaunchedIndexes() {
  const { formatFee } = useCurrency()
  const [launchedIndexes, setLaunchedIndexes] = useState<IndexData[]>([])
  const [selectedIndex, setSelectedIndex] = useState<IndexData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Load launched indexes from localStorage using storage service
    const indexes = LaunchedIndexesStorage.get()
    setLaunchedIndexes(indexes)
  }, [])

  // Generate graduation data based on index status
  const getGraduationData = (index: IndexData): GraduationData => {
    // Mock data based on status - in production, this would come from the index object
    const statusMap: Record<string, GraduationData> = {
      'bonding': {
        liquidityProgress: Math.floor(Math.random() * 40) + 30, // 30-70%
        salesProgress: Math.floor(Math.random() * 40) + 20, // 20-60%
        status: 'launching'
      },
      'funding': {
        liquidityProgress: Math.floor(Math.random() * 20) + 70, // 70-90%
        salesProgress: Math.floor(Math.random() * 20) + 60, // 60-80%
        status: 'recruiting-liquidity'
      },
      'lp': {
        liquidityProgress: Math.floor(Math.random() * 10) + 85, // 85-95%
        salesProgress: Math.floor(Math.random() * 10) + 80, // 80-90%
        status: 'near-graduation'
      },
      'graduated': {
        liquidityProgress: 100,
        salesProgress: 100,
        status: 'graduated'
      }
    }
    return statusMap[index.status] || statusMap['bonding']
  }

  // Utility functions moved to @/lib/utils/indexStatus

  if (launchedIndexes.length === 0) {
    return (
      <Card className="glass-card-dynamic">
        <CardContent className="p-6">
          <div className="text-center py-8">
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
    <Card className="glass-card-dynamic" data-section="launched-indexes">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-lg">My Launched Indexes</h3>
            <Badge variant="outline" className="text-xs border-teal text-slate-400">
              {launchedIndexes.length}
            </Badge>
          </div>
          <Link href="/launch">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-brand/10 text-brand hover:bg-brand/20"
            >
              Launch New
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launchedIndexes.map((index) => (
            <Card
              key={index.id}
              className="glass-card-dynamic hover:border-white/10 transition-all"
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
                    <div className="text-white font-medium">{formatFee(index.totalInvestment)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Launched
                    </div>
                    <div className="text-white font-medium">{formatRelativeTime(index.launchedAt)}</div>
                  </div>
                </div>

                {/* Graduation Progress */}
                <div className="mb-3 pb-3 border-b border-teal">
                  <GraduationProgress data={getGraduationData(index)} variant="compact" />
                </div>

                {/* Assets Preview */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {index.assets.slice(0, 5).map((asset, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded bg-teal-elevated border border-teal text-xs text-slate-300"
                    >
                      {asset.symbol}
                      <span
                        className={cn(
                          'ml-1',
                          asset.side === 'long' ? 'hl-accent-green' : 'hl-accent-red'
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
                    <div className="px-2 py-1 rounded bg-teal-elevated border border-teal text-xs text-slate-400">
                      +{index.assets.length - 5} more
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-teal text-slate-400 hover:text-white hover:bg-teal-elevated"
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
                      className="border-teal text-slate-400 hover:text-white hover:bg-teal-elevated"
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
