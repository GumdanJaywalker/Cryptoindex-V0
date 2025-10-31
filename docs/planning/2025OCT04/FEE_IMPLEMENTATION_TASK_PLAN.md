# Fee Structure Implementation - 작업 계획안

생성자: Claude Code
생성 일시: 2025년 10월 30일 오후 10:41
카테고리: 작업 계획
최종 편집자: Claude Code
최종 업데이트 시간: 2025년 10월 30일 오후 10:41

> **참고 문서**: `FEE_STRUCTURE_SPECIFICATION.md` (비즈니스 문서 슬라이드 26-28 기반)

---

## UX or 세부 컴포넌트 항목

### 1. Core Fee Infrastructure (신규 구축)

**`lib/constants/fees.ts`** (완전 재작성)
- VIP Tier 시스템 상수 정의 (VIP0-VIP4, 5단계)
- Layer별 수수료 구조 상수 (L1/L2/L3/VS/Partner/Graduated)
- Protocol/Creator/LP 수수료 비율
- Rebalancing/Management 수수료 설정
- Launcher 수수료 ($5 고정)

**`lib/utils/fees.ts`** (신규 생성)
- `getProtocolFee(vipTier)` - VIP별 프로토콜 수수료 계산
- `calculateTradingFee()` - 거래 수수료 전체 계산 (Protocol + Creator + LP)
- `calculateRebalancingFee()` - 리밸런싱 수수료 계산
- `calculateManagementFee()` - 관리 수수료 계산
- `getTotalFeeBreakdown()` - UI 표시용 상세 수수료 분해

### 2. Components Requiring Fee Updates (6개)

**거래 관련 컴포넌트 (4개)**:
1. `components/trading/quick-trade-button.tsx` - 빠른 거래 버튼 수수료 표시
2. `components/trading/trade-panel.tsx` - 거래 패널 수수료 계산/표시
3. `components/trading/TradingPanelSimple.tsx` - 간단 거래 패널 수수료
4. `components/trading/confirm-modal.tsx` - 거래 확인 모달 수수료 상세

**유동성/런칭 컴포넌트 (2개)**:
5. `components/trading/LiquidityModal.tsx` - 유동성 추가 수수료 표시
6. `app/launch/page.tsx` - 인덱스 런칭 수수료 ($5 Launcher Fee)

### 3. UI/UX 개선 사항

**수수료 표시 개선**:
- VIP Tier 뱃지 표시 (현재 tier, 할인율)
- 수수료 분해 표시 (Protocol + Creator + LP)
- 예상 수수료 계산기 (실시간 계산)
- Tooltip으로 수수료 상세 설명

**Layer별 차별화**:
- L1/L2: "No Creator Fee" 강조
- L3: "Creator Fee 0.4%, No LP Fee" 표시
- Partner: "Reduced Protocol Fee 0.5%" 강조
- Graduated: "Variable Fee Structure" 표시

---

## 레퍼런스

### 1. Pump.fun Fee Model (주요 벤치마크)
**채택 이유**:
- 밈코인 런칭 플랫폼으로서 가장 성공적인 수수료 모델
- 1.25% 총 수수료 구조 (0.3%-0.6% protocol + 0.3% creator)
- 월 50k-500k 런칭 볼륨 달성

**HyperIndex 차별점**:
- 더 낮은 프로토콜 수수료 (0.45% blended vs Pump.fun 0.3%-0.6%)
- 생태계 참여자에게 더 많은 수수료 분배 (Creator + LP에 0.4%씩)
- VIP tier로 active user 보상

### 2. Traditional ETF Management Fees
**참고 사항**:
- 전통적 ETF: 0.3%-1% 연간 관리 수수료
- DeFi 펀드: 0.5%-1.5% (전략 복잡도에 따라)
- 리밸런싱 비용: ETF는 0.03%-0.3% (관리 수수료에 포함)

**HyperIndex 적용**:
- L1 (안정): 0.7% 관리 수수료 (전통 ETF 수준)
- L2 (섹터): 0.85% (중간 변동성)
- L3/VS (밈): 1% (높은 유지보수)
- Partner: 0.5% (파트너 의존형)

