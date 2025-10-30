import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { TrendingUp, Users, Clock, Shield, DollarSign, AlertCircle } from "lucide-react"

export default function BondingCurvePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/docs/launch-guide" className="text-brand hover:underline mb-4 inline-block">
            ← Back to Launch Guide
          </Link>
          <h1 className="text-4xl font-bold mb-4">Bonding Curve Phase</h1>
          <p className="text-lg text-slate-400">
            Initial price discovery and community building for your index
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Phase Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Target Raise</div>
                <div className="text-2xl font-bold text-brand">$50,000 HYPE</div>
                <div className="text-xs text-slate-500 mt-1">Minimum to proceed</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Duration</div>
                <div className="text-2xl font-bold text-brand">7-30 days</div>
                <div className="text-xs text-slate-500 mt-1">Flexible timeline</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Price Model</div>
                <div className="text-2xl font-bold text-brand">Linear Curve</div>
                <div className="text-xs text-slate-500 mt-1">Fair price discovery</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Bonding Curves Work</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Initial Price Set</h3>
                    <p className="text-sm text-slate-400">Creator sets starting price (e.g., 0.0001 HYPE per token)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Price Increases Linearly</h3>
                    <p className="text-sm text-slate-400">Each purchase incrementally increases the price for the next buyer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Automatic Liquidity</h3>
                    <p className="text-sm text-slate-400">All HYPE raised is locked in the bonding curve contract</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 text-brand font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Target Achievement</h3>
                    <p className="text-sm text-slate-400">Once $50K raised, automatically progresses to Funding Round</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Rug Pull Protection</h3>
                    <p className="text-sm text-slate-400">
                      Liquidity locked in smart contract, impossible for creators to withdraw prematurely
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Fair Price Discovery</h3>
                    <p className="text-sm text-slate-400">
                      Linear curve ensures transparent pricing with no sudden jumps or manipulation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Early Supporter Rewards</h3>
                    <p className="text-sm text-slate-400">
                      First buyers get the lowest prices and highest potential upside
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Immediate Liquidity</h3>
                    <p className="text-sm text-slate-400">
                      Buyers can sell back to the curve at any time (with small exit fee)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-12">
          <Card className="bg-slate-900/50 border-yellow-500/20 border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-yellow-400">Important Considerations</h3>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• <span className="font-medium text-white">Exit Fee:</span> 2% fee on sells during bonding curve phase</li>
                    <li>• <span className="font-medium text-white">No Refunds:</span> Once target is hit, funds are locked for launch</li>
                    <li>• <span className="font-medium text-white">Timeline:</span> Curve closes after 30 days regardless of target</li>
                    <li>• <span className="font-medium text-white">Minimum Buy:</span> 10 HYPE minimum purchase to prevent spam</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/launch-guide/funding-round" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Funding Round →</div>
              <div className="text-sm text-slate-400">Strategic capital raise phase</div>
            </Link>
            <Link href="/launch" className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors">
              <div className="font-medium text-white mb-1">Launch Your Index</div>
              <div className="text-sm text-slate-400">Start your bonding curve today</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
