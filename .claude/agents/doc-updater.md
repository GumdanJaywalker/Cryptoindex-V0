# 📚 Documentation Updater Agent

## 역할

프로젝트의 실제 구조를 스캔하고 MD 문서들을 자동으로 업데이트하는 agent

## 실행 방법

이 파일의 내용을 Claude Code에 복사해서 실행

---

## 🎯 작업 프로세스

### 1단계: 전체 구조 스캔

다음 경로들을 재귀적으로 스캔:

### 스캔 대상:

- `/components/` - 모든 .tsx, .ts 파일
- `/app/` - page.tsx, layout.tsx 파일들
- `/hooks/` - 커스텀 훅들
- `/lib/` - 유틸리티 함수들
- `/types/` - 타입 정의들

### 스캔 출력 형식:

```markdown
## 발견된 파일 구조

### Components
| 폴더 | 파일명 | 추정 역할 | 라인수 |
|------|--------|-----------|--------|
| auth | PrivyAuth.tsx | Privy 인증 | ~50 |
| ... | ... | ... | ... |

### Pages
| 경로 | 파일 | 상태 |
|------|------|------|
| /trading | page.tsx | ✅ 구현됨 |
| ... | ... | ... |
```

### 2단계: 문서 비교

현재 Component-List.md를 읽고:

- ✅ 문서에 있고 실제로도 있는 것
- ❌ 문서에 있는데 실제로 없는 것
- 🆕 실제로 있는데 문서에 없는 것

차이점을 테이블로 정리

### 3단계: 문서 업데이트

Component-List.md를 다음 구조로 재작성:

```markdown
# 🚀 Cryptoindex 프로젝트 컴포넌트 목록

마지막 업데이트: [자동 생성 날짜]
자동 생성: doc-updater agent

## 📱 App Pages
[스캔 결과 기반으로 작성]

## 🧩 기능별 컴포넌트
[스캔 결과 기반으로 작성]

## 🎨 UI 컴포넌트
[스캔 결과 기반으로 작성]
```

### 4단계: Claude_Code_Prompt.md 업데이트

다음 섹션들을 실제 구조에 맞게 수정:

1. 프로젝트 구조 섹션
2. 사용 가능한 컴포넌트 목록
3. 개발 우선순위 (✅/🚧/❌ 표시)

### 5단계: 변경 로그 생성

`.claude/changelog.md`에 변경사항 기록:

```markdown
## [날짜] Documentation Update

### 추가됨
- /components/launch/ (4개 파일)
- /components/settings/ (7개 파일)

### 제거됨
- /components/old-folder/ (존재하지 않음)

### 수정됨
- 우선순위 업데이트
- 구현 상태 업데이트
```

---

## 🔧 설정

### 제외할 폴더:

- node_modules/
- .next/
- .git/
- dist/
- build/

### 스캔할 확장자:

- .tsx
- .ts
- .jsx
- .js

### 문서 우선순위 판단 기준:

- 🔥 중요: /trading, /governance, /portfolio 관련
- 🟡 보통: 나머지 기능 컴포넌트
- ⚪ 참고: demo, test 관련

---

## 📋 체크리스트

업데이트 후 반드시 확인:

- [ ]  모든 실제 파일이 문서에 포함되었는가?
- [ ]  존재하지 않는 파일이 문서에서 제거되었는가?
- [ ]  날짜가 업데이트되었는가?
- [ ]  변경 로그가 작성되었는가?
- [ ]  파일 경로가 정확한가?

---

## 🚀 실행 명령어

Claude Code에서:

1. 이 파일 내용 전체 복사
2. 프로젝트 루트에서 실행
3. 결과 확인 후 저장
