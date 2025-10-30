# Frontend Security Attack Scenarios & Analysis

> **작성일**: 2025-10-28
> **작성자**: [작성자명]
> **검토자**: 서준
> **프로젝트**: HyperIndex Phase 0

---

## UX or 세부 컴포넌트 항목

### 보안 검사 대상 컴포넌트

**1. 사용자 입력 컴포넌트**
- Trading 페이지의 거래 금액 입력 필드
- Launch 페이지의 인덱스 생성 폼 (이름, 설명, 구성 요소 등)
- Settings 페이지의 사용자 설정 입력
- Governance 페이지의 검색 입력 필드
- Search 기능 (Discover 페이지 검색바)

**2. 데이터 표시 컴포넌트**
- 인덱스 카드에 표시되는 사용자 제공 데이터 (이름, 설명)
- 거버넌스 제안 내용 표시 (읽기 전용 - Mock 데이터)
- 사용자 프로필 정보 표시
- 알림 메시지 표시

**3. URL/라우팅 컴포넌트**
- 동적 라우트 파라미터 (`/governance/[id]`, `/leaderboard/[id]`)
- Query string 처리 부분
- Deep link 처리

**4. API 통신 컴포넌트**
- Mock API → Real Backend 전환 시 검증 로직
- WebSocket 연결 (실시간 가격 업데이트)
- File upload (프로필 이미지 등)

---

## 레퍼런스

### 업계 표준 사례

**1. Hyperliquid (app.hyperliquid.xyz)**

**조사일**: 2025-10-28

**프레임워크**: Vanilla JS (React 미사용), TradingView Charting Library

**보안 헤더**:
- Content-Security-Policy: Meta 태그에 없음
- 주의: CSP 없이 운영 중 → XSS 공격에 취약할 수 있음

**localStorage 사용**:
- `privy:*` - Privy 인증 토큰 및 연결 정보
- `wagmi.store` - 지갑 연결 상태 (chainId: 42161 - Arbitrum)
- `tradingview.*` - 차트 설정 (레이아웃, 테마, 속성)
- `hyperliquid.*` - UI 레이아웃, 코인 설정
- **민감 정보**: 비밀번호/개인키 등 저장하지 않음 ✅

**사용자 입력 검증**:
- 입력 필드: 2개 (거래 금액 입력)
- `pattern` 속성: 없음
- `maxLength` 속성: unlimited
- 클라이언트 검증: 약함 (백엔드 검증에 의존하는 것으로 추정)

**XSS 방어**:
- `dangerouslySetInnerHTML` 사용: 없음 ✅
- 사용자 입력 표시: innerHTML 직접 사용 가능성 (React 미사용)

**평가**:
- 강점: Privy 인증으로 민감 정보 관리, localStorage에 키/비번 저장 안 함
- 약점: CSP 없음, 클라이언트 입력 검증 부족
- 시사점: 백엔드 검증에 의존하는 구조, 프론트엔드는 UX 위주

---

**2. Uniswap (app.uniswap.org)**

**조사일**: 2025-10-28

**프레임워크**: React

**보안 헤더**:
- Content-Security-Policy: **매우 상세한 CSP 정책 존재** ✅
  - `default-src 'self'`
  - `script-src 'self' 'wasm-unsafe-eval'`
  - `style-src 'self' 'unsafe-inline'` (Google Fonts 허용)
  - `img-src * blob: data:` (이미지는 모든 소스 허용)
  - `frame-src` - Moonpay, WalletConnect 등 화이트리스트
  - `connect-src` - 50+ 도메인 화이트리스트 (Alchemy, Infura, Coinbase, RPC 노드 등)
  - `form-action 'none'` - Form 제출 차단 (SPA이므로)
- **업계 최고 수준의 CSP 정책**

**localStorage 사용**:
- `@appkit/*` - WalletConnect AppKit 상태
- `wagmi.store` - 지갑 연결
- `statsig.*` - Feature flag 및 A/B 테스트
- `REACT_QUERY_OFFLINE_CACHE` - API 응답 캐시
- `redux/persist:interface` - UI 상태 저장

