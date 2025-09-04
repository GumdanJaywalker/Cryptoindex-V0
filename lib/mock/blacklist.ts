export type BlacklistEntry = {
  symbol: string
  reason: string
}

// Mock global blacklist managed by the platform (compliance/scam prevention)
export const globalBlacklist: BlacklistEntry[] = [
  { symbol: 'SCAM1', reason: 'Known scam token' },
  { symbol: 'RUG', reason: 'Rug-pull risk reported' },
  { symbol: 'FAKE', reason: 'Impersonation of a legitimate token' },
]

