import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { AdsenseUnit } from "@/components/ads/adsense-unit";
import { newsUpdates } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description: "Latest platform updates, releases, and company news from LX Obsidian Labs.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const newsAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_NEWS;

  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Newsroom</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Platform releases and company updates.</h1>
        <p className="mt-5 max-w-2xl text-muted">Track what is shipping, what changed, and what is coming next.</p>
      </Section>

      <Section className="bg-surface pt-0">
        <AdsenseUnit slot={newsAdSlot} className="mb-6 min-h-[110px]" format="horizontal" />
        <div className="space-y-4">
          {newsUpdates.map((item) => (
            <article key={item.slug} className="rounded-xl border bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{item.category}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-muted">{item.updatedAt}</p>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-[#111111] hover:text-accent" href={`/news/${item.slug}`}>
                Read Update
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
