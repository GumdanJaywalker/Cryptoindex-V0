'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Settings,
  Plus,
  Minus,
  X,
  BarChart3
} from 'lucide-react'

interface PositionsSectionProps {
  compact?: boolean
}

const positions = [
  {
    symbol: 'DOG_INDEX',
    side: 'Long',
    size: 150.0,
    entryPrice: 2.450,
    markPrice: 2.847,
    pnl: 5955.00,
    pnlPercent: 16.2,
    margin: 3675.00,
    liquidationPrice: 1.960,
    adlRank: 2,
    fundingRate: 0.0045,
    nextFunding: '7h 23m'
  },
  {
    symbol: 'CAT_INDEX',
    side: 'Long',
    size: 200.0,
    entryPrice: 1.180,
    markPrice: 1.234,
    pnl: 1080.00,
    pnlPercent: 4.6,
    margin: 2468.00,
    liquidationPrice: 0.944,
    adlRank: 1,
    fundingRate: -0.0023,
    nextFunding: '7h 23m'
  },
  {
    symbol: 'AI_INDEX',
    side: 'Short',
    size: -75.0,
    entryPrice: 6.890,
    markPrice: 6.789,
    pnl: 757.50,
    pnlPercent: 1.5,
    margin: 5091.75,
    liquidationPrice: 7.545,
    adlRank: 3,
    fundingRate: 0.0078,
    nextFunding: '7h 23m'
  },
  {
    symbol: 'MEME_INDEX',
    side: 'Long',
    size: 300.0,
    entryPrice: 0.892,
    markPrice: 0.847,
    pnl: -1350.00,
    pnlPercent: -5.0,
    margin: 2541.00,
    liquidationPrice: 0.714,
    adlRank: 4,
    fundingRate: 0.0034,
    nextFunding: '7h 23m'
  }
]

export function PositionsSection({ compact = false }: PositionsSectionProps) {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalMargin = positions.reduce((sum, pos) => sum + pos.margin, 0)

  const getADLColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-green-400 bg-green-400/10'
      case 2: return 'text-green-400 bg-green-400/10'
      case 3: return 'text-yellow-400 bg-yellow-400/10'
      case 4: return 'text-orange-400 bg-orange-400/10'
      case 5: return 'text-red-400 bg-red-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  if (compact) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Active Positions
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`${
                totalUnrealizedPnL >= 0 
                  ? 'text-green-400 border-green-400/30' 
                  : 'text-red-400 border-red-400/30'
              }`}
            >
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {positions.slice(0, 3).map((position, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{position.symbol}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className={position.side === 'Long' ? 'text-green-400' : 'text-red-400'}>
                      {position.side}
                    </span>
                    <span>{Math.abs(position.size)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    {position.pnl >= 0 ? '+' : ''}{position.pnlPercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3 border-slate-700 text-slate-300 hover:bg-slate-800">
            View All Positions
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Position Management
          </h2>
          <p className="text-slate-400 mt-1">Monitor and manage your active positions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${
              totalUnrealizedPnL >= 0 
                ? 'text-green-400 border-green-400/30' 
                : 'text-red-400 border-red-400/30'
            }`}
          >
            Total P&L: {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString()}
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* 포지션 테이블 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Symbol</TableHead>
                  <TableHead className="text-slate-400">Side/Size</TableHead>
                  <TableHead className="text-slate-400">Entry/Mark</TableHead>
                  <TableHead className="text-slate-400">PnL</TableHead>
                  <TableHead className="text-slate-400">Margin</TableHead>
                  <TableHead className="text-slate-400">Liq. Price</TableHead>
                  <TableHead className="text-slate-400">ADL</TableHead>
                  <TableHead className="text-slate-400">Funding</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position, index) => (
                  <TableRow 
                    key={index} 
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell>
                      <div className="font-medium text-white">{position.symbol}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${
                          position.side === 'Long' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.side}
                        </div>
                        <div className="text-xs text-slate-400">
                          {Math.abs(position.size).toFixed(1)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-white">${position.entryPrice.toFixed(3)}</div>
                        <div className="text-xs text-slate-400">${position.markPrice.toFixed(3)}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`text-sm font-semibold ${
                          position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                        </div>
                        <div className={`text-xs ${
                          position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}{position.pnlPercent}%
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-white">
                        ${position.margin.toLocaleString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-white">
                        ${position.liquidationPrice.toFixed(3)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getADLColor(position.adlRank)}`}
                      >
                        {position.adlRank}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`text-xs ${
                          position.fundingRate >= 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {position.fundingRate >= 0 ? '+' : ''}{(position.fundingRate * 100).toFixed(4)}%
                        </div>
                        <div className="text-xs text-slate-400">{position.nextFunding}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-green-400 hover:bg-green-400/10"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/10"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-400/10"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 포지션 통계 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {positions.length}
            </div>
            <div className="text-sm text-slate-400">Active Positions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Unrealized P&L</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              ${totalMargin.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Margin</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {positions.filter(p => p.pnl > 0).length}/{positions.length}
            </div>
            <div className="text-sm text-slate-400">Winning Positions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}