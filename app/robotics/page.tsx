import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Robotics Vision",
  description: "Nathan Vilane's vision for non-intrusive, human-aligned robotics that improves life with consistent support.",
  alternates: { canonical: "/robotics" },
};

const pillars = [
  {
    title: "Non-Intrusive By Design",
    detail:
      "Robotics should blend into daily life without demanding attention. If systems are working correctly, people should feel supported, not disrupted.",
  },
  {
    title: "Human Life Stays Human",
    detail:
      "The goal is not to replace the life we know. The goal is to reduce friction, remove repetitive burden, and let people focus on meaningful decisions.",
  },
  {
    title: "Consistent Execution",
    detail:
      "Unfulfilled resolutions often come from inconsistency. Robotics can provide stable follow-through where changing human focus creates gaps.",
  },
  {
    title: "Upscaled Practical Impact",
    detail:
      "From operations to personal workflows, the long-term direction is large-scale, reliable robotics that make life better without creating social strain.",
  },
];

const roboticsSkills = [
  "Robot workflow architecture",
  "Sensor-driven task modeling",
  "Human-safe interaction design",
  "Automation reliability planning",
  "System integration mapping",
  "Operational robotics strategy",
];

const capabilityRows = [
  {
    title: "Perception + Context",
    detail: "Designing robot logic that identifies work states, not just objects, so systems respond to real operational needs.",
  },
  {
    title: "Quiet Assistive Execution",
    detail: "Building for low-friction behavior where robotics support daily life without demanding user attention.",
  },
  {
    title: "Consistency Engine",
    detail: "Translating intentions into repeatable actions so unresolved goals become completed outcomes over time.",
  },
];

const roadmap = [
  { phase: "Phase 1", title: "Software Robotics Layer", status: "Active", detail: "Agentic workflows, process memory, and autonomous task sequencing." },
  { phase: "Phase 2", title: "Physical Systems Integration", status: "R&D", detail: "Sensor-informed environments and robotic operation mapping in controlled domains." },
  { phase: "Phase 3", title: "Ambient Non-Intrusive Robotics", status: "Vision", detail: "Scaled systems that assist silently and blend naturally into everyday life." },
];

export default function RoboticsPage() {
  return (
    <>
      <Section className="relative overflow-hidden bg-[#030712] py-24 text-white">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(56,189,248,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.18) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Nathan Vilane Robotics Vision</p>
        <h1 className="relative mt-3 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">
          A world where robotics improve life quietly, consistently, and without taking over how humans live.
        </h1>
        <p className="relative mt-6 max-w-3xl text-base text-slate-300 md:text-lg">
          I see upscaled robotics that recognize real work, execute with stability, and blend so naturally into our environments that they do not feel intrusive.
          The purpose is not to erase humanity, but to remove unresolved friction and replace it with dependable technology that follows through.
        </p>
        <p className="relative mt-6 max-w-3xl rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          Core statement: My vision is to take away unfulfilled resolutions and replace them with technology that is more consistent than our ever-changing minds.
        </p>
      </Section>

      <Section className="bg-[#06111f] py-16 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Robotics Skills Showcase</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Capabilities I am developing for human-aligned robotics.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {roboticsSkills.map((skill) => (
            <article key={skill} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-cyan-100">{skill}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#0a1628] py-16 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">How I Approach Robotics</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {capabilityRows.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-cyan-100">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#0d1320] py-16 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Vision Pillars</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <h2 className="text-xl font-semibold text-cyan-100">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#030712] py-16 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Execution Roadmap</p>
        <div className="mt-5 space-y-3">
          {roadmap.map((item, index) => (
            <details key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5" open={index === 0}>
              <summary className="cursor-pointer text-base font-semibold text-cyan-100">
                <span className="mr-2 text-cyan-300">{item.phase}</span>
                {item.title}
                <span className="ml-2 rounded-full border border-slate-600 px-2 py-0.5 text-xs text-slate-300">{item.status}</span>
              </summary>
              <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
