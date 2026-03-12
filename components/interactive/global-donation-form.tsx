"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Heart, Loader2, X } from "lucide-react";
import { track } from "@/lib/analytics";

type MiniDonationForm = {
  name: string;
  email: string;
  amount: string;
  message: string;
  website: string;
};

const initialForm: MiniDonationForm = {
  name: "",
  email: "",
  amount: "500",
  message: "I want to support the robotics program.",
  website: "",
};

const presets = [250, 500, 1000, 2500];

export function GlobalDonationForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<MiniDonationForm>(initialForm);

  const valid = useMemo(() => {
    const amount = Number.parseFloat(form.amount.replace(/[^0-9.]/g, ""));
    return Boolean(form.name.trim() && form.email.trim() && Number.isFinite(amount) && amount > 0);
  }, [form]);

  const startPayfast = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;

    const amount = Number.parseFloat(form.amount.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please provide a valid amount.");
      return;
    }

    setLoading(true);
    setError("");
    track("global_donation_checkout_attempt", { amount });

    try {
      const res = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: form.name,
          donorEmail: form.email,
          itemName: "Robotics Program Donation",
          itemDescription: "Global donation widget contribution",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not start PayFast checkout.");
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) throw new Error("No checkout URL returned.");
      track("global_donation_checkout_redirect", { amount });
      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
      setLoading(false);
      track("global_donation_checkout_failed");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)]">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-emerald-400/50 bg-[#052035] px-4 py-3 text-left text-white shadow-xl"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Heart className="h-4 w-4 text-emerald-300" /> Donate to Robotics
          </span>
          <span className="text-xs text-emerald-200">From R150</span>
        </button>
      ) : (
        <form onSubmit={startPayfast} className="rounded-2xl border border-emerald-400/40 bg-[#061d30] p-4 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-300">Support Robotics</p>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-500 p-1 text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-300">Available on every page so supporters can donate anytime.</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              className="h-10 rounded-md border border-slate-500 bg-[#0a2a42] px-3 text-sm"
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              className="h-10 rounded-md border border-slate-500 bg-[#0a2a42] px-3 text-sm"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, amount: String(preset) }))}
                className="rounded-full border border-emerald-300/45 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100"
              >
                R{preset}
              </button>
            ))}
          </div>

          <input
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            placeholder="Custom amount"
            className="mt-3 h-10 w-full rounded-md border border-slate-500 bg-[#0a2a42] px-3 text-sm"
          />

          <textarea
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            rows={2}
            className="mt-3 w-full rounded-md border border-slate-500 bg-[#0a2a42] px-3 py-2 text-sm"
            placeholder="Optional note"
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

          {error ? <p className="mt-2 text-xs text-rose-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !valid}
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md bg-emerald-400 px-4 text-sm font-semibold text-[#052014] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Donate with PayFast"}
          </button>
        </form>
      )}
    </div>
  );
}
