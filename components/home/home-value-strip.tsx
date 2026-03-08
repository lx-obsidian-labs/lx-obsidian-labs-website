import Link from "next/link";

const proofItems = [
  { label: "Build Modes", value: "3", detail: "AI Creator, Managed Delivery, Fast Track Design" },
  { label: "Core Verticals", value: "Software + Design + Ops", detail: "Integrated systems instead of disconnected execution" },
  { label: "Primary Outcome", value: "Faster Launches", detail: "Prompt-to-output workflows with versioned project history" },
  { label: "Support Route", value: "WhatsApp + Project Brief", detail: "Clear customer care path from first request" },
];

export function HomeValueStrip() {
  return (
    <div className="rounded-2xl border bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why This Works</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Everything is built to move users from idea to execution.</h2>
        </div>
        <Link href="/contact#start-form" className="text-sm font-semibold text-accent hover:underline">
          Start your brief
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {proofItems.map((item) => (
          <article key={item.label} className="rounded-xl border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{item.label}</p>
            <p className="mt-1 text-lg font-bold text-[#111111]">{item.value}</p>
            <p className="mt-1 text-xs text-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
