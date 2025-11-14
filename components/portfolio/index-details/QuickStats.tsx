/**
 * QuickStats Component
 * Displays key statistics for an index in a grid layout
 */

import { IndexData } from "@/lib/types/index";
import { formatDate } from "@/lib/utils/indexStatus";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface QuickStatsProps {
  index: IndexData;
}

export function QuickStats({ index }: QuickStatsProps) {
  const { formatFee } = useCurrency();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
        <div className="text-slate-400 text-xs mb-1">Total Investment</div>
        <div className="text-white font-semibold">{formatFee(index.totalInvestment)}</div>
      </div>
      <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
        <div className="text-slate-400 text-xs mb-1">Fee Paid</div>
        <div className="text-white font-semibold">{formatFee(index.fee)}</div>
      </div>
      <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
        <div className="text-slate-400 text-xs mb-1">Assets</div>
        <div className="text-white font-semibold">{index.assets.length}</div>
      </div>
      <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
        <div className="text-slate-400 text-xs mb-1">Launched</div>
        <div className="text-white font-semibold text-xs">{formatDate(index.launchedAt)}</div>
      </div>
    </div>
  );
}
