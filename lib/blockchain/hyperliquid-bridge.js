// lib/blockchain/hyperliquid-bridge.ts
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
// Hyperliquid Bridge Contract ABI (based on official documentation)
const HYPERLIQUID_BRIDGE_ABI = [
    'function deposit(address user, uint256 amount) external',
    'function withdrawal(address user, uint256 amount, bytes calldata signature) external',
    'function getBalance(address user) external view returns (uint256)',
    'event Deposited(address indexed user, uint256 amount)',
    'event WithdrawalRequested(address indexed user, uint256 amount, uint256 nonce)',
    'event WithdrawalCompleted(address indexed user, uint256 amount)'
];
export class HyperliquidBridgeService {
    static instance;
    supabase;
    arbitrumProvider;
    hyperliquidProvider;
    bridgeContract;
    BRIDGE_ADDRESS = '0x2df1c51e09aecf9cacb7bc98cb1742757f163df7';
    HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz';
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Initialize providers
        this.arbitrumProvider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL || 'https://arbitrum-one.public.blastapi.io');
        this.hyperliquidProvider = new ethers.JsonRpcProvider('https://rpc.hyperliquid.xyz/evm');
        // Initialize bridge contract
        this.bridgeContract = new ethers.Contract(this.BRIDGE_ADDRESS, HYPERLIQUID_BRIDGE_ABI, this.arbitrumProvider);
    }
    static getInstance() {
        if (!HyperliquidBridgeService.instance) {
            HyperliquidBridgeService.instance = new HyperliquidBridgeService();
        }
        return HyperliquidBridgeService.instance;
    }
    /**
     * Monitor bridge deposit process
     */
    async monitorBridgeDeposit(request) {
        try {
            console.log(`🌉 Monitoring bridge deposit for transaction: ${request.transactionId}`);
            // Update transaction to processing
            await this.updateTransactionStatus(request.transactionId, 'processing', {
                bridge_tx_hash: request.arbitrumTxHash,
                metadata: {
                    bridge_monitoring_started: new Date().toISOString(),
                    bridge_address: this.BRIDGE_ADDRESS
                }
            });
            // Wait for Arbitrum transaction confirmation
            const arbitrumReceipt = await this.arbitrumProvider.waitForTransaction(request.arbitrumTxHash, 1);
            if (!arbitrumReceipt || arbitrumReceipt.status !== 1) {
                throw new Error('Arbitrum transaction failed');
            }
            console.log(`✅ Arbitrum transaction confirmed: ${request.arbitrumTxHash}`);
            // Check if deposit was processed by bridge
            const bridgeStatus = await this.waitForBridgeProcessing(request.walletAddress, request.amount, 60000 // 60 seconds timeout
            );
            if (bridgeStatus.isDeposited) {
                console.log(`✅ Bridge deposit completed for ${request.walletAddress}`);
                await this.updateTransactionStatus(request.transactionId, 'completed', {
                    metadata: {
                        bridge_confirmed: true,
                        bridge_balance: bridgeStatus.balance,
                        bridge_block_number: bridgeStatus.blockNumber,
                        completion_time: new Date().toISOString()
                    }
                });
            }
            else {
                throw new Error('Bridge deposit not confirmed within timeout');
            }
        }
        catch (error) {
            console.error('❌ Bridge monitoring failed:', error);
            await this.updateTransactionStatus(request.transactionId, 'failed', {
                error_message: `Bridge monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    }
    /**
     * Wait for bridge to process deposit
     */
    async waitForBridgeProcessing(walletAddress, expectedAmount, timeoutMs = 60000) {
        const startTime = Date.now();
        const pollInterval = 5000; // 5 seconds
        while (Date.now() - startTime < timeoutMs) {
            try {
                const status = await this.checkBridgeStatus(walletAddress);
                // Check if balance increased by expected amount
                const balanceIncrease = parseFloat(status.balance);
                const expectedIncrease = parseFloat(expectedAmount);
                if (balanceIncrease >= expectedIncrease) {
                    return {
                        ...status,
                        isDeposited: true
                    };
                }
                console.log(`⏳ Waiting for bridge processing... Balance: ${status.balance} USDC`);
                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
            catch (error) {
                console.error('❌ Error checking bridge status:', error);
                // Continue polling even on errors
            }
        }
        return {
            isDeposited: false,
            balance: '0',
            lastUpdate: new Date().toISOString()
        };
    }
    /**
     * Check bridge status using Hyperliquid API
     */
    async checkBridgeStatus(walletAddress) {
        try {
            // Use Hyperliquid API to check balance
            const response = await this.queryHyperliquidApi('info', {
                type: 'clearinghouseState',
                user: walletAddress
            });
            if (response.success && response.data) {
                const balance = response.data.marginSummary?.accountValue || '0';
                return {
                    isDeposited: parseFloat(balance) > 0,
                    balance,
                    lastUpdate: new Date().toISOString()
                };
            }
            return {
                isDeposited: false,
                balance: '0',
                lastUpdate: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Failed to check bridge status:', error);
            throw error;
        }
    }
    /**
     * Query Hyperliquid API
     */
    async queryHyperliquidApi(endpoint, payload) {
        try {
            const response = await fetch(`${this.HYPERLIQUID_API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            const data = await response.json();
            return {
                success: true,
                data
            };
        }
        catch (error) {
            console.error('❌ Hyperliquid API query failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get user's Hyperliquid balance
     */
    async getHyperliquidBalance(walletAddress) {
        try {
            const status = await this.checkBridgeStatus(walletAddress);
            return status.balance;
        }
        catch (error) {
            console.error('❌ Failed to get Hyperliquid balance:', error);
            return '0';
        }
    }
    /**
     * Estimate bridge processing time
     */
    getBridgeProcessingTime() {
        return {
            min: 30, // 30 seconds
            max: 180, // 3 minutes
            average: 60 // 1 minute
        };
    }
    /**
     * Update transaction status
     */
    async updateTransactionStatus(transactionId, status, updates = {}) {
        try {
            const updateData = {
                status,
                updated_at: new Date().toISOString(),
                ...updates
            };
            if (status === 'completed') {
                updateData.completed_at = new Date().toISOString();
            }
            const { error } = await this.supabase
                .from('transactions')
                .update(updateData)
                .eq('id', transactionId);
            if (error) {
                throw new Error(`Failed to update transaction: ${error.message}`);
            }
            console.log(`✅ Transaction ${transactionId} updated to ${status}`);
        }
        catch (error) {
            console.error('❌ Failed to update transaction status:', error);
            throw error;
        }
    }
    /**
     * Get bridge contract events
     */
    async getBridgeEvents(walletAddress, fromBlock = 0) {
        try {
            const filter = this.bridgeContract.filters.Deposited(walletAddress);
            const events = await this.bridgeContract.queryFilter(filter, fromBlock);
            return events.map(event => ({
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                args: event.args,
                timestamp: new Date().toISOString()
            }));
        }
        catch (error) {
            console.error('❌ Failed to get bridge events:', error);
            return [];
        }
    }
    /**
     * Validate bridge deposit
     */
    validateBridgeDeposit(request) {
        if (!ethers.isAddress(request.walletAddress)) {
            return { valid: false, error: 'Invalid wallet address' };
        }
        const amount = parseFloat(request.amount);
        if (isNaN(amount) || amount <= 0) {
            return { valid: false, error: 'Invalid amount' };
        }
        if (amount < 5) {
            return { valid: false, error: 'Minimum deposit is 5 USDC' };
        }
        if (!request.arbitrumTxHash || !ethers.isHexString(request.arbitrumTxHash, 32)) {
            return { valid: false, error: 'Invalid Arbitrum transaction hash' };
        }
        return { valid: true };
    }
    /**
     * Get bridge statistics
     */
    async getBridgeStatistics() {
        try {
            const { data: transactions, error } = await this.supabase
                .from('transactions')
                .select('*')
                .eq('transaction_type', 'deposit')
                .eq('network', 'arbitrum');
            if (error) {
                throw new Error(`Failed to get bridge statistics: ${error.message}`);
            }
            const totalDeposits = transactions.length;
            const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
            const completedTransactions = transactions.filter(tx => tx.status === 'completed');
            const successRate = totalDeposits > 0 ? (completedTransactions.length / totalDeposits) * 100 : 0;
            // Calculate average processing time
            const processingTimes = completedTransactions
                .filter(tx => tx.created_at && tx.completed_at)
                .map(tx => {
                const created = new Date(tx.created_at).getTime();
                const completed = new Date(tx.completed_at).getTime();
                return (completed - created) / 1000; // seconds
            });
            const averageProcessingTime = processingTimes.length > 0
                ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
                : 0;
            return {
                totalDeposits,
                totalVolume: totalVolume.toFixed(2),
                averageProcessingTime: Math.round(averageProcessingTime),
                successRate: Math.round(successRate * 100) / 100
            };
        }
        catch (error) {
            console.error('❌ Failed to get bridge statistics:', error);
            return {
                totalDeposits: 0,
                totalVolume: '0',
                averageProcessingTime: 0,
                successRate: 0
            };
        }
    }
}
