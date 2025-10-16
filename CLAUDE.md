# CLAUDE.md - HyperIndex 개발 환경 정보

> 📅 **마지막 업데이트**: 2025-10-14

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

## 📁 프로젝트 구조

```
/app                          # Next.js App Router
  /trading                    # 🔥 메인 거래 페이지
  /governance                 # 거버넌스 투표 페이지
  /portfolio                  # 포트폴리오 관리
  layout.tsx                  # 공통 레이아웃

/components
  /layout                     # 레이아웃 컴포넌트
    Header.tsx                # 메인 네비게이션
  /sidebar                    # 사이드바 컴포넌트
    LeftSidebar.tsx           # 통합 왼쪽 사이드바 (모든 페이지 공통)
  /trading                    # 거래 관련 컴포넌트
    IndexInfoBar.tsx          # 인덱스 정보 바
    ChartArea.tsx             # 차트 영역
    OrderBook.tsx             # 호가창
    TradingPanel.tsx          # 거래 패널
    RecentTrades.tsx          # 최근 거래
    CommunityFeed.tsx         # 커뮤니티 피드
  /ui                         # shadcn/ui 컴포넌트 (50+)
  /magicui                    # MagicUI 효과들

/lib
  utils.ts                    # 유틸리티 함수

/styles
  globals.css                 # TailwindCSS + 커스텀 스타일
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

## 📊 현재 진행 상황 (2025-10-14)

### ✅ 최근 완료된 작업 (10월 14일)
- **전체 사이드바 시스템 통일 완료**:
  - `components/ui/sidebar.tsx` (shadcn 기본 사이드바) 제거
  - 모든 페이지에서 `components/sidebar/LeftSidebar.tsx` 사용으로 통일
  - 랜딩 페이지 기준 사이드바로 전체 페이지 일관성 확보

- **전체 페이지 레이아웃 통일 완료**:
  - **왼쪽 여백 최소화**: `px-4 lg:px-4`로 변경 (기존 `px-[4vw] lg:px-[3vw]`에서 대폭 감소)
  - **사이드바 고정 너비**:
    - lg: 260px (기존 가변 너비 26vw → 고정)
    - xl: 280px
    - 2xl: 300px
  - **2컬럼 그리드 레이아웃**: 사이드바 + 메인 컨텐츠로 단순화
  - **적용된 페이지**: Traders, Launch, Referrals, Governance, Governance Detail, Portfolio
  - 모든 페이지가 랜딩과 동일한 좁은 여백 및 레이아웃 사용

### ✅ 이전 완료된 작업 (10월 10일)
- **Trading 페이지 레이아웃 개선 완료**:
  - Header 하단 여백 제거: TradingLayout의 `pt-16` 제거로 헤더와 컨텐츠 사이 공백 제거
  - IndexInfoBar sticky 위치 조정: `top-16` → `top-0`으로 변경하여 자연스러운 sticky 효과

- **AllIndicesModal 데이터 로딩 문제 해결**:
  - LeftSidebar의 "View All" 버튼 클릭 시 데이터 미표시 문제 해결
  - `indices={memeIndices}` → `indices={allMockIndices}`로 변경하여 올바른 데이터 전달
  - 필터 로직 수정: `index.trending` → `index.isHot`, `index.layer` → `index.layerInfo?.layer` 등 속성명 통일

### ✅ 이전 완료된 작업 (9월 1일)
- **Portfolio 페이지 대폭 개선 완료**: 
  - PC 웹 최적화: `max-w-7xl mx-auto` 적용으로 적절한 최대 너비 설정
  - 브랜드 색상 완전 통일: 모든 탭과 아이콘을 #8BD6FF 브랜드 색상으로 변경
  - 용어 표준화 완료: Long/Short → Buy/Sell 변경으로 더 직관적인 거래 용어 적용
  - 일관된 디자인: 다른 페이지들과 통일된 브랜드 색상 시스템 적용
  - 포지션 테이블 및 통계 카드 모두 브랜드 색상으로 업데이트

### ✅ 이전 완료된 작업 (8월 31일)
- **빌드 에러 해결**: Header 컴포넌트 import 문제 완전 해결
- **UI 개선**: 트레이딩 페이지 회전 애니메이션 제거, 헤더 클릭 문제 해결
- **사이드바 구현 완료**: 왼쪽 사이드바에 Market Overview, Top Movers, Mini Portfolio, Recent Activity, Price Alerts, Search Bar 추가
- **Trending 페이지 제거**: 랜딩페이지와 중복되어 불필요한 페이지 정리
- **Governance 페이지 대폭 개선**: 
  - PC 친화적 레이아웃으로 변경 (`max-w-7xl mx-auto`)
  - Battle Votes 완전 제거 → Index Rebalancing Battles로 통합
  - 인덱스 내부 경쟁 구조 구현 (DOG vs Chinese Rapping Dog, Piano Cat vs Grumpy Cat 등)
- **디자인 시스템 통일**: 
  - 전체적인 디자인 단순화 완료
  - 브랜드 색상(#8BD6FF) 위주로 색상 통일
  - 복잡한 그라데이션 제거, 미니멀한 스타일 적용

### 🎯 현재 우선순위 (다음 작업 대기)

### 🔥 1순위: Trading 페이지 UI 개선
**목표**: Buy 버튼 텍스트 가독성 문제 해결

#### 📋 구체적 작업:
- **Buy 버튼 텍스트 가시성 수정**: 현재 글자가 안 보이는 문제 해결
- **버튼 컬러 대비 개선**: 텍스트와 배경의 명도 대비 최적화
- **브랜드 색상 적용**: #8BD6FF 테마에 맞춘 가독성 확보

### 🔥 2순위: 정갈한 호버 효과 구현
**목표**: 억지스럽지 않은 자연스러운 인터랙션 효과

#### 📋 구체적 작업:
- **중요 버튼에만 적용**: Start Trading, Portfolio 링크 등
- **커서 위치 따라 밝아지는 효과**: 마우스 움직임에 반응하는 그라데이션
- **브랜드 색상 기반**: #8BD6FF 계열의 은은한 효과
- **성능 최적화**: 부드럽고 자연스러운 애니메이션

### 📈 완료된 주요 기능들
- **3컬럼 레이아웃**: 사이드바 + 인덱스 목록 + Top Traders
- **검색 기능**: 사이드바 상단 인덱스 검색창
- **실시간 데이터 표시**: Top Movers, Recent Activity 등
- **Index Rebalancing Battles**: 인덱스 내부 밈 경쟁 투표 시스템
- **브랜드 컬러 시스템**: #8BD6FF 기반 통일된 디자인
- **Portfolio 페이지 완전 리뉴얼**: PC 최적화, 브랜드 색상 통일, Buy/Sell 용어 적용

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
- **UI Libraries**: Radix UI + shadcn/ui + MagicUI + Aceternity UI ✅
- **Styling**: TailwindCSS + 브랜드 색상 시스템 ✅
- **Animation**: Framer Motion + 커스텀 애니메이션 ✅
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
