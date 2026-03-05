"use client";

import Link from "next/link";
import { useState } from "react";
import { readCreatorProjects, type CreatorProject } from "@/lib/creator-store";

export function CreatorProjectsList() {
  const [projects] = useState<CreatorProject[]>(() => readCreatorProjects());

  if (!projects.length) {
    return <p className="text-sm text-muted">No creator projects yet. Generate from Web or Docs module first.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <article key={project.id} className="rounded-xl border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{project.type}</p>
          <h2 className="mt-2 text-lg font-semibold">{project.name}</h2>
          <p className="mt-2 text-xs text-muted">Updated {new Date(project.updatedAt).toLocaleString()}</p>
          <Link href={`/creator/projects/${project.id}`} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            Open Workspace
          </Link>
        </article>
      ))}
    </div>
  );
}
