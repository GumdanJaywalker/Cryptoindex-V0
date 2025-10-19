
# 🔍 TGE 구현 전역 검사 결과

---

## ❌ 누락된 컴포넌트/페이지 (개발 필요)

### 1) Docs 페이지
- `/app/docs` 폴더 자체가 없음
- Footer에 **Docs** 링크는 있지만 `#`으로만 연결됨

### 2) Tokenomics 관련 페이지/모달
- ❌ `$HIIN` / `$HIDE` 토큰 정보 페이지
- ❌ 에어드랍 **Claim** 모달/페이지
- ❌ **Staking UI** (현재 `VotingPowerManager`만 있고 실제 스테이킹 UI 없음)
- ❌ **veHIDE 부스트** 표시 UI
- ❌ **Rewards 대시보드** (포인트 → 토큰 변환 표시)

### 3) Layer-3 Graduation 관련
- ❌ **Bonding Curve** 상세 모달 (현재 `GraduationProgress`는 진행바만 표시)
- ❌ **Funding Round** 참여 모달
- ❌ **LP Round** 참여 모달 (`LiquidityModal`은 있으나 Layer-2용, Round 개념 없음)
- ❌ **Circuit Breaker** 상태 표시
- ❌ **NAV vs Price** 갭 표시

### 4) 리워드/인센티브 시스템
- ❌ **Protocol Fee Revenue Share** 표시 (NAV 참여자용)
- ❌ **INDEX Builder Program** 대시보드
- ❌ **DEX Catalyst Program** 대시보드
- ❌ **Contribution Points** 추적 UI
- ❌ **Graduation Bonus** 표시

---

## 🔧 HYPE → `$HIIN` / `$HIDE` 변경 필요 위치

### 1) Currency Type 시스템 수정
**파일:** `lib/types/currency.ts`

```ts
// 현재
export type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC'

// 수정 필요
export type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | 'HIIN' | 'HIDE'
```

### 2) 수수료/가스 지불 단위

#### Index 관련 수수료 → `$HIIN`으로 변경
- `components/launch/ConfirmLaunchModal.tsx` (L90, L132, L137)
- `app/launch/page.tsx` (L491, L545, L626, L630, L633, L634)
- `components/trading/IndexInfoBar.tsx` (L352-353)

#### DEX 거래 수수료 → `$HIDE`로 변경
- `components/trading/TradingPanel.tsx`
- `app/launch/page.tsx` (L491, L545, L626, L630, L633, L634)
- `components/trading/IndexInfoBar.tsx` (L352-353)
- `components/trading/confirm-modal.tsx`
- `lib/utils/currency.ts` (`formatFee`, `formatGas` 함수)

#### LP 수수료 → 현재 USD로 표시, `$HIDE` 옵션 추가 필요
- `components/portfolio/LiquidityPositions.tsx` (L53, L57, L61, L65)
- `components/trading/LiquidityModal.tsx`

---

## 💰 리워드 표시 `$HIDE`로 변경 필요

### Portfolio 페이지
- `components/portfolio/VotingPowerManager.tsx` (L177, L354) — 현재 `$USD`
- `components/portfolio/CreatorEarnings.tsx` — Creator Fee는 **수수료의 80%**, `$HIDE` 리워드 **별도 표시 필요**
- `components/governance/GovernanceDashboard.tsx` (L213, L216) — Voting Rewards를 `$HIDE`로

### Governance 페이지
- 거버넌스 참여 리워드 → `$HIDE`
- **HXP 제출/투표 포인트 → `$HIDE` 변환** 표시

---

## 📝 TGE 설명 추가 위치 (상세)

### 1) 짧은 설명 (Tooltips with Info Icon)

#### Portfolio 페이지 (`components/portfolio/`)

```tsx
// CreatorEarnings.tsx
<Tooltip>
  <Info />
  <TooltipContent>
    Layer-3 인덱스 졸업시 트레이딩 수수료의 최대 80% 수취. 
    추가로 활동 기반 $HIDE 리워드 획득.
  </TooltipContent>
</Tooltip>
```

```tsx
// AccountSummary.tsx - Rewards 섹션 추가
<Card>
  <CardContent>
    <div>$HIDE Rewards <Info /></div>
    <Tooltip>10 포인트 = 1 $HIDE | DEX 활동 기반</Tooltip>
  </CardContent>
</Card>
```

```tsx
// VotingPowerManager.tsx
<Tooltip>
  <Info />
  $HIIN 스테이킹으로 거버넌스 참여 및 인덱스 수수료 리베이트
</Tooltip>
```

#### Launch 페이지 (`app/launch/page.tsx`)

```tsx
// Bonding Curve 섹션
<Tooltip>
  <Info />
  8억개 판매 완료 → Funding Round 오픈 → Layer-2 졸업
</Tooltip>
```

```tsx
// Graduation Requirements 카드 추가
<Card>
  <h3>Graduation Process</h3>
  <Steps>
    1. Bonding Curve (800M tokens)
    2. Funding Round (NAV 백업)
    3. LP Round (유동성 확보)
    4. DAO 승인 → Layer-2
  </Steps>
  <Tooltip>
    <Info />
    Funding Round는 NAV 갭 해소, LP Round는 AMM 유동성 확보
  </Tooltip>
</Card>
```

