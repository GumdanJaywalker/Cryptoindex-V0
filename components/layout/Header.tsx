'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/wallet'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Trading', href: '/trading' },
  { name: 'Trending', href: '/trending' },
  { name: 'Governance', href: '/governance' },
  { name: 'Portfolio', href: '/portfolio' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="flex h-14 items-center px-6">
        {/* Minimal Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="h-7 w-7 rounded-lg bg-brand transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <div className="absolute inset-0 h-7 w-7 rounded-lg bg-brand opacity-50 blur-sm animate-pulse" />
          </div>
          <span className="text-lg font-bold text-white hidden sm:block">HyperIndex</span>
          <span className="text-lg font-bold text-white block sm:hidden">HI</span>
        </Link>

        {/* Centered Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-brand",
                pathname === item.href
                  ? "text-brand"
                  : "text-slate-300"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - Wallet Only */}
        <div className="flex items-center">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}