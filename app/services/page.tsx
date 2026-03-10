import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/cards/service-card";
import { Button } from "@/components/ui/button";
import { customerNeedPaths, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore software development, graphic design, and business consultancy services from LX Obsidian Labs.",
  alternates: { canonical: "/services" },
  openGraph: { images: [{ url: "/services/opengraph-image" }] },
  twitter: { images: ["/services/opengraph-image"] },
};

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LX Obsidian Labs Services",
    itemListElement: services.map((service, index) => ({
      "@type": "Service",
      position: index + 1,
      name: service.title,
      description: service.description,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Choose the right delivery route and start quickly.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          We keep this page focused: identify your goal, pick a service route, and move into execution.
        </p>
        <div className="mt-7 grid gap-3 md:max-w-3xl md:grid-cols-3">
          <Link href="/services#start" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Where to start
          </Link>
          <Link href="/contact" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Talk to customer care
          </Link>
          <Link href="/services/design-order" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Place design order
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div id="start" className="mb-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Start Here</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Pick your goal. We route you to the right service.</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {customerNeedPaths.map((path) => (
              <article key={path.title} className="rounded-md border bg-white p-4">
                <h3 className="text-base font-semibold">{path.title}</h3>
                <p className="mt-2 text-xs text-muted">{path.problem}</p>
                <p className="mt-2 text-sm font-medium text-[#111111]">Recommended: {path.recommendation}</p>
                <Link href={path.href} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
                  Continue
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Fast Track</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm text-[#111111]">
              Need design deliverables quickly? Use Graphic Design Fast Track and place the request directly.
            </p>
            <Button asChild className="w-full md:w-auto">
              <Link href="/services/design-order">Start Design Order</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Customer Care + Sales Support</p>
          <p className="mt-2 max-w-3xl text-sm text-muted">You get one clear owner, scoped milestones, and practical support from onboarding to launch.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact">Start with Customer Care</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/creator">Use Obsidian Creator</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
