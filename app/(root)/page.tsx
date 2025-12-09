import TradingViewWidget from "@/components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";
import { getMarketSentiment } from "@/lib/actions/market.actions";
import MarketSentimentBanner from "@/components/MarketSentimentBanner";
// import {sendDailyNewsSummary} from "@/lib/inngest/functions";

const scriptBaseUrl =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

const Home = async () => {
  const sentimentData = await getMarketSentiment();

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
        {/* ---------- TOP: Sentiment Banner ---------- */}
        <section className="w-full">
          <MarketSentimentBanner data={sentimentData} />
        </section>

        {/* ---------- ROW 1: Overview + Heatmap ---------- */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
          {/* Market Overview */}
          <div className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">
                  Market Overview
                </h2>
                <p className="text-xs text-zinc-500">
                  Major themes & key leaders
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-neutral-950">
              <TradingViewWidget
                scriptUrl={`${scriptBaseUrl}market-overview.js`}
                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                className="custom-chart"
                height={600}
                showSkeleton
              />
            </div>
          </div>

          {/* Heatmap */}
          <div className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">
                  Stock Heatmap
                </h2>
                <p className="text-xs text-zinc-500">
                  Movers by sector & market cap
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-neutral-950">
              <TradingViewWidget
                scriptUrl={`${scriptBaseUrl}stock-heatmap.js`}
                config={HEATMAP_WIDGET_CONFIG}
                height={600}
                showSkeleton
              />
            </div>
          </div>
        </section>

        {/* ---------- ROW 2: Quotes + Top Stories ---------- */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Market Quotes */}
          <div className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">
                  Market Watchlist
                </h2>
                <p className="text-xs text-zinc-500">
                  Curated groups across themes
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-neutral-950">
              <TradingViewWidget
                scriptUrl={`${scriptBaseUrl}market-quotes.js`}
                config={MARKET_DATA_WIDGET_CONFIG}
                height={600}
                showSkeleton
              />
            </div>
          </div>

          {/* Top Stories */}
          <div className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">
                  Top Stories
                </h2>
                <p className="text-xs text-zinc-500">
                  Latest headlines for equity markets
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-neutral-950">
              <TradingViewWidget
                scriptUrl={`${scriptBaseUrl}timeline.js`}
                config={TOP_STORIES_WIDGET_CONFIG}
                height={600}
                showSkeleton
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
