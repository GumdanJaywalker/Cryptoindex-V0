# Codex Playbook — Hyperindex Frontend

Purpose: a lightweight, actionable handoff so we can resume work in seconds across sessions/agents.

## Snapshot
- App: Hyperindex — spot-based memecoin index perps exchange
- Focus: Trading UI, type-safety, and performance polish
- Tooling: Next.js 15, React 19, motion/framer-motion 12, TS 5, Tailwind

## Dev Guidelines (FE)
- Package manager: pnpm only. Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.
- Language: UI text, comments, identifiers in English; keep copy concise and neutral.
- Brand colors: use utilities defined in `app/globals.css`:
  - `text-brand`, `bg-brand`, `border-brand`, `bg-brand-hover`, `bg-brand-gradient`.
  - Default dark theme; prefer subtle gradients and minimal glow.
- UI style: Hyperliquid-like density; chart+orderbook+trading panel tri-column on desktop; reduce on tablet/mobile.
- TypeScript: strict typing; client hooks/components use DOM timer types (no `NodeJS.Timeout`).
- Imports/paths: use `@/*` alias; keep components colocated by feature.
- Package hygiene: do not add libs without need; align with shadcn/Radix, MagicUI, Tailwind.
- For full environment details, see `CLAUDE.md`.

## Current Priorities
1) Fix browser timer typings (timeouts/RAF) in client code
2) Keep TypeScript scope tight to trading while refactoring
3) Incremental cleanups in trading components (small, safe diffs)

## Governance — Implementation Plan (UI + Policy)
- Types: add `lib/types/governance.ts` for Proposal, VotingConfig, Tally, SnapshotInfo, MultisigState, TimelockInfo, UserState, ChangeSet, Option.
- State/Hooks: add `lib/store/governance-store.ts`, `hooks/use-governance.ts`, `hooks/use-snapshot-power.ts`, `hooks/use-commit-reveal.ts`, `hooks/use-timelock.ts`.
- API Stubs: `lib/api/governance.ts` with getProposals/getTally/getSnapshotPower/getTimelock/getMultisig.
- Layout: in `components/governance/GovernanceLayout.tsx` add tabs/filters for states: Active, Commit, Reveal, Queued (Timelock), Awaiting Multisig, Executed, Failed. Add policy banner (Snapshot/Quorum/Timelock/Multisig/Shielded Voting).
- Dashboard: replace mocks with hook data; show Snapshot block/time-window, Quorum progress, Pass threshold, Timelock countdown, Multisig signatures.
- Rebalancing Section: group by state, add filters and real refresh; cards consume hooks instead of hardcoded arrays.
- Rebalancing Card: add badges for Snapshot method, Quorum progress (currentPower/totalSnapshotPower), Pass Threshold; enforce commit→reveal flow when enabled; show Timelock ETA and Multisig signatures after success; guard buttons for eligibility and phase.
- Battle Section/Cards: either remove or reframe as “weight decision battles” consistent with rebalancing; surface the same policy badges.
- Voting Power Manager (new): explain snapshot methods (single, time-weighted, lock-based, multi-point, commit-reveal), show lock-based weighting UX when applicable.
- Copy/i18n: centralize governance texts in `lib/constants/governanceCopy.ts` (optional).
- Tests (light): calculate quorum/threshold, timelock ETA, snapshot eligibility; component snapshots for key phases.
- tsconfig: include new files; DOM-first typing for client hooks.

Policy notes (from business plan):
- Snapshot voting power to prevent whale attacks; optionally time-weighted or lock-based (ve) as future modes.
- Quorum as minimum participation; surface but don’t over-rely due to whale concentration risk.
- Timelock after pass; provide cancel window and review.
- Multisig M-of-N required for sensitive execution (e.g., rebalancing), then on-chain execution and audit trail.
- Optional shielded voting (Shutter/commit-reveal) to reduce early herding.

## Create Page — Index Builder (User-Created Index)
- Route: `app/create/page.tsx` (Create Index). Wizard-style flow with autosave.
- Steps (UI):
  1) Basics: name, symbol, description, category, icon.
  2) Chain/Settlement: chain fixed to L3, settlement token, fee currency.
  3) Rules: weight caps (max per asset), min-liquidity threshold, inclusion filters (no rebalance on L3).
  4) Constituents: search/select assets, assign weights under rule caps, blacklist applied.
  5) Simulation: backtest summary, slippage/liquidity checks, gas/bridging estimate.
  6) Review & Submit: summary, risk warnings, submit for governance.
