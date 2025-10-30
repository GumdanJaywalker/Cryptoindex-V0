# CLAUDE.md - HyperIndex 개발 환경 정보

> 📅 **마지막 업데이트**: 2025-10-28
> 🔄 **자동 업데이트**: doc-updater agent로 실제 프로젝트 구조 스캔 및 반영

이 파일은 Claude Code가 HyperIndex 프로젝트에서 작업할 때 필요한 개발 환경 정보를 제공합니다.

## 🎯 프로젝트 개요
**HyperIndex** - Hyper Network 기반 밈코인 인덱스 파생상품 거래 플랫폼
- Hyperliquid UI 스타일
- 바이낸스 수준의 정보 밀도
- 인덱스 특화 거래 및 거버넌스 기능

## 🛠️ 기술 스택
- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **패키지 매니저**: pnpm (중요: npm 대신 pnpm 사용할 것!)
- **UI 라이브러리**: 
  - Radix UI + shadcn/ui (50+ 컴포넌트)
  - MagicUI (Ripple, BorderBeam 등)
  - Aceternity UI
- **스타일링**: TailwindCSS + 커스텀 애니메이션
- **상태 관리**: React Context / Zustand 권장
- **알림**: react-hot-toast

## 🚀 개발 명령어 (중요: pnpm 사용!)

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (포트 3000, 사용 중이면 3001)
pnpm run dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 서버 시작
pnpm start

# 린팅
pnpm run lint
```

### 🔧 개발 환경 첫 설정
```bash
# 1. 저장소 클론 후
cd Cryptoindex-V0

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm run dev

# 4. 메인 페이지 확인
# http://localhost:3000 (메인 랜딩)
# http://localhost:3000/trading (거래 페이지)
```

## 📁 프로젝트 구조 (2025-10-20 업데이트 - doc-updater로 스캔됨)

```
/app                          # Next.js App Router (17개 페이지: 14 메인 + 3 테스트)
  page.tsx                    # 🏠 메인 랜딩 페이지
  /trading                    # 💹 거래 페이지 (메인 기능)
  /launch                     # 🚀 인덱스 생성/런칭 페이지 (915 lines - 매우 복잡)
  /discover                   # 🔍 인덱스 발견 페이지 (NEW - 209 lines)
  /portfolio                  # 💼 포트폴리오 관리
  /governance                 # 🗳️ 거버넌스 투표 목록
  /governance/[id]            # 🗳️ 거버넌스 상세 페이지
  /leaderboard                # 🏆 트레이더 리더보드 (replaces /traders)
  /leaderboard/[id]           # 👤 트레이더 프로필 상세
  /referrals                  # 💸 레퍼럴 프로그램
  /referrals/apply            # 📝 레퍼럴 신청
  /settings                   # ⚙️ 사용자 설정
  /notifications              # 🔔 알림 센터
  /dashboard                  # 📊 대시보드
  /privy-login                # 🔐 Auth 테스트 페이지
  /test-network-display       # 🧪 Network 테스트 페이지
  /test-utils                 # 🧪 Utils 테스트 페이지
  layout.tsx                  # 공통 레이아웃

/components                   # 총 243개 컴포넌트 (19개 카테고리)
  /ui                         # shadcn/ui + Aceternity (124 컴포넌트)
  /trading                    # 거래 인터페이스 (27 파일)
  /magicui                    # MagicUI 효과 (15 파일)
  /wallet                     # 지갑 연동 (15 파일 - 중복 포함)
  /portfolio                  # 포트폴리오 관리 (13 파일)
  /launch                     # ⭐ 인덱스 생성 (7 파일)
  /governance                 # 거버넌스 (7 파일)
  /settings                   # ⭐ 설정 섹션 (7 파일)
  /dialogs                    # 다이얼로그/모달 (5 파일)
  /notifications              # ⭐ 알림 시스템 (5 파일)
  /mobile                     # ⭐ 모바일 최적화 (3 파일)
  /sidebar                    # ⭐ 통합 사이드바 (2 파일)
  /layout                     # 레이아웃 (Header, Footer - 2 파일)
  /providers                  # 프로바이더 (2 파일)
  /discover                   # 🆕 발견 페이지 (1 파일 - layer-tabs)
  /pwa                        # ⭐ PWA 설치 프롬프트 (1 파일)
  /modals                     # ⭐ 모달 (AllIndicesModal - 1 파일)
  /auth                       # 인증 Privy (1 파일)
  /demo                       # 데모 쇼케이스 (1 파일)
  theme-provider.tsx          # 테마 프로바이더
  cards-demo-*.tsx            # 데모 카드들

