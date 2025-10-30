# Launch Page Refactoring Plan

Creator: 현 김
Creation Date: 2025년 10월 28일
Category: 작업 계획
Status: Planning
Reference Task: Frontend - Launch Page

---

## Overview

This document outlines the refactoring plan for the Launch page based on comprehensive feedback from CoreIndex resource review. The Launch page is the primary interface for users to create and launch custom crypto indices.

---

## UX or 세부 컴포넌트 항목

### Core Components Requiring Updates

**1. Launch Guide Section**
- Current: No documentation link
- Required: Integration with Docs/Gitbooks
- Component: Header guidance link

**2. Target Raise Display**
- Current: Confusing "Target Raise" terminology (not in CoreIndex)
- Required: Replace with "Bonding Curve graduation amount"
- Reference: pump.fun bonding curve mechanics
- Component: IndexConfigSection

**3. Fee System (VIP Tier + Layer-based)** ⭐ UPDATED
- Current: Phase 0 with HYPE-only currency
- Required: VIP Tier-based Protocol Fee (0.3%-0.6% based on 30d volume)
- Layer-based Creator Fee (0.15%-0.30%) + LP Fee (0.15%-0.30%)
- Launcher Fee: Fixed $5 (payable in HYPE/USDC/USDT)
- Real-time fee calculation with user VIP tier detection
- Fee breakdown tooltip: Protocol + Creator + LP breakdown
- Portfolio page: Display creator earnings from Creator Fee
- Components: FeeCalculation, VIPTierDisplay, FeeBreakdown, PortfolioCreatorFees
- Reference: FEE_STRUCTURE_SPECIFICATION.md, CURRENCY_SYSTEM_REFACTORING.md

**4. Asset Component Search** ⭐ UPDATED
- Current: Limited search results, missing SPOT assets
- Required: Fix assetID duplication bug
- Add toggle for full asset list (scrollable)
- Implement advanced filter mechanism from Discover page
- **Phase 0 Limitation**: Add exclamation icon (!) tooltip: "Phase 0 supports HyperCore Spot tokens only. HyperCore Perpetual tokens and Multi-chain assets coming at official launch."
- Components: AssetSearch, AssetFilter, PhaseZeroTooltip

**5. Preview/Backtesting Section**
- Current: "Preview" with 1h/1d periods
- Required: Rename to "Backtesting"
- Extend periods: 1 day / 7 days / 30 days / 1 year
- Add Sharpe Ratio and Max Drawdown (MDD) below chart
- Components: BacktestingChart, PerformanceMetrics

**6. Composition Adjustment**
- Current: Integer-only slider adjustment
- Required: Slider for integers, text input for decimals
- Auto-rounding to 2 decimals (33.33 × 3 → 100%)
- Components: CompositionSlider, CompositionInput

**7. Total Cost Calculation**
- Current: Missing real-time fee calculation
- Required: Fee + Investing Amount + HyperLiquid position fees
- Real-time HYPE ↔ USDC swap costs
- Gas fees and additional costs
- Tooltip with breakdown on hover (?)
- Components: TotalCostCalculator, FeeBreakdown

**8. Inline Swap Removal**
- Current: Manual inline swap UI
- Required: Automatic swap mechanism
- Integration with swap aggregator
- Backend coordination required
- Components: AutoSwapService

**9. Index Details Modal**
- Current: Missing composition details
- Compositions table: Add price column, buy/sell for SPOT, hyphen for leverage
- Asset Breakdown: Enhanced detail view with all CoreIndex elements
- Components: IndexDetailsModal, CompositionsTable, AssetBreakdown

**10. Launch Process Flow**
- Current: Mockup post-launch flow
- Required: Real data integration
- Verification logic and validation
- Error handling and retry mechanisms
- Components: LaunchWorkflow, ValidationService

**11. Share Index Feature**
- Current: Poor UX, no link copy
- Required: Link copy button, social sharing
- X (Twitter) post, Telegram share, Instagram, Apple share
- PnL-style card generation option
- Components: ShareModal, SocialShareButtons

---

## 레퍼런스

### Primary References

**1. CoreIndex**
- Original composition table structure
- Asset breakdown detailed view
- Fee structure and calculation methods
- Leverage display patterns

**2. pump.fun**
- Bonding curve graduation mechanics
- Creator fee collection on transactions
- Target raise concept and terminology
- Launch flow and verification process

**3. Uniswap**
- Inline swap removal approach
- Automatic asset conversion
- Gas fee estimation patterns

