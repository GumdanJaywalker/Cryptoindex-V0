"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  VIP_PROTOCOL_FEES,
  LAYER_FEES,
  VIPTier
} from "@/lib/constants/fees";

interface LaunchSummaryProps {
  baseCost: number;
  feePercent: number;
  feeAmount: number;
  totalCost: number;
  canLaunch: boolean;
  onLaunch: () => void;
}

export function LaunchSummary({
  baseCost,
  feePercent,
  feeAmount,
  totalCost,
  canLaunch,
  onLaunch,
}: LaunchSummaryProps) {
  // Phase 0: Default to VIP2, Layer 3 (User-Created)
  const vipTier = VIPTier.VIP2;
  const protocolFee = VIP_PROTOCOL_FEES[vipTier];
  const creatorFee = LAYER_FEES.L3.CREATOR_FEE;
  const lpFee = LAYER_FEES.L3.LP_FEE; // 0% for bonding curve

  // Calculate fees (Launch Fee is now free)
  const protocolFeeAmount = baseCost * protocolFee;
  const creatorFeeAmount = baseCost * creatorFee;
  const lpFeeAmount = baseCost * lpFee;
  const totalTradingFees = protocolFeeAmount + creatorFeeAmount + lpFeeAmount;
  const totalWithFees = baseCost + totalTradingFees;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Launch Cost Summary</h3>
        <Badge className="bg-brand/20 text-brand border-white/10">
          {vipTier} - Layer 3
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Base Investment */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Base Investment</span>
          <span className="text-white font-medium">{baseCost.toFixed(2)} HYPE</span>
        </div>

        {/* Fee (Integrated) */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Fee</span>
            <div className="group relative">
              <Info className="h-3 w-3 text-slate-500 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-teal-elevated border border-teal rounded-lg p-3 shadow-lg text-xs w-64">
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

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Total Required</span>
          <span className="text-brand font-bold text-lg">
            {totalWithFees.toFixed(2)} HYPE
          </span>
        </div>
      </div>

      <Button
        onClick={onLaunch}
        disabled={!canLaunch}
        className={cn(
          "w-full bg-[#50d2c1] hover:bg-brand text-black font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-brand/50",
          !canLaunch && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none"
        )}
      >
        Launch Index
      </Button>
    </div>
  );
}
