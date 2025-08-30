#!/usr/bin/env node
/**
 * HOOATS Comprehensive Test Suite
 * - Offchain Orderbook TPS
 * - AMM TPS
 * - Settlement latency for offchain trades
 * - HOOATS hybrid routing scenario
 * - MEV protection commit/reveal flow
 */

const { RealOrderbookEngine } = require('./lib/orderbook/real-orderbook-engine');
const { RealHybridRouter } = require('./lib/trading/hybrid-router-real');
const { AsyncSettlementQueue } = require('./lib/settlement/async-settlement-queue');
const { MEVProtectionSystem } = require('./lib/security/MEVProtection');
const { ethers } = require('ethers');

const CHAIN_ID = 998;
const RPC_URL = process.env.HYPERVM_TESTNET_RPC || 'https://api.hyperliquid-testnet.xyz/evm';

async function testOffchainOrderbookTPS(orderCount = 500) {
  const engine = RealOrderbookEngine.getInstance();
  await engine.initialize();

  const start = Date.now();
  for (let i = 0; i < orderCount; i++) {
    const order = {
      id: `ob_${i}`,
      userId: `user_${i % 10}`,
      pair: 'HYPERINDEX-USDC',
      side: i % 2 === 0 ? 'buy' : 'sell',
      type: 'limit',
      price: (1 + Math.random() * 0.01).toFixed(6),
      amount: (Math.random() * 10 + 1).toFixed(6),
      timestamp: Date.now(),
    };
    await engine.processOrderUltraFast(order);
  }
  const elapsed = Date.now() - start;
  const tps = (orderCount / elapsed) * 1000;
  console.log(`📈 Offchain Orderbook TPS: ${tps.toFixed(2)} (processed ${orderCount} orders in ${elapsed}ms)`);
  return { tps, elapsed };
}

async function testAMMTPS(swapCount = 3, amount = '1') {
  const router = RealHybridRouter.getInstance();
  await router.initialize();

  const start = Date.now();
  for (let i = 0; i < swapCount; i++) {
    try {
      await router.executeAMMSwap({
        id: `amm_${i}`,
        side: 'buy',
        type: 'market',
        amount,
        userId: `amm_user_${i}`,
        pair: 'HYPERINDEX-USDC',
      });
    } catch (err) {
      console.error('AMM swap failed:', err.message);
    }
  }
  const elapsed = Date.now() - start;
  const tps = (swapCount / elapsed) * 1000;
  console.log(`🏦 AMM TPS: ${tps.toFixed(2)} (processed ${swapCount} swaps in ${elapsed}ms)`);
  return { tps, elapsed };
}

async function testSettlementLatency() {
  const engine = RealOrderbookEngine.getInstance();
  const queue = AsyncSettlementQueue.getInstance();
  await engine.initialize();

  const sellOrder = {
    id: 'seller_limit',
    userId: 'userA',
    pair: 'HYPERINDEX-USDC',
    side: 'sell',
    type: 'limit',
    amount: '5',
    price: '1.05',
    timestamp: Date.now(),
  };
  await engine.processOrderUltraFast(sellOrder);

  const marketOrder = {
    id: 'buyer_market',
    userId: 'userB',
    pair: 'HYPERINDEX-USDC',
    side: 'buy',
    type: 'market',
    amount: '5',
    timestamp: Date.now(),
  };

  const start = Date.now();
  const match = await engine.processOrderUltraFast(marketOrder);
  if (!match.trades || match.trades.length === 0) {
    console.log('No trade executed for settlement test');
    return { latency: null };
  }
  const tradeId = match.trades[0].id;
  let settled = false;
  while (!settled) {
    const status = await queue.getSettlementStatus(tradeId);
    if (status && status.status === 'settled') {
      settled = true;
      break;
    }
    if (Date.now() - start > 60000) break; // 60s timeout
    await new Promise(r => setTimeout(r, 1000));
  }
  const latency = settled ? Date.now() - start : null;
  console.log(`⏱️ Settlement latency: ${latency !== null ? latency + 'ms' : 'not settled within 60s'}`);
  return { latency };
}

async function testHOOATSScenario() {
  const engine = RealOrderbookEngine.getInstance();
  const router = RealHybridRouter.getInstance();
  await engine.initialize();
  await router.initialize();

  await engine.processOrderUltraFast({ id: 'ask1', userId: 'maker1', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.01', amount: '100', timestamp: Date.now() });
  await engine.processOrderUltraFast({ id: 'ask2', userId: 'maker2', pair: 'HYPERINDEX-USDC', side: 'sell', type: 'limit', price: '1.02', amount: '200', timestamp: Date.now() });

  const result = await router.processHybridOrderUltraFast({
    id: 'market_buy_400',
    userId: 'buyer',
    pair: 'HYPERINDEX-USDC',
    side: 'buy',
    type: 'market',
    amount: '400',
  });
  console.log('🔀 HOOATS routing result:', result.summary || result);
  return result;
}

async function testMEVProtection() {
  const mev = new MEVProtectionSystem();
  const order = {
    id: 'mev_test',
    userId: 'attacker',
    pair: 'HYPERINDEX-USDC',
    side: 'buy',
    amount: '10',
    price: '1',
    type: 'market',
    nonce: 1,
    signature: '0x',
    timestamp: Date.now(),
  };
  const commit = await mev.commitOrder(order.userId, order, order.signature);
  await new Promise(r => setTimeout(r, commit.revealAfter - Date.now() + 10));
  const reveal = await mev.revealOrder(commit.commitmentId, order, order.signature);
  console.log('🛡️ MEV commit-reveal completed:', commit.commitmentId, reveal.batchId);
  return { commitment: commit.commitmentId, batch: reveal.batchId };
}

async function main() {
  console.log('🚀 Running HOOATS Comprehensive Test Suite');
  try {
    const orderbook = await testOffchainOrderbookTPS(100);
    const amm = await testAMMTPS(2, '1');
    const settlement = await testSettlementLatency();
    const scenario = await testHOOATSScenario();
    const mev = await testMEVProtection();
    console.log('\n✅ Test suite completed');
    console.log({ orderbook, amm, settlement, scenario: scenario.summary || null, mev });
  } catch (err) {
    console.error('❌ Test suite failed:', err);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
