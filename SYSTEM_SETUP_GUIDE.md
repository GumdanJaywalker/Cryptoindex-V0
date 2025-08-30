# 🔧 Real System Setup Guide

## Overview
This guide sets up ALL real systems required for HOOATS trading engine - no mocks, no bypasses, real production-ready infrastructure.

## 1. Redis Setup (Required)

### Install Redis Server
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install redis-server

# macOS with Homebrew
brew install redis

# Windows WSL
sudo apt install redis-server
```

### Start Redis Server
```bash
# Start Redis server
redis-server

# Or start as service (Linux)
sudo systemctl start redis-server
sudo systemctl enable redis-server

# macOS
brew services start redis
```

### Verify Redis Connection
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Set Redis URL environment variable
export REDIS_URL=redis://localhost:6379
```

## 2. Supabase Database Setup (Required)

### Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Get your project URL and keys

### Set Environment Variables
```bash
# Add to your .env.local or export
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema
Ensure these tables exist in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_type TEXT,
  email TEXT,
  wallet_address TEXT,
  privy_user_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order history table  
CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pair TEXT NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  order_type TEXT CHECK (order_type IN ('market', 'limit')),
  price DECIMAL(20,8),
  amount DECIMAL(20,8) NOT NULL,
  filled_amount DECIMAL(20,8) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'filled', 'cancelled', 'partial')),
  redis_order_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade history table
CREATE TABLE trade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair TEXT NOT NULL,
  buyer_order_id TEXT,
  seller_order_id TEXT,
  price DECIMAL(20,8) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  source TEXT CHECK (source IN ('AMM', 'Orderbook')),
  buyer_fee DECIMAL(20,8) DEFAULT 0,
  seller_fee DECIMAL(20,8) DEFAULT 0,
  price_impact DECIMAL(10,6),
  amm_reserves_before JSONB,
  amm_reserves_after JSONB,
  redis_trade_id TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User balances table
CREATE TABLE user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_symbol TEXT NOT NULL,
  available_balance DECIMAL(20,8) DEFAULT 0,
  locked_balance DECIMAL(20,8) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token_symbol)
);
```

## 3. HyperEVM Wallet Setup (Required)

### Private Key Configuration
```bash
# Set your real private key (NEVER commit this)
export PRIVATE_KEY=your_actual_private_key_here

# Verify wallet has HYPE balance for gas
# Check balance at: https://explorer.hyperliquid-testnet.xyz
```

## 4. Complete Environment Setup

### Create .env.local file
```env
# Redis
REDIS_URL=redis://localhost:6379

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# HyperEVM
PRIVATE_KEY=your_private_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
DISABLE_RATE_LIMIT=true
```

## 5. System Verification Commands

### Test All Systems
```bash
# 1. Test Redis
redis-cli ping

# 2. Test Supabase connection
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/users?select=count"

# 3. Test HyperEVM connection  
curl -X POST https://rpc.hyperliquid-testnet.xyz/evm \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# 4. Test complete system
node test-complete-real-trading.js
```

## 6. Production Checklist

Before running real trading tests:

- [ ] Redis server running and accessible
- [ ] Supabase project created with all tables
- [ ] Environment variables properly set
- [ ] Private key has HYPE balance for gas
- [ ] HyperEVM RPC endpoint responsive
- [ ] All database migrations applied
- [ ] No mock components in use

## 7. Troubleshooting

### Redis Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Check Redis logs
sudo journalctl -u redis-server

# Reset Redis data
redis-cli FLUSHALL
```

### Supabase Issues
```bash
# Test connection
curl -I $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# Check table exists
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/users?select=count"
```

### HyperEVM Issues
```bash
# Test RPC endpoint
curl -X POST https://rpc.hyperliquid-testnet.xyz/evm \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check wallet balance
# Use: https://explorer.hyperliquid-testnet.xyz/address/YOUR_ADDRESS
```

## 8. Success Criteria

System is ready when:
1. All verification commands return success
2. No connection errors in logs
3. Real trading test executes without mocks
4. Database operations complete successfully
5. On-chain transactions can be submitted

**Remember: NO MOCKS - Fix real issues with real solutions!**