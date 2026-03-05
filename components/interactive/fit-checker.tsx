"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const useCases = ["Web Application", "CMS System", "Automation System", "Brand Identity"] as const;
const budgets = ["Below R50k", "R50k - R150k", "R150k - R300k", "R300k+"] as const;
const timelines = ["1-2 months", "2-4 months", "4-6 months", "Flexible"] as const;

export function FitChecker() {
  const [useCase, setUseCase] = useState<(typeof useCases)[number]>("Web Application");
  const [budget, setBudget] = useState<(typeof budgets)[number]>("R50k - R150k");
  const [timeline, setTimeline] = useState<(typeof timelines)[number]>("2-4 months");

  const result = useMemo(() => {
    let score = 0;
    if (budget === "R300k+") score += 40;
    if (budget === "R150k - R300k") score += 30;
    if (budget === "R50k - R150k") score += 20;

    if (timeline === "2-4 months") score += 30;
    if (timeline === "4-6 months") score += 25;
    if (timeline === "Flexible") score += 20;
    if (timeline === "1-2 months") score += 10;

    if (useCase === "Automation System" || useCase === "Web Application" || useCase === "CMS System") score += 30;
    else score += 20;

    if (score >= 80) {
      return {
        label: "High Fit",
        advice: "Great fit for a technical discovery call. We can scope architecture and milestones quickly.",
        href: "/contact",
        cta: "Book Discovery Call",
      };
    }

    if (score >= 60) {
      return {
        label: "Good Fit",
        advice: "Strong project potential. Use the estimator and submit your lead details for tailored recommendations.",
        href: "/services",
        cta: "Review Service Packages",
      };
    }

    return {
      label: "Early Stage",
      advice: "Start with service packaging and roadmap guidance before implementation commitments.",
      href: "/services",
      cta: "See Starter Options",
    };
  }, [budget, timeline, useCase]);

  return (
    <div className="rounded-2xl border bg-white p-8 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Fit Checker</p>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">Find your best starting path in under a minute.</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-medium">
          What do you need?
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={useCase} onChange={(e) => setUseCase(e.target.value as (typeof useCases)[number])}>
            {useCases.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          Budget range
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={budget} onChange={(e) => setBudget(e.target.value as (typeof budgets)[number])}>
            {budgets.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          Target timeline
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={timeline} onChange={(e) => setTimeline(e.target.value as (typeof timelines)[number])}>
            {timelines.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl bg-[#111111] p-5 text-white">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Fit Result</p>
        <p className="mt-2 text-2xl font-bold text-accent">{result.label}</p>
        <p className="mt-2 text-sm text-zinc-200">{result.advice}</p>
        <Button asChild className="mt-4">
          <Link href={result.href}>{result.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
