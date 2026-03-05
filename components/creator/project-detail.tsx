"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { id: string };

type ArtifactRecord = {
  id: string;
  title: string;
  type: string;
  content: unknown;
  version: number;
  createdAt?: string;
};

type MessageRecord = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

type ProjectRecord = {
  id: string;
  type: "web" | "docs" | "image" | "consult";
  title: string;
  createdAt: string;
  updatedAt: string;
  artifacts: ArtifactRecord[];
  messages: MessageRecord[];
};

export function CreatorProjectDetail({ id }: Props) {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [changes, setChanges] = useState<string[]>([]);

  async function loadProject() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`/api/creator/projects/${id}`, { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { project?: ProjectRecord; error?: string } | null;
      if (!res.ok) {
        setProject(null);
        setLoadError(data?.error || "Unable to load project.");
        return;
      }

      if (data?.project) {
        setProject(data.project);
        if (!selectedArtifactId && data.project.artifacts.length > 0) {
          setSelectedArtifactId(data.project.artifacts[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSelectedArtifactId(null);
    void loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectedArtifact = useMemo(() => {
    if (!project || !selectedArtifactId) return null;
    return project.artifacts.find((artifact) => artifact.id === selectedArtifactId) || null;
  }, [project, selectedArtifactId]);

  const artifactText = useMemo(() => {
    if (!selectedArtifact) return "";
    try {
      return JSON.stringify(selectedArtifact.content, null, 2);
    } catch {
      return "Unable to render artifact content.";
    }
  }, [selectedArtifact]);

  const applyEdit = async () => {
    if (!project || !selectedArtifact || instruction.trim().length < 4) return;
    setEditLoading(true);
    setError("");
    setChanges([]);

    try {
      const res = await fetch("/api/creator/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          artifactId: selectedArtifact.id,
          instruction,
          mode: project.type === "docs" ? "docs" : "web",
        }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string; changes?: string[]; newArtifact?: { id: string } } | null;
      if (!res.ok) {
        throw new Error(data?.error || "Failed to apply edit");
      }

      setInstruction("");
      setChanges(data?.changes || []);
      await loadProject();
      if (data?.newArtifact?.id) setSelectedArtifactId(data.newArtifact.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply edit");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl border bg-white p-6 text-sm text-muted">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-muted">{loadError || "Project not found."}</p>
        <Link href="/creator/projects" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-20 z-10 rounded-xl border bg-white/95 p-5 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{project.type}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <Link href="/creator/projects" className="text-sm font-semibold text-accent hover:underline">
            Back to Projects
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span>Updated {new Date(project.updatedAt).toLocaleString()}</span>
          <span className="rounded-full border px-2 py-1">
            {selectedArtifact ? `${selectedArtifact.title} (v${selectedArtifact.version})` : "No artifact selected"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <aside className="space-y-3 rounded-xl border bg-white p-4 lg:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Artifacts</p>
          <div className="space-y-2">
            {project.artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() => setSelectedArtifactId(artifact.id)}
                className={
                  artifact.id === selectedArtifactId
                    ? "w-full rounded-md border border-accent bg-[#fff1f2] p-3 text-left"
                    : "w-full rounded-md border p-3 text-left"
                }
              >
                <p className="text-sm font-semibold">{artifact.title}</p>
                <p className="text-xs text-muted">v{artifact.version} • {artifact.type}</p>
              </button>
            ))}
            {!project.artifacts.length ? <p className="text-xs text-muted">No artifacts yet.</p> : null}
          </div>
        </aside>

        <section className="space-y-3 rounded-xl border bg-white p-4 lg:col-span-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Preview / Editor</p>
          {selectedArtifact ? (
            <>
              <div className="rounded-md border bg-surface p-3 text-sm">
                <p className="font-semibold">{selectedArtifact.title}</p>
                <p className="text-xs text-muted">Artifact id: {selectedArtifact.id}</p>
              </div>
              <pre className="max-h-[460px] overflow-auto whitespace-pre-wrap rounded-md border bg-surface p-3 text-xs text-muted">{artifactText}</pre>
            </>
          ) : (
            <p className="text-sm text-muted">Select an artifact to preview.</p>
          )}
        </section>

        <aside className="space-y-3 rounded-xl border bg-white p-4 lg:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">AI Edit Panel</p>
          <textarea
            rows={6}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Edit by instruction. Example: Make hero more premium and improve SEO metadata."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
          <Button onClick={applyEdit} className="w-full" disabled={editLoading || !selectedArtifact || instruction.trim().length < 4}>
            {editLoading ? "Applying..." : "Apply Edit"}
          </Button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {changes.length ? (
            <div className="rounded-md border bg-surface p-3 text-xs text-muted">
              <p className="mb-2 font-semibold text-[#111111]">Change Summary</p>
              {changes.map((change, idx) => (
                <p key={`${change}-${idx}`}>- {change}</p>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
