# 백엔드 통합 체크리스트

> 프론트엔드-백엔드 API 연동 시 확인 및 통일이 필요한 사항 정리

## 📊 분석 진행 상황
- 총 파일 수: ~200+
- 완료: 전역 검색 완료 (Grep으로 모든 API 호출 패턴 검색)
- 상세 분석: 25개 파일

---

## 🔍 발견된 API 호출 패턴

### 현재 사용 중인 HTTP 클라이언트
- [ ] fetch API (주석 처리됨, 사용 예정)
- [ ] axios (사용 안 함)
- [ ] Next.js Server Actions (사용 안 함)
- [x] **Supabase Client** - 일부 API에서 사용 (auth, user profile)
- [x] **Mock 함수 (simulateLatency, Promise timeout)** - 대부분의 API

### API 엔드포인트 목록

#### `lib/api/settings.ts` - ⚠️ MOCK 상태
**함수:**
- `savePreferences(prefs: Preferences)` → `{ ok: true }`
- `saveProfile(profile: Profile)` → `{ ok: true }`
- `saveNotifications(notifs: Notifications)` → `{ ok: true }`
- `updatePassword(newPassword: string)` → `{ ok: true }`

**타입:**
```typescript
Preferences = { theme: string; lang: string; currency: string; timefmt: string }
Profile = { name: string; ens: string; email: string }
Notifications = { price: boolean; governance: boolean; trades: boolean; email: boolean }
```

**🔴 백엔드 통합 필요:**
- 실제 HTTP 엔드포인트 URL 정의 필요
- 에러 처리 로직 추가 필요
- 응답 타입 확장 필요 (현재 `{ ok: true }`만 반환)
- **2FA 관련 함수 추가 필요:**
  - `get2FAStatus()` → `GET /api/user/2fa`
  - `enable2FA(secretKey, verificationCode)` → `POST /api/user/2fa/enable`
  - `disable2FA(verificationCode)` → `POST /api/user/2fa/disable`
- **DangerZone 관련 함수 추가 필요:**
  - `revokeAllSessions()` → `POST /api/user/sessions/revoke-all`
  - `disableDataCollection()` → `POST /api/user/data-collection/disable`

#### `lib/api/search.ts` - ⚠️ MOCK 상태
**함수:**
- `searchIndexes(query: string)` → `IndexSearchResult[]`

**타입:**
```typescript
IndexSearchResult = {
  id: string
  name: string
  symbol: string
  description?: string
  marketCap?: number
  price?: number
}
```

**🔴 백엔드 통합 필요:**
- 주석에 TODO 명시됨: `/api/search/indexes?q={query}` 엔드포인트 연결 대기
- fetch API 사용 예정 (주석 처리됨)
- 현재 mock data 사용 중 (300ms delay)

#### `lib/api/governance.ts` - ⚠️ MOCK 상태
**함수:**
- `submitIndexSpec(spec: IndexSpec)` → `{ id: string }` (85% 성공률 시뮬레이션)
- `getProposals()` → `Proposal[]` (하드코딩된 mock 데이터 6개)
- `submitVote(proposalId, choice, power?)` → `{ ok: true }`

**타입:**
```typescript
IndexSpec = {
  basics: { name, symbol, category, description }
  chain: { chain, settlementToken, feeToken }
  constituents: Array<{ symbol, weight }>
  rules: { maxPerAsset, minLiquidity }
}
VoteChoice = 'for' | 'against' | 'abstain'
```
- `Proposal` 타입은 `@/lib/types/governance`에서 import (외부 의존성)

**🔴 백엔드 통합 필요:**
- 실제 HTTP 엔드포인트 없음 (모두 시뮬레이션)
- 에러 핸들링: `submitIndexSpec`은 15% 확률로 에러 throw
- `getProposals`는 하드코딩된 mock 데이터 반환 (백엔드 DB 연결 필요)

