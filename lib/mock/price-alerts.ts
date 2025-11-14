// Mock price alerts data for PriceAlertsPopover

export interface PriceAlert {
  id: string
  indexName: string
  indexSymbol: string
  condition: 'above' | 'below'
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: Date
}

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'alert-1',
    indexName: 'Dog Memes Index',
    indexSymbol: 'DOGIDX',
    condition: 'above',
    targetPrice: 125.50,
    currentPrice: 118.32,
    isActive: true,
    createdAt: new Date('2025-11-01T10:30:00'),
  },
  {
    id: 'alert-2',
    indexName: 'AI Index',
    indexSymbol: 'AIIDX',
    condition: 'below',
    targetPrice: 95.00,
    currentPrice: 102.45,
    isActive: true,
    createdAt: new Date('2025-11-01T14:15:00'),
  },
  {
    id: 'alert-3',
    indexName: 'DeFi Index',
    indexSymbol: 'DEFIIDX',
    condition: 'above',
    targetPrice: 150.00,
    currentPrice: 148.72,
    isActive: true,
    createdAt: new Date('2025-11-02T08:00:00'),
  },
  {
    id: 'alert-4',
    indexName: 'Cat Memes Index',
    indexSymbol: 'CATIDX',
    condition: 'below',
    targetPrice: 80.00,
    currentPrice: 92.18,
    isActive: false,
    createdAt: new Date('2025-10-30T16:45:00'),
  },
]
