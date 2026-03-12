import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

export function Hero() {
  return (
    <Section className="bg-[#09090b] py-20 md:py-28">
      <div className="max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">LX Obsidian Labs</p>
        <h1 className="text-balance text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Order high-conversion designs fast, then scale with systems.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-zinc-300 md:text-lg">
          The primary route is Design Fast Track. Place your order in minutes, then expand into software and automation when needed.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-300">
          <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">Prompt-to-build Creator workflows</span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">Design fast-track orders</span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">Versioned project workspaces</span>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/services/design-order">Order Designs</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full border-zinc-200 text-zinc-200 hover:bg-zinc-200 hover:text-[#111111] sm:w-auto"
          >
            <Link href="/creator" className="inline-flex items-center gap-2">
              Try Obsidian Creator <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
