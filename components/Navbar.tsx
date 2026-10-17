'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, TrendingUp, Bell, Bookmark, Zap, Activity, Wallet, Cpu, Compass, Award, MessageSquareCode, Sliders } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = () => {
    setWalletConnected(true);
    setWalletAddress('Gk8s...3v9x');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-xl tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  DEXINTELLIGENCE
                </span>
                <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                  Solana AI Engine v3.5
                </span>
              </div>
            </Link>

            {/* Network Badge */}
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Solana Mainnet (390ms TPS)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </Link>
            <Link
              href="/prediction-studio"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/prediction-studio'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Quant Studio</span>
            </Link>
            <Link
              href="/discovery"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/discovery'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discovery</span>
            </Link>
            <Link
              href="/whales"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/whales'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Whales</span>
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/leaderboard'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </Link>
            <Link
              href="/research"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/research'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>AI Research</span>
            </Link>
            <Link
              href="/watchlist"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/watchlist'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watchlist</span>
            </Link>
            <Link
              href="/alerts"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === '/alerts'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alerts</span>
            </Link>
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rug Audit Active</span>
            </div>

            {walletConnected ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-200">{walletAddress}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
