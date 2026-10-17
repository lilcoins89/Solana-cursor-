'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { INITIAL_WHALE_TXS, WhaleTx } from '@/lib/whalesData';
import { Activity, ArrowUpRight, ArrowDownRight, ShieldCheck, Wallet } from 'lucide-react';

export default function WhalesPage() {
  const [txs, setTxs] = useState<WhaleTx[]>(INITIAL_WHALE_TXS);
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filteredTxs = txs.filter(tx => filterType === 'ALL' || tx.type === filterType);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Smart-Money & Whale Tracking Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">Live Whale Transactions & Cluster Activity</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time monitoring of known insider clusters, whale accumulation, and large AMM swaps.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6">
          {(['ALL', 'BUY', 'SELL'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                filterType === type
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type} Transactions
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Wallet Cluster</th>
                  <th className="p-4">Token</th>
                  <th className="p-4">Action</th>
                  <th className="p-4 text-right">Amount (SOL)</th>
                  <th className="p-4 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-4 text-slate-400">{tx.timestamp}</td>
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{tx.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{tx.wallet.slice(0, 8)}...</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                        ${tx.tokenSymbol}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                        tx.type === 'BUY' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tx.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      {tx.amountSol} SOL
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        tx.impactScore === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {tx.impactScore} Impact
                      </span>
                    </td>
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
