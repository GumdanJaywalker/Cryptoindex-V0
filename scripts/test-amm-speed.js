#!/usr/bin/env node

/**
 * 🔍 AMM Swap Speed Test
 * 
 * 실제 온체인 AMM 스왑의 정확한 속도 측정
 * Quote부터 실행까지 각 단계별 시간 측정
 * 
 * Created: 2025-08-20
 */

const { ethers } = require('ethers');
require('dotenv').config();

// 컨트랙트 주소
const ADDRESSES = {
  router: '0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A',
  usdc: '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3',
  hyperindex: '0x6065Ab1ec8334ab6099aF27aF145411902EAef40'
};

const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

class AMMSpeedTester {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid-testnet.xyz/evm');
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.router = new ethers.Contract(ADDRESSES.router, ROUTER_ABI, this.wallet);
  }

  /**
   * Quote 속도 측정
   */
  async measureQuoteSpeed(iterations = 10) {
    console.log(`📊 Measuring AMM Quote Speed (${iterations} iterations)...\n`);
    
    const times = [];
    const path = [ADDRESSES.usdc, ADDRESSES.hyperindex];
    const amountIn = ethers.parseEther('100'); // 100 USDC
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        await this.router.getAmountsOut(amountIn, path);
        const end = performance.now();
        const time = end - start;
        times.push(time);
        console.log(`Quote ${i + 1}: ${time.toFixed(2)}ms`);
      } catch (error) {
        console.error(`Quote ${i + 1} failed:`, error.message);
      }
    }
    
    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      console.log('\n📈 Quote Speed Statistics:');
      console.log(`  Average: ${avgTime.toFixed(2)}ms`);
      console.log(`  Min: ${minTime.toFixed(2)}ms`);
      console.log(`  Max: ${maxTime.toFixed(2)}ms`);
      console.log(`  Std Dev: ${this.calculateStdDev(times).toFixed(2)}ms`);
      
      return {
        average: avgTime,
        min: minTime,
        max: maxTime,
        samples: times.length
      };
    }
    
    return null;
  }

  /**
   * 실제 스왑 속도 측정 (소액)
   */
  async measureSwapSpeed() {
    console.log('\n💱 Measuring Actual Swap Speed...\n');
    
    const amountIn = ethers.parseEther('0.1'); // 0.1 USDC (소액)
    const path = [ADDRESSES.usdc, ADDRESSES.hyperindex];
    
    // 1. Quote 시간
    const quoteStart = performance.now();
    const amounts = await this.router.getAmountsOut(amountIn, path);
    const quoteEnd = performance.now();
    const quoteTime = quoteEnd - quoteStart;
    
    console.log(`📋 Quote time: ${quoteTime.toFixed(2)}ms`);
    console.log(`📋 Expected output: ${ethers.formatEther(amounts[1])} HYPERINDEX`);
    
    // 2. 트랜잭션 준비 시간
    const prepStart = performance.now();
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const minAmountOut = amounts[1] * 95n / 100n;
    
    const txData = this.router.interface.encodeFunctionData('swapExactTokensForTokens', [
      amountIn,
      minAmountOut,
      path,
      this.wallet.address,
      deadline
    ]);
    const prepEnd = performance.now();
    const prepTime = prepEnd - prepStart;
    
    console.log(`⚙️ Transaction prep time: ${prepTime.toFixed(2)}ms`);
    
    // 3. 트랜잭션 전송 시간
    const sendStart = performance.now();
    const tx = await this.router.swapExactTokensForTokens(
      amountIn,
      minAmountOut,
      path,
      this.wallet.address,
      deadline,
      {
        gasLimit: 300000,
        gasPrice: ethers.parseUnits('20', 'gwei')
      }
    );
    const sendEnd = performance.now();
    const sendTime = sendEnd - sendStart;
    
    console.log(`📤 Transaction send time: ${sendTime.toFixed(2)}ms`);
    console.log(`📤 Tx hash: ${tx.hash}`);
    
    // 4. 확인 대기 시간
    const confirmStart = performance.now();
    const receipt = await tx.wait();
    const confirmEnd = performance.now();
    const confirmTime = confirmEnd - confirmStart;
    
    console.log(`✅ Confirmation time: ${confirmTime.toFixed(2)}ms`);
    console.log(`✅ Block: ${receipt.blockNumber}`);
    console.log(`✅ Gas used: ${receipt.gasUsed.toString()}`);
    
    // 총 시간
    const totalTime = quoteTime + prepTime + sendTime + confirmTime;
    
    console.log('\n📊 Swap Speed Breakdown:');
    console.log(`  Quote: ${quoteTime.toFixed(2)}ms (${(quoteTime/totalTime*100).toFixed(1)}%)`);
    console.log(`  Preparation: ${prepTime.toFixed(2)}ms (${(prepTime/totalTime*100).toFixed(1)}%)`);
    console.log(`  Send: ${sendTime.toFixed(2)}ms (${(sendTime/totalTime*100).toFixed(1)}%)`);
    console.log(`  Confirmation: ${confirmTime.toFixed(2)}ms (${(confirmTime/totalTime*100).toFixed(1)}%)`);
    console.log(`  TOTAL: ${totalTime.toFixed(2)}ms`);
    
    return {
      quote: quoteTime,
      prep: prepTime,
      send: sendTime,
      confirmation: confirmTime,
      total: totalTime,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  }

  /**
   * 네트워크 지연시간 측정
   */
  async measureNetworkLatency(iterations = 5) {
    console.log(`\n🌐 Measuring Network Latency (${iterations} iterations)...\n`);
    
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        await this.provider.getBlockNumber();
        const end = performance.now();
        const time = end - start;
        times.push(time);
        console.log(`Ping ${i + 1}: ${time.toFixed(2)}ms`);
      } catch (error) {
        console.error(`Ping ${i + 1} failed:`, error.message);
      }
    }
    
    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      console.log(`\n📡 Average network latency: ${avgTime.toFixed(2)}ms`);
      return avgTime;
    }
    
    return null;
  }

  /**
   * 표준편차 계산
   */
  calculateStdDev(values) {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * 종합 테스트 실행
   */
  async runSpeedTest() {
    console.log('🚀 AMM Speed Test Suite');
    console.log('=' .repeat(50));
    
    // 지갑 확인
    const balance = await this.provider.getBalance(this.wallet.address);
    console.log(`💳 Wallet: ${this.wallet.address}`);
    console.log(`💰 HYPE Balance: ${ethers.formatEther(balance)}`);
    
    if (balance < ethers.parseEther('0.01')) {
      console.log('⚠️ Low balance - some tests may fail');
    }
    
    try {
      // 1. 네트워크 지연시간
      const networkLatency = await this.measureNetworkLatency();
      
      // 2. Quote 속도
      const quoteStats = await this.measureQuoteSpeed();
      
      // 3. 실제 스왑 속도 (소액)
      const swapStats = await this.measureSwapSpeed();
      
      // 종합 결과
      console.log('\n' + '=' .repeat(50));
      console.log('📊 FINAL RESULTS');
      console.log('=' .repeat(50));
      
      if (networkLatency) {
        console.log(`🌐 Network Latency: ${networkLatency.toFixed(2)}ms`);
      }
      
      if (quoteStats) {
        console.log(`📋 AMM Quote Speed: ${quoteStats.average.toFixed(2)}ms avg`);
      }
      
      if (swapStats) {
        console.log(`💱 Full Swap Time: ${swapStats.total.toFixed(2)}ms`);
        console.log(`   - Off-chain: ${(swapStats.quote + swapStats.prep + swapStats.send).toFixed(2)}ms`);
        console.log(`   - On-chain: ${swapStats.confirmation.toFixed(2)}ms`);
        
        // TPS 계산
        const tps = 1000 / swapStats.total;
        console.log(`⚡ Theoretical AMM TPS: ${tps.toFixed(2)} swaps/second`);
      }
      
      console.log('\n✅ Speed test completed!');
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      throw error;
    }
  }
}

// 실행
if (require.main === module) {
  const tester = new AMMSpeedTester();
  tester.runSpeedTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { AMMSpeedTester };