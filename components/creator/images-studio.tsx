"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ImagesStudio() {
  const [assetType, setAssetType] = useState("social-campaign");
  const [brandName, setBrandName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const createImageBrief = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${brandName || "Brand"} ${assetType} brief`,
          type: "image",
          description: "Image creative brief generated from intake",
          payload: {
            assetType,
            brandName,
            prompt,
            outputs: ["Primary creative direction", "Format checklist", "Copy hooks"],
          },
        }),
      });

      const data = (await res.json().catch(() => null)) as { project?: { id: string }; error?: string } | null;
      if (!res.ok || !data?.project?.id) {
        throw new Error(data?.error || "Unable to create image brief.");
      }
      setProjectId(data.project.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create image brief.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 md:p-6">
      <h2 className="text-xl font-semibold">Image Brief Builder</h2>
      <p className="mt-2 text-sm text-muted">Generate a production-ready visual brief and save it as a versioned Creator project.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select className="h-11 rounded-md border px-3 text-sm" value={assetType} onChange={(e) => setAssetType(e.target.value)}>
          <option value="social-campaign">Social campaign assets</option>
          <option value="ad-creative">Ad creative</option>
          <option value="brand-visual">Brand visual direction</option>
          <option value="product-showcase">Product showcase graphics</option>
        </select>
        <input
          className="h-11 rounded-md border px-3 text-sm"
          placeholder="Brand or company name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <textarea
          rows={4}
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          placeholder="Describe style, campaign objective, audience, and offer"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={createImageBrief} disabled={loading || prompt.trim().length < 8}>
          {loading ? "Creating..." : "Create Image Project"}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/services/design-order">Start Design Order</Link>
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {projectId ? (
        <Link href={`/creator/projects/${projectId}`} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Open image workspace
        </Link>
      ) : null}
    </div>
  );
}