#### Trading 페이지 (`components/trading/`)

```tsx
// TradingPanel.tsx - 수수료 섹션
<div>Trading Fee <Info /></div>
<Tooltip>$HIDE로 지불시 할인 | 0.1% → 0.08%</Tooltip>
```

```tsx
// GraduationProgress.tsx - 확장 설명
<TooltipContent>
  L3 졸업 조건:
  • Bonding Curve 800M 토큰 판매 완료
  • Funding Round: NAV = Price × 10억 보장
  • LP Round: 2억 토큰 AMM 풀 형성
  • DAO 승인
</TooltipContent>
```

#### Governance 페이지

```tsx
// GovernanceDashboard.tsx
<Tooltip>
  <Info />
  투표 참여로 $HIDE 획득 | HXP 통과시 1,000 포인트
</Tooltip>
```

---

### 2) 중간 설명 (Expandable / Accordion 섹션)

#### Launch 페이지에 추가할 섹션

```tsx
<Accordion>
  <AccordionItem value="how-it-works">
    <AccordionTrigger>How Layer-3 Launch Works</AccordionTrigger>
    <AccordionContent>
      <h4>1. Bonding Curve Phase</h4>
      <p>8억개 토큰 판매. 가격은 수요에 따라 상승.</p>

      <h4>2. Circuit Breaker & Funding Round</h4>
      <p>판매 완료시 가격 고정. NAV와 Price 갭이 10% 이상이면...</p>

      <h4>3. LP Round (상시 오픈)</h4>
      <p>HYPE/USDC 단독 유동성 제공...</p>

      <h4>4. Graduation to Layer-2</h4>
      <p>조건 충족시 DAO 승인으로 졸업...</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Portfolio 페이지

```tsx
<Tabs>
  <TabsList>
    <TabsTrigger>Overview</TabsTrigger>
    <TabsTrigger>Earnings Breakdown</TabsTrigger>
    <TabsTrigger>Rewards Program</TabsTrigger>
  </TabsList>

  <TabsContent value="rewards-program">
    <h3>INDEX Builder Program</h3>
    <Table>
      <Row>HXP 제출 통과 | 1,000 $HIDE</Row>
      <Row>Layer-3 → Layer-2 졸업 | 5,000 $HIDE</Row>
    </Table>

    <h3>DEX Catalyst Program</h3>
    <Table>
      <Row>72시간 이내 LP 제공 | 2,000 $HIIN</Row>
      <Row>월간 거래량 Top 10% | 1,000 $HIIN</Row>
    </Table>
  </TabsContent>
</Tabs>
```

---

### 3) 긴 설명 (Docs 페이지 — 신규 생성 필요)

#### 생성할 폴더 구조

```
/app/docs/
  /page.tsx (Docs 메인 - 목차)
  /tokenomics/
    /page.tsx (Tokenomics 개요)
    /hiin/page.tsx ($HIIN 상세)
    /hide/page.tsx ($HIDE 상세)
  /launch-guide/
    /page.tsx (Layer-3 런칭 가이드)
    /bonding-curve/page.tsx
    /funding-round/page.tsx
    /lp-round/page.tsx
  /rewards/
    /page.tsx (리워드 프로그램)
    /index-builder/page.tsx
    /dex-catalyst/page.tsx
  /tge-strategy/page.tsx (TGE 전략 - 파트너용)
```

#### Footer 수정

```tsx
// components/layout/Footer.tsx (L76-82)
<Link href="/docs">Docs</Link>
<Link href="/docs/tokenomics">Tokenomics</Link>
<Link href="/docs/launch-guide">Launch Guide</Link>
<Link href="/docs/rewards">Rewards</Link>
```

---

## 🆕 추가 개발 필요한 컴포넌트

### 1) Staking 관련
- `components/staking/HiinStakingModal.tsx` (신규)
- `components/staking/HideStakingModal.tsx` (신규)
- `components/staking/VeHideBoostDisplay.tsx` (신규)
- `components/staking/StakingDashboard.tsx` (신규)

### 2) Rewards 관련
- `components/rewards/PointsTracker.tsx` (신규)
- `components/rewards/RewardsClaim.tsx` (신규)
- `components/rewards/AirdropClaim.tsx` (신규)
- `components/rewards/ProtocolRevenueShare.tsx` (신규)

### 3) Layer-3 Graduation
- `components/launch/BondingCurveModal.tsx` (신규)
- `components/launch/FundingRoundModal.tsx` (신규)
- `components/launch/LPRoundModal.tsx` (신규)
- `components/launch/CircuitBreakerAlert.tsx` (신규)
- `components/launch/NAVPriceGapIndicator.tsx` (신규)

### 4) Token Balance 표시
- `components/wallet/TokenBalanceCard.tsx` (신규) — `$HIIN`, `$HIDE` 잔액 별도 표시
- Portfolio의 `AccountSummary`에 `$HIIN`/`$HIDE` 섹션 추가

---

## 🎯 Claude Code용 종합 프롬프트

### HyperIndex TGE 통합 구현 태스크

**프로젝트 정보**
- 경로: `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0`
- TGE 문서:  
  - `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/참고용 폴더/HyperIndex TGE - Internal & Partners.md`  
  - `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0/참고용 폴더/Layer3 Explanation 28b944d7795680d58e58ee7b44b28f88.md`

**목표**  
TGE 계획서에 명시된 듀얼 토큰 시스템(`$HIIN`, `$HIDE`)과 Layer-3 졸업 프로세스를 **UI에 완전히 구현**

---

### PHASE 1: Currency 시스템 확장

**1-1. 타입 정의 추가** — `lib/types/currency.ts`

```ts
export type Currency = 'HYPE' | 'USD' | 'USDC' | 'USDT' | 'BTC' | 'HIIN' | 'HIDE'

