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
  ArrowDown, 
  Wallet, 
  Clock, 
  Shield, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react'

const networks = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '🔵', fee: 0.1, minAmount: 0.01 },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '🔴', fee: 0.05, minAmount: 1 },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '🟡', fee: 0.0005, minAmount: 0.001 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '🟣', fee: 0.01, minAmount: 0.1 }
]

const assets = {
  ethereum: ['ETH', 'USDC'],
  arbitrum: ['ETH', 'USDC', 'ARB'],
  bitcoin: ['BTC'],
  solana: ['SOL', 'USDC']
}

export function DepositInterface() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fromNetwork: '',
    asset: '',
    amount: '',
    toAddress: 'HL_0x8b4e9f2a3c5d7e1f9b2a6c8d4e7f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const selectedNetwork = networks.find(n => n.id === formData.fromNetwork)
  const availableAssets = formData.fromNetwork ? assets[formData.fromNetwork as keyof typeof assets] || [] : []
  
  const calculateFee = () => {
    if (!selectedNetwork || !formData.amount) return 0
    return (parseFloat(formData.amount) * selectedNetwork.fee / 100)
  }

  const calculateReceiveAmount = () => {
    if (!formData.amount) return 0
    const amount = parseFloat(formData.amount)
    const fee = calculateFee()
    return Math.max(0, amount - fee)
  }

  const handleDeposit = async () => {
    setIsProcessing(true)
    setStep(4)
    
    // 프로세싱 단계 시뮬레이션
    const steps = [
      'Wallet connection...',
      'Transaction signing...',
      'Network processing...',
      'Hyperliquid confirmation...',
      'Deposit complete!'
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
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <ArrowDown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Deposit to Hyperliquid</h2>
          <p className="text-sm text-slate-400">Transfer assets from external networks</p>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              s <= step ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-4 sm:w-8 h-0.5 ${s < step ? 'bg-blue-600' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5 text-green-400" />
              Select Network & Asset
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">From Network</Label>
              <Select value={formData.fromNetwork} onValueChange={(value) => updateFormData('fromNetwork', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Choose source network" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{network.icon}</span>
                        <span>{network.name}</span>
                        <Badge variant="outline" className="text-xs border-slate-600">
                          {network.fee}% fee
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.fromNetwork && (
              <div className="space-y-2">
                <Label className="text-slate-300">Asset</Label>
                <Select value={formData.asset} onValueChange={(value) => updateFormData('asset', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Choose asset" />
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
                    <span className="text-slate-400">Bridge Fee:</span>
                    <span className="text-white ml-2">{selectedNetwork.fee}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Amount:</span>
                    <span className="text-white ml-2">{selectedNetwork.minAmount} {selectedNetwork.symbol}</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => setStep(2)} 
              disabled={!formData.fromNetwork || !formData.asset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
              Enter Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-300">
                Amount ({formData.asset})
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Min: ${selectedNetwork?.minAmount} ${formData.asset}`}
                  value={formData.amount}
                  onChange={(e) => updateFormData('amount', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white text-lg pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  {formData.asset}
                </div>
              </div>
            </div>

            {formData.amount && (
              <div className="space-y-4">
                {/* 브릿지 흐름 시각화 */}
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{formData.amount} {formData.asset}</div>
                      <div className="text-xs text-slate-400">{selectedNetwork?.name}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <ArrowDown className="w-6 h-6 text-blue-400" />
                      <div className="text-xs text-slate-400 mt-1">Bridge</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {calculateReceiveAmount().toFixed(6)} USDC
                      </div>
                      <div className="text-xs text-slate-400">Hyperliquid</div>
                    </div>
                  </div>
                </div>

                {/* 수수료 상세 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white">{formData.amount} {formData.asset}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Bridge Fee ({selectedNetwork?.fee}%):</span>
                    <span className="text-red-400">-{calculateFee().toFixed(6)} {formData.asset}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-300">You'll receive:</span>
                      <span className="text-green-400">{calculateReceiveAmount().toFixed(6)} USDC</span>
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
                disabled={!formData.amount || parseFloat(formData.amount) < (selectedNetwork?.minAmount || 0)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-orange-400" />
              Review & Confirm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">From Network:</span>
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
                <span className="text-white">{formData.amount} {formData.asset}</span>
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
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">You'll receive:</span>
                  <span className="text-green-400">{calculateReceiveAmount().toFixed(6)} USDC</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">Important Notice</h4>
                  <p className="text-xs text-yellow-200">
                    Please verify all details carefully. Bridge transactions are irreversible. 
                    Estimated processing time: 3-15 minutes depending on network.
                  </p>
                </div>
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
                onClick={handleDeposit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Confirm Deposit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-400" />
              Processing Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              {isProcessing ? (
                <>
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Processing Your Deposit
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {processingStep < 4 ? 'Please wait while we process your transaction...' : 'Transaction completed successfully!'}
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
                      Deposit Successful!
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Your {formData.asset} has been bridged to Hyperliquid as USDC
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction Hash:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-mono">0x8b4e...2f4a</span>
                          <ExternalLink className="w-3 h-3 text-green-400" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Received:</span>
                        <span className="text-green-400">{calculateReceiveAmount().toFixed(6)} USDC</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      setStep(1)
                      setFormData({ fromNetwork: '', asset: '', amount: '', toAddress: formData.toAddress })
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Make Another Deposit
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