"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

type SupportForm = {
  name: string;
  email: string;
  company: string;
  supportType: "Once-off Donation" | "Monthly Backer" | "Corporate Sponsor";
  amount: string;
  message: string;
  website: string;
};

const defaultForm: SupportForm = {
  name: "",
  email: "",
  company: "",
  supportType: "Once-off Donation",
  amount: "R500",
  message: "I want to support the robotics program and would like the next step.",
  website: "",
};

const supportLanes = [
  {
    title: "Once-off Donation",
    amount: "R150-R5,000",
    impact: "Funds sensors, camera modules, and rapid prototype materials.",
  },
  {
    title: "Monthly Backer",
    amount: "From R500 / month",
    impact: "Supports recurring research cycles, testing, and safety validation.",
  },
  {
    title: "Corporate Sponsor",
    amount: "From R15,000",
    impact: "Co-funds milestone builds and receives progress reports and sponsor visibility.",
  },
];

export function RoboticsFundingPanel() {
  const [form, setForm] = useState<SupportForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [payfastLoading, setPayfastLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const valid = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim() && form.message.trim().length >= 12);
  }, [form]);

  const normalizeAmount = (value: string) => {
    const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric) || numeric <= 0) return null;
    return Math.round(numeric * 100) / 100;
  };

  const startPayfastCheckout = async (amountInput: string) => {
    const amount = normalizeAmount(amountInput);
    if (!amount) {
      setError("Please enter a valid donation amount for PayFast.");
      return;
    }

    setPayfastLoading(true);
    setError("");
    track("robotics_payfast_checkout_attempt", { amount });

    try {
      const res = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: form.name || "Supporter",
          donorEmail: form.email || undefined,
          itemName: "Robotics Program Donation",
          itemDescription: "Support for LX Obsidian Labs robotics program.",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not start PayFast checkout.");
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) throw new Error("PayFast checkout URL not returned.");
      track("robotics_payfast_checkout_redirect", { amount });
      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "PayFast checkout failed.");
      track("robotics_payfast_checkout_failed", { amount });
    } finally {
      setPayfastLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;

    setLoading(true);
    setSuccess(false);
    setError("");
    track("robotics_support_submit_attempt", { lane: form.supportType });

    try {
      const payload = {
        projectType: "Robotics Program Support",
        budgetRange: form.amount,
        timeline: "Immediate",
        name: form.name,
        email: form.email,
        company: form.company,
        currentTools: `Support lane: ${form.supportType}`,
        primaryGoal: "Fund robotics research and prototype development",
        message: `${form.message}\n\nSupport Type: ${form.supportType}`,
        website: form.website,
        startedAt,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not submit support request.");
      }

      const data = (await res.json().catch(() => null)) as { whatsappUrl?: string } | null;
      setSuccess(true);
      setForm(defaultForm);
      setStartedAt(Date.now());
      track("robotics_support_submit_success", { lane: payload.currentTools });

      if (data?.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Submission failed.");
      track("robotics_support_submit_failed", { lane: form.supportType });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate-robotics" className="rounded-2xl border border-emerald-300/30 bg-[#051327] p-6 text-white md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Fund The Mission</p>
      <h3 className="mt-2 text-2xl font-bold md:text-3xl">Turn this robotics vision into funded momentum.</h3>
      <p className="mt-3 max-w-3xl text-sm text-slate-200">
        If you want this program to ship faster, support it directly. Donations and sponsorships fund hardware, OpenCV testing cycles,
        and non-intrusive robotics prototypes.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {supportLanes.map((lane) => (
          <article key={lane.title} className="rounded-xl border border-emerald-200/25 bg-[#081b35] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-200">{lane.title}</p>
            <p className="mt-2 text-lg font-bold text-white">{lane.amount}</p>
            <p className="mt-2 text-sm text-slate-300">{lane.impact}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-600 bg-[#091a31] p-4">
          <p className="text-sm font-semibold text-emerald-200">Request Donation Details</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Your name"
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white placeholder:text-slate-300"
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white placeholder:text-slate-300"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              placeholder="Company (optional)"
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white placeholder:text-slate-300"
            />
            <select
              value={form.supportType}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, supportType: event.target.value as SupportForm["supportType"] }))
              }
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white"
            >
              <option>Once-off Donation</option>
              <option>Monthly Backer</option>
              <option>Corporate Sponsor</option>
            </select>
          </div>

          <input
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            placeholder="Amount or range (e.g. R1500)"
            className="h-10 w-full rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white placeholder:text-slate-300"
          />

          <textarea
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            rows={4}
            className="w-full rounded-md border border-slate-500 bg-[#0a223f] px-3 py-2 text-sm text-white placeholder:text-slate-300"
            placeholder="Share intent, timeline, and preferred channel for next steps."
          />

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            className="hidden"
            aria-hidden="true"
          />

          {success ? <p className="text-sm text-emerald-200">Submitted. Opening WhatsApp handoff if available.</p> : null}
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}

          <Button type="submit" disabled={loading || !valid} className="bg-emerald-500 text-[#032111] hover:bg-emerald-400">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Support Request"}
          </Button>
        </form>

        <aside className="rounded-xl border border-slate-600 bg-[#091a31] p-4">
          <p className="text-sm font-semibold text-emerald-200">Direct Support Routes</p>
          <p className="mt-2 text-sm text-slate-300">Use the fastest path if you already know your contribution lane.</p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void startPayfastCheckout(form.amount)}
              disabled={payfastLoading}
              className="rounded-md border border-yellow-200/50 bg-yellow-200/15 px-3 py-2 text-left text-sm font-semibold text-yellow-50 disabled:opacity-60"
            >
              {payfastLoading ? "Preparing PayFast checkout..." : "Donate with PayFast"}
            </button>
            <a
              href="https://wa.me/27762982399?text=I%20want%20to%20donate%20to%20the%20robotics%20program."
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-emerald-300/50 bg-emerald-300/15 px-3 py-2 text-sm font-semibold text-emerald-100"
              onClick={() => track("robotics_support_whatsapp_click")}
            >
              Donate via WhatsApp
            </a>
            <a
              href="mailto:vilanenathan@gmail.com?subject=Robotics%20Program%20Support"
              className="rounded-md border border-slate-500 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-200"
              onClick={() => track("robotics_support_email_click")}
            >
              Donate via Email
            </a>
            <Link href="/services/design-order" className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100">
              Order Designs (funds robotics R&D)
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Indirect model: every paid design/system project contributes to robotics development capacity.
          </p>
        </aside>
      </div>
    </section>
  );
}
