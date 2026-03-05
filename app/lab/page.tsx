import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { labProjects } from "@/lib/data";
import { LiveDemos } from "@/components/interactive/live-demos";

export const metadata: Metadata = {
  title: "Technology Lab",
  description:
    "Explore LX Obsidian Labs internal experiments, automation systems, AI tools, and software prototypes.",
  alternates: { canonical: "/lab" },
  openGraph: { images: [{ url: "/lab/opengraph-image" }] },
  twitter: { images: ["/lab/opengraph-image"] },
};

export default function LabPage() {
  return (
    <>
      <Section className="bg-[#09090b] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Technology Lab</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Where systems, automation, and AI experiments become production tools.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          The Lab highlights internal R&D and product ideas that shape how we build high-performance client systems.
        </p>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {labProjects.map((project) => (
            <article key={project.title} className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{project.type}</p>
              <h2 className="mt-2 text-2xl font-semibold">{project.title}</h2>
              <p className="mt-3 text-sm text-muted">{project.summary}</p>
              <p className="mt-4 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-[#111111]">Status: {project.status}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-surface pt-0">
        <LiveDemos />
      </Section>
    </>
  );
}
