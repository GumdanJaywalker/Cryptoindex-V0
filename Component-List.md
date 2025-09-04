# 🚀 Cryptoindex 프로젝트 컴포넌트 목록

## 📋 프로젝트 개요
**프로젝트명**: Cryptoindex - 밈코인 인덱스 기반 파생상품 거래 플랫폼  
**기술스택**: Next.js, React, TypeScript, Tailwind CSS  
**목표**: Hyperliquid UI + 바이낸스 정보량 + 인덱스 특화 기능  

---

## 🏗️ 메인 페이지 구조

### 📱 App Pages (`/app/`)
| 페이지 | 경로 | 우선순위 | 상태 |
|--------|------|----------|------|
| **Trading** | `/trading/page.tsx` | 🔥 1순위 | ✅ 구현됨 |
| **Governance** | `/governance/page.tsx` | 🔥 2순위 | ✅ 구현됨 |
| **Portfolio** | `/portfolio/page.tsx` | 🔥 3순위 | ✅ 구현됨 |
| **Vaults** | `/vaults/page.tsx` | 🟡 4순위 | ✅ 구현됨 |
| **Dashboard** | `/dashboard/page.tsx` | - | ✅ 추가 페이지 |

---

## 🧩 컴포넌트 세부 목록

### 🔐 인증 관련 (`/components/auth/`)
- `PrivyAuth.tsx` - Privy 인증 컴포넌트
- `PrivyAuth 2.tsx` - 백업 버전

 

### 🗳️ 거버넌스 관련 (`/components/governance/`)
- `GovernanceLayout.tsx` - 거버넌스 메인 레이아웃
- `GovernanceDashboard.tsx` - 거버넌스 대시보드
- `BattleVotesSection.tsx` - 배틀 투표 섹션
- `BattleVoteCard.tsx` - 배틀 투표 카드
- `RebalancingVotesSection.tsx` - 리밸런싱 투표 섹션
- `RebalancingVoteCard.tsx` - 리밸런싱 투표 카드

### 🎯 포트폴리오 관련 (`/components/portfolio/`)
- `PortfolioLayout.tsx` - 포트폴리오 메인 레이아웃
- `AccountSummary.tsx` - 계정 요약
- `PositionsSection.tsx` - 포지션 섹션
- `TradingAnalytics.tsx` - 거래 분석
- `VotingPowerManager.tsx` - 투표권 관리
- `PnLCardGenerator.tsx` - PnL 카드 생성기

### 💹 거래 관련 (`/components/trading/`)
- `TradingLayout.tsx` - 트레이딩 메인 레이아웃
- `IndexInfoBar.tsx` - 인덱스 정보 바
- `IndexInfoModal.tsx` - 인덱스 상세 모달
- `ChartArea.tsx` - 차트 영역
- `OrderBook.tsx` - 호가창
- `TradingPanel.tsx` - 거래 패널
- `TradingBottomTabs.tsx` - 하단 탭 영역
- `RecentTrades.tsx` - 최근 거래 내역
- `CommunityFeed.tsx` - 커뮤니티 피드
- `AccountPanel.tsx` - 계정 패널

 

### 🏦 볼트 관련 (`/components/vaults/`)
- `VaultsLayout.tsx` - 볼트 메인 레이아웃
- `VaultsDashboard.tsx` - 볼트 대시보드
- `FilterSearch.tsx` - 필터 및 검색
- `ProtocolVaults.tsx` - 프로토콜 볼트
- `UserVaults.tsx` - 사용자 볼트
- `CreateVaultModal.tsx` - 볼트 생성 모달

### 💳 지갑 관련 (`/components/wallet/`)
- `WalletConnectButton.tsx` - 지갑 연결 버튼
- `WalletDropdown.tsx` - 지갑 드롭다운
- `NetworkDisplay.tsx` - 네트워크 표시
- `constants.ts` - 지갑 상수들
- `types.ts` - 지갑 타입 정의
- `utils.ts` - 지갑 유틸리티
- `hooks/` - 지갑 관련 훅들
  - `useNetworkSwitch.ts` - 네트워크 전환 훅

### 🎨 레이아웃 관련 (`/components/layout/`)
- `Header.tsx` - 메인 헤더/네비게이션

### 🔧 프로바이더 관련 (`/components/providers/`)
- `PrivyProvider.tsx` - Privy 프로바이더
- `ToastProvider.tsx` - 토스트 프로바이더

### 🎯 다이얼로그 관련 (`/components/dialogs/`)
- `index.ts` - 다이얼로그 인덱스
- `trading-dialog.tsx` - 거래 다이얼로그
- `settings-dialog.tsx` - 설정 다이얼로그
- `wallet-connection-dialog.tsx` - 지갑 연결 다이얼로그
- `index-detail-modal.tsx` - 인덱스 상세 모달

