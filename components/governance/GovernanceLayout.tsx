'use client'

import { useState } from 'react'
import { GovernanceDashboard } from './GovernanceDashboard'
import { BattleVotesSection } from './BattleVotesSection'
import { RebalancingVotesSection } from './RebalancingVotesSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function GovernanceLayout() {
  const [activeTab, setActiveTab] = useState('battle')

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="px-6 py-8">
        {/* 거버넌스 대시보드 헤더 */}
        <GovernanceDashboard />
        
        {/* 투표 타입 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
            <TabsTrigger 
              value="battle" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-sm md:text-base"
            >
              <span className="mr-1 md:mr-2">🥊</span>
              <span className="hidden sm:inline">Battle Votes</span>
              <span className="sm:hidden">Battle</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rebalancing"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-sm md:text-base"
            >
              <span className="mr-1 md:mr-2">⚖️</span>
              <span className="hidden sm:inline">Rebalancing Votes</span>
              <span className="sm:hidden">Rebalancing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="battle" className="mt-6">
            <BattleVotesSection />
          </TabsContent>
          
          <TabsContent value="rebalancing" className="mt-6">
            <RebalancingVotesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}