export interface ExchangeRates {
  HYPE_USD: number
  HYPE_USDC: number
  HYPE_USDT: number
  HYPE_BTC: number
  HYPE_HIIN: number  // 추가
  HYPE_HIDE: number  // 추가
}
```

**1-2. Currency Utils 확장** — `lib/utils/currency.ts`

```ts
// getCurrencyDisplay
case 'HIIN':
  return { prefix: '', suffix: ' $HIIN' }
case 'HIDE':
  return { prefix: '', suffix: ' $HIDE' }
```

- `convertCurrency` 함수에 `$HIIN`, `$HIDE` 변환 로직 추가

**1-3. Settings에 토큰 선택 추가** — `components/settings/PreferencesSection.tsx` (L46-48)

```tsx
<SelectItem value="HIIN">$HIIN</SelectItem>
<SelectItem value="HIDE">$HIDE</SelectItem>
```

---

### PHASE 2: HYPE 하드코딩을 조건부 토큰으로 변경

**2-1. Index 수수료 → `$HIIN`**

대상 파일:
- `app/launch/page.tsx` (L491, L545, L626, L630, L633, L634)
- `components/launch/ConfirmLaunchModal.tsx` (L15, L90, L132, L137)
- `components/trading/IndexInfoBar.tsx` (L352-353)

변경 예시:

```tsx
// Before
<div>{totalCost.toFixed(2)} HYPE</div>

// After
<div>{totalCost.toFixed(2)} $HIIN</div>
<Tooltip>
  <Info />
  $HIIN로 지불시 5% 할인 적용
