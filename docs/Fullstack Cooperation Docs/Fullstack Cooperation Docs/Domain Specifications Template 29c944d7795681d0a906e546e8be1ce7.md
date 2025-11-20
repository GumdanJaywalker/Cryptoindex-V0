# Domain Specifications Template

생성자: 현 김
생성 일시: 2025년 10월 30일 오후 6:11
카테고리: Domain Specifications
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:53

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

| **Description** | **Frontend Key** | **Backend Key** | **FE Type** | **BE Type** | **Status** | **Transform** |
| --- | --- | --- | --- | --- | --- | --- |
| 고유 식별자 | id | id | string | UUID | ✅ Aligned | - |
| 생성 일시 | createdAt | created_at | Date | datetime | ✅ Mapped | camelCase ↔ snake_case |
| 상태 | status | status | enum | string | ⚠️ Review | Enum mapping needed |

### Nested Objects

| **Object** | **Frontend Structure** | **Backend Structure** | **Notes** |
| --- | --- | --- | --- |
| metadata | `{ tags: string[] }` | `{ tags: list[str] }` | Direct mapping |

## 📥📤 API Examples

### Request (Frontend → Backend)

```tsx
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

```tsx
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

| **Field** | **Frontend Validation** | **Backend Validation** | **Status** |
| --- | --- | --- | --- |
| name | 2-50 chars, alphanumeric | 2-50 chars, alphanumeric | ✅ Aligned |
| tokens | min: 2, max: 20 | min: 2, max: 30 | ⚠️ Differ |

## 🚨 Known Issues & TODOs

**Critical**

- totalValue vs tvl 필드명 통일 결정
- Timestamp timezone 처리 방식 합의

**Medium Priority**

- Error message format 표준화
- Pagination 파라미터 통일

**Resolved**

- ID format 통일 (2024-11-18)

## 📝 Change History

| **Date** | **Change** | **Impact** | **Author** |
| --- | --- | --- | --- |
| 2024-11-19 | Initial documentation | - | @김현 |
| 2024-11-18 | Added token validation rules | Breaking | @백엔드 |