import { NextRequest, NextResponse } from 'next/server';

// In-memory immutable forecast history store
const FORECAST_HISTORY_STORE: any[] = [
  {
    id: 'fh-101',
    tokenMint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    tokenSymbol: 'BONKAI',
    direction: 'bullish',
    confidence: 84,
    targetPrice: 0.00005320,
    liquidity: 1250000,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Evaluated',
    actualOutcome: 'Hit Target (+28.5%)'
  },
  {
    id: 'fh-102',
    tokenMint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    tokenSymbol: 'WIFGPT',
    direction: 'sideways',
    confidence: 68,
    targetPrice: 1.86,
    liquidity: 4200000,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'Pending 60m',
    actualOutcome: 'In Progress'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    history: FORECAST_HISTORY_STORE
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord = {
      id: `fh-${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
      status: 'Pending 60m',
      actualOutcome: 'In Progress'
    };

    FORECAST_HISTORY_STORE.unshift(newRecord);

    return NextResponse.json({
      success: true,
      record: newRecord
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
