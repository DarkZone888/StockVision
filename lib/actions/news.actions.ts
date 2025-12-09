'use server';

import { connectToDatabase } from "@/database/mongoose";
import CompanyNews from "@/database/models/news.model";
import { getNews as fetchFromFinnhub } from "@/lib/actions/finnhub.actions";
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from "@google/generative-ai"; //

// --- Types ---
export type NewsSentiment = 'Positive' | 'Negative' | 'Neutral';

export type MarketNewsArticle = {
  id: string | number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  category: string;
  related: string;
  image?: string;
  sentiment?: NewsSentiment; // เพิ่ม field นี้
};

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 1. Yahoo Finance Feeds
const YAHOO_RSS_URLS = [
  'https://finance.yahoo.com/news/rssindex',
  'https://finance.yahoo.com/rss/stock-market'
];

async function fetchYahooNews(): Promise<MarketNewsArticle[]> {
  const parser = new Parser();
  const allArticles: MarketNewsArticle[] = [];

  try {
    const feedPromises = YAHOO_RSS_URLS.map(url => parser.parseURL(url));
    const feeds = await Promise.all(feedPromises);

    for (const feed of feeds) {
      feed.items.forEach((item, index) => {
        if (!item.title || !item.link) return;

        allArticles.push({
          id: `yahoo-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          headline: item.title,
          summary: item.contentSnippet || item.content || "",
          source: "Yahoo Finance",
          url: item.link,
          datetime: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
          category: item.categories ? item.categories[0] : "Market",
          related: "Global",
        });
      });
    }
    return allArticles;
  } catch (error) {
    console.error("Error fetching Yahoo RSS:", error);
    return [];
  }
}

// 2. FMP News
async function fetchFromFMP(limit: number = 5): Promise<MarketNewsArticle[]> {
  if (!FMP_API_KEY) return [];
  try {
    const res = await fetch(`${FMP_BASE_URL}/fmp/articles?page=0&size=${limit}&apikey=${FMP_API_KEY}`, {
       next: { revalidate: 1800 }
    });
    if (!res.ok) return [];
    const data = await res.json();

    return data.map((item: any, index: number) => ({
      id: `fmp-${index}-${Date.now()}`,
      headline: item.title,
      summary: item.text ? item.text.substring(0, 150) + "..." : "",
      source: "FMP",
      url: item.url,
      datetime: new Date(item.date).getTime(),
      category: "Economy",
      related: "General",
      image: item.image,
    }));
  } catch (error) {
    console.error("Error FMP:", error);
    return [];
  }
}

// --- AI Analysis Function (Batch) ---
async function enrichNewsWithSentiment(articles: MarketNewsArticle[]): Promise<MarketNewsArticle[]> {
  if (!GEMINI_API_KEY || articles.length === 0) return articles;

  try {
    // เตรียมข้อมูลส่งให้ AI (ส่งแค่ ID กับ Headline เพื่อประหยัด Token)
    const newsToAnalyze = articles.map((a, index) => ({ id: index, headline: a.headline }));
    
    const prompt = `
      You are a financial analyst. Analyze the sentiment of the following news headlines for the stock market.
      Classify each as "Positive", "Negative", or "Neutral".
      
      Input JSON:
      ${JSON.stringify(newsToAnalyze)}

      Output format: JSON Array ONLY. e.g. [{"id": 0, "sentiment": "Positive"}, ...]
      Do not include markdown or explanations.
    `;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); // หรือ gemini-pro
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean string (กัน AI ใส่ markdown backticks)
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const sentiments: { id: number, sentiment: NewsSentiment }[] = JSON.parse(cleanJson);

    // Map ผลลัพธ์กลับไปยัง articles เดิม
    return articles.map((article, index) => {
      const result = sentiments.find(s => s.id === index);
      return {
        ...article,
        sentiment: result ? result.sentiment : 'Neutral'
      };
    });

  } catch (error) {
    console.error("AI Sentiment Analysis Failed:", error);
    // ถ้า AI พัง ให้คืนค่าเดิมไปก่อน (จะได้ไม่จอขาว)
    return articles;
  }
}

// --- Main Aggregator Function ---
export async function getAggregatedNews() {
  console.log("Fetching global market news...");

  try {
    const [yahooNews, finnhubNews, fmpNews] = await Promise.all([
      fetchYahooNews(),
      fetchFromFinnhub([]),
      fetchFromFMP(5)
    ]);

    // รวมข่าว (สมมติ finnhubNews เข้ากันได้ หรือ map แล้ว)
    let allNews = [...yahooNews, ...fmpNews, ...finnhubNews];

    // Deduplicate
    const seenHeadlines = new Set();
    const uniqueNews: MarketNewsArticle[] = [];

    for (const news of allNews) {
      const cleanHeadline = (news.headline || "").toLowerCase().trim();
      if (cleanHeadline.length < 10 || seenHeadlines.has(cleanHeadline)) continue;
      
      seenHeadlines.add(cleanHeadline);
      uniqueNews.push(news as MarketNewsArticle);
    }

    // Sort by Time DESC
    uniqueNews.sort((a, b) => b.datetime - a.datetime);

    // ตัดมาแค่ 20 ข่าวพอ เพื่อไม่ให้ AI ทำงานหนักเกินไป (และประหยัด Token)
    const topNews = uniqueNews.slice(0, 20);

    // เรียก AI ให้วิเคราะห์ (Parallel กับการ return ไม่ได้ ต้องรอผล)
    const analyzedNews = await enrichNewsWithSentiment(topNews);

    return analyzedNews;

  } catch (error) {
    console.error("Aggregated News Error:", error);
    return [];
  }
}

// --- Existing Company News Function ---
export async function getCompanyNewsWithCache(symbol: string) {
  if (!symbol) return [];
  const NEWS_CACHE_DURATION = 2 * 60 * 60 * 1000;

  try {
    await connectToDatabase();
    const cached = await CompanyNews.findOne({ symbol: symbol.toUpperCase() });
    const now = Date.now();

    if (cached && (now - new Date(cached.updatedAt).getTime() < NEWS_CACHE_DURATION)) {
      return cached.articles;
    }

    const freshNews = await fetchFromFinnhub([symbol]);
    
    await CompanyNews.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { symbol: symbol.toUpperCase(), articles: freshNews },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return freshNews;
  } catch (error) {
    console.error("Error fetching company news:", error);
    return [];
  }
}