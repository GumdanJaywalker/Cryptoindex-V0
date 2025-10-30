# CURRENCY_SYSTEM_REFACTORING

# Currency System Refactoring Guide

> HyperIndex Phase 0 Beta - Backend-Ready Architecture
Last Updated: 2025-10-26
Author: Development Team
> 

---

## Table of Contents

1. [Executive Summary](about:blank#executive-summary)
2. [Current Implementation Analysis](about:blank#current-implementation-analysis)
3. [Industry Reference Analysis](about:blank#industry-reference-analysis)
4. [Backend-Ready Architecture](about:blank#backend-ready-architecture)
5. [Mock API Layer Design](about:blank#mock-api-layer-design)
6. [Component Integration](about:blank#component-integration)
7. [Detailed Implementation Plan](about:blank#detailed-implementation-plan)
8. [Testing Checklist](about:blank#testing-checklist)
9. [Backend Integration Guide](about:blank#backend-integration-guide)

---

## Executive Summary

### Problem Statement

Current implementation has two critical issues:

**Issue 1: User-Configurable Currency**
- Settings allows 7 currency options (HYPE, USD, USDC, USDT, BTC, HIIN, HIDE)
- Creates trading execution confusion (display ≠ actual price)
- Misaligns with industry standards (no exchange offers this)

**Issue 2: Hardcoded Values**
- Prices, balances, amounts directly hardcoded: `const price = 1.2345`
- No backend integration layer
- Difficult to switch from Mock → Real API

### Proposed Solution

**Phase 0 Architecture:**

```
Components (UI)
    ↓ Call functions (no hardcoded values)
Mock API Layer (lib/api/*)
    ↓ Returns mock data
Phase 1: Replace with real backend calls
```

**Key Principles:**
1. ✅ **No hardcoding** - All data from functions
2. ✅ **HYPE-only display** - Lock currency to HYPE
3. ✅ **Mock API layer** - Easy backend transition
4. ✅ **Type safety** - Consistent interfaces

### Architecture Overview

```tsx
// ❌ BEFORE: Hardcoded + Multi-currencyconst { currency } = useCurrency()  // User selects USD/USDC/etcconst price = 1.2345  // Hardcoded<label>Amount ({currency})</label>// ✅ AFTER: Function-based + HYPE-lockedconst currency = getCurrencyUnit()  // Always returns 'HYPE' (Phase 0)const price = await fetchIndexPrice(indexId)  // Mock API<label>Amount ({currency})</label>
```

---

## Current Implementation Analysis

### 1.1 Current Problems

### Problem 1: Hardcoded Values Everywhere

```tsx
// components/trading/trade-panel.tsx (CURRENT)const [amount, setAmount] = useState(1000)  // ❌ Hardcoded defaultconst currentPrice = index?.currentPrice || 0  // ❌ Direct accessconst estimatedFees = amount * 0.003  // ❌ Hardcoded fee rate// components/portfolio/positions.tsx (CURRENT)const availableBalance = 8492.50  // ❌ Hardcoded balanceconst totalEquity = 10000  // ❌ Hardcoded equity
```

**Impact:**
- Cannot switch to backend API without changing 50+ files
- No separation of concerns
- Testing difficult

### Problem 2: Multi-Currency Confusion

```tsx
// lib/store/currency-store.ts (CURRENT)type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | 'HIIN' | 'HIDE'// User selects USD in SettingssetCurrency('USD')
// Component displaysDisplay: "Price: $1,234 USD"// But execution happens inExecute: "1,000 HYPE at current rate"// Problem: Display ≠ Execution
```

---

### 1.2 Current File Structure

```
lib/
├── types/
│   └── currency.ts              # Type definitions
├── store/
│   └── currency-store.ts        # Zustand store (multi-currency)
├── utils/
│   └── currency.ts              # Format functions
├── hooks/
│   └── useCurrency.ts           # React Hook
└── constants/
    └── fees.ts                  # Fee structure

components/
├── trading/
│   ├── trade-panel.tsx          # ❌ Hardcoded amounts
│   └── positions.tsx            # ❌ Hardcoded balances
└── portfolio/
    └── AccountSummary.tsx       # ❌ Hardcoded equity
```

**Missing:**
- No `lib/api/*` layer
- No mock data functions
- No backend interface definitions

---

## Industry Reference Analysis

### 3.1 Hyperliquid Architecture

**What they do right:**

```tsx
// Hyperliquid approach (simplified)// 1. Single display currency (USD)const DISPLAY_CURRENCY = 'USD'// 2. All data from APIconst balance = await api.getBalance()
const price = await api.getPrice(symbol)
const positions = await api.getPositions()
// 3. No currency conversion in UI<div>{formatUSD(balance)}</div>
```

**Key Lessons:**
- ✅ Single currency (no user selection)
- ✅ All data from API functions
- ✅ UI doesn’t handle business logic

---

### 3.2 pump.fun Architecture

```tsx
// pump.fun approach (Solana-native)// 1. Network-native currency (SOL)const NATIVE_TOKEN = 'SOL'// 2. RPC calls for all dataconst balance = await connection.getBalance(publicKey)
const tokenPrice = await getTokenPrice(mintAddress)
// 3. UI is pure presentation<div>{balance / LAMPORTS_PER_SOL} SOL</div>
```

**Key Lessons:**
- ✅ Network-native token focus
- ✅ Blockchain RPC abstraction
- ✅ Separation of data/presentation

---

## Backend-Ready Architecture

### 4.1 New File Structure

```
lib/
├── api/                         # ⭐ NEW: API Layer
│   ├── currency.ts              # Currency config functions
│   ├── trading.ts               # Trading data functions
│   ├── portfolio.ts             # Portfolio data functions
│   ├── fees.ts                  # Fee calculation functions
│   ├── prices.ts                # Price data functions
│   └── types.ts                 # API response types
├── constants/
│   └── phase.ts                 # ⭐ NEW: Phase config
└── [existing files...]

components/ (no changes to structure)
```

---

### 4.2 Architecture Layers

```
┌──────────────────────────────────────────────────────────┐
│  Components (UI Layer)                                   │
│  - trade-panel.tsx                                       │
│  - positions.tsx                                         │
│  - AccountSummary.tsx                                    │
└────────────────────┬─────────────────────────────────────┘
                     │ Calls API functions
                     ↓
┌──────────────────────────────────────────────────────────┐
│  API Layer (lib/api/*)                                   │
│  - getCurrencyUnit()          → 'HYPE'                   │
│  - fetchUserBalance()         → 8492.50                  │
│  - fetchIndexPrice(id)        → 1.2345                   │
│  - calculateTradingFee(amt)   → 0.003                    │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
┌───────────────────┐    ┌────────────────────┐
│ Phase 0: Mock     │    │ Phase 1+: Backend  │
│ Returns hardcoded │    │ API calls          │
│ values            │    │ Real data          │
└───────────────────┘    └────────────────────┘
```

---

### 4.3 Phase Configuration

```tsx
// lib/constants/phase.tsexport enum Phase {
  PHASE_0 = 'PHASE_0', // Beta: Mock data, HYPE-only  PHASE_1 = 'PHASE_1', // TGE: Real backend, $HIIN/$HIDE  PHASE_2 = 'PHASE_2', // Full: Multi-currency support}
export const CURRENT_PHASE = Phase.PHASE_0export const PHASE_CONFIG = {
  [Phase.PHASE_0]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE'],    allowCurrencySwitching: false,    useBackendAPI: false,  },  [Phase.PHASE_1]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE', 'HIIN', 'HIDE'],    allowCurrencySwitching: false,    useBackendAPI: true,  },  [Phase.PHASE_2]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE', 'HIIN', 'HIDE'],    allowCurrencySwitching: true,    useBackendAPI: true,  },}
export const getCurrentConfig = () => PHASE_CONFIG[CURRENT_PHASE]
```

---

## Mock API Layer Design

### 5.1 Currency API

```tsx
// lib/api/currency.tsimport { CURRENT_PHASE, getCurrentConfig } from '@/lib/constants/phase'import type { Currency } from '@/lib/types/currency'/** * Get the display currency unit * Phase 0: Returns 'HYPE' (mock) * Phase 1+: Fetches from backend */export const getCurrencyUnit = async (): Promise<Currency> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return HYPE    return 'HYPE'  }
  // Phase 1+: Backend API  const response = await fetch('/api/currency/config')
  const data = await response.json()
  return data.displayCurrency}
/** * Get exchange rates * Phase 0: Returns mock rates * Phase 1+: Fetches real-time rates */export const fetchExchangeRates = async () => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock rates    return {
      HYPE_USD: 1.25,      HYPE_USDC: 1.24,      HYPE_USDT: 1.24,      HYPE_BTC: 0.000021,      HYPE_HIIN: 1.0,      HYPE_HIDE: 1.0,    }
  }
  // Phase 1+: Real API  const response = await fetch('/api/currency/rates')
  return response.json()
}
/** * Check if currency switching is allowed */export const isCurrencySwitchingAllowed = (): boolean => {
  return getCurrentConfig().allowCurrencySwitching}
```

---

### 5.2 Trading API

```tsx
// lib/api/trading.tsimport { CURRENT_PHASE } from '@/lib/constants/phase'/** * Fetch user's available balance * Phase 0: Returns mock balance * Phase 1+: Fetches from backend */export const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return test balance    return 8492.50  }
  // Phase 1+: Backend API  const response = await fetch('/api/user/balance')
  const data = await response.json()
  return data.balance}
/** * Fetch current index price * Phase 0: Uses mock index data * Phase 1+: Real-time price from backend */export const fetchIndexPrice = async (indexId: string): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Find in mock data    const { allMockIndexes } = await import('@/lib/data/mock-indexes')
    const index = allMockIndexes.find(idx => idx.id === indexId)
    return index?.currentPrice || 0  }
  // Phase 1+: Backend API  const response = await fetch(`/api/indexes/${indexId}/price`)
  const data = await response.json()
  return data.price}
/** * Execute a trade * Phase 0: Simulates trade execution * Phase 1+: Sends to backend */export interface TradeParams {
  indexId: string  type: 'buy' | 'sell'  amount: number  leverage: number  slippage: number}
export interface TradeResult {
  success: boolean  tradeId?: string  executedPrice?: number  executedAmount?: number  fee?: number  error?: string}
export const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Simulate successful trade    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay    return {
      success: true,      tradeId: `mock-${Date.now()}`,      executedPrice: await fetchIndexPrice(params.indexId),      executedAmount: params.amount,      fee: params.amount * 0.003, // 0.3% fee    }
  }
  // Phase 1+: Backend API  const response = await fetch('/api/trades/execute', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify(params),  })
  return response.json()
}
```

---

### 5.3 Portfolio API

```tsx
// lib/api/portfolio.tsimport { CURRENT_PHASE } from '@/lib/constants/phase'import type { Trade } from '@/lib/types/index-trading'/** * Fetch user's active positions * Phase 0: Returns empty array (no mock positions) * Phase 1+: Fetches from backend */export const fetchActivePositions = async (): Promise<Trade[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return empty or demo positions    return []
  }
  // Phase 1+: Backend API  const response = await fetch('/api/user/positions')
  const data = await response.json()
  return data.positions}
/** * Fetch total account equity * Phase 0: Calculates from mock balance * Phase 1+: Fetches from backend */export const fetchAccountEquity = async (): Promise<{
  totalEquity: number  availableBalance: number  usedMargin: number  unrealizedPnL: number}> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return demo values    const balance = await fetchUserBalance()
    return {
      totalEquity: balance,      availableBalance: balance,      usedMargin: 0,      unrealizedPnL: 0,    }
  }
  // Phase 1+: Backend API  const response = await fetch('/api/user/equity')
  return response.json()
}
// Import from trading.ts to avoid circular dependencyimport { fetchUserBalance } from './trading'
```

---

### 5.4 Fee API

```tsx
// lib/api/fees.tsimport { CURRENT_PHASE } from '@/lib/constants/phase'import { FEES, FeeType } from '@/lib/constants/fees'import type { Currency } from '@/lib/types/currency'/** * Calculate trading fee * Phase 0: Uses local constants * Phase 1+: May fetch dynamic fee rates from backend */export const calculateTradingFee = async (
  amount: number,  paymentToken: Currency = 'HYPE'): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use hardcoded fee rate    const baseFee = amount * FEES.HIDE.TRADING_FEE    const nativeToken = 'HIDE'    const discount = paymentToken === nativeToken ? FEES.HIDE.NATIVE_PAYMENT_DISCOUNT : 0    return baseFee * (1 - discount)
  }
  // Phase 1+: Backend API (may have dynamic rates)  const response = await fetch('/api/fees/calculate', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({ amount, paymentToken, feeType: 'TRADING' }),  })
  const data = await response.json()
  return data.fee}
/** * Calculate launch fee */export const calculateLaunchFee = async (
  paymentToken: Currency = 'HYPE'): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use hardcoded fee    const baseFee = FEES.HIIN.LAUNCH_FEE    const nativeToken = 'HIIN'    const discount = paymentToken === nativeToken ? FEES.HIIN.NATIVE_PAYMENT_DISCOUNT : 0    return baseFee * (1 - discount)
  }
  // Phase 1+: Backend API  const response = await fetch('/api/fees/launch', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({ paymentToken }),  })
  const data = await response.json()
  return data.fee}
/** * Get available fee payment tokens * Phase 0: Returns ['HYPE'] * Phase 1+: Returns ['HYPE', 'HIIN', 'HIDE'] */export const getAvailableFeeTokens = async (
  feeType: FeeType
): Promise<Currency[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return ['HYPE']
  }
  // Phase 1+: Backend API  const response = await fetch(`/api/fees/available-tokens?type=${feeType}`)
  const data = await response.json()
  return data.tokens}
```

---

### 5.5 Price API

```tsx
// lib/api/prices.tsimport { CURRENT_PHASE } from '@/lib/constants/phase'/** * Fetch historical price data for charts * Phase 0: Returns mock OHLCV data * Phase 1+: Fetches from backend */export interface OHLCV {
  timestamp: number  open: number  high: number  low: number  close: number  volume: number}
export const fetchPriceHistory = async (
  indexId: string,  timeframe: '1m' | '5m' | '1h' | '1d',  limit: number = 100): Promise<OHLCV[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Generate sample data    const now = Date.now()
    const interval = timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '1h' ? 3600000 : 86400000    return Array.from({ length: limit }, (_, i) => ({
      timestamp: now - (limit - i) * interval,      open: 1.2 + Math.random() * 0.1,      high: 1.25 + Math.random() * 0.1,      low: 1.15 + Math.random() * 0.1,      close: 1.2 + Math.random() * 0.1,      volume: 1000000 + Math.random() * 500000,    }))
  }
  // Phase 1+: Backend API  const response = await fetch(
    `/api/prices/history?indexId=${indexId}&timeframe=${timeframe}&limit=${limit}`  )
  return response.json()
}
/** * Subscribe to real-time price updates * Phase 0: Returns mock WebSocket simulation * Phase 1+: Real WebSocket connection */export const subscribeToPriceUpdates = (
  indexId: string,  callback: (price: number) => void): (() => void) => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Simulate price updates every 2 seconds    const interval = setInterval(() => {
      const mockPrice = 1.2 + Math.random() * 0.2      callback(mockPrice)
    }, 2000)
    // Return unsubscribe function    return () => clearInterval(interval)
  }
  // Phase 1+: WebSocket connection  const ws = new WebSocket(`wss://api.hyperindex.xyz/prices/${indexId}`)
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data.price)
  }
  // Return unsubscribe function  return () => ws.close()
}
```

---

## Component Integration

### 6.1 TradePanel Integration

**Before (Hardcoded):**

```tsx
// components/trading/trade-panel.tsx (OLD)export function TradePanel({ index, isOpen, onClose }: TradePanelProps) {
  const { currency } = useCurrency()  // ❌ User-selected currency  const [amount, setAmount] = useState(1000)  // ❌ Hardcoded default  // ❌ Direct access to index data  const currentPrice = index?.currentPrice || 0  // ❌ Hardcoded fee calculation  const estimatedFees = amount * 0.003  // ❌ Hardcoded balance  const availableBalance = 8492.50  return (
    <div>      <label>Amount ({currency})</label>  {/* ❌ Variable currency */}
      <input value={amount} onChange={e => setAmount(Number(e.target.value))} />      <div>Fee: {estimatedFees} {currency}</div>      <div>Balance: {availableBalance} {currency}</div>    </div>  )
}
```

**After (API Functions):**

```tsx
// components/trading/trade-panel.tsx (NEW)import { getCurrencyUnit } from '@/lib/api/currency'import { fetchUserBalance, fetchIndexPrice, executeTrade } from '@/lib/api/trading'import { calculateTradingFee } from '@/lib/api/fees'import { useCurrency } from '@/lib/hooks/useCurrency'export function TradePanel({ index, isOpen, onClose }: TradePanelProps) {
  // ✅ Fetch currency unit from API  const [currencyUnit, setCurrencyUnit] = useState<string>('HYPE')
  const [amount, setAmount] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [estimatedFees, setEstimatedFees] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(0)
  const { formatPrice, formatBalance, formatFee } = useCurrency()
  // ✅ Load data on mount  useEffect(() => {
    const loadData = async () => {
      if (!index) return      // Fetch all data from API      const [currency, balance, price] = await Promise.all([
        getCurrencyUnit(),        fetchUserBalance(),        fetchIndexPrice(index.id),      ])
      setCurrencyUnit(currency)
      setAvailableBalance(balance)
      setCurrentPrice(price)
    }
    loadData()
  }, [index])
  // ✅ Calculate fees when amount changes  useEffect(() => {
    const calculateFees = async () => {
      if (amount === 0) {
        setEstimatedFees(0)
        return      }
      const fee = await calculateTradingFee(amount, 'HYPE')
      setEstimatedFees(fee)
    }
    calculateFees()
  }, [amount])
  // ✅ Execute trade via API  const handleTrade = async () => {
    if (!index) return    const result = await executeTrade({
      indexId: index.id,      type: 'buy',      amount,      leverage: 1,      slippage: 0.5,    })
    if (result.success) {
      onClose()
      // Show success notification    } else {
      console.error('Trade failed:', result.error)
    }
  }
  return (
    <div>      {/* ✅ Use fetched currency unit */}
      <label>Amount ({currencyUnit})</label>      <input
        type="number"        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />      {/* ✅ Use format functions */}
      <div>Current Price: {formatPrice(currentPrice)}</div>      <div>Fee: {formatFee(estimatedFees)}</div>      <div>Balance: {formatBalance(availableBalance)}</div>      <button onClick={handleTrade}>        Buy {index?.symbol}
      </button>    </div>  )
}
```

---

### 6.2 Positions Integration

**Before (Hardcoded):**

```tsx
// components/portfolio/positions.tsx (OLD)export function Positions() {
  // ❌ Hardcoded mock trades  const activeTrades = [
    {
      id: 'trade-1',      indexId: 'meme-blue-chips',      type: 'long',      amount: 1000,      entryPrice: 1.2345,      leverage: 10,      timestamp: Date.now(),    },  ]
  return (
    <div>      {activeTrades.map(trade => (
        <div key={trade.id}>          <div>Size: {trade.amount} HYPE</div>  {/* ❌ Hardcoded HYPE */}
          <div>Entry: {trade.entryPrice} HYPE</div>        </div>      ))}
    </div>  )
}
```

**After (API Functions):**

```tsx
// components/portfolio/positions.tsx (NEW)import { fetchActivePositions } from '@/lib/api/portfolio'import { fetchIndexPrice } from '@/lib/api/trading'import { getCurrencyUnit } from '@/lib/api/currency'import { useCurrency } from '@/lib/hooks/useCurrency'export function Positions() {
  const [currencyUnit, setCurrencyUnit] = useState<string>('HYPE')
  const [activeTrades, setActiveTrades] = useState<Trade[]>([])
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({})
  const { formatPrice, formatBalance } = useCurrency()
  // ✅ Load positions from API  useEffect(() => {
    const loadPositions = async () => {
      const [currency, positions] = await Promise.all([
        getCurrencyUnit(),        fetchActivePositions(),      ])
      setCurrencyUnit(currency)
      setActiveTrades(positions)
      // Fetch current prices for each position      const prices: Record<string, number> = {}
      for (const trade of positions) {
        prices[trade.indexId] = await fetchIndexPrice(trade.indexId)
      }
      setCurrentPrices(prices)
    }
    loadPositions()
  }, [])
  // ✅ Calculate PnL using fetched prices  const calculatePnL = (trade: Trade) => {
    const currentPrice = currentPrices[trade.indexId] || trade.entryPrice    return trade.type === 'long'      ? (currentPrice - trade.entryPrice) * trade.amount * trade.leverage      : (trade.entryPrice - currentPrice) * trade.amount * trade.leverage  }
  return (
    <div>      {activeTrades.map(trade => (
        <div key={trade.id}>          {/* ✅ Use format functions */}
          <div>Size: {formatBalance(trade.amount)}</div>          <div>Entry: {formatPrice(trade.entryPrice)}</div>          <div>Current: {formatPrice(currentPrices[trade.indexId] || 0)}</div>          <div>PnL: {formatBalance(calculatePnL(trade))}</div>        </div>      ))}
    </div>  )
}
```

---

### 6.3 IndexCard Integration

**Before (Hardcoded):**

```tsx
// components/discover/index-detail-card.tsx (OLD)export function IndexDetailCard({ index }: { index: MemeIndex }) {
  const { formatPrice, formatVolume } = useCurrency()
  return (
    <div>      {/* ❌ Direct access to index properties */}
      <div>Price: {formatPrice(index.currentPrice)}</div>      <div>Volume: {formatVolume(index.volume24h)}</div>      <div>TVL: {formatVolume(index.tvl)}</div>    </div>  )
}
```

**After (API Functions):**

```tsx
// components/discover/index-detail-card.tsx (NEW)import { fetchIndexPrice } from '@/lib/api/trading'import { fetchExchangeRates } from '@/lib/api/currency'import { useCurrency } from '@/lib/hooks/useCurrency'export function IndexDetailCard({ index }: { index: MemeIndex }) {
  const [currentPrice, setCurrentPrice] = useState(index.currentPrice)
  const [usdPrice, setUsdPrice] = useState<number | null>(null)
  const { formatPrice, formatVolume } = useCurrency()
  // ✅ Fetch real-time price  useEffect(() => {
    const loadPrice = async () => {
      const price = await fetchIndexPrice(index.id)
      setCurrentPrice(price)
      // Optional: Fetch USD reference      const rates = await fetchExchangeRates()
      setUsdPrice(price * rates.HYPE_USD)
    }
    loadPrice()
    // Subscribe to price updates    const unsubscribe = subscribeToPriceUpdates(index.id, (price) => {
      setCurrentPrice(price)
    })
    return () => unsubscribe()
  }, [index.id])
  return (
    <div>      {/* ✅ Use fetched price */}
      <div className="text-2xl font-bold">        {formatPrice(currentPrice)}
      </div>      {/* ✅ Optional USD reference */}
      {usdPrice && (
        <div className="text-xs text-slate-400">          ≈ ${usdPrice.toFixed(2)} USD
        </div>      )}
      {/* ✅ Mock data still accessible (Phase 0) */}
      <div>Volume: {formatVolume(index.volume24h)}</div>      <div>TVL: {formatVolume(index.tvl)}</div>    </div>  )
}
```

---

## Detailed Implementation Plan

### 7.1 Step 1: Create Phase Configuration

**New File:** `lib/constants/phase.ts`

```tsx
export enum Phase {
  PHASE_0 = 'PHASE_0',  PHASE_1 = 'PHASE_1',  PHASE_2 = 'PHASE_2',}
