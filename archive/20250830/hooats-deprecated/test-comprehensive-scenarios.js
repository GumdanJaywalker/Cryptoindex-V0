#!/usr/bin/env node

/**
 * 🎯 종합 거래 시나리오 및 AMM 성능 분석 테스트
 * 
 * 테스트 목표:
 * 1. 다양한 거래 패턴별 성능 측정
 * 2. AMM vs Orderbook 성능 비교 분석
 * 3. HyperEVM RPC 성능 vs 다른 EVM 체인 비교
 * 4. 병목 지점 식별 및 최적화 방안 도출
 */

const { RealOrderbookEngine } = require('./lib/orderbook/real-orderbook-engine');
const { RealHybridRouter } = require('./lib/trading/hybrid-router-real');
const { AsyncSettlementQueue } = require('./lib/settlement/async-settlement-queue');
const { ethers } = require('ethers');
const Redis = require('ioredis');

class ComprehensiveScenarioTest {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.realOrderbook = RealOrderbookEngine.getInstance();
    this.realRouter = RealHybridRouter.getInstance();
    this.settlementQueue = AsyncSettlementQueue.getInstance();
    
    this.testResults = {
      scenarios: [],
      performance: {
        orderbook: [],
        amm: [],
        hybrid: []
      },
      rpcAnalysis: {
        blockTimes: [],
        gasAnalysis: [],
        networkLatency: []
      }
    };
    
