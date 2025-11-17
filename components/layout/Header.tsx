'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Settings } from 'lucide-react'
import { NotificationsButton } from '@/components/notifications/NotificationsButton'
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton'
import HeaderNav from './HeaderNav'

export function Header() {
  const logoSrc = '/10.svg'

  useEffect(() => {
    document.documentElement.classList.add('density-compact')
    return () => {
      document.documentElement.classList.remove('density-compact')
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101A1D]">
      <div className="relative mx-auto flex w-full max-w-[100vw] flex-row items-center px-6 py-3">
        {/* Left Section - Logo */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="HyperIndex"
              className="h-13 w-auto object-contain max-w-[150px]"
            />
          </Link>
        </div>

        {/* Center Section - Navigation (absolute positioned for perfect center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HeaderNav />
        </div>

        {/* Right Section - Utilities */}
        <div className="flex flex-row items-center gap-2.5 flex-1 justify-end">
          <NotificationsButton />
          <Link
            href="/settings"
            aria-label="Settings"
            className="glass-input inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-slate-300"
            title="Settings"
          >
            <Settings className="w-[18px] h-[18px]" />
          </Link>
          <div className="glass-input rounded-full px-1 pointer-events-none">
            <div className="pointer-events-auto">
              <WalletConnectButton size="lg" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
