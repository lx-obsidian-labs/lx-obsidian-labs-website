import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { AgentStudio } from "@/components/creator/agent-studio";

export const metadata: Metadata = {
  title: "Creator Agent",
  description: "Agentic workspace for building web apps, documents, and strategy outputs.",
  alternates: { canonical: "/creator/agent" },
};

export default function CreatorAgentPage() {
  return (
    <>
      <Section className="bg-[#0b0b0d] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Agent</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Obsidian Agent Workspace</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Run multi-step build tasks from one prompt, auto-generate outputs, iterate by instruction, and keep versioned outputs in one workspace.
        </p>
      </Section>
      <Section className="bg-surface pt-0">
        <AgentStudio />
      </Section>
    </>
  );
}