    this.startTime = Date.now();
  }

  /**
   * 🔥 SCENARIO 1: 다양한 거래 패턴 테스트
   */
  async testDiverseTradingPatterns() {
    console.log('\n🔥 SCENARIO 1: 다양한 거래 패턴 테스트');
    console.log('==========================================');

    const patterns = [
      {
        name: "소액 빈번 거래",
        orders: Array.from({length: 10}, (_, i) => ({
          id: `frequent_small_${i}`,
          side: i % 2 === 0 ? 'buy' : 'sell',
          type: 'market',
          amount: (Math.random() * 2 + 0.5).toFixed(2), // 0.5-2.5
          userId: `frequent_user_${i % 3}`,
          pair: 'HYPERINDEX-USDC'
        }))
      },
      {
        name: "중간 규모 거래",
        orders: Array.from({length: 5}, (_, i) => ({
          id: `medium_${i}`,
          side: i % 2 === 0 ? 'buy' : 'sell',
          type: 'market',
          amount: (Math.random() * 20 + 10).toFixed(2), // 10-30
          userId: `medium_user_${i}`,
          pair: 'HYPERINDEX-USDC'
        }))
      },
      {
        name: "대량 단일 거래",
        orders: [
          {
            id: 'large_single_1',
            side: 'buy',
            type: 'market', 
            amount: '100',
            userId: 'whale_user_1',
            pair: 'HYPERINDEX-USDC'
          }
        ]
      },
      {
        name: "지정가 주문 집중",
        orders: Array.from({length: 8}, (_, i) => {
          const currentPrice = 1.02; // 추정 AMM 가격
          return {
            id: `limit_${i}`,
            side: i % 2 === 0 ? 'buy' : 'sell',
            type: 'limit',
            amount: (Math.random() * 15 + 5).toFixed(2),
            price: i % 2 === 0 
              ? (currentPrice * (0.95 + Math.random() * 0.03)).toFixed(4) // buy: 95-98% of market
              : (currentPrice * (1.02 + Math.random() * 0.03)).toFixed(4), // sell: 102-105% of market
            userId: `limit_user_${i}`,
            pair: 'HYPERINDEX-USDC'
          };
        })
      }
    ];

    const results = [];

    for (const pattern of patterns) {
      console.log(`\n📋 테스트 패턴: ${pattern.name} (${pattern.orders.length}개 주문)`);
      
      const patternStart = Date.now();
      const patternResults = [];
      let orderbookCount = 0;
      let ammCount = 0;

      for (const order of pattern.orders) {
        const orderStart = Date.now();
        
        try {
          let result;
          
          if (order.type === 'limit') {
            // 지정가 주문 - 오더북으로
            result = await this.realOrderbook.processOrderUltraFast(order);
            orderbookCount++;
            
            console.log(`   📝 지정가 (${order.side}): ${order.amount} @ ${order.price} - ${Date.now() - orderStart}ms`);
            
          } else {
            // 시장가 주문 - AMM으로 (현재 구현 기준)
            result = await this.realRouter.executeAMMSwap(order);
            ammCount++;
            
            const executionTime = Date.now() - orderStart;
            console.log(`   ⚡ 시장가 (${order.side}): ${order.amount} - ${executionTime}ms`);
            
            if (result.txHash) {
              console.log(`      TX: ${result.txHash.slice(0, 12)}... (Block: ${result.blockNumber})`);
            }
          }
          
          patternResults.push({
            orderId: order.id,
            type: order.type,
            executionTime: Date.now() - orderStart,
            success: !result.error,
            txHash: result.txHash || null
          });
          
        } catch (error) {
          console.log(`   ❌ 주문 ${order.id} 실패: ${error.message}`);
          patternResults.push({
            orderId: order.id,
            type: order.type,
            executionTime: Date.now() - orderStart,
            success: false,
            error: error.message
          });
        }
      }

      const patternTime = Date.now() - patternStart;
      const successCount = patternResults.filter(r => r.success).length;
      const avgTime = patternResults.reduce((sum, r) => sum + r.executionTime, 0) / patternResults.length;

      console.log(`   ✅ 패턴 완료: ${successCount}/${pattern.orders.length} 성공, 평균 ${avgTime.toFixed(0)}ms`);
      console.log(`   📊 라우팅: Orderbook ${orderbookCount}개, AMM ${ammCount}개`);

      results.push({
        patternName: pattern.name,
        totalOrders: pattern.orders.length,
        successfulOrders: successCount,
        totalTime: patternTime,
        averageTime: avgTime,
        orderbookCount,
        ammCount,
        results: patternResults
      });
    }

    return {
      success: true,
      patterns: results,
      summary: {
        totalPatterns: patterns.length,
        totalOrders: results.reduce((sum, r) => sum + r.totalOrders, 0),
        totalSuccessful: results.reduce((sum, r) => sum + r.successfulOrders, 0)
      }
    };
  }

  /**
   * ⚡ SCENARIO 2: AMM 성능 집중 분석
   */
  async testAMMPerformanceAnalysis() {
    console.log('\n⚡ SCENARIO 2: AMM 성능 집중 분석');
    console.log('=================================');

    // 초기 상태 확인
    await this.realRouter.initialize();
    const initialPrice = await this.getCurrentAMMPrice();
    const initialReserves = this.realRouter.ammReserves;
    
    console.log(`📊 초기 상태:`);
    console.log(`   AMM 가격: ${initialPrice.toFixed(6)} USDC`);
    console.log(`   리저브: ${parseFloat(initialReserves.base).toFixed(2)} / ${parseFloat(initialReserves.quote).toFixed(2)}`);

    // 다양한 크기의 AMM 거래 테스트
    const ammTestCases = [
      { name: "극소량 거래", amount: "0.01", expectedTime: "<5s" },
      { name: "소량 거래", amount: "0.1", expectedTime: "<10s" },
      { name: "중간 거래", amount: "1.0", expectedTime: "<20s" },
      { name: "대량 거래", amount: "10.0", expectedTime: "<30s" },
      { name: "초대량 거래", amount: "50.0", expectedTime: "<60s" }
    ];

    const ammResults = [];

    for (const testCase of ammTestCases) {
      console.log(`\n🔬 ${testCase.name} 테스트: ${testCase.amount} tokens`);
      
      // RPC 응답성 먼저 테스트
      const rpcStart = Date.now();
      const blockNumber = await this.realRouter.provider.getBlockNumber();
      const rpcTime = Date.now() - rpcStart;
      
      console.log(`   🌐 RPC 응답 시간: ${rpcTime}ms (Block: ${blockNumber})`);

      // AMM 가격 계산 테스트
      const priceCalcStart = Date.now();
      const priceEstimate = await this.realRouter.calculateAMMPrice('HYPERINDEX-USDC', 'buy', testCase.amount);
      const priceCalcTime = Date.now() - priceCalcStart;
      
      console.log(`   💰 가격 계산: ${priceCalcTime}ms (예상가: ${priceEstimate.effectivePrice})`);

      // 실제 AMM 거래 실행
      const swapStart = Date.now();
      
      try {
        const swapResult = await this.realRouter.executeAMMSwap({
          id: `amm_test_${testCase.name.replace(' ', '_')}`,
          side: 'buy',
          type: 'market',
          amount: testCase.amount,
          userId: `amm_tester_${Date.now()}`,
          pair: 'HYPERINDEX-USDC'
        });

        const swapTime = Date.now() - swapStart;
        
        console.log(`   ⚡ AMM 거래 완료: ${swapTime}ms`);
        if (swapResult.txHash) {
          console.log(`      TX: ${swapResult.txHash}`);
          console.log(`      가스: ${swapResult.gasUsed}`);
          console.log(`      블록: ${swapResult.blockNumber}`);
          
          // 블록 정보 분석
          const block = await this.realRouter.provider.getBlock(swapResult.blockNumber);
          const blockTime = block.timestamp;
          console.log(`      블록 시간: ${new Date(blockTime * 1000).toISOString()}`);
        }

        ammResults.push({
          testCase: testCase.name,
          amount: testCase.amount,
          rpcTime,
          priceCalcTime,
          swapTime,
          totalTime: swapTime + rpcTime + priceCalcTime,
          success: true,
          txHash: swapResult.txHash,
          gasUsed: swapResult.gasUsed
        });

      } catch (error) {
        const swapTime = Date.now() - swapStart;
        console.log(`   ❌ AMM 거래 실패: ${error.message} (${swapTime}ms)`);
        
        ammResults.push({
          testCase: testCase.name,
          amount: testCase.amount,
          rpcTime,
          priceCalcTime,
          swapTime,
          success: false,
          error: error.message
        });
      }

      // 거래 간 간격
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // AMM 성능 분석
    const successfulAMM = ammResults.filter(r => r.success);
    const avgSwapTime = successfulAMM.reduce((sum, r) => sum + r.swapTime, 0) / successfulAMM.length;
    const avgRpcTime = successfulAMM.reduce((sum, r) => sum + r.rpcTime, 0) / successfulAMM.length;

    console.log(`\n📊 AMM 성능 분석:`);
    console.log(`   성공한 거래: ${successfulAMM.length}/${ammResults.length}`);
    console.log(`   평균 Swap 시간: ${avgSwapTime.toFixed(0)}ms`);
    console.log(`   평균 RPC 시간: ${avgRpcTime.toFixed(0)}ms`);
    console.log(`   추정 AMM TPS: ${(1000 / avgSwapTime).toFixed(2)}`);

    return {
      success: successfulAMM.length > 0,
      results: ammResults,
      performance: {
        avgSwapTime,
        avgRpcTime,
        estimatedTPS: 1000 / avgSwapTime,
        successRate: (successfulAMM.length / ammResults.length) * 100
      }
    };
  }

  /**
   * 🌐 SCENARIO 3: HyperEVM RPC 성능 벤치마크
   */
  async testHyperEVMRPCBenchmark() {
    console.log('\n🌐 SCENARIO 3: HyperEVM RPC 성능 벤치마크');
    console.log('=========================================');

    const rpcTests = [
      {
        name: "블록 정보 조회",
        test: async () => {
          const start = Date.now();
          const blockNumber = await this.realRouter.provider.getBlockNumber();
          const block = await this.realRouter.provider.getBlock(blockNumber);
          return { time: Date.now() - start, result: `Block ${blockNumber}: ${block.transactions.length} txs` };
        }
      },
      {
        name: "가스 가격 조회",
        test: async () => {
          const start = Date.now();
          const gasPrice = await this.realRouter.provider.getFeeData();
          return { time: Date.now() - start, result: `Gas: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei` };
        }
      },
      {
        name: "잔고 조회",
        test: async () => {
          const start = Date.now();
          const balance = await this.realRouter.provider.getBalance(this.realRouter.wallet.address);
          return { time: Date.now() - start, result: `Balance: ${ethers.formatEther(balance)} HYPE` };
        }
      },
      {
        name: "컨트랙트 호출 (view)",
        test: async () => {
          const start = Date.now();
          const reserves = await this.realRouter.contracts.pair.getReserves();
          return { time: Date.now() - start, result: `Reserves: ${ethers.formatEther(reserves[0])}/${ethers.formatEther(reserves[1])}` };
        }
      },
      {
        name: "거래 시뮬레이션",
        test: async () => {
          const start = Date.now();
          try {
            const amounts = await this.realRouter.contracts.router.getAmountsOut(
              ethers.parseEther("1"),
              [this.realRouter.contracts.usdc.target, this.realRouter.contracts.hyperindex.target]
            );
            return { time: Date.now() - start, result: `Simulation: ${ethers.formatEther(amounts[1])} out` };
          } catch (error) {
            return { time: Date.now() - start, error: error.message };
          }
        }
      }
    ];

    const rpcResults = [];

    for (let i = 0; i < 3; i++) { // 3번 반복 테스트
      console.log(`\n📡 RPC 테스트 라운드 ${i + 1}/3:`);
      
      for (const test of rpcTests) {
        try {
          const result = await test.test();
          console.log(`   ${test.name}: ${result.time}ms - ${result.result || result.error}`);
          
          rpcResults.push({
            round: i + 1,
            testName: test.name,
            time: result.time,
            success: !result.error,
            result: result.result || result.error
          });
          
        } catch (error) {
          console.log(`   ${test.name}: ERROR - ${error.message}`);
          rpcResults.push({
            round: i + 1,
            testName: test.name,
            time: 0,
            success: false,
            error: error.message
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // RPC 성능 분석
    const rpcAnalysis = {};
    rpcTests.forEach(test => {
      const testResults = rpcResults.filter(r => r.testName === test.name && r.success);
      if (testResults.length > 0) {
        const avgTime = testResults.reduce((sum, r) => sum + r.time, 0) / testResults.length;
        const minTime = Math.min(...testResults.map(r => r.time));
        const maxTime = Math.max(...testResults.map(r => r.time));
        
        rpcAnalysis[test.name] = { avgTime, minTime, maxTime, successCount: testResults.length };
      }
    });

    console.log(`\n📊 RPC 성능 요약:`);
    Object.entries(rpcAnalysis).forEach(([testName, stats]) => {
      console.log(`   ${testName}: 평균 ${stats.avgTime.toFixed(0)}ms (${stats.minTime}-${stats.maxTime}ms)`);
    });

    return {
      success: Object.keys(rpcAnalysis).length > 0,
      results: rpcResults,
      analysis: rpcAnalysis
    };
  }

  /**
   * 📊 SCENARIO 4: Orderbook vs AMM 성능 직접 비교
   */
  async testOrderbookVsAMMPerformance() {
    console.log('\n📊 SCENARIO 4: Orderbook vs AMM 성능 직접 비교');
    console.log('============================================');

    const testOrders = [
      { amount: "1.0", expectedOrderbook: "<100ms", expectedAMM: "30-60s" },
      { amount: "5.0", expectedOrderbook: "<100ms", expectedAMM: "30-60s" },
      { amount: "10.0", expectedOrderbook: "<100ms", expectedAMM: "30-60s" }
    ];

    const comparisonResults = [];

    for (const testOrder of testOrders) {
      console.log(`\n🔬 비교 테스트: ${testOrder.amount} tokens`);

      // 1. Orderbook 성능 (지정가 주문 등록)
      const orderbookStart = Date.now();
      try {
        const orderbookResult = await this.realOrderbook.processOrderUltraFast({
          id: `orderbook_perf_${Date.now()}`,
          side: 'buy',
          type: 'limit',
          amount: testOrder.amount,
          price: "0.95", // AMM보다 낮은 가격으로 오더북 등록
          userId: `orderbook_perf_user_${Date.now()}`,
          pair: 'HYPERINDEX-USDC'
        });
        const orderbookTime = Date.now() - orderbookStart;
        console.log(`   📚 Orderbook: ${orderbookTime}ms (${orderbookResult.status})`);

        comparisonResults.push({
          amount: testOrder.amount,
          orderbookTime,
          orderbookSuccess: true
        });

      } catch (error) {
        const orderbookTime = Date.now() - orderbookStart;
        console.log(`   📚 Orderbook: ${orderbookTime}ms (ERROR: ${error.message})`);
        
        comparisonResults.push({
          amount: testOrder.amount,
          orderbookTime,
          orderbookSuccess: false,
          orderbookError: error.message
        });
      }

      // 2. AMM 성능 (시장가 주문)
      const ammStart = Date.now();
      try {
        const ammResult = await this.realRouter.executeAMMSwap({
          id: `amm_perf_${Date.now()}`,
          side: 'buy',
          type: 'market',
          amount: testOrder.amount,
          userId: `amm_perf_user_${Date.now()}`,
          pair: 'HYPERINDEX-USDC'
        });
        const ammTime = Date.now() - ammStart;
        console.log(`   ⚡ AMM: ${ammTime}ms (TX: ${ammResult.txHash?.slice(0, 10)}...)`);

        const lastResult = comparisonResults[comparisonResults.length - 1];
        lastResult.ammTime = ammTime;
        lastResult.ammSuccess = true;
        lastResult.ammTxHash = ammResult.txHash;

      } catch (error) {
        const ammTime = Date.now() - ammStart;
        console.log(`   ⚡ AMM: ${ammTime}ms (ERROR: ${error.message})`);
        
        const lastResult = comparisonResults[comparisonResults.length - 1];
        lastResult.ammTime = ammTime;
        lastResult.ammSuccess = false;
        lastResult.ammError = error.message;
      }

      // 성능 비교 분석
      const lastResult = comparisonResults[comparisonResults.length - 1];
      if (lastResult.orderbookSuccess && lastResult.ammSuccess) {
        const speedRatio = lastResult.ammTime / lastResult.orderbookTime;
        console.log(`   🔍 성능 비교: AMM이 Orderbook보다 ${speedRatio.toFixed(1)}배 느림`);
        lastResult.speedRatio = speedRatio;
      }

      // 거래 간 간격
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 전체 비교 분석
    const validComparisons = comparisonResults.filter(r => r.orderbookSuccess && r.ammSuccess);
    if (validComparisons.length > 0) {
      const avgOrderbookTime = validComparisons.reduce((sum, r) => sum + r.orderbookTime, 0) / validComparisons.length;
      const avgAMMTime = validComparisons.reduce((sum, r) => sum + r.ammTime, 0) / validComparisons.length;
      const avgSpeedRatio = avgAMMTime / avgOrderbookTime;

      console.log(`\n📊 성능 비교 요약:`);
      console.log(`   Orderbook 평균: ${avgOrderbookTime.toFixed(0)}ms`);
      console.log(`   AMM 평균: ${avgAMMTime.toFixed(0)}ms`);
      console.log(`   속도 차이: AMM이 ${avgSpeedRatio.toFixed(0)}배 느림`);
      console.log(`   Orderbook TPS: ${(1000/avgOrderbookTime).toFixed(0)}`);
      console.log(`   AMM TPS: ${(1000/avgAMMTime).toFixed(2)}`);
    }

    return {
      success: validComparisons.length > 0,
      results: comparisonResults,
      analysis: validComparisons.length > 0 ? {
        avgOrderbookTime: validComparisons.reduce((sum, r) => sum + r.orderbookTime, 0) / validComparisons.length,
        avgAMMTime: validComparisons.reduce((sum, r) => sum + r.ammTime, 0) / validComparisons.length,
        avgSpeedRatio: validComparisons.reduce((sum, r) => sum + r.speedRatio, 0) / validComparisons.length
      } : null
    };
  }

  /**
   * 보조 함수들
   */
  async getCurrentAMMPrice() {
    try {
      const priceData = await this.realRouter.calculateAMMPrice('HYPERINDEX-USDC', 'buy', 1);
      return parseFloat(priceData.effectivePrice);
    } catch (error) {
      console.warn('AMM 가격 조회 실패, 기본값 사용:', error.message);
      return 1.0;
    }
  }

  /**
   * 📋 최종 보고서 생성
   */
  generateComprehensiveReport(results) {
    const totalTime = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 종합 거래 시나리오 및 AMM 성능 분석 보고서');
    console.log('='.repeat(80));
    
    const [patternTest, ammTest, rpcTest, comparisonTest] = results;
    
    console.log(`\n⏱️ 총 테스트 시간: ${(totalTime/1000).toFixed(0)}초`);
    
    // 거래 패턴 분석
    if (patternTest.success) {
      console.log(`\n📋 거래 패턴 분석:`);
      console.log(`   테스트한 패턴: ${patternTest.patterns.length}개`);
      console.log(`   총 주문: ${patternTest.summary.totalOrders}개`);
      console.log(`   성공률: ${(patternTest.summary.totalSuccessful/patternTest.summary.totalOrders*100).toFixed(1)}%`);
      
      patternTest.patterns.forEach(pattern => {
        console.log(`   ${pattern.patternName}: ${pattern.successfulOrders}/${pattern.totalOrders} 성공 (평균 ${pattern.averageTime.toFixed(0)}ms)`);
      });
    }
    
    // AMM 성능 분석
    if (ammTest.success) {
      console.log(`\n⚡ AMM 성능 분석:`);
      console.log(`   평균 Swap 시간: ${ammTest.performance.avgSwapTime.toFixed(0)}ms`);
      console.log(`   평균 RPC 시간: ${ammTest.performance.avgRpcTime.toFixed(0)}ms`);
      console.log(`   추정 AMM TPS: ${ammTest.performance.estimatedTPS.toFixed(2)}`);
      console.log(`   성공률: ${ammTest.performance.successRate.toFixed(1)}%`);
      
      // 성능 문제 진단
      if (ammTest.performance.avgSwapTime > 10000) {
        console.log(`   ⚠️ AMM 성능 이슈 감지: 평균 ${(ammTest.performance.avgSwapTime/1000).toFixed(1)}초`);
        console.log(`      - HyperEVM Testnet RPC 제약으로 추정`);
        console.log(`      - Mainnet 대비 성능 저하 예상됨`);
      }
    }
    
    // RPC 성능 분석
    if (rpcTest.success) {
      console.log(`\n🌐 HyperEVM RPC 성능:`);
      Object.entries(rpcTest.analysis).forEach(([testName, stats]) => {
        console.log(`   ${testName}: ${stats.avgTime.toFixed(0)}ms (${stats.minTime}-${stats.maxTime}ms)`);
      });
    }
    
    // 성능 비교 분석
    if (comparisonTest.success && comparisonTest.analysis) {
      console.log(`\n📊 Orderbook vs AMM 성능:`);
      console.log(`   Orderbook: ${comparisonTest.analysis.avgOrderbookTime.toFixed(0)}ms (${(1000/comparisonTest.analysis.avgOrderbookTime).toFixed(0)} TPS)`);
      console.log(`   AMM: ${comparisonTest.analysis.avgAMMTime.toFixed(0)}ms (${(1000/comparisonTest.analysis.avgAMMTime).toFixed(2)} TPS)`);
      console.log(`   속도 차이: ${comparisonTest.analysis.avgSpeedRatio.toFixed(0)}배`);
    }
    
    // 핵심 발견사항
    console.log(`\n🔍 핵심 발견사항:`);
    
    if (ammTest.success && ammTest.performance.estimatedTPS < 10) {
      console.log(`   ❌ AMM TPS 매우 낮음: ${ammTest.performance.estimatedTPS.toFixed(2)} (목표: 3000+)`);
      console.log(`      원인 분석:`);
      console.log(`      1. HyperEVM Testnet RPC 성능 제약 (가장 유력)`);
      console.log(`      2. 테스트넷 네트워크 혼잡`);
      console.log(`      3. 가스 설정 비최적화`);
    }
    
    if (comparisonTest.success && comparisonTest.analysis && comparisonTest.analysis.avgSpeedRatio > 100) {
      console.log(`   ✅ Orderbook이 AMM보다 ${comparisonTest.analysis.avgSpeedRatio.toFixed(0)}배 빠름 확인`);
      console.log(`   ✅ 하이브리드 라우팅 전략의 타당성 검증`);
    }
    
    console.log(`\n💡 개선 방안:`);
    console.log(`   1. HyperEVM Mainnet 마이그레이션 고려`);
    console.log(`   2. 전용 RPC 엔드포인트 사용 (QuickNode, Alchemy 등)`);
    console.log(`   3. 가스 최적화 및 배치 처리 강화`);
    console.log(`   4. Orderbook 우선 라우팅 전략 유지`);
    
    console.log('\n' + '='.repeat(80));
    
    return {
      success: true,
      totalTime,
      results,
      conclusions: {
        ammPerformanceIssue: ammTest.success && ammTest.performance.estimatedTPS < 10,
        orderbookSuperiority: comparisonTest.success && comparisonTest.analysis && comparisonTest.analysis.avgSpeedRatio > 10,
        rpcBottleneck: rpcTest.success && Object.values(rpcTest.analysis).some(stat => stat.avgTime > 1000)
      }
    };
  }

  /**
   * 🚀 종합 테스트 실행
   */
  async runComprehensiveTest() {
    try {
      console.log('🚀 종합 거래 시나리오 및 AMM 성능 분석 시작...');
      console.log('===============================================');
      console.log('분석 목표:');
      console.log('1. 다양한 거래 패턴별 성능 측정');
      console.log('2. AMM vs Orderbook 성능 직접 비교'); 
      console.log('3. HyperEVM RPC 성능 병목 식별');
      console.log('4. 성능 최적화 방안 도출\n');

      const patternTest = await this.testDiverseTradingPatterns();
      const ammTest = await this.testAMMPerformanceAnalysis();
      const rpcTest = await this.testHyperEVMRPCBenchmark();
      const comparisonTest = await this.testOrderbookVsAMMPerformance();

      const finalReport = this.generateComprehensiveReport([patternTest, ammTest, rpcTest, comparisonTest]);

      await this.redis.disconnect();
      return finalReport;

    } catch (error) {
      console.error('❌ 종합 테스트 실패:', error);
      await this.redis.disconnect();
      throw error;
    }
  }
}

// 실행
if (require.main === module) {
  const test = new ComprehensiveScenarioTest();
  
  test.runComprehensiveTest()
    .then(report => {
      process.exit(report.success ? 0 : 1);
    })
    .catch(error => {
      console.error('테스트 실행 실패:', error);
      process.exit(1);
    });
}

module.exports = { ComprehensiveScenarioTest };