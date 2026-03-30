import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t bg-[#0a0a0a] py-12 text-white">
      <Container className="grid gap-8 lg:grid-cols-4">
        <div>
          <Image
            src="/brand/lx-logo-dark.svg"
            alt="LX Obsidian Labs"
            width={210}
            height={42}
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-zinc-300">
            Software, design, and robotics from Nathan Vilane.
          </p>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Robotics vision coming 2028.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/apps" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-accent hover:text-accent">
              Get BIMAX
            </Link>
            <Link href="/offers" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-accent hover:text-accent">
              Offers
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li><Link className="hover:text-accent" href="/apps">Apps</Link></li>
            <li><Link className="hover:text-accent" href="/offers">Offers</Link></li>
            <li><Link className="hover:text-accent" href="/directory">Directory</Link></li>
            <li><Link className="hover:text-accent" href="/services">Services</Link></li>
            <li><Link className="hover:text-accent" href="/portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-accent" href="/robotics">Robotics</Link></li>
            <li><Link className="hover:text-accent" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li><Link className="hover:text-accent" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-accent" href="/news">News</Link></li>
            <li><Link className="hover:text-accent" href="/about">About</Link></li>
            <li><Link className="hover:text-accent" href="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li><a className="hover:text-accent" href="tel:+27762982399">+27 76 298 2399</a></li>
            <li><a className="hover:text-accent" href="mailto:vilanenathan@gmail.com">vilanenathan@gmail.com</a></li>
            <li><a className="hover:text-accent" href="https://wa.me/27762982399" target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li className="pt-2 text-xs text-zinc-400">Response: within 24 hours</li>
          </ul>
        </div>
      </Container>

      <Container>
        <p className="mt-10 border-t border-zinc-800 pt-6 text-xs text-zinc-400">
          © {year} LX Obsidian Labs. All rights reserved.
          {" "}
          <Link className="hover:text-accent" href="/legal/privacy">Privacy</Link>
          {" "}·{" "}
          <Link className="hover:text-accent" href="/legal/terms">Terms</Link>
        </p>
      </Container>
    </footer>
  );
}
