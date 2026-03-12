import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about design orders, creator workflows, delivery, and support.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "What is the fastest way to work with LX Obsidian Labs?",
    a: "Use Design Fast Track at /services/design-order for the quickest ordering workflow.",
  },
  {
    q: "Can I generate outputs without signing in?",
    a: "Yes. Creator supports transient mode so you can generate outputs without immediate account setup.",
  },
  {
    q: "Do you offer managed delivery after Creator output generation?",
    a: "Yes. You can move from Creator into a managed brief via /contact for implementation support.",
  },
  {
    q: "How quickly do you respond to inquiries?",
    a: "Typical response is within 24 hours through WhatsApp or email channels.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Answers to common questions.</h1>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <details key={item.q} className="rounded-xl border bg-white p-5" open={index === 0}>
              <summary className="cursor-pointer text-base font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
