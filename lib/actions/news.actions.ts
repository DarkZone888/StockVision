'use server';

import { connectToDatabase } from "@/database/mongoose";
import CompanyNews from "@/database/models/news.model";
import { getNews as fetchFromFinnhub } from "@/lib/actions/finnhub.actions";

const NEWS_CACHE_DURATION = 2 * 60 * 60 * 1000; 

export async function getCompanyNewsWithCache(symbol: string) {
  if (!symbol) return [];

  try {
    await connectToDatabase();
    
    // 1. ลองหาใน DB ก่อน
    const cached = await CompanyNews.findOne({ symbol: symbol.toUpperCase() });
    const now = Date.now();

    // 2. ถ้ามีของ และยังไม่หมดอายุ -> ใช้ของเดิม
    if (cached && (now - new Date(cached.updatedAt).getTime() < NEWS_CACHE_DURATION)) {
      console.log(`[News Cache] HIT for ${symbol} (Using DB)`);
      return cached.articles;
    }

    // 3. ถ้าไม่มี หรือเก่าแล้ว -> ยิง Finnhub
    console.log(`[News Cache] MISS for ${symbol} (Fetching API...)`);
    const freshNews = await fetchFromFinnhub([symbol]);

    // 4. บันทึกลง DB (Upsert)
    await CompanyNews.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { 
        symbol: symbol.toUpperCase(),
        articles: freshNews,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return freshNews;

  } catch (error) {
    console.error("Error fetching company news:", error);
    return [];
  }
}