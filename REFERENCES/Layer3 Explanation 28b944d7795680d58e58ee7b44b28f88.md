# Layer3 Explanation

# Layer 3

- User Launched Index
- Partner Index

## User Launch

- User Launch Tokens Explanation
    - User Launcher (Phase 0/1 - CoreLauncher, Phase 1/2~ - SCV Launcher)
    - When User Launches a Token, only Basket & Index Plans are settled. No actual basket asset purchase is held.
        - Rationale: 바스켓 구성 자산을 이 시점에 모두 구매하는 것은, Layer 3 토큰의 성장 동력을 매우 느리게 (마치 레이어1, 2처럼) 만들며, 동시에 상당한 가스비와 구조적 복잡성을 요구한다. 따라서, 이 레이어는 인덱스 생성자가 생성한 바스켓의 구성 비율과 계획을 보며, “로드맵”을 기반으로 테마에 수요가 집중될 수 있는가를 입증하는 테마 수요 입증 단계로 설정된다. Layer 3의 졸업 요건을 만족한다는 것은, 해당 테마가 시장에서 충분한 거래 수요를 가지고 있다는 것을 만족하며, 가스비와 구조적 복잡성을 감수하고서라도 트레이딩 인프라와 백 인프라를 동원할 필요성을 입증한다. 이를 바탕으로 Layer 2로 졸업하여 더 많은 거래량과 트레이딩 인프라를 지원받고, Creator (Dev)는 거래 수수료의 상당 부분(최대 80%)을 수취하여, 큰 이윤을 얻을 수 있도록 설계하여, Layer 3는 Layer 1, 2에서 얻어낼 수 없는 빠르고 큰 이익, 유저들의 바이럴을 이끌어내는 초기의 Platform Key Growth Driver 라고 생각하면 된다.

- Graduation
    - Graduation is held when these three requirements are promised.
        - Bonding Curve 판매 완료
        - Funding Round
            - Funding Round는 NAV (Basket Value)와 Price 간의 갭이 커지지 않도록, 서킷브레이크를 건 후 NAV구매를 위한 Funding을 진행하는 라운드입니다.
        - LP Round
            - Layer 2의 졸업 이후 트레이딩을 위한 Liquidity Pool 유치 라운드입니다. 상시 오픈입니다.
    - Bonding Curve를 위하여 약 10억개의 토큰이 발행됩니다. 8억개의 토큰은 본딩 커브에서 판매되며, 2억개의 토큰으로 향후 풀이 형성됩니다. Bonding Curve로 8억개가 모두 판매되면, 서킷브레이킹이 걸리고 나머지 조건들이 충족될 때 까지 가격은 고정됩니다.
        - 따라서 Funding Round를 통하여 모금해야 하는 자금은 10억개 유닛의 Basket 구매 비용이 Price *10억개 = MC = Basket NAV가 되도록 하는 것입니다.
        - LP Round 를 통하여 모금해야 하는 자본은 2억개 풀 토큰의 가격이 최종 Price 그리고 NAV와 일치하도록 되는 Pool의 자본 양을 모금합니다. 이때, HYPE부분만 모금합니다.
        - 즉, Funding Round는 AMM LP (2억개, INDEX TOKEN SIDE) + 토큰 NAV 보탬 (for 다른 사용자들)의 의미를 지니며, LP Round는 AMM LP (2억개, HYPE or USDC SIDE)의 의미를 지닙니다.
        - 따라서 Funding Round에 더 큰 인센티브를 제공해야 합니다.

- Incentives
    - Funding Round
        -