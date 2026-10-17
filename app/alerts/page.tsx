'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bell, ShieldAlert, Sparkles, Plus, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { id: 1, name: 'BONKAI Price Surge > +20%', type: 'Price', threshold: '+20% in 1h', enabled: true, channel: 'Browser Push' },
    { id: 2, name: 'High Risk Rug Detection Alert', type: 'Risk Audit', threshold: 'Risk Score > 70', enabled: true, channel: 'Webhook / Telegram' },
    { id: 3, name: 'AI Prediction Shift (Bullish > 85%)', type: 'AI Forecast', threshold: 'Confidence >= 85%', enabled: false, channel: 'Browser Push' },
  ]);

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>Autonomous Alert Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">Configurable Alert Rules & Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Set custom triggers for price movements, risk score spikes, and AI forecast shifts.</p>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  alert.enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{alert.name}</h3>
                  <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 mt-1">
                    <span>Type: {alert.type}</span>
                    <span>•</span>
                    <span>Threshold: {alert.threshold}</span>
                    <span>•</span>
                    <span>Channel: {alert.channel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                  alert.enabled ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {alert.enabled ? 'Active' : 'Paused'}
                </span>
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {alert.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
