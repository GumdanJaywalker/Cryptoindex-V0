'use client'

import { useState } from 'react'
import { X, TrendingUp, Users, Vote, BarChart3 } from 'lucide-react'

interface IndexInfoModalProps {
  isOpen: boolean
  onClose: () => void
  indexSymbol: string
}

const mockIndexData = {
  DOG_INDEX: {
    name: 'Doggy Index',
    description: 'A diversified index of top dog-themed memecoins',
    totalSupply: '10,000,000',
    marketCap: '$234.5M',
    nav: '$1.2345',
    inceptionDate: '2024-01-15',
    assets: [
      { symbol: 'DOGE', name: 'Dogecoin', weight: 35.5, price: '$0.08234' },
      { symbol: 'SHIB', name: 'Shiba Inu', weight: 28.2, price: '$0.000024' },
      { symbol: 'FLOKI', name: 'Floki Inu', weight: 15.8, price: '$0.000045' },
      { symbol: 'BONK', name: 'Bonk', weight: 12.3, price: '$0.000012' },
      { symbol: 'WIF', name: 'Dogwifhat', weight: 8.2, price: '$2.34' }
    ],
    performance: {
      '1d': 5.67,
      '7d': 12.34,
      '30d': -3.21,
      '1y': 234.56
    },
    voting: {
      currentVotes: 45234,
      totalVoters: 1234,
      nextRebalance: '2024-12-01'
    }
  }
}

export function IndexInfoModal({ isOpen, onClose, indexSymbol }: IndexInfoModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  if (!isOpen) return null

  const data = mockIndexData[indexSymbol as keyof typeof mockIndexData] || mockIndexData.DOG_INDEX

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-teal-card border border-teal rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐕</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{data.name}</h2>
              <p className="text-sm text-slate-400">{indexSymbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-teal-card/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-teal">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'composition', label: 'Composition', icon: TrendingUp },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'governance', label: 'Governance', icon: Vote }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-slate-300">{data.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-teal-card rounded-lg p-4">
                  <div className="text-sm text-slate-400">Market Cap</div>
                  <div className="text-lg font-semibold text-white">{data.marketCap}</div>
                </div>
                <div className="bg-teal-card rounded-lg p-4">
                  <div className="text-sm text-slate-400">NAV</div>
                  <div className="text-lg font-semibold text-white">{data.nav}</div>
                </div>
                <div className="bg-teal-card rounded-lg p-4">
                  <div className="text-sm text-slate-400">Total Supply</div>
                  <div className="text-lg font-semibold text-white">{data.totalSupply}</div>
                </div>
                <div className="bg-teal-card rounded-lg p-4">
                  <div className="text-sm text-slate-400">Inception</div>
                  <div className="text-lg font-semibold text-white">{data.inceptionDate}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'composition' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Asset Composition</h3>
              <div className="space-y-3">
                {data.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-teal-card rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{asset.symbol}</div>
                        <div className="text-sm text-slate-400">{asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{asset.weight}%</div>
                      <div className="text-sm text-slate-400">{asset.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.performance).map(([period, value]) => (
                  <div key={period} className="bg-teal-card rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400 mb-1">{period}</div>
                    <div className={`text-xl font-bold ${
                      value > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {value > 0 ? '+' : ''}{value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Governance Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-card rounded-lg p-4">
                    <div className="text-sm text-slate-400">Active Votes</div>
                    <div className="text-lg font-semibold text-white">{data.voting.currentVotes.toLocaleString()}</div>
                  </div>
                  <div className="bg-teal-card rounded-lg p-4">
                    <div className="text-sm text-slate-400">Total Voters</div>
                    <div className="text-lg font-semibold text-white">{data.voting.totalVoters.toLocaleString()}</div>
                  </div>
                  <div className="bg-teal-card rounded-lg p-4">
                    <div className="text-sm text-slate-400">Next Rebalance</div>
                    <div className="text-lg font-semibold text-white">{data.voting.nextRebalance}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-teal-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Voting Power</span>
                  <span className="text-blue-400">Your stake: 1,234 tokens</span>
                </div>
                <div className="w-full bg-teal-card/70 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
                <div className="text-sm text-slate-400 mt-2">You own 0.012% of voting power</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-teal">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Live data updated 2 seconds ago</span>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-teal-card/70 hover:bg-teal-card/60 text-white rounded-lg transition-colors">
              Add to Watchlist
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Trade {indexSymbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}