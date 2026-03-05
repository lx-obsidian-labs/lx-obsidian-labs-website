"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createProjectId, upsertCreatorProject } from "@/lib/creator-store";

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

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/docs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, companyName, industry, tone, goal, keyPoints: keyPoints.split(",").map((item) => item.trim()).filter(Boolean) }),
      });

      const data = (await res.json().catch(() => null)) as DocOutput | { error?: string } | null;
      if (!res.ok || !data || ("error" in data && typeof data.error === "string")) {
        throw new Error((data as { error?: string } | null)?.error || "Document generation failed");
      }
      const outputData = data as DocOutput;

      const id = createProjectId();
      setProjectId(id);
      setOutput(outputData);
      upsertCreatorProject({
        id,
        type: "docs",
        name: outputData.title || `${companyName} Document`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payload: outputData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document generation failed");
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
          {projectId ? (
            <Link href={`/creator/projects/${projectId}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Open Project Workspace</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
