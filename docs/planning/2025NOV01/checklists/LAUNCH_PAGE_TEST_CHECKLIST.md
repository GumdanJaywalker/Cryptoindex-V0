# Launch Page Refactoring - Test Checklist

**Date**: 2025-11-05
**Status**: Phase 1-5 Complete, Ready for Testing
**Page**: `/launch`

---

## 📋 Pre-Test Setup

- [ ] Run `pnpm install` (if any dependencies changed)
- [ ] Run `pnpm run dev`
- [ ] Open browser to `http://localhost:3000/launch`
- [ ] Open DevTools Console (check for errors)
- [ ] Open DevTools Network tab (check API calls)
- [ ] Clear localStorage (if testing from scratch)

---

## 🎯 Phase 1: Component Extraction - Functional Tests

### Basic Info Step
- [ ] Index Name input accepts text
- [ ] Index Name validation: Shows error if < 3 characters
- [ ] Index Name validation: Shows error if > 50 characters
- [ ] Ticker input converts to uppercase automatically
- [ ] Ticker validation: Shows error if < 3 characters
- [ ] Ticker validation: Shows error if > 8 characters
- [ ] Ticker validation: Shows error if contains invalid characters (only A-Z, 0-9, - allowed)
- [ ] Ticker validation: Shows error if ticker already exists in localStorage
- [ ] Description textarea accepts text
- [ ] Description validation: Shows error if < 10 characters
- [ ] Description validation: Shows error if > 500 characters
- [ ] Social Link is optional (can be blank)
- [ ] Social Link validation: Shows error if invalid URL format
- [ ] Social Link validation: Accepts valid https:// URLs

### Asset Selection Step
- [ ] Shows "Complete basics first" message when basics incomplete
- [ ] Asset search input is disabled when basics incomplete
- [ ] Asset search input is enabled when basics complete
- [ ] Search input shows filtered results (up to 10)
- [ ] Search results display symbol and name
- [ ] Clicking asset adds it to selected list
- [ ] Search input clears after adding asset
- [ ] Clear button (✕) appears when search has text
- [ ] Clear button removes search text
- [ ] Selected assets show symbol, name, marketType badge
- [ ] Side selector shows "Long/Short" for perp assets
- [ ] Side selector shows "Buy (spot only)" for spot assets
- [ ] Side selector is disabled for spot assets
- [ ] Leverage slider shows for perp assets (1-50x)
- [ ] Leverage is fixed at 1x for spot assets
- [ ] Remove button removes asset from list
- [ ] Allocation warning shows if total ≠ 100%
- [ ] Auto Balance button appears when allocation warning shows
- [ ] Auto Balance button distributes allocation equally

### Portfolio Composition Step
- [ ] Shows "Complete components first" when components invalid
- [ ] Total Amount input accepts numbers
- [ ] Total Amount validation: Shows error if < 100 HYPE
- [ ] Allocation sliders show for each selected asset
- [ ] Allocation percentage updates when slider moves
- [ ] Allocation input accepts manual percentage input (0-100)
- [ ] Total allocation percentage displays (green if 100%, red/yellow otherwise)
- [ ] Auto Balance button distributes allocations equally
- [ ] ✓ Allocations balanced message shows when total = 100%

### Preview Step
- [ ] Shows "Complete components to see preview" when components invalid
- [ ] Timeframe selector shows 1d, 7d, 30d options
- [ ] Timeframe selector is disabled when components invalid
- [ ] Loading spinner shows while fetching preview data
- [ ] Chart renders with preview data
- [ ] Chart shows gradient fill (brand color)
- [ ] Chart tooltip shows on hover
- [ ] Preview stats show: Start, Current, Change%
- [ ] Change% is green if positive, red if negative
- [ ] Error message shows if preview fetch fails

