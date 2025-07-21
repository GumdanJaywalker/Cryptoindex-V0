'use client'

const mockFeedItems = [
  { type: 'whale', message: 'Whale bought 50K DOG_INDEX', time: '2m ago', value: '+$125K' },
  { type: 'pnl', message: '@trader123 realized +234%', time: '5m ago', value: '+$45K' },
  { type: 'sentiment', message: 'Market sentiment: Bullish', time: '8m ago', value: '85%' },
  { type: 'holder', message: 'Top holder increased position', time: '12m ago', value: '+5%' },
]

export function CommunityFeed() {
  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-3">
        <h3 className="text-sm font-medium text-white">Community Feed</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {mockFeedItems.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-lg p-3 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'whale' ? 'bg-blue-400' :
                  item.type === 'pnl' ? 'bg-green-400' :
                  item.type === 'sentiment' ? 'bg-yellow-400' :
                  'bg-purple-400'
                }`}></div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              <div className={`text-xs font-mono ${
                item.value.startsWith('+') ? 'text-green-400' : 'text-white'
              }`}>
                {item.value}
              </div>
            </div>
            <div className="text-sm text-white">
              {item.message}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="h-12 bg-slate-900 border-t border-slate-800 flex items-center px-3 text-xs">
        <div className="flex space-x-4">
          <div>
            <span className="text-slate-400">Online:</span>
            <span className="text-green-400 ml-1">1,234</span>
          </div>
          <div>
            <span className="text-slate-400">24h PnL:</span>
            <span className="text-green-400 ml-1">+12.5%</span>
          </div>
        </div>
      </div>
    </div>
  )
}