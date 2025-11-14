/**
 * CompositionTable Component
 * Displays index asset composition in a table format
 */

import { IndexData } from "@/lib/types/index";
import { cn } from "@/lib/utils";

const COLORS = ["#75cfc1", "#8BD6FF", "#6BBDFF", "#72a59a", "#5a8a7f"];

interface CompositionTableProps {
  index: IndexData;
}

export function CompositionTable({ index }: CompositionTableProps) {
  return (
    <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
      <h3 className="text-white font-semibold mb-4">Composition</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-xs text-slate-400 pb-2 border-b border-teal">
          <div className="col-span-3">Asset</div>
          <div className="col-span-2">Symbol</div>
          <div className="col-span-2">Allocation</div>
          <div className="col-span-3">Side</div>
          <div className="col-span-2">Leverage</div>
        </div>
        <div className="space-y-2">
          {index.assets.map((item, i) => (
            <div key={`${item.symbol}-${i}`} className="grid grid-cols-12 items-center py-2 hover:bg-teal-card/50 rounded">
              <div className="col-span-3 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-white text-sm">{item.name}</span>
              </div>
              <div className="col-span-2 text-white text-sm font-medium">{item.symbol}</div>
              <div className="col-span-2 text-white text-sm">{item.allocation.toFixed(1)}%</div>
              <div className="col-span-3">
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    item.side === "long"
                      ? "bg-green-400/20 text-green-400"
                      : "bg-red-400/20 text-red-400"
                  )}
                >
                  {item.side.toUpperCase()}
                </span>
              </div>
              <div className="col-span-2 text-white text-sm">{item.leverage}x</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
