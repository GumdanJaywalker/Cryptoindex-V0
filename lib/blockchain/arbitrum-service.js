// lib/blockchain/arbitrum-service.ts
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
// USDC contract ABI (minimal needed functions)
const USDC_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
];
export class ArbitrumDepositService {
    static instance;
    supabase;
    provider;
    config;
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Initialize Arbitrum provider
        this.provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL || 'https://arbitrum-one.public.blastapi.io');
        this.config = {
            minAmount: 5.0,
            maxAmount: 100000.0,
            usdcAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC on Arbitrum
            bridgeAddress: '0x2df1c51e09aecf9cacb7bc98cb1742757f163df7', // Hyperliquid bridge
        };
    }
    static getInstance() {
        if (!ArbitrumDepositService.instance) {
            ArbitrumDepositService.instance = new ArbitrumDepositService();
        }
        return ArbitrumDepositService.instance;
    }
    /**
     * Validate deposit request
     */
    validateDeposit(request) {
        const amount = parseFloat(request.amount);
        if (isNaN(amount) || amount <= 0) {
            return { valid: false, error: 'Invalid amount' };
        }
        if (amount < this.config.minAmount) {
            return { valid: false, error: `Minimum deposit is ${this.config.minAmount} USDC` };
        }
        if (amount > this.config.maxAmount) {
            return { valid: false, error: `Maximum deposit is ${this.config.maxAmount} USDC` };
        }
        if (!ethers.isAddress(request.walletAddress)) {
            return { valid: false, error: 'Invalid wallet address' };
        }
        return { valid: true };
    }
    /**
     * Get user's USDC balance on Arbitrum
     */
    async getUSDCBalance(walletAddress) {
        try {
            const usdcContract = new ethers.Contract(this.config.usdcAddress, USDC_ABI, this.provider);
            const balance = await usdcContract.balanceOf(walletAddress);
            const decimals = await usdcContract.decimals();
            const formatted = ethers.formatUnits(balance, decimals);
            return {
                balance: balance.toString(),
                formatted,
            };
        }
        catch (error) {
            console.error('❌ Failed to get USDC balance:', error);
            throw new Error('Failed to get USDC balance');
        }
    }
    /**
     * Check if user has approved bridge contract to spend USDC
     */
    async checkAllowance(walletAddress) {
        try {
            const usdcContract = new ethers.Contract(this.config.usdcAddress, USDC_ABI, this.provider);
            const allowance = await usdcContract.allowance(walletAddress, this.config.bridgeAddress);
            return ethers.formatUnits(allowance, 6); // USDC has 6 decimals
        }
        catch (error) {
            console.error('❌ Failed to check allowance:', error);
            throw new Error('Failed to check allowance');
        }
    }
    /**
     * Create deposit transaction record
     */
    async createDepositTransaction(request) {
        try {
            const transactionData = {
                user_id: request.userId,
                wallet_address: request.walletAddress,
                transaction_type: 'deposit',
                status: 'pending',
                network: 'arbitrum',
                amount: request.amount,
                token_symbol: 'USDC',
                metadata: {
                    bridge_address: this.config.bridgeAddress,
                    usdc_address: this.config.usdcAddress,
                    created_via: 'arbitrum_deposit_service'
                }
            };
            const { data, error } = await this.supabase
                .from('transactions')
                .insert(transactionData)
                .select('id')
                .single();
            if (error) {
                throw new Error(`Failed to create transaction record: ${error.message}`);
            }
            return data.id;
        }
        catch (error) {
            console.error('❌ Failed to create deposit transaction:', error);
            throw error;
        }
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
     * Monitor transaction on Arbitrum
     */
    async monitorTransaction(txHash, transactionId) {
        try {
            console.log(`🔄 Monitoring transaction: ${txHash}`);
            // Update to processing status
            await this.updateTransactionStatus(transactionId, 'processing', {
                tx_hash: txHash
            });
            // Wait for transaction confirmation
            const receipt = await this.provider.waitForTransaction(txHash, 1); // 1 confirmation
            if (receipt && receipt.status === 1) {
                console.log(`✅ Transaction confirmed: ${txHash}`);
                // Update to completed status
                await this.updateTransactionStatus(transactionId, 'completed', {
                    tx_hash: txHash,
                    metadata: {
                        block_number: receipt.blockNumber,
                        gas_used: receipt.gasUsed.toString(),
                        confirmation_time: new Date().toISOString()
                    }
                });
            }
            else {
                console.log(`❌ Transaction failed: ${txHash}`);
                await this.updateTransactionStatus(transactionId, 'failed', {
                    tx_hash: txHash,
                    error_message: 'Transaction failed on blockchain'
                });
            }
        }
        catch (error) {
            console.error('❌ Error monitoring transaction:', error);
            await this.updateTransactionStatus(transactionId, 'failed', {
                error_message: `Monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    }
    /**
     * Get transaction status
     */
    async getTransactionStatus(transactionId) {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .select('*')
                .eq('id', transactionId)
                .single();
            if (error) {
                throw new Error(`Failed to get transaction: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('❌ Failed to get transaction status:', error);
            throw error;
        }
    }
    /**
     * Get user's transaction history
     */
    async getUserTransactions(userId, limit = 50, offset = 0) {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit)
                .offset(offset);
            if (error) {
                throw new Error(`Failed to get user transactions: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('❌ Failed to get user transactions:', error);
            throw error;
        }
    }
    /**
     * Prepare deposit transaction data for frontend
     */
    prepareDepositData(request) {
        const amount = ethers.parseUnits(request.amount, 6); // USDC has 6 decimals
        // Prepare USDC transfer data to bridge contract
        const usdcInterface = new ethers.Interface(USDC_ABI);
        const data = usdcInterface.encodeFunctionData('transfer', [
            this.config.bridgeAddress,
            amount
        ]);
        return {
            to: this.config.usdcAddress,
            value: '0', // No ETH value for ERC20 transfer
            data,
            gasLimit: '100000' // Conservative gas limit
        };
    }
    /**
     * Get deposit configuration
     */
    getDepositConfig() {
        return { ...this.config };
    }
}
