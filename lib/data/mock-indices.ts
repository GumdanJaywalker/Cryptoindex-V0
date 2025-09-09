import { MemeIndex, TopTrader, Trade, MarketStats } from '@/lib/types/index-trading'
import { assignLayersToIndices } from '@/lib/utils/layer-utils'

// 시드 기반 랜덤 함수 (서버/클라이언트에서 일관된 결과)
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }
}

// Utility function to generate realistic sparkline data
function generateSparklineData(basePrice: number, seed: number, volatility: number = 0.1, points: number = 24): number[] {
  const rng = new SeededRandom(seed)
  const data: number[] = []
  let currentPrice = basePrice
  
  for (let i = 0; i < points; i++) {
    // Add some randomness with trend using seeded random
    const randomChange = (rng.next() - 0.5) * volatility
    currentPrice += currentPrice * randomChange
    data.push(Number(currentPrice.toFixed(4)))
  }
  
  return data
}

// Generate realistic wallet addresses with seed
function generateWalletAddress(seed: number): string {
  const rng = new SeededRandom(seed)
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(rng.next() * chars.length)]
  }
  return address
}

// Mock Meme Indices Data (15 indices)
export const mockIndices: MemeIndex[] = [
  {
    id: 'dog-memes',
    symbol: 'DOGIDX',
    name: '🐕 Dog Memes Index',
    theme: 'dog',
    description: 'A curated index of the most popular dog-themed meme coins including DOGE, SHIB, and emerging pups',
    layerInfo: {
      layer: 'layer-2',
      category: 'mainstream-meme',
      tradingMechanism: 'hooats',
      riskLevel: 'medium',
      creationAccess: 'verified-only'
    },
    currentPrice: 2.4567,
    change24h: 15.73,
    change7d: -3.21,
    volume24h: 8420000,
    tvl: 45600000,
    marketCap: 156780000,
    sparklineData: generateSparklineData(2.4567, 1001, 0.08),
    holders: 12847,
    topTraders: ['trader-1', 'trader-3', 'trader-7'],
    isHot: true,
    assets: [
      { symbol: 'DOGE', name: 'Dogecoin', allocation: 35.2, price: 0.082, change24h: 12.4 },
      { symbol: 'SHIB', name: 'Shiba Inu', allocation: 28.7, price: 0.0000087, change24h: 18.9 },
      { symbol: 'FLOKI', name: 'Floki Inu', allocation: 15.8, price: 0.000156, change24h: -2.3 },
      { symbol: 'BONK', name: 'Bonk', allocation: 12.1, price: 0.0000234, change24h: 34.7 },
      { symbol: 'WIF', name: 'Dogwifhat', allocation: 8.2, price: 1.234, change24h: 21.8 }
    ],
    lastRebalanced: new Date('2024-01-15'),
    governance: { proposalCount: 12, activeProposals: 2, totalVotes: 89420 }
  },
  {
    id: 'ai-memes',
    symbol: 'AIIDX',
    name: '🤖 AI Memes Index',
    theme: 'ai',
    description: 'Revolutionary AI-powered meme coins that blend artificial intelligence with viral internet culture',
    currentPrice: 3.8921,
    change24h: 24.56,
    change7d: 67.89,
    volume24h: 12450000,
    tvl: 73200000,
    marketCap: 234560000,
    sparklineData: generateSparklineData(3.8921, 1002, 0.12),
    holders: 8932,
    topTraders: ['trader-2', 'trader-5', 'trader-8'],
    isHot: true,
    isMooning: true,
    assets: [
      { symbol: 'TAO', name: 'Bittensor', allocation: 32.5, price: 456.78, change24h: 28.3 },
      { symbol: 'FET', name: 'Fetch.ai', allocation: 26.3, price: 1.234, change24h: 19.7 },
      { symbol: 'AGIX', name: 'SingularityNET', allocation: 21.7, price: 0.567, change24h: 31.2 },
      { symbol: 'OCEAN', name: 'Ocean Protocol', allocation: 12.8, price: 0.789, change24h: 15.8 },
      { symbol: 'RNDR', name: 'Render Token', allocation: 6.7, price: 7.89, change24h: 22.4 }
    ],
    lastRebalanced: new Date('2024-01-18'),
    governance: { proposalCount: 8, activeProposals: 3, totalVotes: 45670 }
  },
  {
    id: 'political-memes',
    symbol: 'POLIDX',
    name: '🏛️ Political Memes Index',
    theme: 'political',
    description: 'Politically-charged meme coins that capture the zeitgeist of democratic discourse',
    currentPrice: 1.7834,
    change24h: -8.42,
    change7d: 23.45,
    volume24h: 5680000,
    tvl: 28900000,
    marketCap: 89340000,
    sparklineData: generateSparklineData(1.7834, 1003, 0.15),
    holders: 15678,
    topTraders: ['trader-4', 'trader-9', 'trader-12'],
    assets: [
      { symbol: 'MAGA', name: 'MAGA', allocation: 42.3, price: 0.0234, change24h: -12.3 },
      { symbol: 'TRUMP', name: 'Trump Coin', allocation: 23.8, price: 0.0567, change24h: -5.7 },
      { symbol: 'BIDEN', name: 'Biden Inu', allocation: 18.9, price: 0.0123, change24h: -15.2 },
      { symbol: 'VOTE', name: 'VoteCoin', allocation: 10.2, price: 0.0789, change24h: 3.4 },
      { symbol: 'FREEDOM', name: 'Freedom Token', allocation: 4.8, price: 0.156, change24h: -2.1 }
    ],
    lastRebalanced: new Date('2024-01-16'),
    governance: { proposalCount: 15, activeProposals: 4, totalVotes: 67890 }
  },
  {
    id: 'gaming-memes',
    symbol: 'GMEIDX',
    name: '🎮 Gaming Memes Index',
    theme: 'gaming',
    description: 'Gaming culture meets meme economics in this high-octane index of play-to-earn tokens',
    currentPrice: 2.9456,
    change24h: 11.23,
    change7d: -1.87,
    volume24h: 7890000,
    tvl: 52340000,
    marketCap: 145670000,
    sparklineData: generateSparklineData(2.9456, 1004, 0.09),
    holders: 9834,
    topTraders: ['trader-6', 'trader-11', 'trader-15'],
    isNew: true,
    assets: [
      { symbol: 'AXS', name: 'Axie Infinity', allocation: 28.9, price: 7.89, change24h: 9.8 },
      { symbol: 'SAND', name: 'The Sandbox', allocation: 24.7, price: 0.456, change24h: 14.2 },
      { symbol: 'MANA', name: 'Decentraland', allocation: 19.8, price: 0.389, change24h: 7.6 },
      { symbol: 'ENJ', name: 'Enjin Coin', allocation: 15.2, price: 0.234, change24h: 15.9 },
      { symbol: 'GALA', name: 'Gala', allocation: 11.4, price: 0.0456, change24h: 6.3 }
    ],
    lastRebalanced: new Date('2024-01-17'),
    governance: { proposalCount: 6, activeProposals: 1, totalVotes: 34560 }
  },
  {
    id: 'frog-memes',
    symbol: 'FROGIDX',
    name: '🐸 Frog Memes Index',
    theme: 'frog',
    description: 'Ribbit your way to profits with the most meme-worthy frog tokens in the swamp',
    currentPrice: 1.5623,
    change24h: 31.45,
    change7d: 89.23,
    volume24h: 9870000,
    tvl: 38450000,
    marketCap: 98760000,
    sparklineData: generateSparklineData(1.5623, 1005, 0.18),
    holders: 18456,
    topTraders: ['trader-10', 'trader-13', 'trader-18'],
    isHot: true,
    isMooning: true,
    assets: [
      { symbol: 'PEPE', name: 'Pepe', allocation: 45.6, price: 0.000001234, change24h: 38.7 },
      { symbol: 'WOJAK', name: 'Wojak', allocation: 22.8, price: 0.00234, change24h: 25.9 },
      { symbol: 'BOBO', name: 'Bobo', allocation: 16.7, price: 0.000567, change24h: 42.1 },
      { symbol: 'KERMIT', name: 'Kermit', allocation: 10.2, price: 0.0123, change24h: 19.8 },
      { symbol: 'RIBBIT', name: 'Ribbit', allocation: 4.7, price: 0.00891, change24h: 56.7 }
    ],
    lastRebalanced: new Date('2024-01-19'),
    governance: { proposalCount: 9, activeProposals: 2, totalVotes: 78923 }
  },
  {
    id: 'space-memes',
    symbol: 'SPACEIDX',
    name: '🌙 Space Memes Index',
    theme: 'space',
    description: 'To the moon and beyond! Cosmic meme coins that are literally out of this world',
    currentPrice: 4.2356,
    change24h: 18.94,
    change7d: 42.67,
    volume24h: 6540000,
    tvl: 67890000,
    marketCap: 189230000,
    sparklineData: generateSparklineData(4.2356, 1006, 0.11),
    holders: 7654,
    topTraders: ['trader-14', 'trader-19', 'trader-22'],
    isHot: true,
    assets: [
      { symbol: 'MOON', name: 'Moon Token', allocation: 34.5, price: 0.234, change24h: 21.3 },
      { symbol: 'MARS', name: 'Mars Protocol', allocation: 27.8, price: 0.567, change24h: 16.7 },
      { symbol: 'SATURN', name: 'Saturn Ring', allocation: 18.9, price: 0.123, change24h: 28.9 },
      { symbol: 'ROCKET', name: 'Rocket Pool', allocation: 12.4, price: 23.45, change24h: 14.5 },
      { symbol: 'STAR', name: 'Starlink Token', allocation: 6.4, price: 0.0789, change24h: 9.8 }
    ],
    lastRebalanced: new Date('2024-01-14'),
    governance: { proposalCount: 11, activeProposals: 3, totalVotes: 56789 }
  },
  {
    id: 'food-memes',
    symbol: 'FOODIDX',
    name: '🍔 Food Memes Index',
    theme: 'food',
    description: 'Satisfy your appetite for gains with delicious food-themed meme tokens',
    currentPrice: 1.8945,
    change24h: 7.23,
    change7d: -12.45,
    volume24h: 4230000,
    tvl: 23450000,
    marketCap: 67890000,
    sparklineData: generateSparklineData(1.8945, 1007, 0.07),
    holders: 13456,
    topTraders: ['trader-16', 'trader-20', 'trader-23'],
    assets: [
      { symbol: 'PIZZA', name: 'Pizza Party', allocation: 29.8, price: 0.0234, change24h: 8.9 },
      { symbol: 'BURGER', name: 'Burger Coin', allocation: 23.7, price: 0.0567, change24h: 5.2 },
      { symbol: 'TACO', name: 'Taco Token', allocation: 19.5, price: 0.0123, change24h: 12.7 },
      { symbol: 'SUSHI', name: 'SushiSwap', allocation: 15.8, price: 1.234, change24h: 3.4 },
      { symbol: 'CAKE', name: 'PancakeSwap', allocation: 11.2, price: 2.345, change24h: 6.8 }
    ],
    lastRebalanced: new Date('2024-01-13'),
    governance: { proposalCount: 7, activeProposals: 1, totalVotes: 34567 }
  },
  {
    id: 'diamond-hands',
    symbol: 'DIAMONDIDX',
    name: '💎 Diamond Hands Index',
    theme: 'diamond-hands',
    description: 'For the diamond-handed legends who never sell and always HODL to the moon',
    currentPrice: 5.6789,
    change24h: -5.67,
    change7d: 156.78,
    volume24h: 15670000,
    tvl: 89450000,
    marketCap: 234560000,
    sparklineData: generateSparklineData(5.6789, 1008, 0.13),
    holders: 5678,
    topTraders: ['trader-17', 'trader-21', 'trader-24'],
    assets: [
      { symbol: 'DIAMOND', name: 'Diamond Token', allocation: 38.9, price: 0.789, change24h: -3.2 },
      { symbol: 'HODL', name: 'HODL Token', allocation: 26.7, price: 0.234, change24h: -8.9 },
      { symbol: 'HANDS', name: 'Diamond Hands', allocation: 18.4, price: 0.567, change24h: -2.1 },
      { symbol: 'MOON', name: 'To The Moon', allocation: 11.2, price: 0.123, change24h: -12.3 },
      { symbol: 'STRONG', name: 'Strong Hands', allocation: 4.8, price: 0.0456, change24h: 1.2 }
    ],
    lastRebalanced: new Date('2024-01-12'),
    governance: { proposalCount: 13, activeProposals: 5, totalVotes: 123456 }
  },
  {
    id: 'moon-index',
    symbol: 'MOONIDX',
    name: '🚀 To The Moon Index',
    theme: 'moon',
    description: 'High-risk, high-reward rockets that are destined for lunar landing',
    currentPrice: 3.4567,
    change24h: 45.67,
    change7d: 234.56,
    volume24h: 23450000,
    tvl: 156780000,
    marketCap: 456780000,
    sparklineData: generateSparklineData(3.4567, 1009, 0.22),
    holders: 23456,
    topTraders: ['trader-25', 'trader-26', 'trader-27'],
    isHot: true,
    isMooning: true,
    assets: [
      { symbol: 'ROCKET', name: 'Rocket Fuel', allocation: 41.2, price: 0.0123, change24h: 56.7 },
      { symbol: 'LAMBO', name: 'Lambo Dreams', allocation: 24.8, price: 0.234, change24h: 42.3 },
      { symbol: 'YOLO', name: 'YOLO Token', allocation: 17.6, price: 0.0567, change24h: 38.9 },
      { symbol: 'PUMP', name: 'Pump It', allocation: 12.3, price: 0.789, change24h: 67.8 },
      { symbol: 'MOON', name: 'Moon Mission', allocation: 4.1, price: 0.0234, change24h: 23.4 }
    ],
    lastRebalanced: new Date('2024-01-11'),
    governance: { proposalCount: 18, activeProposals: 7, totalVotes: 234567 }
  },
  {
    id: 'ape-together',
    symbol: 'APEIDX',
    name: '🦍 Ape Together Index',
    theme: 'ape',
    description: 'Apes strong together! Community-driven tokens that embody the spirit of collective diamond hands',
    currentPrice: 2.7890,
    change24h: 12.34,
    change7d: -8.76,
    volume24h: 8900000,
    tvl: 45670000,
    marketCap: 123450000,
    sparklineData: generateSparklineData(2.7890, 1010, 0.10),
    holders: 34567,
    topTraders: ['trader-28', 'trader-29', 'trader-30'],
    assets: [
      { symbol: 'APE', name: 'ApeCoin', allocation: 35.7, price: 1.234, change24h: 15.6 },
      { symbol: 'BANANA', name: 'Banana Token', allocation: 28.4, price: 0.0789, change24h: 8.9 },
      { symbol: 'GORILLA', name: 'Gorilla Fund', allocation: 19.8, price: 0.234, change24h: 18.2 },
      { symbol: 'KONG', name: 'King Kong', allocation: 11.7, price: 0.0456, change24h: 4.5 },
      { symbol: 'JUNGLE', name: 'Jungle Party', allocation: 4.4, price: 0.0123, change24h: 21.7 }
    ],
    lastRebalanced: new Date('2024-01-10'),
    governance: { proposalCount: 14, activeProposals: 3, totalVotes: 89012 }
  }
]