</Tooltip>
```

**2-2. DEX 거래 수수료 → `$HIDE`**

대상 파일:
- `components/trading/TradingPanel.tsx`
- `components/trading/OrderBookTrades.tsx` (L99, L100, L159)
- `components/trading/TradingBottomTabs.tsx` (Assets 섹션)

**2-3. Gas 수수료** — `lib/utils/currency.ts`

```ts
export function formatGas(
  amount: number,
  paymentToken: 'HIIN' | 'HIDE' = 'HIIN',
  decimals: number = 2
): string {
  return formatCurrency(amount, paymentToken, { decimals })
}
```

---

### PHASE 3: 누락된 UI 컴포넌트 개발

**3-1. Staking 시스템**

`components/staking/HiinStakingModal.tsx`

```tsx
export function HiinStakingModal({ open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Stake $HIIN</DialogTitle>

        {/* Staking Amount Input */}
        <Input placeholder="Amount to stake" />

        {/* Lock Duration Selector */}
        <Select>
          <SelectItem value="no-lock">No Lock (1x voting)</SelectItem>
          <SelectItem value="3m">3 Months (1.2x voting)</SelectItem>
          <SelectItem value="6m">6 Months (1.5x voting)</SelectItem>
          <SelectItem value="12m">12 Months (2x voting + veHIDE)</SelectItem>
        </Select>

        {/* Benefits Display */}
        <div>
          <div>Voting Power: {'{calculatedPower}'}</div>
          <div>Est. Rewards (yearly): {'{estRewards}'} $HIIN</div>
          {'{lockPeriod >= 12 && ('}
            <Badge>+veHIDE 2x Boost for 12 months</Badge>
          {')}'}
        </div>

        <Button>Stake $HIIN</Button>
      </DialogContent>
    </Dialog>
  )
}
```

`components/staking/HideStakingModal.tsx` — `$HIDE`용 유사 구조

`components/staking/StakingDashboard.tsx`

```tsx
export function StakingDashboard() {
  return (
    <div>
      <Card>
        <h2>$HIIN Staking</h2>
        <div>Staked: {'{stakedHiin}'}</div>
        <div>Voting Power: {'{votingPower}'}</div>
        <div>Pending Rewards: {'{pendingHiin}'}</div>
        <Button>Stake More</Button>
        <Button>Claim Rewards</Button>
      </Card>

      <Card>
        <h2>$HIDE Staking</h2>
        <div>Staked: {'{stakedHide}'}</div>
        <div>veHIDE Boost: {'{veHideBoost}'}x</div>
        <div>Pending Rewards: {'{pendingHide}'}</div>
        <Button>Stake More</Button>
        <Button>Claim Rewards</Button>
      </Card>
    </div>
  )
}
```

**3-2. Layer-3 Graduation 모달들**

`components/launch/FundingRoundModal.tsx`

```tsx
export function FundingRoundModal({ 
  indexSymbol,
  finalPrice, 
  navGap,
  open, 
  onOpenChange 
}: FundingRoundModalProps) {
  const [amount, setAmount] = useState('')
  const [allocation, setAllocation] = useState<'T-LP' | 'NAV'>('NAV')

  // TGE 문서 기준 계산
  const tAmountNeeded = finalPrice * 200_000_000 // Token-side LP
  const nAmountNeeded = finalPrice * 800_000_000 - bondingCurveProceeds // NAV participation

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Funding Round - {indexSymbol}</DialogTitle>

      {/* Circuit Breaker Alert */}
      <Alert variant="warning">
        <AlertTriangle />
        Circuit Breaker Activated: NAV gap ≥10%
        <div>Price: {'{finalPrice}'} | NAV: {'{nav}'} | Gap: {'{navGap}%'} </div>
      </Alert>

      {/* Allocation Choice */}
      <RadioGroup value={allocation} onValueChange={setAllocation}>
        <RadioGroupItem value="NAV">
          <div>NAV Participation</div>
          <div className="text-xs">
            • 10 points per $1 ($HIDE rewards)
            • +1 point bonus on graduation
            • veHIDE 2x boost for 12 months
            • 10% Protocol Fee Revenue Share (6-12 months)
            • Non-redeemable
          </div>
          <div>Needed: {'{formatBalance(nAmountNeeded)}'}</div>
        </RadioGroupItem>

        <RadioGroupItem value="T-LP">
          <div>Token-Side LP</div>
          <div className="text-xs">
            • 2 points per $1 ($HIDE rewards)
            • LP tokens (30-90 day lock)
            • Earns LP fees
            • Redeemable after lock
          </div>
          <div>Needed: {'{formatBalance(tAmountNeeded)}'}</div>
        </RadioGroupItem>
      </RadioGroup>

      {/* Amount Input */}
      <Input 
        type="number" 
        placeholder="Amount (USDC or HYPE)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Calculation Display */}
      <Card>
        <div>You will receive:</div>
        {'{allocation === "NAV" && ('}
          <>
            <div>{'{parsedAmount * 10}'} $HIDE points</div>
            <div>+ Graduation Bonus: {'{parsedAmount * 1}'} $HIDE points</div>
            <div>+ veHIDE 2x Boost (12mo)</div>
            <div>+ 10% Protocol Fee Share</div>
          </>
        {')}'}
        {'{allocation === "T-LP" && ('}
          <>
            <div>{'{parsedAmount * 2}'} $HIDE points</div>
            <div>{'{calculatedLPTokens}'} LP tokens</div>
            <div>Lock: 30-90 days</div>
          </>
        {')}'}
      </Card>

      <Button>Participate in Funding Round</Button>
    </Dialog>
  )
}
```

`components/launch/LPRoundModal.tsx`

```tsx
export function LPRoundModal({ indexSymbol, finalPrice, open, onOpenChange }: LPRoundModalProps) {
  const [amount, setAmount] = useState('')
  const [paymentToken, setPaymentToken] = useState<'USDC' | 'HYPE'>('USDC')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>LP Round (Always Open) - {indexSymbol}</DialogTitle>

      <Alert>
        <Info />
        Quote-side 유동성 제공. LP 토큰 획득, 수수료 수익, 언제든지 인출 가능.
      </Alert>

      <Select value={paymentToken} onValueChange={setPaymentToken}>
        <SelectItem value="USDC">USDC</SelectItem>
        <SelectItem value="HYPE">HYPE</SelectItem>
      </Select>

      <Input 
        placeholder={`Amount (${ '{paymentToken}' })`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Card>
        <div>You will receive:</div>
        <div>{'{calculatedLPTokens}'} LP tokens (Quote-side)</div>
        <div>Redeemable: Anytime</div>
        <div>APR: {'{estimatedAPR}'}%</div>
        <div>$HIDE Rewards: 0 points (default)</div>
        <Tooltip>
          <Info />
          DAO가 승인시 한시적으로 최대 0.5 포인트/$1 부여 가능
        </Tooltip>
      </Card>

      <Button>Provide Liquidity</Button>
    </Dialog>
  )
}
```

`components/launch/BondingCurveDisplay.tsx`

```tsx
export function BondingCurveDisplay({ indexSymbol }: { indexSymbol: string }) {
  // Mock data
  const soldTokens = 650_000_000
  const totalTokens = 800_000_000
  const currentPrice = 0.00125
  const avgPrice = 0.00098
  const proceeds = soldTokens * avgPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bonding Curve Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <Progress value={(soldTokens / totalTokens) * 100} />
        <div>{'{soldTokens.toLocaleString()}'} / {'{totalTokens.toLocaleString()}'} tokens sold</div>

        {/* Price Chart */}
        <div>Current Price: ${'{currentPrice}'}</div>
        <div>Average Price: ${'{avgPrice}'}</div>
        <div>Proceeds: ${'{proceeds.toLocaleString()}'} </div>

        {/* Buy Interface */}
        <Input placeholder="Amount (USDC)" />
        <div>You will receive: ~{'{estimatedTokens}'} tokens</div>
        <Button>Buy on Bonding Curve</Button>

        <Alert variant="info">
          <Info />
          8억개 판매 완료시 가격 고정 및 Funding Round 오픈
        </Alert>
      </CardContent>
    </Card>
  )
}
```

**3-3. Rewards 시스템**

`components/rewards/PointsTracker.tsx`

```tsx
export function PointsTracker() {
  const [selectedProgram, setSelectedProgram] = useState<'index-builder' | 'dex-catalyst'>('index-builder')

  const indexBuilderPoints = {
    hxpSubmitted: 2,
    hxpPassed: 1,
    votes: 45,
    layer3Launched: 1,
    graduated: 0,
    analytics: 3,
    total: {'{calculateTotal()}'}
  }

  const dexCatalystPoints = {
    pioneerLP: 2,
    earlyLP: 5,
    topTrader: 0,
    longTermStake: 1,
    total: {'{calculateTotal()}'}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Points Tracker</CardTitle>
        <Tabs value={selectedProgram} onValueChange={setSelectedProgram}>
          <TabsTrigger value="index-builder">INDEX Builder ($HIDE)</TabsTrigger>
          <TabsTrigger value="dex-catalyst">DEX Catalyst ($HIIN)</TabsTrigger>
        </Tabs>
      </CardHeader>

      <CardContent>
        { '{selectedProgram === "index-builder" && (' }
          <div>
            <Table>
              <Row>
                <Cell>HXP 제출 및 통과</Cell>
                <Cell>{'{indexBuilderPoints.hxpPassed}'} × 1,000</Cell>
                <Cell>{'{indexBuilderPoints.hxpPassed * 1000}'} $HIDE</Cell>
              </Row>
              <Row>
                <Cell>분기별 투표 참여</Cell>
                <Cell>{'{indexBuilderPoints.votes}'} × 100</Cell>
                <Cell>{'{indexBuilderPoints.votes * 100}'} $HIDE</Cell>
              </Row>
              <Row>
                <Cell>Layer-3 런칭 ($100k TVL)</Cell>
                <Cell>{'{indexBuilderPoints.layer3Launched}'} × 500</Cell>
                <Cell>{'{indexBuilderPoints.layer3Launched * 500}'} $HIDE</Cell>
              </Row>
              <Row>
                <Cell>Layer-2 졸업</Cell>
                <Cell>{'{indexBuilderPoints.graduated}'} × 5,000</Cell>
                <Cell>{'{indexBuilderPoints.graduated * 5000}'} $HIDE</Cell>
              </Row>
            </Table>

            <div>Total Points: {'{indexBuilderPoints.total}'}</div>
            <div>Claimable $HIDE: {'{indexBuilderPoints.total}'}</div>
            <Button>Claim $HIDE Rewards</Button>
          </div>
        { ')'} 

        { '{selectedProgram === "dex-catalyst" && (' }
          {/* 유사한 구조 */}
        { ')'} 
      </CardContent>
    </Card>
  )
}
```

`components/rewards/AirdropClaim.tsx`

```tsx
export function AirdropClaim() {
  const [selectedToken, setSelectedToken] = useState<'HIIN' | 'HIDE'>('HIIN')

  // Mock airdrop eligibility
  const hiinAirdrop = {
    wave1: 5000,
    wave2: 0,
    wave3: 0,
    claimed: 5000,
    pending: 0
  }

  const hideAirdrop = {
    wave1: 3000,
    wave2: 2000,
    wave3: 0,
    claimed: 3000,
    pending: 2000
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop Claims</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedToken} onValueChange={setSelectedToken}>
          <TabsTrigger value="HIIN">$HIIN Airdrops</TabsTrigger>
          <TabsTrigger value="HIDE">$HIDE Airdrops</TabsTrigger>
        </Tabs>

        { '{selectedToken === "HIIN" && (' }
          <div>
            <div>Wave 1 (TGE 5%): {'{hiinAirdrop.wave1}'} $HIIN</div>
            <Badge>{'{hiinAirdrop.wave1 > 0 ? "Claimed" : "Not Eligible"}'}</Badge>

            <div>Wave 2 (Q1-Q2 2026 10%): {'{hiinAirdrop.wave2}'} $HIIN</div>
            <Badge>Coming Soon</Badge>

            <div>Total Pending: {'{hiinAirdrop.pending}'} $HIIN</div>
            <Button disabled={'{hiinAirdrop.pending === 0}'}>Claim $HIIN</Button>
          </div>
        { ')'} 

        { '{selectedToken === "HIDE" && (' }
          <div>
            <div>Wave 1: {'{hideAirdrop.wave1}'} $HIDE (Claimed)</div>
            <div>Wave 2: {'{hideAirdrop.wave2}'} $HIDE</div>
            <Button>Claim {'{hideAirdrop.pending}'} $HIDE</Button>
          </div>
        { ')'} 
      </CardContent>
    </Card>
  )
}
```

**3-4. Protocol Fee Revenue Share**

`components/rewards/ProtocolRevenueShare.tsx`

```tsx
export function ProtocolRevenueShare() {
  // NAV Participation 참여자만 해당
  const positions = [
    {
      indexSymbol: 'DOG_INDEX',
      navParticipation: 50000, // $50k NAV 참여
      sharePercentage: 0.5, // 전체 NAV 참여자 중 0.5%
      duration: '6 months',
      endsAt: new Date('2026-06-01'),
      accruedFees: 2340.50,
      totalPaidOut: 8450.20
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Fee Revenue Share</CardTitle>
        <Tooltip>
          <Info />
          Funding Round NAV 참여자만 해당. 
          해당 인덱스 Protocol Fee의 10%를 6-12개월간 지분 비율로 분배.
        </Tooltip>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Your NAV</TableHead>
              <TableHead>Share %</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Accrued</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { '{positions.map((pos) => (' }
              <TableRow key={'{pos.indexSymbol}'}>
                <TableCell>{'{pos.indexSymbol}'}</TableCell>
                <TableCell>${'{pos.navParticipation.toLocaleString()}'} </TableCell>
                <TableCell>{'{pos.sharePercentage}'}%</TableCell>
                <TableCell>{'{pos.duration}'}</TableCell>
                <TableCell className="text-green-400">
                  ${'{pos.accruedFees.toFixed(2)}'}
                </TableCell>
                <TableCell>${'{pos.totalPaidOut.toFixed(2)}'}</TableCell>
                <TableCell>
                  <Button size="sm">Claim</Button>
                </TableCell>
              </TableRow>
            { '))' }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

---

### PHASE 4: 기존 컴포넌트 수정 및 확장

**4-1. Portfolio 페이지 확장** — `components/portfolio/PortfolioLayout.tsx`

```tsx
<TabsTrigger value="staking">Staking & Rewards</TabsTrigger>
<TabsTrigger value="revenue-share">Revenue Share</TabsTrigger>

<TabsContent value="staking">
  <StakingDashboard />
  <PointsTracker />
  <AirdropClaim />
</TabsContent>

<TabsContent value="revenue-share">
  <ProtocolRevenueShare />
</TabsContent>
```

**4-2. CreatorEarnings 수정** — `components/portfolio/CreatorEarnings.tsx` (L89 이후)

```tsx
{/* Creator Fee + $HIDE Rewards 분리 표시 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card>
    <CardContent className="p-4">
      <div className="text-xs text-slate-400">Creator Fee (80% of trading fees)</div>
      <div className="text-lg font-semibold">{'{formatBalance(creatorFeeOnly)}'}</div>
      <Tooltip>
        <Info />
        Layer-2 졸업 후 트레이딩 수수료의 최대 80% 수취
      </Tooltip>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4">
      <div className="text-xs text-slate-400">$HIDE Rewards (Activity Points)</div>
      <div className="text-lg font-semibold">{'{hideRewards}'} $HIDE</div>
      <Tooltip>
        <Info />
        INDEX Builder Program: 졸업시 5,000 $HIDE 보너스
      </Tooltip>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4">
      <div className="text-xs text-slate-400">LP Fees</div>
      <div className="text-lg font-semibold">{'{formatBalance(lpFees)}'}</div>
    </CardContent>
  </Card>
</div>
```

**4-3. GraduationProgress 확장** — `components/trading/GraduationProgress.tsx`

```tsx
<TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-sm">
  <div className="text-xs space-y-2">
    <div className="font-semibold">Layer-3 Graduation Requirements:</div>
    <div>1. Bonding Curve: 800M tokens sold ✓</div>
    <div>2. Funding Round: NAV = Price × 1B</div>
    <div className="ml-3">• T-LP: {'{tAmountNeeded}'} needed</div>
    <div className="ml-3">• NAV: {'{nAmountNeeded}'} needed</div>
    <div>3. LP Round: 200M token-side AMM pool</div>
    <div>4. DAO Approval</div>

    <Separator />

    <div className="font-semibold">Current Status:</div>
    <div>• Bonding Curve: {'{salesProgress}'}%</div>
    <div>• Funding Round: {'{fundingProgress}'}%</div>
    <div>• LP Round: {'{liquidityProgress}'}%</div>
  </div>
</TooltipContent>
```

**4-4. AccountSummary에 토큰 잔액 추가** — `components/portfolio/AccountSummary.tsx`

```tsx
{/* Token Balances */}
<Card className="bg-slate-900/50 border-slate-800">
  <CardContent className="p-6">
    <h3 className="font-semibold mb-4">Token Balances</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div>
        <div className="text-slate-400 text-xs">$HIIN</div>
        <div className="text-white font-semibold">{'{hiinBalance.toLocaleString()}'} </div>
        <div className="text-slate-500 text-xs">≈ ${'{hiinUSD}'} </div>
      </div>
      <div>
        <div className="text-slate-400 text-xs">$HIDE</div>
        <div className="text-white font-semibold">{'{hideBalance.toLocaleString()}'} </div>
        <div className="text-slate-500 text-xs">≈ ${'{hideUSD}'} </div>
      </div>
      <div>
        <div className="text-slate-400 text-xs">HYPE</div>
        <div className="text-white font-semibold">{'{hypeBalance.toFixed(2)}'}</div>
      </div>
      <div>
        <div className="text-slate-400 text-xs">USDC</div>
        <div className="text-white font-semibold">${'{usdcBalance.toFixed(2)}'}</div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

### PHASE 5: Docs 페이지 생성

**5-1. Docs 폴더 구조 생성**

```bash
mkdir -p app/docs/tokenomics/{hiin,hide}
mkdir -p app/docs/launch-guide/{bonding-curve,funding-round,lp-round}
mkdir -p app/docs/rewards/{index-builder,dex-catalyst}
```

**5-2. Docs 메인 페이지** — `app/docs/page.tsx`

```tsx
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tokenomics</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/docs/tokenomics">Overview</Link>
              <Link href="/docs/tokenomics/hiin">$HIIN Token</Link>
              <Link href="/docs/tokenomics/hide">$HIDE Token</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Launch Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/docs/launch-guide">Layer-3 Launching</Link>
              <Link href="/docs/launch-guide/bonding-curve">Bonding Curve</Link>
              <Link href="/docs/launch-guide/funding-round">Funding Round</Link>
              <Link href="/docs/launch-guide/lp-round">LP Round</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards Program</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/docs/rewards">Overview</Link>
              <Link href="/docs/rewards/index-builder">INDEX Builder</Link>
              <Link href="/docs/rewards/dex-catalyst">DEX Catalyst</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TGE Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/docs/tge-strategy">Full TGE Document</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

**5-3. 개별 Docs 페이지 생성 (샘플)**  
- `app/docs/tokenomics/page.tsx` — 듀얼 토큰 개요  
- `app/docs/tokenomics/hiin/page.tsx` — `$HIIN` 상세 *(FDV $40M, 100B supply, 용도, 베스팅)*  
- `app/docs/tokenomics/hide/page.tsx` — `$HIDE` 상세 *(FDV $20M, 100B supply, 용도)*  
- `app/docs/launch-guide/funding-round/page.tsx` — Funding Round 상세 설명  
- `app/docs/rewards/index-builder/page.tsx` — INDEX Builder Program 테이블  
- `app/docs/rewards/dex-catalyst/page.tsx` — DEX Catalyst Program 테이블  

---

### PHASE 6: Launch 페이지 개선

**6-1. `IndexBuilderWizard`에 섹션 추가** — `components/launch/IndexBuilderWizard.tsx`

```tsx
{step === 5 && (
  <>
    {/* 기존 Review 내용 */}

    {/* Launch Process 안내 */}
    <Card className="bg-slate-900/50 border-slate-800 mt-6">
      <CardHeader>
        <CardTitle>After Submission: Launch Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge>1</Badge>
            <div>
              <div className="font-medium">DAO Review & Approval</div>
              <div className="text-xs text-slate-400">평균 3-7일</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge>2</Badge>
            <div>
              <div className="font-medium">Bonding Curve Launch (L3)</div>
              <div className="text-xs text-slate-400">800M tokens 판매</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge>3</Badge>
            <div>
              <div className="font-medium">Funding Round</div>
              <div className="text-xs text-slate-400">
                NAV 백업 + T-LP 형성 | 10 pt/$1 ($HIDE)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge>4</Badge>
            <div>
              <div className="font-medium">LP Round (Always Open)</div>
              <div className="text-xs text-slate-400">Quote-side 유동성 제공</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge>5</Badge>
            <div>
              <div className="font-medium">Graduation to Layer-2</div>
              <div className="text-xs text-slate-400">
                Creator Fee 수취 시작 (최대 80%) + 5,000 $HIDE 보너스
              </div>
            </div>
          </div>
        </div>

        <Button variant="link" className="mt-4">
          <Link href="/docs/launch-guide">상세 가이드 보기 →</Link>
        </Button>
      </CardContent>
    </Card>
  </>
)}
```

**6-2. Launch 페이지에 Bonding Curve 섹션 추가** — `app/launch/page.tsx`

```tsx
{/* Active Layer-3 Launches (if user has any) */}
<Card className="mt-6">
  <CardHeader>
    <CardTitle>Your Active Layer-3 Launches</CardTitle>
  </CardHeader>
  <CardContent>
    { '{userL3Launches.map((launch) => (' }
      <div key={'{launch.symbol}'} className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">{'{launch.name}'}</div>
            <div className="text-xs text-slate-400">{'{launch.symbol}'}</div>
          </div>

          <Badge>{'{launch.status}'}</Badge>
        </div>

        {/* Bonding Curve Progress */}
        { '{launch.status === "bonding-curve" && (' }
          <>
            <Progress value={'{launch.salesProgress}'} className="mt-2" />
            <div className="text-xs text-slate-400 mt-1">
              {'{launch.soldTokens.toLocaleString()}'} / 800M sold
            </div>
            <Button size="sm" className="mt-2">
              View Bonding Curve
            </Button>
          </>
        { ')'} 

        {/* Funding Round */}
        { '{launch.status === "funding-round" && (' }
          <>
            <Alert variant="info" className="mt-2">
              <AlertTriangle />
              Funding Round Open: {'{launch.navGap}'}% NAV gap
            </Alert>
            <Button size="sm" className="mt-2">
              Participate in Funding Round
            </Button>
          </>
        { ')'} 

        {/* Graduated */}
        { '{launch.status === "graduated" && (' }
          <Badge variant="success">Graduated to Layer-2! 🎉</Badge>
        { ')'} 
      </div>
    { '))'} }
  </CardContent>
</Card>
```

---

### PHASE 7: Footer Docs 링크 수정

**파일:** `components/layout/Footer.tsx` (L76-82)

```tsx
<nav className="flex items-center gap-3 text-xs text-slate-400">
  <Link href="/docs" className="hover:text-slate-200">Docs</Link>
  <span className="text-slate-600">/</span>
  <Link href="/docs/tokenomics" className="hover:text-slate-200">Tokenomics</Link>
  <span className="text-slate-600">/</span>
  <Link href="/docs/launch-guide" className="hover:text-slate-200">Launch Guide</Link>
  <span className="text-slate-600">/</span>
  <Link href="/docs/rewards" className="hover:text-slate-200">Rewards</Link>
  <span className="text-slate-600">/</span>
  <Link href="#" className="hover:text-slate-200">Support</Link>
  <span className="text-slate-600">/</span>
  <Link href="#" className="hover:text-slate-200">Terms</Link>
</nav>
```

---

### PHASE 8: Governance 페이지 리워드 표시

**파일:** `components/governance/GovernanceDashboard.tsx` (L213-217 수정)

```tsx
<div className="text-2xl font-bold text-white mb-1">
  {'{userVotingStats.weeklyEarnings}'} $HIDE
</div>
<div className="text-sm text-slate-400">
  Voting Rewards (this week)
  <Tooltip>
    <Info />
    거버넌스 참여로 $HIDE 획득 | 1 포인트 = 1 $HIDE
  </Tooltip>
</div>
```

---

### PHASE 9: 검증 및 테스트

**9-1. 타입 체크**

```bash
cd /Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0
pnpm run build
```

**9-2. 확인 사항**

- [ ] 모든 HYPE 하드코딩이 적절한 토큰으로 변경되었는지  
- [ ] Tooltip이 모든 필요한 위치에 추가되었는지  
- [ ] Docs 페이지가 생성되고 링크가 작동하는지  
- [ ] 새 모달들이 적절히 통합되었는지  
- [ ] Currency selector에서 `$HIIN`, `$HIDE` 선택 가능한지  

---

## 📊 요약: 페이지별 추가할 TGE 설명

| 페이지     | 짧은 설명 (Tooltip)                                              | 중간 설명 (Section)                                      | 긴 설명 (Docs Link)        |
|------------|-------------------------------------------------------------------|-----------------------------------------------------------|----------------------------|
| Portfolio  | • Creator Fee 80% 설명 • $HIDE 리워드 1:1 • $HIIN 스테이킹 혜택 | • Staking & Rewards 탭 • Points Tracker • Revenue Share   | → `/docs/rewards`          |
| Launch     | • Bonding → Funding → LP • 졸업시 5,000 $HIDE 보너스             | • Launch Process 5단계 • Active Launches 섹션             | → `/docs/launch-guide`     |
| Trading    | • $HIDE로 수수료 할인 • LP 제공시 APR + $HIDE                    | • GraduationProgress 확장 툴팁                            | → `/docs/tokenomics`       |
| Governance | • 투표로 $HIDE 획득 • HXP 통과시 1,000 pt                         | • 리워드 분해 섹션                                        | → `/docs/rewards/index-builder` |
| Settings   | • 토큰 선택에 $HIIN, $HIDE                                       | -                                                         | -                          |
| Footer     | -                                                                 | -                                                         | Docs 링크 활성화           |

---

## ⚠️ 주의사항

- **HYPE는 완전히 제거하지 말 것**
  - HYPE는 HyperLiquid 네트워크의 네이티브 토큰
  - Quote currency로 계속 사용
  - 단, **Index 수수료는 `$HIIN`**, **DEX 수수료는 `$HIDE`**

- **기존 Currency Selector 동작 유지**
  - 사용자는 USD/USDC/HYPE/BTC 중 선택하여 표시 화폐 변경 가능
  - `$HIIN`/`$HIDE`도 선택 가능하도록 확장

- **Mock Data 일관성**
  - 리워드는 실제 TGE 비율 반영 (10pt/$1, 2pt/$1 등)
  - FDV: `$HIIN` $40M, `$HIDE` $20M
  - Supply: 각 100B

---

## 🚀 우선순위 작업 순서

**High Priority (즉시)**
- HYPE → `$HIIN` / `$HIDE` 변경 (수수료/가스)
- Tooltip 추가 (Portfolio, Launch, Trading)
- Currency 타입 확장
- Footer Docs 링크 활성화

**Medium Priority (1-2주)**
- Staking UI 개발
- Points Tracker 개발
- Funding/LP Round 모달 개발
- Docs 페이지 생성

**Low Priority (추후)**
- Airdrop Claim UI
- Protocol Revenue Share 상세
- veHIDE 시각화
- Analytics 확장
