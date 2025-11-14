# UI Sizing & Proportions

**Document**: Sizing and Proportion Analysis and Improvement Plan
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

### 1.1 Chart & Graph Dimensions

#### Trading Chart (TradingView)
**Current**:
```tsx
<div className="h-[600px]">  // Fixed height
  <TVChartContainer />
</div>
```

**Issues**:
- Fixed height doesn't adapt to viewport
- No aspect ratio constraint
- Can be too tall on laptops, too short on large monitors
- Chart toolbar can overlap on small heights

**Viewport Adaptation**:
- Desktop: 600px feels cramped on 1080p displays
- Large monitors (1440p+): Chart should grow
- Mobile: Need different height (maybe 50vh?)

---

#### Performance Chart (Portfolio/Launch)
**Current**:
```tsx
<div className="h-64">  // 256px fixed
  <ResponsiveContainer width="100%" height="100%">
    <LineChart>...</LineChart>
  </ResponsiveContainer>
</div>
```

**Aspect Ratio**: ~16:9 to 21:9 depending on width

**Issues**:
- Fixed height may not match card width
- No min/max height constraints
- Sparklines too small on mobile

---

### 1.2 Card Dimensions

#### Index Card (Trading/Discover)
**Current**:
```tsx
// No fixed dimensions, grows with content
<Card className="bg-slate-900/50 border-slate-800">
  <CardContent className="p-4">  // 16px padding
    {/* Variable content */}
  </CardContent>
</Card>
```

**Size Variations**:
- Compact mode: ~200-250px height
- Full mode: ~300-400px height
- Width: Controlled by grid (1/2/3 columns)

**Issues**:
- Inconsistent heights in grid (some cards taller than others)
- No min-height constraint (cards can be too small)
- Padding inconsistent (some p-4, some p-6)

---

#### Stats Cards (Dashboard/Portfolio)
**Current**:
```tsx
<Card className="bg-slate-900/50 border-brand/30">
  <CardContent className="p-4">  // 16px padding
    <div className="text-2xl">12,500</div>  // Stat value
    <div className="text-sm">Total Voting Power</div>
  </CardContent>
</Card>
```

**Height**: ~120-150px (content-dependent)
**Aspect**: Nearly square on desktop, horizontal on mobile

**Issues**:
- Stats cards not uniform height
- Numbers can overflow on very large values
- Icons inconsistent size (some 20px, some 24px)

---

### 1.3 Modal Dimensions

#### VsBattleVoteModal
**Current**:
```tsx
<DialogContent className="sm:max-w-[500px]">
  {/* Modal content */}
</DialogContent>
```

**Size**: 500px max width, height auto

**Issues**:
- Width too narrow for complex forms
- No max-height constraint (can exceed viewport)
- Mobile: Takes full width (good)

---

#### IndexDetailsModal
**Current**:
```tsx
<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
  {/* Large content with charts */}
</DialogContent>
```

**Size**: 896px max width, 90vh max height

**Good**:
- Wider for data-heavy content
- Max height prevents overflow
- Scrollable content

**Issues**:
- Still can feel cramped for 3-column data
- Chart inside modal can be small
- Mobile: Takes full screen (good but abrupt)

---

### 1.4 Input Field Sizes

#### Text Inputs
**Current**:
```tsx
<Input
  className="h-10 bg-slate-900 border-slate-700"
  placeholder="Enter index name"
/>
```

**Height**: 40px (Tailwind h-10)

**Issues**:
- Consistent across app (good)
- But could be taller for better touch targets (48px recommended)

---

#### Select Dropdowns
**Current**:
```tsx
<Select>
  <SelectTrigger className="h-10">  // 40px
    {/* ... */}
  </SelectTrigger>
</Select>
```

**Height**: 40px (matches inputs)

**Issues**:
- Dropdown menu items could be taller for easier clicking
- Currently: ~32-36px per item
- Recommended: 40-48px per item

---

#### Sliders
**Current**:
```tsx
<Slider
  min={1}
  max={50}
  step={1}
  className="w-full"
/>
```

**Track Height**: 4px (thin)
**Thumb Size**: 16px × 16px

