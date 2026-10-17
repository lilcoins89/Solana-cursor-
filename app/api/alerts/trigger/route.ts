import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenSymbol, previousDirection, newDirection, targetPrice, confidence } = body;

    // Check if prediction shifted from bearish (or sideways) to bullish
    const isBullishShift = previousDirection !== 'bullish' && newDirection === 'bullish';

    if (isBullishShift) {
      // Simulate sending Telegram alert & browser push notification payload
      const alertPayload = {
        title: `🚨 BULLISH SHIFT ALERT: $${tokenSymbol}`,
        message: `Prediction shifted to BULLISH with ${confidence}% confidence! Target 60m price: $${targetPrice}`,
        timestamp: new Date().toISOString(),
        channel: 'Telegram & Browser Push'
      };

      console.log('[ALERT ENGINE TRIGGERED]:', alertPayload);

      return NextResponse.json({
        success: true,
        triggered: true,
        alert: alertPayload
      });
    }

    return NextResponse.json({
      success: true,
      triggered: false,
      reason: 'Prediction shift did not meet bearish-to-bullish criteria'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
