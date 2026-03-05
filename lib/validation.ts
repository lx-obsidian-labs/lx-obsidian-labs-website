import { z } from "zod";

const noExcessiveLinks = (value: string) => {
  const links = value.match(/https?:\/\//gi);
  return (links?.length || 0) <= 2;
};

export const leadPayloadSchema = z.object({
  projectType: z.string().trim().min(2).max(80),
  budgetRange: z.string().trim().min(2).max(80),
  timeline: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(12).max(4000).refine(noExcessiveLinks, "Too many links"),
  website: z.string().trim().max(0).optional().default(""),
  startedAt: z.number().int().positive().optional(),
});

export type LeadPayloadInput = z.infer<typeof leadPayloadSchema>;