/lib                          # 38개 유틸리티/로직 파일
  /store                      # Zustand 스토어 (5 파일)
    - trading-store, governance-store, notifications-store
    - currency-store, price-alerts (NEW)
  /types                      # TypeScript 타입 (5 파일)
    - governance, notifications, index-trading
    - currency, discover (NEW)
  /utils                      # 유틸 함수 (4 파일)
    - utils.ts, currency.ts, layer-utils.ts, avatar.ts
  /api                        # API 통합 (3 파일: governance, search, settings)
  /mock                       # Mock 데이터 (3 파일: assets, blacklist, operators)
  /privy                      # Privy 인증 설정 (2 파일)
  /supabase                   # Supabase 클라이언트 (2 파일)
  /hooks                      # 공유 훅 (2 파일: performance, currency)
  /animations                 # 애니메이션 유틸 (2 파일: page-transitions, micro-interactions)
  /pwa                        # PWA 유틸리티 (2 파일: sw-register, pwa-provider)
  /auth                       # 인증 로직 (1 파일: privy-jwt)
  /data                       # Mock 인덱스 데이터 (1 파일)
  /sound                      # 🆕 사운드 효과 (1 파일)
  /settings                   # 설정 저장소 (1 파일)
  /governance                 # 거버넌스 헬퍼 (1 파일)
  /middleware                 # 인증 미들웨어 (1 파일)
  /providers                  # Query 프로바이더 (1 파일)

/hooks                        # 6개 커스텀 훅
  - use-gestures, use-governance, use-index-builder
  - use-market-data, use-realtime, use-wallet

