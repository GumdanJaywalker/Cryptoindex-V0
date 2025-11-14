"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = "md",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: "h-px",
    md: "h-0.5",
    lg: "h-1",
  };

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <div className="text-sm text-slate-400">{label}</div>}
          {showPercentage && (
            <div className="text-sm font-medium text-brand">
              {clampedProgress.toFixed(0)}%
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn("w-full bg-teal-elevated rounded-full overflow-visible", heights[size])}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-brand"
          style={{
            width: `${clampedProgress}%`,
            filter: clampedProgress > 0
              ? 'drop-shadow(0 0 8px rgba(117, 207, 193, 0.7))'
              : undefined
          }}
        />
      </div>
    </div>
  );
}
