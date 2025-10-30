# HyperIndex Labs & Foundations Investing Projection

생성 일시: 2025년 10월 23일 오전 2:19
생성자: HyunSu Choi
최종 편집 일시: 2025년 10월 24일 오전 1:29
최종 편집자: HyunSu Choi
파일과 미디어: HyperIndex%20Labs%20&%20Foundations%20Investing%20Projection/HyperIndex_Investment_Labs_And_Tokens.xlsx

# HyperIndex Labs & Foundation Investing Projection Overview

*Version 1.0 — Draft for Internal Review*

*Confidential | For internal modeling and partner due diligence only.*

---

# I. Executive Summary

## **Purpose & Scope**

- 본 문서는 HyperIndex Labs의 지분 구조(Equity) 및 토큰 할당(Token Allocation)을 통합적으로 시뮬레이션하기 위한 Projection Tool의 개요와 가정을 설명합니다.

이 문서는 확정된 재무 데이터가 아니라, 가정 기반의 예시 모델로 작성되었습니다.

이 조건은 Initial한 제안 조건에 해당하며, VC 및 파트너사들과의 협의 하에 충분히 변경될 수 있는 구조이며, 계약별 변경 사항은 이 문서에 기재되지 않습니다. 문서에 업데이트될 수 있지만, 그것이 모든 다른 계약조건의 변경을 의미하지 않고, 전혀 법적 효력이 없습니다. 이 문서는 오로지 참고용입니다.

## **Context within the HyperIndex Ecosystem**

- HyperIndex Ecosystem은 HyperIndex Labs(개발사), HyperIn Foundation(인덱스 DAO 파운데이션), HyperDEX Foundation(DEX DAO 파운데이션), 그리고 각 Foundation의 SPV Holdings, 총 5개의 주체로 구성되어 있습니다.

**Intended Audience**

- 이 문서는 투자자, 파트너, 내부 경영진 및 법률/회계 검토자를 위한 참조 문서입니다. 외부에 유출하는 경우, 유출에 따른 회사들(Labs, Foundations, Holdings)의 잠재적 손실 및 피해에 대한 사법적 책임을 포괄적으로 청구할 수 있습니다. 이 문서는 참조적 효력만을 지니므로, 사법적 혹은 계약에 대한 효력과 근거로 작용하지 않습니다.

---

## II. Entity & Structural Overview

### Corporate Entities & Roles

- **HyperIndex Labs** — Protocol development, maintenance, and operational support.
- **HyperIn Foundation** — Index Protocol, Governance, DAO treasury, and Index Token oversight.
- **HyperDEX Foundation** — DEX Protocol, DEX operations, liquidity, and trading protocol governance.
- Holdings — SPV of foundations, executes all of commercial & profit-related activities including TGE sales, OTC, Listing Contracts & Option Contracts.

### Legal Separation & Operational Boundaries

- HyperIn 및 HyperDEX Foundation, Holdings은 HyperIndex Labs와 상호 독립된 법인체이며, 지분 또는 의결권을 교차 소유하여 설립되지 않았습니다. 향후 옵션 계약의 이행으로 지분 및 의결권을 매입할 수 있지만 (Holdings가 Labs의 지분을 매입할 수 있습니다.), 이는 DAO의 명령 및 주주<>외부법인 간 독립적 계약에 의한 것입니다. Option 계약, Token Allocation, 할인구매 등은 Holdings와 직접 체결되는 계약으로, Labs는 이에 관여하지 않습니다.

### Relationships Between Entities

각 객체들 간의 관계구조도는 아래 그림을 통하여 쉽게 이해할 수 있습니다.

![image.png](HyperIndex%20Labs%20&%20Foundations%20Investing%20Projection/image.png)

- HyperIndex Labs와 Foundation의 구분은 아래 두 슬라이드와 같이할 수 있습니다. (Uzbekistan IT Park에게 2025년 10월 제출한 HyperIndex_ITPark_Fit_Deck_v1.pdf의 2025년 10월 23일 버전을 기준으로 합니다)

![image.png](HyperIndex%20Labs%20&%20Foundations%20Investing%20Projection/image%201.png)

![image.png](HyperIndex%20Labs%20&%20Foundations%20Investing%20Projection/image%202.png)

