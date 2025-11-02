# 2025NOV01 Task Plan - Y Combinator Demo Product

Created: 2025-11-02
Category: Demo Product Development
Project: HyperIndex YC Demo

---

## Overview

Y Combinator 데모 영상을 위한 독립 프로젝트 구성. Trading, Launch, Manage Index 3개 페이지를 중심으로 실제 사용 가능한 프로토타입 제작. 개발 완성도보다는 **시연 가능성**과 **시각적 완성도**에 집중.

**핵심 목표:**
- 비개발자도 이해 가능한 명확한 UX
- 입력값에 반응하는 동적 계산 (하드코딩 최소화)
- 실제 거래소 수준의 정보 밀도와 전문성
- 5-10분 데모 영상에서 핵심 기능 모두 시연 가능

---

# UX or 세부 컴포넌트 항목

## 1. Trading Page - Index Trading Interface

### Core UX Elements

**1.1 Information Hierarchy (Top → Bottom)**
- **IndexInfoBar** (최상단): 현재 거래 중인 인덱스 핵심 정보 (가격, 24h 변동, 거래량, 시총)
  - 이유: 거래 맥락을 잃지 않도록 sticky header로 항상 표시

- **ChartArea** (좌측 상단 68.75%): TradingView 스타일 차트
  - 시간프레임 선택, 기술적 지표, 드로잉 툴
  - 이유: 차트는 거래 의사결정의 핵심이므로 최대 면적 할당

- **OrderBookTrades** (우측 상단 31.25%): 실시간 호가창 + 체결내역
  - Binance 스타일 통합 뷰 (탭 전환 없이 한 화면에)
  - 이유: 시장 심도와 실시간 거래 흐름을 동시에 파악

- **TradingPanelSimple** (우측 전체 20%): 거래 실행 패널
  - Buy/Sell 토글, 레버리지 슬라이더, 사이즈 입력
  - 예상 PnL, 청산가, 수수료 실시간 계산
  - 이유: 핵심 거래 기능만 노출, 복잡도 제거

- **PresetPanel** (우측 중간): 거래 프리셋 (Quick 5x Long, 10x Short 등)
  - 이유: 데모에서 빠른 거래 시연을 위한 원클릭 설정

- **WhaleAlert** (우측 하단): 고래 거래 알림
  - 대량 거래 실시간 피드
  - 이유: 시장 움직임의 맥락 제공, 전문성 강조

- **TradingBottomTabs** (하단): Account / Positions / Orders / History
  - 이유: 거래 실행 후 포지션 확인 필수, 하단에 배치하여 주요 거래 영역 방해하지 않음

**1.2 Interactive Elements (Dynamic Calculation)**
- **TradingPanel 입력값 → 실시간 계산:**
  - Position Size × Leverage × Entry Price = Total Position Value
  - Liquidation Price = Entry ± (Entry / Leverage)
  - Estimated PnL based on current mark price
  - Trading fees: 0.05% maker, 0.07% taker (실제 Hyperliquid 수준)

- **OrderBook 클릭 → 가격 자동 입력:**
  - 호가창 클릭 시 해당 가격이 거래 패널에 자동 반영
  - 이유: 수동 입력 오류 방지, 빠른 거래 실행

**1.3 Hardcoded Elements (Non-Interactive)**
- Recent Trades feed (static history)
- Top Traders list (fixed rankings)
- Community Feed (static posts)
- Whale Alert transactions (pre-defined large trades)
- 이유: 데모에서 직접 조작하지 않는 부분, 실시간 API 없이 풍부한 컨텍스트 제공

---

## 2. Launch Page - Index Creation Wizard

### Core UX Elements

**2.1 Three-Column Layout**

**Column 1: Basics (33%)**
- Index Name (min 3 chars)
- Ticker Symbol (3-8 chars, alphanumeric + dash)
- Description (min 10 chars)
- Social Link (optional)
- 이유: 간단한 메타데이터부터 입력, 좌→우 진행 흐름

**Column 2: Components (33%)**
- Asset Search Bar
- Selected Assets List (cards with remove button)
  - Each card shows: Symbol, Name, Side (Long/Short), Leverage (1-50x)
  - Spot assets: Side=Long, Leverage=1x (disabled)
  - Perp assets: Side + Leverage adjustable
- Portfolio Composition Sliders
  - Per-asset allocation percentage (totals 100%)
  - Real-time HYPE amount calculation per asset
- 이유: 인덱스 구성의 핵심, 시각적 피드백 중요

**Column 3: Preview (33%)**
- Real-time Performance Chart (1H / 1D)
  - API endpoint: `/api/baskets/calculate`
  - Basket price history based on weighted asset candles
- Layer-3 Launch Info Card
  - Target Raise: $250K HYPE
  - Timeline: 14-30 days
  - Creator Fee: 0.02% $HIIN
- 이유: 구성 변경 시 즉각적인 성능 시뮬레이션, 의사결정 지원

**2.2 Validation & Error Handling**
- **Basics validation:**
  - Name: min 3 chars
  - Ticker: 3-8 chars, regex `/^[A-Z0-9-]+$/`
  - Description: min 10 chars
  - Red border + error message on invalid input

- **Components validation:**
  - Minimum 2 assets required
  - Total allocation must = 100% (±0.1% tolerance)
  - Auto-fix button: distributes equally when off-balance
  - Minimum investment: 100 HYPE

- **Launch button state:**
  - Disabled until all validations pass
  - Tooltip shows specific missing requirement
  - 이유: 데모에서 에러 상황 방지, 명확한 피드백

**2.3 Interactive Elements (Dynamic Calculation)**
- **Asset selection → Auto-allocation:**
  - New asset added → Equal distribution among all assets
  - Asset removed → Re-distribute to remaining assets

- **Allocation slider → Amount update:**
  - Percentage × Total Investment = HYPE amount per asset
  - Real-time display: "25% → 250.00 HYPE"

- **Preview chart update:**
  - Debounced API call on allocation change (500ms delay)
  - Fetches historical basket performance
  - Falls back to mock data on API error

**2.4 Hardcoded Elements**
- Active Layer-3 Launches section (3 example cards)
  - Bonding phase progress bars
  - Static time left counters
  - 이유: 컨텍스트 제공, 실제 API 없이 활성 시장 분위기 연출

---

## 3. Manage Index Page - Governance & Rebalancing

### Core UX Elements

**3.1 Four Main Sections (Vertical Stack)**

**Section 1: GovernanceDashboard** (상단)
- Total Voting Power, Active Proposals, Participation Rate
- My Voting Power display
- 이유: 거버넌스 참여 현황 한눈에 파악

**Section 2: ProposalsSection** (중간 상단)
- Governance proposal cards (protocol changes, fee adjustments, etc.)
- Each card: Title, Description, Status, Vote counts, Time left
- Vote dialog: For/Against/Abstain with voting power input
- 이유: 전통적인 DAO 거버넌스 구조, 명확한 투표 인터페이스

**Section 3: RebalancingVotesSection** (중간 하단)
- Index composition changes based on performance
- Current composition table (asset, %, 7d performance)
- Proposed changes:
  - **Remove**: Asset underperforming → 0%
  - **Add**: New asset with strong metrics → X%
  - **Adjust**: Increase/decrease existing allocation
- Vote on individual changes or combinations
- Progress bars show community consensus (threshold: 55-65%)
- 이유: 성과 기반 자동 리밸런싱 제안, 커뮤니티 승인 필요

**Section 4: VsBattleSection** (하단)
- Head-to-head asset battles within same index
- Example: DOGE vs. SHIB in Dog Memes Index
- Visual battle card with vote counts and percentages
- Winner gets increased allocation, loser gets decreased
- Time-limited voting (6-48 hours)
- 이유: 게임화된 거버넌스, 참여 유도, Polymarket 스타일

**3.2 Interactive Elements (Dynamic Calculation)**
- **Vote submission → Progress update:**
  - User votes with X voting power
  - Total votes += X
  - Percentage = (Votes / Total Voting Power) × 100
  - Progress bar updates in real-time

- **Rebalancing multi-vote:**
  - User can vote for multiple proposed changes
  - Each change tracked independently
  - UI shows "You voted for: SHIB removal, WIF increase (+15%)"

- **VS Battle voting:**
  - Click Asset A or B
  - Vote power distributes to chosen side
  - Real-time percentage update: "DOGE 56% vs. SHIB 44%"

**3.3 Hardcoded Elements**
- Proposal descriptions and details (static text)
- Historical voting results (past proposals)
- Next rebalancing schedule dates
- 이유: 데모에서 조작하지 않는 정보성 컨텐츠

---

# 레퍼런스

## Trading Page References

