// app/api/trading/v1/tokens/hypercore-link/retry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TokenLinkingService from '@/lib/trading/token-linking-service';

/**
 * POST /api/trading/v1/tokens/hypercore-link/retry
 * Retry failed token linking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress } = body;

    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_TOKEN_ADDRESS',
          message: 'tokenAddress is required'
        }
      }, { status: 400 });
    }

    const linkingService = TokenLinkingService.getInstance();
    
    console.log(`🔄 API: Retrying token link for ${tokenAddress}`);

    const result = await linkingService.retryLinking(tokenAddress);

    if (result.success) {
      console.log(`✅ API: Token link retry successful for ${tokenAddress}`);
      return NextResponse.json({
        success: true,
        data: {
          tokenAddress,
          message: 'Token linking retry started. Check status endpoint for progress.'
        }
      });
    } else {
      console.error(`❌ API: Token link retry failed for ${tokenAddress}:`, result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ API: Token linking retry failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 });
  }
}