/app/globals.css              # TailwindCSS + 브랜드 색상
```

## 🎨 디자인 가이드라인

### 🌟 브랜드 색상 테마 (updated)
```css
:root {
  /* Primary (soft mint) */
  --brand-primary-hex: #98FCE4;
  /* Dark teal / near-black (background) */
  --brand-dark-hex: #072723;
  /* Light mint-gray (neutrals) */
  --brand-light-hex: #D7EAE8;

  /* Optional HSL tokens for Tailwind utilities if needed */
  --brand-primary: 168 95% 80%;   /* ≈ #98FCE4 */
  --brand-dark: 183 74% 9%;       /* ≈ #072723 */
  --brand-light: 168 30% 90%;     /* ≈ #D7EAE8 */
}
```

### 브랜드 색상 사용법
```css
.text-brand           /* #8BD6FF 텍스트 */
.bg-brand            /* #8BD6FF 배경 */
.border-brand        /* #8BD6FF 테두리 */
.bg-brand-gradient   /* #8BD6FF → #6BBDFF 그라데이션 */
.hover:bg-brand      /* 호버시 #8BD6FF 배경 */
```

> Note: 기존 예시는 이전 팔레트를 기준으로 한 유틸 예시입니다. 실제 색 값은 상단 updated 팔레트(Primary/Dark/Light)를 기준으로 `app/globals.css`와 Tailwind 설정에서 매핑해 사용하세요.

### 기존 색상 테마 (파스텔톤 남색 계열)
```css
:root {
  /* 다크 모드 배경 */
  --bg-primary: #0f172a;    /* slate-950 */
  --bg-secondary: #1e293b;  /* slate-800 */
  --bg-tertiary: #334155;   /* slate-700 */

  /* 상승/하락 색상 */
  --green: #10b981;
  --red: #ef4444;
}
```

### UI 스타일
- **Hyperliquid 스타일**: 레이아웃과 컴포넌트 배치 유사
- **바이낸스 정보량**: 거래소 수준의 상세 정보
- **다크 모드 기본**: 전문적인 거래 인터페이스

## 📱 반응형 가이드라인

### 데스크톱 (1024px+)
- 3분할 레이아웃 유지 (차트 + 호가창 + 거래패널)
- 모든 정보 표시

### 태블릿 (768px-1023px)
- 2분할로 조정
- 일부 정보 축약 표시

### 모바일 (767px 이하)
- 단일 컬럼 레이아웃
- 핵심 정보만 표시

## 🔧 개발 중요 사항

### TypeScript 설정
- 모든 컴포넌트는 TypeScript로 작성
- 인터페이스 정의 필수

### 컴포넌트 구조
```tsx
// 기본 구조 예시
interface ComponentProps {
  // props 정의
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX
  );
}
```

### Mock 데이터 사용
- 현재는 모든 데이터가 Mock
- 실제 API 연동은 추후 단계

### 🌐 언어 가이드라인 (중요!)
- **사이트 언어**: 모든 UI 텍스트, 버튼, 라벨, 메시지는 영어로 작성
- **코드 주석**: 모든 주석은 영어로 작성 (// This is correct)
- **변수명/함수명**: 영어로 명명 (한글 변수명 금지)
- **콘솔 로그**: 개발용 로그도 영어로 작성
- **국제 사용자 대상**: 글로벌 서비스를 위한 영어 우선 정책

## 📋 개발 규칙

### 1. Dev Server 실행
- **사용자가 직접 실행**: 사용자 본인이 `pnpm run dev`를 직접 실행하여 확인
- **Claude는 실행하지 않음**: Claude Code는 dev 서버를 직접 켜지 않음
- **이유**: 사용자가 직접 브라우저에서 결과를 확인하는 것이 더 효율적

### 2. 백엔드 연동 작업 후 문서 업데이트
백엔드 API 연동 작업을 한 후에는 반드시 다음 문서들을 업데이트할 것:
- `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/BACKEND_INTEGRATION_CHECKLIST.md`
- `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/BACKEND_DATA_REQUIREMENTS.md`

업데이트 내용:
- 새로 추가된 API 엔드포인트
- 변경된 데이터 구조
- 완료된 통합 작업 체크리스트

### 3. 모든 작업 후 인수인계 문서 업데이트
모든 작업이 완료된 후에는 인수인계 문서를 업데이트할 것:
- `docs/handover/HANDOVER.md` - 최신 작업 2-3개 세션만 유지 (간소화)
- `docs/handover/HANDOVER_ARCHIVE.md` - 오래된 세션은 아카이브로 이동

업데이트 원칙:
- 개조식 서술 적극 활용 (bullet points)
- 이모지 남발 제거
- "훌륭한", "깔끔한" 같은 미사여구 제거
- 상세 설명이 필요한 부분은 설명문식으로 작성
- 모든 기술 정보는 충실히 유지 (정보 손실 없이)

### 4. 문서 작성 스타일
- **간결함**: 불필요한 수식어 제거, 핵심 정보만 전달
- **정보 밀도**: 토큰 절약하면서도 정보는 온전히 유지
- **개조식 우선**: bullet points로 간결하게 작성
- **설명문 병행**: 복잡한 로직이나 플로우는 설명문으로 작성

### 5. Planning 문서 작성 규칙 (YYYYMMMWW Format)

**위치**: `docs/planning/YYYYMMMWW/`

**명명 규칙**:
- Format: YYYYMMMWW (Year + Month Initials + Week Number)
- 예시: 2025OCT04 = 2025년 10월 4주차 (October Week 4)
- 월 이니셜: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC
- 주 번호: 01-05 (해당 월의 첫째 주부터 다섯째 주)

**필수 템플릿 구조**:
```markdown
# [기능명] Refactoring/Planning

