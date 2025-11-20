# Fullstack Cooperation Docs

**Created**: 2025-11-20
**Source**: Notion Docs Hub Export
**Purpose**: Frontend-Backend collaboration documentation for HyperIndex project

---

## 📚 Overview

This folder contains documentation exported from **Notion Docs Hub** for facilitating fullstack cooperation between frontend and backend teams. The structure follows a 5-category system designed for clear API contracts, data model alignment, and change management.

**Notion Workspace**: HyperIndex Documentation Hub

---

## 📁 Folder Structure

```
Fullstack Cooperation Docs/
├── README.md                          # This file
├── Manuals/                           # Documentation manuals & guides
│   └── FRONTEND_DOCS_PLAN.md         # Frontend docs writing plan
└── Fullstack Cooperation Docs/        # Notion export (raw)
    ├── Domain Specifications Template
    ├── Common Standards Template
    ├── API Contracts Template
    ├── Integration Guides Template
    ├── Change Management Template
    └── Fullstack Docs Hub Structure   # Main structure guide
```

---

## 🏗️ Category Structure

The Notion Docs Hub is organized into **5 main categories**:

### 📁 1. Domain Specifications (도메인별 명세)
**Purpose**: Document each page/feature domain with detailed data model comparison between frontend and backend

**Domains**:
- Landing Page
- Trade (거래)
- Discover (발견)
- Leaderboard (리더보드)
- Vote (거버넌스)
- Launch (런처)
- Portfolio (포트폴리오)
- Referrals (레퍼럴)
- Settings (설정)
- Notifications (알림)
- Wallet (지갑)

**Template**: `Domain Specifications Template.md`

**Contents**:
- Data Model Comparison (FE ↔ BE field mapping)
- API Examples (Request/Response)
- Transform Logic
- Validation Rules
- Known Issues & TODOs
- Change History

---

### 📁 2. Common Standards (공통 표준)
**Purpose**: Define shared conventions and standards across frontend and backend

**Documents**:
- Naming Conventions
- Data Types & Formats
- Error Codes & Handling
- Glossary (용어 사전)

**Template**: `Common Standards Template.md`

**Contents**:
- Naming rules (camelCase vs snake_case)
- Type conversion patterns
- Transform functions
- Date/Time handling
- Enum mapping

---

### 📁 3. API Contracts (API 계약)
**Purpose**: Document all API endpoints, WebSocket events, and API versioning strategy

**Documents**:
- REST API Specification
- WebSocket Events
- GraphQL Schema (if applicable)
- API Versioning Strategy

**Template**: `API Contracts Template.md`

**Contents**:
- Base configuration (URL, Auth, Headers)
- Endpoint specifications
- Query parameters
- Response structures
- Status codes
- Error formats

---

### 📁 4. Integration Guides (통합 가이드)
**Purpose**: Provide practical guides for integrating frontend with backend

**Documents**:
- Data Transformation Rules
- Testing Contracts
- Deployment Checklist
- Migration Guides

**Template**: `Integration Guides Template.md`

**Contents**:
- RequestTransformer (FE → BE)
- ResponseTransformer (BE → FE)
- Testing checklist (Pre/During/Post integration)
- E2E flow testing
- Rollback plans

---

### 📁 5. Change Management (변경 관리)
**Purpose**: Track changes, manage conflicts, and document decisions

**Documents**:
- Change Log (Timeline)
- Conflict Resolution Board
- Review Process
- Meeting Notes

**Template**: `Change Management Template.md`

**Contents**:
- Breaking vs Non-Breaking changes
- Decision records
- Action items tracking
- Sync meeting notes

---

## 🎯 How to Use

### For Frontend Developers:
1. **Before API Integration**:
   - Check `Domain Specifications` for your domain
   - Review `Common Standards` for naming/type conventions
   - Read `API Contracts` for endpoint specs

2. **During Development**:
   - Use `Integration Guides` for transformation logic
   - Follow `Testing Contracts` checklist
   - Document issues in domain spec's "Known Issues"

3. **After Changes**:
   - Update `Change Log` with modifications
   - Add entries to domain spec's "Change History"
   - Update `Meeting Notes` if discussed

### For Backend Developers:
1. **Before API Development**:
   - Review domain spec for required fields
   - Check validation rules
   - Coordinate on data types

2. **When API Changes**:
   - Update `API Contracts` documentation
   - Add to `Change Log` (Breaking vs Non-Breaking)
   - Notify frontend team via Change Management

3. **Before Deployment**:
   - Follow `Deployment Checklist`
   - Confirm data migration plan
   - Prepare rollback strategy

---

## 📋 Current Status

| Category | Status | Priority |
|----------|--------|----------|
| Domain Specifications | 🔴 Templates Only | High |
| Common Standards | 🔴 Templates Only | High |
| API Contracts | 🔴 Templates Only | High |
| Integration Guides | 🔴 Templates Only | Medium |
| Change Management | 🔴 Templates Only | Low |

**Next Action**: Begin Phase 1 documentation (Trade, Launch, Portfolio domains)

See `Manuals/FRONTEND_DOCS_PLAN.md` for detailed writing plan.

---

## 🚀 Getting Started

### 1. Set Up Notion Workspace
- Import templates to Notion
- Create Database for Domain Specifications
- Set up Timeline view for Change Log

### 2. Start with Core Domains (Phase 1)
Priority order:
1. Trade Domain (highest priority)
2. Launch Domain
3. Portfolio Domain
4. Common Standards (Naming, Types)

### 3. Coordinate with Backend
- Schedule sync meetings
- Align on API contracts
- Document decisions

---

## 📌 Important Notes

- **All templates are in Korean/English mix**: Adjust language as needed
- **Notion is source of truth**: This folder is export/backup
- **Update regularly**: Export from Notion after major changes
- **Reference existing code**: Use `lib/types/*.ts` for current data models
- **Migration reference**: See `BACKEND_INTEGRATION_CHECKLIST.md` in `/docs/backend/`

---

## 🔗 Related Documentation

**Project Root**:
- `/CLAUDE.md` - Development environment
- `/docs/README.md` - Documentation overview
- `/docs/handover/HANDOVER.md` - Latest development sessions

**Backend Integration**:
- `/docs/backend/BACKEND_INTEGRATION_CHECKLIST.md`
- `/docs/backend/BACKEND_DATA_REQUIREMENTS.md`

**Planning**:
- `/docs/planning/` - Feature planning docs
- `/docs/planning/Backend Integration/MOCK_TO_BACKEND_MIGRATION.md`

---

## 📞 Contact

**Frontend Lead**: @김현
**Documentation**: Notion HyperIndex Docs Hub

---

*Last Updated: 2025-11-20*