#### `app/api/user/profile/route.ts` - ✅ SUPABASE 연동됨
**엔드포인트:**
- `GET /api/user/profile` - 사용자 프로필 조회
- `PUT /api/user/profile` - 프로필 업데이트
- `OPTIONS /api/user/profile` - CORS

**사용 기술:**
- Next.js Route Handlers (App Router)
- Supabase Admin Client (`supabaseAdmin`)
- Zod 스키마 검증
- Privy 인증 미들웨어 (`requirePrivyAuth`)

**응답 형식:**
```typescript
// 성공
{ success: true, user: {...}, message?: string }
// 실패
{ success: false, error: string, details?: any }
```

**DB 필드 네이밍:**
- DB: `snake_case` (auth_type, email_verified, wallet_address)
- API Response: `camelCase` (authType, emailVerified, walletAddress)
- ⚠️ **변환 로직 수동 처리 중** (라인 60-70)

**🟡 개선 필요:**
- snake_case ↔ camelCase 자동 변환 유틸리티 필요
- 타입 정의 파일 분리 (현재 인라인 정의)

#### `app/api/auth/sync-user/route.ts` - ✅ PRIVY + SUPABASE 연동
**엔드포인트:**
- `POST /api/auth/sync-user` - Privy 사용자 동기화

**사용 기술:**
- Privy 인증 + Supabase Admin
- 복잡한 지갑 동기화 로직
- Multi-wallet 지원 (linkedAccounts 순회)

**주요 로직:**
1. Privy 사용자 → Supabase `users` 테이블 upsert
2. linkedAccounts → `user_wallets` 테이블 동기화 (DELETE + INSERT)
3. Chain ID → Network Name 매핑 (`CHAIN_ID_TO_NETWORK`)

**응답 형식:**
```typescript
{ 
  success: true,
  user: {...},
  syncedWallets: [...],
  allUserWallets: [...],
  message: string
}
```

**네트워크 지원:**
- Ethereum (1), Arbitrum (42161), Polygon (137), Base (8453), Optimism (10), Solana

**🟡 개선 필요:**
- 로깅이 과도함 (프로덕션 환경에서 제거 권장)
- `CHAIN_ID_TO_NETWORK` 상수를 공통 유틸로 분리
- `getNetworkName` 함수 공통 유틸로 분리

#### `hooks/use-wallet.ts` - ⚠️ MOCK + PRIVY 혼용
**제공 기능:**
- `useWalletBalances()` - Mock 잔액 조회 (실제 RPC 미연결)
- `useTradeExecution()` - Mock 거래 실행 (90% 성공률 시뮬레이션)
- `useTradeHistory()` - Zustand 스토어 기반
- `usePositionManagement()` - 포지션 관리 (Mock)
- `useWallet()` - 통합 훅

**사용 기술:**
- Privy SDK (`@privy-io/react-auth`)
- Zustand 스토어 (`trading-store`)
- Mock 데이터 생성 함수

**타입:**
```typescript
TokenBalance = { symbol, name, balance, balanceFormatted, decimals, address, logoUrl?, usdValue? }
TradeParams = { indexId, type: 'buy'|'sell', amount, leverage?, slippage?, deadline? }
TradeResult = { success, transactionHash?, tradeId?, executedPrice?, gasUsed?, error? }
PendingTransaction = { id, hash, type, indexId?, amount, status, timestamp, ... }
```

**🔴 백엔드 통합 필요:**
- `generateMockBalance()` 실제 RPC 호출로 교체 필요
- `simulateTradeExecution()` 실제 스마트 컨트랙트 호출 필요
- 트랜잭션 확인 로직 실제 블록체인 이벤트로 교체

