import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Obsidian Creator",
  description: "Build websites, documents, and execution plans with Obsidian Creator.",
  alternates: { canonical: "/creator" },
};

const modules = [
  { title: "Agent Workspace", href: "/creator/agent", detail: "Run multi-step goals, track progress, and save checkpoints." },
  { title: "Website Builder", href: "/creator/web", detail: "Turn one prompt into sitemap, sections, metadata, and draft code." },
  { title: "Document Studio", href: "/creator/docs", detail: "Generate proposals, company profiles, plans, and policy drafts." },
  { title: "Projects", href: "/creator/projects", detail: "Open versioned artifacts and edit outputs by instruction." },
  { title: "Consulting", href: "/creator/consult", detail: "Get execution strategy, rollout sequencing, and operating guidance." },
];

const quickStarts = [
  { label: "Build a new website", href: "/creator/web" },
  { label: "Generate a business document", href: "/creator/docs" },
  { label: "Run the autonomous agent", href: "/creator/agent" },
  { label: "Continue existing project", href: "/creator/projects" },
];

export default function CreatorPage() {
  return (
    <>
      <Section className="bg-[#0b0b0d] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Obsidian Creator</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">AI Build System for websites, docs, and execution workflows.</h1>
        <p className="mt-5 max-w-3xl text-zinc-300">
          Start with a plain-language goal, generate a usable first output, then iterate with instruction-based edits inside versioned projects.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickStarts.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
              {item.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-white pb-8">
        <div className="mb-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Workflow</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Step 1</p>
              <p className="mt-1 text-sm font-semibold">Define goal</p>
              <p className="mt-1 text-xs text-muted">Describe the business outcome you want in one prompt.</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Step 2</p>
              <p className="mt-1 text-sm font-semibold">Generate draft</p>
              <p className="mt-1 text-xs text-muted">Create a first artifact with structure, copy, and implementation hints.</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Step 3</p>
              <p className="mt-1 text-sm font-semibold">Refine by instruction</p>
              <p className="mt-1 text-xs text-muted">Use focused edits to create new artifact versions quickly.</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Step 4</p>
              <p className="mt-1 text-sm font-semibold">Ship output</p>
              <p className="mt-1 text-xs text-muted">Reuse saved projects and continue from where you left off.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((module) => (
            <article key={module.title} className="rounded-xl border bg-surface p-5">
              <h2 className="text-xl font-semibold">{module.title}</h2>
              <p className="mt-2 text-sm text-muted">{module.detail}</p>
              <Link href={module.href} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                Open Module
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/creator/projects" className="text-sm font-semibold text-accent hover:underline">
            Open Projects
          </Link>
          <Link href="/creator/billing" className="text-sm font-semibold text-accent hover:underline">
            View Billing
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-accent hover:underline">
            Login / Register
          </Link>
        </div>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">How It Works</p>
          <div className="mt-4 space-y-3">
            <details className="rounded-md border p-4" open>
              <summary className="cursor-pointer font-semibold">1. Prompt Your Build Goal</summary>
              <p className="mt-2 text-sm text-muted">Describe your app, website, document, or business task in one prompt.</p>
            </details>
            <details className="rounded-md border p-4">
              <summary className="cursor-pointer font-semibold">2. Get Structured Plan</summary>
              <p className="mt-2 text-sm text-muted">Creator returns a compact plan: pages, modules, outputs, and next actions.</p>
            </details>
            <details className="rounded-md border p-4">
              <summary className="cursor-pointer font-semibold">3. Iterate by Instruction</summary>
              <p className="mt-2 text-sm text-muted">Say what to change and regenerate without manually editing complex code.</p>
            </details>
          </div>
        </div>
      </Section>
    </>
  );
}
