import { NextRequest, NextResponse } from 'next/server';
import { listAssets } from '@/backend-api-reference/services/assets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assets = await listAssets();

    // Return only necessary fields for Launch page
    const simplifiedAssets = assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      marketType: asset.marketType,
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
