import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/layout/section";
import { DeliverySla } from "@/components/sections/delivery-sla";

export const metadata: Metadata = {
  title: "Contact LX Obsidian Labs | Get a Free Quote Today",
  description: "Contact LX Obsidian Labs for software development, web design, graphic design, and business consultancy in South Africa. Get a free quote within 24 hours.",
  keywords: ["contact", "get quote", "free quote", "software development", "web design", "south africa"],
  alternates: { canonical: "/contact" },
  openGraph: { images: [{ url: "/contact/opengraph-image" }] },
  twitter: { images: ["/contact/opengraph-image"] },
};

export default function ContactPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Let us architect your next phase of growth.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Use our smart lead capture flow to share goals, budget, and timeline. We will follow up with a practical execution plan.
        </p>
        <div className="mt-7 grid gap-3 md:max-w-4xl md:grid-cols-4">
          <Link href="#start-form" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Start Project Brief
          </Link>
          <Link href="/services/design-order" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Design Fast Track
          </Link>
          <Link href="/creator" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Use AI Creator
          </Link>
          <a href="https://wa.me/27762982399" target="_blank" rel="noreferrer" className="rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">
            Urgent WhatsApp
          </a>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mb-8 rounded-xl border bg-surface p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Where To Start</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-md border bg-white p-4">
              <h2 className="text-base font-semibold">Need custom software</h2>
              <p className="mt-1 text-sm text-muted">Start the project brief form and select Web Application or CMS System.</p>
            </article>
            <article className="rounded-md border bg-white p-4">
              <h2 className="text-base font-semibold">Need branding or assets</h2>
              <p className="mt-1 text-sm text-muted">Use Design Fast Track for quick turnaround creative requests.</p>
            </article>
            <article className="rounded-md border bg-white p-4">
              <h2 className="text-base font-semibold">Need strategy support</h2>
              <p className="mt-1 text-sm text-muted">Use this form and include your goals, constraints, and timeline.</p>
            </article>
          </div>
        </div>

        <div id="start-form">
        <ContactForm />
        </div>
      </Section>

      <Section className="bg-white pt-0">
        <DeliverySla />
      </Section>
    </>
  );
}
