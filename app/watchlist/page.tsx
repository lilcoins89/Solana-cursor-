'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TokenCard from '@/components/TokenCard'
import { createClient } from '@/lib/supabase/client'
import { mapDbToken } from '@/lib/tokenMapper'
import type { TokenData } from '@/lib/mockTokens'
import { Bookmark, Plus, Trash2 } from 'lucide-react'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<TokenData[]>([])
  const [newMint, setNewMint] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [message, setMessage] = useState('Loading your live watchlist…')
  const supabase = createClient()

  async function loadWatchlist() {
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    setUserId(user?.id ?? null)
    if (!user) { setMessage('Sign in to save and sync tokens across devices.'); return }
    const { data, error } = await supabase.from('watchlists').select('mint, tokens(*)').eq('user_id', user.id)
    if (error) { setMessage('Unable to load your watchlist.'); return }
    setWatchlist((data ?? []).map((row: { tokens: Record<string, unknown> | null }) => row.tokens ? mapDbToken(row.tokens) : null).filter((token: TokenData | null): token is TokenData => token !== null))
    setMessage('')
  }

  useEffect(() => {
    void (async () => { await loadWatchlist() })()
    const channel = supabase.channel('watchlist-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'watchlists' }, () => { void loadWatchlist() })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tokens' }, () => { void loadWatchlist() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function addToken(e: React.FormEvent) {
    e.preventDefault(); setMessage('')
    if (!userId) { setMessage('Sign in before adding tokens.'); return }
    const mint = newMint.trim()
    const { data: token } = await supabase.from('tokens').select('mint').eq('mint', mint).maybeSingle()
    if (!token) { setMessage('That mint is not in the live token index.'); return }
    const { error } = await supabase.from('watchlists').insert({ user_id: userId, mint })
    if (error && error.code !== '23505') setMessage('Could not add this token.')
    else { setNewMint(''); await loadWatchlist() }
  }

  async function removeToken(mint: string) {
    if (!userId) return
    await supabase.from('watchlists').delete().eq('user_id', userId).eq('mint', mint)
    await loadWatchlist()
  }

  return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white"><Navbar /><main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8"><div><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3"><Bookmark className="w-3.5 h-3.5" /><span>Live Supabase Watchlist</span></div><h1 className="text-3xl font-black text-white">Saved Memecoin Watchlist</h1><p className="text-slate-400 text-sm mt-1">Synced across devices with realtime token updates.</p></div><form onSubmit={addToken} className="flex items-center space-x-2"><input aria-label="Token mint address" type="text" placeholder="Enter live token mint…" value={newMint} onChange={(e) => setNewMint(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-cyan-500 w-64" /><button type="submit" className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-xl text-xs font-mono transition-all flex items-center space-x-1"><Plus className="w-4 h-4" /><span>Add</span></button></form></div>
    {message && <p className="mb-6 text-center text-sm text-slate-400">{message}</p>}
    {watchlist.length === 0 && !message ? <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800"><Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" /><h3 className="text-lg font-bold text-white mb-2">Your Watchlist is Empty</h3><p className="text-sm text-slate-400">Add a mint from the live token index above.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{watchlist.map((token) => <div key={token.mint} className="relative group"><TokenCard token={token} /><button onClick={() => removeToken(token.mint)} className="absolute top-4 right-4 p-2 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-400 rounded-xl transition-all opacity-0 group-hover:opacity-100" title="Remove from watchlist"><Trash2 className="w-4 h-4" /></button></div>)}</div>}
  </main><Footer /></div>
}
