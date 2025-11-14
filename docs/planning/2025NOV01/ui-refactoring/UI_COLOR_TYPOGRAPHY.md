# UI Color & Typography System

**Document**: Color Palette and Typography Analysis and Improvement Plan
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

### 1.1 Brand Color System

**Primary Brand Color**: `#98FCE4` (Soft Mint)
```css
/* CSS Variables (globals.css) */
--brand-primary: 168 95% 80%;          /* #98FCE4 */
--brand-primary-hover: 168 95% 76%;    /* Darker on hover */
--brand-gradient-start: 168 95% 80%;
--brand-gradient-end: 168 95% 70%;
```

**JavaScript Constants** (`lib/constants/colors.ts`):
```typescript
export const BRAND_COLORS = {
  primary: '#98FCE4',        // Mint brand color
  primaryDark: '#72E8D1',    // Hover/active state
  primaryLight: '#B4FFE9',   // Lighter variant

  profit: '#4ade80',         // Green (Phase 5 standardized)
  loss: '#f22c2c',           // Red (Phase 5 standardized)

  layer: {
    L1_PARTNER: '#98FCE4',   // Mint
    L2_VS_BATTLE: '#7DD9C8', // Teal
  },
} as const
```

**Issues**:
- Mint color (`#98FCE4`) may lack sufficient contrast on dark backgrounds (WCAG AA concern)
- No semantic color tokens for warnings, info, neutral states
- Brand colors not integrated with shadcn/ui color system
- Gradient colors hardcoded in multiple components

---

### 1.2 Dark Mode Palette

**Background Colors** (slate-based):
```css
.dark {
  --background: 222 47% 4%;      /* #030712 - Very dark slate */
  --card: 222 47% 6%;            /* #0f172a - Dark slate */
  --card-hover: 222 47% 8%;      /* Hover state */
  --border: 222 47% 12%;         /* #1e293b - Border color */
  --input: 222 47% 12%;          /* Input background */
}
```

**Text Colors**:
```css
.dark {
  --foreground: 210 40% 98%;           /* #f8fafc - Almost white */
  --card-foreground: 210 40% 98%;
  --muted-foreground: 215 20.2% 65.1%; /* #94a3b8 - Gray text */
}
```

**Issues**:
- Very low contrast between card (`#0f172a`) and background (`#030712`)
- Muted text may be too light for small font sizes
- No dark mode variants for brand mint color
- Chart backgrounds hardcoded instead of using CSS variables

---

### 1.3 Semantic Colors

**Current Hyperliquid-style Colors** (`globals.css`):
```css
:root {
  --hl-accent-green: #4ade80;   /* Profit/success */
  --hl-accent-red: #f22c2c;     /* Loss/error */
  --hl-accent-blue: #50d2c1;    /* Legacy accent (rarely used) */
}
```

**shadcn/ui Semantic Colors**:
```css
.dark {
  --destructive: 0 62.8% 30.6%;         /* Red for errors */
  --destructive-foreground: 210 40% 98%; /* White text on red */
  --muted: 217 32.6% 17.5%;             /* Muted background */
  --accent: 217 32.6% 17.5%;            /* Accent background */
}
```

**Issues**:
- `--hl-accent-*` colors not integrated with shadcn/ui tokens
- No warning color (yellow/orange) defined
- No info color (blue) defined
- Success/error colors only defined for specific use cases (trading)

---

### 1.4 Legacy Color System

**Old Pastel Purple/Blue Palette** (`tailwind.config.ts`):
```typescript
cryptoindex: {
  'primary': '#555879',    // Not used
  'medium': '#98A1BC',     // Not used
  'accent': '#898AC4',     // Not used
  'highlight': '#C0C9EE',  // Not used
  'soft': '#A2AADB',       // Not used
  'warm': '#DED3C4',       // Not used
  'cream': '#F4EBD3'       // Not used
}
```

