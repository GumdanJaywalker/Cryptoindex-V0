/**
 * Shared Type Definitions for Index System
 */

export type IndexSide = 'long' | 'short';
export type IndexStatus = 'bonding' | 'funding' | 'lp' | 'graduated';

/**
 * Asset composition within an index
 */
export interface IndexAsset {
  symbol: string;
  name: string;
  side: IndexSide;
  leverage: number;
  allocation: number;
}

/**
 * Complete index data structure
 * Used for both launched indexes and index details
 */
export interface IndexData {
  id: string;
  name: string;
  symbol: string;
  description: string;
  socialLink: string;
  assets: IndexAsset[];
  totalInvestment: number;
  fee: number;
  launchedAt: string;
  status: IndexStatus;
}

// Legacy type aliases for backward compatibility
export type LaunchedIndex = IndexData;
export type IndexDetails = IndexData;