#### `hooks/use-market-data.ts` - ⚠️ 전체 MOCK (React Query 기반)
**제공 기능:**
- `useIndices()` - 인덱스 목록 (30초 refetch)
- `useTopTraders(timeframe)` - 탑 트레이더 (1분 refetch)
- `useIndexPrice(indexId)` - 개별 가격 (5초 refetch)
- `useMarketStats()` - 마켓 통계 (2분 refetch)
- `useRealtimePrices(indexIds)` - 실시간 가격 (3초 refetch)
- `useIndexDetails(indexId)` - 인덱스 상세
- `useTraderDetails(traderId)` - 트레이더 상세
- `useMarketTrends(period)` - 트렌드 분석
- `useRefreshMarketData()` - 수동 새로고침 mutation

**사용 기술:**
- React Query (`@tanstack/react-query`)
- Zustand 스토어 (`trading-store`)
- Mock 함수: `fetchIndices`, `fetchTopTraders`, `fetchIndexPrice`, `fetchMarketStats`

**타입:**
```typescript
MemeIndex, TopTrader, MarketStats, Trade (from '@/lib/types/index-trading')
```

**Query Keys 패턴:**
```typescript
marketQueryKeys = {
  all: ['market'],
  indices: ['market', 'indices'],
  traders: ['market', 'traders', timeframe],
  indexPrice: ['market', 'indexPrice', id],
  marketStats: ['market', 'stats']
}
```

**🔴 백엔드 통합 필요:**
- 모든 `fetch*` 함수를 실제 API 호출로 교체
- `simulateApiDelay()` 제거
- `generateMockIndices()`, `generateMockTraders()` 제거
- 실제 WebSocket 또는 Server-Sent Events로 실시간 가격 업데이트

#### `lib/supabase/client.ts` - ✅ 설정 완료
**제공 기능:**
- `supabase` - 클라이언트 사이드 클라이언트
- `supabaseAdmin` - 서버 사이드 Admin 클라이언트 (Service Role)
- `createUserSupabaseClient(accessToken)` - RLS 적용된 사용자별 클라이언트

**환경변수 의존:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용)

**✅ 잘 구성됨** - 추가 작업 불필요

#### `lib/middleware/privy-auth.ts` - ✅ 인증 미들웨어 완료
**제공 기능:**
- `requirePrivyAuth(request)` - API 라우트 인증
- `requirePrivyAdminAuth(request)` - 관리자 권한 확인
- `rateLimitByIP(request)`, `rateLimitByUser(userId)` - Rate limiting
- `extractPrivyAuthFromRequest(request)` - JWT 토큰 추출/검증

**보호 라우트:**
- `/dashboard`, `/profile`, `/wallet`, `/trade`
- `/api/user`, `/api/wallet`, `/api/trade`

**🟡 개선 권장:**
- Rate limiting은 메모리 기반 (서버 재시작시 초기화됨)
- 프로덕션 환경에서는 Redis 등 외부 저장소 권장

#### `middleware.ts` - ⚠️ 비활성화 상태
**현황:**
- 개발 편의를 위해 모든 요청 통과 (`return NextResponse.next()`)
- matcher: `/api/((?!health).*)` (health 제외한 API 경로만)

**🔴 프로덕션 배포 전 필수 작업:**
- 실제 인증 로직 활성화 필요
- `lib/middleware/privy-auth.ts`의 함수들 적용

#### `lib/store/governance-store.ts` - ✅ Zustand 스토어 (Mock API 호출)
**제공 기능:**
- `load()` - `getProposals()` API 호출
- `getById(id)` - 제안서 조회
- `applyVote(id, choice, power)` - 투표 적용 (로컬 상태만 업데이트)

**🔴 백엔드 통합 필요:**
- `getProposals()`는 mock 데이터 반환 (lib/api/governance.ts)
- `applyVote`는 로컬 상태만 업데이트, 실제 서버 호출 없음

#### `components/launch/IndexBuilderWizard.tsx` - ⚠️ Mock API 호출
**사용 API:**
- `submitIndexSpec(spec)` from `lib/api/governance`
- `assetsCatalog` from `lib/mock/assets`

**제출 플로우:**
```typescript
const result = await submitIndexSpec(spec)
if (result.id) { /* 성공 */ }
```