export const CURRENT_PHASE = Phase.PHASE_0export const PHASE_CONFIG = {
  [Phase.PHASE_0]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE'],    allowCurrencySwitching: false,    useBackendAPI: false,  },  [Phase.PHASE_1]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE', 'HIIN', 'HIDE'],    allowCurrencySwitching: false,    useBackendAPI: true,  },  [Phase.PHASE_2]: {
    displayCurrency: 'HYPE',    feeCurrencies: ['HYPE', 'HIIN', 'HIDE'],    allowCurrencySwitching: true,    useBackendAPI: true,  },}
export const getCurrentConfig = () => PHASE_CONFIG[CURRENT_PHASE]
```

**Estimated Time:** 15 minutes

---

### 7.2 Step 2: Create Mock API Layer

### A. Currency API

**New File:** `lib/api/currency.ts`

```tsx
import { CURRENT_PHASE, getCurrentConfig } from '@/lib/constants/phase'import type { Currency, ExchangeRates } from '@/lib/types/currency'export const getCurrencyUnit = async (): Promise<Currency> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 'HYPE'  }
  const response = await fetch('/api/currency/config')
  const data = await response.json()
  return data.displayCurrency}
export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return {
      HYPE_USD: 1.25,      HYPE_USDC: 1.24,      HYPE_USDT: 1.24,      HYPE_BTC: 0.000021,      HYPE_HIIN: 1.0,      HYPE_HIDE: 1.0,    }
  }
  const response = await fetch('/api/currency/rates')
  return response.json()
}
export const isCurrencySwitchingAllowed = (): boolean => {
  return getCurrentConfig().allowCurrencySwitching}
