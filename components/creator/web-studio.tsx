"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = {
  projectName?: string;
  sitemap?: string[];
  sectionsByPage?: Record<string, string[]>;
  components?: string[];
  metadata?: { title?: string; description?: string };
  codeDraft?: Record<string, string>;
  acceptanceCriteria?: string[];
  launchChecklist?: string[];
};

type WebQuality = {
  score: number;
  strengths: string[];
  recommendations: string[];
};

type WebTab = "plan" | "code" | "preview";

export function WebStudio() {
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("minimal and conversion-focused");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const [persistenceNotice, setPersistenceNotice] = useState("");
  const [persistenceEnabled, setPersistenceEnabled] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [quality, setQuality] = useState<WebQuality | null>(null);
  const [tab, setTab] = useState<WebTab>("plan");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetPrompt = params.get("prompt");
    const presetIndustry = params.get("industry");
    const presetStyle = params.get("style");

    if (presetPrompt) setPrompt(presetPrompt);
    if (presetIndustry) setIndustry(presetIndustry);
    if (presetStyle) setStyle(presetStyle);
  }, []);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/creator/status", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { persistenceEnabled?: boolean } | null;
      setPersistenceEnabled(Boolean(data?.persistenceEnabled));
    })();
  }, []);

  const copyOutput = async () => {
    if (!plan) return;
    await navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const downloadOutput = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(plan.projectName || "web-plan").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const codeFiles = Object.entries(plan?.codeDraft || {});
  const currentFile = codeFiles.find(([file]) => file === selectedFile) || codeFiles[0] || null;

  const generate = async () => {
    setLoading(true);
    setError("");
    setPersistenceNotice("");
    setQuality(null);
    setStage("Planning structure...");
    try {
      const res = await fetch("/api/creator/web/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, industry, style, pages: ["home", "services", "about", "contact"], primaryCta: "Start Your Project" }),
      });
      const data = (await res.json().catch(() => null)) as
        | { output?: Plan; projectId?: string | null; persistence?: string; quality?: WebQuality; error?: string }
        | null;
      if (!res.ok || !data || data.error || !data.output) {
        throw new Error(data?.error || "Plan generation failed");
      }
      setStage("Saving project and versioning artifact...");
      const planData = data.output;
      setPlan(planData);
      setQuality(data.quality || null);
      const firstFile = Object.keys(planData.codeDraft || {})[0] || null;
      setSelectedFile(firstFile);
      setTab(firstFile ? "code" : "preview");
      if (data.projectId) setProjectId(data.projectId);
      if (!data.projectId && data.persistence === "disabled") {
        setPersistenceNotice("Running in transient mode: output is generated but not saved to Projects until DATABASE_URL is configured.");
      }
      setStage("Build plan ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Plan generation failed");
      setStage("");
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
        {persistenceEnabled === false ? <p className="mt-3 text-xs text-amber-700">Transient mode: generation works, project saving is currently disabled.</p> : null}
        {loading && stage ? <p className="mt-3 text-sm text-muted">{stage}</p> : null}
        {persistenceNotice ? <p className="mt-3 text-sm text-amber-700">{persistenceNotice}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      {plan ? (
        <div className="rounded-xl border bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">IDE Workspace: {plan.projectName || "Untitled"}</h3>
            <div className="flex gap-2">
              <button
                className={tab === "plan" ? "rounded-md border border-accent bg-white px-3 py-1 text-xs font-semibold" : "rounded-md border bg-white px-3 py-1 text-xs"}
                onClick={() => setTab("plan")}
              >
                Plan
              </button>
              <button
                className={tab === "code" ? "rounded-md border border-accent bg-white px-3 py-1 text-xs font-semibold" : "rounded-md border bg-white px-3 py-1 text-xs"}
                onClick={() => setTab("code")}
              >
                Code
              </button>
              <button
                className={tab === "preview" ? "rounded-md border border-accent bg-white px-3 py-1 text-xs font-semibold" : "rounded-md border bg-white px-3 py-1 text-xs"}
                onClick={() => setTab("preview")}
              >
                Preview
              </button>
            </div>
          </div>

          {tab === "plan" ? (
            <>
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
            </>
          ) : null}

          {tab === "code" ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-12">
              <div className="space-y-2 rounded-md border bg-white p-3 lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Files</p>
                {codeFiles.length ? codeFiles.map(([file]) => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={selectedFile === file ? "w-full rounded-md border border-accent bg-[#fff1f2] px-2 py-2 text-left text-xs font-semibold" : "w-full rounded-md border px-2 py-2 text-left text-xs"}
                  >
                    {file}
                  </button>
                )) : <p className="text-xs text-muted">No code files generated.</p>}
              </div>
              <div className="rounded-md border bg-white p-3 lg:col-span-8">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Editor</p>
                <pre className="mt-2 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-md border bg-surface p-3 text-xs text-muted">{currentFile?.[1] || "No file selected."}</pre>
              </div>
            </div>
          ) : null}

          {tab === "preview" ? (
            <div className="mt-3 rounded-md border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Live Preview</p>
              <h4 className="mt-2 text-2xl font-bold">{plan.metadata?.title || plan.projectName || "Generated Website"}</h4>
              <p className="mt-2 text-sm text-muted">{plan.metadata?.description || "No description available."}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(plan.sitemap || []).map((page) => (
                  <article key={page} className="rounded-md border bg-surface p-3">
                    <p className="text-sm font-semibold">{page}</p>
                    <p className="mt-1 text-xs text-muted">{(plan.sectionsByPage?.[page] || []).join(" • ") || "Sections pending"}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {plan.acceptanceCriteria?.length ? (
            <details className="mt-3 rounded-md border bg-white p-4">
              <summary className="cursor-pointer font-semibold">Acceptance Criteria</summary>
              <ul className="mt-2 text-sm text-muted">{plan.acceptanceCriteria.map((item) => <li key={item}>- {item}</li>)}</ul>
            </details>
          ) : null}
          {plan.launchChecklist?.length ? (
            <details className="mt-3 rounded-md border bg-white p-4">
              <summary className="cursor-pointer font-semibold">Launch Checklist</summary>
              <ul className="mt-2 text-sm text-muted">{plan.launchChecklist.map((item) => <li key={item}>- {item}</li>)}</ul>
            </details>
          ) : null}
          {quality ? (
            <div className="mt-3 rounded-md border bg-white p-4">
              <p className="text-sm font-semibold">Output Quality Score: {quality.score}/100</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Strengths</p>
              <ul className="mt-1 text-sm text-muted">{quality.strengths.map((item) => <li key={item}>- {item}</li>)}</ul>
              {quality.recommendations.length ? (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Recommended Improvements</p>
                  <ul className="mt-1 text-sm text-muted">{quality.recommendations.map((item) => <li key={item}>- {item}</li>)}</ul>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" className="h-8 px-3 text-xs" onClick={copyOutput}>{copied ? "Copied" : "Copy Output"}</Button>
            <Button className="h-8 px-3 text-xs" onClick={downloadOutput}>Download JSON</Button>
          </div>
          {projectId ? (
            <Link href={`/creator/projects/${projectId}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Open Project Workspace</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