**사용자 입력 검증**:
- 입력 필드: 1개 (토큰 금액)
- `type="text"` + `inputMode="decimal"` ✅ (숫자 키패드 유도)
- `autoComplete="off"` ✅ (자동완성 방지)
- `placeholder="0"` (기본값 표시)
- 클라이언트 검증: inputMode로 숫자 입력 유도

**평가**:
- 강점: CSP 정책이 매우 엄격, inputMode로 UX 개선하면서 입력 제한
- 약점: `pattern`, `maxLength` 속성은 없음 (JS로 검증 추정)
- 시사점: 보안과 UX를 균형있게 처리, CSP는 필수

---

**3. Aave (app.aave.com)**

**조사일**: 2025-10-28

**프레임워크**: React + Next.js, Material-UI (MUI)

**보안 헤더**:
- Content-Security-Policy: Meta 태그에 없음
- 주의: Uniswap과 달리 CSP 미적용

**localStorage 사용**:
- `wagmi.store` - 지갑 연결 상태 (chainId: 1 - Ethereum Mainnet)
- `bannerVersion_1` - 배너 표시 버전
- `warningBarOpen_1` - 경고 바 상태
- **최소한의 정보만 저장** ✅

**사용자 입력 검증**:
- 입력 필드: 5개
  - 1개: 네트워크 셀렉트 (MUI Select)
  - 1개: 검색 입력 (`placeholder="Search asset name, symbol, or address"`)
  - 3개: 체크박스 (MUI Switch)
- `pattern`, `maxLength`, `inputMode` 속성: 모두 없음
- MUI 컴포넌트 사용으로 기본 검증 제공

**금액 입력 검증** (추정):
- 거래 페이지 진입 시 추가 입력 필드 생성 가능
- MUI TextField 사용 예상

**평가**:
- 강점: Next.js SSR로 초기 로딩 보안, MUI로 일관된 입력 처리
- 약점: CSP 없음, 검색 입력에 XSS 취약 가능성
- 시사점: UI 라이브러리로 검증 위임, localStorage 사용 최소화

---

### 3개 사이트 비교 분석

| 항목 | Hyperliquid | Uniswap | Aave |
|------|------------|---------|------|
| **CSP 정책** | ❌ 없음 | ✅ 매우 엄격 | ❌ 없음 |
| **프레임워크** | Vanilla JS | React | React + Next.js |
| **입력 검증** | 약함 | inputMode 사용 | MUI 의존 |
| **localStorage** | 다수 (설정 중심) | 다수 (캐시 포함) | 최소 |
| **민감 정보** | ✅ 안전 | ✅ 안전 | ✅ 안전 |
| **지갑 연동** | Privy + wagmi | AppKit + wagmi | wagmi |
| **보안 수준** | 중 | 상 | 중 |

**HyperIndex에 대한 시사점**:
1. **CSP 정책 필수**: Uniswap 수준의 엄격한 CSP 적용 권장
2. **inputMode 활용**: 숫자 입력은 `inputMode="decimal"` 사용
3. **localStorage 최소화**: Aave처럼 UI 설정만 저장
4. **Privy 활용**: Hyperliquid처럼 인증은 Privy에 위임 (이미 적용 중 ✅)
5. **백엔드 검증 필수**: 클라이언트 검증은 UX 개선용, 실제 검증은 백엔드

---

### 보안 표준 문서

**OWASP Top 10 (2021)**
- A03:2021 – Injection (SQL, XSS, Command Injection)
- A07:2021 – Identification and Authentication Failures
- A08:2021 – Software and Data Integrity Failures
- 참고: https://owasp.org/Top10/

**React Security Best Practices**
- DOMPurify 사용으로 XSS 방어
- dangerouslySetInnerHTML 최소화
- 참고: https://react.dev/learn/security

**Next.js Security Guidelines**
- Content Security Policy 설정
- Server-Side Validation
- 참고: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy

---

## 용이성의 근거

### 채택 방안: Phase 0 최소 보안 - 기본 input sanitization + 백엔드 검증

