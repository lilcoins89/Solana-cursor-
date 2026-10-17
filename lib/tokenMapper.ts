import type { TokenData } from '@/lib/mockTokens'

type DbToken = Record<string, unknown>

export function mapDbToken(token: DbToken): TokenData {
  return {
    mint: String(token.mint), name: String(token.name), symbol: String(token.symbol), icon: String(token.icon ?? ''),
    price: Number(token.price), priceChange1h: Number(token.price_change_1h ?? 0), priceChange24h: Number(token.price_change_24h ?? 0),
    volume24h: Number(token.volume_24h ?? 0), liquidity: Number(token.liquidity ?? 0), marketCap: Number(token.market_cap ?? 0),
    holdersCount: Number(token.holders_count ?? 0), createdAgo: new Date(String(token.created_at ?? Date.now())).toLocaleDateString(),
    riskScore: Number(token.risk_score ?? 0), mintAuthority: Boolean(token.mint_authority), freezeAuthority: Boolean(token.freeze_authority),
    lpLocked: Boolean(token.lp_locked), lpLockedPercent: Number(token.lp_locked_percent ?? 0), top10HoldersPercent: Number(token.top10_holders_percent ?? 0),
    deployerSol: Number(token.deployer_sol ?? 0), rugChecked: Boolean(token.rug_checked), isVerified: Boolean(token.is_verified),
    category: (String(token.category ?? 'Trending') as TokenData['category']), candles: [], holders: [],
  }
}
