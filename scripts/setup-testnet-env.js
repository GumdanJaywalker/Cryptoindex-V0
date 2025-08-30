#!/usr/bin/env node

/**
 * 🔧 Testnet Environment Setup
 * 
 * HyperEVM Testnet 환경 설정 및 토큰 확보 가이드
 * 
 * Created: 2025-08-20
 */

const { ethers } = require('ethers');
const readline = require('readline');
const fs = require('fs');

// 색상 출력 함수
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

// 컨트랙트 주소
const ADDRESSES = {
  usdc: '0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3',
  hyperindex: '0x6065Ab1ec8334ab6099aF27aF145411902EAef40'
};

// 테스트용 Mint 함수 ABI (존재한다면)
const MINT_ABI = [
  "function mint(address to, uint256 amount) public",
  "function owner() public view returns (address)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

async function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function checkEnvironment() {
  console.log(colors.bold('🔧 HOOATS Testnet Environment Setup'));
  console.log('=' .repeat(50));
  console.log('');
  
  // 1. .env 파일 확인
  console.log(colors.blue('📁 Checking .env file...'));
  
  if (!fs.existsSync('.env')) {
    console.log(colors.yellow('⚠️  .env file not found. Creating template...'));
    
    const envTemplate = `# HyperEVM Testnet Configuration
PRIVATE_KEY=your_private_key_here
WALLET_ADDRESS=your_wallet_address_here

# Network
HYPERVM_RPC=https://rpc.hyperliquid-testnet.xyz/evm
CHAIN_ID=998

# Redis (for local development)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=hyperindex_secure_password

# API
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_BASE_URL=http://localhost:3002/api

# Trading
EXECUTE_REAL_SWAPS=false
BATCH_SIZE=100
MAX_WAIT_TIME=50
MAX_CONCURRENT_BATCHES=20

# Development
NODE_ENV=development
DISABLE_RATE_LIMIT=true
`;
    
    fs.writeFileSync('.env', envTemplate);
    console.log(colors.green('✅ .env template created'));
  } else {
    console.log(colors.green('✅ .env file exists'));
  }
  
  // 2. Private key 설정
  require('dotenv').config();
  
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === 'your_private_key_here') {
    console.log('');
    console.log(colors.yellow('🔑 Private Key Setup Required'));
    console.log('Options:');
    console.log('  1. Use your existing wallet private key');
    console.log('  2. Generate a new test wallet');
    console.log('  3. Use hardhat default test key (for testing only)');
    console.log('');
    
    const choice = await promptInput('Choose option (1-3): ');
    
    switch (choice) {
      case '1':
        const privateKey = await promptInput('Enter your private key (without 0x): ');
        await updateEnvFile('PRIVATE_KEY', privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);
        break;
        
      case '2':
        const newWallet = ethers.Wallet.createRandom();
        console.log(colors.blue('🆕 Generated new wallet:'));
        console.log(`   Address: ${newWallet.address}`);
        console.log(`   Private Key: ${newWallet.privateKey}`);
        console.log(colors.red('⚠️  SAVE THIS PRIVATE KEY SECURELY!'));
        
        await updateEnvFile('PRIVATE_KEY', newWallet.privateKey);
        await updateEnvFile('WALLET_ADDRESS', newWallet.address);
        break;
        
      case '3':
        const testKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        const testWallet = new ethers.Wallet(testKey);
        console.log(colors.blue('🧪 Using hardhat test wallet:'));
        console.log(`   Address: ${testWallet.address}`);
        
        await updateEnvFile('PRIVATE_KEY', testKey);
        await updateEnvFile('WALLET_ADDRESS', testWallet.address);
        break;
        
      default:
        console.log(colors.red('Invalid option'));
        return;
    }
  }
  
  // 3. 연결 테스트
  console.log('');
  console.log(colors.blue('📡 Testing connection...'));
  
  require('dotenv').config(); // 업데이트된 .env 다시 로드
  
  const provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid-testnet.xyz/evm');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  try {
    const network = await provider.getNetwork();
    console.log(colors.green(`✅ Connected to Chain ID: ${network.chainId}`));
    
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 HYPE Balance: ${ethers.formatEther(balance)}`);
    
    // 토큰 잔액 확인
    const usdcContract = new ethers.Contract(ADDRESSES.usdc, ERC20_ABI, provider);
    const hyperContract = new ethers.Contract(ADDRESSES.hyperindex, ERC20_ABI, provider);
    
    const usdcBalance = await usdcContract.balanceOf(wallet.address);
    const hyperBalance = await hyperContract.balanceOf(wallet.address);
    
    console.log(`💵 USDC Balance: ${ethers.formatEther(usdcBalance)}`);
    console.log(`🏆 HYPERINDEX Balance: ${ethers.formatEther(hyperBalance)}`);
    
  } catch (error) {
    console.log(colors.red(`❌ Connection failed: ${error.message}`));
    return;
  }
  
  // 4. 토큰 확보 가이드
  console.log('');
  console.log(colors.bold('💰 Getting Test Tokens'));
  console.log('=' .repeat(30));
  
  console.log('');
  console.log(colors.blue('🪙 HYPE (Gas Token):'));
  console.log('  • Join HyperLiquid Discord');
  console.log('  • Use testnet faucet command');
  console.log('  • Or bridge from other testnets');
  
  console.log('');
  console.log(colors.blue('💵 USDC (Test Token):'));
  console.log('  • Check if mint function is available');
  console.log('  • Request from contract owner');
  console.log('  • Or use existing test tokens');
  
  console.log('');
  console.log(colors.blue('🏆 HYPERINDEX (Native Token):'));
  console.log('  • May have public mint function');
  console.log('  • Check contract for minting capabilities');
  console.log('  • Or obtain from existing holders');
  
  // 5. 자동 토큰 확보 시도
  console.log('');
  console.log(colors.blue('🔍 Checking for mintable tokens...'));
  
  try {
    await checkMintable(ADDRESSES.usdc, 'USDC', wallet);
    await checkMintable(ADDRESSES.hyperindex, 'HYPERINDEX', wallet);
  } catch (error) {
    console.log(colors.yellow(`⚠️  Could not check mint functions: ${error.message}`));
  }
  
  // 6. 다음 단계
  console.log('');
  console.log(colors.bold('🚀 Next Steps'));
  console.log('=' .repeat(20));
  console.log('');
  console.log('1. Ensure you have test tokens:');
  console.log('   • HYPE for gas fees (minimum 0.01)');
  console.log('   • USDC for swapping (minimum 10)');
  console.log('');
  console.log('2. Run the actual swap test:');
  console.log(colors.green('   node scripts/real-onchain-test.js'));
  console.log('');
  console.log('3. Or test with HOOATS API:');
  console.log(colors.green('   EXECUTE_REAL_SWAPS=true node standalone-api-real.cjs'));
  console.log('');
  console.log('4. Monitor transactions at:');
  console.log('   https://explorer.hyperliquid-testnet.xyz');
  
  console.log('');
  console.log(colors.green('✅ Environment setup completed!'));
}

async function updateEnvFile(key, value) {
  const envPath = '.env';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (envContent.match(regex)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(colors.green(`✅ Updated ${key} in .env`));
}

async function checkMintable(address, symbol, wallet) {
  try {
    const contract = new ethers.Contract(address, MINT_ABI, wallet);
    
    // Owner 확인
    const owner = await contract.owner();
    console.log(`${symbol} owner: ${owner}`);
    
    if (owner.toLowerCase() === wallet.address.toLowerCase()) {
      console.log(colors.green(`🎉 You are the owner of ${symbol}! You can mint tokens.`));
      
      const shouldMint = await promptInput(`Mint 1000 ${symbol} tokens? (y/n): `);
      if (shouldMint.toLowerCase() === 'y') {
        console.log(`🔨 Minting 1000 ${symbol}...`);
        const mintTx = await contract.mint(wallet.address, ethers.parseEther('1000'));
        await mintTx.wait();
        console.log(colors.green(`✅ Minted 1000 ${symbol}! Tx: ${mintTx.hash}`));
      }
    } else {
      console.log(colors.yellow(`ℹ️  ${symbol} is owned by: ${owner}`));
    }
    
  } catch (error) {
    console.log(`${symbol}: No mint function or not accessible`);
  }
}

// 실행
if (require.main === module) {
  checkEnvironment().catch(error => {
    console.error(colors.red('Setup failed:'), error.message);
    process.exit(1);
  });
}

module.exports = { checkEnvironment };