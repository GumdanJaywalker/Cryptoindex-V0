import path from 'path';

export async function GET() {
  try {
    const orchestratorPath = path.join(process.cwd(), 'hooats-core', 'settlement', 'orchestrator.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SettlementOrchestrator } = require(orchestratorPath);
    const orch = SettlementOrchestrator.getInstance();
    await orch.start();
    const m = await orch.getMetrics();
    return new Response(JSON.stringify({ metrics: m, ts: Date.now() }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'metrics failed' }), { status: 500 });
  }
}

