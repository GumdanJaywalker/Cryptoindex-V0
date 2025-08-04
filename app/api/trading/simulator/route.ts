// app/api/trading/simulator/route.ts
/**
 * 🚀 대량 주문 시뮬레이터 - 초당 900개+ 주문 성능 테스트
 * 
 * 기능:
 * - 배치 주문 생성 (동시 처리)
 * - 성능 측정 (TPS, 지연시간, 성공률)
 * - 다양한 주문 패턴 (마켓/리밋, 매수/매도)
 * - 실시간 진행 상황 모니터링
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractPrivyAuthFromRequest } from '@/lib/middleware/privy-auth';

interface SimulationConfig {
  totalOrders: number;        // 총 주문 수
  ordersPerSecond: number;    // 초당 주문 수 (목표: 900+)
  batchSize: number;          // 배치 크기 (동시 처리할 주문 수)
  orderTypes: {               // 주문 타입 비율
    market: number;           // 마켓 주문 비율 (0-1)
    limit: number;            // 리밋 주문 비율 (0-1)
  };
  sides: {                    // 매수/매도 비율
    buy: number;              // 매수 주문 비율 (0-1)  
    sell: number;             // 매도 주문 비율 (0-1)
  };
  amountRange: {              // 주문 수량 범위
    min: number;
    max: number;
  };
  priceRange: {               // 가격 범위 (리밋 주문용)
    min: number;
    max: number;
  };
  useV2Router: boolean;       // V2 라우터 사용 여부
}

interface SimulationResult {
  orderId: string;
  success: boolean;
  responseTime: number;       // 응답 시간 (ms)
  error?: string;
  orderDetails?: any;
}

interface SimulationStats {
  totalOrders: number;
  completedOrders: number;
  successfulOrders: number;
  failedOrders: number;
  averageResponseTime: number;
  actualTPS: number;
  startTime: number;
  endTime?: number;
  errors: Record<string, number>;
}

/**
 * POST /api/trading/simulator - 대량 주문 시뮬레이션 시작
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (개발 환경에서는 자동 통과)
    const authResult = await extractPrivyAuthFromRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const config: SimulationConfig = await request.json();
    
    // 설정 검증
    if (!validateConfig(config)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid simulation configuration'
      }, { status: 400 });
    }

    console.log('🚀 Starting mass order simulation:', {
      totalOrders: config.totalOrders,
      targetTPS: config.ordersPerSecond,
      batchSize: config.batchSize,
      useV2Router: config.useV2Router
    });

    // 시뮬레이션 실행
    const results = await runSimulation(config, authResult.user?.id || 'test-user');
    
    return NextResponse.json({
      success: true,
      simulationId: `sim-${Date.now()}`,
      results: results
    });

  } catch (error) {
    console.error('❌ Simulation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Simulation failed'
    }, { status: 500 });
  }
}

/**
 * 설정 검증
 */
function validateConfig(config: SimulationConfig): boolean {
  if (!config.totalOrders || config.totalOrders <= 0) return false;
  if (!config.ordersPerSecond || config.ordersPerSecond <= 0) return false;
  if (!config.batchSize || config.batchSize <= 0) return false;
  if (config.orderTypes.market + config.orderTypes.limit !== 1) return false;
  if (config.sides.buy + config.sides.sell !== 1) return false;
  return true;
}

/**
 * 시뮬레이션 실행 - 성능 최적화 버전
 */
