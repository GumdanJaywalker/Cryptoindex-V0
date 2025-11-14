# Trading Page - Info & Trading Data Tabs Implementation

**Date**: 2025-11-05
**Status**: Planning
**Priority**: HIGH (최우선)
**Reference**: Trade 페이지 ChartArea 내 Info/Trading Data 탭
**Layer Scope**: Phase 0 = HyperCore Spot 토큰 인덱스만 지원

---

## Overview

Trade 페이지의 Info와 Trading Data 탭을 구현하여 투자자 의사결정에 필요한 상세 정보를 제공합니다.

**중요**:
- Phase 0는 HyperCore Spot 토큰 인덱스만 지원
- Futures 관련 항목은 닫힌 상태로 시작
- IndexDetailsModal과 데이터 일관성 유지

---

## 레퍼런스

**주요 참고**:
- Binance Futures (주요 레이아웃 및 항목 구조)
- Hyperliquid (인터페이스 스타일)

**참고 금지**:
- Axiom, Pumpfun (토큰 세그먼트가 너무 다름)

---

## Data Consistency & Component Reusability

### 중요 원칙
1. **IndexDetailsModal과 동일한 데이터 소스 사용**
2. **통일된 변수명** (marketCap, totalAssets, rebalanceFreq 등)
3. **재사용 가능한 컴포넌트** 생성

### 겹치는 항목 (양쪽 모두 표시)
- Market Cap, FDV, Total Assets
- Index Creation Date, Rebalance Freq, Mgmt Fee
- Description, Whitepaper
- Asset Composition (Basket Info)

### 추출할 공통 컴포넌트
1. `<IndexInfoField>` - 정보 필드 표시
2. `<BasketComposition>` - 자산 구성 표시
3. `<FeeDisplay>` - 수수료 표시
4. `<PerformanceChart>` - 성과 차트

---

## Info 탭 구조

### 1. Token Info (토큰 정보)

| 항목 | 설명 | 비고 |
|------|------|------|
| **Market Cap** | 시가총액 | NEW |
| **FDV** | Fully Diluted Valuation | NEW |
| **Total Assets** | 총 자산 규모 | - |
| **Index Creation Date** | 인덱스 생성일 | Index Inception → 이름 변경 |
| **Rebalance Freq** | 리밸런싱 주기 | - |
| **Mgmt Fee** | 관리 수수료 | - |
| **Settlement Currency** | 결제 통화 | USDC → HYPE로 수정 |
| **Description** | 인덱스 설명 | - |
| **Whitepaper** | 백서 링크 | L1/L2만, L3는 Graduation 후 추가 가능 |
| **Index Methodology** | 인덱스 방법론 | Whitepaper와 동일 처리 |

### 2. Basket Info (자산 구성)

**확장 기능**:
- 파이차트/도넛차트 (2가지 이상 보기 지원)
- 각 토큰별 Valuation (% + 금액)
- Others 상세 내역
- "More..." 버튼 → 상세 정보 팝업 카드

**표시 항목**:
- 토큰 심볼
- 배분 비율 (%)
- 배분 금액 (HYPE)
- 현재 가격
- 24h 변화율

### 3. Trading Rules (거래 규칙)

**제거 항목**:
- ❌ Trade Hours
- ❌ Maximum Leverage
- ❌ Maker/Taker Fee (Trading Data로 이전)

**추가 항목**:
- ✅ Min. Trade Amount
- ✅ Min. Price Movement
- ✅ Price Precision
- ✅ Limit Buy/Sell Order Price Cap/Floor Ratio
- ✅ Max. Market/Limit Order Amount
- ✅ Max. Number of Open Orders
- ✅ Min. Notional Value
- ✅ Price Protection Threshold
- ✅ Market Order Price Cap/Floor Ratio
- ✅ 예외조항 (조건부 주문 제한 등)

---

## Trading Data 탭 구조

### 1. 시장 데이터 (Timeframe 분류 + 차트화)

| 항목 | 설명 | 차트 지원 |
|------|------|----------|
| **Volume** | 거래량 | ✅ |
| **Active Traders** | 활성 트레이더 수 | ✅ |
| **Liquidity** | 유동성 | ✅ |
| **OI** | Open Interest | ✅ |
| **Orderbook Depth** | 호가창 깊이 | ✅ |
| **Taker Buy/Sell Volume** | Taker 매수/매도 거래량 | ✅ |
| **Limit Buy/Sell Orderbook Size** | 지정가 매수/매도 호가 크기 | ✅ |

### 2. 트레이더 활동 (Timeframe 분류 + 차트화)

| 항목 | 설명 | 차트 지원 |
|------|------|----------|
| **Top Trader Buy/Sell Ratio (Accounts)** | 상위 트레이더 매수/매도 비율 (계정 기준) | ✅ |
| **Top Trader Buy/Sell Ratio (Positions)** | 상위 트레이더 매수/매도 비율 (포지션 기준) | ✅ |
| **Top 10/100 Net Position** | 상위 10/100 순 포지션 | ✅ |
| **Whale/Retail Ratio** | 고래/리테일 비율 (특색 항목, 추천) | ✅ |

