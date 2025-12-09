import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SentimentStatus = "Bullish" | "Bearish" | "Volatile" | "Neutral";

interface MarketSentimentData {
  status?: SentimentStatus | string;
  score?: number; // 0–100
  summary?: string;
  factors?: string[];
}

interface MarketSentimentProps {
  data?: MarketSentimentData;
  className?: string;
}

const SENTIMENT_THEMES: Record<
  SentimentStatus,
  {
    text: string;
    accent: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
> = {
  Bullish: {
    text: "text-emerald-400",
    accent: "bg-emerald-500",
    icon: TrendingUp,
  },
  Bearish: {
    text: "text-rose-400",
    accent: "bg-rose-500",
    icon: TrendingDown,
  },
  Volatile: {
    text: "text-violet-400",
    accent: "bg-violet-500",
    icon: Activity,
  },
  Neutral: {
    text: "text-amber-400",
    accent: "bg-amber-500",
    icon: Minus,
  },
};

const resolveStatus = (status?: string): SentimentStatus => {
  if (!status) return "Neutral";
  const normalized = status.toLowerCase();

  if (normalized.includes("bull")) return "Bullish";
  if (normalized.includes("bear")) return "Bearish";
  if (normalized.includes("volat")) return "Volatile";

  return "Neutral";
};

const MarketSentimentBanner: React.FC<MarketSentimentProps> = ({
  data,
  className,
}) => {
  if (!data) return null;

  const {
    status: rawStatus,
    score: rawScore,
    summary = "",
    factors = [],
  } = data;

  const status = resolveStatus(rawStatus);
  const theme = SENTIMENT_THEMES[status];
  const Icon = theme.icon;

  const score = Number.isFinite(rawScore as number) ? (rawScore as number) : 50;
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95",
        "text-sm text-zinc-200",
        className
      )}
      aria-label={`Market sentiment is ${status} with score ${clampedScore} out of 100`}
    >
      {/* Top accent */}
      <div className={cn("absolute inset-x-0 top-0 h-[2px]", theme.accent)} />
      {/* Left rail */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-800" />

      <CardContent className="relative px-5 md:px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
          {/* LEFT: Status + Score + Summary */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {/* Top row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status pill */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-900 px-2.5 py-0.5",
                      "text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em]",
                      theme.text
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{status}</span>
                  </span>

                  {/* 🔙 Market Sentiment = แบบเดิม (pill ใหญ่ หรู ๆ) */}
                  <span
                    className="
                      rounded-full bg-zinc-900/70 
                      px-3 py-0.5 
                      text-[11px] md:text-xs 
                      font-semibold 
                      uppercase 
                      tracking-[0.22em] 
                      text-zinc-300
                    "
                  >
                    Market Sentiment
                  </span>
                </div>

                <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Snapshot of current market tone
                </p>
              </div>

              {/* Score */}
              <div className="mt-1 flex items-end gap-4 sm:mt-0 sm:items-center">
                <div className="flex items-baseline justify-end gap-2">
                  <span className="font-sans text-4xl md:text-[2.6rem] font-semibold tracking-tight text-white tabular-nums leading-none">
                    {clampedScore.toFixed(0)}
                  </span>
                  <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                    / 100
                  </span>
                </div>

                <div className="hidden w-28 flex-col gap-1 sm:flex">
                  <div className="flex items-center justify-between text-[9px] text-zinc-600">
                    <span>Bear</span>
                    <span>Neutral</span>
                    <span>Bull</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={cn("h-full rounded-full", theme.accent)}
                      style={{ width: `${clampedScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Info className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                <h3 className="text-sm md:text-[15px] font-semibold text-zinc-100">
                  Market Insight
                </h3>
              </div>
              <p className="max-w-prose text-[14px] md:text-[15px] leading-relaxed text-zinc-200 text-pretty">
                {summary || "No commentary available for this session."}
              </p>
            </div>
          </div>

          {/* RIGHT: Key Drivers */}
          <aside
            className={cn(
              "mt-3 border-t border-zinc-800 pt-3",
              "md:mt-0 md:w-[260px] md:flex-none md:border-l md:border-t-0 md:pl-5 md:pt-0"
            )}
          >
            <div className="mb-2 flex items-center gap-1.5">
              <Zap
                className="h-4 w-4 text-yellow-400/90"
                aria-hidden="true"
              />
              <h3 className="text-sm md:text-[15px] font-semibold text-zinc-100">
                Key Drivers
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {factors && factors.length > 0 ? (
                factors.map((factor, index) => (
                  <Badge
                    key={`${factor}-${index}`}
                    variant="outline"
                    className={cn(
                      "cursor-default whitespace-nowrap rounded-full border-zinc-700/80 bg-zinc-900 px-2.5 py-0.5",
                      "text-[12px] font-normal text-zinc-200"
                    )}
                  >
                    {factor}
                  </Badge>
                ))
              ) : (
                <span className="text-[12px] italic text-zinc-600">
                  No significant drivers detected.
                </span>
              )}
            </div>
          </aside>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentimentBanner;
