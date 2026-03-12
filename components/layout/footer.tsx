import Link from "next/link";
import { Container } from "@/components/layout/container";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t bg-[#0a0a0a] py-12 text-white">
      <Container className="grid gap-8 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">LX Obsidian Labs</p>
          <p className="mt-3 max-w-sm text-sm text-zinc-300">
            We build software, branding, and operational systems that help modern businesses scale with confidence.
          </p>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Strategic roadmap: transition toward applied robotics by 2028 as resources and research capacity expand.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/services/design-order" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-accent hover:text-accent">
              Order Designs
            </Link>
            <Link href="/creator" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-accent hover:text-accent">
              Open Creator
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>
              <Link className="hover:text-accent" href="/start">
                Start
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/creator">
                Creator
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/portfolio">
                Portfolio
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/news">
                News
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/faq">
                FAQ
              </Link>
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-400">
            Explore: <Link className="hover:text-accent" href="/lab">Lab</Link> • <Link className="hover:text-accent" href="/robotics">Robotics</Link> • <Link className="hover:text-accent" href="/resources">Resources</Link> • <Link className="hover:text-accent" href="/insights">Insights</Link>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Start Here</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>
              <Link className="hover:text-accent" href="/contact#start-form">
                New client project
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/services/design-order">
                Design fast track
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/creator/web">
                Build a website
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/creator/docs">
                Generate a document
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/creator/projects">
                Continue projects
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>
              <a className="hover:text-accent" href="tel:+27762982399">
                +27 76 298 2399
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href="mailto:vilanenathan@gmail.com">
                vilanenathan@gmail.com
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href="https://wa.me/27762982399" target="_blank" rel="noreferrer">
                WhatsApp support
              </a>
            </li>
            <li className="pt-2 text-xs text-zinc-400">Typical response: within 24 hours</li>
          </ul>
        </div>
      </Container>

      <Container>
        <p className="mt-10 border-t border-zinc-800 pt-6 text-xs text-zinc-400">
          Copyright {year} LX Obsidian Labs. All rights reserved.
          {" "}
          <Link className="hover:text-accent" href="/legal/privacy">
            Privacy
          </Link>
          {" "}•{" "}
          <Link className="hover:text-accent" href="/legal/terms">
            Terms
          </Link>
        </p>
      </Container>
    </footer>
  );
}
