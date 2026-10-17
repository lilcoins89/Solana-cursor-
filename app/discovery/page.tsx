'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TokenCard from '@/components/TokenCard';
import { INITIAL_TOKENS, TokenData } from '@/lib/mockTokens';
import { Compass, Filter, Sparkles, SlidersHorizontal, Flame } from 'lucide-react';

export default function DiscoveryPage() {
  const [maxAge, setMaxAge] = useState<string>('all');
  const [minLiquidity, setMinLiquidity] = useState<number>(0);
  const [minVolume, setMinVolume] = useState<number>(0);
  const [minConfidence, setMinConfidence] = useState<number>(0);

  const discoveredTokens = INITIAL_TOKENS.filter(token => {
    if (token.liquidity < minLiquidity) return false;
    if (token.volume24h < minVolume) return false;
    if (token.prediction && token.prediction.confidence < minConfidence) return false;
    return true;
  }).sort((a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Smart Token Discovery Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">Automated Solana Memecoin Discovery</h1>
          <p className="text-slate-400 text-sm mt-1">Filter newly launched tokens by liquidity depth, volume velocity, holder distribution, and AI confidence rank.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-2">Min Liquidity (${minLiquidity.toLocaleString()})</label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={minLiquidity}
              onChange={(e) => setMinLiquidity(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Min 24h Volume (${minVolume.toLocaleString()})</label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={minVolume}
              onChange={(e) => setMinVolume(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Min AI Confidence ({minConfidence}%)</label>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoveredTokens.map(token => (
            <TokenCard key={token.mint} token={token} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