### 3. 기타 항목

| 항목 | 설명 | 비고 |
|------|------|------|
| **NAV Gap** | NAV ↔ Market Price 차이 | - |
| **Maker/Taker Fee** | 메이커/테이커 수수료 | Info에서 이전 |

### 4. 제외 항목 (Futures 확장 시 추가)

- ❌ Funding Rate (Spot이라 없음)
- ❌ Long/Short Ratio (Futures 확장 시)
- ❌ Fear & Greed Index (복잡, Backlog)
- ❌ Social Volume (수집 고난도, Backlog)

---

## Futures Availability Indicator

### Phase 0 제한 표시

**위치**: TBD (미정, 추후 결정)

**표시 방식**:
- Exclamation icon (!) + Tooltip
- Tooltip 내용: "Futures trading coming at official launch"

---

## TradingView Chart UX 개선 (20251030 추가)

### 1. Default Zoom Level 조정
**현재 문제**: 기본 view가 너무 zoom out
**해결책**: 최근 100-150 캔들 정도로 초기 표시 (반응형)

### 2. MA 버튼 토글 기능
**현재 문제**: MA 표시 후 다시 클릭해도 제거 안 됨
**해결책**: MA 켜기/끄기 토글 구현

### 3. Indicators 메뉴 (참고)
**제약**: lightweight-charts 무료 버전 제약
**향후**: 유료 플랜 업그레이드 시 고려

---

## 구현 순서

### Phase 1: 컴포넌트 추출 및 구조화
1. IndexDetailsModal에서 공통 컴포넌트 추출
2. `<IndexInfoField>` 컴포넌트 생성
3. `<BasketComposition>` 컴포넌트 생성
4. `<FeeDisplay>` 컴포넌트 생성

### Phase 2: Info 탭 구현
1. Token Info 섹션 구현
2. Basket Info 섹션 구현 (차트 포함)
3. Trading Rules 섹션 구현

### Phase 3: Trading Data 탭 구현
1. 시장 데이터 섹션 구현 (차트 포함)
2. 트레이더 활동 섹션 구현 (차트 포함)
3. 기타 항목 섹션 구현

### Phase 4: TradingView Chart UX 개선
1. Default zoom level 조정
2. MA 토글 기능 구현

### Phase 5: 통합 및 테스트
1. IndexDetailsModal과 데이터 일관성 확인
2. 반응형 레이아웃 테스트
3. 성능 최적화

---

## Type Definitions

```typescript
// Info Tab Types
export interface TokenInfo {
  marketCap: number
  fdv: number
  totalAssets: number
  creationDate: string
  rebalanceFreq: string
  mgmtFee: number
  settlementCurrency: 'HYPE' | 'USDC'
  description: string
  whitepaper?: string
  methodology?: string
}

export interface BasketAsset {
  symbol: string
  allocation: number // percentage
  valuationHYPE: number // amount in HYPE
  currentPrice: number
  change24h: number
}

export interface TradingRules {
  minTradeAmount: number
  minPriceMovement: number
  pricePrecision: number
  limitOrderPriceCapRatio: number
  limitOrderPriceFloorRatio: number
  maxMarketOrderAmount: number
  maxLimitOrderAmount: number
  maxOpenOrders: number
  minNotionalValue: number
  priceProtectionThreshold: number
  marketOrderPriceCapRatio: number
  marketOrderPriceFloorRatio: number
  conditionalRestrictions: string[]
}

// Trading Data Tab Types
export interface MarketData {
  timestamp: string
  volume: number
  activeTraders: number
  liquidity: number
  openInterest: number
  orderbookDepth: number
  takerBuyVolume: number
  takerSellVolume: number
  limitBuySize: number
  limitSellSize: number
}

export interface TraderActivity {
  timestamp: string
  topTraderBuyRatioAccounts: number
  topTraderSellRatioAccounts: number
  topTraderBuyRatioPositions: number
  topTraderSellRatioPositions: number
  top10NetPosition: number
  top100NetPosition: number
  whaleRetailRatio: number
}

export interface OtherData {
  navGap: number // percentage difference
  makerFee: number
  takerFee: number
}
```

---

## Success Criteria

- ✅ Info 탭의 모든 항목 구현
- ✅ Trading Data 탭의 모든 차트 구현
- ✅ IndexDetailsModal과 데이터 일관성 유지
- ✅ 재사용 가능한 컴포넌트 추출 완료
- ✅ Futures 제한 표시 구현
- ✅ TradingView 차트 UX 개선 완료
- ✅ 반응형 레이아웃 지원
- ✅ Phase 0 제약사항 준수

---

**Last Updated**: 2025-11-05
**Next Review**: After Phase 1 completion
