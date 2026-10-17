'use client';
import { useState, use, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceChart from '@/components/PriceChart';
import PredictiveHeatmap from '@/components/PredictiveHeatmap';
import { INITIAL_TOKENS, TokenData } from '@/lib/mockTokens';
import { 
  ShieldCheck, ShieldAlert, Sparkles, TrendingUp, TrendingDown, 
  Lock, Unlock, CheckCircle2, AlertTriangle, Send, Cpu, ArrowRightLeft, Users, Bell, Target, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function TokenDetailPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = use(params);
  
  const token = INITIAL_TOKENS.find(t => t.mint === mint) || INITIAL_TOKENS[0];
  const [prediction, setPrediction] = useState<any>(token.prediction);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'model', content: `Hello! I am DexAI. Ask me anything about ${token.name}'s risk profile, liquidity structure, or 60-minute price forecast.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [swapAmount, setSwapAmount] = useState('1');
  const [alertStatus, setAlertStatus] = useState<string | null>(null);

  // Price Target Alert Threshold state
  const [targetPriceInput, setTargetPriceInput] = useState(String(token.price * 1.15));
  const [priceAlertActive, setPriceAlertActive] = useState(false);
  const [priceAlertTriggered, setPriceAlertTriggered] = useState(false);

  const predictionRef = useRef(prediction);
  useEffect(() => {
    predictionRef.current = prediction;
  }, [prediction]);

  // Check if data is sufficient
  const hasSufficientData = token.liquidity >= 20000 && token.volume24h >= 50000 && token.holdersCount >= 100;

  const fetchAiPrediction = async (isBackground = false) => {
    if (!token) return;
    if (!isBackground) setLoadingPrediction(true);

    try {
      const prevDirection = predictionRef.current?.direction;
      const res = await fetch(`/api/tokens/${token.mint}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenMint: token.mint })
      });
      const data = await res.json();
      if (data.success && data.prediction) {
        const newPred = data.prediction;
        setPrediction(newPred);

        // Check user-defined price target threshold
        if (priceAlertActive && !priceAlertTriggered) {
          const targetNum = parseFloat(targetPriceInput);
          if (!isNaN(targetNum) && token.price >= targetNum) {
            setPriceAlertTriggered(true);
            setAlertStatus(`🎯 PRICE TARGET REACHED: $${token.symbol} hit your target of $${targetNum}!`);
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification(`Price Target Reached: $${token.symbol}`, {
                  body: `Token price is now $${token.price}, crossing your target of $${targetNum}!`
                });
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
              }
            }
          }
        }

        // Save forecast to immutable history store
        await fetch('/api/forecasts/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenMint: token.mint,
            tokenSymbol: token.symbol,
            direction: newPred.direction,
            confidence: newPred.confidence,
            targetPrice: newPred.targetPrice60m,
            liquidity: token.liquidity
          })
        }).catch(() => {});

        // Check for bearish-to-bullish prediction shift -> Trigger Telegram / Browser alert
        if (prevDirection && prevDirection !== 'bullish' && newPred.direction === 'bullish') {
          const alertRes = await fetch('/api/alerts/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tokenSymbol: token.symbol,
              previousDirection: prevDirection,
              newDirection: newPred.direction,
              targetPrice: newPred.targetPrice60m,
              confidence: newPred.confidence
            })
          });
          const alertData = await alertRes.json();
          if (alertData.triggered) {
            setAlertStatus(`Telegram & Browser Push Alert Triggered: ${token.symbol} shifted to BULLISH!`);
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(`Bullish Shift Alert: $${token.symbol}`, {
                body: `Prediction shifted to BULLISH with ${newPred.confidence}% confidence!`
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch prediction:', e);
    } finally {
      if (!isBackground) setLoadingPrediction(false);
    }
  };

  // Automatic data refresh & forecast re-evaluation interval
  useEffect(() => {
    if (!autoRefreshActive) return;
    const interval = setInterval(() => {
      fetchAiPrediction(true);
    }, 45000); // every 45s

    return () => clearInterval(interval);
  }, [autoRefreshActive]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading || !token) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          tokenMint: token.mint,
          history: chatMessages
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', content: 'Connection error with DexAI intelligence core.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const isBullish = prediction?.direction === 'bullish';
  const isBearish = prediction?.direction === 'bearish';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Alert Notification Banner if triggered */}
        {alertStatus && (
          <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs font-mono text-emerald-300">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{alertStatus}</span>
            </div>
            <button onClick={() => setAlertStatus(null)} className="text-emerald-500 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Token Header Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <img
                src={token.icon}
                alt={token.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-white">{token.name}</h1>
                  <span className="text-sm font-mono bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    ${token.symbol}
                  </span>
                  {token.isVerified && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
                  <span>Mint: {token.mint.slice(0, 8)}...{token.mint.slice(-6)}</span>
                  <span>•</span>
                  <span>Created {token.createdAgo}</span>
                </div>
              </div>
            </div>

            {/* Price & Change */}
            <div className="flex items-center space-x-6 bg-slate-950/80 px-6 py-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Current Price</span>
                <span className="text-2xl font-bold font-mono text-white">
                  ${token.price < 0.001 ? token.price.toExponential(4) : token.price.toFixed(4)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase font-mono block">24h Change</span>
                <span className={`text-lg font-bold font-mono flex items-center justify-end ${
                  token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Column: Chart & AI Forecast */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <PriceChart 
              candles={token.candles} 
              predictionTimeline={hasSufficientData ? prediction?.timeline : undefined} 
              currentPrice={token.price} 
            />

            {/* AI 1-Hour Prediction Engine Card */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">AI 60-Minute Price Forecast</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {autoRefreshActive ? '🟢 Auto-refresh active (45s)' : '⚪ Auto-refresh paused'} • Immutable history logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAutoRefreshActive(!autoRefreshActive)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all ${
                      autoRefreshActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {autoRefreshActive ? 'Auto-Refresh ON' : 'Paused'}
                  </button>
                  <button
                    onClick={() => fetchAiPrediction(false)}
                    disabled={loadingPrediction}
                    className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-xl transition-all flex items-center space-x-2"
                  >
                    <Cpu className={`w-3.5 h-3.5 ${loadingPrediction ? 'animate-spin' : ''}`} />
                    <span>{loadingPrediction ? 'Refreshing...' : 'Refresh Now'}</span>
                  </button>
                </div>
              </div>

              {!hasSufficientData ? (
                <div className="p-8 text-center bg-slate-950/80 rounded-2xl border border-amber-500/30">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <h4 className="font-bold text-white text-base mb-1">Insufficient Data</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Liquidity ($ {token.liquidity.toLocaleString()}) or Volume is below verified threshold. No fabricated confidence scores displayed.
                  </p>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  {/* Forecast Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Direction</span>
                      <span className={`text-base font-bold font-mono capitalize ${
                        isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {prediction.direction} ({prediction.expectedMovePercent >= 0 ? '+' : ''}{prediction.expectedMovePercent}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Confidence</span>
                      <span className="text-base font-bold font-mono text-cyan-400">{prediction.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">60m Target</span>
                      <span className="text-base font-bold font-mono text-white">
                        ${prediction.targetPrice60m < 0.001 ? prediction.targetPrice60m.toExponential(3) : prediction.targetPrice60m.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Probability</span>
                      <div className="text-xs font-mono text-slate-300 pt-1">
                        🟢 {prediction.probability.rising}% 🔴 {prediction.probability.falling}%
                      </div>
                    </div>
                  </div>

                  {/* Key Factors & Risk Warnings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-emerald-500/20">
                      <h4 className="text-xs font-mono text-emerald-400 uppercase font-bold mb-2 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Bullish Catalysts</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                        {prediction.keyFactors?.map((factor: string, i: number) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-emerald-400">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-amber-500/20">
                      <h4 className="text-xs font-mono text-amber-400 uppercase font-bold mb-2 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Risk Warnings</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                        {prediction.riskWarnings?.map((warn: string, i: number) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-amber-400">•</span>
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Predictive Heatmap Widget */}
            {hasSufficientData && prediction && (
              <PredictiveHeatmap currentPrice={token.price} prediction={prediction} />
            )}

            {/* Holder Distribution */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Top Holder Distribution & Whale Clusters</span>
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {token.holders.map((holder, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-500">#{idx + 1}</span>
                      <span className="text-slate-200">{holder.address}</span>
                      {holder.label && (
                        <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[10px]">
                          {holder.label}
                        </span>
                      )}
                    </div>
                    <div className="text-white font-bold">
                      {holder.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Alert Threshold, Risk Audit, Swap Calculator & AI Chat */}
          <div className="space-y-8">
            {/* Price Target Alert Threshold Card */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span>Price Target Alert Threshold</span>
                </h3>
                <button
                  onClick={() => setPriceAlertActive(!priceAlertActive)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {priceAlertActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">Target Price ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={targetPriceInput}
                    onChange={(e) => setTargetPriceInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
                  <span>Status:</span>
                  <span className={priceAlertActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {priceAlertActive ? 'Active Push Alert' : 'Disabled'}
                  </span>
                </div>
                {priceAlertTriggered && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl font-bold">
                    Target of ${targetPriceInput} reached!
                  </div>
                )}
              </div>
            </div>

            {/* Risk Audit Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Rug & Safety Audit</span>
                </h3>
                <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                  token.riskScore < 30 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  Score: {token.riskScore}/100
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Mint Authority</span>
                  <span className={token.mintAuthority ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {token.mintAuthority ? 'Enabled (Risky)' : 'Disabled (Safe)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Freeze Authority</span>
                  <span className={token.freezeAuthority ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {token.freezeAuthority ? 'Enabled (Risky)' : 'Disabled (Safe)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Liquidity Locked</span>
                  <span className={token.lpLocked ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {token.lpLocked ? `${token.lpLockedPercent}% Locked` : 'Not Locked'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Top 10 Holders</span>
                  <span className={token.top10HoldersPercent > 30 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {token.top10HoldersPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Swap Calculator */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                <span>Simulated Raydium Swap</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono block mb-2">You Pay (SOL)</label>
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 font-mono">
                  <div className="text-xs text-slate-500 uppercase">Estimated Receive</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">
                    {((parseFloat(swapAmount || '0') * 180) / (token.price || 1)).toLocaleString()} ${token.symbol}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Jito MEV Protection Active • Slippage 0.5%
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all">
                  Execute Simulation Swap
                </button>
              </div>
            </div>

            {/* DexAI Token Assistant Chat */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col h-[400px]">
              <h3 className="font-bold text-white text-lg mb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Ask DexAI Analyst</span>
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 font-mono text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 ml-6'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 mr-6'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="p-3 bg-slate-950 border border-slate-800 text-slate-400 mr-6 rounded-2xl animate-pulse">
                    DexAI is analyzing on-chain heuristics...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask about risk, whales, forecast..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
