#!/usr/bin/env node

/**
 * 🚀 Real On-chain Test Script
 * 
 * HyperEVM Testnet에서 실제 스왑 실행
 * 실제 자금으로 트랜잭션 테스트
 * 
 * ⚠️ 주의: 실제 개인키와 자금 필요
 * 
 * Created: 2025-08-20
 */

const { ethers } = require('ethers');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 컨트랙트 주소 (deployment-998-manual.json)
const ADDRESSES = {
  router: '0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A',
  pair: '0x5706084ad9Cac84393eaA1Eb265Db9b22bA63cd1',
  hyperindex: '0x6065Ab1ec8334ab6099aF27aF145411902EAef40',
  usdc: '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3',
  settlement: '0x543C050a536457c47c569D26AABd52Fae17cbA4B'
};

// 간소화된 ABI
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)"
];

class OnChainTester {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contracts = {};
    this.testResults = [];
  }

  /**
   * 초기화 및 연결
   */
  async initialize() {
    console.log('🔗 Initializing HyperEVM connection...');
    
    // Provider 설정
    this.provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid-testnet.xyz/evm');
    
    // 네트워크 확인
    const network = await this.provider.getNetwork();
    console.log(`📡 Connected to network: Chain ID ${network.chainId}`);
    
    if (network.chainId !== 998n) {
      throw new Error('Wrong network! Expected Chain ID 998');
    }
    
    // 지갑 설정
    const privateKey = process.env.PRIVATE_KEY || await this.promptPrivateKey();
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    console.log(`💳 Wallet address: ${this.wallet.address}`);
    
    // 컨트랙트 인스턴스 생성
    this.contracts.router = new ethers.Contract(ADDRESSES.router, ROUTER_ABI, this.wallet);
    this.contracts.usdc = new ethers.Contract(ADDRESSES.usdc, ERC20_ABI, this.wallet);
    this.contracts.hyperindex = new ethers.Contract(ADDRESSES.hyperindex, ERC20_ABI, this.wallet);
    this.contracts.pair = new ethers.Contract(ADDRESSES.pair, PAIR_ABI, this.wallet);
    
    console.log('✅ Initialization complete');
  }

  /**
   * 개인키 입력 프롬프트
   */
  async promptPrivateKey() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question('🔑 Enter private key (or press Enter for default test key): ', (answer) => {
        rl.close();
        resolve(answer || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
      });
    });
  }

  /**
   * 잔액 확인
   */
  async checkBalances() {
    console.log('\n💰 Checking balances...');
    
    const hypeBalance = await this.provider.getBalance(this.wallet.address);
    const usdcBalance = await this.contracts.usdc.balanceOf(this.wallet.address);
    const hyperBalance = await this.contracts.hyperindex.balanceOf(this.wallet.address);
    
    const balances = {
      HYPE: ethers.formatEther(hypeBalance),
      USDC: ethers.formatEther(usdcBalance),
      HYPERINDEX: ethers.formatEther(hyperBalance)
    };
    
    console.table(balances);
    
    // 최소 요구사항 체크
    if (hypeBalance < ethers.parseEther('0.01')) {
      console.warn('⚠️ Warning: Low HYPE balance for gas fees');
    }
    
    if (usdcBalance < ethers.parseEther('1')) {
      console.warn('⚠️ Warning: Insufficient USDC for swap tests');
      console.log('💡 Tip: Get test tokens from faucet or mint function');
    }
    
    return balances;
  }

  /**
   * 토큰 승인
   */
  async approveTokens() {
    console.log('\n🔓 Checking token approvals...');
    
    // USDC 승인 확인
    const usdcAllowance = await this.contracts.usdc.allowance(
      this.wallet.address,
      ADDRESSES.router
    );
    
    if (usdcAllowance < ethers.parseEther('1000000')) {
      console.log('📝 Approving USDC for router...');
      const approveTx = await this.contracts.usdc.approve(
        ADDRESSES.router,
        ethers.MaxUint256
      );
      console.log(`   Tx hash: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('✅ USDC approved');
    } else {
      console.log('✅ USDC already approved');
    }
    
    // HYPERINDEX 승인 확인
    const hyperAllowance = await this.contracts.hyperindex.allowance(
      this.wallet.address,
      ADDRESSES.router
    );
    
    if (hyperAllowance < ethers.parseEther('1000000')) {
      console.log('📝 Approving HYPERINDEX for router...');
      const approveTx = await this.contracts.hyperindex.approve(
        ADDRESSES.router,
        ethers.MaxUint256
      );
      console.log(`   Tx hash: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('✅ HYPERINDEX approved');
    } else {
      console.log('✅ HYPERINDEX already approved');
    }
  }

  /**
   * 스왑 견적 계산
   */
  async getSwapQuote(tokenIn, tokenOut, amountIn) {
    const path = [
      tokenIn === 'USDC' ? ADDRESSES.usdc : ADDRESSES.hyperindex,
      tokenOut === 'USDC' ? ADDRESSES.usdc : ADDRESSES.hyperindex
    ];
    
    const amounts = await this.contracts.router.getAmountsOut(
      ethers.parseEther(amountIn.toString()),
      path
    );
    
    return {
      amountIn: ethers.formatEther(amounts[0]),
      amountOut: ethers.formatEther(amounts[1]),
      price: parseFloat(amounts[0]) / parseFloat(amounts[1]),
      path: path
    };
  }

  /**
   * 실제 스왑 실행
   */
  async executeSwap(tokenIn, tokenOut, amountIn, slippage = 0.05) {
    console.log(`\n💱 Executing swap: ${amountIn} ${tokenIn} → ${tokenOut}`);
    
    // 1. 견적 계산
    const quote = await this.getSwapQuote(tokenIn, tokenOut, amountIn);
    console.log(`   Expected output: ${quote.amountOut} ${tokenOut}`);
    console.log(`   Price: ${quote.price.toFixed(6)} ${tokenIn}/${tokenOut}`);
    
    // 2. 최소 출력량 설정 (슬리피지 고려)
    const minAmountOut = ethers.parseEther(
      (parseFloat(quote.amountOut) * (1 - slippage)).toString()
    );
    console.log(`   Min output (${slippage*100}% slippage): ${ethers.formatEther(minAmountOut)}`);
    
    // 3. 스왑 실행
    const deadline = Math.floor(Date.now() / 1000) + 600; // 10분
    
    console.log('📤 Sending transaction...');
    const swapTx = await this.contracts.router.swapExactTokensForTokens(
      ethers.parseEther(amountIn.toString()),
      minAmountOut,
      quote.path,
      this.wallet.address,
      deadline,
      {
        gasLimit: 300000,
        gasPrice: ethers.parseUnits('20', 'gwei')
      }
    );
    
    console.log(`   Tx hash: ${swapTx.hash}`);
    console.log('⏳ Waiting for confirmation...');
    
    const receipt = await swapTx.wait();
    
    console.log('✅ Swap completed!');
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`   Gas cost: ${ethers.formatEther(receipt.gasUsed * receipt.gasPrice)} HYPE`);
    
    // 4. 이벤트 파싱
    const swapEvent = receipt.logs.find(log => {
      try {
        return this.contracts.pair.interface.parseLog(log)?.name === 'Swap';
      } catch {
        return false;
      }
    });
    
    if (swapEvent) {
      const parsed = this.contracts.pair.interface.parseLog(swapEvent);
      console.log('📊 Swap event details:', {
        sender: parsed.args[0],
        amountOut: ethers.formatEther(parsed.args[3] || parsed.args[4])
      });
    }
    
    return receipt;
  }

  /**
   * AMM 리저브 확인
   */
  async checkReserves() {
    console.log('\n🌊 Checking AMM reserves...');
    
    const reserves = await this.contracts.pair.getReserves();
    
    console.log('Pair reserves:');
    console.log(`   Reserve0: ${ethers.formatEther(reserves[0])}`);
    console.log(`   Reserve1: ${ethers.formatEther(reserves[1])}`);
    console.log(`   Last update: Block ${reserves[2]}`);
    
    return reserves;
  }

  /**
   * 종합 테스트 실행
   */
  async runFullTest() {
    console.log('=' .repeat(70));
    console.log('🚀 HOOATS Real On-chain Test Suite');
    console.log('=' .repeat(70));
    
    try {
      // 1. 초기화
      await this.initialize();
      
      // 2. 잔액 확인
      const balances = await this.checkBalances();
      
      // 3. 리저브 확인
      await this.checkReserves();
      
      // 4. 토큰 승인
      await this.approveTokens();
      
      // 5. 소액 테스트 스왑 (사용 가능한 잔액이 있을 때만)
      if (parseFloat(balances.USDC) >= 1) {
        console.log('\n📌 Test 1: Small swap (1 USDC)');
        const receipt1 = await this.executeSwap('USDC', 'HYPERINDEX', '1');
        this.testResults.push({
          test: 'Small swap',
          amount: '1 USDC',
          success: true,
          txHash: receipt1.hash,
          gasUsed: receipt1.gasUsed.toString()
        });
      } else {
        console.log('\n⚠️ Skipping swap test: Insufficient USDC balance');
      }
      
      // 6. 역방향 스왑 테스트
      if (parseFloat(balances.HYPERINDEX) >= 1) {
        console.log('\n📌 Test 2: Reverse swap (1 HYPERINDEX)');
        const receipt2 = await this.executeSwap('HYPERINDEX', 'USDC', '1');
        this.testResults.push({
          test: 'Reverse swap',
          amount: '1 HYPERINDEX',
          success: true,
          txHash: receipt2.hash,
          gasUsed: receipt2.gasUsed.toString()
        });
      }
      
      // 7. 최종 잔액 확인
      console.log('\n📊 Final balances:');
      await this.checkBalances();
      
      // 8. 결과 요약
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    }
  }

  /**
   * 결과 요약 출력
   */
  printSummary() {
    console.log('\n' + '=' .repeat(70));
    console.log('📊 Test Results Summary');
    console.log('=' .repeat(70));
    
    if (this.testResults.length > 0) {
      console.table(this.testResults);
      
      const successCount = this.testResults.filter(r => r.success).length;
      console.log(`\n✅ Success rate: ${successCount}/${this.testResults.length}`);
      
      // 총 가스 사용량
      const totalGas = this.testResults.reduce((sum, r) => {
        return sum + BigInt(r.gasUsed || 0);
      }, 0n);
      console.log(`⛽ Total gas used: ${totalGas.toString()}`);
      
      // 트랜잭션 링크
      console.log('\n🔗 Transaction links:');
      this.testResults.forEach(r => {
        if (r.txHash) {
          console.log(`   ${r.test}: https://explorer.hyperliquid-testnet.xyz/tx/${r.txHash}`);
        }
      });
    } else {
      console.log('⚠️ No tests were executed');
    }
    
    console.log('\n🎉 Test suite completed!');
    console.log('=' .repeat(70));
  }
}

// 메인 실행
async function main() {
  const tester = new OnChainTester();
  
  // 안전 확인
  console.log('⚠️ WARNING: This will execute REAL transactions on HyperEVM testnet');
  console.log('Make sure you have:');
  console.log('  1. Test HYPE tokens for gas');
  console.log('  2. Test USDC/HYPERINDEX tokens');
  console.log('  3. Correct private key in .env');
  console.log('');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Continue? (y/n): ', async (answer) => {
    rl.close();
    
    if (answer.toLowerCase() === 'y') {
      await tester.runFullTest();
    } else {
      console.log('Test cancelled');
    }
    
    process.exit(0);
  });
}

// 실행
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { OnChainTester };