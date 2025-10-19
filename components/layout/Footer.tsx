'use client'

import React from 'react'
import Link from 'next/link'
import { Timer, Activity } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Status = 'ok' | 'degraded' | 'down'

export function StickyFooter({ className }: { className?: string }) {
  const [latency, setLatency] = React.useState<number | null>(null)
  const [block, setBlock] = React.useState<number | null>(null)
  const [status, setStatus] = React.useState<Status>('degraded')

  React.useEffect(() => {
    let height = 21000000
    const tick = () => {
      const l = Math.floor(45 + Math.random() * 135)
      height = height + (Math.random() > 0.6 ? 1 : 0)
      setLatency(l)
      setBlock(height)
      setStatus(l < 120 ? 'ok' : l < 200 ? 'degraded' : 'down')
    }
    tick()
    const id = setInterval(tick, 5000)
    return () => clearInterval(id)
  }, [])

  const dotClass =
    status === 'ok' ? 'bg-green-500/80' : status === 'degraded' ? 'bg-yellow-400/80' : 'bg-red-500/80'

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 hidden md:flex items-center justify-between',
          'h-9 px-3 border-t border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80',
          className,
        )}
        role="contentinfo"
        aria-label="Sticky footer"
      >
        {/* Left group */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className={cn('w-1.5 h-1.5 rounded-full', dotClass)} />
              <span>Network</span>
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1 cursor-default">
                <Timer className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums">{latency !== null ? `${latency} ms` : '—'}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Estimated RPC latency (mock). Updates every 5s.</TooltipContent>
          </Tooltip>
          <span className="text-slate-600">|</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1 cursor-default">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums">{block !== null ? block.toLocaleString() : '—'}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Current block height (mock). Updates every 5s.</TooltipContent>
          </Tooltip>
        </div>

        {/* Right group */}
        <nav className="flex items-center gap-3 text-xs text-slate-400">
          <Link href="/docs" className="hover:text-slate-200">Docs</Link>
          <span className="text-slate-600">/</span>
          <Link href="#" className="hover:text-slate-200">Support</Link>
          <span className="text-slate-600">/</span>
          <Link href="#" className="hover:text-slate-200">Terms</Link>
          <span className="text-slate-600">/</span>
          <Link href="#" className="hover:text-slate-200">Privacy Policy</Link>
        </nav>
      </div>
    </TooltipProvider>
  )
}

export default StickyFooter

