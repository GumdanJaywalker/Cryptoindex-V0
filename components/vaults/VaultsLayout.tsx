'use client'

import { useState } from 'react'
import { VaultsDashboard } from './VaultsDashboard'
import { FilterSearch } from './FilterSearch'
import { ProtocolVaults } from './ProtocolVaults'
import { UserVaults } from './UserVaults'
import { CreateVaultModal } from './CreateVaultModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function VaultsLayout() {
  const [activeTab, setActiveTab] = useState('overview')
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'aum',
    riskLevel: 'all',
    minAum: 0
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Vaults 대시보드 헤더 */}
        <VaultsDashboard />
        
        {/* 필터 및 검색 */}
        <FilterSearch filters={filters} onFiltersChange={setFilters} />
        
        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-900 border border-slate-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">📊</span>
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="protocol"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">🏛️</span>
              <span className="hidden sm:inline">Protocol</span>
              <span className="sm:hidden">Official</span>
            </TabsTrigger>
            <TabsTrigger 
              value="managers"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">👥</span>
              <span className="hidden sm:inline">Managers</span>
              <span className="sm:hidden">Copy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="create"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 text-xs sm:text-sm"
            >
              <span className="mr-1">➕</span>
              <span className="hidden sm:inline">Create</span>
              <span className="sm:hidden">New</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-8">
              <ProtocolVaults compact />
              <UserVaults compact />
            </div>
          </TabsContent>
          
          <TabsContent value="protocol" className="mt-6">
            <ProtocolVaults filters={filters} />
          </TabsContent>
          
          <TabsContent value="managers" className="mt-6">
            <UserVaults filters={filters} />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <CreateVaultModal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}