# Phase 8 Work Log - Launch Browse Assets Refactoring + UI Manual

> **Date**: 2025-11-06
> **Purpose**: Fix Launch page Browse Assets + Create UI refactoring workflow
> **Status**: ✅ Complete

---

## Overview

Two-part session: Fix Browse Assets modal bugs + Create comprehensive UI refactoring manual for environment switching (laptop → desktop).

### Part 1: Browse Assets Modal Refactoring
- Connect to real Hyperliquid API
- Add Buy/Sell selection buttons
- Column-based sorting (IndexDropdown pattern)
- Remove unnecessary filters

### Part 2: UI Refactoring Documentation
- Complete workflow manual (Korean)
- IndexInfoBar refactoring task example
- DevTools extraction guide

---

## Part 1: Browse Assets Modal Refactoring

### Issues Identified

**User Feedback**:
> "launch에서 browse assets 부분 너무 엉터리네? hyperliquid의 spot 자산이 검색되는 게 아니고, 그냥 되도않는 자산이 검색되는데? 전에 연결해놨던 자산목록 왜 버려?"

**Problems**:
1. Wrong mock data (8 meme coins from `lib/mock/assets.ts`)
2. Hyperliquid API not connected (backend ready but unused)
3. Buy/Sell selection not working (always defaults to Buy)
4. Sort UI inconsistent (dropdown vs column headers)
5. Unnecessary filters (Chain, Layer badges)

---

### Solution

#### 1. API Integration

**Before** (`app/api/launch/assets/route.ts`):
```typescript
// Only returned basic fields
const simplifiedAssets = assets.map(asset => ({
  symbol: asset.symbol,
  name: asset.name,
  marketType: asset.marketType,
}));
```

**After**:
```typescript
// Include price and volume data
const simplifiedAssets = assets.map(asset => ({
  symbol: asset.symbol,
  name: asset.name,
  marketType: asset.marketType,
  markPx: asset.markPx,              // Current price
  prevDayPx: asset.prevDayPx,        // Previous day price
  change24hPct: asset.change24hPct,  // 24h change %
  dayNtlVlm: asset.dayNtlVlm,        // 24h volume
}));
```

#### 2. UI Overhaul - Column-Based Sorting

**Before** (Dropdown sorting):
```tsx
<Select value={sortBy} onValueChange={setSortBy}>
  <SelectItem value="name">Name (A-Z)</SelectItem>
  <SelectItem value="liquidity">Liquidity</SelectItem>
  <SelectItem value="volume">Volume</SelectItem>
</Select>
```

**After** (Column headers):
```tsx
// Table Header
<div className="grid grid-cols-12 gap-2 px-3 py-2">
  <button onClick={() => handleSort('symbol')} className="col-span-2">
    Symbol <SortIcon column="symbol" />
  </button>
  <button onClick={() => handleSort('name')} className="col-span-3">
    Name <SortIcon column="name" />
  </button>
  <button onClick={() => handleSort('price')} className="col-span-2">
    Price <SortIcon column="price" />
  </button>
  <button onClick={() => handleSort('change24h')} className="col-span-2">
    24h % <SortIcon column="change24h" />
  </button>
  <button onClick={() => handleSort('volume24h')} className="col-span-2">
    Volume <SortIcon column="volume24h" />
  </button>
  <div className="col-span-1">Action</div>
</div>
```

**Sorting Logic**:
```tsx
const handleSort = (column: SortColumn) => {
  if (sortColumn === column) {
    // Toggle direction
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  } else {
    // New column, default ascending
    setSortColumn(column)
    setSortDirection('asc')
  }
}

const SortIcon = ({ column }: { column: SortColumn }) => {
  if (sortColumn !== column) return null
  return sortDirection === 'asc' ? (
    <ChevronUp className="w-3 h-3 inline ml-1" />
  ) : (
    <ChevronDown className="w-3 h-3 inline ml-1" />
  )
}
```

#### 3. Buy/Sell Selection

**Before**:
```tsx
// Asset row onClick - always Buy
<div onClick={() => handleSelectAsset(asset)}>
  {/* Asset info */}
</div>
```

**After**:
```tsx
// Separate Buy/Sell buttons
<div className="col-span-1 flex gap-1">
  <button
    onClick={() => handleSelectAsset(asset, 'long')}
    className="flex-1 px-2 py-1 bg-green-500/20 text-green-400"
  >
    Buy
  </button>

  {/* Spot assets: Buy only */}
  {asset.marketType !== 'spot' && (
    <button
      onClick={() => handleSelectAsset(asset, 'short')}
      className="flex-1 px-2 py-1 bg-red-500/20 text-red-400"
    >
      Sell
    </button>
  )}
</div>
```

