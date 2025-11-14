'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompletedRebalancing {
  id: string
  indexName: string
  indexSymbol: string
  completedDate: string
  result: 'passed' | 'rejected'
  type: 'proposal' | 'vs-battle'
  changes: {
    type: 'add' | 'remove' | 'adjust'
    symbol: string
    name: string
    from?: number
    to: number
  }[]
  totalVotes: number
  totalPower: number
  passPercentage: number
}

interface CompletedRebalancingCardProps {
  rebalancing: CompletedRebalancing
}

export function CompletedRebalancingCard({ rebalancing }: CompletedRebalancingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isPassed = rebalancing.result === 'passed'

  return (
    <Card className="glass-card-dynamic hover:border-brand/30 transition-all">
      <CardContent className="p-4">
        {/* Collapsed View - Header */}
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            {/* Index Name & Type */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-white">{rebalancing.indexName}</h4>
              <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                {rebalancing.type === 'proposal' ? 'Proposal' : 'VS Battle'}
              </Badge>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Calendar className="w-3 h-3" />
              <span>Completed {rebalancing.completedDate}</span>
            </div>

            {/* Result Badge */}
            <div className="flex items-center gap-2">
              {isPassed ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Passed
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  <XCircle className="w-3 h-3 mr-1" />
                  Rejected
                </Badge>
              )}
              <span className="text-xs text-slate-400">
                {rebalancing.passPercentage.toFixed(1)}% support
              </span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            className="ml-4 text-slate-400 hover:text-brand transition-colors p-1"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Expanded View - Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-teal space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Changes Applied */}
            <div>
              <h5 className="text-xs font-semibold text-slate-300 mb-2">
                {isPassed ? 'Changes Applied' : 'Proposed Changes'}
              </h5>
              <div className="space-y-2">
                {rebalancing.changes.map((change, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-2 rounded text-xs border",
                      change.type === 'add' && "bg-green-500/10 border-green-500/20",
                      change.type === 'remove' && "bg-red-500/10 border-red-500/20",
                      change.type === 'adjust' && "bg-brand/10 border-brand/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {change.type === 'add' && 'Added'}
                          {change.type === 'remove' && 'Removed'}
                          {change.type === 'adjust' && 'Adjusted'}
                        </span>
                        <span className="text-slate-300">{change.symbol}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        {change.from !== undefined && (
                          <>
                            <span>{change.from}%</span>
                            <span>→</span>
                          </>
                        )}
                        <span className={cn(
                          "font-medium",
                          change.type === 'add' && "text-green-400",
                          change.type === 'remove' && "text-red-400",
                          change.type === 'adjust' && (change.to > (change.from || 0) ? "text-green-400" : "text-red-400")
                        )}>
                          {change.to}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voting Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-teal-elevated rounded">
                <div className="text-xs text-slate-400 mb-1">Total Votes</div>
                <div className="text-sm font-semibold text-white">
                  {rebalancing.totalVotes.toLocaleString()}
                </div>
              </div>
              <div className="p-2 bg-teal-elevated rounded">
                <div className="text-xs text-slate-400 mb-1">Voting Power</div>
                <div className="text-sm font-semibold text-white">
                  {(rebalancing.totalPower / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
