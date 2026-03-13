import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { AdsenseUnit } from "@/components/ads/adsense-unit";
import { techBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Technology Blog",
  description: "Technology articles from LX Obsidian Labs on AI engineering, product design, and quality systems.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const blogAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG;

  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Technology Blog</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Practical thinking on AI systems, product design, and execution.</h1>
        <p className="mt-5 max-w-2xl text-muted">Technical insights focused on building useful, high-quality digital systems.</p>
      </Section>

      <Section className="bg-surface pt-0">
        <AdsenseUnit slot={blogAdSlot} className="mb-6 min-h-[110px]" format="horizontal" />
        <div className="grid gap-6 md:grid-cols-3">
          {techBlogPosts.map((post) => (
            <article key={post.slug} className="rounded-xl border bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{post.topic} • {post.readTime}</p>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted">Updated {post.updatedAt}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-[#111111] hover:text-accent" href={`/blog/${post.slug}`}>
                Read Article
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
