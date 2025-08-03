import { NextRequest, NextResponse } from 'next/server';
import { MatchingEngine } from '@/lib/orderbook/matching-engine';

const matchingEngine = new MatchingEngine();

// GET /api/trading/v1/orderbook - 오더북 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');
    const depth = parseInt(searchParams.get('depth') || '20');

    if (!pair) {
      return NextResponse.json(
        { error: 'Pair parameter is required' },
        { status: 400 }
      );
    }

    // 오더북 조회
    const orderbook = await matchingEngine.getOrderbook(pair, depth);

    return NextResponse.json({
      success: true,
      data: orderbook
    });

  } catch (error) {
    console.error('Orderbook fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}