아래 표는 큰 세 엔티티의 역할과 상세한 구분을 위한 표입니다.

| Entity | HyperIndex Labs | Foundations (HyperIn / HyperDEX) | Foundation Holdings (SPV) |
| --- | --- | --- | --- |
| Legal Type | For-profit Company (DevCo) | Non-profit Foundation | For-profit Subsidiary (SPV / Ltd) |
| Profitability | Profitable | Non-profit | Profitable |
| Primary Role | Protocol Development, Maintenance, Web-app Front Operator, Technical Service Provider | DAO Representation, Governance Execution, Token Generation (TGE), Treasury & Grant Management | Commercial Execution Arm for the Foundation (Token Sales, OTC, Buybacks, Treasury Operations) |
| Fundraising (VC / KOLs) | Yes, by Equity Investment (SAFE, Convertible Note, Preferred Shares) | No, Non-profit cannot raise capital | Yes, by Token Sales / Private Rounds (Discounted Token Allocation) |
| Token Issuance (TGE) | No, Technical support only | Yes, Issuer & Allocator of Tokens | Indirect, Executes sales and listings under Foundation authorization |
| Token Allocation | Cannot allocate directly | Can allocate tokens to DAO Treasury, Labs, Investors, Ecosystem | Can distribute and sell allocated tokens commercially |
| Equity Management | Issues shares to investors | Cannot hold or trade shares | May hold Labs equity acquired via Put/Call or DAO instructions |
| Contracting Power | Full commercial contracting capacity | Limited — Non-commercial contracts only | Full commercial contracting capacity (Token sales, OTC, Listings etc.) |
| Governance Link | Operates under commercial agreement with Foundation / DAO | Governed by DAO / Foundation Charter, Executes Non-Commercial DAO Activities | Executes DAO / Foundation-approved transactions |
| Tax Status | Taxable | Tax-exempt / Non-profit | Taxable (Commercial activity) |
| Examples of Activities | - Protocol R&D
- Web Front Maintenance
- API/SDK Dev
- Infrastructure Operations | - DAO Treasury oversight
- Token issuance
- Governance operations
- Grants & funding allocation | - Token private/public sales
- OTC deals
- Treasury management
- Option execution |
| Ownership Structure | Privately owned by Founders & Investors | Independent, no shareholders | 100% owned by respective Foundation |
| Relationship Summary | “Engine & Developer” | “Brain & Governance” | “Hands & Executor” |

위 표는 HyperIndex Labs <> Foundation <> Holdings 간 명확한 법적, 역할적 차이를 구분합니다. 따라서, 모든 Equity Fund Raising은 HyperIndex Labs(이하 Labs)를 기준으로 진행되며, Token Allocation은 HyperIn / HyperDEX Foundation (이하 Foundations)을 통하여, Token Discount 구매는 HyperIn / HyperDEX Foundation Holdings (이하 Holdings)로부터 진행되는 독립적이고 상호 배타적인 계약입니다. 또한, 이후 언급되는 Equity Put Option 계약 역시 HyperIndex Labs와 무관하게 Equity Holders <> Holdings간 체결하는 계약입니다.

---

## III Projection Framework

### Nature of the Document

- 본 문서는 재무적·토큰적 추정치를 기반으로 한 시뮬레이션 도구이며, 실제 결과와 다를 수 있습니다. 모든 수치 및 계약 조건들은 세부적인 계약 논의사항 및 조정치에 따라 다르게 작용하며, 문서의 수치와 크게 괴리될 수 있습니다. 모든 파트너들은 독립적이고 특별한 계약 조건을 부여받을 수 있고, 계약 및 주식의 세부 조항은 유동적으로 조정 가능합니다.

### Calculation Methodology Overview

- **Valuation Method:**
    - Valuation Method는 Post-Money를 기준으로 합니다.
        - Round별 Valuation은 Post-Money 기준 Valuation입니다.
            - e.g.
            
            | Round | Pre-Seed | Seed |
            | --- | --- | --- |
            | Valuation | $5,000,000 | $12,000,000 |
            | Raise Amount | $500,000 | $3,000,000 |
            | Round Equity Acquired (Investor) | 10% | 25% |