**Function Signature Update**:
```typescript
// hooks/use-launch-form.ts
const addAsset = (a: Asset, side: PositionSide) => {
  const newAsset: SelectedAsset = {
    symbol: a.symbol,
    name: a.name,
    side: side,  // 'long' or 'short'
    leverage: a.marketType === "spot" ? 1 : 5,
    marketType: a.marketType,
  };
  // ...
}
```

#### 4. AssetSelectionStep - Display Selected Side

**Before** (Always "Buy (Spot)"):
```tsx
<div className="px-3 py-1 rounded bg-green-500 text-white">
  Buy (Spot)
</div>
```

**After** (Dynamic based on selection):
```tsx
<div
  className={cn(
    "px-3 py-1 rounded text-xs font-medium",
    a.side === "long"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-red-500/20 text-red-400 border border-red-500/30"
  )}
>
  {a.side === "long" ? "Buy (Long)" : "Sell (Short)"}
</div>
```

#### 5. Removed Elements

**Before**:
- Chain dropdown: "All Chains" / "Layer 3"
- Sort dropdown: Name, Liquidity, Volume, Performance
- Quick filter badges: High Liquidity, Top Performers, High Volume
- Layer badges on each asset

**After**:
- Clean UI with search input only
- Column-based sorting
- No filters (Hyperliquid assets are homogeneous)

---

### Files Modified

**1. AssetSearchModal.tsx** (Complete refactor - 306 lines):
- API integration with `/api/launch/assets`
- Column-based sorting
- Buy/Sell buttons
- Removed filters and badges
- Table layout (grid-cols-12)

**2. use-launch-form.ts**:
- `addAsset(asset, side: PositionSide)` signature
- Import PositionSide type

**3. AssetSelectionStep.tsx**:
- Display selected side with colors
- "Buy (Long)" / "Sell (Short)" badges

**4. app/api/launch/assets/route.ts**:
- Include `markPx`, `change24hPct`, `dayNtlVlm`

**5. lib/mock/assets.ts** - **Deleted**:
- No longer needed (using real API)

---

## Part 2: UI Refactoring Documentation

### Motivation

**User Request**:
> "앞으로 이 UI 작업을 진행할 때 어떤 파일들을 요구하는지 f12 눌러서 어떤 요소를 복사하고 필요하다면 특정 파일을 다운받아야 하는지에 대한 매뉴얼을 먼저 만드는 게 좋을 것 같아."

**Context**:
- Laptop environment (cannot run dev server - overheating)
- Desktop environment (can run dev server)
- Need consistent workflow when switching environments
- UI improvements will reference Hyperliquid/Axiom.trade

---

### Documents Created

#### 1. UI_REFACTORING_MANUAL.md

**Location**: `docs/ui-refactoring/UI_REFACTORING_MANUAL.md`
**Language**: Korean (사용자 요청)
**Length**: ~350 lines

**Contents**:
- **Phase 1: Reference Analysis** (15 min)
  - Component selection
  - Screenshots
  - Animation recording

- **Phase 2: Code Extraction** (15 min)
  - HTML structure (DevTools → Copy element)
  - CSS styles (Styles/Computed tabs)
  - Library identification (Sources tab)
  - Layout structure (Grid/Flexbox)

- **Phase 3: Documentation** (10 min)
  - Folder structure
  - Task document template
  - File naming conventions

- **Phase 4: Implementation** (30-40 min)
  - Matching strategy (existing libraries first)
  - CSS-only solutions
  - Library installation (last resort)

- **Phase 5: Testing & Deployment** (10 min)
  - Local test (if possible)
  - Vercel deployment
  - Validation checklist

- **Quick Reference**:
  - DevTools shortcuts
  - CSS patterns (Hyperliquid grid, two-line layout)
  - Brand colors
  - Common pitfalls

#### 2. INDEXINFOBAR_REFACTORING.md

**Location**: `docs/ui-refactoring/tasks/INDEXINFOBAR_REFACTORING.md`
**Purpose**: Concrete example of task documentation
**Length**: ~400 lines

**Contents**:
- **Goal**: Trading page IndexInfoBar Hyperliquid-style refactoring
- **Current Issues**: 6 problems identified
- **Reference**: Hyperliquid info bar HTML included
- **Changes**: 6 sections with Before/After code
  1. Layout (height 48px → 64px)
  2. Index Dropdown redesign (logo, two-line text, arrow)
  3. Price info rearrangement (title top, value bottom)
  4. ChartArea cleanup (remove duplicate info)
  5. Graduation progress (brand color)
  6. Metrics grid layout
