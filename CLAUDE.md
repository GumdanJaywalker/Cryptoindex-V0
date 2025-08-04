# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**HyperIndex** - A hybrid decentralized exchange for meme coin index tokens on HyperEVM, combining AMM liquidity pools with off-chain orderbook for CEX-like trading experience. The platform tracks external memecoins (DOGE, PEPE, SHIB, etc.) through oracle price feeds without holding actual tokens.

## Tech Stack
- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Authentication**: Privy (email OTP + wallet connections)
- **Database**: Supabase with Row Level Security
- **Caching/Hot Data**: Redis for real-time orderbook and session data
- **Smart Contracts**: HyperEVM (Solidity)
- **Trading Engine**: Hybrid AMM + Off-chain Orderbook with V2 Smart Router
- **Price Oracles**: Chainlink for external meme coin prices (planned)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: TailwindCSS with CSS modules

## Development Commands

**⚠️ IMPORTANT: Claude should NOT execute build, migration, or npm commands directly. User will handle all command execution manually.**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Start Redis (required for trading)
npm run redis

# Run database migrations
npx supabase migration up
```

## Project Structure

```
/app                    # Next.js App Router
  /api                  # API routes
    /auth              # Authentication endpoints
    /user              # User management endpoints
    /trading           # Trading system APIs
      /v1              # Trading V1 endpoints
        /orders        # Order management
        /trades        # Trade history
        /market        # Market data
        /orderbook     # Orderbook data
      /v2              # Trading V2 endpoints (Hybrid Router)
        /orders        # V2 order processing
      /simulator       # Performance testing simulator
    /redis             # Redis management APIs
    /testing           # Testing utilities
    /debug             # Debug endpoints
  /dashboard           # Protected dashboard page
  /privy-login        # Login page
  /test-trading       # Trading system test page
  /test-hybrid-trading # Hybrid trading test page
  /test-hybrid-trading-v2 # V2 hybrid trading test page
  /trading-simulator  # Performance simulator UI
/components
  /auth               # Authentication components
  /providers          # Context providers (PrivyProvider)
  /ui                 # shadcn/ui components (50+ components)
  /trading            # Trading-specific components
/lib
  /auth               # JWT verification (privy-jwt.ts)
  /middleware         # Authentication and rate limiting middleware
  /privy              # Privy configuration
  /supabase           # Database client and types
  /trading            # Trading system core
    /order-service.ts   # Order processing service
    /advanced-order-service.ts # Advanced order features
    /smart-router.ts    # V1 Smart Router
    /smart-router-v2.ts # V2 Smart Router with chunk processing
    /mock-amm.ts        # AMM simulation
  /orderbook          # Orderbook system
    /matching-engine.ts # Order matching logic
    /redis-orderbook.ts # Redis-based orderbook
  /redis              # Redis client and utilities
  /websocket          # WebSocket handling (planned)
  /utils              # Utilities
    /precision.ts       # Decimal precision handling
    /performance-simulator.ts # Performance testing utilities
  /types              # TypeScript type definitions
    /trading.ts         # Trading-related types
    /orderbook.ts       # Orderbook types
/supabase              # Database schema and migrations
/docs                  # Documentation
  /archive             # Legacy/outdated documents
