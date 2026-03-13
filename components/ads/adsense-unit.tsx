"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdsenseUnitProps = {
  slot?: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  layout?: "in-article";
  layoutKey?: string;
  centered?: boolean;
};

const client = "ca-pub-8968817915668565";
const defaultSlot = "1907518850";

export function AdsenseUnit({
  slot,
  className = "",
  format = "auto",
  layout,
  layoutKey,
  centered = false,
}: AdsenseUnitProps) {
  const resolvedSlot = slot || defaultSlot;

  useEffect(() => {
    if (!resolvedSlot || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // noop
    }
  }, [resolvedSlot]);

  return (
    <ins
      className={`adsbygoogle block overflow-hidden rounded-lg border border-border/60 bg-white/50 ${className}`}
      style={{ display: "block", textAlign: centered ? "center" : undefined }}
      data-ad-client={client}
      data-ad-slot={resolvedSlot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-ad-layout-key={layoutKey}
      data-full-width-responsive="true"
    />
  );
}
