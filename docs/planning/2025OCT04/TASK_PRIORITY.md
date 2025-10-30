# 2025OCT04 작업 우선순위 - Phase 0 베타 런치

**목적**: 투자자 데모 준비 우선순위 리스트
**기준**: 라이브 데모 임팩트, 시각적 품질, 핵심 기능
**목표**: VC 프레젠테이션 준비 완료
**최종 업데이트**: 2025년 10월 28일

---

## 🔥 최우선 (4-5주차) - 데모 전 필수 완료

### 1. Fee Structure 구현 ⭐ NEW
**중요한 이유**: 모든 수수료 계산의 기반, 잘못 구현하면 수익 모델 전체 망가짐
**영향 범위**: Trade, Launch, Portfolio, Rebalancing 모든 페이지
**작업량**: 대 (VIP tier + Layer별 차등 + 복잡한 계산식)

**구현 항목**:
- [ ] VIP Tier 시스템 (VIP0-VIP4, 0.3%-0.6% 차등)
- [ ] Layer별 수수료 구조 (L1/L2/L3/VS/Partner)
- [ ] Trade Fee 계산 (Protocol + Creator + LP)
- [ ] Rebalancing Fee 계산 (주기별 차등)
- [ ] Management Fee 계산 (AUM 기반)
- [ ] `lib/constants/fees.ts` 완전 재작성
- [ ] `lib/utils/fees.ts` 계산 함수 구현
- [ ] 6개 컴포넌트 수수료 로직 업데이트
- [ ] 문서: `docs/planning/2025OCT04/FEE_STRUCTURE_SPECIFICATION.md`

### 2. 화폐 시스템 표준화 + VIP Tier 통합
**중요한 이유**: 일관되지 않은 화폐 표시는 신뢰도 손상 + VIP tier 수수료 시스템 통합
**영향 범위**: 모든 페이지의 화폐 표시 + 수수료 계산 로직
**작업량**: 중간 (기획 문서 기준 13시간 + VIP tier 통합)
**통합**: Fee Structure Specification과 밀접히 연계

**Phase 0 HYPE 전용 시스템**:
- [ ] Phase 0용 HYPE 전용 Mock API Layer 구현
- [ ] 모든 페이지 업데이트: Trade, Portfolio, Launch, Discover, Governance, Settings
- [ ] 전체적으로 일관된 HYPE 표시 보장
- [ ] HIIN/HIDE 토큰 참조 제거 완료 ✅

**VIP Tier + Fee Structure 통합** ⭐ NEW:
- [x] Section 5.4 Fee API 완전 재작성:
  - [x] `getUserVIPTier()` API 추가
  - [x] `calculateTradingFee(amount, layer, vipTier)` - VIP + Layer 기반 수수료 breakdown
  - [x] `getRebalancingFeeInfo(layer)` API 추가
  - [x] `getManagementFeeInfo(layer)` API 추가
  - [x] `getLauncherFee()` API 추가 (Fixed $5)
  - [x] Helper functions: `formatFeeBreakdown()`, `getVIPDiscount()`
- [x] Section 6.4 VIP Tier Settings Integration 추가:
  - [x] `VIPTierSection.tsx` 컴포넌트 설계
  - [x] Settings 페이지에 VIP tier 표시 (tier, protocol fee, discount, requirements)
  - [x] All tiers comparison table
- [x] Component examples 업데이트:
  - [x] TradePanel에 fee breakdown 표시 (Protocol + Creator + LP)
  - [x] VIP tier 표시 추가
  - [x] Layer-based fee calculation 적용
- [x] lib/constants/fees.ts 코드 예시 추가:
  - [x] `VIP_PROTOCOL_FEES` constant (VIP0-VIP4: 0.003-0.006)
  - [x] `LAYER_FEES` constant (L1/L2/L3/VS/PARTNER with Creator/LP/Rebalancing/Management fees)
  - [x] `LAUNCHER_FEE` constant ($5)
