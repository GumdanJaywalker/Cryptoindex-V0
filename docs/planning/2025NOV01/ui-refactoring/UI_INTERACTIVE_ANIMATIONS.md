# UI Interactive Elements & Animations

**Document**: Interactive Patterns and Animation System Analysis and Improvement Plan
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

### 1.1 Animation Library Inventory

**MagicUI Components** (14 effects):
```
/components/magicui/
├── animated-beam.tsx          # Connecting lines animation
├── animated-gradient-text.tsx # Gradient text animation
├── blur-in.tsx                # Blur fade-in effect
├── border-beam.tsx            # Animated border glow
├── globe.tsx                  # 3D rotating globe
├── magic-card.tsx             # Hover glow card
├── meteors.tsx                # Falling meteors background
├── number-ticker.tsx          # Counting number animation
├── orbiting-circles.tsx       # Circular orbit animation
├── particles.tsx              # Particle background effect
├── pulsating-button.tsx       # Pulsing button
├── ripple.tsx                 # Click ripple effect
├── shimmer-button.tsx         # Shimmer hover effect
└── slide-in.tsx               # Slide-in animation
```

**Aceternity UI Components** (80+ animations):
```
/components/ui/
├── 3d-card.tsx                    # Tilt on hover
├── 3d-effects.tsx                 # 3D transforms
├── animated-modal.tsx             # Modal entrance
├── animated-tooltip.tsx           # Tooltip animations
├── aurora-background.tsx          # Aurora light effect
├── background-beams.tsx           # Light beams
├── background-gradient.tsx        # Animated gradient bg
├── bento-grid.tsx                 # Grid layout animations
├── card-hover-effect.tsx          # Card hover interactions
├── container-scroll-animation.tsx # Scroll-triggered animations
├── direction-aware-hover.tsx      # Smart hover direction
├── evervault-card.tsx             # Card pattern animation
├── flip-words.tsx                 # Text flip animation
├── floating-dock.tsx              # macOS-style dock
├── focus-cards.tsx                # Focus blur effect
├── following-pointer.tsx          # Cursor follower
├── glare-card.tsx                 # Glare reflection
├── glowing-stars.tsx              # Star glow effect
├── hero-highlight.tsx             # Text highlight animation
├── hover-border-gradient.tsx      # Gradient border on hover
├── infinite-moving-cards.tsx      # Infinite carousel
├── lamp.tsx                       # Lamp light effect
├── lens.tsx                       # Magnifying lens
├── moving-border.tsx              # Animated border
├── multi-step-loader.tsx          # Step progress animation
├── parallax-scroll.tsx            # Parallax scrolling
├── shooting-stars.tsx             # Shooting stars bg
├── sparkles.tsx                   # Sparkle particles
├── spotlight.tsx                  # Spotlight effect
├── sticky-scroll-reveal.tsx       # Scroll reveal
├── tabs.tsx                       # Tab transitions
├── text-generate-effect.tsx       # Text generation
├── text-hover-effect.tsx          # Text hover animations
├── tracing-beam.tsx               # Scroll progress beam
└── wavy-background.tsx            # Wave animation
... (50+ more)
```

**Issues**:
- Overwhelming number of animation options (94+ components)
- Many animations unused or underutilized
- No clear guidelines on when to use which animation
- Performance impact of multiple simultaneous animations unknown
- Some effects may be too flashy for professional trading UI

---

### 1.2 Tailwind Animation System

**Defined Keyframes** (`tailwind.config.ts`):
```typescript
keyframes: {
  'accordion-down': { ... },     // Radix accordion
  'accordion-up': { ... },       // Radix accordion
  'gradient': { ... },           // Background gradient shift
  'float': { ... },              // Vertical floating
  'blur-in': { ... },            // Blur + scale entrance
  'slide-in': { ... },           // Slide from bottom
  'fade-in': { ... },            // Opacity fade
  'ripple': { ... },             // Click ripple expand
  'shimmer': { ... },            // Shimmer sweep
}
```

**Animation Classes**:
```typescript
animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'gradient': 'gradient 8s linear infinite',
  'float': 'float 3s ease-in-out infinite',
  'blur-in': 'blur-in 0.5s ease-out',
  'slide-in': 'slide-in 0.4s ease-out',
  'fade-in': 'fade-in 0.3s ease-out',
  'ripple': 'ripple 0.6s linear',
  'shimmer': 'shimmer 2s linear infinite',
}
```

