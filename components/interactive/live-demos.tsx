"use client";

import { useState } from "react";

const demos = [
  {
    name: "Student Registration",
    output: "Student #LX-2041 registered and onboarding workflow triggered.",
  },
  {
    name: "Invoice Generator",
    output: "Invoice INV-1124 generated with tax and payment reminder automation.",
  },
  {
    name: "AI Document Analyzer",
    output: "Contract reviewed. 3 risk clauses flagged for legal review.",
  },
];

export function LiveDemos() {
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-2xl border bg-white p-6 md:p-8">
      <h3 className="text-2xl font-bold">Live System Demos</h3>
      <p className="mt-2 text-sm text-muted">Try mini demonstrations of the types of systems we build for clients.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {demos.map((demo, index) => (
          <button
            key={demo.name}
            onClick={() => setActive(index)}
            className={
              active === index
                ? "rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white"
                : "rounded-md border px-3 py-2 text-sm font-semibold"
            }
          >
            {demo.name}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-dashed bg-surface p-4 text-sm text-[#111111]">{demos[active].output}</div>
    </div>
  );
}
