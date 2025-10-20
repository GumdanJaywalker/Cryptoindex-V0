'use client'

import { useState } from 'react'
import { AccountSummary } from './AccountSummary'
import { PositionsSection } from './PositionsSection'
import { TradingAnalytics } from './TradingAnalytics'
import { VotingPowerManager } from './VotingPowerManager'
import { PnLCardGenerator } from './PnLCardGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreatorEarnings } from './CreatorEarnings'
import { EarningsSummary } from './EarningsSummary'
import { LiquidityPositions } from './LiquidityPositions'
import { LaunchedIndexes } from './LaunchedIndexes'

export function PortfolioLayout() {
  const [activeTab, setActiveTab] = useState('positions')

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 계정 요약 */}
        <AccountSummary />
        
        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 bg-slate-900 border border-slate-800">
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Positions</span>
              <span className="sm:hidden">Pos</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="voting"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Voting Power</span>
              <span className="sm:hidden">Vote</span>
            </TabsTrigger>
            <TabsTrigger
              value="launch"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Launch</span>
              <span className="sm:hidden">Launch</span>
            </TabsTrigger>
            <TabsTrigger
              value="pnl-card"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">PnL Cards</span>
              <span className="sm:hidden">Card</span>
            </TabsTrigger>
            <TabsTrigger
              value="creator-earnings"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Creator Earnings</span>
              <span className="sm:hidden">Earnings</span>
            </TabsTrigger>
            <TabsTrigger
              value="liquidity"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Liquidity</span>
              <span className="sm:hidden">LP</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions" className="mt-6">
            <PositionsSection />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <TradingAnalytics />
          </TabsContent>
          
          <TabsContent value="voting" className="mt-6">
            <VotingPowerManager />
          </TabsContent>

          <TabsContent value="launch" className="mt-6">
            <LaunchedIndexes />
          </TabsContent>

          <TabsContent value="pnl-card" className="mt-6">
            <PnLCardGenerator />
          </TabsContent>
          
          <TabsContent value="creator-earnings" className="mt-6">
            <CreatorEarnings />
          </TabsContent>

          <TabsContent value="liquidity" className="mt-6">
            <LiquidityPositions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