**Issues**:
- Thumb too small for mobile touch
- Track could be thicker for visibility
- No visual feedback for steps

---

### 1.5 Button Sizes

#### Primary Buttons
**Current**:
```tsx
<Button className="h-10 px-4">  // 40px height, 16px horizontal padding
  Trade
</Button>
```

**Sizes Used**:
- Default: `h-10` (40px)
- Small: `h-8` (32px)
- Large: `h-12` (48px)

**Issues**:
- Most buttons are default (40px)
- Large buttons rarely used
- Touch targets on mobile could be bigger (48px minimum)

---

### 1.6 Avatar & Icon Sizes

#### User Avatars
**Current**:
```tsx
<Avatar className="h-8 w-8">  // 32px
  <AvatarImage src={user.avatar} />
</Avatar>
```

**Sizes**:
- Small: 24px (sidebar, inline)
- Default: 32px (cards, tables)
- Large: 40-48px (profiles)

**Issues**:
- Consistent (good)
- But could use more size variations for hierarchy

---

#### Icons (Lucide)
**Current**:
```tsx
<TrendingUp className="w-4 h-4" />  // 16px
<Zap className="w-5 h-5" />          // 20px
```

**Common Sizes**:
- xs: 12px (w-3)
- sm: 16px (w-4)
- md: 20px (w-5)
- lg: 24px (w-6)

**Issues**:
- Mostly consistent
- Some components mix sizes (w-3 and w-4 in same section)

---

### 1.7 Unit Strategy

**Current Usage**:
- **px** (Tailwind classes): 90% of codebase
  - Good: Precise, consistent
  - Bad: Not scalable with user font size

- **rem**: Rarely used
  - Only in some text sizes (text-base = 1rem)

- **vw/vh**: Sparingly used
  - Chart heights: `h-[600px]` (fixed) instead of `h-[60vh]`
  - Modal heights: `max-h-[90vh]` (good)

**Issues**:
- Over-reliance on px units
- No rem-based spacing for accessibility
- Charts not responsive to viewport height

---

## 2. Hyperliquid Reference Analysis

### 2.1 Chart Dimensions
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid trading chart (full desktop view)
- Measure chart height in pixels (use browser devtools)
- Note if height changes on window resize

**Analysis Points**:
- Chart height as % of viewport (50vh? 60vh? fixed px?)
- Aspect ratio (16:9, 21:9, custom?)
- Min/max height constraints
- How chart adapts on laptop vs large monitor

---

### 2.2 Card Sizes
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid portfolio cards
- Measure card dimensions (width × height)

**Analysis Points**:
- Are cards uniform height or variable?
- Padding inside cards (8px, 12px, 16px?)
- Gap between cards in grid
- Card aspect ratios

---

### 2.3 Form Input Heights
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid input fields (search, forms)

**Analysis Points**:
- Input field height (32px, 40px, 48px?)
- Select dropdown height
- Button height compared to inputs
- Touch target sizes

---

### 2.4 Modal Sizes
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid modal (any modal)
- Measure width and height

**Analysis Points**:
- Small modals (confirmations): width?
- Large modals (forms): width?
- Max height constraint (90vh, 80vh?)
- Padding inside modal

---

## 3. Axiom Reference Analysis

### 3.1 Stats Card Dimensions
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom dashboard stats cards
- Measure card width × height

**Analysis Points**:
- Card aspect ratio (square, 2:1, custom?)
- Are all stats cards same size?
- Grid columns (2, 3, 4 columns?)
- Responsive behavior (mobile/tablet/desktop)

---

### 3.2 Voting Interface Sizes
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom voting modal

**Analysis Points**:
- Modal width (fixed or responsive?)
- Button sizes (vote buttons)
- Progress bar heights
- Voting power display size

---

### 3.3 Table Row Heights
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom proposals table or voting history

**Analysis Points**:
- Row height (32px, 40px, 48px?)
- Header row height
- Cell padding
- Row hover/selected state height change?

---

## 4. Best Practices

### 4.1 Chart Aspect Ratios

**Standard Ratios**:
- **16:9** (1.778:1): Most common, good for wide data
- **21:9** (2.333:1): Ultra-wide, excellent for time-series
- **4:3** (1.333:1): More vertical, good for depth-of-market
- **1:1** (Square): Compact, for dashboards

