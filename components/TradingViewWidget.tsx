"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
  /** ถ้า true ให้โชว์ skeleton ตอนโหลด */
  showSkeleton?: boolean;
}

type WidgetStatus = "idle" | "loading" | "ready" | "error";

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  title,
  scriptUrl,
  config,
  height,
  className,
  showSkeleton = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<WidgetStatus>("idle");

  // ทำให้ dependency ของ useEffect stable ไม่ loop เพราะ object ใหม่ทุกครั้ง
  const configJson = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // เคลียร์ของเก่า
    container.innerHTML = "";
    setStatus("loading");

    try {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = configJson;

      script.onload = () => {
        setStatus("ready");
      };

      script.onerror = () => {
        console.error("TradingView widget failed to load", {
          scriptUrl,
          config,
        });
        setStatus("error");
      };

      container.appendChild(script);
    } catch (err) {
      console.error("TradingView widget threw an exception", err);
      setStatus("error");
    }

    return () => {
      setStatus("idle");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [scriptUrl, configJson]);

  const wrapperStyle: React.CSSProperties | undefined = height
    ? { height }
    : undefined;

  return (
    <section
      className={`relative w-full ${className ?? ""}`}
      style={wrapperStyle}
    >
      {title && (
        <div className="mb-2 text-sm font-medium text-zinc-300">{title}</div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-red-500/40 bg-red-950/30 px-4 text-center text-sm text-red-200">
          Failed to load chart widget. Please refresh the page or try again
          later.
        </div>
      )}

      {/* Skeleton / Loading state */}
      {status === "loading" && showSkeleton && (
        <div className="pointer-events-none absolute inset-0 z-0 rounded-lg border border-zinc-800 bg-zinc-900/60">
          <div className="h-full w-full animate-pulse bg-gradient-to-b from-zinc-800/60 via-zinc-900/60 to-zinc-900/80" />
        </div>
      )}

      {/* Actual container */}
      <div
        ref={containerRef}
        className={`relative z-10 h-full w-full ${
          status === "loading" && showSkeleton ? "opacity-0" : "opacity-100"
        } transition-opacity`}
      />
    </section>
  );
};

export default TradingViewWidget;
