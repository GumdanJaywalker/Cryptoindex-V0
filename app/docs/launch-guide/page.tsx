import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Rocket, TrendingUp, Users, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

export default function LaunchGuidePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <Link
            href="/docs"
            className="text-brand hover:underline mb-4 inline-block"
          >
            ← Back to Documentation
          </Link>
          <h1 className="text-4xl font-bold mb-4">Layer-3 Launch Process</h1>
          <p className="text-lg text-slate-400">
            Complete guide to launching your index from Layer-3 to Layer-2 graduation
          </p>
        </div>

        {/* Launch Process Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Launch Phases</h2>
          <div className="space-y-4">
            {/* Phase 1 */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-brand font-bold text-lg">1</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">Bonding Curve Phase</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand">Layer-3</span>
                    </div>
                    <p className="text-slate-400 mb-3">
                      Initial price discovery and community building phase where early supporters can participate
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <div className="text-slate-500">Target Raise</div>
                        <div className="font-semibold">$50,000 HYPE</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Duration</div>
                        <div className="font-semibold">7-30 days</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Price Model</div>
                        <div className="font-semibold">Linear Bonding Curve</div>
                      </div>
                    </div>
                    <Link
                      href="/docs/launch-guide/bonding-curve"
                      className="inline-flex items-center gap-2 text-brand hover:underline text-sm"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-brand font-bold text-lg">2</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">Funding Round</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand/20 text-brand">Layer-3</span>
                    </div>
                    <p className="text-slate-400 mb-3">
                      Strategic funding phase to secure additional capital and institutional support
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <div className="text-slate-500">Target Raise</div>
                        <div className="font-semibold">$200,000 HYPE</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Duration</div>
                        <div className="font-semibold">3-7 days</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Price Model</div>
                        <div className="font-semibold">Fixed Price</div>
                      </div>
                    </div>
                    <Link
                      href="/docs/launch-guide/funding-round"
                      className="inline-flex items-center gap-2 text-brand hover:underline text-sm"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-brand font-bold text-lg">3</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">LP Round</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Layer-2</span>
                    </div>
                    <p className="text-slate-400 mb-3">
                      Liquidity provision phase where the index graduates to Layer-2 with full DEX trading
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <div className="text-slate-500">Initial Liquidity</div>
                        <div className="font-semibold">$250,000 HYPE</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Duration</div>
                        <div className="font-semibold">Ongoing</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-slate-500">Trading</div>
                        <div className="font-semibold">Full DEX Access</div>
                      </div>
                    </div>
                    <Link
                      href="/docs/launch-guide/lp-round"
                      className="inline-flex items-center gap-2 text-brand hover:underline text-sm"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Graduation Requirements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Layer-2 Graduation Requirements</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <p className="text-slate-400 mb-6">
                To successfully graduate from Layer-3 to Layer-2, your index must meet all of the following criteria:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Total Raised</div>
                    <div className="text-sm text-slate-400">Minimum $250,000 HYPE combined from all phases</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Unique Holders</div>
                    <div className="text-sm text-slate-400">At least 100 unique token holders</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Trading Volume</div>
                    <div className="text-sm text-slate-400">$100,000+ 7-day trading volume post-launch</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Community Engagement</div>
                    <div className="text-sm text-slate-400">Active governance participation (50+ voters)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">NAV/Price Stability</div>
                    <div className="text-sm text-slate-400">Price within ±20% of NAV for 7 consecutive days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Circuit Breaker Test</div>
                    <div className="text-sm text-slate-400">Pass volatility stress test (no halts for 48h)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Visualization */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Typical Launch Timeline</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-400 w-32">Day 1-7</div>
                  <div className="flex-1 h-2 bg-brand/20 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand w-full"></div>
                  </div>
                  <div className="text-sm text-slate-400 w-48">Bonding Curve Active</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-400 w-32">Day 8-14</div>
                  <div className="flex-1 h-2 bg-brand/20 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand w-2/3"></div>
                  </div>
                  <div className="text-sm text-slate-400 w-48">Funding Round</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-400 w-32">Day 15-21</div>
                  <div className="flex-1 h-2 bg-brand/20 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-400 w-1/2"></div>
                  </div>
                  <div className="text-sm text-slate-400 w-48">LP Round & Graduation</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-400 w-32">Day 22+</div>
                  <div className="flex-1 h-2 bg-green-400/20 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-400 w-full"></div>
                  </div>
                  <div className="text-sm text-slate-400 w-48">Layer-2 Trading Live</div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-400">
                    <span className="font-medium text-white">Note:</span> Timelines may vary based on market conditions and community engagement. Some indices may take longer to meet graduation requirements.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Launch on HyperIndex?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">Fair Launch</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Transparent bonding curve ensures fair price discovery and prevents rug pulls
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">Community First</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Early supporters get the best prices and governance rights from day one
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">Proven Path</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Structured phases reduce risk and ensure sustainable growth to Layer-2
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Phase Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/launch-guide/bonding-curve"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Bonding Curve Phase</div>
              <div className="text-sm text-slate-400">Initial price discovery and community building</div>
            </Link>
            <Link
              href="/docs/launch-guide/funding-round"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Funding Round</div>
              <div className="text-sm text-slate-400">Strategic capital raise and institutional support</div>
            </Link>
            <Link
              href="/docs/launch-guide/lp-round"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">LP Round & Graduation</div>
              <div className="text-sm text-slate-400">Liquidity provision and Layer-2 launch</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
