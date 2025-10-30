# Currency System Refactoring Guide

> **HyperIndex Phase 0 Beta - Backend-Ready Architecture**
> Last Updated: 2025-10-26
> Author: Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Implementation Analysis](#current-implementation-analysis)
3. [Industry Reference Analysis](#industry-reference-analysis)
4. [Backend-Ready Architecture](#backend-ready-architecture)
5. [Mock API Layer Design](#mock-api-layer-design)
6. [Component Integration](#component-integration)
7. [Detailed Implementation Plan](#detailed-implementation-plan)
8. [Testing Checklist](#testing-checklist)
9. [Backend Integration Guide](#backend-integration-guide)

---

## Executive Summary

### Problem Statement

Current implementation has two critical issues:

**Issue 1: User-Configurable Currency**
- Settings previously allowed 7 currency options (HYPE, USD, USDC, USDT, BTC, etc.)
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

```typescript
// ❌ BEFORE: Hardcoded + Multi-currency
const { currency } = useCurrency()  // User selects USD/USDC/etc
const price = 1.2345  // Hardcoded
<label>Amount ({currency})</label>

// ✅ AFTER: Function-based + HYPE-locked
const currency = getCurrencyUnit()  // Always returns 'HYPE' (Phase 0)
const price = await fetchIndexPrice(indexId)  // Mock API
<label>Amount ({currency})</label>
```

---

## Current Implementation Analysis

### 1.1 Current Problems

#### Problem 1: Hardcoded Values Everywhere

```typescript
// components/trading/trade-panel.tsx (CURRENT)
const [amount, setAmount] = useState(1000)  // ❌ Hardcoded default
const currentPrice = index?.currentPrice || 0  // ❌ Direct access
const estimatedFees = amount * 0.003  // ❌ Hardcoded fee rate

// components/portfolio/positions.tsx (CURRENT)
const availableBalance = 8492.50  // ❌ Hardcoded balance
const totalEquity = 10000  // ❌ Hardcoded equity
```

**Impact:**
- Cannot switch to backend API without changing 50+ files
- No separation of concerns
- Testing difficult

#### Problem 2: Multi-Currency Confusion

```typescript
// lib/store/currency-store.ts (CURRENT - DEPRECATED)
type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | ...

// User selects USD in Settings
setCurrency('USD')

// Component displays
Display: "Price: $1,234 USD"

// But execution happens in
Execute: "1,000 HYPE at current rate"

// Problem: Display ≠ Execution
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

```typescript
// Hyperliquid approach (simplified)

// 1. Single display currency (USD)
const DISPLAY_CURRENCY = 'USD'

// 2. All data from API
const balance = await api.getBalance()
const price = await api.getPrice(symbol)
const positions = await api.getPositions()

// 3. No currency conversion in UI
<div>{formatUSD(balance)}</div>
```

**Key Lessons:**
- ✅ Single currency (no user selection)
- ✅ All data from API functions
- ✅ UI doesn't handle business logic

---

### 3.2 pump.fun Architecture

```typescript
// pump.fun approach (Solana-native)

// 1. Network-native currency (SOL)
const NATIVE_TOKEN = 'SOL'

// 2. RPC calls for all data
const balance = await connection.getBalance(publicKey)
const tokenPrice = await getTokenPrice(mintAddress)

// 3. UI is pure presentation
<div>{balance / LAMPORTS_PER_SOL} SOL</div>
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

```typescript
// lib/constants/phase.ts

export enum Phase {
  PHASE_0 = 'PHASE_0', // Beta: Mock data, HYPE-only
  PHASE_1 = 'PHASE_1', // TGE: Real backend, Platform tokens
  PHASE_2 = 'PHASE_2', // Full: Multi-currency support
}

export const CURRENT_PHASE = Phase.PHASE_0

export const PHASE_CONFIG = {
  [Phase.PHASE_0]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],
    allowCurrencySwitching: false,
    useBackendAPI: false,
  },
  [Phase.PHASE_1]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],  // May expand after platform token launch
    allowCurrencySwitching: false,
    useBackendAPI: true,
  },
  [Phase.PHASE_2]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],  // May support multi-token fee payment
    allowCurrencySwitching: true,
    useBackendAPI: true,
  },
}

export const getCurrentConfig = () => PHASE_CONFIG[CURRENT_PHASE]
```

---

## Mock API Layer Design

### 5.1 Currency API

```typescript
// lib/api/currency.ts

import { CURRENT_PHASE, getCurrentConfig } from '@/lib/constants/phase'
import type { Currency } from '@/lib/types/currency'

/**
 * Get the display currency unit
 * Phase 0: Returns 'HYPE' (mock)
 * Phase 1+: Fetches from backend
 */
export const getCurrencyUnit = async (): Promise<Currency> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return HYPE
    return 'HYPE'
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/currency/config')
  const data = await response.json()
  return data.displayCurrency
}

/**
 * Get exchange rates
 * Phase 0: Returns mock rates
 * Phase 1+: Fetches real-time rates
 */
export const fetchExchangeRates = async () => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock rates
    return {
      HYPE_USD: 1.25,
      HYPE_USDC: 1.24,
      HYPE_USDT: 1.24,
      HYPE_BTC: 0.000021,
    }
  }

  // Phase 1+: Real API
  const response = await fetch('/api/currency/rates')
  return response.json()
}

/**
 * Check if currency switching is allowed
 */
export const isCurrencySwitchingAllowed = (): boolean => {
  return getCurrentConfig().allowCurrencySwitching
}
```

---

### 5.2 Trading API

```typescript
// lib/api/trading.ts

import { CURRENT_PHASE } from '@/lib/constants/phase'

/**
 * Fetch user's available balance
 * Phase 0: Returns mock balance
 * Phase 1+: Fetches from backend
 */
export const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return test balance
    return 8492.50
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/user/balance')
  const data = await response.json()
  return data.balance
}

/**
 * Fetch current index price
 * Phase 0: Uses mock index data
 * Phase 1+: Real-time price from backend
 */
export const fetchIndexPrice = async (indexId: string): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Find in mock data
    const { allMockIndexes } = await import('@/lib/data/mock-indexes')
    const index = allMockIndexes.find(idx => idx.id === indexId)
    return index?.currentPrice || 0
  }

  // Phase 1+: Backend API
  const response = await fetch(`/api/indexes/${indexId}/price`)
  const data = await response.json()
  return data.price
}

/**
 * Execute a trade
 * Phase 0: Simulates trade execution
 * Phase 1+: Sends to backend
 */
export interface TradeParams {
  indexId: string
  type: 'buy' | 'sell'
  amount: number
  leverage: number
  slippage: number
}

export interface TradeResult {
  success: boolean
  tradeId?: string
  executedPrice?: number
  executedAmount?: number
  fee?: number
  error?: string
}

export const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Simulate successful trade
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay

    return {
      success: true,
      tradeId: `mock-${Date.now()}`,
      executedPrice: await fetchIndexPrice(params.indexId),
      executedAmount: params.amount,
      fee: params.amount * 0.003, // 0.3% fee
    }
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/trades/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  return response.json()
}
```

---

### 5.3 Portfolio API

```typescript
// lib/api/portfolio.ts

import { CURRENT_PHASE } from '@/lib/constants/phase'
import type { Trade } from '@/lib/types/index-trading'

/**
 * Fetch user's active positions
 * Phase 0: Returns empty array (no mock positions)
 * Phase 1+: Fetches from backend
 */
export const fetchActivePositions = async (): Promise<Trade[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return empty or demo positions
    return []
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/user/positions')
  const data = await response.json()
  return data.positions
}

/**
 * Fetch total account equity
 * Phase 0: Calculates from mock balance
 * Phase 1+: Fetches from backend
 */
export const fetchAccountEquity = async (): Promise<{
  totalEquity: number
  availableBalance: number
  usedMargin: number
  unrealizedPnL: number
}> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return demo values
    const balance = await fetchUserBalance()
    return {
      totalEquity: balance,
      availableBalance: balance,
      usedMargin: 0,
      unrealizedPnL: 0,
    }
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/user/equity')
  return response.json()
}

// Import from trading.ts to avoid circular dependency
import { fetchUserBalance } from './trading'
```

---

### 5.4 Fee API

```typescript
// lib/api/fees.ts

import { CURRENT_PHASE } from '@/lib/constants/phase'
import { VIP_PROTOCOL_FEES, LAYER_FEES, LAUNCHER_FEE } from '@/lib/constants/fees'
import type { VIPTier, Layer } from '@/lib/types/fees'

// ========================================
// Type Definitions
// ========================================

export interface FeeBreakdown {
  protocol: number   // VIP tier-based protocol fee
  creator: number    // Layer-specific creator fee
  lp: number         // Layer-specific LP fee
  total: number      // Sum of all fees
}

export interface RebalancingFeeInfo {
  feePerEvent: number     // Fee per rebalancing event
  frequency: string       // 'monthly' | 'bi-weekly' | 'none'
  annualRate: number      // Annual rebalancing fee rate
}

export interface ManagementFeeInfo {
  annualRate: number      // Annual management fee rate
  monthlyRate: number     // Monthly prorated rate
}

// ========================================
// User VIP Tier API
// ========================================

/**
 * Get user's VIP tier
 * Phase 0: Returns mock VIP tier (default: VIP2)
 * Phase 1+: Fetches from backend based on trading volume & referral performance
 */
export const getUserVIPTier = async (): Promise<VIPTier> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Return VIP2 as default (30% distribution)
    return 'VIP2'
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/user/vip-tier')
  const data = await response.json()
  return data.vipTier
}

// ========================================
// Trading Fee API
// ========================================

/**
 * Calculate trading fee breakdown
 * Phase 0: Uses VIP tier + Layer constants
 * Phase 1+: May fetch dynamic fee rates from backend
 *
 * @param amount - Trading amount in HYPE
 * @param layer - Index layer (L1, L2, L3, VS, PARTNER)
 * @param vipTier - User's VIP tier (VIP0-VIP4)
 * @returns FeeBreakdown with protocol, creator, lp, and total fees
 */
export const calculateTradingFee = async (
  amount: number,
  layer: Layer,
  vipTier: VIPTier
): Promise<FeeBreakdown> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use VIP tier + Layer constants
    const protocolFeeRate = VIP_PROTOCOL_FEES[vipTier]
    const layerFees = LAYER_FEES[layer]

    const protocolFee = amount * protocolFeeRate
    const creatorFee = amount * layerFees.CREATOR_FEE
    const lpFee = amount * layerFees.LP_FEE

    return {
      protocol: protocolFee,
      creator: creatorFee,
      lp: lpFee,
      total: protocolFee + creatorFee + lpFee,
    }
  }

  // Phase 1+: Backend API (may have dynamic rates)
  const response = await fetch('/api/fees/trading/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, layer, vipTier }),
  })
  const data = await response.json()
  return data.feeBreakdown
}

/**
 * Calculate partner routing fee
 * Partner indices use reduced 0.5% protocol fee
 * No creator or LP fees (direct C-R routing)
 */
export const calculatePartnerRoutingFee = async (
  amount: number
): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Fixed 0.5% for partner routing
    return amount * 0.005
  }

  // Phase 1+: Backend API
  const response = await fetch('/api/fees/partner-routing/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })
  const data = await response.json()
  return data.fee
}

// ========================================
// Rebalancing Fee API
// ========================================

/**
 * Calculate rebalancing fee info
 * Phase 0: Uses Layer constants
 * Phase 1+: Fetches from backend
 *
 * @param layer - Index layer (L1, L2, L3, VS, PARTNER)
 * @returns RebalancingFeeInfo with fee per event and frequency
 */
export const getRebalancingFeeInfo = async (
  layer: Layer
): Promise<RebalancingFeeInfo> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use Layer constants
    const layerFees = LAYER_FEES[layer]

    // L3 has no rebalancing (bonding curve)
    if (layer === 'L3') {
      return {
        feePerEvent: 0,
        frequency: 'none',
        annualRate: 0,
      }
    }

    // Determine frequency and calculate annual rate
    let frequency: string
    let eventsPerYear: number

    if (layer === 'L1' || layer === 'PARTNER') {
      frequency = 'monthly'
      eventsPerYear = 12
    } else {
      // L2, VS
      frequency = 'bi-weekly'
      eventsPerYear = 26
    }

    const feePerEvent = layerFees.REBALANCING_FEE_PER_EVENT || 0
    const annualRate = feePerEvent * eventsPerYear

    return {
      feePerEvent,
      frequency,
      annualRate,
    }
  }

  // Phase 1+: Backend API
  const response = await fetch(`/api/fees/rebalancing/info?layer=${layer}`)
  const data = await response.json()
  return data
}

/**
 * Calculate rebalancing fee for a given AUM
 */
export const calculateRebalancingFee = async (
  aum: number,
  layer: Layer
): Promise<number> => {
  const info = await getRebalancingFeeInfo(layer)
  return aum * info.feePerEvent
}

// ========================================
// Management Fee API
// ========================================

/**
 * Get management fee info
 * Phase 0: Uses Layer constants
 * Phase 1+: Fetches from backend
 */
export const getManagementFeeInfo = async (
  layer: Layer
): Promise<ManagementFeeInfo> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use Layer constants
    const layerFees = LAYER_FEES[layer]
    const annualRate = layerFees.MANAGEMENT_FEE_YEARLY

    return {
      annualRate,
      monthlyRate: annualRate / 12,
    }
  }

  // Phase 1+: Backend API
  const response = await fetch(`/api/fees/management/info?layer=${layer}`)
  const data = await response.json()
  return data
}

/**
 * Calculate management fee for a given AUM
 * Returns monthly prorated amount
 */
export const calculateManagementFee = async (
  aum: number,
  layer: Layer
): Promise<number> => {
  const info = await getManagementFeeInfo(layer)
  return aum * info.monthlyRate
}

// ========================================
// Launcher Fee API
// ========================================

/**
 * Get launcher fee
 * Fixed $5 per new index launch
 */
export const getLauncherFee = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Fixed $5
    return LAUNCHER_FEE
  }

  // Phase 1+: Backend API (may have dynamic pricing)
  const response = await fetch('/api/fees/launcher')
  const data = await response.json()
  return data.fee
}

// ========================================
// Fee Display Helpers
// ========================================

/**
 * Format fee breakdown for display
 */
export const formatFeeBreakdown = (
  breakdown: FeeBreakdown,
  currency: string = 'HYPE'
): string => {
  return `
Protocol Fee: ${breakdown.protocol.toFixed(2)} ${currency}
Creator Fee: ${breakdown.creator.toFixed(2)} ${currency}
LP Fee: ${breakdown.lp.toFixed(2)} ${currency}
Total: ${breakdown.total.toFixed(2)} ${currency}
  `.trim()
}

/**
 * Get VIP tier discount percentage
 */
export const getVIPDiscount = (vipTier: VIPTier): number => {
  const vip0Rate = VIP_PROTOCOL_FEES['VIP0']
  const currentRate = VIP_PROTOCOL_FEES[vipTier]
  return ((vip0Rate - currentRate) / vip0Rate) * 100
}
```

---

### 5.5 Price API

```typescript
// lib/api/prices.ts

import { CURRENT_PHASE } from '@/lib/constants/phase'

/**
 * Fetch historical price data for charts
 * Phase 0: Returns mock OHLCV data
 * Phase 1+: Fetches from backend
 */
export interface OHLCV {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export const fetchPriceHistory = async (
  indexId: string,
  timeframe: '1m' | '5m' | '1h' | '1d',
  limit: number = 100
): Promise<OHLCV[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Generate sample data
    const now = Date.now()
    const interval = timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '1h' ? 3600000 : 86400000

    return Array.from({ length: limit }, (_, i) => ({
      timestamp: now - (limit - i) * interval,
      open: 1.2 + Math.random() * 0.1,
      high: 1.25 + Math.random() * 0.1,
      low: 1.15 + Math.random() * 0.1,
      close: 1.2 + Math.random() * 0.1,
      volume: 1000000 + Math.random() * 500000,
    }))
  }

  // Phase 1+: Backend API
  const response = await fetch(
    `/api/prices/history?indexId=${indexId}&timeframe=${timeframe}&limit=${limit}`
  )
  return response.json()
}

/**
 * Subscribe to real-time price updates
 * Phase 0: Returns mock WebSocket simulation
 * Phase 1+: Real WebSocket connection
 */
export const subscribeToPriceUpdates = (
  indexId: string,
  callback: (price: number) => void
): (() => void) => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Simulate price updates every 2 seconds
    const interval = setInterval(() => {
      const mockPrice = 1.2 + Math.random() * 0.2
      callback(mockPrice)
    }, 2000)

    // Return unsubscribe function
    return () => clearInterval(interval)
  }

  // Phase 1+: WebSocket connection
  const ws = new WebSocket(`wss://api.hyperindex.xyz/prices/${indexId}`)
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data.price)
  }

  // Return unsubscribe function
  return () => ws.close()
}
```

---

## Component Integration

### 6.1 TradePanel Integration

**Before (Hardcoded):**

```typescript
// components/trading/trade-panel.tsx (OLD)

export function TradePanel({ index, isOpen, onClose }: TradePanelProps) {
  const { currency } = useCurrency()  // ❌ User-selected currency
  const [amount, setAmount] = useState(1000)  // ❌ Hardcoded default

  // ❌ Direct access to index data
  const currentPrice = index?.currentPrice || 0

  // ❌ Hardcoded fee calculation
  const estimatedFees = amount * 0.003

  // ❌ Hardcoded balance
  const availableBalance = 8492.50

  return (
    <div>
      <label>Amount ({currency})</label>  {/* ❌ Variable currency */}
      <input value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <div>Fee: {estimatedFees} {currency}</div>
      <div>Balance: {availableBalance} {currency}</div>
    </div>
  )
}
```

**After (API Functions + VIP Tier + Fee Breakdown):**

```typescript
// components/trading/trade-panel.tsx (NEW)

import { getCurrencyUnit } from '@/lib/api/currency'
import { fetchUserBalance, fetchIndexPrice, executeTrade } from '@/lib/api/trading'
import { calculateTradingFee, getUserVIPTier, formatFeeBreakdown } from '@/lib/api/fees'
import { useCurrency } from '@/lib/hooks/useCurrency'
import type { FeeBreakdown, VIPTier, Layer } from '@/lib/types/fees'

export function TradePanel({ index, isOpen, onClose }: TradePanelProps) {
  // ✅ State management
  const [currencyUnit, setCurrencyUnit] = useState<string>('HYPE')
  const [amount, setAmount] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [vipTier, setVipTier] = useState<VIPTier>('VIP2')

  const { formatPrice, formatBalance } = useCurrency()

  // ✅ Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!index) return

      // Fetch all data from API (parallel for performance)
      const [currency, balance, price, tier] = await Promise.all([
        getCurrencyUnit(),
        fetchUserBalance(),
        fetchIndexPrice(index.id),
        getUserVIPTier(),
      ])

      setCurrencyUnit(currency)
      setAvailableBalance(balance)
      setCurrentPrice(price)
      setVipTier(tier)
    }

    loadData()
  }, [index])

  // ✅ Calculate fees with VIP tier + Layer breakdown
  useEffect(() => {
    const calculateFees = async () => {
      if (amount === 0 || !index) {
        setFeeBreakdown(null)
        return
      }

      // Get index layer (from index metadata)
      const layer: Layer = index.layer || 'L2'  // Default to L2

      // Calculate fee breakdown (protocol + creator + lp)
      const breakdown = await calculateTradingFee(amount, layer, vipTier)
      setFeeBreakdown(breakdown)
    }

    calculateFees()
  }, [amount, vipTier, index])

  // ✅ Execute trade via API
  const handleTrade = async () => {
    if (!index) return

    const result = await executeTrade({
      indexId: index.id,
      type: 'buy',
      amount,
      leverage: 1,
      slippage: 0.5,
    })

    if (result.success) {
      onClose()
      // Show success notification
    } else {
      console.error('Trade failed:', result.error)
    }
  }

  return (
    <div className="space-y-4">
      {/* ✅ Use fetched currency unit */}
      <div>
        <label className="text-sm text-slate-400">Amount ({currencyUnit})</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full bg-slate-800 text-white p-2 rounded"
        />
      </div>

      {/* ✅ Use format functions */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Current Price:</span>
          <span className="text-white">{formatPrice(currentPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Available Balance:</span>
          <span className="text-white">{formatBalance(availableBalance)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">VIP Tier:</span>
          <span className="text-brand font-semibold">{vipTier}</span>
        </div>
      </div>

      {/* ✅ Fee Breakdown Display */}
      {feeBreakdown && (
        <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
          <div className="text-xs text-slate-400 mb-2">Fee Breakdown</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Protocol Fee:</span>
              <span className="text-white">{feeBreakdown.protocol.toFixed(2)} {currencyUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Creator Fee:</span>
              <span className="text-white">{feeBreakdown.creator.toFixed(2)} {currencyUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LP Fee:</span>
              <span className="text-white">{feeBreakdown.lp.toFixed(2)} {currencyUnit}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-600">
              <span className="text-slate-300 font-semibold">Total Fee:</span>
              <span className="text-brand font-semibold">
                {feeBreakdown.total.toFixed(2)} {currencyUnit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Trade button */}
      <button
        onClick={handleTrade}
        className="w-full bg-brand text-black font-semibold py-2 rounded hover:bg-brand/90"
      >
        Buy {index?.symbol}
      </button>
    </div>
  )
}
```

---

### 6.2 Positions Integration

**Before (Hardcoded):**

```typescript
// components/portfolio/positions.tsx (OLD)

export function Positions() {
  // ❌ Hardcoded mock trades
  const activeTrades = [
    {
      id: 'trade-1',
      indexId: 'meme-blue-chips',
      type: 'long',
      amount: 1000,
      entryPrice: 1.2345,
      leverage: 10,
      timestamp: Date.now(),
    },
  ]

  return (
    <div>
      {activeTrades.map(trade => (
        <div key={trade.id}>
          <div>Size: {trade.amount} HYPE</div>  {/* ❌ Hardcoded HYPE */}
          <div>Entry: {trade.entryPrice} HYPE</div>
        </div>
      ))}
    </div>
  )
}
```

**After (API Functions):**

```typescript
// components/portfolio/positions.tsx (NEW)

import { fetchActivePositions } from '@/lib/api/portfolio'
import { fetchIndexPrice } from '@/lib/api/trading'
import { getCurrencyUnit } from '@/lib/api/currency'
import { useCurrency } from '@/lib/hooks/useCurrency'

export function Positions() {
  const [currencyUnit, setCurrencyUnit] = useState<string>('HYPE')
  const [activeTrades, setActiveTrades] = useState<Trade[]>([])
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({})

  const { formatPrice, formatBalance } = useCurrency()

  // ✅ Load positions from API
  useEffect(() => {
    const loadPositions = async () => {
      const [currency, positions] = await Promise.all([
        getCurrencyUnit(),
        fetchActivePositions(),
      ])

      setCurrencyUnit(currency)
      setActiveTrades(positions)

      // Fetch current prices for each position
      const prices: Record<string, number> = {}
      for (const trade of positions) {
        prices[trade.indexId] = await fetchIndexPrice(trade.indexId)
      }
      setCurrentPrices(prices)
    }

    loadPositions()
  }, [])

  // ✅ Calculate PnL using fetched prices
  const calculatePnL = (trade: Trade) => {
    const currentPrice = currentPrices[trade.indexId] || trade.entryPrice
    return trade.type === 'long'
      ? (currentPrice - trade.entryPrice) * trade.amount * trade.leverage
      : (trade.entryPrice - currentPrice) * trade.amount * trade.leverage
  }

  return (
    <div>
      {activeTrades.map(trade => (
        <div key={trade.id}>
          {/* ✅ Use format functions */}
          <div>Size: {formatBalance(trade.amount)}</div>
          <div>Entry: {formatPrice(trade.entryPrice)}</div>
          <div>Current: {formatPrice(currentPrices[trade.indexId] || 0)}</div>
          <div>PnL: {formatBalance(calculatePnL(trade))}</div>
        </div>
      ))}
    </div>
  )
}
```

---

### 6.3 IndexCard Integration

**Before (Hardcoded):**

```typescript
// components/discover/index-detail-card.tsx (OLD)

export function IndexDetailCard({ index }: { index: MemeIndex }) {
  const { formatPrice, formatVolume } = useCurrency()

  return (
    <div>
      {/* ❌ Direct access to index properties */}
      <div>Price: {formatPrice(index.currentPrice)}</div>
      <div>Volume: {formatVolume(index.volume24h)}</div>
      <div>TVL: {formatVolume(index.tvl)}</div>
    </div>
  )
}
```

**After (API Functions):**

```typescript
// components/discover/index-detail-card.tsx (NEW)

import { fetchIndexPrice } from '@/lib/api/trading'
import { fetchExchangeRates } from '@/lib/api/currency'
import { useCurrency } from '@/lib/hooks/useCurrency'

export function IndexDetailCard({ index }: { index: MemeIndex }) {
  const [currentPrice, setCurrentPrice] = useState(index.currentPrice)
  const [usdPrice, setUsdPrice] = useState<number | null>(null)

  const { formatPrice, formatVolume } = useCurrency()

  // ✅ Fetch real-time price
  useEffect(() => {
    const loadPrice = async () => {
      const price = await fetchIndexPrice(index.id)
      setCurrentPrice(price)

      // Optional: Fetch USD reference
      const rates = await fetchExchangeRates()
      setUsdPrice(price * rates.HYPE_USD)
    }

    loadPrice()

    // Subscribe to price updates
    const unsubscribe = subscribeToPriceUpdates(index.id, (price) => {
      setCurrentPrice(price)
    })

    return () => unsubscribe()
  }, [index.id])

  return (
    <div>
      {/* ✅ Use fetched price */}
      <div className="text-2xl font-bold">
        {formatPrice(currentPrice)}
      </div>

      {/* ✅ Optional USD reference */}
      {usdPrice && (
        <div className="text-xs text-slate-400">
          ≈ ${usdPrice.toFixed(2)} USD
        </div>
      )}

      {/* ✅ Mock data still accessible (Phase 0) */}
      <div>Volume: {formatVolume(index.volume24h)}</div>
      <div>TVL: {formatVolume(index.tvl)}</div>
    </div>
  )
}
```

---

### 6.4 VIP Tier Settings Integration

**Purpose:** Display user's VIP tier, trading volume requirements, and fee discounts in Settings page.

**Location:** `components/settings/PreferencesSection.tsx` or new `components/settings/VIPTierSection.tsx`

**Implementation:**

```typescript
// components/settings/VIPTierSection.tsx (NEW)

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUserVIPTier, getVIPDiscount } from '@/lib/api/fees'
import { VIP_PROTOCOL_FEES } from '@/lib/constants/fees'
import type { VIPTier } from '@/lib/types/fees'

export function VIPTierSection() {
  const [vipTier, setVipTier] = useState<VIPTier>('VIP2')
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVIPInfo = async () => {
      try {
        const tier = await getUserVIPTier()
        const discountPercent = getVIPDiscount(tier)

        setVipTier(tier)
        setDiscount(discountPercent)
      } catch (error) {
        console.error('Failed to load VIP tier:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVIPInfo()
  }, [])

  const getTierColor = (tier: VIPTier): string => {
    switch (tier) {
      case 'VIP4': return 'bg-amber-500/20 text-amber-400 border-amber-500'
      case 'VIP3': return 'bg-purple-500/20 text-purple-400 border-purple-500'
      case 'VIP2': return 'bg-blue-500/20 text-blue-400 border-blue-500'
      case 'VIP1': return 'bg-slate-500/20 text-slate-400 border-slate-500'
      default: return 'bg-slate-700/20 text-slate-500 border-slate-700'
    }
  }

  const getTierRequirements = (tier: VIPTier): string => {
    // Based on FEE_STRUCTURE_SPECIFICATION.md Section 3.1
    switch (tier) {
      case 'VIP4': return '≥ $5M 30-day volume OR Top 10% referrer'
      case 'VIP3': return '≥ $1M 30-day volume OR Top 15% referrer'
      case 'VIP2': return '≥ $100K 30-day volume OR Top 30% referrer'
      case 'VIP1': return '≥ $10K 30-day volume OR Top 25% referrer'
      default: return 'Default tier (no requirements)'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">VIP Tier</h2>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="animate-pulse">Loading VIP tier...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">VIP Tier</h2>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 space-y-4">
          {/* Current Tier */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Current Tier</div>
              <Badge className={`text-sm px-3 py-1 ${getTierColor(vipTier)}`}>
                {vipTier}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Protocol Fee</div>
              <div className="text-lg font-semibold text-brand">
                {(VIP_PROTOCOL_FEES[vipTier] * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Fee Discount */}
          {discount > 0 && (
            <div className="p-3 bg-brand/10 border border-brand/20 rounded">
              <div className="text-sm text-brand">
                🎉 You save <span className="font-semibold">{discount.toFixed(1)}%</span> on protocol fees
              </div>
            </div>
          )}

          {/* Requirements */}
          <div>
            <div className="text-xs text-slate-400 mb-1">Tier Requirements</div>
            <div className="text-sm text-slate-300">
              {getTierRequirements(vipTier)}
            </div>
          </div>

          {/* All Tiers Comparison */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 mb-2">All VIP Tiers</div>
            <div className="space-y-2">
              {(['VIP0', 'VIP1', 'VIP2', 'VIP3', 'VIP4'] as VIPTier[]).map((tier) => (
                <div
                  key={tier}
                  className={`flex justify-between text-sm p-2 rounded ${
                    tier === vipTier
                      ? 'bg-brand/10 border border-brand/20'
                      : 'bg-slate-800/30'
                  }`}
                >
                  <span className={tier === vipTier ? 'text-brand font-semibold' : 'text-slate-400'}>
                    {tier}
                  </span>
                  <span className={tier === vipTier ? 'text-brand font-semibold' : 'text-slate-500'}>
                    {(VIP_PROTOCOL_FEES[tier] * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-slate-500">
            VIP tier is based on your 30-day trading volume or referral performance.
            Tiers are updated automatically every 24 hours.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Integration into Settings Page:**

```typescript
// app/settings/page.tsx (UPDATE)

import { VIPTierSection } from '@/components/settings/VIPTierSection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
// ... other imports

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* VIP Tier Section - NEW */}
      <VIPTierSection />

      {/* Existing sections */}
      <PreferencesSection />
      {/* ... other sections */}
    </div>
  )
}
```

**Key Features:**

1. **Real-time VIP Tier Display**: Fetches current tier from `getUserVIPTier()` API
2. **Protocol Fee Display**: Shows exact fee percentage based on tier
3. **Discount Visualization**: Calculates and displays savings vs VIP0
4. **Tier Requirements**: Shows volume/referral thresholds for each tier
5. **All Tiers Comparison**: Lists all VIP tiers with fee percentages
6. **Visual Hierarchy**: Highlights current tier with brand color
7. **Auto-update Notice**: Explains that tiers refresh every 24 hours

**Data Flow:**

```
Settings Page
    ↓ renders
VIPTierSection Component
    ↓ useEffect on mount
getUserVIPTier() API (lib/api/fees.ts)
    ↓ Phase 0: returns 'VIP2' (mock)
    ↓ Phase 1+: fetches from backend
Display tier + fee + discount
```

**Phase 0 Behavior:**
- Shows VIP2 as default tier (30% distribution)
- Protocol fee: 0.40%
- Discount: 33.3% vs VIP0
- All data from mock constants

**Phase 1 Transition:**
- Backend endpoint: `GET /api/user/vip-tier`
- Response format:
```json
{
  "vipTier": "VIP3",
  "tradingVolume30d": 1250000,
  "referralPerformance": {
    "rank": "top_15",
    "referralCount": 45
  }
}
```

**Estimated Time:** 1.5 hours (new component + integration + testing)

---

## Detailed Implementation Plan

### 7.1 Step 1: Create Phase Configuration

**New File:** `lib/constants/phase.ts`

```typescript
export enum Phase {
  PHASE_0 = 'PHASE_0',
  PHASE_1 = 'PHASE_1',
  PHASE_2 = 'PHASE_2',
}

export const CURRENT_PHASE = Phase.PHASE_0

export const PHASE_CONFIG = {
  [Phase.PHASE_0]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],
    allowCurrencySwitching: false,
    useBackendAPI: false,
  },
  [Phase.PHASE_1]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],  // May expand after platform token launch
    allowCurrencySwitching: false,
    useBackendAPI: true,
  },
  [Phase.PHASE_2]: {
    displayCurrency: 'HYPE',
    feeCurrencies: ['HYPE'],  // May support multi-token fee payment
    allowCurrencySwitching: true,
    useBackendAPI: true,
  },
}

export const getCurrentConfig = () => PHASE_CONFIG[CURRENT_PHASE]
```

**Estimated Time:** 15 minutes

---

### 7.2 Step 2: Create Mock API Layer

#### A. Currency API

**New File:** `lib/api/currency.ts`

```typescript
import { CURRENT_PHASE, getCurrentConfig } from '@/lib/constants/phase'
import type { Currency, ExchangeRates } from '@/lib/types/currency'

export const getCurrencyUnit = async (): Promise<Currency> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 'HYPE'
  }
  const response = await fetch('/api/currency/config')
  const data = await response.json()
  return data.displayCurrency
}

export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return {
      HYPE_USD: 1.25,
      HYPE_USDC: 1.24,
      HYPE_USDT: 1.24,
      HYPE_BTC: 0.000021,
    }
  }
  const response = await fetch('/api/currency/rates')
  return response.json()
}

export const isCurrencySwitchingAllowed = (): boolean => {
  return getCurrentConfig().allowCurrencySwitching
}
```

**Estimated Time:** 30 minutes

**Required Constants File Update:**

**File:** `lib/constants/fees.ts` (MUST UPDATE)

```typescript
// lib/constants/fees.ts

/**
 * VIP Tier Protocol Fees
 * Based on FEE_STRUCTURE_SPECIFICATION.md Section 3
 */
export const VIP_PROTOCOL_FEES = {
  VIP0: 0.006,   // 0.60% (20% users)
  VIP1: 0.005,   // 0.50% (25% users)
  VIP2: 0.004,   // 0.40% (30% users) - DEFAULT
  VIP3: 0.0035,  // 0.35% (15% users)
  VIP4: 0.003,   // 0.30% (10% users)
} as const

export type VIPTier = keyof typeof VIP_PROTOCOL_FEES

/**
 * Layer-Specific Fee Structure
 * Based on FEE_STRUCTURE_SPECIFICATION.md Section 2
 */
export const LAYER_FEES = {
  L1: {
    CREATOR_FEE: 0.0015,                // 0.15%
    LP_FEE: 0.0015,                     // 0.15%
    REBALANCING_FEE_PER_EVENT: 0.001,   // 0.1% per monthly rebalance
    MANAGEMENT_FEE_YEARLY: 0.007,       // 0.7% annually
  },
  L2: {
    CREATOR_FEE: 0.002,                 // 0.20%
    LP_FEE: 0.001,                      // 0.10%
    REBALANCING_FEE_PER_EVENT: 0.001,   // 0.1% per bi-weekly rebalance
    MANAGEMENT_FEE_YEARLY: 0.0085,      // 0.85% annually
  },
  L3: {
    CREATOR_FEE: 0.0025,                // 0.25%
    LP_FEE: 0.0005,                     // 0.05%
    REBALANCING_FEE_PER_EVENT: 0,       // No rebalancing (bonding curve)
    MANAGEMENT_FEE_YEARLY: 0.01,        // 1% annually
  },
  VS: {
    CREATOR_FEE: 0.002,                 // 0.20%
    LP_FEE: 0.001,                      // 0.10%
    REBALANCING_FEE_PER_EVENT: 0.001,   // 0.1% per bi-weekly rebalance
    MANAGEMENT_FEE_YEARLY: 0.01,        // 1% annually
  },
  PARTNER: {
    CREATOR_FEE: 0,                     // 0% (direct routing)
    LP_FEE: 0,                          // 0% (direct routing)
    REBALANCING_FEE_PER_EVENT: 0.003,   // 0.3% per monthly rebalance
    MANAGEMENT_FEE_YEARLY: 0.005,       // 0.5% annually
  },
} as const

export type Layer = keyof typeof LAYER_FEES

/**
 * Fixed Fees
 */
export const LAUNCHER_FEE = 5  // Fixed $5 per index launch

/**
 * Blended Average Protocol Fee (for projections)
 */
export const BLENDED_PROTOCOL_FEE = 0.0045  // 0.45% weighted average
```

---

#### B. Trading API

**New File:** `lib/api/trading.ts`

```typescript
import { CURRENT_PHASE } from '@/lib/constants/phase'

export const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 8492.50
  }
  const response = await fetch('/api/user/balance')
  const data = await response.json()
  return data.balance
}

export const fetchIndexPrice = async (indexId: string): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const { allMockIndexes } = await import('@/lib/data/mock-indexes')
    const index = allMockIndexes.find(idx => idx.id === indexId)
    return index?.currentPrice || 0
  }
  const response = await fetch(`/api/indexes/${indexId}/price`)
  const data = await response.json()
  return data.price
}

export interface TradeParams {
  indexId: string
  type: 'buy' | 'sell'
  amount: number
  leverage: number
  slippage: number
}

export interface TradeResult {
  success: boolean
  tradeId?: string
  executedPrice?: number
  executedAmount?: number
  fee?: number
  error?: string
}

export const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      tradeId: `mock-${Date.now()}`,
      executedPrice: await fetchIndexPrice(params.indexId),
      executedAmount: params.amount,
      fee: params.amount * 0.003,
    }
  }
  const response = await fetch('/api/trades/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return response.json()
}
```

**Estimated Time:** 45 minutes

---

#### C. Portfolio API

**New File:** `lib/api/portfolio.ts`

```typescript
import { CURRENT_PHASE } from '@/lib/constants/phase'
import type { Trade } from '@/lib/types/index-trading'
import { fetchUserBalance } from './trading'

export const fetchActivePositions = async (): Promise<Trade[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return []
  }
  const response = await fetch('/api/user/positions')
  const data = await response.json()
  return data.positions
}

export const fetchAccountEquity = async () => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const balance = await fetchUserBalance()
    return {
      totalEquity: balance,
      availableBalance: balance,
      usedMargin: 0,
      unrealizedPnL: 0,
    }
  }
  const response = await fetch('/api/user/equity')
  return response.json()
}
```

**Estimated Time:** 30 minutes

---

#### D. Fee API

**New File:** `lib/api/fees.ts`

```typescript
import { CURRENT_PHASE } from '@/lib/constants/phase'
import { FEES, FeeType } from '@/lib/constants/fees'
import type { Currency } from '@/lib/types/currency'

/**
 * Calculate trading fee with VIP tier + Layer breakdown
 * NOTE: This is simplified example. For full implementation, see Section 5.4
 */
export const calculateTradingFee = async (
  amount: number,
  layer: Layer,
  vipTier: VIPTier
): Promise<FeeBreakdown> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    // Mock: Use VIP tier + Layer constants (see Section 5.4 for full code)
    const protocolFeeRate = VIP_PROTOCOL_FEES[vipTier]
    const layerFees = LAYER_FEES[layer]

    return {
      protocol: amount * protocolFeeRate,
      creator: amount * layerFees.CREATOR_FEE,
      lp: amount * layerFees.LP_FEE,
      total: amount * (protocolFeeRate + layerFees.CREATOR_FEE + layerFees.LP_FEE),
    }
  }
  // Phase 1+: Backend API
  const response = await fetch('/api/fees/trading/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, layer, vipTier }),
  })
  const data = await response.json()
  return data.feeBreakdown
}

/**
 * Get launcher fee (fixed $5)
 */
export const getLauncherFee = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return LAUNCHER_FEE  // Fixed $5
  }
  const response = await fetch('/api/fees/launcher')
  const data = await response.json()
  return data.fee
}

export const getAvailableFeeTokens = async (
  feeType: FeeType
): Promise<Currency[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return ['HYPE']
  }
  const response = await fetch(`/api/fees/available-tokens?type=${feeType}`)
  const data = await response.json()
  return data.tokens
}
```

**Estimated Time:** 30 minutes

---

#### E. Price API

**New File:** `lib/api/prices.ts`

```typescript
import { CURRENT_PHASE } from '@/lib/constants/phase'

export interface OHLCV {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export const fetchPriceHistory = async (
  indexId: string,
  timeframe: '1m' | '5m' | '1h' | '1d',
  limit: number = 100
): Promise<OHLCV[]> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const now = Date.now()
    const interval = timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '1h' ? 3600000 : 86400000
    return Array.from({ length: limit }, (_, i) => ({
      timestamp: now - (limit - i) * interval,
      open: 1.2 + Math.random() * 0.1,
      high: 1.25 + Math.random() * 0.1,
      low: 1.15 + Math.random() * 0.1,
      close: 1.2 + Math.random() * 0.1,
      volume: 1000000 + Math.random() * 500000,
    }))
  }
  const response = await fetch(
    `/api/prices/history?indexId=${indexId}&timeframe=${timeframe}&limit=${limit}`
  )
  return response.json()
}

export const subscribeToPriceUpdates = (
  indexId: string,
  callback: (price: number) => void
): (() => void) => {
  if (CURRENT_PHASE === 'PHASE_0') {
    const interval = setInterval(() => {
      const mockPrice = 1.2 + Math.random() * 0.2
      callback(mockPrice)
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

```typescript
// Remove entire currency selector section (L42-55)
// Keep only Time Format selector

export function PreferencesSection() {
  const { addToast } = useToast()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  // ❌ REMOVE: const [currency, setCurrency] = useState<Currency>(...)
  const [timefmt, setTimefmt] = useState('24h')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = SettingsStorage.getPreferences()
    if (saved) {
      setTheme(saved.theme)
      setLang(saved.lang)
      // ❌ REMOVE: setCurrency(saved.currency)
      setTimefmt(saved.timefmt)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Preferences</h2>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ❌ REMOVE: Currency selector */}

            {/* ✅ KEEP: Time Format */}
            <div>
              <div className="text-xs text-slate-400 mb-1">Time Format</div>
              <Select value={timefmt} onValueChange={setTimefmt}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Time Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24‑hour</SelectItem>
                  <SelectItem value="12h">12‑hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-brand text-black hover:bg-brand-hover"
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true)
                  // ❌ REMOVE: currency from save
                  await savePreferences({ theme, lang, timefmt })
                  SettingsStorage.savePreferences({ theme, lang, timefmt })
                  addToast(createSuccessToast('Saved', 'Preferences updated'))
                } catch (e: any) {
                  addToast(createErrorToast('Failed', e?.message || 'Please try again'))
                } finally {
                  setSaving(false)
                }
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Estimated Time:** 20 minutes

---

### 7.4 Step 4: Update Components to Use API Functions

#### Priority Components (High Impact)

**File Count:** ~15 high-priority files

| Component | Estimated Time |
|-----------|---------------|
| TradePanel.tsx | 45 min |
| Positions.tsx | 45 min |
| AccountSummary.tsx | 30 min |
| IndexDetailCard.tsx | 30 min |
| CarouselIndexCard.tsx | 30 min |
| TradingPanel.tsx | 45 min |
| ConfirmLaunchModal.tsx | 30 min |
| AccountPanel.tsx | 30 min |
| EarningsSummary.tsx | 30 min |
| CreatorEarnings.tsx | 30 min |
| **Total** | **5.5 hours** |

---

### 7.5 Step 5: Update useCurrency Hook

**File:** `lib/hooks/useCurrency.ts`

```typescript
import { useCurrencyStore } from '@/lib/store/currency-store'
import { getCurrencyUnit } from '@/lib/api/currency'
import { useState, useEffect } from 'react'
import type { Currency } from '@/lib/types/currency'
import {
  formatCurrency,
  formatPrice,
  formatPercentage,
  formatFee,
  formatGas,
  formatVolume,
  formatBalance,
  formatPnL,
  convertCurrency,
} from '@/lib/utils/currency'

export function useCurrency() {
  const { exchangeRates, getExchangeRate } = useCurrencyStore()
  const [currency, setCurrency] = useState<Currency>('HYPE')

  // Fetch currency unit on mount
  useEffect(() => {
    getCurrencyUnit().then(setCurrency)
  }, [])

  return {
    // Always HYPE in Phase 0
    currency,

    // Exchange rates for USD reference
    exchangeRates,
    getExchangeRate,

    // Formatting functions (locked to HYPE)
    formatPrice: (amount: number) => formatPrice(amount, 'HYPE', exchangeRates),
    formatBalance: (amount: number) => formatBalance(amount, 'HYPE', exchangeRates),
    formatVolume: (amount: number) => formatVolume(amount, 'HYPE', exchangeRates),
    formatPnL: (amount: number) => formatPnL(amount, 'HYPE', exchangeRates),
    formatCurrency: (amount: number, options?: any) => formatCurrency(amount, 'HYPE', options),

    // Fees always in HYPE
    formatFee,
    formatGas,

    // Utility
    formatPercentage,
    convertCurrency: (amount: number, from: Currency, to: Currency) =>
      convertCurrency(amount, from, to, exchangeRates),
  }
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

#### Currency API
- [ ] `getCurrencyUnit()` returns 'HYPE' in Phase 0
- [ ] `fetchExchangeRates()` returns mock rates
- [ ] `isCurrencySwitchingAllowed()` returns false

#### Trading API
- [ ] `fetchUserBalance()` returns 8492.50
- [ ] `fetchIndexPrice(id)` returns mock price from allMockIndexes
- [ ] `executeTrade()` simulates 1s delay and returns success

#### Portfolio API
- [ ] `fetchActivePositions()` returns empty array
- [ ] `fetchAccountEquity()` returns mock equity data

#### Fee API
- [ ] `getUserVIPTier()` returns 'VIP2' in Phase 0
- [ ] `calculateTradingFee()` uses VIP_PROTOCOL_FEES + LAYER_FEES
- [ ] `getLauncherFee()` returns LAUNCHER_FEE ($5)
- [ ] `getRebalancingFeeInfo()` returns correct frequency by layer
- [ ] `getManagementFeeInfo()` returns correct annual rates by layer

#### Price API
- [ ] `fetchPriceHistory()` generates mock OHLCV data
- [ ] `subscribeToPriceUpdates()` simulates updates every 2s
- [ ] Unsubscribe function clears interval

---

### 8.2 Component Integration Testing

#### TradePanel
- [ ] Currency label shows "HYPE"
- [ ] Balance loads from `fetchUserBalance()`
- [ ] Price loads from `fetchIndexPrice()`
- [ ] Fee calculates via `calculateTradingFee()`
- [ ] Trade executes via `executeTrade()`

#### Positions
- [ ] Positions load from `fetchActivePositions()`
- [ ] Current prices fetch via `fetchIndexPrice()`
- [ ] PnL calculates correctly
- [ ] Format functions show "X HYPE"

#### Settings
- [ ] Currency selector removed
- [ ] Only Time Format remains
- [ ] Save doesn't include currency

---

### 8.3 Phase Switching Test

**Test Scenario:** Change CURRENT_PHASE to PHASE_1

```typescript
// lib/constants/phase.ts
export const CURRENT_PHASE = Phase.PHASE_1
```

**Expected Behavior:**
- [ ] API functions attempt backend calls
- [ ] Console shows fetch errors (no backend yet)
- [ ] UI still renders (graceful degradation)

**Revert:**
```typescript
export const CURRENT_PHASE = Phase.PHASE_0
```

---

## Backend Integration Guide

### 9.1 Phase 1 Transition Checklist

**Step 1: Update Phase Config**

```typescript
// lib/constants/phase.ts
export const CURRENT_PHASE = Phase.PHASE_1
```

**Step 2: Implement Backend APIs**

No component changes needed! Just implement these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/currency/config` | GET | Returns display currency |
| `/api/currency/rates` | GET | Returns exchange rates |
| `/api/user/balance` | GET | Returns user balance |
| `/api/user/vip-tier` | GET | **NEW**: Returns user's VIP tier |
| `/api/indexes/:id/price` | GET | Returns index price |
| `/api/trades/execute` | POST | Executes trade |
| `/api/user/positions` | GET | Returns active positions |
| `/api/user/equity` | GET | Returns account equity |
| `/api/fees/trading/calculate` | POST | **UPDATED**: Calculates fee with VIP tier + Layer breakdown |
| `/api/fees/rebalancing/info` | GET | **NEW**: Returns rebalancing fee info by layer |
| `/api/fees/management/info` | GET | **NEW**: Returns management fee info by layer |
| `/api/fees/launcher` | GET | Returns launcher fee ($5) |
| `/api/prices/history` | GET | Returns OHLCV data |

**Step 3: Test**

```bash
# Phase 1 should now use real backend
pnpm run dev

# Check browser console
# Should see fetch calls to backend
```

---

### 9.2 API Response Formats

#### GET /api/user/balance

```json
{
  "balance": 8492.50,
  "currency": "HYPE"
}
```

#### GET /api/user/vip-tier ⭐ NEW

```json
{
  "vipTier": "VIP2",
  "protocolFeeRate": 0.004,
  "tradingVolume30d": 125000,
  "referralPerformance": {
    "rank": "top_30",
    "referralCount": 12
  },
  "nextTierThreshold": {
    "tier": "VIP3",
    "requiredVolume": 1000000,
    "currentProgress": 0.125
  }
}
```

#### GET /api/indexes/:id/price

```json
{
  "indexId": "meme-blue-chips",
  "price": 1.2345,
  "layer": "L2",
  "timestamp": 1698765432000
}
```

#### POST /api/fees/trading/calculate ⭐ UPDATED

**Request:**
```json
{
  "amount": 1000,
  "layer": "L2",
  "vipTier": "VIP2"
}
```

**Response:**
```json
{
  "feeBreakdown": {
    "protocol": 4.0,
    "creator": 2.0,
    "lp": 1.0,
    "total": 7.0
  },
  "feeRates": {
    "protocolRate": 0.004,
    "creatorRate": 0.002,
    "lpRate": 0.001
  }
}
```

#### GET /api/fees/rebalancing/info?layer=L2 ⭐ NEW

```json
{
  "layer": "L2",
  "feePerEvent": 0.001,
  "frequency": "bi-weekly",
  "eventsPerYear": 26,
  "annualRate": 0.026
}
```

#### GET /api/fees/management/info?layer=L2 ⭐ NEW

```json
{
  "layer": "L2",
  "annualRate": 0.0085,
  "monthlyRate": 0.00070833
}
```

#### POST /api/trades/execute

**Request:**
```json
{
  "indexId": "meme-blue-chips",
  "type": "buy",
  "amount": 1000,
  "leverage": 10,
  "slippage": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "tradeId": "trade-abc123",
  "executedPrice": 1.2345,
  "executedAmount": 1000,
  "feeBreakdown": {
    "protocol": 4.0,
    "creator": 2.0,
    "lp": 1.0,
    "total": 7.0
  }
}
```

---

### 9.3 Error Handling

**All API functions should handle errors gracefully:**

```typescript
// Example: fetchUserBalance with error handling

export const fetchUserBalance = async (): Promise<number> => {
  if (CURRENT_PHASE === 'PHASE_0') {
    return 8492.50
  }

  try {
    const response = await fetch('/api/user/balance')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.balance
  } catch (error) {
    console.error('Failed to fetch user balance:', error)

    // Fallback to mock data
    return 8492.50
  }
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
|------|------|
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
