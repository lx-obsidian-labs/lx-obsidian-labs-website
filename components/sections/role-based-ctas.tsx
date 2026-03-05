import Link from "next/link";
import { Button } from "@/components/ui/button";

const paths = [
  {
    title: "Get a Project Estimate",
    detail: "Best for teams with defined scope and delivery timelines.",
    href: "/services",
    action: "Estimate Project",
  },
  {
    title: "Book Technical Discovery",
    detail: "Best for system architecture, automation, and platform planning.",
    href: "/contact",
    action: "Book Discovery",
  },
  {
    title: "Request Design Audit",
    detail: "Best for brand consistency, campaign quality, and conversion design.",
    href: "/contact",
    action: "Request Audit",
  },
];

export function RoleBasedCtas() {
  return (
    <div className="rounded-2xl border bg-white p-6 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Conversion Paths</p>
      <h2 className="mt-3 text-2xl font-bold md:text-4xl">Choose the fastest path based on your current need.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {paths.map((path) => (
          <article key={path.title} className="rounded-xl border bg-surface p-5">
            <h3 className="text-lg font-semibold">{path.title}</h3>
            <p className="mt-2 text-sm text-muted">{path.detail}</p>
            <Button asChild variant="secondary" className="mt-4 w-full">
              <Link href={path.href}>{path.action}</Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