### 1. Hyperliquid (Primary Reference)
**Analyzed Features:**
- Clean, dark theme with high information density
- Single-page layout: Chart + OrderBook + Trading Panel
- No unnecessary navigation, focus on execution
- Real-time WebSocket updates for orderbook
- TradingView advanced charts integration

**What We Adopted:**
- Overall layout structure (left: chart, right: trading)
- Dark theme with accent color (#98FCE4 for us)
- Sticky index info bar at top
- Minimal chrome, maximum content

**What We Rejected:**
- Their extremely compact UI (too advanced for demo)
- Multi-tab trading interface (confusing for newcomers)

### 2. Binance Futures
**Analyzed Features:**
- Integrated orderbook + recent trades in one panel
- Trading panel with leverage slider (1-125x)
- Real-time PnL calculation display
- Bottom tabs for account/positions/orders

**What We Adopted:**
- OrderBookTrades combined view (reduces tab switching)
- Leverage slider with numeric input
- Real-time calculation feedback
- Bottom tabs pattern for portfolio management

**What We Rejected:**
- Complex order types (limit/market/stop is enough for demo)
- Overwhelming amount of trading pairs sidebar

### 3. dYdX v4
**Analyzed Features:**
- Perpetual DEX trading interface
- Clear liquidation price display
- Account overview in trading panel
- Clean order history table

**What We Adopted:**
- Liquidation price calculation and display
- Clear risk indicators (% to liquidation)
- Simplified order types

**What We Rejected:**
- Layer-2 gas cost displays (not relevant for us)
- Complex order routing options

---

## Launch Page References

### 1. Balancer v2 Pool Creation
**Analyzed Features:**
- Multi-asset pool creation wizard
- Weight sliders with percentage display
- Real-time pool composition visualization
- Validation at each step

**What We Adopted:**
- Multi-column wizard layout
- Weight sliders with auto-balancing
- Real-time validation feedback
- Progressive disclosure (Basics → Components → Preview)

**What We Rejected:**
- Their pie chart visualization (confusing with many assets)
- Advanced pool parameters (AMM curves, fees)

### 2. Uniswap v3 Position Creation
**Analyzed Features:**
- Simple two-asset interface
- Clear fee tier selection
- Price range selection for concentrated liquidity

**What We Adopted:**
- Clear fee display (our 0.02% $HIIN launch fee)
- Visual feedback on asset selection
- Disabled state for incomplete forms

**What We Rejected:**
- Price range complexity (not applicable to index)
- Their minimalist design (we need more info density)

### 3. Indexed Finance Create Index
**Analyzed Features:**
- Index creation specifically for crypto
- Asset weighting interface
- Rebalancing period settings

**What We Adopted:**
- Asset search and selection pattern
- Portfolio composition sliders
- Performance preview concept

**What We Rejected:**
- Their complex rebalancing settings (too technical)
- Lack of visual feedback

---

## Manage Index Page References

### 1. Snapshot (DAO Governance)
**Analyzed Features:**
- Proposal listing with status badges
- For/Against/Abstain voting
- Voting power display
- Time-based voting periods
- Quorum requirements

**What We Adopted:**
- Proposal card design
- Vote dialog pattern
- Clear voting power indication
- Time remaining countdown

**What We Rejected:**
- Their text-heavy proposal format
- Lack of visual engagement

### 2. Compound Governance
**Analyzed Features:**
- Protocol parameter voting
- Delegate system
- Execution timelock
- Proposal history

**What We Adopted:**
- Governance dashboard with key metrics
- Proposal status workflow
- Clear threshold requirements

**What We Rejected:**
- Delegation complexity (not needed for demo)
- Technical proposal details (too complex)

### 3. Polymarket (VS Battles Inspiration)
**Analyzed Features:**
- Binary outcome markets
- Visual percentage displays
- Real-time odds updates
- Time-limited betting

**What We Adopted:**
- Head-to-head voting UI
- Visual battle cards with percentages
- Urgency through countdown timers
- Gamification of governance

**What We Rejected:**
- Their market creation complexity
- Resolution mechanisms (we auto-apply results)

### 4. Index Coop Rebalancing
**Analyzed Features:**
- Performance-based rebalancing proposals
- Asset add/remove voting
- Weight adjustment proposals

**What We Adopted:**
- Rebalancing vote structure
- Current vs. proposed composition display
- Performance metrics (7d returns)

**What We Rejected:**
- Their lack of visual engagement
- Complex DeFi integrations

---

# 용이성의 근거

## Adopted Approach: Standalone Demo Project (YCOMDEMO Folder)

### Why This Approach?

**1. Isolation from Development Branch**
- Main repo continues development without demo constraints
- Demo-specific hardcoding doesn't pollute production codebase
- Can optimize purely for video recording (no performance concerns)

**2. Deployment Independence**
- Can be deployed to separate URL for YC reviewers to test
- No risk of demo breaking from ongoing development
- Version control: demo state frozen for application period

**3. Faster Iteration**
- Remove unused pages/features
- Hardcode non-essential data without guilt
- No need to maintain backward compatibility

**4. Clear Handover**
- Self-contained project with HANDOVER.md
- Can be passed to another developer easily
- All dependencies explicitly listed

### Rejected Alternative #1: Feature Branch in Main Repo

**Why Rejected:**
- Demo changes would need careful merging back
- Risk of demo-specific code leaking to production
- Harder to maintain separate deployment
- Merge conflicts with ongoing development

**Technical Reasons:**
- Main repo has 14 pages, demo only needs 3
- Would require conditional rendering everywhere
- Git history pollution with "demo only" commits

### Rejected Alternative #2: Separate Git Repository

**Why Rejected:**
- Would need to manually copy all shared components
- Harder to pull updates from main repo if needed
- More complex setup process
- Loses connection to main codebase

**Practical Reasons:**
- YCOMDEMO folder approach keeps both codebases accessible
- Can copy-paste fixes between folders easily
- Easier for single developer to manage

---

## Trading Page UX Decisions

### Adopted: Single-Page Layout (No Tabs)

**Why Better:**
- All critical info visible simultaneously (chart, orderbook, trading)
- No context switching during trading
- Matches professional trader expectations (Hyperliquid, Binance)

**UX Principle:** Minimize cognitive load during high-stakes decisions

### Rejected Alternative: Multi-Tab Interface

**Why Rejected:**
- Tab switching breaks flow
- Can't monitor chart while entering order
- Beginner-friendly but limits power users

**Example:** Some DEXs hide orderbook in separate tab → traders miss market depth

---

### Adopted: Integrated OrderBook + Recent Trades

**Why Better:**
- Single scrollable view shows both market depth and execution flow
- Space-efficient for 31.25% width panel
- Binance pattern (proven UX)

**Trade-off:** Less detail per row, but demo doesn't need full precision

### Rejected Alternative: Separate Tabs for OrderBook / Trades

**Why Rejected:**
- Forces user to choose one view
- Misses correlation between orderbook walls and large trades
- Extra click to switch tabs

---

### Adopted: Real Wallet (Privy) with Real Connection

**Why Better:**
- Demonstrates actual product functionality
- Wallet balance, network switching all work
- More impressive in demo video (authentic)

**Risk Mitigation:** Use testnet or pre-fund demo wallet with known amount

### Rejected Alternative: Mock Wallet with Hardcoded Balance

**Why Rejected:**
- Looks fake in close-up recording
- Can't demonstrate wallet integration (core feature)
- YC reviewers may test post-video → would notice

---

## Launch Page UX Decisions

### Adopted: Three-Column Progressive Wizard

**Why Better:**
- Left → Right visual flow (Basics → Components → Preview)
- All steps visible, no hidden progress
- Can jump back to edit previous sections
- Real-time preview updates as you build

**UX Principle:** Show the whole journey, not just current step

### Rejected Alternative: Multi-Step Wizard with Next/Back Buttons

**Why Rejected:**
- Hides context from previous steps
- Forces linear progression (can't fix earlier mistake without backing out)
- Preview chart hidden until final step (no early feedback)

**Example Issue:** User picks 5 assets, reaches preview, chart shows bad performance → must click Back 2 times to change assets

---

### Adopted: Auto-Balance Allocations on Asset Add/Remove

**Why Better:**
- Prevents "allocation totals 83%" frustration
- User can then fine-tune from equal split
- Reduces errors in demo recording

**Calculation:** New asset → divide 100% by (N assets) → round last to hit exactly 100%

### Rejected Alternative: Manual Allocation Only

**Why Rejected:**
- User must manually distribute 100% among N assets
- Easy to make math error
- Slows down demo video
- Not differentiating feature

---

### Adopted: Real Basket Calculation API with Fallback

**Why Better:**
- Shows actual basket performance (impressive)
- Falls back to mock data on API error (reliable)
- Demonstrates technical capability

**API:** `/api/baskets/calculate`
- Input: assets, weights, timeframe
- Output: weighted basket price history

### Rejected Alternative: Hardcoded Chart Data Only

**Why Rejected:**
- Doesn't respond to asset selection
- Looks fake when same chart appears regardless of inputs
- Misses opportunity to show technical depth

**Implementation Note:** API may fail due to rate limits → fallback ensures demo always works

---

## Manage Index Page UX Decisions

### Adopted: Four Sections in One Page (Dashboard, Proposals, Rebalancing, VS Battles)

**Why Better:**
- Shows breadth of governance features
- User scrolls down to discover all capabilities
- Each section visually distinct (different data types)

**Trade-off:** Long page, but demo video can selectively scroll to relevant sections

### Rejected Alternative: Separate Pages for Each Governance Type

**Why Rejected:**
- Fragmented experience (what's on each page?)
- More navigation in demo video (wastes time)
- Harder to see relationship between governance types

**Example:** Rebalancing vote → see VS Battle for same index → understand connection

---

### Adopted: Rebalancing with Per-Change Voting

**Why Better:**
- User can approve some changes, reject others
- Mirrors real-world governance nuance ("remove SHIB ✓, but don't add BRETT ✗")
- More engaging than binary approve/reject whole proposal

**UX Pattern:** Checkboxes for multi-select → Submit Votes button

### Rejected Alternative: Vote on Entire Rebalancing Package

**Why Rejected:**
- User may agree with 2/3 changes but forced to reject all
- Less granular control
- Doesn't showcase sophisticated governance

---

### Adopted: VS Battles as Gamified Governance

**Why Better:**
- Engaging, visual, easy to understand
- Appeals to crypto-native users (familiar with Polymarket)
- Differentiates from boring DAO UIs
- Good for demo video (exciting moment)

**Design:** Large battle card, A vs. B, click to vote, percentages update

### Rejected Alternative: Traditional Proposal Text for Asset Changes

**Why Rejected:**
- Boring, looks like every other DAO
- Harder to explain in demo ("this proposal modifies weight vector...")
- Less memorable

**Inspiration:** Polymarket's success shows users love binary betting UX

---

### Adopted: Real-Time Vote Counting with Progress Bars

**Why Better:**
- Immediate feedback on vote submission
- Visual progress toward threshold (55-65%)
- Creates urgency ("we're almost at quorum!")

**Calculation:** (Total Votes / Total Voting Power) × 100 = Progress %

### Rejected Alternative: Vote Results Hidden Until End

**Why Rejected:**
- Less engaging (submit and wait)
- No sense of participation impact
- Can't see if your vote mattered

---

# 타 페이지 및 컴포넌트와의 관계성

## Global Component Dependencies

### Header Component
**Used by:** All 3 pages
**Props:** None (global navigation)
**State:** Wallet connection status, network selection
**Features:**
- Logo (links to home)
- Navigation: Trading, Launch, Manage Index, Portfolio, etc.
- Wallet Connect button (Privy)
- Network selector (Hyper Mainnet / Testnet)

**Relationship:**
- Trading page: wallet balance affects trading panel (max buy)
- Launch page: wallet balance affects launch button (sufficient funds?)
- Manage Index: wallet determines voting power

---

### LeftSidebar Component
**Used by:** All 3 pages
**Content:**
- Index list (trending, top volume)
- Layer badges (L1/L2/L3)
- Quick filters (Memes, AI, Gaming)

**Relationship:**
- Trading page: clicking index → loads that index in trading view
- Launch page: browse existing indexes for inspiration
- Manage Index: filter to indexes you hold (governance eligible)

**State Management:** Zustand `tradingStore`
- Current selected index
- Index list data
- Layer filter state

---

### Wallet Components (`/components/wallet/`)
**Files:** 15 files (WalletConnectButton, WalletDropdown, NetworkDisplay, etc.)
**Provider:** PrivyProvider wraps entire app
**State:**
- Connected address
- Network (Hyper Mainnet/Testnet)
- Balance (HYPE, HIIN)

**Relationships:**
- **Trading page:** Checks balance before allowing trades, shows max size based on balance
- **Launch page:** Checks HYPE balance for investment, shows HIIN balance for fee payment
- **Manage Index:** Wallet address determines voting power (based on index token holdings)

**Implementation Note:** Privy handles all wallet connection logic, we just read state

---

## Page-Specific Component Dependencies

### Trading Page Component Tree

```
TradingLayout (root)
├── IndexInfoBar
│   └── (fetches from tradingStore)
├── ChartArea
│   ├── Chart component (TradingView or Lightweight Charts)
│   └── Timeframe selector
├── OrderBookTrades
│   ├── OrderBook component
│   └── RecentTrades component
├── TradingPanelSimple
│   ├── Buy/Sell toggle
│   ├── Leverage slider
│   ├── Size input
│   ├── PnL calculation display
│   └── Submit order button
├── PresetPanel
│   └── Quick trade buttons
├── WhaleAlert
│   └── Large trade feed
└── TradingBottomTabs
    ├── AccountPanel
    ├── Positions table
    ├── Orders table (open/history)
    └── Trade history
```

**State Flow:**
1. User selects index in LeftSidebar
2. `tradingStore.setCurrentIndex()` updates
3. IndexInfoBar, ChartArea, OrderBook all read from same store
4. User enters trade in TradingPanelSimple
5. On submit, updates AccountPanel and Positions in BottomTabs

**Shared State:** `lib/store/trading-store.ts`
- currentIndex
- selectedTimeframe
- orderbook data
- recent trades
- user positions

---

### Launch Page Component Tree

```
LaunchIndexPage (root)
├── Basics (Column 1)
│   ├── Name input
│   ├── Ticker input
│   ├── Description textarea
│   └── Social link input
├── Components (Column 2)
│   ├── Asset search input
│   ├── Asset results dropdown
│   ├── Selected assets list
│   │   └── Asset cards (with remove)
│   └── Portfolio composition
│       ├── Per-asset sliders
│       └── Total investment input
├── Preview (Column 3)
│   ├── Performance chart
│   └── Launch info card
├── Launch Summary (full width)
│   ├── Cost display
│   └── Launch button
├── LaunchedIndexes (from /components/portfolio/)
│   └── User's previously launched indexes
└── Modals
    ├── ConfirmLaunchModal
    └── LaunchSuccessModal
```

**State Flow:**
1. User fills Basics → validates → enables Components section
2. User searches assets → clicks to add → auto-allocates weights
3. User adjusts sliders → debounced API call updates Preview chart
4. User clicks Launch → shows ConfirmLaunchModal
5. Confirm → saves to localStorage → shows LaunchSuccessModal

**Shared State:** Local React state (useState)
- No global store (page-specific data)
- localStorage for launched indexes persistence

**API Dependencies:**
- `/api/launch/assets` - fetch available assets
- `/api/baskets/calculate` - preview chart data

---

### Manage Index Page Component Tree

```
ManageIndexPage (root)
└── GovernanceLayout
    ├── GovernanceDashboard
    │   ├── Total voting power card
    │   ├── Active proposals count
    │   └── Participation rate
    ├── ProposalsSection
    │   ├── Proposal filters
    │   └── ProposalCard (multiple)
    │       └── VoteDialog (modal)
    ├── RebalancingVotesSection
    │   ├── Section header
    │   ├── Ending soon badge (if any)
    │   └── RebalancingVoteCard (multiple)
    │       ├── Current composition table
    │       ├── Proposed changes list
    │       └── Vote checkboxes + submit
    └── VsBattleSection (moved from /discover/)
        ├── Section header
        └── BattleCard (multiple)
            ├── Asset A (symbol, votes, %)
            ├── vs. divider
            ├── Asset B (symbol, votes, %)
            └── Vote buttons
```

**State Flow:**
1. User scrolls page to view different governance types
2. User clicks "Vote" on proposal → VoteDialog opens
3. User selects For/Against → submits → updates proposal vote count
4. User checks multiple rebalancing changes → submits all at once
5. User clicks asset in VS Battle → vote allocated → percentages update

**Shared State:** `lib/store/governance-store.ts`
- proposals list
- user's votes
- rebalancing votes
- voting power

**Mock Data:** `components/governance/RebalancingVotesSection.tsx` (inline)
- Can be extracted to `lib/mock/governance.ts` if needed

---

## Cross-Page Component Reuse

### UI Library Components (`/components/ui/`)
**Shared by all pages:**
- Button, Input, Card, Badge, Dialog, Tabs, etc. (120+ components)
- Consistent design system across pages
- Radix UI primitives + shadcn styling

**Example:** `Button` component used in:
- Trading: "Buy"/"Sell" buttons
- Launch: "Launch", "Auto-Balance", "Remove" buttons
- Manage Index: "Vote", "View Proposal" buttons

### Magic UI Effects (`/components/magicui/`)
**Visual enhancements:**
- BorderBeam on cards (Launch page, Manage Index cards)
- Ripple effect on buttons (Trading panel buy/sell)
- ShimmerButton for primary CTAs
- Particles background (optional on demo)

**Usage:** Sparingly to avoid distraction, enhance key moments

---

## State Management Architecture

### Zustand Stores

**1. `trading-store.ts`**
- Current index, timeframe
- Orderbook data
- User positions
- Used by: Trading page only

**2. `currency-store.ts`**
- Display currency (USD/HYPE/HIIN)
- Conversion rates
- Used by: All pages (header balance, prices)

**3. `governance-store.ts`**
- Proposals, votes
- User voting power
- Used by: Manage Index page only

**4. `notifications-store.ts`**
- Toast notifications
- Trade confirmations, vote success, etc.
- Used by: All pages

**5. `price-alerts.ts`**
- User-set price alerts for indexes
- Used by: Trading page

### Local Storage

**`launched-indexes` key:**
- Stores user's created indexes from Launch page
- Read by: LaunchedIndexes component (in Launch page)
- Read by: Portfolio page (not in demo)

**Format:**
```typescript
{
  id: string,
  name: string,
  symbol: string,
  assets: Asset[],
  launchedAt: ISO date,
  status: 'bonding' | 'funding' | 'lp' | 'graduated'
}[]
```

---

## API Route Dependencies

### Trading Page APIs
- None (uses mock data for demo)
- In production: `/api/trading/orderbook`, `/api/trading/trades`

### Launch Page APIs
- `/api/launch/assets` - GET list of tradeable assets
- `/api/baskets/calculate` - POST basket performance calculation

### Manage Index Page APIs
- None (uses mock data inline)
- In production: `/api/governance/proposals`, `/api/governance/vote`

### Shared APIs
- `/api/auth/*` - Privy authentication routes
- `/api/user/profile` - User data (not used in demo)

---

## Data Flow Example: Launch → Trading

**Scenario:** User creates "AI Memes 5x" index, then goes to trade it

1. **Launch page:**
   - User configures index, clicks Launch
   - Saves to localStorage: `launched-indexes`
   - Shows success modal with "Go to Trading" button

2. **Navigation:**
   - User clicks "Go to Trading" or navigates manually
   - Trading page loads

3. **Trading page:**
   - LeftSidebar reads from `tradingStore.indexes` (includes all indexes)
   - **Problem:** Newly launched index not in mock data yet

**Demo Solution:**
- Pre-add "AI Memes 5x" to mock index list in `lib/data/mock-indexes.ts`
- Or dynamically merge localStorage indexes into sidebar list
- Or show "Your Indexes" section in sidebar that reads localStorage

**For Demo Video:**
- Simpler to pre-add to mock data
- User "launches" index that already exists in trading page
- Creates illusion of integration

---

## Component Dependency Graph (Simplified)

```
All Pages
├── Header (global nav, wallet)
├── LeftSidebar (index list)
└── Footer (desktop only)

Trading Page
├── TradingLayout
│   ├── IndexInfoBar ──> tradingStore
│   ├── ChartArea ──> tradingStore
│   ├── OrderBookTrades ──> tradingStore
│   ├── TradingPanelSimple ──> tradingStore, wallet
│   ├── PresetPanel ──> tradingStore
│   ├── WhaleAlert ──> mock data
│   └── TradingBottomTabs ──> tradingStore, wallet
└── UI components (Button, Input, Card, etc.)

Launch Page
├── LaunchIndexPage (local state)
│   ├── Asset search ──> /api/launch/assets
│   ├── Allocation sliders ──> local calculation
│   ├── Preview chart ──> /api/baskets/calculate
│   └── LaunchedIndexes ──> localStorage
├── ConfirmLaunchModal
├── LaunchSuccessModal
└── UI components

Manage Index Page
├── GovernanceLayout
│   ├── GovernanceDashboard ──> governanceStore
│   ├── ProposalsSection ──> governanceStore
│   │   └── VoteDialog ──> governanceStore
│   ├── RebalancingVotesSection ──> governanceStore
│   │   └── RebalancingVoteCard ──> local state
│   └── VsBattleSection ──> governanceStore
│       └── BattleCard ──> local state
└── UI components

Shared Dependencies
├── Wallet (Privy) ──> all pages
├── Currency Store ──> all pages (prices)
├── Notifications Store ──> all pages (toasts)
└── UI Library ──> all pages
```

---

## Integration Points for Demo

### Critical Integration: Wallet → All Pages
- Wallet connection enables trading, launching, voting
- Demo must show: connect wallet → interact with features
- Pre-connect wallet before recording to save time

### Nice-to-Have Integration: Launch → Trading
- As described above, requires pre-adding to mock data
- Or accept that launched index appears in "My Indexes" section only

### No Integration Needed: Trading ↔ Manage Index
- Independent features
- User can trade index and vote on governance separately
- No data flow between pages

---

# 상세 계획 - 실행 절차

## Phase 1: Create YCOMDEMO Folder Structure

### Step 1.1: Create Root Folder
```bash
cd /Users/kimhyeon/Desktop/PROJECTS/
mkdir YCOMDEMO
cd YCOMDEMO
```

### Step 1.2: Copy Core Directories
```bash
# From Cryptoindex-V0 to YCOMDEMO
cp -r ../Cryptoindex-V0/app ./app
cp -r ../Cryptoindex-V0/components ./components
cp -r ../Cryptoindex-V0/lib ./lib
cp -r ../Cryptoindex-V0/hooks ./hooks
cp -r ../Cryptoindex-V0/public ./public
```

### Step 1.3: Copy Configuration Files
```bash
cp ../Cryptoindex-V0/package.json ./
cp ../Cryptoindex-V0/pnpm-lock.yaml ./
cp ../Cryptoindex-V0/next.config.mjs ./
cp ../Cryptoindex-V0/tailwind.config.ts ./
cp ../Cryptoindex-V0/tsconfig.json ./
cp ../Cryptoindex-V0/postcss.config.mjs ./
cp ../Cryptoindex-V0/components.json ./
cp ../Cryptoindex-V0/components.aceternity.json ./
cp ../Cryptoindex-V0/components.hybrid.json ./
cp ../Cryptoindex-V0/.gitignore ./
cp ../Cryptoindex-V0/.env.local ./
```

**Note:** `.env.local` must be copied manually with valid Privy credentials

---


## Phase 1.5: Sidebar Removal & Footer Enhancement

**Priority**: HIGHEST - UI/UX 최우선 작업

### Overview
Remove LeftSidebar and migrate essential information (Market Overview, Price Alerts) to Footer. Portfolio and Top Gainers sections will be removed entirely.

### Step 2.1: Remove LeftSidebar Component

**Files to modify:**
1. `app/trading/page.tsx`
2. `app/launch/page.tsx`
3. `app/governance/page.tsx` (later renamed to manage-index)

**Action**: Remove LeftSidebar import and component usage

```typescript
// BEFORE
import LeftSidebar from '@/components/sidebar/LeftSidebar'

<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3">
  <div><LeftSidebar /></div>
  <div>{/* Main content */}</div>
</div>

// AFTER
<div className="w-full max-w-7xl mx-auto">
  {/* Main content full width */}
</div>
```

### Step 2.2: Add Market Overview to Footer

**File**: `components/layout/Footer.tsx` (or create if doesn't exist)

**Layout Structure**:
```
[Network Info] | [Market Overview] | [Price Alerts Icon]
```

**Implementation**:
```typescript
// Footer.tsx
<footer className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 px-6 py-2">
  <div className="flex items-center gap-4 text-sm">
    {/* Existing Network Info */}
    <div className="flex items-center gap-2">
      <span className="text-brand-primary font-medium">Network</span>
      <span className="text-slate-400">|</span>
      <span className="text-slate-300">146 ms</span>
      <span className="text-slate-400">|</span>
      <span className="text-slate-300">21,000,001</span>
    </div>

    <span className="text-slate-600">|</span>

    {/* NEW: Market Overview */}
    <div className="flex items-center gap-2">
      <span className="text-brand-primary font-medium">Market Overview</span>
      <span className="text-slate-400">|</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-slate-300 hover:text-white cursor-help">
            Vol 24h ({formatNumber(marketData.volume24h)} HYPE)
          </TooltipTrigger>
          <TooltipContent>
            Total trading volume in last 24 hours
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-slate-400">|</span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-slate-300 hover:text-white cursor-help">
            IDX ({marketData.activeIndexes})
          </TooltipTrigger>
          <TooltipContent>
            Number of active indexes
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-slate-400">|</span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-slate-300 hover:text-white cursor-help">
            24h TVL ({formatNumber(marketData.tvl24h)} HYPE)
          </TooltipTrigger>
          <TooltipContent>
            Total value locked across all indexes
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <span className="text-slate-600">|</span>

    {/* NEW: Price Alerts Popover */}
    <PriceAlertsPopover />
  </div>
</footer>
```

### Step 2.3: Create Price Alerts Popover Component

**File**: `components/layout/PriceAlertsPopover.tsx` (new file)

**Features**:
- Popover (not modal) triggered by icon click
- Positioned above the icon
- Shows list of active price alerts
- Add new alert functionality

```typescript
'use client'

import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function PriceAlertsPopover() {
  const alerts = [] // Get from store

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white">
          <Bell className="w-4 h-4" />
          Price Alerts
          {alerts.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {alerts.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 bg-slate-900 border-slate-700"
        align="end"
        side="top"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Price Alerts</h3>
            <Button variant="ghost" size="sm">+ Add Alert</Button>
          </div>

          {alerts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No active alerts. Create your first alert.
            </p>
          ) : (
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="p-2 rounded bg-slate-800 border border-slate-700">
                  {/* Alert item content */}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

### Step 2.4: Mock Market Data

**File**: `lib/data/market-overview.ts` (new file)

```typescript
export const marketOverview = {
  volume24h: 12400000, // 12.4M HYPE
  activeIndexes: 16,
  tvl24h: 2800000, // 2.8M HYPE
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
```

### Step 2.5: Update Layout for Footer Space

**File**: `app/layout.tsx`

Ensure main content has bottom padding to account for fixed footer:

```typescript
<body className="pb-12">
  {children}
</body>
```

### Success Criteria
- ✅ LeftSidebar completely removed from all pages
- ✅ Market Overview displays in Footer with brand color titles
- ✅ Tooltips show on hover for each metric
- ✅ Price Alerts popover appears above icon (not center modal)
- ✅ Footer layout matches: Network | Market Overview | Price Alerts
- ✅ No layout shift when footer is visible

---
## Phase 2: Clean Up Unused Pages

### Step 2.1: Remove Unnecessary Pages
```bash
cd app
# Keep only: trading, launch, governance (will rename), layout.tsx, globals.css
rm -rf page.tsx page.backup.tsx
rm -rf discover portfolio leaderboard referrals settings notifications dashboard
rm -rf privy-login test-network-display test-utils
```

### Step 2.2: Keep Essential API Routes
```bash
cd api
# Keep: launch/assets, baskets/calculate, auth/* (Privy)
# Remove: user/profile, health
rm -rf user health
```

**Retained API Structure:**
```
api/
├── auth/
│   ├── logout/
│   └── sync-user/
├── launch/
│   ├── assets/
│   └── basket-calculate/
└── baskets/
    └── calculate/
```

---

## Phase 3: Rename Governance → Manage Indexes

### Step 3.1: Rename Folder
```bash
cd app
mv governance manage-indexes
```

### Step 3.2: Update Page Metadata
**File:** `app/manage-indexes/page.tsx`

```typescript
// Update page component and exports
export default function ManageIndexesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      {/* ... */}
    </div>
  )
}
```

### Step 3.3: Update Navigation in Header
**File:** `components/layout/Header.tsx`

Find navigation links, update:
```typescript
// Old
<Link href="/governance">Governance</Link>

// New
<Link href="/manage-indexes">Manage Indexes</Link>
```

---

## Phase 4: Add RebalancingVotesSection to GovernanceLayout

### Overview
The RebalancingVotesSection component exists but is not imported in GovernanceLayout. This section contains the "Governance Proposals" which are actually rebalancing votes (index composition changes based on performance).

**Note**: The proposals shown in the UI (CAT_INDEX Adjustment, DOG_INDEX Quarterly Rebalancing) are rebalancing proposals, not protocol governance proposals. The section title may need to be updated for clarity.

### Step 4.1: Add RebalancingVotesSection to GovernanceLayout

**File**: `components/governance/GovernanceLayout.tsx`

**Current State**:
```typescript
'use client'

import { GovernanceDashboard } from './GovernanceDashboard'
import { ProposalsSection } from './ProposalsSection'

export function GovernanceLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GovernanceDashboard />

        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-brand">⚖️</span>
              Governance Proposals
            </h2>
            <p className="text-slate-400 mt-2">
              Snapshot (Time‑Weighted) → Voting → Timelock → Multisig (Operator 4/4) → Execute
            </p>
          </div>
          <ProposalsSection />
        </div>
      </div>
    </div>
  )
}
```

**Updated**:
```typescript
'use client'

import { GovernanceDashboard } from './GovernanceDashboard'
import { ProposalsSection } from './ProposalsSection'
import { RebalancingVotesSection } from './RebalancingVotesSection'

export function GovernanceLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GovernanceDashboard />

        {/* Protocol Governance Proposals */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-brand">⚖️</span>
              Protocol Governance
            </h2>
            <p className="text-slate-400 mt-2">
              Snapshot (Time‑Weighted) → Voting → Timelock → Multisig (Operator 4/4) → Execute
            </p>
          </div>
          <ProposalsSection />
        </div>

        {/* Rebalancing Votes (includes VS Battles) */}
        <div className="mt-12">
          <RebalancingVotesSection />
        </div>
      </div>
    </div>
  )
}
```

### Step 4.2: Verify RebalancingVotesSection Content

**File**: `components/governance/RebalancingVotesSection.tsx`

Ensure this section contains:
- ✅ Rebalancing vote cards (DOG_INDEX, CAT_INDEX, AI_INDEX)
- ✅ "My Active Rebalancing Votes" which includes VS Battles functionality
- ✅ Asset-vs-Asset voting (e.g., DOGE vs Chinese Rapping Dog)

**Note**: The "VS Battles" functionality is already implemented within RebalancingVotesSection as individual asset comparisons within rebalancing proposals. No separate VS Battles component is needed.

### Step 4.3: Update Section Title (Optional)

If needed, update the section title in RebalancingVotesSection to clarify it includes VS Battles:

```typescript
<h2 className="text-2xl font-bold text-white flex items-center gap-2">
  <span className="text-2xl">⚖️</span>
  Rebalancing Votes
  <RefreshCw className="w-6 h-6 text-purple-400" />
