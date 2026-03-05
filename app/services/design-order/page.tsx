import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { DesignOrderForm } from "@/components/forms/design-order-form";

export const metadata: Metadata = {
  title: "Graphic Design Order",
  description:
    "Place a graphic design order quickly with AI-assisted brief drafting and instant WhatsApp handoff.",
  alternates: { canonical: "/services/design-order" },
  openGraph: { images: [{ url: "/services/opengraph-image" }] },
  twitter: { images: ["/services/opengraph-image"] },
};

export default function DesignOrderPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Graphic Design Orders</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Order all graphic design work quickly with AI-assisted briefs.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Choose deliverables, describe your goals, let AI draft the brief, and submit directly for immediate WhatsApp follow-up.
        </p>
      </Section>

      <Section className="bg-white">
        <DesignOrderForm />
      </Section>
    </>
  );
}
