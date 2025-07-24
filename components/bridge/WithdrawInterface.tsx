'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowUp, 
  Wallet, 
  Clock, 
  Shield, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Zap,
  Key,
  Info
} from 'lucide-react'

const networks = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '🔵', fee: 15, minAmount: 10, avgTime: '10-15 min' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '🔴', fee: 3, minAmount: 5, avgTime: '2-5 min' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '🟢', fee: 1, minAmount: 1, avgTime: '3-5 min' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '🟣', fee: 0.5, minAmount: 1, avgTime: '1-2 min' }
]

const assets = {
  ethereum: ['ETH', 'USDC'],
  arbitrum: ['ETH', 'USDC', 'ARB'],
  polygon: ['MATIC', 'USDC'],
  solana: ['SOL', 'USDC']
}

export function WithdrawInterface() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    toNetwork: '',
    asset: '',
    amount: '',
    toAddress: '',
    memo: '',
    twoFactorCode: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [hyperliquidBalance] = useState(125430.85)

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const selectedNetwork = networks.find(n => n.id === formData.toNetwork)
  const availableAssets = formData.toNetwork ? assets[formData.toNetwork as keyof typeof assets] || [] : []
  
  const calculateFee = () => {
    if (!selectedNetwork || !formData.amount) return 0
    return selectedNetwork.fee
  }

  const calculateReceiveAmount = () => {
    if (!formData.amount) return 0
    const amount = parseFloat(formData.amount)
    const fee = calculateFee()
    return Math.max(0, amount - fee)
  }

  const handleWithdraw = async () => {
    setIsProcessing(true)
    setStep(5)
    
    // 프로세싱 단계 시뮬레이션
    const steps = [
      'Security verification...',
      'Creating withdrawal...',
      'Network processing...',
      'Transaction broadcasting...',
      'Withdrawal complete!'
    ]
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
          <ArrowUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Withdraw from Hyperliquid</h2>
          <p className="text-sm text-slate-400">Transfer assets to external networks</p>
        </div>
      </div>

      {/* 잔고 표시 */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-slate-400">Available Balance</div>
                <div className="text-xl font-bold text-white">${hyperliquidBalance.toLocaleString()} USDC</div>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-400/30">
              Hyperliquid
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              s <= step ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {s}
            </div>
            {s < 5 && <div className={`w-4 sm:w-8 h-0.5 ${s < step ? 'bg-red-600' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5 text-orange-400" />
              Select Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">To Network</Label>
              <Select value={formData.toNetwork} onValueChange={(value) => updateFormData('toNetwork', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Choose destination network" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{network.icon}</span>
                        <span>{network.name}</span>
                        <Badge variant="outline" className="text-xs border-slate-600">
                          ${network.fee} fee
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.toNetwork && (
              <div className="space-y-2">
                <Label className="text-slate-300">Asset</Label>
                <Select value={formData.asset} onValueChange={(value) => updateFormData('asset', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Choose asset to receive" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {availableAssets.map((asset) => (
                      <SelectItem key={asset} value={asset} className="text-white">
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedNetwork && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Network Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Network Fee:</span>
                    <span className="text-white ml-2">${selectedNetwork.fee} USDC</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Amount:</span>
                    <span className="text-white ml-2">${selectedNetwork.minAmount} USDC</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Processing Time:</span>
                    <span className="text-white ml-2">{selectedNetwork.avgTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className="text-green-400 ml-2">Active</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => setStep(2)} 
              disabled={!formData.toNetwork || !formData.asset}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              Enter Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount" className="text-slate-300">
                Amount (USDC)
              </Label>
              <div className="relative">
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder={`Min: $${selectedNetwork?.minAmount} USDC`}
                  value={formData.amount}
                  onChange={(e) => updateFormData('amount', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white text-lg pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  USDC
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Available: ${hyperliquidBalance.toLocaleString()}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 px-2 text-blue-400 hover:bg-blue-400/10"
                  onClick={() => updateFormData('amount', hyperliquidBalance.toString())}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-300">
                Recipient Address
              </Label>
              <Input
                id="address"
                placeholder={`Enter ${selectedNetwork?.name} address`}
                value={formData.toAddress}
                onChange={(e) => updateFormData('toAddress', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
              />
            </div>

            {(formData.toNetwork === 'solana' || formData.toNetwork === 'bitcoin') && (
              <div className="space-y-2">
                <Label htmlFor="memo" className="text-slate-300">
                  Memo/Tag (Optional)
                </Label>
                <Input
                  id="memo"
                  placeholder="Enter memo if required"
                  value={formData.memo}
                  onChange={(e) => updateFormData('memo', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}

            {formData.amount && (
              <div className="space-y-4">
                {/* 출금 흐름 시각화 */}
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{formData.amount} USDC</div>
                      <div className="text-xs text-slate-400">Hyperliquid</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <ArrowUp className="w-6 h-6 text-red-400" />
                      <div className="text-xs text-slate-400 mt-1">Withdraw</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">
                        {calculateReceiveAmount().toFixed(2)} {formData.asset}
                      </div>
                      <div className="text-xs text-slate-400">{selectedNetwork?.name}</div>
                    </div>
                  </div>
                </div>

                {/* 수수료 상세 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Withdraw Amount:</span>
                    <span className="text-white">{formData.amount} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network Fee:</span>
                    <span className="text-red-400">-${calculateFee()} USDC</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-300">You'll receive:</span>
                      <span className="text-red-400">{calculateReceiveAmount().toFixed(2)} {formData.asset}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => setStep(1)} 
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!formData.amount || !formData.toAddress || parseFloat(formData.amount) < (selectedNetwork?.minAmount || 0)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="w-5 h-5 text-purple-400" />
              Security Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-1">Security Check Required</h4>
                  <p className="text-xs text-red-200">
                    For your security, we require 2FA verification for all withdrawals. 
                    Enter your authenticator code below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twoFactor" className="text-slate-300">
                2FA Authentication Code
              </Label>
              <Input
                id="twoFactor"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={formData.twoFactorCode}
                onChange={(e) => updateFormData('twoFactorCode', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white text-center text-lg tracking-widest"
              />
              <div className="text-xs text-slate-400 text-center">
                Open your authenticator app and enter the 6-digit code
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setStep(2)} 
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                disabled={formData.twoFactorCode.length !== 6}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Verify
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-orange-400" />
              Final Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">To Network:</span>
                <span className="text-white flex items-center gap-2">
                  {selectedNetwork?.icon} {selectedNetwork?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Asset:</span>
                <span className="text-white">{formData.asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-white">{formData.amount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {formData.toAddress.slice(0, 10)}...{formData.toAddress.slice(-8)}
                  </span>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {formData.memo && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Memo:</span>
                  <span className="text-white">{formData.memo}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">You'll receive:</span>
                  <span className="text-red-400">{calculateReceiveAmount().toFixed(2)} {formData.asset}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">Final Warning</h4>
                  <p className="text-xs text-yellow-200">
                    Please double-check the recipient address. Withdrawals are irreversible and cannot be canceled once confirmed.
                    Estimated processing time: {selectedNetwork?.avgTime}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setStep(3)} 
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
              </Button>
              <Button 
                onClick={handleWithdraw}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Confirm Withdrawal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-400" />
              Processing Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              {isProcessing ? (
                <>
                  <div className="w-16 h-16 bg-red-600 rounded-full mx-auto flex items-center justify-center">
                    <ArrowUp className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Processing Your Withdrawal
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {processingStep < 4 ? 'Please wait while we process your withdrawal...' : 'Withdrawal completed successfully!'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={(processingStep + 1) * 20} className="w-full" />
                    <div className="text-sm text-slate-400">
                      Step {processingStep + 1} of 5
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      Withdrawal Successful!
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Your USDC has been withdrawn to {selectedNetwork?.name} as {formData.asset}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction Hash:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-mono">0xa7b2...8c4d</span>
                          <ExternalLink className="w-3 h-3 text-green-400" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount Sent:</span>
                        <span className="text-green-400">{calculateReceiveAmount().toFixed(2)} {formData.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expected Arrival:</span>
                        <span className="text-green-400">{selectedNetwork?.avgTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      setStep(1)
                      setFormData({ toNetwork: '', asset: '', amount: '', toAddress: '', memo: '', twoFactorCode: '' })
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Make Another Withdrawal
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}