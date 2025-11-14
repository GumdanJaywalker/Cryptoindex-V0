# UI Layout System

**Document**: Layout System Analysis and Improvement Plan
**Created**: 2025-11-05
**Status**: Ready for reference input

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Hyperliquid Reference Analysis](#2-hyperliquid-reference-analysis)
3. [Axiom Reference Analysis](#3-axiom-reference-analysis)
4. [Best Practices](#4-best-practices)
5. [Proposed Implementation](#5-proposed-implementation)
6. [Implementation Checklist](#6-implementation-checklist)

---

## 1. Current State Analysis

### 1.1 Overall Layout Pattern

YCOMDEMO currently uses a **2-column grid layout** on most pages:

```tsx
<div className="grid grid-cols-1
  lg:grid-cols-[260px_1fr]
  xl:grid-cols-[280px_1fr]
  2xl:grid-cols-[300px_1fr]
  gap-3 items-start lg:items-stretch">
  <LeftSidebar />
  <MainContent />
</div>
```

**Characteristics**:
- Fixed sidebar width (260px → 280px → 300px)
- Fluid main content area
- 12px gap between columns
- Mobile: Single column, sidebar hidden or collapsible

---

### 1.2 Page-Specific Layouts

#### Trading Page (`/trading`)
**Layout Type**: 3-column (complex)
- Left: Index list / market data
- Center: TradingView chart
- Right: Trading panel

**Issues**:
- Column widths not optimized for different screen sizes
- Chart can feel cramped on smaller desktops
- No saved layout preferences
- Mobile experience unclear (which panels collapse?)

---

#### Launch Page (`/launch`)
**Layout Type**: 3-column wizard
- Left: Basics (name, ticker)
- Center: Components (asset selection)
- Right: Preview (chart)

**Issues**:
- Columns not equal width (asymmetric)
- Preview chart too narrow on some screens
- No responsive breakpoint for tablet
- Wizard steps not clearly marked

---

#### Vote Page (`/vote`)
**Layout Type**: 2-column with tabs
- Left: Sidebar (standard)
- Right: Dashboard + Tabs (Proposals / VS Battles)

**Current State**:
- Simplified from Phase 4 restructure
- Tabs work well
- Cards use 1/2/3 column grid (responsive)

**Issues**:
- Tab content area could be wider
- Dashboard cards feel cramped

---

### 1.3 Responsive Breakpoints

**Current Tailwind Breakpoints**:
```
sm: 640px   (rarely used)
md: 768px   (rarely used)
lg: 1024px  (primary breakpoint)
xl: 1280px  (secondary)
2xl: 1536px (tertiary)
```

**Issues**:
- Jumping from mobile (< 1024px) to desktop (>= 1024px) too aggressive
- No tablet-specific layouts (768px-1023px range)
- Some components break at md but layout waits until lg

---

### 1.4 Spacing System

**Padding**:
- Global: `px-4 lg:px-4 pt-4` (16px)
- Very consistent across pages

**Gap**:
- Grid gap: `gap-3` (12px)
- Card gap: `gap-4` to `gap-6` (16-24px)

**Max Width**:
- Main content: `max-w-6xl` (1152px) on most pages
- No max width on Trading page (chart needs full width)

**Issues**:
- Some pages don't respect max-w-6xl
- Inconsistent inner padding in cards

---

### 1.5 Component Positioning

**Common Patterns**:
1. **Sticky Headers**: Header fixed at top (`fixed top-0`)
2. **Floating Sidebars**: Left sidebar scrolls independently
3. **Sticky Footers**: Launch page has sticky footer for cost summary
4. **Floating Action Buttons**: Trading page has quick actions

**Issues**:
- Z-index conflicts (modals, dropdowns, sticky elements)
- Sidebar doesn't stay sticky on scroll
- Footer overlaps content on short viewports

---

## 2. Hyperliquid Reference Analysis

### 2.1 Trading Page Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid trading page (full desktop view)
- Screenshot of collapsed/expanded orderbook states
- Mobile view screenshot
- Source code (optional): Inspect layout classes

**Analysis Points to Cover**:
- Column widths (chart:orderbook:panel ratio)
- How chart resizes when orderbook is hidden
- Responsive behavior at different breakpoints
- Sticky headers/footers
- Z-index layers (modals, dropdowns, tooltips)

---

### 2.2 Portfolio Page Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid portfolio page
- Screenshots of Positions / Order History sections

**Analysis Points to Cover**:
- How tables are laid out (full width? max width?)
- Card grid patterns for positions
- Spacing between sections
- Filters/search bar positioning

---

### 2.3 Leaderboard Page Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid leaderboard

**Analysis Points to Cover**:
- Table vs card layout
- How rankings are displayed
- Profile card placement
- Sidebar navigation (if any)

---

### 2.4 Settings Page Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid settings page

**Analysis Points to Cover**:
- Sidebar navigation for settings sections
- Form layout (labels, inputs, spacing)
- Action button placement (Save / Cancel)

---

### 2.5 Mobile Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshots of Hyperliquid mobile view (Trading, Portfolio)

**Analysis Points to Cover**:
- How 3-column layout collapses
- Bottom navigation vs hamburger menu
- Chart height on mobile
- Trading panel placement (bottom sheet? modal?)

---

## 3. Axiom Reference Analysis

### 3.1 Dashboard Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom dashboard

**Analysis Points to Cover**:
- Stats card grid (how many columns?)
- Card sizes and proportions
- Charts/graphs placement
- Information hierarchy

---

### 3.2 Proposals Page Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom proposals list
- Screenshot of individual proposal detail view

**Analysis Points to Cover**:
- Proposal cards vs table view
- Filters/search positioning
- How pagination works
- Detail modal vs separate page

---

### 3.3 Voting Interface Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom voting modal/page

**Analysis Points to Cover**:
- Voting power display position
- Options layout (radio buttons? cards?)
- Confirmation step layout
- Modal size and positioning

---

### 3.4 User Profile Layout
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom user profile page

**Analysis Points to Cover**:
- Profile header layout
- Stats cards arrangement
- Voting history table
- Tabs vs sections

---

### 3.5 Sidebar Navigation
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom sidebar (expanded and collapsed)

**Analysis Points to Cover**:
- Sidebar width (fixed or fluid?)
- Icon + text vs icon-only collapsed state
- Active state styling
- Sub-menu expansion

---

## 4. Best Practices

### 4.1 Trading Platform Layouts

**Standard 3-Column Trading Layout**:
```
[Orderbook/Markets]  [Chart]  [Trading Panel]
     25-30%           40-50%      20-30%
```

**Best Practices**:
- Chart should be largest component (40-50% width)
- Orderbook collapsible to give chart more space
- Trading panel fixed width (300-400px)
- Markets list can be in sidebar or left column

**Examples**:
- Hyperliquid: Collapsible orderbook, fixed trading panel
- dYdX: Tabbed left column (markets/positions/orders)
- Binance: Detachable panels

---

### 4.2 Responsive Breakpoints

**Industry Standard**:
```
Mobile:     < 768px   (single column, bottom sheet panels)
Tablet:     768-1023px (2 columns, some panels collapse)
Desktop:    1024-1439px (3 columns, full layout)
Large:      1440px+    (3 columns, more spacing)
Ultra-wide: 1920px+    (optional 4th column or wider chart)
```

**Key Transitions**:
- 768px: Mobile → Tablet (2 columns)
- 1024px: Tablet → Desktop (3 columns)
- 1440px: Desktop → Large (wider spacing, bigger charts)

---

### 4.3 Grid Systems

**12-Column Grid** (Tailwind default):
```css
/* Desktop: 3-column layout */
grid-cols-12
[col-span-3] [col-span-6] [col-span-3]

/* Tablet: 2-column layout */
md:grid-cols-8
[col-span-2] [col-span-6]

/* Mobile: 1-column */
grid-cols-1
```

**Fixed + Fluid Hybrid**:
```css
/* Sidebar fixed, content fluid */
grid-cols-[260px_1fr]

/* Panel fixed, chart + orderbook fluid */
grid-cols-[1fr_400px]
```

---

### 4.4 Spacing Consistency

**Spacing Scale** (Tailwind):
```
gap-2   8px   (tight, within cards)
gap-3   12px  (default, between columns)
gap-4   16px  (between sections)
gap-6   24px  (between major sections)
gap-8   32px  (large spacing)
```

**Padding Scale**:
```
p-2   8px   (button padding)
p-4   16px  (card padding, page padding)
p-6   24px  (modal padding, large cards)
```

---

### 4.5 Z-Index Hierarchy

**Recommended Layers**:
```css
1-9:     Normal content
10-19:   Sticky headers/sidebars
20-29:   Dropdowns
30-39:   Popovers/tooltips
40-49:   Modals (dialog backdrop)
50:      Modal content
60+:     Toast notifications, alerts
```

**Tailwind Classes**:
```
z-0      0
z-10     10
z-20     20
z-30     30
z-40     40
z-50     50
```

---

## 5. Proposed Implementation

### 5.1 Standardize Responsive Breakpoints

**Current**:
```tsx
lg:grid-cols-[260px_1fr]  // Only lg breakpoint
```

**Proposed**:
```tsx
grid-cols-1                // Mobile: single column
md:grid-cols-[240px_1fr]   // Tablet: 240px sidebar
lg:grid-cols-[260px_1fr]   // Desktop: 260px sidebar
xl:grid-cols-[280px_1fr]   // Large: 280px sidebar
2xl:grid-cols-[300px_1fr]  // Ultra: 300px sidebar
```

**Benefit**: Smoother transition from mobile to desktop

---

### 5.2 Improve Trading Page Layout

**Current Issues**:
- Chart feels cramped
- Orderbook not collapsible
- No tablet layout

**Proposed Solution**:
```tsx
// Desktop (lg+)
grid-cols-[280px_1fr_380px]
  Orderbook    Chart   Trading Panel

// Tablet (md)
grid-cols-[1fr_360px]
  Chart + Orderbook (tabs)   Trading Panel

// Mobile (< md)
grid-cols-1
  Chart (full width)
  Trading Panel (bottom sheet)
  Orderbook (modal)
```

**Implementation**:
1. Add `useState` for orderbook visibility
2. Create collapsible orderbook component
3. Add tablet breakpoint layout
4. Create bottom sheet component for mobile trading panel

---

### 5.3 Improve Launch Page Layout

**Current Issues**:
- Asymmetric column widths
- Preview chart too narrow

**Proposed Solution**:
```tsx
// Desktop: Equal thirds
grid-cols-3

// Tablet: 1:2 ratio
md:grid-cols-[1fr_2fr]
  Basics + Components (tabs)   Preview

// Mobile: Wizard steps
grid-cols-1 (step-by-step flow)
```

---

### 5.4 Implement Layout Preferences

**Feature**: Save user's preferred layout
```tsx
// Local storage keys
"ycomdemo_layout_orderbook_visible": true/false
"ycomdemo_layout_sidebar_width": 260
"ycomdemo_layout_chart_height": 600
```

**Benefits**:
- Remember orderbook collapsed/expanded
- Remember sidebar width (if draggable)
- Remember chart height

---

### 5.5 Z-Index Management

**Create**: `lib/constants/z-index.ts`
```typescript
export const Z_INDEX = {
  BASE: 0,
  SIDEBAR: 10,
  HEADER: 10,
  DROPDOWN: 20,
  POPOVER: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOAST: 60,
} as const
```

**Usage**:
```tsx
<div className="fixed top-0" style={{ zIndex: Z_INDEX.HEADER }}>
  Header
</div>
```

---

## 6. Implementation Checklist

### Phase 1: Foundation (High Priority)
- [ ] Create `lib/constants/z-index.ts` for consistent z-index management
- [ ] Add tablet breakpoint (md: 768px) to all page layouts
- [ ] Standardize spacing (audit all `gap-` and `p-` classes)
- [ ] Audit max-width usage (ensure consistency)

### Phase 2: Trading Page (High Priority)
- [ ] Implement collapsible orderbook
- [ ] Add tablet layout (2-column: chart+panel)
- [ ] Create mobile bottom sheet for trading panel
- [ ] Add orderbook visibility state to localStorage

### Phase 3: Launch Page (Medium Priority)
- [ ] Redesign as equal 3-column layout
- [ ] Add tablet layout (tabs for Basics+Components)
- [ ] Implement wizard step-by-step on mobile

### Phase 4: Vote Page (Low Priority)
- [ ] Widen tab content area
- [ ] Adjust dashboard card grid for better spacing

### Phase 5: Mobile Optimization (Medium Priority)
- [ ] Create bottom navigation component
- [ ] Implement bottom sheet pattern
- [ ] Test all modals on mobile
- [ ] Add safe area padding for iOS

### Phase 6: Layout Preferences (Low Priority)
- [ ] Implement localStorage for layout state
- [ ] Add "Reset Layout" button in settings
- [ ] Save sidebar width preference
- [ ] Save chart height preference

### Phase 7: Testing & Polish
- [ ] Test all breakpoints (360px, 768px, 1024px, 1440px, 1920px)
- [ ] Test z-index conflicts (modals + dropdowns)
- [ ] Test sticky headers on scroll
- [ ] Verify mobile safe areas (iOS notch)

---

## 7. Reference Screenshots Needed

### Hyperliquid
- [ ] Trading page (desktop, full view)
- [ ] Trading page (orderbook collapsed)
- [ ] Trading page (mobile view)
- [ ] Portfolio page
- [ ] Leaderboard page
- [ ] Settings page

### Axiom
- [ ] Dashboard
- [ ] Proposals page
- [ ] Voting modal/interface
- [ ] User profile page
- [ ] Sidebar (expanded and collapsed)

---

**Last Updated**: 2025-11-05
**Next Review**: After reference screenshots provided
**Status**: Awaiting user input for reference analysis
