'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Eye,
  Plus,
  Info,
  PieChart,
  DollarSign,
  Target,
  ExternalLink,
  BookOpen,
  Shield,
  AlertTriangle,
  Layers,
  CheckCircle,
  Calendar,
  Users,
  ArrowUpDown,
  Waves,
  Brain,
  Radar
} from 'lucide-react'
import type { OHLCVData, Timeframe, ChartType, TechnicalIndicator } from '@/lib/types/trading-chart'
import { fetchOHLCVData, calculateMA, calculateRSI, subscribeToRealTimePrice } from '@/lib/api/trading-chart'
import { useCurrency } from '@/lib/hooks/useCurrency'

// Import lightweight-charts dynamically (browser-only library)
import type { IChartApi, ISeriesApi, CandlestickSeriesPartialOptions, LineSeriesPartialOptions, AreaSeriesPartialOptions, HistogramSeriesPartialOptions } from 'lightweight-charts'

const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
const chartTypes: ChartType[] = ['Candlestick', 'Line', 'Area', 'Histogram']

interface ChartAreaProps {
  indexId?: string
  className?: string
}

export function ChartArea({ indexId = 'default-index', className }: ChartAreaProps) {
  const { formatPrice, formatVolume } = useCurrency()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | ISeriesApi<'Area'> | ISeriesApi<'Histogram'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  const [activeTab, setActiveTab] = useState<'Chart' | 'Info' | 'Trading Data'>('Chart')
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1h')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('Candlestick')
  const [loading, setLoading] = useState(true)
  const [isChartReady, setIsChartReady] = useState(false)
  const [chartData, setChartData] = useState<OHLCVData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)
  const [volume24h, setVolume24h] = useState<number>(0)
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([])

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    let cleanup: (() => void) | undefined

    // Dynamically import lightweight-charts (browser-only library)
    const initChart = async () => {
      const { createChart, CrosshairMode } = await import('lightweight-charts')

      const chart = createChart(chartContainerRef.current!, {
        width: chartContainerRef.current!.clientWidth,
        height: chartContainerRef.current!.clientHeight || 400,
        layout: {
          background: { color: '#0f172a' },
          textColor: '#94a3b8'
        },
        localization: {
          locale: 'en-US',
          dateFormat: 'dd MMM \'yy'
        },
        grid: {
          vertLines: { color: '#1e293b' },
          horzLines: { color: '#1e293b' }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        rightPriceScale: {
          borderColor: '#334155'
        },
        timeScale: {
          borderColor: '#334155',
          timeVisible: true,
          secondsVisible: false
        }
      })

      chartRef.current = chart
      setIsChartReady(true)

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight || 400
          })
        }
      }

      window.addEventListener('resize', handleResize)

      cleanup = () => {
        window.removeEventListener('resize', handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
        setIsChartReady(false)
      }
    }

    initChart()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  // Load chart data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetchOHLCVData(indexId, selectedTimeframe)
        if (response.success && response.data.length > 0) {
          setChartData(response.data)

          const lastCandle = response.data[response.data.length - 1]
          const prevCandle = response.data[response.data.length - 2]

          setCurrentPrice(lastCandle.close)
          const change = lastCandle.close - prevCandle.close
          setPriceChange(change)
          setPriceChangePercent((change / prevCandle.close) * 100)

          // Calculate 24h volume
          const totalVolume = response.data.reduce((sum, candle) => sum + candle.volume, 0)
          setVolume24h(totalVolume)
        }
      } catch (error) {
        console.error('Failed to load chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [indexId, selectedTimeframe])

  // Update chart series when data or type changes
  useEffect(() => {
    if (!isChartReady || !chartRef.current || chartData.length === 0) return

    const updateSeries = async () => {
      if (!chartRef.current) return

      // Remove existing series
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current)
        seriesRef.current = null
      }
      if (volumeSeriesRef.current) {
        chartRef.current.removeSeries(volumeSeriesRef.current)
        volumeSeriesRef.current = null
      }

      // Import series types for v5 API
      const lc = await import('lightweight-charts')

      // Create new series based on chart type
      if (selectedChartType === 'Candlestick') {
        const candlestickSeries = chartRef.current.addSeries(lc.CandlestickSeries, {
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderUpColor: '#22c55e',
          borderDownColor: '#ef4444',
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444'
        })

        candlestickSeries.setData(chartData)
        seriesRef.current = candlestickSeries as any
      } else if (selectedChartType === 'Line') {
        const lineSeries = chartRef.current.addSeries(lc.LineSeries, {
          color: '#8BD6FF',
          lineWidth: 2
        })

        const lineData = chartData.map(d => ({ time: d.time, value: d.close }))
        lineSeries.setData(lineData)
        seriesRef.current = lineSeries as any
      } else if (selectedChartType === 'Area') {
        const areaSeries = chartRef.current.addSeries(lc.AreaSeries, {
          topColor: 'rgba(139, 214, 255, 0.4)',
          bottomColor: 'rgba(139, 214, 255, 0.0)',
          lineColor: '#8BD6FF',
          lineWidth: 2
        })

        const areaData = chartData.map(d => ({ time: d.time, value: d.close }))
        areaSeries.setData(areaData)
        seriesRef.current = areaSeries as any
      } else if (selectedChartType === 'Histogram') {
        const histogramSeries = chartRef.current.addSeries(lc.HistogramSeries, {
          color: '#8BD6FF'
        })

        const histogramData = chartData.map(d => ({ time: d.time, value: d.close }))
        histogramSeries.setData(histogramData)
        seriesRef.current = histogramSeries as any
      }

      // Add volume series (always shown at bottom)
      const volumeSeries = chartRef.current.addSeries(lc.HistogramSeries, {
        color: '#475569',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: ''
      })

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.85, // Push volume to bottom 15%
          bottom: 0
        }
      })

      const volumeData = chartData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#22c55e40' : '#ef444440'
      }))

      volumeSeries.setData(volumeData)
      volumeSeriesRef.current = volumeSeries

      // Fit content
      chartRef.current.timeScale().fitContent()
    }

    updateSeries()
  }, [isChartReady, chartData, selectedChartType])

  // Add/remove technical indicators
  useEffect(() => {
    if (!isChartReady || !chartRef.current || chartData.length === 0) return

    const addIndicators = async () => {
      if (!chartRef.current) return

      // Clear all indicator series (except main and volume)
      // TODO: Implement indicator series management

      // Import series types for v5 API
      const lc = await import('lightweight-charts')

      indicators.forEach(indicator => {
        if (!indicator.visible) return

        if (indicator.type === 'MA') {
          const period = indicator.params.period || 20
          const maData = calculateMA(chartData, period)

          const maSeries = chartRef.current!.addSeries(lc.LineSeries, {
            color: indicator.color || '#ffaa00',
            lineWidth: 1,
            title: `MA(${period})`
          })

          maSeries.setData(maData)
        }

        if (indicator.type === 'RSI') {
          const period = indicator.params.period || 14
          const rsiData = calculateRSI(chartData, period)

          // RSI should be in a separate pane (not implemented in basic version)
          // For now, we'll skip RSI visualization
          console.log('RSI data calculated:', rsiData.length, 'points')
        }
      })
    }

    addIndicators()
  }, [isChartReady, chartData, indicators])

  // Real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToRealTimePrice(indexId, (price, volume, time) => {
      setCurrentPrice(price)

      // Update chart with new price
      if (seriesRef.current && chartData.length > 0) {
        const lastCandle = chartData[chartData.length - 1]

        if (selectedChartType === 'Candlestick') {
          const updatedCandle = {
            time: lastCandle.time,
            open: lastCandle.open,
            high: Math.max(lastCandle.high, price),
            low: Math.min(lastCandle.low, price),
            close: price
          }
          ;(seriesRef.current as any).update(updatedCandle)
        } else {
          (seriesRef.current as any).update({
            time: lastCandle.time,
            value: price
          })
        }
      }
    })

    return unsubscribe
  }, [indexId, chartData, selectedChartType])

  // Toggle indicator
  const toggleIndicator = (type: 'MA' | 'RSI', params: Record<string, number>) => {
    const existingIndex = indicators.findIndex(ind => ind.type === type && JSON.stringify(ind.params) === JSON.stringify(params))

    if (existingIndex >= 0) {
      // Remove indicator
      setIndicators(prev => prev.filter((_, i) => i !== existingIndex))
    } else {
      // Add indicator
      const newIndicator: TechnicalIndicator = {
        id: `${type}-${Date.now()}`,
        type,
        name: `${type}(${Object.values(params).join(',')})`,
        params,
        visible: true,
        color: type === 'MA' ? '#ffaa00' : '#8B5CF6'
      }
      setIndicators(prev => [...prev, newIndicator])
    }
  }

  return (
    <Card className={`h-full flex flex-col bg-slate-900/50 border-slate-800 ${className || ''}`}>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {/* Tab Navigation */}
        <div className="h-10 bg-slate-900 border-b border-slate-700 flex items-center flex-shrink-0">
          <div className="flex space-x-1 px-4">
            {(['Chart', 'Info', 'Trading Data'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm whitespace-nowrap rounded transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Tab Content */}
        {activeTab === 'Chart' && (
          <div className="flex-1 flex flex-col p-4 overflow-auto min-h-0">
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
          {/* Price Info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400">DOG_INDEX • {selectedTimeframe}</div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(currentPrice)}
              </div>
            </div>
            <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <div className="text-sm font-semibold">
                {priceChange >= 0 ? '+' : ''}{formatPrice(Math.abs(priceChange))}
              </div>
              <div className="text-xs">
                ({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <div>24h Vol</div>
              <div className="text-sm font-semibold text-white">
                {formatVolume(volume24h)}
              </div>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2">
            {/* Indicators */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => toggleIndicator('MA', { period: 20 })}
            >
              <Activity className="w-3 h-3" />
              <span className="text-xs">MA(20)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => toggleIndicator('MA', { period: 50 })}
            >
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">MA(50)</span>
            </Button>

            {/* More indicators button */}
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="w-3 h-3" />
              <span className="text-xs">Indicators</span>
            </Button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <Clock className="w-4 h-4 text-slate-400" />
          <div className="flex gap-1">
            {timeframes.map(tf => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? 'default' : 'outline'}
                size="sm"
                className={selectedTimeframe === tf ? 'bg-brand text-slate-950 hover:bg-brand/90' : ''}
                onClick={() => setSelectedTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <div className="ml-4 flex gap-1">
            {chartTypes.map(type => (
              <Button
                key={type}
                variant={selectedChartType === type ? 'default' : 'outline'}
                size="sm"
                className={selectedChartType === type ? 'bg-brand text-slate-950 hover:bg-brand/90' : ''}
                onClick={() => setSelectedChartType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Indicators */}
        {indicators.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <Eye className="w-4 h-4 text-slate-400" />
            {indicators.map(ind => (
              <Badge
                key={ind.id}
                variant="outline"
                className="cursor-pointer hover:bg-slate-800"
                onClick={() => setIndicators(prev => prev.filter(i => i.id !== ind.id))}
              >
                {ind.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Chart Container */}
        <div className="relative flex-1 min-h-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 z-10">
              <div className="text-slate-400">Loading chart...</div>
            </div>
          )}
          <div ref={chartContainerRef} className="rounded-lg overflow-hidden h-full" />
        </div>

        {/* Chart Info */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-xs flex-shrink-0">
          <div>
            <div className="text-slate-400">Open</div>
            <div className="text-white font-semibold">
              {chartData[chartData.length - 1] ? formatPrice(chartData[chartData.length - 1].open) : formatPrice(0)}
            </div>
          </div>
          <div>
            <div className="text-slate-400">High</div>
            <div className="text-white font-semibold">
              {chartData[chartData.length - 1] ? formatPrice(chartData[chartData.length - 1].high) : formatPrice(0)}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Low</div>
            <div className="text-white font-semibold">
              {chartData[chartData.length - 1] ? formatPrice(chartData[chartData.length - 1].low) : formatPrice(0)}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Close</div>
            <div className="text-white font-semibold">
              {chartData[chartData.length - 1] ? formatPrice(chartData[chartData.length - 1].close) : formatPrice(0)}
            </div>
          </div>
        </div>
          </div>
        )}

        {/* Info Tab Content */}
        {activeTab === 'Info' && (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
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
                  <div className="flex items-center gap-1 text-blue-400 cursor-pointer hover:underline">
                    <ExternalLink className="w-3 h-3" />
                    <span>Whitepaper</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 cursor-pointer hover:underline">
                    <ExternalLink className="w-3 h-3" />
                    <span>Index Methodology</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Composition */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PieChart className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-white">Asset Composition</h4>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'DOGE', weight: 30, price: '$0.0892' },
                    { name: 'SHIB', weight: 25, price: '$0.000012' },
                    { name: 'FLOKI', weight: 15, price: '$0.000089' },
                    { name: 'BONK', weight: 12, price: '$0.000021' },
                    { name: 'WIF', weight: 10, price: '$0.00145' },
                    { name: 'Others', weight: 8, price: '-' }
                  ].map((asset, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{asset.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{asset.price}</span>
                          <span className="text-white font-semibold">{asset.weight}%</span>
                        </div>
                      </div>
                      <Progress value={asset.weight} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Rules */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-white">Trading Rules</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Trading Hours</div>
                    <div className="text-white">24/7 (Continuous)</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Minimum Trade Size</div>
                    <div className="text-white">0.01 contracts</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Maximum Leverage</div>
                    <div className="text-white">50x</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Maker Fee</div>
                    <div className="text-white">0.02%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Taker Fee</div>
                    <div className="text-white">0.05%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trading Data Tab Content */}
        {activeTab === 'Trading Data' && (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand" />
              Trading Data Analytics
            </h3>

            {/* Market Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400">24h Volume</span>
                  </div>
                  <div className="text-lg font-bold text-white">$24.7M</div>
                  <div className="text-xs text-green-400">+12.5%</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Liquidity (TVL)</span>
                  </div>
                  <div className="text-lg font-bold text-white">$147.8M</div>
                  <div className="text-xs text-blue-400">+5.3%</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Active Traders</span>
                  </div>
                  <div className="text-lg font-bold text-white">2,847</div>
                  <div className="text-xs text-purple-400">+18.2%</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpDown className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-400">Open Interest</span>
                  </div>
                  <div className="text-lg font-bold text-white">$89.2M</div>
                  <div className="text-xs text-red-400">-3.1%</div>
                </CardContent>
              </Card>
            </div>

            {/* Order Book Depth */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-white">Order Book Depth</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Bid Depth (1%)</span>
                    <span className="text-green-400 font-semibold">$1.2M</span>
                  </div>
                  <Progress value={65} className="h-2 bg-slate-700" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Ask Depth (1%)</span>
                    <span className="text-red-400 font-semibold">$890K</span>
                  </div>
                  <Progress value={45} className="h-2 bg-slate-700" />

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-400">Bid/Ask Ratio</span>
                    <span className="text-white font-semibold">1.35</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funding Rate */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-white">Funding Rate</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Current Rate</div>
                    <div className="text-white font-semibold">0.0125%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Next Funding</div>
                    <div className="text-white font-semibold">2h 15m</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">8h Average</div>
                    <div className="text-green-400 font-semibold">+0.0089%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">24h Average</div>
                    <div className="text-green-400 font-semibold">+0.0112%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-orange-400" />
                  <h4 className="text-sm font-semibold text-white">Market Sentiment</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Long/Short Ratio</span>
                      <span className="text-white font-semibold">1.8 : 1</span>
                    </div>
                    <div className="flex h-2 rounded overflow-hidden">
                      <div className="bg-green-500" style={{ width: '64%' }} />
                      <div className="bg-red-500" style={{ width: '36%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Fear & Greed Index</span>
                      <span className="text-green-400 font-semibold">72 (Greed)</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                    <div>
                      <div className="text-slate-400 mb-1">Social Volume</div>
                      <div className="text-white font-semibold">High</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Sentiment Score</div>
                      <div className="text-green-400 font-semibold">+68%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Traders Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Radar className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-semibold text-white">Top Traders Activity</h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Top 10 Net Position</span>
                    <span className="text-green-400 font-semibold">+$12.4M Long</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Top 100 Net Position</span>
                    <span className="text-green-400 font-semibold">+$28.7M Long</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Whale/Retail Ratio</span>
                    <span className="text-white font-semibold">2.3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
