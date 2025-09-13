import type { Proposal } from '@/lib/types/governance'

export function quorumReached(p: Proposal): boolean {
  const quorum = Number(p.config.quorumPercent) || 0
  const total = Number(p.tally.totalSnapshotPower) || 0
  const participated = (Number(p.tally.forPower) || 0) + (Number(p.tally.againstPower) || 0) + (Number(p.tally.abstainPower) || 0)
  if (total <= 0 || quorum <= 0) return false
  return (participated / total) * 100 >= quorum
}

export function supportPercent(p: Proposal): number {
  const forP = Number(p.tally.forPower) || 0
  const againstP = Number(p.tally.againstPower) || 0
  const denom = forP + againstP
  if (denom <= 0) return 0
  return (forP / denom) * 100
}

export function passReached(p: Proposal): boolean {
  const threshold = Number(p.config.passThresholdPercent) || 0
  return supportPercent(p) >= threshold
}

export function timeLeft(p: Proposal, now: number = Date.now()): string {
  if (!p.endsAt) return ''
  const ms = Math.max(0, p.endsAt - now)
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default { quorumReached, supportPercent, passReached, timeLeft }

