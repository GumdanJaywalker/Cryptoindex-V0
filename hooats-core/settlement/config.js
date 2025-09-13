module.exports = {
  streams: {
    inbox: 'hooats:settlement:inbox',
    batches: 'hooats:settlement:batches',
    deadletter: 'hooats:settlement:deadletter'
  },
  groups: {
    inbox: 'orchestrator'
  },
  keys: {
    idempotency: 'hooats:settlement:idempotency',
    inflight: 'hooats:settlement:inflight',
    results: 'hooats:settlement:results'
  },
  batching: {
    maxLegs: parseInt(process.env.SETTLEMENT_MAX_LEGS || '150', 10),
    timeWindowMs: parseInt(process.env.SETTLEMENT_TIME_WINDOW_MS || '400', 10),
    maxGasEstimate: parseInt(process.env.SETTLEMENT_MAX_GAS || '2500000', 10)
  },
  polling: {
    blockMs: parseInt(process.env.SETTLEMENT_POLL_BLOCK_MS || '100', 10),
    idleSleepMs: parseInt(process.env.SETTLEMENT_IDLE_SLEEP_MS || '50', 10)
  },
  contract: {
    address: process.env.SETTLEMENT_CONTRACT || '',
    relayer: process.env.SETTLEMENT_RELAYER || '',
    rpcUrl: process.env.HYPEREVM_RPC_URL || 'http://localhost:8545',
    privateKey: process.env.SETTLEMENT_PRIVATE_KEY || ''
  }
};
