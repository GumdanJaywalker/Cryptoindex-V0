'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Eye,
  Plus
} from 'lucide-react'
import type { OHLCVData, Timeframe, ChartType, TechnicalIndicator } from '@/lib/types/trading-chart'
import { fetchOHLCVData, calculateMA, calculateRSI, subscribeToRealTimePrice } from '@/lib/api/trading-chart'

// Import lightweight-charts dynamically (browser-only library)
import type { IChartApi, ISeriesApi, CandlestickSeriesPartialOptions, LineSeriesPartialOptions, AreaSeriesPartialOptions, HistogramSeriesPartialOptions } from 'lightweight-charts'

const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
const chartTypes: ChartType[] = ['Candlestick', 'Line', 'Area', 'Histogram']

interface ChartAreaProps {
  indexId?: string
  className?: string
}

export function ChartArea({ indexId = 'default-index', className }: ChartAreaProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | ISeriesApi<'Area'> | ISeriesApi<'Histogram'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

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
        height: 500,
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
            width: chartContainerRef.current.clientWidth
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
    <Card className={`bg-slate-900/50 border-slate-800 ${className || ''}`}>
      <CardContent className="p-4">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Price Info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400">DOG_INDEX • {selectedTimeframe}</div>
              <div className="text-2xl font-bold text-white">
                ${currentPrice.toFixed(4)}
              </div>
            </div>
            <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <div className="text-sm font-semibold">
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)}
              </div>
              <div className="text-xs">
                ({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <div>24h Vol</div>
              <div className="text-sm font-semibold text-white">
                ${(volume24h / 1000000).toFixed(2)}M
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
        <div className="flex items-center gap-2 mb-4">
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
          <div className="flex items-center gap-2 mb-4">
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
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 z-10">
              <div className="text-slate-400">Loading chart...</div>
            </div>
          )}
          <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
        </div>

        {/* Chart Info */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Open</div>
            <div className="text-white font-semibold">
              ${chartData[chartData.length - 1]?.open.toFixed(4) || '0.0000'}
            </div>
          </div>
          <div>
            <div className="text-slate-400">High</div>
            <div className="text-white font-semibold">
              ${chartData[chartData.length - 1]?.high.toFixed(4) || '0.0000'}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Low</div>
            <div className="text-white font-semibold">
              ${chartData[chartData.length - 1]?.low.toFixed(4) || '0.0000'}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Close</div>
            <div className="text-white font-semibold">
              ${chartData[chartData.length - 1]?.close.toFixed(4) || '0.0000'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
