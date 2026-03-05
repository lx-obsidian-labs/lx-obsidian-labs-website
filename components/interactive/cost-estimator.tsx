"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const baseByService: Record<string, number> = {
  "Web Application": 80000,
  "CMS System": 55000,
  Branding: 30000,
  Automation: 45000,
};

const multiplierBySize: Record<string, number> = {
  Small: 1,
  Medium: 1.7,
  Large: 2.5,
};

const timelineFactor: Record<string, number> = {
  Standard: 1,
  Accelerated: 1.25,
};

export function CostEstimator() {
  const [service, setService] = useState<keyof typeof baseByService>("Web Application");
  const [size, setSize] = useState<keyof typeof multiplierBySize>("Small");
  const [timeline, setTimeline] = useState<keyof typeof timelineFactor>("Standard");
  const [features, setFeatures] = useState(1);

  const estimate = useMemo(() => {
    const base = baseByService[service] * multiplierBySize[size] * timelineFactor[timeline];
    const extra = Math.max(0, features - 1) * 6500;
    const total = base + extra;
    return {
      low: Math.round(total * 0.88),
      high: Math.round(total * 1.12),
    };
  }, [service, size, timeline, features]);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-2xl font-bold">Smart Project Cost Estimator</h3>
      <p className="mt-2 text-sm text-muted">Get a fast estimate range based on your service type, complexity, and delivery timeline.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Service type
          <select
            value={service}
            onChange={(e) => setService(e.target.value as keyof typeof baseByService)}
            className="h-11 w-full rounded-md border px-3 text-sm"
          >
            {Object.keys(baseByService).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          Project size
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as keyof typeof multiplierBySize)}
            className="h-11 w-full rounded-md border px-3 text-sm"
          >
            {Object.keys(multiplierBySize).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          Timeline
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value as keyof typeof timelineFactor)}
            className="h-11 w-full rounded-md border px-3 text-sm"
          >
            {Object.keys(timelineFactor).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          Feature count (1-8)
          <input
            type="range"
            min={1}
            max={8}
            value={features}
            onChange={(e) => setFeatures(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-muted">Selected: {features}</span>
        </label>
      </div>

      <div className="mt-6 rounded-xl bg-[#111111] p-5 text-white">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Estimated Project Range</p>
        <p className="mt-2 text-2xl font-bold">
          R {estimate.low.toLocaleString()} - R {estimate.high.toLocaleString()}
        </p>
        <p className="mt-2 text-xs text-zinc-300">Final pricing depends on integrations, data migration complexity, and delivery scope.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact" onClick={() => track("cta_click", { source: "estimator_book_consultation" })}>
            Book Consultation
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/lab" onClick={() => track("cta_click", { source: "estimator_view_lab" })}>
            View Lab Projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
