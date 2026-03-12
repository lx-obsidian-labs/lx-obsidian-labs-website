import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Start Here",
  description: "Choose the best starting path for design orders, creator workflows, or managed delivery.",
  alternates: { canonical: "/start" },
};

const paths = [
  {
    title: "Order Designs",
    detail: "Primary route for fast branding, campaign assets, and visual design delivery.",
    href: "/services/design-order",
    cta: "Place Design Order",
  },
  {
    title: "Use Obsidian Creator",
    detail: "Generate website and document outputs quickly with IDE-style editing and preview flows.",
    href: "/creator/agent",
    cta: "Open Creator Agent",
  },
  {
    title: "Managed Project Brief",
    detail: "Work directly with the team for scoped implementation, milestones, and support.",
    href: "/contact#start-form",
    cta: "Start Project Brief",
  },
];

export default function StartPage() {
  return (
    <>
      <Section className="bg-[#09090b] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Start Here</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Choose one clear path and begin in minutes.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">This page is designed to remove confusion: pick your goal, follow the route, and execute.</p>
      </Section>

      <Section className="bg-white pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {paths.map((item) => (
            <article key={item.title} className="rounded-xl border bg-surface p-5">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.detail}</p>
              <Link href={item.href} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