**장점:**
1. **비용 제로** (외부 라이브러리 불필요, 간단한 유틸 함수만)
2. **구현 빠름** (2-3시간이면 충분)
3. **백엔드 검증에 집중** (실제 보안은 서버에서 처리)
4. **Phase 0 베타에 적합** (소규모 초대 유저, 실제 자산 없음)
5. 투자 유치 후 전문 보안 감사로 본격 강화 가능

**단점:**
1. XSS 공격 방어 약함 (CSP 없음)
2. 업계 표준보다 낮은 수준

**비용/난이도:**
- 구현 시간: 2-3시간 (기본 sanitization만)
- 비용: **0원**
- 성능 영향: 없음
- 유지보수 부담: 매우 낮음

**Phase별 보안 전략:**
- **Phase 0 (현재)**: 최소 보안 → 베타 테스트 집중
- **Phase 1 (투자 유치 후)**: 전문 보안 감사 + Uniswap 수준 강화
- **Phase 2 (TGE 후)**: 지속적 모니터링 + 버그바운티

---

### 비채택 대안 #1: Uniswap 스타일 - 복잡한 CSP + 전면 보안 강화

**장점:**
1. 업계 최고 수준 보안
2. 사용자 신뢰도 높음

**단점 (채택 방안보다 열등한 이유):**
1. **구현 비용 과다** (6일 = 48시간 소요)
2. **CSP 유지보수 복잡** (50+ 도메인 화이트리스트 관리)
3. **Phase 0 베타에 과도함** (소규모 초대 유저만 사용)
4. **개발 리소스 낭비** (핵심 기능 개발에 집중해야 함)

**비교 결론:**
투자 유치 전에는 과도한 투자. Phase 0는 제품 검증이 우선이므로 최소 보안으로 시작하고, 투자 후 전문 업체에 맡기는 게 효율적.

---

### 비채택 대안 #2: 전문 보안 업체 외주 (현재)

**장점:**
1. 전문가 수준 보안
2. 보안 인증서 획득 가능

**단점 (채택 방안보다 열등한 이유):**
1. **비용 과다** (보안 감사 최소 500만원~수천만원)
2. **현재 예산 없음** (베타 단계, 투자 전)
3. **시기상조** (제품 검증도 안 된 상태)

**비교 결론:**
투자 유치 후 시리즈 A 단계에서 진행. Phase 0에서는 불필요한 지출.

---

## 타 페이지 및 컴포넌트와의 관계성

### 영향받는 컴포넌트 맵

