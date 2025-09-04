# 🚀 Cryptoindex 프론트엔드 개발 프롬프트 (Claude Code용)

## 📋 프로젝트 개요
**프로젝트명**: Cryptoindex - 밈코인 인덱스 기반 파생상품 거래 플랫폼
**목표**: Hyperliquid UI + 바이낸스 선물거래 정보량 + 인덱스 특화 기능
**기술스택**: Next.js, React, TypeScript, Tailwind CSS

## 🎯 개발 요구사항

### ✅ 개발할 것
- **완전한 UI/UX 구현**: 실제 서비스 페이지 구조
- **모든 버튼과 인터페이스**: 클릭 가능한 완성된 UI
- **반응형 디자인**: 데스크톱 우선, 모바일 고려
- **Hyperliquid 스타일 디자인**: 민트색 → 파스텔톤 남색으로 변경
- **바이낸스 수준 정보량**: Trading 페이지는 선물거래 수준 정보 포함

### ❌ 개발하지 않을 것
- **기능 구현**: API 연동, 백엔드, 실제 거래 로직
- **테스트 페이지**: 실제 서비스 구조로만 개발
- **더미 기능**: 버튼은 만들되 실제 동작은 제외

## 🎨 디자인 가이드라인

### 색상 테마
- **기본 색상**: 파스텔톤 남색 계열 (Hyperliquid 민트색 대신)
- **배경**: 다크 모드 기본
- **UI 스타일**: Hyperliquid 거의 복사 수준
- **정보 밀도**: 바이낸스 선물거래 페이지 수준

### 레이아웃 원칙
- **Hyperliquid 레이아웃 복사**: 전체적인 구조 동일
- **정보 우선**: 차트, 호가창, 포지션 등 핵심 정보 중심
- **모던한 느낌**: 깔끔하고 전문적인 인터페이스

## 🏗️ 개발 우선순위

### 🔥 1순위: Trading Page (최우선)
**목표**: 바이낸스 선물거래 수준의 완전한 거래 인터페이스

#### 핵심 구성요소:
1. **상단 인덱스 정보 바** (Full Width)
   - 인덱스 선택 드롭다운 (DOG_INDEX, CAT_INDEX, MEME_INDEX 등)
   - 실시간 가격 정보 (현재가, 24h 변동률, 고가/저가, 거래량)
   - 펀딩비 정보 & 카운트다운
   - 미결제약정, 인덱스 프리미엄/디스카운트
   - 인덱스 상세 정보 모달 버튼

2. **좌측 영역** (60% 너비)
   - **차트 영역** (70% 높이): TradingView 스타일 고급 차트
   - **하단 탭 영역** (30% 높이): 
     - Positions, Open Orders, Order History, Trade History
     - **Index Composition** (인덱스 구성) - 특화 기능
     - Funding History, Market Data, Analytics

3. **우측 영역** (40% 너비)
   - **Order Book** (25%): 바이낸스 수준 고급 호가창
   - **Trading Panel** (35%): 주문 타입, Long/Short, 레버리지, TP/SL 설정
   - **Recent Trades** (20%): 실시간 체결 내역
   - **Community Feed** (20%): Top Holders, Whale Alert, PnL 리더보드

#### 특별 요구사항:
- **인덱스 특화 UI**: 구성 자산 분석, 투표 현황 연동 준비
- **바이낸스 수준 정보**: 펀딩비, ADL 순위, 청산가, 마진 정보 등
- **커뮤니티 요소**: 소셜 트레이딩 느낌의 피드 영역

### 🔥 2순위: Governance Page
**목표**: 두 가지 투표 시스템의 완전한 UI 구현

#### 핵심 기능:
1. **Battle Votes (몰빵 투표)**
   - TrumpVsElon 스타일 카드 UI
   - 실시간 투표 현황 진행바
   - 자산 배정 계획 시각화
   - 투표 인터페이스 (토큰 수 슬라이더)

2. **Rebalancing Votes (리밸런싱 투표)**
   - 인덱스별 구성 변경 투표
   - 탈락 후보 vs 신규 후보
   - 커뮤니티 제안 시스템

### 🔥 3순위: Portfolio Page
**목표**: 종합 자산 관리 + PnL 카드 생성기

