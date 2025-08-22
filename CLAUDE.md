# CLAUDE.md - HyperIndex 개발 환경 정보

> 📅 **마지막 업데이트**: 2025-08-21

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
  /trending                   # 인기 인덱스
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
  /* 🎨 HyperIndex 브랜드 컬러 - #8BD6FF 기반 */
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

### 🌐 언어 가이드라인 (중요!)
- **사이트 언어**: 모든 UI 텍스트, 버튼, 라벨, 메시지는 영어로 작성
- **코드 주석**: 모든 주석은 영어로 작성 (// This is correct)
- **변수명/함수명**: 영어로 명명 (한글 변수명 금지)
- **콘솔 로그**: 개발용 로그도 영어로 작성
- **국제 사용자 대상**: 글로벌 서비스를 위한 영어 우선 정책

## 📊 현재 진행 상황 (2025-01-21)

### ✅ 최근 완료된 작업
- **Landing Page 카드 표시 문제 해결**: 16개 인덱스 카드가 안정적으로 표시되도록 필터링 로직 개선
- **시각적 효과 정리**: 사용자가 요청한 줄무늬/shimmer 애니메이션 효과 완전 제거
- **툴팁 clipping 해결**: Long/Short 호버 툴팁이 카드 영역을 벗어나 완전히 표시되도록 overflow 설정 수정
- **브랜드 색상 테마**: #8BD6FF 기반 브랜드 컬러 시스템 전역 적용 완료

## 🎯 다음 개발 우선순위

### 🔥 1순위: Landing Page 레이아웃 혁신
**목표**: 인덱스 카드를 줄 형태로 재배치하고 사이드바로 사용자 편의성 극대화

#### 📋 구체적 작업:
- **Index Card Layout 변경**: 
  - 현재 3열 그리드 → 수평 줄 형태로 변경
  - 각 줄당 1-2개 카드 배치로 가독성 향상
  - 카드 크기 조정 (더 넓고 낮게)
- **사이드바 구현**:
  - 왼쪽/오른쪽 여백 공간 활용
  - 실시간 통계, 알림, 빠른 액세스 메뉴 등
  - 사용자 맞춤 정보 표시 영역
- **MagicUI/Aceternity 효과 적용**:
  - 카드별 미묘한 애니메이션 효과
  - 호버 상태 개선
  - 로딩 스켈레톤 UI

### 🔥 2순위: Trading Page 디자인 개선
**목표**: 전문적이고 직관적인 거래 인터페이스 완성

#### 📋 구체적 작업:
- **레이아웃 최적화**: Hyperliquid 스타일 개선
- **MagicUI 컴포넌트 통합**: Border Beam, Ripple, Particles 등
- **실시간 데이터 시각화 강화**
- **거래 패널 UX 개선**

### 🔥 3순위: 기타 페이지 완성
- **Governance**: 투표 시스템 구현
- **Portfolio**: 자산 관리 대시보드  
- **Trending/Bridge**: 기본 UI/UX 구현

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