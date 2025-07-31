'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  BarChart3,
  Target,
  Calendar,
  PieChart,
  Activity,
  ExternalLink,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  History,
  Plus,
  Minus,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  TrendingDown as TrendingDownIcon2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Timer,
  Bell,
  Zap,
  Layers,
  Volume2,
  Waves,
  Eye,
  Scale,
  Brain,
  Signal,
  Radar,
  Bot,
  Sparkles,
  MousePointer,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Search
} from 'lucide-react'

// Mock data for each tab
const mockPositions = [
  {
    id: '1',
    symbol: 'MEME_INDEX',
    side: 'Long',
    size: 1.5,
    entryPrice: 2.45,
    currentPrice: 2.67,
    pnl: 330.00,
    pnlPercent: 8.98,
    margin: 245.25,
    leverage: '10x',
    liquidationPrice: 2.21
  },
  {
    id: '2', 
    symbol: 'DOG_INDEX',
    side: 'Short',
    size: 0.8,
    entryPrice: 1.82,
    currentPrice: 1.73,
    pnl: 72.00,
    pnlPercent: 4.95,
    margin: 145.60,
    leverage: '5x',
    liquidationPrice: 2.01
  }
]

const mockOrders = [
  {
    id: '1',
    symbol: 'CAT_INDEX',
    side: 'Buy',
    type: 'Limit',
    size: 2.0,
    price: 1.45,
    filled: 0,
    status: 'Open',
    time: '14:23:15'
  },
  {
    id: '2',
    symbol: 'AI_INDEX', 
    side: 'Sell',
    type: 'Stop',
    size: 1.2,
    price: 3.21,
    filled: 0,
    status: 'Pending',
    time: '14:20:08'
  }
]

const mockIndexComposition = [
  { 
    symbol: 'DOGE', 
    weight: 25.4, 
    change24h: 8.2, 
    price: 0.085, 
    allocation: 15420,
    marketCap: 12.5e9, // 12.5B
    volume24h: 850.2e6, // 850.2M
    quantity: 181176 // tokens held
  },
  { 
    symbol: 'SHIB', 
    weight: 18.7, 
    change24h: -2.1, 
    price: 0.00001243, 
    allocation: 11340,
    marketCap: 7.3e9,
    volume24h: 245.7e6,
    quantity: 912450000 // tokens held
  },
  { 
    symbol: 'PEPE', 
    weight: 15.9, 
    change24h: 12.5, 
    price: 0.00000876, 
    allocation: 9640,
    marketCap: 3.7e9,
    volume24h: 180.5e6,
    quantity: 1100000000 // tokens held
  },
  { 
    symbol: 'FLOKI', 
    weight: 12.3, 
    change24h: 5.7, 
    price: 0.000245, 
    allocation: 7460,
    marketCap: 2.3e9,
    volume24h: 95.2e6,
    quantity: 30449000 // tokens held
  },
  { 
    symbol: 'BONK', 
    weight: 11.2, 
    change24h: -1.8, 
    price: 0.0000156, 
    allocation: 6790,
    marketCap: 1.1e9,
    volume24h: 65.8e6,
    quantity: 435256000 // tokens held
  },
  { 
    symbol: 'WIF', 
    weight: 8.8, 
    change24h: 15.3, 
    price: 2.45, 
    allocation: 5330,
    marketCap: 2.4e9,
    volume24h: 125.6e6,
    quantity: 2175 // tokens held
  },
  { 
    symbol: 'MEME', 
    weight: 7.7, 
    change24h: -4.2, 
    price: 0.0234, 
    allocation: 4670,
    marketCap: 345e6,
    volume24h: 28.9e6,
    quantity: 199573 // tokens held
  }
]

// Mock data for composition history
const mockCompositionHistory = [
  {
    date: '2024-01-15',
    type: 'Rebalancing',
    changes: [
      { symbol: 'DOGE', action: 'increased', from: 22.1, to: 25.4, reason: 'Strong performance' },
      { symbol: 'SHIB', action: 'decreased', from: 21.3, to: 18.7, reason: 'Underperformance' },
      { symbol: 'WIF', action: 'added', from: 0, to: 8.8, reason: 'New trending token' }
    ]
  },
  {
    date: '2024-01-08',
    type: 'Removal',
    changes: [
      { symbol: 'DOGECOIN2', action: 'removed', from: 5.2, to: 0, reason: 'Failed governance vote' },
      { symbol: 'DOGE', action: 'increased', from: 19.8, to: 22.1, reason: 'Redistribution' }
    ]
  },
  {
    date: '2024-01-01',
    type: 'Addition',
    changes: [
      { symbol: 'MEME', action: 'added', from: 0, to: 7.7, reason: 'Community proposal passed' },
      { symbol: 'BONK', action: 'increased', from: 8.9, to: 11.2, reason: 'Adjustment for new addition' }
    ]
  }
]

// Mock data for diversification metrics
const mockDiversificationMetrics = {
  herfindahlIndex: 0.087, // Lower = more diversified (0-1 scale)
  concentrationRatio: 44.1, // Top 3 assets percentage
  correlationMatrix: [
    { asset1: 'DOGE', asset2: 'SHIB', correlation: 0.75 },
    { asset1: 'DOGE', asset2: 'PEPE', correlation: 0.68 },
    { asset1: 'SHIB', asset2: 'PEPE', correlation: 0.82 },
    { asset1: 'FLOKI', asset2: 'BONK', correlation: 0.59 },
    { asset1: 'WIF', asset2: 'MEME', correlation: 0.43 }
  ],
  betaCoefficient: 1.23, // vs overall crypto market
  riskScore: 7.2, // 1-10 scale
  diversificationGrade: 'B+'
}

// Mock data for funding history
const mockFundingHistory = {
  currentRate: 0.0125, // 1.25%
  nextFunding: '2h 15m', // countdown
  recentRates: [
    { time: '00:00', rate: 0.0089, date: '2024-01-20' },
    { time: '08:00', rate: 0.0156, date: '2024-01-20' },
    { time: '16:00', rate: 0.0134, date: '2024-01-20' },
    { time: '00:00', rate: 0.0098, date: '2024-01-19' },
    { time: '08:00', rate: 0.0167, date: '2024-01-19' },
    { time: '16:00', rate: 0.0145, date: '2024-01-19' },
    { time: '00:00', rate: 0.0076, date: '2024-01-18' },
    { time: '08:00', rate: 0.0123, date: '2024-01-18' }
  ],
  statistics: {
    average: 0.0123,
    highest: 0.0167,
    lowest: 0.0076,
    stdDeviation: 0.0031,
    annualizedCost: 15.8 // percentage
  },
  exchangeComparison: [
    { exchange: 'Hyperliquid', rate: 0.0125, color: 'blue' },
    { exchange: 'Binance', rate: 0.0089, color: 'yellow' },
    { exchange: 'Bybit', rate: 0.0134, color: 'orange' },
    { exchange: 'OKX', rate: 0.0098, color: 'green' }
  ],
  myFundingPnL: {
    total: -45.67, // negative = paid
    thisWeek: -12.34,
    thisMonth: -89.12,
    breakdown: [
      { date: '2024-01-20 16:00', amount: -5.67, position: 'Long 2.5 MEME_INDEX' },
      { date: '2024-01-20 08:00', amount: -8.23, position: 'Long 2.5 MEME_INDEX' },
      { date: '2024-01-20 00:00', amount: -3.45, position: 'Long 1.8 DOG_INDEX' },
      { date: '2024-01-19 16:00', amount: -6.78, position: 'Long 1.8 DOG_INDEX' }
    ]
  }
}

