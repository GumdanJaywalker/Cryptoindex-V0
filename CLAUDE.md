# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HyperIndex (HI) is an integrated DeFi platform that combines HyperCore blockchain integration with AMM functionality and index token management. This project merges the best components from two previous projects: dev6 (AMM + IndexToken systems) and hlh (HyperCore integration + Docker infrastructure).

## Development Commands

### Docker Development (Recommended)
```bash
# Start development environment
./docker-dev.sh dev

# Check service status
./docker-dev.sh status

# View logs
./docker-dev.sh logs

# Stop all services
./docker-dev.sh stop

# Clean up containers
./docker-dev.sh clean
```

### Workspace Commands
```bash
# Install all dependencies
npm install

# Build all workspaces
npm run build

# Run tests across all workspaces
npm run test

# Lint all workspaces
npm run lint
```

### Frontend (Next.js 15)
```bash
cd frontend

# Development server with Turbo
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Run tests
npm run test

# Lint code
npm run lint
```

### Backend (Express + TypeScript)
```bash
cd backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Production start
npm start

# Run tests
npm test

# Lint code
npm run lint

# Test Supabase migration
npm run test:migration
```

### Smart Contracts
```bash
# Compile contracts (if contract tools exist)
npm run contracts:compile

# Test contracts
npm run contracts:test

# Deploy contracts
npm run contracts:deploy
```

## Architecture Overview

### Monorepo Structure
- **Root**: Workspace manager with Docker orchestration
- **frontend/**: Next.js 15 application with Privy auth, Aceternity UI components
- **backend/**: Express API server with Redis caching and HyperCore integration
- **contracts/**: Solidity smart contracts organized by functionality

### Key Architectural Components

#### HyperCore Integration
- `contracts/hypercore/`: Native blockchain integration contracts
- `HyperCoreActions.sol`: Interface to HyperCore's CoreWriter precompile
- `HyperL1Reader.sol`: Reads from HyperCore L1 state
- Backend services handle HyperCore API interactions

#### AMM System (from dev6)
- `contracts/amm/`: Uniswap V2-style AMM implementation
- `HyperIndexFactory.sol`: Pair creation factory
- `HyperIndexPair.sol`: Liquidity pool implementation
- `HyperIndexRouter.sol`: Swap routing logic

#### Index Token System (from dev6)
- `contracts/tokens/`: ERC20 index token management
- `IndexToken.sol`: Upgradeable ERC20 representing index fund shares
- `IndexTokenFactory.sol`: Creates and manages index tokens
- `RedemptionManager.sol`: Handles token redemption and underlying asset management

#### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: Privy for wallet connection and MFA
- **UI Components**: Aceternity UI, Radix UI primitives
- **Backend**: Express.js, TypeScript, Redis for caching, Supabase (PostgreSQL)
- **Blockchain**: Solidity contracts, OpenZeppelin libraries
- **Infrastructure**: Docker Compose, multi-stage builds

### Environment Configuration
- Uses `.env` file for configuration (copy from `.env.example`)
- **Required**: Privy app credentials for authentication
- **Required**: Supabase credentials for database access
- Redis configuration for caching and session management
- HyperCore/HyperLiquid API endpoints and network configuration
- Docker environment variables for service orchestration

### Development Workflow
1. The project uses Docker for consistent development environment (`./docker-dev.sh dev`)
2. Frontend (Next.js 15) and backend (Express) run as separate services
3. Redis provides caching and session management
4. Supabase serves as the primary database (PostgreSQL)
5. Smart contracts are organized by functional domain (AMM, tokens, HyperCore integration)
6. All services are orchestrated through Docker Compose

## Service URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Redis: localhost:6379

## Testing
- Frontend: Jest for component testing
- Backend: Jest for API testing
- Integration tests should be placed in `tests/` directory
- Use `npm run test` to run all workspace tests

## Linting and Type Checking
- ESLint configuration across all workspaces
- TypeScript strict mode enabled
- Run `npm run lint` for workspace-wide linting
- Frontend includes separate `type-check` command

## Key Backend Services and Architecture
- **Services**: Located in `backend/src/services/` including fundingRound, token management via Supabase
- **API Routes**: Comprehensive REST API with 50+ endpoints
- **Database**: Supabase integration with migration scripts
- **Caching**: Redis for performance optimization
- **Logging**: Structured logging with Pino
- **Error Handling**: Centralized error handling and circuit breaker patterns

## Package Manager Notes
- **Frontend**: Uses npm (not pnpm as originally planned)
- **Backend**: Uses npm with tsx for TypeScript execution
- **Root**: npm workspaces for monorepo management
- **Node.js**: Requires version 22+ as specified in package.json engines