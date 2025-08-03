import { NextRequest, NextResponse } from 'next/server';
import { MatchingEngine } from '@/lib/orderbook/matching-engine';

const matchingEngine = new MatchingEngine();

// GET /api/trading/v1/market - 시장 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');

    if (!pair) {
      return NextResponse.json(
        { error: 'Pair parameter is required' },
        { status: 400 }
      );
    }

    // 시장 통계 조회
    const marketStats = await matchingEngine.getMarketStats(pair);

    if (!marketStats) {
      return NextResponse.json({
        success: true,
        data: {
          pair,
          lastPrice: '0',
          high24h: '0',
          low24h: '0',
          volume24h: '0',
          trades24h: 0,
          lastUpdate: Date.now()
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: marketStats
    });

  } catch (error) {
    console.error('Market data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}