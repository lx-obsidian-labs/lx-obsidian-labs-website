"use client";

import { useState } from "react";
import { Download, Music, Wifi, Search, Clock, Palette, Monitor, FileText, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

const apps = [
  {
    name: "BIMAX Audio Player",
    version: "1.0.0",
    description: "Beautiful YouTube Music Player for Windows",
    longDescription:
      "Stream millions of songs from YouTube with a stunning dark neon interface. Features offline mode, smart search, advanced playback controls, and desktop integration.",
    file: "/downloads/BIMAX_Audio_Player_v1.0.0.exe",
    size: "70 MB",
    platform: "Windows 10/11",
    price: 2.0,
    priceDisplay: "$2.00",
    features: [
      { icon: Music, text: "Stream YouTube music directly" },
      { icon: Wifi, text: "Offline caching & sync" },
      { icon: Search, text: "Smart search with artist focus" },
      { icon: Clock, text: "Speed control, sleep timer, A-B repeat" },
      { icon: Palette, text: "Dark neon glassmorphism UI" },
      { icon: Monitor, text: "System tray, mini player, shortcuts" },
      { icon: FileText, text: "Lyrics display" },
    ],
    whyBimax: [
      { feature: "No ads", bimax: true, other: false },
      { feature: "Offline mode", bimax: true, other: "Limited" },
      { feature: "Artist Focus search", bimax: true, other: false },
      { feature: "A-B repeat", bimax: true, other: false },
      { feature: "Speed control", bimax: true, other: false },
      { feature: "Beautiful UI", bimax: true, other: "Basic" },
    ],
    instructions: [
      "Complete payment of $2.00",
      "Download the EXE",
      "Run anywhere - no installation needed",
      "Start streaming!",
    ],
  },
];

export function DownloadSection() {
  const app = apps[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    track("bimax_payment_attempt", { amount: app.price });

    try {
      const res = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: app.price,
          donorName: "BIMAX Customer",
          donorEmail: undefined,
          itemName: "BIMAX Audio Player",
          itemDescription: "Download access for BIMAX Audio Player v1.0.0",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not start payment.");
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) throw new Error("No payment URL returned.");

      track("bimax_payment_redirect", { amount: app.price });
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setLoading(false);
      track("bimax_payment_failed");
    }
  };

  return (
    <>
      <div className="grid gap-12 pb-20 lg:grid-cols-2 lg:pb-0">
      <div>
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-gradient-to-br from-zinc-900 to-black p-8 text-white">
            <h2 className="text-2xl font-bold">{app.name}</h2>
            <p className="mt-2 text-zinc-400">{app.description}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">{app.priceDisplay}</span>
              <span className="text-zinc-400">one-time payment</span>
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              Pay $2 & Download
            </button>

            <p className="mt-3 text-center text-xs text-zinc-400">
              Secure payment via PayFast. After payment, you will be redirected to download.
            </p>

            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>Version {app.version}</span>
              <span>{app.size}</span>
              <span>{app.platform}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Quick Features</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {app.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <feature.icon className="h-5 w-5 text-accent" />
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why BIMAX?</p>
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-center font-medium text-accent">BIMAX</th>
                  <th className="px-4 py-2 text-center font-medium">Other Players</th>
                </tr>
              </thead>
              <tbody>
                {app.whyBimax.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{row.feature}</td>
                    <td className="px-4 py-2 text-center">{row.bimax ? "✅" : "❌"}</td>
                    <td className="px-4 py-2 text-center text-zinc-500">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Get Started</p>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm">
            {app.instructions.map((step, i) => (
              <li key={i} className="text-muted">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg bg-zinc-50 p-4 text-center text-sm text-zinc-500">
          <p>Built by Nathan Vilane | LX Obsidian Labs</p>
          <p className="mt-1">© 2026 LX Obsidian Labs</p>
        </div>

        <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-4">
          <p className="text-sm font-semibold text-amber-800">Proprietary Software Notice</p>
          <p className="mt-2 text-xs text-amber-700">
            All applications found on this page are the exclusive property of LX Obsidian Labs. 
            No person, entity, or third party is permitted to edit, modify, reverse-engineer, 
            clone, or redistribute these products in any form or manner whatsoever.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            These applications are provided for your personal enjoyment and everyday use. 
            By downloading, you agree to use the software as intended — freely and responsibly.
          </p>
        </div>
      </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#0f172a] p-3 lg:hidden">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Pay $2 & Download BIMAX
        </button>
      </div>
    </>
  );
}