**Issue**: Legacy colors defined but never used in components. Should be removed to avoid confusion.

---

### 1.5 Typography System

**Font Family**:
```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

**Font Sizes** (Compact Density Mode):
```css
@media (min-width: 1024px) {
  body {
    font-size: 14px; /* Compact mode on desktop */
  }
}
```

**Tailwind Font Scale**:
```css
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
```

**Common Usage Patterns** (from component analysis):
- **Page Titles**: `text-2xl` to `text-3xl`, `font-bold`
- **Section Headers**: `text-xl`, `font-semibold`
- **Card Titles**: `text-base` to `text-lg`, `font-medium`
- **Body Text**: `text-sm` (most common)
- **Small Labels**: `text-xs`
- **Numbers/Stats**: `text-xl` to `text-3xl`, `font-bold`, `tabular-nums`

**Issues**:
- Generic font stack (Arial) - lacks professional trading aesthetic
- Font size `14px` global on lg+ may hurt readability for some users
- No consistent hierarchy for headings (h1-h6 not styled)
- Tabular nums not applied consistently to numeric data
- Line height and letter spacing not standardized

---

### 1.6 Text Hierarchy Examples

**Current Component Text Patterns**:

1. **Trading Page Title**:
```tsx
<h1 className="text-2xl font-bold">Dog Memes Index</h1>
```

2. **Card Header**:
```tsx
<h3 className="text-lg font-semibold">Top Traders</h3>
```

3. **Stat Value**:
```tsx
<span className="text-3xl font-bold tabular-nums">$1,234.56</span>
```

4. **Muted Label**:
```tsx
<span className="text-xs text-muted-foreground">24h Volume</span>
```

**Issues**:
- No consistent class names for text roles (e.g., `.title-page`, `.label-stat`)
- Font weights vary (medium, semibold, bold) without clear rules
- Color opacity used inconsistently (`text-white/70` vs `text-muted-foreground`)

---

### 1.7 Color Usage in Components

**Common Color Patterns**:

1. **Profit/Loss Text**:
```tsx
<span style={{ color: change >= 0 ? '#4ade80' : '#f22c2c' }}>
  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
</span>
```

2. **Brand Accent**:
```tsx
<Button className="bg-[#98FCE4] hover:bg-[#72E8D1] text-black">
  Launch Index
</Button>
```

3. **Layer Badges**:
```tsx
<Badge style={{ backgroundColor: '#98FCE4', color: '#000' }}>
  L1/Partner
