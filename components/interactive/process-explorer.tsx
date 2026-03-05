"use client";

import { useState } from "react";
import { processSteps } from "@/lib/data";

export function ProcessExplorer() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-6 rounded-2xl border bg-white p-6 md:grid-cols-5 md:p-8">
      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Build With Us</p>
        <h3 className="text-2xl font-bold">Our development process is transparent and measurable.</h3>
        <p className="text-sm text-muted">Select each phase to see how we move from idea to reliable deployment.</p>
      </div>

      <div className="md:col-span-3">
        <div className="flex flex-wrap gap-2">
          {processSteps.map((step, index) => (
            <button
              key={step.title}
              onClick={() => setActive(index)}
              className={
                index === active
                  ? "rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white"
                  : "rounded-md border px-3 py-2 text-sm font-semibold text-[#111111]"
              }
            >
              {index + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-accent">{processSteps[active].title}</p>
          <p className="mt-2 text-sm text-[#111111]">{processSteps[active].detail}</p>
        </div>
      </div>
    </div>
  );
}
