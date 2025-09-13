 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;
 
 interface IERC20Minimal {
     function transferFrom(address from, address to, uint256 amount) external returns (bool);
 }
 
 contract BatchSettlement {
     struct Leg {
         address token;
         address from;
         address to;
         uint256 amount;
         bytes permit; // optional, future use
         uint256 nonce;
         uint256 deadline;
     }
 
     struct Batch {
         bytes32 batchId;
         Leg[] legs;
     }
 
     mapping(bytes32 => bool) public usedBatchIds;
     mapping(address => mapping(uint256 => bool)) public usedNonces;
     address public relayer;
     address public owner;
     bool public paused;
 
     event Settled(bytes32 indexed batchId, uint256 legsCount);
     event RelayerUpdated(address indexed relayer);
     event Paused(bool paused);
 
     modifier onlyOwner() {
         require(msg.sender == owner, "not owner");
         _;
     }
 
     modifier onlyRelayer() {
         require(msg.sender == relayer || msg.sender == owner, "not relayer");
         _;
     }
 
     modifier whenNotPaused() {
         require(!paused, "paused");
         _;
     }
 
     constructor(address _relayer) {
         owner = msg.sender;
         relayer = _relayer;
     }
 
     function setRelayer(address _relayer) external onlyOwner {
         relayer = _relayer;
         emit RelayerUpdated(_relayer);
     }
 
     function setPaused(bool _paused) external onlyOwner {
         paused = _paused;
         emit Paused(_paused);
     }
 
     function settle(Batch calldata b) external whenNotPaused onlyRelayer {
         require(b.legs.length > 0, "no legs");
         require(!usedBatchIds[b.batchId], "batch used");
         usedBatchIds[b.batchId] = true;
 
         // NOTE: Minimal MVP — assumes allowances are set or permits validated off-chain.
         unchecked {
             for (uint256 i = 0; i < b.legs.length; i++) {
                 Leg calldata leg = b.legs[i];
                 require(leg.token != address(0) && leg.from != address(0) && leg.to != address(0), "bad leg");
                 require(leg.amount > 0, "zero amount");
                 require(leg.deadline == 0 || block.timestamp <= leg.deadline, "expired");
                 require(!usedNonces[leg.from][leg.nonce], "nonce used");
                 usedNonces[leg.from][leg.nonce] = true;
 
                 bool ok = IERC20Minimal(leg.token).transferFrom(leg.from, leg.to, leg.amount);
                 require(ok, "transferFrom failed");
             }
         }
         emit Settled(b.batchId, b.legs.length);
     }
 }

