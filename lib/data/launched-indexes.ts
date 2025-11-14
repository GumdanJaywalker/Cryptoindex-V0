/**
 * LocalStorage Integration for Launched Indexes
 * Syncs user-created indexes from Launch page with Trading page
 */

export interface LaunchedIndexAsset {
  symbol: string;
  name: string;
  side: "long" | "short";
  leverage: number;
  allocation: number;
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
  // Trading-specific fields
  currentPrice?: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
}

/**
 * Get all launched indexes from localStorage
 * Merges with mock trading indexes for demo
 */
export function getLaunchedIndexes(): LaunchedIndex[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("launched-indexes");
    if (!stored) return [];

    const indexes = JSON.parse(stored) as LaunchedIndex[];
    return indexes;
  } catch (error) {
    console.error("Error reading launched indexes:", error);
    return [];
  }
}

/**
 * Get a specific launched index by ID
 */
export function getLaunchedIndexById(id: string): LaunchedIndex | null {
  const indexes = getLaunchedIndexes();
  return indexes.find((idx) => idx.id === id) || null;
}

/**
 * Get a specific launched index by symbol
 */
export function getLaunchedIndexBySymbol(symbol: string): LaunchedIndex | null {
  const indexes = getLaunchedIndexes();
  return indexes.find((idx) => idx.symbol.toUpperCase() === symbol.toUpperCase()) || null;
}

/**
 * Save a new launched index to localStorage
 */
export function saveLaunchedIndex(index: LaunchedIndex): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getLaunchedIndexes();
    const updated = [...existing, index];
    localStorage.setItem("launched-indexes", JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving launched index:", error);
  }
}

/**
 * Convert launched index to trading index format
 * Adds mock trading data for demo purposes
 */
export function convertToTradingIndex(launchedIndex: LaunchedIndex) {
  return {
    symbol: launchedIndex.symbol,
    name: launchedIndex.name,
    isFavorite: false,
    isLaunched: true, // Flag to identify user-created indexes
    layer: "L3" as const,
    status: launchedIndex.status,
    // Mock trading data (in production, this would come from backend)
    currentPrice: 1.0 + Math.random() * 0.5,
    change24h: (Math.random() - 0.5) * 10,
    volume24h: launchedIndex.totalInvestment * (1 + Math.random()),
    marketCap: launchedIndex.totalInvestment * (5 + Math.random() * 10),
  };
}

/**
 * Get all indexes for trading (mock + launched)
 * Combines hardcoded mock indexes with user-created indexes
 */
