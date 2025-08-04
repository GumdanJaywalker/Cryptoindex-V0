// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for HyperEVM testnet testing
 * 
 * Features:
 * - 6 decimal places (like real USDC)
 * - Mintable by anyone (for testnet faucet functionality)
 * - Large initial supply for testing
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;
    
    // Events
    event Minted(address indexed to, uint256 amount);
    
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer (100M USDC)
        uint256 initialSupply = 100_000_000 * 10**DECIMALS;
        _mint(msg.sender, initialSupply);
        
        emit Minted(msg.sender, initialSupply);
    }
    
    /**
     * @dev Returns the number of decimals (6 for USDC)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @dev Mint tokens to any address (testnet faucet functionality)
     * Anyone can call this on testnet for easy testing
     */
    function mint(address to, uint256 amount) external {
        require(to != address(0), "MockUSDC: mint to zero address");
        require(amount > 0, "MockUSDC: mint amount must be positive");
        require(amount <= 1_000_000 * 10**DECIMALS, "MockUSDC: max 1M USDC per mint");
        
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    /**
     * @dev Faucet function - gives 10,000 USDC to caller
     * Convenient for testing
     */
    function faucet() external {
        uint256 faucetAmount = 10_000 * 10**DECIMALS; // 10,000 USDC
        require(balanceOf(msg.sender) < 50_000 * 10**DECIMALS, "MockUSDC: already have enough USDC");
        
        _mint(msg.sender, faucetAmount);
        emit Minted(msg.sender, faucetAmount);
    }
    
    /**
     * @dev Owner can mint large amounts if needed
     */
    function ownerMint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "MockUSDC: mint to zero address");
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    /**
     * @dev Get faucet info for UI
     */
    function getFaucetInfo() external pure returns (
        uint256 faucetAmount,
        uint256 maxBalance,
        string memory instructions
    ) {
        return (
            10_000 * 10**DECIMALS,
            50_000 * 10**DECIMALS,
            "Call faucet() to get 10,000 USDC (max 50,000 USDC per address)"
        );
    }
}