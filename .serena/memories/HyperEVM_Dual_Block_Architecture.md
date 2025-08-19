# HyperEVM Dual Block Architecture 핵심 정보

## 블록 타입
- **Small Blocks**: 1초 주기, 2M 가스, 고빈도 거래용
- **Big Blocks**: 1분 주기, 30M 가스, 대형 컨트랙트 배포용

## 전환 방법
1. LayerZero Hyperliquid Composer 사용
2. HyperLiquid 웹 인터페이스에서 수동 전환
3. 거래 시 `bigBlockGasPrice` 사용

## 우리 프로젝트 적용
- 배포 시: Big Blocks 필요 (복잡한 AMM 컨트랙트)
- 운영 시: Small Blocks로 복원 (일반 거래 효율성)
- 배치 정산: 상황에 따라 Big Blocks 사용

## 중요 고려사항
1. HyperIndexSettlement의 Stack Too Deep 에러는 이미 수정됨
2. `bytes[] calldata trades` 방식으로 단순화
3. Big Blocks는 필요시에만 사용하고 즉시 Small Blocks로 복원

## 가스 최적화
- Small Blocks: 2M 가스 제한 내 최적화 필요
- Big Blocks: 30M 가스로 복잡한 배치 처리 가능