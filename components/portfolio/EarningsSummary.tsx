'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/lib/hooks/useCurrency'

// Lightweight mock summary for overview badges
function useMockEarningsSummary() {
  // Align roughly with CreatorEarnings mock proportions
  const totalCreator = 392_800 + 166_200 + 98_500
  const totalLP = Math.round(totalCreator * 0.4)
  return { creatorTotal: totalCreator, lpTotal: totalLP }
}

export function EarningsSummary() {
  const { creatorTotal, lpTotal } = useMockEarningsSummary()
  const { formatBalance } = useCurrency()
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="text-slate-200 border-teal">
        Creator Fees: <span className="ml-1 font-semibold text-white">{formatBalance(creatorTotal)}</span>
      </Badge>
      <Badge variant="outline" className="text-slate-200 border-teal">
        LP Fees: <span className="ml-1 font-semibold text-white">{formatBalance(lpTotal)}</span>
      </Badge>
    </div>
  )
}

export default EarningsSummary

