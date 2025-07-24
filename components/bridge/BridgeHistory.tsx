'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  History, 
  ArrowDown, 
  ArrowUp, 
  ExternalLink, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Download,
  Calendar
} from 'lucide-react'

const bridgeTransactions = [
  {
    id: '1',
    type: 'deposit',
    fromNetwork: 'ethereum',
    toNetwork: 'hyperliquid',
    fromAsset: 'ETH',
    toAsset: 'USDC',
    amount: 2.5,
    received: 4250.85,
    fee: 4.25,
    status: 'completed',
    txHash: '0x8b4e9f2a3c5d7e1f9b2a6c8d4e7f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f',
    timestamp: '2024-07-24T10:30:00Z',
    networkIcon: '🔵'
  },
  {
    id: '2',
    type: 'withdraw',
    fromNetwork: 'hyperliquid',
    toNetwork: 'arbitrum',
    fromAsset: 'USDC',
    toAsset: 'USDC',
    amount: 1000,
    received: 997,
    fee: 3,
    status: 'completed',
    txHash: '0xa7b2c4d6e8f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c8d9e2f4a6b8c',
    timestamp: '2024-07-23T15:45:00Z',
    networkIcon: '🔴'
  },
  {
    id: '3',
    type: 'deposit',
    fromNetwork: 'solana',
    toNetwork: 'hyperliquid',
    fromAsset: 'SOL',
    toAsset: 'USDC',
    amount: 25,
    received: 3248.75,
    fee: 1.25,
    status: 'pending',
    txHash: '0xc5d7e9f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c8d9e2f4a6b8c1d3e',
    timestamp: '2024-07-24T09:15:00Z',
    networkIcon: '🟣'
  },
  {
    id: '4',
    type: 'withdraw',
    fromNetwork: 'hyperliquid',
    toNetwork: 'ethereum',
    fromAsset: 'USDC',
    toAsset: 'ETH',
    amount: 3400,
    received: 2.12,
    fee: 15,
    status: 'processing',
    txHash: '0xe9f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c8d9e2f4a6b8c1d3e5f7a',
    timestamp: '2024-07-24T08:20:00Z',
    networkIcon: '🔵'
  },
  {
    id: '5',
    type: 'deposit',
    fromNetwork: 'arbitrum',
    toNetwork: 'hyperliquid',
    fromAsset: 'ARB',
    toAsset: 'USDC',
    amount: 1000,
    received: 580.75,
    fee: 2.90,
    status: 'failed',
    txHash: '0xf1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c8d9e2f4a6b8c1d3e5f7a9b',
    timestamp: '2024-07-22T14:30:00Z',
    networkIcon: '🔴',
    failureReason: 'Insufficient gas fee'
  },
  {
    id: '6',
    type: 'deposit',
    fromNetwork: 'bitcoin',
    toNetwork: 'hyperliquid',
    fromAsset: 'BTC',
    toAsset: 'USDC',
    amount: 0.05,
    received: 2150.25,
    fee: 0.5,
    status: 'completed',
    txHash: '0xa9b2c4d6e8f1a3b5c8d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c8d9e2f4a6b8c',
    timestamp: '2024-07-21T16:45:00Z',
    networkIcon: '🟡'
  }
]

export function BridgeHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredTransactions = bridgeTransactions.filter(tx => {
    const matchesSearch = !searchTerm || 
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromAsset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toAsset.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400/30'
      case 'pending': return 'text-yellow-400 border-yellow-400/30'
      case 'processing': return 'text-blue-400 border-blue-400/30'
      case 'failed': return 'text-red-400 border-red-400/30'
      default: return 'text-slate-400 border-slate-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': case 'processing': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Bridge History</h2>
            <p className="text-sm text-slate-400">Track all your bridge transactions</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by transaction hash or asset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="deposit" className="text-white">Deposits</SelectItem>
                  <SelectItem value="withdraw" className="text-white">Withdraws</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="completed" className="text-white">Completed</SelectItem>
                  <SelectItem value="pending" className="text-white">Pending</SelectItem>
                  <SelectItem value="processing" className="text-white">Processing</SelectItem>
                  <SelectItem value="failed" className="text-white">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 거래 목록 */}
      <div className="space-y-3">
        {filteredTransactions.map((tx) => (
          <Card key={tx.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* 왼쪽: 거래 정보 */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    {tx.type === 'deposit' ? (
                      <ArrowDown className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowUp className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white capitalize">
                        {tx.type}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(tx.status)}`}
                      >
                        {getStatusIcon(tx.status)}
                        <span className="ml-1 capitalize">{tx.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{tx.networkIcon}</span>
                      <span>{tx.amount} {tx.fromAsset}</span>
                      <span>→</span>
                      <span>{tx.received} {tx.toAsset}</span>
                    </div>
                    
                    <div className="text-xs text-slate-500 mt-1">
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>

                {/* 가운데: 상세 정보 */}
                <div className="lg:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fee:</span>
                    <span className="text-white">{tx.fee} {tx.fromAsset}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-mono text-xs">
                        {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                      </span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {tx.status === 'failed' && tx.failureReason && (
                    <div className="text-xs text-red-400 mt-1">
                      Reason: {tx.failureReason}
                    </div>
                  )}
                </div>

                {/* 오른쪽: 액션 */}
                <div className="lg:w-32 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  
                  {tx.status === 'failed' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredTransactions.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-12 text-center">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Transactions Found</h3>
            <p className="text-sm text-slate-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Your bridge transactions will appear here once you make a deposit or withdrawal.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* 요약 통계 */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {filteredTransactions.length}
                </div>
                <div className="text-xs text-slate-400">Total Transactions</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-green-400">
                  {filteredTransactions.filter(tx => tx.status === 'completed').length}
                </div>
                <div className="text-xs text-slate-400">Completed</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {filteredTransactions.filter(tx => tx.status === 'pending' || tx.status === 'processing').length}
                </div>
                <div className="text-xs text-slate-400">In Progress</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-red-400">
                  {filteredTransactions.filter(tx => tx.status === 'failed').length}
                </div>
                <div className="text-xs text-slate-400">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}