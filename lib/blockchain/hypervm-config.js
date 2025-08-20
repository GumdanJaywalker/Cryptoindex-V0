// lib/blockchain/hypervm-config.ts
/**
 * HyperEVM Network Configuration with Dual Block Architecture Support
 * Created: 2025-08-13
 *
 * Optimizes transaction routing between Small Blocks (1s, 2M gas) and Big Blocks (60s, 30M gas)
 */
import { ethers } from 'ethers';
export class HyperVMBlockManager {
    static instance;
    provider;
    constructor(rpcUrl) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
    static getInstance(rpcUrl = 'https://rpc.hyperliquid-testnet.xyz/evm') {
        if (!HyperVMBlockManager.instance) {
            HyperVMBlockManager.instance = new HyperVMBlockManager(rpcUrl);
        }
        return HyperVMBlockManager.instance;
    }
    /**
     * Get optimal transaction options for HyperEVM dual block architecture
     */
    async getOptimalTxOptions(operationType = 'swap') {
        const useSmallBlocks = operationType === 'swap';
        if (useSmallBlocks) {
            // Small Block: 1s, 2M gas limit - optimal for AMM swaps
            return {
                gasPrice: 1, // 1 wei - minimal gas price for fast inclusion
                gasLimit: 1500000, // 1.5M gas (75% of 2M limit)
                type: 0, // Legacy transaction for compatibility
                blockType: 'small',
                expectedConfirmationTime: '1-2 seconds'
            };
        }
        else {
            // Big Block: 60s, 30M gas limit - for complex operations
            const bigBlockGasPrice = await this.getBigBlockGasPrice();
            return {
                gasPrice: bigBlockGasPrice,
                gasLimit: 25000000, // 25M gas (83% of 30M limit)
                type: 0,
                blockType: 'big',
                expectedConfirmationTime: '60 seconds'
            };
        }
    }
    /**
     * Get big block gas price using HyperEVM-specific JSON-RPC method
     */
    async getBigBlockGasPrice() {
        try {
            // Use HyperEVM-specific bigBlockGasPrice method
            const result = await this.provider.send('bigBlockGasPrice', []);
            return parseInt(result, 16);
        }
        catch (error) {
            console.warn('bigBlockGasPrice not available, using fallback:', error);
            return 1; // Fallback to minimal gas price
        }
    }
    /**
     * Get current block information to determine block type
     */
    async getCurrentBlockInfo() {
        try {
            const block = await this.provider.getBlock('latest');
            if (!block)
                return null;
            // Analyze gas limit to determine block type
            const gasLimit = block.gasLimit;
            const isSmallBlock = gasLimit <= BigInt(3000000); // ≤ 3M gas = small block
            return {
                number: block.number,
                timestamp: block.timestamp,
                gasLimit: gasLimit.toString(),
                gasUsed: block.gasUsed.toString(),
                blockType: isSmallBlock ? 'small' : 'big',
                utilization: Number(block.gasUsed * BigInt(100) / gasLimit) + '%'
            };
        }
        catch (error) {
            console.error('Failed to get block info:', error);
            return null;
        }
    }
}
export const HYPERVM_CONFIG = {
    TESTNET: {
        rpcUrl: 'https://rpc.hyperliquid-testnet.xyz/evm',
        chainId: 998,
        name: 'HyperEVM Testnet'
    },
    MAINNET: {
        rpcUrl: 'https://api.hyperliquid.xyz/evm',
        chainId: 999,
        name: 'HyperEVM Mainnet'
    }
};
