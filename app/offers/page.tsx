import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Clock, Tag, Zap, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Limited Offers & Flash Sales | LX Obsidian Labs",
  description: "Limited time offers, flash sales, and special deals on BIMAX apps and design services. Grab these deals before they expire!",
  keywords: ["flash sale", "limited offer", "discount", "special deal", "BIMAX discount"],
  alternates: { canonical: "/offers" },
};

const offers = [
  {
    id: "bimax-launch",
    title: "BIMAX Launch Special",
    description: "Get BIMAX Audio Player at launch price - lowest it will ever be!",
    originalPrice: "$9.99",
    currentPrice: "$2.00",
    savings: "80% OFF",
    endsAt: "2026-04-30",
    features: [
      "Full access to BIMAX Audio Player",
      "All future updates included",
      "Priority support",
    ],
    cta: "Get Deal",
    href: "/apps",
    featured: true,
  },
  {
    id: "design-bundle",
    title: "Design Services Bundle",
    description: "Book any design project and get a free logo redesign consultation.",
    originalPrice: "R5,000",
    currentPrice: "Included",
    savings: "R2,000 VALUE",
    endsAt: "2026-04-15",
    features: [
      "Free logo consultation (R2,000 value)",
      "Priority timeline",
      "3 rounds of revisions",
    ],
    cta: "Claim Offer",
    href: "/services/design-order",
    featured: true,
  },
  {
    id: "seo-package",
    title: "Free SEO Audit",
    description: "Get a free website SEO audit with every new web project.",
    originalPrice: "R3,000",
    currentPrice: "FREE",
    savings: "R3,000 VALUE",
    endsAt: "2026-04-30",
    features: [
      "Technical SEO analysis",
      "Keyword recommendations",
      "Competitor insights",
    ],
    cta: "Learn More",
    href: "/services/web-design",
    featured: false,
  },
];

export default function OffersPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Limited Time</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Flash Sales & Special Offers</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Grab these deals before they expire. Prices go up when offers end.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-amber-400">
          <Zap className="h-5 w-5" />
          <span>Offers update regularly - check back often!</span>
        </div>
        <Link href="/apps" className="mt-5 inline-flex rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black sm:hidden">
          Get BIMAX Deal
        </Link>
      </Section>

      <Section className="bg-white pb-20 pt-0 lg:pb-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                offer.featured ? "border-amber-400 bg-amber-50/50" : "border-zinc-200 bg-white"
              }`}
            >
              {offer.featured && (
                <div className="absolute -top-3 left-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                  FEATURED
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>Ends {offer.endsAt}</span>
              </div>

              <h2 className="mt-3 text-xl font-bold">{offer.title}</h2>
              <p className="mt-2 text-sm text-muted">{offer.description}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-accent">{offer.currentPrice}</span>
                <span className="text-sm text-zinc-400 line-through">{offer.originalPrice}</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                <Tag className="h-3 w-3" />
                {offer.savings}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={offer.href}
                className="mt-auto inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 mt-6 text-sm font-semibold text-white"
              >
                {offer.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-dashed border-amber-300 bg-amber-50/30 p-6 text-center">
          <p className="text-lg font-semibold">Want to be notified of new offers?</p>
          <p className="mt-2 text-sm text-muted">Subscribe to our newsletter for exclusive deals.</p>
          <Link href="/contact" className="mt-4 inline-block rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-white">
            Contact Us
          </Link>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-200 bg-amber-50 p-3 lg:hidden">
        <Link href="/apps" className="block rounded-md bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-black">
          Claim BIMAX Launch Offer - $2
        </Link>
      </div>
    </>
  );
}