**4. Coupang / Musinsa**
- Share functionality UX
- Link copy + social buttons layout
- Text box + icon button pattern

**5. HyperLiquid**
- Position opening cost calculation
- Real-time fee updates
- Transaction cost breakdown

### Internal Planning Documents ⭐ NEW

**6. FEE_STRUCTURE_SPECIFICATION.md**
- VIP Tier system (VIP0-VIP4) with protocol fees 0.3%-0.6%
- Layer-specific fee breakdown (L1/L2/L3/VS/PARTNER)
- Revenue projections and AUM calculations
- Complete fee structure implementation guide

**7. CURRENCY_SYSTEM_REFACTORING.md**
- Phase 0 HYPE-only currency system
- VIP Tier + Fee Structure integration (Section 5.4)
- Mock API Layer architecture
- Fee API functions and type definitions

**8. BACKEND_DATA_REQUIREMENTS.md**
- API 39-43: VIP Tier and Fee APIs
- API request/response formats
- Backend implementation requirements
- Variable name mappings (camelCase ↔ snake_case)

---

## 용이성의 근거

### Adopted Approach: Phased Refactoring with Real-time Calculation

**Why Adopted:**
1. **User Trust**: Real-time cost calculation builds confidence before launch
2. **Transparency**: Detailed fee breakdown (?) tooltip prevents surprises
3. **Accuracy**: Integration with HyperLiquid APIs ensures exact costs
4. **Flexibility**: Decimal composition input allows precise portfolio allocation
5. **Discovery**: Toggled asset list improves discoverability vs search-only
6. **Context**: Extended backtesting periods (up to 1 year) support long-term strategies
7. **Professional**: Sharpe Ratio + MDD metrics align with institutional standards
8. **Consistency**: HYPE as base currency throughout Phase 0, reducing confusion
9. **Efficiency**: Auto-swap removes friction, fewer steps to launch

**Supporting Evidence:**
- HyperLiquid shows real-time position costs → users expect this
- pump.fun's bonding curve is clear about graduation targets
- Uniswap's auto-swap removes cognitive load (no manual token management)
- Professional traders expect Sharpe/MDD metrics for strategy evaluation

### Rejected Alternative #1: Manual Fee Entry

**Why Rejected:**
- Error-prone: Users could underestimate costs
- Poor UX: Requires users to calculate HyperLiquid fees manually
- Trust issues: Hidden costs discovered after launch damage credibility
- Maintenance burden: Fees change, manual entry becomes stale

### Rejected Alternative #2: Simplified "Total Cost" Without Breakdown

**Why Rejected:**
- Black box: Users don't understand where their money goes
- No comparison: Can't evaluate if costs are reasonable
- Reduced trust: Appears to hide fee structure
- Support burden: Users will ask "why is it this much?"

### Rejected Alternative #3: Search-Only Asset Discovery (Current)

**Why Rejected:**
- Memorization required: Users must know exact asset names
- Poor discovery: New users don't know what's available
- SPOT asset bug: Currently many assets not searchable
- Cognitive load: Forces users to leave page to find asset lists

### Rejected Alternative #4: Keep "Preview" Terminology

**Why Rejected:**
- Misleading: "Preview" suggests UI preview, not performance simulation
- Unprofessional: Serious investors use "backtesting" terminology
- Feature unclear: Users might not understand it simulates historical performance

---

## 타 페이지 및 컴포넌트와의 관계성

### Portfolio Page Integration
- **Creator Fee Display**: Show cumulative earnings from creator fees
- **Launched Indices**: List of indices created by user
- **Performance Tracking**: Links to launched index detail pages
- **Data Flow**: LaunchPage → Create Index → Portfolio displays it

### Discover Page Integration
- **Asset Filter Mechanism**: Reuse advanced filter component
- **Search Logic**: Share assetID search implementation
- **Index Card Format**: Share index display components
- **Data Flow**: LaunchPage creates → Discover page lists → Users discover

### Trading Page Integration
- **Total Cost Calculation**: Similar real-time fee calculation
- **HyperLiquid API**: Shared service for position costs
- **HYPE ↔ USDC Swap**: Shared swap service
- **Data Flow**: LaunchPage → Create Index → Trading page trades it

### Settings Page Integration
- **Currency Preferences**: Respect user's display currency setting
- **Notification Preferences**: Launch success/failure notifications
- **Default Values**: Creator fee preferences, default leverage
- **Data Flow**: Settings → LaunchPage reads preferences

