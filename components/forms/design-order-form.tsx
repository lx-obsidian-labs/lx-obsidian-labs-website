"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const deliverableOptions = [
  "Logo Design",
  "Brand Guidelines",
  "Social Media Kit",
  "Marketing Materials",
  "Website UI Screens",
  "Packaging Design",
];

type FormState = {
  name: string;
  email: string;
  company: string;
  industry: string;
  goal: string;
  style: string;
  timeline: string;
  budgetRange: string;
  deliverables: string[];
  brief: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  industry: "",
  goal: "",
  style: "",
  timeline: "2-4 months",
  budgetRange: "R50k - R150k",
  deliverables: ["Logo Design", "Brand Guidelines"],
  brief: "",
};

export function DesignOrderForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(form.name && form.email && form.goal && form.brief && form.deliverables.length > 0);
  }, [form]);

  const toggleDeliverable = (item: string) => {
    setForm((prev) => {
      const exists = prev.deliverables.includes(item);
      const next = exists ? prev.deliverables.filter((entry) => entry !== item) : [...prev.deliverables, item];
      return { ...prev, deliverables: next };
    });
  };

  const generateWithAi = async () => {
    setAiLoading(true);
    setError("");

    try {
      const prompt = `Create a concise professional graphic design brief for LX Obsidian Labs client onboarding with these details:
Company: ${form.company || "Not provided"}
Industry: ${form.industry || "Not provided"}
Main Goal: ${form.goal || "Not provided"}
Deliverables: ${form.deliverables.join(", ") || "Not provided"}
Visual Style: ${form.style || "Modern high-contrast"}
Timeline: ${form.timeline}
Budget: ${form.budgetRange}

Return sections only:
1) Project Objective
2) Deliverables
3) Visual Direction
4) Priority Channels
5) Constraints and Notes`;

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: prompt }] }),
      });

      const data = (await res.json().catch(() => null)) as { reply?: string } | null;
      if (!res.ok || !data?.reply) {
        throw new Error("Unable to generate brief right now.");
      }

      setForm((prev) => ({ ...prev, brief: data.reply || prev.brief }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate brief right now.");
    } finally {
      setAiLoading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        projectType: "Brand Identity",
        budgetRange: form.budgetRange,
        timeline: form.timeline,
        name: form.name,
        email: form.email,
        company: form.company,
        currentTools: `Design deliverables: ${form.deliverables.join(", ")}. Industry: ${form.industry || "Not provided"}`,
        primaryGoal: form.goal,
        message: form.brief,
        website: "",
        startedAt,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { error?: string; whatsappUrl?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || "Could not submit order.");
      }

      setSuccess("Design order submitted. Redirecting to WhatsApp...");
      setForm(initialState);
      setStartedAt(Date.now());

      if (data?.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5 rounded-xl border bg-white p-6 md:p-8" onSubmit={submit}>
      <div>
        <h2 className="text-2xl font-bold">Graphic Design Quick Order</h2>
        <p className="mt-2 text-sm text-muted">Tell us what you need. Use AI to draft your brief, then submit in one step.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input className="h-11 rounded-md border px-3 text-sm" placeholder="Your name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <input className="h-11 rounded-md border px-3 text-sm" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input className="h-11 rounded-md border px-3 text-sm" placeholder="Company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
        <input className="h-11 rounded-md border px-3 text-sm" placeholder="Industry" value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input className="h-11 rounded-md border px-3 text-sm" placeholder="Main goal (e.g., rebrand for growth)" value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))} />
        <input className="h-11 rounded-md border px-3 text-sm" placeholder="Visual style (e.g., clean, premium, bold)" value={form.style} onChange={(e) => setForm((p) => ({ ...p, style: e.target.value }))} />
      </div>

      <div>
        <p className="text-sm font-medium">Deliverables</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {deliverableOptions.map((item) => {
            const active = form.deliverables.includes(item);
            return (
              <button
                key={item}
                type="button"
                className={active ? "rounded-md border border-accent bg-[#fff1f2] px-3 py-2 text-left text-sm" : "rounded-md border px-3 py-2 text-left text-sm"}
                onClick={() => toggleDeliverable(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select className="h-11 rounded-md border px-3 text-sm" value={form.timeline} onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}>
          <option>1-2 months</option>
          <option>2-4 months</option>
          <option>4-6 months</option>
          <option>Flexible</option>
        </select>
        <select className="h-11 rounded-md border px-3 text-sm" value={form.budgetRange} onChange={(e) => setForm((p) => ({ ...p, budgetRange: e.target.value }))}>
          <option>Below R50k</option>
          <option>R50k - R150k</option>
          <option>R150k - R300k</option>
          <option>R300k+</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">Project brief</p>
          <Button type="button" variant="secondary" onClick={generateWithAi} disabled={aiLoading} className="w-full sm:w-auto">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Use AI to Draft Brief
          </Button>
        </div>
        <textarea
          rows={8}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Paste or generate your design brief here..."
          value={form.brief}
          onChange={(e) => setForm((p) => ({ ...p, brief: e.target.value }))}
        />
      </div>

      {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={!canSubmit || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Design Order"}
      </Button>
    </form>
  );
}
