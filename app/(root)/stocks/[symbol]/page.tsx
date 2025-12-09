import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { SYMBOL_INFO_WIDGET_CONFIG } from "@/lib/constants";
import StockTabs from "./StockTabs"; // ตรวจสอบว่ามีไฟล์ StockTabs.tsx อยู่ในโฟลเดอร์เดียวกันนะครับ
import { checkWatchlistStatus } from "@/lib/actions/watchlist.actions";

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const scriptBaseUrl =
    "https://s3.tradingview.com/external-embedding/embed-widget-";

  // 1. ดึงสถานะจริงจาก Database (Server-side)
  const isWatched = await checkWatchlistStatus(symbol);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <header className="rounded-xl border border-zinc-800 bg-neutral-950 px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1 overflow-hidden">
              <TradingViewWidget
                scriptUrl={`${scriptBaseUrl}symbol-info.js`}
                config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                height={170}
                // showSkeleton // ถ้าใน component TradingViewWidget ไม่ได้รับ prop นี้ ให้ลบออกนะครับ
              />
            </div>

            {/* ขวา: ปุ่ม Watchlist */}
            <div className="flex items-start justify-end md:pl-6">
              <WatchlistButton
                symbol={symbol}
                company={symbol}
                isInWatchlist={isWatched} // <--- แก้ไขจุดนี้ครับ (ส่งค่าจริงเข้าไป)
              />
            </div>
          </div>
        </header>

        <main>
          <StockTabs symbol={symbol} />
        </main>
      </div>
    </div>
  );
}