### Docs Page Integration
- **Launch Guide**: Link to comprehensive launch documentation
- **Creator Fee Docs**: Explanation of fee structure
- **Backtesting Guide**: How to interpret Sharpe Ratio and MDD
- **Data Flow**: LaunchPage → Links to Docs → User reads → Returns

### Shared Components
- **Currency Display**: Uses global currency system (`useCurrency` hook)
- **Fee Constants**: Imports from `lib/constants/fees.ts`
- **Asset Search**: Shares with Discover page's asset filter
- **Social Share**: Reusable ShareModal component
- **Performance Metrics**: Shared PerformanceMetrics component

---

## 상세 계획 - 실행 절차

### Phase 1: Documentation & Constants

**1.1 Launch Guide Integration**
- Create or update Docs page with Launch guide section
- Add prominent "Launch Guide" link in Launch page header
- Ensure guide covers: creator fees, bonding curve, composition rules

**1.2 Fee System Documentation** ⭐ UPDATED
- Document VIP Tier-based Protocol Fee calculation (0.3%-0.6% based on 30d volume)
- Document Layer-based Creator + LP Fee calculation (0.15%-0.30%)
- Define global fee constants in `lib/constants/fees.ts`:
  - `VIP_PROTOCOL_FEES`: VIP0-VIP4 rates
  - `LAYER_FEES`: L1/L2/L3/VS/PARTNER rates (Creator, LP, Rebalancing, Management)
  - `LAUNCHER_FEE`: Fixed $5
- Clarify fee collection mechanism:
  - Protocol Fee: Per transaction, goes to protocol treasury
  - Creator Fee: Per transaction, goes to index creator
  - LP Fee: Per transaction, goes to liquidity providers
  - Rebalancing Fee: Per event, frequency depends on layer
  - Management Fee: Continuous (charged per block or daily)
- Reference: FEE_STRUCTURE_SPECIFICATION.md

**1.3 Terminology Updates** ⭐ UPDATED
- Replace "Target Raise" with "Bonding Curve Graduation Amount"
- Replace "Preview" with "Backtesting" throughout
- Unify "Total Cost" vs "Total Required" to "Total Cost"
- Standardize currency display: HYPE only for Phase 0 (HIIN/HIDE tokens removed)
- Fee terminology: Protocol Fee, Creator Fee, LP Fee (not "Creation Fee")

### Phase 2: Component Search & Discovery

**2.1 Fix Asset Search Bug**
- Debug assetID duplication issue (same assetID shows only one result)
- Ensure all SPOT assets appear in search results
- Add error logging for failed searches

**2.2 Enhanced Asset Discovery UI**
- Add toggle button to show/hide full asset list
- Scrollable asset list view (categorized: SPOT, etc.)
- Keep search functionality for quick access
- Reference Discover page's advanced filter mechanism

**2.3 Phase 0 Asset Limitation Tooltip** ⭐ NEW
- Add exclamation icon (!) tooltip next to asset composition search bar
- Tooltip message: "Phase 0 supports HyperCore Spot tokens only. HyperCore Perpetual tokens and Multi-chain assets coming at official launch."
- Icon placement: Right side of search bar, before filter button
- Professional tone, clear limitation communication

**2.4 Asset Filter Integration**
- Extract filter component from Discover page
- Adapt for Launch page asset selection
- Support filter by: type (SPOT), market cap, volume, etc.

### Phase 3: Backtesting & Performance Metrics

**3.1 Rename Preview to Backtesting**
- Update component names: `PreviewChart` → `BacktestingChart`
- Update UI labels and tooltips
- Update documentation references

**3.2 Extend Backtesting Periods**
- Replace 1h/1d with: 1 day, 7 days, 30 days, 1 year
- Fetch historical data for extended periods
- Handle loading states for longer data fetches

**3.3 Add Performance Metrics**
- Calculate Sharpe Ratio for selected period
- Calculate Maximum Drawdown (MDD)
- Display metrics below backtesting chart
- Add tooltips explaining each metric

### Phase 4: Composition Input Refinement

**4.1 Dual Input System**
- Slider: Integer-only adjustment (current behavior)
- Text input: Allow decimal entry (e.g., 33.33)
- Validation: Ensure sum ≤ 100%

**4.2 Auto-Rounding Logic**
- When sum = 100.00, accept as-is
- When sum slightly off (99.99 or 100.01), auto-round to 100%
- Show warning if sum > 100% or < 100% (after rounding)

**4.3 UX Polish**
- Real-time validation feedback
- Clear error messages for invalid inputs
- Smooth slider interaction

### Phase 5: Real-time Cost Calculation ⭐ COMPLETELY REWRITTEN

