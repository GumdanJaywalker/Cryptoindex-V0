'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TrendingUp, TrendingDown, Info, AlertTriangle, Clock, Zap } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { StaticCurrencyDisplay } from '@/components/ui/static-currency-display'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { calculateTradingFee, getTradingFeeRange, formatFeeRangeString } from '@/lib/utils/fee-calculator'
import { getUserVIPTier, getIsInvitedUser } from '@/lib/mock/user-vip'
import { useTradingStore } from '@/lib/store/trading-store'
import ConfirmTradeModal from '@/components/trading/ConfirmTradeModal'
import { toast } from 'react-hot-toast'
// Removed shimmer for order buttons (solid style preferred)

// Shared state for order type (module-level for simplicity)
let sharedOrderType: 'market' | 'limit' | 'stop-loss' = 'market'
let orderTypeListeners: Array<(type: 'market' | 'limit' | 'stop-loss') => void> = []

function useSharedOrderType() {
  const [orderType, setOrderTypeState] = useState<'market' | 'limit' | 'stop-loss'>(sharedOrderType)

  useEffect(() => {
    const listener = (newType: 'market' | 'limit' | 'stop-loss') => setOrderTypeState(newType)
    orderTypeListeners.push(listener)
    return () => {
      orderTypeListeners = orderTypeListeners.filter(l => l !== listener)
    }
  }, [])

  const setOrderType = (newType: 'market' | 'limit' | 'stop-loss') => {
    sharedOrderType = newType
    orderTypeListeners.forEach(listener => listener(newType))
  }

  return [orderType, setOrderType] as const
}

