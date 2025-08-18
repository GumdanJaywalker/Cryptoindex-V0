# CLAUDE.md - CryptoIndex 개발 환경 정보

> 📅 **마지막 업데이트**: 2025-01-18

이 파일은 Claude Code가 CryptoIndex 프로젝트에서 작업할 때 필요한 개발 환경 정보를 제공합니다.

## 🎯 프로젝트 개요
**CryptoIndex** - 밈코인 인덱스 기반 파생상품 거래 플랫폼
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
  /trending                   # 인기 인덱스
  /vaults                     # 카피 트레이딩
  /bridge                     # 브릿지
  layout.tsx                  # 공통 레이아웃

/components
  /layout                     # 레이아웃 컴포넌트
    Header.tsx                # 메인 네비게이션
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

### 🌟 브랜드 색상 테마 (#8BD6FF)
```css
:root {
  /* 🎨 CryptoIndex 브랜드 컬러 - #8BD6FF 기반 */
  --brand-primary: 195 100% 76%;        /* #8BD6FF */
  --brand-primary-hover: 195 100% 73%;  /* #7BC9FF */
  --brand-primary-light: 195 100% 82%;  /* #A5E0FF */
  --brand-primary-dark: 195 100% 70%;   /* #6BBDFF */
  --brand-gradient-start: 195 100% 76%; /* #8BD6FF */
  --brand-gradient-end: 195 100% 70%;   /* #6BBDFF */
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

## 🎯 현재 개발 우선순위

### 🔥 현재 진행 중: Trading 페이지 UI/UX 개선 
**#8BD6FF 브랜드 색상 테마 적용 + MagicUI/Aceternity 효과**

#### ✅ 완료된 작업:
- **color-1**: 메인 테마색상 #8BD6FF 전역 CSS 변수 설정 ✅
- **color-2**: IndexInfoBar 강조 색상 #8BD6FF로 통일 ✅
- **color-3**: TradingBottomTabs 탭 선택시 #8BD6FF 적용 ✅  
- **color-4**: TradingPanelSimple 매수 버튼 #8BD6FF 적용 ✅
- **color-5**: OrderBookTrades 탭 활성 상태 #8BD6FF ✅
- **color-6**: WhaleAlert 중요 알림 #8BD6FF accent ✅
- **color-7**: PresetPanel 설정 버튼 #8BD6FF 적용 ✅
- **color-8**: ChartArea 일부 요소 #8BD6FF 적용 ✅
- **bug-fix**: Header.tsx hydration 오류 수정 ✅

#### 🚧 다음 단계 (MagicUI 효과):
- **color-9**: IndexInfoBar에 Shimmer, Border Beam, Number Ticker 효과 추가
- **color-10**: TradingPanelSimple에 Magic Card, Shimmer 버튼, Animated Progress 
- **color-11**: OrderBookTrades에 Ripple 효과, 가격 변화 애니메이션
- **color-12**: WhaleAlert에 Meteors 효과, Pulsing 애니메이션
- **color-13**: ChartArea에 Particles, Border Beam, Skeleton UI

#### 📋 필요한 MagicUI/Aceternity 컴포넌트 설치:
- `shimmer-button`, `magic-card`, `particles`, `pulsating-button`
- CLI 설치 명령어: `npx magicui-cli@latest add [component-name]`

### 🔥 2순위: Governance 페이지
- Battle Votes (몰빵 투표) 시스템
- Rebalancing Votes (구성 조정) 시스템

### 🔥 3순위: Portfolio 페이지
- 자산 관리 대시보드
- PnL 카드 생성기

### 🟡 4-6순위: 나머지 페이지들
- Trending, Vaults, Bridge
- 기본 UI/UX 구현

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