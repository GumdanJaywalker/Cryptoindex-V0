# HyperIndex 프로젝트 종합 문서

## 프로젝트 개요

**HyperIndex**는 차세대 트레이딩 플랫폼으로, 크립토 네이티브 인덱스/ETF를 위한 올인원 허브입니다. 전통적이고 정적인 인덱스 제공자들과 달리, HyperIndex는 사용자들이 모든 형태의 인덱스를 런칭하고, 트레이딩하고, 수익화할 수 있도록 지원합니다.

---

## 핵심 기능

### 1. **무한한 인덱스 생성**
- 주요 기관 바스켓(AI, Gaming, DeFi, RWA)부터
- 커뮤니티 트렌드 기반 고변동성 밈 인덱스까지

### 2. **멀티체인 지원**
- 15개 이상의 블록체인에 걸쳐 바스켓 구성
- HyperEVM에서 인덱스 토큰으로 런칭
- DEX에서 25,000 TPS로 원활한 트레이딩

### 3. **수익 창출**
- 사용자가 자신의 인덱스 생성을 통해 수수료 수익

---

## HyperIndex가 해결하는 문제점

### 기존 문제점들
1. **복잡한 테마 포트폴리오 관리**: 분산된 체인과 DEX들
2. **높은 비용**: 높은 수수료, AMM 슬리피지, 가스 비용
3. **낮은 신뢰성**: 시장 조작과 자산 담보 없는 토큰들
4. **낮은 참여도**: 중앙화된 인덱스, 커뮤니티 없음, 매력 없는 정적 인덱스
5. **제한된 확장성**: 제한된 인덱스, 약한 생태계, 약한 트레이딩 인프라

### HyperIndex의 솔루션
1. **단일 토큰, 크로스체인 테마 노출**: 15개 이상 체인을 하나의 인덱스 토큰으로
2. **HOOATS 엔진**: 슬리피지 최적화 및 25,000+ TPS
3. **5단계 런칭 감사 및 완전 자산 담보 인덱스**: L1/L2 인덱스를 위한 보안 레이어
4. **커뮤니티 주도, 크립토 인덱스 시장의 Pump.fun**: 게임화된 플랫폼
5. **무제한 인덱스, 파트너 API 및 트레이딩 중심 인프라**

---

## 핵심 기술 아키텍처

### 1. **단일 토큰, 멀티체인 노출**

**Smart Contract Vaults (SCV)**
- 각 블록체인에 네이티브로 배포된 온체인 볼트
- 자산을 직접 이 볼트에 저장하여 중앙화된 커스터디 리스크 제거
- 최소 메커니즘이 자동으로 자산을 SCV 안팎으로 이동

**Primary vs Secondary 분리**
- **Primary Market**: 토큰 생성/환매, 자산 관리
  - L1/L2의 모든 활동, DEX 레벨의 민첩성 및 접근성
- **Secondary Market**: 트레이딩
  - HOOATS (L1/L2): 하이브리드 트레이딩 시스템, HOOATS는 AMM 간 가격 차이를 활용
  - Bonding Curve (L3): Primary와 Secondary 시장을 연결하는 직접 C-R

**Non-custodial by design**
- 소유권은 온체인, 자산이 사용자의 직접 소유로 유지
- 완전 온체인: 자산은 항상 스마트 컨트랙트 볼트 내에 저장
- 신뢰 없는 프로토콜: HyperIndex는 사용자 자금을 보유하지 않음

---

### 2. **HOOATS 엔진 심층 분석**

**Hybrid Offchain Orderbook + AMM Trading System**

#### True Limit Orders
- 실제 주문, 실제 가격 - 가짜 AMM 트리거 없음
- **False Limit Orders**: DEX 모듈에 기반, 실제 Maker Order가 아님
- **True Limit Orders**: 오프체인 오더북에 기반, True Limit Order는 Maker Order가 아님

#### Smart Router (HISR)
- 항상 최선의 실행 - 오더북 + AMM 결합
- HyperIndex Smart Router는 $100에서 $1로 재라우팅
- AMM은 $500에서 $51 가격 차이로 표시

#### Throughput & Latency
- 20K+ TPS, 밀리초 단위 실행
- 확장성을 위해, HOOATS는 초당 20K+ 트랜잭션을 목표

#### Cost & Slippage Control
- 최소 슬리피지, 최대 효율성
- **HOOATS Cost Complementarity**: 
  - AMM은 Minimal 슬리피지, 오더북은 높은 슬리피지를 가짐
  - HOOATS는 항상 오더북 매치를 우선시하여 슬리피지를 최소화
- **AMM 슬리피지를 오더북으로 최소화**

#### Institutional Features
- **Primary-Secondary Arbitrage**: NAV(Primary)와 Market Price(Secondary)의 가격 차이를 통한 차익 거래
- **Institution-Level Arbitrage Tools**: HyperIndex Vault 자동 생성/환매 도구
- **Access Model**: 직접 차익 거래는 기관 플레이어로 제한, 일반 사용자는 프리미스 볼트를 통해 접근

#### Copy-Trading Engine
- 2024년 이후 크립토 시장에서 Copy-Trading이 핵심 트렌드로 급부상
- **HyperIndex CopyTrading Tool**: 상위 트레이더와 KOL을 팔로우하고, 누구나 자신의 전략을 공개 및 공유 가능

---

### 3. **보안 표준 및 계층화된 인덱스 아키텍처**

#### Risk Scoring Engine
- 톱 홀더, 데브 홀딩, 인사이더/파운더 패턴, LP 번 등 기반 토큰 스코어링
- 신뢰도 임계값을 넘는 신뢰할 수 있는 컴포넌트만 L1/L2 공식 인덱스에 통과