**🔴 백엔드 통합 필요:**
- `submitIndexSpec`는 85% 성공률 시뮬레이션 (실제 API 아님)
- Toast 메시지 있음 (성공/실패)

#### `components/governance/ProposalsSection.tsx` - ✅ 잘 구성됨
**사용 훅:**
- `useGovernance()` from `hooks/use-governance`
- Zustand 스토어 통한 상태 관리

**기능:**
- 제안서 필터링 (all, active, ending-soon, queued, awaiting-multisig, executed)
- 검색 (title, indexSymbol)
- 새로고침 버튼

**✅ 프론트 로직 완성** - 백엔드 API만 연결하면 됨

#### `lib/privy/config.ts` - ✅ 실제 fetch 호출 (Privy → Supabase 동기화)
**API 호출:**
```typescript
const response = await fetch('/api/auth/sync-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ privyUser: user })
})
```

**✅ 실제 HTTP 호출** - `/api/auth/sync-user` 엔드포인트 사용

#### `lib/pwa/sw-register.ts` - ⚠️ Push 알림 API (미구현)
**API 호출:**
```typescript
await fetch('/api/push/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(subscription)
})
```

**🔴 백엔드 통합 필요:**
- `/api/push/subscribe` 엔드포인트 미구현
- Push notification 서버 로직 필요

#### `public/sw.js` - Service Worker API 호출 (미구현)
**API 호출:**
- `POST /api/trades` - 오프라인 거래 동기화
- `POST /api/portfolio/sync` - 포트폴리오 동기화
- `GET /api/prices/all` - 가격 캐시 업데이트

**🔴 백엔드 통합 필요:**
- 위 3개 엔드포인트 모두 미구현
- Service Worker 오프라인 기능 활성화 시 필요

#### `components/governance/VoteDialog.tsx` - ✅ submitVote 호출
**사용 API:** `submitVote(proposalId, choice, power)` from `lib/api/governance`

**플로우:**
1. 사용자 투표 선택
2. `submitVote` 호출 (현재 mock)
3. Zustand 스토어 업데이트 (`applyVote`)
4. Toast 알림

**🔴 백엔드 통합 필요:** `submitVote`는 mock 함수

#### `components/layout/Header.tsx` - ✅ 검색 API 호출
**사용 API:** `searchIndexes(query)` from `lib/api/search`

**플로우:**
1. 사용자 입력 (300ms debounce)
2. `searchIndexes` 호출 (현재 mock)
3. 결과 표시
4. 클릭 시 `/trading?index={id}` 이동

**🔴 백엔드 통합 필요:** `searchIndexes`는 mock 함수

#### `components/settings/*` - ✅ 설정 API 호출
**사용 API:**
- `saveProfile(profile)` - ProfileSection.tsx
- `savePreferences(prefs)` - PreferencesSection.tsx
- `saveNotifications(notifs)` - NotificationsSection.tsx
- `updatePassword(newPassword)` - SecuritySection.tsx

**공통 패턴:**
1. LocalStorage에 먼저 저장 (`SettingsStorage`)
2. API 호출
3. Toast 알림

**🔴 백엔드 통합 필요:** 모두 `lib/api/settings.ts`의 mock 함수

---

## ⚠️ 백엔드 통합 이슈

### 1. Mock vs 실제 API 혼재
**문제:**
- `lib/api/*`: 전부 mock 시뮬레이션 (실제 HTTP 호출 없음)
- `app/api/*`: Supabase 연동 완료 (일부만)
- `hooks/use-wallet.ts`, `hooks/use-market-data.ts`: 전부 mock

**영향:**
- 백엔드 팀이 실제 엔드포인트 만들어도 프론트에서 연결 안 됨
- Mock 제거 시 대량 코드 수정 필요

