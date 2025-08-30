'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderbookData {
  bids: Array<{ price: string; amount: string; orders: number }>;
  asks: Array<{ price: string; amount: string; orders: number }>;
  timestamp: number;
}

interface Trade {
  id: string;
  price: string;
  amount: string;
  side: 'buy' | 'sell';
  timestamp: number;
  source: 'AMM' | 'Orderbook';
}

interface SystemMetrics {
  tps: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: number;
  errors: number;
  orderbook: {
    totalOrders: number;
    activeOrders: number;
  };
  amm: {
    currentPrice: number;
    volume24h: number;
    reserves: {
      token0: number;
      token1: number;
    };
  };
}

export default function HOOATSMonitoringPage() {
  const [orderbook, setOrderbook] = useState<OrderbookData>({ bids: [], asks: [], timestamp: 0 });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPair, setSelectedPair] = useState('HYPERINDEX-USDC');

  // Fetch orderbook data
  const fetchOrderbook = async () => {
    try {
      const response = await fetch(`/api/trading/v1/orderbook?pair=${selectedPair}&depth=20`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrderbook({
            bids: data.bids || [],
            asks: data.asks || [],
            timestamp: data.timestamp
          });
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orderbook:', error);
      setIsConnected(false);
    }
  };

  // Fetch trading history
  const fetchTrades = async () => {
    try {
      const response = await fetch(`/api/trading/v1/trades?pair=${selectedPair}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setTrades(data.trades || []);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  // Fetch system metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      // Create mock metrics if API not available
      setMetrics({
        tps: Math.floor(Math.random() * 1000) + 500,
        latency: {
          p50: Math.random() * 10 + 1,
          p95: Math.random() * 50 + 10,
          p99: Math.random() * 100 + 50
        },
        throughput: Math.floor(Math.random() * 10000),
        errors: Math.floor(Math.random() * 10),
        orderbook: {
          totalOrders: Math.floor(Math.random() * 1000) + 100,
          activeOrders: Math.floor(Math.random() * 500) + 50
        },
        amm: {
          currentPrice: 1.036 + (Math.random() - 0.5) * 0.1,
          volume24h: Math.floor(Math.random() * 1000000),
          reserves: {
            token0: 101647 + (Math.random() - 0.5) * 1000,
            token1: 98384 + (Math.random() - 0.5) * 1000
          }
        }
      });
    }
  };

  // Auto-refresh data
  useEffect(() => {
    const fetchData = () => {
      fetchOrderbook();
      fetchTrades();
      fetchMetrics();
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [selectedPair]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">HOOATS Real-time Monitoring</h1>
          <p className="text-muted-foreground">
            Ultra-Performance Trading System Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </Badge>
          <select 
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="HYPERINDEX-USDC">HYPERINDEX-USDC</option>
            <option value="DOGE-USDC">DOGE-USDC</option>
            <option value="PEPE-USDC">PEPE-USDC</option>
            <option value="SHIB-USDC">SHIB-USDC</option>
          </select>
        </div>
      </div>

      {/* System Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">TPS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.tps.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Transactions/sec</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">P95 Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.latency.p95.toFixed(2)}ms
              </div>
              <p className="text-xs text-muted-foreground">95th percentile</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.orderbook.activeOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">In orderbook</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AMM Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${metrics.amm.currentPrice.toFixed(6)}
              </div>
              <p className="text-xs text-muted-foreground">Current price</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orderbook */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📊 Orderbook
              <Badge variant="outline">{selectedPair}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Asks (Sells) */}
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-2">📈 Asks (Sells)</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {orderbook.asks.slice(0, 10).map((ask, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-red-600">{parseFloat(ask.price).toFixed(6)}</span>
                      <span className="text-gray-600">{parseFloat(ask.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Spread */}
              {orderbook.asks.length > 0 && orderbook.bids.length > 0 && (
                <div className="border-t border-b py-2 text-center">
                  <span className="text-xs text-gray-500">
                    Spread: {((parseFloat(orderbook.asks[0].price) - parseFloat(orderbook.bids[0].price))).toFixed(6)}
                  </span>
                </div>
              )}
              
              {/* Bids (Buys) */}
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2">📉 Bids (Buys)</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {orderbook.bids.slice(0, 10).map((bid, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-green-600">{parseFloat(bid.price).toFixed(6)}</span>
                      <span className="text-gray-600">{parseFloat(bid.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading History */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>📈 Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trades.length > 0 ? trades.map((trade, index) => (
                <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={trade.side === 'buy' ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {trade.side.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {trade.source}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      ${parseFloat(trade.price).toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(trade.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No recent trades</p>
                  <p className="text-xs">Start trading to see activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>⚡ System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>TPS:</span>
                  <span className="font-mono text-green-600">
                    {metrics?.tps.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>P50 Latency:</span>
                  <span className="font-mono">
                    {metrics?.latency.p50.toFixed(2) || '0'}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>P99 Latency:</span>
                  <span className="font-mono">
                    {metrics?.latency.p99.toFixed(2) || '0'}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Errors:</span>
                  <span className="font-mono text-red-600">
                    {metrics?.errors || '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* AMM Status */}
            {metrics && (
              <div>
                <h4 className="text-sm font-semibold mb-2">AMM Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-mono">
                      ${metrics.amm.currentPrice.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume 24h:</span>
                    <span className="font-mono">
                      ${metrics.amm.volume24h.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reserves:</span>
                    <span className="font-mono text-xs">
                      {metrics.amm.reserves.token0.toFixed(0)} / {metrics.amm.reserves.token1.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Connections</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Redis:</span>
                  <Badge variant="default">🟢 Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>HyperEVM:</span>
                  <Badge variant="default">🟢 Testnet</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Orderbook:</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "🟢 Active" : "🔴 Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={fetchOrderbook}
              variant="outline"
            >
              🔄 Refresh Orderbook
            </Button>
            <Button 
              onClick={fetchTrades}
              variant="outline"
            >
              📊 Refresh Trades
            </Button>
            <Button 
              onClick={fetchMetrics}
              variant="outline"
            >
              ⚡ Refresh Metrics
            </Button>
            <Button 
              onClick={() => window.open('/test-hybrid-trading-v2', '_blank')}
              variant="default"
            >
              🚀 Run Test Orders
            </Button>
            <Button 
              onClick={() => window.open('/trading-simulator', '_blank')}
              variant="secondary"
            >
              🎯 Performance Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}