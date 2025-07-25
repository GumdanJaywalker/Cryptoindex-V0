// app/api/trading/v1/tokens/spot-readiness/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SpotTradingVerifier from '@/lib/trading/spot-trading-verifier';

/**
 * GET /api/trading/v1/tokens/spot-readiness
 * Get spot trading readiness report for all tokens
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tokenAddress = url.searchParams.get('tokenAddress');
    const reportType = url.searchParams.get('type') || 'all'; // all, ready, attention, failed

    const verifier = SpotTradingVerifier.getInstance();

    if (tokenAddress) {
      // Single token verification
      console.log(`🔄 API: Verifying spot trading readiness for ${tokenAddress}`);
      
      const readiness = await verifier.verifyTokenReadiness(tokenAddress);
      
      return NextResponse.json({
        success: true,
        data: {
          tokenAddress,
          readiness
        }
      });
    }

    // Multiple tokens or report
    console.log(`🔄 API: Generating spot trading readiness report (type: ${reportType})`);
    
    switch (reportType) {
      case 'ready':
        const readyTokens = await verifier.getReadyTokens();
        return NextResponse.json({
          success: true,
          data: {
            type: 'ready',
            tokens: readyTokens,
            count: readyTokens.length
          }
        });

      case 'attention':
        const needingAttention = await verifier.getTokensNeedingAttention();
        return NextResponse.json({
          success: true,
          data: {
            type: 'needingAttention',
            tokens: needingAttention,
            count: needingAttention.length
          }
        });

      case 'report':
        const report = await verifier.generateReadinessReport();
        return NextResponse.json({
          success: true,
          data: {
            type: 'report',
            report
          }
        });

      default: // 'all'
        const allTokens = await verifier.verifyAllTokensReadiness();
        return NextResponse.json({
          success: true,
          data: {
            type: 'all',
            tokens: allTokens,
            count: allTokens.length,
            summary: {
              ready: allTokens.filter(t => t.isReady).length,
              needingAttention: allTokens.filter(t => t.status.isLinked && !t.isReady).length,
              failed: allTokens.filter(t => !t.status.isLinked).length
            }
          }
        });
    }

  } catch (error) {
    console.error('❌ API: Spot readiness check failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to check spot trading readiness'
      }
    }, { status: 500 });
  }
}