### 3. DEX Trading Fees (Uniswap, Hyperliquid)
**참고 모델**:
- Uniswap v3: 0.05%-1% tier별 수수료
- Hyperliquid: Maker/Taker fee 구조

**HyperIndex 차별점**:
- Layer별 차등 수수료 (인덱스 특성 반영)
- Creator/LP 수수료 명시적 분리
- Partner routing 우대 (0.5% 고정)

### 4. DeFi Rebalancing Cost Benchmarks
**참고 데이터**:
- DeFi ETF(DTF): 0.2%-1% per rebalance (온체인 가스 비용)
- 전통 ETF: 리밸런싱 비용 불투명 (관리 수수료에 포함)

**HyperIndex 모델**:
- 0.1% per event (월간/격주) - 예측 가능
- 1.2%-3.9% 연간 환산 (빈도에 따라)
- Partner: 0.3% monthly (고빈도 리밸런싱 반영)

---

## 용이성의 근거

### 채택 방안: VIP Tier + Layer별 차등 수수료

#### 1. VIP Tier 시스템 (5단계)

**채택 근거**:
- **User Retention**: 거래량/추천 실적에 따라 0.6% → 0.3%로 수수료 절감
- **Viral Growth**: 초대 유저 10% 기본 할인 → 자연스러운 바이럴 효과
- **Revenue Predictability**: Blended fee 0.45% 기준 매출 예측 가능
- **Fair Competition**: Active user일수록 더 낮은 수수료 (거래소 모델)

**예상 효과**:
- VIP1-VIP2에 majority 유저 집중 (0.4%-0.5% fee)
- High volume trader 확보 (VIP4: 0.3% fee)
- 추천 프로그램 활성화 (10% discount incentive)

#### 2. Layer별 차등 수수료

**채택 근거**:
- **Risk-Reward Balance**: L1(안정) < L2(섹터) < L3(밈) 순으로 수수료 증가
- **Operational Cost Reflection**: 높은 변동성 = 높은 유지보수 = 높은 수수료
- **Partner Incentive**: Partner 수수료 최저(0.5%) → 기관 유치
- **Creator Motivation**: L3 Creator Fee 0.4% → 밈코인 런칭 인센티브

**Layer별 특성 반영**:
| Layer | 특성 | 수수료 전략 |
|-------|------|------------|
| L1 | 안정적, 장기 보유 | 낮은 mgmt(0.7%), 낮은 rebalancing(1.2% yearly) |
| L2 | 섹터별 변동성 | 중간 mgmt(0.85%), 중간 rebalancing(2.6% yearly) |
| L3 | 밈코인, 고변동 | 높은 mgmt(1%), Creator Fee(0.4%), No LP Fee |
| VS | 이벤트 드리븐 | 높은 mgmt(1%), 격주 rebalancing(2.6% yearly) |
| Partner | 기관/파트너 | 최저 mgmt(0.5%), 높은 rebalancing(3.9% yearly) |

#### 3. 수수료 분해 표시 (Protocol + Creator + LP)

**채택 근거**:
- **Transparency**: 각 수수료 항목 명확히 표시 → 유저 신뢰 확보
- **Ecosystem Value**: Creator/LP가 받는 수수료 강조 → 생태계 기여 가시화
- **Competitive Edge**: "No Creator Fee" (L1/L2) 강조 → 경쟁력 홍보

**표시 예시**:
```
Total Fee: 1.00%
├─ Protocol Fee: 0.40% (VIP2 discount applied)
├─ Creator Fee: 0.00% (L1 Index)
└─ LP Fee: 0.40%
```

### 비채택 대안 #1: 단일 플랫 수수료

**검토 내용**:
- 모든 거래에 동일한 수수료 적용 (예: 1% 고정)
- 구현 단순, 사용자 혼란 최소

**비채택 이유**:
- ❌ **Unfair for Active Users**: 대량 거래자가 불리 → 이탈 가능성
- ❌ **No Differentiation**: Layer별 특성 미반영 → 밈코인/안정 인덱스 동일 취급
- ❌ **Low Retention**: 거래 인센티브 없음 → 충성 유저 확보 어려움
- ❌ **Partner Disincentive**: 기관 파트너 유치 불리 (높은 수수료)

