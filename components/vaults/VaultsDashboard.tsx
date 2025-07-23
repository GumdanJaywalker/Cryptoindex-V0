'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Activity,
  Shield,
  Trophy,
  Clock
} from 'lucide-react'

const dashboardData = {
  totalInvested: 47500.85,
  totalPnL: 8947.50,
  dailyPnL: 434.20,
  weeklyPnL: 1247.80,
  activeVaults: 5,
  totalVaults: 127,
  followingManagers: 8,
  avgApy: 67.8,
  bestPerformer: 'CryptoProfessional',
  worstPerformer: 'SafeTrader',
  riskScore: 'Medium'
}

const myInvestments = [
  {
    vault: 'HyperLiquid Index Vault',
    type: 'protocol',
    invested: 15000,
    currentValue: 18450,
    pnl: 3450,
    pnlPercent: 23.0,
    apy: 89.2,
    manager: 'Protocol',
    risk: 'Medium'
  },
  {
    vault: 'Meme Index Master',
    type: 'user',
    invested: 8000,
    currentValue: 9680,
    pnl: 1680,
    pnlPercent: 21.0,
    apy: 156.8,
    manager: 'CryptoProfessional',
    risk: 'High'
  },
  {
    vault: 'Conservative DeFi',
    type: 'user',
    invested: 12000,
    currentValue: 12960,
    pnl: 960,
    pnlPercent: 8.0,
    apy: 24.3,
    manager: 'SafeTrader',
    risk: 'Low'
  },
  {
    vault: 'AI Index Alpha',
    type: 'user',
    invested: 7000,
    currentValue: 8540,
    pnl: 1540,
    pnlPercent: 22.0,
    apy: 178.4,
    manager: 'AITradeBot',
    risk: 'High'
  },
  {
    vault: 'Animal Memes Fund',
    type: 'user',
    invested: 5500,
    currentValue: 6817,
    pnl: 1317,
    pnlPercent: 23.9,
    apy: 132.7,
    manager: 'MemeKing',
    risk: 'High'
  }
]

export function VaultsDashboard() {
  const totalPnLPercent = (dashboardData.totalPnL / dashboardData.totalInvested) * 100

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Vault Trading Hub</h1>
          <p className="text-slate-400 mt-1">Copy the best traders and earn passive income</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${
              dashboardData.riskScore === 'Low' ? 'text-green-400 border-green-400/30' :
              dashboardData.riskScore === 'Medium' ? 'text-yellow-400 border-yellow-400/30' :
              'text-red-400 border-red-400/30'
            }`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {dashboardData.riskScore} Risk
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2" />
            Live Updates
          </Button>
        </div>
      </div>

      {/* 메인 통계 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 총 투자금 */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                USDC
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${dashboardData.totalInvested.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Total Invested
            </div>
          </CardContent>
        </Card>

        {/* 총 P&L */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                +{totalPnLPercent.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
              +${dashboardData.totalPnL.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Total P&L
            </div>
          </CardContent>
        </Card>

        {/* 활성 Vault */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                Active
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
              {dashboardData.activeVaults}
            </div>
            <div className="text-sm text-slate-400">
              Active Vaults
            </div>
          </CardContent>
        </Card>

        {/* 평균 APY */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                APY
              </Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">
              {dashboardData.avgApy}%
            </div>
            <div className="text-sm text-slate-400">
              Average APY
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 내 투자 현황 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Active Investments</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                +{totalPnLPercent.toFixed(1)}% Overall
              </Badge>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Manage All
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {myInvestments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    investment.type === 'protocol' ? 'bg-blue-400' : 'bg-purple-400'
                  }`} />
                  <div>
                    <div className="font-medium text-white">{investment.vault}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Manager: {investment.manager}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          investment.risk === 'Low' ? 'text-green-400 border-green-400/30' :
                          investment.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/30' :
                          'text-red-400 border-red-400/30'
                        }`}
                      >
                        {investment.risk}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm text-white">
                      ${investment.invested.toLocaleString()} → ${investment.currentValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Invested → Current</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">
                      +${investment.pnl.toLocaleString()} ({investment.pnlPercent}%)
                    </div>
                    <div className="text-xs text-slate-400">{investment.apy}% APY</div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-400/10">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 추가 통계 */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  ${dashboardData.dailyPnL.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Daily P&L</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  +${dashboardData.weeklyPnL.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Weekly P&L</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {dashboardData.followingManagers}
                </div>
                <div className="text-xs text-slate-400">Following Managers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">
                  {dashboardData.totalVaults}
                </div>
                <div className="text-xs text-slate-400">Available Vaults</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}