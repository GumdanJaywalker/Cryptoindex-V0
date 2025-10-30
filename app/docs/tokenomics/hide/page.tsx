import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Zap, TrendingUp, Users, Droplet, Gift, Lock } from "lucide-react"

export default function HideTokenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <Link
            href="/docs/tokenomics"
            className="text-brand hover:underline mb-4 inline-block"
          >
            ← Back to Tokenomics
          </Link>
          <h1 className="text-4xl font-bold mb-4">$HIDE - DEX Token</h1>
          <p className="text-lg text-slate-400">
            The trading and liquidity token powering the HyperIndex DEX ecosystem
          </p>
        </div>

        {/* Token Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Token Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Total Supply</div>
                <div className="text-2xl font-bold text-brand">100B</div>
                <div className="text-xs text-slate-500 mt-1">100,000,000,000 tokens</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Fully Diluted Value</div>
                <div className="text-2xl font-bold text-brand">$20M</div>
                <div className="text-xs text-slate-500 mt-1">At TGE</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Initial Price</div>
                <div className="text-2xl font-bold text-brand">$0.0002</div>
                <div className="text-xs text-slate-500 mt-1">Per token</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Utility Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Token Utility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">DEX Trading Fees</h3>
                    <p className="text-sm text-slate-400">
                      Pay trading fees in $HIDE to get discounted rates on the HyperIndex DEX
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Standard fee: 0.05% in HYPE</div>
                      <div>• Discounted fee: 0.03% in $HIDE</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Liquidity Mining</h3>
                    <p className="text-sm text-slate-400">
                      Provide liquidity to earn $HIDE rewards and share in trading fee revenue
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• LP rewards: 15-25% APY in $HIDE</div>
                      <div>• Fee sharing: 50% of trading fees</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Trading Volume Incentives</h3>
                    <p className="text-sm text-slate-400">
                      Active traders earn $HIDE rewards based on trading volume and consistency
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Volume tiers: Bronze → Diamond</div>
                      <div>• Bonus: Up to 2x base rewards</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Protocol Revenue Share</h3>
                    <p className="text-sm text-slate-400">
                      Stake $HIDE to receive a share of DEX trading revenue and protocol fees
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Revenue share: 30% to stakers</div>
                      <div>• Distribution: Weekly in HYPE</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Distribution Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Token Distribution</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand"></div>
                    <div>
                      <div className="font-medium">Trading Incentives</div>
                      <div className="text-xs text-slate-400">Performance-based distribution</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand">50%</div>
                    <div className="text-xs text-slate-500">50B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium">Liquidity Mining</div>
                      <div className="text-xs text-slate-400">LP rewards & fee sharing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">25%</div>
                    <div className="text-xs text-slate-500">25B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium">Team & Advisors</div>
                      <div className="text-xs text-slate-400">12-month cliff, 24-month linear</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">15%</div>
                    <div className="text-xs text-slate-500">15B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div>
                      <div className="font-medium">Protocol Treasury</div>
                      <div className="text-xs text-slate-400">Strategic reserves</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">7%</div>
                    <div className="text-xs text-slate-500">7B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div>
                      <div className="font-medium">Early Investors</div>
                      <div className="text-xs text-slate-400">6-month cliff, 18-month linear</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">3%</div>
                    <div className="text-xs text-slate-500">3B tokens</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vesting Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Vesting Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand" />
                  <CardTitle>Trading Incentives</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Unlock Schedule</div>
                    <div className="font-medium">Performance-based over 18 months</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Distribution Method</div>
                    <div className="font-medium">Weekly based on trading volume</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Purpose</div>
                    <div className="font-medium">DEX Catalyst program rewards</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand" />
                  <CardTitle>Liquidity Mining</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Unlock Schedule</div>
                    <div className="font-medium">Immediate with emissions control</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Emission Rate</div>
                    <div className="font-medium">Decreasing over 24 months</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Sustainability</div>
                    <div className="font-medium">Halving every 6 months</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* DEX Catalyst Program */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">DEX Catalyst Program</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand" />
                    Trading Tiers
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Bronze Trader</div>
                        <div className="text-xs text-slate-400">1x multiplier</div>
                      </div>
                      <div className="text-slate-400">$10K - $50K monthly volume</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Silver Trader</div>
                        <div className="text-xs text-slate-400">1.3x multiplier</div>
                      </div>
                      <div className="text-slate-400">$50K - $250K monthly volume</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Gold Trader</div>
                        <div className="text-xs text-slate-400">1.6x multiplier</div>
                      </div>
                      <div className="text-slate-400">$250K - $1M monthly volume</div>
                    </div>
                    <div className="p-3 rounded-lg bg-brand/10 border border-brand/30">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium text-brand">Diamond Trader</div>
                        <div className="text-xs text-slate-400">2x multiplier</div>
                      </div>
                      <div className="text-slate-400">$1M+ monthly volume</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-brand" />
                    Reward Structure
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Base Rewards</div>
                      <div className="text-slate-400">0.01% of trading volume in $HIDE weekly</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Consistency Bonus</div>
                      <div className="text-slate-400">+20% for 4+ consecutive weeks of activity</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Maker Bonus</div>
                      <div className="text-slate-400">+30% additional rewards for limit orders</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Referral Boost</div>
                      <div className="text-slate-400">10% of referred users' rewards</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Special Events</div>
                      <div className="text-slate-400">2-5x multipliers during trading competitions</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liquidity Provider Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Liquidity Provider Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">Trading Fees</h3>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Earn 50% of all trading fees from your liquidity pool
                </p>
                <div className="text-xs text-slate-500">
                  Distributed proportionally to LP token holders
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">$HIDE Emissions</h3>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Receive additional $HIDE rewards based on pool TVL
                </p>
                <div className="text-xs text-slate-500">
                  15-25% APY depending on pool utilization
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-brand" />
                  <h3 className="font-semibold">Boost Multipliers</h3>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Stake $HIDE to boost your LP rewards up to 2.5x
                </p>
                <div className="text-xs text-slate-500">
                  Requires $HIDE stake equal to your LP value
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/tokenomics/hiin"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">$HIIN Token</div>
              <div className="text-sm text-slate-400">Learn about the Index token</div>
            </Link>
            <Link
              href="/docs/rewards/dex-catalyst"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">DEX Catalyst Program</div>
              <div className="text-sm text-slate-400">Earn $HIDE by trading</div>
            </Link>
            <Link
              href="/trading"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Start Trading</div>
              <div className="text-sm text-slate-400">Trade indices on HyperIndex DEX</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