// Order Type Tabs - can be used independently in grid layout
export function TradingPanelOrderTypeTabs() {
  const [orderType, setOrderType] = useSharedOrderType()

  return (
    <div className="h-full flex border-b border-teal bg-teal-card font-[Arial,sans-serif] rounded-none">
      <button
        onClick={() => setOrderType('market')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${orderType === 'market'
          ? 'text-white bg-teal-elevated border-b-2 border-brand'
          : 'text-slate-400 hover:text-white hover:bg-teal-elevated/50'
          }`}
      >
        Market
      </button>
      <button
        onClick={() => setOrderType('limit')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${orderType === 'limit'
          ? 'text-white bg-teal-elevated border-b-2 border-brand'
          : 'text-slate-400 hover:text-white hover:bg-teal-elevated/50'
          }`}
      >
        Limit
      </button>
      <button
        onClick={() => setOrderType('stop-loss')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${orderType === 'stop-loss'
          ? 'text-white bg-teal-elevated border-b-2 border-brand'
          : 'text-slate-400 hover:text-white hover:bg-teal-elevated/50'
          }`}
      >
        Stop Loss
      </button>
    </div>
  )
}

export function TradingPanel() {
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)
  const addOrder = useTradingStore(state => state.addOrder)
  const addPosition = useTradingStore(state => state.addPosition)
  const [buyQuantity, setBuyQuantity] = useState('')
  const [sellQuantity, setSellQuantity] = useState('')
  const [buySlider, setBuySlider] = useState(0)
  const [sellSlider, setSellSlider] = useState(0)
  const [orderType, setOrderType] = useSharedOrderType() // Use shared order type state
  const [buyLimitPrice, setBuyLimitPrice] = useState('')
  const [sellLimitPrice, setSellLimitPrice] = useState('')
  const [buyStopPrice, setBuyStopPrice] = useState('')
  const [sellStopPrice, setSellStopPrice] = useState('')
  const [mounted, setMounted] = useState(false)

  // Confirm Trade Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [pendingTradeData, setPendingTradeData] = useState<{
    symbol: string
    type: 'buy' | 'sell'
    orderType: 'market' | 'limit' | 'stop-loss'
    quantity: number
    price: number
    limitPrice?: number
    stopPrice?: number
    subtotal: number
    fee: number
    total: number
  } | null>(null)

  const { formatPrice, formatBalance, currency } = useCurrency()

  // Dynamic price data for NumberTicker animations
  const [currentPrice, setCurrentPrice] = useState(1.2345)
  const [availableBalance, setAvailableBalance] = useState(8234.12)
  const [indexHoldings, setIndexHoldings] = useState(100.00)

  // Extract short symbol for display (e.g., "DOG_INDEX" → "DOG")
  const shortSymbol = selectedIndexSymbol.replace('_INDEX', '')

  // Get user VIP tier and calculate fees
  const userVIPTier = getUserVIPTier()
  const isInvited = getIsInvitedUser()
  const feeRange = getTradingFeeRange('L1', 1000) // L1 layer for demo
  const feeRangeString = formatFeeRangeString(feeRange.minRate, feeRange.maxRate)

  // Calculate buy amounts with actual fee
  const calculateBuyAmount = (quantity: number) => {
    const subtotal = quantity * currentPrice
    const feeBreakdown = calculateTradingFee(subtotal, userVIPTier, 'L1', isInvited)
    return { subtotal, fee: feeBreakdown.totalFee, total: subtotal + feeBreakdown.totalFee }
  }

  // Calculate max buy quantity using iterative approach to match available balance exactly
  const maxBuyQuantity = useMemo(() => {
    // Start with conservative estimate
    let quantity = availableBalance / (currentPrice * (1 + feeRange.maxRate / 100))

    // Iterate to find exact quantity where total = availableBalance
    for (let i = 0; i < 5; i++) {
      const amounts = calculateBuyAmount(quantity)
      const diff = availableBalance - amounts.total

      if (Math.abs(diff) < 0.01) break // Close enough (within 1 cent)

      // Adjust quantity based on difference
      const adjustment = diff / (currentPrice * (1 + feeRange.maxRate / 100))
      quantity += adjustment
    }

    return quantity
  }, [currentPrice, availableBalance, feeRange.maxRate])

  // Simulate price updates for NumberTicker animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 0.001)
      // Slightly update balance for demo
      setAvailableBalance(prev => prev + (Math.random() - 0.5) * 10)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Auto-adjust quantity when price/balance changes and slider is at 100%
  useEffect(() => {
    if (buySlider === 100) {
      const quantity = maxBuyQuantity.toFixed(4)
      setBuyQuantity(quantity)
    }
  }, [maxBuyQuantity, buySlider])

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculateSellAmount = (quantity: number) => {
    const subtotal = quantity * currentPrice
    const feeBreakdown = calculateTradingFee(subtotal, userVIPTier, 'L1', isInvited)
    return { subtotal, fee: feeBreakdown.totalFee, total: subtotal - feeBreakdown.totalFee }
  }

  const handleBuySliderChange = (value: number) => {
    setBuySlider(value)
    const quantity = (maxBuyQuantity * value / 100).toFixed(4)
    setBuyQuantity(quantity)
  }

  const handleSellSliderChange = (value: number) => {
    setSellSlider(value)
    const quantity = (indexHoldings * value / 100).toFixed(4)
    setSellQuantity(quantity)
  }

  // Handle quantity input change and update slider accordingly
  const handleBuyQuantityChange = (value: string) => {
    setBuyQuantity(value)
    const numValue = Number(value)
    if (!isNaN(numValue) && maxBuyQuantity > 0) {
      const sliderValue = Math.min(100, (numValue / maxBuyQuantity) * 100)
      setBuySlider(Math.round(sliderValue))
    }
  }

  const handleSellQuantityChange = (value: string) => {
    setSellQuantity(value)
    const numValue = Number(value)
    if (!isNaN(numValue) && indexHoldings > 0) {
      const sliderValue = Math.min(100, (numValue / indexHoldings) * 100)
      setSellSlider(Math.round(sliderValue))
    }
  }

  // Open confirm modal for buy
  const handleBuyClick = () => {
    if (!buyQuantity || Number(buyQuantity) <= 0) return

    const amounts = calculateBuyAmount(Number(buyQuantity))
    setPendingTradeData({
      symbol: selectedIndexSymbol,
      type: 'buy',
      orderType: orderType as 'market' | 'limit' | 'stop-loss',
      quantity: Number(buyQuantity),
      price: currentPrice,
      limitPrice: buyLimitPrice ? Number(buyLimitPrice) : undefined,
      stopPrice: buyStopPrice ? Number(buyStopPrice) : undefined,
      subtotal: amounts.subtotal,
      fee: amounts.fee,
      total: amounts.total,
    })
    setIsConfirmModalOpen(true)
  }

  // Open confirm modal for sell
  const handleSellClick = () => {
    if (!sellQuantity || Number(sellQuantity) <= 0 || Number(sellQuantity) > indexHoldings) return

    const amounts = calculateSellAmount(Number(sellQuantity))
    setPendingTradeData({
      symbol: selectedIndexSymbol,
      type: 'sell',
      orderType: orderType as 'market' | 'limit' | 'stop-loss',
      quantity: Number(sellQuantity),
      price: currentPrice,
      limitPrice: sellLimitPrice ? Number(sellLimitPrice) : undefined,
      stopPrice: sellStopPrice ? Number(sellStopPrice) : undefined,
      subtotal: amounts.subtotal,
      fee: amounts.fee,
      total: amounts.total,
    })
    setIsConfirmModalOpen(true)
  }

  // Execute the trade
  const handleConfirmTrade = async () => {
    if (!pendingTradeData) return

    console.log('TradingPanelSimple handleConfirmTrade called', { pendingTradeData })

    // Simulate trade execution
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create order object
    const newOrder = {
      id: `order-${Date.now()}`,
      symbol: selectedIndexSymbol,
      side: (pendingTradeData.type === 'buy' ? 'Buy' : 'Sell') as "Buy" | "Sell",
      type: (pendingTradeData.orderType === 'market' ? 'Market' : pendingTradeData.orderType === 'limit' ? 'Limit' : 'Stop') as "Market" | "Limit" | "Stop",
      size: pendingTradeData.quantity,
      price: pendingTradeData.price,
      filled: pendingTradeData.orderType === 'market' ? pendingTradeData.quantity : 0,
      status: (pendingTradeData.orderType === 'market' ? 'Filled' : 'Open') as "Filled" | "Cancelled" | "Pending" | "Open",
      time: new Date().toLocaleTimeString(),
      timestamp: new Date()
    }

    console.log('Creating order:', newOrder)
    addOrder(newOrder)

    // Create position for market orders (limit/stop orders create positions when filled)
    if (pendingTradeData.orderType === 'market') {
      const newPosition = {
        id: `pos-${Date.now()}`,
        symbol: selectedIndexSymbol,
        side: (pendingTradeData.type === 'buy' ? 'Buy' : 'Sell') as "Buy" | "Sell",
        size: pendingTradeData.quantity,
        entryPrice: pendingTradeData.price,
        currentPrice: pendingTradeData.price,
        pnl: 0,
        pnlPercent: 0,
        margin: pendingTradeData.total,
        leverage: '1x',
        liquidationPrice: 0,
        timestamp: new Date()
      }

      console.log('Creating position:', newPosition)
      addPosition(newPosition)
    }

    // Show success toast
    toast.success(
      `${pendingTradeData.type === 'buy' ? 'Buy' : 'Sell'} order executed successfully!`,
      {
        duration: 3000,
        style: {
          background: '#1A2428',
          color: '#fff',
          border: '1px solid #2D3F45',
        },
      }
    )

    // Reset form
    if (pendingTradeData.type === 'buy') {
      setBuyQuantity('')
      setBuySlider(0)
      setBuyLimitPrice('')
      setBuyStopPrice('')
    } else {
      setSellQuantity('')
      setSellSlider(0)
      setSellLimitPrice('')
      setSellStopPrice('')
    }

    // Close modal
    setPendingTradeData(null)
    setIsConfirmModalOpen(false)
  }

  // Order button text
  const getOrderButtonText = (orderType: string, quantity: string, isBuy: boolean) => {
    const action = isBuy ? 'Buy' : 'Sell'
    const qty = quantity || '0'

    switch (orderType) {
      case 'market':
        return `${action} ${qty} ${shortSymbol} (Market)`
      case 'limit':
        return `${action} ${qty} ${shortSymbol} (Limit)`
      case 'stop-loss':
        return `${action} ${qty} ${shortSymbol} (Stop Loss)`
      default:
        return `${action} ${qty} ${shortSymbol}`
    }
  }

  // Prevent SSR issues
  if (!mounted) {
    return (
      <div className="bg-background">
        <div className="px-3 pt-2.5 space-y-3 bg-background">
          <div className="space-y-3">
            <div className="w-full h-8 bg-secondary rounded animate-pulse"></div>
            <div className="h-16 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
            <div className="h-20 bg-card rounded animate-pulse"></div>
            <div className="h-10 bg-emerald-600 rounded animate-pulse"></div>
          </div>
          <div className="border-t border-border pt-3 pb-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-emerald-400 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <TooltipProvider>
      <div className="bg-background font-[Arial,sans-serif]">
        {/* Order Type Tabs - Full width */}
        <div className="h-10 flex items-center border-b border-teal bg-teal-card flex-shrink-0">
          <button
            onClick={() => setOrderType('market')}
            className={`glass-tab flex-1 px-4 py-2 text-sm font-medium ${orderType === 'market' ? 'active text-white' : 'text-slate-400'
              }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`glass-tab flex-1 px-4 py-2 text-sm font-medium ${orderType === 'limit' ? 'active text-white' : 'text-slate-400'
              }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType('stop-loss')}
            className={`glass-tab flex-1 px-4 py-2 text-sm font-medium ${orderType === 'stop-loss' ? 'active text-white' : 'text-slate-400'
              }`}
          >
            Stop Loss
          </button>
        </div>

        {/* Content with padding */}
        <div className="px-3 pt-3 space-y-3 bg-background overflow-hidden">
          {/* Buy/Sell Toggle */}
          <Tabs defaultValue="buy" className="w-full overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="buy" className="text-[#75cfc1] data-[state=active]:bg-[#75cfc1] data-[state=active]:text-black transition-all duration-200">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-[#75cfc1] data-[state=active]:bg-[#75cfc1] data-[state=active]:text-black transition-all duration-200">
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-3 mt-3">
              {/* Price Fields - Dynamic based on order type */}
              {orderType === 'market' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Market Price ({currency})</label>
                  <div className="relative">
                    <div className="flex items-center h-10 px-3 py-2 text-sm border border-border rounded-md bg-muted text-foreground cursor-not-allowed ">
                      <StaticCurrencyDisplay
                        value={currentPrice}
                        decimalPlaces={4}
                        className=""
                      /> (Live)
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'limit' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Limit Price ({currency})</label>
                  <Input
                    value={buyLimitPrice}
                    onChange={(e) => setBuyLimitPrice(e.target.value)}
                    placeholder={`Current: ${formatPrice(currentPrice)}`}
                    className="bg-muted border-border text-foreground"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Market: <StaticCurrencyDisplay value={currentPrice} decimalPlaces={4} className="" /> | Diff: {buyLimitPrice ? ((Number(buyLimitPrice) - currentPrice) / currentPrice * 100).toFixed(2) : '0.00'}%
                  </div>
                </div>
              )}

              {orderType === 'stop-loss' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Trigger Price ({currency})</label>
                    <Input
                      value={buyStopPrice}
                      onChange={(e) => setBuyStopPrice(e.target.value)}
                      placeholder={`Below ${formatPrice(currentPrice)}`}
                      className="bg-muted border-border text-foreground"
                    />
                    <div className="text-xs text-red-400 mt-1">
                      Will trigger market sell when price drops below this level
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quantity ({shortSymbol})</label>
                <Input
                  value={buyQuantity}
                  onChange={(e) => handleBuyQuantityChange(e.target.value)}
                  placeholder="0.0000"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              {/* Quantity Slider */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>0%</span>
                  <span className="text-foreground">{buySlider}% of balance</span>
                  <span>100%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={buySlider}
                    onChange={(e) => handleBuySliderChange(Number(e.target.value))}
                    className="slider-buy w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      '--slider-progress': `${buySlider}%`,
                      background: `linear-gradient(to right, #183133 0%, #183133 ${buySlider}%, hsl(var(--muted)) ${buySlider}%, hsl(var(--muted)) 100%)`
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg">
                <div className="p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground ">
                      <StaticCurrencyDisplay
                        value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).subtotal : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground flex items-center gap-1 cursor-help">
                          Trading Fee ({feeRangeString})
                          <Info className="w-3 h-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1 text-xs">
                          <div className="font-semibold">Trading Fee Structure</div>
                          <div>• Current tier: {userVIPTier}</div>
                          <div>• Fee range: {feeRangeString}</div>
                          <div>• Invited user: {isInvited ? 'Yes (50% discount)' : 'No'}</div>
                          <div className="text-muted-foreground mt-2">
                            Higher VIP tiers and referral invitations reduce fees
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-card-foreground ">
                      <StaticCurrencyDisplay
                        value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).fee : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="text-emerald-400 ">
                      <StaticCurrencyDisplay
                        value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).total : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleBuyClick}
                className="w-full text-black font-semibold py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: '#50d2c1'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6de0cf'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#50d2c1'}
                disabled={!buyQuantity || Number(buyQuantity) <= 0}
              >
                {getOrderButtonText(orderType, buyQuantity, true)}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-3 mt-3">
              {/* Price Fields - Dynamic based on order type */}
              {orderType === 'market' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Market Price ({currency})</label>
                  <div className="relative">
                    <div className="flex items-center h-10 px-3 py-2 text-sm border border-border rounded-md bg-muted text-foreground cursor-not-allowed ">
                      <StaticCurrencyDisplay
                        value={currentPrice}
                        decimalPlaces={4}
                        className=""
                      /> (Live)
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'limit' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Limit Price ({currency})</label>
                  <Input
                    value={sellLimitPrice}
                    onChange={(e) => setSellLimitPrice(e.target.value)}
                    placeholder={`Current: ${formatPrice(currentPrice)}`}
                    className="bg-muted border-border text-foreground"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Market: <StaticCurrencyDisplay value={currentPrice} decimalPlaces={4} className="" /> | Diff: {sellLimitPrice ? ((Number(sellLimitPrice) - currentPrice) / currentPrice * 100).toFixed(2) : '0.00'}%
                  </div>
                </div>
              )}

              {orderType === 'stop-loss' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Trigger Price ({currency})</label>
                    <Input
                      value={sellStopPrice}
                      onChange={(e) => setSellStopPrice(e.target.value)}
                      placeholder={`Below ${formatPrice(currentPrice)}`}
                      className="bg-muted border-border text-foreground"
                    />
                    <div className="text-xs text-red-400 mt-1">
                      Will trigger market sell when price drops below this level
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quantity ({shortSymbol})</label>
                <Input
                  value={sellQuantity}
                  onChange={(e) => handleSellQuantityChange(e.target.value)}
                  placeholder="0.0000"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              {/* Quantity Slider */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>0%</span>
                  <span className="text-foreground">{sellSlider}% of holdings</span>
                  <span>100%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sellSlider}
                    onChange={(e) => handleSellSliderChange(Number(e.target.value))}
                    className="slider-sell w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      '--slider-progress': `${sellSlider}%`,
                      background: `linear-gradient(to right, #183133 0%, #183133 ${sellSlider}%, hsl(var(--muted)) ${sellSlider}%, hsl(var(--muted)) 100%)`
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg">
                <div className="p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground ">
                      <StaticCurrencyDisplay
                        value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).subtotal : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground flex items-center gap-1 cursor-help">
                          Trading Fee ({feeRangeString})
                          <Info className="w-3 h-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1 text-xs">
                          <div className="font-semibold">Trading Fee Structure</div>
                          <div>• Current tier: {userVIPTier}</div>
                          <div>• Fee range: {feeRangeString}</div>
                          <div>• Invited user: {isInvited ? 'Yes (50% discount)' : 'No'}</div>
                          <div className="text-muted-foreground mt-2">
                            Higher VIP tiers and referral invitations reduce fees
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-card-foreground ">
                      <StaticCurrencyDisplay
                        value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).fee : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
                    <span className="text-muted-foreground">Net Proceeds</span>
                    <span className="text-red-400 ">
                      <StaticCurrencyDisplay
                        value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).total : 0}
                        decimalPlaces={2}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleSellClick}
                className="w-full text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: '#dd5e56'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e97971'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dd5e56'}
                disabled={!sellQuantity || Number(sellQuantity) <= 0 || Number(sellQuantity) > indexHoldings}
              >
                {getOrderButtonText(orderType, sellQuantity, false)}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Portfolio Info with NumberTicker animations */}
          <div className="border-t border-border pt-3 pb-4 space-y-2">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Portfolio Balance</div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cash Balance</span>
              <span className="text-foreground ">
                <StaticCurrencyDisplay
                  value={availableBalance}
                  decimalPlaces={2}
                />
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{shortSymbol} Holdings</span>
              <span className="text-foreground ">
                <StaticCurrencyDisplay
                  value={indexHoldings}
                  customSuffix={` ${shortSymbol}`}
                  decimalPlaces={4}
                />
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Holdings Value</span>
              <span className="text-foreground ">
                <StaticCurrencyDisplay
                  value={indexHoldings * currentPrice}
                  decimalPlaces={2}
                />
              </span>
            </div>
            <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
              <span className="text-muted-foreground">Total Portfolio</span>
              <span className="text-emerald-400 ">
                <StaticCurrencyDisplay
                  value={availableBalance + (indexHoldings * currentPrice)}
                  decimalPlaces={2}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Trade Modal */}
        <ConfirmTradeModal
          open={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false)
            setPendingTradeData(null)
          }}
          onConfirm={handleConfirmTrade}
          tradeData={pendingTradeData}
        />
      </div>
    </TooltipProvider>
  )
}
