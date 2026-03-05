"use client";

import Link from "next/link";
import { useMemo } from "react";
import { readCreatorProjects } from "@/lib/creator-store";

type Props = { id: string };

export function CreatorProjectDetail({ id }: Props) {
  const project = useMemo(() => readCreatorProjects().find((item) => item.id === id) || null, [id]);

  const payloadText = useMemo(() => {
    if (!project) return "";
    try {
      return JSON.stringify(project.payload, null, 2);
    } catch {
      return "Could not render payload.";
    }
  }, [project]);

  if (!project) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-muted">Project not found in this browser storage.</p>
        <Link href="/creator/projects" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{project.type}</p>
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-sm text-muted">Created {new Date(project.createdAt).toLocaleString()} | Updated {new Date(project.updatedAt).toLocaleString()}</p>
      <details className="rounded-md border bg-surface p-4" open>
        <summary className="cursor-pointer font-semibold">Project Payload</summary>
        <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted">{payloadText}</pre>
      </details>
      <div className="flex flex-wrap gap-3">
        <Link href="/creator/web" className="text-sm font-semibold text-accent hover:underline">Open Web Builder</Link>
        <Link href="/creator/docs" className="text-sm font-semibold text-accent hover:underline">Open Document Studio</Link>
      </div>
    </div>
  );
}