### Launch Summary (Sticky Footer)
- [ ] Summary is fixed at bottom of screen
- [ ] Base Cost displays correctly
- [ ] Fee displays correctly (2%)
- [ ] Total Cost = Base Cost + Fee
- [ ] Preview button is disabled when !canLaunch
- [ ] Launch button is disabled when !canLaunch
- [ ] Preview button shows when canLaunch = true
- [ ] Launch button shows when canLaunch = true
- [ ] Error message shows when !canLaunch

### Active Launches Section
- [ ] Section shows 3 example launches
- [ ] Each card shows: name, ticker, creator, status
- [ ] Progress bar shows funding progress
- [ ] Progress bar color matches status (brand/green/yellow)
- [ ] Backers count displays
- [ ] Time left displays
- [ ] Cards are hoverable (border changes)

---

## 🎨 Phase 2: Layout Improvement - Responsive Tests

### Mobile (< 768px)
- [ ] Single column layout (all cards stack vertically)
- [ ] Step indicator shows current step only (not all steps)
- [ ] Cards are full width
- [ ] Gap is 4px between cards
- [ ] Sticky footer is visible
- [ ] No horizontal scroll

### Tablet (768px - 1023px)
- [ ] 2 column layout (Basics left, Components/Portfolio right)
- [ ] Preview card spans full width (2 columns)
- [ ] Step indicator shows all steps inline
- [ ] Gap is 6px between cards
- [ ] Cards are responsive width

### Desktop (1024px+)
- [ ] 3 column layout (Basics, Components/Portfolio, Preview)
- [ ] Equal column widths
- [ ] Step indicator shows all steps with labels
- [ ] Gap is 8px between cards
- [ ] Cards have padding (p-4 lg:p-6)

---

## 🧙 Phase 3: Wizard UI - Interactive Tests

### Step Indicator
- [ ] Shows 4 steps: Basics, Components, Portfolio, Preview
- [ ] Current step is highlighted (brand color, scale 110%)
- [ ] Completed steps show checkmark icon
- [ ] Upcoming steps show step number
- [ ] Progress line connects steps
- [ ] Progress line fills based on current step
- [ ] Mobile: Shows only current step title/description
- [ ] Desktop: Shows all step titles/descriptions

### Progress Bar
- [ ] Shows 0% when nothing complete
- [ ] Shows 25% when basics complete
- [ ] Shows 50% when basics + assets selected
- [ ] Shows 75% when basics + assets + allocations balanced
- [ ] Shows 100% when all steps complete
- [ ] Color changes: blue (0-49%) → yellow (50-74%) → brand (75-99%) → green (100%)
- [ ] Label shows "Completion Progress"
- [ ] Percentage displays next to label

---

## 🧹 Phase 4: Code Cleanup - Validation Tests

### Type Safety
- [ ] No TypeScript errors in console
- [ ] All imports use `@/lib/types/launch`
- [ ] No duplicate type definitions

### Enhanced Validation
- [ ] URL validation works (social link)
- [ ] Ticker uniqueness check works
  - [ ] Create index with ticker "TEST"
  - [ ] Try to create another with "TEST" → should fail
  - [ ] Try to create with "test" (lowercase) → should fail
- [ ] Max length validation works:
  - [ ] Index name: 51 characters → error
  - [ ] Description: 501 characters → error
  - [ ] Ticker: 9 characters → error

---

## ✨ Phase 5: UX Polish - Visual Tests

### Chart Size
- [ ] Preview chart is larger (300px base height)
- [ ] Chart is 350px on tablet
- [ ] Chart is 400px on large desktop
- [ ] Chart is responsive to container width

### Loading States
- [ ] Spinner animation shows during preview loading
- [ ] Spinner is centered with text "Loading preview..."
- [ ] Spinner uses brand color

### Animations
- [ ] Main grid fades in on page load
- [ ] Cards have hover effect (border glow)
- [ ] Cards have hover shadow (brand color)
- [ ] Hover transitions are smooth (300ms)

### Interactive Elements
- [ ] Search clear button (✕) appears/disappears smoothly
- [ ] Auto Balance button has hover state
- [ ] Timeframe buttons have active state (brand background)
- [ ] All buttons have hover/disabled states