**결론**: Layer별, VIP별 차등화가 생태계 건강성과 성장에 더 유리

### 비채택 대안 #2: Maker/Taker Fee 구조

**검토 내용**:
- Maker(주문 생성): 낮은 수수료 또는 rebate
- Taker(주문 체결): 높은 수수료
- 전통적인 거래소 모델 (Hyperliquid, Binance)

**비채택 이유**:
- ❌ **User Confusion**: 인덱스 거래는 단순해야 함 (일반 유저 대상)
- ❌ **Complexity**: Orderbook + AMM 혼재 환경에서 구현 복잡
- ❌ **Mismatch**: 인덱스는 장기 보유 자산, Maker/Taker는 단타 트레이더용
- ❌ **Creator/LP Fee Conflict**: Creator/LP에게 어떻게 분배할지 불명확

**결론**: 인덱스 거래 특성상 단순한 all-in fee가 더 적합

### 비채택 대안 #3: 시간 기반 Holding Incentive

**검토 내용**:
- 보유 기간에 따라 수수료 할인 (예: 1개월+ 보유 시 50% 할인)
- 장기 투자 유도

**비채택 이유**:
- ❌ **Implementation Complexity**: 온체인에서 보유 기간 추적 어려움
- ❌ **Tax Complexity**: 세금 계산 복잡도 증가 (한국/미국 세법)
- ❌ **Liquidity Issue**: 단기 거래 억제 → 유동성 감소 가능
- ❌ **Revenue Unpredictability**: 매출 예측 어려움

**부분 채택**:
- VIP tier 시스템으로 간접 반영 (거래량 많은 유저 = 활성 유저)
- Management Fee로 장기 보유 보상 (AUM 기반, 연간 정산)

---

## 타 페이지 및 컴포넌트와의 관계성

### 1. Trading Flow와의 통합

**Trading Panel → Confirm Modal → Transaction**
```
1. User selects index & amount
   ↓
2. TradingPanelSimple.tsx
   - calculateTradingFee() 호출
   - VIP tier 확인 (user context)
   - Layer type 확인 (index metadata)
   - 예상 수수료 실시간 표시
   ↓
3. ConfirmModal.tsx
   - getTotalFeeBreakdown() 호출
   - Protocol/Creator/LP 분해 표시
   - "Estimated Fee: $XX.XX" 표시
   ↓
4. Transaction Execution
   - 실제 fee deduction
   - Fee distribution (Protocol/Creator/LP)
```

**수정 필요 컴포넌트**:
- `trade-panel.tsx`: fee calculator 통합
- `TradingPanelSimple.tsx`: VIP tier 표시 추가
- `confirm-modal.tsx`: fee breakdown UI 추가
- `quick-trade-button.tsx`: instant fee preview

### 2. Launch Page와의 통합

**Launch Flow**:
```
1. app/launch/page.tsx
   - Index creation form
   - Layer selection (L1/L2/L3/VS/Partner)
   ↓
2. Fee Preview Section (신규 추가)
   - Launcher Fee: $5 (고정)
   - Expected Trading Fee: based on layer
   - Expected Rebalancing Fee: based on frequency
   - Expected Management Fee: based on AUM projection
   ↓
3. Index Creation Transaction
   - $5 launcher fee payment
   - Index metadata with fee params
```

**새로 추가할 섹션**:
- "Fee Structure Preview" card
- Layer 선택 시 해당 layer 수수료 표시
- Calculator: AUM 입력 → 예상 수수료 계산

### 3. Portfolio/Dashboard와의 통합

**수수료 누적 표시**:
```
Portfolio Page:
├─ Total Fees Paid (lifetime)
│  ├─ Trading Fees: $XXX
│  ├─ Rebalancing Fees: $XX
│  └─ Management Fees: $XX
│
└─ Current VIP Tier: VIP2 (0.4% fee)
   └─ Next Tier: VIP3 (0.35% fee)
       └─ Progress: $10k / $50k volume
```

**신규 생성 필요**:
- `components/portfolio/FeesSummary.tsx`
- `components/portfolio/VIPTierProgress.tsx`

### 4. Notifications/Alerts와의 통합

