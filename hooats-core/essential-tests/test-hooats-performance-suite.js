#!/usr/bin/env node
 
 /**
  * HOOATS Performance Suite (Off-chain engine focus)
  * - Measures ops/sec for UltraPerformanceOrderbook.processOrderUltraFast
  * - Prints latency distribution approximation and error count
  */
 
 const path = require('path');
 const os = require('os');
 
 async function main() {
  const count = parseInt(process.env.COUNT || process.argv[2] || '500', 10);
   const pair = process.env.PAIR || 'HYPERINDEX-USDC';
 
   // Lazy require to avoid ESM issues
   const enginePath = path.join(process.cwd(), 'hooats-core', 'ultra-performance-orderbook-converted.js');
   const { UltraPerformanceOrderbook } = require(enginePath);
   const engine = UltraPerformanceOrderbook.getInstance();
 
   const orders = [];
   for (let i = 0; i < count; i++) {
     const side = i % 2 === 0 ? 'buy' : 'sell';
     const type = i % 5 === 0 ? 'limit' : 'market';
     const price = type === 'limit' ? (1 + ((i % 20) - 10) * 0.0005).toFixed(4) : null;
     orders.push({
       id: `perf_${Date.now()}_${i}`,
       userId: `u_${i % 1000}`,
       pair,
       side,
       type,
       amount: (Math.random() * 5 + 1).toFixed(4),
       price,
       timestamp: Date.now()
     });
   }
 
   const start = Date.now();
   let ok = 0, fail = 0;
   const latencies = [];
 
   for (const o of orders) {
     const t0 = Date.now();
     try {
       const res = await engine.processOrderUltraFast(o);
       if (res && (res.status === 'completed' || res.status === 'partial' || res.success !== false)) ok++;
       else fail++;
     } catch (e) {
       fail++;
     }
     latencies.push(Date.now() - t0);
   }
 
   const dur = Date.now() - start;
   const tps = Math.round((ok + fail) / (dur / 1000));
   latencies.sort((a, b) => a - b);
   const p = q => latencies[Math.min(latencies.length - 1, Math.floor(q * latencies.length))] || 0;
 
   console.log(JSON.stringify({
     host: os.hostname(),
     total: count,
     ok,
     fail,
     duration_ms: dur,
     tps,
     p50_ms: p(0.5),
     p95_ms: p(0.95),
     p99_ms: p(0.99)
   }, null, 2));
 }
 
 main().catch(e => {
   console.error('performance suite error', e);
   process.exit(1);
 });
 
