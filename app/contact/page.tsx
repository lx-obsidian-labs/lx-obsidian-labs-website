import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/layout/section";
import { DeliverySla } from "@/components/sections/delivery-sla";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LX Obsidian Labs to discuss software development, design, or business systems projects.",
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
      </Section>

      <Section className="bg-white">
        <ContactForm />
      </Section>

      <Section className="bg-white pt-0">
        <DeliverySla />
      </Section>
    </>
  );
}
