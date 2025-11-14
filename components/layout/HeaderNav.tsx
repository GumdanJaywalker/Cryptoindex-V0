'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function HeaderNav() {
  const pathname = usePathname()

  // All navigation items (full demo version)
  const items = [
    { label: 'Trade', href: '/trade' },
    { label: 'Discover', href: '/discover' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Vote', href: '/vote' },
    { label: 'Launch', href: '/launch' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Referrals', href: '/referrals' },
  ]

  // Calculate active index based on current pathname
  const activeIndex = useMemo(() => {
    // No active state on landing page
    if (pathname === '/') return -1

    if (pathname === '/trade' || pathname?.startsWith('/trade')) return 0
    if (pathname === '/discover' || pathname?.startsWith('/discover')) return 1
    if (pathname === '/leaderboard' || pathname?.startsWith('/leaderboard')) return 2
    if (pathname === '/vote' || pathname?.startsWith('/vote')) return 3
    if (pathname === '/launch' || pathname?.startsWith('/launch')) return 4
    if (pathname === '/portfolio' || pathname?.startsWith('/portfolio')) return 5
    if (pathname === '/referrals' || pathname?.startsWith('/referrals')) return 6
    return -1 // No active state by default
  }, [pathname])

  const ITEM_PX = 98 // w-28 in density-compact (7rem * 14px = 98px)

  return (
    <div
      className="glass-nav inline-flex items-center rounded-full p-1"
      style={{ width: ITEM_PX * items.length + 8 }}
    >
      {/* Active thumb (sliding indicator) - hidden on landing page */}
      {activeIndex >= 0 && (
        <span
          className="absolute top-1 bottom-1 left-1 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-transform duration-200"
          style={{
            width: 94, // Slightly smaller than item for padding
            transform: `translateX(${activeIndex * ITEM_PX}px)`,
            backgroundColor: 'hsl(var(--brand-primary))', // Brand mint
          }}
          aria-hidden="true"
        />
      )}

      {/* Navigation items */}
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            'relative z-10 w-28 flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ' +
            (i === activeIndex
              ? 'text-slate-900' // Dark text on brand mint background
              : 'text-slate-300 hover:text-white hover:bg-white/10 hover:-translate-y-0.5')
          }
        >
          <span className="transform -translate-x-0.5">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
