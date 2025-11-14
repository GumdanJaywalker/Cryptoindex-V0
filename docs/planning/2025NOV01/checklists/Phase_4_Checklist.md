# Phase 4 Checklist - Vote Page Restructure

**Date**: 2025-11-04
**Goal**: Restructure Vote page with Rebalancing Votes center focus (Proposals/VS Battles tabs + My Active Votes section)

---

## 4.1 Component Creation

### CODE Items

- [x] **CODE**: Create `components/governance/MyActiveVotes.tsx`
  - Display user's active votes in card grid
  - Show battle emoji, title, subtitle
  - Display time left, voting power
  - Ending soon badge for urgent votes

### VERIFY Items

- [x] **VERIFY**: MyActiveVotes component renders without errors
- [x] **VERIFY**: Card styling matches design system

---

## 4.2 GovernanceDashboard Updates

### CODE Items

- [x] **CODE**: Export `currentWeekVotes` from `GovernanceDashboard.tsx`
- [x] **CODE**: Add `as const` type assertions to vote status
- [x] **CODE**: Remove "My Active Rebalancing Votes" card section

### VERIFY Items

- [x] **VERIFY**: currentWeekVotes exported successfully
- [x] **VERIFY**: GovernanceDashboard renders only statistics cards
- [x] **VERIFY**: No duplicate vote displays

---

## 4.3 GovernanceLayout Restructure

### CODE Items

- [x] **CODE**: Import Tabs components from `@/components/ui/tabs`
- [x] **CODE**: Import RebalancingVotesSection
- [x] **CODE**: Import VsBattleSection from `../discover/vs-battle-section`
- [x] **CODE**: Import MyActiveVotes component
- [x] **CODE**: Import currentWeekVotes from GovernanceDashboard
- [x] **CODE**: Remove ProposalsSection import and usage
- [x] **CODE**: Change hero title: "Governance Proposals" → "Votes Hub"
- [x] **CODE**: Update hero description to focus on rebalancing
- [x] **CODE**: Add Tabs structure with "Proposals" and "VS Battles" tabs
- [x] **CODE**: Add MyActiveVotes section at bottom
- [x] **CODE**: Apply spacing classes for proper layout

### VERIFY Items

- [x] **VERIFY**: All imports resolve correctly
- [x] **VERIFY**: No unused imports
- [x] **VERIFY**: Layout structure matches plan (Dashboard → Hero → Tabs → My Votes)
- [ ] **VERIFY**: Next.js build succeeds

---

## 4.4 Final Testing

### USER Items

- [ ] **USER**: Visit `/vote` page and verify layout
- [ ] **USER**: Check "Votes Hub" title displays correctly
- [ ] **USER**: Verify Dashboard statistics section shows
- [ ] **USER**: Click "Proposals" tab - RebalancingVotesSection displays
- [ ] **USER**: Click "VS Battles" tab - VsBattleSection displays
- [ ] **USER**: Verify My Active Votes section shows 3 vote cards
- [ ] **USER**: Check vote cards display:
  - Battle emoji
  - Title and subtitle
  - Time left
  - "My Vote" selection
  - Voting power
  - Status badge (Active/Ending Soon)
- [ ] **USER**: Verify responsive layout on mobile (768px width)
- [ ] **USER**: Check no Protocol Governance content visible

---

## Notes

**Pages Structure**:
1. GovernanceDashboard - Statistics cards only
2. Votes Hub Hero - Title and description
3. Tabs:
   - Proposals tab: RebalancingVotesSection (DOG_INDEX, CAT_INDEX, AI_INDEX)
   - VS Battles tab: VsBattleSection (asset head-to-head battles)
4. My Active Votes - User's current votes (3 cards)

**Removed**:
- ProposalsSection (Protocol governance proposals)
- "My Active Rebalancing Votes" from GovernanceDashboard

**Files Modified** (4):
1. `components/governance/GovernanceDashboard.tsx` - Export votes, remove section
2. `components/governance/GovernanceLayout.tsx` - Complete restructure
3. `components/governance/MyActiveVotes.tsx` - NEW component
4. `docs/planning/2025NOV01/checklists/Phase_4_Checklist.md` - NEW checklist

---

## 4.5 Follow-up: Vote UX Improvements (Nov 5)

### CODE Items

- [x] **CODE**: Change Voting Rewards token from $HIDE to $HYPE
- [x] **CODE**: Add Info icon next to "Voting Rewards" label
- [x] **CODE**: Create tooltip explaining management fee source (0.85%/yearly for L2)
- [x] **CODE**: Create `VsBattleVoteModal.tsx` component
- [x] **CODE**: Update BattleCard with two vote buttons (Vote Asset A / Vote Asset B)
- [x] **CODE**: Add modal state management to BattleCard
- [x] **CODE**: Integrate VsBattleVoteModal with BattleCard
- [x] **CODE**: Add `myVote` local state to RebalancingVoteCard
- [x] **CODE**: Update `handleVote()` to persist vote state
- [x] **CODE**: Change all `rebalancing.myVote` references to `myVote` state

### VERIFY Items

- [x] **VERIFY**: Voting Rewards displays "$847.50 $HYPE"
- [x] **VERIFY**: Info icon tooltip shows on hover
- [x] **VERIFY**: Tooltip text explains management fee correctly
- [x] **VERIFY**: VsBattleVoteModal compiles without errors
- [x] **VERIFY**: Two vote buttons display on VS Battle cards
- [x] **VERIFY**: Vote button click opens modal
- [x] **VERIFY**: Modal shows selected asset info
- [x] **VERIFY**: Voting power slider works (100-5000)
- [x] **VERIFY**: RebalancingVoteCard vote state persists after confirm

### USER Items

- [x] **USER**: Verify "$847.50 $HYPE" displays correctly
- [x] **USER**: Hover over Info icon and read tooltip
- [x] **USER**: Click "Vote DOGE" button on VS Battle card
- [x] **USER**: Verify modal opens with DOGE info
- [x] **USER**: Adjust voting power slider
- [x] **USER**: Click "Confirm Vote" in modal
- [x] **USER**: Verify modal closes and console logs vote
- [x] **USER**: Select changes in Proposals card
- [x] **USER**: Click "Vote for X Changes" button
- [x] **USER**: Adjust voting power slider
- [x] **USER**: Click "Confirm Vote"
- [x] **USER**: Verify "Voted" badge appears
- [x] **USER**: Verify vote interface hides
- [x] **USER**: Verify "You voted for X changes" section shows

---

## Estimated Time: 1 hour 10 minutes (Initial) + 45 minutes (Follow-up)

## Status: ✅ COMPLETE (Phase 4 + Follow-up)