// Generate additional smaller indices to reach 15 total
export const additionalIndices: MemeIndex[] = [
  {
    id: 'cat-memes',
    symbol: 'CATIDX',
    name: '🐱 Cat Memes Index',
    theme: 'dog', // Using dog theme as closest match
    description: 'Purrfect profits with feline-inspired meme tokens',
    currentPrice: 1.2345,
    change24h: 8.90,
    change7d: -15.67,
    volume24h: 3450000,
    tvl: 19870000,
    marketCap: 56780000,
    sparklineData: generateSparklineData(1.2345, 1011, 0.08),
    holders: 12345,
    topTraders: ['trader-1', 'trader-8', 'trader-15'],
    assets: [
      { symbol: 'CAT', name: 'Cat Token', allocation: 40.2, price: 0.0234, change24h: 12.3 },
      { symbol: 'MEOW', name: 'Meow Coin', allocation: 25.8, price: 0.0567, change24h: 6.7 },
      { symbol: 'PURR', name: 'Purr Token', allocation: 20.1, price: 0.0123, change24h: 8.9 },
      { symbol: 'WHISKERS', name: 'Whiskers', allocation: 10.4, price: 0.0789, change24h: 4.5 },
      { symbol: 'KITTY', name: 'Hello Kitty', allocation: 3.5, price: 0.0456, change24h: 15.6 }
    ],
    lastRebalanced: new Date('2024-01-09'),
    governance: { proposalCount: 5, activeProposals: 1, totalVotes: 23456 }
  },
  {
    id: 'chinese-memes',
    symbol: 'CNIDX',
    name: '🐲 Dragon Memes Index',
    theme: 'political',
    description: 'Eastern wisdom meets Western memes in this Asia-focused index',
    currentPrice: 0.8765,
    change24h: -3.45,
    change7d: 12.34,
    volume24h: 2340000,
    tvl: 12340000,
    marketCap: 34560000,
    sparklineData: generateSparklineData(0.8765, 1012, 0.06),
    holders: 8765,
    topTraders: ['trader-5', 'trader-12', 'trader-20'],
    assets: [
      { symbol: 'DRAGON', name: 'Dragon Token', allocation: 32.1, price: 0.0123, change24h: -2.3 },
      { symbol: 'PANDA', name: 'Panda Coin', allocation: 27.8, price: 0.0234, change24h: -4.5 },
      { symbol: 'YUAN', name: 'Digital Yuan', allocation: 23.4, price: 0.0567, change24h: -1.2 },
      { symbol: 'SILK', name: 'Silk Road', allocation: 12.9, price: 0.0789, change24h: 3.4 },
      { symbol: 'TEA', name: 'Tea Ceremony', allocation: 3.8, price: 0.0456, change24h: -6.7 }
    ],
    lastRebalanced: new Date('2024-01-08'),
    governance: { proposalCount: 3, activeProposals: 0, totalVotes: 12345 }
  },
  {
    id: 'sports-memes',
    symbol: 'SPORTIDX',
    name: '⚽ Sports Memes Index',
    theme: 'gaming',
    description: 'Game on! Sports-themed tokens that score big in the meme league',
    currentPrice: 1.9876,
    change24h: 6.78,
    change7d: 23.45,
    volume24h: 5670000,
    tvl: 28900000,
    marketCap: 78900000,
    sparklineData: generateSparklineData(1.9876, 1013, 0.09),
    holders: 19876,
    topTraders: ['trader-7', 'trader-14', 'trader-22'],
    isNew: true,
    assets: [
      { symbol: 'GOAL', name: 'Goal Token', allocation: 28.9, price: 0.123, change24h: 8.9 },
      { symbol: 'SLAM', name: 'Slam Dunk', allocation: 24.7, price: 0.234, change24h: 5.6 },
      { symbol: 'HOME', name: 'Home Run', allocation: 19.8, price: 0.0567, change24h: 12.3 },
      { symbol: 'SCORE', name: 'Score Big', allocation: 15.2, price: 0.0789, change24h: 3.4 },
      { symbol: 'WIN', name: 'Winning Team', allocation: 11.4, price: 0.0456, change24h: -1.2 }
    ],
    lastRebalanced: new Date('2024-01-07'),
    governance: { proposalCount: 4, activeProposals: 2, totalVotes: 45678 }
  },
  {
    id: 'music-memes',
    symbol: 'MUSICIDX',
    name: '🎵 Music Memes Index',
    theme: 'space',
    description: 'Drop the beat and pump the bags with music-inspired meme tokens',
    currentPrice: 2.1234,
    change24h: 14.56,
    change7d: -5.43,
    volume24h: 4560000,
    tvl: 34560000,
    marketCap: 89012000,
    sparklineData: generateSparklineData(2.1234, 1014, 0.11),
    holders: 21234,
    topTraders: ['trader-9', 'trader-16', 'trader-25'],
    assets: [
      { symbol: 'BEAT', name: 'Beat Drop', allocation: 31.5, price: 0.0234, change24h: 16.7 },
      { symbol: 'BASS', name: 'Bass Boost', allocation: 26.8, price: 0.0567, change24h: 12.3 },
      { symbol: 'REMIX', name: 'Remix Token', allocation: 21.2, price: 0.0123, change24h: 18.9 },
      { symbol: 'VINYL', name: 'Vinyl Records', allocation: 13.7, price: 0.0789, change24h: 8.4 },
      { symbol: 'CONCERT', name: 'Concert Hall', allocation: 6.8, price: 0.0456, change24h: 21.2 }
    ],
    lastRebalanced: new Date('2024-01-06'),
    governance: { proposalCount: 6, activeProposals: 1, totalVotes: 56789 }
  },
  {
    id: 'weather-memes',
    symbol: 'WEATHERIDX',
    name: '🌪️ Weather Memes Index',
    theme: 'space',
    description: 'Storm the markets with weather-themed tokens that bring the perfect conditions for gains',
    currentPrice: 0.6789,
    change24h: -12.34,
    change7d: 45.67,
    volume24h: 1890000,
    tvl: 9870000,
    marketCap: 23450000,
    sparklineData: generateSparklineData(0.6789, 1015, 0.16),
    holders: 6789,
    topTraders: ['trader-11', 'trader-18', 'trader-27'],
    assets: [
      { symbol: 'STORM', name: 'Storm Token', allocation: 35.4, price: 0.0123, change24h: -15.6 },
      { symbol: 'RAIN', name: 'Rain Drop', allocation: 28.7, price: 0.0234, change24h: -8.9 },
      { symbol: 'SUN', name: 'Sunshine', allocation: 18.9, price: 0.0567, change24h: -18.2 },
      { symbol: 'WIND', name: 'Wind Power', allocation: 12.8, price: 0.0789, change24h: -6.7 },
      { symbol: 'SNOW', name: 'Snow Flake', allocation: 4.2, price: 0.0456, change24h: -23.4 }
    ],
    lastRebalanced: new Date('2024-01-05'),
    governance: { proposalCount: 2, activeProposals: 0, totalVotes: 9876 }
  },
  {
    id: 'robot-memes',
    symbol: 'ROBOTIDX',
    name: '🤖 Robot Memes Index',
    theme: 'space',
    description: 'Automated gains with AI and robot-themed tokens leading the future',
    currentPrice: 0.8912,
    change24h: 8.45,
    change7d: 34.21,
    volume24h: 2150000,
    tvl: 12340000,
    marketCap: 28760000,
    sparklineData: generateSparklineData(0.8912, 1016, 0.12),
    holders: 8901,
    isNew: true,
    topTraders: ['trader-12', 'trader-19', 'trader-28'],
    assets: [
      { symbol: 'AI', name: 'AI Token', allocation: 32.1, price: 0.0167, change24h: 9.2 },
      { symbol: 'BOT', name: 'Bot Coin', allocation: 27.8, price: 0.0289, change24h: 7.6 },
      { symbol: 'CYBER', name: 'Cyber Punk', allocation: 20.3, price: 0.0445, change24h: 12.1 },
      { symbol: 'MECH', name: 'Mech Warrior', allocation: 14.7, price: 0.0623, change24h: 5.8 },
      { symbol: 'NANO', name: 'Nano Tech', allocation: 5.1, price: 0.0334, change24h: 18.9 }
    ],
    lastRebalanced: new Date('2024-01-04'),
    governance: { proposalCount: 8, activeProposals: 2, totalVotes: 34567 }
  }
]

