"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CompositionItem = {
  symbol: string;
  name: string;
  allocation: number;
  side: "long" | "short";
  leverage: number;
};

export type IndexDetails = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  socialLink: string;
  assets: CompositionItem[];
  totalInvestment: number;
  fee: number;
  launchedAt: string;
  status: "bonding" | "funding" | "lp" | "graduated";
};

type Props = {
  open: boolean;
  onClose: () => void;
  index?: IndexDetails | null;
};

const COLORS = ["#98FCE4", "#8BD6FF", "#6BBDFF", "#72a59a", "#5a8a7f"];

// Generate mock performance data
const generateMockPerformance = (days: number = 30) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Generate somewhat realistic performance data
    const baseValue = 100;
    const volatility = 15;
    const trend = (days - i) * 0.3; // Slight upward trend
    const randomWalk = (Math.random() - 0.5) * volatility;

    data.push({
      date: `${month}/${day}`,
      value: Math.max(50, baseValue + trend + randomWalk)
    });
  }

  return data;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const change = value > 100 ? `+${(value - 100).toFixed(2)}%` : `${(value - 100).toFixed(2)}%`;
    const changeColor = value > 100 ? "#10b981" : "#ef4444";

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-lg">
        <div className="text-white text-sm font-medium mb-1">{label}</div>
        <div className="text-white text-lg font-semibold">{value.toFixed(2)}</div>
        <div className="text-xs" style={{ color: changeColor }}>
          {change} from start
        </div>
      </div>
    );
  }
  return null;
};

export default function IndexDetailsModal({ open, onClose, index }: Props) {
  const [tf, setTf] = useState<"7d" | "30d" | "90d">("30d");

  if (!index) return null;

  // Generate mock performance data based on timeframe
  const performanceData = generateMockPerformance(
    tf === "7d" ? 7 : tf === "30d" ? 30 : 90
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bonding':
        return 'bg-brand/20 text-brand border-brand/30'
      case 'funding':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
      case 'lp':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/30'
      case 'graduated':
        return 'bg-green-400/20 text-green-400 border-green-400/30'
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700/30'
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bonding':
        return 'Bonding Curve'
      case 'funding':
        return 'Funding Round'
      case 'lp':
        return 'LP Round'
      case 'graduated':
        return 'Graduated'
      default:
        return status
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

          {/* Performance Chart */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Performance (Mock)</h3>
              <div className="inline-flex rounded-lg p-1 bg-slate-900 border border-slate-700">
                {(["7d", "30d", "90d"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTf(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs transition-colors",
                      tf === t
                        ? "bg-brand text-slate-950 font-medium"
                        : "text-slate-400 hover:bg-slate-800"
                    )}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    interval={Math.ceil(performanceData.length / 8)}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={40}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#8BD6FF", strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8BD6FF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#8BD6FF",
                      strokeWidth: 2,
                      stroke: "#ffffff"
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composition Table */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Composition</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs text-slate-400 pb-2 border-b border-slate-700">
                <div className="col-span-3">Asset</div>
                <div className="col-span-2">Symbol</div>
                <div className="col-span-2">Allocation</div>
                <div className="col-span-3">Side</div>
                <div className="col-span-2">Leverage</div>
              </div>
              <div className="space-y-2">
                {index.assets.map((item, i) => (
                  <div key={`${item.symbol}-${i}`} className="grid grid-cols-12 items-center py-2 hover:bg-slate-800/50 rounded">
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

          {/* Allocation Pie Chart */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Allocation Breakdown</h3>
            <div className="flex items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={index.assets}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="allocation"
                    >
                      {index.assets.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {index.assets.map((item, i) => (
                    <div key={`legend-${item.symbol}-${i}`} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">{item.symbol}</div>
                        <div className="text-slate-400 text-xs">{item.allocation.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
