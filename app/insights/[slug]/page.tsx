import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { insights } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Insight" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: { images: [{ url: `/insights/${post.slug}/opengraph-image` }] },
    twitter: { images: [`/insights/${post.slug}/opengraph-image`] },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = insights.find((item) => item.slug === slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "LX Obsidian Labs",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Insight</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">{post.title}</h1>
        <p className="mt-5 max-w-2xl text-muted">{post.excerpt}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">Updated {post.updatedAt}</p>
      </Section>

      <Section className="bg-surface pt-0">
        <article className="max-w-3xl rounded-xl border bg-white p-8 text-sm leading-7 text-[#111111] md:text-base">
          {post.content}
        </article>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/services" className="inline-flex rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white">
            Explore Services
          </Link>
          <Link href="/contact" className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#be123c]">
            Start Your Project
          </Link>
        </div>
      </Section>
    </>
  );
}
