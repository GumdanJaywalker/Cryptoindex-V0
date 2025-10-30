import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Coins, TrendingUp, Users, Vote, Gift, Lock } from "lucide-react"

export default function HiinTokenPage() {
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
          <h1 className="text-4xl font-bold mb-4">$HIIN - Index Token</h1>
          <p className="text-lg text-slate-400">
            The governance and utility token powering the HyperIndex ecosystem
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
                <div className="text-2xl font-bold text-brand">$40M</div>
                <div className="text-xs text-slate-500 mt-1">At TGE</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-1">Initial Price</div>
                <div className="text-2xl font-bold text-brand">$0.0004</div>
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
                    <Coins className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Index Creation & Management</h3>
                    <p className="text-sm text-slate-400">
                      Pay index creation fees, rebalancing costs, and ongoing management fees in $HIIN
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Creation fee: 100 $HIIN</div>
                      <div>• Rebalancing fee: 10 $HIIN per operation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Vote className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Governance Voting</h3>
                    <p className="text-sm text-slate-400">
                      Stake $HIIN to gain voting power in protocol governance and index rebalancing battles
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• 1 $HIIN staked = 1 vote</div>
                      <div>• Minimum stake: 1,000 $HIIN to vote</div>
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
                    <h3 className="font-semibold mb-2">Staking Rewards</h3>
                    <p className="text-sm text-slate-400">
                      Earn staking rewards from protocol revenue and index performance fees
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Base APY: 8-12%</div>
                      <div>• Performance boost: Up to 20% additional</div>
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
                    <h3 className="font-semibold mb-2">INDEX Builder Rewards</h3>
                    <p className="text-sm text-slate-400">
                      Earn $HIIN rewards by creating successful indices that attract trading volume
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <div>• Creator fee: 0.02% in $HIIN</div>
                      <div>• Performance bonus pool available</div>
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
                      <div className="font-medium">Community Rewards</div>
                      <div className="text-xs text-slate-400">Long-term ecosystem growth</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand">40%</div>
                    <div className="text-xs text-slate-500">40B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div>
                      <div className="font-medium">Team & Advisors</div>
                      <div className="text-xs text-slate-400">12-month cliff, 36-month linear</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">20%</div>
                    <div className="text-xs text-slate-500">20B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <div>
                      <div className="font-medium">Protocol Treasury</div>
                      <div className="text-xs text-slate-400">Strategic reserves & development</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">20%</div>
                    <div className="text-xs text-slate-500">20B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div>
                      <div className="font-medium">Early Investors</div>
                      <div className="text-xs text-slate-400">6-month cliff, 24-month linear</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">15%</div>
                    <div className="text-xs text-slate-500">15B tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div>
                      <div className="font-medium">Liquidity Provision</div>
                      <div className="text-xs text-slate-400">Initial DEX liquidity</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">5%</div>
                    <div className="text-xs text-slate-500">5B tokens</div>
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
                  <CardTitle>Community Rewards</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Unlock Schedule</div>
                    <div className="font-medium">Linear unlock over 24 months</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Monthly Release</div>
                    <div className="font-medium">~1.67B tokens/month</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Purpose</div>
                    <div className="font-medium">INDEX Builder & staking rewards</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand" />
                  <CardTitle>Team & Advisors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Unlock Schedule</div>
                    <div className="font-medium">12-month cliff + 36-month linear</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Monthly Release (after cliff)</div>
                    <div className="font-medium">~556M tokens/month</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Alignment</div>
                    <div className="font-medium">Long-term protocol success</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Staking Mechanics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Staking Mechanics</h2>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand" />
                    Staking Tiers
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="font-medium mb-1">Bronze (1K - 10K $HIIN)</div>
                      <div className="text-slate-400">Base rewards + voting rights</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="font-medium mb-1">Silver (10K - 100K $HIIN)</div>
                      <div className="text-slate-400">1.2x rewards + priority features</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="font-medium mb-1">Gold (100K - 1M $HIIN)</div>
                      <div className="text-slate-400">1.5x rewards + governance boost</div>
                    </div>
                    <div className="p-3 rounded-lg bg-brand/10 border border-brand/30">
                      <div className="font-medium mb-1 text-brand">Diamond (1M+ $HIIN)</div>
                      <div className="text-slate-400">2x rewards + protocol influence</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand" />
                    Reward Sources
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Protocol Fees</div>
                      <div className="text-slate-400">50% of index creation & management fees distributed to stakers</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Performance Fees</div>
                      <div className="text-slate-400">20% of index outperformance shared with $HIIN stakers</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Emission Schedule</div>
                      <div className="text-slate-400">Decreasing emissions over 24 months to maintain sustainability</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Lock Bonuses</div>
                      <div className="text-slate-400">Additional rewards for 3, 6, or 12-month lock periods</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/tokenomics/hide"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">$HIDE Token</div>
              <div className="text-sm text-slate-400">Learn about the DEX token</div>
            </Link>
            <Link
              href="/docs/rewards/index-builder"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">INDEX Builder Program</div>
              <div className="text-sm text-slate-400">Earn $HIIN by creating indices</div>
            </Link>
            <Link
              href="/docs/launch-guide"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Launch Guide</div>
              <div className="text-sm text-slate-400">Layer-3 to Layer-2 graduation</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
