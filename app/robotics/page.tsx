import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { AdsenseUnit } from "@/components/ads/adsense-unit";
import { RoboticsImmersiveExperience } from "@/components/robotics/immersive-experience";
import { RoboticsFundingPanel } from "@/components/robotics/funding-panel";

export const metadata: Metadata = {
  title: "Robotics Vision",
  description: "Nathan Vilane's vision for non-intrusive, human-aligned robotics that improves life with consistent support.",
  alternates: { canonical: "/robotics" },
};

export default function RoboticsPage() {
  const roboticsAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ROBOTICS;

  return (
    <>
      <Section className="bg-[#020611] py-12 text-white md:py-16">
        <RoboticsImmersiveExperience />
      </Section>
      <Section className="bg-[#020611] py-0 text-white">
        <AdsenseUnit slot={roboticsAdSlot} className="min-h-[120px] border-emerald-300/30 bg-[#0a1d33]" format="horizontal" />
      </Section>
      <Section className="bg-[#020611] pb-16 text-white">
        <RoboticsFundingPanel />
      </Section>
    </>
  );
}
