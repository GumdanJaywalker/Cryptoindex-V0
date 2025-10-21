# 백엔드 데이터 요구사항 (완전판)

> 프론트엔드 컴포넌트가 필요로 하는 **모든 데이터**와 **모든 API 스펙** 정리

**📌 중요:** 이 문서는 백엔드 개발자가 어떤 API를 만들어야 하는지 **완전히** 명시합니다.

---

## 📋 목차
1. [전체 API 엔드포인트 목록](#전체-api-엔드포인트-목록)
2. [Trading 페이지 (27개 컴포넌트)](#1-trading-페이지-27개-컴포넌트)
3. [Portfolio 페이지 (11개 컴포넌트)](#2-portfolio-페이지-11개-컴포넌트)
4. [Governance 페이지 (7개 컴포넌트)](#3-governance-페이지-7개-컴포넌트)
5. [Launch 페이지](#4-launch-페이지)
6. [Settings 페이지](#5-settings-페이지)
7. [검색 & 알림](#6-검색--알림)
8. [WebSocket 실시간 데이터](#7-websocket-실시간-데이터)
9. [프론트↔백엔드 변수명 매핑](#프론트백엔드-변수명-매핑)
10. [공통 규칙](#공통-규칙)

---

## 전체 API 엔드포인트 목록

### ✅ 이미 구현됨 (5개)
1. `GET /api/health` - Health check
2. `GET /api/user/profile` - 프로필 조회 (Privy 인증)
3. `PUT /api/user/profile` - 프로필 업데이트 (Privy 인증)
4. `POST /api/auth/sync-user` - Privy → Supabase 동기화
5. `POST /api/auth/logout` - 로그아웃

### 🔴 반드시 구현 필요 (38개)

#### Trading (10개)
- [ ] `GET /api/indices` - 인덱스 목록
- [ ] `GET /api/indices/:id` - 인덱스 상세
- [ ] `GET /api/indices/:id/ohlcv` - 차트 데이터
- [ ] `GET /api/indices/:id/orderbook` - 오더북
- [ ] `GET /api/indices/:id/trades` - 최근 거래 내역
- [ ] `GET /api/market/stats` - 마켓 통계
- [ ] `GET /api/traders` - 트레이더 랭킹
- [ ] `GET /api/traders/:id` - 트레이더 상세
- [ ] `POST /api/trades` - 거래 실행
- [ ] `POST /api/trades/quote` - 견적 조회 (선택)

#### Portfolio (9개)
- [ ] `GET /api/user/positions` - 사용자 포지션 목록
- [ ] `GET /api/user/trades` - 거래 내역
- [ ] `GET /api/user/analytics` - 수익 통계
- [ ] `GET /api/user/balances` - 지갑 잔액
- [ ] `GET /api/user/lp-positions` - LP 포지션
- [ ] `POST /api/user/positions/:id/close` - 포지션 청산
- [ ] `POST /api/user/positions/:id/stop-loss` - 손절가 설정
- [ ] `POST /api/user/positions/:id/take-profit` - 익절가 설정
- [ ] `POST /api/user/positions/:id/partial-close` - 부분 청산

#### Governance (6개)
- [ ] `GET /api/proposals` - 제안 목록
- [ ] `GET /api/proposals/:id` - 제안 상세
- [ ] `POST /api/proposals` - 새 제안 생성
- [ ] `POST /api/proposals/:id/vote` - 투표
- [ ] `POST /api/proposals/:id/vote/commit` - Commit-reveal (선택)
- [ ] `POST /api/proposals/:id/vote/reveal` - Reveal (선택)

#### Launch (3개)
- [ ] `POST /api/index-specs` - 인덱스 스펙 제출
- [ ] `GET /api/assets` - 사용 가능한 자산 목록
- [ ] `GET /api/assets/:symbol` - 자산 상세

#### Settings (8개)
- [ ] `GET /api/user/settings` - 설정 조회
- [ ] `PUT /api/user/settings` - 설정 저장
- [ ] `POST /api/user/password` - 비밀번호 변경
- [ ] `GET /api/user/2fa` - 2FA 상태 조회
- [ ] `POST /api/user/2fa/enable` - 2FA 활성화
- [ ] `POST /api/user/2fa/disable` - 2FA 비활성화
- [ ] `POST /api/user/sessions/revoke-all` - 모든 세션 무효화
- [ ] `POST /api/user/data-collection/disable` - 데이터 수집 중단

#### 기타 (2개)
- [ ] `GET /api/search/indexes` - 인덱스 검색
- [ ] `GET /api/system/exchange-rates` - 환율 정보
- [ ] `GET /api/user/notifications` - 알림 목록
- [ ] `POST /api/user/notifications/:id/read` - 알림 읽음

#### WebSocket (6개 채널)
- [ ] `/ws/prices` - 실시간 가격 (필수)
- [ ] `/ws/orderbook/:id` - 오더북 델타
- [ ] `/ws/trades/:id` - 실시간 거래
- [ ] `/ws/indices` - 인덱스 통계
- [ ] `/ws/governance` - 제안 업데이트
- [ ] `/ws/notifications` - 알림 푸시

---

## 1. Trading 페이지 (27개 컴포넌트)

### 사용 컴포넌트
`TradingLayout`, `TrendingIndices`, `IndexCard`, `IndexRow`, `ChartArea`, `OrderBook`, `OrderBookTrades`, `RecentTrades`, `TradingPanel`, `TradingPanelSimple`, `QuickTradeButton`, `TradeConfirmModal`, `IndexInfoBar`, `IndexInfoModal`, `BuySellAnalysis`, `WhaleAlert`, `TopTraders`, `TraderCard`, `TraderDetailsModal`, `AccountPanel`, `GraduationProgress`, `PresetPanel`, `CommunityFeed`, `LiquidityModal`, `TradingBottomTabs` 등

---

### API 1: `GET /api/indices` - 인덱스 목록

**Request:**
```
GET /api/indices?filter=all&sort=volume&limit=20&page=1
```

**Query Parameters:**
- `filter` (선택): `all` | `favorites` | `hot` | `new` | `gainers` | `losers` | `high-volume` | `vs-battles` | `layer-1` | `layer-2` | `layer-3`
- `sort` (선택): `volume` | `change` | `market-cap` | `name` | `created`
- `limit` (선택): 기본 20, 최대 100
- `page` (선택): 페이지 번호

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pepe_ecosystem_001",
      "symbol": "PEPE_ECOSYSTEM",
      "name": "PEPE Ecosystem Index",
      "theme": "frog",
      "description": "Top PEPE-themed meme coins index",
      "created_at": 1704067200000,
      "heat_score": 85,
      "layer_info": {
        "layer": "layer-2",
        "category": "mainstream-meme",
        "trading_mechanism": "hooats",
        "risk_level": "medium",
        "creation_access": "verified-only"
      },
      "current_price": 125.45,
      "change_24h": 12.5,
      "change_7d": 24.8,
      "volume_24h": 5420000,
      "tvl": 12500000,
      "market_cap": 18750000,
      "sparkline_data": [120, 122, 119, 125, 128, 125],
      "holders": 1524,
      "top_traders": ["trader_001", "trader_005"],
      "is_hot": true,
      "is_new": false,
      "is_mooning": true,
      "has_battle": false,
      "graduation": {
        "liquidity_progress": 75,
        "sales_progress": 60,
        "status": "recruiting-liquidity"
      },
      "assets": [
        {
          "symbol": "PEPE",
          "name": "Pepe",
          "allocation": 40,
          "price": 0.00000125,
          "change_24h": 15.2
        },
        {
          "symbol": "WOJAK",
          "name": "Wojak",
          "allocation": 30,
          "price": 0.00000089,
          "change_24h": 8.5
        }
      ],
      "last_rebalanced": 1703980800000,
      "next_rebalancing": 1706659200000,
      "governance": {
        "proposal_count": 8,
        "active_proposals": 2,
        "total_votes": 12500
      }
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `MemeIndex[]` (lib/types/index-trading.ts)

**필수 필드:**
- ✅ `id`, `symbol`, `name`, `current_price`, `change_24h`, `volume_24h`, `market_cap`
- ✅ `assets[]` - 구성 자산 배열
- ✅ `governance` - 제안 통계
- ⚪ `layer_info` - Layer 시스템 (선택)
- ⚪ `graduation` - Layer 3만 필요

**데이터 소스:**
- 가격: CoinGecko API 또는 DEX aggregator
- 시가총액: 구성 자산 시총 합계
- Volume: DEX 거래량 또는 자체 거래 집계
- Holders: 온체인 데이터 (Dune Analytics 등)

---

### API 2: `GET /api/indices/:id` - 인덱스 상세

**Request:**
```
GET /api/indices/pepe_ecosystem_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    ... MemeIndex 전체 필드 ...
    "constituents": [
      {
        "symbol": "PEPE",
        "name": "Pepe",
        "allocation": 40,
        "price": 0.00000125,
        "change_24h": 15.2
      }
    ],
    "rebalancing_history": [
      {
        "date": 1703980800000,
        "changes": [
          {
            "type": "adjust",
            "symbol": "PEPE",
            "current_pct": 35,
            "proposed_pct": 40,
            "rationale": "Market momentum"
          }
        ]
      }
    ],
    "analytics": {
      "creation_date": 1700000000000,
      "total_supply": 1000000,
      "circulating_supply": 850000,
      "avg_holding_period": 14,
      "volatility_24h": 0.25,
      "sharpe_ratio": 1.8,
      "max_drawdown": 0.15,
      "beta": 1.2
    }
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `IndexInfoModal`, `IndexDetailModal`

---

### API 3: `GET /api/indices/:id/ohlcv` - 차트 데이터 (TradingView Lightweight Charts)

**Request:**
```
GET /api/indices/pepe_ecosystem_001/ohlcv?timeframe=1h&limit=500
```

**Query Parameters:**
- `timeframe`: `1m` | `5m` | `15m` | `1h` | `4h` | `1d` | `1w`
- `from` (선택): Unix timestamp in **SECONDS** (not milliseconds)
- `to` (선택): Unix timestamp in **SECONDS** (not milliseconds)
- `limit` (선택): 기본 500, 최대 1000

**⚠️ CRITICAL - TradingView Lightweight Charts 요구사항:**
1. **Time format: Unix timestamp in SECONDS** (NOT milliseconds!)
   - ❌ Wrong: `1704153600000` (milliseconds)
   - ✅ Correct: `1704153600` (seconds)
2. **Field names: Full words** (NOT abbreviations!)
   - ❌ Wrong: `t`, `o`, `h`, `l`, `c`, `v`
   - ✅ Correct: `time`, `open`, `high`, `low`, `close`, `volume`
3. **Sort order: Ascending** (oldest first)
4. **Data consistency: NO gaps** in time series

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": 1704153600,
      "open": 124.5,
      "high": 126.8,
      "low": 123.2,
      "close": 125.4,
      "volume": 245000
    },
    {
      "time": 1704157200,
      "open": 125.4,
      "high": 127.2,
      "low": 124.8,
      "close": 126.1,
      "volume": 312000
    }
  ],
  "meta": {
    "index_id": "pepe_ecosystem_001",
    "timeframe": "1h",
    "from": 1704153600,
    "to": 1704157200,
    "count": 2
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `OHLCVData[]`, `ChartAPIResponse` (lib/types/trading-chart.ts)

**사용 컴포넌트:** `ChartArea` (TradingView Lightweight Charts 5.0.8)

**프론트 API 함수:** `fetchOHLCVData(indexId, timeframe, limit)` (lib/api/trading-chart.ts)

**Timeframe별 권장 데이터 양:**
- `1m`: 최대 500 candles (8시간 분량)
- `5m`: 최대 500 candles (41시간 분량)
- `15m`: 최대 500 candles (5일 분량)
- `1h`: 최대 500 candles (21일 분량)
- `4h`: 최대 500 candles (83일 분량)
- `1d`: 최대 500 candles (500일 분량)
- `1w`: 최대 500 candles (9.6년 분량)

**데이터 생성 방법:**
```sql
-- 예시 (PostgreSQL)
SELECT
  EXTRACT(EPOCH FROM time_bucket('1 hour', timestamp))::INTEGER as time,
  FIRST(price, timestamp) as open,
  MAX(price) as high,
  MIN(price) as low,
  LAST(price, timestamp) as close,
  SUM(volume) as volume
FROM price_ticks
WHERE index_id = 'pepe_ecosystem_001'
  AND timestamp >= NOW() - INTERVAL '21 days'
GROUP BY time_bucket('1 hour', timestamp)
ORDER BY time ASC  -- 중요: 오름차순 정렬!
LIMIT 500
```

**데이터 소스:**
- 1분/5분 캔들: 실시간 계산 (가격 스트림 집계) → Redis 캐싱
- 15분 이상: DB 저장 (배치 작업) → TimescaleDB 권장
- Volume: DEX 거래량 또는 자체 거래 집계

**캐싱 전략:**
- TTL: 30-60초 (가격 변동 주기 고려)
- Key pattern: `chart:ohlcv:{index_id}:{timeframe}:{from}:{to}`
- Redis sorted set으로 time 기반 range query 최적화

---

### API 4: `GET /api/indices/:id/orderbook` - 오더북

**Request:**
```
GET /api/indices/pepe_ecosystem_001/orderbook?depth=25
```

**Query Parameters:**
- `depth` (선택): `25` | `50` | `100` (기본 25)

**Response:**
```json
{
  "success": true,
  "data": {
    "bids": [
      { "price": 125.40, "size": 1200.5 },
      { "price": 125.35, "size": 850.0 }
    ],
    "asks": [
      { "price": 125.50, "size": 950.0 },
      { "price": 125.55, "size": 1100.0 }
    ],
    "mid_price": 125.45,
    "last_update": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `OrderBook`, `OrderBookTrades`

**데이터 소스:**
- AMM 유동성 풀 계산
- 또는 중앙화 오더북 (CLOB)

---

### API 5: `GET /api/indices/:id/trades` - 최근 거래

**Request:**
```
GET /api/indices/pepe_ecosystem_001/trades?limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trade_1704153600000_001",
      "side": "buy",
      "price": 125.45,
      "size": 500,
      "ts": 1704153600000
    }
  ],
  "meta": {
    "next_cursor": "cursor_abc123"
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `RecentTrades`, `OrderBookTrades`

---

### API 6: `GET /api/market/stats` - 마켓 통계

**Request:**
```
GET /api/market/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_market_cap": 1250000000,
    "total_tvl": 890000000,
    "total_volume_24h": 450000000,
    "active_indices": 15,
    "active_traders": 3542,
    "top_gainer": {
      "symbol": "PEPE_ECOSYSTEM",
      "change": 45.8
    },
    "top_loser": {
      "symbol": "SHIB_PACK",
      "change": -12.3
    },
    "dominance_index": "PEPE_ECOSYSTEM",
    "dominance_percentage": 18.5,
    "avg_change_24h": 2.4
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `TradingLayout`, `TradingBottomTabs`, 헤더 통계

**프론트 타입:** `MarketStats` (lib/types/index-trading.ts)

**⚠️ 주의:** 현재 mock과 타입 정의가 불일치함. 위 스펙 따르세요.

---

### API 7: `GET /api/traders` - 트레이더 랭킹

**Request:**
```
GET /api/traders?timeframe=24h&filter=all&sort=pnl&limit=30
```

**Query Parameters:**
- `timeframe`: `24h` | `7d` | `30d`
- `filter`: `all` | `top-gainers` | `high-winrate` | `new-traders` | `most-followed`
- `sort`: `pnl` | `winrate` | `followers` | `trades` | `rank`
- `limit`, `page`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trader_001",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "ens": "degen.eth",
      "rank": 1,
      "pnl_24h": 45820.5,
      "pnl_7d": 128450.2,
      "pnl_30d": 345600.8,
      "total_pnl": 892300.5,
      "pnl_percentage_24h": 12.5,
      "pnl_percentage_7d": 35.8,
      "pnl_percentage_30d": 89.2,
      "total_pnl_percentage": 245.6,
      "win_rate": 68.5,
      "total_trades": 245,
      "followers_count": 1542,
      "trading_indices": ["PEPE_ECOSYSTEM", "DOGE_FAMILY"],
      "is_new_trader": false,
      "avatar": "https://...",
      "badges": ["🥇", "🔥"],
      "social_links": {
        "twitter": "@trader001",
        "discord": "trader001#1234"
      },
      "copy_trade_data": {
        "minimum_amount": 100,
        "max_followers": 5000,
        "current_followers": 1542,
        "fee": 5.0
      }
    }
  ],
  "meta": {
    "total": 3542,
    "page": 1,
    "limit": 30
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `TopTrader[]` (lib/types/index-trading.ts)

**사용 컴포넌트:** `TopTraders`, `TraderCard`

**데이터 생성 방법:**
```sql
-- PnL 집계 예시
SELECT 
  user_id as trader_id,
  SUM(pnl) as total_pnl,
  COUNT(*) as total_trades,
  SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as win_rate,
  RANK() OVER (ORDER BY SUM(pnl) DESC) as rank
FROM trades
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id
ORDER BY total_pnl DESC
LIMIT 30
```

---

### API 8: `GET /api/traders/:id` - 트레이더 상세

**Response:**
```json
{
  "success": true,
  "data": {
    ... TopTrader 전체 필드 ...
    "join_date": 1700000000000,
    "total_trades": 245,
    "winning_trades": 168,
    "avg_hold_time_hours": 18,
    "largest_win": 12500.5,
    "largest_loss": -4200.8,
    "consecutive_wins": 8,
    "consecutive_losses": 3,
    "favorite_indices": ["PEPE_ECOSYSTEM", "DOGE_FAMILY"],
    "trading_style": "Swing Trading",
    "risk_level": "Aggressive"
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `TraderDetailsModal`

---

### API 9: `POST /api/trades` - 거래 실행

**Request:**
```json
{
  "index_id": "pepe_ecosystem_001",
  "type": "buy",
  "amount": 1000,
  "leverage": 5,
  "slippage": 0.5,
  "deadline": 1704154800000
}
```

**Headers:**
```
Authorization: Bearer {privy_jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trade_id": "trade_1704153600000_001",
    "transaction_hash": "0xabcdef...",
    "executed_price": 125.48,
    "gas_used": "145000"
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `TradingPanel`, `TradingPanelSimple`, `QuickTradeButton`, `TradeConfirmModal`

**프론트 훅:** `useTradeExecution()` in `hooks/use-wallet.ts`

**현재 상태:** `simulateTradeExecution()` mock 함수 (90% 성공률 시뮬레이션)

---

## 2. Portfolio 페이지 (11개 컴포넌트)

### 사용 컴포넌트
`PortfolioLayout`, `PositionsSection`, `AccountSummary`, `EarningsSummary`, `TradingAnalytics`, `LiquidityPositions`, `CreatorEarnings`, `VotingPowerManager`, `PnLCardGenerator`, `TraderPortfolioPublic` 등

---

### API 10: `GET /api/user/positions` - 포지션 목록

**Request:**
```
GET /api/user/positions?status=open&limit=50
```

**Headers:**
```
Authorization: Bearer {privy_jwt_token}
```

**Query Parameters:**
- `status`: `open` | `closed` | `all`
- `index_id` (선택)
- `limit`, `cursor`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trade_001",
      "index_id": "pepe_ecosystem_001",
      "trader_id": "user_123",
      "type": "long",
      "entry_price": 120.5,
      "exit_price": null,
      "current_price": 125.45,
      "amount": 5000,
      "leverage": 5,
      "pnl": 206.04,
      "pnl_percentage": 4.12,
      "status": "open",
      "timestamp": 1704067200000,
      "close_timestamp": null,
      "order_type": "market",
      "fees": 25.0,
      "funding_fees": 12.5,
      "transaction_hash": "0xabc...",
      "stop_loss": 115.0,
      "take_profit": 135.0
    }
  ],
  "meta": {
    "next_cursor": "cursor_xyz"
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `Trade[]` (lib/types/index-trading.ts)

**사용 컴포넌트:** `PositionsSection`, `positions.tsx`

**데이터 생성:**
- trades 테이블 조회
- current_price는 실시간 가격 조인
- pnl 계산: `(current_price - entry_price) * amount * leverage / entry_price` (long일 경우)

---

### API 11: `GET /api/user/trades` - 거래 내역

**Request:**
```
GET /api/user/trades?from=1704067200000&to=1704153600000&limit=100
```

**Response:** (API 10과 동일하지만 closed 포함)

**사용 컴포넌트:** `TradingAnalytics`, `TradingBottomTabs`

---

### API 12: `GET /api/user/analytics` - 수익 통계

**Request:**
```
GET /api/user/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_pnl": 125800.5,
    "realized_pnl": 95000.2,
    "unrealized_pnl": 30800.3,
    "total_fees": 5420.8,
    "win_rate": 68.5,
    "total_volume": 2500000,
    "pnl_by_index": [
      {
        "index_id": "pepe_ecosystem_001",
        "pnl": 45600.2
      }
    ],
    "daily_equity_curve": [
      {
        "t": 1704067200000,
        "equity": 100000
      },
      {
        "t": 1704153600000,
        "equity": 125800.5
      }
    ]
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `EarningsSummary`, `TradingAnalytics`, `AccountSummary`

---

### API 13: `POST /api/user/positions/:id/close` - 포지션 청산

**Request:**
```json
{
  "exit_price": 125.45
}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "trade_id": "trade_001",
    "status": "closed",
    "exit_price": 125.45,
    "close_timestamp": 1704153600000,
    "realized_pnl": 206.04
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `positions.tsx` (PositionManagement 훅)

---

### API 14-16: Stop Loss / Take Profit / Partial Close

**동일 패턴:**
- `POST /api/user/positions/:id/stop-loss`
- `POST /api/user/positions/:id/take-profit`
- `POST /api/user/positions/:id/partial-close`

**사용 컴포넌트:** `positions.tsx`

---

### API 17: `GET /api/user/lp-positions` - LP 포지션

**Request:**
```
GET /api/user/lp-positions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lp_001",
      "index_id": "pepe_ecosystem_001",
      "liquidity_token": "LP-PEPE-USDC",
      "amount": 5000,
      "share_pct": 2.5,
      "accrued_fees": 125.8,
      "apr": 45.6,
      "deposited_at": 1704067200000
    }
  ],
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `LiquidityPositions`, `LiquidityModal`

---

### API 18: `GET /api/user/balances` - 지갑 잔액

**Request:**
```
GET /api/user/balances
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "balance": "25000000000",
      "balance_formatted": "25,000.00",
      "decimals": 6,
      "address": "0xa0b86a33...",
      "usd_value": 25000,
      "logo_url": "/tokens/usdc.png"
    }
  ],
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `AccountPanel`, `TradingPanel` (잔액 표시)

**프론트 훅:** `useWalletBalances()` in `hooks/use-wallet.ts`

**현재 상태:** `generateMockBalance()` mock 함수

**데이터 소스:**
- RPC 호출 (eth_call, balanceOf)
- Alchemy, Infura 등 Node provider 사용

---

## 3. Governance 페이지 (7개 컴포넌트)

### 사용 컴포넌트
`GovernanceLayout`, `GovernanceDashboard`, `ProposalsSection`, `ProposalCard`, `VoteDialog`, `RebalancingVoteCard`, `RebalancingVotesSection`

---

### API 19: `GET /api/proposals` - 제안 목록

**Request:**
```
GET /api/proposals?phase=active&index_symbol=PEPE_ECOSYSTEM
```

**Query Parameters:**
- `phase`: `active` | `queued` | `executed` | `defeated` | 전체 phase 목록
- `index_symbol` (선택)
- `limit`, `page`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pr_001",
      "type": "rebalancing",
      "title": "DOG_INDEX Quarterly Rebalancing",
      "index_symbol": "DOG_INDEX",
      "description": "Adjust WIF to 20% and remove SHIB due to liquidity risk.",
      "created_at": 1704067200000,
      "ends_at": 1704240000000,
      "phase": "active",
      "config": {
        "snapshot": {
          "method": "time-weighted",
          "window_start": 1703462400000,
          "window_end": 1704067200000
        },
        "quorum_percent": 20,
        "pass_threshold_percent": 60,
        "timelock_seconds": 172800,
        "multisig": {
          "m": 4,
          "n": 4
        }
      },
      "tally": {
        "for_power": 12500000,
        "against_power": 2400000,
        "abstain_power": 100000,
        "total_snapshot_power": 80000000
      },
      "timelock": {},
      "multisig": {
        "required": 4,
        "total": 4,
        "signed": []
      },
      "user": {
        "eligible": true,
        "voting_power_at_snapshot": 2000,
        "has_committed": false,
        "has_revealed": false
      },
      "changes": [
        {
          "type": "adjust",
          "symbol": "WIF",
          "current_pct": 8,
          "proposed_pct": 20,
          "rationale": "Exceptional growth"
        },
        {
          "type": "remove",
          "symbol": "SHIB",
          "current_pct": 25,
          "proposed_pct": 0,
          "rationale": "Liquidity and performance"
        }
      ]
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 20
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `Proposal[]` (lib/types/governance.ts)

**사용 컴포넌트:** `ProposalsSection`, `ProposalCard`

**프론트 훅:** `useGovernance()` → `getProposals()`

**현재 상태:** 하드코딩된 mock 데이터 6개 (lib/api/governance.ts)

---

### API 20: `GET /api/proposals/:id` - 제안 상세

**Response:** API 19와 동일 (단일 Proposal 객체)

---

### API 21: `POST /api/proposals/:id/vote` - 투표

**Request:**
```json
{
  "choice": "for",
  "power": 2000
}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "proposal_id": "pr_001",
    "updated_tally": {
      "for_power": 12502000,
      "against_power": 2400000,
      "abstain_power": 100000,
      "total_snapshot_power": 80000000
    }
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `VoteDialog`

**프론트 함수:** `submitVote(proposalId, choice, power)` (lib/api/governance.ts)

**현재 상태:** mock 함수 (500ms delay 후 `{ ok: true }` 반환)

---

### API 22: `POST /api/proposals` - 새 제안 생성

**권한:** 운영자 또는 토큰 홀더 (최소 투표권 필요)

**Request:**
```json
{
  "type": "rebalancing",
  "title": "...",
  "index_symbol": "PEPE_ECOSYSTEM",
  "description": "...",
  "ends_at": 1704240000000,
  "config": { ... },
  "changes": [ ... ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pr_025"
  },
  "timestamp": 1704153600000
}
```

---

## 4. Launch 페이지

### 📋 최근 업데이트 (2025-10-19)
**HLH_hack 프로젝트에서 Launch 페이지 통합 완료**
- 새 컴포넌트: `ConfirmLaunchModal`, `LaunchSuccessModal`, `Dropdown`
- 페이지 완전 재작성: `app/launch/page.tsx`
- 현재 상태: **Mock 데이터로 완전 동작** ✅
- 백엔드: HLH_hack/backend 파일들을 복사하여 통합 예정

### 🔧 HLH_hack Backend 통합 가이드

**HLH_hack 백엔드 구조**:
```
HLH_hack/backend/src/
├── routes/
│   ├── assets.ts          # GET /api/launch/assets
│   ├── baskets.ts         # POST /api/launch/basket-calculate
│   ├── positions.ts       # Launch position management
│   └── ...
├── middlewares/           # Auth, error handling
├── utils/                 # Helper functions
├── cache/                 # Caching service
└── types/                 # Type definitions
```

**통합 방법**:
1. HLH_hack/backend/src/routes/ 파일들을 Cryptoindex-Backend/src/routes/launch/로 복사
2. middlewares, utils, cache, types 폴더도 함께 복사
3. server.ts에 라우트 등록: `app.use('/api/launch/*', launchRoutes)`
4. 프론트엔드 Mock 데이터를 실제 API 호출로 변경

자세한 통합 가이드는 `HANDOVER.md` 및 `BACKEND_INTEGRATION_CHECKLIST.md` 참조

---

### 사용 컴포넌트
`app/launch/page.tsx`, `ConfirmLaunchModal`, `LaunchSuccessModal`, `Dropdown`

**이전 컴포넌트** (더 이상 사용 안 함):
~~`IndexBuilderWizard`, `AssetPicker`, `WeightTable`, `IndexCreatorOverview`~~

---

### API 23: `GET /api/launch/assets` - 자산 목록 (HLH_hack)

**HLH_hack 원본 엔드포인트**: `GET /v1/assets`
**Cryptoindex 통합 후**: `GET /api/launch/assets`

**Request:**
```
GET /api/launch/assets?q=BTC
```

**Response:**
```json
[
  {
    "symbol": "BTC",
    "name": "Bitcoin",
    "marketType": "perp"
  },
  {
    "symbol": "ETH",
    "name": "Ethereum",
    "marketType": "perp"
  }
]
```

**사용 위치**: `app/launch/page.tsx` (lines 70-76, Mock 데이터)

**현재 Mock 데이터**:
```typescript
const [assets, setAssets] = useState<Asset[]>([
  { symbol: "BTC", name: "Bitcoin", marketType: "perp" },
  { symbol: "ETH", name: "Ethereum", marketType: "perp" },
  { symbol: "SOL", name: "Solana", marketType: "perp" },
  { symbol: "DOGE", name: "Dogecoin", marketType: "perp" },
  { symbol: "PEPE", name: "Pepe", marketType: "perp" },
]);
```

**백엔드 통합 후 코드**:
```typescript
useEffect(() => {
  fetch('/api/launch/assets')
    .then(res => res.json())
    .then(data => setAssets(data))
    .catch(err => console.error('Failed to load assets:', err));
}, []);
```

**HLH_hack Backend 구현**: `HLH_hack/backend/src/routes/assets.ts`

---

### API 24: `POST /api/launch/basket-calculate` - 포트폴리오 차트 계산 (HLH_hack)

**HLH_hack 원본 엔드포인트**: `POST /v1/basket-calculate`
**Cryptoindex 통합 후**: `POST /api/launch/basket-calculate`

**Request:**
```json
{
  "interval": "1d",
  "assets": [
    {
      "symbol": "BTC",
      "weight": 0.5,
      "position": "long",
      "leverage": 1
    },
    {
      "symbol": "ETH",
      "weight": 0.5,
      "position": "long",
      "leverage": 1
    }
  ]
}
```

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-01",
      "value": 100.0,
      "nav": 100.0
    },
    {
      "date": "2024-01-02",
      "value": 102.5,
      "nav": 102.5
    }
  ]
}
```

**사용 위치**: `app/launch/page.tsx` (lines 230-242, Mock 데이터 생성)

**현재 Mock 데이터**:
```typescript
useEffect(() => {
  if (selected.length === 0) {
    setPreviewData(null);
    return;
  }
  const data = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}`,
    value: 100 + Math.random() * 20 - 10,
  }));
  setPreviewData(data);
}, [selected, period]);
```

**HLH_hack Backend 구현**: `HLH_hack/backend/src/routes/baskets.ts`

---

### API 25 (NEW): `POST /api/launch/create-index` - 인덱스 생성 (선택적)

**Request:**
```json
{
  "name": "My Custom Index",
  "ticker": "MYIDX",
  "description": "Description text",
  "socialLink": "https://twitter.com/myindex",
  "assets": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "side": "long",
      "leverage": 1,
      "allocationPct": 50.0
    }
  ],
  "totalAmount": 1000.0,
  "feeAmount": 0.1
}
```

**Response:**
```json
{
  "success": true,
  "indexId": "idx_1234567890",
  "status": "pending"
}
```

**사용 위치**: `app/launch/page.tsx` (ConfirmLaunchModal onConfirm)

**현재 상태**: localStorage에 Mock 저장만 수행

**HLH_hack Backend**: 구현 여부 확인 필요 (positions.ts에 있을 가능성)

---

### API 26 (구 API 23): `POST /api/index-specs` - 인덱스 스펙 제출

**Request:**
```json
{
  "basics": {
    "name": "My Custom Index",
    "symbol": "CUSTOM_001",
    "category": "Meme",
    "description": "..."
  },
  "chain": {
    "chain": "L3",
    "settlement_token": "USDC",
    "fee_token": "USDC"
  },
  "constituents": [
    { "symbol": "PEPE", "weight": 40 },
    { "symbol": "WOJAK", "weight": 30 },
    { "symbol": "DOGE", "weight": 30 }
  ],
  "rules": {
    "max_per_asset": 35,
    "min_liquidity": 1000000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "idx_1704153600000"
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `IndexBuilderWizard`

**프론트 함수:** `submitIndexSpec(spec)` (lib/api/governance.ts)

**현재 상태:** 85% 성공률 시뮬레이션 mock

---

### API 24: `GET /api/assets` - 자산 목록

**Request:**
```
GET /api/assets?q=pepe&limit=100
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "PEPE",
      "name": "Pepe",
      "price": 0.00000125,
      "market_cap": 500000000,
      "liquidity": 25000000,
      "blacklist": false
    }
  ],
  "meta": {
    "total": 1245
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `AssetPicker`

**현재 상태:** `assetsCatalog` from `lib/mock/assets.ts` (하드코딩)

---

### API 25: `GET /api/assets/:symbol` - 자산 상세

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "PEPE",
    "name": "Pepe",
    "price": 0.00000125,
    "market_cap": 500000000,
    "liquidity": 25000000,
    "history": [
      { "t": 1704067200000, "o": 0.0000012, "h": 0.00000128, "l": 0.0000011, "c": 0.00000125, "v": 1500000 }
    ]
  },
  "timestamp": 1704153600000
}
```

---

## 5. Settings 페이지

### 사용 컴포넌트
`ProfileSection`, `PreferencesSection`, `NotificationsSection`, `SecuritySection`, `ApiKeysSection`, `DangerZone`, `ConnectionsSection`

---

### API 26: `GET /api/user/settings` - 설정 조회

**Request:**
```
GET /api/user/settings
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "Degen Trader",
      "ens": "degen.eth",
      "email": "trader@example.com"
    },
    "preferences": {
      "theme": "dark",
      "lang": "en",
      "currency": "USD",
      "timefmt": "24h"
    },
    "notifications": {
      "price": true,
      "governance": true,
      "trades": true,
      "email": false
    }
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `Preferences`, `Profile`, `Notifications` (lib/api/settings.ts)

---

### API 27: `PUT /api/user/settings` - 설정 저장

**Request:**
```json
{
  "profile": { "name": "...", "ens": "...", "email": "..." },
  "preferences": { ... },
  "notifications": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ok": true
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `ProfileSection`, `PreferencesSection`, `NotificationsSection`

**프론트 함수:**
- `saveProfile(profile)`
- `savePreferences(prefs)`
- `saveNotifications(notifs)`

**현재 상태:** 모두 mock (simulateLatency 후 `{ ok: true }`)

---

### API 28: `POST /api/user/password` - 비밀번호 변경

**Request:**
```json
{
  "new_password": "..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ok": true
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `SecuritySection`

**프론트 함수:** `updatePassword(newPassword)`

**현재 상태:** mock

---

### API 29: `GET /api/user/2fa` - 2FA 상태 조회

**Request:**
```
GET /api/user/2fa
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "created_at": 1704067200000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `SecuritySection`

---

### API 30: `POST /api/user/2fa/enable` - 2FA 활성화

**Request:**
```json
{
  "secret_key": "JBSWY3DPEHPK3PXP",
  "verification_code": "123456"
}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "backup_codes": [
      "ABCD-EFGH-IJKL",
      "MNOP-QRST-UVWX",
      "YZAB-CDEF-GHIJ",
      "KLMN-OPQR-STUV",
      "WXYZ-1234-5678",
      "9012-3456-7890"
    ]
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `SecuritySection`

**프론트 함수:** `handleEnable2FA()` in SecuritySection

**현재 상태:** mock (프론트 상태만 업데이트)

**데이터 생성:**
- TOTP 라이브러리 사용 (예: speakeasy, otplib)
- Secret key 생성 및 저장 (암호화 권장)
- 백업 코드 생성 (랜덤 12자리 x 6개)

---

### API 31: `POST /api/user/2fa/disable` - 2FA 비활성화

**Request:**
```json
{
  "verification_code": "123456"
}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": false
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `SecuritySection`

**프론트 함수:** `handleDisable2FA()` in SecuritySection

**현재 상태:** mock (프론트 상태만 업데이트)

---

### API 37: `POST /api/user/sessions/revoke-all` - 모든 세션 무효화

**Request:**
```json
{}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "revoked_count": 5
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `DangerZone`

**프론트 함수:** Sign out all 버튼 클릭 핸들러

**현재 상태:** mock (토스트만 표시)

**데이터 생성:**
- sessions 테이블에서 현재 사용자의 모든 세션 삭제 또는 만료 처리
- Redis 세션 캐시가 있다면 함께 삭제

---

### API 38: `POST /api/user/data-collection/disable` - 데이터 수집 중단

**Request:**
```json
{}
```

**Headers:** Authorization 필요

**Response:**
```json
{
  "success": true,
  "data": {
    "data_collection_enabled": false,
    "disabled_at": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `DangerZone`

**프론트 함수:** Disable 버튼 클릭 핸들러

**현재 상태:** mock (토스트만 표시)

**설명:**
- Privy 인증 기반이므로 "계정 삭제"가 아닌 "데이터 수집 중단"
- 사용자 활동 추적, 분석 데이터 수집을 중단
- users 테이블의 `data_collection_enabled` 플래그 false로 설정
- 실제 계정은 유지되지만 행동 데이터는 더 이상 저장하지 않음

---

## 6. 검색 & 알림

### API 32: `GET /api/search/indexes` - 인덱스 검색

**Request:**
```
GET /api/search/indexes?q=pepe
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pepe_ecosystem_001",
      "name": "PEPE Ecosystem Index",
      "symbol": "PEPE_ECOSYSTEM",
      "description": "...",
      "market_cap": 18750000,
      "price": 125.45
    }
  ],
  "timestamp": 1704153600000
}
```

**프론트 타입:** `IndexSearchResult[]` (lib/api/search.ts)

**사용 컴포넌트:** `Header` (검색 바)

**프론트 함수:** `searchIndexes(query)`

**현재 상태:** mock (300ms delay)

---

### API 33: `GET /api/user/notifications` - 알림 목록

**Request:**
```
GET /api/user/notifications?category=trade&unread=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "title": "Trade executed",
      "body": "Your buy order for PEPE_ECOSYSTEM has been filled.",
      "category": "trade",
      "read": false,
      "created_at": 1704153600000,
      "meta": {
        "tx_hash": "0xabc...",
        "index_id": "pepe_ecosystem_001",
        "amount": "1000"
      }
    }
  ],
  "timestamp": 1704153600000
}
```

**프론트 타입:** `NotificationItem[]` (lib/types/notifications.ts)

**사용 컴포넌트:** `NotificationList`, `NotificationsButton`

**⚠️ 변수명 이슈:** `category: 'price_alert'`를 `'priceAlert'`로 변경 필요

---

### API 34: `POST /api/user/notifications/:id/read` - 알림 읽음

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notif_001",
    "read": true
  },
  "timestamp": 1704153600000
}
```

---

### API 35: `GET /api/system/exchange-rates` - 환율

**Request:**
```
GET /api/system/exchange-rates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "HYPE_USD": 1.0,
    "HYPE_USDC": 1.0,
    "HYPE_USDT": 1.0,
    "HYPE_BTC": 0.000025
  },
  "timestamp": 1704153600000
}
```

**프론트 타입:** `ExchangeRates` (lib/types/currency.ts)

**사용:** 전역 (가격 표시 변환)

---

### API 36: `GET /api/market/trends` - 마켓 트렌드 (선택)

**Request:**
```
GET /api/market/trends?period=24h
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "24h",
    "timestamp": 1704153600000,
    "sentiment": {
      "bullish": 65,
      "bearish": 20,
      "neutral": 15
    },
    "top_gainers": [ ... MemeIndex subset ... ],
    "top_losers": [ ... ],
    "volume_leaders": [ ... ],
    "market_phase": "Markup",
    "risk_level": 5.5,
    "correlation_btc": 0.72,
    "correlation_eth": 0.68
  },
  "timestamp": 1704153600000
}
```

**프론트 훅:** `useMarketTrends(period)` (hooks/use-market-data.ts)

---

## 7. WebSocket 실시간 데이터

### 공통 메시지 형식
```json
{
  "channel": "/ws/prices",
  "event": "index_price",
  "data": { ... },
  "timestamp": 1704153600000
}
```

---

### WS 1: `/ws/prices` - 실시간 가격 (필수!)

**연결:**
```javascript
const ws = new WebSocket('wss://api.example.com/ws/prices')

// 구독 메시지 전송
ws.send(JSON.stringify({
  action: 'subscribe',
  channel: 'price_updates',
  index_ids: ['pepe_ecosystem_001', 'doge_family_002']
}))
```

**수신 메시지 (일반 가격 업데이트):**
```json
{
  "channel": "/ws/prices",
  "event": "price_update",
  "data": {
    "index_id": "pepe_ecosystem_001",
    "price": 125.48,
    "change_24h": 12.6,
    "volume_24h": 5425000,
    "timestamp": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**⚠️ TradingView Chart 실시간 업데이트 메시지:**
```json
{
  "channel": "/ws/prices",
  "event": "candle_update",
  "data": {
    "index_id": "pepe_ecosystem_001",
    "time": 1704153600,
    "price": 125.48,
    "volume": 1250
  },
  "timestamp": 1704153600000
}
```

**TradingView Chart 업데이트 요구사항:**
1. **Time in SECONDS**: `time` 필드는 Unix timestamp in seconds
2. **Update frequency**: 1-3초 간격으로 현재 진행 중인 캔들 업데이트
3. **Price**: 최신 거래 가격
4. **Volume**: 현재 캔들의 누적 거래량
5. **Message format**: 프론트에서 `seriesRef.current.update({ time, value: price })` 형태로 사용

**프론트 구현:**
```typescript
// lib/api/trading-chart.ts
export function subscribeToRealTimePrice(
  indexId: string,
  callback: (price: number, volume: number, time: number) => void
): () => void {
  const ws = new WebSocket('wss://api.example.com/ws/prices')

  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: 'subscribe',
      channel: 'price_updates',
      indexId
    }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.event === 'candle_update') {
      const { time, price, volume } = data.data
      callback(price, volume || 0, time)
    }
  }

  return () => ws.close()
}
```

**업데이트 주기:**
- 일반 가격: 1-3초
- 차트 캔들: 1-3초 (현재 캔들만 업데이트)

**사용 컴포넌트:**
- 모든 Trading 컴포넌트 (가격 표시)
- `ChartArea` (TradingView Lightweight Charts - 실시간 캔들 업데이트)

**프론트 훅:**
- `useRealtimePrices(indexIds)` (hooks/use-market-data.ts - 현재 polling)
- `subscribeToRealTimePrice(indexId, callback)` (lib/api/trading-chart.ts - Chart 전용)

**현재 상태:**
- `MockRealtimeConnection` 클래스 (hooks/use-realtime.ts)
- Mock interval (3초) - components/trading/ChartArea.tsx lines 243-270

**백엔드 구현 가이드:**
1. Redis Pub/Sub으로 가격 브로드캐스트
2. 거래 체결 시마다 현재 캔들 업데이트 계산
3. 1초마다 구독자에게 `candle_update` 메시지 전송
4. 새 캔들 시작 시 별도 `new_candle` 이벤트 전송 (선택)

---

### WS 2: `/ws/orderbook/:id` - 오더북 델타

**메시지:**
```json
{
  "channel": "/ws/orderbook/pepe_ecosystem_001",
  "event": "orderbook_delta",
  "data": {
    "bids": [ { "price": 125.40, "size": 1200.5 } ],
    "asks": [ { "price": 125.50, "size": 950.0 } ],
    "timestamp": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `OrderBook`

---

### WS 3: `/ws/trades/:id` - 실시간 거래

**메시지:**
```json
{
  "channel": "/ws/trades/pepe_ecosystem_001",
  "event": "trade",
  "data": {
    "side": "buy",
    "price": 125.45,
    "size": 500,
    "timestamp": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `RecentTrades`

---

### WS 4: `/ws/governance` - 제안 업데이트

**메시지:**
```json
{
  "channel": "/ws/governance",
  "event": "proposal_update",
  "data": {
    "proposal_id": "pr_001",
    "tally": { ... },
    "phase": "active"
  },
  "timestamp": 1704153600000
}
```

---

### WS 5: `/ws/notifications` - 알림 푸시

**메시지:**
```json
{
  "channel": "/ws/notifications",
  "event": "notification",
  "data": {
    "id": "notif_002",
    "title": "Price alert triggered",
    "category": "priceAlert",
    ... NotificationItem 필드 ...
  },
  "timestamp": 1704153600000
}
```

---

### WS 6: Whale Alert

**메시지:**
```json
{
  "channel": "/ws/prices",
  "event": "whale_alert",
  "data": {
    "index_id": "pepe_ecosystem_001",
    "type": "large_buy",
    "amount": 75000,
    "price": 125.45,
    "impact": 5.2,
    "timestamp": 1704153600000
  },
  "timestamp": 1704153600000
}
```

**사용 컴포넌트:** `WhaleAlert`

---

## 프론트↔백엔드 변수명 매핑

### 🔄 자동 변환 필요 필드 (전체 목록)

| 프론트 (camelCase) | 백엔드 DB/API (snake_case) | 타입 | 컴포넌트 사용 |
|---|---|---|---|
| `id` | `id` | string | 모든 곳 |
| `indexId` | `index_id` | string | Trade, Position |
| `traderId` | `trader_id` | string | Trade |
| `userId` | `user_id` | string | 내부 |
| `privyUserId` | `privy_user_id` | string | User |
| `authType` | `auth_type` | 'email'\|'wallet' | User |
| `currentPrice` | `current_price` | number | Index |
| `change24h` | `change_24h` | number | Index, Asset |
| `change7d` | `change_7d` | number | Index |
| `volume24h` | `volume_24h` | number | Index |
| `marketCap` | `market_cap` | number | Index, Asset |
| `createdAt` | `created_at` | number (epoch ms) | 모든 엔티티 |
| `updatedAt` | `updated_at` | number (epoch ms) | 선택 |
| `endsAt` | `ends_at` | number (epoch ms) | Proposal |
| `heatScore` | `heat_score` | number | Index |
| `layerInfo` | `layer_info` | object | Index |
| `sparklineData` | `sparkline_data` | number[] | Index |
| `topTraders` | `top_traders` | string[] | Index |
| `isHot` | `is_hot` | boolean | Index |
| `isNew` | `is_new` | boolean | Index |
| `isMooning` | `is_mooning` | boolean | Index |
| `hasBattle` | `has_battle` | boolean | Index |
| `lastRebalanced` | `last_rebalanced` | number (epoch ms) | Index |
| `nextRebalancing` | `next_rebalancing` | number (epoch ms) | Index |
| `proposalCount` | `proposal_count` | number | Governance |
| `activeProposals` | `active_proposals` | number | Governance |
| `totalVotes` | `total_votes` | number | Governance |
| `pnl24h` | `pnl_24h` | number | Trader |
| `pnl7d` | `pnl_7d` | number | Trader |
| `pnl30d` | `pnl_30d` | number | Trader |
| `totalPnl` | `total_pnl` | number | Trader |
| `pnlPercentage24h` | `pnl_percentage_24h` | number | Trader |
| `pnlPercentage7d` | `pnl_percentage_7d` | number | Trader |
| `pnlPercentage30d` | `pnl_percentage_30d` | number | Trader |
| `totalPnlPercentage` | `total_pnl_percentage` | number | Trader |
| `winRate` | `win_rate` | number | Trader |
| `totalTrades` | `total_trades` | number | Trader |
| `followersCount` | `followers_count` | number | Trader |
| `tradingIndices` | `trading_indices` | string[] | Trader |
| `isNewTrader` | `is_new_trader` | boolean | Trader |
| `socialLinks` | `social_links` | object | Trader |
| `copyTradeData` | `copy_trade_data` | object | Trader |
| `entryPrice` | `entry_price` | number | Trade |
| `exitPrice` | `exit_price` | number | Trade |
| `pnlPercentage` | `pnl_percentage` | number | Trade |
| `closeTimestamp` | `close_timestamp` | number (epoch ms) | Trade |
| `orderType` | `order_type` | string | Trade |
| `fundingFees` | `funding_fees` | number | Trade |
| `transactionHash` | `transaction_hash` | string | Trade |
| `stopLoss` | `stop_loss` | number | Trade |
| `takeProfit` | `take_profit` | number | Trade |
| `walletAddress` | `wallet_address` | string | User, Wallet |
| `walletType` | `wallet_type` | string | User, Wallet |
| `walletProvider` | `wallet_provider` | string | User Wallet |
| `emailVerified` | `email_verified` | boolean | User |
| `isActive` | `is_active` | boolean | User |
| `lastLogin` | `last_login` | number (epoch ms) | User |
| `isPrimary` | `is_primary` | boolean | User Wallet |
| `encryptedPrivateKey` | `encrypted_private_key` | string | User Wallet |
| `sessionToken` | `session_token` | string | Session |
| `privyAccessToken` | `privy_access_token` | string | Session |
| `expiresAt` | `expires_at` | number (epoch ms) | Session, Code |
| `lastAccessed` | `last_accessed` | number (epoch ms) | Session |
| `secretKey` | `secret_key` | string | 2FA |
| `backupCodes` | `backup_codes` | string[] | 2FA |
| `indexSymbol` | `index_symbol` | string | Proposal |
| `quorumPercent` | `quorum_percent` | number | VotingConfig |
| `passThresholdPercent` | `pass_threshold_percent` | number | VotingConfig |
| `timelockSeconds` | `timelock_seconds` | number | VotingConfig |
| `snapshotBlock` | `snapshot_block` | number | Snapshot |
| `windowStart` | `window_start` | number (epoch ms) | Snapshot |
| `windowEnd` | `window_end` | number (epoch ms) | Snapshot |
| `forPower` | `for_power` | number | Tally |
| `againstPower` | `against_power` | number | Tally |
| `abstainPower` | `abstain_power` | number | Tally |
| `totalSnapshotPower` | `total_snapshot_power` | number | Tally |
| `queuedAt` | `queued_at` | number (epoch ms) | Timelock |
| `votingPowerAtSnapshot` | `voting_power_at_snapshot` | number | UserState |
| `hasCommitted` | `has_committed` | boolean | UserState |
| `hasRevealed` | `has_revealed` | boolean | UserState |
| `currentPct` | `current_pct` | number | ChangeSet |
| `proposedPct` | `proposed_pct` | number | ChangeSet |
| `liquidityProgress` | `liquidity_progress` | number | Graduation |
| `salesProgress` | `sales_progress` | number | Graduation |
| `balanceFormatted` | `balance_formatted` | string | TokenBalance |
| `usdValue` | `usd_value` | number | TokenBalance |
| `logoUrl` | `logo_url` | string | Asset, Token |
| `gasUsed` | `gas_used` | string | TradeResult |

### 🔄 Privy JWT → DB 매핑

| Privy JWT 필드 | DB 필드 | 프론트 타입 | 비고 |
|---|---|---|---|
| `sub` | `privy_user_id` | `privyUserId` | 사용자 ID |
| `email.address` | `email` | `email` | 이메일 |
| `email.verified` | `email_verified` | `emailVerified` | 인증 여부 |
| `wallet.address` | `wallet_address` | `walletAddress` | 지갑 주소 |
| `wallet.chain_type` | - | `chainType` | EVM, Solana 등 |
| `wallet.chain_id` | - | `chainId` | 네트워크 ID (number) |
| `wallet.wallet_client_type` | `wallet_provider` | `walletProvider` | MetaMask, WalletConnect 등 |
| `wallet.connector_type` | - | `walletType` | embedded, external |

**⚠️ 중요:** `wallet_client_type` (Privy) → `wallet_provider` (DB) 변환 필요

---

## 공통 규칙

### 1. API 응답 형식 (통일!)

**성공:**
```typescript
{
  success: true,
  data: T,
  meta?: { total?, page?, limit?, next_cursor? },
  timestamp: number  // epoch ms
}
```

**실패:**
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'RATE_LIMITED' | 'UPSTREAM_FAILED' | 'CONFLICT',
    message: string,
    details?: any
  },
  timestamp: number
}
```

---

### 2. 인증

**필요한 엔드포인트:**
- `/api/user/*` - 모든 사용자 데이터
- `POST /api/trades` - 거래 실행
- `POST /api/proposals/:id/vote` - 투표
- `POST /api/index-specs` - 인덱스 제출

**Headers:**
```
Authorization: Bearer {privy_jwt_token}
```

**검증:**
1. Privy JWT 검증 (lib/auth/privy-jwt.ts 로직 사용)
2. `sub` (Privy User ID)로 DB에서 사용자 조회
3. 사용자 없으면 자동 생성 또는 401 반환

---

### 3. 페이지네이션

**Query Parameters:**
- `limit`: 기본 20, 최대 100
- `page`: 페이지 번호 (1부터)
- 또는 `cursor`: 커서 기반 (시계열 데이터 권장)

**Response Meta:**
```json
{
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "next_cursor": "cursor_abc123"
  }
}
```

---

### 4. 타임스탬프

**규칙:**
- **모든 타임스탬프는 epoch ms (number)**
- ❌ `new Date().toISOString()` (string) 사용 금지
- ✅ `Date.now()` 또는 `Math.floor(Date.now())`

**예시:**
```json
{
  "created_at": 1704153600000,
  "timestamp": 1704153600000
}
```

---

### 5. 필드 네이밍

**백엔드 API 응답:**
- **Option A (권장):** snake_case로 응답, 프론트에서 camelCase 변환
- **Option B:** 백엔드에서 응답 전 camelCase 변환 (미들웨어)

**현재 프론트 구현:**
- Supabase 데이터는 수동 변환 중 (app/api/user/profile/route.ts 라인 60-70)
- 자동 변환 유틸 없음 → 생성 필요

**권장 방법:**
```typescript
// lib/utils/case-converter.ts
export function toCamelCase<T>(obj: T): CamelCased<T> {
  // 모든 snake_case 필드를 camelCase로 변환
}
```

---

### 6. 캐싱 TTL 권장

| API | TTL | 이유 |
|---|---|---|
| `/api/indices` | 5-10초 | 가격 변동 빠름 |
| `/api/market/stats` | 30-60초 | 통계 집계 비용 |
| `/api/traders` | 30-60초 | 랭킹 계산 비용 |
| `/api/indices/:id/ohlcv` | 30-60초 | 차트 데이터 |
| `/api/indices/:id/orderbook` | 1-2초 | 실시간성 중요 |
| `/api/proposals` | 10-30초 | 거버넌스 |
| `/api/user/positions` | 실시간 (no cache) | 포지션 PnL |

**추천 스택:** Redis

---

### 7. Rate Limiting

**현재 상태:**
- `lib/middleware/privy-auth.ts`에 메모리 기반 rate limiting 있음
- **문제:** 서버 재시작 시 초기화, 멀티 인스턴스 환경 미지원

**권장:**
- Redis 기반 rate limiting (예: `express-rate-limit` + `rate-limit-redis`)
- 사용자별: 1000 req/hour
- IP별: 1000 req/15min

---

## 🚨 중요 이슈 & 수정 필요 사항

### 1. MarketStats 타입 불일치
**문제:**
- Mock (hooks/use-market-data.ts): `totalMarketCap`, `topPerformerChange`, `avgChange24h`
- 타입 정의 (lib/types/index-trading.ts): `totalVolume24h`, `totalTVL`, `topGainer`, `topLoser`

**해결:** 위 API 스펙의 MarketStats 따르세요 (통일됨)

---

### 2. constituents vs assets vs memeCoins
**문제:**
- MemeIndex 타입: `assets[]` 필드
- useIndexDetails mock: `memeCoins[]` 사용 (존재하지 않는 필드)

**해결:**
- **백엔드는 `assets[]` 제공**
- `constituents`와 `assets`는 같은 데이터 (둘 다 제공해도 됨)

---

### 3. Boolean 필드 prefix 누락
**수정 필요:**
| 현재 | 변경 후 |
|---|---|
| `read` | `is_read` |
| `eligible` | `is_eligible` |
| `shielded` | `is_shielded` |
| `used` | `is_used` |
| `enabled` | `is_enabled` |

---

### 4. NotificationCategory `price_alert`
**현재:** `'price_alert'` (snake_case)  
**변경:** `'priceAlert'` (camelCase) 또는 `'price-alert'` (kebab-case)

---

### 5. 모든 Date 객체 → epoch ms
**문제:** 일부 mock에서 `new Date()` 사용  
**해결:** 모든 타임스탬프를 `number` (epoch ms)로 통일

---

## 📊 작업량 추정

### High Priority (1-2주)
- Trading 읽기 API (indices, details, ohlcv, orderbook, trades, stats) + WebSocket: **2일**
- Traders (list, details): **3시간** (trades 테이블 집계)
- Portfolio (positions, trades, analytics, actions): **2일**
- Governance (list, details, vote): **3시간** (snapshot 로직 제외)

### Medium Priority (3-5일)
- Launch (index-specs, assets): **3시간**
- Settings + Notifications: **1시간**
- Search + Exchange rates: **1시간**
- WebSocket 구현: **1일**

### Low Priority (나중에)
- Governance Snapshot 시스템: **1-2주**
- Commit-Reveal 투표: **1주**
- On-chain 데이터 인덱싱: **2-4주**

---

## 🎯 백엔드 팀 액션 아이템 체크리스트

### Phase 1: Mock 제거 (1주차)
- [ ] `GET /api/indices` 구현
- [ ] `GET /api/indices/:id` 구현
- [ ] `GET /api/traders` 구현
- [ ] `GET /api/market/stats` 구현
- [ ] `GET /api/search/indexes` 구현
- [ ] lib/api/settings.ts 대체 (`GET /api/user/settings`, `PUT /api/user/settings`)
- [ ] lib/api/governance.ts 대체 (`GET /api/proposals`, `POST /api/proposals/:id/vote`)

### Phase 2: 거래 & 포지션 (1-2주차)
- [ ] `POST /api/trades` 구현
- [ ] `GET /api/user/positions` 구현
- [ ] `GET /api/user/trades` 구현
- [ ] `GET /api/user/analytics` 구현
- [ ] 포지션 관리 API (close, stop-loss, take-profit, partial-close)

### Phase 3: 실시간 데이터 (2-3주차)
- [ ] WebSocket `/ws/prices` 구현
- [ ] WebSocket `/ws/orderbook/:id` 구현
- [ ] WebSocket `/ws/trades/:id` 구현
- [ ] `GET /api/indices/:id/ohlcv` 구현
- [ ] `GET /api/indices/:id/orderbook` 구현

### Phase 4: 기타 기능 (3-4주차)
- [ ] `GET /api/user/balances` (RPC 호출)
- [ ] `GET /api/user/lp-positions`
- [ ] `GET /api/assets`, `GET /api/assets/:symbol`
- [ ] `POST /api/index-specs`
- [ ] Push 알림 (`POST /api/push/subscribe`)

---

**작성일:** 2025-01-11  
**최종 업데이트:** 전체 컴포넌트 완전 분석 (Oracle + Grep 전역 검색)  
**작성자:** 프론트엔드 팀