// Mock data for market data
const mockMarketData = {
  orderBookDepth: {
    spreadInfo: {
      bidAskSpread: 0.0012, // 0.12%
      midPrice: 2.4567,
      spreadTrend: 'tightening' // 'widening' | 'tightening' | 'stable'
    },
    depthAnalysis: {
      bid5Depth: 125670, // USDC value at 5 levels
      ask5Depth: 98230,
      bid10Depth: 234560,
      ask10Depth: 189340,
      imbalanceRatio: 1.28 // bid/ask ratio
    },
    whaleOrders: [
      { side: 'buy', size: 45000, price: 2.4520, impact: 0.19, time: '2m ago' },
      { side: 'sell', size: 67800, price: 2.4590, impact: 0.24, time: '5m ago' },
      { side: 'buy', size: 23400, price: 2.4500, impact: 0.12, time: '8m ago' }
    ]
  },
  volumeAnalysis: {
    hourlyVolume: [
      { hour: '00:00', volume: 1.2e6, buyRatio: 0.52 },
      { hour: '01:00', volume: 0.8e6, buyRatio: 0.48 },
      { hour: '02:00', volume: 0.6e6, buyRatio: 0.45 },
      { hour: '03:00', volume: 0.9e6, buyRatio: 0.58 },
      { hour: '04:00', volume: 1.5e6, buyRatio: 0.62 },
      { hour: '05:00', volume: 2.1e6, buyRatio: 0.67 }
    ],
    volumeStats: {
      total24h: 24.7e6,
      buyVolume: 13.2e6,
      sellVolume: 11.5e6,
      buyRatio: 53.4,
      avgTradeSize: 2340,
      medianTradeSize: 890
    }
  },
  volatilityMetrics: {
    historicalVol: {
      current: 0.142, // 14.2%
      trend: 'increasing',
      weekHigh: 0.156,
      weekLow: 0.087
    },
    impliedVol: 0.165, // from options if available
    garchPrediction: {
      nextHour: 0.148,
      next4Hours: 0.151,
      nextDay: 0.159,
      confidence: 0.78
    },
    volatilityRank: 67 // percentile vs 252-day history
  }
}

// Mock data for analytics
const mockAnalytics = {
  onChainMetrics: {
    largeTransactions: [
      { 
        hash: '0x1a2b3c...', 
        amount: 125000, 
        type: 'Buy', 
        wallet: '0x4d5e6f...', 
        time: '3m ago',
        impact: 0.45
      },
      { 
        hash: '0x2b3c4d...', 
        amount: 89000, 
        type: 'Sell', 
        wallet: '0x5e6f7a...', 
        time: '8m ago',
        impact: 0.32
      },
      { 
        hash: '0x3c4d5e...', 
        amount: 234000, 
        type: 'Buy', 
        wallet: '0x6f7a8b...', 
        time: '15m ago',
        impact: 0.78
      }
    ],
    holderAnalysis: {
      totalHolders: 12456,
      change24h: 234,
      topHolders: [
        { address: '0xa1b2c3...', balance: 2.5e6, percentage: 8.7, change: 12500 },
        { address: '0xb2c3d4...', balance: 1.8e6, percentage: 6.2, change: -5600 },
        { address: '0xc3d4e5...', balance: 1.4e6, percentage: 4.9, change: 8900 },
        { address: '0xd4e5f6...', balance: 1.1e6, percentage: 3.8, change: 0 }
      ],
      distribution: {
        whales: 15.2, // >100k USDC
        mediumHolders: 35.8, // 10k-100k
        smallHolders: 49.0 // <10k
      }
    },
    flowAnalysis: {
      netFlow24h: 1.2e6, // USDC
      inflow: 2.8e6,
      outflow: 1.6e6,
      trend: 'accumulation',
      exchangeInflow: 850000,
      exchangeOutflow: 1200000
    }
  },
  marketSentiment: {
    longShortRatio: {
      current: 2.34, // Long:Short
      trend: 'increasing',
      history: [
        { time: '00:00', ratio: 2.12 },
        { time: '04:00', ratio: 2.18 },
        { time: '08:00', ratio: 2.25 },
        { time: '12:00', ratio: 2.34 },
        { time: '16:00', ratio: 2.29 },
        { time: '20:00', ratio: 2.34 }
      ]
    },
    fearGreedIndex: {
      value: 68,
      label: 'Greed',
      change24h: 5,
      components: {
        volatility: 72,
        marketMomentum: 65,
        socialVolume: 71,
        surveys: 62,
        dominance: 58,
        trends: 75
      }
    },
    socialSentiment: {
      twitterMentions: 12567,
      sentiment: 'positive', // positive, neutral, negative
      sentimentScore: 0.65, // -1 to 1
      keyPhrases: ['moon', 'bullish', 'hodl', 'pump'],
      influencerPosts: [
        { author: '@CryptoGuru', followers: 234000, content: 'MEME_INDEX looking strong 🚀', engagement: 1250 },
        { author: '@DefiLlama', followers: 567000, content: 'New ATH incoming?', engagement: 2340 }
      ]
    }
  },
  technicalAnalysis: {
    patternRecognition: [
      {
        pattern: 'Ascending Triangle',
        timeframe: '4h',
        confidence: 0.78,
        target: 2.89,
        breakout: 'bullish',
        status: 'forming'
      },
      {
        pattern: 'Bull Flag',
        timeframe: '1h',
        confidence: 0.65,
        target: 2.67,
        breakout: 'bullish',
        status: 'completed'
      },
      {
        pattern: 'Support Zone',
        timeframe: '1d',
        confidence: 0.82,
        level: 2.34,
        type: 'support',
        status: 'active'
      }
    ],
    backtesting: {
      strategy: 'MACD + RSI Divergence',
      period: '30 days',
      winRate: 68.4,
      totalTrades: 23,
      avgReturn: 4.2,
      maxDrawdown: 8.9,
      sharpeRatio: 1.45,
      results: [
        { date: '2024-01-20', signal: 'buy', entry: 2.34, exit: 2.45, pnl: 4.7 },
        { date: '2024-01-18', signal: 'sell', entry: 2.56, exit: 2.48, pnl: 3.1 },
        { date: '2024-01-15', signal: 'buy', entry: 2.21, exit: 2.38, pnl: 7.7 }
      ]
    },
    signals: {
      active: [
        {
          type: 'RSI Oversold',
          strength: 'Strong',
          direction: 'Bullish',
          timeframe: '4h',
          generated: '2h ago',
          confidence: 0.85
        },
        {
          type: 'Volume Breakout',
          strength: 'Medium',
          direction: 'Bullish',
          timeframe: '1h',
          generated: '45m ago',
          confidence: 0.72
        },
        {
          type: 'MA Golden Cross',
          strength: 'Strong',
          direction: 'Bullish',
          timeframe: '1d',
          generated: '6h ago',
          confidence: 0.91
        }
      ],
      history: [
        { signal: 'MACD Bullish Cross', time: '2024-01-20 14:30', accuracy: 'Hit', pnl: 5.6 },
        { signal: 'BB Squeeze Release', time: '2024-01-19 09:15', accuracy: 'Miss', pnl: -2.1 },
        { signal: 'Volume Spike Alert', time: '2024-01-18 16:45', accuracy: 'Hit', pnl: 8.3 }
      ]
    }
  }
}