- **ESOP Pool Treatment:**
    - ESOP Pool은 매 라운드 Post-Money 10%기준으로 Refill 되는 것을 원칙으로 합니다. 또한, 이전 라운드에서 10% 풀을 모두 소진한 것을 가정합니다. 이 소진량은 직원들 및 인재 영입에 사용되는 것으로 가정하여, Founders 지분에 가산하지 않았습니다. 다만, 가산이 불가능한 것은 아니며, 가산될 시에 Founders의 지분률은 더욱 높아질 수 있습니다. 라운드에 ESOP Pool이 모두 소진되지 않으면, 라운드 모집 이후 10%가 되도록 남은 잔여분량만 리필합니다.
    - 매 라운드 진행 순서는 다음과 같습니다.
        - Pre-Round Equity Check
            - 라운드 시작 전 Holder들의 지분상태를 점검합니다.
        - Post-Money Valuation Confirmed, Fundraising Amount Confirmed
        - ESOP Refill
            - ESOP 풀을 Post-Money 기준으로 10%가 되도록, 미리 리필합니다.
        - Fundraise
            - Equity Investing을 통한 Fundraising이 진행됩니다. Post-Money 기준으로 합의된 지분률을 취득하는 신주 발행이 이행됩니다.
        - e.g. Founder Equity Dilution Example
            
            
            | Step | Previous Round Equity Holding | Dilution |
            | --- | --- | --- |
            | Equity Check | Founder 70%, ESOP Leftover 0% | - |
            | Post-Money Valuation & Fundraising Amount Confirmed ($10M, 15% Equity Raise) | Founder 70%, ESOP Leftover 0% | - |
            | ESOP Refill | Founder ≈61.76%, ESOP Leftover ≈11.76% | ≈88.24%  |
            | Fundraised | Founder ≈52.5%, ESOP Leftover 10%, Investors 15% | ≈85% |
        
- **SAFE / Convertible Note:**
    - Pre-Seed 단계는 SAFE 투자 형태로 유치되며, 밸류캡(Valuation Cap) 또는 할인율(Discount Rate)을 기준으로 **Series A 시점에서 자동 전환(Equity Conversion)** 됩니다.
    
    **공식:**
    
    $$
    
    \text{Conversion Price} = min\!\left(
        \frac{\text{Valuation Cap}}{\text{Fully Diluted Shares}},
        \ \text{Series A Price} \times (1 - \text{Discount})
    \right)
    
    $$
    
    SAFE 투자자의 전환 후 지분율:
    
    $$
    \text{Ownership} = \frac{\text{Investment}}{    \text{Conversion Price} \times \text{Total Shares (Post)}}
    $$
    
    • SAFE 전환 이후, 해당 지분은 Series A 투자자와 동일한 **Preferred Class**로 재분류됩니다.
    
- **Put Option Logic:**
    - Put Option은 Foundation Holdings와 Equity Investor 간의 별도 계약이며, 특정 KPI 달성 시점에서 Foundation Holdings에게 Labs지분을 정해진 가격으로 매도할 수 있는 옵션 계약입니다. 이는 투자자에게 Equity 차원에서 ROI Downfall Barrier 를 제공하는 효과를 지닙니다. Protocol의 성장이 진행된다면, Token 차원뿐 아니라 고정된 값으로 Equity를 처리할 수 있는 방안을 제공하는 셈입니다.
    - 공식:
    
    $$
    Exit Amount=Investment×ROI Multiple (Conditional on KPI)
    $$
    
    - KPI 조건(예시):
        - DAO Treasury NAV ≥ $20M
        - Protocol Revenue ≥ $5M
        - TGE Completion & Circulating Token Cap ≥ 60%
    - KPI 미달성 시, Put Option은 **무효(Non-exercisable)** 상태로 남습니다.
    - 엑셀의 모델링은 **ROI Multiple (Put Option Factor)** 값을 시뮬레이션 가능하게 설계했습니다.
        
        예: 1.5x, 2.0x, 3.0x, 4.5x 등
        
    - Put Option의 ROI와 KPI는 계약 시점, 계약 규모에 따라 매우 상이하므로, 각 주체들과 Holdings의 계약에 전적으로 따릅니다. 그러나 기본적으로 라운드가 앞선 라운드일수록, 라운드 전체 금액 중 Lead 투자자의 비용규모가 클수록, ROI는 높아지고 KPI는 낮아지는 구조로 조건이 설정됩니다.
    
