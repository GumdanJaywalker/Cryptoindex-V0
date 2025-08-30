import { NextRequest, NextResponse } from 'next/server';

// Optional Supabase client - fallback to mock data if not configured
let supabase: any = null;

try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
} catch (error) {
  console.log('Supabase not configured, using mock data for trades');
}

interface HybridTrade {
  id: string;
  pair: string;
  price: string;
  amount: string;
  side: 'buy' | 'sell';
  source: 'AMM' | 'Orderbook';
  timestamp: number;
  orderId?: string;
}

// GET /api/trading/v1/trades - 하이브리드 거래 내역 조회 (AMM + Orderbook)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair') || 'HYPERINDEX-USDC';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (limit > 200) {
      return NextResponse.json(
        { success: false, error: 'Limit cannot exceed 200' },
        { status: 400 }
      );
    }

    console.log(`📊 Fetching hybrid trades for ${pair}, limit: ${limit}`);

    // Try to get real trades from Ultra-Performance Orderbook first
    let trades: HybridTrade[] = [];
    
    try {
      const path = require('path');
      const orderbookPath = path.join(process.cwd(), 'hooats-core', 'ultra-performance-orderbook-converted.js');
      const { UltraPerformanceOrderbook } = require(orderbookPath);
      const ultraOrderbook = UltraPerformanceOrderbook.getInstance();
      
      // Try to get recent trades from Redis if available
      console.log('Attempting to get real trades from Ultra-Performance Orderbook...');
      
      // Get real trades from the orderbook system
      const recentTrades = await ultraOrderbook.getRecentTrades('HYPERINDEX-USDC', limit);
      if (recentTrades && recentTrades.length > 0) {
        console.log(`✅ Found ${recentTrades.length} real trades from Ultra-Performance Orderbook`);
        trades = recentTrades.map(trade => ({
          id: trade.id || `trade_${trade.timestamp}`,
          pair: trade.pair || pair,
          price: trade.price?.toString() || '1.036',
          amount: trade.amount?.toString() || '100',
          side: trade.side || 'buy',
          source: 'Orderbook',
          timestamp: trade.timestamp || Date.now(),
          orderId: trade.orderId
        }));
      } else {
        console.log('No real trades found, generating realistic simulation');
      }
      
    } catch (error) {
      console.log('Ultra-Performance Orderbook not available for trades');
    }
    
    // Generate realistic recent trades based on time
    const basePrice = 1.036;
    const now = Date.now();
    const mockTrades: HybridTrade[] = [];
    
    // Create 5 recent trades with realistic price movement
    for (let i = 0; i < 5; i++) {
      const timeOffset = i * 120000; // 2 minutes apart
      const priceWave = Math.sin((now - timeOffset) / 30000) * 0.002;
      const randomVariation = (Math.random() - 0.5) * 0.001;
      const price = basePrice + priceWave + randomVariation;
      
      mockTrades.push({
        id: `live_trade_${now}_${i}`,
        pair,
        price: price.toFixed(6),
        amount: (Math.random() * 400 + 50).toFixed(2),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        source: Math.random() > 0.3 ? 'Orderbook' : 'AMM',
        timestamp: now - timeOffset,
        orderId: Math.random() > 0.3 ? `order_${i + 1}` : undefined
      });
    }
    
    /* Original static mock data:
    const staticTrades: HybridTrade[] = [
      {
        id: `trade_${Date.now()}_1`,
        pair,
        price: '1.035412',
        amount: '150.75',
        side: 'buy',
        source: 'Orderbook',
        timestamp: Date.now() - 120000,
        orderId: 'order_001'
      },
      {
        id: `trade_${Date.now()}_2`,
        pair,
        price: '1.035200',
        amount: '300.50',
        side: 'sell',
        source: 'AMM',
        timestamp: Date.now() - 240000
      },
      {
        id: `trade_${Date.now()}_3`,
        pair,
        price: '1.034980',
        amount: '75.25',
        side: 'buy',
        source: 'Orderbook',
        timestamp: Date.now() - 360000,
        orderId: 'order_002'
      },
      {
        id: `trade_${Date.now()}_4`,
        pair,
        price: '1.034750',
        amount: '500.00',
        side: 'sell',
        source: 'AMM',
        timestamp: Date.now() - 480000
      },
      {
        id: `trade_${Date.now()}_5`,
        pair,
        price: '1.034600',
        amount: '200.30',
        side: 'buy',
        source: 'Orderbook',
        timestamp: Date.now() - 600000,
        orderId: 'order_003'
      }
    ];
    */

    // Use the generated trades directly (already have realistic variation)
    const enhancedTrades = mockTrades.slice(0, limit);

    // If we have Supabase configured, try to get real trades
    if (supabase) {
      try {
        const { data: realTrades } = await supabase
          .from('trade_history')
          .select('*')
          .eq('pair', pair)
          .not('filled_amount', 'eq', '0')
          .order('created_at', { ascending: false })
          .limit(Math.floor(limit * 0.5));

        if (realTrades && realTrades.length > 0) {
          console.log(`📊 Found ${realTrades.length} real trades from Supabase`);
          // Use real trades instead of mock data
          return NextResponse.json({
            success: true,
            trades: realTrades.slice(0, limit),
            count: realTrades.length,
            pair,
            source: 'Supabase'
          });
        }
      } catch (error) {
        console.log('Supabase query failed, using mock data:', error);
      }
    }

    return NextResponse.json({
      success: true,
      trades: enhancedTrades,
      count: enhancedTrades.length,
      pair,
      source: 'MockData'
    });

  } catch (error) {
    console.error('Trades fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch trades',
        trades: [],
        count: 0,
        pair: request.url.includes('pair=') ? 
          new URL(request.url).searchParams.get('pair') : 
          'HYPERINDEX-USDC'
      },
      { status: 500 }
    );
  }
}