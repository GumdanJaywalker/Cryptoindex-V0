"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { BasicInfoStep } from "@/components/launch/steps/BasicInfoStep";
import { AssetSelectionStep } from "@/components/launch/steps/AssetSelectionStep";
import { PortfolioCompositionStep } from "@/components/launch/steps/PortfolioCompositionStep";
import { BacktestingStep } from "@/components/launch/steps/BacktestingStep";
import { LaunchSummary } from "@/components/launch/shared/LaunchSummary";
import { StepIndicator } from "@/components/launch/shared/StepIndicator";
import { ProgressBar } from "@/components/launch/shared/ProgressBar";
import ConfirmLaunchModal from "@/components/launch/ConfirmLaunchModal";
import LaunchSuccessModal from "@/components/launch/LaunchSuccessModal";
import { LaunchedIndexes } from "@/components/portfolio/LaunchedIndexes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLaunchForm } from "@/hooks/use-launch-form";
import Link from "next/link";
import { Info } from "lucide-react";

export default function LaunchIndexPage() {
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use custom hook for all state management
  const {
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
  } = useLaunchForm();

  // Define wizard steps
  const steps = [
    { number: 1, title: "Basics", description: "Index info" },
    { number: 2, title: "Components", description: "Select assets" },
    { number: 3, title: "Portfolio", description: "Set allocations" },
    { number: 4, title: "Backtesting", description: "Review & launch" },
  ];

  const handleLaunchClick = () => {
    if (!canLaunch) return;
    setShowLaunchModal(true);
  };

  const handleConfirmLaunch = () => {
    // Save launched index to localStorage
    const launchedIndex = {
      id: `${ticker.toLowerCase()}-${Date.now()}`,
      name: indexName,
      symbol: ticker,
      description: description,
      socialLink: socialLink,
      assets: selected.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        side: asset.side,
        leverage: asset.leverage,
        allocation: composition.allocations[asset.symbol] || 0,
      })),
      totalInvestment: totalCost,
      fee: 0, // Launch Fee is free in Phase 0
      launchedAt: new Date().toISOString(),
      status: "bonding", // bonding, funding, lp, graduated
    };

    // Get existing launched indexes
    const existing = localStorage.getItem("launched-indexes");
    const indexes = existing ? JSON.parse(existing) : [];

    // Add new index
    indexes.push(launchedIndex);
    localStorage.setItem("launched-indexes", JSON.stringify(indexes));

    setShowLaunchModal(false);
    setShowSuccessModal(true);
  };

  // Transform preview data for PreviewStep component
  const transformedPreviewData = previewData.map((point) => ({
    time: point.time,
    value: point.value,
  }));

  return (
    <div className="min-h-screen bg-teal-base text-white pt-16">
      <div className="px-4 lg:px-4 pt-1 pb-24">
        <main className="w-full space-y-6 max-w-7xl mx-auto px-2">
          {/* Header */}
          <section className="pb-6 border-b border-teal">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-2xl mb-2">Launch Your Index</h3>
                <p className="text-slate-400">Create and launch on Layer-3, graduate to Layer-2</p>
              </div>
              <Link href="/docs/launch-guide">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button-brand"
                >
                  Launch Guide
                </Button>
              </Link>
            </div>

            {/* Layer-3 Launch Info */}
            <Card className="glass-card-dynamic">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand font-medium">
                    Layer-3 Launch
                  </span>
                  <span className="text-xs text-slate-400">
                    Bonding Curve → Funding Round → LP Round → Graduate
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Target</div>
                    <div className="text-white font-medium flex items-center gap-1">
                      800M tokens
                      <div className="group relative">
                        <Info className="h-3.5 w-3.5 text-slate-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                          <div className="bg-teal-elevated border border-teal rounded-lg p-3 shadow-lg text-xs w-64">
                            <div className="text-white mb-1 font-medium">800M tokens of the Index you made</div>
                            <div className="text-slate-400">Graduation occurs when 100% of the index&apos;s tradable tokens are purchased.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Creator Fee</div>
                    <div className="text-white font-medium">0.15% in HYPE</div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Wizard Progress */}
          <section className="space-y-4">
            <StepIndicator currentStep={currentStep} steps={steps} />
            <ProgressBar progress={progress} label="Completion Progress" />
          </section>

          {/* Row 1: Basics, Components, Portfolio - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
            {/* Basics */}
            <Card className="glass-card-dynamic p-4 lg:p-6 min-h-[600px]">
              <BasicInfoStep
                indexName={indexName}
                setIndexName={setIndexName}
                ticker={ticker}
                setTicker={setTicker}
                description={description}
                setDescription={setDescription}
                socialLink={socialLink}
                setSocialLink={setSocialLink}
              />
            </Card>

            {/* Components */}
            <Card className="glass-card-dynamic p-4 lg:p-6 min-h-[600px]">
              <AssetSelectionStep
                search={search}
                setSearch={setSearch}
                filtered={filtered}
                selected={selected}
                addAsset={addAsset}
                addAssets={addAssets}
                updateAsset={updateAsset}
                removeAsset={removeAsset}
                basicsComplete={basicsComplete}
                allocationWarning={allocationWarning}
                autoBalanceAllocations={autoBalanceAllocations}
              />
            </Card>

            {/* Portfolio */}
            <Card className="glass-card-dynamic p-4 lg:p-6 min-h-[600px]">
              <PortfolioCompositionStep
                selected={selected}
                composition={composition}
                setComposition={setComposition}
                assetsSelected={assetsSelected}
                totalAllocation={totalAllocation}
                autoBalanceAllocations={autoBalanceAllocations}
              />
            </Card>
          </div>

          {/* Row 2: Backtesting - Full Width */}
          <Card className="glass-card-dynamic p-4 lg:p-6 w-full">
            <BacktestingStep
              period={period}
              setPeriod={setPeriod}
              previewData={transformedPreviewData}
              previewLoading={previewLoading}
              previewError={previewError}
              componentsValid={componentsValid}
              totalAmount={composition.totalAmount}
            />
          </Card>

          {/* Cost Summary - Inline, Always Visible */}
          <Card className="glass-card-dynamic p-4 lg:p-6">
            <LaunchSummary
              baseCost={baseCost}
              feePercent={feePercent}
              feeAmount={feeAmount}
              totalCost={totalCost}
              canLaunch={canLaunch}
              onLaunch={handleLaunchClick}
            />
          </Card>

          {/* My Launched Indexes */}
          <LaunchedIndexes />
        </main>
      </div>

      {/* Modals */}
      <ConfirmLaunchModal
        open={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        onConfirm={handleConfirmLaunch}
        indexName={indexName}
        ticker={ticker}
        selectedAssets={selected.map((asset) => ({
          symbol: asset.symbol,
          name: asset.name,
          side: asset.side,
          leverage: asset.leverage,
          hypeAmount:
            composition.totalAmount * ((composition.allocations[asset.symbol] || 0) / 100),
          usdcAmount:
            composition.totalAmount * ((composition.allocations[asset.symbol] || 0) / 100),
          allocationPct: composition.allocations[asset.symbol] || 0,
        }))}
        totalCost={totalCost}
        feeAmount={0}
      />

      <LaunchSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        indexName={indexName}
        ticker={ticker}
      />

      <Footer />
    </div>
  );
}
