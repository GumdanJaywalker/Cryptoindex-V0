# Smart Contracts Guide

This guide covers the smart contract architecture, deployment process, and key concepts for HyperIndex.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Contract Structure](#contract-structure)
3. [HyperCore Integration](#hypercore-integration)
4. [AMM System](#amm-system)
5. [Token System](#token-system)
6. [Development Setup](#development-setup)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Architecture Overview

### Current Status

⚠️ **Important**: Smart contracts are written and tested locally but **NOT YET DEPLOYED** to any network. Deployment strategy is under planning.

### Tech Stack

- **Language**: Solidity ^0.8.20
- **Framework**: (To be determined - Hardhat/Foundry)
- **Libraries**: OpenZeppelin Contracts (Upgradeable)
- **Testing**: (To be determined)
- **Network**: HyperCore (HyperLiquid's EVM-compatible chain)

### Design Principles

1. **Upgradeable**: Using OpenZeppelin's upgradeable contract patterns
2. **Gas Optimized**: Minimize storage reads/writes
3. **Secure**: Following best practices and audit guidelines
4. **Modular**: Clear separation of concerns
5. **HyperCore Native**: Leveraging HyperCore precompiles

## Contract Structure

```
contracts/
├── hypercore/               # HyperCore integration layer
│   ├── HyperCoreActions.sol # CoreWriter interface wrapper
│   └── HyperL1Reader.sol    # L1 state reading utilities
│
├── amm/                     # AMM (Automated Market Maker) system
│   ├── HyperIndexFactory.sol # Create and manage trading pairs
│   ├── HyperIndexPair.sol    # Liquidity pool implementation
│   └── HyperIndexRouter.sol  # Swap routing and execution
│
├── tokens/                  # Token management
│   ├── IndexToken.sol        # ERC20 index token implementation
│   ├── IndexTokenFactory.sol # Factory for creating index tokens
│   └── RedemptionManager.sol # Handle index redemption
│
├── governance/              # DAO governance (Planned)
│   └── (To be implemented)
│
├── interfaces/              # Contract interfaces (Planned)
│   └── (To be implemented)
│
└── libraries/               # Shared libraries (Planned)
    └── (To be implemented)
```

## HyperCore Integration

### HyperCore Precompiles

HyperCore provides native blockchain functionality through precompiled contracts at a special address:

```solidity
// ICoreWriter interface address (HyperCore native)
address constant CORE_WRITER = 0x3333333333333333333333333333333333333333;
```

### HyperCoreActions.sol

Wrapper contract for interacting with HyperCore's CoreWriter:

```solidity
// contracts/hypercore/HyperCoreActions.sol
pragma solidity ^0.8.20;

interface ICoreWriter {
    function sendRawAction(bytes calldata data) external;
}

contract HyperCoreActions {
    ICoreWriter constant CORE_WRITER = 
        ICoreWriter(0x3333333333333333333333333333333333333333);

    event ActionSent(address indexed sender, bytes data);

    /**
     * @notice Send a raw action to HyperCore
     * @param data Encoded action data
     */
    function sendRawAction(bytes calldata data) external {
        CORE_WRITER.sendRawAction(data);
        emit ActionSent(msg.sender, data);
    }

    /**
     * @notice Batch send multiple actions
     * @param actions Array of encoded action data
     */
    function sendBatchActions(bytes[] calldata actions) external {
        for (uint256 i = 0; i < actions.length; i++) {
            CORE_WRITER.sendRawAction(actions[i]);
            emit ActionSent(msg.sender, actions[i]);
        }
    }
}
```

**Use Cases**:
- Trading execution
- Order placement
- State updates
- Cross-layer communication

### HyperL1Reader.sol

Utilities for reading HyperCore L1 state:

```solidity
// contracts/hypercore/HyperL1Reader.sol
pragma solidity ^0.8.20;

contract HyperL1Reader {
    /**
     * @notice Read user balance from L1
     * @param user User address
     * @param coin Coin identifier
     * @return balance User's balance
     */
    function getUserBalance(
        address user,
        uint32 coin
    ) external view returns (uint256 balance) {
        // Implementation depends on HyperCore L1 interface
        // This is a placeholder for actual implementation
    }

    /**
     * @notice Read market price from L1
     * @param coin Coin identifier
     * @return price Current market price
     */
    function getMarketPrice(
        uint32 coin
    ) external view returns (uint256 price) {
        // Implementation depends on HyperCore L1 interface
    }
}
```

## AMM System

The AMM (Automated Market Maker) system follows Uniswap V2 architecture.

### HyperIndexFactory.sol

Creates and manages trading pairs:

```solidity
// contracts/amm/HyperIndexFactory.sol
pragma solidity ^0.8.20;

contract HyperIndexFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256 pairIndex
    );

    /**
     * @notice Create a new trading pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return pair Address of created pair
     */
    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair) {
        require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
        
        (address token0, address token1) = tokenA < tokenB 
            ? (tokenA, tokenB) 
            : (tokenB, tokenA);
        
        require(token0 != address(0), "ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "PAIR_EXISTS");

        // Create pair contract
        pair = address(new HyperIndexPair());
        HyperIndexPair(pair).initialize(token0, token1);

        // Store pair
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
}
```

**Key Features**:
- Deterministic pair addresses
- No duplicate pairs
- Bidirectional lookup
- Fee configuration

### HyperIndexPair.sol

Liquidity pool implementation:

```solidity
// contracts/amm/HyperIndexPair.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract HyperIndexPair is ERC20Upgradeable, ReentrancyGuardUpgradeable {
    address public token0;
    address public token1;
    
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    /**
     * @notice Initialize the pair (called by factory)
     */
    function initialize(address _token0, address _token1) external {
        require(token0 == address(0), "ALREADY_INITIALIZED");
        token0 = _token0;
        token1 = _token1;
        __ERC20_init("HyperIndex LP", "HI-LP");
        __ReentrancyGuard_init();
    }

    /**
     * @notice Get current reserves
     * @return _reserve0 Reserve of token0
     * @return _reserve1 Reserve of token1
     * @return _blockTimestampLast Last update timestamp
     */
    function getReserves() 
        public 
        view 
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        ) 
    {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    /**
     * @notice Add liquidity to the pool
     * @param to Address to receive LP tokens
     * @return liquidity Amount of LP tokens minted
     */
    function mint(address to) external nonReentrant returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // Lock forever
        } else {
            liquidity = Math.min(
                (amount0 * _totalSupply) / _reserve0,
                (amount1 * _totalSupply) / _reserve1
            );
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1);
        emit Mint(msg.sender, amount0, amount1);
    }

    /**
     * @notice Remove liquidity from the pool
     * @param to Address to receive tokens
     * @return amount0 Amount of token0 returned
     * @return amount1 Amount of token1 returned
     */
    function burn(address to) 
        external 
        nonReentrant 
        returns (uint256 amount0, uint256 amount1) 
    {
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 liquidity = balanceOf(address(this));

        uint256 _totalSupply = totalSupply();
        amount0 = (liquidity * balance0) / _totalSupply;
        amount1 = (liquidity * balance1) / _totalSupply;

        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(address(this), liquidity);
        IERC20(token0).transfer(to, amount0);
        IERC20(token1).transfer(to, amount1);

        balance0 = IERC20(token0).balanceOf(address(this));
        balance1 = IERC20(token1).balanceOf(address(this));

        _update(balance0, balance1);
        emit Burn(msg.sender, amount0, amount1);
    }

    /**
     * @notice Swap tokens
     * @param amount0Out Amount of token0 to output
     * @param amount1Out Amount of token1 to output
     * @param to Address to receive output tokens
     */
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to
    ) external nonReentrant {
        require(amount0Out > 0 || amount1Out > 0, "INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        require(
            amount0Out < _reserve0 && amount1Out < _reserve1,
            "INSUFFICIENT_LIQUIDITY"
        );

        // Transfer output tokens
        if (amount0Out > 0) IERC20(token0).transfer(to, amount0Out);
        if (amount1Out > 0) IERC20(token1).transfer(to, amount1Out);

        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));

        uint256 amount0In = balance0 > _reserve0 - amount0Out 
            ? balance0 - (_reserve0 - amount0Out) 
            : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out 
            ? balance1 - (_reserve1 - amount1Out) 
            : 0;

        require(amount0In > 0 || amount1In > 0, "INSUFFICIENT_INPUT_AMOUNT");

        // Verify constant product formula (with 0.3% fee)
        {
            uint256 balance0Adjusted = (balance0 * 1000) - (amount0In * 3);
            uint256 balance1Adjusted = (balance1 * 1000) - (amount1In * 3);
            require(
                balance0Adjusted * balance1Adjusted >= 
                uint256(_reserve0) * _reserve1 * (1000**2),
                "K"
            );
        }

        _update(balance0, balance1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    /**
     * @notice Update reserves
     */
    function _update(uint256 balance0, uint256 balance1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "OVERFLOW");
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = uint32(block.timestamp);
        emit Sync(reserve0, reserve1);
    }
}
```

**Key Features**:
- Constant product formula: `x * y = k`
- 0.3% swap fee
- LP token rewards
- Flash swap support
- Price oracle (TWAP)

### HyperIndexRouter.sol

Routing and swap execution:

```solidity
// contracts/amm/HyperIndexRouter.sol
pragma solidity ^0.8.20;

contract HyperIndexRouter {
    address public immutable factory;
    address public immutable WETH;

    /**
     * @notice Calculate output amount for swap
     * @param amountIn Input amount
     * @param reserveIn Input token reserve
     * @param reserveOut Output token reserve
     * @return amountOut Output amount
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

        uint256 amountInWithFee = amountIn * 997; // 0.3% fee
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /**
     * @notice Swap exact tokens for tokens
     * @param amountIn Input amount
     * @param amountOutMin Minimum output amount (slippage protection)
     * @param path Array of token addresses
     * @param to Recipient address
     * @param deadline Transaction deadline
     * @return amounts Array of amounts for each swap
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(deadline >= block.timestamp, "EXPIRED");
        
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");

        // Transfer input tokens
        IERC20(path[0]).transferFrom(msg.sender, pairFor(path[0], path[1]), amounts[0]);

        // Execute swaps
        _swap(amounts, path, to);
    }

    /**
     * @notice Add liquidity to pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param amountADesired Desired amount of tokenA
     * @param amountBDesired Desired amount of tokenB
     * @param amountAMin Minimum amount of tokenA
     * @param amountBMin Minimum amount of tokenB
     * @param to Recipient of LP tokens
     * @param deadline Transaction deadline
     * @return amountA Actual amount of tokenA added
     * @return amountB Actual amount of tokenB added
     * @return liquidity Amount of LP tokens minted
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(deadline >= block.timestamp, "EXPIRED");

        (amountA, amountB) = _calculateLiquidityAmounts(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin
        );

        address pair = pairFor(tokenA, tokenB);
        IERC20(tokenA).transferFrom(msg.sender, pair, amountA);
        IERC20(tokenB).transferFrom(msg.sender, pair, amountB);

        liquidity = HyperIndexPair(pair).mint(to);
    }

    /**
     * @notice Remove liquidity from pool
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        require(deadline >= block.timestamp, "EXPIRED");

        address pair = pairFor(tokenA, tokenB);
        HyperIndexPair(pair).transferFrom(msg.sender, pair, liquidity);
        (amountA, amountB) = HyperIndexPair(pair).burn(to);

        require(amountA >= amountAMin, "INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "INSUFFICIENT_B_AMOUNT");
    }
}
```

**Key Features**:
- Multi-hop swaps
- Slippage protection
- Deadline checks
- Optimal routing

## Token System

### IndexToken.sol

ERC20 index token implementation:

```solidity
// contracts/tokens/IndexToken.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract IndexToken is ERC20Upgradeable, OwnableUpgradeable {
    struct Component {
        address token;
        uint256 weight; // Basis points (10000 = 100%)
    }

    Component[] public components;
    uint8 public indexLayer; // 1, 2, or 3

    event ComponentsUpdated(Component[] newComponents);
    event Rebalanced(uint256 timestamp);

    /**
     * @notice Initialize the index token
     * @param name Token name
     * @param symbol Token symbol
     * @param _components Array of component tokens and weights
     * @param _layer Index layer (1, 2, or 3)
     */
    function initialize(
        string memory name,
        string memory symbol,
        Component[] memory _components,
        uint8 _layer
    ) external initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();

        require(_layer >= 1 && _layer <= 3, "INVALID_LAYER");
        indexLayer = _layer;

        _setComponents(_components);
    }

    /**
     * @notice Mint index tokens by depositing component tokens
     * @param amount Amount of index tokens to mint
     */
    function mint(uint256 amount) external {
        // Calculate required component amounts
        for (uint256 i = 0; i < components.length; i++) {
            uint256 componentAmount = (amount * components[i].weight) / 10000;
            IERC20(components[i].token).transferFrom(
                msg.sender,
                address(this),
                componentAmount
            );
        }

        _mint(msg.sender, amount);
    }

    /**
     * @notice Burn index tokens to redeem component tokens
     * @param amount Amount of index tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);

        // Return component tokens
        for (uint256 i = 0; i < components.length; i++) {
            uint256 componentAmount = (amount * components[i].weight) / 10000;
            IERC20(components[i].token).transfer(msg.sender, componentAmount);
        }
    }

    /**
     * @notice Update index components (rebalancing)
     * @param newComponents New component configuration
     */
    function rebalance(Component[] memory newComponents) external onlyOwner {
        _setComponents(newComponents);
        emit Rebalanced(block.timestamp);
    }

    /**
     * @notice Set component tokens and weights
     */
    function _setComponents(Component[] memory newComponents) private {
        // Validate components
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < newComponents.length; i++) {
            require(newComponents[i].token != address(0), "ZERO_ADDRESS");
            require(newComponents[i].weight > 0, "ZERO_WEIGHT");
            totalWeight += newComponents[i].weight;
        }
        require(totalWeight == 10000, "INVALID_TOTAL_WEIGHT");

        // Validate component count based on layer
        if (indexLayer == 1) {
            require(newComponents.length >= 50, "L1_MIN_COMPONENTS");
        } else if (indexLayer == 2) {
            require(
                newComponents.length >= 5 && newComponents.length <= 50,
                "L2_COMPONENT_RANGE"
            );
        } else {
            require(
                newComponents.length >= 2 && newComponents.length <= 20,
                "L3_COMPONENT_RANGE"
            );
        }

        // Clear and set new components
        delete components;
        for (uint256 i = 0; i < newComponents.length; i++) {
            components.push(newComponents[i]);
        }

        emit ComponentsUpdated(newComponents);
    }

    /**
     * @notice Get all components
     */
    function getComponents() external view returns (Component[] memory) {
        return components;
    }
}
```

### IndexTokenFactory.sol

Factory for creating index tokens:

```solidity
// contracts/tokens/IndexTokenFactory.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract IndexTokenFactory {
    address public immutable implementation;
    address[] public allIndexes;

    mapping(address => bool) public isIndex;

    event IndexCreated(
        address indexed creator,
        address indexed indexToken,
        string name,
        string symbol,
        uint8 layer
    );

    constructor(address _implementation) {
        implementation = _implementation;
    }

    /**
     * @notice Create a new index token
     * @param name Token name
     * @param symbol Token symbol
     * @param components Component tokens and weights
     * @param layer Index layer (1, 2, or 3)
     * @return indexToken Address of created index token
     */
    function createIndex(
        string memory name,
        string memory symbol,
        IndexToken.Component[] memory components,
        uint8 layer
    ) external returns (address indexToken) {
        // Clone implementation
        indexToken = Clones.clone(implementation);

        // Initialize
        IndexToken(indexToken).initialize(name, symbol, components, layer);

        // Transfer ownership to creator
        IndexToken(indexToken).transferOwnership(msg.sender);

        // Register
        allIndexes.push(indexToken);
        isIndex[indexToken] = true;

        emit IndexCreated(msg.sender, indexToken, name, symbol, layer);
    }

    /**
     * @notice Get total number of created indexes
     */
    function allIndexesLength() external view returns (uint256) {
        return allIndexes.length;
    }
}
```

### RedemptionManager.sol

Handles index token redemption:

```solidity
// contracts/tokens/RedemptionManager.sol
pragma solidity ^0.8.20;

contract RedemptionManager {
    mapping(address => bool) public supportedIndexes;

    event Redeemed(
        address indexed user,
        address indexed indexToken,
        uint256 amount,
        address[] componentTokens,
        uint256[] componentAmounts
    );

    /**
     * @notice Redeem index tokens for underlying assets
     * @param indexToken Address of index token
     * @param amount Amount to redeem
     */
    function redeem(address indexToken, uint256 amount) external {
        require(supportedIndexes[indexToken], "UNSUPPORTED_INDEX");

        IndexToken index = IndexToken(indexToken);
        IndexToken.Component[] memory components = index.getComponents();

        address[] memory tokens = new address[](components.length);
        uint256[] memory amounts = new uint256[](components.length);

        // Burn index tokens
        index.burn(amount);

        // Transfer component tokens
        for (uint256 i = 0; i < components.length; i++) {
            tokens[i] = components[i].token;
            amounts[i] = (amount * components[i].weight) / 10000;

            IERC20(components[i].token).transfer(msg.sender, amounts[i]);
        }

        emit Redeemed(msg.sender, indexToken, amount, tokens, amounts);
    }

    /**
     * @notice Add supported index token
     * @param indexToken Address to add
     */
    function addSupportedIndex(address indexToken) external {
        // Add access control
        supportedIndexes[indexToken] = true;
    }
}
```

## Development Setup

### Prerequisites

```bash
# Install Solidity compiler
npm install -g solc

# Install development framework (choose one)
npm install --save-dev hardhat
# OR
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Project Structure

```
contracts/
├── contracts/           # Solidity source files
├── test/               # Contract tests
├── scripts/            # Deployment scripts
├── artifacts/          # Compiled contracts (gitignored)
└── cache/              # Build cache (gitignored)
```

## Testing

### Unit Tests

```javascript
// test/AMM.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HyperIndexPair", function () {
  let pair, token0, token1;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy tokens
    const Token = await ethers.getContractFactory("ERC20Mock");
    token0 = await Token.deploy("Token0", "TK0");
    token1 = await Token.deploy("Token1", "TK1");

    // Deploy pair
    const Pair = await ethers.getContractFactory("HyperIndexPair");
    pair = await Pair.deploy();
    await pair.initialize(token0.address, token1.address);
  });

  it("Should add liquidity correctly", async function () {
    // Mint tokens
    await token0.mint(owner.address, ethers.utils.parseEther("1000"));
    await token1.mint(owner.address, ethers.utils.parseEther("1000"));

    // Approve pair
    await token0.approve(pair.address, ethers.utils.parseEther("1000"));
    await token1.approve(pair.address, ethers.utils.parseEther("1000"));

    // Add liquidity
    await token0.transfer(pair.address, ethers.utils.parseEther("100"));
    await token1.transfer(pair.address, ethers.utils.parseEther("100"));
    await pair.mint(owner.address);

    const reserves = await pair.getReserves();
    expect(reserves._reserve0).to.equal(ethers.utils.parseEther("100"));
    expect(reserves._reserve1).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should execute swap correctly", async function () {
    // Setup liquidity first...
    
    // Execute swap
    const amountIn = ethers.utils.parseEther("10");
    await token0.transfer(pair.address, amountIn);
    
    const amountOut = await pair.getAmountOut(
      amountIn,
      reserves._reserve0,
      reserves._reserve1
    );

    await pair.swap(0, amountOut, addr1.address);

    // Verify balances
    const balance = await token1.balanceOf(addr1.address);
    expect(balance).to.equal(amountOut);
  });
});
```

### Integration Tests

```javascript
// test/Integration.test.js
describe("Full Trading Flow", function () {
  it("Should complete end-to-end trade", async function () {
    // 1. Create index
    const indexFactory = await deploy("IndexTokenFactory");
    const tx = await indexFactory.createIndex(
      "DeFi Index",
      "DEFI",
      components,
      2
    );
    const receipt = await tx.wait();
    const indexAddress = receipt.events[0].args.indexToken;

    // 2. Create AMM pair
    const ammFactory = await deploy("HyperIndexFactory");
    await ammFactory.createPair(indexAddress, weth.address);
    const pairAddress = await ammFactory.getPair(indexAddress, weth.address);

    // 3. Add liquidity
    const router = await deploy("HyperIndexRouter");
    await router.addLiquidity(
      indexAddress,
      weth.address,
      ethers.utils.parseEther("1000"),
      ethers.utils.parseEther("1"),
      0,
      0,
      owner.address,
      deadline
    );

    // 4. Execute swap
    await router.swapExactTokensForTokens(
      ethers.utils.parseEther("0.1"),
      0,
      [weth.address, indexAddress],
      addr1.address,
      deadline
    );

    // 5. Verify balances
    const balance = await indexToken.balanceOf(addr1.address);
    expect(balance).to.be.gt(0);
  });
});
```

## Deployment

### Deployment Script

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying HyperIndex contracts...");

  // 1. Deploy Factory
  const Factory = await hre.ethers.getContractFactory("HyperIndexFactory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("Factory deployed to:", factory.address);

  // 2. Deploy Router
  const Router = await hre.ethers.getContractFactory("HyperIndexRouter");
  const router = await Router.deploy(factory.address, WETH_ADDRESS);
  await router.deployed();
  console.log("Router deployed to:", router.address);

  // 3. Deploy IndexToken Implementation
  const IndexToken = await hre.ethers.getContractFactory("IndexToken");
  const indexImpl = await IndexToken.deploy();
  await indexImpl.deployed();
  console.log("IndexToken implementation:", indexImpl.address);

  // 4. Deploy IndexTokenFactory
  const IndexFactory = await hre.ethers.getContractFactory("IndexTokenFactory");
  const indexFactory = await IndexFactory.deploy(indexImpl.address);
  await indexFactory.deployed();
  console.log("IndexTokenFactory deployed to:", indexFactory.address);

  // 5. Deploy RedemptionManager
  const Redemption = await hre.ethers.getContractFactory("RedemptionManager");
  const redemption = await Redemption.deploy();
  await redemption.deployed();
  console.log("RedemptionManager deployed to:", redemption.address);

  // 6. Verify contracts (if on public network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await factory.deployTransaction.wait(6);

    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [],
    });

    // Verify other contracts...
  }

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Network Configuration

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    hypercore_testnet: {
      url: process.env.HYPERCORE_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 12345 // Replace with actual HyperCore testnet ID
    },
    hypercore_mainnet: {
      url: process.env.HYPERCORE_MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 54321 // Replace with actual HyperCore mainnet ID
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### Deployment Checklist

Before deploying to mainnet:

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Contract verification prepared
- [ ] Admin keys secured
- [ ] Emergency procedures documented
- [ ] Monitoring setup
- [ ] Deployment script tested on testnet

## Security Considerations

### Best Practices

1. **Reentrancy Protection**: Use OpenZeppelin's ReentrancyGuard
2. **Integer Overflow**: Solidity 0.8+ has built-in protection
3. **Access Control**: Use Ownable or role-based access
4. **Flash Loan Protection**: Implement checks for same-block attacks
5. **Price Oracle**: Use TWAP to prevent manipulation

### Common Vulnerabilities

```solidity
// ❌ BAD: Vulnerable to reentrancy
function withdraw(uint256 amount) external {
    uint256 balance = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // Too late!
}

// ✅ GOOD: Protected against reentrancy
function withdraw(uint256 amount) external nonReentrant {
    uint256 balance = balances[msg.sender];
    balances[msg.sender] -= amount; // Update state first
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

### Audit Checklist

- [ ] External calls handled safely
- [ ] State changes before external calls
- [ ] Access control on sensitive functions
- [ ] Input validation
- [ ] Error handling
- [ ] Gas optimization
- [ ] Upgrade mechanism (if applicable)
- [ ] Emergency pause mechanism

## Resources

### Official Documentation
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [HyperLiquid Docs](https://hyperliquid.gitbook.io/)

### Development Tools
- [Hardhat](https://hardhat.org/)
- [Foundry](https://getfoundry.sh/)
- [Remix IDE](https://remix.ethereum.org/)
- [Tenderly](https://tenderly.co/)

### Security Resources
- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Slither](https://github.com/crytic/slither) - Static analyzer
- [Mythril](https://github.com/ConsenSys/mythril) - Security analyzer

---

**Need help?** Check the [main README](../../README.md) or ask the team!
