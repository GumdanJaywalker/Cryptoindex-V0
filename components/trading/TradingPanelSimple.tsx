'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Info, AlertTriangle, Clock, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import NumberTicker from '@/components/magicui/number-ticker'
import { MagicCard } from '@/components/magicui/magic-card'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

export function TradingPanel() {
  const [buyQuantity, setBuyQuantity] = useState('')
  const [sellQuantity, setSellQuantity] = useState('')
  const [buySlider, setBuySlider] = useState(0)
  const [sellSlider, setSellSlider] = useState(0)
  const [buyOrderType, setBuyOrderType] = useState('market')
  const [sellOrderType, setSellOrderType] = useState('market')
  const [buyLimitPrice, setBuyLimitPrice] = useState('')
  const [sellLimitPrice, setSellLimitPrice] = useState('')
  const [buyStopPrice, setBuyStopPrice] = useState('')
  const [sellStopPrice, setSellStopPrice] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // Dynamic price data for NumberTicker animations
  const [currentPrice, setCurrentPrice] = useState(1.2345)
  const [availableBalance, setAvailableBalance] = useState(8234.12)
  const [dogHoldings, setDogHoldings] = useState(100.00)
  const feeRate = 0.001 // 0.1% fee

  // Simulate price updates for NumberTicker animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 0.001)
      // Slightly update balance for demo
      setAvailableBalance(prev => prev + (Math.random() - 0.5) * 10)
    }, 2000)

    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const maxBuyQuantity = availableBalance / currentPrice
  const calculateBuyAmount = (quantity: number) => {
    const subtotal = quantity * currentPrice
    const fee = subtotal * feeRate
    return { subtotal, fee, total: subtotal + fee }
  }
  
  const calculateSellAmount = (quantity: number) => {
    const subtotal = quantity * currentPrice
    const fee = subtotal * feeRate
    return { subtotal, fee, total: subtotal - fee }
  }
  
  const handleBuySliderChange = (value: number) => {
    setBuySlider(value)
    const quantity = (maxBuyQuantity * value / 100).toFixed(4)
    setBuyQuantity(quantity)
  }
  
  const handleSellSliderChange = (value: number) => {
    setSellSlider(value)
    const quantity = (dogHoldings * value / 100).toFixed(4)
    setSellQuantity(quantity)
  }

  // Order type information rendering
  const renderOrderTypeInfo = (orderType: string, isBuy: boolean) => {
    switch (orderType) {
      case 'market':
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Market Order</span>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>• Executes immediately</div>
              <div>• Trades at current market price</div>
              <div>• Expected slippage: ~0.1%</div>
            </div>
          </div>
        )
      case 'limit':
        return (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Limit Order</span>
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
              <div>• Executes only at specified price</div>
              <div>• May take time to fill</div>
              <div>• Fill probability: {isBuy ? 'Medium' : 'High'}</div>
            </div>
          </div>
        )
      case 'stop-loss':
        return (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Stop Loss Order</span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
              <div>• Limits your losses</div>
              <div>• Triggers market order when price hit</div>
              <div>• Important risk management tool</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Order button text
  const getOrderButtonText = (orderType: string, quantity: string, isBuy: boolean) => {
    const action = isBuy ? 'Buy' : 'Sell'
    const qty = quantity || '0'
    
    switch (orderType) {
      case 'market':
        return `${action} ${qty} DOG (Market)`
      case 'limit':
        return `${action} ${qty} DOG (Limit)`
      case 'stop-loss':
        return `${action} ${qty} DOG (Stop Loss)`
      default:
        return `${action} ${qty} DOG`
    }
  }
  
  // SSR 문제 방지
  if (!mounted) {
    return (
      <div className="bg-background">
        <div className="px-3 pt-2.5 space-y-3 bg-background">
          <div className="w-full h-8 bg-secondary rounded animate-pulse"></div>
          <div className="space-y-3">
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
    <div className="bg-background">
      <div className="px-3 pt-2.5 space-y-3 bg-background">
        {/* Buy/Sell Toggle */}
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="buy" className="text-emerald-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-red-400 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <TrendingDown className="w-4 h-4 mr-1" />
              Sell
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-3 mt-3">
            {/* Order Type */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order Type</label>
              <Select value={buyOrderType} onValueChange={setBuyOrderType}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="market" className="text-popover-foreground focus:bg-accent">Market</SelectItem>
                  <SelectItem value="limit" className="text-popover-foreground focus:bg-accent">Limit</SelectItem>
                  <SelectItem value="stop-loss" className="text-popover-foreground focus:bg-accent">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Type Info */}
            {renderOrderTypeInfo(buyOrderType, true)}

            {/* Price Fields - Dynamic based on order type */}
            {buyOrderType === 'market' && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Market Price (USD)</label>
                <div className="relative">
                  <div className="flex items-center h-10 px-3 py-2 text-sm border border-border rounded-md bg-muted text-foreground cursor-not-allowed font-mono">
                    <NumberTicker 
                      value={currentPrice} 
                      prefix="$" 
                      decimalPlaces={4}
                      className="font-mono"
                    /> (Live)
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {buyOrderType === 'limit' && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Limit Price (USD)</label>
                <Input 
                  value={buyLimitPrice}
                  onChange={(e) => setBuyLimitPrice(e.target.value)}
                  placeholder={`Current: ${currentPrice.toFixed(4)}`}
                  className="bg-muted border-border text-foreground"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Market: <NumberTicker value={currentPrice} prefix="$" decimalPlaces={4} className="font-mono" /> | Diff: {buyLimitPrice ? ((Number(buyLimitPrice) - currentPrice) / currentPrice * 100).toFixed(2) : '0.00'}%
                </div>
              </div>
            )}

            {buyOrderType === 'stop-loss' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Trigger Price (USD)</label>
                  <Input 
                    value={buyStopPrice}
                    onChange={(e) => setBuyStopPrice(e.target.value)}
                    placeholder={`Below ${currentPrice.toFixed(4)}`}
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
              <label className="text-xs text-muted-foreground mb-1 block">Quantity (DOG)</label>
              <Input 
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(e.target.value)}
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
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${buySlider}%, hsl(var(--muted)) ${buySlider}%, hsl(var(--muted)) 100%)`
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Order Summary with MagicCard */}
            <MagicCard className="!bg-card !border-border" gradientColor="#8BD6FF">
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground font-mono">
                    <NumberTicker 
                      value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).subtotal : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trading Fee (0.1%)</span>
                  <span className="text-card-foreground font-mono">
                    <NumberTicker 
                      value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).fee : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="text-emerald-400 font-mono">
                    <NumberTicker 
                      value={buyQuantity ? calculateBuyAmount(Number(buyQuantity)).total : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
              </div>
            </MagicCard>

            {/* Place Order Button with Shimmer */}
            <ShimmerButton 
              className="w-full !bg-brand hover:!bg-brand/90 !text-white shadow-lg shadow-brand/20"
              disabled={!buyQuantity || Number(buyQuantity) <= 0}
            >
              {getOrderButtonText(buyOrderType, buyQuantity, true)}
            </ShimmerButton>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-3 mt-3">
            {/* Order Type */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order Type</label>
              <Select value={sellOrderType} onValueChange={setSellOrderType}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="market" className="text-popover-foreground focus:bg-accent">Market</SelectItem>
                  <SelectItem value="limit" className="text-popover-foreground focus:bg-accent">Limit</SelectItem>
                  <SelectItem value="stop-loss" className="text-popover-foreground focus:bg-accent">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Type Info */}
            {renderOrderTypeInfo(sellOrderType, false)}

            {/* Price Fields - Dynamic based on order type */}
            {sellOrderType === 'market' && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Market Price (USD)</label>
                <div className="relative">
                  <div className="flex items-center h-10 px-3 py-2 text-sm border border-border rounded-md bg-muted text-foreground cursor-not-allowed font-mono">
                    <NumberTicker 
                      value={currentPrice} 
                      prefix="$" 
                      decimalPlaces={4}
                      className="font-mono"
                    /> (Live)
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {sellOrderType === 'limit' && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Limit Price (USD)</label>
                <Input 
                  value={sellLimitPrice}
                  onChange={(e) => setSellLimitPrice(e.target.value)}
                  placeholder={`Current: ${currentPrice.toFixed(4)}`}
                  className="bg-muted border-border text-foreground"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Market: <NumberTicker value={currentPrice} prefix="$" decimalPlaces={4} className="font-mono" /> | Diff: {sellLimitPrice ? ((Number(sellLimitPrice) - currentPrice) / currentPrice * 100).toFixed(2) : '0.00'}%
                </div>
              </div>
            )}

            {sellOrderType === 'stop-loss' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Trigger Price (USD)</label>
                  <Input 
                    value={sellStopPrice}
                    onChange={(e) => setSellStopPrice(e.target.value)}
                    placeholder={`Below ${currentPrice.toFixed(4)}`}
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
              <label className="text-xs text-muted-foreground mb-1 block">Quantity (DOG)</label>
              <Input 
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
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
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${sellSlider}%, hsl(var(--muted)) ${sellSlider}%, hsl(var(--muted)) 100%)`
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Order Summary with MagicCard */}
            <MagicCard className="!bg-card !border-border" gradientColor="#ef4444">
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground font-mono">
                    <NumberTicker 
                      value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).subtotal : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trading Fee (0.1%)</span>
                  <span className="text-card-foreground font-mono">
                    <NumberTicker 
                      value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).fee : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
                  <span className="text-muted-foreground">Net Proceeds</span>
                  <span className="text-red-400 font-mono">
                    <NumberTicker 
                      value={sellQuantity ? calculateSellAmount(Number(sellQuantity)).total : 0} 
                      prefix="$" 
                      decimalPlaces={2}
                    />
                  </span>
                </div>
              </div>
            </MagicCard>

            {/* Place Order Button with Shimmer */}
            <ShimmerButton 
              className="w-full !bg-red-600 hover:!bg-red-700 !text-white shadow-lg shadow-red-600/20"
              disabled={!sellQuantity || Number(sellQuantity) <= 0 || Number(sellQuantity) > dogHoldings}
            >
              {getOrderButtonText(sellOrderType, sellQuantity, false)}
            </ShimmerButton>
          </TabsContent>
        </Tabs>

        {/* Portfolio Info with NumberTicker animations */}
        <div className="border-t border-border pt-3 pb-4 space-y-2">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Portfolio Balance</div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cash Balance</span>
            <span className="text-foreground font-mono">
              <NumberTicker 
                value={availableBalance} 
                prefix="$" 
                decimalPlaces={2}
              />
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">DOG Holdings</span>
            <span className="text-foreground font-mono">
              <NumberTicker 
                value={dogHoldings} 
                suffix=" DOG" 
                decimalPlaces={4}
              />
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Holdings Value</span>
            <span className="text-foreground font-mono">
              <NumberTicker 
                value={dogHoldings * currentPrice} 
                prefix="$" 
                decimalPlaces={2}
              />
            </span>
          </div>
          <div className="flex justify-between text-xs font-medium border-t border-border pt-2">
            <span className="text-muted-foreground">Total Portfolio</span>
            <span className="text-emerald-400 font-mono">
              <NumberTicker 
                value={availableBalance + (dogHoldings * currentPrice)} 
                prefix="$" 
                decimalPlaces={2}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
