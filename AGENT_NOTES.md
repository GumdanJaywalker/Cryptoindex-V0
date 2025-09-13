 # Agent Notes
 
 ## Repo Recon Summary
 - Core modules: `hooats-core/` (orderbook, router, async settlement queue), `app/api/...` (Next.js routes for health/metrics/benchmark), `scripts/`, `contracts/` (to add), `supabase/migrations/`.
 - Matching engine: `hooats-core/ultra-performance-orderbook-converted.js` with Redis + Lua and `processOrderUltraFast` entrypoint.
 - Routing/AMM hooks: `hooats-core/hybrid-router-real.js` (real chain hooks; AMM used for price continuity, not settlement).
 - Queueing: `hooats-core/async-settlement-queue.js` maintains priority queues and settlement result keys in Redis.
 
 ## Goals vs Current Implementation
 - Target off-chain TPS ≥15–20k (goal 30k+) using Redis+Lua; engine already exposes atomic fast path and batching; needs rigorous regression/perf tests and WAL/snapshot.
 - Settlement must be wallet-to-wallet on-chain via batch contract (v1b). Current queue simulates AMM settlement; we will replace with a batch-settlement orchestrator + contract.
 - MEV/Sequencer: single sequencer risk remains; add leader election (Redlock), fencing, commit-delay, per-order minReceive.
 - Observability exists via `/api/monitoring/metrics` and Redis status; expand metrics for queue depth, batch size, retries.
 
 ## Integration Points
 - Enqueue point: `RealOrderbookEngine.queueSettlement(trade)` → route into orchestrator (Redis Streams) that builds batches for the contract.
 - Router boundary: AMM price fills until best-quote boundary, then switch to orderbook liquidity (off-chain). Unified legs go to settlement.
 - API & UI: expose order and settlement state transitions (matched → enqueued → submitted → confirmed/failed).
 
 ## External References (pending approval to fetch)
 - Off-chain orderbook: Vertex Protocol design/queueing/recovery.
 - AMM pricing: Uniswap v3, PancakeSwap, Raydium impact/quoting.
 - Session keys: Hyperliquid session key lifecycle and limits.
 
 ## Cleanup Plan (non-destructive proposal)
 - Candidates to archive: `hooats-deprecated/`, `hooats-experimental/`, `contracts_backup/`, `old_scripts/`, `old_versions_backup_20250819/`, stale docs in `documents/`.
 - Approach: move to `archive/` with date stamp; augment `.gitignore` for build artifacts (`.next/`, `cache/`, `artifacts/`).
 - Action: awaiting approval before moving files.

