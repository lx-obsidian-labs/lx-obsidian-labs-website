"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DocOutput = {
  title?: string;
  outline?: string[];
  contentMarkdown?: string;
};

export function DocsStudio() {
  const [documentType, setDocumentType] = useState("company-profile");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("corporate");
  const [goal, setGoal] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState<DocOutput | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const [persistenceNotice, setPersistenceNotice] = useState("");
  const [persistenceEnabled, setPersistenceEnabled] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetType = params.get("documentType");
    const presetCompany = params.get("companyName");
    const presetTone = params.get("tone");
    const presetGoal = params.get("goal");

    if (presetType) setDocumentType(presetType);
    if (presetCompany) setCompanyName(presetCompany);
    if (presetTone) setTone(presetTone);
    if (presetGoal) setGoal(presetGoal);
  }, []);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/creator/status", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { persistenceEnabled?: boolean } | null;
      setPersistenceEnabled(Boolean(data?.persistenceEnabled));
    })();
  }, []);

  const copyOutput = async () => {
    if (!output?.contentMarkdown) return;
    await navigator.clipboard.writeText(output.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const downloadOutput = () => {
    if (!output?.contentMarkdown) return;
    const blob = new Blob([output.contentMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(output.title || "document").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setPersistenceNotice("");
    setStage("Preparing document structure...");
    try {
      const res = await fetch("/api/creator/docs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, companyName, industry, tone, goal, keyPoints: keyPoints.split(",").map((item) => item.trim()).filter(Boolean) }),
      });

      const data = (await res.json().catch(() => null)) as
        | { output?: DocOutput; projectId?: string | null; persistence?: string; error?: string }
        | null;
      if (!res.ok || !data || data.error || !data.output) {
        throw new Error(data?.error || "Document generation failed");
      }
      setStage("Saving project and versioning artifact...");
      const outputData = data.output;

      setOutput(outputData);
      if (data.projectId) setProjectId(data.projectId);
      if (!data.projectId && data.persistence === "disabled") {
        setPersistenceNotice("Running in transient mode: document is generated but not saved to Projects until DATABASE_URL is configured.");
      }
      setStage("Document ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document generation failed");
      setStage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5 md:p-6">
        <h2 className="text-xl font-semibold">Document Intake</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="h-11 rounded-md border px-3 text-sm" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            <option value="company-profile">Company Profile</option>
            <option value="business-plan">Business Plan</option>
            <option value="proposal">Proposal</option>
            <option value="policy">Policy / SOP</option>
          </select>
          <input className="h-11 rounded-md border px-3 text-sm" placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm" placeholder="Tone (corporate, investor, formal)" value={tone} onChange={(e) => setTone(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm md:col-span-2" placeholder="Primary goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <input className="h-11 rounded-md border px-3 text-sm md:col-span-2" placeholder="Key points (comma separated)" value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={generate} disabled={loading || !companyName.trim()}>{loading ? "Generating..." : "Generate Document"}</Button>
          <Button asChild variant="secondary"><Link href="/creator/projects">View Saved Projects</Link></Button>
        </div>
        {persistenceEnabled === false ? <p className="mt-3 text-xs text-amber-700">Transient mode: generation works, project saving is currently disabled.</p> : null}
        {loading && stage ? <p className="mt-3 text-sm text-muted">{stage}</p> : null}
        {persistenceNotice ? <p className="mt-3 text-sm text-amber-700">{persistenceNotice}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      {output ? (
        <div className="rounded-xl border bg-surface p-5 md:p-6">
          <h3 className="text-lg font-semibold">{output.title || "Generated Document"}</h3>
          <details className="mt-3 rounded-md border bg-white p-4" open>
            <summary className="cursor-pointer font-semibold">Outline</summary>
            <ul className="mt-2 text-sm text-muted">{(output.outline || []).map((item) => <li key={item}>- {item}</li>)}</ul>
          </details>
          <details className="mt-3 rounded-md border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Content</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-muted">{output.contentMarkdown}</pre>
          </details>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" className="h-8 px-3 text-xs" onClick={copyOutput}>{copied ? "Copied" : "Copy Markdown"}</Button>
            <Button className="h-8 px-3 text-xs" onClick={downloadOutput}>Download .md</Button>
          </div>
          {projectId ? (
            <Link href={`/creator/projects/${projectId}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Open Project Workspace</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
