'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Info, 
  BarChart3,
  DollarSign,
  Target,
  Activity,
  ExternalLink,
  Bell,
  Zap,
  History,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Shield,
  AlertTriangle,
  Eye,
  Volume2,
  Waves,
  Scale,
  Radar,
  Brain,
  Users,
  Plus,
  Minus,
  X,
  BookOpen,
  Copy,
  Layers,
  CheckCircle,
  Calendar
} from 'lucide-react'

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
const chartTypes = ['Candlestick', 'Line', 'Area']
const chartTabs = ['Chart', 'Info', 'Trading Data']

// Static mock data to prevent SSR hydration issues
const mockCandleData = [
  { timestamp: new Date('2024-08-04T10:00:00Z'), open: 1.2567, high: 1.2634, low: 1.2489, close: 1.2598, volume: 125000 },
  { timestamp: new Date('2024-08-04T11:00:00Z'), open: 1.2598, high: 1.2712, low: 1.2534, close: 1.2687, volume: 142000 },
  { timestamp: new Date('2024-08-04T12:00:00Z'), open: 1.2687, high: 1.2756, low: 1.2621, close: 1.2734, volume: 98000 },
  { timestamp: new Date('2024-08-04T13:00:00Z'), open: 1.2734, high: 1.2823, low: 1.2698, close: 1.2789, volume: 187000 },
  { timestamp: new Date('2024-08-04T14:00:00Z'), open: 1.2789, high: 1.2834, low: 1.2723, close: 1.2801, volume: 156000 }
]

// Generate mock data function for client-side rendering
const generateMockCandleData = () => {
  const data = []
  let basePrice = 1.2567
  const now = new Date()
  
  for (let i = 50; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const open = basePrice + (Math.random() - 0.5) * 0.02
    const volatility = 0.01 + Math.random() * 0.02
    const high = open + Math.random() * volatility
    const low = open - Math.random() * volatility
    const close = low + Math.random() * (high - low)
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: 50000 + Math.random() * 200000
    })
    
    basePrice = close + (Math.random() - 0.5) * 0.01
  }
  
  return data
}

// Mock Candlestick Chart Component
function CandlestickChart({ data, chartType, timeframe }: { data: any[], chartType: string, timeframe: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const svgWidth = 800
  const svgHeight = 400
  const margin = { top: 20, right: 60, bottom: 40, left: 60 }
  const chartWidth = svgWidth - margin.left - margin.right
  const chartHeight = svgHeight - margin.top - margin.bottom
  
  const maxPrice = Math.max(...data.map(d => d.high))
  const minPrice = Math.min(...data.map(d => d.low))
  const priceRange = maxPrice - minPrice
  const padding = priceRange * 0.1
  
  const yScale = (price: number) => {
    return margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding)) * chartHeight
  }
  
  const xScale = (index: number) => {
    return margin.left + (index / (data.length - 1)) * chartWidth
  }

  // Use static values for SSR compatibility, then update on client
  const currentPrice = isClient ? (data[data.length - 1]?.close || 1.2567) : 1.2567
  const previousPrice = isClient ? (data[data.length - 2]?.close || 1.2500) : 1.2500
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100)

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading chart...</div>
      </div>
    )
  }

  if (chartType === 'Line' || chartType === 'Area') {
    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.close)}`).join(' ')
    
    return (
      <div className="w-full h-full bg-slate-950 relative">
        {/* Price Info Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-4 bg-slate-900/80 rounded-lg p-3">
            <div>
              <div className="text-xs text-slate-400">DOG_INDEX • {timeframe}</div>
              <div className="text-2xl font-bold text-white">${currentPrice.toFixed(4)}</div>
            </div>
            <div className={`text-right ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <div className="text-sm font-semibold">
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)}
              </div>
              <div className="text-xs">
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="text-right text-slate-400">
              <div className="text-xs">24h Vol</div>
              <div className="text-sm font-semibold text-white">$2.4M</div>
            </div>
          </div>
        </div>

        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgb(51 65 85)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity={chartType === 'Area' ? "0.4" : "0.3"}/>
              <stop offset="100%" stopColor={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis price labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
            const price = minPrice + ratio * (maxPrice - minPrice)
            const y = yScale(price)
            return (
              <g key={ratio}>
                <line x1={margin.left} y1={y} x2={svgWidth - margin.right} y2={y} stroke="rgb(71 85 105)" strokeWidth="0.5" />
                <text x={svgWidth - margin.right + 5} y={y + 4} fill="rgb(148 163 184)" fontSize="11" fontFamily="monospace">
                  ${price.toFixed(4)}
                </text>
              </g>
            )
          })}
          
          {/* Area chart gradient (only for Area type) */}
          {chartType === 'Area' && (
            <path 
              d={`${pathData} L ${xScale(data.length - 1)} ${svgHeight - margin.bottom} L ${margin.left} ${svgHeight - margin.bottom} Z`} 
              fill="url(#lineGradient)" 
            />
          )}
          
          {/* Line chart */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
            strokeWidth="2" 
          />
          
          {/* Price points */}
          {data.map((d, i) => (
            <circle 
              key={i}
              cx={xScale(i)} 
              cy={yScale(d.close)} 
              r="2" 
              fill={priceChange >= 0 ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
              opacity={i === data.length - 1 ? 1 : 0}
            />
          ))}
        </svg>
      </div>
    )
  }

  // Candlestick Chart (default)
  return (
    <div className="w-full h-full bg-slate-950 relative">
      {/* Price Info Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-4 bg-slate-900/80 rounded-lg p-3">
          <div>
            <div className="text-xs text-slate-400">DOG_INDEX • {timeframe}</div>
            <div className="text-2xl font-bold text-white">${currentPrice.toFixed(4)}</div>
          </div>
          <div className={`text-right ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <div className="text-sm font-semibold">
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)}
            </div>
            <div className="text-xs">
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="text-right text-slate-400">
            <div className="text-xs">24h Vol</div>
            <div className="text-sm font-semibold text-white">$2.4M</div>
          </div>
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgb(51 65 85)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Y-axis price labels */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
          const price = minPrice + ratio * (maxPrice - minPrice)
          const y = yScale(price)
          return (
            <g key={ratio}>
              <line x1={margin.left} y1={y} x2={svgWidth - margin.right} y2={y} stroke="rgb(71 85 105)" strokeWidth="0.5" />
              <text x={svgWidth - margin.right + 5} y={y + 4} fill="rgb(148 163 184)" fontSize="11" fontFamily="monospace">
                ${price.toFixed(4)}
              </text>
            </g>
          )
        })}
        
        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = xScale(index)
          const isGreen = candle.close > candle.open
          const bodyTop = yScale(Math.max(candle.open, candle.close))
          const bodyBottom = yScale(Math.min(candle.open, candle.close))
          const bodyHeight = bodyBottom - bodyTop
          const wickTop = yScale(candle.high)
          const wickBottom = yScale(candle.low)
          
          return (
            <g key={index}>
              {/* Wick */}
              <line 
                x1={x} y1={wickTop} x2={x} y2={wickBottom} 
                stroke={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"} 
                strokeWidth="1" 
              />
              {/* Body */}
              <rect 
                x={x - 3} y={bodyTop} width="6" height={Math.max(bodyHeight, 1)}
                fill={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"}
                opacity={bodyHeight < 2 ? 1 : 0.9}
              />
            </g>
          )
        })}
        
        {/* Volume bars at bottom */}
        {data.map((candle, index) => {
          const x = xScale(index)
          const maxVolume = Math.max(...data.map(d => d.volume))
          const volumeHeight = (candle.volume / maxVolume) * 60
          const volumeY = svgHeight - margin.bottom - volumeHeight
          const isGreen = candle.close > candle.open
          
          return (
            <rect 
              key={`vol-${index}`}
              x={x - 2} y={volumeY} width="4" height={volumeHeight}
              fill={isGreen ? "rgb(34 197 94)" : "rgb(239 68 68)"}
              opacity="0.3"
            />
          )
        })}
      </svg>
    </div>
  )
}

