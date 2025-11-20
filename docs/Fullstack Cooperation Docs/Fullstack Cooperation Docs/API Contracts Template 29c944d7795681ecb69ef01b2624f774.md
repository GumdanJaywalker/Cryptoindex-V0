# API Contracts Template

생성자: 현 김
생성 일시: 2025년 10월 30일 오후 6:11
카테고리: API Contracts
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:56

# REST API Specification

## 📍 Base Configuration

- **Base URL**: `https://api.hyperindex.io/v1`
- **Authentication**: Bearer Token
- **Content-Type**: `application/json`

## 🔗 Endpoints

### Index Management

### GET /indices

**Purpose**: 인덱스 목록 조회

**Query Parameters**

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
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

| Code | Description | Body |
| --- | --- | --- |
| 200 | Success | Data array |
| 400 | Invalid params | Error object |
| 401 | Unauthorized | Error object |

## 🔌 WebSocket Events

### Subscribe to Index Updates

```jsx
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