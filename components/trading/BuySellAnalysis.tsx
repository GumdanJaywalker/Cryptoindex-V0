'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap, 
  Info,
  ChevronRight
} from 'lucide-react'

const timeFrames = [
  { id: '5m', label: '5m', change: -1.39, color: 'text-red-400' },
  { id: '1h', label: '1h', change: +5.93, color: 'text-green-400' },
  { id: '4h', label: '4h', change: -1.77, color: 'text-red-400' },
  { id: '24h', label: '24h', change: -14.94, color: 'text-red-400' }
]

const tokenInfo = {
  totalSupply: '1B',
  holders: '16.14K',
  kycHolders: '698',
  devHolders: '--',
  smartMoneyHolders: '0.03%',
  influencersHolders: '--'
}

export function BuySellAnalysis() {
  const [activeTimeFrame, setActiveTimeFrame] = useState('24h')
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="h-full bg-teal-card border border-teal rounded-lg flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-3 border-b border-teal">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Buy & Sell Analysis</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {/* Time Frame Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {timeFrames.map((frame) => (
            <Button
              key={frame.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTimeFrame(frame.id)}
              className={`h-8 text-xs transition-all ${
                activeTimeFrame === frame.id
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  : 'border border-teal hover:border-teal text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <span>{frame.label}</span>
                <span className={`text-xs ${frame.color}`}>
                  {frame.change > 0 ? '+' : ''}{frame.change}%
                </span>
              </div>
            </Button>
          ))}
        </div>

        {/* Bought/Sold/Holding/PnL Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-teal-card/50 rounded p-2 text-center">
            <div className="text-xs text-slate-400">Bought</div>
            <div className="text-sm text-white font-medium">--</div>
          </div>
          <div className="bg-teal-card/50 rounded p-2 text-center">
            <div className="text-xs text-slate-400">Sold</div>
            <div className="text-sm text-white font-medium">--</div>
          </div>
          <div className="bg-teal-card/50 rounded p-2 text-center">
            <div className="text-xs text-slate-400">Holding</div>
            <div className="text-sm text-white font-medium">--</div>
          </div>
          <div className="bg-teal-card/50 rounded p-2 text-center">
            <div className="text-xs text-slate-400">PnL</div>
            <div className="text-sm text-white font-medium">--</div>
          </div>
        </div>

        {/* Token Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Token Info</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-400">Total Supply</span>
              </div>
              <span className="text-white font-medium">{tokenInfo.totalSupply}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-slate-400">Holders</span>
              </div>
              <span className="text-white font-medium">{tokenInfo.holders}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-green-400" />
                <span className="text-slate-400">KYC Holders</span>
              </div>
              <span className="text-white font-medium">{tokenInfo.kycHolders}</span>
            </div>

            {isHovered && (
              <div className="space-y-2 pt-2 border-t border-teal animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">DEV H.</span>
                  <span className="text-slate-500">{tokenInfo.devHolders}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Smart Money H.</span>
                  <span className="text-white font-medium">{tokenInfo.smartMoneyHolders}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Influencers H.</span>
                  <span className="text-slate-500">{tokenInfo.influencersHolders}</span>
                </div>

                {/* AI Token Narrative - only show on hover */}
                <div className="pt-2 border-t border-teal">
                  <div className="flex items-center gap-1 mb-2">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span className="text-xs font-semibold text-white">AI Token Narrative</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The index token's rapid traction stems from its niche as a decentralized infrastructure backbone for AI and DePIN networks, coupled with aggressive airdrop campaigns.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Analysis Visualization */}
        <div className="bg-teal-card/30 rounded p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Price Movement</span>
            <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
              Bearish
            </Badge>
          </div>
          
          {/* Simple price bars visualization */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Support</span>
              <span className="text-green-400">$1.18</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current</span>
              <span className="text-white">$1.234</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Resistance</span>
              <span className="text-red-400">$1.45</span>
            </div>
          </div>
          
          {/* Visual price bar */}
          <div className="mt-2 h-2 bg-teal-card/70 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative">
              <div 
                className="absolute top-0 w-1 h-full bg-white rounded-full shadow-sm"
                style={{ left: '45%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}