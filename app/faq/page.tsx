import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Answers to common questions about our services, pricing, timelines, and how to work with LX Obsidian Labs in South Africa.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ - LX Obsidian Labs",
    description: "Frequently asked questions about software development, graphic design, and business consultancy services.",
  },
};

const faqs = [
  {
    q: "What services does LX Obsidian Labs offer?",
    a: "We offer software development (web applications, CMS systems, automation, custom dashboards, API integrations), graphic design (brand identity, marketing collateral, UI design, pitch decks, social media assets), and business consultancy (digital transformation, workflow optimization, technology strategy, systems audits, growth roadmapping).",
  },
  {
    q: "How much does a website cost?",
    a: "Website projects start from R60,000 for MVPs and internal tools. Larger systems with integrations start from R150,000. Design-only projects (logo, brand identity) start from R25,000. We provide detailed quotes after understanding your requirements.",
  },
  {
    q: "How long does a project take?",
    a: "Timelines vary by scope: design projects take 2-4 weeks, software MVPs take 4-8 weeks, and complex systems with integrations take 8-14 weeks. We provide clear timelines during our discovery phase.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes, we offer managed delivery and ongoing support packages. Contact us to discuss your maintenance and support needs.",
  },
  {
    q: "Can you help with AI automation?",
    a: "Yes, we build AI-powered workflows, automation systems, and custom AI assistants for business operations. Our Creator platform also offers prompt-to-build workflows.",
  },
  {
    q: "Where are you located?",
    a: "We are based in South Africa and serve clients remotely across the country and internationally.",
  },
  {
    q: "What is the fastest way to get started?",
    a: "Use our Design Fast Track at /services/design-order for the quickest ordering workflow. Alternatively, contact us via WhatsApp for immediate assistance.",
  },
  {
    q: "Can I try your tools before committing?",
    a: "Yes. Our Creator platform at /creator allows you to generate websites and documents. You can also try transient mode without signing up.",
  },
  {
    q: "How quickly do you respond to inquiries?",
    a: "Typical response is within 24 hours through WhatsApp or email. We prioritize urgent project inquiries.",
  },
  {
    q: "Do you offer refunds?",
    a: "Our refund policy varies by project stage. For design projects, we offer revisions before final delivery. For software, we follow industry-standard acceptance criteria.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-5 max-w-2xl text-muted">
          Everything you need to know about working with us.
        </p>
      </Section>

      <Section className="bg-surface pt-0 pb-20">
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <details key={item.q} className="rounded-xl border bg-white p-5" open={index === 0}>
              <summary className="cursor-pointer text-base font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-amber-200/50 bg-amber-50/30 p-6">
          <p className="text-lg font-semibold">Still have questions?</p>
          <p className="mt-2 text-sm text-muted">
            Contact us on WhatsApp or email for specific inquiries.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://wa.me/27762982399" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
              WhatsApp
            </a>
            <a href="mailto:vilanenathan@gmail.com" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold">
              Email Us
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
