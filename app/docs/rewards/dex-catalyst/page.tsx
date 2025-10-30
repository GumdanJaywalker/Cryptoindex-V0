import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Zap, TrendingUp, Users, Gift } from "lucide-react"

export default function DexCatalystPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs/rewards" className="text-brand hover:underline mb-4 inline-block">← Back to Rewards</Link>
          <h1 className="text-4xl font-bold mb-4">DEX Catalyst Program</h1>
          <p className="text-lg text-slate-400">Earn $HIDE tokens through active trading</p>
        </div>

        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <Zap className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Base Rewards</div>
              <div className="text-xl font-bold text-brand">0.01%</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <TrendingUp className="w-5 h-5 text-brand mb-2" />
              <div className="text-sm text-slate-400">Max Multiplier</div>
              <div className="text-xl font-bold">2x</div>
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
              <div className="text-xl font-bold text-brand">$HIDE</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trading Tiers</h2>
          <div className="space-y-3">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Bronze Trader</div>
                    <div className="text-sm text-slate-400">$10K - $50K monthly volume</div>
                  </div>
                  <div className="text-brand font-bold">1x</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Silver Trader</div>
                    <div className="text-sm text-slate-400">$50K - $250K monthly volume</div>
                  </div>
                  <div className="text-brand font-bold">1.3x</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Gold Trader</div>
                    <div className="text-sm text-slate-400">$250K - $1M monthly volume</div>
                  </div>
                  <div className="text-brand font-bold">1.6x</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-brand/30 border-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-brand">Diamond Trader</div>
                    <div className="text-sm text-slate-400">$1M+ monthly volume</div>
                  </div>
                  <div className="text-brand font-bold">2x</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bonus Multipliers</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">Consistency Bonus</span>
                <span className="font-semibold text-brand">+20%</span>
              </div>
              <div className="text-xs text-slate-500 ml-3">4+ consecutive weeks of activity</div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">Maker Bonus</span>
                <span className="font-semibold text-brand">+30%</span>
              </div>
              <div className="text-xs text-slate-500 ml-3">For limit orders that add liquidity</div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">Referral Boost</span>
                <span className="font-semibold text-brand">+10%</span>
              </div>
              <div className="text-xs text-slate-500 ml-3">Of your referred users' rewards</div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/trading" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Start Trading</div>
              <div className="text-sm text-slate-400">Join DEX Catalyst today</div>
            </Link>
            <Link href="/docs/tokenomics/hide" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">$HIDE Token</div>
              <div className="text-sm text-slate-400">Learn about DEX token</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
