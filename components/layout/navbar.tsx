"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/92 shadow-[0_6px_22px_-18px_rgba(15,23,42,0.45)] backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-base font-extrabold tracking-wide text-[#111111]" aria-label="LX Obsidian Labs Home">
          LX <span className="text-accent">Obsidian</span> Labs
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-accent",
                  active ? "text-accent" : "text-[#111111]",
                )}
              >
                {link.label}
                {active ? <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-accent" /> : null}
              </Link>
            );
          })}
          <Button asChild size="default">
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-[#111111] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-white md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[#f4f4f5]",
                      active ? "text-accent" : "text-[#111111]",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-2 w-full">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Start Your Project
                </Link>
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
