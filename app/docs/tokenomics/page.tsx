import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Zap, Shield } from "lucide-react"

export default function TokenomicsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Dual Token Tokenomics</h1>
          <p className="text-lg text-slate-400">
            HyperIndex operates on a dual-token model designed to align incentives across the ecosystem
          </p>
        </div>

        {/* Overview Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Token Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HIIN Token Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-brand">$HIIN - Index Token</CardTitle>
                <p className="text-sm text-slate-400">Powers the Index ecosystem</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Supply</span>
                    <span className="font-semibold">100,000,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">FDV</span>
                    <span className="font-semibold text-brand">$40M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial Price</span>
                    <span className="font-semibold">$0.0004</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-semibold mb-2">Primary Uses:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Index creation fees</li>
                    <li>• Index trading fees</li>
                    <li>• Governance voting power</li>
                    <li>• Staking rewards</li>
                  </ul>
                </div>
                <Link
                  href="/docs/tokenomics/hiin"
                  className="inline-flex items-center gap-2 text-brand hover:underline mt-4"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* HIDE Token Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-brand">$HIDE - DEX Token</CardTitle>
                <p className="text-sm text-slate-400">Powers the trading ecosystem</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Supply</span>
                    <span className="font-semibold">100,000,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">FDV</span>
                    <span className="font-semibold text-brand">$20M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial Price</span>
                    <span className="font-semibold">$0.0002</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-semibold mb-2">Primary Uses:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• DEX trading fees</li>
                    <li>• Liquidity provision rewards</li>
                    <li>• Trading volume incentives</li>
                    <li>• Protocol revenue sharing</li>
                  </ul>
                </div>
                <Link
                  href="/docs/tokenomics/hide"
                  className="inline-flex items-center gap-2 text-brand hover:underline mt-4"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Dual Token? */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Dual Token Model?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Aligned Incentives</h3>
                    <p className="text-sm text-slate-400">
                      Separate tokens for index creation and trading activities ensure that each user type is properly incentivized
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Community Segmentation</h3>
                    <p className="text-sm text-slate-400">
                      Index builders and active traders have different needs - dual tokens serve both communities effectively
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Revenue Optimization</h3>
                    <p className="text-sm text-slate-400">
                      Different fee structures for index operations vs trading optimize protocol revenue while staying competitive
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Risk Diversification</h3>
                    <p className="text-sm text-slate-400">
                      Dual tokens provide resilience - if one market faces pressure, the other can maintain stability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Token Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HIIN Distribution */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle>$HIIN Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Community Rewards</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Team & Advisors</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Protocol Treasury</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Early Investors</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Liquidity Provision</span>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HIDE Distribution */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle>$HIDE Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Trading Incentives</span>
                    <span className="font-semibold">50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Liquidity Mining</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Team & Advisors</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Protocol Treasury</span>
                    <span className="font-semibold">7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Early Investors</span>
                    <span className="font-semibold">3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vesting Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Vesting Schedule</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 text-brand">$HIIN Vesting</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Community Rewards</div>
                      <div className="text-slate-400">Linear unlock over 24 months</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Team & Advisors</div>
                      <div className="text-slate-400">12-month cliff, 36-month linear</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Early Investors</div>
                      <div className="text-slate-400">6-month cliff, 24-month linear</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-brand">$HIDE Vesting</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Trading Incentives</div>
                      <div className="text-slate-400">Performance-based unlock over 18 months</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Team & Advisors</div>
                      <div className="text-slate-400">12-month cliff, 24-month linear</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Liquidity Mining</div>
                      <div className="text-slate-400">Immediate unlock with emissions control</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/tokenomics/hiin"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">$HIIN Token Details</div>
              <div className="text-sm text-slate-400">Deep dive into the Index token economics</div>
            </Link>
            <Link
              href="/docs/tokenomics/hide"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">$HIDE Token Details</div>
              <div className="text-sm text-slate-400">Deep dive into the DEX token economics</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