- Components:
  - `components/create/IndexBuilderWizard.tsx`: orchestrates steps.
  - `components/create/AssetPicker.tsx`: multi-chain asset selector with liquidity/price info.
  - `components/create/WeightTable.tsx`: weights with validation, sum=100%, caps.
  - `components/create/RuleEditor.tsx`: rebalancing rules and constraints.
  - `components/create/BacktestPreview.tsx`: simple mock charts first; pluggable data source later.
  - `components/create/DeployPanel.tsx`: shows deployment plan, fees, confirmations.
- Hooks/APIs:
  - `hooks/use-index-builder.ts`: local state with schema validation (zod), autosave to localStorage.
  - `lib/api/indexes.ts` (stubs): resolve assets, quote mint/redeem, simulate rebalance; later connect to onchain/AP.
- Backend-owned touchpoints (not FE scope):
  - Token Creation/Redemption (AP), mint/redeem quotes, basket validation.
  - Multi-chain messaging/settlement (LayerZero), wallet infra.
  - FE only prepares spec and displays statuses returned by APIs.
- Governance interplay (FE scope):
  - “Request Governance Review” to send the built spec to backend; FE tracks proposal status via governance hooks.
  - No direct deploy UX on FE; show read-only status (Queued/Timelock/Awaiting Multisig/Executed) from API.

MVP scope (frontend-only):
- Full wizard UX with strict validation, local persistence, simple mock sim (optional).
- No onchain deploy or chain messaging in FE.
- Provide JSON export of index spec and a "Request Governance Review" action only.

## Create — Progress Snapshot
- Completed:
  - Route `/create` + header link
  - Wizard steps and per-step validation with blocked navigation on errors
  - Autosave UX: “Saving…” → “Saved 1m ago” (relative time + tooltip)
  - Basics: category select with “Other” custom input
  - Chain fixed to L3 (read-only), settlement/fee token selects (USDC/USDT)
  - Constituents: modal AssetPicker (search, scrolling, sorting by volume/return/liquidity/symbol), filters (hide low liq, exclude blacklist, positive return only), “Selected N” counter, Clear all
  - WeightTable: 1% step select per asset, hard cap by remaining %, Normalize/Distribute equally, per-asset remove (X)
  - Review: human-readable summary, error list, “Go to first error” + section “Edit” buttons, submit disabled until valid
  - Creator overview/earnings cards (mock)
- Next (to finish Create MVP):
  - Micro feedback on actions (Normalize/Distribute): brief “All set ✓” confirmation
  - Submit stub: POST to backend endpoint with spec; success/failure toast
  - Modal filter: “Selected only” toggle
- Later (optional polish):
  - Virtualized list for very large catalogs
  - Backend blacklist integration (disable with reason)
  - Simple simulation cards (mock backtest/liquidity checks)

## Governance — Progress Snapshot (2025-09-04)
- Foundation:
  - Types: `lib/types/governance.ts` (Proposal, phases, snapshot/quorum/timelock/multisig/shielded)
  - Store: `lib/store/governance-store.ts` (Zustand load/getById)
  - API stubs: `lib/api/governance.ts` → `getProposals()`, `submitIndexSpec()`
  - Hook: `hooks/use-governance.ts` (quorumReached, supportPercent, passReached, timeLeft)
- UI (policy-first, new components):
  - `components/governance/ProposalsSection.tsx`: filterable list (All/Active/Ending Soon/Queued/Awaiting Multisig/Executed)
  - `components/governance/ProposalCard.tsx`: Snapshot badge, Quorum/Support bars, Time-left, Changes, Multisig progress; action tooltips by phase (commit/reveal/timelock/multisig/active)
  - Layout: `GovernanceLayout` now renders ProposalsSection + policy caption
  - Dashboard: policy summary cards (Snapshot modes, Quorum range, Timelock, Multisig)
- Policy decision: Snapshot method = Time‑Weighted only
  - Rationale: strong manipulation resistance, low liquidity constraint, medium implementation
  - Scope change: lock‑based / sliding window / commit‑reveal / multi‑point are out of scope for MVP
  - UI: show “Snapshot: Time‑Weighted”; do not surface other modes in badges or copy
  - Data: proposals will use `snapshot.method = 'time-weighted'`