export function getAllTradingIndexes() {
  // Original mock indexes + Indexes composed of real Hypercore spot assets
  const mockIndexes = [
    // Original meme indexes (Layer 3)
    {
      symbol: "DOG_INDEX",
      name: "Doggy Index",
      fullName: "Doggy Meme Index",
      logoGradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
      assets: ["DOGE", "SHIB", "FLOKI"],
      isFavorite: true,
      layer: "L3",
      currentPrice: 1.2345,
      change24h: 5.67,
      volume24h: 2340000
    },
    {
      symbol: "CAT_INDEX",
      name: "Catty Index",
      fullName: "Catty Meme Index",
      logoGradient: "bg-gradient-to-br from-purple-400 to-pink-500",
      assets: ["MEW", "POPCAT"],
      isFavorite: false,
      layer: "L3",
      currentPrice: 0.8765,
      change24h: -3.21,
      volume24h: 1850000
    },
    {
      symbol: "PEPE_INDEX",
      name: "Pepe Index",
      fullName: "Pepe Meme Index",
      logoGradient: "bg-gradient-to-br from-green-400 to-emerald-500",
      assets: ["PEPE", "KPEPE", "MEW"],
      isFavorite: false,
      layer: "L3",
      currentPrice: 0.5432,
      change24h: -1.23,
      volume24h: 980000
    },
    // Hypercore asset-based indexes
    {
      symbol: "BLUECHIP_INDEX",
      name: "Blue Chip Index",
      fullName: "Blue Chip Index",
      description: "Top crypto assets by market cap",
      logoGradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      assets: ["BTC", "ETH", "BNB", "SOL", "AVAX"],
      isFavorite: true,
      layer: "L1",
      currentPrice: 2.4567,
      change24h: 5.43,
      volume24h: 15670000
    },
    {
      symbol: "DEFI_INDEX",
      name: "DeFi Blue Index",
      fullName: "DeFi Blue Index",
      description: "Leading DeFi protocols",
      logoGradient: "bg-gradient-to-br from-indigo-500 to-purple-500",
      assets: ["AAVE", "UNI", "MKR", "CRV", "COMP"],
      isFavorite: true,
      layer: "L1",
      currentPrice: 1.8921,
      change24h: 3.21,
      volume24h: 8900000
    },
    {
      symbol: "L1_INDEX",
      name: "Layer 1 Giants",
      fullName: "Layer 1 Giants Index",
      description: "Major Layer 1 blockchains",
      logoGradient: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
      assets: ["ADA", "DOT", "ATOM", "NEAR", "FTM"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 1.2345,
      change24h: 2.67,
      volume24h: 6540000
    },
    {
      symbol: "L2_INDEX",
      name: "Layer 2 Index",
      fullName: "Layer 2 Scaling Index",
      description: "Ethereum Layer 2 scaling solutions",
      logoGradient: "bg-gradient-to-br from-pink-500 to-rose-500",
      assets: ["ARB", "OP", "MATIC", "STRK", "BLAST"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 0.9876,
      change24h: 6.78,
      volume24h: 5430000
    },
    {
      symbol: "AI_INDEX",
      name: "AI Index",
      fullName: "AI & Machine Learning Index",
      description: "AI and machine learning tokens",
      logoGradient: "bg-gradient-to-br from-cyan-400 to-teal-500",
      assets: ["AI16Z", "AIXBT", "VIRTUAL", "RENDER", "FET"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 1.5432,
      change24h: 12.34,
      volume24h: 7650000
    },
    {
      symbol: "MEME_INDEX",
      name: "Meme Index",
      fullName: "Top Meme Coins Index",
      description: "Top meme coins",
      logoGradient: "bg-gradient-to-br from-amber-400 to-red-500",
      assets: ["DOGE", "WIF", "BONK", "POPCAT", "MEW"],
      isFavorite: false,
      layer: "L2", // ✅ Changed from L3 - not a bonding curve index
      currentPrice: 0.7654,
      change24h: 8.91,
      volume24h: 4320000
    },
    {
      symbol: "GAMING_INDEX",
      name: "NFT & Gaming Index",
      fullName: "NFT & Gaming Index",
      description: "Gaming and NFT projects",
      logoGradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      assets: ["APE", "IMX", "GALA", "SAND", "BIGTIME"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 1.1234,
      change24h: -2.34,
      volume24h: 3120000
    },
    {
      symbol: "STORAGE_INDEX",
      name: "Storage & Infrastructure",
      fullName: "Storage & Infrastructure Index",
      description: "Decentralized storage solutions",
      logoGradient: "bg-gradient-to-br from-slate-500 to-gray-600",
      assets: ["AR", "FIL", "GAS", "STORJ"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 2.3456,
      change24h: 4.56,
      volume24h: 5670000
    },
    {
      symbol: "ORACLE_INDEX",
      name: "Oracle & Data Index",
      fullName: "Oracle & Data Index",
      description: "Blockchain oracles and data providers",
      logoGradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
      assets: ["LINK", "PYTH", "TRB"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 3.7890,
      change24h: 7.89,
      volume24h: 9870000
    },
    {
      symbol: "LSTAKING_INDEX",
      name: "Liquid Staking Index",
      fullName: "Liquid Staking Index",
      description: "Liquid staking protocols",
      logoGradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      assets: ["LDO", "PENDLE", "ETHFI", "ENS"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 1.6543,
      change24h: 3.45,
      volume24h: 4560000
    },
    {
      symbol: "DEX_INDEX",
      name: "DEX Index",
      fullName: "Decentralized Exchange Index",
      description: "Decentralized exchanges",
      logoGradient: "bg-gradient-to-br from-pink-500 to-red-500",
      assets: ["UNI", "SUSHI", "CAKE", "DYDX", "GMX"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 2.1098,
      change24h: 5.67,
      volume24h: 8760000
    },
    {
      symbol: "METAVERSE_INDEX",
      name: "Metaverse Index",
      fullName: "Metaverse Index",
      description: "Metaverse and virtual world tokens",
      logoGradient: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
      assets: ["SAND", "GALA", "PIXEL", "MAVIA"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 0.8765,
      change24h: -1.23,
      volume24h: 2870000
    },
    {
      symbol: "YIELD_INDEX",
      name: "DeFi Yield Index",
      fullName: "DeFi Yield Index",
      description: "Yield optimization protocols",
      logoGradient: "bg-gradient-to-br from-lime-500 to-green-600",
      assets: ["PENDLE", "RDNT", "STG", "MORPHO"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 1.4321,
      change24h: 2.34,
      volume24h: 3450000
    },
    {
      symbol: "RWA_INDEX",
      name: "Real World Assets",
      fullName: "Real World Assets Index",
      description: "Tokenized real-world assets",
      logoGradient: "bg-gradient-to-br from-orange-500 to-amber-600",
      assets: ["ONDO", "PAXG", "RESOLV"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 3.2109,
      change24h: 1.89,
      volume24h: 6540000
    },
    {
      symbol: "BRIDGE_INDEX",
      name: "Bridge Index",
      fullName: "Cross-Chain Bridge Index",
      description: "Cross-chain bridge protocols",
      logoGradient: "bg-gradient-to-br from-sky-500 to-blue-600",
      assets: ["STG", "ZRO", "OMNI"],
      isFavorite: false,
      layer: "L2",
      currentPrice: 1.0987,
      change24h: -0.98,
      volume24h: 2340000
    },
    {
      symbol: "TRUMP_INDEX",
      name: "Trump Meme Index",
      fullName: "Trump Meme Index",
      description: "Trump-themed meme tokens",
      logoGradient: "bg-gradient-to-br from-red-600 to-blue-700",
      assets: ["TRUMP", "MELANIA"],
      isFavorite: false,
      layer: "L3",
      currentPrice: 0.6543,
      change24h: 18.76,
      volume24h: 12340000
    },
    {
      symbol: "SOLANA_INDEX",
      name: "Solana Ecosystem",
      fullName: "Solana Ecosystem Index",
      description: "Top Solana ecosystem tokens",
      logoGradient: "bg-gradient-to-br from-purple-600 to-violet-700",
      assets: ["SOL", "JUP", "JTO", "PYTH", "TNSR"],
      isFavorite: false,
      layer: "L1",
      currentPrice: 4.5678,
      change24h: 9.12,
      volume24h: 11230000
    },
    {
      symbol: "NEWMEME_INDEX",
      name: "New Meme Index",
      fullName: "New Meme Index",
      description: "Latest viral meme coins",
      logoGradient: "bg-gradient-to-br from-rose-500 to-pink-600",
      assets: ["FARTCOIN", "CHILLGUY", "GOAT", "PNUT", "MOODENG"],
      isFavorite: false,
      layer: "L3",
      currentPrice: 0.4321,
      change24h: 24.56,
      volume24h: 9870000
    },
  ];

  const launchedIndexes = getLaunchedIndexes();
  const convertedLaunched = launchedIndexes.map(convertToTradingIndex);

  return [...mockIndexes, ...convertedLaunched];
}
