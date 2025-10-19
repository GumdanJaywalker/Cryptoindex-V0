# 🔍 Component Analyzer Agent

## 역할

컴포넌트의 의존성, Props, 사용처를 분석하는 agent

## 사용법

```
component-analyzer.md를 읽고, [컴포넌트 경로]를 분석해주세요
```

---

## 분석 항목

### 1. 기본 정보

- 파일 경로
- 파일 크기
- 라인 수
- 작성 언어 (TS/JS)

### 2. 의존성 분석

- import하는 컴포넌트들
- 사용하는 외부 라이브러리
- 의존성 트리 (depth 3까지)

### 3. Props 분석

```tsx
interface Props {
  [prop명]: [타입];  // [설명]
}
```

### 4. 사용처 찾기

- 이 컴포넌트를 import하는 파일들
- 사용 빈도
- 주요 사용 패턴

### 5. 개선 제안

- 불필요한 의존성
- Props 타입 개선
- 성능 최적화 포인트
- 리팩토링 제안

---

## 출력 형식

```markdown
# [컴포넌트명] 분석 보고서

## 📊 기본 정보
- 경로: /components/...
- 크기: XXX lines
- 언어: TypeScript

## 🔗 의존성
### Direct Dependencies (3개)
- Component A
- Library B
- Utility C

### Dependency Tree
```

[컴포넌트명]
├── ComponentA
│   └── SubComponent1
├── LibraryB
└── UtilityC

```

## 📝 Props 인터페이스
[자동 추출 또는 추론]

## 📍 사용처 (2곳)
1. /app/trading/page.tsx
2. /components/layout/Header.tsx

## 💡 개선 제안
1. [제안 1]
2. [제안 2]
```
