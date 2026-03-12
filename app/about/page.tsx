import type { Metadata } from "next";
import Link from "next/link";
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
        <div className="space-y-3">
          <details className="rounded-xl border bg-white p-5" open>
            <summary className="cursor-pointer text-lg font-semibold">Company Overview</summary>
            <p className="mt-3 text-sm text-muted">We build digital systems, brand ecosystems, and technology infrastructure that help businesses execute with clarity.</p>
          </details>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer text-lg font-semibold">Mission</summary>
            <p className="mt-3 text-sm text-muted">To deliver practical, high-impact digital solutions that improve how organizations build, operate, and grow.</p>
          </details>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer text-lg font-semibold">Vision</summary>
            <p className="mt-3 text-sm text-muted">To become a trusted systems partner for ambitious companies seeking sustainable growth through technology and design.</p>
          </details>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer text-lg font-semibold">Approach</summary>
            <p className="mt-3 text-sm text-muted">We work in focused phases: discovery, strategy, implementation, and optimization, ensuring every decision supports measurable business outcomes.</p>
          </details>
        </div>
      </Section>

      <Section className="bg-white pt-0">
        <div className="space-y-3">
          <details className="rounded-xl border p-5" open>
            <summary className="cursor-pointer text-lg font-semibold">Why LX Obsidian Labs</summary>
            <p className="mt-3 text-sm text-muted">Cross-functional execution prevents strategy, design, and implementation from drifting apart.</p>
          </details>
          <details className="rounded-xl border p-5">
            <summary className="cursor-pointer text-lg font-semibold">How We Work</summary>
            <p className="mt-3 text-sm text-muted">We prioritize speed with structure, keeping communication direct and milestones measurable.</p>
          </details>
          <details className="rounded-xl border p-5">
            <summary className="cursor-pointer text-lg font-semibold">Our Philosophy</summary>
            <p className="mt-3 text-sm text-muted">Strong systems create long-term leverage. Every deliverable should stay useful beyond launch day.</p>
          </details>
        </div>
      </Section>

      <Section className="bg-surface pt-0">
        <ProcessExplorer />
      </Section>

      <Section className="bg-white pt-0">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Strategic Transition</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Roadmap toward applied robotics by 2028.</h2>
        <Link href="/robotics" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Read Nathan Vilane&apos;s Robotics Vision
        </Link>
        <div className="mt-6 space-y-3">
          {roboticsRoadmap.map((item, index) => (
            <details key={item.year} className="rounded-xl border bg-surface p-5" open={index === 0}>
              <summary className="cursor-pointer text-base font-semibold">
                <span className="mr-2 text-accent">{item.year}</span>
                {item.title}
              </summary>
              <p className="mt-3 text-sm text-muted">{item.detail}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
