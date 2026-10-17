'use client';
import { TokenData } from '@/lib/mockTokens';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface TokenCardProps {
  token: TokenData;
}

export default function TokenCard({ token }: TokenCardProps) {
  const isBullish = token.prediction?.direction === 'bullish';
  const isBearish = token.prediction?.direction === 'bearish';

  const riskColor =
    token.riskScore < 25
      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
      : token.riskScore < 60
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
      : 'text-rose-400 bg-rose-950/40 border-rose-500/30';

  return (
    <Link
      href={`/token/${token.mint}`}
      className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background Glow on Hover */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Header: Icon, Name, Symbol, Risk Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={token.icon}
              alt={token.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {token.name}
                </h3>
                {token.isVerified && (
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                    VERIFIED
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                ${token.symbol} • {token.createdAgo}
              </span>
            </div>
          </div>

          {/* Risk Score */}
          <div className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-semibold flex items-center space-x-1 ${riskColor}`}>
            {token.riskScore < 30 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>Risk: {token.riskScore}/100</span>
          </div>
        </div>

        {/* Price & Changes */}
        <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Price</span>
            <span className="text-lg font-bold text-white font-mono">
              ${token.price < 0.001 ? token.price.toExponential(4) : token.price.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">1h / 24h Change</span>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-bold font-mono flex items-center ${
                  token.priceChange1h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h}%
              </span>
              <span
                className={`text-xs font-mono ${
                  token.priceChange24h >= 0 ? 'text-emerald-400/80' : 'text-rose-400/80'
                }`}
              >
                ({token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%)
              </span>
            </div>
          </div>
        </div>

        {/* AI 1-Hour Prediction Pill */}
        {token.prediction && (
          <div className="mb-4 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider flex items-center space-x-1">
                  <span>AI 60m Forecast</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-bold">{token.prediction.confidence}% Conf</span>
                </div>
                <div className="text-xs font-bold text-white capitalize flex items-center space-x-1">
                  <span className={isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'}>
                    {token.prediction.direction}
                  </span>
                  <span className="text-slate-400 font-mono">
                    ({token.prediction.expectedMovePercent >= 0 ? '+' : ''}{token.prediction.expectedMovePercent}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Target 60m</span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                ${token.prediction.targetPrice60m < 0.001 ? token.prediction.targetPrice60m.toExponential(3) : token.prediction.targetPrice60m.toFixed(4)}
              </span>
            </div>
          </div>
        )}

        {/* Key Metrics: Volume, Liquidity */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            <span>Vol 24h: </span>
            <span className="text-slate-200 font-semibold">${(token.volume24h / 1000).toFixed(1)}k</span>
          </div>
          <div className="text-right">
            <span>Liquidity: </span>
            <span className="text-slate-200 font-semibold">${(token.liquidity / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
        <span>View Deep Intelligence & Audit</span>
        <span>→</span>
      </div>
    </Link>
  );
}
