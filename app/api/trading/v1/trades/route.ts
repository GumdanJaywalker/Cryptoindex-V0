import { NextRequest, NextResponse } from 'next/server';
import { MatchingEngine } from '@/lib/orderbook/matching-engine';

const matchingEngine = new MatchingEngine();

// GET /api/trading/v1/trades - 최근 거래 내역 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!pair) {
      return NextResponse.json(
        { error: 'Pair parameter is required' },
        { status: 400 }
      );
    }

    if (limit > 200) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 200' },
        { status: 400 }
      );
    }

    // 최근 거래 조회
    const trades = await matchingEngine.getRecentTrades(pair, limit);

    return NextResponse.json({
      success: true,
      data: {
        trades,
        total: trades.length
      }
    });

  } catch (error) {
    console.error('Trades fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}