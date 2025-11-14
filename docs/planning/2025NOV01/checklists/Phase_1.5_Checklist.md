# Phase 1.5 Checklist - Sidebar Removal & Footer Enhancement

**Created**: 2025-11-02
**Status**: In Progress

---

## 📋 Pre-Work Checklist

- [ ] Task Plan Phase 1.5 reviewed
- [ ] Component locations identified
- [ ] Mock data structure planned

---

## 🗑️ Part 1: Remove LeftSidebar Component

### 1.1 Remove from Trading Page
**File**: `app/trading/page.tsx`

- [ ] **CODE**: Remove `<LeftSidebar />` import statement
- [ ] **CODE**: Remove `<LeftSidebar />` component from JSX
- [ ] **VERIFY**: File compiles without errors
- [ ] **USER**: Check `/trading` page loads without sidebar

### 1.2 Remove from Launch Page
**File**: `app/launch/page.tsx`

- [ ] **CODE**: Remove `<LeftSidebar />` import statement
- [ ] **CODE**: Remove `<LeftSidebar />` component from JSX
- [ ] **VERIFY**: File compiles without errors
- [ ] **USER**: Check `/launch` page loads without sidebar

### 1.3 Remove from Governance Page
**File**: `app/governance/page.tsx`

- [ ] **CODE**: Remove `<LeftSidebar />` import statement
- [ ] **CODE**: Remove `<LeftSidebar />` component from JSX
- [ ] **VERIFY**: File compiles without errors
- [ ] **USER**: Check `/governance` page loads without sidebar

---

## 🎨 Part 2: Create Footer Component

### 2.1 Create Footer Component File
**File**: `components/layout/Footer.tsx`

- [ ] **CODE**: Create file structure
- [ ] **CODE**: Add TypeScript interface for props
- [ ] **CODE**: Add basic layout structure
- [ ] **VERIFY**: File syntax is valid
- [ ] **VERIFY**: No import errors

### 2.2 Add Network Status Section
**Layout**: `Network: 146ms | 21,000,001`

