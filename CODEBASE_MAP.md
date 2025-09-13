 # Codebase Map

 ## Overview
 - Core: `hooats-core/` (matching, router, async settlement, orchestrator)
 - Libraries: `lib/` (trading, orderbook, security, redis, validation, etc.) used by API/app and core.
 - API: `app/api/...` routes for trading, health, metrics.

 ## Directory Roles (lib/)
 - `lib/trading` (30 files): order intake, portfolio, routing helpers.
 - `lib/orderbook` (20): orderbook data ops, examples, performance variants.
 - `lib/security` (25): 2FA, MEV protection, rate limiting, audits.
 - `lib/redis` (6): Redis clients, keys, scripts.
 - `lib/validation` (6): input/schema checks.
 - Others: `blockchain`, `monitoring`, `middleware`, `utils`, `types`, `supabase`, `hyperliquid`, `performance`.

 ## Active Entry Points
 - Order matching: `hooats-core/ultra-performance-orderbook-converted.js` → `processOrderUltraFast`.
 - Router boundary/AMM: `hooats-core/hybrid-router-real.js` (AMM for price continuity).
 - Orchestrator: `hooats-core/settlement/orchestrator.js` (Redis Streams) → `contracts/BatchSettlement.sol`.
 - API glue: `app/api/settlement/*`, `app/api/monitoring/*`, `app/api/benchmark`.

 ## Core ↔ Lib Mapping
 - Core uses lib/* for: Redis clients, validation, security hooks, monitoring.
 - Consolidate overlapping logic: prefer core engine paths (`hooats-core/*`) for matching/settlement; treat similar files in `lib/orderbook` as utilities or archive.

 ## Cleanup Candidates (to archive)
 - Patterns: `*deprecated*`, `*experimental*`, `*backup*`, `*example*` not referenced by API/core.
 - Already archived: `hooats-deprecated`, `hooats-experimental`, `contracts_backup`, `old_scripts`, `old_versions_backup_20250819`.

 ## Review Plan (Today)
 1) lib/trading: identify active services (used by API), mark legacy/examples.
 2) lib/orderbook: keep primitives used by core; archive duplicative example files.
 3) lib/security: keep 2FA/MEV/ratelimit; flag stubs with TODO for follow-up.
 4) lib/redis + validation: confirm key schema matches core orchestrator.
 5) Document decisions inline here; queue move-to-archive patches.

 ## Decisions To Make
 - Which `lib/orderbook/*` files are authoritative vs examples.
 - Session key model (Hyperliquid-like) placement: `lib/trading` or `lib/security`.
 - Final Redis key conventions shared across core + lib.

