/**
 * HOOATS Settlement Orchestrator (skeleton v1)
 * - Consumes trades from Redis Stream (inbox)
 * - Nets legs, builds batches within size/time/gas limits
 * - Submits to BatchSettlement (stubbed for now)
 * - Tracks idempotency and results
 */

const Redis = require('ioredis');
const crypto = require('crypto');
const { ethers } = require('ethers');
const cfg = require('./config');

class SettlementOrchestrator {
  static instance = null;

  static getInstance() {
    if (!SettlementOrchestrator.instance) {
      SettlementOrchestrator.instance = new SettlementOrchestrator();
    }
    return SettlementOrchestrator.instance;
  }

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(url);
    this.running = false;
    this.buffer = [];
    this.lastFlushAt = Date.now();
    this.metrics = {
      batchesSubmitted: 0,
      submitFailures: 0,
      lastSubmitMs: 0,
      inboxLag: 0,
      bufferLen: 0,
      backpressure: false
    };
    this.contract = null;
  }

  async ensureStreams() {
    // Create consumer group idempotently
    try {
      await this.redis.xgroup('CREATE', cfg.streams.inbox, cfg.groups.inbox, '$', 'MKSTREAM');
    } catch (e) {
      if (!String(e.message).includes('BUSYGROUP')) throw e;
    }
  }

  async start() {
    if (this.running) return;
    await this.ensureStreams();
    await this.ensureContract();
    this.running = true;
    this.loop();
  }

  async stop() {
    this.running = false;
  }

  async loop() {
    const block = cfg.polling.blockMs;
    const idleSleep = cfg.polling.idleSleepMs;
    while (this.running) {
      try {
        const res = await this.redis.xreadgroup(
          'GROUP', cfg.groups.inbox, 'orchestrator-1',
          'BLOCK', block,
          'COUNT', 100,
          'STREAMS', cfg.streams.inbox,
          '>'
        );

        if (res && res.length) {
          const [, entries] = res[0];
          for (const [id, fields] of entries) {
            const trade = this.parseFields(fields);
            if (!this.isDuplicate(trade)) {
              this.buffer.push(trade);
            }
            await this.redis.xack(cfg.streams.inbox, cfg.groups.inbox, id);
          }
        } else {
          await this.sleep(idleSleep);
        }

        if (this.shouldFlush()) {
          await this.flushBatch();
        }
      } catch (e) {
        // On errors, small backoff to avoid tight loop
        await this.sleep(50);
      }
    }
  }

  parseFields(fields) {
    // fields is [k1,v1,k2,v2,...]
    const obj = {};
    for (let i = 0; i < fields.length; i += 2) obj[fields[i]] = fields[i + 1];
    // trade structure expectation: {pair, buyer, seller, baseToken, quoteToken, amountBase, amountQuote, price}
    return obj;
  }

  isDuplicate(trade) {
    const key = `${trade.tradeId || ''}`;
    if (!key) return false;
    const h = crypto.createHash('sha256').update(key).digest('hex');
    // Not checking Redis here (skeleton); caller should store idempotency elsewhere
    trade._idem = h;
    return false;
  }

  shouldFlush() {
    const maxLegs = cfg.batching.maxLegs;
    const timeWindow = cfg.batching.timeWindowMs;
    this.metrics.bufferLen = this.buffer.length;
    const flushDue = this.buffer.length >= maxLegs || (Date.now() - this.lastFlushAt) >= timeWindow;
    this.metrics.backpressure = this.buffer.length > maxLegs * 2; // simple signal
    return flushDue;
  }

  netTradesToLegs(trades) {
    // Simple netting placeholder: convert each trade to two legs
    const legs = [];
    for (const t of trades) {
      // buyer sends quote to seller; seller sends base to buyer
      legs.push({ token: t.quoteToken, from: t.buyer, to: t.seller, amount: t.amountQuote, nonce: Date.now(), deadline: 0 });
      legs.push({ token: t.baseToken, from: t.seller, to: t.buyer, amount: t.amountBase, nonce: Date.now(), deadline: 0 });
    }
    return legs;
  }

  buildBatch(legs) {
    // Truncate by max legs and leave remainder in buffer next round
    const max = cfg.batching.maxLegs;
    const use = legs.slice(0, max);
    const batchId = '0x' + crypto.randomBytes(32).toString('hex');
    return { batchId, legs: use };
  }

  async flushBatch() {
    if (this.buffer.length === 0) return;
    const trades = this.buffer.splice(0, this.buffer.length);
    const legs = this.netTradesToLegs(trades);
    const batch = this.buildBatch(legs);
    this.lastFlushAt = Date.now();

    // Persist batch intent (stream) and invoke submission (stub)
    await this.redis.xadd(cfg.streams.batches, '*', 'batchId', batch.batchId, 'legsCount', String(batch.legs.length));
    await this.submitBatch(batch);
  }

  async submitBatch(batch) {
    const key = `${cfg.keys.results}:${batch.batchId}`;
    // If no contract configured, simulate
    if (!cfg.contract.address || !this.contract) {
      const result = { status: 'simulated', at: Date.now(), legs: batch.legs.length };
      await this.redis.set(key, JSON.stringify(result));
      return true;
    }
    const start = Date.now();
    try {
      // Map legs to contract tuple shape
      const mappedLegs = batch.legs.map((l) => ({
        token: l.token,
        from: l.from,
        to: l.to,
        amount: BigInt(l.amount),
        permit: '0x',
        nonce: BigInt(l.nonce || Date.now()),
        deadline: BigInt(l.deadline || 0)
      }));
      const tx = await this.contract.settle({ batchId: batch.batchId, legs: mappedLegs });
      const receipt = await tx.wait();
      const result = { status: 'confirmed', txHash: tx.hash, block: receipt.blockNumber, at: Date.now(), legs: mappedLegs.length };
      await this.redis.set(key, JSON.stringify(result));
      this.metrics.batchesSubmitted += 1;
      this.metrics.lastSubmitMs = Date.now() - start;
      return true;
    } catch (e) {
      this.metrics.submitFailures += 1;
      const result = { status: 'failed', error: String(e.message || e), at: Date.now() };
      await this.redis.set(key, JSON.stringify(result));
      // TODO: dead-letter or split and retry
      return false;
    }
  }

  async enqueueTrade(trade) {
    // public method to enqueue from orderbook
    const f = [];
    for (const [k, v] of Object.entries(trade)) { f.push(k, String(v)); }
    await this.redis.xadd(cfg.streams.inbox, '*', ...f);
  }

  async ensureContract() {
    if (!cfg.contract.address || !cfg.contract.privateKey) return;
    try {
      const provider = new ethers.JsonRpcProvider(cfg.contract.rpcUrl);
      const wallet = new ethers.Wallet(cfg.contract.privateKey, provider);
      const ABI = [
        'function settle((bytes32,(address,address,address,uint256,bytes,uint256,uint256)[])) external'
      ];
      this.contract = new ethers.Contract(cfg.contract.address, ABI, wallet);
    } catch (e) {
      // leave contract null to simulate
      this.contract = null;
    }
  }

  async getMetrics() {
    try {
      const info = await this.redis.xinfo('STREAM', cfg.streams.inbox);
      const length = Array.isArray(info) ? (info.find((x, i) => i % 2 === 0 && x === 'length') ? info[info.indexOf('length') + 1] : 0) : 0;
      this.metrics.inboxLag = Number(length || 0);
    } catch {}
    return {
      ...this.metrics,
      lastFlushAt: this.lastFlushAt
    };
  }

  async getResult(id) {
    const key = `${cfg.keys.results}:${id}`;
    const v = await this.redis.get(key);
    return v ? JSON.parse(v) : null;
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}

module.exports = { SettlementOrchestrator };
