import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Automation & AI Solutions South Africa | LX Obsidian Labs",
  description: "Business automation and AI solutions in South Africa. Workflow automation, AI chatbots, process optimization. Save time and reduce costs with intelligent automation.",
  keywords: ["business automation south africa", "AI solutions", "workflow automation", "process optimization", "AI chatbot", "business efficiency"],
  alternates: { canonical: "/services/automation" },
};

export default function AutomationPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Automation & AI</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Business Automation & AI Solutions in South Africa</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Streamline your business with intelligent automation. Reduce manual work, save time, and improve efficiency.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/contact">Discuss Your Needs</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/creator">Try AI Creator</Link>
          </Button>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Workflow Automation</h3>
            <p className="mt-2 text-muted">Automate repetitive tasks and streamline business processes.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">AI Assistants</h3>
            <p className="mt-2 text-muted">Custom AI chatbots and assistants for customer service and internal operations.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">Integration</h3>
            <p className="mt-2 text-muted">Connect your tools and systems for seamless data flow.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold">Ready to automate?</p>
          <Button asChild className="mt-4">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