// Combine all indices
// Apply layer info to all indices
const indicesWithLayers = assignLayersToIndices([...mockIndices, ...additionalIndices])

export const allMockIndices = indicesWithLayers

// Mock Top Traders Data (30 traders)
export const mockTopTraders: TopTrader[] = Array.from({ length: 80 }, (_, i) => {
  const traderNumber = i + 1
  const isTopTrader = i < 3
  const isGoodTrader = i < 10
  const baseMultiplier = isTopTrader ? 5 : isGoodTrader ? 2 : 1
  
  // Create seeded random generator for this trader
  const rng = new SeededRandom(2000 + traderNumber)
  
  return {
    id: `trader-${traderNumber}`,
    address: generateWalletAddress(2000 + traderNumber),
    ens: rng.next() > 0.7 ? `degen${traderNumber}.eth` : undefined,
    rank: traderNumber,
    pnl24h: (rng.next() * 50000 - 10000) * baseMultiplier,
    pnl7d: (rng.next() * 200000 - 40000) * baseMultiplier,
    pnl30d: (rng.next() * 800000 - 160000) * baseMultiplier,
    totalPnl: (rng.next() * 2000000 - 200000) * baseMultiplier,
    pnlPercentage24h: (rng.next() * 100 - 20) * baseMultiplier,
    pnlPercentage7d: (rng.next() * 200 - 40) * baseMultiplier,
    pnlPercentage30d: (rng.next() * 500 - 100) * baseMultiplier,
    totalPnlPercentage: (rng.next() * 1000 - 100) * baseMultiplier,
    winRate: 45 + rng.next() * 40,
    totalTrades: Math.floor((50 + rng.next() * 500) * baseMultiplier),
    followersCount: Math.floor((10 + rng.next() * 1000) * baseMultiplier),
    tradingIndices: allMockIndices.slice(0, 3 + Math.floor(rng.next() * 5)).map(idx => idx.id),
    isNewTrader: rng.next() > 0.85,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=trader${traderNumber}`,
    badges: isTopTrader ? ['🥇', '🔥', '💎'] : isGoodTrader ? ['⭐', '🔥'] : ['⭐'],
    socialLinks: rng.next() > 0.6 ? {
      twitter: `@degen_trader_${traderNumber}`,
      discord: rng.next() > 0.5 ? `DegenTrader#${String(traderNumber).padStart(4, '0')}` : undefined
    } : undefined,
    copyTradeData: {
      minimumAmount: 100 + rng.next() * 900,
      maxFollowers: 500 + rng.next() * 1500,
      currentFollowers: Math.floor((10 + rng.next() * 1000) * baseMultiplier),
      fee: 5 + rng.next() * 15
    }
  }
})