</Badge>
```

**Issues**:
- Hardcoded hex values instead of CSS variables
- Inline styles instead of Tailwind classes
- No dark mode variants for brand colors
- Profit/loss colors duplicated across components

---

## 2. Hyperliquid Reference Analysis

### 2.1 Trading Page Color Scheme
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid trading page (full desktop view)
- DevTools inspection of color values (background, text, accents)
- Screenshot with browser color picker showing exact hex values

**Analysis Points to Cover**:
- Background colors (main bg, card bg, input bg)
- Text colors (primary, secondary, muted)
- Accent colors (profit, loss, neutral highlights)
- Border colors (subtle vs prominent)
- Hover/active state colors
- Chart color scheme (candlestick green/red, volume bars, grid lines)

---

### 2.2 Portfolio Page Typography
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Hyperliquid portfolio page
- DevTools Font tab inspection (font family, size, weight, line-height)

**Analysis Points to Cover**:
- Font stack (primary font family)
- Font sizes for different text roles (headers, body, labels, numbers)
- Font weights used (normal, medium, semibold, bold)
- Line height values
- Letter spacing (especially for numbers)
- How tabular numbers are handled (positions table, PnL)

---

### 2.3 Dark Mode Implementation
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot comparison (light mode vs dark mode, if available)
- CSS inspection of dark mode color tokens

**Analysis Points to Cover**:
- How dark mode is implemented (class-based? media query?)
- Background color hierarchy (main → card → elevated card)
- Text color contrast ratios
- Border opacity in dark mode
- Accent color adjustments for dark backgrounds
- Shadow usage in dark mode (if any)

---

### 2.4 Chart and Graph Colors
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of TradingView chart on Hyperliquid
- Screenshot of portfolio performance charts

**Analysis Points to Cover**:
- Candlestick colors (bull/bear, wick colors)
- Volume bar colors
- Moving average line colors
- Grid line color and opacity
- Tooltip background and text colors
- Chart background color
- How multiple data series are colored (if applicable)

---

### 2.5 Semantic Color Usage
**[USER INPUT REQUIRED]**

Please provide:
- Screenshots showing success, error, warning states
- Screenshot of order confirmation dialogs
- Screenshot of notifications/alerts

**Analysis Points to Cover**:
- Success color (order filled, transaction complete)
- Error color (failed transaction, validation error)
- Warning color (risk warnings, pending states)
- Info color (informational messages)
- How semantic colors are used in buttons, badges, alerts
- Color contrast on different backgrounds

---

## 3. Axiom Reference Analysis

### 3.1 Dashboard Color Palette
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom dashboard
- DevTools color inspection

**Analysis Points to Cover**:
- Primary brand color and usage
- Background color scheme
- Stats card colors (background, borders, highlights)
- Data visualization colors (charts, progress bars)
- Icon colors
- Hover state colors

---

### 3.2 Voting Interface Typography
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom voting modal/page
- Font inspection from DevTools

**Analysis Points to Cover**:
- Font family used
- Typography hierarchy (proposal title, description, voting power, results)
- Font sizes and weights for different roles
- How numbers are displayed (voting power, percentages)
- Text color hierarchy (active vs muted)
- Line height and spacing for readability

---

### 3.3 Proposal Cards Color System
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom proposals list page
- Color picker values for card backgrounds and borders

**Analysis Points to Cover**:
- Card background color (default state)
- Card border color and thickness
- Hover state color changes
- Active proposal highlight color
- Ended proposal muted color
- Status badge colors (active, passed, rejected, pending)

---

### 3.4 Text Hierarchy and Readability
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom proposal detail page
- Screenshot of user profile page

**Analysis Points to Cover**:
- Page title font size and weight
- Section header hierarchy (h1, h2, h3)
- Body text size and line height
- Small label text size
- Link color and underline style
- Emphasis text (bold, italic, colored)
- Code/monospace text styling (if any)

---

### 3.5 Dark Mode Color Contrast
**[USER INPUT REQUIRED]**

Please provide:
- Screenshot of Axiom in dark mode (if available)
- Contrast ratio measurements (use browser DevTools Lighthouse or WebAIM Contrast Checker)

**Analysis Points to Cover**:
- WCAG AA compliance for text colors
- Minimum contrast ratios achieved (4.5:1 for normal text, 3:1 for large text)
- Border contrast on dark backgrounds
- Icon visibility in dark mode
- Button color contrast (background vs text)
- Disabled state colors

---

## 4. Best Practices

### 4.1 Color Accessibility (WCAG 2.1)

**Contrast Ratios**:
```
Normal text (< 18px):  4.5:1 minimum (AA), 7:1 enhanced (AAA)
Large text (≥ 18px):   3:1 minimum (AA), 4.5:1 enhanced (AAA)
UI components:         3:1 minimum
```

**Common Issues**:
- Light mint (`#98FCE4`) on dark backgrounds may fail AA for small text
- Gray muted text often fails contrast requirements
- Chart grid lines should be visible but not distracting (2:1 recommended)

**Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools Lighthouse: Accessibility audit
- APCA (Advanced Perceptual Contrast Algorithm) for modern contrast checking

---

### 4.2 Dark Mode Color Theory

