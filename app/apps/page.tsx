import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Apps",
  description: "Download LX Obsidian Labs applications and software tools.",
  alternates: { canonical: "/apps" },
};

const apps = [
  {
    name: "BIMAX Audio Player",
    version: "v1.0.0",
    description: "Desktop audio player application for Windows. Play your music with a clean, simple interface.",
    file: "/downloads/BIMAX_Audio_Player_v1.0.0.exe",
    size: "~45 MB",
    platform: "Windows",
  },
];

export default function AppsPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Downloads</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">LX Obsidian Labs Apps</h1>
        <p className="mt-5 max-w-2xl text-muted">
          Download our desktop applications and software tools. All downloads are free to use.
        </p>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <article
              key={app.name}
              className="group flex flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Download className="h-6 w-6 text-accent" />
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                  {app.platform}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold">{app.name}</h2>
              <p className="mt-2 text-sm text-muted">{app.description}</p>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xs text-zinc-400">{app.version} • {app.size}</span>
                <a
                  href={app.file}
                  download
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>

        {apps.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center">
            <Download className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 text-zinc-500">No apps available for download yet.</p>
          </div>
        )}
      </Section>
    </>
  );
}
