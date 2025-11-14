import { NextRequest, NextResponse } from 'next/server';
import { listAssets } from '@/backend-api-reference/services/assets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assets = await listAssets();

    // Return fields needed for Launch page AssetSearchModal
    const simplifiedAssets = assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      marketType: asset.marketType,
      markPx: asset.markPx,
      prevDayPx: asset.prevDayPx,
      change24hPct: asset.change24hPct,
      dayNtlVlm: asset.dayNtlVlm,
    }));

    return NextResponse.json(simplifiedAssets);
  } catch (error) {
    console.error('[API /launch/assets] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