- [ ] **CODE**: Add Network label with brand color (#98FCE4)
- [ ] **CODE**: Add latency display (mock: 146ms)
- [ ] **CODE**: Add block height display (mock: 21,000,001)
- [ ] **CODE**: Add separator `|` between Network and Market Overview
- [ ] **VERIFY**: Text renders correctly
- [ ] **USER**: Check Network section displays with mint color

### 2.3 Add Market Overview Section
**Layout**: `Market Overview | Vol 24h (...) | IDX (...) | 24h TVL (...)`

- [ ] **CODE**: Add "Market Overview" label with brand color (#98FCE4)
- [ ] **CODE**: Add Vol 24h with tooltip
- [ ] **CODE**: Add IDX with tooltip
- [ ] **CODE**: Add 24h TVL with tooltip
- [ ] **CODE**: Use TooltipProvider from shadcn/ui
- [ ] **VERIFY**: All metrics render
- [ ] **USER**: Hover tooltips work on all metrics

### 2.4 Add Price Alerts Icon
**Position**: Rightmost in footer

- [ ] **CODE**: Add Bell icon (🔔 or lucide-react Bell)
- [ ] **CODE**: Add click handler to open popover
- [ ] **CODE**: Add hover state
- [ ] **VERIFY**: Icon renders
- [ ] **USER**: Icon clickable and shows hover effect

---

## 🔔 Part 3: Create Price Alerts Popover

### 3.1 Create PriceAlertsPopover Component
**File**: `components/layout/PriceAlertsPopover.tsx`

- [ ] **CODE**: Create file with Popover from shadcn/ui
- [ ] **CODE**: Add interface for PriceAlert type
- [ ] **CODE**: Add mock alerts data (3-5 alerts)
- [ ] **CODE**: Add positioning (above icon, not center)
- [ ] **VERIFY**: Popover component compiles
- [ ] **VERIFY**: No import errors

### 3.2 Design Popover Content
**Layout**: Simple card list, not modal

- [ ] **CODE**: Add header "Price Alerts"
- [ ] **CODE**: Add alert cards (index name, condition, target price)
- [ ] **CODE**: Add active/inactive indicator
- [ ] **CODE**: Add close button
- [ ] **CODE**: Style as simple card, NOT center-screen modal
- [ ] **VERIFY**: Layout matches design spec
- [ ] **USER**: Popover appears above icon (not center screen)

---

## 📊 Part 4: Mock Market Data

### 4.1 Create Mock Data File
**File**: `lib/mock/market-data.ts`

- [ ] **CODE**: Create file structure
- [ ] **CODE**: Add MarketData interface
- [ ] **CODE**: Add mock data:
  - Volume 24h: ~$500M - $2B HYPE
  - IDX count: 15-20 indexes
  - TVL: ~$100M - $500M HYPE
- [ ] **CODE**: Export mock data
- [ ] **VERIFY**: TypeScript types correct
- [ ] **VERIFY**: Data structure matches Footer expectations

### 4.2 Create Mock Price Alerts
**File**: `lib/mock/price-alerts.ts`

- [ ] **CODE**: Create PriceAlert interface
- [ ] **CODE**: Add 3-5 mock alerts:
  - Index name
  - Alert condition (above/below)
  - Target price
  - Current price
  - Active status
- [ ] **CODE**: Export mock alerts
- [ ] **VERIFY**: TypeScript types correct

---

## 🔧 Part 5: Layout Integration

### 5.1 Import Footer in Main Pages
**Files**: `app/trading/page.tsx`, `app/launch/page.tsx`, `app/governance/page.tsx`

- [ ] **CODE**: Import Footer component in trading page
- [ ] **CODE**: Import Footer component in launch page
- [ ] **CODE**: Import Footer component in governance page
- [ ] **CODE**: Add `<Footer />` at bottom of each page
- [ ] **VERIFY**: No import errors
- [ ] **USER**: Footer appears on all 3 pages

### 5.2 Update Layout Spacing
**Adjust**: Page content bottom padding for footer space

- [ ] **CODE**: Add `pb-16` or similar to page containers
- [ ] **CODE**: Ensure footer doesn't overlap content
- [ ] **CODE**: Set footer as `fixed bottom-0`
- [ ] **VERIFY**: No content overlap
- [ ] **USER**: Scroll to bottom - content not hidden by footer

---

## ✅ Part 6: Verification & Testing

### 6.1 Component Structure Verification (AUTO)
- [ ] **VERIFY**: Footer.tsx has no TypeScript errors
- [ ] **VERIFY**: PriceAlertsPopover.tsx has no TypeScript errors
- [ ] **VERIFY**: All mock data files have valid exports
- [ ] **VERIFY**: All imports resolve correctly

### 6.2 Visual Verification (USER)
- [ ] **USER**: Trading page - Footer visible with all sections
- [ ] **USER**: Launch page - Footer visible with all sections
- [ ] **USER**: Governance page - Footer visible with all sections
- [ ] **USER**: Network label shows mint color (#98FCE4)
- [ ] **USER**: Market Overview label shows mint color (#98FCE4)
- [ ] **USER**: All metrics display correctly formatted numbers

### 6.3 Interaction Verification (USER)
- [ ] **USER**: Hover over Vol 24h - tooltip appears
- [ ] **USER**: Hover over IDX - tooltip appears
- [ ] **USER**: Hover over TVL - tooltip appears
- [ ] **USER**: Click Price Alerts icon - popover opens
- [ ] **USER**: Popover appears ABOVE icon (not center screen)
- [ ] **USER**: Popover shows 3-5 alert cards
- [ ] **USER**: Click outside popover - popover closes

### 6.4 Responsive Verification (USER)
- [ ] **USER**: Test on 1920px viewport - footer looks good
- [ ] **USER**: Test on 1440px viewport - footer looks good
- [ ] **USER**: Test on 1024px viewport - footer adjusts properly
- [ ] **USER**: No horizontal scroll on any viewport

### 6.5 Success Criteria Verification (AUTO + USER)
- [ ] **VERIFY**: LeftSidebar removed from all 3 pages
- [ ] **VERIFY**: Footer component created and imported
- [ ] **VERIFY**: Market Overview section displays
- [ ] **VERIFY**: PriceAlertsPopover component created
- [ ] **USER**: Brand color (#98FCE4) visible on labels
- [ ] **USER**: Tooltips work on all metrics
- [ ] **USER**: Price Alerts popover opens above icon
- [ ] **USER**: No layout overlap or spacing issues

---

## 🚨 Critical User Checks

**MUST verify before marking Phase 1.5 complete:**

1. **Sidebar Gone**: LeftSidebar completely removed from all 3 pages
2. **Footer Visible**: Footer appears on trading, launch, governance pages
3. **Brand Color**: "Network" and "Market Overview" labels are mint (#98FCE4)
4. **Tooltips Work**: Hover shows tooltip on Vol 24h, IDX, TVL
5. **Popover Position**: Price Alerts popover appears ABOVE icon, not center screen
6. **No Overlap**: Footer doesn't hide page content when scrolled to bottom

---

## 📝 Notes

- Keep this checklist updated as work progresses
- Mark **VERIFY** items after code changes
- Mark **USER** items only after visual confirmation
- Report any blockers or issues immediately

---

**Last Updated**: 2025-11-02
