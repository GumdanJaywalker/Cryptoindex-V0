# Phase 2 Checklist - Clean Up Unused Pages

**Date**: 2025-11-03
**Goal**: Remove 14 unnecessary pages to keep only 3 demo pages (Trading, Launch, Manage Indexes)

---

## 2.1 Delete Unnecessary Pages

### CODE Items

- [ ] **CODE**: Delete `app/dashboard/page.tsx`
- [ ] **CODE**: Delete `app/discover/page.tsx`
- [ ] **CODE**: Delete `app/portfolio/page.tsx`
- [ ] **CODE**: Delete `app/leaderboard/page.tsx`
- [ ] **CODE**: Delete `app/leaderboard/[id]/page.tsx`
- [ ] **CODE**: Delete `app/referrals/page.tsx`
- [ ] **CODE**: Delete `app/referrals/apply/page.tsx`
- [ ] **CODE**: Delete `app/settings/page.tsx`
- [ ] **CODE**: Delete `app/notifications/page.tsx`
- [ ] **CODE**: Delete `app/dialogs-demo/page.tsx`
- [ ] **CODE**: Delete `app/docs/page.tsx`
- [ ] **CODE**: Delete `app/privy-login/page.tsx`
- [ ] **CODE**: Delete `app/test-network-display/page.tsx`
- [ ] **CODE**: Delete `app/test-utils/page.tsx`

### VERIFY Items

- [ ] **VERIFY**: TypeScript compilation clean (no import errors)
- [ ] **VERIFY**: Only 3 pages remain in `app/` (trading, launch, governance)
- [ ] **VERIFY**: No broken routes in Header navigation
- [ ] **VERIFY**: Build succeeds: `pnpm run build`

### USER Items

- [ ] **USER**: Verify `/trading` page loads correctly
- [ ] **USER**: Verify `/launch` page loads correctly
- [ ] **USER**: Verify `/governance` page loads correctly
- [ ] **USER**: Verify deleted pages return 404

---

## 2.2 Remove Unused API Routes (If Any)

### CODE Items

- [ ] **CODE**: Check `app/api/` folder for unused endpoints
- [ ] **CODE**: Delete API routes related to deleted pages (if any)
  - Portfolio API routes
  - Leaderboard API routes
  - Referrals API routes
  - Settings API routes

### VERIFY Items

- [ ] **VERIFY**: No broken API calls from remaining pages
- [ ] **VERIFY**: TypeScript compilation clean

---

## 2.3 Clean Up Components (Optional)

### CODE Items

- [ ] **CODE**: Check for components only used by deleted pages
- [ ] **CODE**: Delete unused components (if safe to remove)
  - Portfolio components
  - Leaderboard components
  - Referrals components
  - Settings components

### VERIFY Items

- [ ] **VERIFY**: No import errors in remaining pages
- [ ] **VERIFY**: Build succeeds

---

## Notes

**Pages to Keep**:
1. `/trading` - Index trading interface
2. `/launch` - Create new index
3. `/governance` - Manage indexes (will rename to `/manage-indexes` in Phase 3)

**Pages to Delete** (14 total):
- dashboard
- discover
- portfolio
- leaderboard (+ [id])
- referrals (+ apply)
- settings
- notifications
- dialogs-demo
- docs
- privy-login
- test-network-display
- test-utils

**Estimated Time**: 30 minutes

---

## Post-Completion

After completing all CODE items and self-verifying VERIFY items:

1. Report USER verification items to user
2. Wait for user approval
3. Create Work Log: `work-logs/Phase_2_Work_Log.md`
4. Update `HANDOVER.md`
5. Commit changes to git
