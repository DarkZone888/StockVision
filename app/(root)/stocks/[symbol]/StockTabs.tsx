"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TradingViewWidget from "@/components/TradingViewWidget";
import {
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  FUNDAMENTAL_DATA_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";
// 1. Import Server Action สำหรับดึงข่าว
import { getNews } from "@/lib/actions/finnhub.actions";
import { getCompanyNewsWithCache } from "@/lib/actions/news.actions";

interface StockTabsProps {
  symbol: string;
}

const SCRIPT_BASE_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < breakpoint);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}

/* ---------- NEWS PANEL (ใช้ Finnhub Action) ---------- */

interface StockNewsArticle {
  id: string | number;
  title: string;
  source?: string;
  url: string;
  publishedAt?: string; // ISO string
  summary?: string;
}

function StockNewsPanel({ symbol }: { symbol: string }) {
  const [articles, setArticles] = useState<StockNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const newsItems = await getCompanyNewsWithCache(symbol);

        if (!cancelled) {
          const mappedArticles: StockNewsArticle[] = newsItems.map((item: any) => ({
            id: item.id,
            title: item.headline, // เปลี่ยน headline -> title
            source: item.source,
            url: item.url,
            publishedAt: item.datetime 
              ? new Date(item.datetime * 1000).toISOString() 
              : undefined,
            summary: item.summary,
          }));

          setArticles(mappedArticles);
        }
      } catch (err: any) {
        console.error("News fetch error:", err);
        if (!cancelled) {
          setError("Failed to load news from Finnhub");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNews();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (loading) {
return (
    <div className="space-y-3">
      {/* ... header ... */}

      <div className="space-y-3">
        {articles.map((article, index) => { // รับ index เข้ามา
          const uniqueKey = `${article.id}-${index}`; 

          const date = article.publishedAt
            ? new Date(article.publishedAt)
            : null;

          return (
            <a
              key={uniqueKey}
              href={article.url}
            >
            </a>
          );
        })}
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-black px-4 py-6 text-sm text-zinc-400">
        <p className="font-medium text-zinc-200">Couldn&apos;t load news</p>
        <p className="mt-1 text-xs text-zinc-500">{error}</p>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-black px-4 py-6 text-sm text-zinc-400">
        No recent news found for <span className="font-semibold">{symbol}</span>.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-zinc-800 bg-black p-3 text-xs text-zinc-400">
        Latest news for <span className="font-semibold text-zinc-100">{symbol}</span>
      </div>

      <div className="space-y-3">
        {articles.map((article) => {
          const date = article.publishedAt
            ? new Date(article.publishedAt)
            : null;
          const formattedDate = date
            ? date.toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="line-clamp-2 text-sm font-medium text-zinc-100">
                    {article.title}
                  </h4>
                  {article.source && (
                    <span className="shrink-0 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                      {article.source}
                    </span>
                  )}
                </div>

                {article.summary && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                    {article.summary}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{formattedDate}</span>
                  <span className="font-medium text-zinc-400">
                    Read article ↗
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MAIN TABS ---------------- */

export default function StockTabs({ symbol }: StockTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();

  const chartHeight = isMobile ? 420 : 600;
  const financialsHeight = isMobile ? 520 : 800;
  const technicalHeight = isMobile ? 420 : 500;

  return (
    <div className="rounded-xl border border-zinc-800 bg-neutral-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-zinc-800 px-3 pt-2 md:px-5">
          <TabsList className="flex h-10 items-center gap-2 bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 md:px-3 md:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 md:px-3 md:text-sm"
            >
              News
            </TabsTrigger>
            <TabsTrigger
              value="financials"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 md:px-3 md:text-sm"
            >
              Financials
            </TabsTrigger>
            <TabsTrigger
              value="technicals"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 md:px-3 md:text-sm"
            >
              Technicals
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="space-y-6 px-3 pb-5 pt-4 md:px-5 md:pb-7 md:pt-5 lg:px-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <TabsContent
              value="overview"
              className="mt-0 space-y-6 animate-in fade-in-50 duration-300"
            >
              <section className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
                <TradingViewWidget
                  scriptUrl={`${SCRIPT_BASE_URL}advanced-chart.js`}
                  config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={chartHeight}
                  showSkeleton
                />
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Company Overview
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
                    <TradingViewWidget
                      scriptUrl={`${SCRIPT_BASE_URL}symbol-profile.js`}
                      config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                      height={isMobile ? 320 : 360}
                      showSkeleton
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Key Stats
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
                    <TradingViewWidget
                      scriptUrl={`${SCRIPT_BASE_URL}financials.js`}
                      config={FUNDAMENTAL_DATA_WIDGET_CONFIG(symbol)}
                      height={isMobile ? 320 : 360}
                      showSkeleton
                    />
                  </div>
                </div>
              </section>
            </TabsContent>
          )}

          {/* NEWS */}
          {activeTab === "news" && (
            <TabsContent
              value="news"
              className="mt-0 space-y-4 animate-in fade-in-50 duration-300"
            >
              <h3 className="text-sm font-semibold text-zinc-200">
                Latest News
              </h3>
              <StockNewsPanel symbol={symbol} />
            </TabsContent>
          )}

          {/* FINANCIALS */}
          {activeTab === "financials" && (
            <TabsContent
              value="financials"
              className="mt-0 space-y-4 animate-in fade-in-50 duration-300"
            >
              <h3 className="text-sm font-semibold text-zinc-200">
                Financial Statements
              </h3>

              <section className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
                <TradingViewWidget
                  scriptUrl={`${SCRIPT_BASE_URL}financials.js`}
                  config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                  height={financialsHeight}
                  showSkeleton
                />
              </section>
            </TabsContent>
          )}

          {/* TECHNICALS */}
          {activeTab === "technicals" && (
            <TabsContent
              value="technicals"
              className="mt-0 space-y-4 animate-in fade-in-50 duration-300"
            >
              <h3 className="text-sm font-semibold text-zinc-200">
                Technical Analysis
              </h3>

              <section className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-zinc-800 bg-black">
                <TradingViewWidget
                  scriptUrl={`${SCRIPT_BASE_URL}technical-analysis.js`}
                  config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                  height={technicalHeight}
                  showSkeleton
                />
              </section>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}