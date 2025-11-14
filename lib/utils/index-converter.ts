/**
 * Utility to convert between IndexData and MemeIndex types
 */

import { IndexData, IndexAsset as LaunchIndexAsset } from '@/lib/types/index'
import { MemeIndex, LayerInfo } from '@/lib/types/index-trading'

/**
 * Convert IndexData (from Launch page) to MemeIndex (for Trading/Landing/Discover)
 */
export function convertIndexDataToMemeIndex(indexData: IndexData): MemeIndex {
  // Map status to layer
  const getLayerInfo = (status: string): LayerInfo => {
    switch (status) {
      case 'bonding':
        return {
          layer: 'layer-3',
          category: 'volatile-launchpad',
          tradingMechanism: 'direct-creation-redemption',
          riskLevel: 'high',
          creationAccess: 'permissionless'
        }
      case 'funding':
      case 'lp':
        return {
          layer: 'layer-3',
          category: 'volatile-launchpad',
          tradingMechanism: 'direct-creation-redemption',
          riskLevel: 'high',
          creationAccess: 'permissionless'
        }
      case 'graduated':
        return {
          layer: 'layer-2',
          category: 'mainstream-meme',
          tradingMechanism: 'hooats',
          riskLevel: 'medium',
          creationAccess: 'verified-only'
        }
      default:
        return {
          layer: 'layer-3',
          category: 'volatile-launchpad',
          tradingMechanism: 'direct-creation-redemption',
          riskLevel: 'high',
          creationAccess: 'permissionless'
        }
    }
  }

  // Map graduation status
  const getGraduation = (status: string) => {
    switch (status) {
      case 'bonding':
        return {
          liquidityProgress: Math.floor(Math.random() * 40) + 30,
          salesProgress: Math.floor(Math.random() * 40) + 20,
          status: 'launching' as const
        }
      case 'funding':
        return {
          liquidityProgress: Math.floor(Math.random() * 20) + 70,
          salesProgress: Math.floor(Math.random() * 20) + 60,
          status: 'recruiting-liquidity' as const
        }
      case 'lp':
        return {
          liquidityProgress: Math.floor(Math.random() * 10) + 85,
          salesProgress: Math.floor(Math.random() * 10) + 80,
          status: 'near-graduation' as const
        }
      case 'graduated':
        return {
          liquidityProgress: 100,
          salesProgress: 100,
          status: 'graduated' as const
        }
      default:
        return undefined
    }
  }

  // Estimate price from total investment and generate mock data
  const estimatedPrice = indexData.totalInvestment > 0
    ? indexData.totalInvestment / 1000000 // Rough estimate
    : Math.random() * 50 + 10

  // Convert assets
  const convertedAssets = indexData.assets.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    allocation: asset.allocation,
    price: estimatedPrice * (asset.allocation / 100), // Proportional to allocation
    change24h: (Math.random() - 0.5) * 20 // Random ±10%
  }))

  // Determine theme based on asset symbols
  const determineTheme = (assets: LaunchIndexAsset[]): MemeIndex['theme'] => {
    const symbols = assets.map(a => a.symbol.toLowerCase()).join(' ')
    if (symbols.includes('doge') || symbols.includes('shib')) return 'dog'
    if (symbols.includes('pepe') || symbols.includes('frog')) return 'frog'
    if (symbols.includes('trump') || symbols.includes('maga')) return 'political'
    if (symbols.includes('ai') || symbols.includes('gpt')) return 'ai'
    if (symbols.includes('ape')) return 'ape'
    if (symbols.includes('moon')) return 'moon'
    return 'diamond-hands'
  }

  const createdAtMs = new Date(indexData.launchedAt).getTime()
  const now = Date.now()
  const isNew = (now - createdAtMs) < 24 * 60 * 60 * 1000 // Within 24h

  return {
    id: indexData.id,
    symbol: indexData.symbol,
    name: indexData.name,
    theme: determineTheme(indexData.assets),
    description: indexData.description,
    createdAt: createdAtMs,
    heatScore: Math.random() * 100, // Random heat score
    layerInfo: getLayerInfo(indexData.status),
    currentPrice: estimatedPrice,
    change24h: (Math.random() - 0.5) * 20, // Random ±10%
    change7d: (Math.random() - 0.5) * 40, // Random ±20%
    volume24h: indexData.totalInvestment * (0.1 + Math.random() * 0.3), // 10-40% of TVL
    tvl: indexData.totalInvestment,
    marketCap: indexData.totalInvestment * (1.2 + Math.random() * 0.8), // 1.2x - 2x TVL
    sparklineData: Array.from({ length: 20 }, () => estimatedPrice * (0.95 + Math.random() * 0.1)),
    holders: Math.floor(Math.random() * 5000) + 100,
    topTraders: [],
    isNew,
    isHot: Math.random() > 0.7,
    isMooning: Math.random() > 0.85,
    hasBattle: false,
    graduation: getGraduation(indexData.status),
    assets: convertedAssets,
    lastRebalanced: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
    nextRebalancing: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Next 7 days
    governance: {
      proposalCount: Math.floor(Math.random() * 20),
      activeProposals: Math.floor(Math.random() * 5),
      totalVotes: Math.floor(Math.random() * 10000)
    }
  }
}

/**
 * Convert MemeIndex back to IndexData (for compatibility)
 */
export function convertMemeIndexToIndexData(memeIndex: MemeIndex): IndexData {
  const getStatus = (layer: string | undefined, graduation: any) => {
    if (layer === 'layer-1') return 'graduated'
    if (layer === 'layer-2') return 'graduated'
    if (graduation) {
      if (graduation.status === 'launching') return 'bonding'
      if (graduation.status === 'recruiting-liquidity') return 'funding'
      if (graduation.status === 'near-graduation') return 'lp'
      if (graduation.status === 'graduated') return 'graduated'
    }
    return 'bonding'
  }

  return {
    id: memeIndex.id,
    name: memeIndex.name,
    symbol: memeIndex.symbol,
    description: memeIndex.description,
    socialLink: '',
    assets: memeIndex.assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      side: 'long' as const,
      leverage: 1,
      allocation: asset.allocation
    })),
    totalInvestment: memeIndex.tvl,
    fee: 0.003,
    launchedAt: memeIndex.createdAt
      ? new Date(memeIndex.createdAt).toISOString()
      : new Date().toISOString(),
    status: getStatus(memeIndex.layerInfo?.layer, memeIndex.graduation) as any
  }
}
