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
import { SystemsDashboardPreview } from "@/components/interactive/systems-dashboard-preview";
import { stackBadges, testimonials } from "@/content/site";
import { CustomerNeeds } from "@/components/sections/customer-needs";
import { StructuredData } from "@/components/structured-data";
import { FitChecker } from "@/components/interactive/fit-checker";
import { RoleBasedCtas } from "@/components/sections/role-based-ctas";

const ContactForm = dynamic(
  () => import("@/components/forms/contact-form").then((mod) => mod.ContactForm),
);

export const metadata: Metadata = {
  title: "Home",
  description:
    "LX Obsidian Labs delivers software development, graphic design, and business consultancy for modern businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />

      <Section id="services-preview" className="bg-white">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Build with the right systems from day one.</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/services">View All</Link>
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

      <Section id="portfolio-preview" className="bg-surface">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Portfolio</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Recent projects across software, design, and strategy.</h2>
            </div>
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/portfolio">See Portfolio</Link>
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

      <Section className="bg-white pt-0">
        <Reveal>
          <SystemsDashboardPreview />
        </Reveal>
      </Section>

      <Section className="bg-surface pt-0">
        <Reveal>
          <CustomerNeeds />
        </Reveal>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal>
          <FitChecker />
        </Reveal>
      </Section>

      <Section className="bg-surface pt-0">
        <Reveal>
          <RoleBasedCtas />
        </Reveal>
      </Section>

      <Section id="about-preview" className="bg-white">
        <Reveal>
          <div className="grid gap-10 rounded-2xl border bg-white p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why LX Obsidian Labs</p>
              <h2 className="mt-3 text-3xl font-bold">We combine engineering precision with design and business strategy.</h2>
            </div>
            <div className="space-y-4 text-sm text-muted">
              <p>
                Our multidisciplinary model helps businesses avoid disconnected execution. Strategy, identity, and systems are aligned from the
                beginning.
              </p>
              <p>
                The result is faster delivery, lower complexity, and technology foundations built for sustainable growth.
              </p>
              <p>
                Our strategy also includes a measured transition into applied robotics by 2028 as resources, partnerships, and R&D capacity mature.
              </p>
              <Button asChild variant="secondary">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-[#111111] py-20 text-white">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Call To Action</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Ready to build your next digital system?</h2>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full border-zinc-200 text-zinc-100 hover:bg-zinc-100 hover:text-[#111111] sm:w-auto"
              >
                <Link href="/lab">Explore The Lab</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Trusted Outcomes</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">What clients say about our systems approach.</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={index * 0.08}>
              <article className="rounded-xl border bg-white p-6">
                <p className="text-sm text-muted">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-[#111111]">{testimonial.author}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface pt-0">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Technology Stack</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stackBadges.map((badge) => (
              <span key={badge} className="rounded-full border bg-surface px-3 py-1 text-xs font-semibold text-[#111111]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" className="bg-white">
        <Reveal>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tell us what you need, and we will map the best path forward.</h2>
          </div>
        </Reveal>
        <ContactForm />
      </Section>
    </>
  );
}
