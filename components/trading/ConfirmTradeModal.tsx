"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaticCurrencyDisplay } from "@/components/ui/static-currency-display";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfirmTradeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tradeData: {
    symbol: string;
    type: "buy" | "sell";
    orderType: "market" | "limit" | "stop-loss";
    quantity: number;
    price: number;
    limitPrice?: number;
    stopPrice?: number;
    subtotal: number;
    fee: number;
    total: number;
  } | null;
}

export default function ConfirmTradeModal({
  open,
  onClose,
  onConfirm,
  tradeData,
}: ConfirmTradeModalProps) {
  const { currency } = useCurrency();
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    console.log('ConfirmTradeModal handleConfirm called', { riskAcknowledged, tradeData });

    if (!riskAcknowledged || !tradeData) {
      console.log('Early return - riskAcknowledged:', riskAcknowledged, 'tradeData:', tradeData);
      return;
    }

    setIsConfirming(true);
    try {
      console.log('Calling onConfirm()');
      onConfirm();
      // Don't call handleClose() here - let the parent component close the modal
    } catch (error) {
      console.error("Trade confirmation failed:", error);
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    setRiskAcknowledged(false);
    setIsConfirming(false);
    onClose();
  };

  if (!tradeData) return null;

  const isBuy = tradeData.type === "buy";
  const shortSymbol = tradeData.symbol.replace("_INDEX", "");

  // Determine execution price based on order type
  const executionPrice =
    tradeData.orderType === "limit" && tradeData.limitPrice
      ? tradeData.limitPrice
      : tradeData.orderType === "stop-loss" && tradeData.stopPrice
      ? tradeData.stopPrice
      : tradeData.price;

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-teal" style={{ fontFamily: 'Arial, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Confirm {isBuy ? "Buy" : "Sell"} Order
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Type Badge */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                tradeData.orderType === "market" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                tradeData.orderType === "limit" && "bg-purple-500/20 text-purple-400 border border-purple-500/30",
                tradeData.orderType === "stop-loss" && "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              )}>
                {tradeData.orderType === "market" && "Market Order"}
                {tradeData.orderType === "limit" && "Limit Order"}
                {tradeData.orderType === "stop-loss" && "Stop Loss Order"}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="text-xs space-y-1">
                    {tradeData.orderType === "market" && (
                      <>
                        <div className="font-semibold">Market Order</div>
                        <div>• Executes immediately at current market price</div>
                        <div>• Expected slippage: ~0.1%</div>
                      </>
                    )}
                    {tradeData.orderType === "limit" && (
                      <>
                        <div className="font-semibold">Limit Order</div>
                        <div>• Executes only at your specified price or better</div>
                        <div>• May take time to fill or may not fill</div>
                      </>
                    )}
                    {tradeData.orderType === "stop-loss" && (
                      <>
                        <div className="font-semibold">Stop Loss Order</div>
                        <div>• Triggers a market order when stop price is reached</div>
                        <div>• Helps limit losses on existing positions</div>
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Trade Summary */}
            <Card className="bg-teal-card border-teal p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                Trade Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Index</span>
                  <span className="text-white font-medium text-base">{shortSymbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Action</span>
                  <span className={cn(
                    "font-medium text-base",
                    isBuy ? "text-green-400" : "text-red-400"
                  )}>
                    {isBuy ? "Buy" : "Sell"} (Spot)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white font-medium">
                    {tradeData.quantity.toFixed(4)} {shortSymbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">
                    {tradeData.orderType === "market" ? "Market Price" :
                     tradeData.orderType === "limit" ? "Limit Price" :
                     "Trigger Price"} ({currency})
                  </span>
                  <span className="text-white font-medium">
                    <StaticCurrencyDisplay value={executionPrice} decimalPlaces={4} />
                  </span>
                </div>
              </div>
            </Card>

            {/* Cost Breakdown */}
            <Card className="bg-teal-card border-teal p-4">
              <h3 className="text-white font-medium mb-3">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">
                    <StaticCurrencyDisplay value={tradeData.subtotal} decimalPlaces={2} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Trading Fee</span>
                  <span className="text-white">
                    <StaticCurrencyDisplay value={tradeData.fee} decimalPlaces={2} />
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-teal">
                  <span className="text-white font-medium">
                    {isBuy ? "Total Cost" : "Net Proceeds"}
                  </span>
                  <span className={cn(
                    "font-medium text-base",
                    isBuy ? "text-green-400" : "text-red-400"
                  )}>
                    <StaticCurrencyDisplay value={tradeData.total} decimalPlaces={2} />
                  </span>
                </div>
              </div>
            </Card>

            {/* Warning for Stop Loss */}
            {tradeData.orderType === "stop-loss" && (
              <Card className="bg-orange-500/10 border-orange-500/30 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-200 space-y-1">
                    <div className="font-medium">Stop Loss Warning</div>
                    <div className="text-orange-300/80">
                      This order will trigger a market order when the price reaches {" "}
                      <StaticCurrencyDisplay
                        value={tradeData.stopPrice || 0}
                        decimalPlaces={4}
                        className="font-medium"
                      />.
                      {" "}The actual execution price may vary due to slippage.
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Risk Acknowledgment */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={riskAcknowledged}
                  onCheckedChange={(checked) => setRiskAcknowledged(!!checked)}
                  className="mt-1"
                  disabled={isConfirming}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I understand this is a spot trading order and acknowledge the risks including price volatility,
                  potential slippage, and market fluctuations that may result in losses.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-teal text-slate-400 hover:text-white hover:bg-teal-elevated"
                disabled={isConfirming}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!riskAcknowledged || isConfirming}
                className={cn(
                  "flex-1 font-medium",
                  isBuy
                    ? "bg-brand text-slate-900 hover:bg-brand/90"
                    : "bg-[#dd5e56] text-white hover:bg-[#dd5e56]/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isConfirming ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing...</span>
                  </div>
                ) : (
                  `Confirm ${isBuy ? "Buy" : "Sell"}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
