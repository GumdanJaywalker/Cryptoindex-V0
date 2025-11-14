# Global UI/UX Planning

**Date**: 2025-11-14
**Status**: Planning → In Progress

---

## Overview

Global layout improvements affecting all pages: sidebar removal, header fixes, layout refinements, glassmorphism unification, and footer redesign.

**Reference Pages**: Trade, Vote, Launch (glassmorphism standard)
**Reference Footer**: Cryptoindex-V0 implementation

---

## 1. Sidebar Removal

### Current Issue
- Sidebar displayed on multiple pages causing layout clutter
- Inconsistent with Trade/Vote/Launch pages (no sidebar)

### Target State
- No sidebar on any page
- Clean full-width layout
- Header and Footer as only persistent UI elements

### Files to Modify
- [ ] Remove `<Sidebar>` components from all page layouts
- [ ] Update layout grid structures (remove sidebar column)
- [ ] Verify responsive behavior (mobile/tablet/desktop)

---

## 2. Header Duplicate Display Fix

### Current Issue
- Header appearing multiple times on certain pages
- Likely due to layout.tsx rendering Header + individual pages also rendering Header

### Root Cause Investigation
- Check `app/layout.tsx` - Header rendered globally
- Check individual pages - Header may be imported redundantly

### Solution
- Remove redundant Header imports from individual pages
- Ensure Header only rendered in `app/layout.tsx`
- Test all pages for single Header appearance

### Files to Check
- [ ] `app/layout.tsx` - Global Header
- [ ] All page files in `app/*/page.tsx`

---

## 3. Layout Padding/Margin Issues

### Current Issues
- Inconsistent spacing between Header, main content, and Footer
- Some pages have excessive whitespace
- Grid gaps not uniform

### Target Standards
- Consistent top padding after Header
- Consistent bottom padding before Footer
- Uniform grid gaps (match Trade/Vote/Launch)

### Solution Approach
- Define standard spacing variables in globals.css
- Apply consistent padding classes to all page containers
- Fix `pb-16 md:pb-9` footer spacing issues

### Files to Modify
- [ ] `app/globals.css` - Add spacing utilities if needed
- [ ] All page layouts - Apply consistent padding classes

---

## 4. Grid Structure Fixes

### Current Issues
- Inconsistent grid column counts across pages
- Some grids not responsive
- Card sizing inconsistent

### Target Standards
- Responsive grids: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Consistent card aspect ratios
- Proper gap spacing (match Trade/Vote/Launch)

### Files to Review
- [ ] Landing page grids
- [ ] Discover page grids
- [ ] Leaderboard page grids
- [ ] Portfolio page grids

---

## 5. Glassmorphism Style Unification

### Current Issues
- Inconsistent card styles across pages
- Some components lack glassmorphism effect
- Brand color (#98FCE4) not uniformly applied

### Target Standard (from Trade/Vote/Launch)
```css
.glass-card {
  background: rgba(14, 40, 37, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(117, 207, 193, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card-dynamic {
  background: rgba(14, 40, 37, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(117, 207, 193, 0.15);
  transition: all 0.3s ease;
}

.glass-card-dynamic:hover {
  background: rgba(14, 40, 37, 0.6);
  border: 1px solid rgba(152, 252, 228, 0.3);
  box-shadow: 0 8px 32px 0 rgba(152, 252, 228, 0.15);
}
```

### Components to Update
- [ ] All Card components across pages
- [ ] Modal/Dialog backgrounds
- [ ] Section containers
- [ ] Button hover states (brand color glow)

### Implementation
- Replace existing card classes with `glass-card` or `glass-card-dynamic`
- Ensure brand color (#98FCE4) for accents, borders, hover states
- Test hover animations

---

## 6. Footer Redesign

### Current Footer Issues
- Footer too tall (excessive vertical space)
- Price Alerts using icon instead of text
- Missing important links (Docs, Support, Terms, Privacy Policy)
- Market Overview center-aligned (wastes space)

### Target Footer Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Network] [Market Overview] [Price Alert]      [Docs|Support|Terms|Privacy] │
└─────────────────────────────────────────────────────────────────────┘
```

**Layout Breakdown**:
- **Left**: Network indicator (existing)
- **Center-left**: Market Overview (move from center, place right next to Network)
- **Center-right**: Price Alert (text, not icon)
- **Right**: Four links - right-aligned, separated by `|`

### Height Reduction
- Target height: Match Cryptoindex-V0 implementation (more compact)
- Reduce vertical padding
- Reduce font sizes if needed
- Single row layout (no wrapping)

### Price Alerts Change
- Remove bell icon
- Use text: "Price Alerts" or "Alerts"
- Keep same functionality (opens popover)

### New Footer Links
- **Docs**: `/docs` or external docs link
- **Support**: Support/help page or email
- **Terms**: Terms of Service page
- **Privacy Policy**: Privacy policy page

### Implementation Steps
1. [ ] Read current Footer component (`components/layout/Footer.tsx`)
2. [ ] Read Cryptoindex-V0 Footer for height reference
3. [ ] Reduce Footer container height (padding, min-height)
4. [ ] Restructure layout:
   - Left section: Network
   - Center-left: Market Overview
   - Center-right: Price Alert (text)
   - Right section: Four links with separators
5. [ ] Replace Price Alerts icon with text
6. [ ] Add four new link elements
7. [ ] Style links with hover effects (brand color)
8. [ ] Test responsive behavior (ensure no wrapping on desktop, adjust for mobile)

### Files to Modify
- [ ] `components/layout/Footer.tsx` - Main footer component
- [ ] `app/globals.css` - Footer-specific styles if needed

---

## Design Notes

### Brand Color (#98FCE4)
- Primary accent color
- Used for: borders, hover states, active states, glows
- Always pair with appropriate opacity for glassmorphism

### Typography
- Font: Existing font stack (check globals.css)
- Consistent font sizes across similar elements
- Footer text: smaller, secondary color

### Spacing
- Consistent padding: 16px (mobile), 24px (desktop)
- Grid gaps: 16px (mobile), 24px (desktop)
- Section spacing: 48px (mobile), 64px (desktop)

---

## Implementation Plan

### Phase 1: Layout Cleanup (Today - Nov 14)
1. Remove sidebar from all pages
2. Fix header duplicate display
3. Fix layout padding/margin issues
4. Fix grid structures

### Phase 2: Style Unification (Today - Nov 14)
5. Apply glassmorphism to all components
6. Ensure brand color consistency

### Phase 3: Footer Redesign (Today - Nov 14)
7. Reduce footer height
8. Replace Price Alerts icon with text
9. Add four footer links
10. Restructure footer layout

### Testing
- [ ] Test all pages (landing, discover, leaderboard, portfolio, referrals, settings, notifications, docs)
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Verify glassmorphism effects
- [ ] Verify footer layout and links

---

**Next Steps**: Start with Phase 1 - Layout Cleanup

