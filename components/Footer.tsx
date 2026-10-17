export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-400">DEXINTELLIGENCE</span>
          <span>— Production Solana Memecoin Intelligence & AI Forecast Engine</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>Real-Time Helius RPC Stream</span>
          <span>Jito MEV Guard</span>
          <span>Gemini 3.8 Flash AI Core</span>
          <span>Secure Web PWA</span>
        </div>
      </div>
    </footer>
  );
}
