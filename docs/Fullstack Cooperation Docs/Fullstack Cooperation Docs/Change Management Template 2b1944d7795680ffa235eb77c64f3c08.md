# Change Management Template

생성자: 현 김
생성 일시: 2025년 11월 20일 오후 3:42
카테고리: Change Management
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:57

# Change Log

## 📅 2024-11-19

### 🔴 Breaking Changes

| Time | Domain | Change | Impact | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| 10:00 | Index | Renamed `total_value` to `tvl` | All endpoints | @Backend | 🟡 Migrating |

### 🟡 Non-Breaking Changes

| Time | Domain | Change | Impact | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| 14:00 | Trade | Added optional `memo` field | None | @Frontend | ✅ Complete |

### 📝 Decisions Made

| Topic | Decision | Rationale | Participants |
| --- | --- | --- | --- |
| Date format | Use ISO 8601 | Industry standard | @김현, @백엔드 |

## 🎯 Action Items

| Task | Owner | Due Date | Status |
| --- | --- | --- | --- |
| Update all transformers for tvl | @Frontend | 2024-11-20 | 🟡 In Progress |
| Add migration script | @Backend | 2024-11-20 | 🔴 Not Started |

## 📋 Next Sync Meeting

- **Date**: 2024-11-20 15:00 KST
- **Agenda**:
    1. Review tvl migration
    2. Discuss error format
    3. Plan next sprint