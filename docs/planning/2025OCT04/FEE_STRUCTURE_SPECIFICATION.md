# Fee Structure Specification - HyperIndex

**Creator**: Business Documentation (Slides 26-28)
**Date**: 2025-10-28
**Category**: Revenue Model
**Status**: Specification for Implementation

---

## Overview

HyperIndex의 수수료 구조는 Pump.fun을 벤치마크하되, 낮은 프로토콜 수수료와 높은 생태계 재분배를 특징으로 합니다. Layer별, Type별로 차별화된 수수료 정책을 적용하여 각 인덱스 유형의 특성을 반영합니다.

---

## 1. Trading Fee Structure	

### 1.1 Protocol Fee (Tiered by VIP Level)

**VIP Fee Tiers**:
| VIP Level | Protocol Fee Rate | Tier Distribution |
|-----------|------------------|-------------------|
| VIP0      | 0.60%            | 20%              |
| VIP1      | 0.50%            | 25%              |
| VIP2      | 0.40%            | 30%              |
| VIP3      | 0.35%            | 15%              |
| VIP4      | 0.30%            | 10%              |

**Blended Protocol Fee Rate**: 0.45%
- Calculation: Weighted average based on VIP distribution
- Partner Routing Protocol Fee (Non-Direct C-R): 0.50%
- Direct C-R Fee Rate (Partner Indices): 0.50%

### 1.2 Fee Breakdown by Layer

| Layer      | Creator Fee | Protocol Fee | LP Fee    | Total        |
|------------|-------------|--------------|-----------|--------------|
| L1         | 0.0%        | 0.3%-0.6%    | 0.40%     | 0.7%-1%      |
| L2 Basic   | 0.0%        | 0.3%-0.6%    | 0.40%     | 1%           |
| L3         | 0.4%        | 0.3%-0.6%    | 0.00%     | 1%           |
| Graduated  | 0.08%-0.95% | 0.3%-0.6%    | 0.02%-0.4%| 0.70%-1.5%   |

**Key Notes**:
- **L1/L2**: No creator fee (0.0%), standard LP fee (0.40%)
- **L3**: Creator fee applies (0.4%), no LP fee (bonding curve model)
- **Graduated**: Variable creator fees, reduced LP fees
- **Protocol Fee**: 0.3%-0.6% depending on VIP tier

### 1.3 Fee Rate Comparison

| Platform    | Fee Rate |
|-------------|----------|
| Axiom       | 2.20%    |
| Photon      | 2.25%    |
| BullX       | 2.25%    |
| Pumpfun     | 1.25%    |
| HyperIndex  | 1.00%    |

### 1.4 Trading Fee Design Rationale

**Benchmarking**:
- Trading fee model heavily benchmarked against Pump.fun's structure
- While maintaining overall lower protocol fees than Pump.fun, we intentionally share greater portion of revenues with ecosystem participants (index creators and LPs) to create strong incentives
- Pump.fun typically charges 0.3%-0.6% protocol fees, 0.3% creator fees, 0% LP fees
- Most cases result in ~1.25% total trading fees

**Protocol Fees**:
- Unlike Pump.fun's flat model, our protocol fee is tiered, ranging from 0.6% down to 0.3% depending on user activity (trading volume and referral performance)

**Creator + LP Fees**:
- In most trades, each receives ~0.4%
- In certain cases, creators may earn up to 0.95%, with LP fees at ~0.02%
- Invited users automatically receive 10% base discount on trading fees
- Combined with referral-linked incentives, ensures majority of active holders fall within VIP1-VIP2 tiers
- Under this assumption, blended protocol fee rate = 0.4475%, which we apply to revenue projections

**Partner Routing & Indices**:
- Partner Routing applies reduced 0.5% protocol fee, leaving room for partners to layer on their own fees
- Partners always trade via direct C-R against NAV, meaning no Creator or LP fees are involved
- Only low 0.5% protocol fee applies, further encouraging partner-driven adoption

**Summary**:
- Compared to Pump.fun, our structure lowers protocol take while amplifying ecosystem rewards
- Prioritizes growth for both creators and partners
- On Revenue Projection, we only calculated protocol fee, because creator & LP fee is directly handed to entities, not underlying on HyperIndex

---

## 2. Turnover Rate & AUM

### 2.1 Turnover Rate & AUM Factors Table

