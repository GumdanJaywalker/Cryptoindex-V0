# Fullstack Docs Hub Structure

생성자: 현 김
생성 일시: 2025년 11월 20일 오후 3:34
카테고리: ‎메모/브레인스토밍
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:51

# 📚 HyperIndex 문서 허브 카테고리 구조

🏠 Documentation Hub (Main Page)

│

├── 📊 Quick Dashboard

│   └── 전체 동기화 상태 대시보드

│

├── 📁 1. Domain Specifications (도메인별 명세)

│   ├── 📄 Landing Page

│   ├── 📄 Trade

│   ├── 📄 Discover

│   ├── 📄 Leaderboard

│   ├── 📄 Vote

│   ├── 📄 Launch

│   ├── 📄 Portfolio

│   ├── 📄 Referrals

│   ├── 📄 Settings

│   ├── 📄 Notifications

│   └── 📄 Wallet

│

├── 📁 2. Common Standards (공통 표준)

│   ├── 📄 Naming Conventions

│   ├── 📄 Data Types & Formats

│   ├── 📄 Error Codes & Handling

│   └── 📄 Glossary (용어 사전)

│

├── 📁 3. API Contracts (API 계약)

│   ├── 📄 REST API Specification

│   ├── 📄 WebSocket Events

│   ├── 📄 GraphQL Schema (if applicable)

│   └── 📄 API Versioning Strategy

│

├── 📁 4. Integration Guides (통합 가이드)

│   ├── 📄 Data Transformation Rules

│   ├── 📄 Testing Contracts

│   ├── 📄 Deployment Checklist

│   └── 📄 Migration Guides

│

└── 📁 5. Change Management (변경 관리)

├── 📄 Change Log (Timeline)

├── 📄 Conflict Resolution Board

├── 📄 Review Process

└── 📄 Meeting Notes

---

# 📝 카테고리별 템플릿

## 1️⃣ Domain Specifications Template

```markdown
# [Domain Name] 도메인 명세

## 📌 Overview

**Purpose**: [이 도메인의 목적과 범위]
**Status**: 🔴 Not Started | 🟡 In Progress | 🟢 Aligned
**Priority**: High | Medium | Low
**Last Updated**: 2024-11-19
**Owners**:
- Frontend: [이름]
- Backend: [이름]

## 🔗 Related Resources

- API Endpoints: `/api/...`
- Figma: [Link]
- PRD: [Link]

## 📊 Data Model Comparison

### Core Fields

| Description | Frontend Key | Backend Key | FE Type | BE Type | Status | Transform |
|------------|--------------|-------------|---------|---------|--------|-----------|
| 고유 식별자 | id | id | string | UUID | ✅ Aligned | - |
| 생성 일시 | createdAt | created_at | Date | datetime | ✅ Mapped | camelCase ↔ snake_case |
| 상태 | status | status | enum | string | ⚠️ Review | Enum mapping needed |

### Nested Objects

| Object | Frontend Structure | Backend Structure | Notes |
|--------|-------------------|-------------------|--------|
| metadata | `{ tags: string[] }` | `{ tags: list[str] }` | Direct mapping |

## 📥📤 API Examples

### Request (Frontend → Backend)

```typescript
// POST /api/indices
{
  "name": "DeFi Leaders",
  "tokens": ["UNI", "AAVE"],
  "weightingType": "EQUAL",
  "rebalancePeriod": 7
}
```

### Response (Backend → Frontend)

```json
{
  "data": {
    "id": "idx_abc123",
    "name": "DeFi Leaders",
    "tokens": ["UNI", "AAVE"],
    "weighting_type": "EQUAL",
    "rebalance_period": 7,
    "created_at": "2024-11-19T10:00:00Z"
  }
}
```

### Transform Logic

```typescript
// utils/transformers/indexTransformer.ts
export const transformIndexResponse = (data: BackendIndex): FrontendIndex => {
  return {
    id: data.id,
    name: data.name,
    weightingType: data.weighting_type,
    rebalancePeriod: data.rebalance_period,
    createdAt: new Date(data.created_at)
  };
};
```

## ✅ Validation Rules

| Field  | Frontend Validation      | Backend Validation       | Status    |
|--------|--------------------------|--------------------------|-----------|
| name   | 2-50 chars, alphanumeric | 2-50 chars, alphanumeric | ✅ Aligned |
| tokens | min: 2, max: 20          | min: 2, max: 30          | ⚠️ Differ |

## 🚨 Known Issues & TODOs

**Critical**
  - totalValue vs tvl 필드명 통일 결정
  - Timestamp timezone 처리 방식 합의

  Medium Priority

  - Error message format 표준화
  - Pagination 파라미터 통일

  Resolved

  - ID format 통일 (2024-11-18)

  📝 Change History

  | Date       | Change                       | Impact   | Author |
  |------------|------------------------------|----------|--------|
  | 2024-11-19 | Initial documentation        | -        | @김현    |
  | 2024-11-18 | Added token validation rules | Breaking | @백엔드   |

  ---
```

## 2️⃣ Common Standards Template

