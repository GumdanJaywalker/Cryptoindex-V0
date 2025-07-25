// app/api/trading/v1/tokens/hypercore-link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TokenLinkingService from '@/lib/trading/token-linking-service';

/**
 * POST /api/trading/v1/tokens/hypercore-link
 * Link ERC-20 token to HyperCore for spot trading
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress, symbol, name, decimals, metadata } = body;

    // Validate required fields
    if (!tokenAddress || !symbol) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'tokenAddress and symbol are required'
        }
      }, { status: 400 });
    }

    const linkingService = TokenLinkingService.getInstance();
    
    console.log(`🔄 API: Starting token link request for ${symbol} (${tokenAddress})`);

    const result = await linkingService.requestTokenLink({
      tokenAddress,
      symbol,
      name,
      decimals: decimals || 18,
      metadata
    });

    if (result.success) {
      console.log(`✅ API: Token link request successful for ${symbol}`);
      return NextResponse.json({
        success: true,
        data: {
          tokenAddress,
          symbol,
          linkStatus: result.linkStatus,
          message: 'Token linking process started. Check status endpoint for progress.'
        }
      });
    } else {
      console.error(`❌ API: Token link request failed for ${symbol}:`, result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ API: Token linking request failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/trading/v1/tokens/hypercore-link
 * Get all tokens with their HyperCore linking status
 */
export async function GET() {
  try {
    const linkingService = TokenLinkingService.getInstance();
    const tokens = await linkingService.getAllTokensWithStatus();

    return NextResponse.json({
      success: true,
      data: {
        tokens,
        totalCount: tokens.length,
        linkedCount: tokens.filter(t => t.linkStatus === 'linked').length,
        pendingCount: tokens.filter(t => t.linkStatus === 'pending').length,
        failedCount: tokens.filter(t => t.linkStatus === 'failed').length
      }
    });

  } catch (error) {
    console.error('❌ API: Failed to get tokens status:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve tokens status'
      }
    }, { status: 500 });
  }
}