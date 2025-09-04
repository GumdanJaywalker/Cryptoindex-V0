export type AssetMeta = {
  symbol: string
  name: string
  chain: string
  liquidityUsd: number
  vol1wUsd: number
  vol1mUsd: number
  vol1yUsd: number
  ret1wPct: number
  ret1mPct: number
  ret1yPct: number
}

export const assetsCatalog: AssetMeta[] = [
  { symbol: 'DOGE', name: 'Dogecoin', chain: 'L3', liquidityUsd: 150_000_000, vol1wUsd: 800_000_000, vol1mUsd: 3_200_000_000, vol1yUsd: 22_000_000_000, ret1wPct: 4.2, ret1mPct: 12.4, ret1yPct: 85.1 },
  { symbol: 'SHIB', name: 'Shiba Inu', chain: 'L3', liquidityUsd: 95_000_000, vol1wUsd: 350_000_000, vol1mUsd: 1_600_000_000, vol1yUsd: 9_200_000_000, ret1wPct: -2.1, ret1mPct: 6.3, ret1yPct: 45.2 },
  { symbol: 'WIF', name: 'dogwifhat', chain: 'L3', liquidityUsd: 220_000_000, vol1wUsd: 1_100_000_000, vol1mUsd: 4_800_000_000, vol1yUsd: 30_000_000_000, ret1wPct: 7.9, ret1mPct: 24.8, ret1yPct: 160.3 },
  { symbol: 'BONK', name: 'Bonk', chain: 'L3', liquidityUsd: 80_000_000, vol1wUsd: 210_000_000, vol1mUsd: 900_000_000, vol1yUsd: 5_200_000_000, ret1wPct: -5.5, ret1mPct: -3.2, ret1yPct: 22.1 },
  { symbol: 'BRETT', name: 'Brett', chain: 'L3', liquidityUsd: 60_000_000, vol1wUsd: 180_000_000, vol1mUsd: 730_000_000, vol1yUsd: 4_100_000_000, ret1wPct: 3.1, ret1mPct: 14.7, ret1yPct: 102.6 },
  { symbol: 'FLOKI', name: 'Floki', chain: 'L3', liquidityUsd: 70_000_000, vol1wUsd: 220_000_000, vol1mUsd: 960_000_000, vol1yUsd: 6_400_000_000, ret1wPct: 1.2, ret1mPct: 8.5, ret1yPct: 58.4 },
  { symbol: 'PEPE', name: 'Pepe', chain: 'L3', liquidityUsd: 300_000_000, vol1wUsd: 1_900_000_000, vol1mUsd: 7_600_000_000, vol1yUsd: 52_000_000_000, ret1wPct: 9.8, ret1mPct: 35.4, ret1yPct: 210.9 },
  { symbol: 'POPCAT', name: 'Popcat', chain: 'L3', liquidityUsd: 40_000_000, vol1wUsd: 120_000_000, vol1mUsd: 480_000_000, vol1yUsd: 2_900_000_000, ret1wPct: -1.4, ret1mPct: 4.3, ret1yPct: 39.7 },
]