**5.1 Fee Breakdown Implementation (VIP Tier + Layer-based)**

**One-time Fees:**
- **Launcher Fee**: Fixed $5 (payable in HYPE/USDC/USDT)
  - API: `GET /api/fees/launcher`
  - Display payment method options

**Trading Fees (Per Transaction):**
- **Protocol Fee** (VIP Tier-based):
  - VIP0: 0.60% | VIP1: 0.50% | VIP2: 0.40% (default) | VIP3: 0.35% | VIP4: 0.30%
  - User VIP tier determined by 30-day trading volume
  - API: `GET /api/user/vip-tier`
  - Show discount percentage vs VIP0 baseline

- **Creator Fee** (Layer-based):
  - L1/L2: 0.15% | L3: 0.30% | VS: 0.20% | PARTNER: 0.10%
  - Goes to index creator
  - Displayed in Portfolio page as creator earnings

- **LP Fee** (Layer-based):
  - L1/L2: 0.15% | L3: 0.30% | VS: 0.20% | PARTNER: 0.10%
  - Goes to liquidity providers

**Ongoing Fees:**
- **Rebalancing Fee** (Per rebalancing event):
  - L1/L2: 0.1% (monthly) | L3: 0.3% (bi-weekly) | VS: 0.2% (event-based) | PARTNER: 0.1% (monthly)
  - API: `GET /api/fees/rebalancing/info?layer={layer}`
  - Display frequency and estimated annual cost

- **Management Fee** (Annual AUM-based):
  - L1/L2: 0.7% yearly | L3: 1.0% yearly | VS: 0.5% yearly | PARTNER: 0.5% yearly
  - API: `GET /api/fees/management/info?layer={layer}`
  - Charged proportionally per block or daily

**Additional Costs:**
- **HYPE ↔ USDC Swap Costs**: Real-time aggregator quote
- **Gas Fees**: Estimated network costs
- **HyperLiquid Position Fees**: Real-time API calculation

**5.2 VIP Tier Integration**
- Detect user's VIP tier on page load
- Display current tier badge (VIP0-VIP4)
- Show protocol fee discount percentage
- Display volume progress to next tier
- Link to Settings page VIP tier section for full details

**5.3 Total Cost Display**
- **Immediate Costs**: Launcher Fee + Initial Trading Fees + Swap Costs + Gas
- **Ongoing Costs**: Rebalancing Fee (estimated annual) + Management Fee (annual)
- Separate display for one-time vs ongoing costs
- Update in real-time as user adjusts composition or investing amount

**5.4 Fee Breakdown Tooltip**
- Hover over (?) icon shows detailed breakdown:
  - Trading Fees section:
    - Protocol Fee: X HYPE (VIP2 discount: -33%)
    - Creator Fee: Y HYPE (L2: 0.15%)
    - LP Fee: Z HYPE (L2: 0.15%)
    - Total Trading Fee: X+Y+Z HYPE (0.70%)
  - Ongoing Fees section:
    - Rebalancing: A HYPE/event (monthly, est. 1.2%/year)
    - Management: B HYPE/year (0.7%/year)
- Each fee with explanation and link to docs
- Update dynamically as composition or layer changes

**5.5 Backend API Integration**
- **Fee Calculation API**: `POST /api/fees/trading/calculate`
  - Request: `{ amount, layer, vipTier, indexId }`
  - Response: `{ breakdown, rates, vipDiscount, layerInfo }`
- **VIP Tier API**: `GET /api/user/vip-tier`
  - Response: `{ vipTier, protocolFee, currentVolume30d, nextTier, volumeToNextTier }`
- **Rebalancing Info API**: `GET /api/fees/rebalancing/info?layer={layer}`
- **Management Info API**: `GET /api/fees/management/info?layer={layer}`
- **Launcher Fee API**: `GET /api/fees/launcher`
- Handle API errors gracefully (fallback to default VIP2 estimates)
- Cache VIP tier result for session duration

**5.6 Phase 0 vs Phase 1 Behavior**
- **Phase 0** (Current):
  - Default to VIP2 for all users
  - HYPE-only currency display
  - Mock API responses with hardcoded fee calculations
- **Phase 1** (Future):
  - Real VIP tier calculation from 30-day volume
  - Real-time fee calculation from backend
  - Multi-currency support (HYPE/USDC/USDT)

### Phase 6: Inline Swap Removal & Auto-Swap

**6.1 Remove Inline Swap UI**
- Delete manual swap interface components
- Update user flow documentation

