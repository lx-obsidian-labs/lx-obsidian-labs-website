import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { caseStudies } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) {
    return { title: "Case Study" };
  }

  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: `/portfolio/${study.slug}` },
    openGraph: { images: [{ url: `/portfolio/${study.slug}/opengraph-image` }] },
    twitter: { images: [`/portfolio/${study.slug}/opengraph-image`] },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) notFound();
  const relatedStudies = caseStudies.filter((item) => study.related.includes(item.slug));

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    dateModified: study.updatedAt,
    author: {
      "@type": "Organization",
      name: "LX Obsidian Labs",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }} />
      <Section className="bg-[#111111] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Dynamic Case Study</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">{study.title}</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">{study.description}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {study.metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-accent">{metric.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Problem</h2>
            <p className="mt-3 text-sm text-muted">{study.problem}</p>
          </article>
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Solution</h2>
            <p className="mt-3 text-sm text-muted">{study.solution}</p>
          </article>
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Technology Used</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {study.technology.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Results</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {study.results.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <Link href="/contact" className="mt-8 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-[#be123c]">
          Start Your Project
        </Link>

        {relatedStudies.length ? (
          <div className="mt-10 border-t pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Related Case Studies</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedStudies.map((related) => (
                <Link
                  key={related.slug}
                  href={`/portfolio/${related.slug}`}
                  className="inline-flex rounded-md border px-4 py-2 text-sm font-semibold hover:bg-surface"
                >
                  {related.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}
