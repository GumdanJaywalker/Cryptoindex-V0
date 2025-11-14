# UI/UX Refinement - Global Layout & Footer Redesign

**Date**: 2025-11-14 (Week 3, November 2025)
**Status**: In Progress
**Goal**: Clean UI polish for YC demo - Remove clutter, unify glassmorphism style, optimize footer layout

---

## 🎯 Overview

YC 담당자가 볼 데모를 위해 나머지 페이지들의 UI를 깔끔하게 정리. Trade, Vote, Launch 페이지 수준의 glassmorphism 스타일로 통일하고, 레이아웃 문제들을 해결.

**Scope**: Landing, Discover, Leaderboard, Portfolio, Referrals, Settings, Notifications, Docs + Global Layout/Footer

---

## 📋 Work Plan (Nov 14)

### 1. Global Layout Fixes
**Status**: ⏳ Pending

**Tasks**:
- [ ] Remove sidebar from all pages
- [ ] Fix header duplicate display issue
- [ ] Fix layout padding/margin issues
- [ ] Fix grid structure inconsistencies

**Details**: See `2025NOV03_globals.md`

---

### 2. Glassmorphism Style Unification
**Status**: ⏳ Pending

**Tasks**:
- [ ] Apply glassmorphism to all components (match Trade/Vote/Launch pages)
- [ ] Unify card styles with `glass-card` and `glass-card-dynamic`
- [ ] Ensure brand color consistency (#98FCE4)

**Details**: See `2025NOV03_globals.md`

---

### 3. Footer Redesign
**Status**: ⏳ Pending

**Tasks**:
- [ ] Reduce footer height (match Cryptoindex-V0 implementation)
- [ ] Replace Price Alerts icon with text
- [ ] Add footer links: Docs | Support | Terms | Privacy Policy
- [ ] Restructure footer layout:
  - Left: Network indicator
  - Center-left: Market Overview (right next to Network)
  - Center-right: Price Alert
  - Right: Four links (docs, support, terms, privacy policy) - right-aligned

**Details**: See `2025NOV03_globals.md`

---

## 📁 Document Structure

Each page has a dedicated planning document:

- `2025NOV03_landing.md` - Landing page UI/UX
- `2025NOV03_discover.md` - Discover page UI/UX
- `2025NOV03_leaderboard.md` - Leaderboard page UI/UX
- `2025NOV03_portfolio.md` - Portfolio page UI/UX
- `2025NOV03_refferals.md` - Referrals page UI/UX
- `2025NOV03_settings.md` - Settings page UI/UX
- `2025NOV03_notifications.md` - Notifications page UI/UX
- `2025NOV03_docs.md` - Docs page UI/UX
- `2025NOV03_globals.md` - **Global layout, header, footer, glassmorphism**

---

## ✅ Completion Checklist

### Nov 14 Tasks
- [ ] 1. Global Layout Fixes - Sidebar removal
- [ ] 2. Global Layout Fixes - Header duplicate fix
- [ ] 3. Global Layout Fixes - Layout padding/margin
- [ ] 4. Global Layout Fixes - Grid structure
- [ ] 5. Glassmorphism Style Unification
- [ ] 6. Footer Redesign - Height reduction
- [ ] 7. Footer Redesign - Price Alerts icon → text
- [ ] 8. Footer Redesign - Add 4 links
- [ ] 9. Footer Redesign - Layout restructure

**Total**: 9 tasks

---

## 🔄 Update Log

### 2025-11-14 (Session 2 - Data & UI Polish)

#### ✅ Data Unification (Completed)
**Problem**: Landing, Discover, Trading 페이지가 각각 다른 데이터 소스 사용. Launch에서 생성한 인덱스가 다른 페이지에 표시되지 않음.

**Solution**:
- Created `lib/utils/index-converter.ts` - IndexData ↔ MemeIndex 변환
- Created `lib/data/unified-indexes.ts` - Single source of truth (Launch + Mock 통합)
- Updated Landing, Discover, Trading to use unified data
- Unified modals to use `IndexDetailsModal` from portfolio
- Fixed graduation display logic (L3 launching + L2 graduated show progress, L1 institutional hide)

**Files Modified**:
- `lib/utils/index-converter.ts` (NEW)
- `lib/data/unified-indexes.ts` (NEW)
- `app/page.tsx`
- `app/discover/page.tsx`
- `components/trading/TradingLayout.tsx`
- `components/portfolio/IndexDetailsModal.tsx`

#### ✅ Landing Page Improvements (Completed)
**Changes**:
- Changed Trending Indexes layout to 3 rows × 2 cols (6 cards per page)
- Changed Top Performers layout to 3 rows × 2 cols (6 cards per page)
- Created compact card components
- Fixed card hover issue (removed `group` from carousel container)
- Fixed arrow button hover opacity (opacity-20 default, opacity-100 on hover)
- Changed "meme coin indexes" → "crypto indexes"

**Files Modified**:
- `components/landing/CompactIndexCard.tsx` (NEW)
- `components/landing/CompactTraderCard.tsx` (NEW)
- `components/landing/IndexCarousel.tsx`
- `components/landing/TraderCarousel.tsx`
- `app/page.tsx`

#### ✅ Wallet UI Polish (Completed)
**Changes**:
- Removed duplicate network display in WalletDropdown
- Applied teal theme to wallet dropdown modal
- Changed all gray colors to teal/slate colors
- Fixed keyboard navigation focus ring (focus → focus-visible)

**Files Modified**:
- `components/wallet/WalletDropdown.tsx`

#### ✅ Backend Integration Documentation (Completed)
**Created**:
- `docs/planning/Backend Integration/MOCK_TO_BACKEND_MIGRATION.md`
- Complete guide for replacing mock data with backend APIs
- API endpoint specifications
- Migration checklist

### 2025-11-14 (Session 1)
- Created UIUX planning structure
- Defined Nov 14 scope (global layout + footer)
- Created placeholder documents for all pages

---

## 📌 Notes

- All work done in YCOMDEMO folder (YC demo link)
- After completion, update `docs/handover/HANDOVER.md`
- Sync to Cryptoindex-V0 using `docs/handover/SYNC_TO_PRODUCTION.md`
- Reference: Trade/Vote/Launch pages for glassmorphism standard
- Footer reference: Cryptoindex-V0 implementation

---

**Last Updated**: 2025-11-14
