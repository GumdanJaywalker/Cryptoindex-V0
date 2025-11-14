'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Clock, Settings, Zap, TrendingUp, TrendingDown, Target, Timer, Shield, AlertTriangle, ArrowDown } from 'lucide-react'
import { useCurrency } from '@/lib/hooks/useCurrency'
import { useTradingStore } from '@/lib/store/trading-store'
import ConfirmTradeModal from '@/components/trading/ConfirmTradeModal'

const orderTypes = ['Market', 'Limit', 'Stop Market', 'Stop Limit', 'OCO', 'TWAP', 'Scale', 'Iceberg', 'Trailing Stop']
const leverageOptions = [1, 2, 5, 10, 20, 50]
const marginModes = ['Cross Margin', 'Isolated Margin']
const timeInForceOptions = ['GTC', 'IOC', 'FOK']

export function TradingPanel() {
  const { formatPrice, formatFee, formatBalance, currency } = useCurrency()

  // 🆕 Subscribe to Trading Store SSOT
  const currentPrice = useTradingStore(state => state.currentPrice)
  const selectedIndexSymbol = useTradingStore(state => state.selectedIndexSymbol)

  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy')
  const [orderType, setOrderType] = useState('Market')
  const [leverage, setLeverage] = useState(10)
  const [marginMode, setMarginMode] = useState('Cross Margin')
  const [price, setPrice] = useState(currentPrice.toFixed(4))
  const [size, setSize] = useState('')
  const [sizeMode, setSizeMode] = useState<'USDC' | 'Contracts' | 'Percentage'>('USDC')
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [trailingStopEnabled, setTrailingStopEnabled] = useState(false)
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [timeInForce, setTimeInForce] = useState('GTC')
  const [hiddenOrder, setHiddenOrder] = useState(false)
  const [orderExpiry, setOrderExpiry] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Confirm modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  // TWAP specific
  const [twapDuration, setTwapDuration] = useState('60')
  
  // Scale specific
  const [scaleOrders, setScaleOrders] = useState('5')
  const [scaleRange, setScaleRange] = useState('5')
  
  // Iceberg specific
  const [icebergVisible, setIcebergVisible] = useState('10')
  
  // Trailing Stop specific
  const [trailingDistance, setTrailingDistance] = useState('2')

  // 🆕 Sync price with Store currentPrice for Market orders
  useEffect(() => {
    if (orderType === 'Market') {
      setPrice(currentPrice.toFixed(4))
    }
  }, [currentPrice, orderType])

  const getRiskColor = (percentage: number) => {
    if (percentage < 50) return 'text-emerald-400'
    if (percentage < 80) return 'text-amber-400'
    return 'text-red-400'
  }

  // 🆕 Phase 4.3: Calculate liquidation price based on leverage and side
  const calculateLiquidationPrice = (entryPrice: number, leverage: number, side: 'Buy' | 'Sell'): number => {
    // Liquidation occurs when loss equals initial margin (1/leverage)
    // Long position: liquidationPrice = entryPrice * (1 - 1/leverage)
    // Short position: liquidationPrice = entryPrice * (1 + 1/leverage)

    if (side === 'Buy') {
      return entryPrice * (1 - 1 / leverage)
    } else {
      return entryPrice * (1 + 1 / leverage)
    }
  }

  // 🆕 Phase 4.2: Handle order confirmation and add to Store
  const addOrder = useTradingStore(state => state.addOrder)
  const addPosition = useTradingStore(state => state.addPosition)

  const handleOpenConfirmModal = () => {
    console.log('handleOpenConfirmModal called', { size, orderType, side })

    if (!size || parseFloat(size) <= 0) {
      console.log('Invalid size, cannot open modal')
      return
    }

    setConfirmModalOpen(true)
  }

  const handleConfirmTrade = useCallback(() => {
    console.log('handleConfirmTrade called', { size, orderType, side })

    if (!size || parseFloat(size) <= 0) {
      console.log('Early return: invalid size')
      setConfirmModalOpen(false)
      return
    }

    const orderPrice = orderType === 'Market' ? currentPrice : parseFloat(price)
    const orderSize = parseFloat(size)

    // Normalize order type for Store compatibility
    const normalizedType = orderType.includes('Market') ? 'Market' :
                           orderType.includes('Limit') ? 'Limit' : 'Stop'

    console.log('Creating order...', { normalizedType, orderPrice, orderSize })

    // Create order object
    const newOrder = {
      id: `order-${Date.now()}`,
      symbol: selectedIndexSymbol,
      side: side,
      type: normalizedType as 'Market' | 'Limit' | 'Stop',
      size: orderSize,
      price: orderPrice,
      filled: 0,
      status: normalizedType === 'Market' ? 'Pending' : 'Open' as 'Open' | 'Pending',
      time: new Date().toLocaleTimeString(),
      timestamp: new Date()
    }

    // Add to orders (will auto-fill for Market orders via Store logic)
    addOrder(newOrder)
    console.log('Order added:', newOrder)

    // If Market order, immediately create position
    if (normalizedType === 'Market') {
      const liquidationPrice = calculateLiquidationPrice(orderPrice, leverage, side)
      const margin = (orderPrice * orderSize) / leverage

      const newPosition = {
        id: `pos-${Date.now()}`,
        symbol: selectedIndexSymbol,
        side: side,
        size: orderSize,
        entryPrice: orderPrice,
        currentPrice: orderPrice,
        pnl: 0,
        pnlPercent: 0,
        margin,
        leverage: `${leverage}x`,
        liquidationPrice,
        timestamp: new Date()
      }

      addPosition(newPosition)
      console.log('Position added:', newPosition)

      // Clear form
      setSize('')
      setTakeProfit('')
      setStopLoss('')
    }

    // Close modal after successful trade execution
    setConfirmModalOpen(false)
  }, [size, orderType, side, currentPrice, price, selectedIndexSymbol, leverage, addOrder, addPosition])

  const handleConfirmFromModal = useCallback(() => {
    console.log('handleConfirmFromModal called')
    handleConfirmTrade()
  }, [handleConfirmTrade])

  const renderOrderTypeSpecificFields = () => {
    switch (orderType) {
      case 'TWAP':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Duration (minutes)</label>
              <Input
                value={twapDuration}
                onChange={(e) => setTwapDuration(e.target.value)}
                className="bg-muted border-border text-foreground text-sm h-9"
                placeholder="60"
              />
            </div>
          </div>
        )
      case 'Scale':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Number of Orders</label>
              <Input
                value={scaleOrders}
                onChange={(e) => setScaleOrders(e.target.value)}
                className="bg-muted border-border text-foreground text-sm h-9"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Price Range (%)</label>
              <Input
                value={scaleRange}
                onChange={(e) => setScaleRange(e.target.value)}
                className="bg-muted border-border text-foreground text-sm h-9"
                placeholder="5"
              />
            </div>
          </div>
        )
      case 'Iceberg':
        return (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Visible Size (%)</label>
            <Input
              value={icebergVisible}
              onChange={(e) => setIcebergVisible(e.target.value)}
              className="bg-muted border-border text-foreground text-sm h-9"
              placeholder="10"
            />
          </div>
        )
      case 'Trailing Stop':
        return (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Trailing Distance (%)</label>
            <Input
              value={trailingDistance}
              onChange={(e) => setTrailingDistance(e.target.value)}
              className="bg-muted border-border text-foreground text-sm h-9"
              placeholder="2"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-background border-border h-full flex flex-col">
      {/* 🔒 Fixed Header - Phase 7 */}
      <div className="h-7 bg-secondary border-b border-border flex items-center justify-between px-3 flex-shrink-0">
        <h3 className="text-sm font-medium text-foreground">Trading Panel</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings className="w-3 h-3 mr-1" />
          Advanced
        </Button>
      </div>

      {/* 🔒 Fixed Buy/Sell Tabs - Phase 7 */}
      <div className="px-3 pt-2.5 bg-background flex-shrink-0">
        <Tabs value={side} onValueChange={(value) => setSide(value as 'Buy' | 'Sell')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary p-1">
            <TabsTrigger value="Buy" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-muted-foreground hover:text-foreground">
              <TrendingUp className="w-4 h-4 mr-1" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="Sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-muted-foreground hover:text-foreground">
              <TrendingDown className="w-4 h-4 mr-1" />
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 📜 Scrollable Form Area - Phase 7 */}
      <div className="flex-1 overflow-y-auto px-3 pt-2.5 space-y-3 bg-background">

        {/* Order Type */}
        <div>
          <label className="block text-xs text-muted-foreground mb-2">Order Type</label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="bg-muted border-border text-foreground h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {orderTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                  {type}
                  {type === 'TWAP' && <Badge variant="secondary" className="ml-2 text-xs bg-accent text-accent-foreground">Pro</Badge>}
                  {type === 'Iceberg' && <Badge variant="secondary" className="ml-2 text-xs bg-accent text-accent-foreground">Pro</Badge>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Leverage & Margin Mode */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-muted-foreground">Leverage: {leverage}x</label>
              <div className={`text-xs ${getRiskColor((leverage / 50) * 100)}`}>
                Risk: {leverage > 10 ? 'High' : leverage > 5 ? 'Medium' : 'Low'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {leverageOptions.map((lev) => (
                <Button
                  key={lev}
                  variant={leverage === lev ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeverage(lev)}
                  className={`text-xs h-8 ${
                    leverage === lev
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {lev}x
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2">Margin Mode</label>
            <Tabs value={marginMode} onValueChange={setMarginMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary p-1">
                <TabsTrigger value="Cross Margin" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
                  Cross
                </TabsTrigger>
                <TabsTrigger value="Isolated Margin" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
                  Isolated
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Price */}
        {orderType !== 'Market' && (
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Price ({currency})</label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-muted border-border text-foreground h-9"
              placeholder="0.0000"
            />
          </div>
        )}

        {/* Size */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted-foreground">Size</label>
            <Tabs value={sizeMode} onValueChange={(value) => setSizeMode(value as any)} className="h-6">
              <TabsList className="grid grid-cols-3 bg-secondary h-6 p-0">
                <TabsTrigger value="USDC" className="text-xs px-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">USDC</TabsTrigger>
                <TabsTrigger value="Contracts" className="text-xs px-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Contracts</TabsTrigger>
                <TabsTrigger value="Percentage" className="text-xs px-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">%</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="bg-muted border-border text-foreground h-9"
            placeholder={sizeMode === 'USDC' ? '0.00' : sizeMode === 'Contracts' ? '0' : '0'}
          />
          <div className="grid grid-cols-4 gap-1 mt-2">
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {percent}%
              </Button>
            ))}
          </div>
        </div>

        {/* Order Type Specific Fields */}
        {renderOrderTypeSpecificFields()}

        {/* TP/SL */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={takeProfitEnabled}
              onCheckedChange={(checked) => setTakeProfitEnabled(Boolean(checked))}
              className="border-border data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
            <label className="text-xs text-muted-foreground">Take Profit</label>
            <Target className="w-3 h-3 text-emerald-400" />
          </div>
          {takeProfitEnabled && (
            <Input
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="bg-muted border-border text-foreground h-9"
              placeholder="0.0000"
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={stopLossEnabled}
              onCheckedChange={(checked) => setStopLossEnabled(Boolean(checked))}
              className="border-border data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label className="text-xs text-muted-foreground">Stop Loss</label>
            <Shield className="w-3 h-3 text-red-400" />
          </div>
          {stopLossEnabled && (
            <Input
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="bg-muted border-border text-foreground h-9"
              placeholder="0.0000"
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={trailingStopEnabled}
              onCheckedChange={(checked) => setTrailingStopEnabled(Boolean(checked))}
              className="border-border data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
            />
            <label className="text-xs text-muted-foreground">Trailing Stop</label>
            <Timer className="w-3 h-3 text-orange-400" />
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            <Separator className="bg-border" />
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-foreground flex items-center">
                <Settings className="w-3 h-3 mr-1" />
                Advanced Options
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={postOnly}
                    onCheckedChange={(checked) => setPostOnly(Boolean(checked))}
                    className="border-border"
                  />
                  <label className="text-xs text-muted-foreground">Post Only</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={reduceOnly}
                    onCheckedChange={(checked) => setReduceOnly(Boolean(checked))}
                    className="border-border"
                  />
                  <label className="text-xs text-muted-foreground">Reduce Only</label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Time in Force</label>
                <Select value={timeInForce} onValueChange={setTimeInForce}>
                  <SelectTrigger className="bg-muted border-border text-foreground h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {timeInForceOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={hiddenOrder}
                  onCheckedChange={(checked) => setHiddenOrder(Boolean(checked))}
                  className="border-border"
                />
                <label className="text-xs text-muted-foreground">Hidden Order (Iceberg)</label>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Order Expiry</label>
                <Input
                  value={orderExpiry}
                  onChange={(e) => setOrderExpiry(e.target.value)}
                  className="bg-muted border-border text-foreground h-8"
                  placeholder="e.g., 1h, 1d"
                />
              </div>
            </div>
          </>
        )}

        {/* Execute Button - Opens Confirm Modal */}
        <Button
          onClick={handleOpenConfirmModal}
          className={`w-full py-3 h-12 rounded-lg font-semibold transition-all ${
            side === 'Buy'
              ? 'bg-brand hover:bg-brand/90 text-slate-900 shadow-lg shadow-brand/20 border-brand'
              : 'bg-[#dd5e56] hover:bg-[#dd5e56]/90 text-white shadow-lg shadow-[#dd5e56]/20 border-[#dd5e56]'
          }`}
        >
          <Zap className="w-4 h-4 mr-2" />
          {side} {selectedIndexSymbol.replace('_INDEX', '')}
        </Button>

        {/* Order Preview - 🆕 Now uses calculated liquidation price */}
        <div className="bg-card rounded-lg p-3 space-y-2 text-xs border border-border">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Est. Fill Price:</span>
            <span className="text-card-foreground font-medium">{formatPrice(parseFloat(price) || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Est. Fee (Maker/Taker):</span>
            <span className="text-card-foreground">{formatFee(0.12)} / {formatFee(0.18)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Slippage:</span>
            <span className="text-emerald-400">~0.02%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Liq. Price:</span>
            <span className="text-amber-400 font-medium">
              {formatPrice(calculateLiquidationPrice(parseFloat(price) || currentPrice, leverage, side))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Required Margin:</span>
            <span className="text-card-foreground font-medium">{formatBalance(123.45)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Margin Usage:</span>
            <span className={`font-medium ${getRiskColor(35)}`}>35.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Max Loss/Gain:</span>
            <span className="text-card-foreground">-{formatBalance(500)} / +{formatBalance(1250)}</span>
          </div>

          {takeProfitEnabled && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Take Profit:</span>
              <span className="font-medium">{formatPrice(parseFloat(takeProfit) || 0)}</span>
            </div>
          )}

          {stopLossEnabled && (
            <div className="flex justify-between items-center text-red-400">
              <span>Stop Loss:</span>
              <span className="font-medium">{formatPrice(parseFloat(stopLoss) || 0)}</span>
            </div>
          )}
        </div>

        {/* Hot Keys */}
        <div className="bg-card rounded-lg p-2 text-xs border border-border mt-4">
          <div className="text-muted-foreground mb-1">Hotkeys:</div>
          <div className="grid grid-cols-2 gap-1 text-muted-foreground">
            <div>F1: Quick Buy</div>
            <div>F2: Quick Sell</div>
            <div>F3: Close All</div>
            <div>F4: Cancel All</div>
          </div>
        </div>

        {/* 하단 여백 */}
        <div className="pb-4"></div>
      </div>
      {/* End Scrollable Area */}

      {/* Confirm Trade Modal */}
      <ConfirmTradeModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmFromModal}
        tradeData={
          size && parseFloat(size) > 0
            ? {
                symbol: selectedIndexSymbol,
                type: side.toLowerCase() as "buy" | "sell",
                orderType: orderType.toLowerCase().includes('market') ? 'market' :
                           orderType.toLowerCase().includes('limit') ? 'limit' : 'stop-loss',
                quantity: parseFloat(size),
                price: orderType === 'Market' ? currentPrice : parseFloat(price),
                subtotal: (orderType === 'Market' ? currentPrice : parseFloat(price)) * parseFloat(size),
                fee: ((orderType === 'Market' ? currentPrice : parseFloat(price)) * parseFloat(size)) * 0.001,
                total: ((orderType === 'Market' ? currentPrice : parseFloat(price)) * parseFloat(size)) * 1.001,
              }
            : null
        }
      />
    </div>
    {/* End Container */}
  )
}
