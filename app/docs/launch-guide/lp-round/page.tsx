import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Droplet, TrendingUp, Zap, CheckCircle2, AlertCircle } from "lucide-react"

export default function LPRoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs/launch-guide" className="text-brand hover:underline mb-4 inline-block">← Back to Launch Guide</Link>
          <h1 className="text-4xl font-bold mb-4">LP Round & Layer-2 Graduation</h1>
          <p className="text-lg text-slate-400">Final phase - launching full DEX trading on Layer-2</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Graduation Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <Droplet className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Initial Liquidity</div>
                <div className="text-xl font-bold text-brand">$250K HYPE</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <TrendingUp className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Layer Status</div>
                <div className="text-xl font-bold text-green-400">Layer-2</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <Zap className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Trading</div>
                <div className="text-xl font-bold">Full DEX</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Graduation Process</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Requirements Verified</h3>
                  <p className="text-sm text-slate-400">Protocol confirms all graduation criteria met</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Liquidity Pool Created</h3>
                  <p className="text-sm text-slate-400">$250K initial liquidity deployed to HyperIndex DEX</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Trading Enabled</h3>
                  <p className="text-sm text-slate-400">Full buy/sell trading with leverage up to 5x</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Governance Activated</h3>
                  <p className="text-sm text-slate-400">Community can vote on rebalancing and parameter changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Post-Graduation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand" />
                  Full DEX Trading
                </h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Market and limit orders</li>
                  <li>• Leverage trading (up to 5x)</li>
                  <li>• Advanced order types</li>
                  <li>• Real-time price feeds</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-brand" />
                  Liquidity Rewards
                </h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Earn $HIDE tokens</li>
                  <li>• 50% of trading fees</li>
                  <li>• LP boost multipliers</li>
                  <li>• No impermanent loss protection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <Card className="bg-slate-900/50 border-yellow-500/20 border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-yellow-400">Circuit Breakers Active</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Layer-2 indices have automatic circuit breakers to protect against extreme volatility:
                  </p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Trading halts if price moves ±30% in 1 hour</li>
                    <li>• NAV/Price gap exceeds 50%</li>
                    <li>• Cooling period: 15 minutes before resuming</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/trading" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Start Trading</div>
              <div className="text-sm text-slate-400">Trade Layer-2 indices</div>
            </Link>
            <Link href="/docs/rewards" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Earn Rewards</div>
              <div className="text-sm text-slate-400">INDEX Builder & DEX Catalyst</div>
            </Link>
            <Link href="/governance" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Governance</div>
              <div className="text-sm text-slate-400">Vote on proposals</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
