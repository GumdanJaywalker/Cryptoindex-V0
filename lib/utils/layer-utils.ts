import { MemeIndex, LayerInfo } from '@/lib/types/index-trading'

// Mock layer assignment based on index characteristics
export function assignLayerInfo(index: MemeIndex): MemeIndex {
  // If layerInfo already exists, return as is
  if (index.layerInfo) {
    return index
  }

  let layerInfo: LayerInfo

  // Layer assignment logic based on index characteristics
  if (index.theme === 'ai' || index.marketCap > 200000000) {
    // AI themes or high market cap = Layer 1 (Institutional)
    layerInfo = {
      layer: 'layer-1',
      category: 'institutional',
      tradingMechanism: 'hooats',
      riskLevel: 'low',
      creationAccess: 'institution-only'
    }
  } else if (index.theme === 'dog' || index.theme === 'political' || index.marketCap > 50000000) {
    // Popular themes or medium market cap = Layer 2 (Mainstream)
    layerInfo = {
      layer: 'layer-2',
      category: 'mainstream-meme',
      tradingMechanism: 'hooats',
      riskLevel: 'medium',
      creationAccess: 'verified-only'
    }
  } else {
    // Everything else = Layer 3 (Volatile)
    layerInfo = {
      layer: 'layer-3',
      category: 'volatile-launchpad',
      tradingMechanism: 'direct-creation-redemption',
      riskLevel: 'high',
      creationAccess: 'permissionless'
    }
  }

  return {
    ...index,
    layerInfo
  }
}

// Apply layer info to all indexes
export function assignLayersToIndexes(indexes: MemeIndex[]): MemeIndex[] {
  return indexes.map(assignLayerInfo)
}

// Get layer display info
export function getLayerDisplayInfo(layer: string) {
  const layerConfig = {
    'layer-1': {
      name: 'Layer 1',
      description: 'Major Indices & Large Categorized Indices',
      color: 'blue',
      riskLevel: 'Low Risk',
      tradingType: 'HOOATS Trading'
    },
    'layer-2': {
      name: 'Layer 2', 
      description: 'Major MEME Themes, Segmented Categories & Layer 3 Graduated Indices',
      color: 'orange',
      riskLevel: 'Medium Risk',
      tradingType: 'HOOATS Trading'
    },
    'layer-3': {
      name: 'Layer 3',
      description: "User Launched Indices & Partner DEX/Platforms' Real-Time Indices",
      color: 'red', 
      riskLevel: 'High Risk',
      tradingType: 'Direct Creation/Redemption'
    }
  }

  return layerConfig[layer as keyof typeof layerConfig] || layerConfig['layer-2']
}