**6.2 Auto-Swap Service**
- Integrate with swap aggregator API
- Automatically determine required token swaps
- Calculate optimal swap route (lowest cost)

**6.3 Backend Integration**
- Discuss with backend team: swap aggregator options
- Determine if frontend calculates swap route or backend
- Define error handling for failed swaps

**6.4 Cost Transparency**
- Show estimated swap costs in Total Cost breakdown
- Update in real-time as asset selection changes

### Phase 7: UI/UX Polish

**7.1 Launch Modal X Button Fix**
- Remove duplicate X button in Launch modal
- Ensure single, clear close action

**7.2 Confirm Launch Checkbox Visibility**
- Change checkbox border to bright/visible color
- Improve contrast for dark mode
- Add focus state for accessibility

**7.3 Index Details Modal Enhancement**
- **Compositions Table**:
  - Add "Price" column (current price)
  - Change "Side" for SPOT: "Buy/Sell" (not "Long/Short")
  - Display "Leverage": "-" for SPOT, "2x"/"3x" for futures
- **Asset Breakdown**:
  - Research reference implementations (brainstorm)
  - Document elements to include (all CoreIndex elements)
  - Explain rationale for excluded elements
  - Get feedback on design before implementation

### Phase 8: Launch Process & Real Data Integration

**8.1 Backend Integration Preparation**
- Document all mock data points that need real data
- Create Backend Integration Endpoint checklist
- Define API contracts for launch process

**8.2 Launch Workflow Implementation**
- Implement multi-step launch verification
- Add progress indicators
- Handle errors at each step (retry logic)

**8.3 Real Data vs Mock Data Decision**
- **Option A**: Wait for backend integration, then connect real data all at once
- **Option B**: Fetch testnet/real data directly for testing, refactor later
- **Recommended**: Option A (avoid duplicate work, cleaner integration)

**8.4 Variable Mapping**
- Replace hardcoded values with variables
- Document shared variable names with backend team
- Keep variable mapping document updated

### Phase 9: Share Index Feature

**9.1 Share Modal Redesign**
- Link copy text box with copy button
- Social share icons: X (Twitter), Telegram, Instagram, Apple Share
- Layout: Coupang/Musinsa style (text box + icon row)

**9.2 Link Generation**
- Generate shareable link for launched index
- Support deep linking to index detail page
- Handle URL parameters correctly

**9.3 Social Integration**
- X (Twitter): Pre-filled tweet with index link
- Telegram: Share message with link
- Instagram: Copy link for bio/story
- Apple Share: Native share sheet (iOS/macOS)

**9.4 PnL Card Option**
- Generate visual PnL card (image)
- Include index name, composition, performance metrics
- Downloadable or shareable as image

**9.5 Additional Share Buttons**
- Add share button on completed index card (after launch)
- Consistent share UI across Launch and Portfolio pages

---

## Implementation Order

1. **Documentation & Constants** (Phase 1) - Foundation
2. **UI/UX Polish** (Phase 7) - Quick wins, improve UX immediately
3. **Component Search & Discovery** (Phase 2) - Fix critical bug, improve usability
4. **Composition Input Refinement** (Phase 4) - Enable precise allocation
5. **Backtesting & Performance Metrics** (Phase 3) - Professional features
6. **Real-time Cost Calculation** (Phase 5) - Core transparency feature
7. **Inline Swap Removal & Auto-Swap** (Phase 6) - Requires backend coordination
8. **Launch Process & Real Data Integration** (Phase 8) - Backend integration phase
9. **Share Index Feature** (Phase 9) - Post-launch enhancement

---

## Success Criteria

- [ ] All 19 feedback items addressed
- [ ] Asset search returns all SPOT assets correctly
- [ ] Real-time cost calculation with full fee breakdown
- [ ] Backtesting supports 1d/7d/30d/1y periods with Sharpe + MDD
- [ ] Decimal composition input with auto-rounding
- [ ] Auto-swap removes manual swap UI
- [ ] Share modal with link copy + 4 social platforms
- [ ] Index Details modal matches CoreIndex detail level
- [ ] All terminology consistent (HYPE, Backtesting, Total Cost)
- [ ] Launch process uses real data (not mockup)
- [ ] Backend Integration Checklist updated
- [ ] HANDOVER.md updated with launch page changes

---

*Document created: 2025-10-28*
*Last updated: 2025-10-29*
*Based on feedback: "Re Launch 페이지 coreindex 리소스로 Feedback"*
*Updated to reflect: VIP Tier + Fee Structure integration (Currency System Refactoring)*
