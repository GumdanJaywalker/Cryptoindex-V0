"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Menu, X } from "lucide-react"

export default function HyperliquidHeader() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const walletOptions = [
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Connect using browser wallet",
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Scan with WalletConnect to connect",
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Connect using Coinbase Wallet",
    },
    {
      name: "Phantom",
      icon: "👻",
      description: "Connect using Phantom wallet",
    },
  ]

  const handleWalletConnect = (walletName: string) => {
    // Simulate wallet connection
    setConnectedWallet("0x1234...5678")
    setIsConnected(true)
    setIsConnectModalOpen(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedWallet("")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold">Hyperliquid</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Trade
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Leaderboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Docs
                </a>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Network Badge */}
              <Badge variant="outline" className="hidden sm:flex border-green-500/20 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Arbitrum
              </Badge>

              {/* Connect Button */}
              {!isConnected ? (
                <Button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {connectedWallet}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                    <DropdownMenuItem
                      onClick={copyAddress}
                      className="text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Trade
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Leaderboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Docs
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hyperliquid DEX
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trade perpetuals with up to 50x leverage on the fastest, most liquid decentralized exchange
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Start Trading</Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">24h Volume</h3>
            <p className="text-2xl font-bold text-white">$127.5M</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Total Value Locked</h3>
            <p className="text-2xl font-bold text-white">$2.1B</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Active Traders</h3>
            <p className="text-2xl font-bold text-white">15,432</p>
          </div>
        </div>
      </main>

      {/* Connect Wallet Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose your preferred wallet to connect to Hyperliquid
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletConnect(wallet.name)}
                className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
              >
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              By connecting a wallet, you agree to Hyperliquid's Terms of Service and Privacy Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
