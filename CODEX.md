# Codex Playbook — Hyperindex Frontend

Purpose: a lightweight, actionable handoff so we can resume work in seconds across sessions/agents.

## Snapshot
- App: Hyperindex — spot-based memecoin index perps exchange
- Focus: Trading UI, type-safety, and performance polish
- Tooling: Next.js 15, React 19, motion/framer-motion 12, TS 5, Tailwind

## Landing — Current Status (2025-09)
- Hero: minimal CTA-only (no headline/subtext), primary “Start Trading” + secondary “View Indices”.
- KPI strip: Daily Volume, TVL, Active Indices, Top Gainer (mockMarketStats).
- Trending Indices: table layout with symbol/name, price, 24h%, volume, mcap, actions; deterministic thumbnails via picsum seed.
- Top Traders (landing): hybrid layout — podium (🥇/🥈/🥉 cards) + ranked list from #4; 24H focus; index chips deep-link to `/trading?index=...`.
- Traders page: same podium on page 1 + paginated table; filters/sort/search; mockTopTraders length expanded to 80.
- Governance: copy simplified to time‑weighted snapshot and operator signatures 4/4; commit/reveal removed; badges/filters have tooltips.
- Portfolio: Creator Earnings tab added (summary, per-index, payouts; policy copy states creator/influencer‑only).
- Bugfix: React Hooks order in governance detail stabilized.

## Recent Changes — Sep 2025
- Landing
  - Hero: headline/subtext removed; CTAs: Start Trading, Create Index, View Indices.
  - KPI strip (Daily Volume, TVL, Active Indices, Top Gainer); numbers from `mockMarketStats`.
  - Layout: three panels with internal scroll (sidebar/indices/top traders), sidebar right divider, unified +/- colors (green/red), removed sidebar search and Portfolio’s Start Trading button.
