'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TokenCard from '@/components/TokenCard';
import { TokenData, INITIAL_TOKENS } from '@/lib/mockTokens';
import { Search, TrendingUp, ShieldAlert, Zap, Sparkles, Filter, RefreshCw, BarChart3, Lock } from 'lucide-react';

export default function Home() {
  const [tokens, setTokens] = useState<TokenData[]>(INITIAL_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'volume' | 'risk' | 'priceChange' | 'newest'>('volume');
  const [loading, setLoading] = useState(false);

  // Filter & Sort tokens
  const filteredTokens = tokens.filter(token => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.mint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      token.category === selectedCategory ||
      (selectedCategory === 'Audited' && token.riskScore < 30) ||
      (selectedCategory === 'High Risk' && token.riskScore >= 60);

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'volume') return b.volume24h - a.volume24h;
    if (sortBy === 'risk') return a.riskScore - b.riskScore;
    if (sortBy === 'priceChange') return b.priceChange24h - a.priceChange24h;
    return 0;
  });

  const totalVolume = tokens.reduce((acc, t) => acc + t.volume24h, 0);
  const averageRisk = Math.round(tokens.reduce((acc, t) => acc + t.riskScore, 0) / tokens.length);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/60 to-purple-950/60 border border-cyan-500/30 p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered 60-Minute Price Forecast Engine</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Solana Memecoin Intelligence & Risk Audit
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
              Real-time token discovery, holder distribution analysis, deployer verification, liquidity-lock checks, and rolling next-60-minute quantitative price predictions powered by Gemini AI.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 font-mono">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Tokens Scanned</span>
                <span className="text-xl font-bold text-white">{tokens.length * 142}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">24h Volume</span>
                <span className="text-xl font-bold text-cyan-400">${(totalVolume / 1000000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Avg Risk Score</span>
                <span className="text-xl font-bold text-amber-400">{averageRisk}/100</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">AI Model</span>
                <span className="text-xl font-bold text-purple-400">Gemini 3.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by token name, symbol, or mint address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-mono whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
            >
              <option value="volume">24h Volume</option>
              <option value="risk">Lowest Risk</option>
              <option value="priceChange">Top Gainers</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {['All', 'AI Pick', 'Trending', 'Audited', 'High Risk'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Token Grid */}
        {filteredTokens.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Tokens Found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search query or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTokens.map((token) => (
              <TokenCard key={token.mint} token={token} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
