// Governance core types (frontend-facing)

export type ProposalType = 'rebalancing' | 'battle' | 'parameter'
export type ProposalPhase =
  | 'pending'           // Drafted, not yet open
  | 'active'            // Open for voting
  | 'commit'            // Commit phase (if commit-reveal enabled)
  | 'reveal'            // Reveal phase (if commit-reveal enabled)
  | 'succeeded'         // Passed thresholds
  | 'defeated'          // Failed thresholds/quorum
  | 'queued'            // Timelock queued
  | 'timelocked'        // In timelock waiting period
  | 'awaiting-multisig' // Awaiting M-of-N signatures
  | 'executed'          // Executed on chain
  | 'canceled'          // Canceled/invalidated

export type SnapshotMethod = 'single' | 'time-weighted' | 'lock-based' | 'multi-point' | 'commit-reveal'

export interface SnapshotConfig {
  method: SnapshotMethod
  // for single snapshot
  snapshotBlock?: number
  // for time windows
  windowStart?: number // epoch ms
  windowEnd?: number   // epoch ms
}

export interface VotingConfig {
  snapshot: SnapshotConfig
  quorumPercent: number // e.g. 20 means 20%
  passThresholdPercent: number // e.g. 60 means 60%
  timelockSeconds?: number // waiting period before execution
  multisig?: { m: number; n: number } // M-of-N signatures required
  shielded?: boolean // commit-reveal enabled
}

export interface Tally {
  forPower: number
  againstPower: number
  abstainPower: number
  totalSnapshotPower: number
}

export interface TimelockInfo {
  queuedAt?: number // epoch ms
  eta?: number // earliest execution time epoch ms
}

export interface MultisigState {
  required: number
  total: number
  signed: string[] // addresses
}

export interface UserState {
  eligible: boolean
  votingPowerAtSnapshot: number
  hasCommitted?: boolean
  hasRevealed?: boolean
}

export interface ChangeSet {
  type: 'add' | 'remove' | 'adjust'
  symbol: string
  currentPct?: number
  proposedPct?: number
  rationale?: string
}

export interface Proposal {
  id: string
  type: ProposalType
  title: string
  indexSymbol?: string
  description?: string
  createdAt: number
  endsAt?: number
  phase: ProposalPhase
  config: VotingConfig
  tally: Tally
  timelock?: TimelockInfo
  multisig?: MultisigState
  user?: UserState
  // rebalancing specifics
  changes?: ChangeSet[]
}