- **Files to Modify**: 5 files listed
- **Priority**: High (after user UI plan completion)
- **Estimated Time**: 40 minutes
- **Testing Checklist**: Functionality, UI, responsive, brand consistency

---

## Git Commits

### Commit 1: Browse Assets Refactoring
**Hash**: `7a93392`
**Message**:
```
feat(launch): refactor Browse Assets modal - Hyperliquid API + Buy/Sell selection

AssetSearchModal Complete Refactor:
- Connect to Hyperliquid API (/api/launch/assets) for real asset data
- Replace mock data (lib/mock/assets.ts) with live spot assets
- Add Buy/Sell buttons for each asset row:
  * Spot assets: Buy button only (no short selling)
  * Perp assets: Buy + Sell buttons (long/short available)
- Implement column-based sorting (IndexDropdown pattern):
  * Sortable columns: Symbol, Name, Price, 24h %, Volume
  * ChevronUp/ChevronDown indicators
  * Click header to toggle asc/desc
- Display metrics: Price (markPx), 24h Change %, Volume (dayNtlVlm)
- Remove unnecessary UI elements:
  * Chain dropdown filter
  * Sort dropdown (replaced by column headers)
  * Quick filter badges
  * Layer badges
```
**Files**: 5 changed (264 insertions, 189 deletions)

### Commit 2: API Data Fix
**Hash**: `b651ffc`
**Message**:
```
fix(api): include price and volume data in launch assets endpoint

Previously returned only symbol, name, marketType which caused all
metrics to display as '-' in AssetSearchModal.

Now includes:
- markPx (current price)
- prevDayPx (previous day price)
- change24hPct (24h change percentage)
- dayNtlVlm (24h volume)
```
**Files**: 1 changed (5 insertions, 1 deletion)

---

## Testing

### Browse Assets Modal

**Tested**:
- [x] Modal opens on "Browse Assets" button click
- [x] Hyperliquid spot assets displayed
- [x] Search by symbol/name works
- [x] Column sorting (all 5 columns)
- [x] Sort direction toggle (asc/desc)
- [x] ChevronUp/Down icons display correctly
- [x] Buy button adds asset as "long"
- [x] Sell button adds asset as "short" (Perp only)
- [x] Spot assets show Buy only
- [x] Selected assets filtered out
- [x] Price, 24h %, Volume display correctly
- [x] AssetSelectionStep shows Buy/Sell badge with colors

**Vercel Deployment**:
- User tested on Vercel (laptop)
- Confirmed all data displays correctly

---

## User Feedback Addressed

### Browse Assets Issues
1. ✅ Connect to Hyperliquid API (not mock data)
2. ✅ Use real spot asset list
3. ✅ Add Buy/Sell selection
4. ✅ Spot = Buy only, Perp = Buy + Sell
5. ✅ Column-based sorting (IndexDropdown pattern)
6. ✅ Remove Chain, Layer filters
7. ✅ Display Price, 24h %, Volume

### UI Manual Request
1. ✅ Create comprehensive workflow manual
2. ✅ DevTools usage guide
3. ✅ Code extraction methods
4. ✅ Documentation template
5. ✅ Implementation strategy
6. ✅ Concrete example (IndexInfoBar)
7. ✅ Korean language (user preference)

---

## Next Steps

### Immediate (High Priority)
1. **User completes UI plan** - Document all component improvements
2. **IndexInfoBar refactoring** - First UI task
   - Follow `INDEXINFOBAR_REFACTORING.md`
   - Collect Hyperliquid references (HTML, CSS, screenshots)
   - Implement on desktop environment
3. **Other UI components** - Based on user plan

### Deferred (Medium/Low Priority)
4. Trading Info/Data tabs
5. Mobile responsiveness
6. Chart performance

---

## Notes

**Environment Workflow**:
- Laptop: Code editing, git commits, Vercel testing
- Desktop: Dev server, real-time preview, intensive testing
- Manual: Ensures consistency across environments

**Documentation Structure**:
```
docs/
  ui-refactoring/
    UI_REFACTORING_MANUAL.md (general workflow)
    references/
      hyperliquid/ (HTML, CSS, screenshots)
      axiom/ (HTML, CSS, screenshots)
    tasks/
      INDEXINFOBAR_REFACTORING.md (specific task)
      [Future tasks...]
```

**Key Decisions**:
- Korean language for manuals (user preference)
- Existing libraries first (MagicUI/Aceternity)
- CSS-only when possible
- Library installation last resort

---

## Status

✅ Phase 8 complete (Browse Assets + UI Manual)
⏳ Waiting for user UI plan completion
➡️ Next: IndexInfoBar refactoring (High priority)
