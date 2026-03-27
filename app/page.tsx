import Link from "next/link";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/cards/service-card";
import { PortfolioCard } from "@/components/cards/portfolio-card";
import { services, portfolioProjects, newsUpdates, techBlogPosts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { testimonials } from "@/content/site";
import { StructuredData } from "@/components/structured-data";
import { HomeValueStrip } from "@/components/home/home-value-strip";
import { AdsenseUnit } from "@/components/ads/adsense-unit";

const ContactForm = dynamic(
  () => import("@/components/forms/contact-form").then((mod) => mod.ContactForm),
);

export const metadata: Metadata = {
  title: "Home",
  description:
    "LX Obsidian Labs - Nathan's software, design, and robotics company. Order designs fast, build systems, and explore our robotics vision.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "7941464222";

  return (
    <>
      <StructuredData />
      <Hero />

      <Section className="bg-surface pt-0">
        <Reveal>
          <HomeValueStrip />
        </Reveal>
      </Section>

      <Section className="bg-white py-0">
        <AdsenseUnit slot={homeAdSlot} className="min-h-[120px]" format="fluid" layoutKey="-fb+5w+4e-db+86" />
      </Section>

      <Section id="services-preview" className="bg-white">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">What we build.</h2>
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

      <Section className="bg-white pt-0">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Blog & News</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Latest updates.</h2>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/blog">Blog</Link>
              </Button>
              <Button asChild>
                <Link href="/news">News</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="rounded-xl border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Featured Blog</p>
              <h3 className="mt-2 text-xl font-semibold">{techBlogPosts[0].title}</h3>
              <p className="mt-3 text-sm text-muted">{techBlogPosts[0].excerpt}</p>
              <Link href={`/blog/${techBlogPosts[0].slug}`} className="mt-4 inline-block text-sm font-semibold text-[#111111] hover:text-accent">
                Read Article
              </Link>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="rounded-xl border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Latest News</p>
              <h3 className="mt-2 text-xl font-semibold">{newsUpdates[0].title}</h3>
              <p className="mt-3 text-sm text-muted">{newsUpdates[0].excerpt}</p>
              <Link href={`/news/${newsUpdates[0].slug}`} className="mt-4 inline-block text-sm font-semibold text-[#111111] hover:text-accent">
                Read Update
              </Link>
            </article>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white">
        <Reveal>
          <div className="grid gap-10 rounded-2xl border bg-white p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">About</p>
              <h2 className="mt-3 text-3xl font-bold">Engineering + Design + Robotics</h2>
            </div>
            <div className="space-y-4 text-sm text-muted">
              <p>
                Nathan Vilane founded LX Obsidian Labs to build practical software, design systems, and operational tools for businesses.
              </p>
              <p>
                Our focus: fast delivery, clear outcomes, and technology that scales with your business.
              </p>
              <p>
                <strong>Coming 2028:</strong> Applied robotics research and development as resources expand.
              </p>
              <Button asChild variant="secondary">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-white">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">What clients say.</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={index * 0.08}>
              <article className="rounded-xl border bg-white p-6">
                <p className="text-sm text-muted">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-[#111111]">{testimonial.author}</p>
              </article>
            </Reveal>
          ))}
        </div>
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
