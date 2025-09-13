 # Repository Guidelines

 ## Project Structure & Module Organization
 - `app/`: Next.js app router and APIs (e.g., `app/api/.../route.ts`).
 - `components/`, `hooks/`, `lib/`: UI, reusable hooks, and shared utilities.
 - `contracts/`: Solidity sources; `scripts/` contains Hardhat deploy/test helpers; `hardhat.config.js` at root.
 - `tokenmodule1/`: Legacy/isolated token module with its own tests and config.
 - `supabase/migrations/`: SQL migrations; environment via `.env`/`.env.example`.
 - `public/`: Static assets. `config/`, `documents/`, `scripts/`: configs, docs, and ops tooling.

 ## Build, Test, and Development Commands
 - `npm run dev`: Start Next.js dev server.
 - `npm run build` / `npm start`: Build and run production.
 - `npm run lint`: ESLint via `next lint`.
 - `npm run hardhat:compile` / `npm run hardhat:test`: Compile and test contracts (Mocha/Chai).
 - `npm run deploy:testnet`: Example Hardhat deploy to `hypervm-testnet`.
 - `npm run redis:start|stop|logs|cli`: Manage local Redis via Docker Compose.
 - `npm run hooats:start|stop|logs|dev`: Run the HOOATS API locally.

 ## Coding Style & Naming Conventions
 - TypeScript-first; 2-space indent; aim for small, pure functions.
 - React components: PascalCase files and exports (e.g., `components/OrderBook.tsx`).
 - Hooks: `useX` prefix in `hooks/`.
 - API route files follow Next.js convention: `route.ts` under `app/api/...`.
 - Lint with `npm run lint`; format according to ESLint rules. Tailwind is configured (`tailwind.config.ts`).

 ## Testing Guidelines
 - Contracts: place tests under `contracts/` or module folders (e.g., `*.test.ts|js`).
 - Run with `npm run hardhat:test`; keep tests deterministic and isolated.
 - Prefer behavior-first descriptions (e.g., `describe('IndexToken minting', ...)`).

 ## Commit & Pull Request Guidelines
 - Commits: imperative mood; group logical changes. Conventional prefixes (`feat:`, `fix:`) encouraged where it clarifies intent.
 - PRs: include summary, scope, screenshots for UI, and steps to verify. Link issues and note any migrations.
 - Before opening a PR: `npm run lint`, `npm run build`, and relevant Hardhat tests.

 ## Security & Configuration Tips
 - Never commit secrets; copy `.env.example` to `.env` and fill required keys (Supabase, Redis, RPC URLs).
 - Use test networks for deployments (`deploy:testnet`), and verify addresses in config before merges.