- Top Traders
  - Landing: podium (1/2/3) + rich two‑line rows from #4; 24H ROI/$PnL; index chips → `/trading?index=...`; removed crown icon.
  - Traders page: same podium on page 1; table converted to rich rows; rank numbering fixed (continues from #4 on page 1, page‑aware otherwise); mock trader count → 80.
- Trending Indices
  - Deterministic thumbnails via picsum seed; Quick View modal (IndexDetailModal) + Trade button in actions.
- Governance
  - Time‑weighted snapshot + Operator 4/4 copy; removed commit/reveal; badges/tooltips aligned.
- Earnings
  - Portfolio CreatorEarnings: added Creator Fee vs LP Fee breakdown card (mock split).
  - Create Index overview: Earnings split into Creator Fee and LP Fee (accrued/projected slots).
- Referrals
  - New `/referrals` route with Influencer/KOLs vs Individual tabs, tier label (Partner 0/Individual 0), referral code/link copy, metrics and earnings breakdown.
- Infra/UX
  - Link fixes for “View Leaderboard”; background effects set to `pointer-events-none`; Vercel Preview env guidance.

## Recent Changes — Sep 2025 (this session)
- Accessibility/Perf
  - Added hidden DialogTitle to IndexDetail modal and Command dialog (Radix requirement).
  - Global focus-ring normalization and prefers‑reduced‑motion; dialog overlay tone adjusted (brand‑tinted, no blur).
- Landing/Trending
  - Virtualized Trending list (large catalogs) with sticky table header; card‑internal scroll with fixed height.
  - Moved Start Trading / Create Index / View Indices CTAs next to Search; removed center hero CTAs and center KPI strip.
  - Switched thumbnails to next/image (lazy + async decode); hover/focus polish; aria labels; initial measure fixed via ResizeObserver.
- Top Traders
  - Removed crown icon from Traders page title; removed "Last updated" line; home compact block shows top 7 and lifted slightly.
- Sidebar
  - Added mock NetworkStatusWidget (latency/chain/block height).
- Stability
  - React Query provider made SSR‑safe (singleton; no client hooks in provider) to avoid runtime error.

### Additional Updates (this session continuation)
- Trending
  - Favorites system: star toggle per row; Favorites filter; favorites-first ordering in lists; Trade button always visible.
  - Row hover affordance simplified; grid minmax gutters adjusted; NEW/HOT badges deduped to name line.
- Top Traders (landing)
  - Replaced podium with thick rows for ranks 1–3; kept 4–7 as compact rows; medal badges restored; strong separator between 3 and 4; win/followers aligned to line 2; reduced right column width ~5%.
- Referrals
  - Removed invite-only copy and policy badge; unified into single view with auto tier (Individual by default, Influencer if approved); added Apply page (/referrals/apply).
  - Added 14d mock timeseries (clicks/signups/volume) with mini charts; CSV export button.
- Portfolio Tone
  - Neutralized color usage across AccountSummary, TradingAnalytics, Positions, VotingPowerManager (slate tone; softer greens/reds for PnL only).
  - Monthly Performance chart fixed (height context) and bars thinned to 20% width; positive=green, negative=red.
  - Overview top badges: added Creator Fees / LP Fees summary.
- PnL Card Generator
  - Branded period tabs, stepper, primary buttons, header icon/badge to mint; social share buttons unified to brand mint.

## Session Summary — 2025-09-13
- Trending
  - 즐겨찾기(별) 토글/필터/우선정렬(favorites‑first) 추가, Trade 버튼 상시 노출, 배지/호버/그리드 정리
- Top Traders (랜딩)
  - 포디움 제거 → 1–3위 두꺼운 행, 4–7위 컴팩트 유지, 메달/구분선/Win·Followers 정렬, 우측 컬럼 ~5% 축소
- Referrals
  - 초대제 문구/정책 배지 제거, 단일 화면(자동 티어), /referrals/apply 신청 페이지, 14일 차트+CSV Export, 수익 분포는 Portfolio/Creator로 분리
- Portfolio 톤/그래프
  - 중립 톤 통일(AccountSummary/Analytics/Positions/Voting), Monthly Performance 그래프 수정(막대 20%, ±색), Overview에 Creator/LP 배지 추가
- PnL Card Generator
  - 기간 탭/버튼/스텝/헤더/배지/소셜 버튼 브랜드 민트화
- Create
  - 썸네일 이미지(업로드/URL) + 미리보기, Overview에 프리뷰 표시
- Settings
  - /settings 라우트 및 섹션 스켈레톤(Profile/Preferences/Notifications/Security/Connections/API Keys/Danger Zone) + 헤더 연결
- Header
  - Analytics 제거, API Docs 비활성(coming soon)
- Governance
  - FE 헬퍼 모듈(quorum/support/pass/timeLeft) 분리, BE 연동 플랜 문서화

## Backlog — Next Tasks Snapshot (KOR)
- Trending: 즐겨찾기 우선 토글 고도화, HOT/NEW 정렬 규칙(backend createdAt/heat score 반영), Graduation 배지+듀얼 진행률 툴팁
- Top Traders: 컴팩트 행 개수 튜닝(예: 상위 10), 숫자 포맷 정리, (옵션) 즐겨찾기
- Referrals: Auto‑tier 산식/상태, 신청 검증/진행, utm 소스 집계, 기간 스위처
- Portfolio: Overview 마이크로카피/여백, Positions 칩 UX/카피, Analytics 범례·툴팁·스냅샷, Voting tips, CreatorEarnings 드릴다운/지급, Liquidity 탭+모달(백로그)
- PnL Cards: 템플릿 대비/가독성, 내보내기 옵션(PNG 품질/세이프존), 갤러리 영속/퀵쉐어, 카피 프리셋
- Governance: 목록/상세/스냅샷/탤리/타임락/멀티시그 연동, 에러/빈 상태, 헬퍼 테스트
- Create: 액션 마이크로 피드백, 제출 스텁 토스트/에러, AssetPicker ‘Selected only’, 썸네일 검증 강화, (옵션) 대용량 가상화
- QA/A11y/Perf: 키보드 내비, reduced‑motion, Lighthouse ≥90, aria/DialogTitle
- Settings: 카피/검증, 비밀번호 강도, 설정 영속화(mock→API)
- Docs/Analytics: API Docs 보류(헤더 비활성), Analytics 제거(필요 시 skeleton)
- L3 가상 AMM+Graduation: 데이터 모델 확장, GraduationProgress 컴포넌트(InfoBar/Detail/Trending), 트레이딩 카피, 상태 타임라인 UI

## Dev Guidelines (FE)
- Package manager: pnpm only. Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.
- Language: UI text, comments, identifiers in English; keep copy concise and neutral.
- Communication (agents): When replying in Korean, always use polite/formal speech (존댓말). Avoid casual/informal tone.
- Brand colors (updated)
  - Primary (soft mint): `#98FCE4`
  - Background/dark teal (near‑black): `#072723`
  - Light mint‑gray (neutrals): `#D7EAE8`
  - Use utilities defined in `app/globals.css` (`text-brand`, `bg-brand`, `border-brand`, `bg-brand-hover`, `bg-brand-gradient`). Keep the default dark theme; prefer subtle gradients and minimal glow.
- UI style: Hyperliquid-like density; chart+orderbook+trading panel tri-column on desktop; reduce on tablet/mobile.
- TypeScript: strict typing; client hooks/components use DOM timer types (no `NodeJS.Timeout`).
- Imports/paths: use `@/*` alias; keep components colocated by feature.
- Package hygiene: do not add libs without need; align with shadcn/Radix, MagicUI, Tailwind.
- For full environment details, see `CLAUDE.md`.

## Current Priorities
1) Trending polish (badges: NEW/HOT; hover affordances; minmax grid gutters)
2) Top Traders polish (virtualization, skeletons, number formatting)
3) Referrals polish (metrics granularity; creator whitelist states; link analytics)
4) Earnings split surfacing (Creator vs LP)
5) Mobile pass (moved later)

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
- Next (short term — feature only):
  - Backend integration
    - Wire list/detail to real endpoints
    - Snapshot power (time‑weighted) endpoint for eligibility/voting power
    - Tallies/timelock/multisig polling or SSE
  - Tests (helpers)
    - quorum/support/timeLeft calculations
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

