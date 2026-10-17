# Dexintelligence — Solana Memecoin Intelligence & AI 60-Minute Forecast Engine

Dexintelligence is a production-grade Solana memecoin intelligence and quantitative risk audit platform. It combines real-time token discovery, advanced holder distribution analysis, deployer verification, liquidity-lock checks, smart-money whale tracking, and an AI-powered 60-minute price prediction engine.

---

## Key Features

1. **Smart Token Discovery** (`/discovery`)
   - Automatically discovers newly launched Solana tokens.
   - Filters by age, liquidity depth, trading volume velocity, and momentum.
   - Ranks promising candidates with verified risk scoring.

2. **Rolling 1-Hour Prediction Engine** (`/token/[mint]`)
   - Generates rolling next-60-minute price forecasts with predicted direction, expected range, and probability distributions.
   - Enforces strict **"Insufficient data"** states when liquidity or volume is below verified thresholds (no fabricated confidence).
   - Immutable forecast history logging: records every prediction before outcomes are known without overwriting past entries.

3. **Smart-Money & Whale Tracking** (`/whales`)
   - Monitors known insider clusters, whale accumulation, and large AMM swaps.
   - Real-time impact scoring for significant buys and sells.

4. **Rug-Pull & Manipulation Detection** (`/token/[mint]`)
   - Flags suspicious holder concentration, active mint/freeze authorities, unverified liquidity locks, and sudden liquidity withdrawals.

5. **Real-Time Alert Engine & Notification System** (`/alerts`, `/api/alerts/trigger`)
   - Triggers Telegram and browser push notifications when a token's 1-hour prediction changes from bearish/sideways to bullish.
   - Configurable alert rules for price surges, volume spikes, and risk shifts.

6. **AI Research Agent & Dual-Inference Hub** (`/research`, `/api/ai/chat`)
   - Deep reasoning via `@google/genai` (Gemini 3.8 Flash / Argon) and local model inference support (Ollama / LangGraph workflow integration).
   - Answer complex queries like “Why is this token moving?”, “What changed in the last 15 minutes?”, and “What evidence supports this forecast?”.

7. **Forecast Leaderboard & Backtesting** (`/leaderboard`)
   - Recharts visualization of model accuracy improvement over time versus simple baselines.
   - Chronological backtesting results comparing AI predictions against actual outcomes at 15, 30, and 60 minutes.

---

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **Charts**: Recharts (Area charts, Candlestick representations, Accuracy time-series line charts)
- **AI Integration**: `@google/genai` TypeScript SDK (Server-side API routes)
- **PWA & Mobile-First**: Fully responsive dark mode cyber-sleek UI design

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.example`:
   ```bash
   GEMINI_API_KEY="your_gemini_api_key"
   APP_URL="http://localhost:3000"
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
