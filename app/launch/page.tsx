"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import ConfirmLaunchModal from "@/components/launch/ConfirmLaunchModal";
import LaunchSuccessModal from "@/components/launch/LaunchSuccessModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Type definitions
type PositionSide = "long" | "short";

type Asset = {
  symbol: string;
  name: string;
  marketType: "perp" | "spot";
};

type SelectedAsset = {
  symbol: string;
  name: string;
  side: PositionSide;
  leverage: number;
  marketType: "perp" | "spot";
};

type PortfolioComposition = {
  totalAmount: number;
  allocations: { [symbol: string]: number };
};

const POSITION_SIDES: PositionSide[] = ["long", "short"];

const clamp01_50 = (v: number) => Math.max(1, Math.min(50, Math.round(v)));

// Custom Chart Tooltip
const PreviewCustomTooltip = ({ active, payload, label, timeframe }: any) => {
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

export default function LaunchIndexPage() {
  const [period, setPeriod] = useState<"1H" | "1D">("1D");
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [indexName, setIndexName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [socialLink, setSocialLink] = useState("");

  // Mock assets (replace with real API later)
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: "BTC", name: "Bitcoin", marketType: "perp" },
    { symbol: "ETH", name: "Ethereum", marketType: "perp" },
    { symbol: "SOL", name: "Solana", marketType: "perp" },
    { symbol: "DOGE", name: "Dogecoin", marketType: "perp" },
    { symbol: "PEPE", name: "Pepe", marketType: "perp" },
  ]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedAsset[]>([]);
  const [composition, setComposition] = useState<PortfolioComposition>({
    totalAmount: 1000,
    allocations: {},
  });

  // Filter assets based on search
  const filtered = useMemo(() => {
    if (!search) return [] as Asset[];
    const q = search.toLowerCase();
    return assets
      .filter((a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q))
      .slice(0, 10);
  }, [assets, search]);

  // Add asset
  const addAsset = (a: Asset) => {
    setSelected((prev) => {
      if (prev.find((s) => s.symbol === a.symbol)) return prev;
      const next: SelectedAsset = {
        symbol: a.symbol,
        name: a.name,
        side: a.marketType === "spot" ? "long" : POSITION_SIDES[0],
        leverage: 1,
        marketType: a.marketType,
      };
      const newSelected = [...prev, next];

      // Auto-distribute allocations equally
      const evenSplit = 100 / newSelected.length;
      const newAllocations: { [symbol: string]: number } = {};
      newSelected.forEach((s) => {
        newAllocations[s.symbol] = evenSplit;
      });
      setComposition((prevComp) => ({
        ...prevComp,
        allocations: newAllocations,
      }));

      return newSelected;
    });
    setSearch("");
  };

  // Update asset
  const updateAsset = (symbol: string, patch: Partial<SelectedAsset>) => {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.symbol !== symbol) return s;
        if (s.marketType === "spot") {
          const filteredPatch: Partial<SelectedAsset> = { ...patch };
          if (filteredPatch.leverage !== undefined) {
            filteredPatch.leverage = 1;
          }
          if (filteredPatch.side && filteredPatch.side !== "long") {
            filteredPatch.side = "long";
          }
          return { ...s, ...filteredPatch };
        }
        return { ...s, ...patch };
      })
    );
  };

  // Remove asset
  const removeAsset = (symbol: string) => {
    setSelected((prev) => prev.filter((s) => s.symbol !== symbol));
    setComposition((prevComp) => {
      const newAllocations = { ...prevComp.allocations };
      delete newAllocations[symbol];

      const remainingSymbols = Object.keys(newAllocations);
      if (remainingSymbols.length > 0) {
        const evenSplit = 100 / remainingSymbols.length;
        remainingSymbols.forEach((sym) => {
          newAllocations[sym] = evenSplit;
        });
      }

      return {
        ...prevComp,
        allocations: newAllocations,
      };
    });
  };

  // Update allocation
  const updateAllocation = (symbol: string, percentage: number) => {
    setComposition((prev) => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [symbol]: Math.max(0, Math.min(100, percentage)),
      },
    }));
  };

  // Set total amount
  const setTotalAmount = (amount: number) => {
    setComposition((prev) => ({
      ...prev,
      totalAmount: Math.max(0, amount),
    }));
  };

  // Get asset amount
  const getAssetAmount = (symbol: string) => {
    const percentage = composition.allocations[symbol] || 0;
    return (percentage / 100) * composition.totalAmount;
  };

  // Total allocation
  const totalAllocation = useMemo(() => {
    return Object.values(composition.allocations).reduce((sum, pct) => sum + pct, 0);
  }, [composition.allocations]);

  // Allocation warning
  const allocationWarning = useMemo(() => {
    if (selected.length === 0) return null;
    const diff = Math.abs(totalAllocation - 100);
    if (diff > 0.1) return `Total allocation: ${totalAllocation.toFixed(1)}% (should be 100%)`;
    return null;
  }, [totalAllocation, selected.length]);

  // Auto-balance allocations
  const autoBalanceAllocations = () => {
    if (selected.length === 0) return;
    const evenSplit = 100 / selected.length;
    const newAllocations: { [symbol: string]: number } = {};

    selected.forEach((s, i) => {
      if (i === selected.length - 1) {
        const assigned = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
        newAllocations[s.symbol] = 100 - assigned;
      } else {
        newAllocations[s.symbol] = Math.floor(evenSplit * 10) / 10;
      }
    });

    setComposition((prev) => ({
      ...prev,
      allocations: newAllocations,
    }));
  };

  const totalCost = composition.totalAmount;
  const feeAmt = 0.1; // Fixed fee

  // Mock preview data
  const [previewData, setPreviewData] = useState<{ date: string; value: number }[] | null>(null);

  useEffect(() => {
    // Generate mock preview data
    if (selected.length === 0) {
      setPreviewData(null);
      return;
    }

    const data = Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      value: 100 + Math.random() * 20 - 10,
    }));
    setPreviewData(data);
  }, [selected, period]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-4 pt-4 pb-24">
        <div
          className="grid grid-cols-1
          lg:grid-cols-[260px_1fr]
          xl:grid-cols-[280px_1fr]
          2xl:grid-cols-[300px_1fr]
          gap-3 items-start lg:items-stretch"
        >
          <div className="order-2 lg:order-1">
            <LeftSidebar />
          </div>
          <main className="order-1 lg:order-2 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <section className="pb-6 border-b border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Launch Your Index</h3>
                  <p className="text-slate-400">Create and launch on Layer-3, graduate to Layer-2</p>
                </div>
                <Link href="/docs/launch-guide">
                  <Button variant="outline" size="sm" className="border-brand/30 bg-brand/10 text-brand hover:bg-brand/20">
                    Launch Guide
                  </Button>
                </Link>
              </div>

              {/* Layer-3 Launch Info */}
              <Card className="bg-slate-900/50 border-slate-800">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand font-medium">Layer-3 Launch</span>
                    <span className="text-xs text-slate-400">Bonding Curve → Funding Round → LP Round → Graduate</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400 mb-1">Target Raise</div>
                      <div className="text-white font-medium">$250K HYPE</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Timeline</div>
                      <div className="text-white font-medium">14-30 days</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Creator Fee</div>
                      <div className="text-white font-medium">0.02% in $HIIN</div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basics */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Basics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-slate-400 mb-1 text-sm">Index Name</div>
                    <Input
                      placeholder="Enter index name"
                      value={indexName}
                      onChange={(e) => setIndexName(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1 text-sm">Ticker</div>
                    <Input
                      placeholder="e.g., MYIDX"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1 text-sm">Description</div>
                    <textarea
                      rows={3}
                      placeholder="Describe your index"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1 text-sm">Social Link (Optional)</div>
                    <Input
                      placeholder="https://"
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Components */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Components</h3>
                  {allocationWarning && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-xs">{allocationWarning}</span>
                      <Button
                        onClick={autoBalanceAllocations}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-yellow-400/30 bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
                      >
                        Auto-fix
                      </Button>
                    </div>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  {search && filtered.length > 0 && (
                    <div className="absolute z-[100] mt-2 w-full bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-2 max-h-64 overflow-y-auto shadow-lg">
                      {filtered.map((a) => (
                        <button
                          key={a.symbol}
                          onClick={() => addAsset(a)}
                          className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-slate-800 transition-colors"
                        >
                          <div className="font-medium flex items-center gap-2">
                            {a.symbol}
                            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-white/10 text-slate-400">
                              {a.marketType}
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs">{a.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Assets */}
                <div className="space-y-3">
                  {selected.map((s) => (
                    <Card key={s.symbol} className="bg-slate-900 border-slate-700 p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-medium flex items-center gap-2">
                          <span>{s.symbol}</span>
                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-white/10 text-slate-400">
                            {s.marketType}
                          </span>
                          <span className="text-slate-400 text-xs">{s.name}</span>
                        </div>
                        <Button
                          onClick={() => removeAsset(s.symbol)}
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white h-7"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Side</div>
                          {s.marketType === "spot" ? (
                            <div className="text-xs text-white px-2 py-1 rounded-lg bg-white/10 inline-flex items-center gap-2">
                              Long
                              <span className="text-slate-400">(spot only)</span>
                            </div>
                          ) : (
                            <div className="inline-flex rounded-lg p-1 bg-slate-800 border border-slate-700">
                              {POSITION_SIDES.map((v) => (
                                <button
                                  key={v}
                                  onClick={() => updateAsset(s.symbol, { side: v })}
                                  className={cn(
                                    "px-2.5 py-1 rounded-md text-xs transition-colors",
                                    s.side === v
                                      ? "bg-brand text-slate-950 font-medium"
                                      : "text-slate-400 hover:bg-slate-700"
                                  )}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Leverage</div>
                          {s.marketType === "spot" ? (
                            <div className="text-xs text-white px-2 py-1 rounded-lg bg-white/10 inline-flex items-center gap-2">
                              1x
                              <span className="text-slate-400">(spot)</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                min={1}
                                max={50}
                                value={s.leverage}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || val === "0") {
                                    updateAsset(s.symbol, { leverage: 1 });
                                  } else {
                                    updateAsset(s.symbol, {
                                      leverage: clamp01_50(parseInt(val) || 1),
                                    });
                                  }
                                }}
                                className="w-16 bg-slate-900 border-slate-700 text-white text-center"
                              />
                              <input
                                type="range"
                                min={1}
                                max={50}
                                value={s.leverage}
                                onChange={(e) =>
                                  updateAsset(s.symbol, {
                                    leverage: clamp01_50(Number(e.target.value)),
                                  })
                                }
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Portfolio Composition */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Portfolio Composition</h3>
                    {selected.length > 0 && (
                      <Button
                        onClick={autoBalanceAllocations}
                        variant="ghost"
                        size="sm"
                        className="text-brand hover:text-brand/80"
                      >
                        Auto Balance
                      </Button>
                    )}
                  </div>

                  <Card className="bg-slate-900 border-slate-700 p-4 space-y-4">
                    {selected.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-slate-400 mb-2">No assets selected</div>
                        <div className="text-slate-500 text-sm">
                          Search and add assets above to start building your portfolio
                        </div>
                      </div>
                    ) : (
                      <>
                        {selected.map((s) => {
                          const percentage = composition.allocations[s.symbol] || 0;
                          const hybeAmount = getAssetAmount(s.symbol);
                          return (
                            <div key={s.symbol} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="text-white font-medium text-sm">
                                  {s.symbol}
                                  <span className="text-slate-400 ml-1 text-xs">({s.name})</span>
                                </div>
                                <div className="text-white text-sm">{hybeAmount.toFixed(2)} HYPE</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={Math.round(percentage)}
                                    onChange={(e) => updateAllocation(s.symbol, Number(e.target.value))}
                                    className="w-full"
                                  />
                                </div>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={Math.round(percentage)}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                      updateAllocation(s.symbol, 0);
                                    } else {
                                      const num = parseInt(val) || 0;
                                      updateAllocation(s.symbol, Math.max(0, Math.min(100, num)));
                                    }
                                  }}
                                  className="w-20 bg-slate-900 border-slate-700 text-white text-center"
                                />
                                <span className="text-slate-400 text-sm">%</span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {/* Total Investment */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-medium">Total Investment</div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={composition.totalAmount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setTotalAmount(val);
                            }}
                            className="w-32 bg-slate-900 border-slate-700 text-white text-right"
                          />
                          <span className="text-white">HYPE</span>
                        </div>
                      </div>
                      {selected.length > 0 && allocationWarning && (
                        <div className="text-yellow-400 text-xs mt-2">{allocationWarning}</div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Preview</h3>
                <Card className="bg-slate-900 border-slate-700 p-4">
                  <div className="inline-flex rounded-lg p-1 bg-slate-800 border border-slate-700 mb-3">
                    {(["1H", "1D"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-sm transition-colors",
                          period === p
                            ? "bg-brand text-slate-950 font-medium"
                            : "text-slate-400 hover:bg-slate-700"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={previewData ?? []}>
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          width={40}
                        />
                        <Tooltip
                          content={<PreviewCustomTooltip timeframe={period} />}
                          cursor={{ stroke: "#98FCE4", strokeWidth: 1, strokeDasharray: "3 3" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#98FCE4"
                          fill="#98FCE4"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card className="bg-slate-900 border-slate-700 p-4 text-slate-400 text-sm">
                  {previewData
                    ? "Preview uses live candles weighted by allocation, side, and leverage."
                    : selected.length === 0
                    ? "No assets selected — showing placeholder preview."
                    : "Preview unavailable"}
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Active Layer-3 Launches */}
      <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
        <div className="mb-6">
          <h3 className="text-white font-bold text-xl mb-2">Active Layer-3 Launches</h3>
          <p className="text-slate-400 text-sm">Indices currently in bonding curve phase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example Active Launch 1 */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-white font-bold text-lg mb-1">DOGE Leaders</div>
                  <div className="text-slate-400 text-xs">3 assets · Long 2x</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand font-medium">Bonding</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">$32.4K / $50K</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Current Price</div>
                    <div className="text-white font-medium">$0.00032</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Time Left</div>
                    <div className="text-white font-medium">18d 5h</div>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-brand/20 text-brand hover:bg-brand/30 border border-brand/30"
              >
                View Launch
              </Button>
            </CardContent>
          </Card>

          {/* Example Active Launch 2 */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-white font-bold text-lg mb-1">Cat Memes 5x</div>
                  <div className="text-slate-400 text-xs">4 assets · Long 5x</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand font-medium">Bonding</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">$41.2K / $50K</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Current Price</div>
                    <div className="text-white font-medium">$0.00041</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Time Left</div>
                    <div className="text-white font-medium">12d 3h</div>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-brand/20 text-brand hover:bg-brand/30 border border-brand/30"
              >
                View Launch
              </Button>
            </CardContent>
          </Card>

          {/* Example Active Launch 3 */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-white font-bold text-lg mb-1">AI Agents</div>
                  <div className="text-slate-400 text-xs">5 assets · Long 3x</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-400 font-medium">Funding</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">$156K / $200K</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Fixed Price</div>
                    <div className="text-white font-medium">$0.00050</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Time Left</div>
                    <div className="text-white font-medium">4d 18h</div>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 border border-yellow-400/30"
              >
                View Launch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex gap-8 text-white">
            <div>
              <div className="text-slate-400 text-xs">Total Cost</div>
              <div>{totalCost.toFixed(2)} HYPE</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Fee</div>
              <div className="flex items-center gap-1">
                <span>{feeAmt.toFixed(2)}</span>
                <span className="text-brand">$HIIN</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">HYPE Balance</div>
              <div>0.00 HYPE</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              Inline Swap
            </Button>
            <Button
              onClick={() => setShowLaunchModal(true)}
              disabled={selected.length === 0}
              className="bg-brand text-slate-950 font-medium hover:bg-brand/90 disabled:bg-brand/50"
            >
              Launch
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmLaunchModal
        open={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        onConfirm={() => {
          setShowLaunchModal(false);
          setShowSuccessModal(true);
        }}
        indexName={indexName}
        ticker={ticker}
        selectedAssets={selected.map((asset) => ({
          symbol: asset.symbol,
          name: asset.name,
          side: asset.side,
          leverage: asset.leverage,
          hypeAmount: composition.totalAmount * ((composition.allocations[asset.symbol] || 0) / 100),
          usdcAmount: composition.totalAmount * ((composition.allocations[asset.symbol] || 0) / 100),
          allocationPct: composition.allocations[asset.symbol] || 0,
        }))}
        totalCost={totalCost}
        feeAmount={feeAmt}
      />

      <LaunchSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        indexName={indexName}
        ticker={ticker}
      />
    </div>
  );
}
