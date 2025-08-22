'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  TrendingUp, 
  Briefcase, 
  Vote,
  PlusCircle,
  BarChart3,
  Settings,
  User,
  Wallet
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  isActive?: boolean
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trading', label: 'Trade', icon: TrendingUp, badge: 'HOT' },
  { href: '/trending', label: 'Trending', icon: BarChart3 },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/governance', label: 'Vote', icon: Vote }
]

export function MobileNav() {
  const pathname = usePathname()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <motion.nav
      animate={{
        y: isVisible ? 0 : '100%',
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      {/* Background with blur */}
      <div className="bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px]",
                    "transition-all duration-200",
                    isActive 
                      ? "text-brand" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand/10 border border-brand/20 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div className="relative">
                    <item.icon className={cn(
                      "w-6 h-6 transition-transform duration-200",
                      isActive && "scale-110"
                    )} />
                    
                    {/* Badge */}
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge 
                          className="text-xs px-1 py-0 h-4 bg-orange-600 text-white border-0"
                        >
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "text-brand scale-105" : "text-slate-500"
                  )}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

// Mobile Header with condensed controls
export function MobileHeader() {
  const [isWalletOpen, setIsWalletOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">HI</span>
            </motion.div>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Wallet Balance (Condensed) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWalletOpen(!isWalletOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-white">$2.4K</span>
            </motion.button>

            {/* Profile/Settings */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <User className="w-4 h-4 text-slate-300" />
            </motion.button>
          </div>
        </div>

        {/* Wallet Dropdown */}
        <AnimatePresence>
          {isWalletOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-4 right-4 mt-1 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Balance</span>
                  <span className="text-lg font-bold text-white">$2,456.78</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Available</span>
                  <span className="text-sm text-green-400">$1,234.56</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">In Positions</span>
                  <span className="text-sm text-orange-400">$1,222.22</span>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <button className="w-full bg-brand text-black font-semibold py-2 rounded-lg text-sm">
                    Deposit Funds
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// Mobile-specific status bar with key metrics
export function MobileStatusBar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className="fixed top-14 left-0 right-0 z-30 md:hidden"
      animate={{
        height: isExpanded ? 'auto' : '40px'
      }}
    >
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 overflow-hidden">
        {/* Compact view */}
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-4 py-2 cursor-pointer"
        >
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300">Market Open</span>
            </div>
            <div className="text-slate-400">Vol: $84.2M</div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-slate-400"
          >
            <PlusCircle className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">24h Volume</div>
                  <div className="text-white font-semibold">$84.2M</div>
                </div>
                <div>
                  <div className="text-slate-400">Active Traders</div>
                  <div className="text-white font-semibold">12.4K</div>
                </div>
                <div>
                  <div className="text-slate-400">Total TVL</div>
                  <div className="text-white font-semibold">$2.1B</div>
                </div>
                <div>
                  <div className="text-slate-400">Top Gainer</div>
                  <div className="text-green-400 font-semibold">DOGE +24%</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default MobileNav