**수수료 관련 알림**:
- "VIP Tier Upgrade" notification (tier 상승 시)
- "High Fee Alert" (예상 수수료가 평균보다 높을 때)
- "Fee Discount Applied" (초대 유저 할인)
- "Rebalancing Fee Charged" (리밸런싱 발생 시)

**기존 notification system 확장**:
- `lib/types/notifications.ts`에 fee-related type 추가
- Notification store에 fee alerts 통합

### 5. Settings Page와의 통합

**Fee Preferences**:
```
Settings > Trading Preferences:
├─ Show Fee Breakdown: [Toggle] ✓
├─ Fee Alert Threshold: [$100]
└─ VIP Tier Display: [Always Show / On Hover]
```

**연관 파일**:
- `app/settings/page.tsx`
- `components/settings/TradingPreferences.tsx`

### 6. Global State Management

**Fee Context 필요**:
```typescript
// lib/contexts/FeeContext.tsx
export const FeeContext = createContext({
  vipTier: VIPTier.VIP0,
  totalFeesPaid: 0,
  currentMonthVolume: 0,
  calculateFee: (amount, layer) => {...},
  getFeeBreakdown: (amount, layer) => {...},
})
```

**상태 관리 파일**:
- `lib/store/fee-store.ts` (Zustand store)
- User의 VIP tier, 거래량, 누적 수수료 관리

---

## 상세 계획 - 실행 절차

### Phase 1: Core Infrastructure Setup (우선순위 최상)

**1.1 Constants Definition** (30분)
- [ ] `lib/constants/fees.ts` 생성
- [ ] VIP_PROTOCOL_FEES 상수 정의 (VIP0-VIP4)
- [ ] LAYER_FEES 객체 작성 (L1/L2/L3/VS/Partner/Graduated)
- [ ] BLENDED_PROTOCOL_FEE, PARTNER_ROUTING_FEE 등 전역 상수
- [ ] LAUNCHER_FEE_USD, INVITED_USER_DISCOUNT 정의

**1.2 Fee Calculation Functions** (1시간)
- [ ] `lib/utils/fees.ts` 생성
- [ ] `getProtocolFee(vipTier)` 구현
  - VIP tier enum 받아서 해당 수수료율 반환
- [ ] `calculateTradingFee(amount, vipTier, layer, indexType?)` 구현
  - Protocol + Creator + LP 계산
  - Return: `{ protocolFee, creatorFee, lpFee, totalFee, breakdown }`
- [ ] `calculateRebalancingFee(aum, layer, frequency?)` 구현
- [ ] `calculateManagementFee(aum, layer)` 구현
- [ ] `getTotalFeeBreakdown(...)` UI용 상세 분해 함수

**1.3 TypeScript Types** (15분)
- [ ] `lib/types/fees.ts` 생성
- [ ] `VIPTier` enum 정의
- [ ] `FeeBreakdown` interface
- [ ] `DetailedFeeBreakdown` interface
- [ ] `LayerType` type

**검증 방법**:
- Unit test로 예시 계산 검증
- VIP0 유저 $1000 거래 → L1: 0.6% + 0.4% = 1%
- VIP4 유저 $1000 거래 → L1: 0.3% + 0.4% = 0.7%

### Phase 2: Trading Components Update (우선순위 높음)

**2.1 TradingPanelSimple.tsx Update** (45분)
- [ ] `calculateTradingFee()` import
- [ ] User VIP tier 가져오기 (context/store)
- [ ] Index layer type 가져오기 (index metadata)
- [ ] 입력 금액 변경 시 실시간 수수료 계산
- [ ] 수수료 표시 UI 추가 (Total Fee: X.XX%)
- [ ] VIP tier 뱃지 추가 ("VIP2: -40% fee")

**2.2 ConfirmModal.tsx Update** (1시간)
- [ ] `getTotalFeeBreakdown()` import
- [ ] Fee breakdown section 추가
  ```
  Fee Breakdown:
  Protocol Fee: 0.40% ($4.00)
  Creator Fee: 0.00% (L1 Index)
  LP Fee: 0.40% ($4.00)
  ─────────────────────
  Total: 0.80% ($8.00)
  ```
- [ ] Layer별 특수 표시 추가
  - L1/L2: "✓ No Creator Fee"
  - L3: "Creator receives 0.4%"
  - Partner: "Reduced Protocol Fee"
