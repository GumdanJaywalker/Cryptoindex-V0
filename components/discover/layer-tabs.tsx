'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Shield, Swords, Rocket, Grid3x3 } from 'lucide-react'
import type { IndexLayer } from '@/lib/types/discover'

interface LayerTabsProps {
  selectedLayer: IndexLayer | 'all'
  onLayerChange: (layer: IndexLayer | 'all') => void
  className?: string
}

const LAYER_CONFIGS = {
  all: {
    label: 'All Layers',
    icon: Grid3x3,
    description: 'View all indexes',
    color: 'text-slate-400',
    activeColor: 'text-brand',
    borderColor: 'border-white/10',
    bgColor: 'bg-brand/10',
  },
  'layer-1': {
    label: 'Layer 1',
    icon: Shield,
    description: 'Institutional',
    badge: 'Low Risk',
    color: 'text-blue-400',
    activeColor: 'text-blue-400',
    borderColor: 'border-blue-400/50',
    bgColor: 'bg-blue-400/10',
    features: ['HOOATS Trading', 'Monthly Rebalance', 'DAO Governance'],
  },
  'layer-2': {
    label: 'Layer 2',
    icon: Swords,
    description: 'Mainstream Battle',
    badge: 'Medium Risk',
    color: 'text-purple-400',
    activeColor: 'text-purple-400',
    borderColor: 'border-purple-400/50',
    bgColor: 'bg-purple-400/10',
    features: ['VS Battles', 'Bi-weekly Rebalance', 'Community Voting'],
  },
  'layer-3': {
    label: 'Layer 3',
    icon: Rocket,
    description: 'Volatile Launchpad',
    badge: 'High Risk',
    color: 'text-brand',
    activeColor: 'text-brand',
    borderColor: 'border-white/10',
    bgColor: 'bg-brand/10',
    features: ['Bonding Curve', 'Graduation System', 'Early Access'],
  },
} as const

export function LayerTabs({ selectedLayer, onLayerChange, className }: LayerTabsProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(LAYER_CONFIGS).map(([key, config]) => {
          const Icon = config.icon
          const isActive = selectedLayer === key
          const layerKey = key as IndexLayer | 'all'

          return (
            <button
              key={key}
              onClick={() => onLayerChange(layerKey)}
              className={cn(
                'relative p-4 rounded-lg border transition-all duration-200',
                'hover:scale-[1.02] active:scale-[0.98]',
                isActive
                  ? `${config.borderColor} ${config.bgColor} shadow-lg`
                  : 'border-teal bg-teal-card/30 hover:glass-card-dynamic hover:border-teal'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? config.activeColor : config.color
                  )}
                />
                {config.badge && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs border-0 px-2 py-0',
                      isActive ? config.bgColor : 'bg-teal-card/50',
                      isActive ? config.activeColor : 'text-slate-500'
                    )}
                  >
                    {config.badge}
                  </Badge>
                )}
              </div>

              <div className="text-left">
                <div
                  className={cn(
                    'font-semibold mb-1 transition-colors',
                    isActive ? 'text-white' : 'text-slate-300'
                  )}
                >
                  {config.label}
                </div>
                <div
                  className={cn(
                    'text-sm transition-colors',
                    isActive ? config.activeColor : 'text-slate-500'
                  )}
                >
                  {config.description}
                </div>

                {/* Features (only show on hover for Layer 1-3) */}
                {config.features && (
                  <div className="mt-3 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {config.features.map((feature, index) => (
                      <div key={index} className="text-xs text-slate-600 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-teal-card/70" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-1 rounded-b-lg',
                    config.activeColor.replace('text-', 'bg-')
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Layer Info Banner (only when specific layer is selected) */}
      {selectedLayer !== 'all' && (
        <div
          className={cn(
            'mt-4 p-4 rounded-lg border',
            LAYER_CONFIGS[selectedLayer].borderColor,
            LAYER_CONFIGS[selectedLayer].bgColor
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {LAYER_CONFIGS[selectedLayer].features?.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      'text-xs border-0',
                      LAYER_CONFIGS[selectedLayer].bgColor,
                      LAYER_CONFIGS[selectedLayer].activeColor
                    )}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLayerChange('all')}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              View All Layers →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
