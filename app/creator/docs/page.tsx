import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Creator Document Studio",
  description: "Generate professional company and business documents with Obsidian Creator.",
  alternates: { canonical: "/creator/docs" },
};

export default function CreatorDocsPage() {
  return (
    <Section className="bg-white py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Docs</p>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Document Studio</h1>
      <p className="mt-4 max-w-2xl text-sm text-muted">Generate company profiles, business plans, proposals, and policy templates with AI-guided structure.</p>
    </Section>
  );
}
