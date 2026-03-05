import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { insights } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Read technology and systems insights from LX Obsidian Labs on AI, automation, and business infrastructure.",
  alternates: { canonical: "/insights" },
  openGraph: { images: [{ url: "/insights/opengraph-image" }] },
  twitter: { images: ["/insights/opengraph-image"] },
};

export default function InsightsPage() {
  const insightSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LX Obsidian Labs Insights",
    itemListElement: insights.map((post, index) => ({
      "@type": "Article",
      position: index + 1,
      headline: post.title,
      description: post.excerpt,
      dateModified: post.updatedAt,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(insightSchema) }} />
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Knowledge</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Insights from a systems-first technology lab.</h1>
        <p className="mt-5 max-w-2xl text-muted">Short reads on digital execution, AI strategy, and operational automation.</p>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((post) => (
            <article key={post.slug} className="rounded-xl border bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Insight</p>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-[#111111] hover:text-accent" href={`/insights/${post.slug}`}>
                Read Insight
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
