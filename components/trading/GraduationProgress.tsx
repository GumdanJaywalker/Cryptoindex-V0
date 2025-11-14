"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type GraduationStatus = 'launching' | 'recruiting-liquidity' | 'near-graduation' | 'graduated'

export interface GraduationData {
  liquidityProgress: number
  salesProgress: number
  status: GraduationStatus
}

export function GraduationProgress({
  data,
  variant = 'compact',
  className,
}: {
  data: GraduationData
  variant?: 'compact' | 'full'
  className?: string
}) {
  const avg = Math.round((data.liquidityProgress + data.salesProgress) / 2)

  if (variant === 'compact') {
    return (
      <div className={cn("", className)}>
        <div className="text-xs hl-text-secondary">Graduation</div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-slate-400 whitespace-nowrap">Liq {data.liquidityProgress}%</div>
            <Progress value={data.liquidityProgress} className="h-1 w-12" indicatorClassName="bg-brand" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-slate-400 whitespace-nowrap">Sales {data.salesProgress}%</div>
            <Progress value={data.salesProgress} className="h-1 w-12" indicatorClassName="bg-brand" />
          </div>
        </div>
      </div>
    )
  }

  const statusLabel = {
    'launching': 'Launching (L3, bonding curve)',
    'recruiting-liquidity': 'Recruiting Liquidity',
    'near-graduation': 'Near Graduation',
    'graduated': 'Graduated (L2)'
  }[data.status]

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold text-white">Graduation Progress</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-teal-card border-teal text-slate-200">
              <div className="text-xs max-w-[260px]">
                Dual goals to graduate from L3: Liquidity target and Sales target. Execution moves to L2 when both goals are met and governance approves.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-auto text-xs text-slate-400">{statusLabel}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#D7EAE8] mb-1">
            <span>Liquidity</span>
            <span className="text-[#D7EAE8] font-medium">{data.liquidityProgress}%</span>
          </div>
          <Progress value={data.liquidityProgress} className="h-2" indicatorClassName="bg-brand" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-[#D7EAE8] mb-1">
            <span>Sales</span>
            <span className="text-[#D7EAE8] font-medium">{data.salesProgress}%</span>
          </div>
          <Progress value={data.salesProgress} className="h-2" indicatorClassName="bg-brand" />
        </div>
      </div>
    </div>
  )
}

export default GraduationProgress