```

**Estimated Time:** 30 minutes

---

### B. Trading API

**New File:** `lib/api/trading.ts`

```tsx
import { CURRENT_PHASE } from '@/lib/constants/phase'export const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 8492.50  }
  const response = await fetch('/api/user/balance')
  const data = await response.json()
  return data.balance}
export const fetchIndexPrice = async (indexId: string): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const { allMockIndexes } = await import('@/lib/data/mock-indexes')
    const index = allMockIndexes.find(idx => idx.id === indexId)
    return index?.currentPrice || 0  }
  const response = await fetch(`/api/indexes/${indexId}/price`)
  const data = await response.json()
  return data.price}
export interface TradeParams {
  indexId: string  type: 'buy' | 'sell'  amount: number  leverage: number  slippage: number}
export interface TradeResult {
  success: boolean  tradeId?: string  executedPrice?: number  executedAmount?: number  fee?: number  error?: string}
export const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,      tradeId: `mock-${Date.now()}`,      executedPrice: await fetchIndexPrice(params.indexId),      executedAmount: params.amount,      fee: params.amount * 0.003,    }
  }
  const response = await fetch('/api/trades/execute', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify(params),  })
  return response.json()
}
```

**Estimated Time:** 45 minutes

---

### C. Portfolio API

**New File:** `lib/api/portfolio.ts`

```tsx
import { CURRENT_PHASE } from '@/lib/constants/phase'import type { Trade } from '@/lib/types/index-trading'import { fetchUserBalance } from './trading'export const fetchActivePositions = async (): Promise<Trade[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return []
  }
  const response = await fetch('/api/user/positions')
  const data = await response.json()
  return data.positions}