</h2>
<p className="text-slate-400 mt-1">
  Vote on index composition changes and asset battles based on performance
</p>
```

### Success Criteria
- ✅ RebalancingVotesSection imported in GovernanceLayout
- ✅ Section appears below Protocol Governance
- ✅ Rebalancing proposals visible (CAT_INDEX, DOG_INDEX, AI_INDEX)
- ✅ "My Active Rebalancing Votes" shows user's votes
- ✅ No duplicate imports or components

---

## Phase 5: Global UI Cleanup

### Overview
Standardize brand colors, remove unnecessary emojis, and ensure responsive layouts across all pages for a professional, cohesive look.

### Step 5.1: Brand Color Standardization

**Files to update**: All component files across `/components`

**Changes**:
- Apply mint brand color (#98FCE4) and its variants consistently
- Reduce profit/loss color saturation:
  - Green: `#4ade80` (instead of bright `#10b981`)
  - Red: `#f87171` (instead of bright `#ef4444`)
- Layer badges: Use mint tone variants
- VS Battle badges: Use mint tone variants

**Create constants file**:

**File**: `lib/constants/colors.ts`
```typescript
export const BRAND_COLORS = {
  primary: '#98FCE4',      // Soft mint
  primaryDark: '#72E8D1',  // Darker mint
  primaryLight: '#B4FFE9', // Lighter mint

  // Profit/Loss (reduced saturation)
  profit: '#4ade80',       // Softer green
  loss: '#f87171',         // Softer red

  // Layer badges (mint tone variants)
  layer: {
    L1: '#98FCE4',
    L2: '#7DD9C8',
    L3: '#A8FFE8',
    VS: '#B4E8FF',
    PARTNER: '#C4F0E8',
  }
}
```

