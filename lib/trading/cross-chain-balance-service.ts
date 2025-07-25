// lib/trading/cross-chain-balance-service.ts
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { TokenLinkingService } from './token-linking-service';
import { PrecisionUtils } from './precision-utils';

/**
 * Cross-Chain Balance Service
 * Manages balances between EVM and HyperCore
 * Uses back_dev1's HyperliquidBridge concept
 */

interface ChainBalance {
  available: string;
  locked: string;    // In orders/contracts
  total: string;
}

interface CrossChainBalance {
  tokenAddress: string;
  symbol: string;
  decimals: number;
  balances: {
    evm: ChainBalance;
    hypercore: ChainBalance;
    combined: ChainBalance;
  };
  lastSynced: Date;
  syncStatus: 'synced' | 'syncing' | 'error';
  syncError?: string;
}

interface TransferRequest {
  userAddress: string;
  tokenAddress: string;
  amount: string;
  fromChain: 'evm' | 'hypercore';
  toChain: 'evm' | 'hypercore';
}

interface TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  estimatedTime?: number; // seconds
}

interface BalanceOptimizationSuggestion {
  recommended: {
    evm: string;
    hypercore: string;
    reasoning: string[];
  };
  transfers: Array<{
    from: 'evm' | 'hypercore';
    to: 'evm' | 'hypercore';
    amount: string;
    reason: string;
  }>;
}

export class CrossChainBalanceService {
  private static instance: CrossChainBalanceService;
  private supabase;
  private linkingService: TokenLinkingService;

