import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms that govern access and use of LX Obsidian Labs website and creator tools.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Terms of Use</h1>
      </Section>

      <Section className="bg-surface pt-0">
        <article className="max-w-3xl rounded-xl border bg-white p-6 text-sm leading-7 text-muted">
          <p>By using this site and related creator tools, you agree to use them for lawful and professional purposes.</p>
          <p className="mt-3">Generated outputs are provided as working drafts and should be reviewed before production use.</p>
          <p className="mt-3">Project timelines, pricing, and delivery terms are confirmed through written project agreements.</p>
          <p className="mt-3">For support or clarification on terms, contact us via the Contact page.</p>
        </article>
      </Section>
    </>
  );
}