**Trading Charts**:
- Primary chart: 16:9 to 21:9
- Sparklines: Any ratio, often 3:1 or wider
- Pie charts: 1:1 (square)

**Viewport-Based Heights**:
```css
/* Good: Adapts to screen size */
height: 60vh;
min-height: 400px;
max-height: 800px;

/* Bad: Fixed, doesn't adapt */
height: 600px;
```

---

### 4.2 Touch Target Sizes

**WCAG 2.1 Minimum**:
- **44×44px** for all interactive elements (buttons, links, inputs)

**Recommended**:
- **48×48px** for primary actions
- **40×40px** minimum for desktop-only
- **56×56px** for critical actions (submit, trade)

**Current YCOMDEMO**:
- Buttons: 40px ✅ (acceptable for desktop)
- Mobile buttons: Should increase to 48px ❌

---

### 4.3 Modal Sizing

**Width Recommendations**:
```css
/* Small modals (confirmations) */
max-width: 400px;

/* Medium modals (forms) */
max-width: 500-600px;

/* Large modals (data-heavy) */
max-width: 800px-1000px;

/* Full-screen modals (mobile) */
width: 100vw;
height: 100vh;
```

**Height Constraints**:
```css
/* Always use max-height */
max-height: 90vh;

/* Add scrolling for overflow */
overflow-y: auto;
```

---

### 4.4 Spacing Scale

**Tailwind Spacing Scale** (rem-based):
```
1 = 0.25rem = 4px
2 = 0.5rem  = 8px
3 = 0.75rem = 12px
4 = 1rem    = 16px
5 = 1.25rem = 20px
6 = 1.5rem  = 24px
8 = 2rem    = 32px
10 = 2.5rem = 40px
12 = 3rem   = 48px
```

**Component Padding**:
- Buttons: `px-4` (16px) or `px-6` (24px)
- Cards: `p-4` (16px) or `p-6` (24px)
- Modals: `p-6` (24px) to `p-8` (32px)
- Inputs: `px-3` (12px) or `px-4` (16px)

---

### 4.5 Proportional Scaling

**Use Cases for Each Unit**:

**px** (pixels):
- Border widths: `border`, `border-2`
- Small fixed sizes: icons, avatars
- Precise alignment

**rem**:
- Font sizes: `text-sm`, `text-base`, `text-lg`
- Padding/margin: `p-4`, `m-6`
- Accessible scaling with user preferences

**%** (percentage):
- Widths: `w-full`, `w-1/2`, `w-1/3`
- Relative sizing within containers

**vw/vh** (viewport units):
- Chart heights: `h-[60vh]`
- Modal max heights: `max-h-[90vh]`
- Full-screen sections

---

## 5. Proposed Implementation

### 5.1 Responsive Chart Heights

**Current**:
```tsx
<div className="h-[600px]">
  <TVChartContainer />
</div>
```

**Proposed**:
```tsx
<div className="h-[50vh] min-h-[400px] max-h-[700px]
                lg:h-[60vh] lg:max-h-[800px]
                2xl:h-[65vh] 2xl:max-h-[900px]">
  <TVChartContainer />
</div>
```

**Benefits**:
- Adapts to viewport height
- Prevents too small charts (400px min)
- Prevents too large charts (700-900px max)
- Larger on big monitors

---

### 5.2 Uniform Card Heights

**Create**: `lib/constants/card-sizes.ts`
```typescript
export const CARD_HEIGHTS = {
  COMPACT: 'h-48',      // 192px
  DEFAULT: 'h-64',      // 256px
  LARGE: 'h-80',        // 320px
  AUTO: 'h-auto',
} as const

export const CARD_PADDING = {
  TIGHT: 'p-3',   // 12px
  DEFAULT: 'p-4', // 16px
  LOOSE: 'p-6',   // 24px
} as const
```

**Usage**:
```tsx
<Card className={cn("bg-slate-900/50", CARD_HEIGHTS.DEFAULT)}>
  <CardContent className={CARD_PADDING.DEFAULT}>
    {/* Content */}
  </CardContent>
</Card>
```