export const fetchAccountEquity = async () => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const balance = await fetchUserBalance()
    return {
      totalEquity: balance,      availableBalance: balance,      usedMargin: 0,      unrealizedPnL: 0,    }
  }
  const response = await fetch('/api/user/equity')
  return response.json()
}
```

**Estimated Time:** 30 minutes

---

### D. Fee API

**New File:** `lib/api/fees.ts`

```tsx
import { CURRENT_PHASE } from '@/lib/constants/phase'import { FEES, FeeType } from '@/lib/constants/fees'import type { Currency } from '@/lib/types/currency'export const calculateTradingFee = async (
  amount: number,  paymentToken: Currency = 'HYPE'): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const baseFee = amount * FEES.HIDE.TRADING_FEE    return baseFee
  }
  const response = await fetch('/api/fees/calculate', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({ amount, paymentToken, feeType: 'TRADING' }),  })
  const data = await response.json()
  return data.fee}
export const calculateLaunchFee = async (
  paymentToken: Currency = 'HYPE'): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return FEES.HIIN.LAUNCH_FEE  }
  const response = await fetch('/api/fees/launch', {
    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({ paymentToken }),  })
  const data = await response.json()
  return data.fee}
export const getAvailableFeeTokens = async (
  feeType: FeeType
): Promise<Currency[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return ['HYPE']
  }
  const response = await fetch(`/api/fees/available-tokens?type=${feeType}`)
  const data = await response.json()
  return data.tokens}
