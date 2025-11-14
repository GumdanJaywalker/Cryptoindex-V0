"use client";

import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import type { PreviewDataPoint } from "@/lib/types/launch";

interface BacktestingStepProps {
  period: "1d" | "7d" | "30d" | "1y" | "all";
  setPeriod: (value: "1d" | "7d" | "30d" | "1y" | "all") => void;
  previewData: PreviewDataPoint[];
  previewLoading: boolean;
  previewError: string | null;
  componentsValid: boolean;
  totalAmount: number;
}

export function BacktestingStep({
  period,
  setPeriod,
  previewData,
  previewLoading,
  previewError,
  componentsValid,
  totalAmount,
}: BacktestingStepProps) {
  // Calculate MDD (Maximum Drawdown)
  const mdd = useMemo(() => {
    if (previewData.length === 0) return 0;

    let maxDrawdown = 0;
    let peak = previewData[0].value;

    for (const point of previewData) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = ((peak - point.value) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }, [previewData]);

  // Calculate Sharpe Ratio
  const sharpeRatio = useMemo(() => {
    if (previewData.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < previewData.length; i++) {
      returns.push((previewData[i].value - previewData[i-1].value) / previewData[i-1].value);
    }

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Annualized Sharpe (assuming daily returns)
    const annualizedReturn = avgReturn * 365;
    const annualizedStdDev = stdDev * Math.sqrt(365);

    if (annualizedStdDev === 0) return 0;
    return annualizedReturn / annualizedStdDev;
  }, [previewData]);

  // Dynamic Y-axis domain based on totalAmount
  const yAxisDomain = useMemo<[number, number]>(() => {
    if (totalAmount === 0) return [0, 200];
    const minValue = totalAmount * 0.2;
    const maxValue = totalAmount * 3;
    return [minValue, maxValue];
  }, [totalAmount]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Backtesting</h3>
        {componentsValid && (
          <div className="flex gap-1 bg-teal-card p-1 rounded-lg">
            {(["1d", "7d", "30d", "1y", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  period === p
                    ? "bg-brand text-black"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {!componentsValid ? (
        <div className="h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center bg-teal-card/50 rounded-lg border border-teal">
          <div className="text-slate-500 text-sm">
            Complete components to see backtesting results
          </div>
        </div>
      ) : previewLoading ? (
        <div className="h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center bg-teal-card/50 rounded-lg border border-teal">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            <div className="text-slate-400 text-sm">Loading backtesting data...</div>
          </div>
        </div>
      ) : previewError ? (
        <div className="h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center bg-teal-card/50 rounded-lg border border-teal">
          <div className="text-red-400 text-sm">{previewError}</div>
        </div>
      ) : (
        <div className="bg-teal-card/50 rounded-lg border border-teal p-4">
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={previewData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#75cfc1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#75cfc1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: 10 }}
                tickLine={false}
                minTickGap={50}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: 10 }}
                tickLine={false}
                tickFormatter={(value) => `${value.toFixed(2)} HYPE`}
                domain={yAxisDomain}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(14, 40, 37, 0.8)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(117, 207, 193, 0.2)",
                  borderRadius: "8px",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                }}
                labelStyle={{ color: "#cbd5e1" }}
                itemStyle={{ color: "#75cfc1" }}
                formatter={(value: number) => [`${value.toFixed(2)} HYPE`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#75cfc1"
                fill="url(#previewGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Preview Stats */}
          {previewData.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-slate-400 text-xs">Start</div>
                <div className="text-white text-sm font-medium">
                  {previewData[0].value.toFixed(2)} HYPE
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Current</div>
                <div className="text-white text-sm font-medium">
                  {previewData[previewData.length - 1].value.toFixed(2)} HYPE
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Change</div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    previewData[previewData.length - 1].value >= previewData[0].value
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {(
                    ((previewData[previewData.length - 1].value - previewData[0].value) /
                      previewData[0].value) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">MDD</div>
                <div className="text-red-400 text-sm font-medium">
                  -{mdd.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Sharpe</div>
                <div className={cn(
                  "text-sm font-medium",
                  sharpeRatio >= 1 ? "text-green-400" : sharpeRatio >= 0 ? "text-white" : "text-red-400"
                )}>
                  {sharpeRatio.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
