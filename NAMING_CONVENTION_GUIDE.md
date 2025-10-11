# 변수명 통일 가이드 (완전판)

> 프론트엔드-백엔드 간 **모든 변수명** 매핑 및 네이밍 규칙

**📌 중요:** 이 문서는 DB ↔ API ↔ 프론트엔드 간 변수명 통일의 **Single Source of Truth**입니다.

---

## 📋 목차
1. [네이밍 규칙](#네이밍-규칙)
2. [완전 변수명 매핑 테이블](#완전-변수명-매핑-테이블)
3. [도메인별 필드 목록](#도메인별-필드-목록)
4. [케이스 스타일 사용 규칙](#케이스-스타일-사용-규칙)
5. [불일치 패턴 및 수정 사항](#불일치-패턴-및-수정-사항)
6. [백엔드 팀 통일 계획](#백엔드-팀-통일-계획)

---

## 네이밍 규칙

### 🔑 핵심 규칙 (반드시 준수)

```
1. DB 스키마: snake_case
2. API JSON (wire): snake_case
3. 프론트엔드 타입/변수: camelCase
4. Boolean 필드: is*/has*/can* prefix
5. 타임스탬프: number (epoch ms), *At suffix
6. 상수: SCREAMING_SNAKE_CASE
7. String Literal: lowercase 또는 kebab-case (도메인 용어)
```

---

### 📐 자동 변환 전략

**권장 방식:**
```typescript
// 백엔드: snake_case 응답
{
  "current_price": 125.45,
  "change_24h": 12.5,
  "is_active": true
}

// 프론트: 자동 변환 (lib/utils/case-converter.ts)
const data = toCamelCase(response.data)
// {
//   currentPrice: 125.45,
//   change24h: 12.5,
//   isActive: true
// }
```

**변환 함수:**
```typescript
// lib/utils/case-converter.ts
export function toCamelCase<T>(obj: T): CamelCased<T> {
  // snake_case → camelCase 재귀 변환
}

export function toSnakeCase<T>(obj: T): SnakeCased<T> {
  // camelCase → snake_case 재귀 변환
}
```

---

## 완전 변수명 매핑 테이블

### 🗄️ User 도메인 (users 테이블)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 백엔드 DB | 타입 | 필수 |
|---|---|---|---|---|
| `id` | `id` | `id` | string | ✅ |
| `authType` | `auth_type` | `auth_type` | 'email'\|'wallet' | ✅ |
| `email` | `email` | `email` | string\|null | ⚪ |
| `emailVerified` | `email_verified` | `email_verified` | boolean | ✅ |
| `walletAddress` | `wallet_address` | `wallet_address` | string\|null | ⚪ |
| `walletType` | `wallet_type` | `wallet_type` | string\|null | ⚪ |
| `privyUserId` | `privy_user_id` | `privy_user_id` | string | ✅ |
| `createdAt` | `created_at` | `created_at` | number (epoch ms) | ✅ |
| `lastLogin` | `last_login` | `last_login` | number (epoch ms) | ⚪ |
| `isActive` | `is_active` | `is_active` | boolean | ✅ |

---

### 👛 User Wallets 도메인 (user_wallets 테이블)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 백엔드 DB | 타입 | 필수 |
|---|---|---|---|---|
| `id` | `id` | `id` | string | ✅ |
| `userId` | `user_id` | `user_id` | string | ✅ |
| `walletAddress` | `wallet_address` | `wallet_address` | string | ✅ |
| `encryptedPrivateKey` | `encrypted_private_key` | `encrypted_private_key` | string\|null | ⚪ |
| `walletProvider` | `wallet_provider` | `wallet_provider` | string | ✅ |
| `isPrimary` | `is_primary` | `is_primary` | boolean | ✅ |
| `createdAt` | `created_at` | `created_at` | number (epoch ms) | ✅ |

**⚠️ 주의:** Privy의 `wallet_client_type` → DB `wallet_provider`로 저장

---

### 🔐 Sessions & Auth (user_sessions, email_verification_codes, user_2fa)

**user_sessions:**
| 프론트 | 백엔드 API | 백엔드 DB | 타입 |
|---|---|---|---|
| `id` | `id` | `id` | string |
| `userId` | `user_id` | `user_id` | string |
| `sessionToken` | `session_token` | `session_token` | string |
| `privyAccessToken` | `privy_access_token` | `privy_access_token` | string\|null |
| `expiresAt` | `expires_at` | `expires_at` | number (epoch ms) |
| `createdAt` | `created_at` | `created_at` | number (epoch ms) |
| `lastAccessed` | `last_accessed` | `last_accessed` | number (epoch ms) |

**email_verification_codes:**
| 프론트 | 백엔드 API | 백엔드 DB | 타입 |
|---|---|---|---|
| `id` | `id` | `id` | string |
| `email` | `email` | `email` | string |
| `code` | `code` | `code` | string |
| `expiresAt` | `expires_at` | `expires_at` | number (epoch ms) |
| `isUsed` | `is_used` | `used` | boolean |
| `createdAt` | `created_at` | `created_at` | number (epoch ms) |

**⚠️ 수정:** DB `used` → `is_used`로 변경 권장

**user_2fa:**
| 프론트 | 백엔드 API | 백엔드 DB | 타입 |
|---|---|---|---|
| `userId` | `user_id` | `user_id` | string |
| `secretKey` | `secret_key` | `secret_key` | string |
| `backupCodes` | `backup_codes` | `backup_codes` | string[] |
| `isEnabled` | `is_enabled` | `enabled` | boolean |
| `createdAt` | `created_at` | `created_at` | number (epoch ms) |

**⚠️ 수정:** DB `enabled` → `is_enabled`로 변경 권장

---

### 📊 Index 도메인 (MemeIndex)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 | 비고 |
|---|---|---|---|---|
| `id` | `id` | string | ✅ | |
| `symbol` | `symbol` | string | ✅ | 예: "PEPE_ECOSYSTEM" |
| `name` | `name` | string | ✅ | |
| `theme` | `theme` | 'dog'\|'ai'\|... | ✅ | 10가지 테마 |
| `description` | `description` | string | ✅ | |
| `createdAt` | `created_at` | number (epoch ms) | ⚪ | NEW 배지용 |
| `heatScore` | `heat_score` | number (0-100) | ⚪ | HOT 배지용 |
| `layerInfo` | `layer_info` | object | ⚪ | Layer 시스템 |
| `layerInfo.layer` | `layer_info.layer` | 'layer-1'\|'layer-2'\|'layer-3' | ⚪ | |
| `layerInfo.category` | `layer_info.category` | string | ⚪ | |
| `layerInfo.tradingMechanism` | `layer_info.trading_mechanism` | string | ⚪ | |
| `layerInfo.riskLevel` | `layer_info.risk_level` | 'low'\|'medium'\|'high' | ⚪ | |
| `layerInfo.creationAccess` | `layer_info.creation_access` | string | ⚪ | |
| `currentPrice` | `current_price` | number | ✅ | 실시간 가격 |
| `change24h` | `change_24h` | number | ✅ | 24시간 변동률 (%) |
| `change7d` | `change_7d` | number | ✅ | 7일 변동률 (%) |
| `volume24h` | `volume_24h` | number | ✅ | 24시간 거래량 |
| `tvl` | `tvl` | number | ✅ | Total Value Locked |
| `marketCap` | `market_cap` | number | ✅ | 시가총액 |
| `sparklineData` | `sparkline_data` | number[] | ⚪ | 차트 미니 데이터 |
| `holders` | `holders` | number | ✅ | 보유자 수 |
| `topTraders` | `top_traders` | string[] | ⚪ | Trader ID 배열 |
| `isHot` | `is_hot` | boolean | ⚪ | 🔥 뱃지 |
| `isNew` | `is_new` | boolean | ⚪ | ✨ 뱃지 |
| `isMooning` | `is_mooning` | boolean | ⚪ | 🚀 뱃지 |
| `hasBattle` | `has_battle` | boolean | ⚪ | ⚔️ 뱃지 |
| `graduation` | `graduation` | object | ⚪ | Layer 3 전용 |
| `graduation.liquidityProgress` | `graduation.liquidity_progress` | number (0-100) | ⚪ | |
| `graduation.salesProgress` | `graduation.sales_progress` | number (0-100) | ⚪ | |
| `graduation.status` | `graduation.status` | string | ⚪ | |
| `assets` | `assets` | array | ✅ | 구성 자산 |
| `assets[].symbol` | `assets[].symbol` | string | ✅ | |
| `assets[].name` | `assets[].name` | string | ✅ | |
| `assets[].allocation` | `assets[].allocation` | number | ✅ | % |
| `assets[].price` | `assets[].price` | number | ✅ | |
| `assets[].change24h` | `assets[].change_24h` | number | ✅ | |
| `lastRebalanced` | `last_rebalanced` | number (epoch ms) | ✅ | |
| `nextRebalancing` | `next_rebalancing` | number (epoch ms) | ⚪ | |
| `governance` | `governance` | object | ✅ | |
| `governance.proposalCount` | `governance.proposal_count` | number | ✅ | |
| `governance.activeProposals` | `governance.active_proposals` | number | ✅ | |
| `governance.totalVotes` | `governance.total_votes` | number | ✅ | |

---

### 📈 Trader 도메인 (TopTrader)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 | 비고 |
|---|---|---|---|---|
| `id` | `id` | string | ✅ | |
| `address` | `address` | string | ✅ | 지갑 주소 |
| `ens` | `ens` | string | ⚪ | ENS 이름 |
| `rank` | `rank` | number | ✅ | |
| `pnl24h` | `pnl_24h` | number | ✅ | |
| `pnl7d` | `pnl_7d` | number | ✅ | |
| `pnl30d` | `pnl_30d` | number | ✅ | |
| `totalPnl` | `total_pnl` | number | ✅ | |
| `pnlPercentage24h` | `pnl_percentage_24h` | number | ✅ | |
| `pnlPercentage7d` | `pnl_percentage_7d` | number | ✅ | |
| `pnlPercentage30d` | `pnl_percentage_30d` | number | ✅ | |
| `totalPnlPercentage` | `total_pnl_percentage` | number | ✅ | |
| `winRate` | `win_rate` | number | ✅ | 승률 (%) |
| `totalTrades` | `total_trades` | number | ✅ | |
| `followersCount` | `followers_count` | number | ✅ | |
| `tradingIndices` | `trading_indices` | string[] | ✅ | Index ID 배열 |
| `isNewTrader` | `is_new_trader` | boolean | ⚪ | |
| `avatar` | `avatar` | string | ⚪ | URL |
| `badges` | `badges` | string[] | ⚪ | 이모지 배열 |
| `socialLinks` | `social_links` | object | ⚪ | |
| `socialLinks.twitter` | `social_links.twitter` | string | ⚪ | |
| `socialLinks.discord` | `social_links.discord` | string | ⚪ | |
| `copyTradeData` | `copy_trade_data` | object | ⚪ | |
| `copyTradeData.minimumAmount` | `copy_trade_data.minimum_amount` | number | ⚪ | |
| `copyTradeData.maxFollowers` | `copy_trade_data.max_followers` | number | ⚪ | |
| `copyTradeData.currentFollowers` | `copy_trade_data.current_followers` | number | ⚪ | |
| `copyTradeData.fee` | `copy_trade_data.fee` | number | ⚪ | % |

**트레이더 상세 추가 필드:**
| `joinDate` | `join_date` | number (epoch ms) | ⚪ | |
| `winningTrades` | `winning_trades` | number | ⚪ | |
| `avgHoldTimeHours` | `avg_hold_time_hours` | number | ⚪ | |
| `largestWin` | `largest_win` | number | ⚪ | |
| `largestLoss` | `largest_loss` | number | ⚪ | |
| `consecutiveWins` | `consecutive_wins` | number | ⚪ | |
| `consecutiveLosses` | `consecutive_losses` | number | ⚪ | |
| `favoriteIndices` | `favorite_indices` | string[] | ⚪ | |
| `tradingStyle` | `trading_style` | string | ⚪ | |
| `riskLevel` | `risk_level` | string | ⚪ | |

---

### 💹 Trade 도메인 (Trade)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 | 비고 |
|---|---|---|---|---|
| `id` | `id` | string | ✅ | |
| `indexId` | `index_id` | string | ✅ | |
| `traderId` | `trader_id` | string | ⚪ | user_id와 동일 |
| `type` | `type` | 'long'\|'short' | ✅ | |
| `entryPrice` | `entry_price` | number | ✅ | |
| `exitPrice` | `exit_price` | number | ⚪ | 청산 시 |
| `currentPrice` | `current_price` | number | ✅ | 실시간 |
| `amount` | `amount` | number | ✅ | USD value |
| `leverage` | `leverage` | number | ✅ | |
| `pnl` | `pnl` | number | ✅ | 손익 |
| `pnlPercentage` | `pnl_percentage` | number | ✅ | 손익률 (%) |
| `status` | `status` | 'open'\|'closed'\|'liquidated' | ✅ | |
| `timestamp` | `timestamp` | number (epoch ms) | ✅ | 진입 시간 |
| `closeTimestamp` | `close_timestamp` | number (epoch ms) | ⚪ | 청산 시간 |
| `orderType` | `order_type` | 'market'\|'limit'\|'stop-loss'\|'take-profit' | ⚪ | |
| `fees` | `fees` | number | ✅ | |
| `fundingFees` | `funding_fees` | number | ⚪ | |
| `transactionHash` | `transaction_hash` | string | ⚪ | |
| `stopLoss` | `stop_loss` | number | ⚪ | |
| `takeProfit` | `take_profit` | number | ⚪ | |

---

### 📊 Market Stats 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 |
|---|---|---|---|
| `totalMarketCap` | `total_market_cap` | number | ✅ |
| `totalTvl` | `total_tvl` | number | ✅ |
| `totalVolume24h` | `total_volume_24h` | number | ✅ |
| `activeIndices` | `active_indices` | number | ✅ |
| `activeTraders` | `active_traders` | number | ✅ |
| `topGainer.symbol` | `top_gainer.symbol` | string | ✅ |
| `topGainer.change` | `top_gainer.change` | number | ✅ |
| `topLoser.symbol` | `top_loser.symbol` | string | ✅ |
| `topLoser.change` | `top_loser.change` | number | ✅ |
| `dominanceIndex` | `dominance_index` | string | ⚪ |
| `dominancePercentage` | `dominance_percentage` | number | ⚪ |
| `avgChange24h` | `avg_change_24h` | number | ⚪ |

---

### ⚖️ Governance 도메인 (Proposal)

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 |
|---|---|---|---|
| `id` | `id` | string | ✅ |
| `type` | `type` | 'rebalancing'\|'battle'\|'parameter' | ✅ |
| `title` | `title` | string | ✅ |
| `indexSymbol` | `index_symbol` | string | ⚪ |
| `description` | `description` | string | ⚪ |
| `createdAt` | `created_at` | number (epoch ms) | ✅ |
| `endsAt` | `ends_at` | number (epoch ms) | ⚪ |
| `phase` | `phase` | ProposalPhase | ✅ |

**ProposalPhase 값:**
`'pending' | 'active' | 'commit' | 'reveal' | 'succeeded' | 'defeated' | 'queued' | 'timelocked' | 'awaiting-multisig' | 'executed' | 'canceled'`

**config (VotingConfig):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `config.snapshot.method` | `config.snapshot.method` | 'single'\|'time-weighted'\|... |
| `config.snapshot.snapshotBlock` | `config.snapshot.snapshot_block` | number |
| `config.snapshot.windowStart` | `config.snapshot.window_start` | number (epoch ms) |
| `config.snapshot.windowEnd` | `config.snapshot.window_end` | number (epoch ms) |
| `config.quorumPercent` | `config.quorum_percent` | number |
| `config.passThresholdPercent` | `config.pass_threshold_percent` | number |
| `config.timelockSeconds` | `config.timelock_seconds` | number |
| `config.multisig.m` | `config.multisig.m` | number |
| `config.multisig.n` | `config.multisig.n` | number |
| `config.isShielded` | `config.shielded` | boolean |

**⚠️ 수정:** 프론트 `shielded` → `isShielded`로 변경

**tally (Tally):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `tally.forPower` | `tally.for_power` | number |
| `tally.againstPower` | `tally.against_power` | number |
| `tally.abstainPower` | `tally.abstain_power` | number |
| `tally.totalSnapshotPower` | `tally.total_snapshot_power` | number |

**timelock (TimelockInfo):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `timelock.queuedAt` | `timelock.queued_at` | number (epoch ms) |
| `timelock.eta` | `timelock.eta` | number (epoch ms) |

**multisig (MultisigState):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `multisig.required` | `multisig.required` | number |
| `multisig.total` | `multisig.total` | number |
| `multisig.signed` | `multisig.signed` | string[] |

**user (UserState):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `user.isEligible` | `user.is_eligible` | boolean |
| `user.votingPowerAtSnapshot` | `user.voting_power_at_snapshot` | number |
| `user.hasCommitted` | `user.has_committed` | boolean |
| `user.hasRevealed` | `user.has_revealed` | boolean |

**⚠️ 수정:** 프론트 `eligible` → `isEligible`로 변경

**changes (ChangeSet[]):**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `changes[].type` | `changes[].type` | 'add'\|'remove'\|'adjust' |
| `changes[].symbol` | `changes[].symbol` | string |
| `changes[].currentPct` | `changes[].current_pct` | number |
| `changes[].proposedPct` | `changes[].proposed_pct` | number |
| `changes[].rationale` | `changes[].rationale` | string |

---

### 🔔 Notification 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 |
|---|---|---|---|
| `id` | `id` | string | ✅ |
| `title` | `title` | string | ✅ |
| `body` | `body` | string | ⚪ |
| `category` | `category` | NotificationCategory | ✅ |
| `isRead` | `is_read` | boolean | ✅ |
| `createdAt` | `created_at` | number (epoch ms) | ✅ |
| `meta` | `meta` | object | ⚪ |
| `meta.txHash` | `meta.tx_hash` | string | ⚪ |
| `meta.indexId` | `meta.index_id` | string | ⚪ |
| `meta.symbol` | `meta.symbol` | string | ⚪ |
| `meta.amount` | `meta.amount` | string | ⚪ |
| `meta.url` | `meta.url` | string | ⚪ |

**NotificationCategory:**
- 프론트: `'system' | 'trade' | 'governance' | 'referral' | 'priceAlert'`
- 백엔드 API: `'system' | 'trade' | 'governance' | 'referral' | 'price_alert'`

**⚠️ 수정:**
1. 프론트 `read` → `isRead`
2. 프론트 `'price_alert'` → `'priceAlert'` (타입 정의 수정)

---

### 💰 Currency & Exchange 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 | 필수 |
|---|---|---|---|
| `currency` | `currency` | Currency | ✅ |
| `exchangeRates` | `exchange_rates` | object | ✅ |
| `exchangeRates.HYPE_USD` | `exchange_rates.HYPE_USD` | number | ✅ |
| `exchangeRates.HYPE_USDC` | `exchange_rates.HYPE_USDC` | number | ✅ |
| `exchangeRates.HYPE_USDT` | `exchange_rates.HYPE_USDT` | number | ✅ |
| `exchangeRates.HYPE_BTC` | `exchange_rates.HYPE_BTC` | number | ✅ |

**⚠️ 특수 케이스:** `HYPE_USD` 등은 **SCREAMING_SNAKE_CASE 유지** (통화 쌍 관례)

---

### 🔔 Price Alert 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `id` | `id` | string |
| `indexId` | `index_id` | string |
| `condition` | `condition` | 'above'\|'below' |
| `targetPrice` | `target_price` | number |
| `createdAt` | `created_at` | number (epoch ms) |
| `triggered` | `triggered` | boolean |
| `active` | `is_active` | boolean |

---

### 🔍 Search 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `id` | `id` | string |
| `name` | `name` | string |
| `symbol` | `symbol` | string |
| `description` | `description` | string |
| `marketCap` | `market_cap` | number |
| `price` | `price` | number |

---

### ⚙️ Settings 도메인

**Preferences:**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `theme` | `theme` | string |
| `lang` | `lang` | string |
| `currency` | `currency` | string |
| `timefmt` | `time_fmt` | string |

**⚠️ 수정:** `timefmt` → `timeFmt` (프론트), API는 `time_fmt`

**Profile:**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `name` | `name` | string |
| `ens` | `ens` | string |
| `email` | `email` | string |

**Notifications settings:**
| 프론트 | 백엔드 API | 타입 |
|---|---|---|
| `price` | `price` | boolean |
| `governance` | `governance` | boolean |
| `trades` | `trades` | boolean |
| `email` | `email` | boolean |

---

### 🏦 LP Position 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `id` | `id` | string |
| `indexId` | `index_id` | string |
| `liquidityToken` | `liquidity_token` | string |
| `amount` | `amount` | number |
| `sharePct` | `share_pct` | number |
| `accruedFees` | `accrued_fees` | number |
| `apr` | `apr` | number |
| `depositedAt` | `deposited_at` | number (epoch ms) |

---

### 💎 Token Balance 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `symbol` | `symbol` | string |
| `name` | `name` | string |
| `balance` | `balance` | string |
| `balanceFormatted` | `balance_formatted` | string |
| `decimals` | `decimals` | number |
| `address` | `address` | string |
| `logoUrl` | `logo_url` | string |
| `usdValue` | `usd_value` | number |

---

### 📦 Asset 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `symbol` | `symbol` | string |
| `name` | `name` | string |
| `price` | `price` | number |
| `marketCap` | `market_cap` | number |
| `liquidity` | `liquidity` | number |
| `blacklist` | `blacklist` | boolean |

---

### 📈 Analytics 도메인

| 프론트 (camelCase) | 백엔드 API (snake_case) | 타입 |
|---|---|---|
| `totalPnl` | `total_pnl` | number |
| `realizedPnl` | `realized_pnl` | number |
| `unrealizedPnl` | `unrealized_pnl` | number |
| `totalFees` | `total_fees` | number |
| `winRate` | `win_rate` | number |
| `totalVolume` | `total_volume` | number |
| `pnlByIndex` | `pnl_by_index` | array |
| `dailyEquityCurve` | `daily_equity_curve` | array |

---

### 🌐 Realtime WebSocket 도메인

**price_update 이벤트:**
| 프론트 (camelCase) | 백엔드 WS (snake_case) | 타입 |
|---|---|---|
| `indexId` | `index_id` | string |
| `price` | `price` | number |
| `change24h` | `change_24h` | number |
| `volume24h` | `volume_24h` | number |
| `timestamp` | `timestamp` | number (epoch ms) |

**trade_executed 이벤트:**
| 프론트 | 백엔드 WS | 타입 |
|---|---|---|
| `tradeId` | `trade_id` | string |
| `indexId` | `index_id` | string |
| `type` | `type` | 'buy'\|'sell' |
| `amount` | `amount` | number |
| `price` | `price` | number |
| `userId` | `user_id` | string |
| `timestamp` | `timestamp` | number (epoch ms) |

**trader_update 이벤트:**
| 프론트 | 백엔드 WS | 타입 |
|---|---|---|
| `traderId` | `trader_id` | string |
| `pnl24h` | `pnl_24h` | number |
| `pnl7d` | `pnl_7d` | number |
| `pnl30d` | `pnl_30d` | number |
| `rank` | `rank` | number |
| `totalVolume` | `total_volume` | number |
| `timestamp` | `timestamp` | number (epoch ms) |

**whale_alert 이벤트:**
| 프론트 | 백엔드 WS | 타입 |
|---|---|---|
| `indexId` | `index_id` | string |
| `type` | `type` | 'large_buy'\|'large_sell' |
| `amount` | `amount` | number |
| `price` | `price` | number |
| `impact` | `impact` | number |
| `timestamp` | `timestamp` | number (epoch ms) |

---

### 🔐 Privy JWT → DB 매핑

| Privy JWT 필드 | 프론트 타입 | 백엔드 DB | 비고 |
|---|---|---|---|
| `sub` | `privyUserId` | `privy_user_id` | 사용자 ID |
| `iss` | - | - | 'privy.io' |
| `aud` | - | - | App ID |
| `exp` | - | - | 만료 시간 |
| `iat` | - | - | 발급 시간 |
| `auth_time` | - | - | 인증 시간 |
| `sid` | - | - | 세션 ID |
| `email.address` | `email` | `email` | |
| `email.verified` | `emailVerified` | `email_verified` | |
| `wallet.address` | `walletAddress` | `wallet_address` | |
| `wallet.chain_type` | `chainType` | - | 저장 안 함 (선택) |
| `wallet.chain_id` | `chainId` | - | 저장 안 함 (선택) |
| `wallet.wallet_client_type` | `walletProvider` | `wallet_provider` | ⚠️ 이름 다름! |
| `wallet.connector_type` | `walletType` | - | embedded/external |
| `phone.number` | - | - | 미사용 |
| `phone.verified` | - | - | 미사용 |

**⚠️ 중요:** Privy `wallet_client_type` → DB `wallet_provider` 변환 필요

---

## 도메인별 필드 목록

### User 도메인 전체 필드 (10개)
`id`, `authType`, `email`, `emailVerified`, `walletAddress`, `walletType`, `privyUserId`, `createdAt`, `lastLogin`, `isActive`

### User Wallet 전체 필드 (7개)
`id`, `userId`, `walletAddress`, `encryptedPrivateKey`, `walletProvider`, `isPrimary`, `createdAt`

### Index (MemeIndex) 전체 필드 (38개)
`id`, `symbol`, `name`, `theme`, `description`, `createdAt`, `heatScore`, `layerInfo` (5개 서브필드), `currentPrice`, `change24h`, `change7d`, `volume24h`, `tvl`, `marketCap`, `sparklineData`, `holders`, `topTraders`, `isHot`, `isNew`, `isMooning`, `hasBattle`, `graduation` (3개 서브필드), `assets` (5개 서브필드 per item), `lastRebalanced`, `nextRebalancing`, `governance` (3개 서브필드)

### Trader (TopTrader) 전체 필드 (34개)
`id`, `address`, `ens`, `rank`, `pnl24h`, `pnl7d`, `pnl30d`, `totalPnl`, `pnlPercentage24h`, `pnlPercentage7d`, `pnlPercentage30d`, `totalPnlPercentage`, `winRate`, `totalTrades`, `followersCount`, `tradingIndices`, `isNewTrader`, `avatar`, `badges`, `socialLinks` (2개 서브필드), `copyTradeData` (4개 서브필드), + 상세 필드 10개

### Trade 전체 필드 (20개)
`id`, `indexId`, `traderId`, `type`, `entryPrice`, `exitPrice`, `currentPrice`, `amount`, `leverage`, `pnl`, `pnlPercentage`, `status`, `timestamp`, `closeTimestamp`, `orderType`, `fees`, `fundingFees`, `transactionHash`, `stopLoss`, `takeProfit`

### Proposal 전체 필드 (50개+)
기본 필드 + config (10개+) + tally (4개) + timelock (2개) + multisig (3개) + user (4개) + changes (배열)

### Market Stats 전체 필드 (12개)
`totalMarketCap`, `totalTvl`, `totalVolume24h`, `activeIndices`, `activeTraders`, `topGainer` (2개), `topLoser` (2개), `dominanceIndex`, `dominancePercentage`, `avgChange24h`

### Notification 전체 필드 (10개)
`id`, `title`, `body`, `category`, `isRead`, `createdAt`, `meta` (5개 서브필드)

---

## 케이스 스타일 사용 규칙

### 1. camelCase (프론트엔드 전용)
**사용:**
- 모든 변수명, 함수명, 프로퍼티명
- 타입/인터페이스 내부 필드명
- React 컴포넌트 props

**예시:**
```typescript
const currentPrice = 125.45
const walletAddress = "0x..."
interface MemeIndex {
  currentPrice: number
  change24h: number
  isHot: boolean
}
```

---

### 2. snake_case (백엔드 DB & API)
**사용:**
- DB 테이블 컬럼명
- API JSON 응답 필드명
- WebSocket 이벤트명 및 필드

**예시:**
```json
{
  "current_price": 125.45,
  "change_24h": 12.5,
  "is_hot": true
}
```

---

### 3. PascalCase (타입/인터페이스명)
**사용:**
- 타입 정의명
- 인터페이스명
- Enum명 (사용 시)

**예시:**
```typescript
type MemeIndex = { ... }
interface TopTrader { ... }
type NotificationCategory = ...
```

---

### 4. kebab-case (String Literal - 도메인 용어)
**사용:**
- 필터 옵션
- 정렬 옵션  
- Layer 시스템
- Snapshot 방식

**예시:**
```typescript
type IndexFilter = 'all' | 'high-volume' | 'vs-battles' | 'layer-1'
type IndexSort = 'volume' | 'market-cap' | 'created'
type SnapshotMethod = 'time-weighted' | 'lock-based' | 'commit-reveal'
```

---

### 5. lowercase (String Literal - 일반 상태)
**사용:**
- 거래 타입: `'buy' | 'sell'`, `'long' | 'short'`
- 상태: `'open' | 'closed'`, `'active' | 'pending'`
- 투표: `'for' | 'against' | 'abstain'`

**예시:**
```typescript
type TradeType = 'buy' | 'sell'
type VoteChoice = 'for' | 'against' | 'abstain'
type ProposalPhase = 'active' | 'queued' | 'executed'
```

---

### 6. SCREAMING_SNAKE_CASE (상수)
**사용:**
- 환경변수
- 통화 쌍 환율 키
- API 엔드포인트 상수

**예시:**
```typescript
const API_BASE_URL = '/api'
const MAX_RETRY_COUNT = 3
const HYPE_USD = 1.0  // ExchangeRates 필드
```

---

### 7. UPPERCASE (통화 코드)
**사용:**
- Currency 타입만

**예시:**
```typescript
type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC'
```

---

## 불일치 패턴 및 수정 사항

### 🔴 필수 수정 (프론트엔드)

#### 1. Boolean 필드 prefix 누락 (5곳)

| 현재 | 수정 후 | 파일 |
|---|---|---|
| `read` | `isRead` | lib/types/notifications.ts |
| `eligible` | `isEligible` | lib/types/governance.ts (UserState) |
| `shielded` | `isShielded` | lib/types/governance.ts (VotingConfig) |
| - | - | - |

**백엔드 DB:**
| 현재 | 수정 후 (권장) | 테이블 |
|---|---|---|
| `used` | `is_used` | email_verification_codes |
| `enabled` | `is_enabled` | user_2fa |

---

#### 2. NotificationCategory snake_case (1곳)

**현재:**
```typescript
type NotificationCategory = 
  | 'system'
  | 'trade'
  | 'governance'
  | 'referral'
  | 'price_alert'  // ⚠️ snake_case!
```

**수정:**
```typescript
type NotificationCategory = 
  | 'system'
  | 'trade'
  | 'governance'
  | 'referral'
  | 'priceAlert'  // ✅ camelCase
```

**백엔드 API는:** `'price_alert'` 유지, 프론트에서 변환

---

#### 3. timefmt → timeFmt

**현재:**
```typescript
type Preferences = {
  theme: string
  lang: string
  currency: string
  timefmt: string  // ⚠️ 축약형
}
```

**수정:**
```typescript
type Preferences = {
  theme: string
  lang: string
  currency: string
  timeFmt: string  // ✅ camelCase
}
```

**백엔드 API:** `time_fmt`

---

#### 4. Date 객체 → number (epoch ms)

**현재 문제:**
```typescript
interface Trade {
  timestamp: Date  // ⚠️
  closeTimestamp?: Date  // ⚠️
}

interface MemeIndex {
  lastRebalanced: Date  // ⚠️
  nextRebalancing?: Date  // ⚠️
}
```

**수정:**
```typescript
interface Trade {
  timestamp: number  // ✅ epoch ms
  closeTimestamp?: number  // ✅
}

interface MemeIndex {
  lastRebalanced: number  // ✅ epoch ms
  nextRebalancing?: number  // ✅
}
```

**UI에서 사용 시:**
```typescript
const date = new Date(trade.timestamp)
```

---

### 🟡 권장 수정 (백엔드)

#### 1. Wallet Provider 네이밍 통일

**현황:**
- Privy JWT: `wallet_client_type` (예: "metamask", "coinbase_wallet")
- DB: `wallet_provider` (예: "metamask")
- 프론트: `walletProvider` 또는 `walletClientType` 혼용

**통일안:**
- **DB 필드명:** `wallet_provider`
- **프론트 타입:** `walletProvider`
- **Privy → DB 저장 시:** `wallet.wallet_client_type` → `wallet_provider` 매핑

---

#### 2. Chain 관련 네이밍

**현황:**
- Privy: `chain_type` (string: "ethereum", "solana")
- Privy: `chain_id` (string: "eip155:1")
- 프론트: `chainType`, `chainId` 혼용

**통일안:**
- `chainType` (string): "ethereum", "solana", "polygon" 등
- `chainId` (number): 1, 137, 42161 등 (EVM 체인만)
- DB 저장 여부: 선택 (필요 시 `chain_type`, `chain_id` 컬럼 추가)

---

### 🟢 확인 완료 (일관성 있음)

#### ✅ Boolean Prefix 일관성
**프론트:**
- `isHot`, `isNew`, `isMooning`, `hasBattle` ✅
- `isLoading`, `isRefreshing`, `isActive` ✅
- `isNewTrader`, `isConnected`, `isExecuting` ✅

**DB:**
- `is_active`, `is_primary`, `email_verified` ✅

---

#### ✅ 시간 필드 접미사
**프론트 (*At suffix):**
- `createdAt`, `updatedAt`, `endsAt`, `expiresAt`, `queuedAt`, `lastLogin`, `lastAccessed`, `depositedAt` ✅

**특수 케이스:**
- `timestamp` - 이벤트 시간 (접미사 없음)
- `closeTimestamp` - 청산 시간 (timestamp suffix)
- `eta` - Estimated Time of Arrival (약어)

---

#### ✅ PnL 필드 일관성
**프론트:**
- `pnl`, `pnl24h`, `pnl7d`, `pnl30d`, `totalPnl`
- `pnlPercentage`, `pnlPercentage24h`, `pnlPercentage7d`, `pnlPercentage30d`

**백엔드 API:**
- `pnl`, `pnl_24h`, `pnl_7d`, `pnl_30d`, `total_pnl`
- `pnl_percentage`, `pnl_percentage_24h`, `pnl_percentage_7d`, `pnl_percentage_30d`

---

## 케이스별 String Literal 완전 목록

### lowercase (일반 상태 - 53개)

**거래:**
- `'buy' | 'sell'` (TradeType)
- `'long' | 'short'` (PositionType)
- `'market' | 'limit' | 'stop-loss' | 'take-profit'` (OrderType)
- `'open' | 'closed' | 'liquidated'` (TradeStatus)

**투표:**
- `'for' | 'against' | 'abstain'` (VoteChoice)

**제안:**
- `'rebalancing' | 'battle' | 'parameter'` (ProposalType)
- `'pending' | 'active' | 'commit' | 'reveal' | 'succeeded' | 'defeated' | 'queued' | 'timelocked' | 'awaiting-multisig' | 'executed' | 'canceled'` (ProposalPhase)

**알림:**
- `'system' | 'trade' | 'governance' | 'referral'` (NotificationCategory 일부)

**가격 알림:**
- `'price' | 'percentage'` (AlertType)
- `'above' | 'below'` (PriceCondition)

**리스크:**
- `'low' | 'medium' | 'high'` (RiskLevel)

**인증:**
- `'email' | 'wallet'` (AuthType)

**정렬:**
- `'volume' | 'change' | 'price' | 'name' | 'created'` (일부)
- `'pnl' | 'winrate' | 'followers' | 'trades' | 'rank'` (TraderSort)

**기타:**
- `'all'` (필터 기본값)
- `'ascending' | 'descending'` (정렬 방향)

---

### kebab-case (도메인 용어 - 25개)

**Layer 시스템:**
- `'layer-1' | 'layer-2' | 'layer-3'` (IndexLayer)

**Index 필터:**
- `'high-volume' | 'vs-battles'` (IndexFilter)
- `'market-cap'` (IndexSort)

**Trader 필터:**
- `'top-gainers' | 'high-winrate' | 'new-traders' | 'most-followed'` (TraderFilter)

**Snapshot 방식:**
- `'time-weighted' | 'lock-based' | 'multi-point' | 'commit-reveal'` (SnapshotMethod)

**Layer 카테고리:**
- `'mainstream-meme' | 'volatile-launchpad'`

**거래 메커니즘:**
- `'direct-creation-redemption'`

**접근 권한:**
- `'institution-only' | 'verified-only'`

**Graduation 상태:**
- `'recruiting-liquidity' | 'near-graduation'`

**트레이딩 스타일:**
- `'diamond-hands'` (Theme)

---

### UPPERCASE (통화 - 5개)
- `'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC'` (Currency)

---

### snake_case (WS 이벤트명 - 5개)
- `'price_update'`
- `'trade_executed'`
- `'trader_update'`
- `'whale_alert'`
- `'market_stats'`

**⚠️ 주의:** WS 이벤트명은 wire에서 snake_case, 프론트에서 변환하지 말 것

---

### SCREAMING_SNAKE_CASE (환율 키 - 4개)
- `HYPE_USD`, `HYPE_USDC`, `HYPE_USDT`, `HYPE_BTC`

**특수 케이스:** 통화 쌍 관례 따름

---

## 불일치 패턴 및 수정 사항

### 🔴 Critical (반드시 수정)

#### 1. Boolean Prefix 누락 (프론트 3곳, DB 2곳)

**프론트엔드:**
```typescript
// ❌ 현재
interface UserState {
  eligible: boolean
}
interface VotingConfig {
  shielded?: boolean
}
interface NotificationItem {
  read: boolean
}

// ✅ 수정
interface UserState {
  isEligible: boolean
}
interface VotingConfig {
  isShielded?: boolean
}
interface NotificationItem {
  isRead: boolean
}
```

**백엔드 DB (권장):**
```sql
-- ❌ 현재
email_verification_codes.used BOOLEAN
user_2fa.enabled BOOLEAN

-- ✅ 수정 (선택)
email_verification_codes.is_used BOOLEAN
user_2fa.is_enabled BOOLEAN
```

---

#### 2. NotificationCategory snake_case

**프론트:**
```typescript
// ❌ 현재
type NotificationCategory = 'system' | 'trade' | 'governance' | 'referral' | 'price_alert'

// ✅ 수정
type NotificationCategory = 'system' | 'trade' | 'governance' | 'referral' | 'priceAlert'
```

**백엔드 API:** `'price_alert'` 유지 (변환 레이어에서 처리)

---

#### 3. Date 객체 → number

**프론트:**
```typescript
// ❌ 현재 (lib/types/index-trading.ts)
interface Trade {
  timestamp: Date
  closeTimestamp?: Date
}
interface MemeIndex {
  lastRebalanced: Date
  nextRebalancing?: Date
}

// ✅ 수정
interface Trade {
  timestamp: number  // epoch ms
  closeTimestamp?: number
}
interface MemeIndex {
  lastRebalanced: number
  nextRebalancing?: number
}
```

---

### 🟡 Medium (권장 수정)

#### 4. Wallet Provider 네이밍

**현황:**
| 소스 | 필드명 | 값 예시 |
|---|---|---|
| Privy JWT | `wallet.wallet_client_type` | "metamask" |
| DB | `wallet_provider` | "metamask" |
| 프론트 | `walletProvider` 또는 `walletClientType` | "metamask" |

**통일안:**
- **프론트 타입:** `walletProvider` (통일)
- **백엔드 DB:** `wallet_provider`
- **Privy 데이터 저장 시:** `wallet_client_type` → `wallet_provider` 변환

---

#### 5. Index 구성 자산 필드명

**현황:**
- MemeIndex 타입: `assets[]` ✅
- Mock 데이터 일부: `memeCoins[]` ❌
- API 문서: `constituents[]` 혼용

**통일안:**
- **필드명:** `assets` (통일)
- `constituents`는 사용하지 않음 (또는 `assets`의 별칭)

---

#### 6. MarketStats 필드 불일치

**Mock (use-market-data.ts):**
```typescript
{
  totalMarketCap: number,
  totalVolume24h: number,
  activeIndices: number,
  topPerformerChange: number,  // ❌
  avgChange24h: number,
  dominanceIndex: string,
  dominancePercentage: number
}
```

**타입 정의 (lib/types/index-trading.ts):**
```typescript
{
  totalVolume24h: number,
  totalTVL: number,
  activeIndices: number,
  activeTraders: number,
  totalMarketCap: number,
  topGainer: { symbol, change },  // ✅
  topLoser: { symbol, change }    // ✅
}
```

**통일안:** 타입 정의 따름 (`topGainer`, `topLoser` 객체 사용)

---

### 🟢 Minor (정보 공유)

#### 7. Sort Option 불일치

**프론트 UI:**
```typescript
type SortOption = 'volume' | 'change' | 'price' | 'marketCap' | 'name'
```

**API 쿼리:**
```typescript
type IndexSort = 'volume' | 'change' | 'market-cap' | 'name' | 'created'
```

**매핑:**
- 프론트 `marketCap` → API query `sort=market-cap`

---

## 백엔드 팀 통일 계획

### 📝 Phase 1: 응답 형식 통일 (1일)

**모든 API 응답:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 },
  "timestamp": 1704153600000
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": 1704153600000
}
```

**Error Code 목록:**
- `VALIDATION_ERROR` - 400
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `CONFLICT` - 409
- `RATE_LIMITED` - 429
- `UPSTREAM_FAILED` - 502
- `INTERNAL_ERROR` - 500

---

### 📝 Phase 2: 필드 네이밍 통일 (1-2일)

**작업:**
1. ✅ 모든 API 응답을 snake_case로 통일
2. ✅ Boolean 필드에 `is_*`, `has_*` prefix 사용
3. ✅ 타임스탬프를 number (epoch ms)로 통일
4. ⚪ DB 컬럼명 일부 수정 (선택)
   - `used` → `is_used`
   - `enabled` → `is_enabled`

---

### 📝 Phase 3: 변환 레이어 구현 (3시간)

**Option A: 프론트에서 변환 (권장)**
```typescript
// lib/utils/case-converter.ts
export function toCamelCase<T>(obj: T): CamelCased<T> {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as any
  }
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const result: any = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = toCamelCase(obj[key])
  }
  return result
}

// API fetch wrapper
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const json = await response.json()
  if (!json.success) {
    throw new Error(json.error?.message || 'API Error')
  }
  return toCamelCase(json.data)
}
```

**Option B: 백엔드에서 변환**
```python
# Python Flask 예시
from humps import camelize

@app.after_request
def convert_to_camel(response):
    if response.content_type == 'application/json':
        data = response.get_json()
        response.data = json.dumps(camelize(data))
    return response
```

**권장:** Option A (프론트 변환) - 백엔드 부담 적음

---

### 📝 Phase 4: WebSocket 이벤트 통일 (1일)

**규칙:**
- 이벤트명: snake_case (`price_update`, `trade_executed`)
- 필드명: snake_case
- 메시지 envelope:
```json
{
  "channel": "/ws/prices",
  "event": "price_update",
  "data": {
    "index_id": "...",
    "price": 125.45,
    "change_24h": 12.5,
    "timestamp": 1704153600000
  },
  "timestamp": 1704153600000
}
```

---

## 🎯 백엔드 체크리스트

### ✅ 필수 작업
- [ ] 모든 API 응답을 `{ success, data, error, meta, timestamp }` 형식으로 통일
- [ ] 모든 JSON 필드를 snake_case로 반환
- [ ] 모든 타임스탬프를 number (epoch ms)로 반환
- [ ] Boolean 필드에 `is_*`, `has_*` prefix 사용
- [ ] Privy `wallet_client_type` → DB `wallet_provider` 매핑 구현
- [ ] WebSocket 이벤트를 snake_case로 통일

### ⚪ 권장 작업
- [ ] DB 컬럼명 수정 (`used` → `is_used`, `enabled` → `is_enabled`)
- [ ] API 응답을 camelCase로 변환하는 미들웨어 (선택)

### 🔄 프론트엔드 작업 (참고용)
- [ ] `lib/utils/case-converter.ts` 생성
- [ ] Boolean 필드명 수정 (eligible, shielded, read)
- [ ] NotificationCategory 수정 (price_alert → priceAlert)
- [ ] Date → number 변환 (Trade, MemeIndex)
- [ ] API fetch wrapper에 변환 로직 적용

---

## 📚 전체 필드 수 통계

| 도메인 | 프론트 필드 수 | 백엔드 필드 수 | 변환 필요 |
|---|---|---|---|
| User | 10 | 10 | 8개 |
| User Wallet | 7 | 7 | 6개 |
| User Session | 7 | 7 | 6개 |
| Email Verification | 6 | 6 | 4개 |
| 2FA | 5 | 5 | 4개 |
| MemeIndex | 38+ | 38+ | 30개+ |
| TopTrader | 34+ | 34+ | 25개+ |
| Trade | 20 | 20 | 16개 |
| Proposal | 50+ | 50+ | 40개+ |
| MarketStats | 12 | 12 | 11개 |
| Notification | 10 | 10 | 7개 |
| TokenBalance | 8 | 8 | 5개 |
| **합계** | **~200개 이상** | **~200개 이상** | **~160개+** |

---

## 🔧 변환 함수 구현 예시

### toCamelCase (프론트)
```typescript
// lib/utils/case-converter.ts
export function toCamelCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as T
  }
  
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj
  }
  
  const result: any = {}
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    
    // snake_case → camelCase
    const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase())
    
    result[camelKey] = toCamelCase(obj[key])
  }
  
  return result as T
}
```

### toSnakeCase (프론트 → 백엔드 요청)
```typescript
export function toSnakeCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase) as T
  }
  
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj
  }
  
  const result: any = {}
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    
    // camelCase → snake_case
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    
    result[snakeKey] = toSnakeCase(obj[key])
  }
  
  return result as T
}
```

### API Fetch Wrapper
```typescript
// lib/api/client.ts
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  })
  
  const json = await response.json()
  
  if (!json.success) {
    throw new APIError(
      json.error?.message || 'API Error',
      json.error?.code,
      json.error?.details
    )
  }
  
  // snake_case → camelCase 자동 변환
  return toCamelCase<T>(json.data)
}

