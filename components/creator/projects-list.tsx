"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CreatorProject = {
  id: string;
  type: "web" | "docs" | "image" | "consult";
  title: string;
  updatedAt: string;
};

export function CreatorProjectsList() {
  const [projects, setProjects] = useState<CreatorProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/creator/projects", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as { projects?: CreatorProject[]; error?: string } | null;
        if (!res.ok) {
          setError(data?.error || "Unable to load creator projects.");
          return;
        }

        if (data?.projects) {
          setProjects(data.projects);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted">Loading projects...</p>;
  }

  if (!projects.length) {
    if (error) {
      return <p className="text-sm text-red-700">{error}</p>;
    }

    return <p className="text-sm text-muted">No creator projects yet. Generate from Web or Docs module first.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <article key={project.id} className="rounded-xl border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{project.type}</p>
          <h2 className="mt-2 text-lg font-semibold">{project.title}</h2>
          <p className="mt-2 text-xs text-muted">Updated {new Date(project.updatedAt).toLocaleString()}</p>
          <Link href={`/creator/projects/${project.id}`} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            Open Workspace
          </Link>
        </article>
      ))}
    </div>
  );
}
