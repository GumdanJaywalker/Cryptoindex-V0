# 2025OCT04 - Planning Documents

> 📅 **Period**: 2025년 10월 4주차 (October Week 4)
> 🎯 **Focus**: Phase 0 Launch Preparation - Currency System, Security, Launch Page

---

## 📋 Documents in This Folder

### 1. FEE_STRUCTURE_SPECIFICATION.md ⭐ NEW
**Purpose**: Complete fee structure documentation based on business model

**Key Topics**:
- VIP tier system (VIP0-VIP4) with protocol fees 0.3%-0.6%
- Layer-specific fee breakdown (L1/L2/L3/VS/Partner)
- Revenue projections ($686.9M total)
- AUM calculations by layer
- Implementation checklist for code changes

**Impact**: All pages with trading/fees (Trading, Portfolio, Launch, Discover)

---

### 2. TASK_PRIORITY.md ⭐ NEW
**Purpose**: Comprehensive task priority document for Phase 0 beta launch

**Key Topics**:
- Week-by-week execution plan (Week 4-7)
- 11 major tasks with detailed checklists
- Fee Structure integration across all pages
- Trading page Info/Trading Data tabs specification
- Governance structure redesign (TGE DAO vs Index Token Governance)

**Impact**: All development work coordination

---

### 3. CURRENCY_SYSTEM_REFACTORING.md
**Purpose**: Phase 0 → Phase 1 currency system transition planning

**Key Topics**:
- Mock API Layer architecture
- HYPE-only currency for Phase 0
- Backend integration preparation
- Component relationship mapping

**Impact**: All pages with currency display (Trading, Portfolio, Launch, Discover, Governance, Settings)

---

### 4. FRONTEND_SECURITY_ATTACK_SCENARIOS.md
**Purpose**: Phase 0 minimal security strategy (0 cost, 3 hours)

**Key Topics**:
- SQL injection and XSS prevention
- Input sanitization approach
- Rejected alternatives (Uniswap-style CSP, professional audit)
- Reference security analysis (Hyperliquid, Uniswap, Aave)

**Impact**: All pages with user input (Launch, Governance search, Settings)

---

### 5. LAUNCH_PAGE_REFACTORING.md
**Purpose**: Comprehensive Launch page refactoring based on 19 feedback items

**Key Topics**:
- Real-time cost calculation with fee breakdown
- Asset search bug fix and enhanced discovery
- Backtesting (renamed from Preview) with Sharpe Ratio + MDD
- Auto-swap mechanism (remove inline swap)
- Share functionality with social integration

**Impact**: Launch page, integration with Portfolio, Discover, Trading, Docs pages

---

### 6. DISCOVER_PAGE_TASK_PLAN.md ⭐ NEW
**Purpose**: Discover page improvements based on 11 feedback items (Henry, Oct 25)

**Key Topics**:
- Search logic enhancement (name/ticker only, no emoji validation)
- Dynamic category criteria (Hot/New/Gainers/Losers with defined formulas)
- Brand color standardization (profit/loss softer tones + mint variations)
- Composition filter redesign (scrollable + searchable)
- Slider UX for ranges (Performance, NAV, Volume, Liquidity)
- Segment Filter (MEME, DeFi, Solana, RWA, AI, etc.)
- Reusable components (RangeSlider, AssetSearchList)

**Impact**: Discover page + Launch page (shared components)

---

## 🔗 Cross-Document Relationships

```
FEE_STRUCTURE_SPECIFICATION (foundation)
    ↓ (provides fee calculation logic)
TASK_PRIORITY (coordination)
    ↓ (organizes all tasks)
CURRENCY_SYSTEM_REFACTORING
    ↓ (provides currency display standards)
LAUNCH_PAGE_REFACTORING ←→ DISCOVER_PAGE_TASK_PLAN
    ↓ (share components, require security)      ↑ (shared: RangeSlider, AssetSearchList)
FRONTEND_SECURITY_ATTACK_SCENARIOS
```

**Integration Points**:
- Fee Structure is foundation for Trading, Portfolio, Launch pages
- Task Priority coordinates all documents and implementation order
- Currency System provides HYPE-only display standard
- **Launch ↔ Discover**: Share RangeSlider, AssetSearchList components, identical asset data
- Launch + Discover use Fee Structure + Currency System + Security
- All documents coordinate for Phase 0 beta launch

---

## 🎯 Week 4 Priorities

1. **Fee Structure** ⭐: Implement VIP tier and layer-specific fees (highest priority)
2. **Currency System**: Prepare for Phase 0 with HYPE-only display
3. **Security**: Implement basic input sanitization (3 hours)
4. **Launch Page Phase 1**: Quick wins (Backtesting rename, Sharpe/MDD, modal fixes)

---

## 📊 Status Summary

| Document | Status | Next Actions |
|----------|--------|--------------|
| Fee Structure | ✅ Planned | Rewrite `lib/constants/fees.ts` and `lib/utils/fees.ts` |
| Task Priority | ✅ Planned | Execute Week 4 tasks in order |
| Currency System | ✅ Planned | Implement Mock API Layer |
| Security | ✅ Planned | Add `sanitizeInput()` and `validateNumber()` utils |
| Launch Page | 🟢 Phase 1-3 & 4-6 Complete | Fee Structure integration (next) |
| Discover Page | ✅ Planned | Phase 1: Reference research, color constants (Week 5-6) |

---

## 📋 Recent Completions (Nov 11)

**Launch Page Phase 2-3**:
- Auto-rounding tolerance: ±0.05%
- Backtesting periods: 1y, all
- Dynamic Y-axis scaling
- Chart height & margin fixes
- Mock data volatility: ±10%
- Critical bug fix: baseValue from totalAmount

**Trading Integration Phase 4-6**:
- IndexDetailsModal link fix
- Query param handling
- Bonding Curve conditional UI

---

*Last Updated: 2025-11-11*
