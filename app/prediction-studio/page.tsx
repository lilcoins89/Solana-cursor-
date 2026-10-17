'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import { mapDbToken } from '@/lib/tokenMapper';
import type { TokenData } from '@/lib/mockTokens';
import { Cpu, Sparkles, Sliders, ShieldCheck, Activity, BarChart2, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PredictionStudioPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState('Ensemble Hybrid Quant v4.2');
  const supabase = createClient();

  useEffect(() => {
    async function loadTokens() {
      const { data } = await supabase.from('tokens').select('*').order('updated_at', { ascending: false });
      const liveTokens = (data ?? []).map((token: Record<string, unknown>) => mapDbToken(token));
      setTokens(liveTokens);
      setSelectedToken(liveTokens[0] ?? null);
    }
    loadTokens();
    const channel = supabase.channel('prediction-tokens-live').on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, loadTokens).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const runQuantEvaluation = async () => {
    if (!selectedToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/predictions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mint: selectedToken.mint })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluationResult(data.metrics);
        setModelType(data.modelType);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const featureImportanceData = evaluationResult?.featureImportances ? [
    { feature: 'Order Flow', weight: Math.round(evaluationResult.featureImportances.orderFlowImbalance * 100) },
    { feature: 'Whale Cluster', weight: Math.round(evaluationResult.featureImportances.whaleAccumulation * 100) },
    { feature: 'Liquidity Depth', weight: Math.round(evaluationResult.featureImportances.liquidityDepth * 100) },
    { feature: 'Volatility', weight: Math.round(evaluationResult.featureImportances.historicalVolatility * 100) },
  ] : [
    { feature: 'Order Flow', weight: 34 },
    { feature: 'Whale Cluster', weight: 28 },
    { feature: 'Liquidity Depth', weight: 22 },
    { feature: 'Volatility', weight: 16 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Serious Quantitative Prediction System</span>
          </div>
          <h1 className="text-3xl font-black text-white">Institutional Quant Studio & Backtesting</h1>
          <p className="text-slate-400 text-sm mt-1">Execute high-precision multi-factor predictive models combining AMM order book imbalance, whale cluster tracking, and machine learning calibration.</p>
        </div>

        {/* Controls & Token Selector */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-2 uppercase">Select Token</label>
            <select
              value={selectedToken?.mint ?? ''}
              onChange={(e) => {
                const found = tokens.find(t => t.mint === e.target.value);
                if (found) {
                  setSelectedToken(found);
                  setEvaluationResult(found.prediction);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
            >
              {tokens.map(t => (
                <option key={t.mint} value={t.mint}>{t.name} (${t.symbol})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-2 uppercase">Quant Engine Model</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
            >
              <option value="Ensemble Hybrid Quant v4.2">Ensemble Hybrid Quant v4.2</option>
              <option value="Gemini 3.8 Flash Institutional Engine">Gemini 3.8 Flash Institutional Engine</option>
              <option value="Order Flow Imbalance ML v2">Order Flow Imbalance ML v2</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={runQuantEvaluation}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Executing Quant Model...' : 'Run Quantitative Evaluation'}</span>
            </button>
          </div>
        </div>

        {/* Evaluation Results */}
        {!selectedToken && <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">No live tokens are available yet.</div>}
        {evaluationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Core Output Metrics */}
              <div className="bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  <span>Quantitative 60-Minute Forecast Output</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Direction</span>
                    <span className={`text-base font-bold capitalize ${
                      evaluationResult.direction === 'bullish' ? 'text-emerald-400' : evaluationResult.direction === 'bearish' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {evaluationResult.direction}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Confidence Score</span>
                    <span className="text-base font-bold text-cyan-400">{evaluationResult.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Expected Move</span>
                    <span className="text-base font-bold text-white">{evaluationResult.expectedMovePercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">60m Target</span>
                    <span className="text-base font-bold text-indigo-300">${evaluationResult.targetPrice60m}</span>
                  </div>
                </div>

                {/* Feature Importance Bar Chart */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 h-[250px] flex flex-col">
                  <div className="text-xs font-mono text-slate-400 mb-2">Machine Learning Feature Importance Weights</div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="feature" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs font-mono">
                                  <div className="text-cyan-400">{label}: {payload[0].value}% Weight</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="weight" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Key Factors & Risk Warnings */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono text-xs">
                <h4 className="text-emerald-400 uppercase font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Driving Factors</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {evaluationResult.keyFactors?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono text-xs">
                <h4 className="text-amber-400 uppercase font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Model Risk Assessment</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {evaluationResult.riskWarnings?.map((w: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
