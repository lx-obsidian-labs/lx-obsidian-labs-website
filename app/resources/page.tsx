import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Decision-support resources from LX Obsidian Labs, including project planning templates and implementation checklists.",
  alternates: { canonical: "/resources" },
  openGraph: { images: [{ url: "/opengraph-image" }] },
  twitter: { images: ["/opengraph-image"] },
};

const resources = [
  {
    title: "Project Scope Brief Template",
    detail: "A concise template to align goals, scope, milestones, and technical constraints before execution.",
  },
  {
    title: "Vendor Evaluation Checklist",
    detail: "A practical checklist for evaluating technology partners on delivery quality, risk, and long-term fit.",
  },
  {
    title: "Automation Readiness Checklist",
    detail: "A step-by-step framework to identify high-value automation opportunities without process chaos.",
  },
  {
    title: "Deployment Handoff Guide",
    detail: "A launch-ready handoff structure including ownership, monitoring, and post-release support expectations.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Resources</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Decision-support assets for better project outcomes.</h1>
        <p className="mt-5 max-w-2xl text-muted">
          These resources help teams align faster, reduce planning friction, and improve implementation quality.
        </p>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.title} className="rounded-xl border bg-white p-6">
              <h2 className="text-xl font-semibold">{resource.title}</h2>
              <p className="mt-3 text-sm text-muted">{resource.detail}</p>
              <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                Request This Resource
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
