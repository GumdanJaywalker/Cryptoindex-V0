// lib/blockchain/hypervm-amm.ts
/**
 * 🚀 HyperEVM Testnet AMM Integration
 * Real blockchain AMM implementation for HyperIndex
 * 
 * Features:
 * - Real on-chain transactions
 * - Gas estimation
 * - Transaction monitoring
 * - Slippage protection
 * - Liquidity management
 */

import { ethers } from 'ethers';

// Contract ABIs (simplified for essential functions)
const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
  "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function faucet() external" // Mock USDC faucet
];

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippageTolerance: number; // in basis points (100 = 1%)
  recipient: string;
  deadline?: number;
}

interface SwapResult {
  hash: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  gasUsed: string;
  effectivePrice: string;
}

interface LiquidityParams {
  tokenA: string;
  tokenB: string;
  amountADesired: string;
  amountBDesired: string;
  slippageTolerance: number;
  recipient: string;
  deadline?: number;
}

export class HyperVMAMM {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null = null;
  private routerContract: ethers.Contract;
  private contracts: {
    router: string;
    factory: string;
    hyperIndex: string;
    usdc: string;
    pair: string;
  };

  constructor(
    providerUrl: string,
    contractAddresses: {
      router: string;
      factory: string;
      hyperIndex: string;
      usdc: string;
      pair: string;
    }
  ) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contracts = contractAddresses;
    this.routerContract = new ethers.Contract(
      contractAddresses.router,
      ROUTER_ABI,
      this.provider
    );
  }

  /**
   * Connect wallet signer
   */
  connectSigner(signer: ethers.Signer) {
    this.signer = signer;
    this.routerContract = new ethers.Contract(
      this.contracts.router,
      ROUTER_ABI,
      signer
    );
  }

  /**
   * 🔥 Execute token swap on HyperEVM
   */
  async executeSwap(params: SwapParams): Promise<SwapResult> {
    if (!this.signer) {
      throw new Error('Signer not connected');
    }

    const {
      tokenIn,
      tokenOut,
      amountIn,
      slippageTolerance,
      recipient,
      deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
    } = params;

    console.log('🚀 Executing HyperEVM swap:', params);

    try {
      // 1. Get quote for price calculation
      const path = [tokenIn, tokenOut];
      const amountsOut = await this.routerContract.getAmountsOut(amountIn, path);
      const expectedAmountOut = amountsOut[1];
      
      // 2. Calculate minimum amount out with slippage
      const minAmountOut = expectedAmountOut * BigInt(10000 - slippageTolerance) / BigInt(10000);
      
      // 3. Check and approve tokens if needed
      await this.ensureTokenApproval(tokenIn, amountIn);
      
      // 4. Calculate price impact
      const reserves = await this.getPairReserves();
      const priceImpact = this.calculatePriceImpact(
        amountIn,
        expectedAmountOut.toString(),
        reserves,
        tokenIn
      );
      
      // 5. Execute swap transaction
      console.log('📝 Swap parameters:', {
        amountIn,
        minAmountOut: minAmountOut.toString(),
        path,
        recipient,
        deadline
      });
      
      const tx = await this.routerContract.swapExactTokensForTokens(
        amountIn,
        minAmountOut,
        path,
        recipient,
        deadline
      );
      
      console.log('⏳ Transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);
      
      // 6. Calculate effective price
      const effectivePrice = (parseFloat(expectedAmountOut.toString()) / parseFloat(amountIn)).toString();
      
      return {
        hash: receipt.hash,
        amountIn,
        amountOut: expectedAmountOut.toString(),
        priceImpact,
        gasUsed: receipt.gasUsed.toString(),
        effectivePrice
      };
      
    } catch (error) {
      console.error('❌ Swap failed:', error);
      throw error;
    }
  }

  /**
   * 💧 Add liquidity to HyperEVM pool
   */
  async addLiquidity(params: LiquidityParams): Promise<{
    hash: string;
    amountA: string;
    amountB: string;
    liquidity: string;
    gasUsed: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer not connected');
    }

    const {
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      slippageTolerance,
      recipient,
      deadline = Math.floor(Date.now() / 1000) + 60 * 20
    } = params;

    console.log('💧 Adding liquidity to HyperEVM:', params);

    try {
      // 1. Approve tokens
      await this.ensureTokenApproval(tokenA, amountADesired);
      await this.ensureTokenApproval(tokenB, amountBDesired);
      
      // 2. Calculate minimum amounts with slippage
      const amountAMin = BigInt(amountADesired) * BigInt(10000 - slippageTolerance) / BigInt(10000);
      const amountBMin = BigInt(amountBDesired) * BigInt(10000 - slippageTolerance) / BigInt(10000);
      
      // 3. Add liquidity
      const tx = await this.routerContract.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        recipient,
        deadline
      );
      
      console.log('⏳ Add liquidity transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Liquidity added:', receipt.hash);
      
      // Parse logs to get actual amounts (simplified)
      return {
        hash: receipt.hash,
        amountA: amountADesired, // Simplified - should parse from logs
        amountB: amountBDesired,
        liquidity: '0', // Should parse from logs
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error('❌ Add liquidity failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 Get current pool reserves
   */
  async getPairReserves(): Promise<{
    reserve0: string;
    reserve1: string;
    token0: string;
    token1: string;
  }> {
    const pairContract = new ethers.Contract(
      this.contracts.pair,
      PAIR_ABI,
      this.provider
    );
    
    const [reserves, token0, token1] = await Promise.all([
      pairContract.getReserves(),
      pairContract.token0(),
      pairContract.token1()
    ]);
    
    return {
      reserve0: reserves[0].toString(),
      reserve1: reserves[1].toString(),
      token0,
      token1
    };
  }

  /**
   * 💰 Get token balance
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const balance = await tokenContract.balanceOf(userAddress);
    return balance.toString();
  }

  /**
   * 🚰 Use testnet faucet (Mock USDC only)
   */
  async useFaucet(tokenAddress: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not connected');
    }
    
    if (tokenAddress !== this.contracts.usdc) {
      throw new Error('Faucet only available for Mock USDC');
    }
    
    console.log('🚰 Using USDC faucet...');
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const tx = await tokenContract.faucet();
    
    console.log('⏳ Faucet transaction submitted:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ Faucet successful:', receipt.hash);
    
    return receipt.hash;
  }

  /**
   * 💸 Get swap quote
   */
  async getSwapQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ): Promise<{
    amountOut: string;
    priceImpact: number;
    route: string[];
  }> {
    const path = [tokenIn, tokenOut];
    const amountsOut = await this.routerContract.getAmountsOut(amountIn, path);
    
    const reserves = await this.getPairReserves();
    const priceImpact = this.calculatePriceImpact(
      amountIn,
      amountsOut[1].toString(),
      reserves,
      tokenIn
    );
    
    return {
      amountOut: amountsOut[1].toString(),
      priceImpact,
      route: path
    };
  }

  /**
   * Private helper functions
   */
  private async ensureTokenApproval(tokenAddress: string, amount: string): Promise<void> {
    if (!this.signer) return;
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const userAddress = await this.signer.getAddress();
    
    const allowance = await tokenContract.allowance(userAddress, this.contracts.router);
    
    if (allowance < BigInt(amount)) {
      console.log('📝 Approving token:', tokenAddress);
      const tx = await tokenContract.approve(this.contracts.router, ethers.MaxUint256);
      await tx.wait();
      console.log('✅ Token approved');
    }
  }

  private calculatePriceImpact(
    amountIn: string,
    amountOut: string,
    reserves: { reserve0: string; reserve1: string; token0: string },
    tokenIn: string
  ): number {
    // Simplified price impact calculation
    // In real implementation, this would be more sophisticated
    const isToken0 = tokenIn.toLowerCase() === reserves.token0.toLowerCase();
    const reserveIn = isToken0 ? reserves.reserve0 : reserves.reserve1;
    const reserveOut = isToken0 ? reserves.reserve1 : reserves.reserve0;
    
    const priceImpact = (parseFloat(amountIn) / parseFloat(reserveIn)) * 100;
    return Math.min(priceImpact, 100); // Cap at 100%
  }

  /**
   * Get contract addresses
   */
  getContractAddresses() {
    return { ...this.contracts };
  }

  /**
   * Check if connected to correct network
   */
  async verifyNetwork(): Promise<boolean> {
    const network = await this.provider.getNetwork();
    return network.chainId === BigInt(998); // HyperEVM testnet
  }
}