import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { CreatorProjectsList } from "@/components/creator/projects-list";

export const metadata: Metadata = {
  title: "Creator Projects",
  description: "View saved Obsidian Creator projects and outputs.",
  alternates: { canonical: "/creator/projects" },
};

export default function CreatorProjectsPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Projects</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Saved Projects</h1>
      </Section>
      <Section className="bg-surface pt-0">
        <CreatorProjectsList />
      </Section>
    </>
  );
}
