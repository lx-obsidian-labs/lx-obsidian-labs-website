"use client";

import { motion } from "framer-motion";

const metrics = [
  { label: "Students Registered", value: "1,240" },
  { label: "Invoices Generated", value: "3,500" },
  { label: "Automation Tasks", value: "15,000" },
];

export function SystemsDashboardPreview() {
  return (
    <div className="rounded-2xl border bg-[#0b0b0d] p-6 text-white md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Systems Dashboard Preview</p>
      <h3 className="mt-3 text-2xl font-bold">A look at the software interfaces we build.</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-accent">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
