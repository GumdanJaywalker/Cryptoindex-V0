// app/api/trading/v1/tokens/spot-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SpotTradingVerifier from '@/lib/trading/spot-trading-verifier';

/**
 * POST /api/trading/v1/tokens/spot-test
 * Test spot trading functionality for a token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress, testAmount } = body;

    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_TOKEN_ADDRESS',
          message: 'tokenAddress is required'
        }
      }, { status: 400 });
    }

    const verifier = SpotTradingVerifier.getInstance();
    
    console.log(`🔧 API: Testing spot trading functionality for ${tokenAddress}`);

    const testResult = await verifier.testSpotTrading(tokenAddress, testAmount);

    if (testResult.success) {
      console.log(`✅ API: Spot trading test successful for ${tokenAddress}`);
    } else {
      console.warn(`⚠️ API: Spot trading test issues for ${tokenAddress}:`, testResult.errors);
    }

    return NextResponse.json({
      success: true,
      data: {
        tokenAddress,
        testAmount: testAmount || '1.0',
        testResult
      }
    });

  } catch (error) {
    console.error('❌ API: Spot trading test failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to test spot trading functionality'
      }
    }, { status: 500 });
  }
}