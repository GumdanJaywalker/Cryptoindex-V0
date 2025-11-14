/**
 * Consolidated type definitions for Launch page
 */

export type PositionSide = "long" | "short";

export interface Asset {
  symbol: string;
  name: string;
  marketType: "perp" | "spot";
}

export interface SelectedAsset {
  symbol: string;
  name: string;
  side: PositionSide;
  leverage: number;
  marketType: "perp" | "spot";
}

export interface PortfolioComposition {
  totalAmount: number;
  allocations: { [symbol: string]: number };
}

export interface PreviewDataPoint {
  time: string;
  value: number;
}

export interface LaunchedIndex {
  id: string;
  name: string;
  symbol: string;
  description: string;
  socialLink?: string;
  assets: LaunchedIndexAsset[];
  totalInvestment: number;
  fee: number;
  launchedAt: string;
  status: "bonding" | "funding" | "lp" | "graduated";
}

export interface LaunchedIndexAsset {
  symbol: string;
  name: string;
  side: PositionSide;
  leverage: number;
  allocation: number;
}

export interface LaunchSummaryData {
  baseCost: number;
  feePercent: number;
  feeAmount: number;
  totalCost: number;
}

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}
