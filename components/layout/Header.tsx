'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Temporarily disable wallet UI to stabilize build
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, FileText, BarChart3, Settings, ExternalLink, TrendingUp } from 'lucide-react'

const navigation = [
  { name: 'Trading', href: '/trading' },
  { name: 'Governance', href: '/governance' },
  { name: 'Create', href: '/create' },
  { name: 'Portfolio', href: '/portfolio' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-brand flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">HyperIndex</span>
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
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800">
              More
              <ChevronDown className="w-4 h-4 ml-1" />
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

        {/* Wallet Connect (disabled in refactor) */}
        <Button className="bg-brand text-black hover:bg-brand-hover">Connect</Button>
      </div>
    </header>
  )
}