### Governance — Backend Integration Plan (FE/BE 계약)
- API contracts (권장)
  - GET `/api/governance/proposals` → 목록 (요약 필드 포함)
  - GET `/api/governance/proposals/:id` → 상세 (변경셋/타임라인 포함)
  - GET `/api/governance/proposals/:id/tally`
  - GET `/api/governance/proposals/:id/timelock`
  - GET `/api/governance/proposals/:id/multisig`
  - GET `/api/governance/proposals/:id/snapshot-power?address=0x...`
- 필수 데이터(서버 권위)
  - `phase`: `'active'|'queued'|'timelocked'|'awaiting-multisig'|'executed'|'defeated'|'canceled'` 등
  - `endsAt`(epoch ms), `config { snapshot.method='time-weighted', quorumPercent, passThresholdPercent, timelockSeconds?, multisig? }`
  - `tally { forPower, againstPower, abstainPower, totalSnapshotPower }`
  - `timelock { eta? }`, `multisig { m, n, signed[] }`
  - `user { eligible, votingPowerAtSnapshot }` (선택)
- 선택(권장) 파생 필드(서버 계산 시 FE가 우선 사용)
  - `quorumReached: boolean`
  - `supportPercent: number` (표준 라운딩 적용)
  - `passReached: boolean`
  - `timeLeftMs: number` (남은 밀리초; FE에서 문자열 포맷)
- FE 헬퍼 폴백 전략
  - 위 파생 필드가 없을 경우 FE는 다음 헬퍼로 동일 계산 수행:
    - `quorumReached(p)`: `(for+against+abstain)/totalSnapshotPower >= quorum%`
    - `supportPercent(p)`: `for/(for+against)`
    - `passReached(p)`: `supportPercent >= passThreshold%`
    - `timeLeft(p)`: `endsAt-now` 포맷(d/h/m)
  - 모든 경계 케이스 방어(분모 0→0, totalSnapshot=0→정족수 미달 등)
