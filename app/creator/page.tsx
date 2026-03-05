import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Obsidian Creator",
  description: "Build apps, web apps, documents, and business outputs with Obsidian Creator.",
  alternates: { canonical: "/creator" },
};

const modules = [
  { title: "Run Obsidian Agent", href: "/creator/agent", detail: "Multi-step in-browser agent workflow like Lovable/Cursor." },
  { title: "Build Web Apps", href: "/creator/web", detail: "Prompt-to-plan website and app generation." },
  { title: "Create Documents", href: "/creator/docs", detail: "Generate business documents and profiles." },
  { title: "Generate Images", href: "/creator/images", detail: "Create brand-ready visuals and assets." },
  { title: "Business Consultant", href: "/creator/consult", detail: "Get strategy, pricing, and execution plans." },
];

export default function CreatorPage() {
  return (
    <>
      <Section className="bg-[#0b0b0d] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Obsidian Creator</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Build apps and web apps with AI, Base44-style.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Pick what you want to build, describe it in plain language, and iterate quickly with guided outputs.
        </p>
      </Section>

      <Section className="bg-white">
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
