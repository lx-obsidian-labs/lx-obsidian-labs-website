import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { ConsultStudio } from "@/components/creator/consult-studio";

export const metadata: Metadata = {
  title: "Creator Business Consult",
  description: "Use Obsidian Creator for strategy planning, pricing, and operational consultancy outputs.",
  alternates: { canonical: "/creator/consult" },
};

export default function CreatorConsultPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Consult</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Business Consultant</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">Generate practical strategy outputs: pricing models, action plans, SOP outlines, and growth roadmap drafts.</p>
      </Section>
      <Section className="bg-surface pt-0">
        <ConsultStudio />
      </Section>
    </>
  );
}
