import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { RoboticsImmersiveExperience } from "@/components/robotics/immersive-experience";

export const metadata: Metadata = {
  title: "Robotics Vision",
  description: "Nathan Vilane's vision for non-intrusive, human-aligned robotics that improves life with consistent support.",
  alternates: { canonical: "/robotics" },
};

export default function RoboticsPage() {
  return (
    <>
      <Section className="bg-[#020611] py-12 text-white md:py-16">
        <RoboticsImmersiveExperience />
      </Section>
    </>
  );
}
