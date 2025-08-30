# 실제 온체인 테스트 실행 계획
*Created: 2025-08-20*

## 📋 Overview
HyperEVM Testnet에서 실제 스왑과 Settlement를 테스트하는 단계별 계획

---

## 🎯 테스트 목표

1. **실제 온체인 스왑 실행** (USDC ↔ HYPERINDEX)
2. **Off-chain Settlement 검증**
3. **하이브리드 라우팅 실전 테스트**
4. **Gas 비용 측정**
5. **트랜잭션 확인 및 모니터링**

---

## 📝 사전 준비 사항

### 1. 지갑 설정 ✅ 필수
```bash
# .env 파일 업데이트 필요
PRIVATE_KEY=실제_개인키_입력_필요
WALLET_ADDRESS=지갑_주소

# HyperEVM Testnet 설정
HYPERVM_RPC=https://rpc.hyperliquid-testnet.xyz/evm
CHAIN_ID=998
```

### 2. 테스트넷 자산 확보
- [ ] **HYPE 토큰**: Gas비용 (최소 1 HYPE)
- [ ] **USDC 테스트 토큰**: 스왑용 (1000 USDC)
- [ ] **HYPERINDEX 토큰**: 역방향 스왑용 (선택)

### 3. Faucet 또는 토큰 획득 방법
```bash
# Option 1: HyperLiquid Discord Faucet
# Option 2: 기존 보유자에게 전송 요청
# Option 3: Testnet Bridge 사용
```

---

## 🚀 Phase 1: 기본 연결 및 잔액 확인

### Step 1.1: 지갑 연결 테스트
```javascript
// scripts/test-wallet-connection.js
const { ethers } = require('ethers');

async function checkWallet() {
  const provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid-testnet.xyz/evm');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Wallet Address:', wallet.address);
  
  // 잔액 확인
  const hypeBalance = await provider.getBalance(wallet.address);
  console.log('HYPE Balance:', ethers.formatEther(hypeBalance));
  
  // 토큰 잔액 확인
  const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
  const usdcBalance = await usdcContract.balanceOf(wallet.address);
  console.log('USDC Balance:', ethers.formatEther(usdcBalance));
}
```

### Step 1.2: 토큰 Approve 설정
```javascript
async function approveTokens() {
  // Router에 대한 USDC 승인
  const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
  const approveTx = await usdcContract.approve(ROUTER_ADDRESS, ethers.MaxUint256);
  await approveTx.wait();
  console.log('✅ USDC Approved for Router');
  
  // HYPERINDEX도 동일하게 승인
  const hyperContract = new ethers.Contract(HYPERINDEX_ADDRESS, ERC20_ABI, wallet);
  const approveTx2 = await hyperContract.approve(ROUTER_ADDRESS, ethers.MaxUint256);
  await approveTx2.wait();
  console.log('✅ HYPERINDEX Approved for Router');
}
```

---

## 💱 Phase 2: 실제 스왑 실행

### Step 2.1: 소액 테스트 스왑 (1 USDC)
```javascript
async function testSmallSwap() {
  const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, wallet);
  
  // 1. 예상 출력량 계산
  const amountIn = ethers.parseEther('1'); // 1 USDC
  const path = [USDC_ADDRESS, HYPERINDEX_ADDRESS];
  const amounts = await router.getAmountsOut(amountIn, path);
  console.log('Expected output:', ethers.formatEther(amounts[1]), 'HYPERINDEX');
  
  // 2. 실제 스왑 실행
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const minAmountOut = amounts[1] * 95n / 100n; // 5% slippage
  
  const swapTx = await router.swapExactTokensForTokens(
    amountIn,
    minAmountOut,
    path,
    wallet.address,
    deadline,
    {
      gasLimit: 300000,
      gasPrice: ethers.parseUnits('20', 'gwei')
    }
  );
  
  console.log('Transaction Hash:', swapTx.hash);
  const receipt = await swapTx.wait();
  console.log('✅ Swap completed in block:', receipt.blockNumber);
  console.log('Gas used:', receipt.gasUsed.toString());
  
  return receipt;
}
```

### Step 2.2: 중간 규모 스왑 (100 USDC)
```javascript
async function testMediumSwap() {
  // 100 USDC 스왑
  const amountIn = ethers.parseEther('100');
  // ... 동일한 로직
}
```

### Step 2.3: 대규모 스왑 테스트 (1000 USDC)
```javascript
async function testLargeSwap() {
  // 청킹 필요 여부 확인
  // 가격 영향도 측정
  // 여러 트랜잭션으로 분할 실행
}
```

---

## 🔄 Phase 3: 하이브리드 라우팅 테스트

### Step 3.1: HOOATS API를 통한 실제 스왑
```javascript
async function testHybridRouting() {
  // 1. API 서버 시작 (실제 체인 모드)
  // EXECUTE_REAL_SWAPS=true 환경변수 설정
  
  // 2. API로 주문 전송
  const order = {
    pair: 'HYPERINDEX-USDC',
    side: 'buy',
    type: 'market',
    amount: '100'
  };
  
  const response = await fetch('http://localhost:3002/api/trading/v2/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer dev-token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });
  
  const result = await response.json();
  console.log('Hybrid routing result:', result);
  
  // 3. 온체인 트랜잭션 확인
  if (result.fills) {
    for (const fill of result.fills) {
      if (fill.txHash) {
        console.log('Verifying tx:', fill.txHash);
        const receipt = await provider.getTransactionReceipt(fill.txHash);
        console.log('Block:', receipt.blockNumber, 'Status:', receipt.status);
      }
    }
  }
}
```

