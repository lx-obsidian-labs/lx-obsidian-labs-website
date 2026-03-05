"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Goal = "website" | "document" | "automation" | "branding";

const goalConfig: Record<
  Goal,
  {
    route: string;
    action: string;
    output: string;
  }
> = {
  website: {
    route: "/creator/web",
    action: "Start Website Builder",
    output: "Sitemap, sections, metadata, and first draft output.",
  },
  document: {
    route: "/creator/docs",
    action: "Start Document Studio",
    output: "Proposal, profile, or policy draft with version history.",
  },
  automation: {
    route: "/contact#start-form",
    action: "Start Automation Brief",
    output: "Scoped implementation plan and delivery path.",
  },
  branding: {
    route: "/services/design-order",
    action: "Start Design Fast Track",
    output: "Creative brief and production-ready design direction.",
  },
};

export function LaunchPlanner() {
  const [goal, setGoal] = useState<Goal>("website");
  const [urgency, setUrgency] = useState("this month");
  const [budget, setBudget] = useState("R50k - R150k");

  const recommendation = useMemo(() => {
    const base = goalConfig[goal];
    return {
      ...base,
      note: `Best path for ${goal} goals with ${urgency} timeline and ${budget} budget range.`,
    };
  }, [goal, urgency, budget]);

  return (
    <div className="rounded-2xl border bg-white p-6 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Launch Planner</p>
      <h2 className="mt-3 text-2xl font-bold md:text-4xl">Get the right starting point in under 30 seconds.</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-medium">
          What do you need?
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
            <option value="website">Website / Web App</option>
            <option value="document">Business Documents</option>
            <option value="automation">Automation System</option>
            <option value="branding">Branding / Design Assets</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Urgency
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option>this week</option>
            <option>this month</option>
            <option>this quarter</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Budget Range
          <select className="h-11 w-full rounded-md border px-3 text-sm" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option>Below R50k</option>
            <option>R50k - R150k</option>
            <option>R150k - R300k</option>
            <option>R300k+</option>
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl border bg-surface p-4">
        <p className="text-sm font-semibold">Recommended Start</p>
        <p className="mt-1 text-sm text-muted">{recommendation.note}</p>
        <p className="mt-2 text-sm text-[#111111]">Expected output: {recommendation.output}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={recommendation.route}>{recommendation.action}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact#start-form">Talk to Customer Care</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