- [x] Phase transition guide 업데이트:
  - [x] Backend API endpoints 추가 (vip-tier, rebalancing-info, management-info)
  - [x] API response formats 업데이트

**문서**: `docs/planning/2025OCT04/CURRENCY_SYSTEM_REFACTORING.md` (VIP tier 통합 완료)

### 3. Launch 페이지 개선
**중요한 이유**: 핵심 가치 제안 데모 (인덱스 생성)
**영향 범위**: 투자자들이 사용자의 인덱스 생성 과정을 봐야 함
**작업량**: 대 (19개 피드백 항목)

**Phase 1 - 빠른 개선 (먼저 할 것)**:
- [ ] "Preview" → "Backtesting"으로 이름 변경
- [ ] Backtesting 차트 하단에 Sharpe Ratio + MDD 추가
- [ ] 모달의 X 버튼 중복 수정
- [ ] 체크박스 가시성 개선 (밝은 테두리)
- [ ] "Total Cost" 용어 통일

**Phase 2 - 핵심 기능**:
- [ ] 자산 검색 버그 수정 (assetID 중복)
- [ ] 전체 자산 목록 토글 추가 (스크롤 가능)
- [ ] Backtesting 기간 확장: 1일/7일/30일/1년
- [ ] 수수료 세부 내역 포함 실시간 비용 계산 (**Fee Structure와 통합**)
- [ ] 문서: `docs/planning/2025OCT04/LAUNCH_PAGE_REFACTORING.md`

**Phase 0 Asset Limitations**:
- [ ] Asset composition search: Add exclamation icon (!) tooltip next to search bar
- [ ] Tooltip message: "Phase 0 supports HyperCore Spot tokens only. HyperCore Perpetual tokens and Multi-chain assets coming at official launch."

### 4. UI 정리 - 전역 변경사항
**중요한 이유**: 투자자를 위한 전문적인 외관
**영향 범위**: 모든 페이지에 적용
**작업량**: 중-대

