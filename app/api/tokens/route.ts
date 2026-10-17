import { NextResponse } from 'next/server';
import { INITIAL_TOKENS } from '@/lib/mockTokens';

export async function GET() {
  return NextResponse.json({
    success: true,
    tokens: INITIAL_TOKENS,
    updatedAt: new Date().toISOString()
  });
}
