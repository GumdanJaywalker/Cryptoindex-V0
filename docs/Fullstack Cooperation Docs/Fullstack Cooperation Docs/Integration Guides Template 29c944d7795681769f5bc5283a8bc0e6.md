# Integration Guides Template

생성자: 현 김
생성 일시: 2025년 10월 30일 오후 6:11
카테고리: Integration Guides
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 11월 20일 오후 9:56

# Data Transformation Rules

## 🔄 Transformation Pipeline

### 1. Request Transformation (FE → BE)

```tsx
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

```tsx
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