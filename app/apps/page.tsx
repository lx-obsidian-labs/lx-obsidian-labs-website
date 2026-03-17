import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Download, Music, Wifi, Search, Clock, Palette, Monitor, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "BIMAX Audio Player - Download",
  description: "Beautiful YouTube Music Player for Windows. Stream millions of songs with a stunning dark neon interface.",
  alternates: { canonical: "/apps" },
};

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
    price: "$9.99",
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
      "Download the EXE",
      "Run anywhere - no installation needed",
      "Start streaming!",
    ],
  },
];

export default function AppsPage() {
  const app = apps[0];

  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Downloads</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">LX Obsidian Labs Apps</h1>
        <p className="mt-5 max-w-2xl text-muted">
          Download our desktop applications and software tools.
        </p>
      </Section>

      <Section className="bg-white pb-20 pt-0">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="sticky top-24">
              <div className="rounded-2xl border bg-gradient-to-br from-zinc-900 to-black p-8 text-white">
                <h2 className="text-2xl font-bold">{app.name}</h2>
                <p className="mt-2 text-zinc-400">{app.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-accent">{app.price}</span>
                  <span className="text-zinc-400">one-time payment</span>
                </div>

                <a
                  href={app.file}
                  download
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                >
                  <Download className="h-5 w-5" />
                  Download Now
                </a>

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
      </Section>
    </>
  );
}