**Formulas**:
```
K = yearly rebalancing count
r = rebalancing composition change %^r
p = % of rebalancing volume on layer(type)'s primary market^p
d = duration of holding token^d

V^prim = primary market volume^v^prim
V^sec = secondary market volume^v^sec

L1/L2/VS/Partner: AUM = (V^prim / K*r) * Turnover rate = (V^prim / AUM)
L3: AUM = V^sec * (d/365) * Turnover rate = (V^sec / AUM)
```

**Factors**:
| Factor | L1  | L2  | VS  | Partner | L3  |
|--------|-----|-----|-----|---------|-----|
| K      | 12  | 26  | 26  | 365     | 0   |
| r      | 10% | 10% | 95% | 30%     | 0%  |
| p      | 70% | 60% | 80% | 40%     | 0%  |
| d      | -   | -   | -   | -       | 2   |

### 2.2 AUM Comparison by Type

| Type    | AUM (B)  |
|---------|----------|
| L1      | 5.10     |
| L2      | 2.02     |
| L3      | 0.2429   |
| VS      | 0.0959   |
| Partner | 0.1644   |

### 2.3 Results: Categories by Type

| Categories                  | L1      | L2      | L3       | VS Theme | Partner Indices |
|----------------------------|---------|---------|----------|----------|----------------|
| **Primary Market %**       | 35.00%  | 35.00%  | 0%       | 30%      | 0%             |
| **Primary Market Volume**  | 875     | 875     | -        | 7.50     | -              |
| **Secondary Market %**     | 20%     | 25%     | 30.60%   | 10%      | 15.00%         |
| **Secondary Market Volume**| 20      | 25      | 30       | 10       | 15             |
| **Turnover Ratio**         | 171%    | 433%    | 18250%   | 3088%    | 15643%         |
| **AUM (B)**                | 5.10    | 2.02    | 0.2429   | 0.0959   | 0.1644         |

### 2.4 Trading Fee Design Rationale

**Variables and formulas for Turnover Rate and AUM are organized, and these determine the application rate (size of exposure) for the Rebalancing Fee and MGMT Fee.**

- **L1, L2, and VS Theme** have both primary and secondary markets. L3 has no primary market and operates only in the secondary market (post-minting, bonding curve), so AUM is back-calculated from secondary volume.
- **Partner Indices** trade only via Direct C-R, so total volume is treated as V. Even if labeled "Secondary," there is effectively no primary/secondary split; for AUM, set Vsec=Secondary V+p=Secondary V+p
- The 25B Primary Volume is allocated to L1, L2, and VS Theme rebalances frequently with high replacement; its primary volume is set near L1/L2 even if secondary volume is smaller.

**Rationale for secondary share (and L3/Partner volumes)**:
- **L1/L2**: target stable sub-segments, so similar/substantial volumes are expected; L2 is more granular and thus slightly larger in total
- **L3**: given meme markets' short, high-velocity speculation, it can be the top driver. The 30B (30% p.a.) assumption is about 13% of pumpfun's peak monthly volume, so viewed as a reasonable valuation
- **VS Theme**: event-driven tokens, not a major volume driver → smallest weight
- **Partner**: smaller than L1-L3, but larger than VS. Despite limited segment diversity, strong partner promotion/routing implies more than VS, less than L1-L3

**Factors extend prior K and r with new p and d**:
- **p** = share of primary used for rebalancing. L1 has low volatility, so strong C-R incentives are rare → p=70%
- **L2** follows the same logic but is more segmented → p slightly above L1
- **VS Theme** rebalances with 95% of holdings when rebalancing, overwhelming C-R incentives → p set to the maximum
- **Partner** rebalances often with high turnover, but still concentrates in the creation-reduction market → p set to the minimum

**Based on these assumptions, AUM is determined for each sector.**

---

## 3. Rebalancing Fee Structure

### 3.1 Rebalancing Fee by Type

| Type    | Frequency        | Annual Rate      |
|---------|------------------|------------------|
| L1      | 0.1%/monthly     | ~1.2%/yearly     |
| L2      | 0.1%/bi-weekly   | ~2.6%/yearly     |
| VS      | 0.1%/bi-weekly   | ~2.6%/yearly     |
| Partner | 0.3%/monthly     | ~3.9%/yearly     |

