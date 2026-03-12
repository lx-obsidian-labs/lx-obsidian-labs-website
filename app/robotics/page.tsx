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

export default function RoboticsPage() {
  return (
    <>
      <Section className="bg-[#0b0b0d] py-20 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Robotics Vision</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">Nathan Vilane&apos;s vision for a better future through non-intrusive robotics.</h1>
        <p className="mt-5 max-w-3xl text-zinc-300">
          I see a world of upscaled robotics that make life better without taking over life itself. Robots should see work, support people quietly,
          and blend into our environments so naturally that we do not need to feel their presence. The mission is simple: remove unresolved
          friction and replace it with consistent technology that helps people execute with clarity.
        </p>
      </Section>

      <Section className="bg-white">
        <div className="rounded-xl border bg-surface p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Core Statement</p>
          <p className="mt-3 text-base text-[#111111] md:text-lg">
            My vision is to take away unfulfilled resolutions and replace them with technology that is more consistent than our ever-changing minds.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-xl border bg-white p-5">
              <h2 className="text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-2 text-sm text-muted">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
