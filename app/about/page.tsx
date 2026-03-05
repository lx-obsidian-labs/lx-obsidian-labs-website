import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { ProcessExplorer } from "@/components/interactive/process-explorer";
import { companyContent, roboticsRoadmap } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the mission, vision, and operating philosophy of LX Obsidian Labs.",
  alternates: { canonical: "/about" },
  openGraph: { images: [{ url: "/about/opengraph-image" }] },
  twitter: { images: ["/about/opengraph-image"] },
};

export default function AboutPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">About</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">A multidisciplinary partner for modern business growth.</h1>
        <p className="mt-5 max-w-2xl text-muted">
          LX Obsidian Labs integrates software engineering, visual design, and systems consulting to build businesses that are both scalable and
          efficient.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">{companyContent.transitionNote}</p>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-white p-6">
            <h2 className="text-2xl font-semibold">Company Overview</h2>
            <p className="mt-3 text-sm text-muted">
              We build digital systems, brand ecosystems, and technology infrastructure that help businesses execute with clarity.
            </p>
          </article>

          <article className="rounded-xl border bg-white p-6">
            <h2 className="text-2xl font-semibold">Mission</h2>
            <p className="mt-3 text-sm text-muted">
              To deliver practical, high-impact digital solutions that improve how organizations build, operate, and grow.
            </p>
          </article>

          <article className="rounded-xl border bg-white p-6">
            <h2 className="text-2xl font-semibold">Vision</h2>
            <p className="mt-3 text-sm text-muted">
              To become a trusted systems partner for ambitious companies seeking sustainable growth through technology and design.
            </p>
          </article>

          <article className="rounded-xl border bg-white p-6">
            <h2 className="text-2xl font-semibold">Approach</h2>
            <p className="mt-3 text-sm text-muted">
              We work in focused phases: discovery, strategy, implementation, and optimization, ensuring every decision supports measurable
              business outcomes.
            </p>
          </article>
        </div>
      </Section>

      <Section className="bg-white pt-0">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-semibold">Why LX Obsidian Labs</h3>
            <p className="mt-3 text-sm text-muted">Cross-functional execution prevents strategy, design, and implementation from drifting apart.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-semibold">How We Work</h3>
            <p className="mt-3 text-sm text-muted">We prioritize speed with structure, keeping communication direct and milestones measurable.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-semibold">Our Philosophy</h3>
            <p className="mt-3 text-sm text-muted">Strong systems create long-term leverage. Every deliverable should stay useful beyond launch day.</p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface pt-0">
        <ProcessExplorer />
      </Section>

      <Section className="bg-white pt-0">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Strategic Transition</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Roadmap toward applied robotics by 2028.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {roboticsRoadmap.map((item) => (
            <article key={item.year} className="rounded-xl border bg-surface p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{item.year}</p>
              <h3 className="mt-2 text-lg font-semibold md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
