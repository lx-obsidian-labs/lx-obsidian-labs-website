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
          Software, Design &amp; Systems for Modern Businesses
        </h1>
        <p className="mt-6 max-w-2xl text-base text-zinc-300 md:text-lg">
          We build scalable technology, strong brand identity, and efficient business systems, while strategically advancing toward applied robotics by 2028.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/contact">Start Your Project</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full border-zinc-200 text-zinc-200 hover:bg-zinc-200 hover:text-[#111111] sm:w-auto"
          >
            <Link href="/services" className="inline-flex items-center gap-2">
              View Services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
