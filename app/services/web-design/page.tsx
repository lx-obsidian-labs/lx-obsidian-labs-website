import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Web Design & Development Company South Africa | LX Obsidian Labs",
  description: "Professional web design and development services in South Africa. Custom websites, web applications, CMS systems. Fast delivery, clear pricing. Get a free quote today.",
  keywords: ["web design company south africa", "web development south africa", "custom website", "wordpress development", "next.js development", "web application development", "website developer"],
  alternates: { canonical: "/services/web-design" },
};

export default function WebDesignPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Web Design & Development</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Professional Web Design & Development in South Africa</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Custom websites and web applications built with modern technologies. From simple landing pages to complex business systems.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/contact">Get Free Quote</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Custom Websites</h3>
            <p className="mt-2 text-muted">Tailored to your brand and business goals. Modern, responsive, SEO-optimized.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Web Applications</h3>
            <p className="mt-2 text-muted">Dashboards, portals, CRM systems, and custom business tools.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">CMS & E-commerce</h3>
            <p className="mt-2 text-muted">Content management systems and online stores easy to manage.</p>
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-surface p-6">
          <h2 className="text-2xl font-bold">Why Choose Us?</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>✓ Fast delivery timelines</li>
            <li>✓ Clear, upfront pricing</li>
            <li>✓ South African-based team</li>
            <li>✓ Ongoing support available</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg font-semibold">Ready to start your project?</p>
          <Button asChild className="mt-4">
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