```
CSP 헤더 (next.config.js)
    ↓
보안 유틸 레이어 (lib/utils/security.ts - 신규)
    ↓
lib/api/* (Mock API Layer)
    ↓
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Trading    │  Portfolio  │  Discover   │  Launch     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 페이지별 영향도

**1. Trading 페이지**
- 영향: 거래 금액 입력 (`TradePanel.tsx`)
- 변경: `<input inputMode="decimal">` 추가, 입력값 sanitization
- 작업 시간: 1시간

**2. Portfolio 페이지**
- 영향: 없음 (읽기 전용 페이지)
- 변경: 없음
- 작업 시간: 0시간

**3. Discover 페이지**
- 영향: 검색 입력 필드 (`layer-tabs.tsx` 추정)
- 변경: XSS 방어용 입력 sanitization
- 작업 시간: 30분

**4. Launch 페이지**
- 영향: 인덱스 생성 폼 전체 (이름, 설명, 구성 요소)
- 변경: 모든 입력 필드 sanitization, `maxLength` 제한 추가
- 작업 시간: 2시간 (가장 복잡)

**5. Settings 페이지**
- 영향: Time Format 선택만 (통화 선택은 제거 예정)
- 변경: 없음 (드롭다운만 있음)
- 작업 시간: 0시간

**6. Governance 페이지**
- 영향: 검색 입력 필드 (`ProposalsSection.tsx`)
- 변경: 검색 쿼리 sanitization
- 작업 시간: 30분

### 공통 컴포넌트 영향

**lib/utils/security.ts (신규)** - Phase 0 최소 보안
- `sanitizeInput(value: string)` - 기본 HTML 태그 제거 (정규식)
- `validateNumber(value: string)` - 숫자만 허용
- 작업 시간: **1시간**

**페이지별 적용**
- Trading: `inputMode="decimal"` 추가만
- Launch: 입력 필드에 `sanitizeInput()` 호출
- Discover/Governance: 검색에 `sanitizeInput()` 호출
- 작업 시간: **1시간**

**백엔드 검증 (중요)**
- Phase 1 백엔드 구축 시 서버 측 검증 필수
- 프론트엔드는 UX 개선용으로만 사용

**총 예상 시간: 2-3시간** (기존 9.5시간 → 3시간으로 단축)

---

## 상세 계획 - 실행 절차 (Phase 0 최소 보안)

### Step 1: 기본 보안 유틸 작성 (1시간)

**파일:** `lib/utils/security.ts`

```typescript
// 기본 HTML 태그 제거 (XSS 방어)
export function sanitizeInput(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

// 숫자만 허용
export function validateNumber(value: string): boolean {
  return /^\d*\.?\d*$/.test(value)
}
```

---

### Step 2: 입력 필드에 적용 (1시간)

**Trading 페이지** (`components/trading/trade-panel.tsx`)
- `<input inputMode="decimal">` 추가
- 입력값에 `validateNumber()` 적용

**Launch 페이지** (`app/launch/page.tsx`)
- 모든 텍스트 입력에 `sanitizeInput()` 호출
- Submit 전 검증

**Discover/Governance 페이지**
- 검색 입력에 `sanitizeInput()` 적용

---

### Step 3: 간단한 테스트 (30분)

**XSS 테스트:**
```bash
# Launch 페이지에서 입력
인덱스 이름: <script>alert('XSS')</script>

# 예상 결과: scriptalert('XSS')/script (태그 제거됨)
```

**숫자 입력 테스트:**
```bash
# Trading 페이지 금액 입력
입력: abc123

# 예상 결과: 123만 표시
```

---

### Step 4: 서준 코드 리뷰 (30분)

- [ ] `lib/utils/security.ts` 리뷰
- [ ] 적용된 컴포넌트 확인
- [ ] 피드백 반영

---

## 예상 총 작업 시간

| 작업 | 시간 |
|------|-----|
| 보안 유틸 작성 | 1시간 |
| 페이지별 적용 | 1시간 |
| 테스트 | 30분 |
| 코드 리뷰 | 30분 |
| **총합** | **3시간** |

**비용:** 0원
**Phase 1 전문 보안 감사 예산:** 투자 유치 후 별도 책정

---

## 성공 지표 (Phase 0 최소 보안)

**정량적 지표:**
- [ ] `sanitizeInput()` 함수 작동 확인 (HTML 태그 제거)
- [ ] `validateNumber()` 함수 작동 확인 (숫자만 허용)
- [ ] 입력 필드 4개 적용 (Trading, Launch, Discover, Governance)
- [ ] 구현 시간: 3시간 이내
- [ ] 비용: 0원

**정성적 지표:**
- [ ] 서준 코드 리뷰 통과
- [ ] 기본 XSS 방어 확인 (`<script>` 태그 입력 시 제거됨)

**검증 방법:**
1. Launch 페이지에서 `<script>alert('test')</script>` 입력 → 태그 제거 확인
2. Trading 페이지에서 `abc123` 입력 → 숫자만 표시 확인

**Phase 1 보안 강화 계획 (투자 유치 후):**
- 전문 보안 감사 업체 선정 (예산: 500만원~)
- Uniswap 수준 CSP 구현
- 버그바운티 프로그램 론칭

---

*문서 작성 완료: 2025-10-28*
*3개 사이트 실제 조사: Hyperliquid, Uniswap, Aave*
*Phase 0 예상 작업 시간: 3시간 (비용 0원)*
*Phase 1 보안 강화: 투자 유치 후 전문 업체 의뢰*