/contracts             # Smart contracts (planned)
```

## Environment Variables

Create `.env.local` file:
```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
PRIVY_VERIFICATION_KEY=your_privy_verification_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Redis
REDIS_URL=redis://localhost:6379

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development
NODE_ENV=development
DISABLE_RATE_LIMIT=true
```

## Authentication Flow

1. **Email Login**:
   - User enters email → OTP sent via Privy
   - On verification, embedded wallet created automatically
   - User synced to Supabase with privy_user_id

2. **Wallet Login**:
   - Direct connection via MetaMask/WalletConnect
   - No embedded wallet created
   - User synced to Supabase with wallet address

3. **Development Mode**:
   - Use `Bearer dev-token` to bypass authentication
   - Automatic user creation for testing

## Trading System Architecture

### CRITICAL: HyperCore vs HyperEVM Distinction

**⚠️ NEVER CONFUSE THESE CONCEPTS - THEY ARE COMPLETELY SEPARATE**

#### HyperCore (❌ WE DO NOT USE THIS)
1. **HIP-1 Standard**: Requires "Core Spot" tokens with Dutch Auction listing
2. **Dutch Auction**: Extremely expensive process (millions of dollars)
3. **HIP-3 Perp**: Requires 1M HYPE (~$40M) to list perpetual pairs
4. **Orderbook Precompiles**: Available but we don't use them
5. **Linking Requirement**: ERC-20 ↔ HIP-1 linking requires Dutch Auction participation

#### HyperEVM (✅ THIS IS OUR PLATFORM)
1. **ERC-20 Standard**: Standard Ethereum-compatible tokens ("EVM Spot")
2. **No Dutch Auction**: Deploy directly without expensive listing costs
3. **Native Deployment**: Fully independent from HyperCore
4. **Standard Solidity**: Use regular Ethereum development tools
5. **HYPE Gas**: Pay transaction fees with HYPE token

### Hybrid Trading Model

#### V2 Smart Router (Current)
- **Chunk-based Processing**: Large orders split into optimal chunks
- **Dynamic Routing**: Real-time AMM vs Orderbook selection per chunk
- **Price Impact Minimization**: Adaptive chunk sizing based on slippage
- **Dual Execution**: AMM fills until price limit, then orderbook continuation

#### Trading Components
1. **Mock AMM**: Uniswap V2-style constant product AMM (x*y=k)
2. **Redis Orderbook**: Real-time price-time priority matching
3. **PostgreSQL History**: Permanent trade and order history
4. **Performance Simulator**: 900+ TPS testing capability

### Data Architecture

#### Hot Data (Redis)
- Real-time orderbook (bids/asks)
- Active orders
- Recent trades (last 100)
- Session data
- Performance metrics

#### Cold Data (PostgreSQL)
- Order history (`order_history` table)
- Trade history (`trade_history` table with AMM support)
- User balances (`user_balances` table)
- User profiles

## Key API Endpoints

### Authentication
- `POST /api/auth/sync-user` - Syncs Privy user to Supabase
- `POST /api/auth/logout` - Handles user logout
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Trading V1
- `POST /api/trading/v1/orders` - Create order (basic routing)
- `GET /api/trading/v1/orders` - Get user orders
- `GET /api/trading/v1/trades` - Get trade history
- `GET /api/trading/v1/market` - Get market data
- `GET /api/trading/v1/orderbook` - Get orderbook data

### Trading V2 (Recommended)
- `POST /api/trading/v2/orders` - Create order (V2 Smart Router with chunks)

### Performance Testing
- `GET/POST /api/trading/simulator` - Mass order simulator (900+ TPS)

### System
- `GET /api/health` - Health check endpoint
- `GET /api/debug/schema` - Database schema debug
- `GET/POST /api/redis/*` - Redis management

## Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_type TEXT, -- 'email' or 'wallet'
  email TEXT,
  wallet_address TEXT,
  privy_user_id TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Order history (PostgreSQL permanent storage)
CREATE TABLE order_history (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  pair TEXT NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  order_type TEXT CHECK (order_type IN ('market', 'limit')),
  price DECIMAL(20,8),
  amount DECIMAL(20,8) NOT NULL,
  filled_amount DECIMAL(20,8) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'filled', 'cancelled', 'partial')),
  redis_order_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trade history (with AMM support)
CREATE TABLE trade_history (
  id UUID PRIMARY KEY,
  pair TEXT NOT NULL,
  buyer_order_id TEXT, -- Redis ID or 'amm'
  seller_order_id TEXT, -- Redis ID or 'amm'
  price DECIMAL(20,8) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  source TEXT CHECK (source IN ('AMM', 'Orderbook')),
  buyer_fee DECIMAL(20,8) DEFAULT 0,
  seller_fee DECIMAL(20,8) DEFAULT 0,
  price_impact DECIMAL(10,6), -- AMM only
  amm_reserves_before JSONB, -- AMM only
  amm_reserves_after JSONB, -- AMM only
  redis_trade_id TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);

-- User balances
CREATE TABLE user_balances (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token_symbol TEXT NOT NULL,
  available_balance DECIMAL(20,8) DEFAULT 0,
  locked_balance DECIMAL(20,8) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, token_symbol)
);
```

## Authentication Middleware

### Current Implementation
```typescript
// V2 Authentication (recommended)
import { extractPrivyAuthFromRequest } from '@/lib/middleware/privy-auth';

export async function POST(request: NextRequest) {
  const authResult = await extractPrivyAuthFromRequest(request);
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }
  
  const user = authResult.user; // Access user data
}

// Legacy (still works)
import { requirePrivyAuth } from '@/lib/middleware/privy-auth';

export async function GET(request: Request) {
  const authResult = await requirePrivyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Error response
  }
  
  const { user } = authResult; // Access user data
}
```

## Security Features

- **JWT Verification**: All protected routes verify Privy JWT tokens
- **Row Level Security**: Supabase RLS policies based on privy_user_id
- **Rate Limiting**: **DISABLED** in development for trading performance
- **Admin Routes**: Special protection for admin endpoints
- **Development Mode**: `Bearer dev-token` authentication bypass
- **Input Validation**: Zod schemas for all trading endpoints
- **Decimal Precision**: Custom precision handling for financial calculations

## Trading System Usage

### Basic Order Creation
```typescript
// Market Order
const marketOrder = {
  pair: 'HYPERINDEX-USDC',
  type: 'market',
  side: 'buy',
  amount: '1000'
};

// Limit Order
const limitOrder = {
  pair: 'HYPERINDEX-USDC',
  type: 'limit', 
  side: 'sell',
  amount: '500',
  price: '1.05'
};

// Submit via V2 API (recommended)
const response = await fetch('/api/trading/v2/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer dev-token' // Dev mode
  },
  body: JSON.stringify(marketOrder)
});
```

### Smart Router V2 Features
- **Automatic Chunking**: Large orders split into optimal sizes
- **Hybrid Execution**: AMM + Orderbook combination per chunk
- **Price Protection**: Orders won't execute at worse than market price
- **Real-time Routing**: Dynamic source selection per chunk
- **Performance Optimized**: Handles 900+ TPS in testing

### AMM Integration
```typescript
import { getMockAMM } from '@/lib/trading/mock-amm';

const amm = getMockAMM();

// Get current price
const price = amm.getSpotPrice('HYPERINDEX-USDC');

// Calculate swap output
const swap = amm.calculateSwapOutput('HYPERINDEX-USDC', 'buy', 1000);
console.log(`Price: ${swap.effectivePrice}, Impact: ${swap.priceImpact}%`);

// Execute swap
const result = amm.executeSwap('HYPERINDEX-USDC', 'buy', 1000);
```

## Performance Testing

### Mass Order Simulator
- Access: `/trading-simulator`
- Target: 900+ orders per second
- Features: Configurable ratios, real-time monitoring, error analysis
- Batch Processing: Adaptive batch sizes (10-200 orders)
- API: `/api/trading/simulator`

### Testing Configuration
```typescript
const config = {
  totalOrders: 10000,
  ordersPerSecond: 900,
  batchSize: 50,
  orderTypes: { market: 0.7, limit: 0.3 },
  sides: { buy: 0.5, sell: 0.5 },
  useV2Router: true
};
```

## Common Development Tasks

### Add New Trading Feature
1. Update types in `/lib/types/trading.ts`
2. Implement logic in appropriate service file
3. Add API endpoint in `/app/api/trading/`
4. Update V2 Smart Router if needed
5. Add tests via simulator

### Debug Trading Issues
1. Check Redis connectivity: `/api/redis/status`
2. Verify database schema: `/api/debug/schema`
3. Monitor real-time logs in console
4. Use test pages: `/test-hybrid-trading-v2`
5. Run performance simulator for load testing

### Working with Orderbook
```typescript
import { MatchingEngine } from '@/lib/orderbook/matching-engine';

const engine = MatchingEngine.getInstance();

// Add order to orderbook
const result = await engine.processOrder({
  id: 'order-123',
  pair: 'HYPERINDEX-USDC',
  side: 'buy',
  type: 'limit',
  price: '1.00',
  amount: '100'
});

// Get orderbook state
const orderbook = await engine.getOrderbook('HYPERINDEX-USDC', 10);
```

## Important Notes

- **Rate Limiting**: Completely disabled in development mode for performance testing
- **V2 Router**: Always use V2 endpoints for new features (better performance + chunking)
- **Decimal Precision**: Use string representations for all monetary values
- **Development Shortcuts**: `Bearer dev-token` bypasses all authentication
- **Redis Required**: Trading system requires Redis for real-time data
- **Mock AMM**: Currently uses simulated AMM, on-chain integration planned
- **Testing Focus**: Heavy emphasis on performance testing (900+ TPS capability)
- **Documentation**: Legacy docs moved to `/docs/archive/`

## ⚠️ Critical Database Guidelines

**ALWAYS check migration files before any Supabase operations:**
1. **Review all files in `/supabase/migrations/` directory**
2. **Understand exact table schemas, column names, and types**
3. **Maintain strict consistency with existing structure**
4. **Never assume column names or data types**
5. **Check for:**
   - Exact column names (e.g., `redis_order_id` not `order_id`)
   - Data types (DECIMAL vs TEXT vs UUID)
   - Constraints and defaults
   - Foreign key relationships
   - RLS policies

**Example workflow:**
```bash
# Before writing any SQL/Supabase code:
1. Check /supabase/migrations/*.sql files
2. Identify exact table structure  
3. Use EXACT column names from migrations
4. Test with small data first
```

**Common mistakes to avoid:**
- Using `order_id` instead of `redis_order_id`
- Assuming TIMESTAMP when it's TIMESTAMPTZ
- Missing required columns in INSERT statements
- Not handling NULL constraints properly

## Troubleshooting

### Trading System Issues
1. **"Redis connection failed"**: Ensure Redis is running (`npm run redis`)
2. **"Order processing failed"**: Check V2 Smart Router logs
3. **"Rate limit exceeded"**: Set `DISABLE_RATE_LIMIT=true` in development
4. **"AMM price calculation error"**: Check mock AMM reserves and formulas
5. **"Database schema error"**: Run latest migrations

### Authentication Issues
1. **"Privy client not configured"**: Ensure all Privy env vars are set
2. **"User not found in database"**: User needs to be synced via `/api/auth/sync-user`
3. **"Invalid token"**: Use `Bearer dev-token` in development

### Performance Issues  
1. **Low TPS**: Increase batch size in simulator config
2. **High response times**: Check Redis latency and database connections
3. **Memory usage**: Monitor chunk processing in V2 router
4. **Failed orders**: Check rate limiting and authentication setup

## Testing Pages

- `/test-trading` - Basic trading interface
- `/test-hybrid-trading` - V1 hybrid system test
- `/test-hybrid-trading-v2` - V2 hybrid system test (recommended)
- `/trading-simulator` - Mass order performance testing

Use these pages for development and testing of new trading features.