**불필요한 요소 제거**:
- [ ] 사이드바 제거, 주요 항목을 푸터로 이동 (Axiom 스타일 아이콘)
- [ ] 푸터 항목 클릭 시 모달로 확장
- [ ] 전체적인 이모지 남용 제거
- [ ] 색상 혼란 감소: 민트 브랜드 컬러로 통일 (#98FCE4 변형)
- [ ] 손익 색상 채도 감소 (초록/빨강 덜 강렬하게)

**레이아웃 수정**:
- [ ] 하드코딩된 고정 크기 제거
- [ ] 반응형 사이징 구현 (뷰포트 기준)
- [ ] 여러 화면 크기에서 테스트
- [ ] 깔끔한 Hyperliquid 스타일 미니멀 UI 보장

---

## ⚡ 높은 우선순위 (5-6주차) - 핵심 데모 기능

### 5. Index Details Modal 통일
**중요한 이유**: 모든 페이지에서 일관된 UX
**영향 범위**: Landing, Discover, Launch, Leaderboard
**작업량**: 중간

- [ ] 통합된 `IndexDetailsModal` 컴포넌트 생성
- [ ] Landing 페이지 모달 교체 (인덱스 카드 클릭)
- [ ] Discover 페이지 Actions 컬럼에 "View Details" 버튼 추가
- [ ] Discover Actions 순서 변경: Trade | View Details | ⭐
- [ ] Leaderboard에서 같은 모달 사용 (사용자의 주요 보유 종목)
- [ ] 모든 모달이 라이브러리의 공유 컴포넌트 사용하도록 보장

### 6. Dashboard & Portfolio 다듬기
**중요한 이유**: 사용자 가치 표시 (손익, 보유 자산)
**영향 범위**: 투자자의 주요 질문: "거래 후 사용자가 뭘 보나요?"
**작업량**: 중-대

**기획 문서 필요** (아직 생성 안됨):
- [ ] `docs/planning/2025OCT04/DASHBOARD_PORTFOLIO_REFACTORING.md` 생성
- [ ] 표시할 주요 지표 정의
- [ ] UI 정리 원칙 적용 (민트 색상, 깔끔한 레이아웃)
- [ ] Creator fee 수익 표시 추가 (**Fee Structure와 통합**)
- [ ] 화폐 시스템과 통합

**Futures Trading (Phase 1)**:
- [ ] Add Futures section with "coming soon" message
- [ ] Exclamation icon (!) tooltip: "Futures trading available at official launch"
- [ ] Professional English message, no emoji

### 7. Discover 페이지 개선 (11개 피드백 항목)
**중요한 이유**: 인덱스 발견은 핵심 사용자 플로우, Henry 피드백 11개 항목 해결 필요
**영향 범위**: Discover 페이지 전체 + Launch 페이지 (컴포넌트 공유)
**작업량**: 중-대 (12일 예상, 7 phases)

**Search & Validation**:
- [ ] 검색 로직 개선: 이름 + 티커만 검색 (description 제거)
- [ ] 인덱스 이름 validation: 이모지 금지 (alphanumeric + spaces + hyphen only)
- [ ] Launch 페이지에도 동일한 validation 적용

**Category & Filters**:
- [ ] Dynamic category criteria 정의 및 구현:
  - [ ] Hot: 24h volume growth rate 계산
  - [ ] New: Created < 7 days
  - [ ] Top Gainers/Losers: 24h price change sort
  - [ ] High Volume: Top 20% percentile
- [ ] Partner Indices 카테고리 추가 (Basic filters row)

**Brand Color Standardization**:
- [ ] `lib/constants/colors.ts` 생성
- [ ] Profit/Loss 색상: 채도 낮춘 초록/빨강 (`#4ade80`, `#f87171`)
- [ ] 모든 UI 요소: 민트 브랜드 컬러 톤 변형 (#98FCE4 기반)
- [ ] Layer 뱃지: 민트 톤 변형
- [ ] VS Battle 뱃지: 민트 톤 변형

**Composition Filter 재설계**:
- [ ] 버튼 그리드 → 스크롤 가능 체크박스 리스트
- [ ] 검색창 추가 (자산 필터링)
- [ ] Match Any/All 토글 유지
- [ ] Launch 페이지와 동일한 자산 데이터 소스 사용

**Advanced Filters - Slider UX**:
- [ ] 재사용 가능한 `<RangeSlider>` 컴포넌트 생성 (슬라이더 + 입력박스 + presets)
- [ ] Performance Range: 슬라이더 적용 (24h/7d/30d tabs)
- [ ] NAV Range: 슬라이더 적용
- [ ] Volume Range: 슬라이더 적용
- [ ] Liquidity Range: 슬라이더 적용
- [ ] Launch 페이지 자산 구성 슬라이더 참고

**Segment Filter (NEW)**:
- [ ] `lib/constants/segments.ts` 생성 (MEME, DeFi, Solana, RWA, AI 등)
- [ ] Advanced Filters에 Segment 섹션 추가
- [ ] Multi-select tags (OR logic)
- [ ] 인덱스는 여러 segment 가질 수 있음

**Component Reusability**:
- [ ] `<RangeSlider>` 컴포넌트 추출 (Discover + Launch 공유)
- [ ] `<AssetSearchList>` 컴포넌트 추출 (Discover + Launch 공유)
- [ ] `<SegmentBadge>` 컴포넌트 생성

**Integration & Testing**:
- [ ] IndexDetailsModal 통합
- [ ] 필터 조합 테스트 (composition + segment + performance)
- [ ] 반응형 테스트 (1920px, 1440px, 1024px, 768px)

**Share Button Improvements (Feedback #19)**:
- [ ] Share modal redesign: Coupang/Musinsa style layout
- [ ] Link copy: Text box + copy button
- [ ] Social share icons row: X (Twitter), Telegram, Instagram, Apple Share
- [ ] Consistent share UI across Discover + Launch + Portfolio pages
- [ ] PnL-style card generation option (downloadable/shareable image)
- [ ] Reference: `LAUNCH_PAGE_REFACTORING.md` Phase 9 (lines 486-511)

**문서**: `docs/planning/2025OCT04/DISCOVER_PAGE_TASK_PLAN.md`

**레퍼런스**: Binance Futures (필터), Coupang/Musinsa (Share 기능 UX), Axiom (검색), Hyperliquid (색상)

---

## 📊 중간 우선순위 (6-7주차) - 보조 기능

### 8. Trade 페이지 - Info & Trading Data 탭
**중요한 이유**: 투자자 의사결정에 필요한 상세 정보
**영향 범위**: Trade 페이지 ChartArea 내 Info/Trading Data 탭
**작업량**: 대 (많은 데이터 항목, 차트화 필요)

**Phase 0 Scope**: Phase 0은 HyperCore Spot 토큰 인덱스 거래만 지원. Futures 관련 항목은 닫힌 상태로 시작.

**Futures Availability Indicator**:
- [ ] Add exclamation icon (!) tooltip: "Futures trading coming at official launch"
- [ ] Placement: TBD (미정)

**Data Consistency & Component Reusability** ⭐ NEW:
- [ ] IndexDetailsModal과 겹치는 항목들은 같은 데이터 소스 사용
- [ ] 같은 라이브러리의 동일한 변수명 사용 (marketCap, totalAssets, rebalanceFreq 등)
- [ ] 통일된 레이아웃/컴포넌트로 표시 (재사용 가능한 컴포넌트 생성)
- [ ] 겹치는 항목 예시:
  - Market Cap, FDV, Total Assets
  - Index Creation Date, Rebalance Freq, Mgmt Fee
  - Description, Whitepaper
  - Asset Composition (Basket Info)
- [ ] 컴포넌트 추출: `<IndexInfoField>`, `<BasketComposition>`, `<FeeDisplay>`
- [ ] 일관성 보장: Trade 페이지 Info 탭 = IndexDetailsModal 정보

**레퍼런스**: Binance Futures (주요), Hyperliquid
**주의**: Axiom/Pumpfun은 참고 금지 (토큰 세그먼트 너무 다름)

**Info 탭 항목**:
- [ ] Layout 재구성: Token Info / Basket Info / Trading Rules로 분할 (Binance Futures 참조)
- [ ] **Token Info**:
  - [ ] Market Cap + FDV 추가
  - [ ] Total Assets
  - [ ] Index Creation Date (이름 변경: Index Inception → Index Creation Date)
  - [ ] Rebalance Freq
  - [ ] Mgmt Fee
  - [ ] Settlement Currency (USDC → HYPE로 수정)
  - [ ] Description
  - [ ] Whitepaper (L1/L2만, L3는 Graduation 후 Creator가 추가 가능)
  - [ ] Index Methodology (Whitepaper와 동일 처리)
- [ ] **Basket Info** (Asset Composition 확장):
  - [ ] 파이차트/도넛차트 추가 (2가지 이상 보기 지원)
  - [ ] 각 토큰별 Valuation (% 말고 금액)
  - [ ] Others 상세 내역
  - [ ] "More..." 버튼으로 팝업 카드 → 더 상세한 정보
- [ ] **Trading Rules** (대폭 수정):
  - [ ] 제거: Trade Hours, Maximum Leverage
  - [ ] 추가: Min. Trade Amount, Min. Price Movement, Price Precision
  - [ ] 추가: Limit Buy/Sell Order Price Cap/Floor Ratio
  - [ ] 추가: Max. Market/Limit Order Amount
  - [ ] 추가: Max. Number of Open Orders
  - [ ] 추가: Min. Notional Value, Price Protection Threshold
  - [ ] 추가: Market Order Price Cap/Floor Ratio
  - [ ] 추가: 예외조항 (조건부 주문 제한 등)
  - [ ] Maker/Taker Fee → Trading Data로 이전, 실제 Fee 수치로 대체 (Fee Structure 통합)

**Trading Data 탭 항목**:
- [ ] **시장 데이터** (Timeframe 분류, 차트화):
  - [ ] Vol, Active Traders, Liquidity, OI, Orderbook Depth
  - [ ] Taker Buy/Sell Volume
  - [ ] Limit Buy/Sell Orderbook Size
- [ ] **트레이더 활동** (Timeframe 분류, 차트화):
  - [ ] Top Trader Buy/Sell Ratio (Accounts)
  - [ ] Top Trader Buy/Sell Ratio (Positions)
  - [ ] Top 10/100 Net Position (차트로 변화 추적)
  - [ ] Whale/Retail Ratio (특색 있음, 추천)
- [ ] **기타**:
  - [ ] NAV Gap (NAV ↔ Market Price 차이)
  - [ ] Maker/Taker Fee (Info에서 이전)
- [ ] **제외 항목**:
  - [ ] ~~Funding Rate~~ (Spot이라 없음, Futures 확장 시)
  - [ ] ~~Long/Short Ratio~~ (Futures 확장 시)
  - [ ] ~~Fear & Greed Index~~ (복잡하고 불필요, Backlog)
  - [ ] ~~Social Volume~~ (수집 고난도, Backlog)

**20251030 추가 - TradingView Chart UX 개선**:
- [ ] **Default zoom level 조정**: 기본 view가 너무 zoom out → 최근 100 캔들 정도로 초기 표시
- [ ] **MA 버튼 토글 기능**: MA 표시 후 다시 클릭해도 제거 안 됨 → MA 켜기/끄기 토글 구현
- [ ] ~~Indicators 메뉴~~ (lightweight-charts 무료 버전 제약, 유료 플랜 업그레이드 시 고려)

### 9. Governance 구조 재설계
**중요한 이유**: TGE DAO vs Index Token Governance 명확히 구분
**영향 범위**: Governance 페이지 전체 구조 변경
**작업량**: 중간

**핵심 변경사항**:
- [ ] **TGE DAO Governance** (네이티브 토큰 필요):
  - [ ] 페이지 닫기 or 커밍순 처리
  - [ ] 로드맵에 DAO 오픈 일정 표시
  - [ ] 헤더 탭 필요성 재검토 (레퍼런스 조사: 다른 DEX들은 거버넌스 탭 있나?)
  - [ ] 이유: 트레이딩 플랫폼의 주요 목적이 거버넌스 투표가 아님
- [ ] **Index Token Governance** (처음부터 오픈):
  - [ ] 명칭 변경: "Governance" → "INDEX MANAGING"
  - [ ] 개별 인덱스 페이지에서 접근 가능하도록 경로 생성
  - [ ] UI 상에서 TGE DAO와 명확히 구분
  - [ ] 레퍼런스: Business Structure 이미지 참조

**작업 항목**:
- [ ] TGE DAO Governance 페이지 처리 결정 (닫기 vs 커밍순)
- [ ] Index Token Governance 경로 및 UI 설계
- [ ] 헤더 탭 구조 재검토 (레퍼런스 조사 필요)
- [ ] 보안 입력 sanitization 적용 (Index Token Governance 검색)

### 10. Leaderboard 시각적 일관성
**중요한 이유**: 플랫폼의 사회적 증거
**영향 범위**: 활발한 트레이더 커뮤니티 표시
**작업량**: 소

- [ ] 브랜드 컬러 표준화 적용
- [ ] 트레이더 보유 자산용 통합 IndexDetailsModal 통합
- [ ] 반응형 트레이더 카드 보장

---

## 🔐 기반 우선순위 (지속) - 백그라운드

### 11. 프론트엔드 보안 구현
**중요한 이유**: 사용자 입력 취약점 방지
**영향 범위**: 모든 입력 필드
**작업량**: 소 (3시간, 비용 0원)

- [ ] `lib/utils/security.ts`에 `sanitizeInput()` 유틸 추가
- [ ] `validateNumber()` 유틸 추가
- [ ] Launch 페이지 입력에 적용
- [ ] Governance 검색에 적용
- [ ] Settings 입력에 적용
- [ ] 문서: `docs/planning/2025OCT04/FRONTEND_SECURITY_ATTACK_SCENARIOS.md`

---

## 📋 추가 작업 (피드백 대기)

### 12. Referrals 페이지 개선
**중요한 이유**: 사용자 유입 및 성장 전략
**영향 범위**: Referrals 페이지 + Referrals Apply 페이지
**작업량**: TBD (피드백 대기 중)
**상태**: ⏳ Feedback Pending

**현재 상태**:
- 기존 페이지: `/referrals`, `/referrals/apply`
- 레퍼럴 프로그램 구조 존재
- 구체적인 개선 사항 미정

**예상 작업 항목** (피드백 후 확정):
- [ ] 레퍼럴 링크 생성 및 공유 기능
- [ ] 레퍼럴 통계 대시보드 (초대 수, 수익 등)
- [ ] 레퍼럴 보상 구조 표시
- [ ] 신청 프로세스 개선
- [ ] 브랜드 컬러 표준화 적용
- [ ] Fee Structure와 통합 (레퍼럴 수수료 할인)

**문서**: TBD (피드백 후 생성 예정)

---

### 13. Backend Integration & E2E Test
**중요한 이유**: 실제 데이터 연동 및 전체 플로우 검증
**영향 범위**: 모든 페이지 (Mock → Real API)
**작업량**: 대 (피드백 대기 중)
**상태**: ⏳ Feedback Pending

**현재 상태**:
- 모든 데이터는 Mock/Hardcoded
- Backend API 스펙 미정
- E2E 테스트 전략 미수립

**예상 작업 항목** (피드백 후 확정):
- [ ] Backend API 엔드포인트 정의 및 문서화
- [ ] Mock 데이터 → Real API 연동:
  - [ ] Trade: 주문 실행, 호가창, 거래 내역
  - [ ] Portfolio: 보유 자산, 손익 계산
  - [ ] Launch: 인덱스 생성, 수수료 결제
  - [ ] Discover: 인덱스 목록, 필터링
  - [ ] Governance: 투표, 제안
- [ ] E2E Test 시나리오 작성:
  - [ ] 사용자 회원가입 → 지갑 연결
  - [ ] 인덱스 생성 → 런칭 → 거래
  - [ ] 포트폴리오 확인 → 수익 정산
- [ ] 데이터 동기화 전략 (WebSocket vs Polling)
- [ ] 에러 핸들링 및 fallback 전략
- [ ] 성능 최적화 (캐싱, lazy loading)

**문서**:
- `BACKEND_INTEGRATION_CHECKLIST.md` (이미 존재)
- `BACKEND_DATA_REQUIREMENTS.md` (이미 존재)
- TBD: E2E 테스트 전략 문서 (피드백 후 생성)

---

## 📅 권장 실행 순서

### Week 4 Focus (Oct 28 - Nov 3): 기반 구축
1. **Fee Structure** ⭐ - 모든 수수료 계산의 기반 (최우선)
2. **화폐 시스템** - 모든 페이지의 기반
3. **Launch 페이지 Phase 1** - 빠른 개선 (Backtesting 이름 변경, Sharpe/MDD, 모달 수정)
4. **UI 정리 전역** - 사이드바 제거, 색상 통일, 이모지 제거

### Week 5 Focus (Nov 4 - Nov 10): 핵심 기능
5. **Launch 페이지 Phase 2** - 자산 검색, 실시간 비용 (Fee Structure 통합), Backtesting 기간
6. **Index Details Modal** - 페이지 간 통합 컴포넌트
7. **Discover 개선 (11개 항목)** - 검색, 필터, 슬라이더, Segment Filter, 색상 표준화

### Week 6 Focus (Nov 11 - Nov 17): 완성도
8. **Dashboard & Portfolio** - 기획 문서 작성, 개선 구현 (Fee Structure 통합)
9. **Trading 페이지 다듬기** - 시각적 정리 (Fee Structure 적용)
10. **보안 구현** - 입력 sanitization

### Week 7 Prep (Nov 18+): 최종 점검
11. **최종 QA** - 모든 페이지 테스트, 반응형 체크, 색상 일관성
12. **데모 리허설** - 투자자 워크스루 플로우 준비

---

## 🎯 투자자 데모를 위한 성공 기준

### 시각적 품질
- [ ] 전체적으로 일관된 민트 브랜드 컬러 (#98FCE4 변형)
- [ ] 이모지 난잡함 없음
- [ ] 깔끔한 Hyperliquid 스타일 미니멀 UI
- [ ] 모든 화면 크기에서 반응형 (1920px, 1440px, 1024px 테스트)

### 핵심 기능
- [ ] **Fee Structure**: VIP tier별 차등 수수료, Layer별 구분 정확
- [ ] Launch 페이지: Backtesting + Sharpe/MDD로 인덱스 생성
- [ ] Discover 페이지: 필터로 인덱스 탐색
- [ ] Trade 페이지: 명확한 수수료로 거래 실행 (새 Fee Structure 적용)
- [ ] Portfolio: 보유 자산 및 손익 확인 (Creator fee 수익 표시)
- [ ] 화폐: 일관된 HYPE 전용 표시

### 사용자 플로우 데모
1. Landing → 트렌딩 인덱스 확인
2. Discover → 필터로 인덱스 찾기
3. Index Details → 구성 및 성과 확인
4. Launch → Backtesting으로 커스텀 인덱스 생성
5. Portfolio → 생성한 인덱스 및 보유 자산 확인
6. Trade → 인덱스 거래 실행

---

## 📋 관련 기획 문서

### 생성 완료 ✅
- `docs/planning/2025OCT04/FEE_STRUCTURE_SPECIFICATION.md` ⭐ NEW
- `docs/planning/2025OCT04/CURRENCY_SYSTEM_REFACTORING.md`
- `docs/planning/2025OCT04/FRONTEND_SECURITY_ATTACK_SCENARIOS.md`
- `docs/planning/2025OCT04/LAUNCH_PAGE_REFACTORING.md`

### 필요함 ⏳
- `docs/planning/2025OCT04/DASHBOARD_PORTFOLIO_REFACTORING.md`
- `docs/planning/2025OCT04/UI_CLEANUP_GUIDELINES.md`

---

## 🔑 Fee Structure 통합 포인트

Fee Structure는 여러 작업에 걸쳐 통합되어야 합니다:

1. **Launch 페이지** (Week 5)
   - 실시간 비용 계산에 VIP tier 적용
   - Layer별 수수료 구분 표시
   - Launcher fee $5 적용

2. **Portfolio 페이지** (Week 6)
   - Creator fee 수익 표시
   - Management fee 차감 표시
   - Rebalancing fee 내역 표시

3. **Trade 페이지** (Week 6)
   - VIP tier별 할인 표시
   - Protocol + Creator + LP fee 분리 표시
   - Partner routing 특별 요금 적용

4. **모든 페이지** (지속)
   - 수수료 표시 일관성 유지
   - Tooltip으로 상세 내역 제공
   - 실시간 계산 보장

---

**마지막 업데이트**: 2025-10-29
**다음 검토**: Week 4 완료 후 (Nov 3)
