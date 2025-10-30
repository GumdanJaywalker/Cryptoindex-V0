import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"
import { Book, Coins, Rocket, Gift, FileText } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-slate-400">
            Learn about HyperIndex tokenomics, launch process, and reward programs
          </p>
        </div>

        {/* Documentation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Tokenomics Card */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-brand" />
                </div>
                <CardTitle>Tokenomics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/docs/tokenomics"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Dual Token Overview
              </Link>
              <Link
                href="/docs/tokenomics/hiin"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → $HIIN Token (Index)
              </Link>
              <Link
                href="/docs/tokenomics/hide"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → $HIDE Token (DEX)
              </Link>
              <p className="text-sm text-slate-500 mt-4">
                FDV: $HIIN $40M | $HIDE $20M
              </p>
            </CardContent>
          </Card>

          {/* Launch Guide Card */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-brand" />
                </div>
                <CardTitle>Launch Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/docs/launch-guide"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Layer-3 Launch Process
              </Link>
              <Link
                href="/docs/launch-guide/bonding-curve"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Bonding Curve Phase
              </Link>
              <Link
                href="/docs/launch-guide/funding-round"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Funding Round
              </Link>
              <Link
                href="/docs/launch-guide/lp-round"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → LP Round
              </Link>
              <p className="text-sm text-slate-500 mt-4">
                From idea to Layer-2 graduation
              </p>
            </CardContent>
          </Card>

          {/* Rewards Program Card */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-brand" />
                </div>
                <CardTitle>Rewards Program</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/docs/rewards"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Rewards Overview
              </Link>
              <Link
                href="/docs/rewards/index-builder"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → INDEX Builder Program
              </Link>
              <Link
                href="/docs/rewards/dex-catalyst"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → DEX Catalyst Program
              </Link>
              <p className="text-sm text-slate-500 mt-4">
                Earn $HIIN and $HIDE tokens
              </p>
            </CardContent>
          </Card>

          {/* TGE Strategy Card */}
          <Card className="bg-slate-900/50 border-slate-800 hover:border-brand transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand" />
                </div>
                <CardTitle>TGE Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/docs/tge-strategy"
                className="block text-slate-300 hover:text-brand transition-colors"
              >
                → Full TGE Document
              </Link>
              <p className="text-sm text-slate-400 mt-4">
                Comprehensive token generation event strategy for partners and team members
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Internal & Partners
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Section */}
        <div className="border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/launch"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Create Index</div>
              <div className="text-sm text-slate-400">Launch your own index</div>
            </Link>
            <Link
              href="/portfolio"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">My Portfolio</div>
              <div className="text-sm text-slate-400">Track your investments</div>
            </Link>
            <Link
              href="/governance"
              className="block p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-brand transition-colors"
            >
              <div className="font-medium text-white mb-1">Governance</div>
              <div className="text-sm text-slate-400">Vote on proposals</div>
            </Link>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 p-6 rounded-lg bg-slate-900/30 border border-slate-800">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <p className="text-slate-400 mb-4">
            Can't find what you're looking for? Join our community or reach out to our support team.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-brand hover:underline"
            >
              Discord
            </Link>
            <Link
              href="#"
              className="text-brand hover:underline"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-brand hover:underline"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
