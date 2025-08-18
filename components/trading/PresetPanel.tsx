'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, TrendingUp, TrendingDown } from 'lucide-react'

interface Preset {
  id: number
  name: string
  amount: string
  percentage: string
  slippage: string
  isActive: boolean
}

export function PresetPanel() {
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: 1,
      name: 'PRESET 1',
      amount: '0.001',
      percentage: '20%',
      slippage: '0.1%',
      isActive: true
    },
    {
      id: 2,
      name: 'PRESET 2',
      amount: '0.01',
      percentage: '50%',
      slippage: '0.1%',
      isActive: false
    },
    {
      id: 3,
      name: 'PRESET 3',
      amount: '0.1',
      percentage: '100%',
      slippage: '0.1%',
      isActive: false
    }
  ])

  const [showBuySettings, setShowBuySettings] = useState(false)
  const [showSellSettings, setShowSellSettings] = useState(false)

  const handlePresetClick = (presetId: number) => {
    setPresets(prev => prev.map(preset => ({
      ...preset,
      isActive: preset.id === presetId
    })))
  }

  const activePreset = presets.find(p => p.isActive)

  return (
    <div className="p-3 space-y-3">
      {/* 프리셋 버튼들 */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            variant={preset.isActive ? "default" : "outline"}
            size="sm"
            className={`
              text-xs h-8 transition-all duration-200
              ${preset.isActive 
                ? 'bg-brand text-black shadow-md hover:text-white' 
                : 'hover:bg-accent'
              }
            `}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Buy/Sell Settings 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setShowBuySettings(!showBuySettings)}
          variant="outline"
          size="sm"
          className={`
            text-xs h-8 flex items-center justify-center gap-1 transition-all duration-200
            ${showBuySettings ? 'bg-green-600/20 border-green-500 text-green-300' : 'hover:bg-accent'}
          `}
        >
          <TrendingUp size={12} />
          Buy settings
        </Button>
        <Button
          onClick={() => setShowSellSettings(!showSellSettings)}
          variant="outline"
          size="sm"
          className={`
            text-xs h-8 flex items-center justify-center gap-1 transition-all duration-200
            ${showSellSettings ? 'bg-red-600/20 border-red-500 text-red-300' : 'hover:bg-accent'}
          `}
        >
          <TrendingDown size={12} />
          Sell settings
        </Button>
      </div>

      {/* Buy Settings Panel */}
      {showBuySettings && (
        <div className="space-y-2 p-3 bg-card rounded-md border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-sm font-medium text-green-400">Buy Settings</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Slippage:</span>
              <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">
                0.1%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant="outline" className="text-xs">
                Normal
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MEV Protection:</span>
              <Badge variant="outline" className="text-xs text-green-300">
                On
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Sell Settings Panel */}
      {showSellSettings && (
        <div className="space-y-2 p-3 bg-card rounded-md border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-sm font-medium text-red-400">Sell Settings</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Slippage:</span>
              <Badge variant="outline" className="text-xs border-red-500/50 text-red-300">
                0.1%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant="outline" className="text-xs">
                Normal
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MEV Protection:</span>
              <Badge variant="outline" className="text-xs text-red-300">
                On
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* 활성 프리셋 정보 */}
      {activePreset && (
        <div className="space-y-2 p-2 bg-card/50 rounded-md border border-border/50">
          <div className="text-xs text-center text-muted-foreground mb-2">Active Preset</div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-foreground font-medium">{activePreset.amount}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Balance:</span>
            <span className="text-foreground font-medium">{activePreset.percentage}</span>
          </div>
        </div>
      )}
    </div>
  )
}