---

### 5.3 Touch Target Enhancement

**Mobile Button Sizes**:
```tsx
<Button className="h-10 lg:h-10 touch:h-12">
  {/* 48px on touch devices */}
</Button>
```

**Note**: Tailwind doesn't have `touch:` variant by default. Add custom variant:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'touch': { 'raw': '(hover: none)' },
      }
    }
  }
}
```

---

### 5.4 Modal Size Standards

**Create**: `components/ui/sized-dialog.tsx`
```typescript
const DIALOG_SIZES = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[500px]',
  lg: 'sm:max-w-[700px]',
  xl: 'sm:max-w-[900px]',
  full: 'sm:max-w-full',
} as const

type DialogSize = keyof typeof DIALOG_SIZES

interface SizedDialogProps extends DialogProps {
  size?: DialogSize
}

export function SizedDialog({ size = 'md', children, ...props }: SizedDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className={cn(
        DIALOG_SIZES[size],
        'max-h-[90vh] overflow-y-auto'
      )}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

**Usage**:
```tsx
<SizedDialog size="lg">
  <DialogHeader>
    <DialogTitle>Large Modal</DialogTitle>
  </DialogHeader>
  {/* Content */}
</SizedDialog>
```

---

### 5.5 Aspect Ratio Utilities

**Tailwind CSS** (built-in):
```tsx
{/* 16:9 aspect ratio */}
<div className="aspect-video">
  <Image src="..." fill />
</div>

{/* 1:1 square */}
<div className="aspect-square">
  <Image src="..." fill />
</div>

{/* Custom 21:9 */}
<div className="aspect-[21/9]">
  <Chart />
</div>
```

**Apply to Charts**:
```tsx
<div className="w-full aspect-video">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart>...</LineChart>
  </ResponsiveContainer>
</div>
```

---

## 6. Implementation Checklist

### Phase 1: Chart Sizing (High Priority)
- [ ] Update trading chart to use vh units (`h-[60vh]`)
- [ ] Add min-height (400px) and max-height (800px) to charts
- [ ] Convert performance charts to aspect-ratio utilities
- [ ] Test chart responsiveness on different screen sizes

### Phase 2: Card Standardization (High Priority)
- [ ] Create `lib/constants/card-sizes.ts`
- [ ] Audit all cards and apply uniform heights
- [ ] Ensure consistent padding (p-4 or p-6)
- [ ] Fix inconsistent icon sizes within cards

### Phase 3: Modal Sizing (Medium Priority)
- [ ] Create `SizedDialog` component with size variants
- [ ] Migrate all modals to use `SizedDialog`
- [ ] Add `max-h-[90vh]` to all modal content areas
- [ ] Test modal scrolling on short viewports

### Phase 4: Touch Targets (High Priority for Mobile)
- [ ] Add `touch:` variant to Tailwind config
- [ ] Update all buttons to 48px on touch devices
- [ ] Increase slider thumb size to 20px
- [ ] Test all touch targets on iOS/Android

### Phase 5: Input Field Refinement (Low Priority)
- [ ] Consider increasing default input height to 48px
- [ ] Increase dropdown menu item height to 40-48px
- [ ] Thicken slider track from 4px to 6px

### Phase 6: Unit Strategy (Medium Priority)
- [ ] Convert chart heights to vh/rem where appropriate
- [ ] Use rem for all padding/margin (already done in Tailwind)
- [ ] Document when to use px vs rem vs vh

### Phase 7: Documentation
- [ ] Add sizing guide to component library docs
- [ ] Document card size constants
- [ ] Document modal size variants
- [ ] Create cheat sheet for developers

---

## 7. Reference Measurements Needed

### Hyperliquid
- [ ] Trading chart dimensions (width × height in px)
- [ ] Card sizes (stats cards, position cards)
- [ ] Input field heights
- [ ] Button sizes
- [ ] Modal widths (small, medium, large)

### Axiom
- [ ] Stats card dimensions
- [ ] Voting modal width × height
- [ ] Table row heights
- [ ] Button sizes

---

**Last Updated**: 2025-11-05
**Next Review**: After reference measurements provided
**Status**: Awaiting user input for reference analysis
