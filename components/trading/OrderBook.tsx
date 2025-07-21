'use client'

const mockAsks = [
  { price: 1.2567, size: 1234.5, total: 15678.9 },
  { price: 1.2556, size: 2345.6, total: 14444.4 },
  { price: 1.2545, size: 3456.7, total: 12098.8 },
  { price: 1.2534, size: 4567.8, total: 8642.1 },
  { price: 1.2523, size: 5678.9, total: 4074.3 },
]

const mockBids = [
  { price: 1.2512, size: 1234.5, total: 1234.5 },
  { price: 1.2501, size: 2345.6, total: 3580.1 },
  { price: 1.2490, size: 3456.7, total: 7036.8 },
  { price: 1.2479, size: 4567.8, total: 11604.6 },
  { price: 1.2468, size: 5678.9, total: 17283.5 },
]

export function OrderBook() {
  const spread = 1.2523 - 1.2512
  const spreadPercentage = ((spread / 1.2512) * 100).toFixed(4)

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-3">
        <h3 className="text-sm font-medium text-white">Order Book</h3>
      </div>

      {/* Column Headers */}
      <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center px-3 text-xs text-slate-400">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Size</div>
        <div className="flex-1 text-right">Total</div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 flex flex-col-reverse px-3 py-1 space-y-reverse space-y-0.5">
          {mockAsks.map((ask, index) => (
            <div key={index} className="flex items-center text-xs hover:bg-slate-800/50 py-0.5 rounded">
              <div className="flex-1 text-red-400 font-mono">{ask.price.toFixed(4)}</div>
              <div className="flex-1 text-right text-slate-300 font-mono">{ask.size.toFixed(1)}</div>
              <div className="flex-1 text-right text-slate-400 font-mono">{ask.total.toFixed(1)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="h-8 flex items-center justify-center border-y border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400">
            Spread: <span className="text-white font-mono">{spread.toFixed(4)}</span>
            <span className="text-slate-500 ml-1">({spreadPercentage}%)</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 flex flex-col px-3 py-1 space-y-0.5">
          {mockBids.map((bid, index) => (
            <div key={index} className="flex items-center text-xs hover:bg-slate-800/50 py-0.5 rounded">
              <div className="flex-1 text-green-400 font-mono">{bid.price.toFixed(4)}</div>
              <div className="flex-1 text-right text-slate-300 font-mono">{bid.size.toFixed(1)}</div>
              <div className="flex-1 text-right text-slate-400 font-mono">{bid.total.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}