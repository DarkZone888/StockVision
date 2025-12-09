"use client";

import React, { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { toggleWatchlistItem } from "@/lib/actions/watchlist.actions"; // Import Action

interface WatchlistButtonProps {
  symbol: string;
  company?: string;
  isInWatchlist?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, inWatchlist: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกัน link click ถ้าปุ่มอยู่ใน <a>
    e.stopPropagation(); // ป้องกัน event bubble

    // 1. Optimistic Update: เปลี่ยนสถานะทันทีให้ User รู้สึกเร็ว
    const nextState = !added;
    setAdded(nextState);
    onWatchlistChange?.(symbol, nextState);

    // 2. Server Action: ส่งคำสั่งไป Backend ใน Background
    startTransition(async () => {
      try {
        const result = await toggleWatchlistItem(
          symbol,
          company || symbol, // ถ้าไม่มีชื่อบริษัท ให้ใช้ชื่อย่อแทน
          pathname
        );

        if (result.action === "added") {
          toast.success(`Added ${symbol} to watchlist`);
        } else {
          toast.success(`Removed ${symbol} from watchlist`);
        }
      } catch (error) {
        // 3. Rollback: ถ้า Error ให้เปลี่ยนสถานะกลับ
        setAdded(!nextState);
        onWatchlistChange?.(symbol, !nextState);
        toast.error("Failed to update watchlist. Please try again.");
      }
    });
  };

  // ── ICON MODE ──
  if (type === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-neutral-950 text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={added ? "#EAB308" : "none"}
          stroke={added ? "#EAB308" : "#EAB308"} // ปรับสี stroke ให้เห็นชัดเสมอ
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  // ── FULL BUTTON MODE ──
  const baseClasses =
    "inline-flex min-w-[160px] items-center justify-start gap-2 rounded-full border px-3 py-1.5 md:px-4 md:py-1.5 text-xs md:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:opacity-60 disabled:cursor-not-allowed";

  const inactiveClasses =
    "border-zinc-800 bg-neutral-950 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900";
  const activeClasses =
    "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={added}
      className={`${baseClasses} ${added ? activeClasses : inactiveClasses}`}
    >
      {/* icon กลมซ้าย */}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill={added ? "#EAB308" : "none"}
          stroke="#EAB308"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </span>

      {/* text ขวา */}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          {added ? "Watchlisted" : "Watchlist"}
        </span>
        <span className="max-w-[130px] truncate text-[11px] md:text-xs text-zinc-100">
          {company ?? symbol}
        </span>
      </span>
    </button>
  );
};

export default WatchlistButton;