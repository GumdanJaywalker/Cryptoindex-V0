'use client'

import { useCurrency } from '@/lib/hooks/useCurrency'

export function AccountPanel() {
  const { formatBalance } = useCurrency()
  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--hl-bg-primary)' }}>
      <div className="flex-1 p-4 space-y-4">
        <button className="w-full py-3 rounded-lg font-medium transition-colors text-black hover:opacity-90" style={{ background: 'var(--hl-accent-primary)' }}>
          Connect Wallet
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="py-2 px-4 rounded text-sm transition-colors hl-text-primary hover:opacity-80" style={{ background: 'var(--hl-bg-tertiary)' }}>
            Perps ⇄ Spot
          </button>
          <button className="py-2 px-4 rounded text-sm transition-colors hl-text-primary hover:opacity-80" style={{ background: 'var(--hl-bg-tertiary)' }}>
            Withdraw
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--hl-border)' }}>
        <div className="hl-text-primary font-medium">Account Equity</div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="hl-text-secondary">Spot</span>
            <span className="hl-text-primary">{formatBalance(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Perps</span>
            <span className="hl-text-primary">{formatBalance(0)}</span>
          </div>
        </div>

        <div className="pt-3 space-y-2 text-sm" style={{ borderTop: '1px solid var(--hl-border)' }}>
          <div className="hl-text-primary font-medium">Perps Overview</div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Balance</span>
            <span className="hl-text-primary">{formatBalance(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Unrealized PNL</span>
            <span className="hl-text-primary">{formatBalance(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Cross Margin Ratio</span>
            <span className="hl-accent-green">0.00%</span>
          </div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Maintenance Margin</span>
            <span className="hl-text-primary">{formatBalance(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="hl-text-secondary">Cross Account Leverage</span>
            <span className="hl-text-primary">0.00x</span>
          </div>
        </div>
      </div>
    </div>
  )
}