// app/api/trading/v1/tokens/hypercore-link/monitor/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TokenLinkingService from '@/lib/trading/token-linking-service';

interface RouteParams {
  params: {
    address: string;
  };
}

/**
 * GET /api/trading/v1/tokens/hypercore-link/monitor/[address]
 * Monitor token linking progress
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { address } = params;

    if (!address) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_ADDRESS',
          message: 'Token address is required'
        }
      }, { status: 400 });
    }

    const linkingService = TokenLinkingService.getInstance();
    const progress = await linkingService.monitorLinkingProgress(address);

    if (!progress.status) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TOKEN_NOT_FOUND',
          message: 'Token linking record not found'
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tokenAddress: address,
        status: progress.status,
        isComplete: progress.isComplete,
        progressSteps: {
          tokenRegistration: progress.status.linkStatus !== 'pending',
          priceFeedSetup: progress.status.linkStatus === 'linked',
          bridgeSetup: progress.status.linkStatus === 'linked',
          bridgeVerification: progress.status.linkStatus === 'linked',
          spotTradingEnabled: progress.status.linkStatus === 'linked'
        }
      }
    });

  } catch (error) {
    console.error('❌ API: Token linking monitoring failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to monitor token linking progress'
      }
    }, { status: 500 });
  }
}