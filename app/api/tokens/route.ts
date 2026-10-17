import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

type DexProfile = {
  chainId?: string;
  tokenAddress?: string;
  icon?: string;
  description?: string | null;
};

type DexPair = {
  chainId?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  priceUsd?: string;
  priceChange?: { h1?: number; h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  marketCap?: number;
  fdv?: number;
  pairCreatedAt?: number;
};

const DEX_API = 'https://api.dexscreener.com';

function asArray<T>(payload: T | T[]): T[] {
  return Array.isArray(payload) ? payload : [payload];
}

async function fetchDexJson<T>(path: string): Promise<T> {
  const response = await fetch(`${DEX_API}${path}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`Dex Screener request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

async function syncRecentSolanaProfiles(supabase: ReturnType<typeof createServerClient>) {
  const profilesPayload = await fetchDexJson<DexProfile | DexProfile[]>('/token-profiles/recent-updates/v1');
  const profiles = asArray(profilesPayload).filter((profile) => profile.chainId === 'solana' && profile.tokenAddress);
  if (!profiles.length) return;

  const addresses = profiles.map((profile) => profile.tokenAddress).join(',');
  const pairsPayload = await fetchDexJson<{ pairs?: DexPair[] }>(`/latest/dex/tokens/${addresses}`);
  const pairs = (pairsPayload.pairs ?? []).filter((pair) => pair.chainId === 'solana' && pair.baseToken?.address);
  const profileByAddress = new Map(profiles.map((profile) => [profile.tokenAddress, profile]));
  const bestPairs = new Map<string, DexPair>();

  for (const pair of pairs) {
    const address = pair.baseToken?.address;
    if (!address) continue;
    const existing = bestPairs.get(address);
    if (!existing || Number(pair.liquidity?.usd ?? 0) > Number(existing.liquidity?.usd ?? 0)) bestPairs.set(address, pair);
  }

  const rows = Array.from(bestPairs, ([mint, pair]) => {
    const profile = profileByAddress.get(mint);
    const createdAt = pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toISOString() : new Date().toISOString();
    return {
      mint,
      name: pair.baseToken?.name || 'Unknown token',
      symbol: pair.baseToken?.symbol || mint.slice(0, 6),
      icon: profile?.icon || null,
      price: Number(pair.priceUsd ?? 0),
      price_change_1h: Number(pair.priceChange?.h1 ?? 0),
      price_change_24h: Number(pair.priceChange?.h24 ?? 0),
      volume_24h: Number(pair.volume?.h24 ?? 0),
      liquidity: Number(pair.liquidity?.usd ?? 0),
      market_cap: Number(pair.marketCap ?? pair.fdv ?? 0),
      created_at: createdAt,
      category: 'Trending',
      source: 'dexscreener',
      updated_at: new Date().toISOString(),
    };
  });

  if (rows.length) {
    const { error } = await supabase.from('tokens').upsert(rows, { onConflict: 'mint' });
    if (error) throw error;
  }
}

export async function GET() {
  const supabase = createServerClient({ serviceRole: true });
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  try {
    await syncRecentSolanaProfiles(supabase);
  } catch (error) {
    console.error('[v0] Dex Screener sync failed:', error);
  }

  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('source', 'dexscreener')
    .gte('created_at', fortyEightHoursAgo)
    .lt('created_at', twentyFourHoursAgo)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: 'Unable to load live tokens' }, { status: 500 });
  return NextResponse.json({
    success: true,
    source: 'dexscreener',
    window: { from: fortyEightHoursAgo, to: twentyFourHoursAgo },
    tokens: data ?? [],
  });
}