**Best Practices**:
1. **Background Hierarchy**: Use subtle elevation (not pure black)
   ```
   Page background:    #030712 (very dark)
   Card background:    #0f172a (dark)
   Elevated card:      #1e293b (medium dark)
   Input background:   #1e293b (medium dark)
   ```

2. **Text on Dark**:
   - Primary text: 87% opacity white (`rgba(255,255,255,0.87)`)
   - Secondary text: 60% opacity white (`rgba(255,255,255,0.60)`)
   - Disabled text: 38% opacity white (`rgba(255,255,255,0.38)`)

3. **Accent Colors**: Slightly desaturate accents on dark backgrounds
   ```
   Light mode accent:  hsl(168, 95%, 80%)  (vibrant)
   Dark mode accent:   hsl(168, 85%, 75%)  (slightly muted)
   ```

4. **Borders**: Use lighter borders in dark mode (not darker)
   ```
   Light mode border:  rgba(0,0,0,0.12)
   Dark mode border:   rgba(255,255,255,0.12)
   ```

---

### 4.3 Semantic Color Tokens

**Industry Standard Tokens**:
```typescript
interface SemanticColors {
  success: string;      // Green - completed, profit, approved
  error: string;        // Red - failed, loss, rejected
  warning: string;      // Orange/yellow - caution, pending review
  info: string;         // Blue - informational, neutral action
  neutral: string;      // Gray - default, inactive
}
```

**Financial UI Conventions**:
- **Green (Profit/Buy)**: `#10b981` to `#4ade80` (lime green)
- **Red (Loss/Sell)**: `#ef4444` to `#f22c2c` (red)
- **Yellow (Pending)**: `#f59e0b` to `#fbbf24` (amber)
- **Blue (Info)**: `#3b82f6` to `#60a5fa` (blue)

**Usage**:
- Use semantic colors consistently across all components
- Don't use red for positive actions or green for negative actions
- Reserve yellow for caution/warning (not branding)

---

### 4.4 Typography Best Practices

**Font Selection**:
1. **System Font Stack** (modern approach):
   ```css
   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue",
                sans-serif;
   ```
   - Benefits: Fast loading, native look, excellent hinting

2. **Professional Sans-Serif** (trading platforms):
   - **Inter**: Clean, tabular numbers, excellent legibility
   - **IBM Plex Sans**: Professional, supports tabular figures
   - **SF Pro** (Apple): Used by many financial apps
   - **Roboto**: Google's standard, highly legible

**Font Size Scale** (16px base):
```
text-xs:   12px  (labels, captions)
text-sm:   14px  (body text, compact mode)
text-base: 16px  (default body text)
text-lg:   18px  (subheadings)
text-xl:   20px  (card titles)
text-2xl:  24px  (section headers)
text-3xl:  30px  (page titles)
text-4xl:  36px  (hero text, large stats)
```

**Line Height**:
```
Headings:  1.2 to 1.3  (tight, for impact)
Body text: 1.5 to 1.6  (comfortable reading)
Small text: 1.4       (labels, captions)
Numbers:   1.0        (tabular, tight spacing)
```

**Font Weights**:
```
Regular:   400  (body text)
Medium:    500  (emphasis, button labels)
Semibold:  600  (subheadings, card titles)
Bold:      700  (headings, important stats)
```

---

### 4.5 Tabular Numbers

**Why Tabular Figures Matter**:
- Proportional numbers: Each digit has different width (default)
- Tabular numbers: All digits same width (aligned in tables)

**CSS Implementation**:
```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Or OpenType feature */
.tabular-nums {
  font-feature-settings: "tnum" 1;
}
```

**When to Use**:
- Price tables (orderbook, trade history)
- Portfolio positions (quantity, value, PnL)
- Stats dashboards (24h volume, market cap)
- Countdowns and timers
- Financial data in general

**Tailwind Utility**: `tabular-nums` class

---

### 4.6 Color Naming Conventions

