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

### Step 7.3: Index Selection Sync (Critical)

**Issue**: Index dropdown, chart, and TradingPanel not synced
- User selects index from dropdown
- Chart still shows "DOG_INDEX"
- TradingPanel still shows DOG data

**Solution**: Shared state management
```typescript
// Create Zustand store or Context
interface TradingStore {
  selectedIndex: MemeIndex | null
  setSelectedIndex: (index: MemeIndex) => void
}

// Use in all components
const { selectedIndex, setSelectedIndex } = useTradingStore()

// Dropdown onChange
<Select onValueChange={(id) => {
  const index = indexes.find(i => i.id === id)
  setSelectedIndex(index)
}}>

// Chart
useEffect(() => {
  if (selectedIndex) {
    loadChartData(selectedIndex.symbol)
  }
}, [selectedIndex])

// TradingPanel
const currentPrice = selectedIndex?.currentPrice || 0
```

**Files**:
- Create: `lib/store/trading-store.ts` (state management)
- Modify: `app/trading/page.tsx` (index selector)
- Modify: `components/trading/TradingChart.tsx`
- Modify: `components/trading/TradingPanelSimple.tsx`

**Estimated Time**: 1h 30m

### Step 7.4: Market Buy Quantity Logic Fix (Critical)

**Issue**: Quantity calculation doesn't account for total cost
- Should calculate: `balance >= (quantity × price) + fees`
- Current logic unclear if fees included

**Solution**: Refactor `calculateBuyAmount()`
```typescript
const calculateBuyAmount = (quantity: number) => {
  const subtotal = quantity * currentPrice
  const feeBreakdown = calculateTradingFee(subtotal, userVIPTier, 'L1', isInvited)
  const totalCost = subtotal + feeBreakdown.totalFee

  // Check if user has enough balance
  const canAfford = availableBalance >= totalCost

  return {
    subtotal,
    fee: feeBreakdown.totalFee,
    total: totalCost,
    canAfford
  }
}

// Update max quantity slider
const maxQuantity = Math.floor(
  (availableBalance / (1 + feeRate)) / currentPrice
)
```

**Files**:
- Modify: `components/trading/TradingPanelSimple.tsx`

**Estimated Time**: 1h

### Step 7.5: Remove Balance Slider Animation (High Priority)

**Issue**: Slider has smooth animation causing delays
- Trading needs instant feedback
- CurrencyNumberTicker animates on user input

**Solution**: Disable animation for user inputs
```typescript
// Add instant prop to CurrencyNumberTicker
interface CurrencyNumberTickerProps {
  value: number
  instant?: boolean  // New prop
}

// In component
{isUserInteracting ? (
  <span>{formatBalance(value)}</span>
) : (
  <CurrencyNumberTicker value={value} />
)}

// Or simpler: remove CurrencyNumberTicker for slider-driven values
const displayQuantity = buyQuantity // Direct, no animation
```

**Files**:
- Modify: `components/trading/TradingPanelSimple.tsx`
- Optional: `components/ui/currency-number-ticker.tsx` (add instant prop)

**Estimated Time**: 30m

### Step 7.6: Trading Fee Explanation UI (Medium Priority)

**Issue**: "Trading Fee (0.7%-1.0%)" has no explanation
- Users don't know their VIP tier
- No info on fee components (Protocol + LP + Creator)
- No upgrade path shown

**Solution**: Add HelpCircle icon with tooltip/modal
```typescript
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Display
<div className="flex items-center gap-1">
  <span>Trading Fee ({feeRangeString})</span>
  <Tooltip>
    <TooltipTrigger>
      <HelpCircle className="w-3 h-3 text-slate-400" />
    </TooltipTrigger>
    <TooltipContent>
      <div className="space-y-2 max-w-xs">
        <div className="text-xs font-semibold">Your VIP Tier: {userVIPTier}</div>
        <div className="text-xs">Your Fee Rate: {userFeeRate}%</div>
        <div className="text-xs text-slate-400">
          Protocol {protocolRate}% + LP {lpRate}%
        </div>
        <div className="text-xs text-brand">Upgrade to save on fees →</div>
      </div>
    </TooltipContent>
  </Tooltip>
</div>
```

**Decision Point**: Tooltip vs Modal
- **Tooltip**: Simpler, less intrusive (recommended for demo)
- **Modal**: More space for VIP tier table

**Files**:
- Modify: `components/trading/TradingPanelSimple.tsx`
- Optional: Create `components/trading/FeeTierTooltip.tsx` (reusable)

**Estimated Time**: 30m

### Step 7.7: Order Type Description Tooltip (Low Priority)

**Issue**: Order type description takes vertical space
- Inline text below dropdown
- Not consistent with modern trading UI

**Solution**: Move to tooltip
```typescript
<div className="flex items-center gap-1">
  <Label>Order Type</Label>
  <Tooltip>
    <TooltipTrigger>
      <HelpCircle className="w-3 h-3 text-slate-400" />
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">
      <div className="space-y-1 text-xs">
        <div><strong>Market</strong>: Execute at current price</div>
        <div><strong>Limit</strong>: Execute at specified price or better</div>
        <div><strong>Stop</strong>: Trigger order when price reached</div>
      </div>
    </TooltipContent>
  </Tooltip>
</div>

// Remove inline description text
```

**Files**:
- Modify: `components/trading/TradingPanelSimple.tsx`

**Estimated Time**: 15m

### Updated Success Criteria
- ✅ Step 7.1-7.2: Chart enhancements
- ⏳ Step 7.3: Index selection synced across all components (1.5h)
- ⏳ Step 7.4: Market Buy quantity includes fees in calculation (1h)
- ⏳ Step 7.5: Slider updates instant (no animation) (30m)
- ⏳ Step 7.6: Trading Fee explanation tooltip (30m)
- ⏳ Step 7.7: Order Type description as tooltip (15m)

**Total Estimated Time**: 3h 45m

**Note**: Steps 7.3-7.7 identified from Phase 1.5.2 user testing feedback. See `docs/planning/2025NOV01/issues/Trading_Page_Issues.md` for detailed specifications.

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

