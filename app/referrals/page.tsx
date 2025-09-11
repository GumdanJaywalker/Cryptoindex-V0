'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// Tabs removed: single view reflects user's tier automatically
import { useToast } from '@/components/notifications/toast-system'
import { cn } from '@/lib/utils'
import { Users, Share2, Link as LinkIcon, Copy, Info, Shield, TrendingUp, HandCoins } from 'lucide-react'
import LeftSidebar from '@/components/sidebar/LeftSidebar'

export default function ReferralsPage() {
  const { addToast } = useToast()

  // Mock profile + metrics
  const profile = useMemo(() => ({
    influencer: {
      tier: 'Partner 0',
      code: 'HYPER-PARTNER-000',
      approved: false, // mock: not approved by default
    },
    individual: {
      tier: 'Individual 0',
      code: 'HYPER-USER-000',
      approved: true,
    },
  }), [])

  const metrics = useMemo(() => ({
    clicks: 1287,
    signups: 342,
    attributedVolume24h: 1823400,
    creatorFeeUSD: 1245.22,
    lpFeeUSD: 986.40,
  }), [])

  // Mock 14-day timeseries for charts/CSV
  const series = useMemo(() => {
    const days = 14
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const data = Array.from({ length: days }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (days - 1 - i))
      const clicks = Math.floor(50 + Math.sin(i / 2) * 20 + Math.random() * 15)
      const signups = Math.floor(clicks * (0.22 + Math.random() * 0.1))
      const volume = Math.floor(50000 + clicks * (1000 + Math.random() * 500))
      const creatorFee = volume * 0.0006
      const lpFee = volume * 0.0005
      return {
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        clicks,
        signups,
        volume,
        creatorFee,
        lpFee,
      }
    })
    return data
  }, [])

  const referralLink = (code: string) => `${globalThis?.location?.origin || 'https://app.hyperindex.dev'}/?ref=${encodeURIComponent(code)}`

  const handleCopy = async (text: string, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text)
      addToast({ type: 'success', title: label, description: text, duration: 2500 })
    } catch (e) {
      addToast({ type: 'error', title: 'Copy failed', description: 'Please copy manually', duration: 3000 })
    }
  }

  // Auto-tier: show influencer tier if approved; otherwise show individual tier
  const current = profile.influencer.approved ? profile.influencer : profile.individual

  const formatUSD = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] gap-5 items-start">
          <div className="order-2 lg:order-1"><LeftSidebar /></div>
          <main className="order-1 lg:order-2 max-w-6xl mx-auto w-full px-2 lg:px-0 space-y-6">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referrals</h1>
            <p className="text-slate-400 text-sm mt-1">Invite users and track attributed activity.</p>
          </div>
          {/* Policy badge removed */}
        </div>

        {/* Single view reflects current tier; application entry if not influencer */}
        <div className="mt-4 space-y-6">
          <ReferralBody
            tierLabel={current.tier}
            code={current.code}
            approved={profile.influencer.approved}
            referralLink={referralLink(current.code)}
            metrics={metrics}
            series={series}
            onCopy={handleCopy}
          />
        </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SimpleLineChart({ data, color = '#98FCE4', height = 60 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(1, max - min)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }} className="w-full">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  )
}

function ReferralBody({
  tierLabel,
  code,
  approved,
  referralLink,
  metrics,
  series,
  onCopy,
}: {
  tierLabel: string
  code: string
  approved: boolean
  referralLink: string
  metrics: { clicks: number; signups: number; attributedVolume24h: number; creatorFeeUSD: number; lpFeeUSD: number }
  series: Array<{ date: string; clicks: number; signups: number; volume: number; creatorFee: number; lpFee: number }>
  onCopy: (text: string, label?: string) => void
}) {
  const formatUSD = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  const clicksData = series.map(s => s.clicks)
  const signupsData = series.map(s => s.signups)

  const exportCSV = () => {
    const header = ['date','clicks','signups','volume','creatorFeeUSD','lpFeeUSD']
    const rows = series.map(s => [s.date, s.clicks, s.signups, s.volume, s.creatorFee.toFixed(2), s.lpFee.toFixed(2)])
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'referrals-analytics.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Tier & policy */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Your Tier</Badge>
            <div className="text-white font-semibold">{tierLabel}</div>
            <div className={cn('text-xs px-2 py-0.5 rounded border', approved ? 'text-green-400 border-green-400/30' : 'text-slate-400 border-slate-600')}>
              {approved ? 'Influencer' : 'Individual'}
            </div>
          </div>
          {!approved && (
            <Link href="/referrals/apply" className="text-xs px-3 py-1 rounded-md bg-brand text-black hover:bg-brand-hover">
              Apply for Influencer Tier
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Referral code / link */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm text-slate-300">Referral Code</div>
          <div className="flex items-center gap-2">
            <Input value={code} readOnly className="bg-slate-900 border-slate-700" />
            <Button variant="outline" className="border-slate-700" onClick={() => onCopy(code, 'Code copied')}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
          <div className="text-sm text-slate-300">Referral Link</div>
          <div className="flex items-center gap-2">
            <Input value={referralLink} readOnly className="bg-slate-900 border-slate-700" />
            <Button variant="outline" className="border-slate-700" onClick={() => onCopy(referralLink, 'Link copied')}>
              <LinkIcon className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-3 h-3" /> UTM parameters may be appended automatically.
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Clicks</div>
          <div className="text-lg font-semibold">{metrics.clicks.toLocaleString()}</div>
          <div className="mt-2"><SimpleLineChart data={clicksData} color="#7BC9FF" /></div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Signups</div>
          <div className="text-lg font-semibold">{metrics.signups.toLocaleString()}</div>
          <div className="mt-2"><SimpleLineChart data={signupsData} color="#98FCE4" /></div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">24H Attributed Volume</div>
          <div className="text-lg font-semibold">{formatUSD(metrics.attributedVolume24h)}</div>
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Total Earnings</div>
          <div className="text-lg font-semibold">{formatUSD(metrics.creatorFeeUSD + metrics.lpFeeUSD)}</div>
        </CardContent></Card>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Removed earnings breakdown and invite-only note */}
    </div>
  )
}
