'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
// Temporarily disable wallet UI to stabilize build
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { NotificationsButton } from '@/components/notifications/NotificationsButton'
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton'
// Logo served from public. Place your official backgroundless text logo at /public/logos/hyperindex-text.svg

const navigation = [
  { name: 'Trading', href: '/trading' },
  { name: 'Traders', href: '/traders' },
  { name: 'Governance', href: '/governance' },
  { name: 'Create', href: '/create' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Referrals', href: '/referrals' },
]

export function Header() {
  const pathname = usePathname()
  // Prefer the official static logo; avoid unnecessary fallbacks to prevent confusion
  const logoSrc = '/hyperindex-text.svg'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-[45px] w-[180px] overflow-hidden flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="HyperIndex"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
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

        {/* Notifications + Settings + Wallet Connect */}
        <div className="flex items-center gap-2">
          <NotificationsButton />
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
            title="Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </Link>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}