```

**Estimated Time:** 30 minutes

---

### E. Price API

**New File:** `lib/api/prices.ts`

```tsx
import { CURRENT_PHASE } from '@/lib/constants/phase'export interface OHLCV {
  timestamp: number  open: number  high: number  low: number  close: number  volume: number}
export const fetchPriceHistory = async (
  indexId: string,  timeframe: '1m' | '5m' | '1h' | '1d',  limit: number = 100): Promise<OHLCV[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const now = Date.now()
    const interval = timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '1h' ? 3600000 : 86400000    return Array.from({ length: limit }, (_, i) => ({
      timestamp: now - (limit - i) * interval,      open: 1.2 + Math.random() * 0.1,      high: 1.25 + Math.random() * 0.1,      low: 1.15 + Math.random() * 0.1,      close: 1.2 + Math.random() * 0.1,      volume: 1000000 + Math.random() * 500000,    }))
  }
  const response = await fetch(
    `/api/prices/history?indexId=${indexId}&timeframe=${timeframe}&limit=${limit}`  )
  return response.json()
}
export const subscribeToPriceUpdates = (
  indexId: string,  callback: (price: number) => void): (() => void) => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const interval = setInterval(() => {
      const mockPrice = 1.2 + Math.random() * 0.2      callback(mockPrice)
    }, 2000)
    return () => clearInterval(interval)
  }
  const ws = new WebSocket(`wss://api.hyperindex.xyz/prices/${indexId}`)
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data.price)
  }
  return () => ws.close()
}
```

**Estimated Time:** 30 minutes

---

### 7.3 Step 3: Remove Settings Currency Selector

**File:** `components/settings/PreferencesSection.tsx`

```tsx
// Remove entire currency selector section (L42-55)// Keep only Time Format selectorexport function PreferencesSection() {
  const { addToast } = useToast()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  // ❌ REMOVE: const [currency, setCurrency] = useState<Currency>(...)  const [timefmt, setTimefmt] = useState('24h')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const saved = SettingsStorage.getPreferences()
    if (saved) {
      setTheme(saved.theme)
      setLang(saved.lang)
      // ❌ REMOVE: setCurrency(saved.currency)      setTimefmt(saved.timefmt)
    }
  }, [])
  return (
    <div className="space-y-4">      <h2 className="text-lg font-semibold">Preferences</h2>      <Card className="bg-slate-900/50 border-slate-800">        <CardContent className="p-4 space-y-4">          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {/* ❌ REMOVE: Currency selector */}
            {/* ✅ KEEP: Time Format */}
            <div>              <div className="text-xs text-slate-400 mb-1">Time Format</div>              <Select value={timefmt} onValueChange={setTimefmt}>                <SelectTrigger className="bg-slate-900 border-slate-700">                  <SelectValue placeholder="Time Format" />                </SelectTrigger>                <SelectContent>                  <SelectItem value="24h">24‑hour</SelectItem>                  <SelectItem value="12h">12‑hour</SelectItem>                </SelectContent>              </Select>            </div>          </div>          <div className="flex justify-end">            <Button
              className="bg-brand text-black hover:bg-brand-hover"              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true)
                  // ❌ REMOVE: currency from save                  await savePreferences({ theme, lang, timefmt })
                  SettingsStorage.savePreferences({ theme, lang, timefmt })
                  addToast(createSuccessToast('Saved', 'Preferences updated'))
                } catch (e: any) {
                  addToast(createErrorToast('Failed', e?.message || 'Please try again'))
                } finally {
                  setSaving(false)
                }
              }}
            >              {saving ? 'Saving…' : 'Save'}
            </Button>          </div>        </CardContent>      </Card>    </div>  )
}
```

**Estimated Time:** 20 minutes

---

### 7.4 Step 4: Update Components to Use API Functions

### Priority Components (High Impact)

**File Count:** ~15 high-priority files

| Component |
| --- |
| TradePanel.tsx |
| Positions.tsx |
| AccountSummary.tsx |
| IndexDetailCard.tsx |
| CarouselIndexCard.tsx |
| TradingPanel.tsx |
| ConfirmLaunchModal.tsx |
| AccountPanel.tsx |
| EarningsSummary.tsx |
| CreatorEarnings.tsx |
| **Total** |

---

### 7.5 Step 5: Update useCurrency Hook

**File:** `lib/hooks/useCurrency.ts`

```tsx
import { useCurrencyStore } from '@/lib/store/currency-store'import { getCurrencyUnit } from '@/lib/api/currency'import { useState, useEffect } from 'react'import type { Currency } from '@/lib/types/currency'import {
  formatCurrency,  formatPrice,  formatPercentage,  formatFee,  formatGas,  formatVolume,  formatBalance,  formatPnL,  convertCurrency,} from '@/lib/utils/currency'export function useCurrency() {
  const { exchangeRates, getExchangeRate } = useCurrencyStore()
  const [currency, setCurrency] = useState<Currency>('HYPE')
  // Fetch currency unit on mount  useEffect(() => {
    getCurrencyUnit().then(setCurrency)
  }, [])
  return {
    // Always HYPE in Phase 0    currency,    // Exchange rates for USD reference    exchangeRates,    getExchangeRate,    // Formatting functions (locked to HYPE)    formatPrice: (amount: number) => formatPrice(amount, 'HYPE', exchangeRates),    formatBalance: (amount: number) => formatBalance(amount, 'HYPE', exchangeRates),    formatVolume: (amount: number) => formatVolume(amount, 'HYPE', exchangeRates),    formatPnL: (amount: number) => formatPnL(amount, 'HYPE', exchangeRates),    formatCurrency: (amount: number, options?: any) => formatCurrency(amount, 'HYPE', options),    // Fees always in HYPE    formatFee,    formatGas,    // Utility    formatPercentage,    convertCurrency: (amount: number, from: Currency, to: Currency) =>      convertCurrency(amount, from, to, exchangeRates),  }
}
```

**Estimated Time:** 30 minutes

---

### 7.6 Step 6: Update Documentation

**Files to Update:**
- `CLAUDE.md` - Architecture section
- `BACKEND_INTEGRATION_CHECKLIST.md` - API endpoints
- `HANDOVER.md` - Latest session

**Estimated Time:** 1 hour

---

## Testing Checklist

### 8.1 Mock API Layer Testing

### Currency API

- [ ]  `getCurrencyUnit()` returns ‘HYPE’ in Phase 0
- [ ]  `fetchExchangeRates()` returns mock rates
- [ ]  `isCurrencySwitchingAllowed()` returns false

### Trading API

- [ ]  `fetchUserBalance()` returns 8492.50
- [ ]  `fetchIndexPrice(id)` returns mock price from allMockIndexes
- [ ]  `executeTrade()` simulates 1s delay and returns success

### Portfolio API

- [ ]  `fetchActivePositions()` returns empty array
- [ ]  `fetchAccountEquity()` returns mock equity data

### Fee API

- [ ]  `calculateTradingFee()` uses FEES.HIDE.TRADING_FEE
- [ ]  `calculateLaunchFee()` uses FEES.HIIN.LAUNCH_FEE
- [ ]  `getAvailableFeeTokens()` returns [‘HYPE’]

### Price API

- [ ]  `fetchPriceHistory()` generates mock OHLCV data
- [ ]  `subscribeToPriceUpdates()` simulates updates every 2s
- [ ]  Unsubscribe function clears interval

---

### 8.2 Component Integration Testing

### TradePanel

- [ ]  Currency label shows “HYPE”
- [ ]  Balance loads from `fetchUserBalance()`
- [ ]  Price loads from `fetchIndexPrice()`
- [ ]  Fee calculates via `calculateTradingFee()`
- [ ]  Trade executes via `executeTrade()`

### Positions

- [ ]  Positions load from `fetchActivePositions()`
- [ ]  Current prices fetch via `fetchIndexPrice()`
- [ ]  PnL calculates correctly
- [ ]  Format functions show “X HYPE”

### Settings

- [ ]  Currency selector removed
- [ ]  Only Time Format remains
- [ ]  Save doesn’t include currency

---

### 8.3 Phase Switching Test

**Test Scenario:** Change CURRENT_PHASE to PHASE_1

```tsx
// lib/constants/phase.tsexport const CURRENT_PHASE = Phase.PHASE_1
```

**Expected Behavior:**
- [ ] API functions attempt backend calls
- [ ] Console shows fetch errors (no backend yet)
- [ ] UI still renders (graceful degradation)

**Revert:**

```tsx
export const CURRENT_PHASE = Phase.PHASE_0
```

---

## Backend Integration Guide

### 9.1 Phase 1 Transition Checklist

**Step 1: Update Phase Config**

```tsx
// lib/constants/phase.tsexport const CURRENT_PHASE = Phase.PHASE_1
```

**Step 2: Implement Backend APIs**

No component changes needed! Just implement these endpoints:

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/currency/config` | GET | Returns display currency |
| `/api/currency/rates` | GET | Returns exchange rates |
| `/api/user/balance` | GET | Returns user balance |
| `/api/indexes/:id/price` | GET | Returns index price |
| `/api/trades/execute` | POST | Executes trade |
| `/api/user/positions` | GET | Returns active positions |
| `/api/user/equity` | GET | Returns account equity |
| `/api/fees/calculate` | POST | Calculates fee |
| `/api/fees/launch` | POST | Returns launch fee |
| `/api/fees/available-tokens` | GET | Returns fee token options |
| `/api/prices/history` | GET | Returns OHLCV data |

