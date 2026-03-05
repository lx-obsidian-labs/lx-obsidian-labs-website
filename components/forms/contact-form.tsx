"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { leadPayloadSchema } from "@/lib/validation";

type LeadPayload = {
  projectType: string;
  budgetRange: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const initialLead: LeadPayload = {
  projectType: "Web Application",
  budgetRange: "R50k - R150k",
  timeline: "2-4 months",
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lead, setLead] = useState<LeadPayload>(initialLead);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const stepValid = useMemo(() => {
    if (step === 1) return Boolean(lead.projectType && lead.budgetRange && lead.timeline);
    if (step === 2) return Boolean(lead.name && lead.email);
    return true;
  }, [lead, step]);

  const submitLead = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    track("lead_submit_attempt", { source: "multistep_contact_form" });

    try {
      const payload = { ...lead, startedAt };
      const validation = leadPayloadSchema.safeParse(payload);
      if (!validation.success) {
        throw new Error("Please complete all required fields with valid information.");
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Submission failed");
      }
      setSuccess(true);
      setLead(initialLead);
      setStartedAt(Date.now());
      setStep(1);
      track("lead_submit_success", { source: "multistep_contact_form" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit right now. Please use WhatsApp or email.");
      track("lead_submit_failed", { source: "multistep_contact_form" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step < 3) {
      setStep((current) => current + 1);
      track("lead_step_advance", { step, source: "multistep_contact_form" });
      return;
    }

    await submitLead();
  };

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <form className="space-y-4 rounded-xl border bg-white p-6 md:col-span-3" onSubmit={handleFormSubmit}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Smart Lead Capture</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Step {step} of 3</p>
        </div>

        <div className="h-2 rounded-full bg-surface">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
          />
        </div>

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm font-medium">
              Project Type
              <select
                value={lead.projectType}
                onChange={(e) => setLead((prev) => ({ ...prev, projectType: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
              >
                <option>Web Application</option>
                <option>CMS System</option>
                <option>Brand Identity</option>
                <option>Automation System</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Budget Range
              <select
                value={lead.budgetRange}
                onChange={(e) => setLead((prev) => ({ ...prev, budgetRange: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
              >
                <option>Below R50k</option>
                <option>R50k - R150k</option>
                <option>R150k - R300k</option>
                <option>R300k+</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Timeline
              <select
                value={lead.timeline}
                onChange={(e) => setLead((prev) => ({ ...prev, timeline: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
              >
                <option>1-2 months</option>
                <option>2-4 months</option>
                <option>4-6 months</option>
                <option>Flexible</option>
              </select>
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Name
              <input
                value={lead.name}
                onChange={(e) => setLead((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
                placeholder="Your full name"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Email
              <input
                type="email"
                value={lead.email}
                onChange={(e) => setLead((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
                placeholder="you@company.com"
              />
            </label>
            <label className="space-y-2 text-sm font-medium sm:col-span-2">
              Company
              <input
                value={lead.company}
                onChange={(e) => setLead((prev) => ({ ...prev, company: e.target.value }))}
                className="h-11 w-full rounded-md border border-border px-3 text-sm"
                placeholder="Your company"
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2">
            <label className="space-y-2 text-sm font-medium">
              Project details
              <textarea
                value={lead.message}
                onChange={(e) => setLead((prev) => ({ ...prev, message: e.target.value }))}
                rows={6}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="Tell us what you need, preferred milestones, and expected outcomes."
              />
            </label>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={lead.website}
              onChange={(e) => setLead((prev) => ({ ...prev, website: e.target.value }))}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        ) : null}

        <p className="sr-only" role="status" aria-live="polite">
          {success ? "Submitted successfully. We will reach out shortly." : error}
        </p>
        {success ? <p className="text-sm font-medium text-green-700">Submitted successfully. We will reach out shortly.</p> : null}
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : null}

          {step < 3 ? (
            <Button type="submit" disabled={!stepValid}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={loading || !lead.message.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Lead"}
            </Button>
          )}
        </div>
      </form>

      <aside className="space-y-6 rounded-xl border bg-surface p-6 md:col-span-2">
        <div>
          <h3 className="text-xl font-semibold">Fast Contact Options</h3>
          <p className="mt-2 text-sm text-muted">For immediate response, use WhatsApp or send us an email directly.</p>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            <a className="hover:text-accent" href="tel:+27762982399">
              +27 76 298 2399
            </a>
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a className="hover:text-accent" href="mailto:vilanenathan@gmail.com">
              vilanenathan@gmail.com
            </a>
          </p>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <a
            href="https://wa.me/27762982399"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2"
            onClick={() => track("whatsapp_click", { source: "contact_sidebar" })}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </Button>
      </aside>
    </div>
  );
}
