'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/wallet'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, FileText, BarChart3, Settings, ExternalLink } from 'lucide-react'

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
          
          {/* More 드롭다운 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400 hover:bg-slate-800">
                More
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 min-w-[12rem] overflow-hidden rounded-md border border-slate-700 bg-slate-900 p-1 text-white shadow-md z-50"
              sideOffset={4}
            >
              <DropdownMenuItem className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <FileText className="w-4 h-4 mr-3 text-blue-400" />
                <span>API Docs</span>
                <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
              </DropdownMenuItem>
              <DropdownMenuItem className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <BarChart3 className="w-4 h-4 mr-3 text-green-400" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Settings className="w-4 h-4 mr-3 text-slate-400" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Wallet Connect */}
        <WalletConnectButton />
      </div>
    </header>
  )
}