- 표기 규칙(일관성)
  - 퍼센트 라운딩: 소수 1자리 (예: 62.3%)
  - 시간 표기: `1d 2h` / `3h 15m` / `12m`
  - 스냅샷/카피: MVP는 `time-weighted`만 노출(다른 모드 UI/카피 제외)
- 에러/빈 상태
  - 목록/상세 모두 로딩/빈/에러 뷰 제공, 네트워크/권한 오류 메시지 통일

## Policy Update — Multisig (Operator‑Only, 4/4)
- Execution is gated by operator signatures, not a public multisig threshold.
- Exactly 4 of 4 operator signatures are required to execute rebalancing.
- UI Changes:
  - Replace generic “Multisig M‑of‑N” with “Operator signatures 4/4 required”.
  - Action tooltips: “Operator‑only” for non‑signers.
  - Detail view highlights “You are signer” for connected operator addresses.
- Data/Mocks:
  - Set `config.multisig = { m: 4, n: 4 }` in all proposals; adjust `multisig.signed` accordingly.

## Resume Checklist — Governance (next agent)
- Environment
  - Run dev: `pnpm dev` → visit `/governance` and `/governance/[id]`
  - Data source: mock via `lib/api/governance.ts` (`getProposals`, time‑weighted only)
- Immediate next tasks (priority)
  1) Backend integration (replace mocks)
     - GET `/api/governance/proposals` (list)
     - GET `/api/governance/proposals/:id` (detail)
     - GET `/api/governance/proposals/:id/tally`
     - GET `/api/governance/proposals/:id/snapshot-power?address=0x...`
     - GET `/api/governance/proposals/:id/timelock`
     - GET `/api/governance/proposals/:id/multisig`
  2) Error/empty states
     - Verify list/detail fallbacks with real endpoints
- Integration prep
  - Define API contracts: snapshot power (time‑weighted), tallies, timelock, multisig signer set
  - Error/empty states: add fallbacks in list/detail when API errors or returns 0 items

## Resume Checklist — Create
- Validation checklist card on Review (required fields summary)
- Normalize messages/toasts (success/failure) and align copy
- Keep: AssetPicker virtual grid, global blacklist, 1% caps, hydration‑safe drafts

## Next Tasks (Queue)
- CTA: add “Create Index” next to “Start Trading” in hero.
- Sidebar: remove “Start Trading” button from Portfolio card.
- Scroll/structure: make sidebar, indices, and top traders scrollable within their panels; add a single divider to visually separate sidebar.
- Trending: add NEW/HOT badges, quick view + trade hover actions; minmax grid to avoid uneven gutters.
- Top Traders (list): convert table rows to two‑line rich rows with index chips and 24H $PnL; keep ranking from #4.
- QA: Lighthouse 90+ for performance and accessibility; consistent microcopy (English, concise, neutral).

- Trending
  - Add toolbar toggle: Favorites‑first on/off
  - Refine HOT/NEW sort rules (use createdAt/heat score when backend available)

- Portfolio — Liquidity (Backlog)
  - Add Liquidity tab to Portfolio (my shares/APR/fees; Add/Remove forms; quote + risk note).
  - Provide Liquidity entry in index detail/trading via modal (quick add/remove).

### L3 Virtual AMM + Graduation (New)
- Launch Mode (L3 only)
  - Trade on virtual AMM (bonding curve) at L3; no real AMM pool created initially.
  - Disable LP actions until graduation; show “Launch (L3, bonding curve)” pill in IndexInfoBar.
- Dual Progress (parallel)
  - Liquidity goal: target amount for pool bootstrapping (e.g., $X to graduate).
  - Sales goal: token sold vs bonding‑curve exit threshold.
  - UI: “Graduation Progress” block with two progress bars + tooltips; surface in Index Detail, Trading InfoBar, and Trending row badge.
