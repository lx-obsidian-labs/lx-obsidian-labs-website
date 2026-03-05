import { servicePackages } from "@/lib/data";

export function ServicePackages() {
  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Service Packages</p>
        <h2 className="mt-3 text-2xl font-bold md:text-4xl">Choose the right engagement model for your growth stage.</h2>
      </div>

      {Object.entries(servicePackages).map(([serviceName, tiers], serviceIndex) => (
        <details key={serviceName} className="rounded-xl border bg-white p-5 md:p-6" open={serviceIndex === 0}>
          <summary className="cursor-pointer text-lg font-semibold md:text-xl">{serviceName} Packages</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <article key={`${serviceName}-${tier.tier}`} className="rounded-lg border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{tier.tier}</p>
                <h4 className="mt-2 text-base font-semibold">Best for: {tier.bestFor}</h4>
                <p className="mt-2 text-sm text-muted">Timeline: {tier.timeline}</p>
                <p className="mt-1 text-sm font-medium text-[#111111]">Starting at {tier.startingAt}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {tier.outcomes.map((outcome) => (
                    <li key={outcome}>- {outcome}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