## UX or 세부 컴포넌트 항목
[업데이트 필요한 핵심 컴포넌트 나열]

## 레퍼런스
[참고한 외부 서비스 및 디자인 패턴]

## 용이성의 근거
### 채택 방안
[선택한 접근 방식과 그 이유]

### 비채택 대안 #1
[고려했으나 채택하지 않은 방안 1과 이유]

### 비채택 대안 #2
[고려했으나 채택하지 않은 방안 2와 이유]

## 타 페이지 및 컴포넌트와의 관계성
[다른 페이지/컴포넌트와의 연동 관계]

## 상세 계획 - 실행 절차
[단계별 구현 계획, 시간 추정 제외]
```

**작성 원칙**:
- 시간 추정 불포함 (시간은 실제 작업 시 가변적)
- 채택 방안과 비채택 대안 명확히 구분
- 컴포넌트 간 관계 다이어그램 또는 설명 포함
- 레퍼런스는 실제 조사한 내용 기반 (AI 복붙 금지)

### 6. 템플릿 기반 문서 작성 규칙

**템플릿 위치**: `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/2025OCT04 Frontend Docs/Frontend Docs/templates/`

**템플릿 종류**:
1. **작업 계획 (Task Plan)**: `2025OCT04 Task Plan - [페이지명].md`
2. **작업 리뷰 (Task Review)**: `2025OCT04 Task Review - [페이지명].md`
3. **피드백 (Feedback)**: `Re [작업명] Feedback.md`
4. **기타 템플릿**: 템플릿 폴더 내 다른 .md 파일들

**작성 지침**:
- 사용자가 작업계획, 작업리뷰, 피드백 등의 문서 작성을 요청하면:
  1. 먼저 `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/2025OCT04 Frontend Docs/Frontend Docs/templates/` 폴더에서 해당 템플릿을 확인
  2. 템플릿 구조를 **정확히 따라서** 문서 작성
  3. 템플릿의 각 섹션 제목과 순서 유지
  4. AI 복붙 금지: 실제 프로젝트 상황에 맞게 작성

**저장 위치**:
- Task Plan 문서: `docs/planning/YYYYMMMWW/[기능명]_TASK_PLAN.md`
- Task Review 문서: 작업 완료 후 별도 요청 시 생성
- Feedback 문서: 피드백 대응 시 별도 요청 시 생성

**예시**:
- 사용자: "Launch 페이지 작업 계획 문서 만들어줘"
- Claude: Task Plan 템플릿을 읽고 → 템플릿 구조에 맞춰 `docs/planning/2025OCT04/LAUNCH_PAGE_TASK_PLAN.md` 생성

### 7. 작업 시작 및 완료 시 문서 읽기/수정 규칙

**작업 시작 시 필수 읽기**:
1. `docs/planning/YYYYMMMWW/README.md` (예: 2025OCT04) - 해당 주차 작업 개요
2. `docs/planning/YYYYMMMWW/TASK_PRIORITY.md` (예: 2025OCT04) - 작업 우선순위 확인
3. `docs/handover/HANDOVER.md` - 최신 세션 내용 확인
4. 해당 작업 관련 planning 문서 (예: `LAUNCH_PAGE_REFACTORING.md`)

**작업 완료 시 필수 수정**:
1. `docs/handover/HANDOVER.md` - 새 세션 추가 (최신 작업 2-3개만 유지)
2. `docs/planning/YYYYMMMWW/TASK_PRIORITY.md` (예: 2025OCT04) - 완료된 항목 체크 또는 업데이트
3. `docs/planning/YYYYMMMWW/README.md` (예: 2025OCT04) - Status Summary 업데이트
4. 백엔드 작업 시: `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/BACKEND_INTEGRATION_CHECKLIST.md` 업데이트

**문서 경로 기준**:
- 모든 planning 문서: `docs/planning/YYYYMMMWW/` (예: 2025OCT04)
- 인수인계 문서: `docs/handover/`
- 백엔드 문서: 프로젝트 루트 (`/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/`)

### 8. Notion 문서 관리 워크플로우

**Notion → Docs 폴더 정리 프로세스**:
1. Notion에서 markdown으로 export
2. `YYYYMMMWW Frontend Docs/` 폴더에 저장
3. 카테고리별 폴더 생성 후 분류:
   - `/task-plans` - 작업 계획 문서
   - `/task-reviews` - 작업 리뷰 문서
   - `/feedbacks` - 피드백 및 답변
   - `/templates` - 문서 템플릿
   - `/okrs` - OKR 문서
   - `/misc` - 기타 문서

4. Planning 문서 추출:
   - 중요 계획 문서는 `docs/planning/YYYYMMMWW/`로 이동
   - 템플릿 형식에 맞춰 재구성
   - README.md 추가하여 해당 주차 작업 요약

**폴더 구조 예시**:
```
/docs
  /planning
    /2025OCT04
      README.md
      CURRENCY_SYSTEM_REFACTORING.md
      FRONTEND_SECURITY_ATTACK_SCENARIOS.md
      LAUNCH_PAGE_REFACTORING.md
  /backend
    BACKEND_INTEGRATION_CHECKLIST.md
    BACKEND_DATA_REQUIREMENTS.md
  /handover
    HANDOVER.md
    HANDOVER_ARCHIVE.md
  OVERVIEW.md
