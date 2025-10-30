# Discover Page Polish - Task Plan

**Created**: 2025-10-29
**Based on**: Henry Feedback (2025-10-25)
**Status**: Planning
**Priority**: Week 5-6

---

## UX or 세부 컴포넌트 항목

### 1. Search Logic Enhancement
**Current Issue**: Search matches index name, symbol, AND description, causing irrelevant results (searching "Moon" returns "DiamondIDX" because description contains "to the moon")

**Target**: Search only by index name and ticker symbol

---

### 2. Dynamic Category Criteria
**Current Issue**: Hot, New, Top Gainers, Top Losers, High Volume categories use hardcoded mock data

**Target**: Define clear criteria and calculate dynamically from real-time data

**Criteria Definition**:
- **Hot**: Highest 24h trading volume growth rate (%)
- **New**: Created within last 7 days
- **Top Gainers**: Highest positive 24h price change (%)
- **Top Losers**: Highest negative 24h price change (%)
- **High Volume**: Top 20% by 24h trading volume (absolute)

---

### 3. Partner Indices Category
**Current Issue**: No dedicated category for Partner layer indices

**Target**: Add "Partner Indices" as a separate filter button in basic filters row

---

### 4. Index Name Validation (No Emoji)
**Current Issue**: Users can include emoji in index names, causing visual inconsistency

**Target**: Enforce alphanumeric + spaces only for index name and ticker at launch

**Validation Rules**:
- Name: Alphanumeric characters, spaces, hyphens only
- Ticker: Uppercase alphanumeric only (3-6 characters)
- No emoji, no special characters beyond hyphen

---

### 5. Brand Color Standardization
**Current Issue**: Too many colors used inconsistently across the page

**Target**:
- **Profit/Loss colors**: Keep green/red but reduce saturation
  - Green: `#10b981` → `#4ade80` (softer emerald)
  - Red: `#ef4444` → `#f87171` (softer rose)