#### 3-Layered Architecture
- **Layer 1**: 주요 인덱스 및 대형 카테고리 인덱스 (HOOATS Tradable)
- **Layer 2**: 주요 테마/프로토콜 + 중형 틈새/카테고리 인덱스 (HOOATS Tradable)
- **Layer 3**: 모든 것 + 파트너 DEX/플랫폼 실시간 인덱스 (Bonding Curve L3 & Direct C-R Partner)

#### Stability & Transparency
- **완전 온체인**: 모든 자산은 체인에서 검증 가능, 인덱스 토큰은 항상 완전 담보화
- **100% 투명성**: 리밸런싱 및 거버넌스 규칙은 공개, 감사 가능, 스마트 컨트랙트에 의해 강제됨

---

## 참여, 게임화 및 커뮤니티

### VS Theme Indices
- 두 테마가 맞붙음 (예: Dog vs Cat)
- 토큰 홀더들이 자신의 토큰으로 투표
- 이벤트 기반 전투로 바이럴 참여, 소셜 미디어에서 급속 커뮤니티 참여 유도

### Provocative Ticker Strategy
- 밈 테마 인덱스에만 해당 (L2, L3)
- **Layer 2**: 큐레이션되었지만 도발적 (PEPE와 거래하거나 파산)
- **Layer 3**: 와일드 및 사용자 생성

### User Direct Index Creation (L3)
- Layer 3에서 누구나 인덱스를 런칭하고 수익화 가능
- 사용자가 L2로 승급하기 위해 수수료 없이 인덱스를 생성 가능

### Governance Rebalancing
- 시간 가중 스냅샷 투표, 실시간 투표, 타임락 등을 통한 프로토콜 기반 완전 자동화 시스템
- 커뮤니티 주도 리밸런싱: 투표자는 자신의 인덱스 토큰을 질권으로 잡고 투표

### Promotion Engine
- 리더보드 및 스포일러 기능으로 가시성 향상
- Copy-Trading 기반 referrals, Highest Referral Commissions로 업계 성장 주도
- 사회적 입소문 및 게임화된 경쟁으로 빠른 도달

---

## 확장성 (생태계 및 운영)

### Cross-Chain Messaging & Aggregation
- 15개 이상 체인 전반의 단일화된 크로스체인 메시징
- 성과를 향상시키기 위한 각 체인별 온체인 SCV

### Partner Integrations & Volume Routing
- 파트너 API 및 볼륨 라우팅으로 파트너가 견적을 제공하고 모든 체인에 걸쳐 유동성 접근

### Market Makers Integration
- 지정된 MM (및 institutions) 차익 거래가 필요 시 가격을 제공하고 스프레드를 심화
- **Market Makers Incentive - Arbitrage**: 
  - 2차 시장: Market Price > NAV라면 MM은 인덱스 토큰을 L3에서 매수
  - 1차 시장: Redemption을 통해 차익 거래

### Community Flywheel & Incentives
- 사용자가 생성자 및 추천 수수료를 획득하고 거버넌스 리밸런싱에 참여
- 이벤트 및 Copy-Trading으로 커뮤니티 활동에 직접 도달, 커뮤니티 공정성 및 볼륨 증가
- 파트너는 강력한 인센티브와 수수료 분배 공유

### Ecosystem & New Markets
- HyperIndex는 단일 앱이 아니라 전체 생태계
- 인덱스 트레이딩을 카테고리로 활성화함으로써 HyperIndex는 스트럭처드 제품으로의 길을 개척
- 새로운 파트너, 제품 또는 MM의 유틸리티 증가가 단일 앱이 아닌 복합 생태계를 형성

---

## Beta Launch 계획

### Pre-seed Fundraise
진행 예정

### Closed Beta Launch
**인증된 KOL들과 함께 클로즈드 베타 런칭**

#### 런칭 범위
- ❌ **HOOATS 없이** 시작
- ✅ **AMM (TPS 개선됨) 및 Bonding Curve만 사용**
- ✅ **20개 이상의 L1 인덱스**
- ✅ **30개 이상의 L2 인덱스**
- ✅ **5개 이상의 VS 테마**
- ✅ **5개 이상의 파트너 인덱스**
- ✅ **5개 이상의 체인 커버리지**
- ✅ **인덱스용 Spot Components만 포함**

#### 보안
- ✅ **Security Audit 완료**

---

## 전체 시장 및 트레이딩 구조

HyperIndex는 다층 구조로 설계되어 있습니다:

### Primary Market
- 자산 관리 및 토큰 생성/환매
- Layer 1/2에서 모든 활동 수행
- 기관 사용자는 직접 AP 활동 가능

### Secondary Market (Trading)
- **HOOATS (L1/L2)**: 하이브리드 트레이딩 시스템
- **Bonding Curve (L3)**: Primary와 Secondary를 연결하는 직접 C-R

### Off-Chain & Aggregating Systems
- Multi-Chain Messenger
- Bonding Curves L3
- Routing Module
- On-Chain Settlement

---

## 주요 차별화 요소

1. **단순성**: 15개 이상 체인을 하나의 토큰으로 통합
2. **효율성**: HOOATS를 통한 25,000+ TPS와 최소 슬리피지
3. **보안**: 5단계 감사 및 완전 자산 담보
4. **참여도**: 게임화, VS 배틀, 커뮤니티 주도
5. **확장성**: 무제한 인덱스, 파트너 API, 강력한 생태계

---

## 결론

HyperIndex는 전통적인 DEX 트레이딩의 복잡성과 비효율성을 해결하며, 크립토 네이티브 인덱스 시장의 새로운 표준을 제시합니다. 커뮤니티 주도의 성장, 최첨단 기술, 그리고 포괄적인 생태계를 통해 인덱스 투자를 모든 사용자에게 접근 가능하고 수익성 있게 만듭니다.