// 사용 예시
const indices = await apiFetch<MemeIndex[]>('/api/indices')
// indices[0].currentPrice ✅ (자동 변환됨)
```

---

## 🎓 사용 예시

### 프론트엔드에서 API 호출
```typescript
// 1. 인덱스 목록 조회
const response = await fetch('/api/indices?filter=hot&sort=volume&limit=20')
const json = await response.json()
const indices: MemeIndex[] = toCamelCase(json.data)

// 2. 거래 실행
const tradeRequest = {
  indexId: 'pepe_ecosystem_001',
  type: 'buy',
  amount: 1000,
  leverage: 5
}
const snakeRequest = toSnakeCase(tradeRequest)
// { index_id: '...', type: 'buy', amount: 1000, leverage: 5 }

const response = await fetch('/api/trades', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${privyToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(snakeRequest)
})
```

### 백엔드에서 응답 생성
```python
# Python FastAPI 예시
@app.get("/api/indices")
async def get_indices(filter: str = "all", sort: str = "volume", limit: int = 20):
    # DB 조회 (snake_case)
    rows = await db.query("""
        SELECT 
            id, symbol, name, current_price, change_24h, volume_24h,
            market_cap, is_hot, is_new, created_at
        FROM indices
        WHERE ...
        ORDER BY ...
        LIMIT %s
    """, limit)
    
    # snake_case 그대로 반환 (변환 안 함)
    return {
        "success": True,
        "data": [dict(row) for row in rows],
        "meta": {
            "total": await db.count("indices"),
            "page": 1,
            "limit": limit
        },
        "timestamp": int(time.time() * 1000)
    }
```

---

## 📖 참고 자료

### 관련 문서
- [BACKEND_DATA_REQUIREMENTS.md](./BACKEND_DATA_REQUIREMENTS.md) - API 엔드포인트 전체 스펙
- [BACKEND_INTEGRATION_CHECKLIST.md](./BACKEND_INTEGRATION_CHECKLIST.md) - 통합 체크리스트

### 타입 정의 위치
- `lib/types/index-trading.ts` - MemeIndex, TopTrader, Trade, MarketStats
- `lib/types/governance.ts` - Proposal, VotingConfig, Tally 등
- `lib/types/notifications.ts` - NotificationItem
- `lib/types/currency.ts` - Currency, ExchangeRates
- `lib/supabase/types.ts` - DB 스키마 (5개 테이블)
- `lib/auth/privy-jwt.ts` - PrivyJWTPayload

---

**작성일:** 2025-01-11  
**최종 업데이트:** 전체 타입 시스템 완전 분석 (Oracle + Grep 전역 검색)  
**상태:** ✅ 완전 (200+ 필드 매핑 완료)  
**작성자:** 프론트엔드 팀
