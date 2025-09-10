"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Globe, Activity, Timer } from "lucide-react";

type Status = "ok" | "degraded" | "down";

interface NetworkStatus {
  chainName: string;
  latencyMs: number | null;
  blockHeight: number | null;
  status: Status;
  lastUpdated: Date | null;
}

export function NetworkStatusWidget({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<NetworkStatus>({
    chainName: "Mainnet (Mock)",
    latencyMs: null,
    blockHeight: null,
    status: "degraded",
    lastUpdated: null,
  });

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    const tick = () => {
      // Mock latency between 45–180ms
      const latency = Math.floor(45 + Math.random() * 135);
      // Mock block height increments
      const nextHeight = (status.blockHeight ?? 21000000) + (Math.random() > 0.6 ? 1 : 0);
      const nextStatus: Status = latency < 120 ? "ok" : latency < 200 ? "degraded" : "down";
      setStatus({
        chainName: "Mainnet (Mock)",
        latencyMs: latency,
        blockHeight: nextHeight,
        status: nextStatus,
        lastUpdated: new Date(),
      });
    };

    // Initial update
    tick();
    intervalRef.current = setInterval(tick, 5000);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dotClass =
    status.status === "ok"
      ? "bg-green-500/80"
      : status.status === "degraded"
      ? "bg-yellow-400/80"
      : "bg-red-500/80";

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-white font-medium">Network</span>
        </div>
        <div className={cn("w-2 h-2 rounded-full", dotClass)} aria-label={status.status} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-[11px] text-slate-400">Latency</div>
            <div className="text-white font-semibold tabular-nums">
              {status.latencyMs !== null ? `${status.latencyMs} ms` : "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-[11px] text-slate-400">Block</div>
            <div className="text-white font-semibold tabular-nums">
              {status.blockHeight !== null ? status.blockHeight.toLocaleString() : "—"}
            </div>
          </div>
        </div>
        <div className="text-right self-center text-[11px] text-slate-400">
          {status.lastUpdated ? `${Math.max(0, Math.floor((Date.now() - status.lastUpdated.getTime()) / 1000))}s ago` : "—"}
        </div>
      </div>
    </div>
  );
}

export default NetworkStatusWidget;