  // Bridge interface - in real implementation, connects to HyperliquidBridge
  private bridge: {
    transferToHyperCore: (token: string, amount: string, from: string) => Promise<TransferResult>;
    transferToEVM: (assetIndex: number, amount: string, to: string) => Promise<TransferResult>;
    getEVMBalance: (token: string, address: string) => Promise<string>;
    getHyperCoreBalance: (assetIndex: number, address: string) => Promise<string>;
    estimateTransferFee: (from: string, to: string, token: string, amount: string) => Promise<string>;
    estimateTransferTime: (from: string, to: string) => Promise<number>;
  };

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.linkingService = TokenLinkingService.getInstance();
    this.bridge = this.initializeBridgeInterface();
  }

  static getInstance(): CrossChainBalanceService {
    if (!CrossChainBalanceService.instance) {
      CrossChainBalanceService.instance = new CrossChainBalanceService();
    }
    return CrossChainBalanceService.instance;
  }

  /**
   * Get unified balance across chains
   */
  async getUnifiedBalance(
    userAddress: string,
    tokenAddress: string
  ): Promise<CrossChainBalance | null> {
    try {
      console.log(`🔄 Getting unified balance for ${tokenAddress} (${userAddress})`);

      // Check if token is linked
      const linkStatus = await this.linkingService.getLinkingStatus(tokenAddress);
      if (!linkStatus || linkStatus.linkStatus !== 'linked') {
        console.error(`❌ Token not linked: ${tokenAddress}`);
        return null;
      }

      // Get cached balance first
      const cachedBalance = await this.getCachedBalance(userAddress, tokenAddress);
      
      // If cache is recent (< 30 seconds), return it
      if (cachedBalance && this.isCacheValid(cachedBalance.lastSynced, 30)) {
        return cachedBalance;
      }

      // Sync balances from both chains
      const syncResult = await this.syncBalances(userAddress, [tokenAddress]);
      if (!syncResult.success) {
        // Return cached balance if sync fails
        if (cachedBalance) {
          return {
            ...cachedBalance,
            syncStatus: 'error',
            syncError: syncResult.error
          };
        }
        return null;
      }

      // Get fresh balance after sync
      return await this.getCachedBalance(userAddress, tokenAddress);

    } catch (error) {
      console.error('❌ Failed to get unified balance:', error);
      return null;
    }
  }

  /**
   * Sync balances between chains
   */
  async syncBalances(
    userAddress: string,
    tokenAddresses?: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔄 Syncing balances for ${userAddress}`);

      // Get tokens to sync
      let tokensToSync: string[] = [];
      if (tokenAddresses) {
        tokensToSync = tokenAddresses;
      } else {
        // Get all linked tokens for user
        const linkedTokens = await this.linkingService.getAllTokensWithStatus();
        tokensToSync = linkedTokens
          .filter(token => token.linkStatus === 'linked')
          .map(token => token.tokenAddress);
      }

      // Sync each token
      for (const tokenAddress of tokensToSync) {
        await this.syncSingleTokenBalance(userAddress, tokenAddress);
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Balance sync failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      };
    }
  }

  /**
   * Transfer between chains
   */
  async transferToHyperCore(
    userAddress: string,
    tokenAddress: string,
    amount: string
  ): Promise<TransferResult> {
    try {
      console.log(`🔄 Transferring ${amount} ${tokenAddress} to HyperCore`);

      // Validate inputs
      const validation = PrecisionUtils.validateAndFormatAmount(amount);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Check if token is linked
      const linkStatus = await this.linkingService.getLinkingStatus(tokenAddress);
      if (!linkStatus || linkStatus.linkStatus !== 'linked') {
        return {
          success: false,
          error: 'Token not linked to HyperCore'
        };
      }

      // Check EVM balance
      const currentBalance = await this.getUnifiedBalance(userAddress, tokenAddress);
      if (!currentBalance) {
        return {
          success: false,
          error: 'Failed to check current balance'
        };
      }

      if (!PrecisionUtils.isAmountEqual(currentBalance.balances.evm.available, amount) &&
          parseFloat(currentBalance.balances.evm.available) < parseFloat(amount)) {
        return {
          success: false,
          error: 'Insufficient EVM balance'
        };
      }

      // Execute transfer via bridge
      const transferResult = await this.bridge.transferToHyperCore(
        tokenAddress,
        validation.formatted!,
        userAddress
      );

      if (transferResult.success) {
        // Update cached balances
        await this.syncSingleTokenBalance(userAddress, tokenAddress);
        
        // Record transfer
        await this.recordTransfer({
          userAddress,
          tokenAddress,
          amount: validation.formatted!,
          fromChain: 'evm',
          toChain: 'hypercore'
        }, transferResult);
      }

      return transferResult;

    } catch (error) {
      console.error('❌ Transfer to HyperCore failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  /**
   * Transfer to EVM
   */
  async transferToEVM(
    userAddress: string,
    tokenAddress: string,
    amount: string
  ): Promise<TransferResult> {
    try {
      console.log(`🔄 Transferring ${amount} ${tokenAddress} to EVM`);

      // Validate inputs
      const validation = PrecisionUtils.validateAndFormatAmount(amount);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Check if token is linked
      const linkStatus = await this.linkingService.getLinkingStatus(tokenAddress);
      if (!linkStatus || linkStatus.linkStatus !== 'linked' || !linkStatus.hypercoreAssetIndex) {
        return {
          success: false,
          error: 'Token not linked to HyperCore'
        };
      }

      // Check HyperCore balance
      const currentBalance = await this.getUnifiedBalance(userAddress, tokenAddress);
      if (!currentBalance) {
        return {
          success: false,
          error: 'Failed to check current balance'
        };
      }

      if (!PrecisionUtils.isAmountEqual(currentBalance.balances.hypercore.available, amount) &&
          parseFloat(currentBalance.balances.hypercore.available) < parseFloat(amount)) {
        return {
          success: false,
          error: 'Insufficient HyperCore balance'
        };
      }

      // Execute transfer via bridge
      const transferResult = await this.bridge.transferToEVM(
        linkStatus.hypercoreAssetIndex,
        validation.formatted!,
        userAddress
      );

      if (transferResult.success) {
        // Update cached balances
        await this.syncSingleTokenBalance(userAddress, tokenAddress);
        
        // Record transfer
        await this.recordTransfer({
          userAddress,
          tokenAddress,
          amount: validation.formatted!,
          fromChain: 'hypercore',
          toChain: 'evm'
        }, transferResult);
      }

      return transferResult;

    } catch (error) {
      console.error('❌ Transfer to EVM failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  /**
   * Suggest optimal balance distribution
   */
  async suggestOptimalBalance(
    userAddress: string,
    tokenAddress: string,
    intendedAction: 'trade' | 'stake' | 'transfer'
  ): Promise<BalanceOptimizationSuggestion | null> {
    try {
      const currentBalance = await this.getUnifiedBalance(userAddress, tokenAddress);
      if (!currentBalance) return null;

      const evmTotal = parseFloat(currentBalance.balances.evm.total);
      const hypercoreTotal = parseFloat(currentBalance.balances.hypercore.total);
      const combinedTotal = evmTotal + hypercoreTotal;

      if (combinedTotal === 0) {
        return {
          recommended: {
            evm: '0',
            hypercore: '0',
            reasoning: ['No balance to optimize']
          },
          transfers: []
        };
      }

      const suggestions: BalanceOptimizationSuggestion = {
        recommended: {
          evm: '0',
          hypercore: '0',
          reasoning: []
        },
        transfers: []
      };

      switch (intendedAction) {
        case 'trade':
          // For trading, keep most balance on HyperCore for better liquidity
          const recommendedHypercore = combinedTotal * 0.8; // 80% on HyperCore
          const recommendedEVM = combinedTotal * 0.2; // 20% on EVM

          suggestions.recommended = {
            evm: recommendedEVM.toString(),
            hypercore: recommendedHypercore.toString(),
            reasoning: [
              'Trading requires most liquidity on HyperCore',
              'Keep some EVM balance for gas and flexibility',
              '80/20 split optimizes for trading performance'
            ]
          };

          // Calculate needed transfers
          if (hypercoreTotal < recommendedHypercore) {
            const transferAmount = recommendedHypercore - hypercoreTotal;
            suggestions.transfers.push({
              from: 'evm',
              to: 'hypercore',
              amount: transferAmount.toString(),
              reason: 'Increase HyperCore balance for better trading liquidity'
            });
          } else if (evmTotal < recommendedEVM) {
            const transferAmount = recommendedEVM - evmTotal;
            suggestions.transfers.push({
              from: 'hypercore',
              to: 'evm',
              amount: transferAmount.toString(),
              reason: 'Maintain minimum EVM balance for flexibility'
            });
          }
          break;

        case 'stake':
          // For staking, keep balance on EVM
          suggestions.recommended = {
            evm: combinedTotal.toString(),
            hypercore: '0',
            reasoning: [
              'Staking typically requires EVM balance',
              'Transfer all funds to EVM for staking'
            ]
          };

          if (hypercoreTotal > 0) {
            suggestions.transfers.push({
              from: 'hypercore',
              to: 'evm',
              amount: hypercoreTotal.toString(),
              reason: 'Move funds to EVM for staking'
            });
          }
          break;

        case 'transfer':
          // For transfers, prefer EVM for broader compatibility
          const transferRecommendedEVM = combinedTotal * 0.7; // 70% on EVM
          const transferRecommendedHypercore = combinedTotal * 0.3; // 30% on HyperCore

          suggestions.recommended = {
            evm: transferRecommendedEVM.toString(),
            hypercore: transferRecommendedHypercore.toString(),
            reasoning: [
              'EVM provides broader transfer compatibility',
              'Keep some HyperCore balance for future trading',
              '70/30 split balances transfer needs and trading options'
            ]
          };
          break;
      }

      return suggestions;

    } catch (error) {
      console.error('❌ Failed to suggest optimal balance:', error);
      return null;
    }
  }

  /**
   * Get user's cross-chain balances for multiple tokens
   */
  async getUserCrossChainBalances(userAddress: string): Promise<CrossChainBalance[]> {
    try {
      // Get all linked tokens
      const linkedTokens = await this.linkingService.getAllTokensWithStatus();
      const linkedTokenAddresses = linkedTokens
        .filter(token => token.linkStatus === 'linked')
        .map(token => token.tokenAddress);

      // Get balances for all linked tokens
      const balances: CrossChainBalance[] = [];
      
      for (const tokenAddress of linkedTokenAddresses) {
        const balance = await this.getUnifiedBalance(userAddress, tokenAddress);
        if (balance) {
          balances.push(balance);
        }
      }

      return balances;

    } catch (error) {
      console.error('❌ Failed to get user cross-chain balances:', error);
      return [];
    }
  }

  /**
   * Private: Sync single token balance
   */
  private async syncSingleTokenBalance(userAddress: string, tokenAddress: string): Promise<void> {
    try {
      // Get token info
      const linkStatus = await this.linkingService.getLinkingStatus(tokenAddress);
      if (!linkStatus || linkStatus.linkStatus !== 'linked') {
        return;
      }

      // Get balances from both chains
      const evmAvailable = await this.bridge.getEVMBalance(tokenAddress, userAddress);
      const hypercoreAvailable = linkStatus.hypercoreAssetIndex 
        ? await this.bridge.getHyperCoreBalance(linkStatus.hypercoreAssetIndex, userAddress)
        : '0';

      // Calculate locked amounts (from active orders)
      const lockedAmounts = await this.getLockedAmounts(userAddress, tokenAddress);

      // Calculate totals
      const evmTotal = PrecisionUtils.safeAdd(evmAvailable, lockedAmounts.evm);
      const hypercoreTotal = PrecisionUtils.safeAdd(hypercoreAvailable, lockedAmounts.hypercore);
      const combinedAvailable = PrecisionUtils.safeAdd(evmAvailable, hypercoreAvailable);
      const combinedLocked = PrecisionUtils.safeAdd(lockedAmounts.evm, lockedAmounts.hypercore);
      const combinedTotal = PrecisionUtils.safeAdd(combinedAvailable, combinedLocked);

      // Update cached balance
      await this.supabase
        .from('cross_chain_balances')
        .upsert({
          user_address: userAddress,
          token_address: tokenAddress,
          symbol: linkStatus.symbol,
          
          evm_available: evmAvailable,
          evm_locked: lockedAmounts.evm,
          evm_total: evmTotal,
          
          hypercore_available: hypercoreAvailable,
          hypercore_locked: lockedAmounts.hypercore,
          hypercore_total: hypercoreTotal,
          
          combined_available: combinedAvailable,
          combined_locked: combinedLocked,
          combined_total: combinedTotal,
          
          last_synced: new Date().toISOString(),
          sync_status: 'synced',
          sync_error_message: null
        }, {
          onConflict: 'user_address,token_address'
        });

    } catch (error) {
      console.error('❌ Failed to sync single token balance:', error);
      
      // Update error status
      await this.supabase
        .from('cross_chain_balances')
        .upsert({
          user_address: userAddress,
          token_address: tokenAddress,
          sync_status: 'error',
          sync_error_message: error instanceof Error ? error.message : 'Sync failed',
          last_synced: new Date().toISOString()
        }, {
          onConflict: 'user_address,token_address'
        });
    }
  }

  /**
   * Private: Get cached balance
   */
  private async getCachedBalance(
    userAddress: string,
    tokenAddress: string
  ): Promise<CrossChainBalance | null> {
    try {
      const { data, error } = await this.supabase
        .from('cross_chain_balances')
        .select('*')
        .eq('user_address', userAddress)
        .eq('token_address', tokenAddress)
        .single();

      if (error || !data) return null;

      return {
        tokenAddress: data.token_address,
        symbol: data.symbol || 'UNKNOWN',
        decimals: 18, // TODO: Get from token contract
        balances: {
          evm: {
            available: data.evm_available || '0',
            locked: data.evm_locked || '0',
            total: data.evm_total || '0'
          },
          hypercore: {
            available: data.hypercore_available || '0',
            locked: data.hypercore_locked || '0',
            total: data.hypercore_total || '0'
          },
          combined: {
            available: data.combined_available || '0',
            locked: data.combined_locked || '0',
            total: data.combined_total || '0'
          }
        },
        lastSynced: new Date(data.last_synced),
        syncStatus: data.sync_status || 'synced',
        syncError: data.sync_error_message
      };

    } catch (error) {
      console.error('❌ Failed to get cached balance:', error);
      return null;
    }
  }

  /**
   * Private: Get locked amounts from orders
   */
  private async getLockedAmounts(
    userAddress: string,
    tokenAddress: string
  ): Promise<{ evm: string; hypercore: string }> {
    try {
      // Get locked amounts from active orders
      const { data: orders } = await this.supabase
        .from('trading_orders')
        .select('side, remaining_amount, order_type')
        .eq('user_id', userAddress)
        .eq('token_address', tokenAddress)
        .in('status', ['pending', 'partial']);

      let evmLocked = '0';
      let hypercoreLocked = '0';

      if (orders) {
        for (const order of orders) {
          const remainingAmount = order.remaining_amount || '0';
          
          // For sell orders, tokens are locked on the chain where they're held
          // For buy orders, USDC is locked (different logic needed)
          if (order.side === 'sell') {
            // Assume tokens are primarily on HyperCore for trading
            hypercoreLocked = PrecisionUtils.safeAdd(hypercoreLocked, remainingAmount);
          }
        }
      }

      return { evm: evmLocked, hypercore: hypercoreLocked };

    } catch (error) {
      console.error('❌ Failed to get locked amounts:', error);
      return { evm: '0', hypercore: '0' };
    }
  }

  /**
   * Private: Check if cache is valid
   */
  private isCacheValid(lastSynced: Date, thresholdSeconds: number): boolean {
    const now = new Date();
    const diffMs = now.getTime() - lastSynced.getTime();
    const diffSeconds = diffMs / 1000;
    return diffSeconds < thresholdSeconds;
  }

  /**
   * Private: Record transfer
   */
  private async recordTransfer(
    request: TransferRequest,
    result: TransferResult
  ): Promise<void> {
    try {
      await this.supabase
        .from('cross_chain_transfers')
        .insert({
          user_address: request.userAddress,
          token_address: request.tokenAddress,
          amount: request.amount,
          from_chain: request.fromChain,
          to_chain: request.toChain,
          transaction_hash: result.transactionHash,
          status: result.success ? 'completed' : 'failed',
          error_message: result.error,
          estimated_time: result.estimatedTime,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('❌ Failed to record transfer:', error);
    }
  }

  /**
   * Private: Initialize bridge interface
   */
  private initializeBridgeInterface() {
    // This would connect to real HyperliquidBridge in production
    // For now, returning a mock interface
    return {
      transferToHyperCore: async (token: string, amount: string, from: string): Promise<TransferResult> => {
        // Mock transfer - simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          success: Math.random() > 0.1, // 90% success rate
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          estimatedTime: 30 // 30 seconds
        };
      },

      transferToEVM: async (assetIndex: number, amount: string, to: string): Promise<TransferResult> => {
        // Mock transfer - simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          success: Math.random() > 0.1, // 90% success rate
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          estimatedTime: 45 // 45 seconds
        };
      },

      getEVMBalance: async (token: string, address: string): Promise<string> => {
        // Mock balance - in production, query EVM contract
        return (Math.random() * 1000).toFixed(6);
      },

      getHyperCoreBalance: async (assetIndex: number, address: string): Promise<string> => {
        // Mock balance - in production, query HyperCore
        return (Math.random() * 500).toFixed(6);
      },

      estimateTransferFee: async (from: string, to: string, token: string, amount: string): Promise<string> => {
        // Mock fee - typically small amount
        return (parseFloat(amount) * 0.001).toString(); // 0.1% fee
      },

      estimateTransferTime: async (from: string, to: string): Promise<number> => {
        // Mock time - depends on direction
        return from === 'evm' ? 30 : 45; // seconds
      }
    };
  }
}

export default CrossChainBalanceService;