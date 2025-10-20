"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/utils/indexStatus";
import { IndexData } from "@/lib/types/index";
import { QuickStats } from "./index-details/QuickStats";
import { PerformanceChart } from "./index-details/PerformanceChart";
import { CompositionTable } from "./index-details/CompositionTable";
import { AllocationPieChart } from "./index-details/AllocationPieChart";

type Props = {
  open: boolean;
  onClose: () => void;
  index?: IndexData | null;
};

export default function IndexDetailsModal({ open, onClose, index }: Props) {
  if (!index) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border-slate-700">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-white text-2xl font-bold mb-2">
                {index.name}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">{index.symbol}</span>
                <Badge className={cn('text-xs border', getStatusColor(index.status))}>
                  {getStatusLabel(index.status)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          {index.description && (
            <div>
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-slate-400 text-sm">{index.description}</p>
            </div>
          )}

          {/* Quick Stats */}
          <QuickStats index={index} />

          {/* Performance Chart */}
          <PerformanceChart />

          {/* Composition Table */}
          <CompositionTable index={index} />

          {/* Allocation Pie Chart */}
          <AllocationPieChart index={index} />

          {/* Social Link */}
          {index.socialLink && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-2">Social</h3>
              <a
                href={index.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand/80 text-sm break-all"
              >
                {index.socialLink}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
