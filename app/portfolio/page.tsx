import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { PortfolioCard } from "@/components/cards/portfolio-card";
import { portfolioProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View selected software, design, and consultancy projects delivered by LX Obsidian Labs.",
  alternates: { canonical: "/portfolio" },
  openGraph: { images: [{ url: "/portfolio/opengraph-image" }] },
  twitter: { images: ["/portfolio/opengraph-image"] },
};

export default function PortfolioPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Portfolio</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">Selected work that turns strategy into execution.</h1>
        <p className="mt-5 max-w-2xl text-muted">
          Explore dynamic case studies with problem, solution, technology stack, and measurable outcomes.
        </p>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.map((project) => (
            <PortfolioCard key={project.title} {...project} />
          ))}
        </div>
      </Section>
    </>
  );
}
