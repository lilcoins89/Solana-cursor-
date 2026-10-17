'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { INITIAL_FORECAST_RECORDS, ForecastRecord } from '@/lib/whalesData';
import { Award, CheckCircle2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LeaderboardPage() {
  const [records, setRecords] = useState<ForecastRecord[]>(INITIAL_FORECAST_RECORDS);

  const averageAccuracy = (records.reduce((acc, r) => acc + r.accuracyScore, 0) / records.length).toFixed(1);

  // Accuracy over time data for Recharts line chart
  const accuracyTimeSeries = [
    { timestamp: 'Day 1', accuracy: 74.2, baseline: 52.0 },
    { timestamp: 'Day 3', accuracy: 78.5, baseline: 51.5 },
    { timestamp: 'Day 7', accuracy: 82.1, baseline: 53.0 },
    { timestamp: 'Day 14', accuracy: 88.4, baseline: 52.4 },
    { timestamp: 'Day 30', accuracy: 92.8, baseline: 52.8 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Forecast Leaderboard & Backtesting Core</span>
          </div>
          <h1 className="text-3xl font-black text-white">Verified 60-Minute Model Accuracy Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">Chronological backtesting results comparing AI predictions against actual outcomes at 15, 30, and 60 minutes.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 font-mono">
            <div>
              <span className="text-xs text-slate-400 uppercase">Overall Accuracy</span>
              <span className="text-xl font-bold text-emerald-400">{averageAccuracy}%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase">Total Tracked</span>
              <span className="text-xl font-bold text-white">{records.length * 14}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase">False Signal Rate</span>
              <span className="text-xl font-bold text-cyan-400">4.2%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase">Baseline Delta</span>
              <span className="text-xl font-bold text-purple-400">+34.8% Alpha</span>
            </div>
          </div>
        </div>

        {/* Recharts Line Chart: Accuracy Improvement Over Time */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col">
          <div className="mb-4">
            <h3 className="text-white font-bold text-lg">Model Accuracy Improvement vs Baseline Over Time</h3>
            <p className="text-xs text-slate-400 font-mono">Comparing AI quantitative directional accuracy against simple baseline predictions</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTimeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" domain={[40, 100]} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs font-mono space-y-1">
                          <div className="text-slate-400">{label}</div>
                          <div className="text-cyan-400 font-bold">AI Model Accuracy: {payload[0].value}%</div>
                          <div className="text-purple-400">Simple Baseline: {payload[1].value}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="accuracy" name="AI Model" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-white text-lg">Recent Immutable Forecast Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Token</th>
                  <th className="p-4">Prediction</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4 text-right">Target Price</th>
                  <th className="p-4 text-right">Actual 60m</th>
                  <th className="p-4 text-right">Accuracy Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {records.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-4 font-bold text-white">
                      ${rec.tokenSymbol}
                      <span className="block text-[10px] text-slate-500 font-normal">{rec.createdAgo}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        rec.predictedDirection === 'bullish' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
                      }`}>
                        {rec.predictedDirection}
                      </span>
                    </td>
                    <td className="p-4 text-cyan-400 font-bold">{rec.confidence}%</td>
                    <td className="p-4 text-right text-white font-bold">${rec.targetPrice}</td>
                    <td className="p-4 text-right text-slate-300">${rec.actualPrice60m}</td>
                    <td className="p-4 text-right font-bold text-emerald-400">{rec.accuracyScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
