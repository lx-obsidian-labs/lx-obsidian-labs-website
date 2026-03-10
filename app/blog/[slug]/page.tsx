import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { techBlogPosts } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return techBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = techBlogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Blog" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = techBlogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{post.topic}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">{post.title}</h1>
        <p className="mt-5 max-w-2xl text-muted">{post.excerpt}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">Updated {post.updatedAt} • {post.readTime}</p>
      </Section>

      <Section className="bg-surface pt-0">
        <article className="max-w-3xl rounded-xl border bg-white p-8 text-sm leading-7 text-[#111111] md:text-base">
          {post.content}
        </article>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/blog" className="inline-flex rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white">
            More Blog Articles
          </Link>
          <Link href="/creator" className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#be123c]">
            Open Creator
          </Link>
        </div>
      </Section>
    </>
  );
}