async function runSimulation(config: SimulationConfig, userId: string): Promise<SimulationStats> {
  const stats: SimulationStats = {
    totalOrders: config.totalOrders,
    completedOrders: 0,
    successfulOrders: 0,
    failedOrders: 0,
    averageResponseTime: 0,
    actualTPS: 0,
    startTime: Date.now(),
    errors: {}
  };

  const results: SimulationResult[] = [];
  const batchDelay = 1000 / (config.ordersPerSecond / config.batchSize); // 배치 간 지연시간

  console.log(`📊 Simulation parameters:`, {
    totalBatches: Math.ceil(config.totalOrders / config.batchSize),
    batchDelay: `${batchDelay.toFixed(2)}ms`,
    estimatedDuration: `${(config.totalOrders / config.ordersPerSecond).toFixed(2)}s`
  });

  // 🚀 최적화된 배치별 주문 실행
  const concurrentPromises: Promise<SimulationResult>[] = [];
  let currentBatch = 0;
  
  for (let batchIndex = 0; batchIndex < Math.ceil(config.totalOrders / config.batchSize); batchIndex++) {
    const batchStartTime = Date.now();
    const batchSize = Math.min(config.batchSize, config.totalOrders - (batchIndex * config.batchSize));
    
    // 배치 생성 및 실행 프로미스 수집
    const batchPromises: Promise<SimulationResult>[] = [];
    for (let i = 0; i < batchSize; i++) {
      const orderIndex = (batchIndex * config.batchSize) + i;
      const order = generateOrder(config, userId, orderIndex);
      batchPromises.push(executeOrder(order, config.useV2Router));
    }
    
    // 동시 실행 제한 (메모리 관리)
    concurrentPromises.push(...batchPromises);
    
    // 배치 크기에 따른 동적 처리
    if (concurrentPromises.length >= config.batchSize * 2 || batchIndex === Math.ceil(config.totalOrders / config.batchSize) - 1) {
      console.log(`🔄 Processing ${concurrentPromises.length} concurrent orders...`);
      
      const batchResults = await Promise.allSettled(concurrentPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            orderId: `failed-${Date.now()}-${Math.random()}`,
            success: false,
            responseTime: 0,
            error: result.reason?.message || 'Unknown error'
          });
        }
      }
      
      stats.completedOrders += concurrentPromises.length;
      concurrentPromises.length = 0; // 배열 초기화
      
      // 진행 상황 로그
      const currentTPS = stats.completedOrders / ((Date.now() - stats.startTime) / 1000);
      console.log(`📈 Progress: ${stats.completedOrders}/${config.totalOrders} orders (${currentTPS.toFixed(1)} TPS)`);
    }

    // 적응적 배치 간 지연
    const batchDuration = Date.now() - batchStartTime;
    const targetBatchDuration = (batchSize / config.ordersPerSecond) * 1000;
    const remainingDelay = Math.max(0, targetBatchDuration - batchDuration);
    
    if (remainingDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }
  }

  // 최종 통계 계산
  stats.endTime = Date.now();
  stats.successfulOrders = results.filter(r => r.success).length;
  stats.failedOrders = results.filter(r => !r.success).length;
  
  const responseTimes = results.filter(r => r.success).map(r => r.responseTime);
  stats.averageResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;
    
  stats.actualTPS = stats.completedOrders / ((stats.endTime - stats.startTime) / 1000);

  // 에러 분류
  results.filter(r => !r.success).forEach(r => {
    const errorType = r.error || 'Unknown error';
    stats.errors[errorType] = (stats.errors[errorType] || 0) + 1;
  });

  console.log('🎉 Simulation completed:', {
    duration: `${((stats.endTime - stats.startTime) / 1000).toFixed(2)}s`,
    actualTPS: stats.actualTPS.toFixed(1),
    successRate: `${((stats.successfulOrders / stats.totalOrders) * 100).toFixed(1)}%`,
    avgResponseTime: `${stats.averageResponseTime.toFixed(2)}ms`
  });

  return stats;
}

/**
 * 주문 생성
 */
function generateOrder(config: SimulationConfig, userId: string, orderIndex: number) {
  const isMarketOrder = Math.random() < config.orderTypes.market;
  const isBuyOrder = Math.random() < config.sides.buy;
  
  const amount = (Math.random() * (config.amountRange.max - config.amountRange.min) + config.amountRange.min).toFixed(2);
  const price = isMarketOrder ? undefined : (Math.random() * (config.priceRange.max - config.priceRange.min) + config.priceRange.min).toFixed(4);

  return {
    id: `sim-${orderIndex}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId,
    pair: 'HYPERINDEX-USDC',
    type: isMarketOrder ? 'market' : 'limit',
    side: isBuyOrder ? 'buy' : 'sell',
    amount,
    price: price || '0',
    timestamp: Date.now()
  };
}

/**
 * 주문 실행
 */
async function executeOrder(order: any, useV2Router: boolean): Promise<SimulationResult> {
  const startTime = Date.now();
  
  try {
    const apiEndpoint = useV2Router ? '/api/trading/v2/orders' : '/api/trading/v1/orders';
    
    const response = await fetch(`http://localhost:3000${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token' // 개발 환경용
      },
      body: JSON.stringify({
        pair: order.pair,
        type: order.type,
        side: order.side,
        amount: order.amount,
        price: order.price
      })
    });

    const responseTime = Date.now() - startTime;
    const result = await response.json();

    if (response.ok && result.success) {
      return {
        orderId: order.id,
        success: true,
        responseTime,
        orderDetails: result.order
      };
    } else {
      return {
        orderId: order.id,
        success: false,
        responseTime,
        error: result.error || 'API error'
      };
    }

  } catch (error) {
    return {
      orderId: order.id,
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * GET /api/trading/simulator - 기본 설정 반환
 */
export async function GET() {
  const defaultConfig: SimulationConfig = {
    totalOrders: 1000,
    ordersPerSecond: 900,
    batchSize: 50,
    orderTypes: {
      market: 0.7,
      limit: 0.3
    },
    sides: {
      buy: 0.5,
      sell: 0.5
    },
    amountRange: {
      min: 1,
      max: 1000
    },
    priceRange: {
      min: 0.5,
      max: 1.5
    },
    useV2Router: true
  };

  return NextResponse.json({
    success: true,
    defaultConfig,
    description: 'Mass order simulator for performance testing',
    endpoints: {
      start: 'POST /api/trading/simulator',
      config: 'GET /api/trading/simulator'
    }
  });
}