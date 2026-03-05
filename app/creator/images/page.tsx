import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Creator Image Studio",
  description: "Generate branded visual assets with Obsidian Creator Image Studio.",
  alternates: { canonical: "/creator/images" },
};

export default function CreatorImagesPage() {
  return (
    <Section className="bg-white py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator / Images</p>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Image Studio</h1>
      <p className="mt-4 max-w-2xl text-sm text-muted">Create campaign visuals, social assets, and branded graphics from prompt-based instructions.</p>
    </Section>
  );
}