- Graduation State
  - When BOTH goals reached → trigger graduation path (L2 pool creation); switch index layer to L2.
  - Status timeline: Launching → Recruiting Liquidity → Near Graduation → Graduated (L2).
- Data/Mocks
  - Extend MemeIndex with launch/graduation fields:
    - `launch: { mode: 'virtual-amm', liquidityTargetUsd: number, liquidityRaisedUsd: number, salesExitThreshold: number, soldAmount: number, status: 'launching'|'recruiting'|'near-graduation'|'graduated' }`
  - Mock updates in `lib/data/mock-indices.ts` for a subset of indices.
- Trading Behavior (UI copy)
  - Price source: bonding curve; display indicative slippage/impact; warn about virtual fills.
  - After graduation, price/liq source flips to L2 pool.
- Components (skeletons)
  - `components/trading/GraduationProgress.tsx` (compact bar for InfoBar + full block for Detail)
  - Integrate into `index-detail-modal` and `IndexInfoBar` (or equivalent)
  - Trending row badge: “Graduation n%” with hover details

### HOOATS, NAV/Price, and Risk (from Biz Doc)
- HOOATS Routing Indicator
  - Show when Hybrid router used (AMM fill vs Orderbook slice); tiny badges in Trade Panel
  - Copy: “Route: AMM | OB | Mixed” with hover details (slippage/impact est.)
- NAV vs Market Price (Primary/Secondary)
  - Add NAV line to IndexInfoBar; highlight divergence and show “Arb opportunity” banner when thresholds exceeded
  - Hook to mock arbitrage vault copy; later wire to vault status
- Risk Scoring Badges
  - Per-index risk badge (L1/L2 curated, L3 playground); tooltip with factors (top holders/dev/sniper/LP-burned/etc.)
  - Detail page: simple table of components with score buckets (mock)
- Data Model Extensions
  - `MemeIndex`: `risk: { tier: 'L1'|'L2'|'L3', score?: number, factors?: string[] }`, `nav?: number`, `pricing: { source: 'bonding-curve'|'pool', route?: 'amm'|'ob'|'mixed' }`

## Backlog — Settings / Docs / Analytics
- Settings (in progress)
  - Added: `app/settings` route with left-rail tabs
  - Added sections (skeletons): Profile, Preferences, Notifications, Security, Connections, API Keys, Danger Zone
  - Mock save toasts wired; refine copy/validation later
- API Docs (on hold)
  - Keep header item disabled; prepare skeleton later if scope confirmed
- Analytics (removed from header for beta)
  - If needed later: app/analytics + KPIs/Trends/Tables skeleton with mock data

- Referrals Page
  - Single page with user‑type switch: Influencer/KOLs vs Individual.
  - Show referral tier text (e.g., “Partner 0” / “Individual 0”), referral code/links, basic metrics.
  - No public program UI; only for approved creators per business policy.

- Earnings Integration (Creator Fee & LP Fee)
  - Portfolio and Create flows: clearly separate “Creator Fee” (index token fees share) and “LP Fee” (liquidity pool trading fees).
  - Use mock data first; align with spreadsheet model.
  - Reference: HyperIndex-Revenue Expense Calculator.xlsx (local path).

- Create — Builder Enhancements
  - Add thumbnail image selector for index (upload or URL) with live preview and validation (size/type/ratio)

## Work Queue — Concrete Next Steps
- Sidebar polish
  - Adjust scrollbar styles, overscroll‑behavior, and spacing for smoother chained scroll on desktop/mobile.
- Trending
  - Add NEW/HOT badges on rows; hover actions on entire row (Quick View/Trade) with non‑janky transitions.
  - Ensure minmax grid to avoid uneven gutters at xl/2xl.
  - (Done) Virtualized list; sticky header; card‑internal scroll (fixed height); CTAs moved next to Search; removed center hero CTAs and KPI strip; next/image thumbs; ResizeObserver fix.
