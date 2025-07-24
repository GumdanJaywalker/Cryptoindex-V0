'use client'

import { useState } from 'react'
import { BridgeDashboard } from './BridgeDashboard'
import { DepositInterface } from './DepositInterface'
import { WithdrawInterface } from './WithdrawInterface'
import { BridgeHistory } from './BridgeHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function BridgeLayout() {
  const [activeTab, setActiveTab] = useState('deposit')

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Bridge 대시보드 헤더 */}
        <BridgeDashboard />
        
        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-900 border border-slate-800">
            <TabsTrigger 
              value="deposit" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">💰</span>
              <span className="hidden sm:inline">Deposit</span>
              <span className="sm:hidden">In</span>
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">💸</span>
              <span className="hidden sm:inline">Withdraw</span>
              <span className="sm:hidden">Out</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">📊</span>
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Log</span>
            </TabsTrigger>
            <TabsTrigger 
              value="support"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">🆘</span>
              <span className="hidden sm:inline">Support</span>
              <span className="sm:hidden">Help</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-6">
            <DepositInterface />
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-6">
            <WithdrawInterface />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <BridgeHistory />
          </TabsContent>
          
          <TabsContent value="support" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-white mb-2">Support Center</h3>
              <p className="text-slate-400">Coming Soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}