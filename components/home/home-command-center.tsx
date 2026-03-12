import Link from "next/link";
import { Button } from "@/components/ui/button";

const tracks = [
  {
    title: "Order Designs (Primary)",
    detail: "Best for urgent visual assets, brand directions, and campaign-ready design outputs.",
    href: "/services/design-order",
    cta: "Place Design Order",
  },
  {
    title: "Build With AI Creator",
    detail: "Best for fast website/doc generation and iterative editing inside versioned projects.",
    href: "/creator/agent",
    cta: "Open Agent Workspace",
  },
  {
    title: "Start Managed Delivery",
    detail: "Best when you need strategy, implementation, and support from our team end-to-end.",
    href: "/contact#start-form",
    cta: "Start Project Brief",
  },
];

export function HomeCommandCenter() {
  return (
    <div className="rounded-2xl border bg-white p-6 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Start Command Center</p>
      <h2 className="mt-3 text-2xl font-bold md:text-4xl">Choose one clear start path and launch with confidence.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {tracks.map((track) => (
          <article key={track.title} className="rounded-xl border bg-surface p-4">
            <h3 className="text-base font-semibold">{track.title}</h3>
            <p className="mt-2 text-sm text-muted">{track.detail}</p>
            <Button asChild className="mt-4 w-full">
              <Link href={track.href}>{track.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
