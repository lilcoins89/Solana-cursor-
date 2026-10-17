'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquareCode, Sparkles, Send, Cpu, CheckCircle2 } from 'lucide-react';

export default function ResearchPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'model',
      content: 'Welcome to DexIntelligence AI Research Agent (Ollama / LangGraph Workflow Core). Ask me complex questions such as:\n• “Why is BONKAI moving so fast?”\n• “What changed in the last 15 minutes across Raydium pools?”\n• “What evidence supports the 60-minute bullish forecast?”'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: 'Research agent connection timeout.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>AI Research & LangGraph Workflow Agent</span>
          </div>
          <h1 className="text-3xl font-black text-white">Ollama & Gemini Dual-Inference Research Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Deep on-chain reasoning, multi-hop evidence verification, and real-time narrative analysis.</p>
        </div>

        {/* Chat Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col min-h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-4 mb-6 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 ml-12'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 mr-12'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="p-4 bg-slate-950 border border-slate-800 text-slate-400 mr-12 rounded-2xl animate-pulse font-mono text-xs">
                AI Agent executing LangGraph research nodes & on-chain cross-verification...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Ask research agent about any token, whale cluster, or market shift..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-white font-mono outline-none focus:border-cyan-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
            >
              <span>Query Agent</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