**Bad**:
```typescript
// Vague, not descriptive
const blue = '#3b82f6';
const green = '#10b981';
```

**Better**:
```typescript
// Semantic, role-based
const colorSuccess = '#10b981';
const colorError = '#ef4444';
const colorWarning = '#f59e0b';
const colorInfo = '#3b82f6';
```

**Best**:
```typescript
// Design tokens with semantic naming
const colors = {
  semantic: {
    success: { DEFAULT: '#10b981', light: '#6ee7b7', dark: '#047857' },
    error: { DEFAULT: '#ef4444', light: '#fca5a5', dark: '#991b1b' },
    warning: { DEFAULT: '#f59e0b', light: '#fcd34d', dark: '#d97706' },
    info: { DEFAULT: '#3b82f6', light: '#93c5fd', dark: '#1e40af' },
  },
  brand: {
    primary: '#98FCE4',
    hover: '#72E8D1',
    light: '#B4FFE9',
  },
  trading: {
    profit: '#4ade80',
    loss: '#f22c2c',
  },
} as const;
```

---

## 5. Proposed Implementation

### 5.1 Unified Color Token System

**Create**: `lib/constants/color-tokens.ts`
```typescript
export const COLOR_TOKENS = {
  // Brand colors
  brand: {
    primary: '#98FCE4',        // Mint
    primaryHover: '#72E8D1',   // Darker mint
    primaryLight: '#B4FFE9',   // Lighter mint
    primaryDark: '#5CD4BB',    // Much darker (for dark mode)
  },

  // Semantic colors
  semantic: {
    success: {
      DEFAULT: '#4ade80',      // Green (profit)
      light: '#86efac',
      dark: '#22c55e',
      foreground: '#ffffff',
    },
    error: {
      DEFAULT: '#f22c2c',      // Red (loss)
      light: '#fca5a5',
      dark: '#991b1b',
      foreground: '#ffffff',
    },
    warning: {
      DEFAULT: '#f59e0b',      // Orange
      light: '#fcd34d',
      dark: '#d97706',
      foreground: '#000000',
    },
    info: {
      DEFAULT: '#3b82f6',      // Blue
      light: '#93c5fd',
      dark: '#1e40af',
      foreground: '#ffffff',
    },
  },

  // Trading colors
  trading: {
    profit: '#4ade80',         // Green
    loss: '#f22c2c',           // Red
    long: '#4ade80',           // Buy side
    short: '#f22c2c',          // Sell side
  },

  // Layer badges
  layer: {
    l1Partner: '#98FCE4',      // Mint
    l2VsBattle: '#7DD9C8',     // Teal
  },

  // Chart colors
  chart: {
    bullCandle: '#4ade80',
    bearCandle: '#f22c2c',
    volume: '#6b7280',
    grid: 'rgba(148, 163, 184, 0.1)',
    crosshair: '#94a3b8',
  },

  // Dark mode backgrounds
  dark: {
    bg: {
      primary: '#030712',      // Main background
      secondary: '#0f172a',    // Card background
      tertiary: '#1e293b',     // Elevated card
      input: '#1e293b',        // Input fields
    },
    text: {
      primary: 'rgba(255,255,255,0.87)',
      secondary: 'rgba(255,255,255,0.60)',
      disabled: 'rgba(255,255,255,0.38)',
    },
    border: 'rgba(255,255,255,0.12)',
  },
} as const;
```

**Update**: `tailwind.config.ts` to extend with new tokens
```typescript
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#98FCE4',
        hover: '#72E8D1',
        light: '#B4FFE9',
        dark: '#5CD4BB',
      },
      success: {
        DEFAULT: '#4ade80',
        light: '#86efac',
        dark: '#22c55e',
      },
      error: {
        DEFAULT: '#f22c2c',
        light: '#fca5a5',
        dark: '#991b1b',
      },
      warning: {
        DEFAULT: '#f59e0b',
        light: '#fcd34d',
        dark: '#d97706',
      },
      // Remove legacy cryptoindex colors
    },
  },
}
```

