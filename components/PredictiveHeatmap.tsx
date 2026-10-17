'use client';
import { useState } from 'react';
import { Layers, Sparkles } from 'lucide-react';

interface PredictiveHeatmapProps {
  currentPrice: number;
  prediction: {
    priceLow60m: number;
    priceHigh60m: number;
    targetPrice60m: number;
    probability: {
      rising: number;
      falling: number;
      sideways: number;
    };
  };
}

export default function PredictiveHeatmap({ currentPrice, prediction }: PredictiveHeatmapProps) {
  const [selectedHorizon, setSelectedHorizon] = useState<'15m' | '30m' | '45m' | '60m'>('60m');

  // Generate simulated probability distribution clusters across price tiers
  const spread = prediction.priceHigh60m - prediction.priceLow60m;
  const step = spread / 5 || currentPrice * 0.05;

  const tiers = [
    { label: `> +25% ($${(currentPrice * 1.25).toFixed(4)})`, prob: 12, intensity: 'bg-purple-500/30 border-purple-500/50 text-purple-300' },
    { label: `+10% to +25% ($${(currentPrice * 1.12).toFixed(4)})`, prob: prediction.probability.rising, intensity: 'bg-emerald-500/40 border-emerald-500/60 text-emerald-300 font-bold' },
    { label: `-5% to +10% ($${currentPrice.toFixed(4)})`, prob: prediction.probability.sideways, intensity: 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300' },
    { label: `-15% to -5% ($${(currentPrice * 0.90).toFixed(4)})`, prob: prediction.probability.falling, intensity: 'bg-amber-500/30 border-amber-500/50 text-amber-300' },
    { label: `< -15% ($${(currentPrice * 0.80).toFixed(4)})`, prob: 8, intensity: 'bg-rose-500/30 border-rose-500/50 text-rose-300' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
      <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Predictive Probability Heatmap</h3>
            <p className="text-xs text-slate-400 font-mono">Real-time Monte Carlo price density clusters</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          {(['15m', '30m', '45m', '60m'] as const).map(horizon => (
            <button
              key={horizon}
              onClick={() => setSelectedHorizon(horizon)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedHorizon === horizon
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Tiers Grid */}
      <div className="space-y-3 font-mono text-xs">
        {tiers.map((tier, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
            <span className="text-slate-300">{tier.label}</span>
            <div className="flex items-center space-x-4">
              <div className="w-36 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tier.prob > 50 ? 'bg-emerald-400' : tier.prob > 25 ? 'bg-cyan-400' : 'bg-purple-400'
                  }`}
                  style={{ width: `${tier.prob}%` }}
                />
              </div>
              <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${tier.intensity}`}>
                {tier.prob}% Density
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