---

## 🚀 End-to-End Flow Test

### Happy Path: Create Index from Scratch
1. [ ] Enter index name "Test AI Index" → no error
2. [ ] Enter ticker "TESTAI" → no error
3. [ ] Enter description "A test index for AI assets with great potential" → no error
4. [ ] Enter social link "https://twitter.com/testai" → no error
5. [ ] Wizard step 1 → 2 (checkmark appears)
6. [ ] Progress bar → 25%
7. [ ] Search "BTC" → results show
8. [ ] Add BTC → appears in selected list
9. [ ] Search "ETH" → results show
10. [ ] Add ETH → appears in selected list
11. [ ] Wizard step 2 → 3 (checkmark appears)
12. [ ] Progress bar → 50%
13. [ ] Allocation warning shows (not 100%)
14. [ ] Click Auto Balance → allocation = 50% each
15. [ ] Total allocation = 100% → warning disappears
16. [ ] Progress bar → 75%
17. [ ] Set total amount 1000 HYPE → no error
18. [ ] Progress bar → 100%
19. [ ] Wizard step 3 → 4 (checkmark appears)
20. [ ] Preview chart loads (spinner → chart)
21. [ ] Summary shows: Base 1000, Fee 20, Total 1020
22. [ ] Launch button is enabled
23. [ ] Click Launch → modal opens
24. [ ] Confirm launch → success modal opens
25. [ ] Index saved to localStorage
26. [ ] Success modal shows index name and ticker

### Error Handling
- [ ] Try to launch with incomplete basics → button disabled
- [ ] Try to launch with only 1 asset → button disabled
- [ ] Try to launch with 99% allocation → warning shows
- [ ] Try to launch with < 100 HYPE → validation error shows
- [ ] Try to enter invalid ticker "test@123" → validation error shows

---

## 🐛 Edge Cases

### LocalStorage Tests
- [ ] Create index, refresh page → index appears in "My Launched Indexes"
- [ ] Create 2 indexes with different tickers → both saved
- [ ] Try to create index with duplicate ticker → validation prevents

### Network Tests
- [ ] Preview data loads on slow connection (throttle to 3G)
- [ ] Preview data shows error if API fails (mock 500 error)

### Browser Compatibility
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile Safari (iOS): All features work

### Accessibility
- [ ] Tab navigation works through all inputs
- [ ] Enter key submits forms
- [ ] Screen reader can read all labels
- [ ] Focus states are visible

---

## 📊 Performance Tests

- [ ] Page loads in < 2 seconds
- [ ] No console errors on page load
- [ ] No console warnings on page load
- [ ] Preview data fetches in < 1 second
- [ ] Smooth 60fps animations (check DevTools Performance tab)
- [ ] No memory leaks (check DevTools Memory tab)

---

## 🎯 Critical Issues (Must Fix Before Production)

**If any of these fail, STOP and fix immediately:**

- [ ] TypeScript compilation passes (`pnpm run build`)
- [ ] No console errors on page load
- [ ] Launch flow completes successfully (end-to-end)
- [ ] Data persists to localStorage
- [ ] Responsive layout works on all screen sizes
- [ ] All validation rules work correctly

---

## 📝 Notes Section

**Issues Found**:
<!-- Record any bugs or issues discovered during testing -->

**Performance Issues**:
<!-- Record any slow loads, janky animations, etc. -->

**UI/UX Issues**:
<!-- Record any design issues, confusing flows, etc. -->

**Browser-Specific Issues**:
<!-- Record any issues that only occur in specific browsers -->

---

## ✅ Final Sign-Off

- [ ] All critical tests passed
- [ ] All Phase 1-5 features work as expected
- [ ] No blocking bugs found
- [ ] Ready for user acceptance testing
- [ ] Ready for production deployment

**Tested By**: _____________
**Date**: _____________
**Approved**: [ ] Yes [ ] No

---

**Last Updated**: 2025-11-05
**Total Test Items**: 150+
