import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { CreatorProjectDetail } from "@/components/creator/project-detail";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Creator Workspace",
  description: "Project workspace for Obsidian Creator artifacts and outputs.",
};

export default async function CreatorProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Section className="bg-surface py-20">
      <CreatorProjectDetail id={id} />
    </Section>
  );
}