**L3 & VS**: No rebalancing fee (operates on bonding curve)

### 3.2 Rebalancing Fee & Frequency Design

**Our rebalancing fee design balances cost efficiency with sustainable revenue.**

**Benchmarking**:
- Traditional ETFs embed ~0.03-0.3% rebalancing costs in management fees
- DeFi ETFs (DTFs) often charge 0.2-1% per rebalance due to on-chain gas costs

**Our Model**:
- We simplify by charging **0.1% per event** (monthly for L1, bi-weekly for L2/VS)
- Translates into predictable **1.2-3.9% annually**
- This cost charge after the on-chain gas fees and transaction fees

**Reasoning**:
- Aligns with DeFi norms, and also covering the sophisticated & frequent rebalancing as a revenue stream
- For the Partner Indices, they rebalances way more frequently (24H, 1H, etc) so it is separately categorized

**Value**:
- Users get transparent, predictable costs
- Partners/institutions gain a stable revenue mechanism

---

## 4. Management Fee Structure

### 4.1 Management Fee by Type

| Type    | Annual Mgmt Fee |
|---------|----------------|
| L1      | 0.7%/yearly    |
| L2      | 0.85%/yearly   |
| L3 & VS | 1%/yearly      |
| Partner | 0.5%/yearly    |

### 4.2 Management Fee Design

**Our management fee design reflects index complexity and ecosystem incentives.**

**Benchmarking**:
- Traditional ETFs average 0.3–1% yearly
- DeFi fund projects typically range 0.5–1.5% depending on strategy

**Our Model**:
- **L1**: 0.7% for broad, stable indices
- **L2**: 0.85% for higher-volatility sector indices
- **L3/VS**: 1% for meme-driven, high-maintenance indices
- **Partners**: 0.5%, with Direct C-R design, since the index itself rely on Partners

**Reasoning**:
- This tiered approach mirrors real operational intensity—higher-risk, higher-maintenance strategies justify higher mgmt fees

**Value**:
- Ensures fairness across segments, while keeping the average mgmt fee competitive vs benchmarks

---

## 5. Launcher Fee

**Fee Structure**: Fixed $5 per new token launch