```markdown
# Naming Conventions 표준

## 📐 General Rules

| Category | Frontend | Backend | Example (FE) | Example (BE) |
|----------|----------|---------|--------------|--------------|
| Variables | camelCase | snake_case | `userId` | `user_id` |
| Constants | UPPER_SNAKE | UPPER_SNAKE | `MAX_RETRY` | `MAX_RETRY` |
| Functions | camelCase | snake_case | `getUser()` | `get_user()` |
| Classes | PascalCase | PascalCase | `UserModel` | `UserModel` |
| Files | kebab-case | snake_case | `user-profile.ts` | `user_profile.py` |

## 🔤 Domain-Specific Terms

| Business Term | Frontend | Backend | Database | Notes |
|--------------|----------|---------|----------|--------|
| 인덱스 | index | index | indices | 복수형 주의 |
| 거래 | trade | trade | trades | - |
| 지갑 | wallet | wallet | wallets | - |
| 총 가치 | totalValue | total_value | total_value | 🚨 통일 필요 |

## 📦 Data Type Conventions

| Type | Frontend | Backend | Transform | Example |
|------|----------|---------|-----------|---------|
| Money | number | Decimal | string in JSON | `100.50` |
| Date | Date object | datetime | ISO 8601 string | `2024-11-19T10:00:00Z` |
| UUID | string | UUID | string | `"abc-123-def"` |
| Enum | TypeScript enum | Python Enum | uppercase string | `"PENDING"` |

## 🔄 Transform Patterns

### Case Conversion

```typescript
// Frontend
const camelToSnake = (str: string) =&gt;
  str.replace(/[A-Z]/g, letter =&gt; `_${letter.toLowerCase()}`);

// Example
camelToSnake('createdAt') // 'created_at'
```

### Date Handling

```typescript
// Frontend → Backend
const dateToISO = (date: Date) =&gt; date.toISOString();

// Backend → Frontend
const isoToDate = (iso: string) =&gt; new Date(iso);
```
```

---

## 3️⃣ API Contracts Template

```markdown
# REST API Specification

## 📍 Base Configuration

- **Base URL**: `https://api.hyperindex.io/v1`
- **Authentication**: Bearer Token
- **Content-Type**: `application/json`

## 🔗 Endpoints

### Index Management

#### GET /indices

**Purpose**: 인덱스 목록 조회

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | 페이지 번호 |
| limit | integer | No | 20 | 페이지당 항목 수 |
| sort_by | string | No | created_at | 정렬 기준 |
| order | string | No | desc | asc/desc |

**Response Structure**

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Status Codes**

| Code | Description    | Body         |
|------|----------------|--------------|
| 200  | Success        | Data array   |
| 400  | Invalid params | Error object |
| 401  | Unauthorized   | Error object |

## 🔌 WebSocket Events

### Subscribe to Index Updates

```javascript
// Frontend
ws.send({
  type: 'SUBSCRIBE',
  channel: 'index_updates',
  index_id: 'idx_123'
});

// Backend Event
{
  "type": "INDEX_UPDATE",
  "data": {
    "index_id": "idx_123",
    "total_value": 1500000,
    "timestamp": "2024-11-19T10:00:00Z"
  }
}
```

## 🔍 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "name",
      "reason": "Too short"
    }
  }
}
```
```

---

## 4️⃣ Integration Guides Template

```markdown
# Data Transformation Rules

## 🔄 Transformation Pipeline

### 1. Request Transformation (FE → BE)

```typescript
class RequestTransformer {
  static transform(frontendData: any): any {
    return {
      ...this.convertKeys(frontendData, 'toSnakeCase'),
      ...this.convertDates(frontendData, 'toISO'),
      ...this.convertEnums(frontendData, 'toUpperCase')
    };
  }
}
```

### 2. Response Transformation (BE → FE)

```typescript
class ResponseTransformer {
  static transform(backendData: any): any {
    return {
      ...this.convertKeys(backendData, 'toCamelCase'),
      ...this.convertDates(backendData, 'toDateObject'),
      ...this.convertDecimals(backendData, 'toNumber')
    };
  }
}
```

## ✅ Testing Checklist

### Pre-Integration
- Field mapping documented
- Transform functions written
- Unit tests for transformers
- Mock data prepared

### Integration Testing
- E2E flow tested
- Error cases handled
- Performance acceptable
- Edge cases covered

### Post-Integration
- Documentation updated
- Team notified
- Monitoring setup
- Rollback plan ready
```

---

## 5️⃣ Change Management Template

```markdown
# Change Log

## 📅 2024-11-19

### 🔴 Breaking Changes

| Time | Domain | Change | Impact | Owner | Status |
|------|--------|--------|--------|-------|--------|
| 10:00 | Index | Renamed `total_value` to `tvl` | All endpoints | @Backend | 🟡 Migrating |

### 🟡 Non-Breaking Changes

| Time | Domain | Change | Impact | Owner | Status |
|------|--------|--------|--------|-------|--------|
| 14:00 | Trade | Added optional `memo` field | None | @Frontend | ✅ Complete |

### 📝 Decisions Made

| Topic | Decision | Rationale | Participants |
|-------|----------|-----------|--------------|
| Date format | Use ISO 8601 | Industry standard | @김현, @백엔드 |

## 🎯 Action Items

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| Update all transformers for tvl | @Frontend | 2024-11-20 | 🟡 In Progress |
| Add migration script | @Backend | 2024-11-20 | 🔴 Not Started |

## 📋 Next Sync Meeting

- **Date**: 2024-11-20 15:00 KST
- **Agenda**:
  1. Review tvl migration
  2. Discuss error format
  3. Plan next sprint
```

---

## 🚀 Notion 구성 팁

1. **각 템플릿을 Notion Template Button으로 저장**
2. **Domain Specifications는 Database로 관리**
- Properties: Status, Priority, Owner, Last Updated
- Views: By Status, By Owner, By Priority
1. **Change Log는 Timeline View 활용**
2. **Common Standards는 Synced Block으로 여러 페이지에서 참조**
3. **Quick Dashboard는 Gallery View로 시각화**

이렇게 구성하면 누구든 필요한 정보를 빠르게 찾고, 프론트/백 차이를 한눈에 비교하며, 변경사항을 체계적으로 추적할 수 있습니다!