- Landing Quick View (modal) — Fixes
  - (Done) Scroll position: lock body scroll when modal opens; preserve/restore scroll position; avoid initial offset rendering.
  - (Done) Overlay tone: subtle brand‑tinted overlay (opacity ~0.5), no blur.
  - (Done) Close behavior: closing X/overlay does not trigger underlying row or navigate away; row click disabled while open.
- Top Traders
  - Landing/Traders: add skeletons for podium/list; ensure consistent number formatting; mobile card tweaks.
  - (Done) Remove crown icon in Traders title; remove "Last updated"; show top 7 on home; lift block slightly.
- Referrals
  - Add header nav link (done); add basic analytics (clicks/signups) charts (mock) and export CSV (mock).
- Earnings
  - Wire to API/spreadsheet model; expose Creator/LP fees per index, per timeframe in Portfolio/Create.
- QA/A11y/Perf
  - Lighthouse ≥90, keyboard nav across modals/tabs, prefers‑reduced‑motion, next/image where applicable.

- Sidebar — Network Status Widget
  - Add compact network indicator (RPC latency, chain status, block height) to sidebar.
  - Update periodically; degrade gracefully on failure; minimal footprint.

- Trading — IndexInfoBar Gas Fees
  - (Done, mock) Surface indicative gas fees in IndexInfoBar (aligned block style, no icon); wire to provider/gas oracle later.

## Notes
- Communication: when replying in Korean, always use polite/formal speech (존댓말). Avoid casual/informal tone.

## Quick File Map
- Governance types: `lib/types/governance.ts`
- Governance API stubs: `lib/api/governance.ts`
- Store: `lib/store/governance-store.ts`
- Hook: `hooks/use-governance.ts`
- List: `components/governance/ProposalsSection.tsx`
- Card: `components/governance/ProposalCard.tsx`
- Dashboard: `components/governance/GovernanceDashboard.tsx`
- Detail: `app/governance/[id]/page.tsx`

## API Contracts (Draft) — For Backend Integration

- GET `/api/governance/proposals`
  - Returns: `Proposal[]` (see `lib/types/governance.ts`)
  - Each item should include minimal tally snapshot for list (for/against/abstain, totalSnapshotPower) and phase/config.

- GET `/api/governance/proposals/:id`
  - Returns: full `Proposal` with `tally`, `config`, `timelock`, `multisig`, `user`.

- GET `/api/governance/proposals/:id/tally`
  - Returns: `{ forPower: number; againstPower: number; abstainPower: number; totalSnapshotPower: number }`
  - Time‑weighted snapshot is applied server‑side. FE does not compute.

- GET `/api/governance/proposals/:id/snapshot-power?address=0x...`
  - Returns: `{ eligible: boolean; votingPowerAtSnapshot: number }`

- GET `/api/governance/proposals/:id/timelock`
  - Returns: `{ queuedAt?: number; eta?: number }` (ms epoch)

- GET `/api/governance/proposals/:id/multisig`
  - Returns: `{ required: number; total: number; signed: string[] }`
  - Policy: operator‑only 4/4 (required=4,total=4). FE shows operator list via static set or from API.

- POST (backend‑only, FE disabled in MVP)
  - `/api/governance/proposals/:id/vote` → body `{ optionIds?: string[] }` (time‑weighted power applied server‑side)
  - `/api/governance/proposals/:id/queue` → queues timelock if succeeded
  - `/api/governance/proposals/:id/execute` → executes after timelock + 4/4 signatures
  - `/api/governance/proposals/:id/sign` → operator signature endpoint
  - Response: `{ ok: true }` or `{ ok: false, error: string }`

Notes
- All numbers are integers in base units. FE formats via `toLocaleString()`.
- Time‑weighted snapshot: definition/version should be included in responses if relevant (e.g., window start/end).
- SSE or polling cadence is acceptable; FE expects eventual consistency on tally/ timelock/ multisig.

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