### Step 5.2: Remove Unnecessary Emojis

**Files to scan**: All pages and components

**Action**:
- Remove decorative emojis from headings and UI text
- Keep functional icons (🔔 for notifications icon, ⚡ for alerts)
- Replace emoji indicators with proper icon components

**Examples**:
- ~~"🚀 Launch Index"~~ → "Launch Index"
- ~~"📊 Portfolio"~~ → "Portfolio"
- ~~"⭐ Favorite"~~ → Use star icon component

### Step 5.3: Responsive Layout Fixes

**Files to check**: All page layouts

**Remove hardcoded sizes**:
```typescript
// Before
<div className="w-[1200px] h-[800px]">

// After
<div className="w-full max-w-7xl h-auto min-h-screen">
```

**Use viewport-relative units**:
- `w-screen`, `h-screen` for full viewport
- `max-w-{size}` for maximum widths
- `min-h-screen` for minimum heights

**Test on multiple viewport sizes**:
- 1920px (large desktop)
- 1440px (desktop)
- 1024px (tablet)
- 768px (mobile)

### Success Criteria
- ✅ Consistent mint brand color (#98FCE4) across all pages
- ✅ Reduced saturation on profit/loss colors
- ✅ No decorative emojis in UI text
- ✅ No hardcoded pixel sizes for layouts
- ✅ Responsive on all viewport sizes (1920px to 768px)

---

## Phase 6: Launch Page UI Enhancements

### Overview
Improve Launch page visual presentation and user experience based on LAUNCH_PAGE_REFACTORING.md feedback.

### Step 6.1: Terminology Updates

**File**: `app/launch/page.tsx` and related components

**Changes**:
1. "Preview" → "Backtesting"
2. "Target Raise" → "Bonding Curve Graduation Amount"
3. "Total Required" → "Total Cost" (standardize)

### Step 6.2: Backtesting Chart Enhancement

**File**: Components related to preview/backtesting chart

**Add Sharpe Ratio and MDD below chart**:
```typescript
<div className="mt-4 grid grid-cols-2 gap-4">
  <div className="bg-slate-900 rounded-lg p-4">
    <div className="text-sm text-slate-400">Sharpe Ratio</div>
    <div className="text-2xl font-bold text-white">{sharpeRatio.toFixed(2)}</div>
  </div>
  <div className="bg-slate-900 rounded-lg p-4">
    <div className="text-sm text-slate-400">Max Drawdown</div>
    <div className="text-2xl font-bold text-red-400">{mdd.toFixed(2)}%</div>
  </div>
</div>
```

**Extend backtesting periods**:
- Current: 1h / 1d
- New: 1 day / 7 days / 30 days / 1 year

**Calculation formulas** (mock for demo):
```typescript
// Sharpe Ratio (simplified)
const returns = priceData.map((p, i) => i > 0 ? (p - priceData[i-1]) / priceData[i-1] : 0)
const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
const stdDev = Math.sqrt(returns.reduce((a, r) => a + Math.pow(r - avgReturn, 2), 0) / returns.length)
const sharpeRatio = avgReturn / stdDev

// Max Drawdown
let peak = priceData[0]
let maxDrawdown = 0
priceData.forEach(price => {
  if (price > peak) peak = price
  const drawdown = ((peak - price) / peak) * 100
  if (drawdown > maxDrawdown) maxDrawdown = drawdown
})
```

### Step 6.3: Asset Discovery Enhancement

**Add toggle for full asset list**:
```typescript
<div className="flex items-center justify-between mb-4">
  <input
    type="text"
    placeholder="Search assets..."
    className="..."
  />
  <button
    onClick={() => setShowAllAssets(!showAllAssets)}
    className="text-brand hover:text-brand-dark"
  >
    {showAllAssets ? 'Hide' : 'Show All'}
  </button>
</div>

{showAllAssets && (
  <div className="max-h-[400px] overflow-y-auto space-y-2">
    {allAssets.map(asset => (
      <AssetCard key={asset.id} asset={asset} />
    ))}
  </div>
)}
```

**Add Phase 0 Tooltip**:
```typescript
<div className="flex items-center gap-2">
  <input type="text" placeholder="Search assets..." className="..." />
  <Tooltip>
    <TooltipTrigger>
      <AlertCircle className="w-4 h-4 text-yellow-500" />
    </TooltipTrigger>
    <TooltipContent>
      <p className="max-w-xs">
        Phase 0 supports HyperCore Spot tokens only.
        HyperCore Perpetual tokens and Multi-chain assets coming at official launch.
      </p>
    </TooltipContent>
  </Tooltip>
</div>
```

### Step 6.4: Composition Input - Dual System

**Current**: Slider only (integer values)

**New**: Slider + Text input
```typescript
<div className="space-y-4">
  {selectedAssets.map(asset => (
    <div key={asset.id} className="flex items-center gap-4">
      <div className="w-32 text-white">{asset.symbol}</div>

      {/* Slider for integer adjustment */}
      <Slider
        value={[allocations[asset.id]]}
        onValueChange={(val) => updateAllocation(asset.id, val[0])}
        max={100}
        step={1}
        className="flex-1"
      />

      {/* Text input for decimal precision */}
      <input
        type="number"
        value={allocations[asset.id].toFixed(2)}
        onChange={(e) => updateAllocation(asset.id, parseFloat(e.target.value))}
        step={0.01}
        min={0}
        max={100}
        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
      />
      <span className="text-slate-400">%</span>
    </div>
  ))}

  {/* Auto-rounding indicator */}
  {totalAllocation !== 100 && (
    <div className="text-yellow-500 text-sm">
      Total: {totalAllocation.toFixed(2)}%
      {Math.abs(totalAllocation - 100) < 0.1 && ' (will auto-round to 100%)'}
    </div>
  )}
</div>
```

### Step 6.5: Index Details Modal Enhancement

**File**: Shared `IndexDetailsModal` component

**Compositions Table improvements**:
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Asset</TableHead>
      <TableHead>Price</TableHead>        {/* NEW */}
      <TableHead>Side</TableHead>
      <TableHead>Leverage</TableHead>
      <TableHead>Allocation</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {compositions.map(comp => (
      <TableRow key={comp.assetId}>
        <TableCell>{comp.symbol}</TableCell>
        <TableCell>${comp.currentPrice.toFixed(2)}</TableCell>  {/* NEW */}
        <TableCell>
          {comp.type === 'SPOT' ? 'Buy/Sell' : comp.side}  {/* Changed for SPOT */}
        </TableCell>
        <TableCell>
          {comp.type === 'SPOT' ? '-' : `${comp.leverage}x`}  {/* "-" for SPOT */}
        </TableCell>
        <TableCell>{comp.allocation}%</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Step 6.6: Share Modal Redesign (Coupang/Musinsa Style)

**File**: Create shared `ShareModal` component

**Layout**:
```typescript
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Share Index</DialogTitle>
    </DialogHeader>

    {/* Link copy */}
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        value={shareLink}
        readOnly
        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
      />
      <Button onClick={copyToClipboard} variant="outline">
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
    </div>

    {/* Social share icons */}
    <div className="flex items-center justify-center gap-4">
      <Button onClick={shareToTwitter} variant="ghost" size="icon">
        <Twitter className="w-5 h-5" />
      </Button>
      <Button onClick={shareToTelegram} variant="ghost" size="icon">
        <Send className="w-5 h-5" />
      </Button>
      <Button onClick={shareToInstagram} variant="ghost" size="icon">
        <Instagram className="w-5 h-5" />
      </Button>
      <Button onClick={shareNative} variant="ghost" size="icon">
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

### Step 6.7: UI Polish Fixes

**Remove duplicate X button in Launch modal**:
- Check all modal components for duplicate close buttons
- Ensure single X button in top-right corner

**Improve checkbox visibility**:
```typescript
<Checkbox
  className="border-2 border-brand data-[state=checked]:bg-brand"
/>
```

### Success Criteria
- ✅ "Backtesting" terminology used (not "Preview")
- ✅ Sharpe Ratio and MDD displayed below backtesting chart
- ✅ Backtesting supports 1d / 7d / 30d / 1y periods
- ✅ Asset list toggle shows all available assets
- ✅ Phase 0 tooltip (!) explains Spot-only limitation
- ✅ Composition input: Slider (integer) + Text (decimal)
- ✅ Auto-rounding when total ≈ 100%
- ✅ Index Details Modal shows Price column
- ✅ SPOT assets show "Buy/Sell" and "-" for leverage
- ✅ Share Modal uses Coupang/Musinsa style layout
- ✅ No duplicate X buttons in modals
- ✅ Checkbox borders clearly visible

---

## Phase 7: Trade Page UI Enhancements

### Overview
Improve TradingView chart UX based on TASK_PRIORITY.md feedback.

### Step 7.1: Adjust Default Chart Zoom

**File**: Components using TradingView chart (lightweight-charts)

**Issue**: Default view too zoomed out, hard to see recent price action

**Solution**: Set initial visible range to ~100 recent candles
```typescript
useEffect(() => {
  if (chartData && chartData.length > 0) {
    const visibleBars = 100
    const from = Math.max(0, chartData.length - visibleBars)
    const to = chartData.length - 1

    chart.timeScale().setVisibleRange({
      from: chartData[from].time,
      to: chartData[to].time,
    })
  }
}, [chartData])
```

### Step 7.2: Implement MA Toggle Functionality

**Issue**: MA button shows MA but clicking again doesn't remove it

**Solution**: Toggle state for MA indicator
```typescript
const [showMA, setShowMA] = useState(false)
const maSeriesRef = useRef(null)

const toggleMA = () => {
  if (showMA) {
    // Remove MA series
    if (maSeriesRef.current) {
      chart.removeSeries(maSeriesRef.current)
      maSeriesRef.current = null
    }
  } else {
    // Add MA series
    const maSeries = chart.addLineSeries({
      color: '#98FCE4',
      lineWidth: 2,
      title: 'MA(20)',
    })
    maSeries.setData(calculateMA(chartData, 20))
    maSeriesRef.current = maSeries
  }
  setShowMA(!showMA)
}

// Button
<Button
  onClick={toggleMA}
  variant={showMA ? 'default' : 'outline'}
  className={showMA ? 'bg-brand' : ''}
>
  MA
</Button>
```

### Success Criteria
- ✅ Chart loads showing ~100 recent candles (not fully zoomed out)
- ✅ MA button toggles on/off (not just on)
- ✅ MA series properly removed when toggled off
- ✅ Button visual state reflects MA visibility

---

## Phase 8: Discover Page UI Enhancements

### Overview
Apply brand colors, improve filters, and enhance share functionality based on TASK_PRIORITY.md and LAUNCH_PAGE_REFACTORING.md.

### Step 8.1: Apply Brand Color Standardization

**Files**: All Discover page components

**Changes**:
- Use mint brand color (#98FCE4) for:
  - Category tabs active state
  - Filter buttons
  - Index cards accent elements
- Layer badges: Use `BRAND_COLORS.layer` from `lib/constants/colors.ts`
- VS Battle badges: Mint tone variants
- Profit/Loss: Use reduced saturation colors (#4ade80, #f87171)

### Step 8.2: Composition Filter Redesign

**Current**: Button grid (limited space, hard to see all options)

**New**: Scrollable checkbox list with search

```typescript
<div className="space-y-2">
  <input
    type="text"
    placeholder="Search assets..."
    value={assetSearchQuery}
    onChange={(e) => setAssetSearchQuery(e.target.value)}
    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
  />

  <div className="max-h-[300px] overflow-y-auto space-y-1">
    {filteredAssets.map(asset => (
      <label key={asset.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
        <Checkbox
          checked={selectedAssets.includes(asset.id)}
          onCheckedChange={(checked) => toggleAsset(asset.id, checked)}
        />
        <span className="text-white">{asset.symbol}</span>
        <span className="text-slate-400 text-sm">{asset.name}</span>
      </label>
    ))}
  </div>

  <div className="flex items-center gap-2">
    <span className="text-sm text-slate-400">Match:</span>
    <Button
      onClick={() => setMatchMode('any')}
      variant={matchMode === 'any' ? 'default' : 'outline'}
      size="sm"
    >
      Any
    </Button>
    <Button
      onClick={() => setMatchMode('all')}
      variant={matchMode === 'all' ? 'default' : 'outline'}
      size="sm"
    >
      All
    </Button>
  </div>
</div>
```

### Step 8.3: Range Sliders for Advanced Filters

**Create reusable component**:

**File**: `components/ui/RangeSlider.tsx`
```typescript
interface RangeSliderProps {
  label: string
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  presets?: Array<{ label: string; value: [number, number] }>
  unit?: string
}

export function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  presets,
  unit = ''
}: RangeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-sm text-slate-400">
          {value[0]}{unit} - {value[1]}{unit}
        </span>
      </div>

      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={(max - min) / 100}
        className="w-full"
      />

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value[0]}
          onChange={(e) => onChange([parseFloat(e.target.value), value[1]])}
          className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
        />
        <span className="text-slate-500">to</span>
        <input
          type="number"
          value={value[1]}
          onChange={(e) => onChange([value[0], parseFloat(e.target.value)])}
          className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
        />
      </div>

      {presets && (
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button
              key={preset.label}
              onClick={() => onChange(preset.value)}
              variant="outline"
              size="sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Apply to filters**:
```typescript
<RangeSlider
  label="Performance (24h)"
  min={-50}
  max={50}
  value={performanceRange}
  onChange={setPerformanceRange}
  unit="%"
  presets={[
    { label: 'All', value: [-50, 50] },
    { label: 'Positive', value: [0, 50] },
    { label: 'Negative', value: [-50, 0] },
  ]}
/>

<RangeSlider
  label="NAV Range"
  min={0}
  max={1000}
  value={navRange}
  onChange={setNavRange}
  unit=" HYPE"
/>

<RangeSlider
  label="Volume (24h)"
  min={0}
  max={10000000}
  value={volumeRange}
  onChange={setVolumeRange}
  unit=" HYPE"
/>
```

### Step 8.4: Add Segment Filter

**Create constants**:

**File**: `lib/constants/segments.ts`
```typescript
export const SEGMENTS = [
  { id: 'meme', label: 'MEME', color: '#98FCE4' },
  { id: 'defi', label: 'DeFi', color: '#7DD9C8' },
  { id: 'solana', label: 'Solana', color: '#A8FFE8' },
  { id: 'rwa', label: 'RWA', color: '#B4E8FF' },
  { id: 'ai', label: 'AI', color: '#C4F0E8' },
  { id: 'gaming', label: 'Gaming', color: '#98FCE4' },
  { id: 'layer1', label: 'Layer 1', color: '#7DD9C8' },
  { id: 'layer2', label: 'Layer 2', color: '#A8FFE8' },
]
```

**Add to Advanced Filters**:
```typescript
<div className="space-y-2">
  <label className="text-sm font-medium text-white">Segment</label>
  <div className="flex flex-wrap gap-2">
    {SEGMENTS.map(segment => (
      <Button
        key={segment.id}
        onClick={() => toggleSegment(segment.id)}
        variant={selectedSegments.includes(segment.id) ? 'default' : 'outline'}
        size="sm"
        style={{
          backgroundColor: selectedSegments.includes(segment.id) ? segment.color : 'transparent',
          borderColor: segment.color,
        }}
      >
        {segment.label}
      </Button>
    ))}
  </div>
  <p className="text-xs text-slate-400">Select multiple (OR logic)</p>
</div>
```

### Step 8.5: Share Button Integration

**Use shared ShareModal from Phase 6**

**Add share button to index cards**:
```typescript
import { ShareModal } from '@/components/modals/ShareModal'

<Card>
  {/* Index card content */}

  <div className="flex items-center justify-between mt-4">
    <Button onClick={() => navigateToTrade(index.id)}>
      Trade
    </Button>
    <Button onClick={() => openIndexDetails(index.id)} variant="outline">
      View Details
    </Button>
    <Button onClick={() => setShareModalOpen(index.id)} variant="ghost" size="icon">
      <Share2 className="w-4 h-4" />
    </Button>
  </div>
</Card>

<ShareModal
  open={shareModalOpen === index.id}
  onOpenChange={() => setShareModalOpen(null)}
  shareLink={`https://hyperindex.app/index/${index.id}`}
  indexName={index.name}
/>
```

### Success Criteria
- ✅ Consistent mint brand color across Discover page
- ✅ Layer and VS badges use brand color variants
- ✅ Composition filter: Scrollable checkbox list with search
- ✅ Match Any/All toggle for composition filter
- ✅ Range sliders on Performance/NAV/Volume/Liquidity filters
- ✅ Slider + text input for precise range selection
- ✅ Preset buttons for common ranges
- ✅ Segment filter with multi-select (OR logic)
- ✅ Share button on index cards
- ✅ Share modal matches Launch page style

---

## Phase 9: Optimize Mock Data for Demo

### Step 9.1: Review Trading Page Mock Data
**File:** `lib/data/mock-indexes.ts`

- Ensure 15-18 diverse indexes
- Check sparkline data looks realistic
- Verify Layer-2/Layer-3 distribution

### Step 9.2: Update Launch Page Assets
**File:** `lib/mock/assets.ts` or API route

- Include popular meme coins (DOGE, PEPE, SHIB, WIF, BONK)
- Include AI tokens (FET, RNDR, TAO)
- Ensure spot/perp distinction is clear

### Step 9.3: Enhance Governance Mock Data
**File:** `components/governance/RebalancingVotesSection.tsx`

Current mock data is inline. Consider extracting to `lib/mock/governance.ts`:
```typescript
export const mockProposals = [...]
export const mockRebalancingVotes = [...]
export const mockVsBattles = [...]
```

**Benefit:** Easier to update for demo scenarios

---

## Phase 10: Dynamic Calculation Implementation

### Step 10.1: Trading Panel Calculations
**File:** `components/trading/TradingPanelSimple.tsx`

Ensure these calculations exist:
```typescript
// Position size calculation
const positionValue = size * leverage * entryPrice

// Liquidation price
const liquidationPrice = side === 'long'
  ? entryPrice * (1 - 1/leverage)
  : entryPrice * (1 + 1/leverage)

// Estimated PnL (from current mark price)
const estimatedPnL = side === 'long'
  ? (markPrice - entryPrice) * size * leverage
  : (entryPrice - markPrice) * size * leverage

// Trading fee
const fee = positionValue * feeRate // 0.0005 maker, 0.0007 taker
```

**Verify:** Numbers update in real-time as user types

### Step 10.2: Launch Page Allocation Calculations
**File:** `app/launch/page.tsx`

Ensure auto-balance works:
```typescript
const autoBalanceAllocations = () => {
  if (selected.length === 0) return
  const evenSplit = 100 / selected.length
  const newAllocations: { [symbol: string]: number } = {}

  selected.forEach((s, i) => {
    if (i === selected.length - 1) {
      // Last asset gets remainder to ensure exactly 100%
      const assigned = Object.values(newAllocations).reduce((sum, val) => sum + val, 0)
      newAllocations[s.symbol] = 100 - assigned
    } else {
      newAllocations[s.symbol] = Math.floor(evenSplit * 10) / 10
    }
  })

  setComposition(prev => ({ ...prev, allocations: newAllocations }))
}
```

**Verify:** Total always = 100% after auto-balance

### Step 10.3: Manage Index Vote Calculations
**File:** `components/governance/RebalancingVoteCard.tsx`

Add vote submission handler:
```typescript
const handleVote = (changeId: string) => {
  // Update vote count
  const updatedChange = {
    ...proposedChange,
    votes: proposedChange.votes + userVotingPower
  }

  // Recalculate percentage
  const totalVotes = rebalancing.totalVotes + userVotingPower
  updatedChange.percentage = (updatedChange.votes / totalVotes) * 100

  // Update store
  governanceStore.recordVote(rebalancing.id, changeId, userVotingPower)
}
```

**Verify:** Progress bars update on vote

---

## Phase 11: Hardcode Non-Interactive Elements

### Step 11.1: Trading Page Static Elements
**Files to check:**
- `components/trading/WhaleAlert.tsx` - hardcode 10 sample large trades
- `components/trading/CommunityFeed.tsx` - hardcode 20 sample posts
- `components/trading/TopTraders.tsx` - hardcode leaderboard (already in mock-indexes.ts)

**Example - WhaleAlert:**
```typescript
const whaleAlerts = [
  {
    id: '1',
    user: '0x1234...5678',
    action: 'Opened Long 10x',
    index: 'DOGIDX',
    size: '$125,400',
    timestamp: '2m ago'
  },
  // ... 9 more
]
```

### Step 11.2: Launch Page Static Elements
**File:** `app/launch/page.tsx`

Active Layer-3 Launches section (lines 860-996) - already hardcoded, verify data looks realistic:
- Progress bars (65%, 82%, 78%)
- Time left (18d 5h, 12d 3h, 4d 18h)
- Current prices ($0.00032, $0.00041, $0.00050)

### Step 11.3: Manage Indexes Static Elements
- Proposal descriptions (already hardcoded)
- Next rebalancing dates (already hardcoded)
- Governance dashboard stats (can be static for demo)

---

## Phase 12: Create HANDOVER.md Documentation

### Step 12.1: Create File
```bash
cd /Users/kimhyeon/Desktop/PROJECTS/YCOMDEMO
touch HANDOVER.md
```

### Step 12.2: Write Comprehensive Guide
**Structure:**
1. Project Overview
2. Quick Start (pnpm install, pnpm run dev)
3. Demo Pages (Trading, Launch, Manage Index)
4. Key Features for Demo
5. Environment Setup (.env.local variables)
6. File Structure
7. Demo Optimizations (hardcoded vs. dynamic)
8. Navigation
9. Technical Stack
10. Notes for Demo Video

**Content:** (see full HANDOVER.md template in earlier plan)

---

## Phase 13: Install Dependencies & Test

### Step 13.1: Install Packages
```bash
cd /Users/kimhyeon/Desktop/PROJECTS/YCOMDEMO
pnpm install
```

**Expected:** No errors, ~500MB node_modules

### Step 13.2: Verify .env.local
```bash
cat .env.local
```

**Must contain:**
```
NEXT_PUBLIC_PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Step 13.3: Start Dev Server
```bash
pnpm run dev
```

**Expected:** Server starts on http://localhost:3000

### Step 13.4: Manual Testing Checklist
- [ ] Navigate to /trading - page loads, chart visible
- [ ] Click wallet connect - Privy modal opens
- [ ] Connect wallet - address displays in header
- [ ] Change leverage slider - liquidation price updates
- [ ] Enter trade size - position value updates
- [ ] Navigate to /launch - page loads
- [ ] Search asset - dropdown appears
- [ ] Add 3 assets - preview chart updates
- [ ] Adjust allocation sliders - percentages update, chart refreshes
- [ ] Click auto-balance - allocations sum to 100%
- [ ] Navigate to /manage-index - page loads
- [ ] Scroll to Rebalancing section - cards visible
- [ ] Click vote checkbox - checkbox state toggles
- [ ] Scroll to VS Battles - battle cards visible
- [ ] Click vote on Asset A - percentage updates

---

## Phase 14: Optimize for Video Recording

### Step 14.1: Pre-Select Interesting Index
**File:** `lib/store/trading-store.ts`

Set default index:
```typescript
const initialState = {
  currentIndex: 'dog-memes', // DOGIDX - visually appealing
  // ...
}
```

### Step 14.2: Pre-Fund Demo Wallet
- Use testnet wallet
- Pre-add HYPE tokens for trading demo
- Pre-add HIIN tokens for launch fee demo

---

## Phase 15: Final Checks Before Recording

### Checklist:
- [ ] All pages load without errors
- [ ] Wallet connection works
- [ ] All calculations update in real-time
- [ ] No console errors (check DevTools)
- [ ] Mobile responsiveness (test with DevTools)
- [ ] Dark theme looks good (no white flashes)
- [ ] All buttons have hover states
- [ ] Loading states work (spinners, skeletons)
- [ ] Error messages are helpful (if triggered)
- [ ] HANDOVER.md is complete and accurate

---

## Phase 16: Post-Demo Maintenance

### After YC Application Submission:

**Option A: Merge Back to Main Repo**
- Extract useful demo optimizations
- Merge Manage Index page rename
- Keep YCOMDEMO as reference

**Option B: Archive Demo Project**
- Tag in git: `git tag yc-demo-2025-11`
- Move to `/Users/kimhyeon/Desktop/ARCHIVE/YCOMDEMO`
- Keep HANDOVER.md for future reference

**Option C: Convert to Production**
- Remove hardcoded data
- Connect to real APIs
- Deploy YCOMDEMO as beta.hyperindex.app

---

## Success Criteria

✅ **YCOMDEMO folder is self-contained**
- Can be moved to another machine
- `pnpm install && pnpm run dev` works

✅ **All 3 demo pages functional**
- Trading: Can simulate trades, see calculations
- Launch: Can create index, see preview
- Manage Index: Can vote, see results update

✅ **Demo-ready optimizations**
- Hardcoded data where appropriate
- Dynamic calculations where needed
- No jarring errors or loading delays

✅ **Documentation complete**
- HANDOVER.md explains everything
- Can hand off to another developer

✅ **Video recording prepared**
- Pre-selected data looks good
- Demo script rehearsed
- Recording environment clean (no personal info)

---

## Estimated Time

- Phase 1-3: 30 minutes (folder setup, file copying)
- Phase 4: 15 minutes (VS Battles integration)
- Phase 5: 20 minutes (mock data review)
- Phase 6: 30 minutes (calculation verification)
- Phase 7: 15 minutes (hardcoding check)
- Phase 8: 45 minutes (HANDOVER.md writing)
- Phase 9: 30 minutes (testing)
- Phase 10-11: 30 minutes (demo prep)

**Total: ~4 hours**

---

## Notes

- This plan assumes main Cryptoindex-V0 repo is in working state
- Demo optimizations are non-destructive (can revert easily)
- YCOMDEMO is throwaway code (quality standards relaxed)
- Focus is on visual polish and demo flow, not production readiness