- [ ] Tooltip으로 각 수수료 항목 설명

**2.3 trade-panel.tsx Update** (30분)
- [ ] Fee calculator 통합 (TradingPanelSimple과 유사)
- [ ] Advanced view에서 fee breakdown 표시
- [ ] "Estimated Fee" 섹션 추가

**2.4 quick-trade-button.tsx Update** (20분)
- [ ] Hover 시 예상 수수료 미리보기
- [ ] Tooltip: "Est. Fee: 0.80% ($8.00)"
- [ ] Quick buy/sell 시 fee 자동 계산

**검증 방법**:
- Manual testing: 각 Layer (L1/L2/L3) 거래 시뮬레이션
- VIP tier 변경 시 수수료 변화 확인
- UI에 올바른 수수료 표시 확인

### Phase 3: Launch Page Update (우선순위 중)

**3.1 Launch Page Fee Display** (1시간)
- [ ] `app/launch/page.tsx`에 "Fee Structure" 섹션 추가
- [ ] Launcher Fee 표시: "$5 one-time fee"
- [ ] Layer 선택 시 해당 layer 수수료 표시
  ```
  Selected Layer: L1
  ├─ Trading Fee: 0.7%-1% (VIP tier dependent)
  ├─ Rebalancing: 0.1% monthly (~1.2% yearly)
  └─ Management: 0.7% yearly
  ```
- [ ] AUM 예상 입력 → 예상 연간 수수료 계산기
- [ ] "Compare Layers" 버튼 (layer별 수수료 비교 모달)

**3.2 Fee Comparison Modal** (30분)
- [ ] `components/launch/FeeComparisonModal.tsx` 생성
- [ ] Layer별 수수료 테이블 표시
- [ ] "Best for your strategy" 추천 표시
  - 안정형: L1 추천
  - 밈코인: L3 추천
  - 파트너: Partner 추천

**검증 방법**:
- 각 Layer 선택 시 올바른 수수료 표시 확인
- AUM 계산기 정확도 검증

### Phase 4: Liquidity Modal Update (우선순위 중)

**4.1 LiquidityModal.tsx Update** (30분)
- [ ] LP fee 명시적 표시 (0.4% for L1/L2, 0% for L3)
- [ ] "You will earn X% LP Fee" 강조
- [ ] 유동성 제공 시 예상 수익 계산기
- [ ] Fee distribution 설명 추가

**검증 방법**:
- LP fee 표시 정확도 확인
- L3 (No LP Fee) 경우 올바른 메시지 표시

### Phase 5: State Management & Context (우선순위 중)

**5.1 Fee Store Creation** (45분)
- [ ] `lib/store/fee-store.ts` 생성 (Zustand)
- [ ] State:
  ```typescript
  {
    vipTier: VIPTier
    totalFeesPaid: number
    currentMonthVolume: number
    feeHistory: FeeRecord[]
  }
  ```
- [ ] Actions:
  - `updateVIPTier()`
  - `recordFee()`
  - `calculateProgress()`

**5.2 Fee Context** (30분)
- [ ] `lib/contexts/FeeContext.tsx` 생성
- [ ] User VIP tier provider
- [ ] Fee calculation wrapper functions

**5.3 User Data Integration** (1시간)
- [ ] User의 거래량 tracking (backend 연동 필요)
- [ ] VIP tier 자동 업그레이드 로직
- [ ] Referral discount 적용 로직

**검증 방법**:
- VIP tier 변경 시 전체 UI 반영 확인
- Fee store 상태 변화 로깅

### Phase 6: UI/UX Enhancements (우선순위 낮음)

**6.1 VIP Tier Badge Component** (30분)
- [ ] `components/ui/VIPTierBadge.tsx` 생성
- [ ] Current tier + discount rate 표시
- [ ] Progress bar to next tier
- [ ] Hover시 tier benefits 표시

**6.2 Fee History Dashboard** (1시간)
- [ ] `components/portfolio/FeesSummary.tsx` 생성
- [ ] 월별/연도별 수수료 차트
- [ ] Trading/Rebalancing/Management 수수료 분류
- [ ] CSV export 기능

