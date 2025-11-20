# Frontend Fullstack Cooperation Docs - Writing Plan

**Created**: 2025-11-20
**Status**: Planning - Not Started
**Purpose**: Manual for writing frontend documentation in Fullstack Cooperation Docs

---

## 📋 Overview

This document outlines the plan for creating frontend documentation in the Fullstack Cooperation Docs structure. The documentation will follow the 5-category structure established in Notion.

---

## 📁 1. Domain Specifications (도메인별 명세)

**Priority-based Writing Order**:

### High Priority (Backend Integration Required)

#### 1. Trade Domain - Trading System
- **Data**: Index prices, orderbook, trade history
- **API**: `/api/indices/:id/price`, `/api/orders`, `/api/trades`
- **Realtime**: WebSocket price updates, orderbook updates
- **Types Reference**: `lib/types/trading.ts`, `lib/types/index-trading.ts`

#### 2. Launch Domain - Index Launcher
- **Data**: Token selection, weighting, rebalancing
- **API**: `/api/launch/indices`, `/api/launch/assets`
- **Validation**: Token count, weight sum, fee calculation
- **Types Reference**: `lib/types/launch.ts`

#### 3. Portfolio Domain - Portfolio Management
- **Data**: Held indices, PnL, transaction history
- **API**: `/api/portfolio`, `/api/positions`
- **Calculations**: Total value, ROI, asset distribution
- **Types Reference**: `lib/types/index.ts`

#### 4. Vote Domain - Governance
- **Data**: Proposal list, voting status, voting power
- **API**: `/api/governance/proposals`, `/api/governance/votes`
- **States**: Draft → Active → Ended → Executed
- **Types Reference**: `lib/types/governance.ts`

### Medium Priority (Feature Completion)

#### 5. Discover Domain - Index Discovery/Search
- **Data**: Index list, filters, sorting
- **API**: `/api/indices/search`, `/api/indices/trending`
- **Filters**: Category, performance, volume
- **Types Reference**: `lib/types/discover.ts`

#### 6. Leaderboard Domain - Trader Leaderboard
- **Data**: Trader rankings, statistics, profiles
- **API**: `/api/leaderboard`, `/api/traders/:id`
- **Metrics**: ROI, Volume, Win Rate

#### 7. Notifications Domain - Notification System
- **Data**: Notification list, read status, settings
- **API**: `/api/notifications`, `/api/notifications/settings`
- **Types**: Trade, Governance, System
- **Types Reference**: `lib/types/notifications.ts`

### Low Priority (Additional Features)

#### 8. Referrals Domain - Referral Program
- **Data**: Referral code, rewards, statistics
- **API**: `/api/referrals`, `/api/referrals/rewards`

#### 9. Settings Domain - User Settings
- **Data**: Profile, preferences, notification settings
- **API**: `/api/user/settings`, `/api/user/preferences`

#### 10. Wallet Domain - Wallet Integration
- **Data**: Wallet address, balance, network
- **API**: `/api/wallet/balance`, `/api/wallet/connect`
- **Auth**: Privy authentication flow

#### 11. Landing Page - Main Landing Page
- **Data**: Featured indices, top traders, global stats
- **API**: `/api/indices/featured`, `/api/stats/global`

---

## 📁 2. Common Standards (공통 표준)

### Documents to Write:

#### 1. Naming Conventions
- **Frontend**: camelCase (TypeScript)
- **Backend**: snake_case (Python/PostgreSQL)
- **Conversion**: Auto-conversion function definitions

#### 2. Data Types & Formats
- **Money**: `number` (FE) ↔ `Decimal` (BE) → JSON string
- **Date**: `Date` (FE) ↔ `datetime` (BE) → ISO 8601
- **UUID**: `string` (FE) ↔ `UUID` (BE)
- **Enum**: TypeScript enum ↔ Python Enum → uppercase string

#### 3. Error Codes & Handling
- Standard error format definition
- HTTP status code rules
- Error message internationalization

#### 4. Glossary (용어 사전)
- Business term unification
- FE/BE term mapping table
- Example: `totalValue` vs `tvl` vs `total_value`

---

## 📁 3. API Contracts (API 계약)

### Documents to Write:

