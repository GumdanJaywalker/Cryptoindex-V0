# Common Standards Template

생성자: 현 김
생성 일시: 2025년 10월 30일 오후 6:11
카테고리: Common Standards
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:56

# Naming Conventions 표준

## 📐 General Rules

| Category | Frontend | Backend | Example (FE) | Example (BE) |
| --- | --- | --- | --- | --- |
| Variables | camelCase | snake_case | `userId` | `user_id` |
| Constants | UPPER_SNAKE | UPPER_SNAKE | `MAX_RETRY` | `MAX_RETRY` |
| Functions | camelCase | snake_case | `getUser()` | `get_user()` |
| Classes | PascalCase | PascalCase | `UserModel` | `UserModel` |
| Files | kebab-case | snake_case | `user-profile.ts` | `user_profile.py` |

## 🔤 Domain-Specific Terms

| Business Term | Frontend | Backend | Database | Notes |
| --- | --- | --- | --- | --- |
| 인덱스 | index | index | indices | 복수형 주의 |
| 거래 | trade | trade | trades | - |
| 지갑 | wallet | wallet | wallets | - |
| 총 가치 | totalValue | total_value | total_value | 🚨 통일 필요 |

## 📦 Data Type Conventions

| Type | Frontend | Backend | Transform | Example |
| --- | --- | --- | --- | --- |
| Money | number | Decimal | string in JSON | `100.50` |
| Date | Date object | datetime | ISO 8601 string | `2024-11-19T10:00:00Z` |
| UUID | string | UUID | string | `"abc-123-def"` |
| Enum | TypeScript enum | Python Enum | uppercase string | `"PENDING"` |

## 🔄 Transform Patterns

### Case Conversion

```tsx
// Frontend
const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Example
camelToSnake('createdAt') // 'created_at'
```

### Date Handling

```tsx
// Frontend → Backend
const dateToISO = (date: Date) => date.toISOString();

// Backend → Frontend
const isoToDate = (iso: string) => new Date(iso);
```