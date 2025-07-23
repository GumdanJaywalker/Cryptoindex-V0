'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PlusCircle, 
  Settings, 
  Target, 
  Shield, 
  DollarSign, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  BookOpen
} from 'lucide-react'

export function CreateVaultModal() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // 기본 정보
    name: '',
    description: '',
    category: '',
    riskLevel: '',
    
    // 전략 설정
    tradingStyle: '',
    maxPositions: 10,
    maxLeverage: 5,
    stopLoss: 10,
    takeProfit: 20,
    
    // 경제적 조건
    minDeposit: 100,
    maxCapacity: 1000000,
    managementFee: 2,
    performanceFee: 20,
    lockPeriod: 0,
    
    // 추가 설정
    allowCopyTrading: true,
    publicVault: true,
    autoRebalance: false,
    riskManagement: true
  })

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const categories = [
    { value: 'meme', label: 'Meme Coins', description: 'Specialized in meme coin trading' },
    { value: 'defi', label: 'DeFi Strategies', description: 'Decentralized finance protocols' },
    { value: 'ai', label: 'AI Trading', description: 'Algorithmic and ML-based trading' },
    { value: 'index', label: 'Index Focused', description: 'Multi-asset index strategies' },
    { value: 'arbitrage', label: 'Arbitrage', description: 'Cross-exchange opportunities' },
    { value: 'conservative', label: 'Conservative', description: 'Low-risk stable returns' }
  ]

  const riskLevels = [
    { value: 'low', label: 'Low Risk', description: 'Conservative approach, capital preservation focused', color: 'text-green-400' },
    { value: 'medium', label: 'Medium Risk', description: 'Balanced growth with moderate volatility', color: 'text-yellow-400' },
    { value: 'high', label: 'High Risk', description: 'Aggressive growth, higher volatility', color: 'text-red-400' },
    { value: 'extreme', label: 'Extreme Risk', description: 'Maximum returns, maximum risk', color: 'text-pink-400' }
  ]

  const tradingStyles = [
    { value: 'scalping', label: 'Scalping', description: 'High-frequency short-term trades' },
    { value: 'swing', label: 'Swing Trading', description: 'Medium-term position trading' },
    { value: 'trend', label: 'Trend Following', description: 'Following market momentum' },
    { value: 'mean-reversion', label: 'Mean Reversion', description: 'Counter-trend strategies' },
    { value: 'algorithmic', label: 'Algorithmic', description: 'Automated trading systems' },
    { value: 'fundamental', label: 'Fundamental', description: 'Value-based analysis' }
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <PlusCircle className="w-6 h-6 text-green-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Create New Vault</h2>
          <p className="text-sm text-slate-400">Set up your trading vault and start accepting investors</p>
        </div>
      </div>

      {/* 프로그레스 표시 */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              s <= step ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-4 sm:w-8 h-0.5 ${s < step ? 'bg-blue-600' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <Tabs value={`step-${step}`} className="w-full">
        {/* Step 1: 기본 정보 */}
        <TabsContent value="step-1" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="w-5 h-5 text-blue-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Vault Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your vault name (e.g., 'Meme Masters Pro')"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your trading strategy, approach, and what makes your vault unique..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white">
                          <div>
                            <div className="font-medium">{cat.label}</div>
                            <div className="text-xs text-slate-400">{cat.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Risk Level</Label>
                  <Select value={formData.riskLevel} onValueChange={(value) => updateFormData('riskLevel', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {riskLevels.map((risk) => (
                        <SelectItem key={risk.value} value={risk.value} className="text-white">
                          <div>
                            <div className={`font-medium ${risk.color}`}>{risk.label}</div>
                            <div className="text-xs text-slate-400">{risk.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: 거래 전략 */}
        <TabsContent value="step-2" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-purple-400" />
                Trading Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Trading Style</Label>
                <Select value={formData.tradingStyle} onValueChange={(value) => updateFormData('tradingStyle', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select trading style" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {tradingStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value} className="text-white">
                        <div>
                          <div className="font-medium">{style.label}</div>
                          <div className="text-xs text-slate-400">{style.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Max Positions: {formData.maxPositions}
                  </Label>
                  <Slider
                    value={[formData.maxPositions]}
                    onValueChange={(value) => updateFormData('maxPositions', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Max Leverage: {formData.maxLeverage}x
                  </Label>
                  <Slider
                    value={[formData.maxLeverage]}
                    onValueChange={(value) => updateFormData('maxLeverage', value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1x</span>
                    <span>20x</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Stop Loss: {formData.stopLoss}%
                  </Label>
                  <Slider
                    value={[formData.stopLoss]}
                    onValueChange={(value) => updateFormData('stopLoss', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Take Profit: {formData.takeProfit}%
                  </Label>
                  <Slider
                    value={[formData.takeProfit]}
                    onValueChange={(value) => updateFormData('takeProfit', value[0])}
                    max={100}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: 경제적 조건 */}
        <TabsContent value="step-3" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-green-400" />
                Economic Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit" className="text-slate-300">Minimum Deposit (USDC)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={formData.minDeposit}
                    onChange={(e) => updateFormData('minDeposit', Number(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCapacity" className="text-slate-300">Max Capacity (USDC)</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => updateFormData('maxCapacity', Number(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Management Fee: {formData.managementFee}%
                  </Label>
                  <Slider
                    value={[formData.managementFee]}
                    onValueChange={(value) => updateFormData('managementFee', value[0])}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400">Annual fee</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Performance Fee: {formData.performanceFee}%
                  </Label>
                  <Slider
                    value={[formData.performanceFee]}
                    onValueChange={(value) => updateFormData('performanceFee', value[0])}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400">Of profits</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Lock Period: {formData.lockPeriod} days
                  </Label>
                  <Slider
                    value={[formData.lockPeriod]}
                    onValueChange={(value) => updateFormData('lockPeriod', value[0])}
                    max={365}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400">Withdrawal restriction</div>
                </div>
              </div>

              {/* 수수료 미리보기 */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Fee Structure Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Management Fee:</span>
                    <span className="text-white ml-2">{formData.managementFee}% annually</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Performance Fee:</span>
                    <span className="text-white ml-2">{formData.performanceFee}% of profits</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Example: On $10,000 with 50% annual return, you earn ${((10000 * 0.5 * formData.performanceFee / 100) + (10000 * formData.managementFee / 100)).toFixed(0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: 최종 설정 */}
        <TabsContent value="step-4" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-orange-400" />
                Final Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="publicVault"
                    checked={formData.publicVault}
                    onCheckedChange={(checked) => updateFormData('publicVault', checked)}
                  />
                  <div>
                    <Label htmlFor="publicVault" className="text-slate-300 font-medium">Public Vault</Label>
                    <p className="text-xs text-slate-400">Allow anyone to discover and invest in your vault</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="allowCopyTrading"
                    checked={formData.allowCopyTrading}
                    onCheckedChange={(checked) => updateFormData('allowCopyTrading', checked)}
                  />
                  <div>
                    <Label htmlFor="allowCopyTrading" className="text-slate-300 font-medium">Enable Copy Trading</Label>
                    <p className="text-xs text-slate-400">Let investors automatically copy your trades</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="riskManagement"
                    checked={formData.riskManagement}
                    onCheckedChange={(checked) => updateFormData('riskManagement', checked)}
                  />
                  <div>
                    <Label htmlFor="riskManagement" className="text-slate-300 font-medium">Automated Risk Management</Label>
                    <p className="text-xs text-slate-400">Enable automatic stop-losses and position sizing</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="autoRebalance"
                    checked={formData.autoRebalance}
                    onCheckedChange={(checked) => updateFormData('autoRebalance', checked)}
                  />
                  <div>
                    <Label htmlFor="autoRebalance" className="text-slate-300 font-medium">Auto Rebalancing</Label>
                    <p className="text-xs text-slate-400">Automatically rebalance portfolio based on target allocations</p>
                  </div>
                </div>
              </div>

              {/* 요약 정보 */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">Vault Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white ml-2">{formData.name || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white ml-2">{formData.category || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk Level:</span>
                    <span className="text-white ml-2">{formData.riskLevel || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Deposit:</span>
                    <span className="text-white ml-2">${formData.minDeposit}</span>
                  </div>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-1">Important Notice</h4>
                    <p className="text-xs text-yellow-200">
                      By creating a vault, you agree to act as a fund manager and accept fiduciary responsibility 
                      for investor funds. All trading activities will be recorded and subject to audit.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Step
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Create Vault
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}