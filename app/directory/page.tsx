import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MapPin, Star, Plus, ExternalLink, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Business Directory South Africa | LX Obsidian Labs",
  description: "Featured local businesses in South Africa. Get your business listed or upgrade to a featured listing.",
  keywords: ["business directory", "south africa", "local business", "featured listing"],
  alternates: { canonical: "/directory" },
};

const businesses = [
  {
    name: "TechFlow Solutions",
    category: "IT Services",
    description: "Enterprise IT support and network solutions in Johannesburg.",
    location: "Johannesburg, Gauteng",
    rating: 4.8,
    featured: true,
    website: "#",
  },
  {
    name: "Creative Spark Studios",
    category: "Graphic Design",
    description: "Brand identity and marketing design agency.",
    location: "Cape Town, Western Cape",
    rating: 4.9,
    featured: true,
    website: "#",
  },
  {
    name: "BuildRight Construction",
    category: "Construction",
    description: "Residential and commercial building contractors.",
    location: "Durban, KwaZulu-Natal",
    rating: 4.6,
    featured: false,
    website: "#",
  },
  {
    name: "GreenLeaf Landscaping",
    category: "Landscaping",
    description: "Professional garden design and maintenance services.",
    location: "Pretoria, Gauteng",
    rating: 4.7,
    featured: false,
    website: "#",
  },
  {
    name: "AutoCare Pro",
    category: "Auto Services",
    description: "Vehicle maintenance, repairs and detailing.",
    location: "Johannesburg, Gauteng",
    rating: 4.5,
    featured: false,
    website: "#",
  },
  {
    name: "FinanceFirst Consulting",
    category: "Financial Services",
    description: "Accounting, tax preparation and financial advisory.",
    location: "Cape Town, Western Cape",
    rating: 4.8,
    featured: true,
    website: "#",
  },
];

const pricing = [
  {
    name: "Basic Listing",
    price: "R200/month",
    features: [
      "Business name and description",
      "Category and location",
      "Contact information",
      "Basic listing in directory",
    ],
  },
  {
    name: "Featured Listing",
    price: "R500/month",
    features: [
      "Everything in Basic",
      "Featured badge",
      "Star rating display",
      "Website link",
      "Top of category placement",
    ],
    featured: true,
  },
  {
    name: "Premium Bundle",
    price: "R1,200/month",
    features: [
      "Everything in Featured",
      "Homepage spotlight",
      "Social media shoutout",
      "Priority support",
      "Custom banner",
    ],
  },
];

export default function DirectoryPage() {
  return (
    <>
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Directory</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">South African Business Directory</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Discover trusted local businesses. Get listed and reach more customers.
        </p>
      </Section>

      <Section className="bg-white pb-20 pt-0 lg:pb-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="grid w-full gap-2 sm:flex sm:w-auto">
            <select className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-auto">
              <option>All Categories</option>
              <option>IT Services</option>
              <option>Graphic Design</option>
              <option>Construction</option>
              <option>Financial Services</option>
            </select>
            <select className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-auto">
              <option>All Locations</option>
              <option>Gauteng</option>
              <option>Western Cape</option>
              <option>KwaZulu-Natal</option>
            </select>
          </div>
          <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Your Business
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz) => (
            <article key={biz.name} className="relative rounded-xl border bg-white p-5">
              {biz.featured && (
                <div className="absolute -top-2 -right-2 rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-black">
                  FEATURED
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">{biz.category}</p>
                  <h2 className="mt-1 text-lg font-bold">{biz.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{biz.rating}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{biz.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-zinc-400">
                <MapPin className="h-3 w-3" />
                {biz.location}
              </div>
              <a
                href={biz.website}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                Visit Website <ExternalLink className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Get Your Business Listed</h2>
          <p className="mt-3 text-muted">Reach more customers with a directory listing.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.featured ? "border-accent bg-white" : "border-zinc-200 bg-white"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                  POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold text-accent">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-6 block rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                  plan.featured
                    ? "bg-accent text-white"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Get Started
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white p-3 lg:hidden">
        <Link href="/contact" className="block rounded-md bg-accent px-4 py-3 text-center text-sm font-semibold text-white">
          List My Business From R200/month
        </Link>
      </div>
    </>
  );
}