- **Token Allocation Integration:** Foundation별 TGE 및 Token Utility 연결 방식
    - TGE & Tokenomics에 대해서는 다음 문서를 참조하시길 바랍니다.
    
    **연계 계산:**
    
    $$
    \text{Investor Token Value} = {\text{Token Supply}}\times {\text{Allocation}}\%\times{\text{Token Price}}\times{{(1-Discount)}}\times{{Unlocked}}\%
    $$
    
    $$
    \text{Token ROI (x)} = \frac{\text{Realized Token Value (Market Price)}}{    \text{Token Purchase Cost}}
    $$
    
    - Token ROI는 Equity ROI와 별도로 계산되지만,
        
        최종 **Integrated ROI (Total Return)** 에서 합산됩니다.
        
- Integration Logic: Equity ROI와 Token ROI는 병렬 계산 후 통합됩니다.
    - 이 모델은 **투자자별, 라운드별, KPI별** ROI 민감도 분석이 가능하도록 설계되었습니다.
        
        **Key Adjustable Parameters:**
        
        - Pre/Post-Money Valuation per Round
        - ESOP Ratio
        - SAFE Discount / Cap
        - Put Option Multiple
        - TGE Price / Unlock % / Sell %

$$
\text{{Total ROI (x)}} =
\frac{\text{{Equity Exit Value + Token Exit Value}}}{\text{{Total Investment}}}
$$

- **Scenario & Simulation Features**
    - 각 주요 변수(Valuation, Token Price 등)를 조정해 Equity 및 Token Return 변화를 실시간으로 시뮬레이션 할 수 있습니다.
    - 이 Projection Tool은 투자 라운드 전체 ROI 흐름(Pre-Seed → Series C)을 시각화하며, 각 단계별 **Founder, Investor, Treasury의 Fully-Diluted Ownership**을 동시에 추적합니다.

- **Accounting & Compliance Considerations**
    - 모든 Token 관련 매출(Private Sale 등)은 **Holdings 회계로 처리**, DAO Treasury 송금 시 **Grant / Transfer**로 재분류됩니다.
    - Equity 투자 유치(VC, SAFE 등)는 **Labs 회계로 인식**, Token 거래와 완전히 분리되어 관리됩니다.
    - Foundation은 비영리 주체로 **직접 매출 인식 불가**, 단, TGE 발행 및 DAO Allocation은 **비상업적 행위**로 회계상 허용됩니다.

---

## IV. Equity Structure Simulation

### Founders, ESOP, and Investors Overview

- Founders & Team의 지분은 처음 5인 100%로 시작하여, 향후 Contribution Tech Team의 증가 및 추가 인력 영입에 따라 변동합니다.
    - 추가 인력 영입 및 보상에는 ESOP가 활용될 수 있으며, 이 과정에서 Founders & Team의 지분은 Round가 진행됨에 따라 희석되는 동시에 증가할 수 있습니다.
        - 기존 홀딩 지분은 희석
        - 새롭게 부여되는 ESOP Pool 지분은 증가
- ESOP 풀은 매 라운드 Post-Money 기준 10%로 리필되며, Fund Raise를 위한 신주 발행 이전에 Refill됩니다.
- 따라서 Founders 및 기존 발행 주식들의 지분 희석은 ESOP Refill로 1차례, Fund Raise로 2차적으로 진행되며, ESOP 풀의 지분 희석은 Fund Raise로 1차례 진행되어 10%가 됩니다.

### Round-by-Round Dilution Model Example - Founders & Team

- ESOP 모두 소진한다고 가정

