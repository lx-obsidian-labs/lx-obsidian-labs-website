"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

type DonationForm = {
  name: string;
  email: string;
  amount: string;
  frequency: "Once-off" | "Monthly";
  purpose: "Sensors" | "Vision R&D" | "Safety Testing" | "General Program";
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

const amountPresets = [250, 500, 1000, 2500, 5000, 10000];

const defaultForm: DonationForm = {
  name: "",
  email: "",
  amount: "500",
  frequency: "Once-off",
  purpose: "General Program",
};

export function RoboticsFundingPanel() {
  const [form, setForm] = useState<DonationForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const valid = useMemo(() => {
    const amount = Number.parseFloat(form.amount.replace(/[^0-9.]/g, ""));
    return Boolean(form.name.trim() && form.email.trim() && Number.isFinite(amount) && amount > 0);
  }, [form]);

  const startPayfastCheckout = async () => {
    const amount = Number.parseFloat(form.amount.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    setLoading(true);
    setError("");
    track("robotics_payfast_checkout_attempt", { amount, purpose: form.purpose, frequency: form.frequency });

    try {
      const res = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: form.name,
          donorEmail: form.email,
          itemName: "Robotics Program Donation",
          itemDescription: `${form.frequency} donation for ${form.purpose}`,
          customStr1: form.frequency,
          customStr2: form.purpose,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not start PayFast checkout.");
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) throw new Error("PayFast checkout URL not returned.");

      track("robotics_payfast_checkout_redirect", { amount, purpose: form.purpose, frequency: form.frequency });
      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "PayFast checkout failed.");
      setLoading(false);
      track("robotics_payfast_checkout_failed");
    }
  };

  return (
    <section id="donate-robotics" className="rounded-2xl border border-emerald-300/30 bg-[#051327] p-6 text-white md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Fund The Mission</p>
      <h3 className="mt-2 text-2xl font-bold md:text-3xl">Donate now and push robotics development forward.</h3>
      <p className="mt-3 max-w-3xl text-sm text-slate-200">
        No request flow. No waiting. Choose your amount and pay instantly via PayFast. Every donation accelerates hardware, OpenCV
        testing cycles, and prototype delivery.
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
        <div className="space-y-3 rounded-xl border border-slate-600 bg-[#091a31] p-4">
          <p className="text-sm font-semibold text-emerald-200">PayFast Donation Checkout</p>
          <p className="text-xs text-slate-300">Complete details, choose amount, then go straight to secure payment.</p>

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
            <select
              value={form.frequency}
              onChange={(event) => setForm((prev) => ({ ...prev, frequency: event.target.value as DonationForm["frequency"] }))}
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white"
            >
              <option>Once-off</option>
              <option>Monthly</option>
            </select>
            <select
              value={form.purpose}
              onChange={(event) => setForm((prev) => ({ ...prev, purpose: event.target.value as DonationForm["purpose"] }))}
              className="h-10 rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white"
            >
              <option>Sensors</option>
              <option>Vision R&D</option>
              <option>Safety Testing</option>
              <option>General Program</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {amountPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, amount: String(preset) }))}
                className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100"
              >
                R{preset}
              </button>
            ))}
          </div>

          <input
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            placeholder="Custom amount"
            className="h-10 w-full rounded-md border border-slate-500 bg-[#0a223f] px-3 text-sm text-white placeholder:text-slate-300"
          />

          {error ? <p className="text-sm text-rose-200">{error}</p> : null}

          <button
            type="button"
            onClick={() => void startPayfastCheckout()}
            disabled={loading || !valid}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-emerald-400 px-4 text-sm font-semibold text-[#052014] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Donate Now with PayFast"}
          </button>
        </div>

        <aside className="rounded-xl border border-slate-600 bg-[#091a31] p-4">
          <p className="text-sm font-semibold text-emerald-200">Alternative Routes</p>
          <p className="mt-2 text-sm text-slate-300">If you prefer not to use card checkout, use these options.</p>
          <div className="mt-4 flex flex-col gap-2">
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
              Donate via Email / EFT
            </a>
            <Link href="/services/design-order" className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100">
              Order Designs (funds robotics R&D)
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
