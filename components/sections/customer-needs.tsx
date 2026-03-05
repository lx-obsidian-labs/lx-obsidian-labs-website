import Link from "next/link";
import { customerNeedPaths } from "@/lib/data";

export function CustomerNeeds() {
  return (
    <div className="rounded-2xl border bg-white p-8 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Customer Need Paths</p>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">Start from your real business problem.</h2>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {customerNeedPaths.map((path) => (
          <article key={path.title} className="rounded-xl border bg-surface p-5">
            <h3 className="text-lg font-semibold">{path.title}</h3>
            <p className="mt-2 text-sm text-muted">{path.problem}</p>
            <p className="mt-3 text-sm font-medium text-[#111111]">Recommended: {path.recommendation}</p>
            <Link href={path.href} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
              Start Your Project
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
