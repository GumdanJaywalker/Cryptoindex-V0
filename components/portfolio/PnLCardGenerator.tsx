'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  Palette, 
  Download, 
  Share2, 
  Eye,
  Zap,
  TrendingUp,
  Calendar,
  Sparkles,
  Settings,
  RefreshCw,
  Copy,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react'

const cardTemplates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional',
    preview: 'bg-gradient-to-br from-slate-800 to-slate-900'
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Vibrant cyberpunk style',
    preview: 'bg-gradient-to-br from-purple-600 to-pink-600'
  },
  {
    id: 'gold',
    name: 'Golden Hour',
    description: 'Luxury golden theme',
    preview: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Deep blue ocean vibes',
    preview: 'bg-gradient-to-br from-blue-600 to-cyan-500'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural green profits',
    preview: 'bg-gradient-to-br from-green-600 to-emerald-500'
  },
  {
    id: 'fire',
    name: 'Fire Storm',
    description: 'Blazing red energy',
    preview: 'bg-gradient-to-br from-red-600 to-orange-500'
  }
]

const timeframes = [
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '3 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all', label: 'All Time' }
]

const mockPnLData = {
  '24h': { pnl: 2347.80, percentage: 12.4, trades: 8, winRate: 87.5 },
  '7d': { pnl: 8947.50, percentage: 34.2, trades: 23, winRate: 73.9 },
  '30d': { pnl: 15847.20, percentage: 67.8, trades: 89, winRate: 69.7 },
  '90d': { pnl: 45234.60, percentage: 142.3, trades: 234, winRate: 71.2 },
  'ytd': { pnl: 67890.40, percentage: 189.7, trades: 456, winRate: 68.9 },
  'all': { pnl: 123456.78, percentage: 267.4, trades: 789, winRate: 67.8 }
}

export function PnLCardGenerator() {
  const [step, setStep] = useState(1) // 1: Data, 2: Design, 3: Preview, 4: Share
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedTemplate, setSelectedTemplate] = useState('neon')
  const [customTitle, setCustomTitle] = useState('My Crypto Journey')
  const [showMetrics, setShowMetrics] = useState(['pnl', 'percentage', 'trades', 'winRate'])
  const [opacity, setOpacity] = useState([85])
  const [cardSize, setCardSize] = useState('square') // square, wide, story

  const currentData = mockPnLData[selectedTimeframe as keyof typeof mockPnLData]

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Step 1: Select Data & Period</h3>
              
              {/* 시간대 선택 */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Time Period</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeframes.map((timeframe) => (
                    <Button
                      key={timeframe.value}
                      variant={selectedTimeframe === timeframe.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe.value)}
                      className={`${
                        selectedTimeframe === timeframe.value
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {timeframe.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 성과 미리보기 */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-medium text-white mb-3">Performance Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      +${currentData.pnl.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Total P&L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">
                      +{currentData.percentage}%
                    </div>
                    <div className="text-xs text-slate-400">Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {currentData.trades}
                    </div>
                    <div className="text-xs text-slate-400">Trades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {currentData.winRate}%
                    </div>
                    <div className="text-xs text-slate-400">Win Rate</div>
                  </div>
                </div>
              </div>

              {/* 커스텀 제목 */}
              <div className="mt-6 space-y-3">
                <label className="text-sm text-slate-400">Card Title</label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter a custom title..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Step 2: Choose Design & Style</h3>
              
              {/* 템플릿 선택 */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Template Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cardTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className={`w-full h-16 rounded ${template.preview} mb-2`} />
                      <div className="text-sm font-medium text-white">{template.name}</div>
                      <div className="text-xs text-slate-400">{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 카드 크기 */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Card Size</label>
                <div className="flex gap-2">
                  {[
                    { id: 'square', label: 'Square (1:1)', icon: '⬜' },
                    { id: 'wide', label: 'Wide (16:9)', icon: '🖥️' },
                    { id: 'story', label: 'Story (9:16)', icon: '📱' }
                  ].map((size) => (
                    <Button
                      key={size.id}
                      variant={cardSize === size.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCardSize(size.id)}
                      className={`${
                        cardSize === size.id
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="mr-2">{size.icon}</span>
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 투명도 조절 */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Background Opacity</label>
                <div className="px-3">
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={100}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>20%</span>
                    <span>{opacity[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Step 3: Preview & Customize</h3>
              
              {/* 카드 미리보기 */}
              <div className="flex justify-center mb-6">
                <div 
                  className={`${
                    cardSize === 'square' ? 'w-80 h-80' :
                    cardSize === 'wide' ? 'w-96 h-54' :
                    'w-54 h-96'
                  } ${
                    cardTemplates.find(t => t.id === selectedTemplate)?.preview
                  } rounded-xl p-6 text-white relative overflow-hidden`}
                  style={{ opacity: opacity[0] / 100 }}
                >
                  {/* 배경 효과 */}
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* 카드 내용 */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-medium">CryptoIndex</span>
                      </div>
                      <h2 className="text-xl font-bold mb-1">{customTitle}</h2>
                      <p className="text-sm opacity-80">
                        {timeframes.find(t => t.value === selectedTimeframe)?.label} Performance
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          +${currentData.pnl.toLocaleString()}
                        </div>
                        <div className="text-lg">
                          +{currentData.percentage}% Return
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{currentData.trades}</div>
                          <div className="opacity-80">Trades</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{currentData.winRate}%</div>
                          <div className="opacity-80">Win Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs opacity-60">
                      Generated with CryptoIndex • {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 커스터마이징 옵션 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Design
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(cardTemplates[Math.floor(Math.random() * cardTemplates.length)].id)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Random Style
                </Button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Step 4: Share Your Success</h3>
              
              {/* 공유 옵션 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>

              {/* 소셜 미디어 공유 */}
              <div className="space-y-3">
                <label className="text-sm text-slate-400">Share on Social Media</label>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-pink-500 text-pink-400 hover:bg-pink-500/10 flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-300 hover:bg-blue-600/10 flex items-center justify-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                </div>
              </div>

              {/* 카드 갤러리 */}
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Your PnL Card Gallery</h4>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    12 Cards
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
                  ))}
                </div>
              </div>

              {/* 성과 NFT */}
              <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Mint as NFT (Coming Soon)</h4>
                      <p className="text-xs text-slate-300">
                        Turn your exceptional performance into a unique NFT collectible. 
                        Available for returns above 100%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-pink-400" />
            PnL Card Generator
          </h2>
          <p className="text-slate-400 mt-1">Create stunning cards to showcase your trading success</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-pink-400 border-pink-400/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Magic
          </Badge>
        </div>
      </div>

      {/* 진행 단계 */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                step > stepNum ? 'bg-blue-600' : 'bg-slate-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          {renderStepContent()}
          
          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Previous
            </Button>
            
            <Button
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={step === 4}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {step === 3 ? 'Generate Card' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}