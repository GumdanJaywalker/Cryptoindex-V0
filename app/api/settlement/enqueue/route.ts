import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orchestratorPath = path.join(process.cwd(), 'hooats-core', 'settlement', 'orchestrator.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SettlementOrchestrator } = require(orchestratorPath);
    const orch = SettlementOrchestrator.getInstance();
    await orch.start();
    await orch.enqueueTrade(body);
    return new Response(JSON.stringify({ status: 'enqueued' }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'enqueue failed' }), { status: 500 });
  }
}

