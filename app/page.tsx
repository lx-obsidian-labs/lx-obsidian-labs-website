import Link from "next/link";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/cards/service-card";
import { PortfolioCard } from "@/components/cards/portfolio-card";
import { services, portfolioProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StructuredData } from "@/components/structured-data";
import { AdsenseUnit } from "@/components/ads/adsense-unit";
import { Cpu, ArrowRight, Zap } from "lucide-react";

const ContactForm = dynamic(
  () => import("@/components/forms/contact-form").then((mod) => mod.ContactForm),
);

export const metadata: Metadata = {
  title: "BIMAX Audio Player $2 | Software Development & Design Services | LX Obsidian Labs",
  description:
    "Download BIMAX Audio Player for $2 - Beautiful YouTube Music Player for Windows. Also: professional software development, graphic design, and business consultancy in South Africa.",
  keywords: ["BIMAX audio player", "youtube music player", "software development south africa", "web design", "graphic design"],
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/opengraph-image" }],
  },
};

export default function Home() {
  const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "7941464222";

  return (
    <>
      <StructuredData />
      <Hero />

      <Section className="bg-white py-0">
        <AdsenseUnit slot={homeAdSlot} className="min-h-[120px]" format="fluid" layoutKey="-fb+5w+4e-db+86" />
      </Section>

      <Section className="bg-amber-50">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                <Zap className="h-4 w-4" />
                Limited Time
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Flash Deals & Offers</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/offers">View All Offers</Link>
            </Button>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-amber-300 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-amber-600">BIMAX Launch</p>
            <p className="mt-1 font-bold">80% OFF - $2</p>
            <p className="mt-1 text-sm text-muted">Beautiful YouTube Player</p>
            <Link href="/apps" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
              Get Deal →
            </Link>
          </article>
          <article className="rounded-xl border border-amber-300 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-amber-600">Design Bundle</p>
            <p className="mt-1 font-bold">Free Logo Consultation</p>
            <p className="mt-1 text-sm text-muted">R2,000 Value</p>
            <Link href="/services/design-order" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
              Claim Offer →
            </Link>
          </article>
          <article className="rounded-xl border border-amber-300 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-amber-600">SEO Audit</p>
            <p className="mt-1 font-bold">FREE with Web Project</p>
            <p className="mt-1 text-sm text-muted">R3,000 Value</p>
            <Link href="/services/web-design" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
              Learn More →
            </Link>
          </article>
        </div>
      </Section>

      <Section className="bg-white">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">What we do.</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Portfolio</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Recent work.</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/portfolio">See All</Link>
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.slice(0, 3).map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <PortfolioCard {...project} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-[#051327] py-16 text-white">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                <Cpu className="h-5 w-5" />
                Robotics Vision
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Building the Future of Robotics</h2>
              <p className="mt-4 text-zinc-300">
                Nathan Vilane&apos;s passion project. We&apos;re working toward applied robotics by 2028. 
                Support the research and development of cutting-edge robotics technology.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/robotics">
                    Support the Vision
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full border-zinc-200 text-zinc-100 hover:bg-zinc-100 hover:text-[#111111] sm:w-auto"
                >
                  <Link href="/robotics" className="inline-flex items-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-[#0a1d33] p-6">
              <p className="text-sm font-semibold text-emerald-300">Why Support?</p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  Fund hardware and sensors for prototype development
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  Support OpenCV testing and computer vision research
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  Help bring autonomous robotics to real-world applications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  Every donation accelerates our timeline
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section id="contact" className="bg-white">
        <Reveal>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Ready to start?</h2>
            <p className="mt-3 text-muted">Tell us what you need. We will get back to you within 24 hours.</p>
          </div>
        </Reveal>
        <ContactForm />
      </Section>
    </>
  );
}
