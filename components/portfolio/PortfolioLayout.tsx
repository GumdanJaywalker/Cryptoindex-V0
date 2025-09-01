'use client'

import { useState } from 'react'
import { AccountSummary } from './AccountSummary'
import { PositionsSection } from './PositionsSection'
import { TradingAnalytics } from './TradingAnalytics'
import { VotingPowerManager } from './VotingPowerManager'
import { PnLCardGenerator } from './PnLCardGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PortfolioLayout() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 계정 요약 */}
        <AccountSummary />
        
        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-900 border border-slate-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">📊</span>
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="positions"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">📈</span>
              <span className="hidden sm:inline">Positions</span>
              <span className="sm:hidden">Pos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">🎯</span>
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="voting"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">🗳️</span>
              <span className="hidden sm:inline">Voting Power</span>
              <span className="sm:hidden">Vote</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pnl-card"
              className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">🎨</span>
              <span className="hidden sm:inline">PnL Cards</span>
              <span className="sm:hidden">Card</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PositionsSection compact />
              <TradingAnalytics compact />
            </div>
          </TabsContent>
          
          <TabsContent value="positions" className="mt-6">
            <PositionsSection />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <TradingAnalytics />
          </TabsContent>
          
          <TabsContent value="voting" className="mt-6">
            <VotingPowerManager />
          </TabsContent>
          
          <TabsContent value="pnl-card" className="mt-6">
            <PnLCardGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}