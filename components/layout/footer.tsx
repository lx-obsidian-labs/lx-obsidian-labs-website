import Link from "next/link";
import { Container } from "@/components/layout/container";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t bg-[#0a0a0a] py-12 text-white">
      <Container className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">LX Obsidian Labs</p>
          <p className="mt-3 max-w-xs text-sm text-zinc-300">
            We build software, branding, and operational systems that help modern businesses scale with confidence.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
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
              <Link className="hover:text-accent" href="/lab">
                Lab
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent" href="/insights">
                Insights
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
          </ul>
        </div>
      </Container>

      <Container>
        <p className="mt-10 border-t border-zinc-800 pt-6 text-xs text-zinc-400">
          Copyright {year} LX Obsidian Labs. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
