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
import GraduationProgress, { type GraduationData } from "@/components/trading/GraduationProgress";
import { Button as TradeButton } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  index?: IndexData | null;
};

export default function IndexDetailsModal({ open, onClose, index }: Props) {
  if (!index) return null;

  // Generate graduation data based on index status
  const getGraduationData = (): GraduationData => {
    const statusMap: Record<string, GraduationData> = {
      'bonding': {
        liquidityProgress: Math.floor(Math.random() * 40) + 30,
        salesProgress: Math.floor(Math.random() * 40) + 20,
        status: 'launching'
      },
      'funding': {
        liquidityProgress: Math.floor(Math.random() * 20) + 70,
        salesProgress: Math.floor(Math.random() * 20) + 60,
        status: 'recruiting-liquidity'
      },
      'lp': {
        liquidityProgress: Math.floor(Math.random() * 10) + 85,
        salesProgress: Math.floor(Math.random() * 10) + 80,
        status: 'near-graduation'
      },
      'graduated': {
        liquidityProgress: 100,
        salesProgress: 100,
        status: 'graduated'
      }
    };
    return statusMap[index.status] || statusMap['bonding'];
  };

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

          {/* Graduation Progress */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <GraduationProgress data={getGraduationData()} variant="full" />
          </div>

          {/* Performance Chart */}
          <PerformanceChart index={index} />

          {/* Composition Table */}
          <CompositionTable index={index} />

          {/* Allocation Pie Chart */}
          <AllocationPieChart index={index} />

          {/* Trade Now Button */}
          <div className="flex justify-center pt-4">
            <TradeButton
              size="lg"
              className="bg-brand text-slate-950 font-medium hover:bg-brand/90 px-8"
              asChild
            >
              <Link href={`/trading?index=${index.id}`}>
                Start Trading
              </Link>
            </TradeButton>
          </div>

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