// Mock data for order history
const mockOrderHistory = [
  {
    id: 'ORD001',
    time: '2024-01-20 14:23:15',
    symbol: 'MEME_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 2.45,
    filledPrice: 2.44,
    quantity: 1.5,
    filled: 1.5,
    fillRate: 100,
    status: 'Filled',
    fee: 3.66,
    feeType: 'maker',
    slippage: -0.41, // negative = better execution
    marketImpact: 0.12
  },
  {
    id: 'ORD002',
    time: '2024-01-20 13:45:08',
    symbol: 'DOG_INDEX',
    type: 'Market',
    side: 'Sell',
    requestedPrice: null, // market order
    filledPrice: 1.73,
    quantity: 0.8,
    filled: 0.8,
    fillRate: 100,
    status: 'Filled',
    fee: 1.38,
    feeType: 'taker',
    slippage: 0.58, // positive = worse execution
    marketImpact: 0.08
  },
  {
    id: 'ORD003',
    time: '2024-01-20 12:30:22',
    symbol: 'CAT_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 1.45,
    filledPrice: 0,
    quantity: 2.0,
    filled: 0,
    fillRate: 0,
    status: 'Cancelled',
    fee: 0,
    feeType: null,
    slippage: null,
    marketImpact: null
  },
  {
    id: 'ORD004',
    time: '2024-01-19 16:15:45',
    symbol: 'AI_INDEX',
    type: 'Stop',
    side: 'Sell',
    requestedPrice: 3.21,
    filledPrice: 3.19,
    quantity: 1.2,
    filled: 1.2,
    fillRate: 100,
    status: 'Filled',
    fee: 3.83,
    feeType: 'taker',
    slippage: 0.62,
    marketImpact: 0.15
  },
  {
    id: 'ORD005',
    time: '2024-01-19 10:20:18',
    symbol: 'MEME_INDEX',
    type: 'Limit',
    side: 'Buy',
    requestedPrice: 2.30,
    filledPrice: 0,
    quantity: 3.0,
    filled: 0,
    fillRate: 0,
    status: 'Expired',
    fee: 0,
    feeType: null,
    slippage: null,
    marketImpact: null
  }
]

// Mock data for trade history  
const mockTradeHistory = [
  {
    id: 'TRD001',
    time: '2024-01-20 14:23:15',
    symbol: 'MEME_INDEX',
    side: 'Buy',
    price: 2.44,
    quantity: 1.5,
    value: 3.66,
    fee: 3.66,
    feeType: 'maker',
    realizedPnL: null, // position still open
    tradeId: 'HYP_12345678'
  },
  {
    id: 'TRD002',
    time: '2024-01-20 13:45:08', 
    symbol: 'DOG_INDEX',
    side: 'Sell',
    price: 1.73,
    quantity: 0.8,
    value: 1.384,
    fee: 1.38,
    feeType: 'taker',
    realizedPnL: 45.67, // closed position
    tradeId: 'HYP_12345679'
  },
  {
    id: 'TRD003',
    time: '2024-01-19 16:15:45',
    symbol: 'AI_INDEX', 
    side: 'Sell',
    price: 3.19,
    quantity: 1.2,
    value: 3.828,
    fee: 3.83,
    feeType: 'taker',
    realizedPnL: -12.34, // loss
    tradeId: 'HYP_12345680'
  },
  {
    id: 'TRD004',
    time: '2024-01-19 11:30:22',
    symbol: 'CAT_INDEX',
    side: 'Buy',
    price: 1.42,
    quantity: 1.5,
    value: 2.13,
    fee: 2.13,
    feeType: 'maker',
    realizedPnL: null,
    tradeId: 'HYP_12345681'
  },
  {
    id: 'TRD005',
    time: '2024-01-18 15:45:10',
    symbol: 'MEME_INDEX',
    side: 'Sell',
    price: 2.38,
    quantity: 0.5,
    value: 1.19,
    fee: 1.19,
    feeType: 'taker',
    realizedPnL: 23.45,
    tradeId: 'HYP_12345682'
  }
]

// Mock trading statistics
const mockTradingStats = {
  totalTrades: 47,
  totalVolume: 125670,
  winRate: 68.1,
  avgReturn: 4.2,
  totalFees: 234.56,
  totalPnL: 1456.78,
  bestTrade: 89.23,
  worstTrade: -34.56,
  avgHoldTime: '2.3 days',
  profitFactor: 1.85,
  monthlyStats: [
    { month: 'Jan 2024', trades: 12, volume: 28450, pnl: 234.56, winRate: 75.0 },
    { month: 'Dec 2023', trades: 15, volume: 35670, pnl: 345.67, winRate: 66.7 },
    { month: 'Nov 2023', trades: 20, volume: 61550, pnl: 876.55, winRate: 65.0 }
  ]
}

