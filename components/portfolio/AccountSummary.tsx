'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrency } from '@/lib/hooks/useCurrency'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Target,
  AlertTriangle,
  Shield,
  Activity
} from 'lucide-react'

const accountData = {
  totalEquity: 147500.85,
  availableBalance: 12450.30,
  unrealizedPnL: 8947.50,
  realizedPnL: 15847.20,
  marginUsed: 89450.00,
  marginFree: 58050.85,
  dailyPnL: 2347.80,
  weeklyPnL: -847.30,
  monthlyPnL: 12847.50,
  totalTrades: 234,
  winRate: 67.8,
  riskScore: 'Medium'
}

export function AccountSummary() {
  const { formatBalance, formatPnL, currency } = useCurrency()
  const marginUtilization = (accountData.marginUsed / accountData.totalEquity) * 100

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Dashboard</h1>
          <p className="text-slate-400 mt-1">Comprehensive view of your trading performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className="text-slate-300 border-slate-600"
          >
            <Shield className="w-3 h-3 mr-1 text-slate-400" />
            {accountData.riskScore} Risk
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2 text-slate-400" />
            Live
          </Button>
        </div>
      </div>

      {/* 메인 통계 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 총 자산 */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                {currency}
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              {formatBalance(accountData.totalEquity)}
            </div>
            <div className="text-sm text-slate-200">
              Total Equity
            </div>
          </CardContent>
        </Card>

        {/* 일일 PnL */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                24h
              </Badge>
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${formatPnL(accountData.dailyPnL).colorClass}`}>
              {formatPnL(accountData.dailyPnL).text}
            </div>
            <div className="text-sm text-slate-200">
              Daily P&L
            </div>
          </CardContent>
        </Card>

        {/* 미실현 PnL */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                Open
              </Badge>
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${formatPnL(accountData.unrealizedPnL).colorClass}`}>
              {formatPnL(accountData.unrealizedPnL).text}
            </div>
            <div className="text-sm text-slate-200">
              Unrealized P&L
            </div>
          </CardContent>
        </Card>

        {/* 마진 사용률 */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                {marginUtilization.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              {formatBalance(accountData.marginUsed)}
            </div>
            <div className="text-sm text-slate-200">
              Margin Used
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 통계 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">
                {formatBalance(accountData.availableBalance)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Available Balance</div>
            </div>

            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold ${formatPnL(accountData.realizedPnL).colorClass}`}>
                {formatPnL(accountData.realizedPnL).text}
              </div>
              <div className="text-xs text-slate-400 mt-1">Realized P&L</div>
            </div>

            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold ${formatPnL(accountData.weeklyPnL).colorClass}`}>
                {formatPnL(accountData.weeklyPnL).text}
              </div>
              <div className="text-xs text-slate-400 mt-1">Weekly P&L</div>
            </div>

            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold ${formatPnL(accountData.monthlyPnL).colorClass}`}>
                {formatPnL(accountData.monthlyPnL).text}
              </div>
              <div className="text-xs text-slate-400 mt-1">Monthly P&L</div>
            </div>

            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">
                {accountData.totalTrades}
              </div>
              <div className="text-xs text-slate-400 mt-1">Total Trades</div>
            </div>

            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-slate-200">{accountData.winRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
