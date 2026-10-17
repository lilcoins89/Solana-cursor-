import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('tokens').select('*').order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: 'Unable to load live tokens' }, { status: 500 });
  return NextResponse.json({ success: true, tokens: data ?? [] });
}