#### 1. REST API Specification
- **Base URL**: `https://api.hyperindex.io/v1`
- **Auth**: Bearer Token (Privy JWT)
- **Response Format**: `{ data, meta, error }`
- **Pagination**: `page`, `limit`, `total`, `total_pages`

#### 2. WebSocket Events
- Real-time price updates
- Orderbook changes
- Notification push
- Governance state changes

#### 3. API Versioning Strategy
- v1: Current version
- Breaking change handling
- Deprecation policy

#### 4. Endpoint Index
- All API endpoints list
- Grouping by domain
- Status: Implemented, Planned, Deprecated

---

## 📁 4. Integration Guides (통합 가이드)

### Documents to Write:

#### 1. Data Transformation Rules
- **RequestTransformer** (FE → BE)
  - camelCase → snake_case
  - Date → ISO string
  - Enum → uppercase
- **ResponseTransformer** (BE → FE)
  - snake_case → camelCase
  - ISO string → Date
  - Decimal string → number

#### 2. Testing Contracts
- Pre-integration checklist
- API mocking strategy (MSW)
- E2E test scenarios

#### 3. Deployment Checklist
- Environment variables check
- API endpoint changes
- Data migration
- Rollback plan

#### 4. Migration Guide: Mock → Backend
- Reference: `MOCK_TO_BACKEND_MIGRATION.md`
- Phase-by-phase migration plan
- Data transformation logic

---

## 📁 5. Change Management (변경 관리)

### Documents to Write:

#### 1. Change Log (Timeline)
- Breaking Changes tracking
- Non-Breaking Changes
- Decisions Made (decision records)

#### 2. Conflict Resolution Board
- FE/BE mismatch issue tracking
- Solution discussion
- Priority matrix

#### 3. Review Process
- API change review process
- Approval flow
- Communication channels

#### 4. Meeting Notes
- Regular sync meeting records
- Action Items tracking
- Next Steps

---

## 🎯 Writing Priority (Phase-based)

### Phase 1: Core Domains (Week 1-2)
- [ ] Trade Domain Spec
- [ ] Launch Domain Spec
- [ ] Portfolio Domain Spec
- [ ] Common Standards (Naming, Types)
- [ ] REST API Specification (basic structure)

### Phase 2: Feature Completion (Week 3-4)
- [ ] Vote Domain Spec
- [ ] Discover Domain Spec
- [ ] Leaderboard Domain Spec
- [ ] WebSocket Events Spec
- [ ] Data Transformation Rules

### Phase 3: Additional Features (Week 5+)
- [ ] Notifications Domain Spec
- [ ] Settings, Referrals, Wallet Specs
- [ ] Testing Contracts
- [ ] Deployment Checklist
- [ ] Change Management process establishment

---

## 📊 Document Structure (Notion Database Properties)

Add these properties to each Domain Spec document:

| Property | Type | Options |
|----------|------|---------|
| **Status** | Select | 🔴 Not Started, 🟡 In Progress, 🟢 Aligned |
| **Priority** | Select | High, Medium, Low |
| **Owner (FE)** | Person | @김현 |
| **Owner (BE)** | Person | @백엔드팀 |
| **Last Updated** | Date | Auto |
| **Phase** | Select | Phase 1, Phase 2, Phase 3 |
| **API Endpoint** | URL | Link to API doc |
| **Type Count** | Number | Number of type fields |

---

## 💡 Writing Tips

### When Writing Domain Specs:
1. Reference current project's `lib/types/*.ts` files
2. Map with backend API specs
3. Base on actual data structures used in components

### When Writing API Contracts:
1. Reference existing `BACKEND_INTEGRATION_CHECKLIST.md`
2. Analyze current routes in `/app/api/` folder
3. Coordinate actual endpoints with backend team

### When Writing Transform Rules:
1. Reference `lib/utils/index-converter.ts`
2. Write auto-conversion utility functions
3. Include unit tests

---

## 📌 Next Steps

1. Create folder structure in Notion matching the 5 categories
2. Set up Database properties for Domain Specifications
3. Start with Phase 1: Trade Domain Spec
4. Coordinate with backend team for API alignment
5. Document as integration progresses

---

**Template Location**: `docs/Fullstack Cooperation Docs/Fullstack Cooperation Docs/`
**Reference**: Notion export - Domain Specifications Template
