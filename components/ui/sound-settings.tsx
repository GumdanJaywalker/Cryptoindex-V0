'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  Play, 
  Headphones,
  Gamepad2,
  Bell,
  MousePointer
} from 'lucide-react'
import { useSoundManager, SoundType } from '@/lib/sound/effects'
import { cn } from '@/lib/utils'

interface SoundSettingsProps {
  className?: string
  compact?: boolean
}

export function SoundSettings({ className, compact = false }: SoundSettingsProps) {
  const soundManager = useSoundManager()
  const [config, setConfig] = useState(soundManager.getConfig())
  const [testingSound, setTestingSound] = useState<SoundType | null>(null)

  // Update config when sound manager changes
  useEffect(() => {
    setConfig(soundManager.getConfig())
  }, [soundManager])

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0] / 100
    soundManager.setVolume(volume)
    setConfig(prev => ({ ...prev, volume }))
  }

  const handleEnabledChange = (enabled: boolean) => {
    soundManager.setEnabled(enabled)
    setConfig(prev => ({ ...prev, enabled }))
  }

  const handleUISoundsChange = (enabled: boolean) => {
    soundManager.setUISounds(enabled)
    setConfig(prev => ({ ...prev, uiSounds: enabled }))
  }

  const handleTradingSoundsChange = (enabled: boolean) => {
    soundManager.setTradingSounds(enabled)
    setConfig(prev => ({ ...prev, tradingSounds: enabled }))
  }

  const handleAlertSoundsChange = (enabled: boolean) => {
    soundManager.setAlertSounds(enabled)
    setConfig(prev => ({ ...prev, alertSounds: enabled }))
  }

  const testSound = async (soundType: SoundType, label: string) => {
    setTestingSound(soundType)
    soundManager.testSound(soundType)
    
    // Reset after animation
    setTimeout(() => {
      setTestingSound(null)
    }, 600)
  }

  const soundTests = [
    { type: SoundType.TRADE_SUCCESS, label: 'Trade Success', icon: '💰' },
    { type: SoundType.TRADE_ERROR, label: 'Trade Error', icon: '❌' },
    { type: SoundType.PRICE_ALERT, label: 'Price Alert', icon: '🔔' },
    { type: SoundType.BUTTON_CLICK, label: 'Button Click', icon: '🖱️' },
    { type: SoundType.WHALE_ALERT, label: 'Whale Alert', icon: '🐋' },
    { type: SoundType.BIG_MOVE, label: 'Big Move', icon: '📈' }
  ]

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {/* Quick toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEnabledChange(!config.enabled)}
          className={cn(
            "p-2 h-8 w-8",
            config.enabled 
              ? "text-brand hover:text-brand-hover" 
              : "text-slate-500 hover:text-slate-400"
          )}
        >
          {config.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>

        {/* Volume slider */}
        <div className="flex items-center gap-2 min-w-20">
          <Slider
            value={[config.volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={5}
            className="flex-1"
            disabled={!config.enabled}
          />
        </div>

        {/* Volume percentage */}
        <Badge variant="outline" className="text-xs min-w-12 justify-center">
          {Math.round(config.volume * 100)}%
        </Badge>
      </div>
    )
  }

  return (
    <Card className={cn("bg-slate-900/50 border-slate-800", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Headphones className="w-5 h-5 text-brand" />
          Sound Settings
          <Badge variant="outline" className="text-xs">
            {config.enabled ? 'ON' : 'OFF'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Enable Sounds</h4>
              <p className="text-sm text-slate-400">Master toggle for all audio</p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleEnabledChange}
            />
          </div>

          {config.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              {/* Volume Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">Master Volume</label>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(config.volume * 100)}%
                  </Badge>
                </div>
                <Slider
                  value={[config.volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Category Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">UI Sounds</span>
                  </div>
                  <Switch
                    checked={config.uiSounds}
                    onCheckedChange={handleUISoundsChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Trading Sounds</span>
                  </div>
                  <Switch
                    checked={config.tradingSounds}
                    onCheckedChange={handleTradingSoundsChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Alert Sounds</span>
                  </div>
                  <Switch
                    checked={config.alertSounds}
                    onCheckedChange={handleAlertSoundsChange}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sound Tests */}
        {config.enabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-white flex items-center gap-2">
              <Play className="w-4 h-4" />
              Test Sounds
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {soundTests.map(({ type, label, icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => testSound(type, label)}
                  disabled={testingSound === type}
                  className={cn(
                    "h-10 text-xs justify-start gap-2 border-slate-700 hover:border-brand/50 transition-all",
                    testingSound === type && "border-brand bg-brand/5 scale-95"
                  )}
                >
                  <span className="text-base">{icon}</span>
                  <span className="truncate">{label}</span>
                  
                  {testingSound === type && (
                    <motion.div
                      className="ml-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: 'linear' }}
                    >
                      <Settings className="w-3 h-3 text-brand" />
                    </motion.div>
                  )}
                </Button>
              ))}
            </div>

            <div className="text-xs text-slate-500 bg-slate-800/30 rounded-lg p-2">
              💡 Sounds will only play if your browser allows audio playback. 
              Some browsers require user interaction first.
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default SoundSettings