**Issues**:
- Duplicate animations (MagicUI `blur-in.tsx` vs Tailwind `blur-in`)
- No standardized duration/easing guidelines
- Long-running infinite animations (8s gradient, 3s float) may cause performance issues
- No reduced-motion media query support

---

### 1.3 Button Interaction Patterns

**Current Button Hover States**:

1. **Standard Button** (`components/ui/button.tsx`):
```tsx
<button className="hover:bg-primary/90 transition-colors">
```

2. **Shimmer Button** (`components/magicui/shimmer-button.tsx`):
```tsx
// Animated shimmer sweep on hover
```

3. **Pulsating Button** (`components/magicui/pulsating-button.tsx`):
```tsx
// Continuous pulsing animation
```

4. **Ripple Button** (`components/magicui/ripple.tsx`):
```tsx
// Click ripple effect
```

**Usage**:
- Standard buttons: Used in 80% of UI
- Shimmer: Used for CTAs (Launch Index, Connect Wallet)
- Pulsating: Not actively used (visual noise concern)
- Ripple: Not actively used

**Issues**:
- No consistent hover animation across button variants
- Shimmer button may be too flashy for frequent actions
- No feedback for disabled state animations
- No loading state animations standardized

---

### 1.4 Card Hover Effects

**Current Card Patterns**:

1. **Index Card** (`components/trading/index-card.tsx`):
```tsx
<div className="group hover:border-[#98FCE4] transition-all duration-300">
  {/* Glow effect on hover */}
  <div className="absolute inset-0 bg-[#98FCE4]/5 opacity-0
                  group-hover:opacity-100 transition-opacity" />
</div>
```

2. **Trader Card** (`components/trading/trader-card.tsx`):
```tsx
<div className="hover:bg-card/80 transition-colors cursor-pointer">
```

3. **MagicCard** (`components/magicui/magic-card.tsx`):
```tsx
// Gradient spotlight follows cursor
```

**Issues**:
- Inconsistent hover patterns (border change vs background change vs glow)
- Magic card effect too subtle in some contexts
- No clear visual hierarchy (which cards are clickable?)
- Transition durations vary (200ms to 300ms)

---

### 1.5 Loading States

**Current Loading Patterns**:

1. **Skeleton Loader** (`components/ui/skeleton.tsx`):
```tsx
<div className="animate-pulse bg-muted rounded" />
```

2. **Multi-Step Loader** (`components/ui/multi-step-loader.tsx`):
```tsx
// Step-by-step progress animation (Aceternity)
```

3. **Spinner** (no dedicated component):
```tsx
// Inline spinner with Lucide icon + rotate animation
<Loader2 className="animate-spin" />
```

**Usage**:
- Skeleton: Portfolio positions, index list
- Multi-step: Not actively used
- Spinner: Modal loading, button loading states

**Issues**:
- No standardized loading component
- Skeleton pulse animation harsh (too fast)
- No timeout fallback for long-running loaders
- No error state animations

---

### 1.6 Micro-Interactions

**Current Patterns**:

1. **Toast Notifications** (`components/providers/ToastProvider.tsx`):
```tsx
// react-hot-toast with slide-in animation
```

2. **Dropdown Menus** (`components/ui/dropdown-menu.tsx`):
```tsx
// Radix with scale + opacity fade-in
```

3. **Modal Dialogs** (`components/ui/dialog.tsx`):
```tsx
// Radix with overlay fade + content scale
```

4. **Tabs** (`components/ui/tabs.tsx`):
```tsx
// Instant content switch (no animation)
```

5. **Number Ticker** (`components/magicui/number-ticker.tsx`):
```tsx
// Counting animation for numbers (not widely used)
```

**Issues**:
- Tab content switches instantly (no smooth transition)
- Tooltip fade-in timing inconsistent
- No haptic feedback patterns (for mobile)
- Modal entrance animation too aggressive (scale from 0.95 to 1)

---

### 1.7 Scroll Animations

**Available Scroll-Triggered Animations**:

1. **Container Scroll** (`components/ui/container-scroll-animation.tsx`):
```tsx
// Parallax scroll effect
```

2. **Tracing Beam** (`components/ui/tracing-beam.tsx`):
```tsx
// Vertical scroll progress indicator
```

3. **Sticky Scroll Reveal** (`components/ui/sticky-scroll-reveal.tsx`):
```tsx
// Content reveals on scroll
```

4. **Parallax Scroll** (`components/ui/parallax-scroll.tsx`):
```tsx
// Multi-layer parallax
```