// Mock Market Stats
export const mockMarketStats: MarketStats = {
  totalVolume24h: 156780000,
  totalTVL: 1234560000,
  activeIndices: 15,
  activeTraders: 45678,
  totalMarketCap: 5678900000,
  topGainer: {
    symbol: 'MOONIDX',
    change: 45.67
  },
  topLoser: {
    symbol: 'DIAMONDIDX',
    change: -5.67
  }
}

// Mock Recent Trades
export const mockRecentTrades: Trade[] = Array.from({ length: 50 }, (_, i) => {
  const rng = new SeededRandom(3000 + i)
  const isLong = rng.next() > 0.5
  const entryPrice = 1 + rng.next() * 10
  const currentPrice = entryPrice * (0.8 + rng.next() * 0.4)
  const amount = 100 + rng.next() * 10000
  const leverage = [1, 2, 5, 10, 20][Math.floor(rng.next() * 5)]
  const pnl = (currentPrice - entryPrice) * amount * leverage * (isLong ? 1 : -1)
  
  return {
    id: `trade-${i + 1}`,
    indexId: allMockIndices[Math.floor(rng.next() * allMockIndices.length)].id,
    traderId: mockTopTraders[Math.floor(rng.next() * mockTopTraders.length)].id,
    type: isLong ? 'long' : 'short',
    entryPrice,
    currentPrice,
    amount,
    leverage,
    pnl,
    pnlPercentage: (pnl / amount) * 100,
    status: rng.next() > 0.3 ? 'open' : 'closed',
    timestamp: new Date(Date.now() - rng.next() * 86400000 * 7), // Last 7 days
    orderType: ['market', 'limit', 'stop-loss', 'take-profit'][Math.floor(rng.next() * 4)] as any,
    fees: amount * 0.001 * leverage
  }
})

// Real-time update simulation function (still uses Math.random for real-time updates)
export function simulateRealtimeUpdate(): any {
  const updateTypes = ['price', 'trade', 'trader_ranking', 'index_stats']
  const type = updateTypes[Math.floor(Math.random() * updateTypes.length)]
  
  switch (type) {
    case 'price':
      return {
        type: 'price',
        data: {
          indexId: allMockIndices[Math.floor(Math.random() * allMockIndices.length)].id,
          newPrice: 1 + Math.random() * 10,
          change: (Math.random() - 0.5) * 20
        },
        timestamp: new Date()
      }
    case 'trade':
      return {
        type: 'trade',
        data: mockRecentTrades[Math.floor(Math.random() * mockRecentTrades.length)],
        timestamp: new Date()
      }
    default:
      return {
        type,
        data: { message: 'Update simulated' },
        timestamp: new Date()
      }
  }
}

// Export functions for use in React Query hooks
export function generateMockIndices(): MemeIndex[] {
  return allMockIndices
}

export function generateMockTraders(): TopTrader[] {
  return mockTopTraders
}
