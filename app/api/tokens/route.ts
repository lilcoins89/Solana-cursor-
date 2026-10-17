import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerClient();
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .gte('created_at', fortyEightHoursAgo)
    .lt('created_at', twentyFourHoursAgo)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: 'Unable to load live tokens' }, { status: 500 });
  return NextResponse.json({
    success: true,
    window: { from: fortyEightHoursAgo, to: twentyFourHoursAgo },
    tokens: data ?? [],
  });
}
