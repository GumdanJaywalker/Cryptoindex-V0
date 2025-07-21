'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/wallet'

const navigation = [
  { name: 'Trading', href: '/trading' },
  { name: 'Trending', href: '/trending' },
  { name: 'Governance', href: '/governance' },
  { name: 'Vaults', href: '/vaults' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Bridge', href: '/bridge' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-400 to-purple-500" />
          <span className="text-xl font-bold text-white">CryptoIndex</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === item.href
                  ? 'text-blue-400'
                  : 'text-slate-300'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Wallet Connect */}
        <WalletConnectButton />
      </div>
    </header>
  )
}