#### 핵심 기능:
1. **자산 관리 대시보드**
2. **투표권 관리 시스템**
3. **PnL 카드 생성기** - 소셜 공유용 수익 인증 카드

### 🟡 4순위: Vaults
**목표**: 기본 UI 구조 완성 (필요 시 확장)

## 📂 프로젝트 구조

```
/Cryptoindex-V0
├── app/
│   ├── trading/page.tsx           # 1순위: 메인 거래 페이지
│   ├── governance/page.tsx        # 2순위: 거버넌스 투표
│   ├── portfolio/page.tsx         # 3순위: 포트폴리오
│   ├── vaults/page.tsx           # 4순위: 카피 트레이딩
│   └── layout.tsx                # 공통 레이아웃
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # 메인 네비게이션
│   │   └── Sidebar.tsx           # 사이드바 (필요시)
│   ├── trading/
│   │   ├── ChartArea.tsx         # 차트 영역
│   │   ├── OrderBook.tsx         # 호가창
│   │   ├── TradingPanel.tsx      # 주문 패널
│   │   ├── PositionsTable.tsx    # 포지션 테이블
│   │   └── IndexInfo.tsx         # 인덱스 정보
│   ├── governance/
│   │   ├── BattleVote.tsx        # Battle 투표 카드
│   │   └── RebalancingVote.tsx   # 리밸런싱 투표
│   ├── portfolio/
│   │   ├── AssetSummary.tsx      # 자산 요약
│   │   └── PnLCardGenerator.tsx  # PnL 카드 생성기
│   └── ui/
│       ├── Button.tsx            # 재사용 버튼
│       ├── Card.tsx              # 카드 컴포넌트
│       ├── Table.tsx             # 테이블
│       └── Modal.tsx             # 모달
├── styles/
│   └── globals.css               # Tailwind + 커스텀 스타일
└── types/
    └── index.ts                  # TypeScript 타입 정의
```

## 🎯 상세 개발 가이드

### Trading Page 상세 요구사항

#### 1. 상단 인덱스 바
```tsx
// 필요한 정보들
interface IndexInfo {
  symbol: string;           // "DOG_INDEX"
  price: number;           // 현재가
  change24h: number;       // 24시간 변동률
  high24h: number;         // 24시간 고가
  low24h: number;          // 24시간 저가
  volume24h: number;       // 24시간 거래량
  fundingRate: number;     // 펀딩비
  openInterest: number;    // 미결제약정
  indexPremium: number;    // 인덱스 프리미엄
}
```

#### 2. 차트 영역
- TradingView 스타일 UI (실제 연동은 나중에)
- 시간대 선택 버튼 (1m, 5m, 15m, 1h, 4h, 1d 등)
- 차트 타입 선택 (캔들스틱, 라인 등)
- 인디케이터 버튼들 (실제 기능은 없어도 UI는 완성)

#### 3. 호가창 (Order Book)
```tsx
interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
}
```

#### 4. 거래 패널
- Long/Short 탭
- 주문 타입 (Market, Limit, Stop 등)
- 레버리지 슬라이더 (1x-50x)
- 가격/수량 입력
- TP/SL 설정
- 주문 실행 버튼

### 색상 팔레트 (파스텔톤 남색 계열)

```css
:root {
  /* 기본 남색 계열 */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* 다크 모드 배경 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;

  /* 텍스트 */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;

  /* 상승/하락 색상 */
  --green: #10b981;
  --red: #ef4444;
}
```

## 🚀 개발 시작 가이드

### 첫 번째 단계: 프로젝트 설정
1. Next.js 프로젝트 생성
2. Tailwind CSS 설정
3. TypeScript 설정
4. 기본 폴더 구조 생성

### 두 번째 단계: Trading Page 개발
1. 레이아웃 구조 먼저 완성
2. 상단 인덱스 정보 바 구현
3. 3분할 레이아웃 (차트 + 호가창 + 거래패널)
4. 하단 탭 영역 구현
5. 반응형 처리

### 세 번째 단계: 나머지 페이지들
1. Governance → Portfolio → Vaults 순서
2. 각 페이지별 핵심 UI 컴포넌트 우선 개발
3. 상세 기능은 단계적 확장

## 📱 반응형 가이드라인

### 데스크톱 (1024px+)
- 3분할 레이아웃 유지
- 모든 정보 표시
- Hyperliquid 스타일 그대로