### Step 3.2: Orderbook + AMM 동시 처리
```javascript
async function testDualSourceRouting() {
  // 1. Orderbook에 limit 주문 배치
  // 2. Market 주문으로 부분 매칭
  // 3. 나머지를 AMM으로 처리
  // 4. 두 소스의 결과 비교
}
```

---

## 🔐 Phase 4: Settlement 테스트

### Step 4.1: Off-chain Settlement 컨트랙트 검증
```javascript
async function testSettlement() {
  const settlement = new ethers.Contract(SETTLEMENT_ADDRESS, SETTLEMENT_ABI, wallet);
  
  // 1. Operator 권한 확인
  const operator = await settlement.operator();
  console.log('Current operator:', operator);
  
  // 2. 배치 Settlement 실행 (operator인 경우)
  if (operator.toLowerCase() === wallet.address.toLowerCase()) {
    // Settlement 로직 실행
    const settleTx = await settlement.settleBatch([...]);
    await settleTx.wait();
  }
}
```

### Step 4.2: 주문 매칭 후 Settlement
```javascript
async function testOrderSettlement() {
  // 1. Off-chain에서 주문 매칭
  // 2. 매칭 결과를 Settlement 컨트랙트로 전송
  // 3. 온체인 검증 및 토큰 전송
}
```

---

## 📊 Phase 5: 성능 및 비용 분석

### Step 5.1: Gas 비용 측정
```javascript
async function measureGasCosts() {
  const tests = [
    { amount: '1', name: 'Small swap' },
    { amount: '100', name: 'Medium swap' },
    { amount: '1000', name: 'Large swap' }
  ];
  
  const results = [];
  for (const test of tests) {
    const gasUsed = await estimateSwapGas(test.amount);
    const gasPrice = await provider.getFeeData();
    const cost = gasUsed * gasPrice.gasPrice;
    
    results.push({
      ...test,
      gasUsed: gasUsed.toString(),
      costInHYPE: ethers.formatEther(cost),
      costInUSD: calculateUSDValue(cost)
    });
  }
  
  console.table(results);
}
```

### Step 5.2: 처리 시간 측정
```javascript
async function measureLatency() {
  const times = [];
  
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await router.getAmountsOut(ethers.parseEther('100'), path);
    const end = Date.now();
    times.push(end - start);
  }
  
  console.log('Average RPC latency:', average(times), 'ms');
}
```

---

## 🧪 Phase 6: 통합 테스트 스크립트

### 완전 자동화 테스트
```javascript
// scripts/full-onchain-test.js
async function runFullTest() {
  console.log('🚀 Starting Full On-chain Test');
  
  // Phase 1: Setup
  await checkWallet();
  await approveTokens();
  
  // Phase 2: Small swaps
  await testSmallSwap();
  
  // Phase 3: Hybrid routing
  await testHybridRouting();
  
  // Phase 4: Settlement
  await testSettlement();
  
  // Phase 5: Analytics
  await measureGasCosts();
  await measureLatency();
  
  console.log('✅ All tests completed!');
}
```

---

## 📈 모니터링 및 검증

### 1. Block Explorer 확인
```
https://explorer.hyperliquid-testnet.xyz/tx/{txHash}
```

### 2. 이벤트 로그 모니터링
```javascript
// Swap 이벤트 리스닝
pair.on('Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
  console.log('Swap detected:', {
    sender,
    amount0Out: ethers.formatEther(amount0Out),
    amount1Out: ethers.formatEther(amount1Out)
  });
});
```

### 3. 잔액 변화 추적
```javascript
async function trackBalances() {
  const before = await getBalances();
  // ... 스왑 실행 ...
  const after = await getBalances();
  
  console.log('Balance changes:', {
    USDC: after.usdc - before.usdc,
    HYPERINDEX: after.hyperindex - before.hyperindex,
    HYPE: after.hype - before.hype // Gas 소비
  });
}
```

---

## ⚠️ 주의사항

1. **Private Key 보안**
   - 절대 코드에 하드코딩 금지
   - .env 파일 git ignore 확인
   - 테스트넷 전용 지갑 사용

2. **Gas 관리**
   - 충분한 HYPE 확보
   - Gas price 동적 조정
   - 실패 시 재시도 로직

3. **에러 처리**
   - Revert 원인 분석
   - Slippage 조정
   - Deadline 설정

4. **테스트 데이터**
   - 모든 트랜잭션 기록
   - 성공/실패 케이스 문서화
   - Gas 비용 통계

---

## 🎯 예상 결과

### 성공 기준
- [ ] 1 USDC 스왑 성공
- [ ] 100 USDC 스왑 성공
- [ ] Gas 비용 < $0.01 per swap
- [ ] 처리 시간 < 3초
- [ ] 하이브리드 라우팅 정상 작동
- [ ] Settlement 검증 완료

### 실패 시 대응
1. Insufficient balance → Faucet 재요청
2. Gas too high → Gas price 조정
3. Slippage → minAmountOut 조정
4. RPC 오류 → 대체 엔드포인트 사용

---

## 📅 실행 일정

| 단계 | 작업 | 예상 시간 | 담당자 |
|------|------|-----------|--------|
| 1 | 지갑 설정 및 토큰 확보 | 30분 | User |
| 2 | 기본 연결 테스트 | 15분 | Auto |
| 3 | 소액 스왑 테스트 | 30분 | Auto |
| 4 | 하이브리드 라우팅 | 1시간 | Auto |
| 5 | Settlement 테스트 | 30분 | Auto |
| 6 | 결과 분석 | 30분 | Manual |

**총 예상 시간**: 3시간

---

*End of Test Plan*