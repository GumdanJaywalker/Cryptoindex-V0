import { NextRequest, NextResponse } from 'next/server';
import { getCandles } from '@/backend-api-reference/services/hypercore';
import { calcBasketFromCandles } from '@/backend-api-reference/services/basket';
import { resolvePresetRange } from '@/backend-api-reference/utils/candlePresets';
import { BasketCalculateRequestSchema } from '@/backend-api-reference/schemas/http';
import type { Position } from '@/backend-api-reference/types/domain';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parsed = BasketCalculateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { assets, interval, from, to } = parsed.data;

    // Check weight sum
    const weightSum = assets.reduce((acc, asset) => acc + asset.weight, 0);
    if (Math.abs(weightSum - 1) > 1e-6) {
      return NextResponse.json(
        {
          error: 'Sum of weights must equal 1.0 (±1e-6)',
          details: { sum: weightSum },
        },
        { status: 400 }
      );
    }

    // Resolve time range
    const range = resolvePresetRange({ interval, from, to });

    // Fetch candles for all assets in parallel
    const inputs = await Promise.all(
      assets.map(async (asset) => ({
        symbol: asset.symbol,
        weight: asset.weight,
        position: asset.position as Position,
        leverage: asset.leverage ?? 1,
        candles: await getCandles(asset.symbol, interval, range.from, range.to),
      }))
    );

    // Calculate basket performance
    const result = calcBasketFromCandles(inputs);

    return NextResponse.json({
      meta: {
        interval,
        request: { from: range.from, to: range.to },
        coinNormalization: 'SYMBOL-PERP->SYMBOL',
        leverageApplied: true,
        source: 'hyperliquid.info.candleSnapshot',
        rangeMs: range.durationMs,
        presetDurationMs: range.presetDurationMs,
        staleWhileRevalidate: true,
      },
      basketPriceHistory: result.basketPriceHistory,
      performance: {
        returnPct: result.basketReturnPct,
        maxDrawdown: result.maxDrawdown,
      },
      assets: result.assets,
    });
  } catch (error) {
    console.error('[API /launch/basket-calculate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate basket' },
      { status: 500 }
    );
  }
}