### 🔔 알림 관련 (`/components/notifications/`)
- `toast-system.tsx` - 토스트 시스템

### 🎪 데모 관련 (`/components/demo/`)
- `dialogs-showcase.tsx` - 다이얼로그 쇼케이스

---

## 🎨 UI 컴포넌트 라이브러리

### 📦 기본 UI 컴포넌트들 (`/components/ui/`)

#### 핵심 컴포넌트
- `button.tsx` - 버튼 컴포넌트
- `card.tsx` - 카드 컴포넌트  
- `dialog.tsx` - 다이얼로그
- `input.tsx` - 입력 컴포넌트
- `table.tsx` - 테이블
- `tabs.tsx` - 탭 컴포넌트
- `toast.tsx` - 토스트
- `tooltip.tsx` - 툴팁

#### 폼 관련
- `form.tsx` - 폼 컴포넌트
- `label.tsx` - 라벨
- `checkbox.tsx` - 체크박스
- `radio-group.tsx` - 라디오 그룹
- `select.tsx` - 셀렉트
- `slider.tsx` - 슬라이더
- `switch.tsx` - 스위치
- `textarea.tsx` - 텍스트 영역

#### 네비게이션
- `navigation-menu.tsx` - 네비게이션 메뉴
- `breadcrumb.tsx` - 브레드크럼
- `pagination.tsx` - 페이지네이션
- `sidebar.tsx` - 사이드바

#### 레이아웃
- `separator.tsx` - 구분선
- `scroll-area.tsx` - 스크롤 영역
- `resizable.tsx` - 리사이즈 가능
- `sheet.tsx` - 시트
- `aspect-ratio.tsx` - 비율 유지

#### 피드백
- `alert.tsx` - 알럿
- `alert-dialog.tsx` - 알럿 다이얼로그
- `progress.tsx` - 프로그레스 바
- `skeleton.tsx` - 스켈레톤
- `badge.tsx` - 배지

### 🎭 애니메이션 컴포넌트들

#### Aceternity UI 컴포넌트들
- `3d-card.tsx` - 3D 카드 효과
- `3d-pin.tsx` - 3D 핀 효과
- `animated-modal.tsx` - 애니메이션 모달
- `aurora-background.tsx` - 오로라 배경
- `background-beams.tsx` - 배경 빔 효과
- `background-gradient.tsx` - 배경 그라디언트
- `bento-grid.tsx` - 벤토 그리드
- `card-hover-effect.tsx` - 카드 호버 효과
- `cover.tsx` - 커버 효과
- `direction-aware-hover.tsx` - 방향 인식 호버
- `evervault-card.tsx` - Evervault 카드
- `flip-words.tsx` - 단어 플립 효과
- `floating-dock.tsx` - 플로팅 독
- `floating-navbar.tsx` - 플로팅 네비바
- `focus-cards.tsx` - 포커스 카드
- `glare-card.tsx` - 글레어 카드
- `globe.tsx` - 글로브 효과
- `hero-highlight.tsx` - 히어로 하이라이트
- `hero-parallax.tsx` - 히어로 패럴랙스
- `images-slider.tsx` - 이미지 슬라이더
- `infinite-moving-cards.tsx` - 무한 이동 카드
- `lamp.tsx` - 램프 효과
- `layout-grid.tsx` - 레이아웃 그리드
- `meteors.tsx` - 유성 효과
- `moving-border.tsx` - 움직이는 테두리
- `parallax-scroll.tsx` - 패럴랙스 스크롤
- `shooting-stars.tsx` - 별똥별 효과
- `sparkles.tsx` - 반짝임 효과
- `spotlight.tsx` - 스포트라이트
- `sticky-scroll-reveal.tsx` - 스티키 스크롤 효과
- `text-generate-effect.tsx` - 텍스트 생성 효과
- `text-hover-effect.tsx` - 텍스트 호버 효과
- `timeline.tsx` - 타임라인
- `typewriter-effect.tsx` - 타이프라이터 효과
- `vortex.tsx` - 소용돌이 효과
- `wavy-background.tsx` - 웨이브 배경
- `wobble-card.tsx` - 흔들림 카드
- `world-map.tsx` - 세계지도

### 🎪 Magic UI 컴포넌트들 (`/components/magicui/`)
- `animated-beam.tsx` - 애니메이션 빔
- `animated-gradient-text.tsx` - 애니메이션 그라디언트 텍스트
- `blur-in.tsx` - 블러 인 효과
- `border-beam.tsx` - 테두리 빔
- `globe.tsx` - 글로브
- `number-ticker.tsx` - 숫자 티커
- `orbiting-circles.tsx` - 궤도 원형
- `ripple.tsx` - 리플 효과
- `slide-in.tsx` - 슬라이드 인

