import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { TrendingUp, DollarSign, Users, Gift } from "lucide-react"

export default function IndexBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs/rewards" className="text-brand hover:underline mb-4 inline-block">← Back to Rewards</Link>
          <h1 className="text-4xl font-bold mb-4">INDEX Builder Program</h1>
          <p className="text-lg text-slate-400">Earn $HIIN tokens by creating successful indices</p>
        </div>

        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <DollarSign className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Creator Fee</div>
              <div className="text-xl font-bold text-brand">0.02%</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <TrendingUp className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Performance Bonus</div>
              <div className="text-xl font-bold">Up to 20%</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <Users className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Distribution</div>
              <div className="text-xl font-bold">Weekly</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <Gift className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Token</div>
              <div className="text-xl font-bold text-brand">$HIIN</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Reward Structure</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Base Creator Fee</h3>
                  <p className="text-sm text-slate-400">0.02% of every trade on your index, paid in $HIIN tokens</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Volume Multipliers</h3>
                  <p className="text-sm text-slate-400">1.2x-2x bonus based on 30-day trading volume</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Performance Share</h3>
                  <p className="text-sm text-slate-400">20% share of performance fees when index outperforms NAV</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Governance Bonus</h3>
                  <p className="text-sm text-slate-400">+10% for indices with active community governance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/launch" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Create Your Index</div>
              <div className="text-sm text-slate-400">Start earning $HIIN today</div>
            </Link>
            <Link href="/docs/launch-guide" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Launch Guide</div>
              <div className="text-sm text-slate-400">Learn the launch process</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
