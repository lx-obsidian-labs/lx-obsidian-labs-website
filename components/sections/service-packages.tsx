import { servicePackages } from "@/lib/data";

export function ServicePackages() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Service Packages</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Choose the right engagement model for your growth stage.</h2>
      </div>

      {Object.entries(servicePackages).map(([serviceName, tiers]) => (
        <section key={serviceName} className="space-y-4">
          <h3 className="text-2xl font-semibold">{serviceName}</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <article key={`${serviceName}-${tier.tier}`} className="rounded-xl border bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{tier.tier}</p>
                <h4 className="mt-2 text-xl font-semibold">Best for: {tier.bestFor}</h4>
                <p className="mt-2 text-sm text-muted">Timeline: {tier.timeline}</p>
                <p className="mt-1 text-sm font-medium text-[#111111]">Starting at {tier.startingAt}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {tier.outcomes.map((outcome) => (
                    <li key={outcome}>- {outcome}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
