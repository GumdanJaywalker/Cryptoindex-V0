import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Gift, TrendingUp, Zap, ArrowRight } from "lucide-react"

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs" className="text-brand hover:underline mb-4 inline-block">← Back to Documentation</Link>
          <h1 className="text-4xl font-bold mb-4">Reward Programs</h1>
          <p className="text-lg text-slate-400">
            Earn $HIIN and $HIDE tokens by contributing to the HyperIndex ecosystem
          </p>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">INDEX Builder Program</h3>
                    <p className="text-sm text-brand">Earn $HIIN tokens</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-4">
                  Create successful indices and earn ongoing rewards from trading volume and performance fees
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500">Creator Fee</div>
                    <div className="font-semibold">0.02% per trade</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500">Performance Bonus</div>
                    <div className="font-semibold">Up to 20%</div>
                  </div>
                </div>
                <Link href="/docs/rewards/index-builder" className="inline-flex items-center gap-2 text-brand hover:underline text-sm">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">DEX Catalyst Program</h3>
                    <p className="text-sm text-brand">Earn $HIDE tokens</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-4">
                  Active traders earn rewards based on trading volume with tier-based multipliers
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500">Base Rewards</div>
                    <div className="font-semibold">0.01% volume</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500">Max Multiplier</div>
                    <div className="font-semibold">2x</div>
                  </div>
                </div>
                <Link href="/docs/rewards/dex-catalyst" className="inline-flex items-center gap-2 text-brand hover:underline text-sm">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Rewards Work</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <Gift className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Automatic Distribution</h3>
                  <p className="text-sm text-slate-400">Rewards calculated and distributed automatically every week</p>
                </div>
              </div>
              <div className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Performance-Based</h3>
                  <p className="text-sm text-slate-400">Higher activity and better performance = more rewards</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">No Lock-up Required</h3>
                  <p className="text-sm text-slate-400">Rewards are immediately claimable with no vesting period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/launch" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Create Index</div>
              <div className="text-sm text-slate-400">Start earning as INDEX Builder</div>
            </Link>
            <Link href="/trading" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Start Trading</div>
              <div className="text-sm text-slate-400">Join DEX Catalyst program</div>
            </Link>
            <Link href="/docs/tokenomics" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Token Economics</div>
              <div className="text-sm text-slate-400">Learn about $HIIN & $HIDE</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
