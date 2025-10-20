/**
 * QuickStats Component
 * Displays key statistics for an index in a grid layout
 */

import { IndexData } from "@/lib/types/index";
import { formatDate } from "@/lib/utils/indexStatus";

interface QuickStatsProps {
  index: IndexData;
}

export function QuickStats({ index }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-xs mb-1">Total Investment</div>
        <div className="text-white font-semibold">{index.totalInvestment.toFixed(0)} HYPE</div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-xs mb-1">Fee Paid</div>
        <div className="text-white font-semibold">{index.fee.toFixed(2)} HYPE</div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-xs mb-1">Assets</div>
        <div className="text-white font-semibold">{index.assets.length}</div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="text-slate-400 text-xs mb-1">Launched</div>
        <div className="text-white font-semibold text-xs">{formatDate(index.launchedAt)}</div>
      </div>
    </div>
  );
}
