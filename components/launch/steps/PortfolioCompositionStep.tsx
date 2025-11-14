"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SelectedAsset, PortfolioComposition } from "@/lib/types/launch";

interface PortfolioCompositionStepProps {
  selected: SelectedAsset[];
  composition: PortfolioComposition;
  setComposition: (value: PortfolioComposition) => void;
  assetsSelected: boolean;
  totalAllocation: number;
  autoBalanceAllocations: () => void;
}

export function PortfolioCompositionStep({
  selected,
  composition,
  setComposition,
  assetsSelected,
  totalAllocation,
  autoBalanceAllocations,
}: PortfolioCompositionStepProps) {
  const [isTotalAmountFocused, setIsTotalAmountFocused] = useState(false);

  const handleTotalAmountChange = (val: string) => {
    // Remove leading zeros
    const cleanedVal = val.replace(/^0+(\d)/, '$1');
    const num = parseFloat(cleanedVal);

    if (cleanedVal === '' || cleanedVal === '0') {
      setComposition({ ...composition, totalAmount: 0 });
    } else if (!isNaN(num) && num >= 0) {
      setComposition({ ...composition, totalAmount: num });
    }
  };

  const handleTotalAmountFocus = () => {
    setIsTotalAmountFocused(true);
  };

  const handleTotalAmountBlur = () => {
    setIsTotalAmountFocused(false);
  };

  const handleAllocationChange = (symbol: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setComposition({
        ...composition,
        allocations: { ...composition.allocations, [symbol]: num },
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Portfolio</h3>
      {!assetsSelected ? (
        <div className="text-slate-400 text-sm">Select at least 2 assets first</div>
      ) : (
        <>
          {/* Total Amount Input */}
          <div>
            <div className="text-slate-400 mb-1 text-sm">
              Total Amount (HYPE) <span className="text-red-400">*</span>
            </div>
            <Input
              type="number"
              placeholder="Min 100 HYPE"
              value={isTotalAmountFocused && composition.totalAmount === 0 ? '' : composition.totalAmount}
              onChange={(e) => handleTotalAmountChange(e.target.value)}
              onFocus={handleTotalAmountFocus}
              onBlur={handleTotalAmountBlur}
              className={cn(
                "bg-teal-card border-teal text-white",
                composition.totalAmount < 100 && "border-red-400"
              )}
            />
            {composition.totalAmount < 100 && (
              <div className="text-red-400 text-xs mt-1">
                Minimum 100 HYPE required
              </div>
            )}
          </div>

          {/* Allocation Sliders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-slate-400 text-sm">Allocations</div>
              <div
                className={cn(
                  "text-sm font-medium",
                  totalAllocation > 100
                    ? "text-red-400"
                    : totalAllocation < 100
                    ? "text-yellow-400"
                    : "text-brand"
                )}
              >
                {totalAllocation.toFixed(2)}%
              </div>
            </div>

            {selected.map((a) => {
              const allocation = composition.allocations[a.symbol] || 0;
              return (
                <div key={a.symbol} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Symbol */}
                    <span className="text-white w-20 text-sm">{a.symbol}</span>

                    {/* Input (direct input) */}
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.001}
                      value={allocation}
                      onChange={(e) => handleAllocationChange(a.symbol, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-16 h-7 text-xs bg-teal-card border-teal text-white text-right px-2"
                    />
                    <span className="text-slate-400 text-xs">%</span>

                    {/* Slider (rough adjustment) */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={allocation}
                      onChange={(e) =>
                        handleAllocationChange(a.symbol, e.target.value)
                      }
                      className="flex-1 accent-[#75cfc1]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allocation Status */}
          {totalAllocation !== 100 && (
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <span className="text-yellow-400 text-sm">
                {totalAllocation > 100
                  ? "Total allocation exceeds 100%"
                  : "Total allocation should equal 100%"}
              </span>
              <button
                onClick={autoBalanceAllocations}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black text-sm rounded transition-colors"
              >
                Auto Balance
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
