import React from 'react';
import { getAggregatedNews, NewsSentiment } from "@/lib/actions/news.actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Market News | StockVision",
  description: "Global market news with AI Sentiment Analysis.",
};

export const dynamic = 'force-dynamic';

// ฟังก์ชันเลือกสี Badge
const getSentimentBadge = (sentiment?: NewsSentiment) => {
  switch (sentiment) {
    case 'Positive':
      return (
        <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 ring-1 ring-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Bullish
        </span>
      );
    case 'Negative':
      return (
        <span className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500 ring-1 ring-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Bearish
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 rounded bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 ring-1 ring-zinc-500/20">
          Neutral
        </span>
      );
  }
};

export default async function NewsPage() {
  const newsArticles = await getAggregatedNews();

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Market News
             </h1>
             <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/30">
                AI Powered ✨
             </span>
          </div>
          
          <p className="text-sm text-zinc-400">
            Real-time global market updates with AI-driven sentiment analysis.
          </p>
        </div>

        {/* --- NEWS GRID --- */}
        {newsArticles.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500">
            No market news available right now.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {newsArticles.map((article) => {
              const date = article.datetime ? new Date(article.datetime) : null;
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
                  className="group flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 transition-all hover:border-zinc-500 hover:bg-zinc-900"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header: Source + Sentiment Badge */}
                    <div className="flex items-center justify-between">
                       {article.source && (
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 ring-1 ring-zinc-800">
                          {article.source}
                        </span>
                      )}
                      {/* Sentiment Badge Here */}
                      {getSentimentBadge(article.sentiment)}
                    </div>

                    {/* Title */}
                    <h4 className="line-clamp-2 text-base font-medium text-zinc-100 group-hover:text-white">
                        {article.headline}
                    </h4>

                    {/* Summary */}
                    {article.summary && (
                      <p className="line-clamp-3 text-sm text-zinc-400 group-hover:text-zinc-300">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-2">
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-zinc-400 transition-colors group-hover:text-emerald-400">
                      Read full story
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}