**Step 3: Test**

```bash
# Phase 1 should now use real backendpnpm run dev
# Check browser console# Should see fetch calls to backend
```

---

### 9.2 API Response Formats

### GET /api/user/balance

```json
{  "balance": 8492.50,  "currency": "HYPE"}
```

### GET /api/indexes/:id/price

```json
{  "indexId": "meme-blue-chips",  "price": 1.2345,  "timestamp": 1698765432000}
```

### POST /api/trades/execute

**Request:**

```json
{  "indexId": "meme-blue-chips",  "type": "buy",  "amount": 1000,  "leverage": 10,  "slippage": 0.5}
```

**Response:**

```json
{  "success": true,  "tradeId": "trade-abc123",  "executedPrice": 1.2345,  "executedAmount": 1000,  "fee": 3.0}
```

---

### 9.3 Error Handling

**All API functions should handle errors gracefully:**

```tsx
// Example: fetchUserBalance with error handlingexport const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 8492.50  }
  try {
    const response = await fetch('/api/user/balance')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data.balance  } catch (error) {
    console.error('Failed to fetch user balance:', error)
    // Fallback to mock data    return 8492.50  }
}
```

---

## Summary

### What We Accomplished

**1. Removed Hardcoding**
- ❌ No more `const price = 1.2345`
- ✅ All data from API functions