### Snapshot Method — Finalized for MVP
- Time‑weighted (only): high manipulation resistance; medium long‑term incentive; medium implementation; low liquidity constraint

Notes
- Other methods (lock‑based, sliding window, commit‑reveal, multi‑point) are excluded from MVP and must not be exposed in UI.

## 2025-09-04 — Status and Next
- Done today:
  - Create: rules-before-assets reordering, L3 fixed chain; modal AssetPicker with search/sort/filters; global blacklist UX; WeightTable with 1% caps; micro feedback; virtualized grid; submit stub + toasts; hydration-safe draft loading.
  - Governance: types/store/hook/API stubs; proposals section/cards with policy badges; dashboard policy summary; time‑weighted snapshot finalized; detail page `/governance/[id]` with quorum/support/time/changes/timelock/multisig; timelock countdown + urgency; voter breakdown (percent + absolute) + tooltips; list/card “Queued soon” badge; list/time urgency color.
- Next (short term):
  - Governance actions (UI):
    - Gating by `user.eligible` and phase; enrich tooltips with snapshot/quorum reasons (time‑weighted only)
    - Timelock ETA countdown and queue/execute (disabled states + copy)
    - Multisig signer UI (list of signers, “You are signer” cue), badge coloring by progress
  - Proposal details route: `/governance/[id]` with full policy timeline and vote breakdown (time‑weighted)
  - Replace/retire legacy battle UI; if retained, reframe as “weight decision” under rebalancing policy
- Later (integration):
  - Hook API wiring to real backend/indexer; snapshot power endpoint; timelock/multisig status
  - (Removed) Shielded voting flows (commit/reveal) — not in MVP
  - Lightweight tests for helpers (quorum/support/timeLeft)

## Dev Plan Update — Time‑Weighted Only (MVP)
- UI/Copy
  - Snapshot badge and captions: always “Snapshot: Time‑Weighted”
  - Remove/hide any references to lock‑based/sliding/commit‑reveal/multi‑point
- Data/Mocks
  - Update all proposal stubs to `snapshot.method = 'time-weighted'`
  - Remove commit/reveal phases from samples; use `active/queued/timelocked/awaiting-multisig/executed`
- Code Simplification (post‑MVP polish)
  - Narrow `SnapshotMethod` union to `'time-weighted'` or keep others behind comments
  - Simplify `snapshotLabel` helpers and UI branches
  - Ensure eligibility/tooltips reference time‑weighted rules only

## Resume Checklist — Governance (next agent)
- Environment
  - Run dev: `pnpm dev` → visit `/governance` and `/governance/[id]`
  - Data source: mock via `lib/api/governance.ts` (`getProposals`, time‑weighted only)
- Immediate next tasks (priority)
  1) Actions stubs: wire disabled button handlers with standardized toasts
     - Vote (active, eligible) → toast “Voting UI not implemented (MVP scope)”
     - Execute (after timelock) → toast with timelock reason
     - Sign (awaiting multisig) → toast “Signer only”
  2) Detail polish
     - Timelock urgency color thresholds: current 24h/6h; add 1h “critical” if needed
     - Add absolute power labels to list card (optional compact tooltip)
  3) Replace/retire legacy battle UI
     - Remove or reframe as “weight decision” under rebalancing; do not expose outside rebalancing policy
- Integration prep
  - Define API contracts: snapshot power (time‑weighted), tallies, timelock, multisig signer set
  - Error/empty states: add fallbacks in list/detail when API errors or returns 0 items

## Resume Checklist — Create
- Validation checklist card on Review (required fields summary)
- Normalize messages/toasts (success/failure) and align copy
- Keep: AssetPicker virtual grid, global blacklist, 1% caps, hydration‑safe drafts

## Quick File Map
- Governance types: `lib/types/governance.ts`
- Governance API stubs: `lib/api/governance.ts`
- Store: `lib/store/governance-store.ts`
- Hook: `hooks/use-governance.ts`
- List: `components/governance/ProposalsSection.tsx`
- Card: `components/governance/ProposalCard.tsx`
- Dashboard: `components/governance/GovernanceDashboard.tsx`
- Detail: `app/governance/[id]/page.tsx`

## Alignment Review — Plan vs Current Repo
- Governance:
  - Current: mock UI, no snapshot/quorum/timelock/multisig/commit-reveal.
  - Action: implement plan above; reframe or remove winner-takes-all “Battle”.
