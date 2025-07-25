// lib/trading/spot-trading-verifier.ts
import TokenLinkingService from './token-linking-service';
import { createClient } from '@supabase/supabase-js';

/**
 * Spot Trading Verifier
 * Verifies that tokens are properly linked and ready for spot trading
 */

interface SpotTradingReadiness {
  tokenAddress: string;
  symbol: string;
  hypercoreIndex: number;
  isReady: boolean;
  status: {
    isLinked: boolean;
    hasPriceFeed: boolean;
    bridgeEnabled: boolean;
    spotTradingEnabled: boolean;
  };
  issues: string[];
  priceUsd?: string;
}

export class SpotTradingVerifier {
  private static instance: SpotTradingVerifier;
  private supabase;
  private linkingService: TokenLinkingService;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.linkingService = TokenLinkingService.getInstance();
  }

  static getInstance(): SpotTradingVerifier {
    if (!SpotTradingVerifier.instance) {
      SpotTradingVerifier.instance = new SpotTradingVerifier();
    }
    return SpotTradingVerifier.instance;
  }

  /**
   * Verify if a token is ready for spot trading
   */
  async verifyTokenReadiness(tokenAddress: string): Promise<SpotTradingReadiness> {
    const issues: string[] = [];

    try {
      // Get linking status
      const linkStatus = await this.linkingService.getLinkingStatus(tokenAddress);
      
      if (!linkStatus) {
        return {
          tokenAddress,
          symbol: 'UNKNOWN',
          hypercoreIndex: 0,
          isReady: false,
          status: {
            isLinked: false,
            hasPriceFeed: false,
            bridgeEnabled: false,
            spotTradingEnabled: false
          },
          issues: ['Token not found in linking records']
        };
      }

      // Check if token is linked
      const isLinked = linkStatus.linkStatus === 'linked';
      if (!isLinked) {
        issues.push(`Token linking status: ${linkStatus.linkStatus}${linkStatus.failureReason ? ` (${linkStatus.failureReason})` : ''}`);
      }

      // Get HyperCore asset info
      const hypercoreIndex = linkStatus.hypercoreAssetIndex || 0;
      let assetInfo;
      let hasPriceFeed = false;
      let bridgeEnabled = false;
      let spotTradingEnabled = false;

      if (isLinked && hypercoreIndex > 0) {
        try {
          // Get asset info from HyperCore
          const hyperCore = (this.linkingService as any).hyperCore;
          assetInfo = await hyperCore.getAssetInfo(hypercoreIndex);
          
          // Check if price feed is available
          hasPriceFeed = !!assetInfo.priceUsd;
          if (!hasPriceFeed) {
            issues.push('Price feed not available');
          }

          // Check if asset is active and tradeable
          spotTradingEnabled = assetInfo.isActive && assetInfo.isTradeable;
          if (!spotTradingEnabled) {
            issues.push('Spot trading not enabled in HyperCore');
          }

          // Check bridge functionality
          const bridgeVerification = await hyperCore.verifyBridgeSetup(hypercoreIndex);
          bridgeEnabled = bridgeVerification.isSetup && bridgeVerification.canDeposit && bridgeVerification.canWithdraw;
          if (!bridgeEnabled) {
            issues.push('Bridge not properly configured');
          }

        } catch (error) {
          issues.push(`HyperCore verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Check if token exists in trading database
      const { data: tokenData } = await this.supabase
        .from('index_tokens')
        .select('*')
        .eq('token_address', tokenAddress)
        .single();

      if (!tokenData) {
        issues.push('Token not found in trading database');
      } else if (!tokenData.is_active || !tokenData.is_tradeable) {
        issues.push('Token is not active or tradeable in database');
      }

      const isReady = isLinked && hasPriceFeed && bridgeEnabled && spotTradingEnabled && issues.length === 0;

      return {
        tokenAddress,
        symbol: linkStatus.symbol,
        hypercoreIndex,
        isReady,
        status: {
          isLinked,
          hasPriceFeed,
          bridgeEnabled,
          spotTradingEnabled
        },
        issues,
        priceUsd: assetInfo?.priceUsd
      };

    } catch (error) {
      console.error('❌ Token readiness verification failed:', error);
      return {
        tokenAddress,
        symbol: 'ERROR',
        hypercoreIndex: 0,
        isReady: false,
        status: {
          isLinked: false,
          hasPriceFeed: false,
          bridgeEnabled: false,
          spotTradingEnabled: false
        },
        issues: [`Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Verify readiness for all linked tokens
   */
  async verifyAllTokensReadiness(): Promise<SpotTradingReadiness[]> {
    try {
      const allTokens = await this.linkingService.getAllTokensWithStatus();
      const verificationResults: SpotTradingReadiness[] = [];

      for (const token of allTokens) {
        const readiness = await this.verifyTokenReadiness(token.tokenAddress);
        verificationResults.push(readiness);
      }

      return verificationResults;

    } catch (error) {
      console.error('❌ Failed to verify all tokens readiness:', error);
      return [];
    }
  }

  /**
   * Get only tokens that are ready for trading
   */
  async getReadyTokens(): Promise<SpotTradingReadiness[]> {
    const allReadiness = await this.verifyAllTokensReadiness();
    return allReadiness.filter(token => token.isReady);
  }

  /**
   * Get tokens that need attention (not ready but should be)
   */
  async getTokensNeedingAttention(): Promise<SpotTradingReadiness[]> {
    const allReadiness = await this.verifyAllTokensReadiness();
    return allReadiness.filter(token => 
      token.status.isLinked && !token.isReady // Linked but not ready
    );
  }

  /**
   * Generate readiness report
   */
  async generateReadinessReport(): Promise<{
    summary: {
      totalTokens: number;
      readyTokens: number;
      needingAttention: number;
      failedLinking: number;
    };
    ready: SpotTradingReadiness[];
    needingAttention: SpotTradingReadiness[];
    failed: SpotTradingReadiness[];
  }> {
    const allReadiness = await this.verifyAllTokensReadiness();
    
    const ready = allReadiness.filter(t => t.isReady);
    const needingAttention = allReadiness.filter(t => t.status.isLinked && !t.isReady);
    const failed = allReadiness.filter(t => !t.status.isLinked);

    return {
      summary: {
        totalTokens: allReadiness.length,
        readyTokens: ready.length,
        needingAttention: needingAttention.length,
        failedLinking: failed.length
      },
      ready,
      needingAttention,
      failed
    };
  }

  /**
   * Test spot trading functionality for a token
   */
  async testSpotTrading(tokenAddress: string, testAmount: string = '1.0'): Promise<{
    success: boolean;
    canBuy: boolean;
    canSell: boolean;
    bridgeDeposit: boolean;
    bridgeWithdraw: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const readiness = await this.verifyTokenReadiness(tokenAddress);
      
      if (!readiness.isReady) {
        return {
          success: false,
          canBuy: false,
          canSell: false,
          bridgeDeposit: false,
          bridgeWithdraw: false,
          errors: [`Token not ready for trading: ${readiness.issues.join(', ')}`]
        };
      }

      const hypercoreIndex = readiness.hypercoreIndex;
      const hyperCore = (this.linkingService as any).hyperCore;

      // Test buy/sell permissions
      let canBuy = false;
      let canSell = false;
      
      try {
        canBuy = await hyperCore.isTransferAllowed(hypercoreIndex, 'system', 'user', testAmount);
        canSell = await hyperCore.isTransferAllowed(hypercoreIndex, 'user', 'system', testAmount);
      } catch (error) {
        errors.push(`Transfer permission test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test bridge functionality
      let bridgeDeposit = false;
      let bridgeWithdraw = false;
      
      try {
        const bridgeVerification = await hyperCore.verifyBridgeSetup(hypercoreIndex);
        bridgeDeposit = bridgeVerification.canDeposit;
        bridgeWithdraw = bridgeVerification.canWithdraw;
      } catch (error) {
        errors.push(`Bridge test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      const success = canBuy && canSell && bridgeDeposit && bridgeWithdraw && errors.length === 0;

      return {
        success,
        canBuy,
        canSell,
        bridgeDeposit,
        bridgeWithdraw,
        errors
      };

    } catch (error) {
      console.error('❌ Spot trading test failed:', error);
      return {
        success: false,
        canBuy: false,
        canSell: false,
        bridgeDeposit: false,
        bridgeWithdraw: false,
        errors: [`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}

export default SpotTradingVerifier;