**Usage**:
- None of these are actively used in trading pages
- May be suitable for marketing/landing pages
- Could add visual interest to long-form content (governance proposals, documentation)

**Issues**:
- Scroll animations not integrated into main app
- Potential performance concerns (layout thrashing)
- May conflict with virtual scrolling (if implemented)

---

### 1.8 Page Transition Animations

**Current Implementation**:
```
lib/animations/page-transitions.ts
```

**Analysis**: File exists but needs inspection for actual usage.

**Expected Patterns**:
- Route change fade-in/fade-out
- Content slide transitions
- Back navigation animations

**Issues**:
- Unknown if page transitions are actively used
- May cause layout shift if not implemented correctly
- No loading states between route changes

---

## 2. Hyperliquid Reference Analysis

### 2.1 Trading Page Interactions
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of Hyperliquid trading page interactions (hover, click, type)
- Specific observations: orderbook hover, chart hover, button hover timing

**Analysis Points to Cover**:
- Button hover animation type (fade? scale? glow?)
- Button hover timing (duration, easing)
- Orderbook row hover feedback
- Chart crosshair animation
- Price ticker animation (if prices update)
- Tab switching animation
- Dropdown menu entrance/exit
- Modal dialog entrance/exit

---

### 2.2 Order Placement Flow
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of placing an order (from button click to confirmation)

**Analysis Points to Cover**:
- Order button click feedback
- Input field focus animation
- Slider drag interaction
- Order preview appearance
- Confirmation modal entrance
- Success state animation
- Error state animation
- Loading state during order submission

---

### 2.3 Chart Hover Interactions
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of TradingView chart interactions
- Screenshot of tooltip/crosshair appearance

**Analysis Points to Cover**:
- Crosshair line animation (instant? fade-in?)
- Tooltip appearance timing
- Tooltip follow speed (cursor tracking)
- Hover state on chart controls (zoom, indicators)
- Time frame selector hover/active states

---

### 2.4 Loading States
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of page load, data refresh, order submission
- Screenshot of skeleton loaders (if any)

**Analysis Points to Cover**:
- Initial page load animation
- Data refresh animation (orderbook, trades)
- Chart loading state
- Button loading state (spinner? text change?)
- Skeleton loader pattern (if used)
- Error state appearance

---

### 2.5 Notification Animations
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of notifications appearing (order filled, price alerts)

**Analysis Points to Cover**:
- Toast notification entrance (slide? fade?)
- Toast notification exit
- Toast duration (auto-dismiss timing)
- Multiple toast stacking behavior
- Notification sound (if any)

---

## 3. Axiom Reference Analysis

### 3.1 Proposal Card Hover Effects
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of hovering over proposal cards

**Analysis Points to Cover**:
- Card hover animation (border? background? scale?)
- Card hover timing and easing
- Vote button hover state
- Badge/status hover interaction (if any)
- Card click feedback before navigation

---

### 3.2 Voting Interface Animations
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of voting interaction (select option, confirm vote)

**Analysis Points to Cover**:
- Vote option selection animation
- Vote power slider interaction
- Confirm button loading state
- Vote submission success animation
- Vote confirmation modal entrance/exit
- Results bar animation (if results shown immediately)

---

### 3.3 Tab and Navigation Transitions
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of switching between tabs/sections

**Analysis Points to Cover**:
- Tab switching animation (instant? fade? slide?)
- Active tab indicator animation
- Content transition between tabs
- Sidebar navigation hover state
- Page navigation transition

---

### 3.4 Dashboard Stats Animations
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of dashboard loading (if stats animate in)

**Analysis Points to Cover**:
- Stats number counting animation (or instant display?)
- Card entrance stagger timing (if cards animate in)
- Chart/graph animation on load
- Progress bar animation
- Icon animations (if any)

---

### 3.5 Modal and Overlay Patterns
**[USER INPUT REQUIRED]**

Please provide:
- Screen recording of opening/closing modals and overlays

**Analysis Points to Cover**:
- Modal backdrop fade timing
- Modal content entrance animation (scale? slide? fade?)
- Modal exit animation
- Modal close button hover state
- Overlay click-to-close feedback

---

## 4. Best Practices

### 4.1 Animation Duration Guidelines

**Material Design Timing**:
```
Micro-interactions:    100-150ms  (button hover, tooltip)
Short animations:      150-250ms  (card hover, dropdown open)
Medium animations:     250-400ms  (modal entrance, tab switch)
Long animations:       400-700ms  (page transition, complex reveals)
```

