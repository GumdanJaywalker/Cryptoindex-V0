'use client'

const mockTrades = [
  { price: 1.2534, size: 123.45, time: '14:32:15', side: 'buy' },
  { price: 1.2532, size: 234.56, time: '14:32:10', side: 'sell' },
  { price: 1.2535, size: 345.67, time: '14:32:05', side: 'buy' },
  { price: 1.2531, size: 456.78, time: '14:31:58', side: 'sell' },
  { price: 1.2536, size: 567.89, time: '14:31:52', side: 'buy' },
  { price: 1.2533, size: 678.90, time: '14:31:47', side: 'sell' },
  { price: 1.2537, size: 789.01, time: '14:31:41', side: 'buy' },
  { price: 1.2532, size: 890.12, time: '14:31:35', side: 'sell' },
]

export function RecentTrades() {
  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-3">
        <h3 className="text-sm font-medium text-white">Recent Trades</h3>
      </div>

      {/* Column Headers */}
      <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center px-3 text-xs text-slate-400">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Size</div>
        <div className="w-16 text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto">
        {mockTrades.map((trade, index) => (
          <div
            key={index}
            className="flex items-center px-2 py-0.5 hover:bg-slate-800/50 text-xs"
          >
            <div className={`flex-1 font-mono ${
              trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trade.price.toFixed(4)}
            </div>
            <div className="flex-1 text-right text-slate-300 font-mono">
              {trade.size.toFixed(2)}
            </div>
            <div className="w-16 text-right text-slate-400 font-mono">
              {trade.time}
            </div>
          </div>
        ))}
      </div>

      {/* Volume Stats */}
      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-2 text-xs">
        <div className="flex space-x-4">
          <div>
            <span className="text-slate-400">Vol:</span>
            <span className="text-white ml-1 font-mono">2.34M</span>
          </div>
          <div>
            <span className="text-slate-400">Avg:</span>
            <span className="text-white ml-1 font-mono">1.2534</span>
          </div>
        </div>
      </div>
    </div>
  )
}