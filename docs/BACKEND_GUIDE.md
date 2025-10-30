# Backend Development Guide

This guide covers the backend architecture, development practices, and key concepts for HyperIndex.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Services](#services)
5. [Authentication & Security](#authentication--security)
6. [Testing](#testing)
7. [Common Tasks](#common-tasks)

## Architecture Overview

### Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL 15)
- **Cache**: Redis 7
- **Logging**: Winston
- **Validation**: Zod
- **Testing**: Jest

### Directory Structure

```
backend/
├── src/
│   ├── config.ts              # Configuration management with Zod
│   ├── index.ts               # Express app entry point
│   │
│   ├── lib/                   # Core libraries
│   │   ├── supabase.ts        # Supabase client singleton
│   │   └── types.ts           # Auto-generated DB types
│   │
│   ├── infra/                 # Infrastructure
│   │   └── logger.ts          # Winston logger setup
│   │
│   ├── middlewares/           # Request processing pipeline
│   │   ├── auth.ts            # JWT authentication
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── idempotency.ts     # Idempotent request handling
│   │   ├── metricsCollector.ts # Prometheus metrics
│   │   ├── requestContext.ts  # Request ID & logging
│   │   └── circuitBreaker.ts  # Emergency stop mechanism
│   │
│   ├── routes/                # API route handlers
│   │   ├── health.ts          # Health checks & monitoring
│   │   ├── monitoring.ts      # Metrics endpoint
│   │   ├── balance.ts         # Balance management
│   │   ├── trading.ts         # AMM trading
│   │   ├── indexes.ts         # Index management
│   │   ├── bondingCurve.ts    # Bonding curve pricing
│   │   └── token.ts           # Native token operations
│   │
│   ├── services/              # Business logic layer
│   │   ├── balance.ts         # Balance calculations
│   │   ├── trading.ts         # Trading logic (AMM)
│   │   ├── index.ts           # Index CRUD operations
│   │   ├── bondingCurve.ts    # Price calculation
│   │   ├── graduation.ts      # L3→L2 migration
│   │   ├── token.ts           # Token operations
│   │   ├── fundingRound.ts    # Investment rounds
│   │   └── feeCollection.ts   # Fee management
│   │
│   ├── types/                 # Type definitions
│   │   ├── express.d.ts       # Express type extensions
│   │   ├── index.ts           # Index/Layer types
│   │   └── token.ts           # Token types
│   │
│   ├── schemas/               # Validation schemas
│   │   ├── common.ts          # Reusable Zod schemas
│   │   └── env.ts             # Environment validation
│   │
│   └── utils/                 # Utility functions
│       └── httpError.ts       # HTTP error classes
│
├── supabase/                  # Database
│   ├── migrations/            # SQL migrations
│   │   ├── 20250120_create_token_tables.sql
│   │   ├── 20250120_create_funding_tables.sql
│   │   └── 20250120_create_index_tables.sql
│   └── seed.sql               # Development data
│
├── tests/                     # Tests
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── fixtures/              # Test data
│
├── .env.example               # Environment template
├── .env.test                  # Test environment
├── tsconfig.json              # TypeScript config
├── jest.config.js             # Jest config
├── Dockerfile                 # Production image
└── package.json               # Dependencies
```

### Request Flow

```
Client Request
    ↓
Express App
    ↓
Middleware Pipeline
    ├─ requestContext    (add request ID, logging)
    ├─ auth              (JWT validation)
    ├─ idempotency       (duplicate request check)
    ├─ metricsCollector  (Prometheus metrics)
    └─ circuitBreaker    (emergency stop)
    ↓
Route Handler
    ↓
Service Layer
    ├─ Business Logic
    ├─ Validation
    └─ Error Handling
    ↓
Data Layer
    ├─ Supabase (PostgreSQL)
    └─ Redis (Cache)
    ↓
Response to Client
```

## Database Schema

### Core Tables

#### Users & Authentication (from dev6)

```sql
-- User accounts (Privy integration)
users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- EVM wallet addresses
user_wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address TEXT UNIQUE,
  chain_id INTEGER,
  created_at TIMESTAMPTZ
)
```

#### Native Token System (Phase 5)

```sql
-- Token holder balances
token_holders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  locked_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Token transaction history
token_transactions (
  id UUID PRIMARY KEY,
  holder_id UUID REFERENCES token_holders(id),
  transaction_type TEXT NOT NULL, -- 'purchase', 'vesting_unlock', 'transfer', etc.
  amount NUMERIC NOT NULL,
  price_usd NUMERIC,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
```

#### Funding Rounds (Phase 5)

```sql
-- Investment rounds
funding_rounds (
  id UUID PRIMARY KEY,
  round_name TEXT NOT NULL, -- 'seed', 'strategic', 'public'
  token_price_usd NUMERIC NOT NULL,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  target_raise_usd NUMERIC NOT NULL,
  current_raise_usd NUMERIC NOT NULL DEFAULT 0,
  vesting_months INTEGER NOT NULL,
  cliff_months INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ
)

-- User investments
investments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  funding_round_id UUID REFERENCES funding_rounds(id),
  amount_usd NUMERIC NOT NULL,
  tokens_purchased NUMERIC NOT NULL,
  tokens_vested NUMERIC NOT NULL DEFAULT 0,
  vesting_start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### Index System (Phase A + Phase 6)

```sql
-- Index funds
indices (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL UNIQUE,
  layer INTEGER NOT NULL, -- 1, 2, or 3
  description TEXT,
  creator_address TEXT,
  total_value_locked NUMERIC DEFAULT 0,
  management_fee_percentage NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Index components (constituent tokens)
index_components (
  id UUID PRIMARY KEY,
  index_id UUID REFERENCES indices(id),
  token_address TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  weight_percentage NUMERIC NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### Bonding Curve (Phase 4 + Phase 6)

```sql
-- Bonding curve parameters for L3 indices
bonding_curve_params (
  id UUID PRIMARY KEY,
  index_id UUID REFERENCES indices(id),
  initial_price NUMERIC NOT NULL,
  graduation_tvl NUMERIC NOT NULL,
  graduation_liquidity_percentage INTEGER NOT NULL DEFAULT 80,
  circuit_breaker_decline_percentage INTEGER NOT NULL DEFAULT 25,
  circuit_breaker_duration_hours INTEGER NOT NULL DEFAULT 48,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Row Level Security (RLS)

Supabase RLS policies are defined in migration files:

```sql
-- Public read access for indices and funding rounds
ALTER TABLE indices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view indices" 
  ON indices FOR SELECT 
  USING (true);

-- Users can only see their own token balances
ALTER TABLE token_holders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own balances" 
  ON token_holders FOR SELECT 
  USING (auth.uid() = user_id);

-- Service role has full access for backend operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
```

## API Endpoints

### Health & Monitoring (3 endpoints)

```typescript
GET  /health              // Health check with Supabase status
GET  /metrics             // Prometheus metrics
GET  /dashboard           // Admin dashboard (HTML)
```

### Balance Management (3 endpoints)

```typescript
GET  /v1/balance/:address // Get user balance
POST /v1/balance/deposit  // Deposit funds
POST /v1/balance/withdraw // Withdraw funds
```

### Trading (5 endpoints)

```typescript
POST /v1/trading/swap               // Execute AMM swap
POST /v1/trading/order              // Place limit order
GET  /v1/trading/orders/:address    // Get user orders
GET  /v1/trading/pools              // Get all liquidity pools
GET  /v1/trading/pool/:pairAddress  // Get specific pool info
```

### Index Management (7 endpoints)

```typescript
GET    /v1/indexes                  // List all indices
GET    /v1/indexes/:id              // Get index details
POST   /v1/indexes                  // Create new index
PATCH  /v1/indexes/:id              // Update index
DELETE /v1/indexes/:id              // Delete index
POST   /v1/indexes/:id/rebalance    // Rebalance index
GET    /v1/indexes/:id/components   // Get index components
```

### Bonding Curve (7 endpoints)

```typescript
GET  /v1/bonding-curve/quote/buy           // Get buy price quote
GET  /v1/bonding-curve/quote/sell          // Get sell price quote
POST /v1/bonding-curve/buy                 // Execute buy
POST /v1/bonding-curve/sell                // Execute sell
GET  /v1/bonding-curve/progress/:indexId   // Get graduation progress
GET  /v1/bonding-curve/circuit-breaker     // Get circuit breaker status
POST /v1/bonding-curve/graduate/:indexId   // Manual graduation trigger
```

### Native Token (18 endpoints)

```typescript
// Token Information
GET  /v1/token/info           // Token specifications
GET  /v1/token/metrics        // Supply metrics
GET  /v1/token/allocation     // Allocation breakdown

// Token Operations
GET  /v1/token/balance/:address           // Get token balance
POST /v1/token/transfer                   // Transfer tokens
GET  /v1/token/transactions/:address      // Transaction history

// Funding Rounds
GET  /v1/token/funding-rounds             // List all rounds
GET  /v1/token/funding-rounds/:id         // Get round details
POST /v1/token/purchase                   // Purchase tokens

// Vesting
GET  /v1/token/vesting/:address           // Vesting schedule
POST /v1/token/claim-vested               // Claim vested tokens
GET  /v1/token/vesting/claimable/:address // Claimable amount

// Fee Management
GET  /v1/token/fees/collected             // Total fees collected
GET  /v1/token/fees/allocation            // Fee allocation
POST /v1/token/buyback                    // Execute buyback
GET  /v1/token/buyback/history            // Buyback history

// Administrative
POST /v1/token/burn                       // Burn tokens
GET  /v1/token/holders                    // Top token holders
```

**Total: 50 API endpoints**

For complete API documentation with request/response examples, see [`backend/API.md`](../../backend/API.md).

## Services

### Service Layer Architecture

Services contain the core business logic and are called by route handlers.

#### Balance Service (`services/balance.ts`)

**Responsibilities**:
- Calculate user balances across all tokens
- Handle deposit/withdrawal operations
- Maintain balance history

**Key Methods**:
```typescript
class BalanceService {
  async getBalance(address: string): Promise<Balance>
  async deposit(address: string, amount: bigint): Promise<void>
  async withdraw(address: string, amount: bigint): Promise<void>
  async getHistory(address: string): Promise<Transaction[]>
}
```

#### Trading Service (`services/trading.ts`)

**Responsibilities**:
- Execute AMM swaps using constant product formula
- Manage limit orders
- Calculate optimal swap routes
- Handle liquidity pool operations

**Key Methods**:
```typescript
class TradingService {
  async executeSwap(params: SwapParams): Promise<SwapResult>
  async placeOrder(params: OrderParams): Promise<Order>
  async getOrders(address: string): Promise<Order[]>
  async getLiquidityPools(): Promise<Pool[]>
}
```

**AMM Formula**: 
```typescript
// Constant Product: x * y = k
// Price calculation for swaps
function calculateSwapOutput(
  inputAmount: bigint,
  inputReserve: bigint,
  outputReserve: bigint
): bigint {
  const inputWithFee = inputAmount * 997n; // 0.3% fee
  const numerator = inputWithFee * outputReserve;
  const denominator = (inputReserve * 1000n) + inputWithFee;
  return numerator / denominator;
}
```

#### Index Service (`services/index.ts`)

**Responsibilities**:
- Create and manage index funds (L1, L2, L3)
- Validate index components and weights
- Handle rebalancing operations
- Track TVL and performance

**Key Methods**:
```typescript
class IndexService {
  async createIndex(params: CreateIndexParams): Promise<Index>
  async getIndex(id: string): Promise<Index>
  async updateIndex(id: string, updates: Partial<Index>): Promise<Index>
  async rebalance(id: string): Promise<void>
  async getComponents(id: string): Promise<Component[]>
}
```

**Validation Rules**:
- L1: 50-100 tokens, weights must sum to 100%
- L2: 5-50 tokens, weights must sum to 100%
- L3: 2-20 tokens, weights must sum to 100%

#### Bonding Curve Service (`services/bondingCurve.ts`)

**Responsibilities**:
- Calculate token prices using sigmoid hybrid model
- Handle buy/sell transactions
- Track graduation progress
- Manage circuit breaker

**Key Methods**:
```typescript
class BondingCurveService {
  async getBuyQuote(indexId: string, amount: bigint): Promise<Quote>
  async getSellQuote(indexId: string, amount: bigint): Promise<Quote>
  async executeBuy(params: BuyParams): Promise<Transaction>
  async executeSell(params: SellParams): Promise<Transaction>
  async getGraduationProgress(indexId: string): Promise<Progress>
  async checkCircuitBreaker(indexId: string): Promise<boolean>
}
```

**Sigmoid Hybrid Formula**:
```typescript
// Fair pricing that prevents early dumping
function calculatePrice(supply: bigint, params: BondingCurveParams): bigint {
  const progress = supply / params.graduationTVL;
  const sigmoid = 1 / (1 + Math.exp(-10 * (progress - 0.5)));
  return params.initialPrice * sigmoid;
}
```

#### Token Service (`services/token.ts`)

**Responsibilities**:
- Manage native token (HI) operations
- Handle transfers and vesting
- Track token metrics and supply

**Key Methods**:
```typescript
class TokenService {
  async getBalance(address: string): Promise<bigint>
  async transfer(from: string, to: string, amount: bigint): Promise<void>
  async getVestingSchedule(address: string): Promise<VestingSchedule>
  async claimVested(address: string): Promise<bigint>
  async getMetrics(): Promise<TokenMetrics>
}
```

#### Funding Round Service (`services/fundingRound.ts`)

**Responsibilities**:
- Manage investment rounds (Seed, Strategic, Public)
- Process token purchases
- Calculate vesting schedules
- Track raise progress

**Key Methods**:
```typescript
class FundingRoundService {
  async createRound(params: RoundParams): Promise<FundingRound>
  async purchaseTokens(params: PurchaseParams): Promise<Investment>
  async getRounds(filter?: RoundFilter): Promise<FundingRound[]>
  async getRoundDetails(id: string): Promise<FundingRound>
}
```

#### Graduation Service (`services/graduation.ts`)

**Responsibilities**:
- Handle L3→L2 graduation
- Create AMM liquidity pools
- Migrate bonding curve liquidity

**Key Methods**:
```typescript
class GraduationService {
  async checkGraduationEligibility(indexId: string): Promise<boolean>
  async graduate(indexId: string): Promise<void>
  async createAMMPool(indexId: string): Promise<Pool>
}
```

#### Fee Collection Service (`services/feeCollection.ts`)

**Responsibilities**:
- Collect platform fees (swap, management, performance)
- Execute token buybacks
- Burn bought-back tokens
- Track fee metrics

**Key Methods**:
```typescript
class FeeCollectionService {
  async collectFee(type: FeeType, amount: bigint): Promise<void>
  async executeBuyback(amount: bigint): Promise<void>
  async burnTokens(amount: bigint): Promise<void>
  async getFeeMetrics(): Promise<FeeMetrics>
}
```

## Authentication & Security

### JWT Authentication

```typescript
// Middleware: middlewares/auth.ts
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new UnauthorizedError('No authorization header');
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  try {
    const payload = verifyJWT(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
```

### Idempotency

```typescript
// Middleware: middlewares/idempotency.ts
// Prevents duplicate transactions using Redis
export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  if (idempotencyKey) {
    const cached = await redis.get(`idempotency:${idempotencyKey}`);
    if (cached) {
      return res.json(JSON.parse(cached)); // Return cached response
    }
  }
  
  // Store response in Redis after successful request
  res.on('finish', async () => {
    if (idempotencyKey && res.statusCode < 300) {
      await redis.setex(
        `idempotency:${idempotencyKey}`,
        86400, // 24 hours
        JSON.stringify(res.locals.data)
      );
    }
  });
  
  next();
};
```

### Rate Limiting

```typescript
// Using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/v1', limiter);
```

### Circuit Breaker

```typescript
// Middleware: middlewares/circuitBreaker.ts
// Emergency stop mechanism for critical failures
export const circuitBreakerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = await redis.get('circuit-breaker:status');
  
  if (status === 'open') {
    throw new ServiceUnavailableError('Service temporarily unavailable');
  }
  
  next();
};

// Triggered by monitoring
async function triggerCircuitBreaker() {
  await redis.setex('circuit-breaker:status', 3600, 'open'); // 1 hour
  logger.error('Circuit breaker activated!');
}
```

## Testing

### Unit Tests

```typescript
// tests/unit/services/bonding-curve.test.ts
import { BondingCurveService } from '../../../src/services/bondingCurve';

describe('BondingCurveService', () => {
  let service: BondingCurveService;
  
  beforeEach(() => {
    service = new BondingCurveService();
  });
  
  describe('calculatePrice', () => {
    it('should calculate correct price at 0% supply', () => {
      const price = service.calculatePrice(0n, {
        initialPrice: 1000000000000000000n, // 1 token
        graduationTVL: 1000000000000000000000000n // 1M tokens
      });
      
      expect(price).toBeLessThan(100000000000000000n); // < 0.1 token
    });
    
    it('should calculate correct price at 100% supply', () => {
      const price = service.calculatePrice(
        1000000000000000000000000n, // 1M tokens
        {
          initialPrice: 1000000000000000000n,
          graduationTVL: 1000000000000000000000000n
        }
      );
      
      expect(price).toBeGreaterThan(900000000000000000n); // > 0.9 token
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/api/trading.test.ts
import request from 'supertest';
import { app } from '../../../src/index';

describe('Trading API', () => {
  describe('POST /v1/trading/swap', () => {
    it('should execute swap successfully', async () => {
      const response = await request(app)
        .post('/v1/trading/swap')
        .set('Authorization', 'Bearer test-token')
        .send({
          tokenIn: '0x1234...',
          tokenOut: '0x5678...',
          amountIn: '1000000000000000000', // 1 token
          minAmountOut: '900000000000000000' // 0.9 token (10% slippage)
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amountOut).toBeDefined();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- services/bondingCurve.test.ts

# Watch mode
npm test -- --watch
```

## Common Tasks

### Adding a New API Endpoint

1. **Define the route** in appropriate route file:
```typescript
// src/routes/indexes.ts
router.post('/v1/indexes/:id/favorite', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await indexService.addFavorite(req.user.id, id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
```

2. **Implement service logic**:
```typescript
// src/services/index.ts
async addFavorite(userId: string, indexId: string): Promise<void> {
  // Validate index exists
  const index = await supabase
    .from('indices')
    .select('id')
    .eq('id', indexId)
    .single();
  
  if (!index.data) {
    throw new NotFoundError('Index not found');
  }
  
  // Add favorite
  await supabase
    .from('user_favorites')
    .insert({ user_id: userId, index_id: indexId });
}
```

3. **Add validation schema**:
```typescript
// src/schemas/indexes.ts
export const addFavoriteSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
```

4. **Write tests**:
```typescript
// tests/unit/services/index.test.ts
describe('addFavorite', () => {
  it('should add favorite successfully', async () => {
    await service.addFavorite('user-id', 'index-id');
    // Assert favorite was added
  });
});
```

### Working with Supabase

#### Query Examples

```typescript
// Simple select
const { data, error } = await supabase
  .from('indices')
  .select('*')
  .eq('is_active', true);

// Join tables
const { data, error } = await supabase
  .from('indices')
  .select(`
    *,
    components:index_components(*)
  `)
  .eq('id', indexId);

// Insert
const { data, error } = await supabase
  .from('token_transactions')
  .insert({
    holder_id: holderId,
    transaction_type: 'purchase',
    amount: amount.toString(),
    price_usd: price
  })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('indices')
  .update({ total_value_locked: newTVL.toString() })
  .eq('id', indexId);

// Delete
const { error } = await supabase
  .from('index_components')
  .delete()
  .eq('index_id', indexId);
```

#### Type Safety

```typescript
// Auto-generated types from Supabase schema
import type { Database } from './lib/types';

type Index = Database['public']['Tables']['indices']['Row'];
type IndexInsert = Database['public']['Tables']['indices']['Insert'];
type IndexUpdate = Database['public']['Tables']['indices']['Update'];

// Usage
const index: Index = {
  id: '...',
  name: 'DeFi Index',
  symbol: 'DEFI',
  layer: 2,
  // ... all required fields
};
```

### Working with Redis

```typescript
// Cache service wrapper
class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async del(key: string): Promise<void> {
    await redis.del(key);
  }
  
  async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }
}

// Usage in service
async getIndex(id: string): Promise<Index> {
  // Try cache first
  const cached = await cache.get<Index>(`index:${id}`);
  if (cached) return cached;
  
  // Fetch from database
  const { data, error } = await supabase
    .from('indices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Cache for 5 minutes
  await cache.set(`index:${id}`, data, 300);
  
  return data;
}
```

### Logging Best Practices

```typescript
import { logger } from './infra/logger';

// Info level for normal operations
logger.info('Index created', {
  indexId: index.id,
  creator: req.user.address,
  layer: index.layer
});

// Warn level for recoverable issues
logger.warn('High slippage detected', {
  expected: expectedAmount,
  actual: actualAmount,
  slippage: slippagePercentage
});

// Error level for exceptions
logger.error('Failed to execute swap', {
  error: error.message,
  stack: error.stack,
  params: swapParams
});

// Use structured logging for easy searching
logger.info('Transaction completed', {
  txType: 'swap',
  user: req.user.address,
  tokenIn: params.tokenIn,
  tokenOut: params.tokenOut,
  amountIn: params.amountIn.toString(),
  amountOut: result.amountOut.toString(),
  timestamp: new Date().toISOString()
});
```

## Environment Variables

### Required Variables

```bash
# Server
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# API Keys (optional for local dev)
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

### Environment-Specific Files

- `.env` - Local development
- `.env.test` - Test environment
- `.env.docker` - Docker environment
- `.env.production` - Production (never commit!)

---

**Need more help?** Check the [main README](../../README.md) or reach out to the team!
