/**
 * 🔗 HyperVM Chain Connector
 * 
 * 실제 HyperEVM 체인 연결 및 컨트랙트 상호작용
 * Deployed contracts from deployment-998-manual.json 사용
 * 
 * Created: 2025-08-20
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load deployed contract addresses
const deploymentInfo = require('../../deployment-998-manual.json');

// Load contract ABIs - Simplified versions for testing
// In production, these would come from compiled artifacts
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

const SETTLEMENT_ABI = [
  "function operator() external view returns (address)"
];

class HyperVMChainConnector {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isConnected = false;
    this.chainId = 998; // HyperVM testnet
    this.rpcUrl = 'https://rpc.hyperliquid-testnet.xyz/evm';
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new HyperVMChainConnector();
    }
    return this.instance;
  }

  /**
   * 체인 연결 초기화
   */
  async initialize() {
    try {
      console.log('🔗 Connecting to HyperEVM Testnet...');
      
      // Provider 설정
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // 네트워크 확인
      const network = await this.provider.getNetwork();
      console.log('📡 Connected to network:', {
        chainId: network.chainId.toString(),
        name: network.name || 'hypervm-testnet'
      });

      if (network.chainId !== BigInt(this.chainId)) {
        throw new Error(`Wrong network! Expected ${this.chainId}, got ${network.chainId}`);
      }

      // Signer 설정 (개발 환경에서는 하드코딩된 개인키 사용)
      const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      this.signer = new ethers.Wallet(privateKey, this.provider);
      
      console.log('💰 Wallet address:', this.signer.address);
      
      // HYPE 잔액 확인
      const balance = await this.provider.getBalance(this.signer.address);
      console.log('💸 HYPE balance:', ethers.formatEther(balance));

      // 컨트랙트 인스턴스 생성
      await this.loadContracts();

      // 연결 상태 확인
      await this.verifyConnection();

      this.isConnected = true;
      console.log('✅ HyperVM Chain Connector initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize HyperVM connection:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * 컨트랙트 인스턴스 로드
   */
  async loadContracts() {
    console.log('📄 Loading smart contracts...');
    
    // Router Contract
    this.contracts.router = new ethers.Contract(
      deploymentInfo.contracts.router,
      ROUTER_ABI,
      this.signer
    );
    console.log('✅ Router loaded:', deploymentInfo.contracts.router);

    // Pair Contract
    this.contracts.pair = new ethers.Contract(
      deploymentInfo.contracts.pair,
      PAIR_ABI,
      this.signer
    );
    console.log('✅ Pair loaded:', deploymentInfo.contracts.pair);

    // Token Contracts
    this.contracts.hyperindex = new ethers.Contract(
      deploymentInfo.contracts.hyperindex,
      ERC20_ABI,
      this.signer
    );
    console.log('✅ HYPERINDEX token loaded:', deploymentInfo.contracts.hyperindex);

    this.contracts.usdc = new ethers.Contract(
      deploymentInfo.contracts.usdc,
      ERC20_ABI,
      this.signer
    );
    console.log('✅ USDC token loaded:', deploymentInfo.contracts.usdc);

    // Settlement Contract
    this.contracts.settlement = new ethers.Contract(
      deploymentInfo.contracts.settlement,
      SETTLEMENT_ABI,
      this.signer
    );
    console.log('✅ Settlement contract loaded:', deploymentInfo.contracts.settlement);
  }

  /**
   * 연결 상태 확인
   */
  async verifyConnection() {
    console.log('🔍 Verifying contract connections...');
    
    // Pair 리저브 확인
    const reserves = await this.contracts.pair.getReserves();
    const token0 = await this.contracts.pair.token0();
    const token1 = await this.contracts.pair.token1();
    
    console.log('🌊 Current AMM Reserves:');
    console.log('  Token0:', ethers.formatEther(reserves[0]));
    console.log('  Token1:', ethers.formatEther(reserves[1]));
    
    // 토큰 잔액 확인
    const usdcBalance = await this.contracts.usdc.balanceOf(this.signer.address);
    const hyperBalance = await this.contracts.hyperindex.balanceOf(this.signer.address);
    
    console.log('💳 Wallet Token Balances:');
    console.log('  USDC:', ethers.formatEther(usdcBalance));
    console.log('  HYPERINDEX:', ethers.formatEther(hyperBalance));
  }

  /**
   * AMM 스왑 견적 계산 (실제 체인에서)
   */
  async getSwapQuote(tokenIn, tokenOut, amountIn) {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to chain');
      }

      const path = [
        tokenIn === 'USDC' ? this.contracts.usdc.target : this.contracts.hyperindex.target,
        tokenOut === 'USDC' ? this.contracts.usdc.target : this.contracts.hyperindex.target
      ];

      const amounts = await this.contracts.router.getAmountsOut(
        ethers.parseEther(amountIn.toString()),
        path
      );

      const inputAmount = amounts[0];
      const outputAmount = amounts[1];
      
      // 가격 영향 계산
      const reserves = await this.contracts.pair.getReserves();
      const reserveIn = tokenIn === 'USDC' ? reserves[1] : reserves[0]; // USDC is token1
      const priceImpact = (Number(inputAmount) / Number(reserveIn)) * 100;

      return {
        inputAmount: ethers.formatEther(inputAmount),
        outputAmount: ethers.formatEther(outputAmount),
        price: Number(inputAmount) / Number(outputAmount),
        priceImpact: priceImpact.toFixed(4),
        path: path,
        gasEstimate: 200000 // 예상 가스
      };
    } catch (error) {
      console.error('❌ Failed to get swap quote:', error.message);
      throw error;
    }
  }

  /**
   * 실제 AMM 스왑 실행
   */
  async executeSwap(tokenIn, tokenOut, amountIn, minAmountOut = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to chain');
      }

      console.log(`🔄 Executing swap: ${amountIn} ${tokenIn} → ${tokenOut}`);

      const path = [
        tokenIn === 'USDC' ? this.contracts.usdc.target : this.contracts.hyperindex.target,
        tokenOut === 'USDC' ? this.contracts.usdc.target : this.contracts.hyperindex.target
      ];

      const amountInWei = ethers.parseEther(amountIn.toString());

      // 예상 출력량 계산
      const amounts = await this.contracts.router.getAmountsOut(amountInWei, path);
      const expectedOut = amounts[1];
      
      // 최소 출력량 설정 (5% 슬리피지)
      const minOut = minAmountOut 
        ? ethers.parseEther(minAmountOut.toString())
        : expectedOut * 95n / 100n;

      // 토큰 승인 확인 및 처리
      const tokenContract = tokenIn === 'USDC' ? this.contracts.usdc : this.contracts.hyperindex;
      const currentAllowance = await tokenContract.allowance(
        this.signer.address,
        this.contracts.router.target
      );

      if (currentAllowance < amountInWei) {
        console.log('🔓 Approving token for router...');
        const approveTx = await tokenContract.approve(
          this.contracts.router.target,
          ethers.MaxUint256
        );
        await approveTx.wait();
        console.log('✅ Token approved');
      }

      // 스왑 실행
      console.log('🚀 Sending swap transaction...');
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10분 데드라인
      
      const swapTx = await this.contracts.router.swapExactTokensForTokens(
        amountInWei,
        minOut,
        path,
        this.signer.address,
        deadline,
        {
          gasLimit: 300000,
          gasPrice: ethers.parseUnits('20', 'gwei')
        }
      );

      console.log('⏳ Transaction sent:', swapTx.hash);
      const receipt = await swapTx.wait();
      
      console.log('✅ Swap completed!');
      console.log('  Block:', receipt.blockNumber);
      console.log('  Gas used:', receipt.gasUsed.toString());

      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        expectedOut: ethers.formatEther(expectedOut),
        minOut: ethers.formatEther(minOut)
      };

    } catch (error) {
      console.error('❌ Swap execution failed:', error.message);
      throw error;
    }
  }

  /**
   * 현재 AMM 리저브 조회
   */
  async getReserves() {
    if (!this.isConnected) {
      throw new Error('Not connected to chain');
    }

    const reserves = await this.contracts.pair.getReserves();
    const token0 = await this.contracts.pair.token0();
    
    const isToken0HYPERINDEX = token0.toLowerCase() === deploymentInfo.contracts.hyperindex.toLowerCase();
    
    return {
      hyperindex: ethers.formatEther(isToken0HYPERINDEX ? reserves[0] : reserves[1]),
      usdc: ethers.formatEther(isToken0HYPERINDEX ? reserves[1] : reserves[0]),
      blockTimestamp: reserves[2]
    };
  }

  /**
   * Off-chain settlement 상태 조회
   */
  async getSettlementStatus() {
    if (!this.isConnected) {
      throw new Error('Not connected to chain');
    }

    try {
      // Settlement contract의 operator 확인
      const operator = await this.contracts.settlement.operator();
      
      // Pending settlements 수 확인
      // Note: 실제 컨트랙트 ABI에 따라 메서드명이 다를 수 있음
      
      return {
        operator: operator,
        contractAddress: this.contracts.settlement.target,
        isOperator: operator.toLowerCase() === this.signer.address.toLowerCase()
      };
    } catch (error) {
      console.error('Settlement status error:', error.message);
      return {
        operator: 'unknown',
        contractAddress: this.contracts.settlement.target,
        error: error.message
      };
    }
  }

  /**
   * 체인 연결 상태 반환
   */
  isChainConnected() {
    return this.isConnected;
  }

  /**
   * 현재 블록 정보 조회
   */
  async getCurrentBlock() {
    if (!this.isConnected) {
      throw new Error('Not connected to chain');
    }

    const block = await this.provider.getBlock('latest');
    return {
      number: block.number,
      timestamp: block.timestamp,
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString()
    };
  }
}

module.exports = { HyperVMChainConnector };