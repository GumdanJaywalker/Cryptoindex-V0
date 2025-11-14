# 2025OCT04 Task Plan - Currency & Preferences

생성자: 현 김
생성 일시: 2025년 10월 26일 오후 4:38
카테고리: 작업 계획
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 10월 28일 오후 4:19
검토자: HyunSu Choi
Task-DB: Frontend - Currency & Preferences (https://www.notion.so/Frontend-Currency-Preferences-298944d77956803182caebc3b601e2d8?pvs=21)

각 페이지 작업 들어가기 전에 UX, 세부 컴포넌트 항목들, 계획들 (단순 계획이 아니라  설계의 근거가 있는 문서)을 직접 작성하여 (AI 복붙 금지) 제시
- 레퍼런스
- UI/UX용이성의 근거 (대안보다 나은 UX인 근거, 비채택 대안은 뭔지 제시)
- 타 페이지 및 컴포넌트들과의 관계성 등

# UX or 세부 컴포넌트 항목

## 요약

### - 현행 Settings - Preferences에서 화폐단위 변환하는 기능 삭제, HYPE 단일 고정. 수수료는 추후 TGE 고려하여 네이티브토큰 추가 예정. 
- 현행은 화폐가치 데이터 전부 Mock인데 자산가치, 인덱스 가격, 수수료율 등등 산식 반영해서(백엔드에서 할 부분은 백엔드 연결 포인트 만들어서) 실제 데이터로 대체.

## 근거

### - 레퍼런스 조사 결과, 화폐단위 preferences 조정하는 기능이 조사한 세 거래소에서 모두 존재하지 않음 - 구현 필요 x
- 현재 HYPE 데이터로도 불러오는 산식이 없는데 다른 화폐 환율 반영해서 불러오는 산식까지 만드는 작업은 불필요하며 비효율적.

## 현행 변수 구조

### 1.1 Currency System Architecture

### Core Files

```
lib/
├── types/
│   └── currency.ts              # Type definitions (30 lines)
├── store/
│   └── currency-store.ts        # Zustand + LocalStorage (112 lines)
├── utils/
│   └── currency.ts              # Conversion & formatting (275 lines)
├── hooks/
│   └── useCurrency.ts           # React Hook interface (89 lines)
└── constants/
    └── fees.ts                  # Fee structure (259 lines)

components/
└── ui/
    └── currency-number-ticker.tsx  # Animated display (94 lines)

```

### Supported Currencies

```tsx
type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | 'HIIN' | 'HIDE'

```

| Currency | Purpose | Phase |
| --- | --- | --- |
| HYPE | Native token (Hyperliquid) | Phase 0 |
| USD | Reference only | Future |
| USDC | Stablecoin | Future |
| USDT | Stablecoin | Future |
| BTC | Crypto reference | Future |
| $HIIN | Index DAO token | Phase 1+ |
| $HIDE | DEX DAO token | Phase 1+ |

---

### 1.2 수수료 시스템 (Phase 0 - Beta)

### Fee Structure

**$HIIN Fees (Index DAO):**

```tsx
HIIN_FEES = {
  LAUNCH_FEE: 0.1,              // Fixed fee for index creation
  MANAGEMENT_FEE_ANNUAL: 0.0002, // 0.02% annual on AUM
  REBALANCING_FEE: 0.0005,      // 0.05% per rebalance
  GAS_MULTIPLIER: 1.0,          // Dynamic gas cost
  NATIVE_PAYMENT_DISCOUNT: 0.10 // 10% discount with $HIIN
}

```

**$HIDE Fees (DEX DAO):**

```tsx
HIDE_FEES = {
  TRADING_FEE: 0.003,           // 0.30% on all trades
  LP_ADD_FEE: 0.001,            // 0.10% when adding liquidity
  LP_REMOVE_FEE: 0.001,         // 0.10% when removing liquidity
  LP_CLAIM_FEE: 0.0005,         // 0.05% when claiming rewards
  NATIVE_PAYMENT_DISCOUNT: 0.10 // 10% discount with $HIDE
}

```

### Fee Type Classification

```tsx
enum FeeType {
  // HIIN Fees (paid in $HIIN or HYPE)
  INDEX_LAUNCH,
  INDEX_MANAGEMENT,
  INDEX_REBALANCING,
  INDEX_GAS,

  // HIDE Fees (paid in $HIDE or HYPE)
  TRADING,
  SWAP_GAS,
  LP_ADD,
  LP_REMOVE,
  LP_CLAIM
}

```

현행 구조가 이렇다는 거고, 실제 Phase 0에서는 HYPE만 써야 해서 수정해야 할 사항임

---

### 1.3 컴포넌트 어디에 사용되는가

### A. Page-Level Components (17 pages)

| Page | Path | Currency Usage |
| --- | --- | --- |
| **Trading** | `/app/trading/page.tsx` | Price, Volume, PnL |
| **Launch** | `/app/launch/page.tsx` | Fees, AUM, Deposits |
| **Discover** | `/app/discover/page.tsx` | Market Cap, Volume, NAV |
| **Portfolio** | `/app/portfolio/page.tsx` | Balance, PnL, Position Size |
| **Leaderboard** | `/app/leaderboard/page.tsx` | Trading Volume, Profit |
| **Governance** | `/app/governance/page.tsx` | Voting Power, Rewards |

### B. Trading Components (27 files)

**Priority Files:**

| Component | File | Currency Usage | Lines |
| --- | --- | --- | --- |
| **TradePanel** | `components/trading/trade-panel.tsx` | ✅ useCurrency Hook<br>- Amount input (L198)<br>- Fee display (L353)<br>- Liquidation price (L364) | 439 |
| **TradingPanel** | `components/trading/TradingPanel.tsx` | Price, Volume, Orders | 520 |
| **OrderBook** | `components/trading/OrderBook.tsx` | Bid/Ask prices | 380 |
| **confirm-modal** | `components/trading/confirm-modal.tsx` | Trade confirmation amount | 250 |
| **AccountPanel** | `components/trading/AccountPanel.tsx` | Account balance, Margin | 420 |

### C. Portfolio Components (13 files)

| Component | File | Currency Usage | Lines |
| --- | --- | --- | --- |
| **Positions** | `components/portfolio/positions.tsx` | ✅ useCurrency Hook<br>- Position size (L132)<br>- Entry/Current price (L137-142)<br>- Unrealized PnL (L148)<br>- Liquidation warning (L169) | 489 |
| **AccountSummary** | `components/portfolio/AccountSummary.tsx` | Total equity, Margin | 310 |
| **EarningsSummary** | `components/portfolio/EarningsSummary.tsx` | Profit summary | 280 |
| **CreatorEarnings** | `components/portfolio/CreatorEarnings.tsx` | Creator revenue | 260 |

### D. Index Display Components

| Component | File | Currency Usage | Lines |
| --- | --- | --- | --- |
| **CarouselIndexCard** | `components/landing/CarouselIndexCard.tsx` | ✅ useCurrency Hook<br>- Market Price (L103)<br>- NAV (L119)<br>- Volume (L148)<br>- TVL (L158) | 344 |
| **IndexDetailCard** | `components/discover/index-detail-card.tsx` | Same structure as above | 341 |
| **IndexDetailModal** | `components/modals/IndexDetailModal.tsx` | Detailed index info | 450 |

### E. Launch/Creation Components (7 files)

| Component | File | Currency Usage |
| --- | --- | --- |
| **ConfirmLaunchModal** | `components/launch/ConfirmLaunchModal.tsx` | Launch fees |
| **AssetPicker** | `components/launch/AssetPicker.tsx` | Asset prices |
| **IndexCreatorOverview** | `components/launch/IndexCreatorOverview.tsx` | AUM, Fee estimates |

### F. Settings Component

| Component | File | Status |
| --- | --- | --- |
| **PreferencesSection** | `components/settings/PreferencesSection.tsx` | ⚠️ **TO BE REMOVED**<br>Currency selector (L43-54)<br>7 currency options<br>LocalStorage + Zustand save |

---

### 1.4 Settings - Preferences Detail

### Current Implementation

**File:** `components/settings/PreferencesSection.tsx`

```tsx
// Line 43-54: Currency Selector (TO BE REMOVED)
<Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
  <SelectTrigger className="bg-slate-900 border-slate-700">
    <SelectValue placeholder="Currency" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="HYPE">HYPE (Default)</SelectItem>
    <SelectItem value="USD">USD</SelectItem>
    <SelectItem value="USDC">USDC</SelectItem>
    <SelectItem value="USDT">USDT</SelectItem>
    <SelectItem value="BTC">BTC</SelectItem>
    <SelectItem value="HIIN">$HIIN (Index Token)</SelectItem>
    <SelectItem value="HIDE">$HIDE (DEX Token)</SelectItem>
  </SelectContent>
</Select>

```

### Storage Mechanism

**3-Layer Storage:**

```tsx
// 1. Zustand Store (in-memory)
const { setCurrency } = useCurrencyStore()
setCurrency('USD') // Updates global state

// 2. LocalStorage (persistent)
SettingsStorage.savePreferences({
  theme, lang, currency, timefmt
})

// 3. Backend API (synced)
await savePreferences({
  theme, lang, currency, timefmt
})

```

**Current Flow:**

```
User clicks currency selector
         ↓
Zustand state updates
         ↓
LocalStorage saves
         ↓
Backend API syncs
         ↓
All components re-render with new currency
         ↓
Prices convert via exchange rates

```

---

# 레퍼런스

직접들어가서 확인했고, ai의 조사와 일치함을 교차검증함.

## 1. [axiom.trade](http://axiom.trade)

### Key Observations

**Reference Sections:**

- **Perpetuals Trading** → Collateral & PnL
- **Account Summary** → Total Value
- **Margin Info** → Available margin

**UX Pattern:**

```
┌─────────────────────────────────┐
│ Account Summary                 │
│ Total Value:    8,492.50 USDC   │  ← Always USDC
│ Margin Used:    2,145.00 USDC   │  ← Always USDC
│ Available:      6,347.50 USDC   │  ← Always USDC
│ Unrealized PnL: +342.18 USDC    │  ← Always USDC
└─────────────────────────────────┘

Settings:
✅ Leverage defaults
✅ Auto-close rules
❌ Currency unit selector    ← Does NOT exist

```

**Key Features:**

- ✅ USDC collateral-based system
- ✅ Stablecoin as reference
- ✅ Clear margin calculations
- ❌ No currency conversion needed

---

## 2. [pump.fun](http://pump.fun)

### Key Observations

**Reference Sections:**

- **Token Launch Page** → Market Cap & Volume
- **Trading View** → Price in SOL
- **Portfolio** → Holdings in SOL

**UX Pattern:**

```
┌─────────────────────────────────┐
│ BONK Token                      │
│ Price:        0.045 SOL         │  ← Always SOL
│ Market Cap:   1,234 SOL         │  ← Always SOL
│ 24h Volume:   567 SOL           │  ← Always SOL
│ Your Holdings: 10.5 SOL         │  ← Always SOL
└─────────────────────────────────┘

Settings:
✅ RPC endpoint
✅ Priority fees
❌ Currency unit selector    ← Does NOT exist

```

**Key Features:**

- ✅ SOL (native token) as single unit
- ✅ Solana ecosystem alignment
- ✅ No confusion in pricing
- ❌ No USD conversion

---

## 3. [app.hyperliquid.xyz/trade](http://app.hyperliquid.xyz/trade)

### Key Observations

**Reference Sections:**

- **Trading Interface** → Price & Volume display
- **Account Panel** → Balance display
- **Order Book** → Order prices
- **Portfolio View** → PnL calculation

**UX Pattern:**

```
┌─────────────────────────────────┐
│ BTC/USD                  $45,231│  ← Always USD
│ 24h Volume        $2.3B         │  ← Always USD
│ Your Balance      $10,250       │  ← Always USD
│ Unrealized PnL    +$523 (+5.1%) │  ← Always USD
└─────────────────────────────────┘

Settings:
✅ Slippage tolerance
✅ Order defaults
✅ Notification preferences
❌ Currency unit selector    ← Does NOT exist

```

**Key Features:**

- ✅ USD as single display unit
- ✅ All assets normalized to USD
- ✅ Simple, consistent UX
- ❌ No currency switching option

### 다만 수수료는 HYPE로 Swap하여 지불

---

### 레퍼런스 조사 결과

| Feature | Hyperliquid | pump.fun | axiom.trade |
| --- | --- | --- | --- |
| **Single Display Currency** | ✅ USD | ✅ SOL | ✅ USDC |
| **Currency Selector** | ❌ None | ❌ None | ❌ None |
| **Consistent Pricing** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Native Token Focus** | ✅ USD | ✅ SOL | ✅ USDC |

---

# 용이성의 근거

- 레퍼런스 탐색 결과, 탐색한 세 거래소 모두 가격/자산 크기/ 단일 화폐 단위로 구성, → 업계 표준이 단일 화폐인데, 굳이 preference에서 화폐단위를 조정하도록 편의를 부여하기에는 작업 시간 면에서 비효율적
- 현재 환율 계산 산식이 단순 peg 상태의 변수임. 1HYPE=$50 이런식임. 이미 작업 된 것이면 몰라도 업계 표준이 아닌 기능을 추가하는데 추가 작업이 필요하므로 폐기하는 것이 나은 판단

---

# 타 페이지 및 컴포넌트와의 관계성

**1. Trading 페이지**

- 거래 패널의 금액/잔액/가격 표시 부분 → API 함수로 전환

- 수수료 계산 부분 → calculateTradingFee() 사용

- 거래 실행 버튼 → executeTrade() 연결

**2. Portfolio 페이지**

- 모든 화폐단위 표시하는 부분 (잔액, 자산, PnL) → HYPE 고정

- 활성 포지션 목록 → fetchActivePositions() 호출

- 계정 요약 섹션 → fetchAccountEquity() 사용

**3. Discover 페이지**

- 모든 인덱스 카드의 가격 표시 → fetchIndexPrice() 실시간 조회

- 24시간 거래량/TVL 표시 → Mock 데이터 유지 (Phase 0에서는 OK)

**4. Launch 페이지**

- 인덱스 생성 수수료 계산 → calculateLaunchFee() 사용

- 화폐 선택 드롭다운 → Phase 0에서는 HYPE만 표시

**5. Settings 페이지**

- 통화 선택 섹션 전체 삭제 (42-55줄)

- Time Format 선택만 남김

# 상세 계획 - 실행 절차

1. Settings - Preferences 제거
2. 화폐단위 수정이 있던 부분에서 빼먹은 부분 없는지 사이트 전역 검사 본인 손으로 시행, AI 의존 x
3. 어느 부분에서 수정이 있었고 지금 어디를 다시 수정할 계획인지 (둘의 범위 같음) 적기 
→ trading: fetchUserBalance(), fetchIndexPrice(), executeTrade()
portfolio: fetchActivePositions(), fetchAccountEquity()
Discover: fetchIndexPrice()
Launch: calculateLaunchFee()
위의 네 페이지에서 여러 화폐단위로 변환가능한 변수를 HYPE로 고정하고, 백엔드만 연결되면 실제 데이터를 실시간 HYPE 단위로 나타내게끔 작업
4. 수수료 포함 모든 화폐변수들 변수 제거, 단일 변수 함수로 HYPE 고정
5. 수수료는 추후 HIIN & HIDE 단위 추가 (변환 계산식 넣어서)

AI 복붙문서(참고용)

[CURRENCY_SYSTEM_REFACTORING](2025OCT04%20Task%20Plan%20-%20Currency%20&%20Preferences/CURRENCY_SYSTEM_REFACTORING%20298944d7795680e89c15f1c38f804b2f.md)