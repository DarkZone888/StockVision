'use server';

import { connectToDatabase } from "@/database/mongoose";
import MarketSentiment, { IMarketSentiment } from "@/database/models/sentiment.model";
import { getNews } from "@/lib/actions/finnhub.actions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cache } from 'react';

// --- Configuration ---
const SENTIMENT_DOC_ID = 'current';
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 ชั่วโมง

// --- Global Cache ---
declare global {
  var sentimentUpdatePromise: Promise<MarketSentimentData> | null;
}

if (!global.sentimentUpdatePromise) {
  global.sentimentUpdatePromise = null;
}

// --- Interface ---
type MarketStatus = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
export interface MarketSentimentData {
  status: MarketStatus;
  score: number;
  summary: string;
  factors: string[];
  lastUpdated?: Date;
}

const FALLBACK_SENTIMENT: MarketSentimentData = {
  status: 'Neutral',
  score: 50,
  summary: 'Market analysis is initializing...',
  factors: ['System Start', 'Waiting for Data', 'Check back soon'],
};

// --- Function 1: Frontend เรียกใช้ (อ่าน Cache ก่อน) ---
export const getMarketSentiment = cache(async (): Promise<MarketSentimentData> => {
  try {
    await connectToDatabase();

    // จุดที่ 1: แก้ไข Type Casting (เพิ่ม as unknown)
    const currentData = await MarketSentiment.findById(SENTIMENT_DOC_ID).lean() as unknown as IMarketSentiment | null;
    
    const now = Date.now();

    // เช็กว่าข้อมูลสดใหม่ไหม
    if (currentData && currentData.updatedAt) {
      const dataAge = now - new Date(currentData.updatedAt).getTime();
      if (dataAge < CACHE_TTL_MS) {
        return {
          status: currentData.status as MarketStatus,
          score: currentData.score,
          summary: currentData.summary,
          factors: currentData.factors,
          lastUpdated: currentData.updatedAt,
        };
      }
      console.log(`[Sentiment] Data expired (Age: ${dataAge}ms). Refreshing...`);
    }

    // ถ้าไม่มี หรือ เก่า -> บังคับโหลดใหม่
    return await updateAndSaveSentiment();

  } catch (error) {
    console.error("[Sentiment] Critical Error:", error);
    return FALLBACK_SENTIMENT;
  }
});

// --- Function 2: Inngest เรียกใช้ หรือ Internal Refresh (Shared Lock) ---
export async function updateAndSaveSentiment(): Promise<MarketSentimentData> {
  // A. Join Promise ถ้ามีคนทำอยู่แล้ว
  if (global.sentimentUpdatePromise) {
    console.log("[Sentiment] Joining existing update request...");
    return await global.sentimentUpdatePromise;
  }

  // B. เริ่มทำใหม่ (Create Lock)
  global.sentimentUpdatePromise = (async () => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY missing");

      // 1. ดึงข่าว
      const articles = await getNews();
      const topArticles = Array.isArray(articles) ? articles.slice(0, 15) : [];
      
      let parsedResult;
      
      if (topArticles.length > 0) {
        const prompt = `
        You are a senior global macro and US equity strategist at a top-tier hedge fund.
        Your job is to read news headlines and give a calm, probabilistic view of the **overall US equity market sentiment**.

        HEADLINES:
        ${topArticles.map((a: any) => `- ${a.headline}`).join("\n")}

        RULES:
        1. Focus on the broad US equity market (e.g. S&P 500 / Nasdaq), NOT just individual tickers.
        2. Weigh the headlines by importance:
          - Highest weight: macro & policy (Fed, rates, inflation, jobs, GDP, yields, credit, geopolitics).
          - Medium weight: large caps / big tech leaders.
          - Lower weight: small single-stock stories unless they clearly signal a broader theme.
        3. Define sentiment score (0–100):
          - 0–20   = extremely bearish (crisis / panic)
          - 21–40  = bearish
          - 41–59  = neutral / balanced
          - 60–80  = bullish
          - 81–100 = extremely bullish (euphoria / strong risk-on)
        4. Choose "status" using this logic:
          - If score <= 40        -> "Bearish"
          - If 41 <= score <= 59  -> "Neutral"
          - If score >= 60        -> "Bullish"
          - Use "Volatile" ONLY when the headlines are strongly mixed (big positive AND big negative at the same time, or high uncertainty), even if the score is around neutral.
        5. "summary" must:
          - Be 1–2 sentences.
          - Be clear and human-readable.
          - Mention the main drivers (macro, earnings, policy, geopolitics, positioning, etc.).
        6. "factors" EXACTLY 5 very short reasons (max 6–8 words each).
        
        OUTPUT FORMAT:
        Return ONLY valid **minified JSON**.
        - Do NOT include markdown.
        - Do NOT include code fences.
        - Do NOT include any explanation or comments.
        Return JSON only: { "status": "Bullish"|"Bearish"|"Neutral"|"Volatile", "score": 0-100, "summary": "string", "factors": ["string"] }
        `;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedResult = JSON.parse(jsonString);
      } else {
        parsedResult = { ...FALLBACK_SENTIMENT, summary: "No news available." };
      }

      await connectToDatabase();
      
      // 2. Upsert (ทับตัวเดิม)
      // จุดที่ 2: แก้ไข Type Casting (เพิ่ม as unknown)
      const updatedDoc = await MarketSentiment.findByIdAndUpdate(
        SENTIMENT_DOC_ID,
        {
          _id: SENTIMENT_DOC_ID,
          status: parsedResult.status || 'Neutral',
          score: parsedResult.score || 50,
          summary: parsedResult.summary || 'N/A',
          factors: parsedResult.factors || [],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean() as unknown as IMarketSentiment; // <--- แก้ตรงนี้ครับ

      return {
          status: updatedDoc.status as MarketStatus,
          score: updatedDoc.score,
          summary: updatedDoc.summary,
          factors: updatedDoc.factors,
          lastUpdated: updatedDoc.updatedAt
      };

    } catch (err) {
      console.error("[Sentiment] Update failed:", err);
      return FALLBACK_SENTIMENT;
    } finally {
      // Clear Lock
      global.sentimentUpdatePromise = null;
    }
  })();

  return await global.sentimentUpdatePromise;
}