### 2. 응답 형식 불일치
**문제:**
- Mock API: `{ ok: true }` 또는 직접 데이터 반환
- Supabase API: `{ success: true, user: {...}, message?: string }` 또는 `{ success: false, error: string }`
- 에러 케이스 응답 형식 통일 안 됨

**권장:**
```typescript
// 성공
{ success: true, data: T, message?: string }
// 실패
{ success: false, error: string, code?: string, details?: any }
```

### 3. snake_case ↔ camelCase 변환 누락
**문제:**
- DB: `snake_case` (auth_type, email_verified, wallet_address)
- API Response: `camelCase` (authType, emailVerified, walletAddress)
- **수동 변환 중** (app/api/user/profile/route.ts 라인 60-70)

**권장:**
- 자동 변환 유틸리티 함수 생성 필요
```typescript
function toCamelCase(obj: any): any { /* ... */ }
function toSnakeCase(obj: any): any { /* ... */ }
```

### 4. 에러 핸들링 패턴 불일치
**문제:**
- Mock 함수: `throw new Error('message')` 또는 확률 기반 에러
- Supabase API: `NextResponse.json({ success: false, error })` 
- Zod 검증 에러: `{ success: false, error, details: zodError.errors }`

**권장:**
- 공통 에러 핸들러 미들웨어 생성
- 에러 타입별 status code 표준화 (400, 401, 403, 404, 500)

### 5. 인증 헤더 처리
**현황:**
- Privy JWT 미들웨어 있음 (`lib/middleware/privy-auth.ts`)
- `requirePrivyAuth(request)` 사용 중
- ✅ 잘 구현됨

---

## 📝 통일 필요 사항

### 1. API Base URL 상수화
**현황:** 하드코딩되어 있거나 없음  
**권장:**
```typescript
// lib/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
export const API_ENDPOINTS = {
  auth: {
    syncUser: '/api/auth/sync-user',
    logout: '/api/auth/logout'
  },
  user: {
    profile: '/api/user/profile'
  },
  // ...
}
```

### 2. HTTP 클라이언트 통일
**현황:** fetch API 예정 (주석 처리됨)  
**권장:**
- axios 또는 ky 같은 HTTP 클라이언트 라이브러리 도입
- 공통 인터셉터로 인증 헤더 자동 추가
- 타임아웃, 재시도 로직 통일

### 3. React Query Key Factory 패턴
**현황:** `hooks/use-market-data.ts`에만 적용됨
```typescript
export const marketQueryKeys = {
  all: ['market'] as const,
  indices: () => [...marketQueryKeys.all, 'indices'] as const,
  // ...
}
```
**권장:** 모든 도메인에 적용 (user, governance, trading 등)

### 4. WebSocket 실시간 업데이트
**현황:** polling (refetchInterval) 사용 중  
**권장:**
- WebSocket 또는 Server-Sent Events로 실시간 가격 업데이트
- `hooks/use-realtime.ts` 활용 (이미 존재하는지 확인 필요)

---

## 🎯 우선순위 액션 아이템

### 🔴 High Priority (백엔드 연동 전 필수)
1. **미구현 API 엔드포인트 생성:**
   - `POST /api/push/subscribe` (Push 알림)
   - `POST /api/trades` (오프라인 거래 동기화)
   - `POST /api/portfolio/sync` (포트폴리오 동기화)
   - `GET /api/prices/all` (가격 캐시)

2. **Mock API를 실제 API로 교체:**
   - `lib/api/settings.ts` 전체
   - `lib/api/search.ts` 전체
   - `lib/api/governance.ts` 전체
   - `hooks/use-wallet.ts` 거래 실행 로직
   - `hooks/use-market-data.ts` 데이터 fetch 함수

3. **유틸리티 생성:**
   - snake_case ↔ camelCase 자동 변환 (`lib/utils/case-converter.ts`)
   - API 엔드포인트 상수 (`lib/config/api.ts`)
   - 공통 응답 타입 (`lib/types/api-response.ts`)
   - 공통 에러 핸들러 (`lib/middleware/error-handler.ts`)

