/**
 * PerformanceChart Component
 * Displays index performance over time with timeframe selection
 */

"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import type { IndexData } from "@/lib/types/index";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const change = value > 100 ? `+${(value - 100).toFixed(2)}%` : `${(value - 100).toFixed(2)}%`;
    const changeColor = value > 100 ? "#4ade80" : "#dd7789";

    return (
      <div className="bg-teal-card/95 backdrop-blur-sm border border-teal rounded-lg p-3 shadow-lg">
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

interface PerformanceChartProps {
  index?: IndexData | null;
}

export function PerformanceChart({ index }: PerformanceChartProps) {
  const [tf, setTf] = useState<"7d" | "30d" | "90d">("30d");
  const [performanceData, setPerformanceData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!index || !index.assets || index.assets.length === 0) {
      setPerformanceData([]);
      return;
    }

    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const endTime = Date.now();
        const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
        const startTime = endTime - daysMap[tf] * 24 * 60 * 60 * 1000;

        const response = await fetch('/api/baskets/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assets: index.assets.map(asset => ({
              symbol: asset.symbol,
              weight: asset.allocation,
              side: asset.side,
              leverage: asset.leverage,
            })),
            interval: '1h',
            from: startTime,
            to: endTime,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch performance data');

        const data = await response.json();
        const chartData = data.basketPriceHistory.map((point: any) => ({
          date: new Date(point.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          value: point.price,
        }));

        setPerformanceData(chartData);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        setPerformanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [index, tf]);

  return (
    <div className="bg-teal-card/50 rounded-lg p-4 border border-teal">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Performance</h3>
        <div className="inline-flex rounded-lg p-1 bg-teal-card border border-teal">
          {(["7d", "30d", "90d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs transition-colors",
                tf === t
                  ? "bg-brand text-slate-950 font-medium"
                  : "text-slate-400 hover:bg-teal-card/50"
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
  );
}
