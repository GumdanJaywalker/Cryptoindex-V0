# HyperIndex Developer Onboarding Guide

Welcome to HyperIndex! This guide will help you get started with our DeFi platform built on HyperCore blockchain.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Key Components](#key-components)
7. [Resources](#resources)

## Project Overview

HyperIndex (HI) is an integrated DeFi trading platform featuring:

- **AMM (Automated Market Maker)**: Uniswap V2-compatible DEX
- **Index Tokens**: Multi-layer index fund management system
- **Bonding Curve**: Fair pricing mechanism for new token launches
- **Native Token (HI)**: Platform token with vesting and governance

### Layer System

- **Layer 1 (L1)**: Major market indices (50+ tokens, AMM-based)
- **Layer 2 (L2)**: Themed indices (5-50 tokens, AMM-based)
- **Layer 3 (L3)**: User-launched indices (2-20 tokens, Bonding Curve)

L3 indices can "graduate" to L2 when they reach sufficient TVL.

## Technology Stack

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis 7
- **Testing**: Jest

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Framework**: (To be integrated)
- **Integration**: HyperCore precompiles
- **Status**: Code ready, not yet deployed

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Environment**: Multi-stage Docker builds

## Quick Start

### Prerequisites

```bash
# Required
- Node.js 22+
- Docker Desktop
- Git

# Accounts (optional for local dev)
- Supabase account
- Privy account (for authentication)
```

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd HI

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 3. Start development environment with Docker
./docker-dev.sh dev

# 4. Verify services are running
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/health
# Redis: docker exec -it hlh-redis redis-cli ping
```

### Verify Installation

```bash
# Check backend health
curl http://localhost:3001/health

# Check backend metrics
curl http://localhost:3001/metrics

# Test Redis connection
docker exec hlh-redis redis-cli ping
# Expected output: PONG
```

## Project Structure

```
HI/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── routes/      # API endpoints (50 total)
│   │   ├── services/    # Business logic (8 services)
│   │   ├── lib/         # Supabase client & utilities
│   │   ├── middlewares/ # Request processing pipeline
│   │   └── types/       # TypeScript type definitions
│   ├── supabase/        # Database migrations & RLS policies
│   └── tests/           # Unit & integration tests
├── contracts/           # Solidity smart contracts
│   ├── hypercore/      # HyperCore integration layer
│   ├── amm/            # AMM system (Factory, Pair, Router)
│   ├── tokens/         # Index token management
│   ├── governance/     # DAO governance (planned)
│   └── interfaces/     # Contract interfaces
├── docker/              # Docker configuration
│   ├── nginx/          # Reverse proxy config
│   └── redis/          # Redis configuration
├── docs/                # Documentation
│   ├── api/            # API documentation
│   ├── contracts/      # Contract documentation
│   └── setup/          # Setup guides
├── frontend/            # Next.js 15 application (in progress)
├── scripts/             # Deployment & automation scripts
└── tests/               # End-to-end tests
```

## Development Workflow

### Docker Commands

```bash
# Start all services
./docker-dev.sh dev

# Check service status
./docker-dev.sh status

# View logs
docker compose logs -f

# View logs for specific service
docker logs hlh-backend -f
docker logs hlh-redis -f

# Restart specific service
docker compose restart backend

# Stop all services
./docker-dev.sh stop

# Clean up (remove volumes)
docker compose down -v
```

### Backend Development

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Working with Database

```bash
# Access Supabase migrations
cd backend/supabase/migrations

# Apply migrations (if using Supabase CLI)
supabase db push

# View database schema
# Visit your Supabase project dashboard
```

## Key Components

### 1. Backend (Your Primary Focus)

**Location**: `/backend`

**Key Files**:
- `src/index.ts` - Application entry point
- `src/config.ts` - Configuration management
- `src/lib/supabase.ts` - Database client

**Services** (`src/services/`):
- `balance.ts` - User balance management
- `trading.ts` - AMM trading logic
- `index.ts` - Index fund management
- `bondingCurve.ts` - Price calculation for L3 indices
- `graduation.ts` - L3→L2 migration logic
- `token.ts` - Native token (HI) operations
- `fundingRound.ts` - Investment round management
- `feeCollection.ts` - Fee collection & buyback

**API Routes** (`src/routes/`):
- `health.ts` - Health checks & monitoring
- `balance.ts` - Balance endpoints
- `trading.ts` - Trading endpoints
- `indexes.ts` - Index management endpoints
- `bondingCurve.ts` - Pricing endpoints
- `token.ts` - Native token endpoints

**Documentation**:
- [`backend/README.md`](../backend/README.md) - Detailed backend guide
- [`backend/API.md`](../backend/API.md) - Complete API documentation
- [`backend/SUPABASE_SETUP.md`](../backend/SUPABASE_SETUP.md) - Database setup

### 2. Smart Contracts (Your Primary Focus)

**Location**: `/contracts`

**Structure**:
```
contracts/
├── hypercore/               # HyperCore integration
│   ├── HyperCoreActions.sol # CoreWriter interface
│   └── HyperL1Reader.sol    # L1 state reading
├── amm/                     # AMM system
│   ├── HyperIndexFactory.sol # Pair creation factory
│   ├── HyperIndexPair.sol    # Liquidity pool
│   └── HyperIndexRouter.sol  # Swap routing
├── tokens/                  # Token system
│   ├── IndexToken.sol        # ERC20 index tokens
│   ├── IndexTokenFactory.sol # Token factory
│   └── RedemptionManager.sol # Asset redemption
└── interfaces/              # Contract interfaces
```

**Key Concepts**:
- HyperCore uses native precompiles at address `0x3333...3333`
- AMM follows Uniswap V2 architecture
- Index tokens are upgradeable using OpenZeppelin patterns

**Status**: Contracts are written but **not yet deployed**. Deployment strategy is being planned.

### 3. Docker Infrastructure (Your Primary Focus)

**Location**: `/docker` and `docker-compose.yml`

**Services**:
- **Backend**: Express.js API (port 3001)
- **Frontend**: Next.js app (port 3000, when ready)
- **Redis**: Caching layer (port 6379)
- **Nginx**: Reverse proxy (optional)

**Configuration Files**:
- `docker-compose.yml` - Service orchestration
- `docker-dev.sh` - Development helper script
- `.env.docker` - Docker-specific environment variables
- `backend/Dockerfile` - Backend container image
- `docker/nginx/nginx.conf` - Nginx configuration
- `docker/redis/redis.conf` - Redis configuration

**Features**:
- Multi-stage builds for optimized images
- Health checks for all services
- Volume mounts for development
- Network isolation
- Production-ready configuration

## Resources

### Documentation
- [Complete API Documentation](../backend/API.md)
- [Backend Architecture](../backend/README.md)
- [Supabase Setup Guide](../backend/SUPABASE_SETUP.md)
- [Phase Reports](../backend/) - See PHASE*.md files

### Development Guides
- [Tech Stack Details](../TECH_STACK.md)
- [Project Comparison Analysis](../backend/PROJECT_COMPARISON_ANALYSIS.md)

### External Resources
- [HyperLiquid Documentation](https://hyperliquid.gitbook.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)

## Next Steps

1. **Set up your development environment** following the [Quick Start](#quick-start)
2. **Explore the backend codebase** - Start with `backend/src/index.ts`
3. **Review API documentation** - Understand available endpoints
4. **Examine smart contracts** - Familiarize yourself with contract architecture
5. **Run the services** - Get comfortable with Docker commands
6. **Make a small change** - Try modifying an existing API endpoint
7. **Ask questions** - Don't hesitate to reach out to the team!

## Getting Help

- **Backend Questions**: Review `backend/README.md` and `backend/API.md`
- **Contract Questions**: Check contract documentation in `/docs/contracts`
- **Docker Issues**: See troubleshooting section in main README
- **Team Contact**: Reach out via your preferred communication channel

---

**Welcome aboard! We're excited to have you on the team! 🚀**