4. **middleware.ts 활성화** (현재 비활성화 상태)

### 🟡 Medium Priority (개선 권장)
5. **HTTP 클라이언트 통일** (axios 또는 ky 도입)
6. **React Query Key Factory 전체 적용**
7. **Mock 함수 제거 플래그** (환경변수로 mock/real 전환)

### 🟢 Low Priority (추후 개선)
8. **WebSocket 실시간 업데이트** (polling → WebSocket)
9. **로깅 레벨 관리** (개발/프로덕션 분리)
10. **타입 정의 파일 통합** (중복 제거)

---

---

## 📋 전체 분석 파일 목록

### ✅ 완료 (25개)
**lib/api (Mock):**
1. `lib/api/settings.ts` - Mock (savePreferences, saveProfile, saveNotifications, updatePassword)
2. `lib/api/search.ts` - Mock (searchIndexes)
3. `lib/api/governance.ts` - Mock (submitIndexSpec, getProposals, submitVote)

**app/api (Supabase 연동):**
4. `app/api/user/profile/route.ts` - GET/PUT (Supabase)
5. `app/api/auth/sync-user/route.ts` - POST (Privy + Supabase)
6. `app/api/auth/logout/route.ts` - POST (쿠키 삭제)
7. `app/api/health/route.ts` - GET (Health check)

**hooks:**
8. `hooks/use-governance.ts` - Zustand wrapper
9. `hooks/use-wallet.ts` - Privy + Mock (거래 실행)
10. `hooks/use-market-data.ts` - React Query + Mock
11. `hooks/use-index-builder.ts` - LocalStorage 기반 Draft
12. `hooks/use-realtime.ts` - Mock WebSocket 시뮬레이션

**lib/store (Zustand):**
13. `lib/store/trading-store.ts`
14. `lib/store/governance-store.ts` - getProposals 호출

**lib/types:**
15. `lib/types/index-trading.ts`
16. `lib/types/governance.ts`
17. `lib/types/notifications.ts`

**lib/auth & middleware:**
18. `lib/auth/privy-jwt.ts` - JWT 검증 (jose 사용)
19. `lib/middleware/privy-auth.ts` - Auth middleware
20. `middleware.ts` - Next.js middleware (비활성화)

**lib/supabase:**
21. `lib/supabase/client.ts` - Supabase config

**lib/privy & pwa:**
22. `lib/privy/config.ts` - **실제 fetch** (`/api/auth/sync-user`)
23. `lib/pwa/sw-register.ts` - **실제 fetch** (`/api/push/subscribe` - 미구현)

**Service Worker:**
24. `public/sw.js` - **실제 fetch** (`/api/trades`, `/api/portfolio/sync`, `/api/prices/all` - 모두 미구현)

**components (샘플 - 중요 파일만):**
25. `components/governance/VoteDialog.tsx` - submitVote 호출
26. `components/launch/IndexBuilderWizard.tsx` - submitIndexSpec 호출
27. `components/governance/ProposalsSection.tsx` - useGovernance 훅
28. `components/layout/Header.tsx` - searchIndexes 호출
29. `components/settings/ProfileSection.tsx` - saveProfile 호출
30. `components/settings/PreferencesSection.tsx` - savePreferences 호출
31. `components/settings/NotificationsSection.tsx` - saveNotifications 호출
32. `components/settings/SecuritySection.tsx` - updatePassword, 2FA 활성화/비활성화 호출
33. `components/settings/DangerZone.tsx` - 모든 세션 무효화, 데이터 수집 중단 호출

---

---

## 🔍 전역 검색 결과 요약

### API 호출 패턴 발견
**실제 fetch 사용:**
- `lib/privy/config.ts` → `/api/auth/sync-user` ✅ 구현됨
- `lib/pwa/sw-register.ts` → `/api/push/subscribe` ❌ 미구현
- `public/sw.js` → `/api/trades`, `/api/portfolio/sync`, `/api/prices/all` ❌ 미구현

