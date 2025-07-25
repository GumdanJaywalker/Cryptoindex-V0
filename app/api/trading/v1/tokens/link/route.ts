// app/api/trading/v1/tokens/link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requirePrivyAuth } from '@/lib/middleware/privy-auth';
import { TokenLinkingService } from '@/lib/trading/token-linking-service';
import { z } from 'zod';

const LinkTokenSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  symbol: z.string().min(1).max(20, 'Symbol must be 1-20 characters'),
  name: z.string().max(100, 'Name must be less than 100 characters').optional(),
  decimals: z.number().int().min(0).max(18, 'Decimals must be 0-18').optional(),
  hypercoreAssetIndex: z.number().int().min(1000, 'Asset index must be >= 1000').optional(),
  evmExtraWeiDecimals: z.number().int().min(0).max(18, 'Extra decimals must be 0-18').optional(),
  forceRelink: z.boolean().optional(),
  metadata: z.object({
    totalSupply: z.string().optional(),
    creator: z.string().optional(),
    description: z.string().max(500).optional()
  }).optional()
});

/**
 * POST /api/trading/v1/tokens/link - Request token linking to HyperCore
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate input
    const validationResult = LinkTokenSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const {
      tokenAddress,
      symbol,
      name,
      decimals,
      hypercoreAssetIndex,
      evmExtraWeiDecimals,
      forceRelink,
      metadata
    } = validationResult.data;

    // Get token linking service
    const linkingService = TokenLinkingService.getInstance();

    // Check if already linked (unless forcing relink)
    if (!forceRelink) {
      const existingStatus = await linkingService.getLinkingStatus(tokenAddress);
      if (existingStatus && existingStatus.linkStatus === 'linked') {
        return NextResponse.json({
          success: true,
          message: 'Token already linked',
          linkStatus: existingStatus
        });
      }
    }

    // Request token linking
    const linkResult = await linkingService.requestTokenLink({
      tokenAddress,
      symbol,
      name,
      decimals,
      hypercoreAssetIndex,
      evmExtraWeiDecimals,
      metadata: {
        ...metadata,
        requestedBy: user.id // Track who requested the linking
      }
    });

    if (!linkResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: linkResult.error?.message || 'Token linking failed',
          errorCode: linkResult.error?.code
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token linking requested successfully',
      linkStatus: linkResult.linkStatus
    });

  } catch (error) {
    console.error('❌ Token linking API error:', error);
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
 * GET /api/trading/v1/tokens/link - Get all token linking statuses
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'linked' | 'failed' | 'rejected' | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get token linking service
    const linkingService = TokenLinkingService.getInstance();
    
    // Get all tokens with status
    let allTokens = await linkingService.getAllTokensWithStatus();

    // Filter by status if specified
    if (status) {
      allTokens = allTokens.filter(token => token.linkStatus === status);
    }

    // Apply pagination
    const paginatedTokens = allTokens.slice(offset, offset + limit);

    // Format response
    const formattedTokens = paginatedTokens.map(token => ({
      tokenAddress: token.tokenAddress,
      symbol: token.symbol,
      hypercoreAssetIndex: token.hypercoreAssetIndex,
      linkStatus: token.linkStatus,
      linkTimestamp: token.linkTimestamp?.toISOString(),
      failureReason: token.failureReason,
      retryCount: token.retryCount,
      evmExtraWeiDecimals: token.evmExtraWeiDecimals,
      isActive: token.isActive,
      isTradeable: token.isTradeable
    }));

    return NextResponse.json({
      success: true,
      tokens: formattedTokens,
      pagination: {
        total: allTokens.length,
        offset,
        limit,
        hasMore: offset + limit < allTokens.length
      }
    });

  } catch (error) {
    console.error('❌ Get token linking status API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}