**6.3 Fee Alerts System** (45분)
- [ ] High fee alert (설정한 threshold 초과 시)
- [ ] VIP tier upgrade notification
- [ ] Fee discount applied notification
- [ ] `lib/types/notifications.ts`에 fee alert types 추가

**검증 방법**:
- Visual regression testing
- 다양한 tier에서 UI 확인

### Phase 7: Documentation & Testing (우선순위 높음)

**7.1 Developer Documentation** (30분)
- [ ] `docs/FEE_IMPLEMENTATION_GUIDE.md` 작성
- [ ] Fee calculation 예시 코드
- [ ] Component integration 가이드
- [ ] Testing checklist

**7.2 User Documentation** (30분)
- [ ] Help Center: "Understanding Fees" 페이지
- [ ] VIP Tier 설명 페이지
- [ ] Layer별 수수료 비교 페이지
- [ ] FAQ 작성

**7.3 Unit Tests** (2시간)
- [ ] `fees.test.ts` 생성
- [ ] All fee calculation functions 테스트
- [ ] Edge cases 테스트 (VIP4, Graduated indices)
- [ ] 각 Layer별 계산 정확도 검증

**7.4 Integration Tests** (1.5시간)
- [ ] Trading flow end-to-end 테스트
- [ ] VIP tier upgrade flow 테스트
- [ ] Fee breakdown UI 테스트

**검증 방법**:
- 테스트 커버리지 90% 이상
- Manual QA checklist 통과

### Phase 8: Cleanup & Migration (우선순위 최상)

**8.1 Remove Old Fee Structure** (30분)
- [ ] HIIN/HIDE two-token 관련 코드 제거
- [ ] 0.3% flat fee 로직 제거
- [ ] Deprecated constants/functions 정리

**8.2 Migration Script** (1시간)
- [ ] 기존 유저 VIP tier 초기화 (VIP0 또는 거래량 기반)
- [ ] Historical fee data migration
- [ ] Fee settings migration

**8.3 Final Verification** (1시간)
- [ ] 모든 6개 컴포넌트 동작 확인
- [ ] End-to-end trading flow 테스트
- [ ] Fee calculation 정확도 최종 검증
- [ ] Performance testing (fee calculation overhead)

---

## 예상 작업 시간

| Phase | 작업 내용 | 예상 시간 |
|-------|---------|----------|
| Phase 1 | Core Infrastructure | 1시간 45분 |
| Phase 2 | Trading Components | 2시간 55분 |
| Phase 3 | Launch Page | 1시간 30분 |
| Phase 4 | Liquidity Modal | 30분 |
| Phase 5 | State Management | 2시간 15분 |
| Phase 6 | UI/UX Enhancements | 2시간 15분 |
| Phase 7 | Documentation & Testing | 4시간 |
| Phase 8 | Cleanup & Migration | 2시간 30분 |
| **Total** | | **17시간 40분** |

**Critical Path**: Phase 1 → Phase 2 → Phase 8 (우선 실행)

---

## Success Criteria (완료 기준)

✅ **Core Functionality**:
- [ ] All 6 components 정상 동작
- [ ] VIP tier별 올바른 수수료 계산
- [ ] Layer별 차등 수수료 적용
- [ ] Fee breakdown 정확한 표시

✅ **User Experience**:
- [ ] 모든 거래 flow에서 수수료 명확히 표시
- [ ] VIP tier 진행 상황 추적 가능
- [ ] Fee history 조회 가능

✅ **Testing**:
- [ ] Unit test 90% 커버리지
- [ ] Integration test 통과
- [ ] Manual QA checklist 100% 완료

✅ **Documentation**:
- [ ] Developer guide 작성 완료
- [ ] User help center 업데이트
- [ ] Code comments 충분

---

**Next Steps**:
1. Phase 1 (Core Infrastructure) 먼저 시작
2. Phase 2 (Trading Components) 순차 진행
3. 각 phase 완료 후 검증
4. 최종적으로 Phase 8 (Cleanup) 실행

**Dependencies**:
- Backend: User 거래량 tracking API 필요
- Backend: VIP tier 저장/조회 API 필요
- Design: VIP tier badge 디자인 필요
- Legal: 수수료 구조 법적 검토 (선택)
