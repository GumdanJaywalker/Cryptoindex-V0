/**
 * AllocationPieChart Component
 * Displays index allocation as a pie chart with legend
 */

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { IndexData } from "@/lib/types/index";

const COLORS = ["#98FCE4", "#8BD6FF", "#6BBDFF", "#72a59a", "#5a8a7f"];

interface AllocationPieChartProps {
  index: IndexData;
}

export function AllocationPieChart({ index }: AllocationPieChartProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Allocation Breakdown</h3>
      <div className="flex items-center gap-6">
        <div className="w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={index.assets}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
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
                  className="w-3 h-3 rounded-full flex-shrink-0"
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
  );
}
