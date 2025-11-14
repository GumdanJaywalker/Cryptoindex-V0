'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Trophy,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { useCurrency } from '@/lib/hooks/useCurrency'

interface TradingAnalyticsProps {
  compact?: boolean
}

const analyticsData = {
  totalTrades: 234,
  winningTrades: 158,
  losingTrades: 76,
  winRate: 67.5,
  avgWin: 847.50,
  avgLoss: -423.80,
  profitFactor: 2.1,
  sharpeRatio: 1.8,
  maxDrawdown: -8450.00,
  currentDrawdown: -2340.00,
  bestTrade: 4567.80,
  worstTrade: -2134.50,
  averageHoldTime: '4.2 hours',
  totalPnL: 15847.20,
  monthlyPnL: [
    { month: 'Jan', pnl: 2340 },
    { month: 'Feb', pnl: -840 },
    { month: 'Mar', pnl: 4567 },
    { month: 'Apr', pnl: 3456 },
    { month: 'May', pnl: 1890 },
    { month: 'Jun', pnl: 4434 }
  ],
  tradesByIndex: [
    { symbol: 'DOG_INDEX', trades: 67, pnl: 8934.50, winRate: 72.3 },
    { symbol: 'CAT_INDEX', trades: 45, pnl: 3456.80, winRate: 64.4 },
    { symbol: 'AI_INDEX', trades: 38, pnl: 2890.40, winRate: 60.5 },
    { symbol: 'MEME_INDEX', trades: 84, pnl: 565.50, winRate: 54.8 }
  ]
}

export function TradingAnalytics({ compact = false }: TradingAnalyticsProps) {
  const [timeframe, setTimeframe] = useState('all')
  const { formatBalance, formatPnL } = useCurrency()

  if (compact) {
    return (
      <Card className="glass-card-dynamic border-teal">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-300">
                {analyticsData.winRate}%
              </div>
              <div className="text-xs text-slate-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{analyticsData.profitFactor}</div>
              <div className="text-xs text-slate-400">Profit Factor</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Monthly P&L</span>
                <span className={formatPnL(analyticsData.totalPnL).colorClass}>{formatPnL(analyticsData.totalPnL).text}</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Max Drawdown</span>
                <span className="text-red-300">{formatBalance(Math.abs(analyticsData.maxDrawdown))}</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3 border-teal text-slate-300 hover:bg-teal-card/50">
            View Full Analytics
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-brand" />
            Trading Analytics
          </h2>
          <p className="text-slate-400 mt-1">Comprehensive analysis of your trading performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', 'all'].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(period)}
              className={`h-8 px-3 text-xs ${
                timeframe === period
                  ? 'bg-brand hover:bg-brand-hover text-black'
                  : 'text-slate-300 hover:text-white hover:bg-teal-card/50'
              }`}
            >
              {period.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Win Rate</Badge>
            </div>
            <div className="text-2xl font-bold text-green-300 mb-1">{analyticsData.winRate}%</div>
            <div className="text-sm text-slate-400">Win Rate</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Profit Factor</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{analyticsData.profitFactor}</div>
            <div className="text-sm text-slate-400">Profit Factor</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Sharpe</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{analyticsData.sharpeRatio}</div>
            <div className="text-sm text-slate-400">Sharpe Ratio</div>
          </CardContent>
        </Card>

        <Card className="glass-card-dynamic border-teal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-teal text-xs">Max Drawdown</Badge>
            </div>
            <div className="text-2xl font-bold text-red-300 mb-1">${Math.abs(analyticsData.maxDrawdown).toLocaleString()}</div>
            <div className="text-sm text-slate-400">Max Drawdown</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Trade Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trade Statistics */}
        <Card className="glass-card-dynamic border-teal">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              Trade Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-teal-card/50 rounded-lg">
                <div className="text-xl font-bold text-white">{analyticsData.totalTrades}</div>
                <div className="text-xs text-slate-400">Total Trades</div>
              </div>
              <div className="text-center p-3 bg-teal-card/50 rounded-lg">
                <div className="text-xl font-bold text-green-300">{analyticsData.winningTrades}</div>
                <div className="text-xs text-slate-400">Winning</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Win Rate</span>
                  <span className="text-green-300">{analyticsData.winRate}%</span>
                </div>
                <Progress value={analyticsData.winRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Avg Win</div>
                  <div className="text-green-300 font-semibold">+${analyticsData.avgWin}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Avg Loss</div>
                  <div className="text-red-300 font-semibold">${analyticsData.avgLoss}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Best Trade</div>
                  <div className="text-green-300 font-semibold">+${analyticsData.bestTrade}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Worst Trade</div>
                  <div className="text-red-300 font-semibold">${analyticsData.worstTrade}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Index */}
        <Card className="glass-card-dynamic border-teal">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-slate-400" />
              Performance by Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.tradesByIndex.map((index, i) => (
                <div key={i} className="p-3 bg-teal-card/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">{index.symbol}</div>
                    <div className={`text-sm font-semibold ${formatPnL(index.pnl).colorClass}`}>
                      {formatPnL(index.pnl).text}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{index.trades} trades</span>
                    <span>{index.winRate}% win rate</span>
                  </div>
                  
                  <Progress value={index.winRate} className="h-1.5 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card className="glass-card-dynamic border-teal">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2" style={{ height: '10rem' }}>
            {(() => {
              const maxAbs = Math.max(...analyticsData.monthlyPnL.map(m => Math.abs(m.pnl))) || 1
              return analyticsData.monthlyPnL.map((month, index) => {
                const height = (Math.abs(month.pnl) / maxAbs) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className={`text-xs mb-2 ${formatPnL(month.pnl).colorClass}`}>
                      {formatPnL(month.pnl).text}
                    </div>
                    <div className="w-full h-32 flex items-end">
                      <div
                        className={`w-[20%] mx-auto rounded-t ${month.pnl >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{month.month}</div>
                  </div>
                )
              })
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
