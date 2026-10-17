import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_TOKENS } from '@/lib/mockTokens';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;
    const token = INITIAL_TOKENS.find(t => t.mint === mint);

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      token
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