### 태블릿 (768px-1023px)
- 2분할로 조정 (차트 + 사이드바)
- 일부 정보 축약 표시
- 탭 형태로 정보 정리

### 모바일 (767px 이하)
- 단일 컬럼 레이아웃
- 하단 탭 네비게이션
- 스와이프 제스처 고려
- 핵심 정보만 표시

## 🎨 특별 디자인 요구사항

### Hyperliquid 스타일 카피
- **레이아웃**: 거의 동일하게 복사
- **컴포넌트**: 버튼, 테이블, 차트 영역 배치
- **정보 밀도**: 전문가용 고밀도 정보
- **애니메이션**: 부드러운 트랜지션

### 바이낸스 정보량 참고
- **포지션 테이블**: 모든 필수 정보 포함
- **리스크 지표**: 청산가, ADL, 마진 정보
- **시장 데이터**: 펀딩비, 거래량, OI 등
- **고급 주문**: 다양한 주문 타입 지원

### 인덱스 특화 UI
- **구성 분석**: 인덱스 내 자산 비중 시각화
- **투표 연동**: 거버넌스 투표 상태 표시
- **커뮤니티**: 소셜 트레이딩 요소 통합
- **PnL 카드**: 수익 인증 공유 기능

## 🔧 기술적 구현 가이드

### 상태 관리
```tsx
// React Context 또는 Zustand 사용 권장
interface TradingState {
  selectedIndex: string;
  positions: Position[];
  orders: Order[];
  marketData: MarketData;
}
```

### 컴포넌트 재사용성
```tsx
// 공통 UI 컴포넌트
interface TableProps {
  columns: Column[];
  data: any[];
  sortable?: boolean;
  filterable?: boolean;
}

// 거래 관련 컴포넌트
interface TradingPanelProps {
  symbol: string;
  onOrderSubmit: (order: Order) => void;
}
```

### 데이터 모킹
```tsx
// 개발용 Mock 데이터
const mockIndexes = [
  {
    symbol: 'DOG_INDEX',
    name: 'Doggy Index',
    price: 1.234,
    change24h: 5.67,
    // ... 기타 필드
  },
  // ...
];
```

## 📋 체크리스트

### Trading Page 완성 기준
- [ ] 상단 인덱스 정보 바 완성
- [ ] 좌측 차트 영역 UI 완성
- [ ] 우측 호가창 + 거래패널 완성
- [ ] 하단 탭 영역 (포지션, 주문 등) 완성
- [ ] 인덱스 구성 분석 탭 완성
- [ ] 커뮤니티 피드 영역 완성
- [ ] 반응형 처리 완료
- [ ] 다크모드 + 파스텔 남색 테마 적용

### 전체 프로젝트 완성 기준
- [ ] 6개 메인 페이지 모두 완성
- [ ] 페이지간 네비게이션 동작
- [ ] 일관된 디자인 시스템 적용
- [ ] 모든 인터랙티브 요소 구현
- [ ] 반응형 디자인 완료
- [ ] 코드 품질 및 구조 정리

## 🎯 최종 목표

**"실제 서비스처럼 보이는 완전한 UI/UX"**

- 사용자가 보기에 실제 작동하는 것처럼 보여야 함
- 모든 버튼과 인터페이스가 완성되어 있어야 함
- 전문적이고 신뢰할 수 있는 거래 플랫폼 느낌
- Hyperliquid + 바이낸스 수준의 정보 밀도
- 인덱스 특화 기능들이 자연스럽게 통합된 UI

## 🚀 Claude Code 실행 명령어

```bash
# 프로젝트 생성 및 개발 시작
cd /Users/kimhyeon/Desktop/생각줄기/Cryptoindex-V0

# 우선순위에 따라 개발:
# 1. Trading Page (최우선)
# 2. Governance Page
# 3. Portfolio Page (PnL 카드 생성기 포함)
# 4. Vaults (기본 UI)

# 각 페이지는 완전한 UI/UX로 구현
# 테스트 페이지가 아닌 실제 서비스 구조로 개발
```

---

**중요**: 이 프롬프트를 Claude Code에 붙여넣고 "/Users/kimhyeon/Desktop/생각줄기/Cryptoindex-V0" 경로에서 개발을 시작하세요. Trading Page부터 우선순위에 따라 완전한 UI를 구현해주시기 바랍니다.
