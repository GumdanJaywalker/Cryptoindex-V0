import { NextRequest, NextResponse } from 'next/server';
import { calcBasketFromCandles, type Candle, type Position } from '@/lib/services/basketCalculation';

// Hyperliquid API endpoint
const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

async function getCandles(
  symbol: string,
  interval: '1h' | '1d',
  startTime: number,
  endTime: number
): Promise<Candle[]> {
  try {
    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'candleSnapshot',
        req: {
          coin: symbol.toUpperCase(),
          interval,
          startTime,
          endTime,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candles for ${symbol}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn(`No candles data for ${symbol}`);
      return [];
    }

    const candles: Candle[] = data.map((row: any) => ({
      t: Number(row.t),
      o: Number(row.o),
      h: Number(row.h),
      l: Number(row.l),
      c: Number(row.c),
      v: Number(row.v),
    })).filter((candle: Candle) =>
      Number.isFinite(candle.t) &&
      Number.isFinite(candle.c) &&
      Number.isFinite(candle.o) &&
      Number.isFinite(candle.h) &&
      Number.isFinite(candle.l)
    );

    candles.sort((a, b) => a.t - b.t);
    return candles;
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assets, interval = '1h', from, to } = body;

    if (!Array.isArray(assets) || assets.length === 0) {
      return NextResponse.json(
        { error: 'Assets array is required' },
        { status: 400 }
      );
    }

    // Calculate time range
    const endTime = to || Date.now();
    const startTime = from || (interval === '1h' ? endTime - 24 * 60 * 60 * 1000 : endTime - 7 * 24 * 60 * 60 * 1000);

    // Fetch candles for all assets in parallel
    const candlePromises = assets.map(async (asset: any) => ({
      symbol: asset.symbol,
      weight: asset.weight / 100, // Convert percentage to decimal
      position: (asset.side || asset.position || 'long') as Position,
      leverage: asset.leverage || 1,
      candles: await getCandles(asset.symbol, interval, startTime, endTime),
    }));

    const inputs = await Promise.all(candlePromises);

    // Validate that we have candles for all assets
    const missingCandles = inputs.filter(input => input.candles.length === 0);
    if (missingCandles.length > 0) {
      console.warn('Some assets have no candle data:', missingCandles.map(i => i.symbol));
    }

    // Filter out assets with no candles
    const validInputs = inputs.filter(input => input.candles.length > 0);

    if (validInputs.length === 0) {
      return NextResponse.json(
        { error: 'No candle data available for any assets' },
        { status: 503 }
      );
    }

    // Calculate basket performance
    const result = calcBasketFromCandles(validInputs);

    return NextResponse.json({
      meta: {
        interval,
        request: { from: startTime, to: endTime },
        source: 'hyperliquid.info.candleSnapshot',
      },
      basketPriceHistory: result.basketPriceHistory,
      performance: {
        returnPct: result.basketReturnPct,
        maxDrawdown: result.maxDrawdown,
      },
      assets: result.assets,
    });
  } catch (error: any) {
    console.error('Basket calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate basket' },
      { status: 500 }
    );
  }
}