**Financial UI Recommendations**:
```
Price updates:         Instant     (no animation, just highlight)
Orderbook updates:     Instant     (flash highlight only)
Button hover:          150ms       (fast feedback)
Modal entrance:        200ms       (quick but smooth)
Toast notifications:   250ms       (noticeable but not slow)
```

**Rule**: Prefer shorter animations for high-frequency interactions (trading), longer for infrequent actions (onboarding).

---

### 4.2 Easing Functions

**Common Easing Types**:
```css
linear:          Linear progression (use for infinite loops only)
ease:            Default (0.25, 0.1, 0.25, 1) - gentle acceleration/deceleration
ease-in:         Slow start, fast end (use for exits)
ease-out:        Fast start, slow end (use for entrances)
ease-in-out:     Slow start and end (use for reversible animations)
```

**Custom Cubic Bezier** (Material Design):
```css
Standard:  cubic-bezier(0.4, 0.0, 0.2, 1)  /* Most animations */
Decelerate: cubic-bezier(0.0, 0.0, 0.2, 1) /* Entrances */
Accelerate: cubic-bezier(0.4, 0.0, 1, 1)   /* Exits */
Sharp:      cubic-bezier(0.4, 0.0, 0.6, 1) /* Emphasis */
```

**Tailwind Defaults**:
```
ease-linear
ease-in
ease-out
ease-in-out
```

**Recommendation**: Use `ease-out` for most UI animations (buttons, cards, modals).

---

### 4.3 Reduced Motion Support

**Prefers Reduced Motion Media Query**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Best Practice**:
- Respect user's OS-level motion preferences
- Disable decorative animations (particles, gradients, floating)
- Keep essential animations (loading spinners, toast notifications) but reduce duration
- Replace slide/scale animations with fade-only

**Tailwind Plugin**:
```typescript
// tailwind.config.ts
module.exports = {
  plugins: [
    require('tailwindcss-motion'), // Adds motion-reduce variants
  ],
}
```

**Usage**:
```tsx
<div className="animate-slide-in motion-reduce:animate-none">
```

---

### 4.4 Performance Optimization

**GPU-Accelerated Properties** (use for animations):
```
transform (translate, scale, rotate)  ✅
opacity                                ✅
filter (blur, brightness)              ✅ (but expensive)
```

**CPU-Bound Properties** (avoid animating):
```
width, height                          ❌
top, left, right, bottom               ❌
margin, padding                        ❌
color, background-color                ⚠️ (use sparingly)
box-shadow                             ⚠️ (expensive)
```

**Best Practices**:
- Use `transform: translateX()` instead of `left`
- Use `transform: scale()` instead of `width/height`
- Use `will-change: transform` for animations (but remove after)
- Limit simultaneous animations to 3-5 elements max
- Avoid animating box-shadow (use border or outline instead)

**Example**:
```css
/* Bad */
.card:hover {
  width: 110%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

/* Good */
.card {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
.card:hover {
  transform: scale(1.05);
  opacity: 0.9;
}
```

---

### 4.5 Loading State Best Practices

**Types of Loading States**:

1. **Determinate** (progress known):
   - Progress bar with percentage
   - Step-by-step wizard
   - File upload progress

2. **Indeterminate** (progress unknown):
   - Spinner
   - Skeleton loader
   - Pulsing placeholder

**When to Use**:
```
< 300ms:    No loading indicator (instant)
300-1000ms: Inline spinner (small feedback)
1-3s:       Skeleton loader (show structure)
> 3s:       Progress bar + text (show progress)
```

