import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Creator Billing",
  description: "Plans and usage for Obsidian Creator.",
  alternates: { canonical: "/creator/billing" },
};

const plans = [
  { name: "Starter", price: "R0", detail: "Basic planning and draft outputs." },
  { name: "Pro", price: "R499/mo", detail: "Higher usage, premium templates, priority generation." },
  { name: "Studio", price: "Custom", detail: "Team workflows, custom brand kits, enterprise support." },
];

export default function CreatorBillingPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Billing</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Plans and Usage</h1>
      </Section>
      <Section className="bg-surface pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-xl border bg-white p-6">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-2xl font-bold text-accent">{plan.price}</p>
              <p className="mt-2 text-sm text-muted">{plan.detail}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
