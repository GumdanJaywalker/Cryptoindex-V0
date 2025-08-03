# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**HyperIndex** - A hybrid decentralized exchange for meme coin index tokens on HyperEVM, combining AMM liquidity pools with off-chain orderbook for CEX-like trading experience. The platform tracks external memecoins (DOGE, PEPE, SHIB, etc.) through oracle price feeds without holding actual tokens.

## Tech Stack
- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Authentication**: Privy (email OTP + wallet connections)
- **Database**: Supabase with Row Level Security
- **Smart Contracts**: HyperEVM (Solidity)
- **Trading Engine**: Hybrid AMM + Off-chain Orderbook
- **Price Oracles**: Chainlink for external meme coin prices
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: TailwindCSS with CSS modules

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (Note: ESLint config needs setup)
npm run lint
```

## Project Structure

```
/app                    # Next.js App Router
  /api                  # API routes
    /auth              # Authentication endpoints
    /user              # User management endpoints
  /dashboard           # Protected dashboard page
  /privy-login        # Login page
/components
  /auth               # Authentication components
  /providers          # Context providers (PrivyProvider)
  /ui                 # shadcn/ui components (50+ components)
/lib
  /auth               # JWT verification (privy-jwt.ts)
  /middleware         # Authentication middleware
  /privy              # Privy configuration
  /supabase           # Database client and types
/supabase              # Database schema and migrations
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

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

## Key API Endpoints

- `POST /api/auth/sync-user` - Syncs Privy user to Supabase
- `POST /api/auth/logout` - Handles user logout
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `GET /api/health` - Health check endpoint

## Database Schema

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

-- User wallets (for email users)
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  privy_user_id TEXT,
  embedded_wallet_address TEXT,
  encrypted_private_key TEXT,
  created_at TIMESTAMP
);
```

## Authentication Middleware

Protected routes use the Privy JWT verification middleware:
```typescript
// Usage in API routes
import { verifyPrivyAuth } from '@/lib/middleware/privy-auth';

export async function GET(request: Request) {
  const authResult = await verifyPrivyAuth(request);
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  // Access authResult.user for authenticated user data
}
```

## Security Features

- **JWT Verification**: All protected routes verify Privy JWT tokens
- **Row Level Security**: Supabase RLS policies based on privy_user_id
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Admin Routes**: Special protection for admin endpoints
- **Development Mode**: Shortcuts available in development

## Common Development Tasks

### Add a New Protected API Route
1. Create route file in `/app/api/your-route/route.ts`
2. Import and use `verifyPrivyAuth` middleware
3. Access user data from `authResult.user`

### Update User Profile in Database
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ field: value })
  .eq('privy_user_id', privyUserId);
```

### Work with Privy Client
```typescript
import { usePrivy } from '@privy-io/react-auth';

const { ready, authenticated, user, login, logout } = usePrivy();
```

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

### Our Project Strategy
- **HyperEVM Native**: We operate exclusively on HyperEVM
- **ERC-20 Only**: All tokens are standard ERC-20 contracts
- **No HyperCore Integration**: We ignore HyperCore features to avoid costs
- **Future Expansion**: Can add HyperCore features later if budget allows

### Hybrid Trading Model
- **AMM (Automated Market Maker)**: On-chain liquidity pools for INDEX/USDC pairs
- **Off-chain Orderbook**: CEX-style limit orders stored off-chain, executed on-chain
- **Smart Router**: Automatically routes orders through optimal path (AMM vs Orderbook)

### Key Features
- **No Dutch Auction Required**: Deploy directly on HyperEVM without HyperCore costs
- **Cost Effective**: Avoid $40M+ costs associated with HyperCore features
- **EVM Compatible**: Use standard Ethereum tooling and patterns
- **Gasless Trading**: Session-based authentication for seamless UX
- **Real-time Updates**: WebSocket for orderbook and price updates

## Important Notes

- **No Backend Directory**: Unlike initial plans, this uses Next.js API routes
- **No Testing Setup**: Tests need to be configured (Jest/Vitest recommended)
- **ESLint/TypeScript Errors Ignored**: Build warnings are suppressed in next.config.mjs
- **Privy Handles Complexity**: Wallet creation, encryption, and MFA are managed by Privy
- **Development Shortcuts**: In dev mode, you can use Bearer token "dev-token" to bypass auth

## Troubleshooting

1. **"Privy client not configured"**: Ensure all Privy env vars are set
2. **"User not found in database"**: User needs to be synced via /api/auth/sync-user
3. **CORS errors**: Check CORS configuration matches your domain
4. **Rate limit exceeded**: Wait or use different IP in development