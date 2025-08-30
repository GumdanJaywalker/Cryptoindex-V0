#!/usr/bin/env node

/**
 * AMM 성능 분석 테스트
 * 
 * 목표:
 * 1. AMM 스왑이 46-62초가 걸리는 원인 분석
 * 2. HyperEVM RPC 성능 측정
 * 3. 오더북 vs AMM 성능 비교
 * 4. UniSwap V3와 같은 3000+ TPS 달성 가능성 분석
 */

const { ethers } = require('ethers');
const Redis = require('ioredis');

// HyperEVM 설정
const HYPERVM_RPC = 'https://rpc.hyperliquid-testnet.xyz/evm';
const CHAIN_ID = 998;

// 컨트랙트 주소 (실제 작동하는 deployment에서)
const ROUTER_ADDRESS = '0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A';
const HYPERINDEX_ADDRESS = '0x6065Ab1ec8334ab6099aF27aF145411902EAef40';
const USDC_ADDRESS = '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3';
const PAIR_ADDRESS = '0x5706084ad9Cac84393eaA1Eb265Db9b22bA63cd1';

// ABI 최소한만
const ROUTER_ABI = [
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

const ERC20_ABI = [
    "function balanceOf(address owner) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
];

const PAIR_ABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];

class AMMPerformanceAnalyzer {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(HYPERVM_RPC, CHAIN_ID);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        
        // 컨트랙트 인스턴스
        this.router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, this.wallet);
        this.hyperindex = new ethers.Contract(HYPERINDEX_ADDRESS, ERC20_ABI, this.wallet);
        this.usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, this.wallet);
        this.pair = new ethers.Contract(PAIR_ADDRESS, PAIR_ABI, this.provider);
        
        // Redis 연결
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        
        this.testResults = {
            rpcPerformance: [],
            ammTransactions: [],
            orderbookOperations: [],
            comparison: {}
        };
    }

    async initialize() {
        console.log('🔥 AMM 성능 분석 시작');
        console.log('======================================');
        
        try {
            // ioredis는 자동 연결됨
            console.log('✅ Redis 연결 완료');
            
            // 지갑 정보
            const address = await this.wallet.getAddress();
            const balance = await this.provider.getBalance(address);
            console.log(`🔑 지갑 주소: ${address}`);
            console.log(`💰 HYPE 잔고: ${ethers.formatEther(balance)} HYPE`);
            
            // 토큰 잔고
            const hyperindexBalance = await this.hyperindex.balanceOf(address);
            const usdcBalance = await this.usdc.balanceOf(address);
            console.log(`🪙 HYPERINDEX 잔고: ${ethers.formatEther(hyperindexBalance)}`);
            console.log(`💵 USDC 잔고: ${ethers.formatEther(usdcBalance)}`);
            
            return true;
        } catch (error) {
            console.error('❌ 초기화 실패:', error);
            return false;
        }
    }

    // 1단계: HyperEVM RPC 성능 측정
    async testRPCPerformance() {
        console.log('\n🔍 1단계: HyperEVM RPC 성능 측정');
        console.log('=====================================');
        
        const tests = [
            { name: 'getBlockNumber', fn: () => this.provider.getBlockNumber() },
            { name: 'getBalance', fn: () => this.provider.getBalance(this.wallet.address) },
            { name: 'getReserves', fn: () => this.pair.getReserves() },
            { name: 'balanceOf', fn: () => this.hyperindex.balanceOf(this.wallet.address) },
            { name: 'getAmountsOut', fn: () => this.router.getAmountsOut(ethers.parseEther('1'), [HYPERINDEX_ADDRESS, USDC_ADDRESS]) }
        ];
        
        for (const test of tests) {
            const times = [];
            console.log(`\n📡 ${test.name} 성능 측정 (10회 반복):`);
            
            for (let i = 0; i < 10; i++) {
                const start = Date.now();
                try {
                    await test.fn();
                    const elapsed = Date.now() - start;
                    times.push(elapsed);
                    process.stdout.write(`${elapsed}ms `);
                } catch (error) {
                    console.error(`❌ ${test.name} 실패:`, error.message);
                    times.push(null);
                }
            }
            
            const validTimes = times.filter(t => t !== null);
            if (validTimes.length > 0) {
                const avg = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
                const min = Math.min(...validTimes);
                const max = Math.max(...validTimes);
                
                console.log(`\n   평균: ${avg.toFixed(1)}ms, 최소: ${min}ms, 최대: ${max}ms`);
                
                this.testResults.rpcPerformance.push({
                    operation: test.name,
                    times: validTimes,
                    average: avg,
                    min: min,
                    max: max
                });
            }
        }
    }

    // 2단계: AMM 트랜잭션 성능 분석
    async testAMMTransactionPerformance() {
        console.log('\n🏦 2단계: AMM 트랜잭션 성능 분석');
        console.log('=====================================');
        
        const testSizes = [
            { name: '소량', amount: '1' },
            { name: '중량', amount: '10' },
            { name: '대량', amount: '50' }
        ];
        
        for (const testSize of testSizes) {
            console.log(`\n💰 ${testSize.name} 스왑 테스트 (${testSize.amount} HYPERINDEX)`);
            console.log('----------------------------------------');
            
            try {
                const amountIn = ethers.parseEther(testSize.amount);
                
                // 1. 승인 체크
                const approveStart = Date.now();
                const currentAllowance = await this.hyperindex.allowance(this.wallet.address, ROUTER_ADDRESS);
                
                if (currentAllowance < amountIn) {
                    console.log('📝 승인 트랜잭션 필요...');
                    const approveTx = await this.hyperindex.approve(ROUTER_ADDRESS, ethers.parseEther('1000'));
                    const approveReceipt = await approveTx.wait();
                    console.log(`   승인 완료: ${Date.now() - approveStart}ms, Gas: ${approveReceipt.gasUsed}`);
                }
                
                // 2. 스왑 실행
                const swapStart = Date.now();
                console.log(`🔄 ${testSize.amount} HYPERINDEX → USDC 스왑 시작...`);
                
                // 예상 출력량 계산
                const amountsOut = await this.router.getAmountsOut(amountIn, [HYPERINDEX_ADDRESS, USDC_ADDRESS]);
                const expectedOut = amountsOut[1];
                const minAmountOut = expectedOut * 95n / 100n; // 5% 슬리피지
                
                console.log(`   예상 출력: ${ethers.formatEther(expectedOut)} USDC`);
                console.log(`   최소 출력: ${ethers.formatEther(minAmountOut)} USDC`);
                
                // 스왑 트랜잭션 전송
                const deadline = Math.floor(Date.now() / 1000) + 600; // 10분
                const swapTx = await this.router.swapExactTokensForTokens(
                    amountIn,
                    minAmountOut,
                    [HYPERINDEX_ADDRESS, USDC_ADDRESS],
                    this.wallet.address,
                    deadline
                );
                
                const submitTime = Date.now() - swapStart;
                console.log(`📤 트랜잭션 제출 완료: ${submitTime}ms`);
                console.log(`   TX Hash: ${swapTx.hash}`);
                
                // 트랜잭션 대기
                const receipt = await swapTx.wait();
                const totalTime = Date.now() - swapStart;
                
                console.log(`✅ 스왑 완료: 총 ${totalTime}ms`);
                console.log(`   블록: ${receipt.blockNumber}`);
                console.log(`   가스 사용: ${receipt.gasUsed}`);
                console.log(`   가스 가격: ${swapTx.gasPrice} wei`);
                
                this.testResults.ammTransactions.push({
                    size: testSize.name,
                    amount: testSize.amount,
                    submitTime: submitTime,
                    totalTime: totalTime,
                    gasUsed: receipt.gasUsed.toString(),
                    gasPrice: swapTx.gasPrice.toString(),
                    blockNumber: receipt.blockNumber
                });
                
                // 잠시 대기 (RPC 부하 방지)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ ${testSize.name} 스왑 실패:`, error);
            }
        }
    }

    // 3단계: 오더북 성능 비교
    async testOrderbookPerformance() {
        console.log('\n📊 3단계: 오더북 성능 비교');
        console.log('=====================================');
        
        const testCases = [
            { name: '지정가 주문', type: 'limit', amount: '10', price: '1.05' },
            { name: '시장가 주문', type: 'market', amount: '5' },
            { name: '대량 지정가', type: 'limit', amount: '100', price: '1.10' }
        ];
        
        for (const testCase of testCases) {
            console.log(`\n📋 ${testCase.name} 처리 테스트`);
            console.log('----------------------------------------');
            
            const start = Date.now();
            
            // 오더북 주문 시뮬레이션
            const order = {
                id: `perf_test_${Date.now()}`,
                userId: 'performance_test',
                pair: 'HYPERINDEX-USDC',
                side: 'buy',
                type: testCase.type,
                amount: testCase.amount,
                price: testCase.price,
                timestamp: Date.now()
            };
            
            // Redis에 주문 저장
            const orderId = `order:${order.id}`;
            await this.redis.hset(orderId, order);
            
            // 오더북 처리 시뮬레이션
            if (testCase.type === 'limit') {
                // 지정가 주문은 오더북에 추가
                await this.redis.zadd(`orderbook:HYPERINDEX-USDC:buy`, parseFloat(testCase.price), order.id);
            } else {
                // 시장가 주문은 즉시 매칭 시뮬레이션
                await this.redis.hset(`trade:${order.id}`, {
                    orderId: order.id,
                    price: '1.024',
                    amount: testCase.amount,
                    timestamp: Date.now()
                });
            }
            
            const processingTime = Date.now() - start;
            console.log(`✅ 오더북 처리 완료: ${processingTime}ms`);
            
            this.testResults.orderbookOperations.push({
                type: testCase.name,
                orderType: testCase.type,
                amount: testCase.amount,
                processingTime: processingTime
            });
        }
    }

    // 4단계: 성능 비교 분석
    async analyzePerformanceComparison() {
        console.log('\n📈 4단계: 성능 비교 분석');
        console.log('=====================================');
        
        // AMM 평균 성능
        const ammAvgTime = this.testResults.ammTransactions.reduce((sum, tx) => sum + tx.totalTime, 0) / this.testResults.ammTransactions.length;
        
        // 오더북 평균 성능
        const orderbookAvgTime = this.testResults.orderbookOperations.reduce((sum, op) => sum + op.processingTime, 0) / this.testResults.orderbookOperations.length;
        
        // RPC 평균 응답 시간
        const rpcAvgTime = this.testResults.rpcPerformance.reduce((sum, rpc) => sum + rpc.average, 0) / this.testResults.rpcPerformance.length;
        
        console.log('\n⚡ 성능 비교 결과:');
        console.log(`   AMM 평균 처리 시간: ${ammAvgTime.toFixed(0)}ms`);
        console.log(`   오더북 평균 처리 시간: ${orderbookAvgTime.toFixed(0)}ms`);
        console.log(`   RPC 평균 응답 시간: ${rpcAvgTime.toFixed(1)}ms`);
        console.log(`   성능 차이: AMM은 오더북보다 ${(ammAvgTime / orderbookAvgTime).toFixed(1)}배 느림`);
        
        // TPS 계산
        const ammTPS = 1000 / ammAvgTime;
        const orderbookTPS = 1000 / orderbookAvgTime;
        
        console.log('\n🚀 TPS 분석:');
        console.log(`   AMM TPS: ${ammTPS.toFixed(2)} TPS`);
        console.log(`   오더북 TPS: ${orderbookTPS.toFixed(2)} TPS`);
        console.log(`   UniSwap V3 목표 (3000+ TPS) 달성률: ${(ammTPS / 3000 * 100).toFixed(1)}%`);
        
        this.testResults.comparison = {
            ammAvgTime: ammAvgTime,
            orderbookAvgTime: orderbookAvgTime,
            rpcAvgTime: rpcAvgTime,
            ammTPS: ammTPS,
            orderbookTPS: orderbookTPS,
            uniswapTargetAchievement: ammTPS / 3000 * 100
        };
    }

    // 5단계: 병목 지점 분석
    async analyzeBottlenecks() {
        console.log('\n🔍 5단계: 병목 지점 분석');
        console.log('=====================================');
        
        console.log('\n📊 RPC 성능 분석:');
        this.testResults.rpcPerformance.forEach(rpc => {
            console.log(`   ${rpc.operation}: 평균 ${rpc.average.toFixed(1)}ms (${rpc.min}-${rpc.max}ms)`);
        });
        
        console.log('\n⛽ 가스 사용 분석:');
        this.testResults.ammTransactions.forEach(tx => {
            const gasPrice = BigInt(tx.gasPrice);
            const gasCost = BigInt(tx.gasUsed) * gasPrice;
            console.log(`   ${tx.size} 스왑: ${tx.gasUsed} gas, ${ethers.formatEther(gasCost)} HYPE`);
        });
        
        console.log('\n🔎 병목 지점 식별:');
        
        // RPC 응답 시간이 1초 이상인 경우
        const slowRPCs = this.testResults.rpcPerformance.filter(rpc => rpc.average > 1000);
        if (slowRPCs.length > 0) {
            console.log('   ⚠️ RPC 응답 지연:');
            slowRPCs.forEach(rpc => {
                console.log(`      ${rpc.operation}: ${rpc.average.toFixed(1)}ms (매우 느림)`);
            });
        }
        
        // 트랜잭션 제출 vs 컨펌 시간 비교
        this.testResults.ammTransactions.forEach(tx => {
            const waitTime = tx.totalTime - tx.submitTime;
            console.log(`   ${tx.size} 스왑 분석:`);
            console.log(`      제출 시간: ${tx.submitTime}ms`);
            console.log(`      대기 시간: ${waitTime}ms`);
            console.log(`      대기 비율: ${(waitTime / tx.totalTime * 100).toFixed(1)}%`);
        });
        
        // 개선 제안
        console.log('\n💡 성능 개선 제안:');
        if (this.testResults.comparison.rpcAvgTime > 500) {
            console.log('   1. RPC 응답 시간 최적화 필요 (현재 평균 ' + this.testResults.comparison.rpcAvgTime.toFixed(1) + 'ms)');
        }
        if (this.testResults.comparison.ammTPS < 10) {
            console.log('   2. AMM 트랜잭션 배치 처리 도입 검토');
        }
        if (this.testResults.comparison.uniswapTargetAchievement < 10) {
            console.log('   3. HyperEVM 체인 성능 한계 검토 (UniSwap V3 목표의 ' + this.testResults.comparison.uniswapTargetAchievement.toFixed(1) + '% 달성)');
        }
    }

    async generateReport() {
        console.log('\n📋 AMM 성능 분석 보고서');
        console.log('======================================');
        console.log(`📅 테스트 일시: ${new Date().toLocaleString()}`);
        console.log(`🔗 체인: HyperEVM Testnet (${CHAIN_ID})`);
        console.log(`🌐 RPC: ${HYPERVM_RPC}`);
        
        const report = {
            timestamp: new Date().toISOString(),
            chain: 'HyperEVM Testnet',
            rpc: HYPERVM_RPC,
            results: this.testResults,
            summary: {
                ammPerformance: `${this.testResults.comparison.ammTPS.toFixed(2)} TPS`,
                orderbookPerformance: `${this.testResults.comparison.orderbookTPS.toFixed(2)} TPS`,
                uniswapComparison: `${this.testResults.comparison.uniswapTargetAchievement.toFixed(1)}% of target`,
                bottleneck: this.testResults.comparison.rpcAvgTime > 500 ? 'RPC Response Time' : 'Transaction Confirmation'
            }
        };
        
        console.log('\n✅ 핵심 결과:');
        console.log(`   AMM 성능: ${report.summary.ammPerformance}`);
        console.log(`   오더북 성능: ${report.summary.orderbookPerformance}`);
        console.log(`   UniSwap V3 비교: ${report.summary.uniswapComparison}`);
        console.log(`   주요 병목: ${report.summary.bottleneck}`);
        
        return report;
    }

    async cleanup() {
        try {
            this.redis.disconnect();
            console.log('\n🧹 리소스 정리 완료');
        } catch (error) {
            console.error('정리 중 오류:', error);
        }
    }
}

async function main() {
    const analyzer = new AMMPerformanceAnalyzer();
    
    try {
        if (!await analyzer.initialize()) {
            process.exit(1);
        }
        
        // 테스트 실행
        await analyzer.testRPCPerformance();
        await analyzer.testAMMTransactionPerformance();
        await analyzer.testOrderbookPerformance();
        await analyzer.analyzePerformanceComparison();
        await analyzer.analyzeBottlenecks();
        
        // 보고서 생성
        const report = await analyzer.generateReport();
        
        console.log('\n🎉 AMM 성능 분석 완료!');
        
    } catch (error) {
        console.error('❌ 테스트 실행 중 오류:', error);
    } finally {
        await analyzer.cleanup();
    }
}

if (require.main === module) {
    main();
}