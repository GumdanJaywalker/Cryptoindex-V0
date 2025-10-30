import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { DollarSign, Users, Clock, Target } from "lucide-react"

export default function FundingRoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs/launch-guide" className="text-brand hover:underline mb-4 inline-block">← Back to Launch Guide</Link>
          <h1 className="text-4xl font-bold mb-4">Funding Round</h1>
          <p className="text-lg text-slate-400">Strategic capital raise to accelerate index growth</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Phase Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <DollarSign className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Target Raise</div>
                <div className="text-xl font-bold text-brand">$200K HYPE</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <Clock className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Duration</div>
                <div className="text-xl font-bold">3-7 days</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <Target className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Price</div>
                <div className="text-xl font-bold">Fixed</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <Users className="w-5 h-5 text-brand mb-2" />
                <div className="text-sm text-slate-400">Min Ticket</div>
                <div className="text-xl font-bold">1,000 HYPE</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Fixed Price Set</h3>
                  <p className="text-sm text-slate-400">Price determined by final bonding curve price + 20% premium</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Strategic Allocation</h3>
                  <p className="text-sm text-slate-400">Limited to institutional investors and qualified participants</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Vesting Period</h3>
                  <p className="text-sm text-slate-400">30-day lockup with linear vesting over 90 days</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Graduation Prep</h3>
                  <p className="text-sm text-slate-400">Proceeds used to prepare for Layer-2 liquidity pool</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/launch-guide/lp-round" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">LP Round & Graduation →</div>
              <div className="text-sm text-slate-400">Final phase to Layer-2</div>
            </Link>
            <Link href="/docs/tokenomics" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Token Economics</div>
              <div className="text-sm text-slate-400">Understanding $HIIN and $HIDE</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