- Create Page:
  - Current: no `/create` route or builder components.
  - Action: add Create wizard (steps/components/hooks), link from header/nav.
- Token Creation/Redemption (AP):
  - Current: not represented in UI.
  - Action: add stubs in `lib/api/indexes.ts`, surface quotes in Create wizard (mock first).
- Multi-chain & Messaging:
  - Current: not surfaced; wallet integration (Privy) exists.
  - Action: add chain selector and chain-specific asset catalogs in builder; plan LayerZero integration behind API.
- Marketing/Rewards (from doc):
  - Current: governance dashboard shows generic rewards; no referral/partner UI.
  - Action: keep out-of-scope for now; note future routes for referral and partner dashboards.

## Next Actions (concise)
- Add governance types/store/hooks + replace mock arrays in governance components.
- Add Create wizard route and scaffolding with validation and mock data.
- Wire governance policy badges and state gates into cards and dashboard.
- Keep tsconfig scoped and DOM-typed for new hooks/components.

## Task Board
- Task 1 — Timer typings in client code
  - Why: Using `NodeJS.Timeout` in browser code causes type friction with DOM timers.
  - Pattern to use (browser-safe):
    - `const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)`
    - Guard before use: `if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)`
    - Assign: `timeoutRef.current = setTimeout(() => { ... }, delay)`
    - Cleanup: `if (timeoutRef.current !== null) { clearTimeout(timeoutRef.current); timeoutRef.current = null }`
    - For RAF: `const rafRef = useRef<number | null>(null)` and `cancelAnimationFrame(rafRef.current)` with null-guards.
  - Files to update (search: `useRef<NodeJS.Timeout`):
    - lib/animations/micro-interactions.tsx
    - hooks/use-realtime.ts (reconnect timeout)
    - hooks/use-gestures.ts (long-press, double-tap)
    - lib/hooks/use-performance.ts (debounce/throttle)
    - components/magicui/particles.tsx (resize timeout)
    - components/ui/placeholders-and-vanish-input.tsx (interval)
    - components/ui/compare.tsx (autoplay)

- Task 2 — TS scope stays focused (already mostly done)
  - tsconfig.json is trimmed to trading and core UI; keep it that way during refactor.
  - If DOM vs Node types conflict, prefer DOM. Only add Node types where truly needed (server/middleware).

- Task 3 — Small trading UI hygiene
  - Ensure strict equality checks and explicit variant types.
  - Verify exports/imports for `TraderCard` and usage inside `TopTraders`.
  - Keep animated values typed (`number` vs `string`) and cast intentionally only at boundaries.

## Concrete Next Steps (order of execution)
1) Implement Task 1 timer typing pattern in all listed files
   - Commit message: "fix(typings): use DOM-safe timer refs"
2) Run TS check
   - `pnpm exec tsc --noEmit -p tsconfig.json`
   - If long, pipe: `| sed -n '1,200p'`
3) Address any remaining trading-scope TS errors (one file at a time)
4) Quick UI sanity in dev (optional)
   - `pnpm dev` and check Trading pages render without console errors

## Coding Notes
- This is a client-first codebase: default to DOM timer types;
  avoid `NodeJS.Timeout` in React components/hooks rendered in the browser.
- `lib` contains mixed client/server utilities; prefer colocating server-only types under clearly excluded paths or add file-level `// server-only` with separate typings if necessary.
- For small effects using timers/RAF, always clear on unmount to avoid leaks.

## tsc Scope (current)
- tsconfig.json includes trading app/components and key UI libs.
- Excludes experimental/duplicate files, demos, middleware, and API during this refactor.

## Quick References
- Trading card: `components/trading/trader-card.tsx`
- Top traders: `components/trading/top-traders.tsx`
- Animations: `lib/animations/micro-interactions.tsx`
- Store: `lib/store/trading-store.ts`

## Resume Checklist
- Run `pnpm exec tsc --noEmit -p tsconfig.json`
- Start at the topmost timer-typing error → apply the pattern
- Re-run tsc, repeat until clean for trading scope
- Move to Task 3 hygiene items as time allows

## Session Notes
- If another agent picks up: start at Task 1 (file list above). Keep diffs small and re-run tsc between files. If new TS errors appear outside the current scope, prefer expanding excludes rather than widening the refactor in this pass.