---

### 5.2 Typography System Standardization

**Update**: `app/globals.css`
```css
@layer base {
  :root {
    /* Typography scale */
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 1.875rem;  /* 30px */
    --font-size-4xl: 2.25rem;   /* 36px */

    /* Line heights */
    --line-height-tight: 1.2;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;

    /* Font weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
  }

  /* System font stack */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
  }

  /* Compact density mode (desktop) */
  @media (min-width: 1024px) {
    body {
      font-size: var(--font-size-sm); /* 14px */
    }
  }

  /* Typography hierarchy */
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
  }

  h2 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
  }

  h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-snug);
  }

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-snug);
  }

  /* Tabular numbers for all numeric content */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Price/stat numbers */
  .stat-number {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    font-variant-numeric: tabular-nums;
  }

  /* Labels */
  .label-text {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
```

---

### 5.3 Component Color Refactoring

**Replace Hardcoded Colors** (12 files):

1. **ToastProvider.tsx** - Use semantic tokens:
```tsx
// Before
style={{ backgroundColor: '#10b981' }}

// After
className="bg-success"
```

2. **index-row.tsx** - Use trading colors:
```tsx
// Before
style={{ color: change >= 0 ? '#4ade80' : '#f22c2c' }}

// After
className={change >= 0 ? 'text-success' : 'text-error'}
```

3. **ChartArea.tsx** - Use chart tokens:
```tsx
// Before
upColor: '#4ade80',
downColor: '#f22c2c',

// After
import { COLOR_TOKENS } from '@/lib/constants/color-tokens';
upColor: COLOR_TOKENS.chart.bullCandle,
downColor: COLOR_TOKENS.chart.bearCandle,
```

4. **Layer Badges** - Use layer tokens:
```tsx
// Before
style={{ backgroundColor: '#98FCE4' }}

// After
className="bg-brand"
```

---

### 5.4 Accessibility Improvements

**Ensure WCAG AA Compliance**:

1. **Audit Current Contrast Ratios**:
```bash
# Use Chrome DevTools Lighthouse
# Or install color contrast checker extension
```

2. **Fix Low Contrast Issues**:
```tsx
// Before: Mint on dark may fail AA
<span className="text-brand">Brand Text</span>  // #98FCE4 on #0f172a = 3.2:1 ❌

// After: Use lighter variant for small text
<span className="text-brand-light">Brand Text</span>  // #B4FFE9 on #0f172a = 4.8:1 ✅
```

3. **Add Focus Indicators**:
```css
@layer base {
  *:focus-visible {
    outline: 2px solid hsl(var(--brand-primary));
    outline-offset: 2px;
  }
}
```

---

### 5.5 Dark Mode Enhancements

**Add Dark Mode Brand Variants**:
```css
.dark {
  /* Adjust brand color for dark backgrounds */
  --brand-primary: 168 85% 75%;      /* Slightly desaturated */
  --brand-primary-hover: 168 85% 70%;

  /* Ensure borders are visible */
  --border: 222 47% 16%;             /* Lighter than current 12% */

  /* Improve card contrast */
  --card: 222 47% 8%;                /* Slightly lighter than current 6% */
}
```

**Add Elevated Card Variant**:
```tsx
// For modals and popovers
<div className="bg-card-elevated">
  {/* Content */}
</div>
```

```css
.dark {
  --card-elevated: 222 47% 10%;  /* More elevated than regular cards */
}
```

---

### 5.6 Remove Legacy Colors

**Delete from `tailwind.config.ts`**:
```typescript
// Remove entire cryptoindex object
cryptoindex: {
  'primary': '#555879',    // NOT USED
  'medium': '#98A1BC',     // NOT USED
  ...
}
```

