# Task Priority - 2025NOV01

> **Last Updated**: 2025-11-06
> **Status**: Phase 8 Complete - Awaiting User UI Plan

---

## Current Status

**Phase 8 Complete**:
- ✅ Browse Assets modal refactored (Hyperliquid API integration)
- ✅ Buy/Sell selection buttons (Spot = Buy only, Perp = Buy + Sell)
- ✅ Column-based sorting (Symbol, Name, Price, 24h %, Volume)
- ✅ UI Refactoring Manual created (Korean, 350 lines)
- ✅ IndexInfoBar refactoring task document created (Korean, 400 lines)

**Next**: User completes UI improvement plan → IndexInfoBar refactoring

---

## High Priority (Execute Immediately)

### 1. IndexInfoBar Refactoring (HIGHEST PRIORITY)
**When**: After user completes UI plan document
**Document**: `docs/ui-refactoring/tasks/INDEXINFOBAR_REFACTORING.md`
**Estimated Time**: 40 minutes

**Changes**:
- Height increase (48px → 64px)
- Index Dropdown redesign (logo, two-line text, arrow)
- Price info rearrangement (title top, value bottom)
- ChartArea cleanup (remove duplicate info)
- Graduation progress (brand color #98FCE4)
- Metrics grid layout (Hyperliquid style)

**Why High Priority**:
- User specifically requested this as first UI task
- Hyperliquid references already documented
- Clear Before/After code provided
- Improves most visible component (sticky header)

**Files to Modify**:
- `components/trading/IndexInfoBar.tsx` (main work)
- `components/trading/ChartArea.tsx` (cleanup)
- `components/portfolio/GraduationProgress.tsx` (color)
- `components/layout/TradingLayout.tsx` (spacing check)
- `components/layout/Header.tsx` (spacing check)

---

### 2. Other UI Components (Based on User Plan)
**When**: After user shares UI plan document
**Estimated Time**: TBD (depends on user plan)

**Process**:
1. User documents reference code from Hyperliquid/Axiom.trade
2. Review user's format:
   ```
   # [Component] Source Code
   ## 해당 페이지 html 구조
   <!DOCTYPE html> ...
   ## Layout CSS
   ...
   ## 전체(혹은 주변) 그리드 CSS
   ...
   ## Third-Party Libraries Needed
   - Aceternity -@@@
   ```
3. Create individual task documents (like INDEXINFOBAR_REFACTORING.md)
4. Execute based on priority order from user

**Why High Priority**:
- UI improvements are Phase 8-9 focus
- User is actively preparing reference materials
- Tangible visual improvements for demo

---

## Medium Priority (After High Priority Complete)

### 3. Trading Info/Data Tabs Refactoring
**Document**: `docs/planning/2025NOV01/task-plans/TRADING_INFO_DATA_TABS.md`
**Estimated Time**: 2-3 hours

**Changes**:
- Info tab: Index description, compositions, creator info
- Data tab: Trading data, volume breakdown, holder statistics
- Hyperliquid-style layout and content organization

**Why Medium Priority**:
- Less visible than main trading UI
- Requires more backend data integration
- Can be deferred until core UI complete

---

### 4. Launch Page Additional Enhancements
**Reference**: Phase_5-8_UI_Enhancements.md (Step 6.2-6.7)

**Remaining Tasks**:
- Backtesting periods extension (1d / 7d / 30d / 1y)
- Sharpe Ratio and MDD display
- Composition input dual system (slider + text)
- Index Details Modal improvements

**Why Medium Priority**:
- Launch page already functional
- Browse Assets already fixed in Phase 8
- Nice-to-have improvements, not critical

---

### 5. Discover Page UI Enhancements
**Reference**: Phase_5-8_UI_Enhancements.md (Step 8.1-8.5)

**Remaining Tasks**:
- Composition filter redesign (scrollable checkboxes)
- Range sliders for advanced filters
- Segment filter addition

**Why Medium Priority**:
- Discover page less critical for YC demo
- Trading and Launch pages more important
- Can be deferred

---

## Low Priority (Deferred)

### 6. Mobile Responsiveness Improvements
**Status**: Basic responsive layouts exist

**Why Low Priority**:
- YC demo primarily desktop-focused
- Trading interface optimized for desktop
- Mobile can be improved post-demo

---

### 7. Chart Performance Optimization
**Status**: TradingView charts functional

**Why Low Priority**:
- No performance issues reported
- Current implementation sufficient for demo
- Optimization can wait

---

### 8. Additional Trading Features
**Examples**:
- Multiple order types (trailing stop, OCO)
- Advanced position management
- Portfolio analytics

**Why Low Priority**:
- Core trading functionality complete
- Additional features not needed for demo
- Can be added post-YC application

---

## Blocked / Waiting

### User UI Plan Completion
**Blocking**: IndexInfoBar refactoring and other UI tasks
**Action Required**: User to document reference code from Hyperliquid/Axiom.trade
**Format**: User's chosen format (HTML structure, Layout CSS, Grid CSS, Third-Party Libraries)

**Once Unblocked**:
1. Review user's reference materials
2. Create task documents for each component
3. Prioritize based on visibility and impact
4. Execute IndexInfoBar first (already documented)

---

## Execution Order

**Immediate** (once user UI plan ready):
1. IndexInfoBar refactoring (40 min)
2. Test and deploy to Vercel
3. User validates on laptop
4. Proceed to next component from user plan

**Short Term** (this week):
- Complete 2-3 high-visibility UI components
- Trading Info/Data tabs if time permits

**Medium Term** (next week):
- Launch page enhancements
- Discover page improvements

**Deferred** (post-YC application):
- Mobile responsiveness
- Chart optimization
- Advanced trading features

---

## Decision Log

### Why IndexInfoBar First?
- Most visible component (sticky header, always on screen)
- Hyperliquid reference already extracted
- Clear design direction with Before/After code
- User explicitly requested as first task
- 40-minute estimate (quick win)

### Why Wait for User UI Plan?
- User actively gathering reference materials
- Need to understand full scope of UI changes
- Better to batch similar changes
- User's reference format will guide approach

### Why Defer Trading Info/Data Tabs?
- Less visible than main trading interface
- Requires more data than pure UI changes
- Current tabs functional, just need polish
- UI improvements more impactful for demo

---

## Notes

**UI Refactoring Workflow** (see `UI_REFACTORING_MANUAL.md`):
1. Phase 1: Reference Analysis (screenshots, HTML, CSS)
2. Phase 2: Code Extraction (DevTools)
3. Phase 3: Documentation (task documents)
4. Phase 4: Implementation (MagicUI/Aceternity first, CSS-only when possible)
5. Phase 5: Testing & Deployment (Vercel)

**Environment Context**:
- Laptop: Code editing, git commits, Vercel testing (no dev server)
- Desktop: Dev server, real-time preview, intensive testing
- Manual ensures consistency across environments

**Key Constraint**:
- No npm/pnpm library installations unless absolutely necessary
- Use existing MagicUI/Aceternity components first
- CSS-only solutions preferred

---

**Next Action**: Wait for user to complete UI plan document, then begin IndexInfoBar refactoring.
