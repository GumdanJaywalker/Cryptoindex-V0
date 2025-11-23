export interface Asset {
    id: string
    symbol: string
    name: string
    price: number
    change24h: number
    marketCap: number
    volume24h: number
    logo?: string
    category?: string
    ret1wPct: number
    ret1mPct: number
    ret1yPct: number
}

export const MOCK_ASSETS: Asset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 65000,
        change24h: 2.5,
        marketCap: 1200000000000,
        volume24h: 35000000000,
        category: 'L1',
        ret1wPct: 5.2,
        ret1mPct: 12.5,
        ret1yPct: 150.0
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3500,
        change24h: 1.8,
        marketCap: 400000000000,
        volume24h: 15000000000,
        category: 'L1',
        ret1wPct: 3.5,
        ret1mPct: 8.2,
        ret1yPct: 90.0
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: 145,
        change24h: 5.2,
        marketCap: 65000000000,
        volume24h: 4000000000,
        category: 'L1',
        ret1wPct: 15.0,
        ret1mPct: 45.0,
        ret1yPct: 300.0
    },
    {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        price: 0.12,
        change24h: -1.5,
        marketCap: 18000000000,
        volume24h: 1000000000,
        category: 'Meme',
        ret1wPct: -5.0,
        ret1mPct: 10.0,
        ret1yPct: 50.0
    },
    {
        id: 'pepe',
        symbol: 'PEPE',
        name: 'Pepe',
        price: 0.000008,
        change24h: 12.5,
        marketCap: 3500000000,
        volume24h: 800000000,
        category: 'Meme',
        ret1wPct: 25.0,
        ret1mPct: 80.0,
        ret1yPct: 500.0
    }
]

export const assetsCatalog = MOCK_ASSETS;
