import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Graphic Design Services South Africa | Logo, Brand Identity & Marketing Design",
  description: "Professional graphic design services in South Africa. Logo design, brand identity, marketing materials, UI design. Fast turnaround, affordable pricing.",
  keywords: ["graphic design south africa", "logo design", "brand identity", "marketing design", "ui design", "graphic designer", "corporate branding"],
  alternates: { canonical: "/services/graphic-design" },
};

export default function GraphicDesignPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Graphic Design</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Professional Graphic Design Services in South Africa</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Logo design, brand identity, and marketing materials that make your business stand out.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/services/design-order">Order Designs</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Logo & Brand Identity</h3>
            <p className="mt-2 text-muted">Memorable logos and complete brand identity systems.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Marketing Materials</h3>
            <p className="mt-2 text-muted">Brochures, flyers, social media templates, and more.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">UI Design</h3>
            <p className="mt-2 text-muted">Clean, user-friendly interface designs for web and mobile.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold">Need designs fast?</p>
          <Button asChild className="mt-4">
            <Link href="/services/design-order">Start Design Order</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
