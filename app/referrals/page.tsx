'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/notifications/toast-system'
import { cn } from '@/lib/utils'
import { Users, Share2, Link as LinkIcon, Copy, Info, Shield, TrendingUp, HandCoins } from 'lucide-react'
import LeftSidebar from '@/components/sidebar/LeftSidebar'

type UserType = 'influencer' | 'individual'

export default function ReferralsPage() {
  const [type, setType] = useState<UserType>('influencer')
  const { addToast } = useToast()

  // Mock profile + metrics
  const profile = useMemo(() => ({
    influencer: {
      tier: 'Partner 0',
      code: 'HYPER-PARTNER-000',
      approved: true,
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

  const referralLink = (code: string) => `${globalThis?.location?.origin || 'https://app.hyperindex.dev'}/?ref=${encodeURIComponent(code)}`

  const handleCopy = async (text: string, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text)
      addToast({ type: 'success', title: label, description: text, duration: 2500 })
    } catch (e) {
      addToast({ type: 'error', title: 'Copy failed', description: 'Please copy manually', duration: 3000 })
    }
  }

  const current = type === 'influencer' ? profile.influencer : profile.individual

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
            <p className="text-slate-400 text-sm mt-1">Invite users and track attributed activity. Program is invite‑only.</p>
          </div>
          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Policy: Approved creators only</Badge>
        </div>

        {/* Type switch */}
        <Tabs value={type} onValueChange={(v) => setType(v as UserType)}>
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="influencer" className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs">
              <Users className="w-3 h-3 mr-1" /> Influencer / KOLs
            </TabsTrigger>
            <TabsTrigger value="individual" className="data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-xs">
              <Share2 className="w-3 h-3 mr-1" /> Individual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="influencer" className="mt-4 space-y-6">
            <ReferralBody
              tierLabel={profile.influencer.tier}
              code={profile.influencer.code}
              approved={profile.influencer.approved}
              referralLink={referralLink(profile.influencer.code)}
              metrics={metrics}
              onCopy={handleCopy}
            />
          </TabsContent>

          <TabsContent value="individual" className="mt-4 space-y-6">
            <ReferralBody
              tierLabel={profile.individual.tier}
              code={profile.individual.code}
              approved={profile.individual.approved}
              referralLink={referralLink(profile.individual.code)}
              metrics={metrics}
              onCopy={handleCopy}
            />
          </TabsContent>
        </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}

function ReferralBody({
  tierLabel,
  code,
  approved,
  referralLink,
  metrics,
  onCopy,
}: {
  tierLabel: string
  code: string
  approved: boolean
  referralLink: string
  metrics: { clicks: number; signups: number; attributedVolume24h: number; creatorFeeUSD: number; lpFeeUSD: number }
  onCopy: (text: string, label?: string) => void
}) {
  const formatUSD = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-6">
      {/* Tier & policy */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">Your Tier</Badge>
            <div className="text-white font-semibold">{tierLabel}</div>
            <div className={cn('text-xs px-2 py-0.5 rounded border', approved ? 'text-green-400 border-green-400/30' : 'text-slate-400 border-slate-600')}>
              {approved ? 'Approved' : 'Pending approval'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4" /> Invite‑only program
          </div>
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
        </CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4">
          <div className="text-xs text-slate-400 mb-1">Signups</div>
          <div className="text-lg font-semibold">{metrics.signups.toLocaleString()}</div>
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

      {/* Earnings breakdown */}
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-2">
        <div className="text-xs text-slate-400">Earnings Breakdown</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-3 rounded border border-slate-700 bg-slate-800/40 flex items-center justify-between">
            <div className="text-slate-300">Creator Fee</div>
            <div className="text-white font-medium">{formatUSD(metrics.creatorFeeUSD)}</div>
          </div>
          <div className="p-3 rounded border border-slate-700 bg-slate-800/40 flex items-center justify-between">
            <div className="text-slate-300">LP Fee</div>
            <div className="text-white font-medium">{formatUSD(metrics.lpFeeUSD)}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <HandCoins className="w-3 h-3" /> Accruals are mock data; integrate spreadsheet/endpoint later.
        </div>
      </CardContent></Card>

      {/* Policy note */}
      <div className="text-xs text-slate-500">
        This referral program is not public. Rewards are available only to approved creators and influencers.
      </div>
    </div>
  )
}