export function TradingBottomTabs() {
  const [activeTab, setActiveTab] = useState('positions')
<<<<<<< Updated upstream
  const [showHistory, setShowHistory] = useState(false)
  const [showDiversification, setShowDiversification] = useState(false)
=======

  // 서버와 클라이언트에서 동일한 값 사용
  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalMargin = mockPositions.reduce((sum, pos) => sum + pos.margin, 0)
  const winningPositions = mockPositions.filter(p => p.pnl > 0).length
  const avgReturn = mockPositions.reduce((sum, pos) => sum + pos.pnlPercent, 0) / mockPositions.length
>>>>>>> Stashed changes

  return (
    <div className="min-h-[50vh] bg-slate-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 bg-slate-900 border-b border-slate-700 rounded-none w-full">
          <TabsTrigger value="positions" className="text-xs data-[state=active]:bg-blue-600">
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs data-[state=active]:bg-blue-600">
            Orders
          </TabsTrigger>
          <TabsTrigger value="orderHistory" className="text-xs data-[state=active]:bg-blue-600">
            Order History
          </TabsTrigger>
          <TabsTrigger value="tradeHistory" className="text-xs data-[state=active]:bg-blue-600">
            Trades
          </TabsTrigger>
          <TabsTrigger value="composition" className="text-xs data-[state=active]:bg-blue-600">
            Composition
          </TabsTrigger>
          <TabsTrigger value="funding" className="text-xs data-[state=active]:bg-blue-600">
            Funding
          </TabsTrigger>
          <TabsTrigger value="market" className="text-xs data-[state=active]:bg-blue-600">
            Market
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-blue-600">
            Analytics
          </TabsTrigger>
        </TabsList>
        
<<<<<<< Updated upstream
        <div className="flex-1 overflow-hidden">
          {/* Positions Tab */}
          <TabsContent value="positions" className="h-full m-0 p-4">
            <div className="space-y-3">
=======
        <div className="bg-slate-950">
          {/* Positions Tab - Enhanced with detailed information */}
          <TabsContent value="positions" className="h-auto m-0 p-4">
            <div className="space-y-4">
>>>>>>> Stashed changes
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Active Positions</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  {mockPositions.length} Open
                </Badge>
              </div>
              
              <div className="space-y-2">
<<<<<<< Updated upstream
                {mockPositions.map((position) => (
                  <Card key={position.id} className="bg-slate-800/50 border-slate-700">
=======
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 text-xs text-slate-400 px-2 py-1 border-b border-slate-700">
                  <div>Symbol</div>
                  <div className="text-center">Side/Size</div>
                  <div className="text-center">Entry</div>
                  <div className="text-center">Mark</div>
                  <div className="text-center">P&L</div>
                  <div className="text-center">Margin</div>
                  <div className="text-center">Liq. Price</div>
                  <div className="text-center">ADL</div>
                  <div className="text-center">Funding</div>
                </div>

                {/* Position Rows */}
                {mockPositions.map((position) => {
                  const getADLColor = (rank: number) => {
                    switch (rank) {
                      case 1: return 'text-green-400 bg-green-400/10 border-green-400/30'
                      case 2: return 'text-green-400 bg-green-400/10 border-green-400/30'
                      case 3: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                      case 4: return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
                      case 5: return 'text-red-400 bg-red-400/10 border-red-400/30'
                      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30'
                    }
                  }

                  return (
                    <Card key={position.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                      <CardContent className="p-3">
                        <div className="grid grid-cols-9 gap-2 items-center text-xs">
                          {/* Symbol */}
                          <div>
                            <div className="font-semibold text-white">{position.symbol}</div>
                            <div className="text-slate-400">{position.leverage}</div>
                          </div>

                          {/* Side/Size */}
                          <div className="text-center">
                            <Badge 
                              variant="outline" 
                              className={`text-xs mb-1 ${
                                position.side === 'Long' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
                              }`}
                            >
                              {position.side}
                            </Badge>
                            <div className="text-white font-medium">{Math.abs(position.size).toFixed(1)}</div>
                          </div>

                          {/* Entry Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.entryPrice.toFixed(3)}</div>
                          </div>

                          {/* Mark Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.currentPrice.toFixed(3)}</div>
                            <div className={`text-xs ${
                              position.currentPrice > position.entryPrice 
                                ? (position.side === 'Long' ? 'text-green-400' : 'text-red-400')
                                : (position.side === 'Long' ? 'text-red-400' : 'text-green-400')
                            }`}>
                              {((position.currentPrice - position.entryPrice) / position.entryPrice * 100).toFixed(2)}%
                            </div>
                          </div>

                          {/* P&L */}
                          <div className="text-center">
                            <div className={`font-semibold ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                            </div>
                            <div className={`text-xs ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                            </div>
                          </div>

                          {/* Margin */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.margin.toFixed(0)}</div>
                          </div>

                          {/* Liquidation Price */}
                          <div className="text-center">
                            <div className="text-white font-medium">${position.liquidationPrice.toFixed(3)}</div>
                            <div className="text-xs text-slate-400">
                              {(Math.abs((position.liquidationPrice - position.currentPrice) / position.currentPrice) * 100).toFixed(1)}%
                            </div>
                          </div>

                          {/* ADL Rank */}
                          <div className="text-center">
                            <Badge variant="outline" className={`text-xs ${getADLColor(position.adlRank)}`}>
                              {position.adlRank}
                            </Badge>
                          </div>

                          {/* Funding */}
                          <div className="text-center">
                            <div className={`text-xs font-medium ${
                              position.fundingRate >= 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {position.fundingRate >= 0 ? '+' : ''}{(position.fundingRate * 100).toFixed(4)}%
                            </div>
                            <div className="text-xs text-slate-400">{position.nextFunding}</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-slate-700">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-green-400 hover:bg-green-400/10">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-red-400 hover:bg-red-400/10">
                            <Minus className="w-3 h-3 mr-1" />
                            Reduce
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-400 hover:bg-slate-400/10">
                            <X className="w-3 h-3 mr-1" />
                            Close
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-400 hover:bg-blue-400/10">
                            <Target className="w-3 h-3 mr-1" />
                            TP/SL
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Risk Management Summary */}
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm font-semibold text-white">Risk Management</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Portfolio Margin</div>
                      <div className="text-sm font-semibold text-white">
                        ${totalMargin.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Avg Leverage</div>
                      <div className="text-sm font-semibold text-orange-400">
                        {(mockPositions.reduce((sum, pos) => sum + parseInt(pos.leverage), 0) / mockPositions.length).toFixed(1)}x
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Highest ADL</div>
                      <div className={`text-sm font-semibold ${
                        Math.max(...mockPositions.map(p => p.adlRank)) >= 4 ? 'text-red-400' : 
                        Math.max(...mockPositions.map(p => p.adlRank)) >= 3 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {Math.max(...mockPositions.map(p => p.adlRank))}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Funding Impact</div>
                      <div className={`text-sm font-semibold ${
                        mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) >= 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) >= 0 ? '+' : ''}{(mockPositions.reduce((sum, pos) => sum + pos.fundingRate, 0) * 100).toFixed(3)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactionHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    <Clock className="w-3 h-3 mr-1" />
                    All Transactions
                  </Badge>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-center">
                  <div className="text-lg text-slate-400 mb-2">No transaction history</div>
                  <div className="text-sm text-slate-500">
                    Your transaction history will appear here when you start trading.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Position History Tab */}
          <TabsContent value="positionHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Position History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Closed Positions
                  </Badge>
                </div>
              </div>

              {/* Mock Position History */}
              <div className="space-y-2">
                {[
                  {
                    symbol: 'MEME_INDEX',
                    side: 'Long',
                    openTime: '2024-01-19 14:30:22',
                    closeTime: '2024-01-20 09:15:33',
                    size: 2.5,
                    entryPrice: 2.34,
                    exitPrice: 2.67,
                    pnl: 825.00,
                    pnlPercent: 14.1,
                    duration: '18h 45m'
                  },
                  {
                    symbol: 'DOG_INDEX',
                    side: 'Short',
                    openTime: '2024-01-18 10:20:15',
                    closeTime: '2024-01-19 16:45:12',
                    size: 1.8,
                    entryPrice: 1.89,
                    exitPrice: 1.73,
                    pnl: 288.00,
                    pnlPercent: 8.4,
                    duration: '1d 6h 25m'
                  },
                  {
                    symbol: 'CAT_INDEX',
                    side: 'Long',
                    openTime: '2024-01-17 08:15:44',
                    closeTime: '2024-01-18 12:30:18',
                    size: 3.2,
                    entryPrice: 1.15,
                    exitPrice: 1.08,
                    pnl: -224.00,
                    pnlPercent: -6.1,
                    duration: '1d 4h 15m'
                  }
                ].map((position, index) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
>>>>>>> Stashed changes
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={position.side === 'Long' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                          >
                            {position.side} {position.leverage}
                          </Badge>
                          <span className="font-semibold text-white">{position.symbol}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-400">
                            +${position.pnl.toFixed(2)} ({position.pnlPercent}%)
                          </div>
                          <div className="text-xs text-slate-400">
                            Size: {position.size} • Entry: ${position.entryPrice}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

<<<<<<< Updated upstream
=======
          {/* Assets Tab */}
          <TabsContent value="assets" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Assets Overview</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Portfolio
                  </Badge>
                </div>
              </div>

              {/* Account Summary */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Account Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Balance</div>
                      <div className="text-sm font-semibold text-white">$12,543.67</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Available</div>
                      <div className="text-sm font-semibold text-green-400">$8,234.12</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">In Orders</div>
                      <div className="text-sm font-semibold text-yellow-400">$1,234.56</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">In Positions</div>
                      <div className="text-sm font-semibold text-blue-400">$3,074.99</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asset List */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Assets</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { asset: 'USDC', balance: 8234.12, locked: 1234.56, total: 9468.68 },
                      { asset: 'MEME_INDEX', balance: 1.5, locked: 0, total: 1.5 },
                      { asset: 'DOG_INDEX', balance: 0, locked: 0.8, total: 0.8 },
                      { asset: 'CAT_INDEX', balance: 2.0, locked: 0, total: 2.0 }
                    ].map((asset, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {asset.asset[0]}
                          </div>
                          <span className="font-medium text-white text-sm">{asset.asset}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white font-medium">
                            {asset.asset === 'USDC' ? `${asset.total.toLocaleString()}` : asset.total.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-400">
                            Available: {asset.asset === 'USDC' ? `${asset.balance.toLocaleString()}` : asset.balance.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

>>>>>>> Stashed changes
          {/* Open Orders Tab */}
          <TabsContent value="orders" className="h-auto m-0 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Open Orders</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                  {mockOrders.length} Orders
                </Badge>
              </div>
              
              <div className="space-y-2">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={order.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                          >
                            {order.side}
                          </Badge>
                          <span className="font-semibold text-white">{order.symbol}</span>
                          <span className="text-xs text-slate-400">{order.type}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-white">
                            {order.size} @ ${order.price}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.time} • {order.status}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orderHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Order History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {mockOrderHistory.length} Orders
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Order Statistics Summary */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Filled Orders</div>
                  <div className="text-sm font-semibold text-green-400">
                    {mockOrderHistory.filter(o => o.status === 'Filled').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Cancelled</div>
                  <div className="text-sm font-semibold text-orange-400">
                    {mockOrderHistory.filter(o => o.status === 'Cancelled').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Expired</div>
                  <div className="text-sm font-semibold text-red-400">
                    {mockOrderHistory.filter(o => o.status === 'Expired').length}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400">Fill Rate</div>
                  <div className="text-sm font-semibold text-white">
                    {((mockOrderHistory.filter(o => o.status === 'Filled').length / mockOrderHistory.length) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Order History Table */}
              <div className="space-y-2">
                {mockOrderHistory.map((order) => (
                  <Card key={order.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              order.status === 'Filled' ? 'text-green-400 border-green-400/30' :
                              order.status === 'Cancelled' ? 'text-orange-400 border-orange-400/30' :
                              'text-red-400 border-red-400/30'
                            }`}
                          >
                            {order.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${order.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                          >
                            {order.side}
                          </Badge>
                          <span className="font-semibold text-white text-sm">{order.symbol}</span>
                          <span className="text-xs text-slate-400">{order.type}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{order.time}</div>
                          <div className="text-xs text-slate-300">ID: {order.id}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Requested Price</div>
                          <div className="text-white font-medium">
                            {order.requestedPrice ? `$${order.requestedPrice}` : 'Market'}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Filled Price</div>
                          <div className="text-white font-medium">
                            {order.filledPrice > 0 ? `$${order.filledPrice}` : '-'}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Quantity</div>
                          <div className="text-white font-medium">
                            {order.filled}/{order.quantity} ({order.fillRate}%)
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">
                            {order.status === 'Filled' ? 'Fee' : 'Status'}
                          </div>
                          <div className="text-white font-medium">
                            {order.status === 'Filled' ? (
                              <div className="flex items-center gap-1">
                                <span>${order.fee}</span>
                                <Badge variant="outline" className={`text-xs ${
                                  order.feeType === 'maker' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'
                                }`}>
                                  {order.feeType}
                                </Badge>
                              </div>
                            ) : order.status}
                          </div>
                        </div>
                      </div>

                      {/* Execution Analysis (only for filled orders) */}
                      {order.status === 'Filled' && (
                        <div className="mt-3 pt-2 border-t border-slate-700">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Slippage:</span>
                                <span className={`font-medium ${
                                  order.slippage < 0 ? 'text-green-400' : 
                                  order.slippage > 0.5 ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                  {order.slippage > 0 ? '+' : ''}{order.slippage}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Impact:</span>
                                <span className="text-white font-medium">{order.marketImpact}%</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-blue-300 h-5 px-2">
                              <ExternalLink className="w-2 h-2 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center pt-2">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                  Load More Orders
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="tradeHistory" className="h-auto m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Trade History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <Activity className="w-3 h-3 mr-1" />
                    {mockTradeHistory.length} Trades
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>

              {/* Trading Statistics Summary */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Trading Performance</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Trades</div>
                      <div className="text-sm font-semibold text-white">
                        {mockTradingStats.totalTrades}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Win Rate</div>
                      <div className="text-sm font-semibold text-green-400">
                        {mockTradingStats.winRate}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total P&L</div>
                      <div className="text-sm font-semibold text-green-400">
                        +${mockTradingStats.totalPnL}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Volume</div>
                      <div className="text-sm font-semibold text-white">
                        ${(mockTradingStats.totalVolume / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Avg Return</div>
                      <div className="text-sm font-semibold text-blue-400">
                        +{mockTradingStats.avgReturn}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total Fees</div>
                      <div className="text-sm font-semibold text-orange-400">
                        ${mockTradingStats.totalFees}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Best Trade</div>
                      <div className="text-sm font-semibold text-green-400">
                        +${mockTradingStats.bestTrade}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Profit Factor</div>
                      <div className="text-sm font-semibold text-cyan-400">
                        {mockTradingStats.profitFactor}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">Monthly Performance</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {mockTradingStats.monthlyStats.map((month, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 w-16">{month.month}</span>
                          <div className="text-xs text-slate-300">
                            {month.trades} trades • ${(month.volume / 1000).toFixed(0)}K vol
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-green-400 font-medium">
                            +${month.pnl}
                          </div>
                          <div className="text-xs text-white">
                            {month.winRate}% win
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trade History Table */}
              <div className="space-y-2">
                {mockTradeHistory.map((trade) => (
                  <Card key={trade.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${trade.side === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                          >
                            {trade.side}
                          </Badge>
                          <span className="font-semibold text-white text-sm">{trade.symbol}</span>
                          <div className="text-xs text-slate-400">
                            {trade.quantity} @ ${trade.price}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{trade.time}</div>
                          <div className="text-xs text-slate-300">ID: {trade.tradeId}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Trade Value</div>
                          <div className="text-white font-medium">
                            ${trade.value.toFixed(3)}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Fee</div>
                          <div className="text-white font-medium">
                            <div className="flex items-center gap-1">
                              <span>${trade.fee}</span>
                              <Badge variant="outline" className={`text-xs ${
                                trade.feeType === 'maker' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'
                              }`}>
                                {trade.feeType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Realized P&L</div>
                          <div className="font-medium">
                            {trade.realizedPnL !== null ? (
                              <span className={trade.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {trade.realizedPnL >= 0 ? '+' : ''}${trade.realizedPnL}
                              </span>
                            ) : (
                              <span className="text-slate-400">Open</span>
                            )}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400">Trade ID</div>
                          <div className="text-white font-medium font-mono text-xs">
                            {trade.tradeId.split('_')[1]}
                          </div>
                        </div>
                      </div>

                      {/* Trade Analysis */}
                      <div className="mt-3 pt-2 border-t border-slate-700">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            {trade.realizedPnL !== null && (
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Return:</span>
                                <span className={`font-medium ${
                                  trade.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {trade.realizedPnL >= 0 ? '+' : ''}{((trade.realizedPnL / trade.value) * 100).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Side:</span>
                              <span className={`font-medium ${
                                trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {trade.side === 'Buy' ? 'Long' : 'Short'}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-blue-300 h-5 px-2">
                            <ExternalLink className="w-2 h-2 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center pt-2">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                  Load More Trades
                </Button>
              </div>
            </div>
          </TabsContent>

<<<<<<< Updated upstream
          {/* Index Composition Tab - 핵심 차별화 기능 */}
          <TabsContent value="composition" className="h-full m-0 p-4">
=======
          {/* Market Data Tab - Holders, Whale, P&L Information */}
          <TabsContent value="marketData" className="h-auto m-0 p-4">
>>>>>>> Stashed changes
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Index Composition</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    <PieChart className="w-3 h-3 mr-1" />
                    7 Assets
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-slate-400 hover:text-white"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="w-3 h-3 mr-1" />
                    History
                    {showHistory ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-slate-400 hover:text-white"
                    onClick={() => setShowDiversification(!showDiversification)}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Metrics
                    {showDiversification ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                  </Button>
                </div>
              </div>

              {/* Composition History Section */}
              {showHistory && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">Composition Changes History</h4>
                    <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                      Last 30 days
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {mockCompositionHistory.map((entry, index) => (
                      <Card key={index} className="bg-slate-900/50 border-slate-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  entry.type === 'Rebalancing' ? 'text-blue-400 border-blue-400/30' :
                                  entry.type === 'Addition' ? 'text-green-400 border-green-400/30' :
                                  'text-red-400 border-red-400/30'
                                }`}
                              >
                                {entry.type}
                              </Badge>
                              <span className="text-xs text-slate-400">{entry.date}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {entry.changes.map((change, changeIndex) => (
                              <div key={changeIndex} className="flex items-center justify-between bg-slate-800/50 rounded p-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                    change.action === 'added' ? 'bg-green-500/20' :
                                    change.action === 'removed' ? 'bg-red-500/20' :
                                    change.action === 'increased' ? 'bg-blue-500/20' :
                                    'bg-orange-500/20'
                                  }`}>
                                    {change.action === 'added' ? <Plus className="w-2 h-2 text-green-400" /> :
                                     change.action === 'removed' ? <X className="w-2 h-2 text-red-400" /> :
                                     change.action === 'increased' ? <TrendingUpIcon className="w-2 h-2 text-blue-400" /> :
                                     <TrendingDownIcon className="w-2 h-2 text-orange-400" />}
                                  </div>
                                  <span className="font-medium text-white text-sm">{change.symbol}</span>
                                  <div className="text-xs text-slate-400">
                                    {change.from}% → {change.to}%
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-slate-400 max-w-32 truncate">
                                    {change.reason}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-3">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                      View Full History
                    </Button>
                  </div>
                </div>
              )}

              {/* Diversification Metrics Section */}
              {showDiversification && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">Diversification Analysis</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        mockDiversificationMetrics.diversificationGrade.startsWith('A') ? 'text-green-400 border-green-400/30' :
                        mockDiversificationMetrics.diversificationGrade.startsWith('B') ? 'text-yellow-400 border-yellow-400/30' :
                        'text-orange-400 border-orange-400/30'
                      }`}
                    >
                      Grade: {mockDiversificationMetrics.diversificationGrade}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {/* Herfindahl Index */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-slate-400">Herfindahl Index</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {mockDiversificationMetrics.herfindahlIndex.toFixed(3)}
                      </div>
                      <div className="text-xs text-green-400">Well Diversified</div>
                    </div>
                    
                    {/* Concentration Ratio */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-slate-400">Top 3 Ratio</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {mockDiversificationMetrics.concentrationRatio}%
                      </div>
                      <div className="text-xs text-yellow-400">Moderate</div>
                    </div>
                    
                    {/* Beta Coefficient */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-slate-400">Beta</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {mockDiversificationMetrics.betaCoefficient}
                      </div>
                      <div className="text-xs text-blue-400">vs Market</div>
                    </div>
                    
                    {/* Risk Score */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-slate-400">Risk Score</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {mockDiversificationMetrics.riskScore}/10
                      </div>
                      <div className="text-xs text-orange-400">High Risk</div>
                    </div>
                  </div>
                  
                  {/* Correlation Matrix */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <BarChart3 className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs font-medium text-white">Asset Correlations</span>
                      <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30 ml-auto">
                        Top Pairs
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {mockDiversificationMetrics.correlationMatrix
                        .sort((a, b) => b.correlation - a.correlation)
                        .slice(0, 3)
                        .map((pair, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white">{pair.asset1}</span>
                            <ArrowUpDown className="w-2 h-2 text-slate-400" />
                            <span className="text-xs text-white">{pair.asset2}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={pair.correlation * 100} className="h-1 w-16" />
                            <span className={`text-xs font-medium ${
                              pair.correlation > 0.7 ? 'text-red-400' :
                              pair.correlation > 0.5 ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {(pair.correlation * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-700">
                      <Info className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">
                        Lower correlation = better diversification
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockIndexComposition.map((asset, index) => (
                  <Card key={asset.symbol} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-base">{asset.symbol}</span>
                              <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                                {asset.weight}%
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {asset.quantity.toLocaleString()} tokens
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <div className={`text-sm font-semibold ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                            </div>
                            {asset.change24h >= 0 ? 
                              <TrendingUpIcon className="w-3 h-3 text-green-400" /> : 
                              <TrendingDownIcon className="w-3 h-3 text-red-400" />
                            }
                          </div>
                          <div className="text-xs text-slate-400">
                            ${asset.price.toFixed(asset.price < 0.01 ? 8 : 4)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={asset.weight} className="h-2" />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-slate-400">Market Cap</div>
                            <div className="text-white font-medium">
                              ${asset.marketCap >= 1e9 ? 
                                `${(asset.marketCap / 1e9).toFixed(1)}B` : 
                                `${(asset.marketCap / 1e6).toFixed(0)}M`}
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-slate-400">24h Volume</div>
                            <div className="text-white font-medium">
                              ${asset.volume24h >= 1e9 ? 
                                `${(asset.volume24h / 1e9).toFixed(1)}B` : 
                                `${(asset.volume24h / 1e6).toFixed(0)}M`}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs text-slate-400">
                            Allocation: ${asset.allocation.toLocaleString()}
                          </span>
                          <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-blue-300 h-6 px-2">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Chart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Funding History Tab */}
          <TabsContent value="funding" className="h-full m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Funding History</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <Timer className="w-3 h-3 mr-1" />
                    Next: {mockFundingHistory.nextFunding}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs">
                    <Bell className="w-3 h-3 mr-1" />
                    Alerts
                  </Button>
                </div>
              </div>

              {/* Current Funding Rate */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-white">Current Funding Rate</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${mockFundingHistory.currentRate > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {mockFundingHistory.currentRate > 0 ? '+' : ''}{(mockFundingHistory.currentRate * 100).toFixed(4)}%
                      </div>
                      <div className="text-xs text-slate-400">8h funding cycle</div>
                    </div>
                  </div>
                  
                  {/* Exchange Comparison */}
                  <div className="grid grid-cols-4 gap-2">
                    {mockFundingHistory.exchangeComparison.map((exchange) => (
                      <div key={exchange.exchange} className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400 mb-1">{exchange.exchange}</div>
                        <div className={`text-xs font-medium ${
                          exchange.exchange === 'Hyperliquid' ? 'text-blue-400' :
                          exchange.color === 'yellow' ? 'text-yellow-400' :
                          exchange.color === 'orange' ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {(exchange.rate * 100).toFixed(4)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Funding Statistics */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Funding Statistics (7 days)</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Average</div>
                      <div className="text-sm font-semibold text-white">
                        {(mockFundingHistory.statistics.average * 100).toFixed(4)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Highest</div>
                      <div className="text-sm font-semibold text-red-400">
                        {(mockFundingHistory.statistics.highest * 100).toFixed(4)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Lowest</div>
                      <div className="text-sm font-semibold text-green-400">
                        {(mockFundingHistory.statistics.lowest * 100).toFixed(4)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Std Dev</div>
                      <div className="text-sm font-semibold text-white">
                        {(mockFundingHistory.statistics.stdDeviation * 100).toFixed(4)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Annual Cost</div>
                      <div className="text-sm font-semibold text-orange-400">
                        {mockFundingHistory.statistics.annualizedCost.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Funding Rates Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">Recent Funding Rates</h4>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-xs">
                      Last 3 days
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockFundingHistory.recentRates.map((rate, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{rate.date}</span>
                          <span className="text-xs text-slate-300">{rate.time}</span>
                        </div>
                        <div className={`text-xs font-medium ${rate.rate > 0.01 ? 'text-red-400' : rate.rate > 0.005 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {(rate.rate * 100).toFixed(4)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Funding P&L */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">My Funding P&L</h4>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Total</div>
                      <div className={`text-sm font-semibold ${mockFundingHistory.myFundingPnL.total < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${mockFundingHistory.myFundingPnL.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">This Week</div>
                      <div className={`text-sm font-semibold ${mockFundingHistory.myFundingPnL.thisWeek < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${mockFundingHistory.myFundingPnL.thisWeek.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">This Month</div>
                      <div className={`text-sm font-semibold ${mockFundingHistory.myFundingPnL.thisMonth < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${mockFundingHistory.myFundingPnL.thisMonth.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {mockFundingHistory.myFundingPnL.breakdown.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                        <div>
                          <div className="text-xs text-slate-300">{payment.position}</div>
                          <div className="text-xs text-slate-400">{payment.date}</div>
                        </div>
                        <div className={`text-xs font-medium ${payment.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          ${payment.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Data Tab */}
          <TabsContent value="market" className="h-full m-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Market Data Analysis</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    <Eye className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
              </div>

              {/* Depth Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">Order Book Depth Analysis</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Bid/Ask Spread</div>
                      <div className={`text-sm font-semibold ${
                        mockMarketData.orderBookDepth.spreadInfo.spreadTrend === 'tightening' ? 'text-green-400' :
                        mockMarketData.orderBookDepth.spreadInfo.spreadTrend === 'widening' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {(mockMarketData.orderBookDepth.spreadInfo.bidAskSpread * 100).toFixed(3)}%
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {mockMarketData.orderBookDepth.spreadInfo.spreadTrend}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Mid Price</div>
                      <div className="text-sm font-semibold text-white">
                        ${mockMarketData.orderBookDepth.spreadInfo.midPrice}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">5L Depth</div>
                      <div className="text-sm font-semibold text-white">
                        ${(mockMarketData.orderBookDepth.depthAnalysis.bid5Depth / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-slate-400">Bid side</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Imbalance</div>
                      <div className={`text-sm font-semibold ${
                        mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio > 1.2 ? 'text-green-400' :
                        mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio < 0.8 ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {mockMarketData.orderBookDepth.depthAnalysis.imbalanceRatio.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">Bid/Ask</div>
                    </div>
                  </div>
                  
                  {/* Whale Orders Detection */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-orange-400" />
                      Large Orders Detected
                    </div>
                    <div className="space-y-1">
                      {mockMarketData.orderBookDepth.whaleOrders.slice(0, 3).map((order, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${order.side === 'buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {order.side.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-white">${order.size.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">@ ${order.price}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-orange-400">{order.impact}% impact</div>
                            <div className="text-xs text-slate-400">{order.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volume Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Volume Analysis</h4>
                  </div>
                  
                  {/* Volume Statistics */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">24h Volume</div>
                      <div className="text-sm font-semibold text-white">
                        ${(mockMarketData.volumeAnalysis.volumeStats.total24h / 1e6).toFixed(1)}M
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Buy Volume</div>
                      <div className="text-sm font-semibold text-green-400">
                        ${(mockMarketData.volumeAnalysis.volumeStats.buyVolume / 1e6).toFixed(1)}M
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Sell Volume</div>
                      <div className="text-sm font-semibold text-red-400">
                        ${(mockMarketData.volumeAnalysis.volumeStats.sellVolume / 1e6).toFixed(1)}M
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Buy Ratio</div>
                      <div className={`text-sm font-semibold ${
                        mockMarketData.volumeAnalysis.volumeStats.buyRatio > 55 ? 'text-green-400' :
                        mockMarketData.volumeAnalysis.volumeStats.buyRatio < 45 ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {mockMarketData.volumeAnalysis.volumeStats.buyRatio.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Avg Size</div>
                      <div className="text-sm font-semibold text-white">
                        ${mockMarketData.volumeAnalysis.volumeStats.avgTradeSize.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-xs text-slate-400">Median</div>
                      <div className="text-sm font-semibold text-white">
                        ${mockMarketData.volumeAnalysis.volumeStats.medianTradeSize.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hourly Volume Breakdown */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2">Hourly Volume (Last 6h)</div>
                    <div className="space-y-1">
                      {mockMarketData.volumeAnalysis.hourlyVolume.map((hour, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-12">{hour.hour}</span>
                            <Progress value={(hour.volume / 2.5e6) * 100} className="h-2 w-20" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white">
                              ${(hour.volume / 1e6).toFixed(1)}M
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${hour.buyRatio > 0.5 ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {(hour.buyRatio * 100).toFixed(0)}% Buy
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volatility Metrics */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Waves className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">Volatility Analysis</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Historical Vol</div>
                      <div className={`text-sm font-semibold ${
                        mockMarketData.volatilityMetrics.historicalVol.trend === 'increasing' ? 'text-red-400' :
                        mockMarketData.volatilityMetrics.historicalVol.trend === 'decreasing' ? 'text-green-400' :
                        'text-yellow-400'
                      }`}>
                        {(mockMarketData.volatilityMetrics.historicalVol.current * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {mockMarketData.volatilityMetrics.historicalVol.trend}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Implied Vol</div>
                      <div className="text-sm font-semibold text-orange-400">
                        {(mockMarketData.volatilityMetrics.impliedVol * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-400">Options based</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Vol Rank</div>
                      <div className={`text-sm font-semibold ${
                        mockMarketData.volatilityMetrics.volatilityRank > 70 ? 'text-red-400' :
                        mockMarketData.volatilityMetrics.volatilityRank > 30 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {mockMarketData.volatilityMetrics.volatilityRank}th
                      </div>
                      <div className="text-xs text-slate-400">percentile</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-xs text-slate-400">Week Range</div>
                      <div className="text-sm font-semibold text-white">
                        {(mockMarketData.volatilityMetrics.historicalVol.weekLow * 100).toFixed(1)}% - {(mockMarketData.volatilityMetrics.historicalVol.weekHigh * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* GARCH Predictions */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" />
                      GARCH Model Predictions
                      <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30 ml-auto">
                        {(mockMarketData.volatilityMetrics.garchPrediction.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Next Hour</div>
                        <div className="text-sm font-semibold text-cyan-400">
                          {(mockMarketData.volatilityMetrics.garchPrediction.nextHour * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Next 4h</div>
                        <div className="text-sm font-semibold text-cyan-400">
                          {(mockMarketData.volatilityMetrics.garchPrediction.next4Hours * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Next Day</div>
                        <div className="text-sm font-semibold text-cyan-400">
                          {(mockMarketData.volatilityMetrics.garchPrediction.nextDay * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab - 고급 분석 */}
          <TabsContent value="analytics" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Advanced Analytics</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </div>

              {/* On-Chain Metrics Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Radar className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-semibold text-white">On-Chain Metrics</h4>
                  </div>
                  
                  {/* Large Transactions Tracking */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-orange-400" />
                      Large Transactions (>$50K)
                    </div>
                    <div className="space-y-1">
                      {mockAnalytics.onChainMetrics.largeTransactions.map((tx, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${tx.type === 'Buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {tx.type}
                            </Badge>
                            <span className="text-xs text-white">${tx.amount.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">{tx.wallet}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-orange-400">{tx.impact}% impact</div>
                            <div className="text-xs text-slate-400">{tx.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Holder Analysis */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      Holder Distribution
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30 ml-auto">
                        +{mockAnalytics.onChainMetrics.holderAnalysis.change24h} holders (24h)
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Whales</div>
                        <div className="text-sm font-semibold text-red-400">
                          {mockAnalytics.onChainMetrics.holderAnalysis.distribution.whales}%
                        </div>
                        <div className="text-xs text-slate-400">&gt;100K</div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Medium</div>
                        <div className="text-sm font-semibold text-yellow-400">
                          {mockAnalytics.onChainMetrics.holderAnalysis.distribution.mediumHolders}%
                        </div>
                        <div className="text-xs text-slate-400">10K-100K</div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Small</div>
                        <div className="text-sm font-semibold text-green-400">
                          {mockAnalytics.onChainMetrics.holderAnalysis.distribution.smallHolders}%
                        </div>
                        <div className="text-xs text-slate-400">&lt;10K</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {mockAnalytics.onChainMetrics.holderAnalysis.topHolders.slice(0, 3).map((holder, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <span className="text-xs text-slate-300">{holder.address}</span>
                            <span className="text-xs text-white">{holder.percentage}%</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white">${(holder.balance / 1e6).toFixed(1)}M</div>
                            <div className={`text-xs ${holder.change > 0 ? 'text-green-400' : holder.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                              {holder.change > 0 ? '+' : ''}{holder.change.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Money Flow Analysis */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-green-400" />
                      Money Flow (24h)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-xs text-slate-400">Net Flow</div>
                        <div className={`text-sm font-semibold ${mockAnalytics.onChainMetrics.flowAnalysis.netFlow24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${(mockAnalytics.onChainMetrics.flowAnalysis.netFlow24h / 1e6).toFixed(1)}M
                        </div>
                        <div className="text-xs text-green-400 capitalize">
                          {mockAnalytics.onChainMetrics.flowAnalysis.trend}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-xs text-slate-400">Exchange Flow</div>
                        <div className={`text-sm font-semibold ${mockAnalytics.onChainMetrics.flowAnalysis.exchangeOutflow > mockAnalytics.onChainMetrics.flowAnalysis.exchangeInflow ? 'text-green-400' : 'text-red-400'}`}>
                          ${((mockAnalytics.onChainMetrics.flowAnalysis.exchangeOutflow - mockAnalytics.onChainMetrics.flowAnalysis.exchangeInflow) / 1e6).toFixed(1)}M
                        </div>
                        <div className="text-xs text-slate-400">Net Outflow</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Sentiment Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <h4 className="text-sm font-semibold text-white">Market Sentiment</h4>
                  </div>
                  
                  {/* Long/Short Ratio */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-blue-400" />
                      Long/Short Ratio
                      <Badge variant="outline" className={`text-xs ml-auto ${
                        mockAnalytics.marketSentiment.longShortRatio.trend === 'increasing' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'
                      }`}>
                        {mockAnalytics.marketSentiment.longShortRatio.trend}
                      </Badge>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded p-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Current Ratio</span>
                        <span className="text-lg font-bold text-white">
                          {mockAnalytics.marketSentiment.longShortRatio.current}:1
                        </span>
                      </div>
                      <div className="text-xs text-green-400">Bullish sentiment</div>
                    </div>

                    <div className="space-y-1">
                      {mockAnalytics.marketSentiment.longShortRatio.history.slice(-3).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{entry.time}</span>
                          <span className="text-white">{entry.ratio}:1</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fear & Greed Index */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3 text-yellow-400" />
                      Fear & Greed Index
                      <Badge variant="outline" className={`text-xs text-yellow-400 border-yellow-400/30 ml-auto`}>
                        {mockAnalytics.marketSentiment.fearGreedIndex.label}
                      </Badge>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-yellow-400">
                          {mockAnalytics.marketSentiment.fearGreedIndex.value}
                        </span>
                        <div className="text-right">
                          <div className={`text-xs ${mockAnalytics.marketSentiment.fearGreedIndex.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {mockAnalytics.marketSentiment.fearGreedIndex.change24h > 0 ? '+' : ''}{mockAnalytics.marketSentiment.fearGreedIndex.change24h} (24h)
                          </div>
                        </div>
                      </div>
                      <Progress value={mockAnalytics.marketSentiment.fearGreedIndex.value} className="h-2 mb-2" />
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>Volatility: {mockAnalytics.marketSentiment.fearGreedIndex.components.volatility}</div>
                        <div>Momentum: {mockAnalytics.marketSentiment.fearGreedIndex.components.marketMomentum}</div>
                        <div>Social: {mockAnalytics.marketSentiment.fearGreedIndex.components.socialVolume}</div>
                        <div>Surveys: {mockAnalytics.marketSentiment.fearGreedIndex.components.surveys}</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Sentiment */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-blue-400" />
                      Social Media Sentiment
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-xs text-slate-400">Mentions</div>
                        <div className="text-sm font-semibold text-white">
                          {mockAnalytics.marketSentiment.socialSentiment.twitterMentions.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-400">Twitter 24h</div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-xs text-slate-400">Sentiment</div>
                        <div className={`text-sm font-semibold ${
                          mockAnalytics.marketSentiment.socialSentiment.sentiment === 'positive' ? 'text-green-400' :
                          mockAnalytics.marketSentiment.socialSentiment.sentiment === 'negative' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {(mockAnalytics.marketSentiment.socialSentiment.sentimentScore * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-green-400 capitalize">
                          {mockAnalytics.marketSentiment.socialSentiment.sentiment}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {mockAnalytics.marketSentiment.socialSentiment.influencerPosts.map((post, index) => (
                        <div key={index} className="bg-slate-900/50 rounded p-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-blue-400">{post.author}</span>
                            <span className="text-xs text-slate-400">{post.followers.toLocaleString()} followers</span>
                          </div>
                          <div className="text-xs text-white mb-1">{post.content}</div>
                          <div className="text-xs text-slate-400">{post.engagement} engagements</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Analysis Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Technical Analysis</h4>
                  </div>
                  
                  {/* Pattern Recognition */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Search className="w-3 h-3 text-purple-400" />
                      Pattern Recognition
                    </div>
                    <div className="space-y-1">
                      {mockAnalytics.technicalAnalysis.patternRecognition.map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${pattern.breakout === 'bullish' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {pattern.pattern}
                            </Badge>
                            <span className="text-xs text-slate-400">{pattern.timeframe}</span>
                            <span className="text-xs text-slate-300">{pattern.status}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white">
                              Target: ${typeof pattern.target === 'number' ? pattern.target.toFixed(2) : pattern.level?.toFixed(2)}
                            </div>
                            <div className="text-xs text-cyan-400">
                              {(pattern.confidence * 100).toFixed(0)}% confidence
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backtesting Results */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <History className="w-3 h-3 text-orange-400" />
                      Backtesting ({mockAnalytics.technicalAnalysis.backtesting.period})
                      <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30 ml-auto">
                        {mockAnalytics.technicalAnalysis.backtesting.strategy}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Win Rate</div>
                        <div className="text-sm font-semibold text-green-400">
                          {mockAnalytics.technicalAnalysis.backtesting.winRate}%
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Total Trades</div>
                        <div className="text-sm font-semibold text-white">
                          {mockAnalytics.technicalAnalysis.backtesting.totalTrades}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Avg Return</div>
                        <div className="text-sm font-semibold text-green-400">
                          +{mockAnalytics.technicalAnalysis.backtesting.avgReturn}%
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 text-center">
                        <div className="text-xs text-slate-400">Sharpe</div>
                        <div className="text-sm font-semibold text-blue-400">
                          {mockAnalytics.technicalAnalysis.backtesting.sharpeRatio}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {mockAnalytics.technicalAnalysis.backtesting.results.slice(0, 3).map((result, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${result.signal === 'buy' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {result.signal.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-400">{result.date}</span>
                            <span className="text-xs text-slate-300">${result.entry} → ${result.exit}</span>
                          </div>
                          <div className="text-xs font-medium text-green-400">
                            +{result.pnl}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signal Generator */}
                  <div>
                    <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                      <Signal className="w-3 h-3 text-cyan-400" />
                      Active Signals
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      {mockAnalytics.technicalAnalysis.signals.active.map((signal, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              signal.strength === 'Strong' ? 'bg-green-400' :
                              signal.strength === 'Medium' ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`} />
                            <span className="text-xs font-medium text-white">{signal.type}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${signal.direction === 'Bullish' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                            >
                              {signal.direction}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-cyan-400">
                              {(signal.confidence * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">
                              {signal.timeframe} • {signal.generated}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs font-medium text-slate-300 mb-1">Recent Signal Performance</div>
                    <div className="space-y-1">
                      {mockAnalytics.technicalAnalysis.signals.history.slice(0, 2).map((signal, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded p-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${signal.accuracy === 'Hit' ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className="text-xs text-slate-300">{signal.signal}</span>
                            <span className="text-xs text-slate-400">{signal.time}</span>
                          </div>
                          <div className={`text-xs font-medium ${signal.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {signal.pnl > 0 ? '+' : ''}{signal.pnl}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}