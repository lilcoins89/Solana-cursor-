import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;
    const { data: token, error } = await createServerClient().from('tokens').select('*').eq('mint', mint).maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: 'Unable to load token' }, { status: 500 });
    }

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
