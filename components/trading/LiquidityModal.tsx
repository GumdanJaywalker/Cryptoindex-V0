"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast, createSuccessToast, createErrorToast } from "@/components/notifications/toast-system"
import { useCurrency } from "@/lib/hooks/useCurrency"
import { LAYER_FEES } from "@/lib/constants/fees"
import { calculateTradingFee } from "@/lib/utils/fee-calculator"
import { getUserVIPTier, getIsInvitedUser } from "@/lib/mock/user-vip"

interface LiquidityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  indexSymbol: string
}

export function LiquidityModal({ open, onOpenChange, indexSymbol }: LiquidityModalProps) {
  const { addToast } = useToast()
  const { formatBalance, formatFee, formatGas, currency } = useCurrency()
  const [mode, setMode] = useState<"add" | "remove">("add")
  const [amount, setAmount] = useState<string>("")
  const [slippage, setSlippage] = useState<string>("0.50")
  const [submitting, setSubmitting] = useState(false)

  const parsedAmount = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) && n > 0 ? n : 0
  }, [amount])

  const est = useMemo(() => {
    // Simple mock estimation logic
    const usd = parsedAmount
    const shares = usd > 0 ? usd / 100 : 0
    const apr = 28.4

    // LP add/remove fee (using LP_FEE component)
    // Note: In real implementation, LP providers earn fees, not pay them
    // This is a simplified mock for demo purposes
    const fees = usd * LAYER_FEES.L1.LP_FEE // 0.4% LP fee
    const gas = 2.15
    return { usd, shares, apr, fees, gas }
  }, [parsedAmount])

  const disabled = submitting || parsedAmount <= 0

  const onSubmit = async () => {
    if (disabled) return
    try {
      setSubmitting(true)
      // simulate tx delay
      await new Promise((r) => setTimeout(r, 1000))
      addToast(
        createSuccessToast(
          mode === "add" ? "Liquidity added" : "Liquidity removed",
          `${indexSymbol} · ${formatBalance(est.usd)} · ~${est.shares.toFixed(4)} shares`
        )
      )
      onOpenChange(false)
      setAmount("")
    } catch (e: any) {
      addToast(createErrorToast("Action failed", e?.message || "Please try again"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-teal-card/90 border-teal">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            {mode === "add" ? "Provide Liquidity" : "Remove Liquidity"} — {indexSymbol}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Mode Switch */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className={mode === "add" ? "bg-brand text-black hover:bg-brand-hover" : "bg-teal-card text-slate-200 hover:bg-teal-card/70"}
              onClick={() => setMode("add")}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={mode === "remove" ? "border-brand text-brand hover:bg-brand/10" : "border-teal text-slate-300 hover:bg-teal-card/50"}
              onClick={() => setMode("remove")}
            >
              Remove
            </Button>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 gap-2">
            <Label className="text-slate-300 text-xs">Amount ({currency})</Label>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-teal-card border-teal text-white"
            />
          </div>

          {/* Slippage */}
          <div className="grid grid-cols-1 gap-2">
            <Label className="text-slate-300 text-xs">Slippage tolerance (%)</Label>
            <Input
              inputMode="decimal"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="bg-teal-card border-teal text-white"
            />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-teal-card/50 border border-teal">
              <div className="text-slate-400">Estimated Shares</div>
              <div className="text-white font-mono">{est.shares.toFixed(4)}</div>
            </div>
            <div className="p-3 rounded-lg bg-teal-card/50 border border-teal">
              <div className="text-slate-400">Est. APR</div>
              <div className="text-green-400 font-mono">{est.apr.toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-teal-card/50 border border-teal">
              <div className="text-slate-400">Fees</div>
              <div className="text-white font-mono">{formatFee(est.fees)}</div>
            </div>
            <div className="p-3 rounded-lg bg-teal-card/50 border border-teal">
              <div className="text-slate-400">Est. Gas</div>
              <div className="text-white font-mono">{formatGas(est.gas)}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="border-teal text-slate-300 hover:bg-teal-card/50"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-brand text-black hover:bg-brand-hover"
              onClick={onSubmit}
              disabled={disabled}
            >
              {submitting ? "Processing..." : mode === "add" ? "Confirm Add" : "Confirm Remove"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LiquidityModal

