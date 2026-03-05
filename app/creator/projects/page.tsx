import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { CreatorProjectsList } from "@/components/creator/projects-list";

export const metadata: Metadata = {
  title: "Creator Projects",
  description: "View saved Obsidian Creator projects and outputs.",
  alternates: { canonical: "/creator/projects" },
};

export default function CreatorProjectsPage() {
  return (
    <>
      <Section className="bg-white py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Projects</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Saved Projects</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">Start a new project in one click or continue any existing workspace below.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/creator/web?prompt=Build%20a%20high-conversion%20website%20for%20my%20business"
            className="rounded-md border bg-surface px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            Start Website Project
          </Link>
          <Link
            href="/creator/docs?documentType=proposal&companyName=My%20Company"
            className="rounded-md border bg-surface px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            Start Document Project
          </Link>
          <Link
            href="/creator/images"
            className="rounded-md border bg-surface px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            Start Image Project
          </Link>
          <Link
            href="/creator/consult"
            className="rounded-md border bg-surface px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            Start Consulting Project
          </Link>
        </div>
      </Section>
      <Section className="bg-surface pt-0">
        <CreatorProjectsList />
      </Section>
    </>
  );
}
