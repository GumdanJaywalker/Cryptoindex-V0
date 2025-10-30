# HANDOVER - Development Session Summary

**Last Updated**: 2025-10-29
**Latest Session**: Phase 0 Terminology & UI Consistency (Oct 29)

> For archived sessions, see HANDOVER_ARCHIVE.md

---

## LATEST SESSION - Phase 0 Terminology & UI Consistency (Oct 29)

### Goal
Clarify Phase 0/1 scope, unify terminology (Futures, Trading Rules/Data), fix component naming, add Phase 0 limitation tooltips

### Implementation

#### TASK_PRIORITY.md Updates (12 changes)

**Phase 0 Tooltips** (3 locations):
- Portfolio (Section 6): Futures "coming soon" with `!` icon → `"Futures trading available at official launch"`
- Trade page (Section 8): Futures availability indicator → `"Futures trading coming at official launch"` (placement TBD)
- Launch page (Section 3): Asset search tooltip → `"Phase 0 supports HyperCore Spot tokens only. HyperCore Perpetual tokens and Multi-chain assets coming at official launch."`

**Share Button Improvements** (Section 7 - Discover):
- Added complete Share button specification (Feedback #19)
- Coupang/Musinsa reference fixed: "슬라이더 UX" → "Share 기능 UX"
- Features: Link copy (text box + copy button), social icons row (X/Twitter, Telegram, Instagram, Apple Share), PnL card generation, consistent UI across Discover/Launch/Portfolio
- Reference: LAUNCH_PAGE_REFACTORING.md Phase 9

**Terminology Standardization**:
- Page names: "Trading 페이지" → "Trade 페이지" (15 occurrences)
- Tab/section names: "Trade Data" → "Trading Data" (업계 표준, 4 occurrences), "Trade Rules" → "Trading Rules" (1 occurrence)
- Futures terminology: "Perps" → "Futures" (포괄적 umbrella term, 2 occurrences)
- Component naming: `IndexDetailModal` → `IndexDetailsModal` (정확한 파일명, 3 occurrences)

**Actions Order Fix** (Section 5):
- `Trade | ⭐ | View Details` → `Trade | View Details | ⭐`

**Data Consistency Addition** (Section 8 - Trade page):
- IndexDetailsModal과 Trade 페이지 Info 탭 간 데이터 일관성 보장
- 동일한 변수명 사용 (marketCap, totalAssets, rebalanceFreq 등)
- 재사용 가능한 컴포넌트 추출: `<IndexInfoField>`, `<BasketComposition>`, `<FeeDisplay>`
- 겹치는 항목: Market Cap, FDV, Total Assets, Index Creation Date, Rebalance Freq, Mgmt Fee, Description, Whitepaper, Asset Composition

**Phase 0 Scope Clarification** (Section 8):
- Phase 0: HyperCore Spot 토큰 인덱스만 지원
- Futures 관련 항목은 닫힌 상태로 시작

**Metadata**: Updated to 2025-10-29

#### LAUNCH_PAGE_REFACTORING.md Updates (2 changes)

**Phase 0 Tooltip Messages**:
- Line 48 (Component Overview) + Line 295 (Phase 2.3 specification)
- Updated: `"...Multi-chain assets coming..."` → `"...HyperCore Perpetual tokens and Multi-chain assets coming at official launch."`

### Technical Details

**Terminology Strategy**:
```
General use: "Futures" (포괄적, includes Delivery + Perpetual)
├─ Delivery Futures (만기 있음) - Phase 1 멀티체인 지원 시 포함 가능
└─ Perpetual Futures (만기 없음) - HyperCore Perpetuals

Launch tooltip: "HyperCore Perpetual tokens" (명확히 구분)

Page names: "Trade 페이지" (간결)
Technical terms: "Trading Rules", "Trading Data" (업계 표준)
```

**Rationale**:
- Binance: "Futures" as umbrella term for both Delivery and Perpetual products
- Phase 1: Multi-chain support may include delivery futures from other chains
- HyperCore: Perpetuals only (like HyperLiquid)
- Launch page: Explicit distinction for user clarity

**Component Reusability Strategy**:
```typescript
// Trade page Info tab + IndexDetailsModal 공유
<IndexInfoField name="marketCap" /> // Same data source
<BasketComposition assets={index.assets} /> // Same component
<FeeDisplay fees={index.fees} /> // Unified layout
```

**English Terminology Standards** (Finance industry):
- "Trading Rules" ✅ (Binance, Coinbase, Kraken)
- "Trade Rules" ❌ (비표준)
- "Trading Data" ✅ (Trading Volume, Trading Activity 패턴)
- "Trade Data" ❌ (어색함)

### Status
All terminology unified, Phase 0/1 scope clarified, tooltips added, component consistency specified

### Next Steps
- Implement Phase 0 tooltips (3 locations with `!` icon)
- Add Share button to Discover page (modal + social icons)
- Extract reusable components (`IndexInfoField`, `BasketComposition`, `FeeDisplay`)
- Ensure data consistency between Trade page and IndexDetailsModal

---

## NEXT TASK - Fee Structure Implementation Planning

### Goal
Finalize fee structure implementation approach before updating 6 components

### Required Decisions

**1. VIP Tier Integration**:
- Where to get VIP tier data?
  - Option A: Mock VIP2 for Phase 0 (30% distribution tier)
  - Option B: Create user context/store with VIP tier
  - Option C: Backend API call

**2. Layer Information**:
- Add `layer` field to index mock data?
  - L1/L2/L3/VS/PARTNER/GRADUATED
  - Update `lib/data/mock-indices.ts`

**3. Invited User Status**:
- How to determine `isInvited` flag?
  - Phase 0: Default to false
  - Phase 1: User profile field

**4. Component Update Strategy**:
- 6 components to update:
  1. `components/trading/quick-trade-button.tsx`
  2. `components/trading/trade-panel.tsx`
  3. `components/trading/TradingPanelSimple.tsx`
  4. `components/trading/confirm-modal.tsx`
  5. `components/trading/LiquidityModal.tsx`
  6. `app/launch/page.tsx`

**5. Testing Plan**:
- VIP tier fee calculation verification
- Layer-specific fee breakdown
- UI display of fee components (Protocol/Creator/LP)
- Total fee accuracy

### Recommended Approach
1. Create Mock user store with VIP2
2. Add layer field to mock index data
3. Update 6 components sequentially
4. Test in dev server (user runs `pnpm run dev`)
5. Document test results

### Documents to Update After Completion
- `docs/handover/HANDOVER.md` - Add new session
- `docs/planning/2025OCT04/README.md` - Update status
- `docs/planning/2025OCT04/TASK_PRIORITY.md` - Check off Fee Structure tasks

---

## PREVIOUS SESSION - 2025OCT04 Document Organization (Oct 28)

### Goal
Organize Notion exported documents and create comprehensive Launch page refactoring plan

### Implementation

**Folder Organization**:
Created category folders in `2025OCT04 Frontend Docs/Frontend Docs/`:
- `/task-plans` (10 files)
- `/task-reviews` (10 files)
- `/feedbacks` (6 files)
- `/templates` (4 files)
- `/okrs` (1 file)
- `/misc` (4 files)

**Planning Documents**:
Created `/docs/planning/2025OCT04/` with 3 documents:
- `CURRENCY_SYSTEM_REFACTORING.md` (moved from docs/planning/)
- `FRONTEND_SECURITY_ATTACK_SCENARIOS.md` (moved from docs/planning/)
- `LAUNCH_PAGE_REFACTORING.md` (newly created, 600+ lines)

**LAUNCH_PAGE_REFACTORING.md** based on 19 feedback items:
- UX Components: 11 core components (Launch Guide, Target Raise, Creator Fee, Asset Search, Backtesting, Composition, Total Cost, Auto-Swap, Index Details, Launch Process, Share)
- References: CoreIndex, pump.fun, Uniswap, Coupang/Musinsa, HyperLiquid
- Rationale: Real-time cost calculation, transparency, professional metrics (Sharpe Ratio + MDD)
- Rejected Alternatives: Manual fee entry, simplified cost display, search-only discovery, "Preview" terminology
- Component Relationships: Integration with Portfolio, Discover, Trading, Settings, Docs pages
- Detailed Plan: 9 phases (Documentation → UI Polish → Search → Composition → Backtesting → Cost Calculation → Auto-Swap → Real Data → Share)
- Success Criteria: 12 items checklist

**YYYYMMMWW Format**:
```
Format: Year + Month Initials + Week Number
Example: 2025OCT04 = 2025년 10월 4주차 (October Week 4)
Location: /docs/planning/2025OCT04/
```

**Planning Document Template**:
- UX or 세부 컴포넌트 항목
- 레퍼런스
- 용이성의 근거 (채택 방안, 비채택 대안들)
- 타 페이지 및 컴포넌트와의 관계성
- 상세 계획 - 실행 절차

**Launch Page 19 Feedback Items**:
Launch Guide, Target Raise → Bonding Curve, Creator Fee, Asset Search Bug, Asset Discovery, Perps Exclusion, Preview Periods Extension, Composition Decimals, Fee Amount Unification, Total Cost, Real-time Fees, Inline Swap Removal, X Button Fix, Fee Inconsistency, Cost Terminology, Checkbox Visibility, Asset Breakdown, Launch Process, Share Feature

**Created Files**:
- `docs/planning/2025OCT04/README.md` (83 lines) - Week focus, cross-document relationships, status summary
- `docs/planning/2025OCT04/LAUNCH_PAGE_REFACTORING.md` (600+ lines) - 9-phase plan, 4 rejected alternatives, 5 integration points

**Modified Files**:
- `docs/handover/HANDOVER.md` - Added YYYYMMMWW rules, Notion workflow, backend paths

### Status
Document organization complete, Launch page planning document created, ready for implementation

---

## PREVIOUS SESSION - Discover Page Task Plan (Oct 29)

### Goal
Create comprehensive task planning document for Discover page improvements based on 11 feedback items from Henry (Oct 25)

### Implementation

#### Document Created
`docs/planning/2025OCT04/DISCOVER_PAGE_TASK_PLAN.md` (full template):
- Template-based planning document (UX, References, Rationale, Relationships, Execution)
- 11 detailed feedback items converted to actionable tasks
- 7-phase execution plan (12 days estimated)
- Component reusability strategy

#### 11 Feedback Items Addressed

**Search & Validation**:
1. Search logic: Name + ticker only (remove description matches)
2. Index name validation: No emoji (alphanumeric + spaces only)

**Category Improvements**:
3. Dynamic category criteria: Hot (24h volume growth), New (<7 days), Gainers/Losers (24h change), High Volume (top 20%)
4. Partner Indices category: Add dedicated filter button

**Visual & UX**:
5. Brand color standardization:
   - Profit/Loss: Keep green/red but softer (`#4ade80`, `#f87171`)
   - All other UI: Mint brand color variations (#98FCE4)
6. Composition filter: Scrollable list + search + checkboxes (replaces button grid)
7. Asset list sync: Use identical data source as Launch page

**Advanced Filters Redesign**:
8. Performance & NAV ranges: Slider + input box + presets (like Launch page)
9. Volume & Liquidity ranges: Same slider pattern
10. Segment Filter (NEW): Multi-select tags (MEME, DeFi, Solana, RWA, AI, etc.)

**Integration**:
11. Component reusability: Extract RangeSlider, AssetSearchList for Launch page

### Technical Details

**Color Strategy**:
```typescript
// Brand colors (mint-based)
PRIMARY: '#98FCE4'       // Bright mint
PRIMARY_DARK: '#6BBDCC'  // Mid tone
BACKGROUND: '#072723'    // Dark teal

// Profit/Loss (softer, still recognizable)
PROFIT: '#4ade80'  // was #10b981 (softer emerald)
LOSS: '#f87171'    // was #ef4444 (softer rose)
```

**Category Criteria**:
- Hot: `sort by (volume24h / volume24hPrev) DESC`
- New: `filter by createdAt > now() - 7 days`
- Top Gainers: `sort by change24h DESC`
- Top Losers: `sort by change24h ASC`
- High Volume: `filter by volume24h > percentile(0.8)`

**Segment Tags**: MEME, DeFi, GameFi, AI, Solana Ecosystem, RWA, Stablecoin, NFT, DAO, Privacy, Layer 1, Layer 2

**Reusable Components**:
1. `<RangeSlider>` - Dual handle slider + input boxes + presets
2. `<AssetSearchList>` - Scrollable + searchable checkbox list
3. `<SegmentBadge>` - Theme tag display

### Execution Plan

**7 Phases (12 days)**:
- Phase 1: Research & Foundation (2 days) - Reference research, color constants, data definitions
- Phase 2: Reusable Components (2 days) - RangeSlider, AssetSearchList
- Phase 3: Search & Validation (1 day) - Name/ticker search, emoji validation
- Phase 4: Basic Filters (1 day) - Partner category, dynamic criteria
- Phase 5: Advanced Filters (3 days) - Composition redesign, slider UX, segment filter
- Phase 6: Integration & Testing (2 days) - Filter combinations, modal, responsive
- Phase 7: Polish & Documentation (1 day) - Visual check, performance, docs

### References

**Primary**:
- Binance Futures: Advanced filters modal, slider ranges
- Axiom: Search behavior, minimal color usage
- Hyperliquid: Brand consistency, professional UI
- Coupang/Musinsa: Multi-faceted filter panels

**What to Study**:
- Slider + input box patterns
- Preset button positioning
- Multi-select tag UX
- Color hierarchy principles

### Status
Planning document complete, ready for execution in Week 5-6

### Next Steps
- Phase 1: Study references (Binance, Coupang), create color constants
- Extract reusable components (RangeSlider, AssetSearchList)
- Apply to Discover page, then reuse in Launch page

---

## PREVIOUS SESSION - Fee Structure Specification (Oct 28)

### Goal
Create comprehensive fee structure specification based on business documentation (slides 26-28) for accurate implementation

### Implementation

#### Document Created
`docs/planning/2025OCT04/FEE_STRUCTURE_SPECIFICATION.md` (900+ lines):
- Complete fee structure from business slides
- All tables, formulas, and calculations verified
- Implementation checklist for code changes

#### Fee Structure Components

**Trading Fees**:
- VIP-tiered protocol fees: 0.3%-0.6% (blended 0.45%)
- Layer-specific creator fees: 0%-0.95%
- Layer-specific LP fees: 0%-0.4%
- Partner routing: 0.5% (reduced)
- Total comparison: HyperIndex 1.0% vs Pumpfun 1.25%

**Management Fees** (yearly):
- L1: 0.7%
- L2: 0.85%
- L3 & VS: 1%
- Partner: 0.5%

**Rebalancing Fees**:
- L1: 0.1%/monthly → 1.2%/yearly
- L2: 0.1%/bi-weekly → 2.6%/yearly
- VS: 0.1%/bi-weekly → 2.6%/yearly
- Partner: 0.3%/monthly → 3.9%/yearly

**Launcher Fee**: $5 fixed per launch

#### Revenue Projections (Annual)

**Total: $686.9M**
- Trading: $471.7M (68.7%)
  - HOOATS Orderbook: $116.4M
  - HOOATS AMM: $62.7M
  - Partner Indices: $75M
  - Partner Routing: $155M
- Rebalancing: $155.3M (22.6%)
- Management: $56.8M (8.3%)
- Launcher: $3M (0.4%)

#### AUM by Layer

| Layer   | AUM (B) | Turnover Ratio |
|---------|---------|---------------|
| L1      | 5.10    | 171%          |
| L2      | 2.02    | 433%          |
| L3      | 0.2429  | 18250%        |
| VS      | 0.0959  | 3088%         |
| Partner | 0.1644  | 15643%        |

### Technical Details

**VIP Tier System**:
```typescript
VIP0: 0.60% (20% distribution)
VIP1: 0.50% (25%)
VIP2: 0.40% (30%)
VIP3: 0.35% (15%)
VIP4: 0.30% (10%)
```

**Turnover Rate Formula**:
```
L1/L2/VS/Partner: AUM = (V^prim / K*r) * Turnover rate = (V^prim / AUM)
L3: AUM = V^sec * (d/365) * Turnover rate = (V^sec / AUM)

K = yearly rebalancing count
r = rebalancing composition change %
p = % of rebalancing volume on primary market
d = duration of holding token
```

**Fee Calculation Examples**:
- HOOATS Trading (Internal): 40B × 0.4475% = $179.1M
- Partner Routing: 31B × 0.5% = $155M
- L1 Rebalancing: 5.1B × 0.1% × 12 = $61.3M
- L1 Management: 5.1B × 0.7% = $35.7M

### Verification

All numbers cross-checked against business slides:
- ✅ Slide 26: Trading fee tiers, protocol fees, layer breakdown
- ✅ Slide 27: Rebalancing frequencies, management fees
- ✅ Slide 28: Turnover formulas, AUM factors, revenue calculations
- ✅ All tables, percentages, formulas 100% match

### Code Changes Required

**Files to Update** (8 files):
- `lib/constants/fees.ts` - Complete rewrite with VIP tiers and layer fees
- `lib/utils/fees.ts` - New calculation functions
- 6 components using fees:
  - `components/trading/quick-trade-button.tsx`
  - `components/trading/trade-panel.tsx`
  - `components/trading/TradingPanelSimple.tsx`
  - `components/trading/confirm-modal.tsx`
  - `components/trading/LiquidityModal.tsx`
  - `app/launch/page.tsx`

**Previous vs Current**:
- Previous: Simple HIIN/HIDE two-token model, flat 0.3% fee
- Current: VIP tiers, layer-specific fees, rebalancing fees, management fees

### Status
Fee structure specification complete and verified, ready for implementation

### Next Steps
- Implement VIP tier system in user model
- Rewrite `lib/constants/fees.ts` with new structure
- Create calculation functions in `lib/utils/fees.ts`
- Update all 6 components using fees
- Add fee breakdown display in UI

---

## PREVIOUS SESSION - Phase 0 Fee Structure Implementation (Oct 24)

### Goal
Centralize all fee configurations and implement proper $HIIN/$HIDE two-token fee structure based on Phase 0 tokenomics documentation

### Implementation

#### New Files (2 files)
- `lib/constants/fees.ts` (230+ lines)
  - Centralized fee constants for all platform operations
  - HIIN_FEES object: Launch (0.1 $HIIN), Management (0.02% annual), Rebalancing (0.05%), Gas multiplier
  - HIDE_FEES object: Trading (0.30%), LP Add/Remove (0.10%), LP Claim (0.05%), Gas multiplier
  - Native payment discount: 10% when paying in $HIIN/$HIDE vs $HYPE
  - FeeType enum for type-safe fee categorization
  - Helper functions: getNativeTokenForFee(), getBaseFeeRate(), getDiscountRate(), getFeeLabel()
  - Fee descriptions and labels for UI display
  - Currency type integration with existing useCurrency hook

- `lib/utils/fees.ts` (300+ lines)
  - Fee calculation utilities with discount logic
  - FeeCalculation interface: baseFee, discount, finalFee, discountPercentage, paymentToken, nativeToken, feeType
  - calculateTradingFee(amount, paymentToken): Computes $HIDE trading fee with 10% discount
  - calculateLaunchFee(paymentToken): Computes 0.1 $HIIN launch fee with discount
  - calculateManagementFee(aum, days, paymentToken): Annual 0.02% AUM fee prorated
  - calculateRebalancingFee(tvl, paymentToken): 0.05% TVL rebalancing fee
  - calculateLPFee(amount, operation, paymentToken): LP add/remove/claim fees
  - Helper functions: getDiscountedFee(), formatFeeBreakdown(), aggregateFees()

#### Modified Files (6 files)
- `components/trading/quick-trade-button.tsx`
  - Line 62: Changed hardcoded 0.005 (0.5%) → FEES.HIDE.TRADING_FEE (0.30%)
  - Added import: import { FEES } from '@/lib/constants/fees'

- `components/trading/trade-panel.tsx`
  - Line 53: Changed hardcoded 0.001 (0.1%) → FEES.HIDE.TRADING_FEE (0.30%)
  - Added import: import { FEES } from '@/lib/constants/fees'

- `components/trading/TradingPanelSimple.tsx`
  - Line 35: Changed hardcoded 0.001 (0.1%) → FEES.HIDE.TRADING_FEE (0.30%)
  - Added import: import { FEES } from '@/lib/constants/fees'

- `components/trading/confirm-modal.tsx`
  - Line 80: Changed hardcoded 0.001 (0.1%) → FEES.HIDE.TRADING_FEE (0.30%)
  - Added import: import { FEES } from '@/lib/constants/fees'

- `components/trading/LiquidityModal.tsx`
  - Line 35: Changed hardcoded 0.001 → FEES.HIDE.LP_ADD_FEE (0.10%)
  - Added import: import { FEES } from "@/lib/constants/fees"

- `app/launch/page.tsx`
  - Line 249: Changed hardcoded 0.1 → FEES.HIIN.LAUNCH_FEE with proper typing
  - Added import: import { FEES } from "@/lib/constants/fees"

### Technical Details

Fee Inconsistency Problem (User Issue):
```typescript
// Problem: Trading fees scattered across 4 files with different values
quick-trade-button.tsx:    const fees = positionSize * 0.005  // 0.5% ❌
trade-panel.tsx:            const fees = amount * 0.001       // 0.1% ❌
TradingPanelSimple.tsx:     const fees = amount * 0.001       // 0.1% ❌
confirm-modal.tsx:          const fees = amount * 0.001       // 0.1% ❌

// Solution: Single source of truth
lib/constants/fees.ts:      HIDE_FEES.TRADING_FEE = 0.003     // 0.30% ✅
```

Two-Token Fee Structure:
```typescript
// $HIIN (Index DAO) - For index creation/management
export const HIIN_FEES = {
  LAUNCH_FEE: 0.1,                      // 0.1 $HIIN fixed per index launch
  MANAGEMENT_FEE_ANNUAL: 0.0002,        // 0.02% annual AUM
  REBALANCING_FEE: 0.0005,              // 0.05% per rebalancing event
  GAS_MULTIPLIER: 1.0,                  // Covers on-chain gas
  ACCEPTED_TOKENS: ['HIIN', 'HYPE'],    // Native + fallback
  NATIVE_PAYMENT_DISCOUNT: 0.10,        // 10% discount for $HIIN
} as const

// $HIDE (DEX DAO) - For trading/LP operations
export const HIDE_FEES = {
  TRADING_FEE: 0.003,                   // 0.30% trading/swap fee
  SWAP_GAS_MULTIPLIER: 1.0,             // Covers swap gas
  LP_ADD_FEE: 0.001,                    // 0.10% LP addition
  LP_REMOVE_FEE: 0.001,                 // 0.10% LP removal
  LP_CLAIM_FEE: 0.0005,                 // 0.05% rewards claim
  ACCEPTED_TOKENS: ['HIDE', 'HYPE'],    // Native + fallback
  NATIVE_PAYMENT_DISCOUNT: 0.10,        // 10% discount for $HIDE
} as const
```

Discount Logic Implementation:
```typescript
export function calculateTradingFee(
  amount: number,
  paymentToken: Currency = 'HYPE'
): FeeCalculation {
  const feeType = FeeType.TRADING
  const baseFeeRate = getBaseFeeRate(feeType)       // 0.003 (0.30%)
  const baseFee = amount * baseFeeRate

  const nativeToken = getNativeTokenForFee(feeType) // 'HIDE'
  const isNativePayment = paymentToken === nativeToken
  const discountRate = isNativePayment ? 0.10 : 0   // 10% if paying in $HIDE
  const discount = baseFee * discountRate
  const finalFee = baseFee - discount

  return {
    baseFee,           // e.g., $30 for $10k trade
    discount,          // e.g., $3 if paying in $HIDE
    finalFee,          // e.g., $27 with discount
    discountPercentage: discountRate * 100,  // 10
    paymentToken,      // 'HIDE' or 'HYPE'
    nativeToken,       // 'HIDE'
    feeType,           // FeeType.TRADING
  }
}
```

Type Safety with Enums:
```typescript
export enum FeeType {
  INDEX_LAUNCH = 'INDEX_LAUNCH',
  INDEX_MANAGEMENT = 'INDEX_MANAGEMENT',
  INDEX_REBALANCING = 'INDEX_REBALANCING',
  INDEX_GAS = 'INDEX_GAS',
  TRADING = 'TRADING',
  SWAP_GAS = 'SWAP_GAS',
  LP_ADD = 'LP_ADD',
  LP_REMOVE = 'LP_REMOVE',
  LP_CLAIM = 'LP_CLAIM',
}

// Usage prevents typos
const nativeToken = getNativeTokenForFee(FeeType.TRADING)  // ✅ 'HIDE'
const nativeToken = getNativeTokenForFee('trading')        // ❌ TypeScript error
```

### Key Issue Resolved

User's complaint: **"거래수수료가 아직 변수로 떠 그거 조정해야돼"** (Trading fees are still variable, need to adjust that)

Before:
- 4 trading components had hardcoded fees: 0.5%, 0.1%, 0.1%, 0.1%
- No single source of truth
- Changing fees required editing 4+ files
- Risk of inconsistent fee display

After:
- All fees centralized in `lib/constants/fees.ts`
- Single constant: `FEES.HIDE.TRADING_FEE = 0.003` (0.30%)
- All 4 components import and use this constant
- Future phase updates: Change one value, affects all components
- Type-safe with FeeType enum and Currency type

### Status
Phase 0 fee structure fully implemented, all trading fees standardized to 0.30%, ready for backend API integration

### Next Steps
- Backend API integration when ready (pass paymentToken for discount calculation)
- Phase 1 fee updates: Adjust constants in `lib/constants/fees.ts` only
- UI enhancements: Display fee breakdown with discount in trading modals
- Add fee history tracking for analytics

---

## PREVIOUS SESSION - TradingView Chart Test Page (Oct 22)

### Goal
Create test page to verify lightweight-charts integration with mock data and fix v5 API compatibility issues

### Implementation

#### New Files (1 file)
- `app/test-tradingview/page.tsx` (103 lines)
  - Test page for TradingView chart verification
  - Imports ChartArea component with test-index ID
  - Test coverage section documenting features
  - Implementation details with file paths

#### Modified Files (1 file)
- `components/trading/ChartArea.tsx` (465 lines, ~50 lines changed)
  - Migrated from lightweight-charts v3 API to v5 API
  - Added `isChartReady` state to prevent race conditions
  - Changed `addCandlestickSeries()` → `addSeries(lc.CandlestickSeries, options)`
  - Changed `addLineSeries()` → `addSeries(lc.LineSeries, options)`
  - Changed `addAreaSeries()` → `addSeries(lc.AreaSeries, options)`
  - Changed `addHistogramSeries()` → `addSeries(lc.HistogramSeries, options)`
  - Added English localization (locale: 'en-US', dateFormat: 'dd MMM \'yy')
  - Wrapped series creation in async functions for dynamic imports

### Technical Details

v5 API Changes:
```typescript
// Before (v3 API)
const series = chart.addCandlestickSeries(options)

// After (v5 API)
const lc = await import('lightweight-charts')
const series = chart.addSeries(lc.CandlestickSeries, options)
```

Race Condition Fix:
```typescript
const [isChartReady, setIsChartReady] = useState(false)

// After chart creation
setIsChartReady(true)

// In series effect
if (!isChartReady || !chartRef.current || chartData.length === 0) return
```

Localization Setup:
```typescript
localization: {
  locale: 'en-US',
  dateFormat: 'dd MMM \'yy'
}
```

### Features Verified

Chart Rendering (7 items):
- Mock OHLCV data generation (500 candles)
- Chart rendering with lightweight-charts v5
- Volume display at bottom (15% height)
- Real-time price updates (3 sec interval)
- Timeframe switching (1m, 5m, 15m, 1h, 4h, 1d, 1w)
- Chart type switching (Candlestick, Line, Area, Histogram)
- Technical indicators (MA 20, MA 50)

Interactive Features:
- Crosshair with price/time tooltip
- English date formatting (system language independent)
- Responsive chart resizing
- Smooth series transitions

### Issues Fixed

1. Race Condition Error
   - Problem: "chartRef.current.addCandlestickSeries is not a function"
   - Cause: Series creation attempted before async chart initialization completed
   - Solution: Added `isChartReady` state flag, chart sets it true after init

2. v5 API Compatibility
   - Problem: v3 API methods don't exist in v5
   - Solution: Migrated all series creation to `addSeries(SeriesConstructor, options)` pattern

3. Korean Date Display
   - Problem: Dates displayed in Korean (system language)
   - Solution: Added `localization: { locale: 'en-US' }` to force English

### Git Commit
```
feat: add tradingview chart test page with v5 API migration

- Create /test-tradingview test page for chart verification
- Migrate ChartArea component to lightweight-charts v5 API
- Fix race condition with isChartReady state flag
- Add English localization for international users
- All chart types working: Candlestick, Line, Area, Histogram
```

### Status
TradingView chart integration verified, all features working, ready for backend API integration

### Next Steps
- Integrate real API endpoints when backend ready
- Add more technical indicators (RSI, Bollinger Bands, MACD)
- Consider adding chart drawing tools
- Mobile responsiveness testing

---

## PREVIOUS SESSION - Discover Page Refactor (Oct 21 Evening)

### Goal
Replace card grid with table-based list, add advanced filtering for better index discovery

### Implementation

#### New Components (2 files)
- `components/discover/index-list.tsx` (530 lines)
  - Table-based index list restored from git d7e76df trending-indices
  - Virtualized scrolling: 50px rows, 6-row buffer, handles 100+ items efficiently
  - Sortable columns: Name, Price, 24h%, Volume, MCap
  - 11 basic filters: All, Favorites, Hot, New, VS Battles, Gainers, Losers, High Volume, Layer 1/2/3
  - Advanced Filters button with active filter count badge
  - Favorites-first ordering
  - Search with debounce
  - Empty states (no results, no favorites)

- `components/discover/advanced-filters-modal.tsx` (470 lines)
  - Composition Filters: Select coins (DOGE, SHIB, PEPE, etc.) + Match Any/All mode
  - NAV Range: Min/Max net asset value with presets (<$1M, $1M-$10M, >$10M)
  - Performance Range: 24h/7d/30d tabs with min/max % + presets (0-10%, 10-50%, >50%, -50%-0%)
  - Volume & Liquidity: Min 24h volume + Min TVL with presets (>$100K, >$1M, >$10M)
  - Active filter count badge
  - Reset all functionality

#### Modified Files (1 file)
- `app/discover/page.tsx` (simplified 430 → 140 lines, -67%)
  - Removed Layer tabs
  - Removed complex URL sync
  - Removed VirtualizedIndexGrid, IndexDetailCard
  - Simple filter state management
  - Advanced filter integration (composition, NAV, performance, volume/liquidity)
  - Clean layout: no page scroll, table internal scroll only

### Technical Details

Filter logic:
```typescript
// Basic filters (in index-list.tsx)
- Search: name, symbol, description
- Category: hot, new, vs-battles, gainers, losers, high-volume
- Layer: layer-1, layer-2, layer-3
- Favorites: user starred indexes

// Advanced filters (in page.tsx)
- Composition: Match Any/All coins in index.assets
- NAV: index.tvl between min-max
- Performance 24h/7d: index.change24h/change7d between min-max
- Volume: index.volume24h >= min
- Liquidity: index.tvl >= min
```

Layout structure:
- Header (fixed)
- Sidebar + Main content (2-column grid)
- Title section (flex-shrink-0)
- IndexList (flex-1) with internal scroll
- Table height: calc(100vh - 16rem) - always fits viewport

Virtualization:
- Row height: 50px
- Buffer: 6 rows
- Calculates visible items based on scroll position
- Top/bottom spacers for smooth scrolling
- Sticky table header

### Key Features

11 Basic Filters (filter buttons row):
- All, Favorites, Hot, New, VS Battles
- Top Gainers, Top Losers, High Volume
- Layer 1, Layer 2, Layer 3
- Divider + Advanced Filters button

Advanced Filters Modal (4 sections):
- Composition: 12 popular coins, Match Any/All toggle
- NAV Range: Custom inputs + 3 presets
- Performance: 3 timeframe tabs (24h/7d/30d), custom inputs + 4 presets per tab
- Volume/Liquidity: Custom inputs + 3 presets each

Table Features:
- Sortable columns (click header to toggle asc/desc)
- Virtualized scrolling (handles 100+ rows efficiently)
- Sticky header (stays visible during scroll)
- Favorites-first ordering (starred indexes always on top)
- IndexRow component from trading (price, chart, badges)

UX Improvements:
- No page scrolling (fixed layout)
- Table height calc(100vh - 16rem) fits viewport
- Active filter count badges
- Clear visual feedback (brand color for active filters)
- Empty states with helpful CTAs

### Fixed Issues

1. Layer Separation
   - Previously: Layer 2 = VS Battles (incorrect)
   - Now: Separate filters for Layer 1/2/3 AND VS Battles
   - VS Battles can exist in any layer

2. Scroll Behavior
   - Previously: Page scroll + table scroll (confusing)
   - Now: Table internal scroll only
   - Table bottom always above viewport floor

3. Filter Organization
   - Previously: Complex filter panel with too many options
   - Now: 11 simple buttons + Advanced Filters modal
   - Progressive disclosure pattern

### Git Commits

Commit 1: `ccbaeeb` - Main refactor
```
feat: refactor discover page with table view and advanced filters
- Create index-list.tsx (restored from d7e76df)
- Create advanced-filters-modal.tsx
- Simplify discover page.tsx (430 → 140 lines)
```

Commit 2: `15d1099` - Scroll fix
```
fix: restore original table scroll behavior in discover page
- Use fixed height calc(100vh - 16rem)
- Add flex-1 for proper layout
- Restore min-h-[320px] guarantee
```

### Status
Discover page refactor complete, deployed to Vercel

### Next Steps
- Test mobile layout
- Add URL sync for advanced filters (optional)
- Consider adding sort presets (Volume High-Low, Performance Top-Bottom, etc.)

---

## PREVIOUS SESSION - Landing Page Carousel (Oct 21 Morning)

### Goal
Redesign landing page with carousel-based index and trader displays, remove overwhelming information for better new user experience

### Implementation

#### New Components (5 files)

Landing Carousels (2 files):
- `components/landing/IndexCarousel.tsx` (147 lines) - 2-card horizontal carousel, embla-carousel-react integration, hover-only navigation arrows (50% opacity), dot navigation, responsive 1/2 column grid
- `components/landing/TraderCarousel.tsx` (141 lines) - Single trader card carousel, auto-rotation every 5 seconds (embla-carousel-autoplay), hover-only arrows (50% opacity), dot navigation, continuous loop

Carousel Cards (2 files):
- `components/landing/CarouselIndexCard.tsx` (342 lines) - Composition-focused index card (copied from discover page design), NAV vs Market Price comparison, Layer badges (L1/L2/L3), graduation progress for L3 indexes, rebalancing schedule display, expandable asset composition (show more/less), click handler to open IndexDetailModal
- `components/landing/CarouselTraderCard.tsx` (211 lines) - Large trader card with comprehensive stats, avatar with rank badge (Top 3 get trophy icon), total PnL prominent display, 7-Day Performance sparkline chart, Hydration Fix: Deterministic seed-based sparkline generation, Win Rate/Total Trades/Followers stats grid, links to /traders/[id] page

Modal Component (1 file):
- `components/modals/IndexDetailModal.tsx` (229 lines) - Comprehensive index information modal, Trading Statistics section (24h Volume, TVL, Market Cap, 24h Change), Graduation Progress section (L3 only, with progress bars), Asset Composition table with breakdown, Rebalancing info display, "Start Trading" button linking to /trading?index={id}

#### Modified Files (2 files)

- `app/page.tsx` (114 lines)
  - Before: List-based TrendingIndices component
  - After: Carousel-based showcase
  - 3-column layout: LeftSidebar (260px/280px/300px) | Main Content | Right Section (340px/360px/380px)
  - Center section: Trending Indexes carousel with hero subtitle
  - Right section: Top Performers carousel with hero subtitle
  - Vertical centering: items-center grid alignment
  - Padding adjustments: pb-8 on carousel sections
  - Background fix: bg-slate-950 relative z-10 to cover animated background

- `components/layout/Header.tsx` (Line 80)
  - Background opacity: bg-slate-950/95 → bg-slate-950 (100% opaque)
  - Removed: backdrop-blur-sm (no longer needed)
  - Reason: Prevent AnimatedBackground from showing through header

### Design Highlights

User Feedback Iterations:
1. 2x2 Grid → 2 Cards Horizontal: Changed from 4 cards per page to 2 for better visibility
2. Arrow Opacity: Changed to opacity-0 group-hover:opacity-50 for subtle hover-only arrows
3. Hero Subtitles: Added descriptive subtitles under section headings ("Explore the hottest meme coin indexes right now", "Most profitable traders this week")
4. Vertical Centering: Changed grid alignment items-start → items-center, added padding pb-8

### Technical Implementation

Hydration Error Fix (`components/landing/CarouselTraderCard.tsx`):
Problem: Math.random() causing SSR/Client mismatch in sparkline
```typescript
// Before (caused hydration error):
const random = Math.sin(i * 0.5) * 20 + Math.random() * 10 // ❌

// After (deterministic):
const hashCode = trader.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
const seed = (index: number) => {
  const x = Math.sin((hashCode + index) * 12345.6789) * 10000
  return x - Math.floor(x)
}
const random = Math.sin(i * 0.5) * 20 + seed(i) * 10 // ✅
```

Impact: Eliminated all hydration warnings, consistent sparkline rendering

Carousel implementation:
```typescript
// embla-carousel-react for smooth scrolling
const [emblaRef, emblaApi] = useEmblaCarousel(
  { align: 'start', loop: true },
  autoRotate ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
)

// Pagination: 2 cards per page
const pages = []
for (let i = 0; i < indexes.length; i += 2) {
  pages.push(indices.slice(i, i + 2))
}

// Hover-only arrows
<Button className="opacity-0 group-hover:opacity-50 transition-opacity">
```

Background layer management:
```tsx
// Fixed animated background to lowest z-index
<div className="fixed inset-0 z-0">
  <AnimatedBackground variant="combined" intensity="medium" />
  <Background3DGrid />
</div>

// Content on higher z-index
<div className="bg-slate-950 relative z-10">
```

### Known Issues

Header Spacing Issue (Partially Unresolved):
Problem: Gap between header and main content shows AnimatedBackground

Attempted fixes:
1. Removed pt-4 → Created more gap
2. Added mt-16 → Created larger gap
3. Changed to pt-16 → Gap still visible
4. Made header opaque (bg-slate-950)
5. Added min-h-screen to content div
6. Gap still shows animated background

Current state: User decided to postpone fix
Suggested future fix: Investigate AnimatedBackground z-index layering or remove from landing page

### Data Flow

Index Card Click:
```
User clicks IndexCard → handleIndexClick(index) → setSelectedIndex(index) →
setModalOpen(true) → IndexDetailModal renders
```

Modal to Trading:
```
User clicks "Start Trading" → router.push(`/trading?index=${index.id}`) →
Trading page with pre-selected index
```

Carousel Auto-Rotation:
```
TraderCarousel mounts → Autoplay plugin starts → Every 5s → emblaApi.scrollNext() →
Next trader card shown → Loop
```

### Key Metrics

Code Statistics:
- Total Lines Added: ~1,070 lines
- New Components: 5 files
- Modified Components: 2 files
- Net Lines Changed: +1,053 lines

Features:
- Carousel Slides: 6 pages (12 indexes ÷ 2 per page)
- Auto-Rotation: 5 seconds per trader
- Modal Sections: 4 (Stats, Graduation, Composition, Rebalancing)
- Responsive Breakpoints: 3 layouts (mobile/tablet/desktop)

### Status
Full feature parity with design spec, carousel navigation working smoothly, hydration errors eliminated, auto-rotation functional, header spacing issue pending (postponed), ready for production use

### What's Next

UI/UX Improvements:
1. Fix header spacing issue (AnimatedBackground showing through)
2. Consider mobile swipe gestures for carousels
3. Add loading skeletons for carousel cards
4. Implement smooth scroll-to-top on page load

Backend Integration Points (when API ready):
1. Replace mock index data with /api/indices?trending=true
2. Replace mock trader data with /api/traders?sort=pnl&limit=5
3. Real-time PnL updates via WebSocket
4. Actual sparkline data from API

---

## Next Tasks

1. **TradingView Chart Test Page** - Create test page for lightweight-charts integration verification
2. **Mobile Testing** - Test discover page mobile layout
3. **Header Spacing** - Investigate AnimatedBackground z-index issue on landing page
4. **Backend Integration** - When API ready, swap mock data for real API calls

---

## Known Issues

1. **Landing Page Header Spacing** - Gap shows AnimatedBackground (postponed)
2. **Discover Page Mobile** - Mobile responsiveness not yet tested
3. **Mock Data** - All data currently mocked, awaiting backend integration

---

## Development Rules

1. **Dev Server** - User runs dev server themselves, Claude does not start it
2. **Backend Integration** - After backend work, update:
   - `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/docs/backend/BACKEND_INTEGRATION_CHECKLIST.md`
   - `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/docs/backend/BACKEND_DATA_REQUIREMENTS.md`
3. **After Every Task** - Update handover documents (HANDOVER.md and/or HANDOVER_ARCHIVE.md)
4. **Documentation** - Use concise bullet points, avoid emojis and marketing language
5. **Code Quality** - All information must be preserved, just formatted efficiently
6. **Planning Documents** - Organize by YYYYMMMWW format (Year + Month Initials + Week Number)
   - Example: 2025OCT04 = 2025년 10월 4주차 (October Week 4)
   - Location: `/docs/planning/YYYYMMMWW/`
   - Must follow template: UX details, References, Usability rationale, Component relationships, Detailed plan
7. **Notion Document Management**
   - Export Notion docs as markdown
   - Organize by category: task-plans, task-reviews, feedbacks, templates, okrs, misc
   - Place in dated folder structure (e.g., `2025OCT04 Frontend Docs/`)
   - Extract planning documents to `/docs/planning/YYYYMMMWW/`

---

**For archived sessions (Oct 20 and earlier), see HANDOVER_ARCHIVE.md**
