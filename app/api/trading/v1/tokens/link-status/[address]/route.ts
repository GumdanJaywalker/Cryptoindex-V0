// app/api/trading/v1/tokens/link-status/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requirePrivyAuth } from '@/lib/middleware/privy-auth';
import { TokenLinkingService } from '@/lib/trading/token-linking-service';
import { ethers } from 'ethers';

/**
 * GET /api/trading/v1/tokens/link-status/[address] - Get token linking status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const tokenAddress = params.address;

    // Validate token address
    if (!ethers.isAddress(tokenAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token address format'
        },
        { status: 400 }
      );
    }

    // Get token linking service
    const linkingService = TokenLinkingService.getInstance();

    // Get linking status
    const linkStatus = await linkingService.getLinkingStatus(tokenAddress);

    if (!linkStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token linking record not found'
        },
        { status: 404 }
      );
    }

    // Get linking progress
    const progress = await linkingService.monitorLinkingProgress(tokenAddress);

    return NextResponse.json({
      success: true,
      linkStatus: {
        tokenAddress: linkStatus.tokenAddress,
        symbol: linkStatus.symbol,
        hypercoreAssetIndex: linkStatus.hypercoreAssetIndex,
        linkStatus: linkStatus.linkStatus,
        linkTimestamp: linkStatus.linkTimestamp?.toISOString(),
        failureReason: linkStatus.failureReason,
        retryCount: linkStatus.retryCount,
        evmExtraWeiDecimals: linkStatus.evmExtraWeiDecimals,
        isActive: linkStatus.isActive,
        isTradeable: linkStatus.isTradeable
      },
      progress: {
        isComplete: progress.isComplete,
        canRetry: linkStatus.linkStatus === 'failed' && linkStatus.retryCount < 3
      }
    });

  } catch (error) {
    console.error('❌ Get token link status API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/trading/v1/tokens/link-status/[address] - Retry token linking
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const tokenAddress = params.address;

    // Validate token address
    if (!ethers.isAddress(tokenAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token address format'
        },
        { status: 400 }
      );
    }

    // Get token linking service
    const linkingService = TokenLinkingService.getInstance();

    // Retry linking
    const retryResult = await linkingService.retryLinking(tokenAddress);

    if (!retryResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: retryResult.error?.message || 'Retry failed',
          errorCode: retryResult.error?.code
        },
        { status: 400 }
      );
    }

    // Get updated status
    const updatedStatus = await linkingService.getLinkingStatus(tokenAddress);

    return NextResponse.json({
      success: true,
      message: 'Token linking retry initiated',
      linkStatus: updatedStatus ? {
        tokenAddress: updatedStatus.tokenAddress,
        symbol: updatedStatus.symbol,
        hypercoreAssetIndex: updatedStatus.hypercoreAssetIndex,
        linkStatus: updatedStatus.linkStatus,
        linkTimestamp: updatedStatus.linkTimestamp?.toISOString(),
        failureReason: updatedStatus.failureReason,
        retryCount: updatedStatus.retryCount,
        evmExtraWeiDecimals: updatedStatus.evmExtraWeiDecimals,
        isActive: updatedStatus.isActive,
        isTradeable: updatedStatus.isTradeable
      } : null
    });

  } catch (error) {
    console.error('❌ Retry token linking API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}