require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    "hypervm-testnet": {
      url: process.env.HYPERVM_TESTNET_RPC || "https://rpc.hyperliquid-testnet.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 998, // HyperEVM Testnet Chain ID
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
    },
    "hypervm-mainnet": {
      url: process.env.HYPERVM_MAINNET_RPC || "https://api.hyperliquid.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 999, // HyperEVM Mainnet Chain ID
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    // HyperEVM explorer API key (if available)
    apiKey: {
      "hypervm-testnet": process.env.HYPERVM_EXPLORER_API_KEY || "dummy",
      "hypervm-mainnet": process.env.HYPERVM_EXPLORER_API_KEY || "dummy"
    },
    customChains: [
      {
        network: "hypervm-testnet",
        chainId: 998,
        urls: {
          apiURL: process.env.HYPERVM_TESTNET_EXPLORER_API || "https://explorer.hyperliquid-testnet.xyz/api",
          browserURL: process.env.HYPERVM_TESTNET_EXPLORER || "https://explorer.hyperliquid-testnet.xyz"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 60000,
  },
};