| Round | Value (Cap min) | Equity % | ESOP Refill (Post-Money) | ESOP Refill
(Pre-Money) | Round Raising | Dilution Formula |
| --- | --- | --- | --- | --- | --- | --- |
| Pre-Seed | $          5,000,000 | 80.00% | 10% | ≈ 11.11% | 10% | =100%*(1-10%)*(1-(10%/(1-10%))) |
| Seed | $         15,000,000 | 60.00% | 10% | ≈11.76% | 15% | =80%*(1-15%)*(1-(10%/(1-15%))) |
| Series-A | $         40,000,000 | 46.20% | 10% | ≈11.49% | 13% | =60%*(1-13%)*(1-(10%/(1-13%))) |
| Series-B | $         70,000,000 | 35.11% | 10% | ≈11.63% | 14% | =46.20%*(1-14%)*(1-(10%/(1-14%))) |
| Series-C | $       240,000,000 | 27.04% | 10% | ≈11.49% | 13% | =27.04%*(1-13%)*(1-(10%/(1-13%)))  |

### Put Option & ROI Simulation

Put Option은 HyperIndex Labs의 모든 Equity 주식에 기본적으로 계약 체결될 수 있습니다. 다만 이는 HyperIndex Labs와의 계약이 아닌, HyperIndex Holdings와의 계약으로 체결되며, HyperIn / HyperDEX Protocol의 KPI, Treasury의 KPI 등 상세한 DAO / Foundation / Holdings의 KPI를 기준으로 유효하게 발동됩니다. Put Option은 어느 스테이지에서든지 유효해질 수 있으며, 해당 스테이지에서의 Equity Valuation과 Token FDV 가정에 따라서 Option 행사 /미행사 ROI는 변화합니다.

주로 투자 이후 초기 스테이지들에서는 옵션을 행사할 수 있다면 행사하는 것이 유리하며, 장기적으로 투자가 이어질수록 옵션은 Valuation 하락 및 DownRound에 대한 배리어와 대비책으로 사용되는 수단으로 작용합니다.

### Round-by-Round Put Option & ROI Simulation Example - Seed Investor

| Round | Value (Cap min) | Equity % | Equity Value | Token FDV | Token Allocation | Token Value | Option ROI | Option Value | ROI (Abs, Opt) | ROI (Abs, NoOpt) | ROI % (Opt) | ROI % (NoOpt) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pre-Seed |  |  |  |  |  |  |  |  |  |  |  |  |
| Seed | $         15,000,000 | 15.00% | $    2,250,000 | $   180,000,000 | 3% | $    5,400,000 | 2.5 | $     5,625,000 | $     11,025,000 | $           7,650,000 | ***490.0%*** | 340.0% |
| Series-A | $         40,000,000 | 11.55% | $    4,620,000 | $   600,000,000 | 3% | $  18,000,000 |  | $     5,625,000 | $     23,625,000 | $         22,620,000 | ***1050.0%*** | 1005.3% |
| Series-B | $         70,000,000 | 8.78% | $    6,144,600 | $ 1,200,000,000 | 3% | $  36,000,000 |  | $     5,625,000 | $     41,625,000 | $         42,144,600 | 1850.0% | ***1873.1%*** |
| Series-C | $       240,000,000 | 6.76% | $  16,221,744 | $ 2,000,000,000 | 3% | $  60,000,000 |  | $     5,625,000 | $     65,625,000 | $         76,221,744 | 2916.7% | ***3387.6%*** |

---

## 5️⃣ Token Allocation Model

### Foundation-Level Token Logic

✏️ HyperIn 및 HyperDEX의 독립적 TGE 발행 구조 설명

(DAO Treasury → Market Circulation 흐름 포함)

### Token Distribution Assumptions

| Category | Allocation % | Lockup | Vesting | Notes |
| --- | --- | --- | --- | --- |
| Team (Labs) | 15% | 12mo | 24mo | Contributor allocation |
| Investors | 20% | 6mo | 18mo | Private sale / SAFE-linked |
| Community | 25% | - | - | Staking / Reward |
| Treasury | 40% | - | DAO-controlled |  |

### Option & Discount Clauses

✏️ Token Purchase Option이 투자계약과 분리되어 Foundation과 직접 체결됨을 명시

### TGE ROI Projection

✏️ TGE Price, Discount %, Unlock %, Sell % 등의 변수 기반 계산 설명

---

## 6️⃣ Integrated Projection Summary

### Combined ROI Model

✏️ Equity ROI + Token ROI의 통합 수익 시뮬레이션 개요

(표나 그래프로 Founder / Investor / Treasury ROI 추이 시각화 가능)