**Mock 함수 사용 (lib/api):**
- 8개 파일에서 import (VoteDialog, Header, ProfileSection, PreferencesSection, NotificationsSection, SecuritySection, IndexBuilderWizard, governance-store)

**Supabase 직접 사용:**
- 3개 route handlers (`app/api/user/profile`, `app/api/auth/sync-user`, `app/api/health`)

### 미구현 API 엔드포인트
1. `POST /api/push/subscribe` - Push 알림 구독
2. `POST /api/trades` - 오프라인 거래 동기화
3. `POST /api/portfolio/sync` - 포트폴리오 동기화
4. `GET /api/prices/all` - 가격 데이터 캐시

---

## 🔐 환경변수 전체 목록

### Privy 인증
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy 앱 ID (클라이언트)
- `PRIVY_APP_ID` - Privy 앱 ID (서버)
- `PRIVY_APP_SECRET` - Privy 앱 시크릿 (서버)
- `PRIVY_JWKS_ENDPOINT` - JWT 검증 엔드포인트 (선택)

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL (클라이언트)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon 키 (클라이언트)
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role 키 (서버 전용)
- `SUPABASE_URL` - Supabase URL (서버, health check용)
- `SUPABASE_ANON_KEY` - Anon 키 (서버, health check용)

### 기타
- `JWT_SECRET` - JWT 시크릿 (health check용)
- `EMAIL_FROM` - 이메일 발송 주소 (health check용)
- `ADMIN_EMAILS` - 관리자 이메일 (콤마 구분)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - Push 알림 VAPID 공개키
- `NEXT_PUBLIC_API_BASE_URL` - API Base URL (선택, 기본값: '/api')
- `NODE_ENV` - 환경 (development/production)

### ⚠️ 누락 환경변수
현재 코드에서 사용하지만 정의 안 된 것:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - PWA Push 알림용 (현재 빈 문자열)

---

## 📡 API 엔드포인트 전체 목록

### ✅ 구현됨 (app/api)
1. `GET /api/health` - Health check & 환경변수 확인
2. `GET /api/user/profile` - 사용자 프로필 조회 (Privy 인증 필요)
3. `PUT /api/user/profile` - 프로필 업데이트 (Privy 인증 필요)
4. `POST /api/auth/sync-user` - Privy → Supabase 사용자 동기화
5. `POST /api/auth/logout` - 로그아웃 (쿠키 삭제)

### ❌ 미구현 (필요)
6. `POST /api/push/subscribe` - Push 알림 구독
7. `POST /api/trades` - 오프라인 거래 동기화
8. `POST /api/portfolio/sync` - 포트폴리오 동기화
9. `GET /api/prices/all` - 전체 가격 데이터 (Service Worker 캐시용)
10. `GET /api/user/2fa` - 2FA 상태 조회
11. `POST /api/user/2fa/enable` - 2FA 활성화
12. `POST /api/user/2fa/disable` - 2FA 비활성화
13. `POST /api/user/sessions/revoke-all` - 모든 세션 무효화
14. `POST /api/user/data-collection/disable` - 데이터 수집 중단

### ⚠️ Mock 함수로만 존재 (실제 엔드포인트 없음)
15. `/api/search/indexes?q={query}` - 인덱스 검색 (lib/api/search.ts 주석에만 존재)
16. 설정 저장 API들 (lib/api/settings.ts - 모두 mock, 2FA 포함)
17. 거버넌스 API들 (lib/api/governance.ts - 모두 mock)

### 🔄 실시간 데이터 (미구현 - WebSocket 필요)
- 가격 업데이트
- 거래 실행 알림
- 트레이더 순위 변동
- Whale Alert

---

**마지막 업데이트:** 전역 검색 완료 + 환경변수/API 엔드포인트 목록 (Grep + 상세 분석 32개 파일)
