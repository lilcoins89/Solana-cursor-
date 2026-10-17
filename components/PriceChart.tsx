'use client';
import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PriceChartProps {
  candles: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  predictionTimeline?: {
    t15m: number;
    t30m: number;
    t45m: number;
    t60m: number;
  };
  currentPrice: number;
}

export default function PriceChart({ candles, predictionTimeline, currentPrice }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '24H' | 'AI Forecast'>('1H');

  // Format chart data based on candles + optional AI forecast points
  let chartData = candles.map(c => ({
    time: c.time,
    price: c.close,
    volume: c.volume,
    type: 'Historical'
  }));

  if (timeframe === 'AI Forecast' && predictionTimeline) {
    chartData = [
      ...chartData,
      { time: 'Now', price: currentPrice, volume: 0, type: 'Current' },
      { time: '+15m', price: predictionTimeline.t15m, volume: 0, type: 'Forecast' },
      { time: '+30m', price: predictionTimeline.t30m, volume: 0, type: 'Forecast' },
      { time: '+45m', price: predictionTimeline.t45m, volume: 0, type: 'Forecast' },
      { time: '+60m', price: predictionTimeline.t60m, volume: 0, type: 'Forecast' },
    ];
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col h-[450px]">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center space-x-2">
            <span>Price & AI 60-Min Forecast Chart</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {timeframe === 'AI Forecast' ? 'Showing rolling next-60-minute ML forecast trajectory' : 'Historical AMM pool price action'}
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['1H', '4H', '24H', 'AI Forecast'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
            <YAxis
              stroke="#64748b"
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(val) => (val < 0.001 ? val.toExponential(2) : val.toFixed(4))}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs font-mono">
                      <div className="text-slate-400 mb-1">{label} ({data.type || 'Point'})</div>
                      <div className="text-cyan-400 font-bold text-sm">
                        ${data.price < 0.001 ? data.price.toExponential(4) : data.price.toFixed(6)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
