"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { Info } from "lucide-react";
import { VIP_PROTOCOL_FEES, LAYER_FEES, VIPTier } from "@/lib/constants/fees";

type SelectedAsset = {
  symbol: string;
  name: string;
  side: "long" | "short";
  hypeAmount: number;
  usdcAmount: number;
  allocationPct: number;
  leverage: number;
};

interface ConfirmLaunchModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  indexName: string;
  ticker: string;
  selectedAssets: SelectedAsset[];
  totalCost: number;
  feeAmount: number;
}

export default function ConfirmLaunchModal({
  open,
  onClose,
  onConfirm,
  indexName,
  ticker,
  selectedAssets,
  totalCost,
  feeAmount,
}: ConfirmLaunchModalProps) {
  const { formatFee } = useCurrency();
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Calculate fees
  const vipTier = VIPTier.VIP2;
  const protocolFee = VIP_PROTOCOL_FEES[vipTier];
  const creatorFee = LAYER_FEES.L3.CREATOR_FEE;
  const lpFee = LAYER_FEES.L3.LP_FEE;

  // Calculate base cost (totalCost is already the base investment)
  const baseCost = totalCost;

  const protocolFeeAmount = baseCost * protocolFee;
  const creatorFeeAmount = baseCost * creatorFee;
  const lpFeeAmount = baseCost * lpFee;
  const totalTradingFees = protocolFeeAmount + creatorFeeAmount + lpFeeAmount;
  const totalWithFees = baseCost + totalTradingFees;

  const handleConfirm = () => {
    if (!riskAcknowledged || !termsAccepted) return;
    onConfirm();
  };

  const handleClose = () => {
    setRiskAcknowledged(false);
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-teal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Confirm Launch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Index Summary */}
          <Card className="glass-card border-teal p-4">
            <h3 className="text-white font-medium mb-3">Index Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Name</div>
                <div className="text-white">{indexName || "Unnamed Index"}</div>
              </div>
              <div>
                <div className="text-slate-400">Ticker</div>
                <div className="text-white">{ticker || "N/A"}</div>
              </div>
              <div>
                <div className="text-slate-400">Assets</div>
                <div className="text-white">{selectedAssets.length}</div>
              </div>
              <div>
                <div className="text-slate-400">Total Cost</div>
                <div className="text-white">{formatFee(totalCost)}</div>
              </div>
            </div>
          </Card>

          {/* Asset Breakdown */}
          <Card className="glass-card border-teal p-4">
            <h3 className="text-white font-medium mb-3">Asset Breakdown</h3>
            <div className="flex flex-col overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-teal-card/50 border-b border-teal text-xs font-medium text-slate-400">
                <div className="col-span-2 text-left">Symbol</div>
                <div className="col-span-3 text-left">Name</div>
                <div className="col-span-2 text-center">Side</div>
                <div className="col-span-2 text-center">Leverage</div>
                <div className="col-span-2 text-right">Allocation</div>
                <div className="col-span-1 text-right">HYPE</div>
              </div>

              {/* Table Body */}
              <div className="max-h-48 overflow-y-auto">
                {selectedAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="grid grid-cols-12 gap-2 px-3 py-2.5 text-sm hover:bg-teal-elevated/50 border-b border-teal/50"
                  >
                    {/* Symbol */}
                    <div className="col-span-2 text-white font-medium">
                      {asset.symbol}
                    </div>

                    {/* Name */}
                    <div className="col-span-3 text-slate-400 truncate">
                      {asset.name}
                    </div>

                    {/* Side */}
                    <div className="col-span-2 flex justify-center">
                      {asset.leverage === 1 ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          asset.side === "long"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-red-400/20 text-red-400"
                        )}>
                          {asset.side === "long" ? "Long" : "Short"}
                        </span>
                      )}
                    </div>

                    {/* Leverage */}
                    <div className="col-span-2 text-center text-white">
                      {asset.leverage === 1 ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        `${asset.leverage}x`
                      )}
                    </div>

                    {/* Allocation % */}
                    <div className="col-span-2 text-right text-white font-medium">
                      {asset.allocationPct.toFixed(2)}%
                    </div>

                    {/* HYPE Amount */}
                    <div className="col-span-1 text-right text-brand font-medium">
                      {asset.hypeAmount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Launch Cost Summary */}
          <Card className="glass-card border-teal p-4">
            <h3 className="text-white font-medium mb-3">Launch Cost Summary</h3>
            <div className="space-y-3">
              {/* Base Investment */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Base Investment</span>
                <span className="text-white font-medium">{baseCost.toFixed(2)} HYPE</span>
              </div>

              {/* Fee */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Fee</span>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-slate-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className="glass-card border border-teal rounded-lg p-3 shadow-lg text-xs w-64">
                        <div className="space-y-2">
                          <div className="text-brand font-medium mb-2">Trading Fees Breakdown</div>
                          <div>
                            <div className="text-white font-medium mb-1">Protocol Fee ({(protocolFee * 100).toFixed(2)}%)</div>
                            <div className="text-slate-400 mb-1">{protocolFeeAmount.toFixed(2)} HYPE</div>
                            <div className="text-slate-400 text-[10px]">Goes to protocol treasury. Rate based on VIP tier.</div>
                          </div>
                          <div>
                            <div className="text-white font-medium mb-1">Creator Fee ({(creatorFee * 100).toFixed(2)}%)</div>
                            <div className="text-slate-400 mb-1">{creatorFeeAmount.toFixed(2)} HYPE</div>
                            <div className="text-slate-400 text-[10px]">Paid to you as index creator on each trade.</div>
                          </div>
                          <div>
                            <div className="text-white font-medium mb-1">LP Fee ({(lpFee * 100).toFixed(2)}%)</div>
                            <div className="text-slate-400 mb-1">{lpFeeAmount.toFixed(2)} HYPE</div>
                            <div className="text-slate-400 text-[10px]">Layer 3 uses bonding curve (no LP fees).</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-white font-medium">{totalTradingFees.toFixed(2)} HYPE</span>
              </div>

              <div className="h-px bg-teal-elevated" />

              {/* Total Required */}
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Total Required</span>
                <span className="text-brand font-bold text-lg">
                  {totalWithFees.toFixed(2)} HYPE
                </span>
              </div>
            </div>
          </Card>

          {/* Risk Acknowledgment */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={riskAcknowledged}
                onCheckedChange={(checked) => setRiskAcknowledged(!!checked)}
                className="mt-1"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                I acknowledge that this index carries significant risk including total loss of
                capital, high volatility, and potential liquidation due to leverage.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                className="mt-1"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                I accept the Terms of Service and understand the platform fees and mechanics.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-teal text-slate-400 hover:text-white hover:bg-teal-elevated"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!riskAcknowledged || !termsAccepted}
              className={cn(
                "flex-1 bg-red-500 text-white font-medium hover:bg-red-600",
                "disabled:bg-red-500/50 disabled:cursor-not-allowed"
              )}
            >
              Launch Index
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
