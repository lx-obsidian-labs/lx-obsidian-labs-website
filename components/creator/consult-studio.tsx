"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConsultStudio() {
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");
  const [timeline, setTimeline] = useState("30-60 days");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const createPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Consult Plan: ${objective.slice(0, 48)}`,
          type: "consult",
          description: context || "Business consulting plan",
          payload: {
            objective,
            context,
            timeline,
            nextActions: [
              "Clarify outcomes and owner accountability",
              "Sequence initiatives by impact and execution effort",
              "Define weekly checkpoints and KPI cadence",
            ],
          },
        }),
      });
      const data = (await res.json().catch(() => null)) as { project?: { id: string }; error?: string } | null;
      if (!res.ok || !data?.project?.id) {
        throw new Error(data?.error || "Unable to create consult plan.");
      }
      setProjectId(data.project.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create consult plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 md:p-6">
      <h2 className="text-xl font-semibold">Consulting Intake</h2>
      <p className="mt-2 text-sm text-muted">Capture your business objective and generate a structured consulting project workspace.</p>
      <div className="mt-4 grid gap-3">
        <input
          className="h-11 rounded-md border px-3 text-sm"
          placeholder="Primary objective (e.g. improve lead-to-close conversion)"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        <textarea
          rows={4}
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Business context and constraints"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <select className="h-11 rounded-md border px-3 text-sm" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
          <option>0-30 days</option>
          <option>30-60 days</option>
          <option>60-90 days</option>
          <option>90+ days</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={createPlan} disabled={loading || objective.trim().length < 8}>
          {loading ? "Creating..." : "Create Consulting Project"}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/creator/projects">Open Projects</Link>
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {projectId ? (
        <Link href={`/creator/projects/${projectId}`} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Open consulting workspace
        </Link>
      ) : null}
    </div>
  );
}
