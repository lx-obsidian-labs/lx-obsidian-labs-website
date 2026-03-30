import Link from "next/link";
import { ArrowRight, Cpu, Download, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

export function Hero() {
  return (
    <Section className="bg-[#09090b] py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Nathan Vilane | LX Obsidian Labs</p>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-400">
            <Cpu className="h-4 w-4" />
            Passion: Building the Future of Robotics
          </p>
          <h1 className="text-balance text-4xl font-extrabold leading-tight text-white md:text-5xl">
            BIMAX Audio Player
          </h1>
          <p className="mt-3 max-w-xl text-lg text-zinc-300">
            Beautiful YouTube Music Player for Windows. Stream millions of songs with a stunning dark neon interface.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              <DollarSign className="h-3 w-3" /> $2 One-time
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">Offline Mode</span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">No Ads</span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1">Dark Neon UI</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/apps">
                <Download className="mr-2 h-5 w-5" />
                Get BIMAX - $2
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full border-zinc-200 text-zinc-200 hover:bg-zinc-200 hover:text-[#111111] sm:w-auto"
            >
              <Link href="/services" className="inline-flex items-center gap-2">
                Order Design Services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 sm:w-auto"
            >
              <Link href="/robotics" className="inline-flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Support Robotics
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 lg:block">
          <div className="aspect-video rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="mx-auto h-16 w-16 text-accent" />
              <p className="mt-4 text-lg font-semibold text-white">BIMAX Audio Player</p>
              <p className="text-sm text-zinc-400">Windows 10/11</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-3">
              <p className="font-semibold text-white">Stream YouTube</p>
              <p className="text-zinc-400">Millions of songs</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-3">
              <p className="font-semibold text-white">Offline Mode</p>
              <p className="text-zinc-400">Listen anywhere</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-3">
              <p className="font-semibold text-white">No Ads</p>
              <p className="text-zinc-400">Pure listening</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-3">
              <p className="font-semibold text-white">$2 Once</p>
              <p className="text-zinc-400">No subscription</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
