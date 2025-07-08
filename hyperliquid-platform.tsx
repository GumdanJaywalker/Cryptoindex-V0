"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Mail, Shield, ArrowLeft, Copy, CheckCircle, Smartphone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type DialogType =
  | "connect"
  | "email-login"
  | "email-verification"
  | "mfa-method"
  | "mfa-qr-code"
  | "mfa-enrollment-code"
  | "mfa-success"
  | "transaction-protection"
  | "deposit"
  | "terms"
  | null

export default function HyperliquidPlatform() {
  const [currentDialog, setCurrentDialog] = useState<DialogType>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [mfaEnrollmentCode, setMfaEnrollmentCode] = useState(["", "", "", "", "", ""])

  const handleConnect = () => {
    setCurrentDialog("connect")
  }

  const handleWalletConnect = (walletName: string) => {
    if (walletName === "Email") {
      setCurrentDialog("email-login")
    } else {
      // Simulate wallet connection
      setConnectedWallet("0x39C3...5678")
      setIsConnected(true)
      setCurrentDialog("terms")
    }
  }

  const handleEmailLogin = () => {
    setCurrentDialog("email-verification")
  }

  const handleEmailVerification = () => {
    setConnectedWallet("henry@example.com")
    setIsConnected(true)
    setCurrentDialog("terms") // Go directly to terms, skip MFA
  }

  const handleMFASetup = () => {
    setCurrentDialog("mfa-qr-code")
  }

  const handleTransactionProtection = () => {
    setCurrentDialog(null) // Just close, don't go to deposit
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
    }
  }

  const closeDialog = () => {
    setCurrentDialog(null)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedWallet("")
  }

  const handleMfaEnrollmentCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...mfaEnrollmentCode]
      newCode[index] = value
      setMfaEnrollmentCode(newCode)
    }
  }

  const handleMfaEnrollmentSubmit = () => {
    setCurrentDialog("mfa-success")
  }

  const handleDepositClick = () => {
    setCurrentDialog("deposit")
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Trading Interface */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "url('/hyperliquid-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm"></div>
                </div>
                <span className="text-xl font-bold">Hyperliquid</span>
              </div>

              <nav className="hidden md:flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-300 hover:text-white">
                  Trade
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Vaults
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Portfolio
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Staking
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Referrals
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Leaderboard
                </a>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-300">More</span>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </div>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <Button onClick={handleConnect} className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-6">
                  Connect
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleDepositClick}
                    className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-6"
                  >
                    Deposit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-gray-800 flex items-center space-x-2">
                        <span className="text-sm">{connectedWallet}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => setCurrentDialog("mfa-method")}
                        className="text-teal-400 hover:text-teal-300 hover:bg-gray-800"
                      >
                        Enroll in MFA
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDisconnect}
                        className="text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="relative z-10 bg-teal-500 text-black px-4 py-2 text-sm">
        Welcome to Hyperliquid! Deposit Arbitrum USDC to get started.
      </div>

      {/* Main Content */}
      <main className="relative z-10 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">FARTCOIN-USD Trading</h1>
          <p className="text-gray-400">Click Connect to start trading on Hyperliquid</p>
        </div>
      </main>

      {/* Connect Dialog */}
      <Dialog open={currentDialog === "connect"} onOpenChange={closeDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Connect</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            <button
              onClick={() => handleWalletConnect("Email")}
              className="w-full flex items-center space-x-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
            >
              <Mail className="w-5 h-5 text-white" />
              <span className="font-medium">Log in with Email</span>
            </button>

            {[
              { name: "MetaMask", icon: "🦊", color: "text-orange-500" },
              { name: "Keplr", icon: "K", color: "text-blue-500" },
              { name: "WalletConnect", icon: "🔗", color: "text-blue-400" },
              { name: "OKX Wallet", icon: "⚫", color: "text-white" },
              { name: "Coinbase Wallet", icon: "🔵", color: "text-blue-600" },
            ].map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletConnect(wallet.name)}
                className="w-full flex items-center space-x-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
              >
                <span className={`text-xl ${wallet.color}`}>{wallet.icon}</span>
                <span className="font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Login Dialog */}
      <Dialog open={currentDialog === "email-login"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Log in or sign up</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm"></div>
                </div>
                <span className="text-xl font-bold italic">Hyperliquid</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
                <Badge variant="outline" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs">
                  Recent
                </Badge>
              </div>

              <Button
                onClick={handleEmailLogin}
                className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium"
              >
                Continue
              </Button>
            </div>

            <div className="text-center text-xs text-gray-400">
              Protected by <span className="font-bold">PRIVY</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Dialog */}
      <Dialog open={currentDialog === "email-verification"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDialog("email-login")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <Mail className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enter confirmation code</h3>
              <p className="text-gray-400 text-sm">
                Please check henrychoi@cryptopayback.io for an email from privy.io and enter your code below.
              </p>
            </div>

            <div className="flex justify-center space-x-2">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center bg-gray-800 border-gray-600 text-white text-lg"
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-gray-400 text-sm">Didn't get an email? </span>
              <button className="text-teal-500 text-sm hover:underline">Resend code</button>
            </div>

            <Button
              onClick={handleEmailVerification}
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium"
            >
              Verify
            </Button>

            <div className="text-center text-xs text-gray-400">
              Protected by <span className="font-bold">PRIVY</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MFA Method Selection Dialog */}
      <Dialog open={currentDialog === "mfa-method"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Choose a verification method</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                How would you like to verify your identity? You can change this later.
              </p>
            </div>

            <button
              onClick={handleMFASetup}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-white" />
                <span className="font-medium">Authenticator app</span>
              </div>
              <Badge variant="outline" className="text-teal-500 border-teal-500">
                Recommended
              </Badge>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Protection Dialog */}
      <Dialog open={currentDialog === "transaction-protection"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Transaction Protection</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-6">
                Set up transaction protection to add an extra layer of security to your account
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                <span className="text-sm">Enable 2-Step verification for your Hyperliquid wallet.</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                <span className="text-sm">You'll be prompted to authenticate to complete transactions.</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTransactionProtection}
                className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium"
              >
                Continue
              </Button>
              <Button
                variant="outline"
                onClick={closeDialog}
                className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={currentDialog === "deposit"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white w-full max-w-sm">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold">Deposit USDC from Arbitrum</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Deposit Chain</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-9"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Arbitrum</span>
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-gray-900 border-gray-700 max-h-32 overflow-y-auto">
                  <DropdownMenuItem className="text-white hover:bg-gray-800 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>Arbitrum</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span>Ethereum</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span>BSC</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                      <span>Polygon</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span>Avalanche</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Deposit Address</label>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                <span className="text-xs font-mono text-gray-300 truncate mr-2">0x39C3...5678</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Button onClick={closeDialog} className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium h-9">
              Done
            </Button>

            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-2">
              <p className="text-red-400 text-xs leading-tight">
                <strong>IMPORTANT:</strong> Only send native USDC from Arbitrum. Min deposit: 5 USDC.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={currentDialog === "terms"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Terms of Use, Privacy Policy, and Cookie Policy</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <p className="text-center text-gray-400">To proceed, review and accept the following:</p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  You acknowledge that you have read, understood, and agreed to the{" "}
                  <span className="text-teal-500 underline cursor-pointer">Terms of Use</span> and{" "}
                  <span className="text-teal-500 underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  This site uses cookies to ensure the best user experience. These cookies are strictly necessary or
                  essential for optimal functionality. By using this site, you agree to the cookie policy.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={closeDialog}
                className="flex-1 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                Decline
              </Button>
              <Button
                onClick={() => {
                  setCurrentDialog(null)
                  // MFA is now optional via dropdown
                }}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-black font-medium"
              >
                Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MFA QR Code Dialog */}
      <Dialog open={currentDialog === "mfa-qr-code"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDialog("mfa-method")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Scan QR code</h3>
              <p className="text-gray-400 text-sm">Open your authenticator app and scan the QR code to continue.</p>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <div className="w-44 h-44 bg-black rounded grid grid-cols-8 gap-px p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="text-gray-400 text-sm hover:text-white flex items-center justify-center space-x-2 mx-auto">
                <Copy className="w-4 h-4" />
                <span>Copy setup key</span>
              </button>
            </div>

            <Button
              onClick={() => setCurrentDialog("mfa-enrollment-code")}
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MFA Enrollment Code Dialog */}
      <Dialog open={currentDialog === "mfa-enrollment-code"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDialog("mfa-qr-code")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enter enrollment code</h3>
            </div>

            <div className="flex justify-center space-x-2">
              {mfaEnrollmentCode.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleMfaEnrollmentCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center bg-gray-800 border-gray-600 text-white text-lg"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                To continue, enter the 6-digit code generated from your{" "}
                <span className="text-white">authenticator app</span>
              </p>
            </div>

            <Button
              onClick={handleMfaEnrollmentSubmit}
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MFA Success Dialog */}
      <Dialog open={currentDialog === "mfa-success"} onOpenChange={closeDialog}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-md">
          <DialogHeader></DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Authenticator app verification added</h3>
              <p className="text-gray-400 text-sm">
                From now on, you'll enter the verification code generated by your authenticator app whenever you use
                your Hyperliquid wallet.
              </p>
            </div>

            <Button onClick={closeDialog} className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
