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

