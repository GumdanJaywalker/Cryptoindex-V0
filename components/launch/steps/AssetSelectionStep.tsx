"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AssetSearchModal } from "@/components/launch/AssetSearchModal";
import type { Asset, SelectedAsset, PositionSide } from "@/lib/types/launch";

interface AssetSelectionStepProps {
  search: string;
  setSearch: (value: string) => void;
  filtered: Asset[];
  selected: SelectedAsset[];
  addAsset: (asset: Asset, side: PositionSide) => void;
  addAssets: (assets: Asset[], side: PositionSide) => void;
  updateAsset: (symbol: string, patch: Partial<SelectedAsset>) => void;
  removeAsset: (symbol: string) => void;
  basicsComplete: boolean;
  allocationWarning: string | null;
  autoBalanceAllocations: () => void;
}

export function AssetSelectionStep({
  search,
  setSearch,
  filtered,
  selected,
  addAsset,
  addAssets,
  updateAsset,
  removeAsset,
  basicsComplete,
  allocationWarning,
  autoBalanceAllocations,
}: AssetSelectionStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedSymbols = selected.map((a) => a.symbol);

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Components</h3>
      {!basicsComplete ? (
        <div className="text-slate-400 text-sm">Complete basics first</div>
      ) : (
        <>
          {/* Browse Assets Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#50d2c1] hover:bg-brand text-slate-900 font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Assets
          </Button>

          {/* Asset Search Modal */}
          <AssetSearchModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectAsset={addAsset}
            onSelectAssets={addAssets}
            selectedSymbols={selectedSymbols}
          />

          {/* Allocation Warning */}
          {allocationWarning && (
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <span className="text-yellow-400 text-sm">{allocationWarning}</span>
              <Button
                onClick={autoBalanceAllocations}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Auto Balance
              </Button>
            </div>
          )}

          {/* Selected Assets List */}
          <div className="space-y-2">
            {selected.map((a) => {
              const isSpot = a.marketType === "spot";
              return (
                <div
                  key={a.symbol}
                  className="p-3 bg-teal-card border border-teal rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium">{a.symbol}</div>
                    <button
                      onClick={() => removeAsset(a.symbol)}
                      className="text-slate-400 hover:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Position Side */}
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400 text-xs">Position:</div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded text-xs font-medium",
                        a.side === "long"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      )}
                    >
                      {a.side === "long" ? "Buy (Long)" : "Sell (Short)"}
                    </div>
                  </div>

                  {/* Phase 0: No Leverage - Fixed at 1x */}
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400 text-xs">Leverage:</div>
                    <div className="text-white text-sm">-</div>
                    <span className="text-xs text-slate-500">(Spot = 1x, no leverage)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selected.length === 0 && (
            <div className="text-slate-500 text-sm text-center py-8">
              No assets selected. Search and add assets above.
            </div>
          )}
        </>
      )}
    </div>
  );
}
