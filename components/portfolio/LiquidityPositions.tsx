"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import LiquidityModal from "@/components/trading/LiquidityModal"

type Position = {
  indexSymbol: string
  shares: number
  depositedUSD: number
  currentValueUSD: number
  apr: number
  feesAccruedUSD: number
}

const mockPositions: Position[] = [
  { indexSymbol: 'DOG_INDEX', shares: 123.4567, depositedUSD: 5000, currentValueUSD: 5485.2, apr: 27.4, feesAccruedUSD: 86.52 },
  { indexSymbol: 'AI_INDEX', shares: 78.9012, depositedUSD: 3500, currentValueUSD: 3712.8, apr: 31.2, feesAccruedUSD: 62.11 },
]

export function LiquidityPositions() {
  const [open, setOpen] = useState(false)
  const [activeSymbol, setActiveSymbol] = useState<string>('DOG_INDEX')

  const totalDeposited = mockPositions.reduce((a, p) => a + p.depositedUSD, 0)
  const totalValue = mockPositions.reduce((a, p) => a + p.currentValueUSD, 0)
  const totalFees = mockPositions.reduce((a, p) => a + p.feesAccruedUSD, 0)
  // Derived fee metrics (mock): infer from APR and current value
  const fees7d = mockPositions.reduce((a, p) => a + p.currentValueUSD * (p.apr / 100) * (7 / 365), 0)
  const fees30d = mockPositions.reduce((a, p) => a + p.currentValueUSD * (p.apr / 100) * (30 / 365), 0)
  const estFeesPerDay = mockPositions.reduce((a, p) => a + p.currentValueUSD * (p.apr / 100) * (1 / 365), 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
          <div>
            <div className="text-slate-400">Deposited</div>
            <div className="text-white font-semibold">${totalDeposited.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-400">Current Value</div>
            <div className="text-white font-semibold">${totalValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-400">Accrued Fees</div>
            <div className="text-white font-semibold">${totalFees.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400">Fees (7d)</div>
            <div className="text-white font-semibold">${fees7d.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400">Fees (30d)</div>
            <div className="text-white font-semibold">${fees30d.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400">Est. Fees (per day)</div>
            <div className="text-white font-semibold">${estFeesPerDay.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Positions list */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 px-4 py-3 text-xs text-slate-400 border-b border-slate-800">
            <div>Index</div>
            <div className="text-right">Shares</div>
            <div className="text-right">Deposited</div>
            <div className="text-right">Value</div>
            <div className="text-right flex items-center justify-end gap-1">
              <span>APR</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <div className="text-xs max-w-[220px]">
                      APR = Annual Percentage Rate (indicative, non-compounded)
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-right">Fees</div>
            <div className="text-center">Actions</div>
          </div>
          {mockPositions.map((p) => (
            <div key={p.indexSymbol} className="grid grid-cols-7 px-4 py-3 text-sm border-b border-slate-800/50">
              <div className="font-medium text-white">{p.indexSymbol}</div>
              <div className="text-right font-mono">{p.shares.toFixed(4)}</div>
              <div className="text-right">${p.depositedUSD.toLocaleString()}</div>
              <div className="text-right">${p.currentValueUSD.toLocaleString()}</div>
              <div className="text-right text-green-400">{p.apr.toFixed(1)}%</div>
              <div className="text-right">${p.feesAccruedUSD.toFixed(2)}</div>
              <div className="text-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs border-brand text-brand hover:bg-brand hover:text-black"
                  onClick={() => { setActiveSymbol(p.indexSymbol); setOpen(true) }}
                >
                  Add/Remove
                </Button>
              </div>
            </div>
          ))}
          {/* Add empty state */}
          {mockPositions.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-sm">No liquidity positions yet. Provide liquidity from Trading or here.</div>
          )}
        </CardContent>
      </Card>

      <LiquidityModal open={open} onOpenChange={setOpen} indexSymbol={activeSymbol} />
    </div>
  )
}

export default LiquidityPositions
