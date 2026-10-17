import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint') === 'recent' 
      ? 'https://api.dexscreener.com/token-profiles/recent-updates/v1' 
      : 'https://api.dexscreener.com/token-profiles/latest/v1';

    const res = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      // Fallback response matching DexScreener WS / HTTP schema if upstream is unreachable
      return NextResponse.json({
        limit: 90,
        data: [
          {
            url: "https://dexscreener.com/solana/bonkai",
            chainId: "solana",
            tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            icon: "https://picsum.photos/seed/bonkai/200/200",
            header: "https://picsum.photos/seed/bonkai-header/800/200",
            description: "Bonk AI Solana Memecoin Intelligence Hub",
            links: [
              { type: "twitter", label: "Twitter", url: "https://twitter.com" },
              { type: "telegram", label: "Telegram", url: "https://t.me" }
            ]
          }
        ]
      });
    }

    const json = await res.json();
    return NextResponse.json(json);

  } catch (error: any) {
    console.error('DexScreener API error:', error);
    return NextResponse.json({
      limit: 90,
      data: [
        {
          url: "https://dexscreener.com/solana/fallback",
          chainId: "solana",
          tokenAddress: "So11111111111111111111111111111111111111112",
          icon: "https://picsum.photos/seed/fallback/200/200",
          header: "https://picsum.photos/seed/fallback-header/800/200",
          description: "Fallback Token Profile",
          links: []
        }
      ]
    });
  }
}
