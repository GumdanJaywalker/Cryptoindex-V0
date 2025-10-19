"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">Confirm Launch</DialogTitle>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Index Summary */}
          <Card className="bg-slate-900 border-slate-700 p-4">
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
                <div className="text-white">{totalCost.toFixed(2)} HYPE</div>
              </div>
            </div>
          </Card>

          {/* Asset Breakdown */}
          <Card className="bg-slate-900 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-3">Asset Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {selectedAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-medium text-xs">{asset.symbol}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        asset.side === "long"
                          ? "bg-green-400/20 text-green-400"
                          : "bg-red-400/20 text-red-400"
                      )}
                    >
                      {asset.side}
                    </span>
                    {asset.leverage > 1 && (
                      <span className="text-slate-400 text-xs">{asset.leverage}x</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xs">{asset.allocationPct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fees */}
          <Card className="bg-slate-900 border-slate-700 p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Creation Fee (Fixed)</span>
              <span className="text-white">{feeAmount.toFixed(2)} HYPE</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
              <span className="text-white font-medium">Total Required</span>
              <span className="text-white font-medium">
                {(totalCost + feeAmount).toFixed(2)} HYPE
              </span>
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
              className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
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
