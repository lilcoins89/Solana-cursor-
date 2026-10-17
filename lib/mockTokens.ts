export interface TokenData {
  mint: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holdersCount: number;
  createdAgo: string;
  riskScore: number; // 0 (safe) to 100 (high rug risk)
  mintAuthority: boolean;
  freezeAuthority: boolean;
  lpLocked: boolean;
  lpLockedPercent: number;
  top10HoldersPercent: number;
  deployerSol: number;
  rugChecked: boolean;
  isVerified: boolean;
  category: 'Trending' | 'New' | 'Audited' | 'High Risk' | 'AI Pick';
  prediction?: {
    direction: 'bullish' | 'bearish' | 'sideways';
    confidence: number; // 0-100%
    expectedMovePercent: number;
    priceLow60m: number;
    priceHigh60m: number;
    targetPrice60m: number;
    probability: {
      rising: number;
      falling: number;
      sideways: number;
    };
    keyFactors: string[];
    riskWarnings: string[];
    timeline: {
      t15m: number;
      t30m: number;
      t45m: number;
      t60m: number;
    };
    updatedAt: string;
  };
  candles: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  holders: {
    address: string;
    percentage: number;
    isDev: boolean;
    isContract: boolean;
    label?: string;
  }[];
}

export const INITIAL_TOKENS: TokenData[] = [
  {
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    name: 'Bonk AI',
    symbol: 'BONKAI',
    icon: 'https://picsum.photos/seed/bonkai/200/200',
    price: 0.00004281,
    priceChange1h: 14.5,
    priceChange24h: 88.4,
    volume24h: 4829100,
    liquidity: 1250000,
    marketCap: 42800000,
    holdersCount: 18450,
    createdAgo: '4h ago',
    riskScore: 18,
    mintAuthority: false,
    freezeAuthority: false,
    lpLocked: true,
    lpLockedPercent: 98.5,
    top10HoldersPercent: 12.4,
    deployerSol: 45.2,
    rugChecked: true,
    isVerified: true,
    category: 'AI Pick',
    prediction: {
      direction: 'bullish',
      confidence: 84,
      expectedMovePercent: 28.5,
      priceLow60m: 0.00004050,
      priceHigh60m: 0.00005600,
      targetPrice60m: 0.00005320,
      probability: { rising: 72, falling: 15, sideways: 13 },
      keyFactors: [
        'Massive buy wall on Raydium AMM with 450 SOL net inflow in last 30m',
        'Telegram community engagement surge (+340% mentions in Alpha chats)',
        'Zero mint authority and 98.5% LP burned/locked'
      ],
      riskWarnings: ['Moderate volatility expected around resistance at $0.000055'],
      timeline: {
        t15m: 0.00004450,
        t30m: 0.00004720,
        t45m: 0.00005010,
        t60m: 0.00005320
      },
      updatedAt: 'Just now'
    },
    candles: [
      { time: '18:00', open: 0.000022, high: 0.000029, low: 0.000021, close: 0.000028, volume: 120000 },
      { time: '18:15', open: 0.000028, high: 0.000035, low: 0.000027, close: 0.000034, volume: 340000 },
      { time: '18:30', open: 0.000034, high: 0.000039, low: 0.000032, close: 0.000038, volume: 510000 },
      { time: '18:45', open: 0.000038, high: 0.000044, low: 0.000037, close: 0.000042, volume: 890000 },
    ],
    holders: [
      { address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', percentage: 3.2, isDev: false, isContract: true, label: 'Raydium Pool' },
      { address: 'H9k2p...8xLq', percentage: 2.1, isDev: true, isContract: false, label: 'Dev Wallet (Vested)' },
      { address: '3mK9s...2pQz', percentage: 1.8, isDev: false, isContract: false, label: 'Whale #1' },
    ]
  },
  {
    mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    name: 'Dogwifhat AI',
    symbol: 'WIFGPT',
    icon: 'https://picsum.photos/seed/wifgpt/200/200',
    price: 1.84,
    priceChange1h: -2.3,
    priceChange24h: 32.1,
    volume24h: 18900000,
    liquidity: 4200000,
    marketCap: 184000000,
    holdersCount: 45200,
    createdAgo: '12d ago',
    riskScore: 12,
    mintAuthority: false,
    freezeAuthority: false,
    lpLocked: true,
    lpLockedPercent: 100,
    top10HoldersPercent: 18.5,
    deployerSol: 120.0,
    rugChecked: true,
    isVerified: true,
    category: 'Trending',
    prediction: {
      direction: 'sideways',
      confidence: 68,
      expectedMovePercent: 3.2,
      priceLow60m: 1.78,
      priceHigh60m: 1.92,
      targetPrice60m: 1.86,
      probability: { rising: 45, falling: 30, sideways: 25 },
      keyFactors: [
        'Consolidating near local resistance after 32% daily expansion',
        'Order book shows strong bid support at $1.75 level',
        'Normal mean reversion phase following funding rate cooling'
      ],
      riskWarnings: ['Broader Solana market macro pullback could test $1.72 support'],
      timeline: {
        t15m: 1.83,
        t30m: 1.85,
        t45m: 1.84,
        t60m: 1.86
      },
      updatedAt: '2m ago'
    },
    candles: [
      { time: '18:00', open: 1.50, high: 1.85, low: 1.48, close: 1.80, volume: 2100000 },
      { time: '18:15', open: 1.80, high: 1.90, low: 1.78, close: 1.85, volume: 1800000 },
      { time: '18:30', open: 1.85, high: 1.88, low: 1.81, close: 1.83, volume: 1200000 },
      { time: '18:45', open: 1.83, high: 1.86, low: 1.82, close: 1.84, volume: 950000 },
    ],
    holders: [
      { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', percentage: 6.4, isDev: false, isContract: true, label: 'Orca Whirlpool' },
      { address: '7xKXtg...9vBn', percentage: 3.1, isDev: false, isContract: false, label: 'CEX Hot Wallet' },
    ]
  },
  {
    mint: 'So11111111111111111111111111111111111111112',
    name: 'Neural AI Sol',
    symbol: 'NEURON',
    icon: 'https://picsum.photos/seed/neuron/200/200',
    price: 0.0142,
    priceChange1h: 24.8,
    priceChange24h: 145.0,
    volume24h: 9200000,
    liquidity: 2100000,
    marketCap: 14200000,
    holdersCount: 8900,
    createdAgo: '8h ago',
    riskScore: 35,
    mintAuthority: false,
    freezeAuthority: false,
    lpLocked: true,
    lpLockedPercent: 95.0,
    top10HoldersPercent: 24.1,
    deployerSol: 15.0,
    rugChecked: true,
    isVerified: true,
    category: 'AI Pick',
    prediction: {
      direction: 'bullish',
      confidence: 91,
      expectedMovePercent: 42.0,
      priceLow60m: 0.0135,
      priceHigh60m: 0.0210,
      targetPrice60m: 0.0198,
      probability: { rising: 82, falling: 10, sideways: 8 },
      keyFactors: [
        'Viral agentic framework launch trending #1 on X / Twitter',
        'Unusual volume acceleration with 3x buy transactions over sells',
        'Smart money wallet cluster accumulation detected'
      ],
      riskWarnings: ['High top 10 holder concentration (24.1%), watch for whale take-profits'],
      timeline: {
        t15m: 0.0155,
        t30m: 0.0172,
        t45m: 0.0188,
        t60m: 0.0198
      },
      updatedAt: 'Just now'
    },
    candles: [
      { time: '18:00', open: 0.005, high: 0.009, low: 0.004, close: 0.008, volume: 800000 },
      { time: '18:15', open: 0.008, high: 0.012, low: 0.007, close: 0.011, volume: 1500000 },
      { time: '18:30', open: 0.011, high: 0.015, low: 0.010, close: 0.013, volume: 2400000 },
      { time: '18:45', open: 0.013, high: 0.016, low: 0.012, close: 0.0142, volume: 3100000 },
    ],
    holders: [
      { address: 'A1b2C...3d4e', percentage: 5.2, isDev: true, isContract: false, label: 'Deployer Multisig' },
      { address: 'Ray...Pool', percentage: 4.8, isDev: false, isContract: true, label: 'Raydium AMM' }
    ]
  },
  {
    mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
    name: 'Poopcat',
    symbol: 'POOP',
    icon: 'https://picsum.photos/seed/poopcat/200/200',
    price: 0.045,
    priceChange1h: -5.4,
    priceChange24h: 12.3,
    volume24h: 3100000,
    liquidity: 890000,
    marketCap: 45000000,
    holdersCount: 14200,
    createdAgo: '3d ago',
    riskScore: 28,
    mintAuthority: false,
    freezeAuthority: false,
    lpLocked: true,
    lpLockedPercent: 90.0,
    top10HoldersPercent: 21.0,
    deployerSol: 8.5,
    rugChecked: true,
    isVerified: true,
    category: 'Trending',
    prediction: {
      direction: 'bearish',
      confidence: 62,
      expectedMovePercent: -12.0,
      priceLow60m: 0.038,
      priceHigh60m: 0.046,
      targetPrice60m: 0.039,
      probability: { rising: 20, falling: 65, sideways: 15 },
      keyFactors: [
        'Momentum stalling with declining RSI on 15m timeframe',
        'Sell pressure exceeding buys by 1.8x over past 45 minutes',
        'Liquidity thinning on secondary pools'
      ],
      riskWarnings: ['Risk of cascading stop-loss triggers below $0.042 support'],
      timeline: {
        t15m: 0.044,
        t30m: 0.042,
        t45m: 0.040,
        t60m: 0.039
      },
      updatedAt: '5m ago'
    },
    candles: [
      { time: '18:00', open: 0.040, high: 0.049, low: 0.039, close: 0.048, volume: 900000 },
      { time: '18:15', open: 0.048, high: 0.050, low: 0.045, close: 0.046, volume: 800000 },
      { time: '18:30', open: 0.046, high: 0.047, low: 0.044, close: 0.045, volume: 750000 },
      { time: '18:45', open: 0.045, high: 0.046, low: 0.043, close: 0.045, volume: 650000 },
    ],
    holders: [
      { address: 'Pool...99', percentage: 7.1, isDev: false, isContract: true, label: 'Raydium Pool' }
    ]
  },
  {
    mint: 'PumpTokenRugRisk999999999999999999999999999',
    name: 'MoonShiba Safe',
    symbol: 'SHIBAINU',
    icon: 'https://picsum.photos/seed/shibasafe/200/200',
    price: 0.0000012,
    priceChange1h: -42.0,
    priceChange24h: -68.5,
    volume24h: 120000,
    liquidity: 14000,
    marketCap: 1200000,
    holdersCount: 420,
    createdAgo: '25m ago',
    riskScore: 92,
    mintAuthority: true,
    freezeAuthority: true,
    lpLocked: false,
    lpLockedPercent: 0,
    top10HoldersPercent: 84.5,
    deployerSol: 0.5,
    rugChecked: true,
    isVerified: false,
    category: 'High Risk',
    prediction: {
      direction: 'bearish',
      confidence: 98,
      expectedMovePercent: -85.0,
      priceLow60m: 0.0000001,
      priceHigh60m: 0.0000012,
      targetPrice60m: 0.0000002,
      probability: { rising: 2, falling: 95, sideways: 3 },
      keyFactors: [
        'Active MINT and FREEZE authorities enabled by deployer',
        'Zero liquidity locked in AMM; creator holds 84.5% of supply',
        'Immediate honeypot / rugpull indicators triggered'
      ],
      riskWarnings: ['HIGH DANGER: Unverified contract with active mint authority and unlocked liquidity.'],
      timeline: {
        t15m: 0.0000008,
        t30m: 0.0000005,
        t45m: 0.0000003,
        t60m: 0.0000002
      },
      updatedAt: '1m ago'
    },
    candles: [
      { time: '18:00', open: 0.000005, high: 0.000006, low: 0.000002, close: 0.000004, volume: 50000 },
      { time: '18:15', open: 0.000004, high: 0.000004, low: 0.000001, close: 0.000002, volume: 40000 },
      { time: '18:30', open: 0.000002, high: 0.000002, low: 0.0000008, close: 0.0000015, volume: 20000 },
      { time: '18:45', open: 0.0000015, high: 0.0000015, low: 0.000001, close: 0.0000012, volume: 10000 },
    ],
    holders: [
      { address: 'Dev...Rug', percentage: 65.0, isDev: true, isContract: false, label: 'Deployer Wallet (Unlocked)' },
      { address: 'Dev...Alt', percentage: 19.5, isDev: true, isContract: false, label: 'Insider Wallet #2' }
    ]
  },
  {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    name: 'Jupiter AI Agent',
    symbol: 'JUPAGENT',
    icon: 'https://picsum.photos/seed/jupagent/200/200',
    price: 1.25,
    priceChange1h: 8.2,
    priceChange24h: 45.6,
    volume24h: 24500000,
    liquidity: 6800000,
    marketCap: 125000000,
    holdersCount: 31000,
    createdAgo: '5d ago',
    riskScore: 14,
    mintAuthority: false,
    freezeAuthority: false,
    lpLocked: true,
    lpLockedPercent: 100,
    top10HoldersPercent: 15.2,
    deployerSol: 250.0,
    rugChecked: true,
    isVerified: true,
    category: 'AI Pick',
    prediction: {
      direction: 'bullish',
      confidence: 88,
      expectedMovePercent: 18.4,
      priceLow60m: 1.21,
      priceHigh60m: 1.52,
      targetPrice60m: 1.48,
      probability: { rising: 78, falling: 14, sideways: 8 },
      keyFactors: [
        'Integration with Jupiter Perps router announced for automated trading agents',
        'Consolidation breakout on 1-hour chart with rising volume profile',
        'Institutional whale accumulation noted by on-chain heuristics'
      ],
      riskWarnings: ['Resistance at $1.50 psychological level'],
      timeline: {
        t15m: 1.28,
        t30m: 1.34,
        t45m: 1.41,
        t60m: 1.48
      },
      updatedAt: 'Just now'
    },
    candles: [
      { time: '18:00', open: 0.95, high: 1.18, low: 0.94, close: 1.15, volume: 5000000 },
      { time: '18:15', open: 1.15, high: 1.24, low: 1.12, close: 1.20, volume: 6200000 },
      { time: '18:30', open: 1.20, high: 1.26, low: 1.18, close: 1.22, volume: 7100000 },
      { time: '18:45', open: 1.22, high: 1.28, low: 1.21, close: 1.25, volume: 6200000 },
    ],
    holders: [
      { address: 'JUP...Pool', percentage: 8.5, isDev: false, isContract: true, label: 'Jupiter Liquidity Vault' },
      { address: 'Whale...99', percentage: 4.1, isDev: false, isContract: false, label: 'Alpha Fund' }
    ]
  }
];
