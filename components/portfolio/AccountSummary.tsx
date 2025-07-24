'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
            className={`${
              accountData.riskScore === 'Low' ? 'text-green-400 border-green-400/30' :
              accountData.riskScore === 'Medium' ? 'text-yellow-400 border-yellow-400/30' :
              'text-red-400 border-red-400/30'
            }`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {accountData.riskScore} Risk
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2" />
            Live
          </Button>
        </div>
      </div>

      {/* 메인 통계 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 총 자산 */}
        <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                USDC
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${accountData.totalEquity.toLocaleString()}
            </div>
            <div className="text-sm text-slate-200">
              Total Equity
            </div>
          </CardContent>
        </Card>

        {/* 일일 PnL */}
        <Card className={`bg-gradient-to-br ${
          accountData.dailyPnL >= 0 
            ? 'from-green-950/50 to-slate-900 border-green-800/30' 
            : 'from-red-950/50 to-slate-900 border-red-800/30'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {accountData.dailyPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  accountData.dailyPnL >= 0 
                    ? 'text-green-400 border-green-400/30' 
                    : 'text-red-400 border-red-400/30'
                }`}
              >
                24h
              </Badge>
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${
              accountData.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {accountData.dailyPnL >= 0 ? '+' : ''}${accountData.dailyPnL.toLocaleString()}
            </div>
            <div className="text-sm text-slate-200">
              Daily P&L
            </div>
          </CardContent>
        </Card>

        {/* 미실현 PnL */}
        <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                Open
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              +${accountData.unrealizedPnL.toLocaleString()}
            </div>
            <div className="text-sm text-slate-200">
              Unrealized P&L
            </div>
          </CardContent>
        </Card>

        {/* 마진 사용률 */}
        <Card className={`bg-gradient-to-br ${
          marginUtilization > 80 
            ? 'from-red-950/50 to-slate-900 border-red-800/30'
            : marginUtilization > 60
            ? 'from-yellow-950/50 to-slate-900 border-yellow-800/30'
            : 'from-green-950/50 to-slate-900 border-green-800/30'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {marginUtilization > 80 ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <Zap className="w-5 h-5 text-green-400" />
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  marginUtilization > 80 
                    ? 'text-red-400 border-red-400/30'
                    : marginUtilization > 60
                    ? 'text-yellow-400 border-yellow-400/30'
                    : 'text-green-400 border-green-400/30'
                }`}
              >
                {marginUtilization.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${accountData.marginUsed.toLocaleString()}
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
                ${accountData.availableBalance.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Available Balance</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-400">
                +${accountData.realizedPnL.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Realized P&L</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg sm:text-xl font-bold ${
                accountData.weeklyPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {accountData.weeklyPnL >= 0 ? '+' : ''}${accountData.weeklyPnL.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Weekly P&L</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-400">
                +${accountData.monthlyPnL.toLocaleString()}
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
              <div className="text-lg sm:text-xl font-bold text-blue-400">
                {accountData.winRate}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}