**Skeleton Best Practices**:
- Match actual content layout
- Use subtle pulse (1.5s duration, not 0.5s)
- Fade out skeleton when content loads (don't snap)
- Limit skeleton to 3-5 placeholders (not entire page)

---

### 4.6 Feedback Patterns

**Visual Feedback Timing**:
```
Button click:     < 100ms   (instant response)
Form submission:  < 200ms   (show loading state)
Save action:      < 500ms   (show success message)
Error display:    Instant   (don't delay error messages)
```

**Haptic Feedback** (mobile):
```typescript
// Light tap for success
if ('vibrate' in navigator) {
  navigator.vibrate(10);
}

// Short buzz for error
if ('vibrate' in navigator) {
  navigator.vibrate([50, 30, 50]);
}
```

**Sound Feedback**:
- Order filled: Short "success" sound
- Error: Short "error" sound
- Price alert: Notification sound
- Keep sounds < 300ms duration
- Provide mute toggle in settings

---

## 5. Proposed Implementation

### 5.1 Standardize Animation Tokens

**Create**: `lib/constants/animation-tokens.ts`
```typescript
export const ANIMATION_DURATION = {
  instant: 0,
  micro: 100,       // Button hover, tooltip
  fast: 150,        // Card hover, input focus
  normal: 200,      // Modal entrance, dropdown
  medium: 300,      // Tab switch, toast
  slow: 400,        // Page transition
  verySlow: 600,    // Complex reveals
} as const;

export const ANIMATION_EASING = {
  linear: 'linear',
  default: 'ease',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
  // Custom cubic-bezier
  material: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
} as const;

export const ANIMATION_STAGGER = {
  tiny: 50,         // List items
  small: 100,       // Card grid
  medium: 150,      // Section reveals
  large: 200,       // Feature highlights
} as const;
```

**Usage**:
```tsx
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/constants/animation-tokens';

<div
  className="transition-all"
  style={{
    transitionDuration: `${ANIMATION_DURATION.fast}ms`,
    transitionTimingFunction: ANIMATION_EASING.out,
  }}
>
```

---

### 5.2 Create Standard Loading Components

**Loading Spinner** (`components/ui/loading-spinner.tsx`):
```tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <Loader2 className={cn('animate-spin text-muted-foreground', sizeClass)} />
  );
}
```

**Loading Button** (`components/ui/loading-button.tsx`):
```tsx
export function LoadingButton({
  loading,
  children,
  ...props
}: ButtonProps & { loading?: boolean }) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

**Improved Skeleton** (`components/ui/skeleton.tsx`):
```tsx
// Update pulse duration from 1s to 1.5s
<div className={cn(
  "animate-pulse bg-muted rounded",
  "motion-reduce:animate-none", // Respect reduced motion
  className
)} />
```

---

### 5.3 Button Hover Standardization

**Standard Button Hover**:
```tsx
// components/ui/button.tsx
<button className="
  transition-all duration-150 ease-out
  hover:scale-[1.02]
  active:scale-[0.98]
  hover:brightness-110
">
```

**CTA Button with Shimmer** (reserved for primary actions):
```tsx
import { ShimmerButton } from '@/components/magicui/shimmer-button';

// Use only for: Connect Wallet, Launch Index, Submit Order
<ShimmerButton>Launch Index</ShimmerButton>
```

**Icon Button Hover**:
```tsx
<button className="
  transition-all duration-150 ease-out
  hover:bg-muted
  hover:text-foreground
  active:scale-95
">
```

---

### 5.4 Card Hover Standardization

**Clickable Card** (links to detail page):
```tsx
<div className="
  group
  cursor-pointer
  transition-all duration-200 ease-out
  hover:border-brand
  hover:shadow-[0_0_20px_rgba(152,252,228,0.15)]
  active:scale-[0.99]
">
```

**Static Card with Highlight** (not clickable):
```tsx
<div className="
  transition-colors duration-200
  hover:bg-card-hover
">
```

**Index Card with Glow** (current pattern, preserve):
```tsx
<div className="
  group
  relative
  transition-all duration-300 ease-out
  hover:border-[#98FCE4]
">
  <div className="
    absolute inset-0
    bg-[#98FCE4]/5
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  " />
</div>
```

---

### 5.5 Modal Animation Improvements

**Soften Modal Entrance**:
```tsx
// components/ui/dialog.tsx
// Change scale from 0.95 to 0.98 (less aggressive)

<DialogPrimitive.Content
  className={cn(
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-98", // Changed from 95
    "data-[state=open]:zoom-in-98",    // Changed from 95
    "data-[state=closed]:slide-out-to-top-[2%]",
    "data-[state=open]:slide-in-from-top-[2%]",
  )}
/>
```

---

### 5.6 Tab Transition Animations

**Add Smooth Tab Content Switching**:
```tsx
// components/ui/tabs.tsx
<TabsPrimitive.Content
  className={cn(
    "data-[state=active]:animate-in",
    "data-[state=inactive]:animate-out",
    "data-[state=inactive]:fade-out-0",
    "data-[state=active]:fade-in-0",
    "data-[state=active]:slide-in-from-bottom-1",
    "duration-200",
  )}
>
```

---

### 5.7 Reduced Motion Support

**Add to `app/globals.css`**:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Keep essential animations */
  .loading-spinner,
  .toast-notification {
    animation-duration: 0.3s !important;
  }
}
```

**Add Motion Preference Hook**:
```typescript
// hooks/use-reduced-motion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

---

## 6. Implementation Checklist

### Phase 1: Animation Tokens (High Priority)
- [ ] Create `lib/constants/animation-tokens.ts` with duration/easing/stagger constants
- [ ] Update `tailwind.config.ts` with custom timing functions
- [ ] Document animation token usage in component library

### Phase 2: Button Hover Standardization (High Priority)
- [ ] Update `components/ui/button.tsx` with standardized hover (150ms, scale 1.02)
- [ ] Audit all button usages (70+ instances)
- [ ] Reserve ShimmerButton for CTAs only (Connect Wallet, Launch Index)
- [ ] Add active state scale (0.98) to all buttons
- [ ] Test button hover on different screen sizes

### Phase 3: Card Hover Standardization (High Priority)
- [ ] Standardize index-card.tsx hover (200ms, border + glow)
- [ ] Standardize trader-card.tsx hover (200ms, background)
- [ ] Update portfolio position cards
- [ ] Update governance proposal cards
- [ ] Add cursor-pointer to all clickable cards
- [ ] Test card hover performance with 20+ cards

### Phase 4: Loading States (High Priority)
- [ ] Create LoadingSpinner component (sm/md/lg sizes)
- [ ] Create LoadingButton component
- [ ] Update Skeleton pulse timing (1s → 1.5s)
- [ ] Add skeleton loaders to portfolio page
- [ ] Add skeleton loaders to index list
- [ ] Add loading states to all async buttons
- [ ] Add timeout fallback for long-running loaders

### Phase 5: Modal & Dialog Improvements (Medium Priority)
- [ ] Soften modal entrance scale (0.95 → 0.98)
- [ ] Reduce modal animation duration (300ms → 200ms)
- [ ] Add backdrop blur to modal overlay
- [ ] Test modal animations on mobile
- [ ] Add ESC key close animation

### Phase 6: Tab Transitions (Medium Priority)
- [ ] Add fade + slide animation to tab content switches
- [ ] Add active tab indicator slide animation
- [ ] Update Vote page tabs (Proposals / VS Battles)
- [ ] Update Trading page tabs (Positions / Orders)
- [ ] Test tab switching performance

### Phase 7: Reduced Motion Support (High Priority)
- [ ] Add prefers-reduced-motion media query to globals.css
- [ ] Create useReducedMotion hook
- [ ] Apply motion-reduce variants to decorative animations
- [ ] Keep essential animations (loading, toasts) at reduced speed
- [ ] Test with OS-level reduced motion setting

### Phase 8: Micro-Interactions (Medium Priority)
- [ ] Add ripple effect to key action buttons (optional)
- [ ] Add number ticker to stats counters (portfolio value, 24h volume)
- [ ] Add toast stacking behavior (max 3 visible)
- [ ] Add haptic feedback for mobile (optional)
- [ ] Add sound effects toggle in settings

### Phase 9: Performance Audit (High Priority)
- [ ] Profile animation performance with Chrome DevTools
- [ ] Identify layout thrashing issues
- [ ] Limit simultaneous animations to 5 max
- [ ] Add will-change for transform animations (sparingly)
- [ ] Remove unused animation components (declutter /ui)
- [ ] Test on low-end devices (throttled CPU)

### Phase 10: Reference Analysis Integration (Low Priority)
- [ ] Compare with Hyperliquid interactions (after recordings provided)
- [ ] Compare with Axiom interactions (after recordings provided)
- [ ] Identify animation patterns to adopt
- [ ] Document differences and rationale for deviations
- [ ] Update animation tokens based on reference insights

### Phase 11: Documentation (Low Priority)
- [ ] Create animation usage guidelines doc
- [ ] Add examples for each animation pattern
- [ ] Document when to use decorative vs functional animations
- [ ] Create animation component decision tree
- [ ] Add accessibility notes (WCAG 2.1 motion guidelines)

---

## 7. Reference Recordings Needed

### Hyperliquid
- [ ] Trading page interactions (hover, click, type)
- [ ] Order placement flow (button → modal → success)
- [ ] Chart hover and tooltip behavior
- [ ] Loading states (page load, data refresh, order submission)
- [ ] Notification animations (toast entrance/exit)

### Axiom
- [ ] Proposal card hover effects
- [ ] Voting interface interactions (select, confirm, success)
- [ ] Tab and navigation transitions
- [ ] Dashboard stats loading animations
- [ ] Modal and overlay entrance/exit patterns

---

**Last Updated**: 2025-11-05
**Next Review**: After reference recordings provided
**Status**: Awaiting user input for reference analysis
