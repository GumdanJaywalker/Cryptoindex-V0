/**
 * PerformanceChart Component
 * Displays index performance over time with timeframe selection
 */

"use client";

import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

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

export function PerformanceChart() {
  const [tf, setTf] = useState<"7d" | "30d" | "90d">("30d");

  // Generate mock performance data based on timeframe
  const performanceData = generateMockPerformance(
    tf === "7d" ? 7 : tf === "30d" ? 30 : 90
  );

  return (
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
  );
}
