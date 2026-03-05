import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/cards/service-card";
import { CostEstimator } from "@/components/interactive/cost-estimator";
import { ServicePackages } from "@/components/sections/service-packages";
import { Button } from "@/components/ui/button";
import { industrySolutions, services } from "@/lib/data";

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
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Technology, design, and business systems built to perform.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Every engagement is structured to deliver practical outcomes, measurable value, and systems your team can operate with confidence across
          mobile, desktop, and multi-device workflows.
        </p>
      </Section>

      <Section className="bg-white">
        <div className="mb-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">New: Design Fast Track</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm text-[#111111]">
              Need brand or design deliverables fast? Use our AI-assisted Graphic Design Order page to place your request without the usual back and
              forth.
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
      </Section>

      <Section className="bg-surface pt-0">
        <CostEstimator />
      </Section>

      <Section className="bg-white pt-0">
        <ServicePackages />
      </Section>

      <Section className="bg-white pt-0">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Industry Solutions</p>
        <h2 className="mt-3 text-2xl font-bold md:text-4xl">Built for sector-specific workflows.</h2>
        <div className="mt-6 space-y-3">
          {industrySolutions.map((industry, index) => (
            <details key={industry.industry} className="rounded-xl border bg-white p-5" open={index === 0}>
              <summary className="cursor-pointer text-lg font-semibold">{industry.industry}</summary>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {industry.solutions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