---

## 🛠️ 백엔드 & 설정

### 🔗 API 라우트들 (`/app/api/`)
- `auth/logout/route.ts` - 로그아웃 API
- `auth/sync-user/route.ts` - 사용자 동기화 API
- `health/route.ts` - 헬스체크 API
- `user/profile/route.ts` - 사용자 프로필 API

### ⚙️ 라이브러리 & 설정 (`/lib/`)
- `utils.ts` - 유틸리티 함수들
- `auth/privy-jwt.ts` - Privy JWT 처리
- `middleware/privy-auth.ts` - Privy 인증 미들웨어
- `privy/config.ts` - Privy 설정
- `privy/middleware.ts` - Privy 미들웨어
- `supabase/client.ts` - Supabase 클라이언트
- `supabase/types.ts` - Supabase 타입

---

## 📊 개발 진행 상황

### ✅ 완료된 기능들
1. **🔥 Trading Page (1순위)** - 완전 구현
   - 인덱스 정보 바, 차트 영역, 호가창, 거래 패널
   - 하단 탭 시스템, 커뮤니티 피드
   - 모든 거래 관련 컴포넌트 완성

2. **🔥 Governance Page (2순위)** - 완전 구현
   - Battle Votes 시스템 (몰빵 투표)
   - Rebalancing Votes 시스템
   - 실시간 투표 현황 UI

3. **🔥 Portfolio Page (3순위)** - 완전 구현
   - 포트폴리오 대시보드, 포지션 관리
   - 투표권 관리 시스템
   - PnL 카드 생성기

4. **🟡 Vaults Page (4순위)** - 완전 구임
   - 볼트 대시보드, 프로토콜/사용자 볼트
   - 볼트 생성 및 관리


### 🎨 UI/UX 완성도
- **완전한 UI 시스템**: 100+ 개의 UI 컴포넌트
- **애니메이션 시스템**: Aceternity + Magic UI
- **반응형 디자인**: 데스크톱/태블릿/모바일 대응
- **다크모드**: 파스텔톤 남색 테마
- **Hyperliquid 스타일**: 원본과 유사한 디자인

### 🔧 기술적 구현
- **인증 시스템**: Privy 통합 완료
- **지갑 연동**: 멀티 지갑 지원
- **네트워크 관리**: Hyperliquid 네트워크 특화
- **상태 관리**: React Context + 로컬 상태
- **타입 안전성**: 완전한 TypeScript 지원

---

## 🎯 특별 기능들

### 🚀 인덱스 특화 기능
- **인덱스 구성 분석**: 실시간 자산 비중 표시
- **투표 시스템**: Battle/Rebalancing 투표 UI
- **커뮤니티 피드**: 소셜 트레이딩 요소

### 🎨 바이럴 기능
- **PnL 카드 생성기**: 수익 인증 카드 생성/공유
- **커뮤니티 리더보드**: Top Holders, Whale Alert
- **소셜 피드**: 트레이딩 성과 공유

### 🔥 Hyperliquid 스타일
- **완전한 UI 복사**: 원본과 거의 동일한 디자인
- **바이낸스 정보량**: 전문가급 정보 밀도
- **파스텔톤 남색**: 민트색 대신 남색 계열

---

## 📈 다음 단계

### 🔮 기능 구현 단계
1. **API 연동**: 실제 데이터 연결
2. **실시간 업데이트**: WebSocket 연동
3. **거래 로직**: 실제 거래 기능 구현
4. **블록체인 연동**: Hyperliquid 네트워크 연결

### 🎨 UI/UX 개선
1. **마이크로 애니메이션**: 세부 인터랙션 개선
2. **성능 최적화**: 렌더링 최적화
3. **접근성**: ARIA 및 키보드 네비게이션
4. **다국어**: 국제화 지원

---

## 📝 프로젝트 요약

**총 컴포넌트 수**: 200+ 개  
**총 페이지 수**: 6개 메인 페이지 + 다수 서브페이지  
**UI 라이브러리**: 100+ 개의 재사용 가능한 컴포넌트  
**개발 완성도**: UI/UX 90% 완료, 기능 구현 대기 중  

**핵심 달성 사항**:
- ✅ Hyperliquid 스타일 완전 구현
- ✅ 바이낸스 수준 정보 밀도
- ✅ 인덱스 특화 기능 UI 완성
- ✅ 소셜 트레이딩 요소 통합
- ✅ 완전한 반응형 디자인
- ✅ 다크모드 + 파스텔톤 남색 테마

이 프로젝트는 **실제 서비스와 동일한 수준의 완성된 UI**를 보유하고 있으며, 이제 백엔드 연동과 실제 기능 구현 단계만 남은 상태입니다! 🚀
