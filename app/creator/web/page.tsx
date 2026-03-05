import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { WebStudio } from "@/components/creator/web-studio";

export const metadata: Metadata = {
  title: "Creator Web Builder",
  description: "Plan and build web apps with Obsidian Creator.",
  alternates: { canonical: "/creator/web" },
};

export default function CreatorWebPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Web</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Web & App Builder</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">Prompt-to-plan workspace for fast build cycles with project persistence and versioned outputs.</p>
      </Section>
      <Section className="bg-surface pt-0">
        <WebStudio />
      </Section>
    </>
  );
}
