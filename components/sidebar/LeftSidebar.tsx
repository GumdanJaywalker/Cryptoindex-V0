'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { usePriceAlertsStore } from '@/lib/store/price-alerts'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export function LeftSidebar() {
  const [addAlertOpen, setAddAlertOpen] = useState(false)
  const [alertSymbol, setAlertSymbol] = useState('DOG_INDEX')
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above')
  const [alertPrice, setAlertPrice] = useState('1.00')
  const { alerts, addAlert, removeAlert, toggleActive } = usePriceAlertsStore()
  const { addToast } = useToast()

  return (
    <div className="flex flex-col gap-4 lg:min-h-[calc(100vh-6rem)] lg:justify-center lg:pr-[1vw] lg:ml-[-1.5vw] lg:border-r lg:border-slate-800">
      {/* Network status moved to sticky footer */}

      {/* Market Stats Card (mock) */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Market Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Total Volume 24H</span>
            <span className="text-white font-medium">$12.4M</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Active Indices</span>
            <span className="text-brand font-medium">16</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Top Gainer</span>
            <span className="text-green-400 font-medium">+24.8%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Total TVL</span>
            <span className="text-white font-medium">$2.8B</span>
          </div>
        </div>
      </div>

      {/* Top Movers Card (mock) */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Top Movers</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-800/30 transition-colors">
            <span className="text-white text-sm">DOG_INDEX</span>
            <span className="text-green-400 font-semibold">+24.8%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-800/30 transition-colors">
            <span className="text-white text-sm">PEPE_INDEX</span>
            <span className="text-green-400 font-semibold">+18.2%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-slate-600 hover:bg-slate-800/30 transition-colors">
            <span className="text-white text-sm">CAT_INDEX</span>
            <span className="text-red-400 font-semibold">-12.4%</span>
          </div>
        </div>
      </div>

      {/* Mini Portfolio Card (mock) */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Portfolio</h3>
          <a href="/portfolio" className="text-brand text-xs hover:text-brand/80 transition-colors">View All</a>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total Value</span>
            <span className="text-white font-semibold">$8,492.50</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Today's P&L</span>
            <span className="text-green-400 font-semibold">+$342.18</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total Return</span>
            <span className="text-green-400 font-semibold">+12.4%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <span className="text-slate-400 text-sm">Active Positions</span>
            <span className="text-brand font-semibold">3</span>
          </div>
        </div>
      </div>

      {/* Recent Activity removed to save space */}

      {/* Price Alerts Card */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Price Alerts</h3>
        <div className="space-y-2 text-sm">
          {alerts.length === 0 ? (
            <div className="text-slate-400 text-xs">No alerts yet. Create your first alert.</div>
          ) : (
            alerts.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{a.symbol}</span>
                  <span className="text-slate-400">{a.condition === 'above' ? 'above' : 'below'}</span>
                  <span className="text-brand font-medium">${a.price.toLocaleString()}</span>
                  {!a.active && <span className="text-[10px] text-slate-400">(paused)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800"
                    onClick={() => toggleActive(a.id)}
                  >
                    {a.active ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10"
                    onClick={() => removeAlert(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <Dialog open={addAlertOpen} onOpenChange={setAddAlertOpen}>
            <DialogTrigger asChild>
              <button className="w-full px-3 py-2 text-xs text-brand border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors">
                + Add Alert
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>Add Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-slate-300 text-xs">Symbol</Label>
                    <Input value={alertSymbol} onChange={(e) => setAlertSymbol(e.target.value.toUpperCase())} />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Condition</Label>
                    <Select value={alertCondition} onValueChange={(v) => setAlertCondition(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Price (USD)</Label>
                    <Input value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAddAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-brand text-black hover:bg-brand-hover"
                    onClick={() => {
                      const sym = alertSymbol.trim().toUpperCase()
                      const priceNum = Number(alertPrice)
                      if (!sym || !Number.isFinite(priceNum) || priceNum <= 0) {
                        addToast(createErrorToast('Invalid alert', 'Enter a valid symbol and price'))
                        return
                      }
                      const saved = addAlert({ symbol: sym, condition: alertCondition, price: priceNum })
                      addToast(createSuccessToast('Alert added', `${saved.symbol} ${saved.condition} $${saved.price}`))
                      setAddAlertOpen(false)
                    }}
                  >
                    Save Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
