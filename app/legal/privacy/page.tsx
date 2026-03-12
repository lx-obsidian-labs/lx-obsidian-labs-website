import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for LX Obsidian Labs website, forms, and creator interactions.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
      </Section>

      <Section className="bg-surface pt-0">
        <article className="max-w-3xl rounded-xl border bg-white p-6 text-sm leading-7 text-muted">
          <p>We collect only the information needed to process inquiries, design orders, and creator interactions.</p>
          <p className="mt-3">Data submitted through forms may be routed through configured notification channels for response handling.</p>
          <p className="mt-3">We do not sell personal data. Access is limited to operational and support purposes.</p>
          <p className="mt-3">For data requests, contact us directly via the Contact page.</p>
        </article>
      </Section>
    </>
  );
}