```

## 🎨 새로운 개발 방식

### 🧠 브레인스토밍 중심 개발
**Claude Code의 역할**: 
- 다양한 디자인 아이디어와 구현 방안 제시
- 여러 옵션을 구체적으로 설명하여 선택지 제공
- 기술적 실현 가능성과 미적 효과를 균형있게 고려

**사용자의 역할**:
- 제시된 옵션 중 최종 선택 결정
- 심미성과 상용화 가능성을 기준으로 판단
- 구체적인 피드백으로 방향성 제시

### 🎯 품질 기준
- **상용화 수준의 심미성**: 실제 서비스로 내놓을 수 있는 디자인 퀄리티
- **사용자 경험 우선**: 직관적이고 효율적인 인터페이스
- **브랜드 일관성**: #8BD6FF 테마와 Hyperliquid 스타일 유지
- **성능 최적화**: 애니메이션과 성능의 균형점 확보

## 🚀 현재 기술 스택 상태
- **Frontend**: Next.js 15.2.4 + React 19 + TypeScript ✅
- **UI Libraries**:
  - shadcn/ui (120+ 컴포넌트) ✅
  - Aceternity UI (80+ 애니메이션) ✅
  - Magic UI (14개 효과) ✅
- **Styling**: TailwindCSS + 브랜드 색상 시스템 (#98FCE4) ✅
- **Animation**: Framer Motion + 커스텀 애니메이션 ✅
- **Authentication**: Privy 완전 통합 ✅
- **Wallet**: 멀티 지갑 지원 + 네트워크 전환 ✅
- **State Management**: React Context + Zustand ✅
- **PWA**: 설치 프롬프트 구현 ✅
- **Mock Data**: 18개 인덱스 데이터 + 30명 탑 트레이더 ✅

## 📋 중요 참고사항

- **패키지 매니저**: 반드시 pnpm 사용
- **스타일링**: TailwindCSS 클래스 우선 사용
- **컴포넌트**: 재사용 가능하게 설계
- **반응형**: 모바일 우선 고려
- **성능**: 코드 스플리팅 및 최적화 고려

## 🚀 빠른 시작 가이드

1. **프로젝트 실행**: `pnpm run dev`
2. **메인 페이지**: `http://localhost:3000`
3. **거래 페이지**: `http://localhost:3000/trading`
4. **개발자 도구**: Chrome DevTools 활용
5. **Hot Reload**: 파일 저장시 자동 새로고침
