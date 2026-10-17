export interface WhaleTx {
  id: string;
  wallet: string;
  label: string;
  tokenSymbol: string;
  tokenMint: string;
  type: 'BUY' | 'SELL';
  amountSol: number;
  tokenAmount: number;
  timestamp: string;
  impactScore: 'High' | 'Medium' | 'Low';
}

export const INITIAL_WHALE_TXS: WhaleTx[] = [
  {
    id: 'wtx-1',
    wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    label: 'Smart Money Alpha #4',
    tokenSymbol: 'BONKAI',
    tokenMint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    type: 'BUY',
    amountSol: 340.5,
    tokenAmount: 7950000,
    timestamp: '2 mins ago',
    impactScore: 'High'
  },
  {
    id: 'wtx-2',
    wallet: '3mK9s...2pQz',
    label: 'Known Insider Cluster',
    tokenSymbol: 'NEURON',
    tokenMint: 'So11111111111111111111111111111111111111112',
    type: 'BUY',
    amountSol: 185.0,
    tokenAmount: 13000000,
    timestamp: '7 mins ago',
    impactScore: 'High'
  },
  {
    id: 'wtx-3',
    wallet: '7xKXtg...9vBn',
    label: 'CEX Arbitrage Bot',
    tokenSymbol: 'WIFGPT',
    tokenMint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    type: 'SELL',
    amountSol: 420.0,
    tokenAmount: 228000,
    timestamp: '14 mins ago',
    impactScore: 'Medium'
  },
  {
    id: 'wtx-4',
    wallet: 'Dev...Rug',
    label: 'Deployer Wallet',
    tokenSymbol: 'SHIBAINU',
    tokenMint: 'PumpTokenRugRisk999999999999999999999999999',
    type: 'SELL',
    amountSol: 45.2,
    tokenAmount: 37600000,
    timestamp: '22 mins ago',
    impactScore: 'High'
  }
];

export interface ForecastRecord {
  id: string;
  tokenSymbol: string;
  tokenMint: string;
  predictedDirection: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  targetPrice: number;
  actualPrice15m: number;
  actualPrice30m: number;
  actualPrice60m: number;
  status: 'Accurate' | 'Missed' | 'Pending Evaluation';
  accuracyScore: number; // 0-100%
  createdAgo: string;
}

export const INITIAL_FORECAST_RECORDS: ForecastRecord[] = [
  {
    id: 'fc-1',
    tokenSymbol: 'BONKAI',
    tokenMint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    predictedDirection: 'bullish',
    confidence: 84,
    targetPrice: 0.00005320,
    actualPrice15m: 0.00004450,
    actualPrice30m: 0.00004720,
    actualPrice60m: 0.00005290,
    status: 'Accurate',
    accuracyScore: 94.5,
    createdAgo: '1h ago'
  },
  {
    id: 'fc-2',
    tokenSymbol: 'NEURON',
    tokenMint: 'So11111111111111111111111111111111111111112',
    predictedDirection: 'bullish',
    confidence: 91,
    targetPrice: 0.0198,
    actualPrice15m: 0.0152,
    actualPrice30m: 0.0175,
    actualPrice60m: 0.0192,
    status: 'Accurate',
    accuracyScore: 96.8,
    createdAgo: '2h ago'
  },
  {
    id: 'fc-3',
    tokenSymbol: 'POOP',
    tokenMint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
    predictedDirection: 'bearish',
    confidence: 62,
    targetPrice: 0.039,
    actualPrice15m: 0.044,
    actualPrice30m: 0.042,
    actualPrice60m: 0.040,
    status: 'Accurate',
    accuracyScore: 88.2,
    createdAgo: '3h ago'
  },
  {
    id: 'fc-4',
    tokenSymbol: 'SHIBAINU',
    tokenMint: 'PumpTokenRugRisk999999999999999999999999999',
    predictedDirection: 'bearish',
    confidence: 98,
    targetPrice: 0.0000002,
    actualPrice15m: 0.0000008,
    actualPrice30m: 0.0000004,
    actualPrice60m: 0.0000002,
    status: 'Accurate',
    accuracyScore: 99.1,
    createdAgo: '4h ago'
  }
];
