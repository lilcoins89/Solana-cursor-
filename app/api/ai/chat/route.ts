import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_TOKENS } from '@/lib/mockTokens';

export async function POST(req: NextRequest) {
  try {
    const { message, tokenMint, history } = await req.json();
    const token = INITIAL_TOKENS.find(t => t.mint === tokenMint) || INITIAL_TOKENS[0];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({
        reply: `DexAI Assistant (Demo Mode): Regarding ${token.name} (${token.symbol}), current risk score is ${token.riskScore}/100. Price is $${token.price} with $${token.volume24h.toLocaleString()} 24h volume. Always DYOR and verify mint/freeze authorities before trading!`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are DexAI, an expert elite Solana memecoin intelligence analyst and risk auditor. You are currently discussing token: ${token.name} (${token.symbol}), Mint: ${token.mint}, Price: $${token.price}, 24h Vol: $${token.volume24h}, Liquidity: $${token.liquidity}, Risk Score: ${token.riskScore}/100, Mint Auth: ${token.mintAuthority}, Freeze Auth: ${token.freezeAuthority}, LP Locked: ${token.lpLocked} (${token.lpLockedPercent}%). Be concise, objective, analytical, and warn users about rug risks or high volatility. Never give financial advice.`;

    const chatHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message });

    return NextResponse.json({
      reply: result.text || 'No response generated.'
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ reply: 'Error communicating with DexAI intelligence core.' }, { status: 500 });
  }
}
