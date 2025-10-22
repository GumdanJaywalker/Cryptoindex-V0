'use client'

import { Header } from '@/components/layout/Header'
import { ChartArea } from '@/components/trading/ChartArea'

export default function TestTradingViewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">TradingView Chart Test</h1>
          <p className="text-slate-400">
            Testing lightweight-charts integration with mock data
          </p>
        </div>

        {/* Chart Area */}
        <div className="mb-8">
          <ChartArea indexId="test-index" />
        </div>

        {/* Test Coverage Info */}
        <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 text-white">Test Coverage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">Data & Rendering</h3>
              <ul className="text-sm text-slate-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Mock OHLCV data generation (500 candles)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Chart rendering with lightweight-charts library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Volume display at bottom (15% height)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Real-time price updates (3 sec interval)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">Interactive Features</h3>
              <ul className="text-sm text-slate-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Timeframe switching (1m, 5m, 15m, 1h, 4h, 1d, 1w)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Chart type switching (Candlestick, Line, Area, Histogram)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Technical indicators (MA 20, MA 50)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Crosshair with price/time tooltip</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 mb-2">How to Test</h3>
            <ol className="text-sm text-slate-400 space-y-1.5 list-decimal list-inside">
              <li>Click timeframe buttons (1m, 5m, 15m, 1h, 4h, 1d, 1w) to change data granularity</li>
              <li>Click chart type buttons (Candlestick, Line, Area, Histogram) to change visualization</li>
              <li>Click MA(20) or MA(50) buttons to add/remove moving average indicators</li>
              <li>Hover over chart to see crosshair with price and time information</li>
              <li>Wait 3 seconds to see real-time price updates</li>
              <li>Check console for any errors or warnings</li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Implementation Details</h3>
            <div className="text-sm text-slate-400 space-y-1">
              <p><span className="text-slate-300">Component:</span> components/trading/ChartArea.tsx</p>
              <p><span className="text-slate-300">Mock API:</span> lib/api/trading-chart.ts</p>
              <p><span className="text-slate-300">Types:</span> lib/types/trading-chart.ts</p>
              <p><span className="text-slate-300">Library:</span> lightweight-charts (TradingView)</p>
              <p className="mt-2 text-amber-400">
                Note: All data is currently mocked. Ready for backend API integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