**Assumptions** (benchmarked against Pump.fun):
- Using Pump.fun as a benchmark, we assume **~50k launches per month** (10% of Pumpfun's scale)
- This projects to **$250k monthly**, **$3M annually**, a conservative yet realistic baseline

**Formula**:
```
Launcher Fee = 5 * 50,000 * 12 = $3,000,000
```

---

## 6. Trading Fee Revenue Calculation

### 6.1 GMV Volume Distribution

**GMV Assumption**: $100B
- Applying only the protocol fee share
- Partner Indices (15B) always use Direct C-R at 0.5%, independent of routing share
- Remaining 85B split between Internal trades vs. Partner Routing

**Benchmarks**:
- Pumpfun routing share: 50–60% of meme-launch volume
- Therefore, L1/L2 adopt lower routing shares given their more institutional, long-horizon themes

### 6.2 GMV Trading Volume Distribution by Internal - Routing Type

**Sub-Category** | **Categories** | **Volume (B)**
--- | --- | ---
**L1 & L2 VS** | **HOOATS - Orderbook Internal** | **40**
 | **Bonding Curve Internal** | **14**
**Partner Routing** | **Partner Routing** | **31**
**Partner Indices** | **Partner Indices** | **15**

### 6.3 Internal Volume (B) & Trading Volume (B) by Layer

| Layer     | Internal Volume (B) | Trading Volume (B) |
|-----------|--------------------|--------------------|
| Layer 1   | 15                 | 5                  |
| Layer 2   | 17                 | 6                  |
| Layer 3   | 14                 | 16                 |
| VS Theme  | 8                  | 2                  |
| **Total** | **54**             | **31**             |

### 6.4 Trading Fee Calculation

**Partner Indices 15B Assumption**:

| Type             | Volume(B) |
|------------------|-----------|
| Partner Indices  | 15        |

**Fee Calculations**:
- **HOOATS Trading Fee (Internal)** = 40B * 0.4475% = 179.1M
- **Bonding Curve (Internal)** = 14B * 0.4475% = 62.7M
- **Partner Indices** = 15B * 0.5% = 75M
- **Partner Routing** = 31B * 0.5% = 155M

**Total Trading Revenue**: 471.7M (Protocol Revenue Only)

### 6.5 Trading Revenue Breakdown

| Sub-Category              | Amount (M) | Percentage Per Cat | Percentage Total % |
|---------------------------|-----------|-------------------|-------------------|
| HOOATS - Orderbook        | 116.4     | 24.7%            | 16.9%             |
| HOOATS - AMM              | 62.7      | 13.3%            | 9.1%              |
| Partner Indices           | 75.0      | 15.9%            | 10.9%             |
| Partner Routing           | 155.0     | 32.9%            | 22.6%             |
| **Trading Total**         | **471.7** | **68.7%**        | **68.7%**         |

---

## 7. Rebalancing Fee Revenue

**Calculation**: Calculated directly from AUM × fee × frequency. The prior AUM estimates and turnover assumptions set the notional base, ensuring that high-volatility or high-frequency indices (e.g., VS Theme, Partners) generate proportionally larger rebalancing and management revenues.

### 7.1 Rebalancing Fee Formula by Type

- **Rebalancing Fee: L1** = 5.1B(AUM) * 0.1(RB Fee) * 12(Monthly) = 61.3M
- **L2** = 2.02B * 0.1 * 26(Bi-weekly) = 52.5M
- **Partner Indices** = 0.1644B * 2% * 12 = 39.5M
- **VS Theme** = 0.0801B * 0.1% * 26 = 2.1M

### 7.2 Rebalancing Revenue Breakdown

| Sub-Category           | Amount (M) | Percentage Per Cat | Percentage % |
|------------------------|-----------|-------------------|--------------|
| L1                     | 61.2      | 39.4%            | 8.9%         |
| L2                     | 52.5      | 33.8%            | 7.6%         |
| Partner Indices        | 39.5      | 25.4%            | 5.7%         |
| VS Theme              | 1.9       | 1.2%             | 0.3%         |
| **Rebalancing Total** | **155.3** | **22.6%**        | **22.6%**    |

---

## 8. Management Fee Revenue

**Calculation**: Calculated directly from AUM × mgmt fee (yearly)

### 8.1 Management Fee Formula by Type

- **Mgmt Fee: L1** = 5.1B(AUM) * 0.7%(Mgmt Fee, yearly) = 35.7M
- **L2** = 2.02B * 0.85% = 17.2M
- **VS Theme** = 0.0801B * 1% = 0.8M
- **Partner Indices** = 0.1644B * 0.5% = 0.8M
- **L3** = 0.2423B * 1% = 2.4M

### 8.2 Management Revenue Breakdown

| Sub-Category       | Amount (M) | Percentage Per Cat | Percentage % |
|--------------------|-----------|-------------------|--------------|
| L1                 | 35.7      | 62.7%            | 5.2%         |
| L2                 | 17.2      | 30.1%            | 2.5%         |
| VS Theme           | 0.8       | 1.4%             | 0.1%         |
| Partner            | 0.8       | 1.4%             | 0.1%         |
| L3                 | 2.4       | 4.3%             | 0.3%         |
| **Mgmt Total**     | **56.8**  | **8.3%**         | **8.3%**     |

---

## 9. Total Revenue Summary

### 9.1 Final Analysis Revenue Table

| Category       | Sub-Category           | Amount (M) | Percentage Per Cat | Percentage % |
|----------------|------------------------|-----------|-------------------|--------------|
| **Trading**    | HOOATS - Orderbook     | 116.4     | 24.7%            | 16.9%        |
|                | HOOATS - AMM           | 62.7      | 13.3%            | 9.1%         |
|                | Partner Indices        | 75.0      | 15.9%            | 10.9%        |
|                | Partner Routing        | 155.0     | 32.9%            | 22.6%        |
|                | **Trading Total**      | **471.7** | **68.7%**        | **68.7%**    |
| **Rebalancing**| L1                     | 61.2      | 39.4%            | 8.9%         |
|                | L2                     | 52.5      | 33.8%            | 7.6%         |
|                | Partner Indices        | 39.5      | 25.4%            | 5.7%         |
|                | VS Theme              | 1.9       | 1.2%             | 0.3%         |
|                | **Rebalancing Total**  | **155.3** | **22.6%**        | **22.6%**    |
| **Mgmt**       | L1                     | 35.7      | 62.7%            | 5.2%         |
|                | L2                     | 17.2      | 30.1%            | 2.5%         |
|                | VS Theme              | 0.8       | 1.4%             | 0.1%         |
|                | Partner               | 0.8       | 1.4%             | 0.1%         |
|                | L3                    | 2.4       | 4.3%             | 0.3%         |
|                | **Mgmt Total**         | **56.8**  | **8.3%**         | **8.3%**     |
| **Launcher**   | Launcher Total         | 3.0       | 0.4%             | 0.4%         |
| **Total**      |                        | **686.9** | **100.0%**       | **100.0%**   |

### 9.2 Projection Rationale

We benchmarked Pump.fun's 1.25% trading fee model but intentionally designed HyperIndex to capture less protocol revenue while rewarding ecosystem participants more. Our blended protocol fee averages 0.4475%, with the difference redistributed to creators and LPs, ensuring stronger incentives for index creation and liquidity support. Referral-driven fee tiers lower protocol costs for active traders and their invitees, amplifying both retention and viral growth. Partner routing and graduated indices are priced at a flat 0.5% protocol fee, aligning incentives for institutional adoption and NAV stability.

**Turnover and AUM projections are structured around how each layer interacts with primary vs. secondary markets.** L1 and L2 maintain larger, stable AUMs with lower rebalancing intensity, while VS and Partner Indices show higher turnover due to frequent structural changes or delegated strategies. L3 contributes no primary activity under the bonding-curve model, so its AUM is inferred from secondary volumes and holding periods. This framework ensures fees are applied to realistic exposure bases while reflecting the distinct trading mechanics of each layer.

**Our rebalancing and management fee projections are grounded in ETF and DeFi benchmarks while adapted to on-chain realities.** Rebalancing is set at 0.1% per event (1.2–2.6% yearly) for L1/L2/VS and 0.3% monthly (3.9% yearly) for Partner indices, reflecting their higher turnover and complexity. Management fees scale from 0.5%–1%, with higher rates applied to riskier and meme-driven indices, and lower fees for broad or partner-managed indices. This tiered structure ensures both sustainable revenue and competitive positioning against traditional ETFs and DeFi funds.

---

## 10. Implementation Checklist

### 10.1 Constants to Define

```typescript
// VIP Tier System
export enum VIPTier {
  VIP0 = 'VIP0',
  VIP1 = 'VIP1',
  VIP2 = 'VIP2',
  VIP3 = 'VIP3',
  VIP4 = 'VIP4',
}

export const VIP_PROTOCOL_FEES = {
  VIP0: 0.006,   // 0.60%
  VIP1: 0.005,   // 0.50%
  VIP2: 0.004,   // 0.40%
  VIP3: 0.0035,  // 0.35%
  VIP4: 0.003,   // 0.30%
} as const

export const BLENDED_PROTOCOL_FEE = 0.0045 // 0.45%
export const PARTNER_ROUTING_FEE = 0.005 // 0.50%
export const PARTNER_DIRECT_CR_FEE = 0.005 // 0.50%

// Layer-specific Fees
export const LAYER_FEES = {
  L1: {
    CREATOR_FEE: 0,
    PROTOCOL_FEE_MIN: 0.003,   // 0.3% (VIP4)
    PROTOCOL_FEE_MAX: 0.006,   // 0.6% (VIP0)
    LP_FEE: 0.004,             // 0.4%
    REBALANCING_MONTHLY: 0.001, // 0.1%
    REBALANCING_FREQUENCY: 12,
    MANAGEMENT_YEARLY: 0.007,   // 0.7%
  },
  L2: {
    CREATOR_FEE: 0,
    PROTOCOL_FEE_MIN: 0.003,   // 0.3%
    PROTOCOL_FEE_MAX: 0.006,   // 0.6%
    LP_FEE: 0.004,             // 0.4%
    REBALANCING_BIWEEKLY: 0.001, // 0.1%
    REBALANCING_FREQUENCY: 26,
    MANAGEMENT_YEARLY: 0.0085,   // 0.85%
  },
  L3: {
    CREATOR_FEE: 0.004,        // 0.4%
    PROTOCOL_FEE_MIN: 0.003,
    PROTOCOL_FEE_MAX: 0.006,
    LP_FEE: 0,
    REBALANCING: 0,            // No rebalancing (bonding curve)
    MANAGEMENT_YEARLY: 0.01,   // 1%
  },
  VS: {
    CREATOR_FEE: 0,
    PROTOCOL_FEE_MIN: 0.003,
    PROTOCOL_FEE_MAX: 0.006,
    LP_FEE: 0.004,
    REBALANCING_BIWEEKLY: 0.001,
    REBALANCING_FREQUENCY: 26,
    MANAGEMENT_YEARLY: 0.01,   // 1%
  },
  PARTNER: {
    PROTOCOL_FEE: 0.005,       // 0.5% (reduced, Direct C-R)
    CREATOR_FEE: 0,
    LP_FEE: 0,
    REBALANCING_MONTHLY: 0.003, // 0.3%
    REBALANCING_FREQUENCY: 12,
    MANAGEMENT_YEARLY: 0.005,   // 0.5%
  },
  GRADUATED: {
    CREATOR_FEE_MIN: 0.0008,   // 0.08%
    CREATOR_FEE_MAX: 0.0095,   // 0.95%
    PROTOCOL_FEE_MIN: 0.003,
    PROTOCOL_FEE_MAX: 0.006,
    LP_FEE_MIN: 0.0002,        // 0.02%
    LP_FEE_MAX: 0.004,         // 0.4%
  },
} as const

// Launcher Fee
export const LAUNCHER_FEE_USD = 5 // $5 fixed per launch

// Invited User Discount
export const INVITED_USER_DISCOUNT = 0.10 // 10% base discount
```

### 10.2 Files to Update

**Core Fee Files**:
- [ ] `lib/constants/fees.ts` - Complete rewrite with new structure
- [ ] `lib/utils/fees.ts` - New calculation functions

**Components Using Fees** (6 files):
- [ ] `components/trading/quick-trade-button.tsx`
- [ ] `components/trading/trade-panel.tsx`
- [ ] `components/trading/TradingPanelSimple.tsx`
- [ ] `components/trading/confirm-modal.tsx`
- [ ] `components/trading/LiquidityModal.tsx`
- [ ] `app/launch/page.tsx`

### 10.3 New Calculation Functions

```typescript
// Get protocol fee based on VIP tier
getProtocolFee(vipTier: VIPTier): number

// Calculate trading fee with all components
calculateTradingFee(
  amount: number,
  vipTier: VIPTier,
  layer: 'L1' | 'L2' | 'L3' | 'VS' | 'PARTNER' | 'GRADUATED',
  indexType?: string
): {
  protocolFee: number
  creatorFee: number
  lpFee: number
  totalFee: number
  breakdown: FeeBreakdown
}

// Calculate rebalancing fee
calculateRebalancingFee(
  aum: number,
  layer: 'L1' | 'L2' | 'VS' | 'PARTNER',
  frequency?: number
): number

// Calculate management fee
calculateManagementFee(
  aum: number,
  layer: 'L1' | 'L2' | 'L3' | 'VS' | 'PARTNER'
): number

// Get total fee breakdown for UI display
getTotalFeeBreakdown(
  amount: number,
  vipTier: VIPTier,
  layer: string,
  includeRebalancing?: boolean,
  includeManagement?: boolean
): DetailedFeeBreakdown
```

---

## 11. Key Changes from Previous Implementation

### Previous (임시 작성):
- Simple HIIN/HIDE two-token model
- Flat 0.3% trading fee
- No VIP tier system
- No layer differentiation
- Basic fee structure

### Current (비즈니스 문서 기반):
- **VIP-tiered protocol fees** (0.3%-0.6%)
- **Layer-specific fee structure** (L1/L2/L3/VS/Partner/Graduated)
- **Creator fees** (0%-0.95% depending on layer)
- **LP fees** (0%-0.4% depending on layer)
- **Rebalancing fees** (0.1%-0.3% per event)
- **Management fees** (0.5%-1% yearly)
- **Partner routing** (0.5% reduced fee)
- **Invited user discount** (10% base)

### Action Required:
1. Remove HIIN/HIDE two-token fee structure
2. Implement VIP tier logic
3. Add layer-specific fee calculation
4. Add rebalancing fee calculation
5. Add management fee calculation
6. Update all 6 components using fees
7. Update Launch page fee display

---

**Last Updated**: 2025-10-28
**Source**: Business Documentation Slides 26-28
**Status**: Ready for Implementation
