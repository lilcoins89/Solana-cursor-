'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TokenCard from '@/components/TokenCard';
import { INITIAL_TOKENS, TokenData } from '@/lib/mockTokens';
import { Bookmark, Bell, Plus, Trash2 } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<TokenData[]>([INITIAL_TOKENS[0], INITIAL_TOKENS[1], INITIAL_TOKENS[2]]);
  const [newMint, setNewMint] = useState('');

  const addToken = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_TOKENS.find(t => t.mint.toLowerCase() === newMint.trim().toLowerCase());
    if (found && !watchlist.some(w => w.mint === found.mint)) {
      setWatchlist([...watchlist, found]);
      setNewMint('');
    }
  };

  const removeToken = (mint: string) => {
    setWatchlist(watchlist.filter(w => w.mint !== mint));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Persistent Intelligence Watchlist</span>
            </div>
            <h1 className="text-3xl font-black text-white">Saved Memecoin Watchlist</h1>
            <p className="text-slate-400 text-sm mt-1">Track your favorite Solana tokens, AI predictions, and risk scores in real-time.</p>
          </div>

          <form onSubmit={addToken} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter token mint address..."
              value={newMint}
              onChange={(e) => setNewMint(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-cyan-500 w-64"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-xl text-xs font-mono transition-all flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Your Watchlist is Empty</h3>
            <p className="text-sm text-slate-400">Add token mint addresses above or browse the scanner to save tokens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((token) => (
              <div key={token.mint} className="relative group">
                <TokenCard token={token} />
                <button
                  onClick={() => removeToken(token.mint)}
                  className="absolute top-4 right-4 p-2 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-400 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
