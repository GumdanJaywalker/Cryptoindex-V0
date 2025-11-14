"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MemeIndex } from "@/lib/types/index-trading";
import GraduationProgress, { type GraduationData } from "@/components/trading/GraduationProgress";
import Link from "next/link";
import { useCurrency } from "@/lib/hooks/useCurrency";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Clock
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  index?: MemeIndex | null;
};

export default function IndexDetailModal({ open, onClose, index }: Props) {
  const { formatPrice, formatVolume, currency } = useCurrency();

  if (!index) return null;

  // Get graduation data for L3 indexes
  const getGraduationData = (): GraduationData => {
    if (index.graduation) {
      return index.graduation;
    }
    // Fallback for indexes without graduation data
    return {
      liquidityProgress: 0,
      salesProgress: 0,
      status: 'launching'
    };
  };

  const isLayer3 = index.layerInfo?.layer === 'layer-3';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-teal-base/95 backdrop-blur-md border-teal">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-white text-2xl font-bold mb-2">
                {index.name}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">{index.symbol}</span>
                {index.layerInfo && (
                  <Badge
                    className={cn(
                      'text-xs border',
                      index.layerInfo.layer === 'layer-1' && 'border-blue-400 text-blue-400',
                      index.layerInfo.layer === 'layer-2' && 'border-orange-400 text-orange-400',
                      index.layerInfo.layer === 'layer-3' && 'border-red-400 text-red-400'
                    )}
                  >
                    {index.layerInfo.layer.toUpperCase()}
                  </Badge>
                )}
                {index.isHot && (
                  <Badge className="text-xs border border-white/10 text-brand">
                    🔥 HOT
                  </Badge>
                )}
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

          {/* Trading Statistics */}
          <div>
            <h3 className="text-white font-semibold mb-3">Trading Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 24h Volume */}
              <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">24h Volume</span>
                </div>
                <div className="text-white font-semibold">
                  {formatVolume(index.volume24h).text}
                </div>
              </div>

              {/* TVL */}
              <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Total Value Locked</span>
                </div>
                <div className="text-white font-semibold">
                  {formatVolume(index.tvl).text}
                </div>
              </div>

              {/* Market Cap */}
              <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Market Cap</span>
                </div>
                <div className="text-white font-semibold">
                  {formatVolume(index.marketCap).text}
                </div>
              </div>

              {/* 24h Change */}
              <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
                <div className="flex items-center gap-2 mb-2">
                  {index.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-xs text-slate-400">24h Change</span>
                </div>
                <div
                  className={cn(
                    'font-semibold',
                    index.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {index.change24h >= 0 ? '+' : ''}{index.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Graduation Progress (L3 only) */}
          {isLayer3 && index.graduation && (
            <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
              <h3 className="text-white font-semibold mb-3">Graduation Progress</h3>
              <GraduationProgress data={getGraduationData()} variant="full" />
            </div>
          )}

          {/* Composition Breakdown */}
          <div>
            <h3 className="text-white font-semibold mb-3">Asset Composition</h3>
            <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
              <div className="space-y-3">
                {index.assets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-teal last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-card/70 flex items-center justify-center text-xs font-bold">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{asset.name}</div>
                        <div className="text-slate-400 text-xs">{asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{asset.allocation}%</div>
                      <div className={cn(
                        'text-xs',
                        asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rebalancing Info */}
          {index.nextRebalancing && (
            <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand" />
                <h3 className="text-white font-semibold">Next Rebalancing</h3>
              </div>
              <p className="text-slate-400 text-sm">
                {new Date(index.nextRebalancing).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {/* Start Trading Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="bg-brand text-slate-950 font-medium hover:bg-brand/90 px-8"
              asChild
            >
              <Link href={`/trading?index=${index.id}`}>
                Start Trading
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