### Scenario Testing Guidance

✏️ 주요 변수 (Valuation, ESOP %, ROI, Token Price) 변경 시 영향 예시

### Key Sensitivity Variables

- Valuation Cap
- ESOP Refill Ratio
- Put Option Multiple
- Token ROI Factor
- TGE Unlock %

---

## 7️⃣ Disclaimers & Legal Notes

### Disclaimer Summary

> This document and the accompanying spreadsheet are illustrative projection tools.
> 
> 
> All data are **non-binding, hypothetical, and subject to change** without notice.
> 
> Nothing herein constitutes an investment offer or legal commitment.
> 

### Legal Separation Statement

> The HyperIn Foundation and HyperDEX Foundation are independent legal entities,
> 
> 
> fully separated from **HyperIndex Labs** with no cross-ownership or voting rights.
> 
> All option or token-related contracts are executed directly between investors and the Foundations.
> 

### Regulatory Awareness Note

✏️ 관련 규제(증권성, DAO 거버넌스, 세무, AML 등)에 대한 주의사항 추가

---

## 8️⃣ Appendix

### Glossary of Key Terms

- **Pre-money / Post-money** — 투자 전후 밸류에이션 정의
- **ESOP** — Employee Stock Option Pool
- **SAFE / Convertible Note** — 전환형 투자계약
- **Put Option** — Foundation KPI 충족 시 Buyback 옵션
- **FD (Fully Diluted)** — 잠재 희석 반영 지분율

### Reference Tables

✏️ Projection Tool 주요 시트 설명 / 시나리오 예시 / 수식 요약

### Version History

| Version | Date | Author | Notes |
| --- | --- | --- | --- |
| 1.0 | 2025-10-23 | HyperIndex Labs | Initial Draft |

---

## 📘 Notes

> This document accompanies the Excel file
> 
> 
> **“HyperIndex_Investment_Labs_And_Tokens.xlsx”**,
> 
> and should be read in conjunction with it for accurate interpretation of the projection logic.
> 

## IV. Integrated Projection Summary

### Combined ROI Model

Equity ROI + Token ROI의 통합 수익 시뮬레이션 개요

(표나 그래프로 Founder / Investor / Treasury ROI 추이 시각화 가능)

### Scenario Testing Guidance

주요 변수 (Valuation, ESOP %, ROI, Token Price) 변경 시 영향 예시

### Key Sensitivity Variables

- Valuation Cap
- ESOP Refill Ratio
- Put Option Multiple
- Token ROI Factor
- TGE Unlock %

---

## V. Disclaimers & Legal Notes

### Disclaimer Summary

> This document and the accompanying spreadsheet are illustrative projection tools.
> 
> 
> All data are **non-binding, hypothetical, and subject to change** without notice.
> 
> Nothing herein constitutes an investment offer or legal commitment.
> 

### Legal Separation Statement

> The HyperIn Foundation and HyperDEX Foundation are independent legal entities,
> 
> 
> fully separated from **HyperIndex Labs** with no cross-ownership or voting rights.
> 
> All option or token-related contracts are executed directly between investors and the Foundations.
> 

### Regulatory Awareness Note

✏️ 관련 규제(증권성, DAO 거버넌스, 세무, AML 등)에 대한 주의사항 추가

---

## 8️⃣ Appendix

### Glossary of Key Terms

- **Pre-money / Post-money** — 투자 전후 밸류에이션 정의
- **ESOP** — Employee Stock Option Pool
- **SAFE / Convertible Note** — 전환형 투자계약
- **Put Option** — Foundation KPI 충족 시 Buyback 옵션
- **FD (Fully Diluted)** — 잠재 희석 반영 지분율

### Reference Tables

✏️ Projection Tool 주요 시트 설명 / 시나리오 예시 / 수식 요약

### Version History

| Version | Date | Author | Notes |
| --- | --- | --- | --- |
| 1.0 | 2025-10-23 | HyperIndex Labs | Initial Draft |

---

## 📘 Notes

> This document accompanies the Excel file
> 
> 
> **“HyperIndex_Investment_Labs_And_Tokens.xlsx”**,
> 
> and should be read in conjunction with it for accurate interpretation of the projection logic.
>