const mockIndexComposition = [
  { symbol: 'DOGE', weight: 25.4, change24h: 8.2, price: 0.085 },
  { symbol: 'SHIB', weight: 18.7, change24h: -2.1, price: 0.00001243 },
  { symbol: 'PEPE', weight: 15.9, change24h: 12.5, price: 0.00000876 },
  { symbol: 'FLOKI', weight: 12.3, change24h: 5.7, price: 0.000245 },
  { symbol: 'BONK', weight: 11.2, change24h: -1.8, price: 0.0000156 },
  { symbol: 'WIF', weight: 8.8, change24h: 15.3, price: 2.45 },
  { symbol: 'MEME', weight: 7.7, change24h: -4.2, price: 0.0234 }
]

// Enhanced Trading Data Content Component - Binance Style
function TradingDataContent() {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [sentimentData, setSentimentData] = useState({ fear: 25, greed: 75, social: 68 });

  // Enhanced Mock data generator with trends
  const generateMockData = (points: number, baseValue: number, volatility: number = 0.1, trend: number = 0) => {
    const data = [];
    let currentValue = baseValue;
    const now = Date.now();
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = now - i * getTimeInterval(timeframe) * 1000;
      const change = (Math.random() - 0.5) * volatility + trend;
      currentValue = Math.max(0.1, currentValue + change);
      data.push({ timestamp, value: currentValue });
    }
    
    return data;
  };

  const getTimeInterval = (tf: string) => {
    switch(tf) {
      case '1h': return 300; // 5min intervals
      case '4h': return 900; // 15min intervals  
      case '24h': return 3600; // 1h intervals
      case '7d': return 14400; // 4h intervals
      case '30d': return 86400; // 1d intervals
      default: return 3600;
    }
  };

  const getDataPoints = (tf: string) => {
    switch(tf) {
      case '1h': return 12;
      case '4h': return 16;
      case '24h': return 24;
      case '7d': return 42;
      case '30d': return 30;
      default: return 24;
    }
  };

  // Enhanced data sets with realistic trading patterns
  const dataPoints = getDataPoints(timeframe);
  const indexFlowData = generateMockData(dataPoints, 15200000, 2000000, 50000);
  const whaleRetailData = generateMockData(dataPoints, 2.1, 0.4);
  const takerBuyVolumeData = generateMockData(dataPoints, 14700000, 2500000);
  const takerSellVolumeData = generateMockData(dataPoints, 10000000, 2000000);
  const indexPremiumData = generateMockData(dataPoints, 0.12, 0.05);
  const liquidityDepthData = generateMockData(dataPoints, 890000, 50000);
  const volatilityData = generateMockData(dataPoints, 28.4, 5.2);
  const marketCapData = generateMockData(dataPoints, 147800000, 8000000);
  const activeTraderData = generateMockData(dataPoints, 15420, 2000);

  // Asset allocation data for stacked area chart
  const assetAllocationData: Array<{ [key: string]: number }> = Array.from({ length: dataPoints }, (_, i) => ({
    timestamp: Date.now() - (dataPoints - 1 - i) * getTimeInterval(timeframe) * 1000,
    DOGE: 25.4 + (Math.random() - 0.5) * 2,
    SHIB: 18.7 + (Math.random() - 0.5) * 1.5,
    PEPE: 15.9 + (Math.random() - 0.5) * 1.2,
    FLOKI: 12.3 + (Math.random() - 0.5) * 1,
    BONK: 11.2 + (Math.random() - 0.5) * 0.8,
    WIF: 8.8 + (Math.random() - 0.5) * 0.6,
    MEME: 7.7 + (Math.random() - 0.5) * 0.5
  }));

  const formatValue = (value: number, type: string = 'auto') => {
    if (type === 'percent') return `${value.toFixed(2)}%`;
    if (type === 'ratio') return value.toFixed(2);
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(2);
  };

  // Enhanced Chart Component with animations
  const EnhancedChart = ({ title, data, color, type = 'line', suffix = '', subtitle = '', icon: IconComponent }: {
    title: string;
    data: any[];
    color: string;
    type?: 'line' | 'bar' | 'area';
    suffix?: string;
    subtitle?: string;
    icon?: any;
  }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    const currentValue = data[data.length - 1]?.value || 0;
    const previousValue = data[data.length - 2]?.value || 0;
    const changePercent = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 relative group hover:bg-slate-800/70 transition-all overflow-hidden" style={{ isolation: 'isolate' }}>
        <button 
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-all"
          onClick={() => setExpandedChart(expandedChart === title ? null : title)}
        >
          {expandedChart === title ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="w-4 h-4" style={{ color }} />}
            <div>
              <h4 className="text-sm font-medium text-white">{title}</h4>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {formatValue(currentValue)}{suffix}
            </div>
            <div className={`text-xs font-medium ${changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {changePercent >= 0 ? '↗' : '↘'} {Math.abs(changePercent).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="h-20 relative">
          <svg viewBox="0 0 280 80" className="w-full h-full">
            {/* Grid */}
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={type === 'area' ? "0.8" : "0.4"}/>
                <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(ratio => (
              <line 
                key={ratio} 
                x1="20" y1={20 + ratio * 50} 
                x2="260" y2={20 + ratio * 50} 
                stroke="rgb(51 65 85)" strokeWidth="0.5" 
              />
            ))}
            
            {type === 'line' || type === 'area' ? (
              <>
                {/* Area fill */}
                {type === 'area' && (
                  <path 
                    d={`M20,70 ${data.map((d, i) => {
                      const x = 20 + (i / (data.length - 1)) * 240;
                      const y = 70 - ((d.value - minValue) / range) * 50;
                      return `L${x},${y}`;
                    }).join(' ')} L260,70 Z`} 
                    fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                  />
                )}
                
                {/* Line */}
                <path
                  d={data.map((d, i) => {
                    const x = 20 + (i / (data.length - 1)) * 240;
                    const y = 70 - ((d.value - minValue) / range) * 50;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeOpacity="0.9"
                />
                
                {/* Last point highlight */}
                <circle 
                  cx={20 + ((data.length - 1) / (data.length - 1)) * 240}
                  cy={70 - ((currentValue - minValue) / range) * 50}
                  r="4" 
                  fill={color}
                  fillOpacity="1"
                />
              </>
            ) : (
              // Bar chart
              data.map((d, i) => {
                const x = 20 + (i / data.length) * 240;
                const height = ((d.value - minValue) / range) * 50;
                const y = 70 - height;
                return (
                  <rect 
                    key={i} 
                    x={x} y={y} 
                    width={240 / data.length - 2} 
                    height={height} 
                    fill={color} 
                    fillOpacity="0.8"
                    stroke={color}
                    strokeWidth="1"
                    className="hover:fill-opacity-100 transition-all"
                  />
                );
              })
            )}
          </svg>
        </div>
      </div>
    );
  };

  // Stacked Area Chart for Asset Allocation
  const AssetAllocationChart = () => {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    const assets = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'MEME'];
    
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 relative group hover:bg-slate-800/70 transition-all overflow-hidden" style={{ isolation: 'isolate' }}>
        <button 
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-all"
          onClick={() => setExpandedChart(expandedChart === 'asset-allocation' ? null : 'asset-allocation')}
        >
          <Plus className="w-4 h-4" />
        </button>
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-sm font-medium text-white">Asset Allocation Changes</h4>
              <p className="text-xs text-slate-400 mt-0.5">{timeframe} view • Weekly rebalancing</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">Rebalanced</div>
            <div className="text-xs text-slate-400">2d ago</div>
          </div>
        </div>
        
        <div className="h-20 relative mb-3">
          <svg viewBox="0 0 280 80" className="w-full h-full">
            {assetAllocationData.map((dataPoint, pointIndex) => {
              const x = 20 + (pointIndex / (assetAllocationData.length - 1)) * 240;
              let cumulativeHeight = 0;
              
              return assets.map((asset, assetIndex) => {
                const percentage = dataPoint[asset] / 100;
                const height = percentage * 50;
                const y = 70 - cumulativeHeight - height;
                cumulativeHeight += height;
                
                return (
                  <rect
                    key={`${pointIndex}-${asset}`}
                    x={x}
                    y={y}
                    width={240 / assetAllocationData.length}
                    height={height}
                    fill={colors[assetIndex]}
                    fillOpacity="0.9"
                    stroke={colors[assetIndex]}
                    strokeWidth="0.5"
                  />
                );
              });
            })}
          </svg>
        </div>
        
        {/* Compact Legend - 2 rows */}
        <div className="grid grid-cols-4 gap-1 text-xs">
          {assets.slice(0, 4).map((asset, index) => (
            <div key={asset} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-slate-300 truncate">{asset}</span>
              <span className="text-slate-400 text-xs">
                {assetAllocationData[assetAllocationData.length - 1][asset].toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 text-xs mt-1">
          {assets.slice(4).map((asset, index) => (
            <div key={asset} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colors[index + 4] }}
              />
              <span className="text-slate-300 truncate">{asset}</span>
              <span className="text-slate-400 text-xs">
                {assetAllocationData[assetAllocationData.length - 1][asset].toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Market Sentiment Component
  const MarketSentimentCard = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 overflow-hidden" style={{ isolation: 'isolate' }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-orange-400" />
        <h4 className="text-sm font-medium text-white">Market Sentiment</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Fear & Greed Index</span>
            <span className={`font-medium ${sentimentData.greed > 60 ? 'text-green-400' : sentimentData.greed > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {sentimentData.greed}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all"
              style={{ width: `${sentimentData.greed}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Social Sentiment</span>
            <span className="text-blue-400 font-medium">{sentimentData.social}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${sentimentData.social}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/50 rounded p-2">
            <div className="text-slate-400">Whale Activity</div>
            <div className="text-green-400 font-medium">High</div>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <div className="text-slate-400">Retail Interest</div>
            <div className="text-blue-400 font-medium">Rising</div>
          </div>
        </div>
      </div>
    </div>
  );

  const timeframeOptions = ['1h', '4h', '24h', '7d', '30d'];

  // Expanded Chart View
  if (expandedChart) {
    return (
      <div className="h-full bg-slate-950 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white">{expandedChart}</h3>
            <div className="flex gap-1">
              {timeframeOptions.map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    timeframe === tf ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setExpandedChart(null)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-8">
          <div className="h-full bg-slate-900/50 rounded-lg p-8">
            <div className="text-center text-slate-400 pt-32">
              <BarChart3 className="w-20 h-20 mx-auto mb-6 opacity-50" />
              <div className="text-2xl font-semibold mb-2">Full-Screen Analytics</div>
              <div className="text-lg">Advanced {expandedChart} visualization</div>
              <div className="text-sm mt-2 opacity-75">Interactive features and detailed analysis would be implemented here</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="h-full bg-slate-950 flex flex-col max-h-[calc(100vh-280px)]">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Trading Data Analytics</h3>
            <p className="text-slate-400 mt-1">Real-time market insights • Meme coin index focused</p>
          </div>
          <div className="flex gap-1">
            {timeframeOptions.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  timeframe === tf ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
        
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8" style={{ isolation: 'isolate' }}>
          {/* Enhanced Charts */}
          <EnhancedChart 
            title="Index Flow" 
            subtitle="+2.3M (24h)"
            data={indexFlowData} 
            color="rgb(34 197 94)" 
            type="line"
            suffix=""
            icon={TrendingUp}
          />
          
          <EnhancedChart 
            title="Whale vs Retail" 
            subtitle="Whale Favored"
            data={whaleRetailData} 
            color="rgb(59 130 246)"
            type="line"
            suffix=""
            icon={Users}
          />
          
          <EnhancedChart 
            title="Taker Buy Volume" 
            subtitle="67.4% Bullish"
            data={takerBuyVolumeData} 
            color="rgb(34 197 94)" 
            type="bar"
            suffix=""
            icon={Activity}
          />
          
          <EnhancedChart 
            title="Index Premium" 
            subtitle="Spot Premium"
            data={indexPremiumData} 
            color="rgb(236 72 153)"
            type="area"
            suffix="%"
            icon={Target}
          />
          
          <EnhancedChart 
            title="Liquidity Depth" 
            subtitle="5m intervals"
            data={liquidityDepthData} 
            color="rgb(6 182 212)"
            type="line"
            suffix=""
            icon={Waves}
          />
          
          <EnhancedChart 
            title="Volatility" 
            subtitle="30d rolling"
            data={volatilityData} 
            color="rgb(245 158 11)"
            type="area"
            suffix="%"
            icon={Zap}
          />
          
          <EnhancedChart 
            title="Market Cap" 
            subtitle="Index total"
            data={marketCapData} 
            color="rgb(168 85 247)"
            type="line"
            suffix=""
            icon={DollarSign}
          />
          
          <EnhancedChart 
            title="Active Traders" 
            subtitle="24h unique"
            data={activeTraderData} 
            color="rgb(34 197 94)"
            type="bar" 
            suffix=""
            icon={Users}
          />
          
          {/* Special Charts */}
          <div className="lg:col-span-2">
            <AssetAllocationChart />
          </div>
          
          <MarketSentimentCard />
        </div>
        
        {/* Additional Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">24h High</div>
                <div className="text-lg font-bold text-white">$1.2890</div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">24h Low</div>
                <div className="text-lg font-bold text-white">$1.1234</div>
              </div>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Avg. Trade Size</div>
                <div className="text-lg font-bold text-white">$2,847</div>
              </div>
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Price Impact</div>
                <div className="text-lg font-bold text-green-400">0.23%</div>
              </div>
              <Radar className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Tab Content Component
function InfoTabContent() {
  const [activeInfoTab, setActiveInfoTab] = useState('Index Info')
  const infoTabs = ['Index Info', 'Token Info', 'Composition', 'Trading Rules', 'Performance']

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Info Sub-tabs */}
      <div className="border-b border-slate-700 flex-shrink-0">
        <div className="flex px-4">
          {infoTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveInfoTab(tab)}
              className={`px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                activeInfoTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Info Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-350px)]">
        {activeInfoTab === 'Index Info' && (
          <div className="space-y-4">
            {/* Basic Index Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-white">DOG_INDEX</h4>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    👑 No.1
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Market Capitalization</div>
                    <div className="text-sm font-semibold text-white">$147.8M</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Total Assets</div>
                    <div className="text-sm font-semibold text-white">7</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Index Inception</div>
                    <div className="text-sm font-semibold text-white">2024-01-15</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Rebalance Frequency</div>
                    <div className="text-sm font-semibold text-white">Weekly</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Management Fee</div>
                    <div className="text-sm font-semibold text-white">0.75% p.a.</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Settlement Currency</div>
                    <div className="text-sm font-semibold text-white">USDC</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700">
                  <h5 className="text-xs font-semibold text-white mb-2">Description</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The DOG_INDEX tracks the performance of the most popular dog-themed meme cryptocurrencies. 
                    This diversified index includes tokens like DOGE, SHIB, FLOKI, BONK, and other canine-inspired 
                    cryptocurrencies, providing exposure to this growing sector with automatic rebalancing.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 cursor-pointer hover:underline">Whitepaper</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 cursor-pointer hover:underline">Index Methodology</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Token Info Tab Content */}
        {activeInfoTab === 'Token Info' && (
          <div className="p-6 space-y-6">
            {/* Token Narrative Section */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Token Narrative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                  <p className="mb-3">
                    The <span className="text-blue-400 font-semibold">MEME Index</span> represents a diversified exposure to the most promising meme coins in the crypto ecosystem. 
                    Our algorithmic approach captures the explosive potential of viral tokens while mitigating single-asset risk through strategic diversification.
                  </p>
                  <p className="mb-3">
                    This index tracks the performance of 7 carefully selected meme tokens, weighted by market capitalization, trading volume, and community engagement metrics. 
                    The index automatically rebalances monthly to maintain optimal exposure while capturing emerging meme coin trends.
                  </p>
                  <p>
                    <span className="text-yellow-400">Investment Thesis:</span> Meme coins represent a unique asset class driven by social sentiment, viral marketing, and community adoption. 
                    While individually volatile, a diversified basket can capture the upside while reducing concentration risk.
                  </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-amber-400 mb-1">Risk Notice</div>
                      <div className="text-xs text-slate-400">
                        Meme coins are highly speculative and volatile investments. Past performance does not guarantee future results. 
                        Only invest what you can afford to lose.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Metrics Section */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Token Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Token Address */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Token Contract</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-white">0x7D1AfA...C4e8</span>
                      <Copy className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                  
                  {/* Total Supply */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Total Supply</div>
                    <div className="text-sm font-semibold text-white">1,000,000 MEMEINDEX</div>
                  </div>
                  
                  {/* Market Cap */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Market Cap</div>
                    <div className="text-sm font-semibold text-white">$147.8M</div>
                  </div>
                  
                  {/* Holders */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Token Holders</div>
                    <div className="text-sm font-semibold text-white">15,420</div>
                    <div className="text-xs text-green-400 mt-1">+342 (24h)</div>
                  </div>
                  
                  {/* Transfers */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">24h Transfers</div>
                    <div className="text-sm font-semibold text-white">8,954</div>
                    <div className="text-xs text-red-400 mt-1">-12.3%</div>
                  </div>
                  
                  {/* DEX Volume */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">24h DEX Volume</div>
                    <div className="text-sm font-semibold text-white">$12.4M</div>
                    <div className="text-xs text-green-400 mt-1">+18.7%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Distribution Section */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  Token Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Circulating Supply */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-slate-300">Circulating Supply</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Circulating</span>
                        <span className="text-sm font-semibold text-white">850,000 (85%)</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Locked/Vested</span>
                        <span className="text-sm font-semibold text-white">150,000 (15%)</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Holder Distribution */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-slate-300">Top Holders</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Treasury</span>
                        <span className="text-white">12.4%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Top 10 Holders</span>
                        <span className="text-white">28.7%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">DEX Liquidity</span>
                        <span className="text-white">15.2%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Retail Holders</span>
                        <span className="text-white">43.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-slate-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-slate-400">Avg Hold Time</div>
                      <div className="text-sm font-semibold text-white">23.4 days</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Whale Concentration</div>
                      <div className="text-sm font-semibold text-yellow-400">Medium</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Distribution Score</div>
                      <div className="text-sm font-semibold text-green-400">7.2/10</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Composition Tab Content */}
        {activeInfoTab === 'Composition' && (
          <div className="p-6 space-y-6">
            {/* Current Composition */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Current Index Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Enhanced Pie Chart Visualization */}
                  <div className="space-y-6">
                    <div className="text-sm font-medium text-slate-300 text-center">Asset Allocation</div>
                    <div className="relative flex justify-center">
                      <svg width="320" height="320" className="mx-auto drop-shadow-lg">
                        <defs>
                          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                          </radialGradient>
                        </defs>
                        
                        {/* Create pie chart segments with filled paths */}
                        {(() => {
                          const centerX = 160, centerY = 160, radius = 120;
                          const colors = ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
                          let cumulativeAngle = -90; // Start at top
                          
                          return mockIndexComposition.map((token, index) => {
                            const angle = (token.weight / 100) * 360;
                            const startAngle = cumulativeAngle * Math.PI / 180;
                            const endAngle = (cumulativeAngle + angle) * Math.PI / 180;
                            
                            const x1 = centerX + radius * Math.cos(startAngle);
                            const y1 = centerY + radius * Math.sin(startAngle);
                            const x2 = centerX + radius * Math.cos(endAngle);
                            const y2 = centerY + radius * Math.sin(endAngle);
                            
                            const largeArcFlag = angle > 180 ? 1 : 0;
                            
                            const pathData = [
                              `M ${centerX} ${centerY}`,
                              `L ${x1} ${y1}`,
                              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                              'Z'
                            ].join(' ');
                            
                            // Calculate text position
                            const textAngle = (startAngle + endAngle) / 2;
                            const textRadius = radius * 0.7;
                            const textX = centerX + textRadius * Math.cos(textAngle);
                            const textY = centerY + textRadius * Math.sin(textAngle);
                            
                            // Only show text for segments larger than 10%
                            const showText = token.weight > 10;
                            
                            const segment = (
                              <g key={token.symbol}>
                                <path
                                  d={pathData}
                                  fill={colors[index]}
                                  stroke="#1e293b"
                                  strokeWidth="2"
                                  className="transition-all duration-300 hover:brightness-110 cursor-pointer hover:stroke-white"
                                />
                                {showText && (
                                  <g>
                                    <text
                                      x={textX}
                                      y={textY - 6}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      className="text-xs fill-white pointer-events-none"
                                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontFamily: 'system-ui, sans-serif' }}
                                    >
                                      {token.symbol}
                                    </text>
                                    <text
                                      x={textX}
                                      y={textY + 6}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      className="text-xs fill-white pointer-events-none"
                                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontFamily: 'system-ui, sans-serif' }}
                                    >
                                      {token.weight.toFixed(1)}%
                                    </text>
                                  </g>
                                )}
                              </g>
                            );
                            
                            cumulativeAngle += angle;
                            return segment;
                          });
                        })()}
                        
                        {/* Outer glow ring */}
                        <circle cx="160" cy="160" r="140" fill="transparent" stroke="#1e293b" strokeWidth="2" opacity="0.3" />
                        
                        {/* Center circle removed - no more center text */}
                      </svg>
                    </div>
                    
                    {/* Enhanced Legend */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {mockIndexComposition.map((token, index) => {
                        const colors = ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
                        return (
                          <div key={token.symbol} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div 
                              className="w-4 h-4 rounded-full shadow-lg"
                              style={{ backgroundColor: colors[index] }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">{token.symbol}</div>
                              <div className="text-xs text-slate-400">{token.weight.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Detailed Composition Table */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-slate-300">Detailed Breakdown</div>
                    <div className="space-y-2">
                      {mockIndexComposition.map((token, index) => (
                        <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-red-500' :
                              index === 2 ? 'bg-green-500' :
                              index === 3 ? 'bg-purple-500' :
                              index === 4 ? 'bg-blue-500' :
                              index === 5 ? 'bg-pink-500' : 'bg-orange-500'
                            }`}></div>
                            <div>
                              <div className="text-sm font-semibold text-white">{token.symbol}</div>
                              <div className="text-xs text-slate-400">${token.price.toFixed(6)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white">{token.weight.toFixed(1)}%</div>
                            <div className={`text-xs ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rebalancing History */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-green-400" />
                  Rebalancing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400">Last Rebalance</div>
                      <div className="text-sm font-semibold text-white">Dec 1, 2024</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400">Next Rebalance</div>
                      <div className="text-sm font-semibold text-blue-400">Jan 1, 2025</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400">Rebalance Frequency</div>
                      <div className="text-sm font-semibold text-white">Monthly</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-slate-300">Recent Changes</div>
                    
                    {/* Recent rebalancing events */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border-l-4 border-green-500">
                        <div>
                          <div className="text-sm text-white">PEPE weight increased</div>
                          <div className="text-xs text-slate-400">Dec 1, 2024 • Monthly rebalance</div>
                        </div>
                        <div className="text-green-400 text-sm font-semibold">13.2% → 15.9%</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border-l-4 border-red-500">
                        <div>
                          <div className="text-sm text-white">SHIB weight decreased</div>
                          <div className="text-xs text-slate-400">Dec 1, 2024 • Monthly rebalance</div>
                        </div>
                        <div className="text-red-400 text-sm font-semibold">21.3% → 18.7%</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border-l-4 border-blue-500">
                        <div>
                          <div className="text-sm text-white">WIF added to index</div>
                          <div className="text-xs text-slate-400">Nov 1, 2024 • Monthly rebalance</div>
                        </div>
                        <div className="text-blue-400 text-sm font-semibold">0% → 8.8%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Contribution */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Performance Contribution (30D)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {mockIndexComposition.map((token) => {
                      const contribution = (token.weight / 100) * token.change24h * 0.3
                      return (
                        <div key={token.symbol} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-white">{token.symbol}</div>
                            <div className="text-xs text-slate-400">{token.weight.toFixed(1)}% weight</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-sm font-semibold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                              </div>
                              <div className="text-xs text-slate-400">30D Return</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-semibold ${contribution >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}%
                              </div>
                              <div className="text-xs text-slate-400">Contribution</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Total Index Performance</span>
                      <span className="text-lg font-bold text-green-400">+8.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trading Rules Tab Content */}
        {activeInfoTab === 'Trading Rules' && (
          <div className="p-6 space-y-6">
            {/* Trading Hours & Availability */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Trading Hours & Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Market Hours</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Status</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-green-400 font-semibold">OPEN</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          24/7 Trading Available • Decentralized Exchange
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Settlement</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-white">Instant Settlement</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Trades settle immediately on-chain
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Minimum Order</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-white">$10.00 USD</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Minimum trade size
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Maximum Order</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-white">$1,000,000 USD</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Per single transaction
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trading Fees */}
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-slate-300">Trading Fees</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Market Order</span>
                          <span className="text-sm font-semibold text-white">0.50%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Limit Order</span>
                          <span className="text-sm font-semibold text-white">0.25%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Stop Loss</span>
                          <span className="text-sm font-semibold text-white">0.30%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other Fees */}
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-slate-300">Other Fees</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Withdrawal</span>
                          <span className="text-sm font-semibold text-white">Gas + $2</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Deposit</span>
                          <span className="text-sm font-semibold text-green-400">FREE</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">Inactivity</span>
                          <span className="text-sm font-semibold text-green-400">FREE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Volume-based Fee Discount */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                    <div className="text-sm font-medium text-slate-300 mb-3">Volume-based Fee Discounts</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-slate-400">30D Volume</div>
                        <div className="text-white font-semibold">&lt; $10k</div>
                        <div className="text-slate-400">Fee: 0.50%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">30D Volume</div>
                        <div className="text-white font-semibold">$10k - $100k</div>
                        <div className="text-green-400 font-semibold">Fee: 0.40%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">30D Volume</div>
                        <div className="text-white font-semibold">$100k - $1M</div>
                        <div className="text-green-400 font-semibold">Fee: 0.30%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">30D Volume</div>
                        <div className="text-white font-semibold">&gt; $1M</div>
                        <div className="text-green-400 font-semibold">Fee: 0.20%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rebalancing Rules */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-400" />
                  Rebalancing Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Schedule</div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="text-sm text-white">Monthly Rebalancing</div>
                          <div className="text-xs text-slate-400 mt-1">
                            First day of each month, 00:00 UTC
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Methodology</div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="text-sm text-white">Market Cap Weighted</div>
                          <div className="text-xs text-slate-400 mt-1">
                            Based on 30-day average market capitalization
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Inclusion Criteria</div>
                        <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-slate-400">Min $100M market cap</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-slate-400">Min $10M daily volume</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-slate-400">Listed on major DEX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-amber-400 mb-1">Emergency Rebalancing</div>
                        <div className="text-xs text-slate-400">
                          Extraordinary market conditions may trigger emergency rebalancing outside of the regular schedule. 
                          Users will be notified 24 hours in advance when possible.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Slippage & Liquidity */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  Slippage & Liquidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Expected Slippage</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">$1k - $10k</span>
                          <span className="text-sm font-semibold text-green-400">0.1 - 0.3%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">$10k - $100k</span>
                          <span className="text-sm font-semibold text-yellow-400">0.3 - 0.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-sm text-slate-400">&gt; $100k</span>
                          <span className="text-sm font-semibold text-red-400">0.8 - 2.0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Liquidity Metrics</div>
                      <div className="space-y-3">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400">Total Liquidity</div>
                          <div className="text-sm font-semibold text-white">$89.2M</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400">24h Volume</div>
                          <div className="text-sm font-semibold text-white">$12.4M</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400">Avg Spread</div>
                          <div className="text-sm font-semibold text-white">0.12%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-400 mb-1">Slippage Protection</div>
                        <div className="text-xs text-slate-400">
                          All trades include automatic slippage protection. Orders exceeding expected slippage will be rejected. 
                          You can adjust slippage tolerance in your trade settings.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab Content */}
        {activeInfoTab === 'Performance' && (
          <div className="p-6 space-y-6">
            {/* Performance Overview */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">1D</div>
                    <div className="text-lg font-bold text-green-400">+2.4%</div>
                    <div className="text-xs text-slate-500">vs BTC +1.8%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">7D</div>
                    <div className="text-lg font-bold text-green-400">+8.7%</div>
                    <div className="text-xs text-slate-500">vs BTC +3.2%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">30D</div>
                    <div className="text-lg font-bold text-green-400">+24.3%</div>
                    <div className="text-xs text-slate-500">vs BTC +12.1%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">90D</div>
                    <div className="text-lg font-bold text-green-400">+67.8%</div>
                    <div className="text-xs text-slate-500">vs BTC +28.4%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Performance Chart (90D)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button size="sm" variant="outline" className="bg-blue-600 text-white border-blue-600">
                      MEME Index
                    </Button>
                    <Button size="sm" variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                      BTC
                    </Button>
                    <Button size="sm" variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                      ETH
                    </Button>
                  </div>
                  
                  {/* Simple performance chart visualization */}
                  <div className="relative h-64 bg-slate-800/30 rounded-lg p-4">
                    <svg width="100%" height="100%" className="overflow-visible">
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                        <line key={ratio} x1="0" y1={`${ratio * 100}%`} x2="100%" y2={`${ratio * 100}%`} 
                              stroke="#334155" strokeWidth="0.5" />
                      ))}
                      
                      {/* Performance line */}
                      <polyline 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2"
                        points="0,80 10,75 20,78 30,70 40,65 50,60 60,55 70,45 80,40 90,30 100,25"
                      />
                      
                      {/* Labels */}
                      <text x="5" y="15" className="text-xs fill-slate-400">+67.8%</text>
                      <text x="5" y="95" className="text-xs fill-slate-400">0%</text>
                      <text x="5" y="235" className="text-xs fill-slate-400">90 days ago</text>
                      <text x="85" y="235" className="text-xs fill-slate-400">Today</text>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Volatility (30D)</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">28.4%</div>
                        <div className="text-xs text-slate-400 mt-1">Annualized</div>
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Moderate Risk</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Max Drawdown</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">-18.7%</div>
                        <div className="text-xs text-slate-400 mt-1">Nov 12 - Nov 18</div>
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '37%' }}></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">7 days duration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Sharpe Ratio</div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">1.84</div>
                        <div className="text-xs text-slate-400 mt-1">Risk-adjusted return</div>
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Excellent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Returns Heatmap */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Monthly Returns Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-300">2024 Performance by Month</div>
                  <div className="grid grid-cols-12 gap-1">
                    {/* Month labels */}
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                      <div key={month} className="text-xs text-slate-400 text-center mb-2">{month}</div>
                    ))}
                    
                    {/* Performance data */}
                    {[
                      { month: 'Jan', return: 12.3, positive: true },
                      { month: 'Feb', return: -4.2, positive: false },
                      { month: 'Mar', return: 8.9, positive: true },
                      { month: 'Apr', return: 15.7, positive: true },
                      { month: 'May', return: -7.1, positive: false },
                      { month: 'Jun', return: 3.4, positive: true },
                      { month: 'Jul', return: 22.8, positive: true },
                      { month: 'Aug', return: -1.9, positive: false },
                      { month: 'Sep', return: 6.2, positive: true },
                      { month: 'Oct', return: 18.4, positive: true },
                      { month: 'Nov', return: 4.7, positive: true },
                      { month: 'Dec', return: 2.4, positive: true }
                    ].map((data, index) => {
                      const intensity = Math.abs(data.return) / 25
                      const bgColor = data.positive 
                        ? `rgba(16, 185, 129, ${intensity})` 
                        : `rgba(239, 68, 68, ${intensity})`
                      
                      return (
                        <div 
                          key={index} 
                          className="h-12 rounded flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: bgColor }}
                        >
                          <span className="text-xs text-white font-medium">
                            {data.return > 0 ? '+' : ''}{data.return.toFixed(1)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500/50 rounded"></div>
                      <span>Negative Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500/50 rounded"></div>
                      <span>Positive Returns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benchmark Comparison */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Benchmark Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">vs Bitcoin</span>
                        <Badge className="bg-green-600 text-white">Outperform</Badge>
                      </div>
                      <div className="text-lg font-semibold text-green-400">+39.4%</div>
                      <div className="text-xs text-slate-400">Alpha (90D)</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">vs Ethereum</span>
                        <Badge className="bg-green-600 text-white">Outperform</Badge>
                      </div>
                      <div className="text-lg font-semibold text-green-400">+31.2%</div>
                      <div className="text-xs text-slate-400">Alpha (90D)</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">vs S&P 500</span>
                        <Badge className="bg-green-600 text-white">Outperform</Badge>
                      </div>
                      <div className="text-lg font-semibold text-green-400">+58.9%</div>
                      <div className="text-xs text-slate-400">Alpha (90D)</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-400 mb-1">Performance Note</div>
                        <div className="text-xs text-slate-400">
                          Past performance is not indicative of future results. Cryptocurrency investments are highly volatile and speculative. 
                          Alpha calculations are based on risk-adjusted returns using CAPM methodology.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export function ChartArea() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedChartType, setSelectedChartType] = useState('Candlestick')
  const [activeChartTab, setActiveChartTab] = useState('Chart')
  
  const [chartData, setChartData] = useState(mockCandleData)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate new data when timeframe changes (client-side only)
  useEffect(() => {
    if (!isClient) return

    const getTimeframeData = (timeframe: string) => {
      const intervals = {
        '1m': 60,
        '5m': 300, 
        '15m': 900,
        '1h': 3600,
        '4h': 14400,
        '1d': 86400,
        '1w': 604800
      }
      
      const interval = intervals[timeframe as keyof typeof intervals] || 3600
      const dataPoints = timeframe === '1d' || timeframe === '1w' ? 30 : 50
      
      const data = []
      let basePrice = 1.2567
      const now = new Date()
      
      for (let i = dataPoints; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * interval * 1000)
        const open = basePrice + (Math.random() - 0.5) * 0.02
        const volatility = 0.005 + Math.random() * 0.015
        const high = open + Math.random() * volatility
        const low = open - Math.random() * volatility
        const close = low + Math.random() * (high - low)
        
        data.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume: 20000 + Math.random() * 180000
        })
        
        basePrice = close + (Math.random() - 0.5) * 0.008
      }
      
      return data
    }
    
    setChartData(getTimeframeData(selectedTimeframe))
  }, [selectedTimeframe, isClient])

  return (
    <div className="flex flex-col bg-slate-950">
      {/* Chart Controls */}
      <div className="h-12 bg-slate-900 border-b border-slate-700 flex items-center px-4 space-x-4">
        {/* Timeframe Buttons */}
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isClient && selectedTimeframe === tf
                  ? 'bg-brand'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type Selector */}
        <div className="ml-auto flex space-x-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChartType(type)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedChartType === type
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col bg-slate-950">
        {/* Tab Headers */}
        <div className="h-10 bg-slate-900 border-b border-slate-700 flex items-center">
          <div className="flex space-x-1 px-4">
            {chartTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChartTab(tab)}
                className={`px-3 py-1 text-sm whitespace-nowrap rounded transition-colors ${
                  activeChartTab === tab
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-slate-950 overflow-hidden">
          {activeChartTab === 'Chart' && (
            <div className="h-full bg-slate-950 p-4">
              <CandlestickChart 
                data={chartData} 
                chartType={selectedChartType} 
                timeframe={selectedTimeframe}
              />
            </div>
          )}

          {activeChartTab === 'Info' && (
            <InfoTabContent />
          )}

          {activeChartTab === 'Trading Data' && (
            <div className="h-full">
              <TradingDataContent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
