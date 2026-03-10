import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { newsUpdates } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return newsUpdates.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = newsUpdates.find((entry) => entry.slug === slug);

  if (!item) {
    return { title: "News" };
  }

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/news/${item.slug}` },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = newsUpdates.find((entry) => entry.slug === slug);

  if (!item) notFound();

  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{item.category}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">{item.title}</h1>
        <p className="mt-5 max-w-2xl text-muted">{item.excerpt}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">Updated {item.updatedAt}</p>
      </Section>

      <Section className="bg-surface pt-0">
        <article className="max-w-3xl rounded-xl border bg-white p-8 text-sm leading-7 text-[#111111] md:text-base">
          {item.content}
        </article>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/news" className="inline-flex rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white">
            Back to News
          </Link>
          <Link href="/blog" className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#be123c]">
            Explore Blog
          </Link>
        </div>
      </Section>
    </>
  );
}
