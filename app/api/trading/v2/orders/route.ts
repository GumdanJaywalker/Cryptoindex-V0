import { NextRequest, NextResponse } from 'next/server';
import { extractPrivyAuthFromRequest } from '@/lib/middleware/privy-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * V2 주문 이력을 PostgreSQL에 저장
 */
async function saveOrderHistory(order: any, routingResult: any, userId: string) {
  try {
    console.log('💾 Saving V2 order history to PostgreSQL...');
    
    const filledAmount = parseFloat(routingResult.totalFilled);
    const status = filledAmount >= parseFloat(order.amount) * 0.99 ? 'filled' : 'partial';
    
    // order_history 테이블에 저장
    const { data, error } = await supabase
      .from('order_history')
      .insert({
        id: order.id,
        user_id: userId,
        pair: order.pair,
        side: order.side,
        order_type: order.type,
        price: order.type === 'limit' ? order.price : routingResult.averagePrice,
        amount: order.amount,
        filled_amount: routingResult.totalFilled,
        status: status,
        redis_order_id: order.id
      });

    if (error) {
      console.error('❌ Failed to save order history:', error);
      // 이력 저장 실패는 치명적이지 않으므로 경고만 출력
    } else {
      console.log('✅ V2 order history saved successfully');
    }

    // trade_history 테이블에 개별 거래 저장
    if (routingResult.fills && routingResult.fills.length > 0) {
      const tradePromises = routingResult.fills.map(async (fill: any) => {
        return supabase
          .from('trade_history')
          .insert({
            id: crypto.randomUUID(),
            user_id: userId,
            pair: order.pair,
            side: order.side,
            amount: fill.amount,
            price: fill.price,
            source: fill.source || 'unknown',
            price_impact: fill.priceImpact || null,
            amm_reserves_before: fill.ammReservesBefore ? JSON.stringify(fill.ammReservesBefore) : null,
            amm_reserves_after: fill.ammReservesAfter ? JSON.stringify(fill.ammReservesAfter) : null,
            redis_trade_id: fill.id || null
          });
      });

      await Promise.allSettled(tradePromises);
      console.log(`✅ Saved ${routingResult.fills.length} trade records`);
    }

  } catch (error) {
    console.error('❌ Error saving V2 order history:', error);
    // 이력 저장 실패는 주문 처리에 영향을 주지 않음
  }
}

// POST /api/trading/v2/orders - V2 하이브리드 주문 처리
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await extractPrivyAuthFromRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      );
    }

    const user = authResult.user!;
    const body = await request.json();

    // 요청 데이터 검증
    const { pair, type, side, amount, price } = body;

    if (!pair || !type || !side || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'limit' && !price) {
      return NextResponse.json(
        { success: false, error: 'Price is required for limit orders' },
        { status: 400 }
      );
    }

    console.log('🚀 V2 ORDER PROCESSING:', { 
      pair: pair || 'HYPERINDEX-USDC', 
      type, 
      side, 
      amount, 
      price 
    });

    // V2 HybridSmartRouter 사용
    const { HybridSmartRouterV2 } = await import('@/lib/trading/smart-router-v2');
    const smartRouterV2 = HybridSmartRouterV2.getInstance();
    
    // V2 주문 객체 생성 - UUID 생성
    const orderId = crypto.randomUUID();
    const orderV2 = {
      id: orderId,
      userId: user.id,
      pair: pair || 'HYPERINDEX-USDC',
      side: side as 'buy' | 'sell',
      type: type as 'market' | 'limit',
      amount: amount.toString(),
      price: price ? price.toString() : '0',
      remaining: amount.toString(),
      status: 'active' as const,
      timestamp: Date.now()
    };

    // V2 하이브리드 라우팅 실행
    const routingResult = await smartRouterV2.processHybridOrder(orderV2);

    // PostgreSQL에 주문 이력 저장
    await saveOrderHistory(orderV2, routingResult, user.id);

    console.log('✅ V2 ORDER COMPLETED:', {
      orderId: orderV2.id,
      totalFilled: routingResult.totalFilled,
      averagePrice: routingResult.averagePrice,
      executionStats: routingResult.executionStats
    });

    return NextResponse.json({
      success: true,
      order: {
        id: orderV2.id,
        pair: orderV2.pair,
        side: orderV2.side,
        type: orderV2.type,
        amount: orderV2.amount,
        price: orderV2.price,
        status: parseFloat(routingResult.totalFilled) > 0 ? 'filled' : 'partial',
        timestamp: orderV2.timestamp
      },
      routing: routingResult,
      executionStats: routingResult.executionStats,
      fills: routingResult.fills,
      summary: {
        totalFilled: routingResult.totalFilled,
        averagePrice: routingResult.averagePrice,
        totalChunks: routingResult.executionStats.totalChunks,
        ammChunks: routingResult.executionStats.ammChunks,
        orderbookChunks: routingResult.executionStats.orderbookChunks,
        iterations: routingResult.executionStats.iterations
      }
    });

  } catch (error) {
    console.error('❌ V2 Order processing error:', error);
    
    // 에러 타입별 처리
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Limit price crosses market price')) {
        errorMessage = error.message;
        statusCode = 400;
      } else if (error.message.includes('Authentication')) {
        errorMessage = 'Authentication failed';
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    );
  }
}