- **All other UI elements**: Use brand color (#98FCE4 mint) with tone variations
  - Layer badges: Mint tone variations
  - VS Battle badges: Mint tone variations
  - Buttons, borders, highlights: Mint-based
  - Background: `#072723` (dark teal)

---

### 6. Composition Filter UX Redesign
**Current Issue**: Button-based selection is inefficient for 50+ assets

**Target**:
- Scrollable asset list with checkboxes
- Search bar to filter asset list
- Match Any/All toggle preserved
- Use actual HyperCore spot asset data (not hardcoded list)

---

### 7. Composition Asset List Sync with Launcher
**Current Issue**: Discover page composition filter uses different asset list than Launcher

**Target**: Use identical asset data source as Launch page for consistency

---

### 8. Performance & NAV Range Slider UX
**Current Issue**: Only numeric input fields, not intuitive for range selection

**Target**:
- Slider bar with min/max handles (like Launch page asset composition)
- Keep numeric input boxes for precise values
- Preset buttons as quick shortcuts (positioned on slider track for visual clarity)
- Reference: Launch page asset composition slider

---

### 9. Volume & Liquidity Range Slider
**Current Issue**: Same as Performance & NAV - only numeric inputs

**Target**: Apply same slider + input box pattern as above

---

### 10. Segment Filter (Theme-Based)
**Current Issue**: No way to filter by thematic categories (MEME, Solana, RWA, etc.)

**Target**:
- Add "Segment Filter" section in Advanced Filters modal
- Multi-select tags (indexes can have multiple segments)
- Segments: MEME, DeFi, GameFi, AI, Solana Ecosystem, RWA, Stablecoin, NFT, DAO, Privacy, Layer 1, Layer 2
- Logic: Show index if it matches ANY selected segment (OR logic)

---

## 레퍼런스

### Primary References

1. **Binance Futures** (Filter & Range Selection)
   - URL: https://www.binance.com/en/futures/
   - What to study: Advanced filters modal, slider-based range selection, preset buttons
   - Why: Industry standard for trading platform filters

2. **Axiom** (Search & Discovery)
   - URL: https://axiom.trade
   - What to study: Index search behavior, category filters, minimal color usage
   - Why: Similar product (index trading), successful UX

3. **Hyperliquid** (Clean UI)
   - URL: https://app.hyperliquid.xyz
   - What to study: Brand color consistency, minimal UI
   - Why: Our UI inspiration, professional trading aesthetic

4. **Coupang / Musinsa** (E-commerce Filters)
   - What to study: Multi-faceted filter panels, slider ranges, tag selection
   - Why: Excellent filter UX for complex product discovery (similar to index discovery)

### Secondary References

5. **Uniswap V2** (Token Search)
   - What to study: Token search logic (name + symbol only)
   - Why: Standard for crypto asset search

---

## 용이성의 근거

### Search Logic Enhancement

**채택 방안**: Index name + ticker symbol only
- Users expect search to match visible identifiers (name/ticker)
- Description search creates false positives (irrelevant results)
- Faster search performance (smaller search space)

**비채택 대안 #1**: Keep description search, improve ranking
- Rejected: Still causes confusion when irrelevant results appear
- No clear way to communicate to user why "DiamondIDX" matches "Moon"

**비채택 대안 #2**: Separate "Advanced Search" with description
- Rejected: Over-complicates UX, users won't understand distinction
- 95% of use cases satisfied by name/ticker search

---

### Dynamic Category Criteria

**채택 방안**: Calculate from real-time market data
- Accurate, trustworthy information
- Updates automatically as market changes
- No manual maintenance needed

**비채택 대안 #1**: Manual curation by admin
- Rejected: Not scalable, requires constant updates
- Subjective decisions reduce trust

**비채택 대안 #2**: User voting for "Hot" status
- Rejected: Gameable, doesn't reflect actual market activity
- Social features not our focus in Phase 0

---

### Brand Color Standardization

**채택 방안**: Mint tone variations + softer profit/loss colors
- Consistent brand identity (#98FCE4 mint)
- Professional trading aesthetic (not overwhelming)
- Profit/loss colors still immediately recognizable

**비채택 대안 #1**: Full color standardization (mint only)
- Rejected: Profit/loss MUST be green/red for instant recognition
- Industry standard, users expect it

**비채택 대안 #2**: Multiple brand colors (rainbow palette)
- Rejected: Looks unprofessional, confuses visual hierarchy
- Reference platforms (Hyperliquid, Binance) use 1-2 primary colors

---

### Composition Filter UX Redesign

**채택 방안**: Scrollable list + search + checkboxes
- Handles 50+ assets efficiently (scrollable)
- Search enables fast discovery of specific asset
- Checkboxes show selected state clearly
- Reference: Coupang filter panels

**비채택 대안 #1**: Keep button grid
- Rejected: Doesn't scale beyond ~20 assets
- No way to search within buttons
- Takes up too much vertical space

**비채택 대안 #2**: Dropdown multi-select
- Rejected: Hidden options (bad discoverability)
- Awkward UX for selecting 5+ items

---

### Performance & NAV Range Slider UX

**채택 방안**: Slider + input box + preset buttons
- Visual + precise input (best of both worlds)
- Presets positioned on slider track show common ranges at a glance
- Reference: Launch page asset composition, Binance Futures filters

**비채택 대안 #1**: Input boxes only (current)
- Rejected: Not intuitive for range selection
- No visual feedback of range position

**비채택 대안 #2**: Slider only (no input boxes)
- Rejected: Difficult to set precise values (e.g., exactly $1M)
- Power users need precision

---

### Segment Filter (Theme-Based)

**채택 방안**: Multi-select tags with OR logic
- Reflects reality (indexes span multiple themes)
- Users can explore specific narratives (MEME, AI, RWA)
- Industry standard: CoinGecko, CoinMarketCap use category tags

**비채택 대안 #1**: Single-select segments only
- Rejected: Many indexes legitimately fit multiple categories
- Forces artificial single categorization

**비채택 대안 #2**: No segment filter (composition filter enough)
- Rejected: Users think in themes ("show me all AI indexes")
- Composition filter requires knowing specific tokens

---

## 타 페이지 및 컴포넌트와의 관계성

### Launch Page Integration
**Shared Components**:
- Asset list data source (must be identical)
- Slider + input box pattern (reuse same component)
- Brand color palette
- Index name/ticker validation rules

**Consistency Requirements**:
- Discover filter composition list = Launch asset selection list
- Same slider behavior for range selection
- Same validation rules for index names (if creating from Discover someday)

---

### Trading Page Integration
**Shared Components**:
- IndexDetailModal (click index row → open modal)
- Brand color palette
- Price display format
- Layer badges styling

**Flow**:
- User filters indexes in Discover → clicks index → opens IndexDetailModal
- From modal → clicks "Trade" → routes to Trading page with pre-selected index

---

### Portfolio Page Integration
**Shared Components**:
- IndexDetailModal (user's held indexes)
- Index row display format (can reuse IndexList row component)

---

### Global Component Dependencies
**Reusable Components to Extract**:
1. `<RangeSlider>` - Slider + input box + presets (for Discover, Launch)
2. `<AssetSearchList>` - Scrollable + searchable asset list (for Discover, Launch)
3. `<SegmentBadge>` - Theme tag display (for Discover, potentially Index cards elsewhere)
4. `<ColorPalette>` - Brand color constants (for all pages)

**Shared Constants**:
- `lib/constants/colors.ts` - Brand color definitions
- `lib/constants/segments.ts` - Segment categories list
- `lib/constants/assets.ts` - HyperCore spot asset data

---

## 상세 계획 - 실행 절차

### Phase 1: Foundation & Research (Day 1-2)

**1.1 Reference Research**
- [ ] Study Binance Futures advanced filters modal
- [ ] Study Coupang filter panels (slider UX)
- [ ] Study Axiom search behavior
- [ ] Document findings in `docs/research/filter-ux-research.md`

**1.2 Color Standardization**
- [ ] Create `lib/constants/colors.ts` with brand palette
  ```typescript
  // Brand colors (mint-based)
  PRIMARY: '#98FCE4',
  PRIMARY_LIGHT: '#B0FFF0',
  PRIMARY_DARK: '#6BBDCC',
  BACKGROUND: '#072723',

  // Profit/Loss (softer tones)
  PROFIT: '#4ade80',  // was #10b981
  LOSS: '#f87171',    // was #ef4444
  ```
- [ ] Update Discover page to use new color constants
- [ ] Update Layer badges to use mint tone variations
- [ ] Update VS Battle badges to use mint tone variations

**1.3 Data Definitions**
- [ ] Create `lib/constants/segments.ts` with segment list
  ```typescript
  export const SEGMENTS = [
    'MEME', 'DeFi', 'GameFi', 'AI',
    'Solana Ecosystem', 'RWA', 'Stablecoin',
    'NFT', 'DAO', 'Privacy', 'Layer 1', 'Layer 2'
  ]
  ```
- [ ] Define category criteria in `lib/utils/indexCategories.ts`
  - Hot: 24h volume growth rate calculation
  - New: Created date check (< 7 days)
  - Top Gainers/Losers: Sort by 24h price change
  - High Volume: Top 20% percentile calculation

---

### Phase 2: Reusable Components (Day 3-4)

**2.1 RangeSlider Component**
- [ ] Create `components/ui/range-slider.tsx`
  - Dual handle slider (min/max)
  - Numeric input boxes (left: min, right: max)
  - Preset buttons (positioned on slider track)
  - Responsive design
- [ ] Reference: Launch page asset composition slider
- [ ] Make generic (accepts min, max, step, unit props)

**2.2 AssetSearchList Component**
- [ ] Create `components/discover/asset-search-list.tsx`
  - Search input at top
  - Scrollable checkbox list (virtualized if >50 items)
  - "Select All" / "Clear All" buttons
  - Selected count badge
- [ ] Use HyperCore spot asset data source
- [ ] Reusable for Launch page

---

### Phase 3: Search & Validation (Day 5)

**3.1 Search Logic**
- [ ] Update search function in `components/discover/index-list.tsx`
  - Search only `index.name` and `index.symbol`
  - Remove `index.description` from search
- [ ] Add search debounce (300ms)
- [ ] Test with various queries

**3.2 Index Name Validation**
- [ ] Create `lib/utils/validation.ts`
  ```typescript
  export function validateIndexName(name: string): boolean {
    return /^[a-zA-Z0-9\s\-]+$/.test(name)
  }
  export function validateTicker(ticker: string): boolean {
    return /^[A-Z0-9]{3,6}$/.test(ticker)
  }
  ```
- [ ] Apply to Launch page form validation
- [ ] Show clear error messages

---

### Phase 4: Basic Filters Enhancement (Day 6)

**4.1 Partner Indices Category**
- [ ] Add "Partner Indices" button to filter row
- [ ] Filter logic: `index.layer === 'partner'`
- [ ] Position: After "High Volume", before Layer filters

**4.2 Dynamic Category Calculation**
- [ ] Implement `calculateHotIndices()` - 24h volume growth
- [ ] Implement `calculateNewIndices()` - creation date check
- [ ] Implement `calculateGainersLosers()` - 24h price change
- [ ] Implement `calculateHighVolume()` - top 20% percentile
- [ ] Replace mock data with calculated results
- [ ] Add loading state while calculating

---

### Phase 5: Advanced Filters Redesign (Day 7-9)

**5.1 Composition Filter**
- [ ] Replace button grid with `<AssetSearchList>`
- [ ] Match Any/All toggle above list
- [ ] Selected assets displayed as tags
- [ ] Sync asset list with Launch page

**5.2 Performance & NAV Range**
- [ ] Replace input-only with `<RangeSlider>`
- [ ] Performance presets: 0-10%, 10-50%, 50-100%, -50-0%
- [ ] NAV presets: <$1M, $1M-$10M, >$10M
- [ ] 24h/7d/30d tabs for Performance

**5.3 Volume & Liquidity Range**
- [ ] Replace input-only with `<RangeSlider>`
- [ ] Volume presets: >$100K, >$1M, >$10M
- [ ] Liquidity presets: >$100K, >$1M, >$10M

**5.4 Segment Filter (NEW)**
- [ ] Add "Segment" section to Advanced Filters modal
- [ ] Multi-select tags (12 segments)
- [ ] OR logic (match any selected segment)
- [ ] Visual: Tag-based selection (like Composition Match Any/All)
- [ ] Active segment count badge

---

### Phase 6: Integration & Testing (Day 10-11)

**6.1 Filter Logic Integration**
- [ ] Combine all filters in `app/discover/page.tsx`
  - Basic filters (category, layer, partner)
  - Composition filter
  - Performance/NAV ranges
  - Volume/Liquidity ranges
  - Segment filter
- [ ] Test filter combinations (composition + segment + performance)
- [ ] Ensure correct AND/OR logic

**6.2 IndexDetailModal Integration**
- [ ] Import unified IndexDetailModal component
- [ ] Pass selected index data on row click
- [ ] Test modal → Trading page flow

**6.3 Responsive Testing**
- [ ] Test on 1920px (desktop)
- [ ] Test on 1440px (laptop)
- [ ] Test on 1024px (tablet)
- [ ] Test on 768px (mobile)
- [ ] Adjust slider sizes for mobile

---

### Phase 7: Polish & Documentation (Day 12)

**7.1 Visual Polish**
- [ ] Verify all colors use brand palette
- [ ] Check Layer badge colors (mint variations)
- [ ] Check VS Battle badge colors (mint variations)
- [ ] Ensure profit/loss colors are softer tones
- [ ] Remove any remaining emoji or inconsistent colors

**7.2 Performance Optimization**
- [ ] Virtualize index list if >100 items
- [ ] Memoize filter calculations
- [ ] Debounce all search inputs
- [ ] Test with 200+ indexes

**7.3 Documentation**
- [ ] Update `docs/handover/HANDOVER.md` with session summary
- [ ] Document new components in component library
- [ ] Update TASK_PRIORITY.md (mark Discover section complete)

---

## Success Criteria

### Functional Requirements
- [ ] Search returns only name/ticker matches (no false positives)
- [ ] Hot/New/Gainers/Losers calculated from real-time data
- [ ] Partner Indices category works correctly
- [ ] Index names validated (no emoji)
- [ ] All filters work in combination
- [ ] Segment filter displays indexes with ANY matching segment

### UX Requirements
- [ ] Slider ranges are intuitive and responsive
- [ ] Preset buttons provide quick common ranges
- [ ] Composition filter scales to 50+ assets
- [ ] Asset list synced with Launch page
- [ ] Search in asset list is fast (<300ms)

### Visual Requirements
- [ ] Brand color (#98FCE4 mint) used consistently
- [ ] Profit/loss colors softer but recognizable
- [ ] Layer badges use mint tone variations
- [ ] No emoji or inconsistent colors
- [ ] Clean, professional aesthetic (Hyperliquid-style)

### Performance Requirements
- [ ] Filter application <500ms for 100 indexes
- [ ] Search debounce prevents lag
- [ ] Virtualized list handles 200+ indexes smoothly
- [ ] No layout shift during filter changes

---

## Files to Create

### New Files
1. `lib/constants/colors.ts` - Brand color palette
2. `lib/constants/segments.ts` - Segment categories
3. `lib/utils/indexCategories.ts` - Category calculation logic
4. `lib/utils/validation.ts` - Name/ticker validation
5. `components/ui/range-slider.tsx` - Reusable range slider
6. `components/discover/asset-search-list.tsx` - Reusable asset list
7. `docs/research/filter-ux-research.md` - Reference research findings

### Files to Modify
1. `components/discover/index-list.tsx` - Search logic, category filters
2. `components/discover/advanced-filters-modal.tsx` - Slider UX, segment filter
3. `app/discover/page.tsx` - Filter integration, segment filter state
4. `app/launch/page.tsx` - Apply name validation

---

## Estimated Timeline

**Total**: 12 days (2.5 weeks)

- Phase 1: Research & Foundation (2 days)
- Phase 2: Reusable Components (2 days)
- Phase 3: Search & Validation (1 day)
- Phase 4: Basic Filters (1 day)
- Phase 5: Advanced Filters (3 days)
- Phase 6: Integration & Testing (2 days)
- Phase 7: Polish & Documentation (1 day)

**Risk Buffer**: +2 days for unexpected issues

**Target Completion**: Week 5-6 (Nov 4 - Nov 17)

---

## Dependencies

### Blocks
- Currency System standardization (affects price display)
- Fee Structure (if showing fee tiers in filters someday)

### Blocked By
- None (can start immediately after Fee Structure + Launch Phase 1)

### Parallel Work Possible
- Can work on Phase 1-2 (components) while Launch Phase 2 is ongoing

---

**Next Review**: After Phase 3 completion (search + validation)
**Success Metric**: User can find any index in <10 seconds using filters
