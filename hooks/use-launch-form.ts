"use client";

import { useState, useMemo, useEffect } from "react";
import type {
  Asset,
  SelectedAsset,
  PortfolioComposition,
  PreviewDataPoint,
  PositionSide,
} from "@/lib/types/launch";

// Mock assets data (same as in page.tsx)
const MOCK_ASSETS: Asset[] = [
  { symbol: "BTC", name: "Bitcoin", marketType: "perp" },
  { symbol: "ETH", name: "Ethereum", marketType: "perp" },
  { symbol: "SOL", name: "Solana", marketType: "perp" },
  { symbol: "AVAX", name: "Avalanche", marketType: "perp" },
  { symbol: "MATIC", name: "Polygon", marketType: "perp" },
  { symbol: "DOGE", name: "Dogecoin", marketType: "spot" },
  { symbol: "SHIB", name: "Shiba Inu", marketType: "spot" },
  { symbol: "PEPE", name: "Pepe", marketType: "spot" },
  { symbol: "ARB", name: "Arbitrum", marketType: "perp" },
  { symbol: "OP", name: "Optimism", marketType: "perp" },
];

export function useLaunchForm() {
  // Basic info state
  const [indexName, setIndexName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [socialLink, setSocialLink] = useState("");

  // Asset selection state
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedAsset[]>([]);

  // Portfolio composition state
  const [composition, setComposition] = useState<PortfolioComposition>({
    totalAmount: 0,
    allocations: {},
  });

  // Preview state
  const [period, setPeriod] = useState<"1d" | "7d" | "30d" | "1y" | "all">("7d");
  const [previewData, setPreviewData] = useState<PreviewDataPoint[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Filtered assets based on search
  const filtered = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return MOCK_ASSETS.filter(
      (a) =>
        (a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) &&
        !selected.some((s) => s.symbol === a.symbol)
    );
  }, [search, selected]);

  // Helper: Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Helper: Check if ticker is already used
  const isTickerUnique = (tickerToCheck: string): boolean => {
    if (!tickerToCheck) return true;
    const existing = localStorage.getItem("launched-indexes");
    if (!existing) return true;
    const indexes = JSON.parse(existing);
    return !indexes.some(
      (idx: any) => idx.symbol.toUpperCase() === tickerToCheck.toUpperCase()
    );
  };

  // Validation: Basics complete
  const basicsComplete = useMemo(() => {
    const tickerValid =
      ticker.trim().length >= 3 &&
      ticker.trim().length <= 8 &&
      /^[A-Z0-9-]+$/.test(ticker) &&
      isTickerUnique(ticker);

    const socialLinkValid = !socialLink || isValidUrl(socialLink);

    return (
      indexName.trim().length >= 3 &&
      indexName.trim().length <= 50 &&
      tickerValid &&
      description.trim().length >= 10 &&
      description.trim().length <= 500 &&
      socialLinkValid
    );
  }, [indexName, ticker, description, socialLink]);

  // Total allocation percentage
  const totalAllocation = useMemo(() => {
    return Object.values(composition.allocations).reduce((sum, val) => sum + val, 0);
  }, [composition.allocations]);

  // Allocation warning
  const allocationWarning = useMemo(() => {
    if (selected.length === 0) return null;
    if (totalAllocation < 99.95) return "Total allocation is less than 100%";
    if (totalAllocation > 100.05) return "Total allocation exceeds 100%";
    return null;
  }, [selected.length, totalAllocation]);

  // Validation: Assets selected (to show Portfolio step)
  const assetsSelected = useMemo(() => {
    return selected.length >= 2;
  }, [selected.length]);

  // Validation: Components valid (full validation for launch)
  const componentsValid = useMemo(() => {
    return (
      selected.length >= 2 &&
      Math.abs(totalAllocation - 100) < 0.05 &&
      composition.totalAmount >= 100
    );
  }, [selected.length, totalAllocation, composition.totalAmount]);

  // Can launch?
  const canLaunch = useMemo(() => {
    return basicsComplete && componentsValid;
  }, [basicsComplete, componentsValid]);

  // Wizard step calculation
  const currentStep = useMemo(() => {
    if (!basicsComplete) return 1;
    if (selected.length === 0) return 2;
    if (!componentsValid) return 3;
    return 4;
  }, [basicsComplete, selected.length, componentsValid]);

  // Progress calculation (0-100)
  const progress = useMemo(() => {
    let completedSteps = 0;
    if (basicsComplete) completedSteps += 25;
    if (selected.length >= 2) completedSteps += 25;
    if (selected.length >= 2 && Math.abs(totalAllocation - 100) < 0.05) completedSteps += 25;
    if (selected.length >= 2 && composition.totalAmount >= 100) completedSteps += 25;
    return completedSteps;
  }, [basicsComplete, selected.length, totalAllocation, composition.totalAmount]);

  // Cost calculations
  const baseCost = useMemo(() => composition.totalAmount, [composition.totalAmount]);
  const feePercent = 2;
  const feeAmount = useMemo(() => baseCost * (feePercent / 100), [baseCost]);
  const totalCost = useMemo(() => baseCost + feeAmount, [baseCost, feeAmount]);

  // Add asset
  const addAsset = (a: Asset, side: PositionSide) => {
    const newAsset: SelectedAsset = {
      symbol: a.symbol,
      name: a.name,
      side: side,
      leverage: a.marketType === "spot" ? 1 : 5,
      marketType: a.marketType,
    };
    setSelected(prev => {
      const newSelected = [...prev, newAsset];

      // Auto-distribute allocations
      const equalShare = 100 / newSelected.length;
      const newAllocations: { [symbol: string]: number } = {};
      newSelected.forEach((asset) => {
        newAllocations[asset.symbol] = equalShare;
      });
      setComposition(prevComp => ({ ...prevComp, allocations: newAllocations }));

      return newSelected;
    });
  };

  // Add multiple assets at once
  const addAssets = (assets: Asset[], side: PositionSide) => {
    setSelected(prev => {
      const newAssets: SelectedAsset[] = assets.map(a => ({
        symbol: a.symbol,
        name: a.name,
        side: side,
        leverage: a.marketType === "spot" ? 1 : 5,
        marketType: a.marketType,
      }));

      const newSelected = [...prev, ...newAssets];

      // Auto-distribute allocations
      const equalShare = 100 / newSelected.length;
      const newAllocations: { [symbol: string]: number } = {};
      newSelected.forEach((asset) => {
        newAllocations[asset.symbol] = equalShare;
      });
      setComposition(prevComp => ({ ...prevComp, allocations: newAllocations }));

      return newSelected;
    });
  };

  // Update asset
  const updateAsset = (symbol: string, patch: Partial<SelectedAsset>) => {
    setSelected((prev) =>
      prev.map((a) => {
        if (a.symbol !== symbol) return a;
        const updated = { ...a, ...patch };
        // Spot markets: force long + leverage 1
        if (updated.marketType === "spot") {
          updated.side = "long";
          updated.leverage = 1;
        }
        return updated;
      })
    );
  };

  // Remove asset
  const removeAsset = (symbol: string) => {
    const newSelected = selected.filter((a) => a.symbol !== symbol);
    setSelected(newSelected);

    // Remove allocation and rebalance
    const { [symbol]: _, ...remainingAllocations } = composition.allocations;
    if (newSelected.length === 0) {
      setComposition({ ...composition, allocations: {} });
    } else {
      const totalRemaining = Object.values(remainingAllocations).reduce(
        (sum, val) => sum + val,
        0
      );
      if (totalRemaining === 0) {
        // Auto-balance if all were 0
        const equalShare = 100 / newSelected.length;
        const newAllocations: { [symbol: string]: number } = {};
        newSelected.forEach((asset) => {
          newAllocations[asset.symbol] = equalShare;
        });
        setComposition({ ...composition, allocations: newAllocations });
      } else {
        setComposition({ ...composition, allocations: remainingAllocations });
      }
    }
  };

  // Auto-balance allocations
  const autoBalanceAllocations = () => {
    if (selected.length === 0) return;
    const equalShare = 100 / selected.length;
    const newAllocations: { [symbol: string]: number } = {};
    selected.forEach((a) => {
      newAllocations[a.symbol] = equalShare;
    });
    setComposition({ ...composition, allocations: newAllocations });
  };

  // Fetch preview data
  useEffect(() => {
    if (!componentsValid) {
      setPreviewData([]);
      setPreviewError(null);
      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);

    // Simulate API call
    const timer = setTimeout(() => {
      try {
        // Generate mock preview data
        const points: PreviewDataPoint[] = [];
        const now = Date.now();

        // Determine interval and count based on period
        let intervalMs: number;
        let count: number;

        if (period === "1d") {
          intervalMs = 3600000; // 1 hour
          count = 24;
        } else if (period === "7d") {
          intervalMs = 3600000 * 6; // 6 hours
          count = 28;
        } else if (period === "30d") {
          intervalMs = 3600000 * 24; // 1 day
          count = 30;
        } else if (period === "1y") {
          intervalMs = 3600000 * 24 * 7; // 1 week
          count = 52;
        } else { // "all"
          intervalMs = 3600000 * 24; // 1 day
          count = 365;
        }

        let baseValue = composition.totalAmount || 100;
        for (let i = 0; i < count; i++) {
          const time = new Date(now - (count - i - 1) * intervalMs);
          const timeStr =
            period === "1d"
              ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : time.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          // Random walk with crypto-like volatility
          baseValue = baseValue * (1 + (Math.random() - 0.5) * 0.2);
          points.push({ time: timeStr, value: baseValue });
        }

        setPreviewData(points);
        setPreviewLoading(false);
      } catch (err) {
        setPreviewError("Failed to load preview");
        setPreviewLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [period, totalAllocation, composition.totalAmount, componentsValid]);

  return {
    // Basic info
    indexName,
    setIndexName,
    ticker,
    setTicker,
    description,
    setDescription,
    socialLink,
    setSocialLink,

    // Asset selection
    search,
    setSearch,
    filtered,
    selected,
    addAsset,
    addAssets,
    updateAsset,
    removeAsset,

    // Portfolio composition
    composition,
    setComposition,
    totalAllocation,
    allocationWarning,
    autoBalanceAllocations,

    // Preview
    period,
    setPeriod,
    previewData,
    previewLoading,
    previewError,

    // Validation
    basicsComplete,
    assetsSelected,
    componentsValid,
    canLaunch,

    // Wizard
    currentStep,
    progress,

    // Costs
    baseCost,
    feePercent,
    feeAmount,
    totalCost,
  };
}
