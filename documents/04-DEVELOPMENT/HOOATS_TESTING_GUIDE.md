# HOOATS Complete Testing Guide
*Created: 2025-08-20*

## Overview
Complete testing suite for HOOATS (HyperIndex Optimized Automated Trading System) with real deployed contracts, performance validation, security testing, and production readiness assessment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Test Suite Overview](#test-suite-overview)
3. [Individual Test Scripts](#individual-test-scripts)
4. [Full System Integration Test](#full-system-integration-test)
5. [Performance Benchmarks](#performance-benchmarks)
6. [Security Validation](#security-validation)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. Environment Setup
```bash
# 1. Install dependencies
npm install

# 2. Start Redis (required for Lua Scripts and orderbook)
npm run redis
# OR manually: redis-server --requirepass hyperindex_secure_password

# 3. Start Real HOOATS API Server
node standalone-api-real.cjs
# Server should run on http://localhost:3002

# 4. Verify deployment contracts
cat deployment-998-manual.json
# Should show all deployed contract addresses on HyperEVM testnet
```

### 2. Environment Variables
Copy and configure the environment template:
```bash
cp config/env.example .env.local
# Edit .env.local with your actual values:
# - TRADING_WALLET_PRIVATE_KEY (testnet wallet only!)
# - REDIS settings
# - Contract addresses (auto-populated from deployment-998-manual.json)
```

### 3. Network Access
- Ensure connection to HyperEVM testnet: `https://rpc.hyperliquid-testnet.xyz/evm`
- Redis server accessible on localhost:6379
- HOOATS API server running on port 3002

## Test Suite Overview

### Available Test Scripts

| Script | Purpose | Target | Duration |
|--------|---------|--------|----------|
| `test-real-contracts-integration.js` | Real contract integration | AMM + API | 2-3 min |
| `test-lua-script-performance.js` | Redis Lua Scripts | Performance | 1-2 min |
| `test-mev-security.js` | MEV attack protection | Security | 3-5 min |
| `test-full-system-integration.js` | Complete end-to-end | All systems | 5-10 min |

## Individual Test Scripts

### 1. Real Contracts Integration Test
Tests HOOATS integration with actual deployed AMM contracts.

```bash
# Run real contracts integration test
node scripts/test-real-contracts-integration.js

# Expected output:
# ✅ Health Check (Real Contracts) (500ms)
# ✅ Redis Connectivity (Real System) (200ms) 
# ✅ Real AMM Price Quoting (2.5s)
# ✅ Limit Order (Real Contracts) (800ms)
# ✅ Orderbook (Real Data) (300ms)
# ✅ Market Data (Real Contracts) (400ms)
```

**What it tests:**
- Connection to deployed contracts (`deployment-998-manual.json`)
- V2 Smart Router with real AMM integration
- Large order chunking and routing
- Limit/Market order processing
- Orderbook and market data consistency

### 2. Redis Lua Script Performance Test
Validates Redis Lua Scripts for atomic operations and performance.

```bash
# Run Lua script performance test
node scripts/test-lua-script-performance.js

# Expected output:
# ✅ Lua Script Basic Operation (50ms)
# ✅ Lua Script Order Matching (150ms)
# ✅ HOOATS Lua Script Integration (1.2s)
# ✅ Lua vs JavaScript Performance (800ms)
```

**What it tests:**
- Basic Lua script execution
- Order matching algorithms in Lua
- HOOATS integration with Lua scripts
- Performance comparison: Lua vs JavaScript

### 3. MEV Security & Attack Defense Test
Validates security features against MEV attacks.

```bash
# Run MEV security test
node scripts/test-mev-security.js

# Expected output:
# ✅ Sandwich Attack Detection (2.1s) - Security: HIGH
# ✅ Front-Running Protection (1.5s) - Security: HIGH  
# ✅ Price Manipulation Resistance (2.8s) - Security: MEDIUM
# ✅ SecureTPSEngine Validation (1.9s) - Security: HIGH
# ✅ Cross-System Validation (1.2s) - Security: HIGH
```

**What it tests:**
- Sandwich attack detection and prevention
- Front-running protection mechanisms  
- Price manipulation resistance
- High-frequency spam protection (SecureTPSEngine)
- Cross-system data validation

## Full System Integration Test

### Complete End-to-End Testing
Runs all test suites plus performance benchmark for comprehensive validation.

```bash
# Run complete integration test
node scripts/test-full-system-integration.js

# Expected output:
# 🎯 Running Test Suite: Real Contracts Integration
# ✅ Real Contracts Integration completed: 6/6 tests passed
# 
# 🎯 Running Test Suite: Lua Script Performance  
# ✅ Lua Script Performance completed: 4/4 tests passed
#
# 🎯 Running Test Suite: MEV Security
# ✅ MEV Security completed: 5/5 tests passed
#
# 🏃‍♂️ Running Performance Benchmark...
# 📈 Performance Results:
#    Actual TPS: 13,547
#    Target TPS: 15,000
#    Performance Score: 90.3%
#
# 🎯 Overall Score: 88.5% - STAGING_READY
```

## Performance Benchmarks

### TPS (Transactions Per Second) Targets
- **Target**: 15,000-20,000 TPS
- **Current Achievement**: 13,000+ TPS
- **Minimum Acceptable**: 10,000 TPS

### Performance Test Configuration
```javascript
const benchmarkConfig = {
  targetTPS: 15000,
  testDuration: 30, // seconds
  orderTypes: { market: 0.6, limit: 0.4 },
  sides: { buy: 0.5, sell: 0.5 }
};
```

### Performance Scoring
- **90-100%**: Excellent (Production Ready)
- **75-89%**: Good (Staging Ready)  
- **60-74%**: Acceptable (Development Ready)
- **<60%**: Needs Improvement

## Security Validation

### Security Test Categories

#### 1. Sandwich Attack Detection
- **Test**: Rapid front-run → victim → back-run sequence
- **Expected**: 66%+ detection rate
- **Security Level**: HIGH if >66%, MEDIUM if >33%, LOW if <33%

#### 2. Front-Running Protection  
- **Test**: Rapid sequential orders with price advantage
- **Expected**: Time-based or signature-based protection active
- **Security Level**: HIGH if protected, MEDIUM otherwise

#### 3. Price Manipulation Resistance
- **Test**: Large orders attempting to move market price
- **Expected**: <5% price impact for large orders
- **Security Level**: HIGH if <5%, MEDIUM if <15%, LOW if >15%

#### 4. High-Frequency Spam Protection
- **Test**: 10 rapid orders in quick succession  
- **Expected**: >70% blocked by rate limiting
- **Security Level**: HIGH if >70% blocked

### Overall Security Scoring
- **80-100%**: HIGH Security (Production Ready)
- **60-79%**: MEDIUM Security (Review Needed)
- **<60%**: LOW Security (Major Issues)

## Readiness Assessment

### Production Readiness Levels

#### PRODUCTION_READY (90%+ Overall Score)
- ✅ All core tests passing
- ✅ Performance >90% of target (13.5K+ TPS)
- ✅ Security score >80%
- ✅ No critical failures

#### STAGING_READY (75-89% Overall Score)  
- ✅ Core functionality working
- 🔸 Performance 75-90% of target (11.25-13.5K TPS)
- 🔸 Security score 60-80%
- 🔸 Minor optimizations needed

#### DEVELOPMENT_READY (60-74% Overall Score)
- 🔸 Basic functionality working
- ❌ Performance <75% of target (<11.25K TPS)
- ❌ Security issues present
- 🛠️ Significant work needed

#### NOT_READY (<60% Overall Score)
- 🔴 Critical functionality failures
- 🔴 Major performance issues
- 🔴 Security vulnerabilities
- 🚨 Do not deploy

## Troubleshooting

### Common Issues

#### 1. "HOOATS API server not running"
```bash
# Check if server is running
curl http://localhost:3002/api/health

# If not running, start it:
node standalone-api-real.cjs
```

#### 2. "Redis connection failed"  
```bash
# Check Redis status
redis-cli ping
# Should return: PONG

# If not running:
redis-server --requirepass hyperindex_secure_password

# Or use npm script:
npm run redis
```

#### 3. "Contract addresses not found"
```bash
# Verify deployment file exists
cat deployment-998-manual.json

# Should show all contract addresses like:
# "router": "0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A"
```

#### 4. "TypeScript compilation errors"
```bash
# Use JavaScript version instead
node scripts/test-real-contracts-integration.js
# NOT: npm run test (which might try TypeScript)
```

#### 5. "Performance below target"
```bash
# Check system resources
htop  # CPU usage
free -h  # Memory usage

# Restart Redis for fresh state
redis-cli FLUSHALL
npm run redis

# Restart HOOATS server
pkill node
node standalone-api-real.cjs
```

### Expected Test Outputs

#### Successful Integration Test
```
🚀 HOOATS Full System Integration Test Report
================================================================================================
⏰ Executed: 2025-08-20T10:30:00.000Z  
🎯 Overall Score: 88.5% - STAGING_READY

📋 Test Results Summary:
   Total Tests: 15
   Passed: 14 (93.3%)
   Failed: 1
   Performance Score: 90.3%  
   Security Score: 85.7%

🎉 GOOD! System is STAGING_READY
✅ Core functionality working
🔸 Performance approaching targets  
🔸 Security adequate
📋 Minor optimizations needed for production
```

#### Failed Integration Test
```
❌ System is NOT READY
🔴 Critical issues detected:
   - 3/15 tests failed
   - Performance: 45.2% of target
   - Security: 40% score  
🚨 Do not deploy to production

💡 Recommendations:
   🔧 Fix failing tests before deployment
   🔧 Optimize performance - target 15-20K TPS
   🛡️ Strengthen security measures
```

## Next Steps

### For PRODUCTION_READY Systems
1. ✅ Deploy to staging environment
2. ✅ Run load testing with real traffic patterns
3. ✅ Conduct security audit  
4. ✅ Prepare production deployment

### For STAGING_READY Systems
1. 🔧 Optimize performance (target >13.5K TPS)
2. 🛡️ Address security recommendations
3. 🧪 Re-run integration tests
4. 📋 Review failed test cases

### For Development Systems  
1. 🐛 Fix critical test failures
2. ⚡ Performance optimization (Redis, Lua Scripts)  
3. 🛡️ Implement security enhancements
4. 🔄 Iterative testing and improvement

---

## Contact & Support

For issues with testing or deployment:
1. Check troubleshooting section above
2. Review test logs in generated JSON reports  
3. Verify all prerequisites are met
4. Consider running individual test scripts to isolate issues

**Remember**: Always test on HyperEVM testnet before mainnet deployment!