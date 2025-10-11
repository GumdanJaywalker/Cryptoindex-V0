'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { usePriceAlertsStore } from '@/lib/store/price-alerts'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { AllIndicesModal } from '@/components/modals/AllIndicesModal'
import useTradingStore from '@/lib/store/trading-store'
import { cn } from '@/lib/utils'
import { allMockIndices } from '@/lib/data/mock-indices'
import { useCurrency } from '@/lib/hooks/useCurrency'

export function LeftSidebar() {
  const { formatBalance, formatVolume } = useCurrency()
  const [addAlertOpen, setAddAlertOpen] = useState(false)
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [alertSymbol, setAlertSymbol] = useState('')
  const [alertType, setAlertType] = useState<'price' | 'percentage'>('percentage')
  // Price-based
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above')
  const [alertPrice, setAlertPrice] = useState('')
  // Percentage-based
  const [timeFrame, setTimeFrame] = useState<'5m' | '15m' | '1h' | '4h' | '24h'>('1h')
  const [percentageChange, setPercentageChange] = useState('')
  const [changeDirection, setChangeDirection] = useState<'increase' | 'decrease' | 'both'>('both')
  const [allIndicesOpen, setAllIndicesOpen] = useState(false)
  const { alerts, addAlert, removeAlert, toggleActive } = usePriceAlertsStore()
  const { addToast } = useToast()
  const { memeIndices, setSelectedIndex } = useTradingStore()

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="flex flex-col gap-3 p-3">
        {/* Market Stats Card */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-3">
          <h3 className="text-sm font-semibold text-white mb-2.5">Market Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Total Volume 24H</span>
              <span className="text-white text-xs font-medium">{formatVolume(12400000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Active Indices</span>
              <span className="text-brand text-xs font-medium">16</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Market 24h P&L</span>
              <span className="text-green-400 text-xs font-medium">+{formatVolume(1200000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Total TVL</span>
              <span className="text-white text-xs font-medium">{formatVolume(2800000000)}</span>
            </div>
          </div>
        </div>

        {/* Top Gainers Card */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-white">Top Gainers (1h)</h3>
            <button
              onClick={() => setAllIndicesOpen(true)}
              className="text-brand text-xs hover:text-brand/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
              <span className="text-white text-xs">DOG_INDEX</span>
              <span className="text-green-400 text-xs font-semibold">+24.8%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
              <span className="text-white text-xs">PEPE_INDEX</span>
              <span className="text-green-400 text-xs font-semibold">+18.2%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
              <span className="text-white text-xs">CAT_INDEX</span>
              <span className="text-red-400 text-xs font-semibold">-12.4%</span>
            </div>
          </div>
        </div>

        {/* Mini Portfolio Card */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-white">Portfolio</h3>
            <a href="/portfolio" className="text-brand text-xs hover:text-brand/80 transition-colors">View All</a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Total Value</span>
              <span className="text-white text-xs font-semibold">{formatBalance(8492.50)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Today's P&L</span>
              <div className="text-right">
                <div className="text-green-400 text-xs font-semibold">+{formatBalance(342.18)}</div>
                <div className="text-green-400 text-[10px]">+4.2%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">All-Time P&L</span>
              <div className="text-right">
                <div className="text-green-400 text-xs font-semibold">+{formatBalance(1042.50)}</div>
                <div className="text-green-400 text-[10px]">+14.0%</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-slate-400 text-xs">Win Rate</span>
              <span className="text-brand text-xs font-semibold">68.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Active Positions</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-xs font-semibold">3</span>
                <span className="text-[10px] text-slate-500">/ 12 total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Alerts Card */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-3">
          <h3 className="text-sm font-semibold text-white mb-2.5">Price Alerts</h3>
          <div className="space-y-1.5 text-xs">
            {alerts.length === 0 ? (
              <div className="text-slate-400 text-xs">No alerts yet. Create your first alert.</div>
            ) : (
              alerts.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-medium text-xs truncate">{a.symbol}</span>
                      {!a.active && <span className="text-[9px] text-slate-400">(paused)</span>}
                    </div>
                    {a.type === 'price' ? (
                      <span className="text-slate-400 text-[10px]">
                        {a.priceCondition === 'above' ? '>' : '<'} ${a.targetPrice?.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">
                        {a.changeDirection === 'both' ? '±' : a.changeDirection === 'increase' ? '+' : '-'}
                        {a.percentageChange}% in {a.timeFrame}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      className="text-[10px] px-1.5 py-0.5 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                      onClick={() => toggleActive(a.id)}
                    >
                      {a.active ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors"
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
                <button className="w-full px-2.5 py-1.5 text-[11px] text-brand border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors mt-1">
                  + Add Alert
                </button>
              </DialogTrigger>
              <DialogContent className="bg-slate-950 border-slate-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add Price Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Alert Type Selection */}
                  <div>
                    <Label className="text-slate-300 text-xs mb-2 block">Alert Type</Label>
                    <Select value={alertType} onValueChange={(v) => setAlertType(v as any)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="percentage" className="text-white">Percentage Change</SelectItem>
                        <SelectItem value="price" className="text-white">Price Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Index Selection */}
                  <div>
                    <Label className="text-slate-300 text-xs mb-2 block">Index</Label>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboboxOpen}
                          className="w-full justify-between bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                        >
                          {alertSymbol
                            ? allMockIndices.find((idx) => idx.symbol === alertSymbol)?.symbol
                            : "Select index..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0 bg-slate-900 border-slate-700">
                        <Command className="bg-slate-900">
                          <CommandInput placeholder="Search index..." className="text-white" />
                          <CommandList>
                            <CommandEmpty className="text-slate-400">No index found.</CommandEmpty>
                            <CommandGroup>
                              {allMockIndices.map((idx) => (
                                <CommandItem
                                  key={idx.id}
                                  value={idx.symbol}
                                  onSelect={(currentValue) => {
                                    setAlertSymbol(currentValue === alertSymbol ? "" : currentValue.toUpperCase())
                                    setComboboxOpen(false)
                                  }}
                                  className="text-white hover:bg-slate-800"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      alertSymbol === idx.symbol ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{idx.symbol}</span>
                                    <span className="text-xs text-slate-400 truncate">{idx.name}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Percentage-based Alert */}
                  {alertType === 'percentage' && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-slate-300 text-xs">Time Frame</Label>
                        <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v as any)}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="5m" className="text-white">5 minutes</SelectItem>
                            <SelectItem value="15m" className="text-white">15 minutes</SelectItem>
                            <SelectItem value="1h" className="text-white">1 hour</SelectItem>
                            <SelectItem value="4h" className="text-white">4 hours</SelectItem>
                            <SelectItem value="24h" className="text-white">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs">Change %</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={percentageChange}
                          onChange={(e) => setPercentageChange(e.target.value)}
                          className="bg-slate-900/50 border-slate-700 text-white"
                          placeholder="5.0"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs">Direction</Label>
                        <Select value={changeDirection} onValueChange={(v) => setChangeDirection(v as any)}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="both" className="text-white">Both</SelectItem>
                            <SelectItem value="increase" className="text-white">Increase</SelectItem>
                            <SelectItem value="decrease" className="text-white">Decrease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Price-based Alert */}
                  {alertType === 'price' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-slate-300 text-xs">Condition</Label>
                        <Select value={alertCondition} onValueChange={(v) => setAlertCondition(v as any)}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="above" className="text-white">Above</SelectItem>
                            <SelectItem value="below" className="text-white">Below</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs">Price (USD)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={alertPrice}
                          onChange={(e) => setAlertPrice(e.target.value)}
                          className="bg-slate-900/50 border-slate-700 text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setAddAlertOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-brand text-black hover:bg-brand-hover"
                      onClick={() => {
                        const sym = alertSymbol.trim().toUpperCase()
                        if (!sym) {
                          addToast(createErrorToast('Invalid alert', 'Please select an index'))
                          return
                        }

                        if (alertType === 'price') {
                          const priceNum = Number(alertPrice)
                          if (!Number.isFinite(priceNum) || priceNum <= 0) {
                            addToast(createErrorToast('Invalid price', 'Enter a valid price greater than 0'))
                            return
                          }
                          const saved = addAlert({
                            symbol: sym,
                            type: 'price',
                            priceCondition: alertCondition,
                            targetPrice: priceNum
                          })
                          addToast(createSuccessToast('Alert added', `${saved.symbol} ${saved.priceCondition} $${saved.targetPrice}`))
                        } else {
                          const pctNum = Number(percentageChange)
                          if (!Number.isFinite(pctNum) || pctNum <= 0) {
                            addToast(createErrorToast('Invalid percentage', 'Enter a valid percentage greater than 0'))
                            return
                          }
                          const saved = addAlert({
                            symbol: sym,
                            type: 'percentage',
                            timeFrame: timeFrame,
                            percentageChange: pctNum,
                            changeDirection: changeDirection
                          })
                          const directionText = changeDirection === 'both' ? '±' : changeDirection === 'increase' ? '+' : '-'
                          addToast(createSuccessToast('Alert added', `${saved.symbol} ${directionText}${saved.percentageChange}% in ${saved.timeFrame}`))
                        }

                        setAddAlertOpen(false)
                        // Reset form
                        setAlertSymbol('')
                        setAlertPrice('')
                        setPercentageChange('')
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

      {/* All Indices Modal */}
      <AllIndicesModal
        open={allIndicesOpen}
        onOpenChange={setAllIndicesOpen}
        indices={allMockIndices}
        initialFilter="gainers"
        onIndexSelect={setSelectedIndex}
      />
    </div>
  )
}

export default LeftSidebar
