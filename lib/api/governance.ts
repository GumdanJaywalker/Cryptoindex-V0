export type IndexSpec = {
  basics: {
    name: string
    symbol: string
    category: string
    description: string
  }
  chain: {
    chain: string
    settlementToken: string
    feeToken: string
  }
  constituents: Array<{ symbol: string; weight: number }>
  rules: {
    maxPerAsset: number
    minLiquidity: number
  }
}

export async function submitIndexSpec(spec: IndexSpec): Promise<{ id: string }> {
  // Stub: simulate latency and random outcome
  await new Promise((r) => setTimeout(r, 800))
  // 85% success rate
  if (Math.random() < 0.85) {
    return { id: `idx_${Date.now()}` }
  }
  throw new Error('Temporary submission error. Please try again.')
}

// Governance list stubs
import type { Proposal } from '@/lib/types/governance'

export async function getProposals(): Promise<Proposal[]> {
  await new Promise((r) => setTimeout(r, 200))
  const now = Date.now()
  const hour = 3600_000
  return [
    {
      id: 'pr_001',
      type: 'rebalancing',
      title: 'DOG_INDEX Quarterly Rebalancing',
      indexSymbol: 'DOG_INDEX',
      description: 'Adjust WIF to 20% and remove SHIB due to liquidity risk.',
      createdAt: now - 10 * hour,
      endsAt: now + 48 * hour,
      phase: 'active',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 7 * 24 * hour, windowEnd: now },
        quorumPercent: 20,
        passThresholdPercent: 60,
        timelockSeconds: 48 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 12_500_000, againstPower: 2_400_000, abstainPower: 100_000, totalSnapshotPower: 80_000_000 },
      timelock: {},
      multisig: { required: 4, total: 4, signed: [] },
      user: { eligible: true, votingPowerAtSnapshot: 2_000 },
      changes: [
        { type: 'adjust', symbol: 'WIF', currentPct: 8, proposedPct: 20, rationale: 'Exceptional growth' },
        { type: 'remove', symbol: 'SHIB', currentPct: 25, proposedPct: 0, rationale: 'Liquidity and performance' },
      ],
    },
    {
      id: 'pr_002',
      type: 'rebalancing',
      title: 'CAT_INDEX Monthly Rebalancing',
      indexSymbol: 'CAT_INDEX',
      description: 'Add GRUMPY at 12% and increase POPCAT to 35%.',
      createdAt: now - 72 * hour,
      endsAt: now + 6 * hour,
      phase: 'active',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 7 * 24 * hour, windowEnd: now },
        quorumPercent: 18,
        passThresholdPercent: 55,
        timelockSeconds: 24 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 8_400_000, againstPower: 3_100_000, abstainPower: 50_000, totalSnapshotPower: 60_000_000 },
      timelock: {},
      multisig: { required: 4, total: 4, signed: ['0x1111111111111111111111111111111111111111'] },
      user: { eligible: true, votingPowerAtSnapshot: 1_200 },
      changes: [
        { type: 'add', symbol: 'GRUMPY', proposedPct: 12, rationale: 'New entrant with momentum' },
        { type: 'adjust', symbol: 'POPCAT', currentPct: 25, proposedPct: 35 },
      ],
    },
    {
      id: 'pr_003',
      type: 'rebalancing',
      title: 'AI_INDEX Emergency Adjustment',
      indexSymbol: 'AI_INDEX',
      description: 'Adjust TAO to 30% and add PRIME 8%.',
      createdAt: now - 2 * hour,
      endsAt: now + 6 * hour,
      phase: 'active',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 24 * hour, windowEnd: now },
        quorumPercent: 22,
        passThresholdPercent: 60,
        timelockSeconds: 24 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 4_200_000, againstPower: 900_000, abstainPower: 50_000, totalSnapshotPower: 55_000_000 },
      timelock: {},
      multisig: { required: 4, total: 4, signed: [] },
      user: { eligible: true, votingPowerAtSnapshot: 900 },
      changes: [
        { type: 'adjust', symbol: 'TAO', currentPct: 20, proposedPct: 30 },
        { type: 'add', symbol: 'PRIME', proposedPct: 8 },
      ],
    },
    {
      id: 'pr_004',
      type: 'rebalancing',
      title: 'CAT_INDEX Adjustment',
      indexSymbol: 'CAT_INDEX',
      description: 'Add GRUMPY 12%.',
      createdAt: now - 26 * hour,
      endsAt: now + 2 * hour,
      phase: 'active',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 48 * hour, windowEnd: now - 4 * hour },
        quorumPercent: 18,
        passThresholdPercent: 55,
        timelockSeconds: 24 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 2_400_000, againstPower: 1_300_000, abstainPower: 40_000, totalSnapshotPower: 60_000_000 },
      timelock: {},
      multisig: { required: 4, total: 4, signed: [] },
      user: { eligible: true, votingPowerAtSnapshot: 500 },
      changes: [
        { type: 'add', symbol: 'GRUMPY', proposedPct: 12 },
      ],
    },
    {
      id: 'pr_005',
      type: 'rebalancing',
      title: 'FROG_INDEX Rebalancing — queued',
      indexSymbol: 'FROG_INDEX',
      description: 'Reduce PEPE to 35% and add WOJAK 8%.',
      createdAt: now - 96 * hour,
      endsAt: now - 24 * hour,
      phase: 'queued',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 7 * 24 * hour, windowEnd: now - 24 * hour },
        quorumPercent: 20,
        passThresholdPercent: 60,
        timelockSeconds: 24 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 15_000_000, againstPower: 3_200_000, abstainPower: 120_000, totalSnapshotPower: 80_000_000 },
      timelock: { queuedAt: now - 24 * hour, eta: now + 12 * hour },
      multisig: { required: 4, total: 4, signed: ['0x1111111111111111111111111111111111111111'] },
      user: { eligible: true, votingPowerAtSnapshot: 0 },
      changes: [
        { type: 'adjust', symbol: 'PEPE', currentPct: 45, proposedPct: 35 },
        { type: 'add', symbol: 'WOJAK', proposedPct: 8 },
      ],
    },
    {
      id: 'pr_006',
      type: 'rebalancing',
      title: 'MOON_INDEX — executed',
      indexSymbol: 'MOON_INDEX',
      description: 'Executed: Added ROCKET 10%.',
      createdAt: now - 7 * 24 * hour,
      endsAt: now - 6 * 24 * hour,
      phase: 'executed',
      config: {
        snapshot: { method: 'time-weighted', windowStart: now - 8 * 24 * hour, windowEnd: now - 7 * 24 * hour },
        quorumPercent: 20,
        passThresholdPercent: 60,
        timelockSeconds: 24 * 3600,
        multisig: { m: 4, n: 4 },
      },
      tally: { forPower: 22_000_000, againstPower: 4_000_000, abstainPower: 200_000, totalSnapshotPower: 90_000_000 },
      timelock: { queuedAt: now - 6 * 24 * hour, eta: now - 5 * 24 * hour },
      multisig: { required: 4, total: 4, signed: ['0x1','0x2','0x3','0x4'] as any },
      user: { eligible: true, votingPowerAtSnapshot: 0 },
      changes: [
        { type: 'add', symbol: 'ROCKET', proposedPct: 10 },
      ],
    },
  ]
}

export type VoteChoice = 'for' | 'against' | 'abstain'

export async function submitVote(proposalId: string, choice: VoteChoice, power?: number): Promise<{ ok: true }> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 500))
  return { ok: true }
}
