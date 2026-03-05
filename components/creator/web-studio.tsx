"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = {
  projectName?: string;
  sitemap?: string[];
  sectionsByPage?: Record<string, string[]>;
  components?: string[];
  metadata?: { title?: string; description?: string };
  codeDraft?: Record<string, string>;
};

export function WebStudio() {
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("minimal and conversion-focused");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/web/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, industry, style, pages: ["home", "services", "about", "contact"], primaryCta: "Start Your Project" }),
      });
      const data = (await res.json().catch(() => null)) as
        | { output?: Plan; projectId?: string; error?: string }
        | null;
      if (!res.ok || !data || data.error || !data.output) {
        throw new Error(data?.error || "Plan generation failed");
      }
      const planData = data.output;
      setPlan(planData);
      if (data.projectId) setProjectId(data.projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Plan generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5 md:p-6">
        <h2 className="text-xl font-semibold">Build Plan Input</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input className="h-11 rounded-md border px-3 text-sm md:col-span-3" placeholder="Describe the app/website you want to build" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm md:col-span-2" placeholder="Style" value={style} onChange={(e) => setStyle(e.target.value)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={generate} disabled={loading || prompt.trim().length < 8}>{loading ? "Generating..." : "Generate Build Plan"}</Button>
          <Button asChild variant="secondary"><Link href="/creator/projects">View Saved Projects</Link></Button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      {plan ? (
        <div className="rounded-xl border bg-surface p-5 md:p-6">
          <h3 className="text-lg font-semibold">Generated Plan: {plan.projectName || "Untitled"}</h3>
          <details className="mt-3 rounded-md border bg-white p-4" open>
            <summary className="cursor-pointer font-semibold">Sitemap</summary>
            <ul className="mt-2 text-sm text-muted">{(plan.sitemap || []).map((item) => <li key={item}>- {item}</li>)}</ul>
          </details>
          <details className="mt-3 rounded-md border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Sections By Page</summary>
            <div className="mt-2 space-y-2 text-sm text-muted">
              {Object.entries(plan.sectionsByPage || {}).map(([page, sections]) => (
                <p key={page}><span className="font-semibold text-[#111111]">{page}:</span> {sections.join(", ")}</p>
              ))}
            </div>
          </details>
          <details className="mt-3 rounded-md border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Components</summary>
            <ul className="mt-2 text-sm text-muted">{(plan.components || []).map((item) => <li key={item}>- {item}</li>)}</ul>
          </details>
          <details className="mt-3 rounded-md border bg-white p-4">
            <summary className="cursor-pointer font-semibold">SEO Metadata</summary>
            <p className="mt-2 text-sm text-muted">Title: {plan.metadata?.title || "N/A"}</p>
            <p className="mt-1 text-sm text-muted">Description: {plan.metadata?.description || "N/A"}</p>
          </details>
          <details className="mt-3 rounded-md border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Code Draft</summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-muted">{JSON.stringify(plan.codeDraft || {}, null, 2)}</pre>
          </details>
          {projectId ? (
            <Link href={`/creator/projects/${projectId}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Open Project Workspace</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
