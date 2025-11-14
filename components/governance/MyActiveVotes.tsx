'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActiveVote {
  type: string
  title: string
  subtitle: string
  timeLeft: string
  myVote: string
  myPower: number
  status: 'active' | 'ending-soon'
  battleEmoji: string
}

interface MyActiveVotesProps {
  votes: ActiveVote[]
}

export function MyActiveVotes({ votes }: MyActiveVotesProps) {
  if (votes.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-white">My Active Votes</h3>
        <Badge variant="secondary" className="bg-brand/20 text-brand border-brand/30">
          {votes.length} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {votes.map((vote, index) => (
          <Card
            key={index}
            className="glass-card-dynamic"
          >
            <CardContent className="p-4 space-y-3">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {vote.timeLeft}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    vote.status === 'ending-soon'
                      ? 'text-red-400 border-red-400/30'
                      : 'text-brand border-brand/30'
                  )}
                >
                  {vote.status === 'ending-soon' ? 'Ending Soon' : 'Active'}
                </Badge>
              </div>

              {/* Battle Emoji */}
              {vote.battleEmoji && (
                <div className="text-2xl text-center py-2">
                  {vote.battleEmoji}
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white line-clamp-1">
                  {vote.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {vote.subtitle}
                </p>
              </div>

              {/* My Vote */}
              <div className="pt-3 border-t border-teal space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand" />
                  <span className="text-xs text-slate-400">My Vote:</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {vote.myVote}
                </p>
              </div>

              {/* Voting Power */}
              <div className="flex items-center justify-between pt-2 border-t border-teal">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Zap className="w-3 h-3" />
                  <span>Power</span>
                </div>
                <span className="text-sm font-semibold text-brand">
                  {vote.myPower.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
