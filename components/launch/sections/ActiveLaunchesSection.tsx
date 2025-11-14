"use client";

import { cn } from "@/lib/utils";

interface ActiveLaunch {
  id: string;
  name: string;
  ticker: string;
  creator: string;
  fundingGoal: number;
  currentFunding: number;
  backers: number;
  endsIn: string;
  status: "active" | "funded" | "failed";
}

const EXAMPLE_LAUNCHES: ActiveLaunch[] = [
  {
    id: "1",
    name: "AI Giants Index",
    ticker: "AIGI",
    creator: "0x1234...5678",
    fundingGoal: 10000,
    currentFunding: 7500,
    backers: 42,
    endsIn: "2d 14h",
    status: "active",
  },
  {
    id: "2",
    name: "DeFi Blue Chips",
    ticker: "DEFI",
    creator: "0xabcd...ef01",
    fundingGoal: 5000,
    currentFunding: 5000,
    backers: 28,
    endsIn: "Funded",
    status: "funded",
  },
  {
    id: "3",
    name: "Meme Coins Basket",
    ticker: "MEME",
    creator: "0x9876...5432",
    fundingGoal: 8000,
    currentFunding: 3200,
    backers: 15,
    endsIn: "6h",
    status: "active",
  },
];

export function ActiveLaunchesSection() {
  return (
    <div className="mt-8">
      <h2 className="text-white text-xl font-semibold mb-4">Active Launches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAMPLE_LAUNCHES.map((launch) => {
          const fundingProgress = (launch.currentFunding / launch.fundingGoal) * 100;

          return (
            <div
              key={launch.id}
              className="bg-teal-card border border-teal rounded-lg p-4 space-y-3 hover:border-white/10 transition-colors cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold">{launch.name}</h3>
                  <div className="text-brand text-sm">${launch.ticker}</div>
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    launch.status === "funded"
                      ? "bg-green-500/20 text-green-400"
                      : launch.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  )}
                >
                  {launch.status === "funded"
                    ? "Funded"
                    : launch.status === "failed"
                    ? "Failed"
                    : "Active"}
                </div>
              </div>

              {/* Creator */}
              <div className="text-slate-400 text-xs">
                Created by{" "}
                <span className="text-white font-mono">{launch.creator}</span>
              </div>

              {/* Funding Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Funding Progress</span>
                  <span className="text-white font-medium">
                    {fundingProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-teal-elevated rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      launch.status === "funded"
                        ? "bg-green-500"
                        : launch.status === "failed"
                        ? "bg-red-500"
                        : "bg-brand"
                    )}
                    style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {launch.currentFunding.toLocaleString()} HYPE
                  </span>
                  <span className="text-slate-400">
                    Goal: {launch.fundingGoal.toLocaleString()} HYPE
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-teal">
                <div className="text-center">
                  <div className="text-white font-semibold">{launch.backers}</div>
                  <div className="text-slate-400 text-xs">Backers</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{launch.endsIn}</div>
                  <div className="text-slate-400 text-xs">
                    {launch.status === "funded" ? "Status" : "Ends in"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
