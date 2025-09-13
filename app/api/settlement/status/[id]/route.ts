import path from 'path';

interface Params { id: string }

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    const orchestratorPath = path.join(process.cwd(), 'hooats-core', 'settlement', 'orchestrator.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SettlementOrchestrator } = require(orchestratorPath);
    const orch = SettlementOrchestrator.getInstance();
    await orch.start();
    const result = await orch.getResult(params.id);
    return new Response(JSON.stringify({ id: params.id, result }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'status failed' }), { status: 500 });
  }
}

