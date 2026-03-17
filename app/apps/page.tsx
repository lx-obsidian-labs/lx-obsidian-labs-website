import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { DownloadSection } from "./download-section";

export const metadata: Metadata = {
  title: "BIMAX Audio Player - Download",
  description: "Beautiful YouTube Music Player for Windows. Stream millions of songs with a stunning dark neon interface.",
  alternates: { canonical: "/apps" },
};

export default function AppsPage() {
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
        <DownloadSection />
      </Section>
    </>
  );
}
