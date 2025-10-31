***

# HyperIndex (HI) - Integrated Project

**HyperCore-Based Unified Trading Platform - Index Token DEX**

***

## Tech Stack

### Backend: TypeScript + Express.js
- Node.js 22+ Runtime  
- Supabase (PostgreSQL) Database  
- Redis 7 Cache  

### Smart Contracts: Solidity ^0.8.20
- AMM (Uniswap V2 compatible)  
- Index Tokens (ERC-20)  
- Bonding Curve System  
- Status: Code ready, not yet deployed  

### Frontend: TypeScript + Next.js 15
- React 19  
- Tailwind CSS  
- Privy Auth  

See full details in **TECH_STACK.md**

***

## Project Structure

```
HI/
├── frontend/              # Next.js 15 Frontend
├── backend/               # Express API Server
│   ├── src/
│   │   ├── routes/        # API Endpoints (50 total)
│   │   ├── services/      # Business Logic (8)
│   │   ├── lib/           # Supabase Client
│   │   └── types/         # TypeScript Types
│   └── supabase/          # Database Migrations
├── contracts/             # Smart Contracts (Solidity)
│   ├── hypercore/         # HyperCore Integration
│   ├── amm/               # AMM System
│   ├── tokens/            # Index Token Management
│   ├── governance/        # DAO Governance (Planned)
│   └── interfaces/        # Interfaces
├── docker/                # Docker Configuration
├── docs/                  # Documentation
│   ├── api/               # API Docs
│   ├── contracts/         # Contract Docs
│   └── setup/             # Setup Guides
├── tests/                 # Tests
└── scripts/               # Deployment Scripts
```

***

## Core Features

### Phase 1–6 Completed
- **Layer System:** L1 (Major), L2 (Themed), L3 (User-Launched) Indices  
- **Bonding Curve:** Sigmoid Hybrid Model for fair pricing  
- **AMM Integration:** Uniswap V2 compatible DEX  
- **Native Token (HI):** 1B supply with funding rounds  
- **Graduation Logic:** Automatic L3 → L2 migration  
- **Database:** Supabase schema (9 tables)  

### In Progress
- Service to Supabase migration  
- Frontend development  
- Real-time subscriptions  

### Planned
- Smart contract deployment  
- Blockchain integration  
- L3↔L2 bridge  

***

## Quick Start

### 1. Prerequisites
```bash
# Required software
- Node.js 22+
- Docker Desktop
- Git

# Optional accounts
- Privy (https://privy.io)
- Supabase (https://supabase.com)
```

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd HI

# Set environment variables
cp .env.example .env
# Edit .env file

# Run with Docker
./docker-dev.sh dev
```

### 3. Access
```bash
# Frontend
http://localhost:3000

# Backend API
http://localhost:3001/api/v1/health

# Redis CLI
docker exec -it hlh-redis redis-cli
```

***

## Documentation

### Getting Started
- **COMPLETE_LEARNING_GUIDE.md** – 16-hour learning roadmap  
- **TECH_STACK.md** – Detailed tech stack  
- **DEVELOPER_ONBOARDING_GUIDE.md** – Onboarding manual  

### Backend
- **backend/README.md** – Backend reference  
- **backend/API.md** – 50 API endpoints  
- **backend/SUPABASE_SETUP.md** – Database setup guide  

### Phase Reports
- **PHASE4_COMPLETION_REPORT.md** – Bonding Curve  
- **PHASE5_COMPLETION_REPORT.md** – Native Token  
- **PHASE6_COMPLETION_REPORT.md** – Supabase Integration  

### Analysis
- **PROJECT_COMPARISON_ANALYSIS.md** – Index Token DEX vs. HyperIndex  

***

## Native Token (HI)

```
Symbol: HI
Total Supply: 1,000,000,000 (1B)
Base Price: $0.05

Allocation:
- Team: 20% (36 months vesting, 12-month cliff)
- Investors: 20% (24 months vesting, 6-month cliff)
- Community: 35% (48 months vesting)
- Foundation: 15% (48 months vesting)
- Treasury: 10% (liquid)

Funding Rounds:
- Seed: $0.01/token (70% discount, $500k target)
- Strategic: $0.02/token (40% discount, $2M target)
- Public: $0.05/token (no discount, $5M target)
```

***

## Project Status

### Phase Progress
```
Phase 1: Base Infrastructure       100%
Phase 2: Trading Core              100%
Phase 3: Layer System              100%
Phase 4: Bonding Curve             100%
Phase 5: Native Token              100%
Phase 6: Supabase Integration       80%
Phase 6.1: Service Migration         0%
Phase 7: Smart Contracts             0%
```

### Implementation
```
Backend API:       50 endpoints
Services:          8 services
Database:          9 tables
Smart Contracts:   8 contracts (not deployed)
Documentation:     100%
```

***

## Development

### Docker Commands
```bash
# Start all services
./docker-dev.sh dev

# View logs
docker compose logs -f

# Restart specific service
docker compose restart backend

# Stop all services
./docker-dev.sh stop

# Full cleanup (remove volumes)
docker compose down -v
```

### Backend Development
```bash
cd backend

# Development server
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

***

## API Endpoints

**Total: 50 endpoints**

| Category | Count | Examples |
|-----------|--------|-----------|
| Health & Monitoring | 3 | `/health`, `/metrics` |
| Balance | 3 | `/v1/balance` |
| Trading | 5 | `/v1/trading/swap` |
| Indexes | 7 | `/v1/indexes` |
| Bonding Curve | 7 | `/v1/bonding-curve/quote` |
| Token | 18 | `/v1/token/balance` |

See **backend/API.md** for full documentation.

***

## Cost Estimates

### MVP (Current)
- Backend: Supabase Free Tier  
- Cache: Redis (Docker)  
- Total: $0/month  

### Growth (1,000+ users)
- Supabase Pro: $25/month  
- Other services: $150–225/month  
- Total: $175–250/month  

### Scale (10,000+ users)
- Supabase Pro + Add-ons  
- Infrastructure scaling  
- Total: $1,000–1,500/month  

See **backend/README.md** for details.

***

## Contributing

### Getting Started
1. Read **COMPLETE_LEARNING_GUIDE.md**  
2. Follow **DEVELOPER_ONBOARDING_GUIDE.md**  
3. Set up the environment  
4. Start development  

### Code Style
- TypeScript (Backend & Frontend)  
- Solidity ^0.8.20 (Smart Contracts)  
- ESLint + Prettier  

***

## License

Private – All rights reserved.

***

## Support

- Email: [henry.c@hyperindex.biz]
- Discord: Pending  
- GitHub Issues: Pending  

***

**Last Updated:** October 31, 2025
***
