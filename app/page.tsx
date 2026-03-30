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
import { Cpu, ArrowRight, Zap, CheckCircle, Users, Clock, Award } from "lucide-react";

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

const stats = [
  { icon: Users, value: "50+", label: "Clients Served" },
  { icon: Clock, value: "24hr", label: "Response Time" },
  { icon: Award, value: "5★", label: "Rating" },
];

const whyChooseUs = [
  { title: "Fast Delivery", description: "Projects delivered on time, every time." },
  { title: "Clear Pricing", description: "No hidden fees. What you see is what you pay." },
  { title: "Local Support", description: "Based in South Africa. We understand your market." },
  { title: " Ongoing Support", description: "We are here even after your project launches." },
];

export default function Home() {
  const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "7941464222";

  return (
    <>
      <StructuredData />
      <Hero />

      <Section className="bg-white py-0">
        <AdsenseUnit slot={homeAdSlot} className="min-h-[120px]" format="fluid" layoutKey="-fb+5w+4e-db+86" />
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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
            <Button asChild className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600">
              <Link href="/offers">View All Offers</Link>
            </Button>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-amber-300 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-amber-600">BIMAX Launch</p>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">80% OFF</span>
            </div>
            <p className="mt-3 text-xl font-bold">$2 Only</p>
            <p className="mt-1 text-sm text-muted">Beautiful YouTube Player for Windows</p>
            <Link href="/apps" className="mt-4 inline-block w-full rounded-lg bg-amber-500 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600">
              Get Deal Now
            </Link>
          </article>
          <article className="rounded-xl border border-amber-300 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-amber-600">Design Bundle</p>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">FREE</span>
            </div>
            <p className="mt-3 text-xl font-bold">Logo Consultation</p>
            <p className="mt-1 text-sm text-muted">R2,000 Value with any design project</p>
            <Link href="/services/design-order" className="mt-4 inline-block w-full rounded-lg bg-amber-500 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600">
              Claim Offer
            </Link>
          </article>
          <article className="rounded-xl border border-amber-300 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-amber-600">SEO Audit</p>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">FREE</span>
            </div>
            <p className="mt-3 text-xl font-bold">Worth R3,000</p>
            <p className="mt-1 text-sm text-muted">With every new web project</p>
            <Link href="/services/web-design" className="mt-4 inline-block w-full rounded-lg bg-amber-500 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600">
              Learn More
            </Link>
          </article>
        </div>
      </Section>

      <Section className="bg-white">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">What We Do</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/services">All Services</Link>
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

      <Section className="bg-zinc-50">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Reasons to Work With Us</h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="rounded-xl border bg-white p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-3 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Portfolio</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Our Recent Work</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/portfolio">View All</Link>
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

      <Section className="bg-emerald-900 py-16 text-white">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                <Cpu className="h-5 w-5" />
                Robotics Vision
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Building the Future of Robotics</h2>
              <p className="mt-4 text-emerald-200">
                Nathan Vilane&apos;s passion project. We&apos;re working toward applied robotics by 2028. 
                Support the research and development of cutting-edge robotics technology.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600">
                  <Link href="/robotics">
                    Support the Vision
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full border-emerald-400 text-emerald-100 hover:bg-emerald-800 sm:w-auto"
                >
                  <Link href="/robotics" className="inline-flex items-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-800/30 p-6">
              <p className="text-sm font-semibold text-emerald-300">Why Support?</p>
              <ul className="mt-4 space-y-3 text-sm text-emerald-100">
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

      <Section className="bg-white">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Directory</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">South African Businesses</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/directory">Browse Directory</Link>
            </Button>
          </div>
        </Reveal>
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <p className="text-lg font-semibold">Get Your Business Listed</p>
          <p className="mt-2 text-muted">Reach more customers with a directory listing from R200/month</p>
          <Link href="/contact" className="mt-4 inline-block rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-white">
            Add Your Business
          </Link>
        </div>
      </Section>

      <Section id="contact" className="bg-zinc-50">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Ready to Start?</h2>
            <p className="mt-3 text-muted">Tell us what you need. We will get back to you within 24 hours.</p>
          </div>
        </Reveal>
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