**2. Backend-Ready Architecture**
- ✅ Mock API layer (Phase 0)
- ✅ Easy transition to real backend (Phase 1)
- ✅ No component changes needed

**3. HYPE-Only Display**
- ✅ Settings currency selector removed
- ✅ All displays locked to HYPE
- ✅ Aligns with industry standards

**4. Type Safety**
- ✅ Consistent API interfaces
- ✅ TypeScript throughout
- ✅ Easy to maintain

### Timeline Estimate

| Task | Time |
| --- | --- |
| Create Phase Config | 15 min |
| Create Mock API Layer (5 files) | 3 hours |
| Remove Settings Selector | 20 min |
| Update Components (15 files) | 5.5 hours |
| Update useCurrency Hook | 30 min |
| Update Documentation | 1 hour |
| Testing | 2 hours |
| **Total** | **~13 hours** |

### Success Metrics

**Technical:**
- ✅ 0 hardcoded values in components
- ✅ All data from API functions
- ✅ Backend integration in <1 day

**User Experience:**
- ✅ Consistent HYPE display
- ✅ No currency confusion
- ✅ Industry-standard UX

**Maintenance:**
- ✅ Single source of truth (API layer)
- ✅ Easy to test (mock functions)
- ✅ Type-safe interfaces

---

*End of Document*