**Verify No Usage**:
```bash
grep -r "cryptoindex-primary\|cryptoindex-medium" --include="*.tsx" --include="*.ts"
# Should return no results
```

---

## 6. Implementation Checklist

### Phase 1: Color Token System (High Priority)
- [ ] Create `lib/constants/color-tokens.ts` with unified token system
- [ ] Update `tailwind.config.ts` with new color tokens
- [ ] Remove legacy `cryptoindex` color palette
- [ ] Add semantic color tokens (success, error, warning, info)
- [ ] Add dark mode color variants

### Phase 2: Component Color Refactoring (High Priority)
- [ ] Replace hardcoded colors in ToastProvider.tsx
- [ ] Replace hardcoded colors in index-row.tsx (sparklines)
- [ ] Replace hardcoded colors in ChartArea.tsx (candlesticks)
- [ ] Replace hardcoded colors in trader-card.tsx (PnL)
- [ ] Replace hardcoded colors in index-card.tsx (sparklines + glow)
- [ ] Replace hardcoded colors in TradingPanelSimple.tsx (sliders)
- [ ] Replace hardcoded colors in PerformanceChart.tsx (tooltips)
- [ ] Replace hardcoded colors in launch/page.tsx (preview)
- [ ] Update layer badge colors to use tokens
- [ ] Verify all profit/loss colors use semantic tokens

### Phase 3: Typography System (Medium Priority)
- [ ] Update `app/globals.css` with typography CSS variables
- [ ] Implement system font stack (replace Arial)
- [ ] Add h1-h6 base styles
- [ ] Add `.stat-number` utility class
- [ ] Add `.label-text` utility class
- [ ] Apply `tabular-nums` to all numeric content
- [ ] Standardize line heights across components
- [ ] Test compact density mode (14px on lg+)

### Phase 4: Accessibility Audit (High Priority)
- [ ] Run Lighthouse accessibility audit
- [ ] Check contrast ratios for all text colors (WCAG AA compliance)
- [ ] Fix low contrast issues (especially brand mint on dark)
- [ ] Add focus indicators for keyboard navigation
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Verify semantic HTML usage (headings, labels, ARIA)
- [ ] Test color-blind modes (protanopia, deuteranopia, tritanopia)

### Phase 5: Dark Mode Refinement (Medium Priority)
- [ ] Add dark mode brand color variants
- [ ] Increase border visibility in dark mode
- [ ] Improve card background contrast
- [ ] Add elevated card variant for modals
- [ ] Test all components in dark mode
- [ ] Verify chart colors in dark mode
- [ ] Check shadow visibility (may need adjustment)

### Phase 6: Reference Analysis Integration (Low Priority)
- [ ] Compare with Hyperliquid color scheme (after screenshots provided)
- [ ] Compare with Axiom color scheme (after screenshots provided)
- [ ] Identify additional improvements from references
- [ ] Document differences and rationale for deviations
- [ ] Update color tokens based on reference insights

### Phase 7: Testing & Validation
- [ ] Visual regression testing (compare before/after screenshots)
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Verify no broken color references (search for old hex values)
- [ ] Performance check (ensure no layout shifts from font changes)
- [ ] User testing for readability and color perception

---

## 7. Reference Screenshots Needed

### Hyperliquid
- [ ] Trading page (full view, color picker on key elements)
- [ ] Portfolio page (typography inspection)
- [ ] Chart color scheme (candlesticks, volume, grid)
- [ ] Dark mode comparison (if light mode exists)
- [ ] Semantic color usage (success, error, warning states)

### Axiom
- [ ] Dashboard (color palette inspection)
- [ ] Voting interface (typography hierarchy)
- [ ] Proposal cards (background, border, status colors)
- [ ] Text hierarchy examples (headers, body, labels)
- [ ] Dark mode contrast measurements

---

**Last Updated**: 2025-11-05
**Next Review**: After reference screenshots provided
**Status**: Awaiting user input for reference analysis
