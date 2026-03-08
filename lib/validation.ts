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
  currentTools: z.string().trim().max(300).optional().default(""),
  primaryGoal: z.string().trim().max(300).optional().default(""),
  message: z.string().trim().min(12).max(4000).refine(noExcessiveLinks, "Too many links"),
  website: z.string().trim().max(0).optional().default(""),
  startedAt: z.number().int().positive().optional(),
});

export type LeadPayloadInput = z.infer<typeof leadPayloadSchema>;

export const siteRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(800).optional().default(""),
  email: z.email().optional(),
  page: z.string().trim().max(120).optional().default("unknown"),
});

export const quickEmailSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  subject: z.string().trim().min(4).max(140),
  message: z.string().trim().min(12).max(3000).refine(noExcessiveLinks, "Too many links"),
});

export const newsletterSchema = z.object({
  email: z.email(),
  name: z.string().trim().max(120).optional().default(""),
  interests: z.array(z.string().trim().min(2).max(40)).max(8).optional().default([]),
});

export const authSignInSchema = z.object({
  email: z.email(),
  name: z.string().trim().max(120).optional().default(""),
});

export const creatorWebGenerateSchema = z.object({
  projectId: z.string().trim().min(8).max(80).optional(),
  prompt: z.string().trim().min(8).max(4000),
  industry: z.string().trim().max(120).optional().default(""),
  style: z.string().trim().max(120).optional().default(""),
  pages: z.array(z.string().trim().min(1).max(120)).max(20).optional().default([]),
  primaryCta: z.string().trim().max(80).optional().default(""),
});

export const creatorDocsGenerateSchema = z.object({
  projectId: z.string().trim().min(8).max(80).optional(),
  documentType: z.enum(["company-profile", "business-plan", "proposal", "policy"]),
  companyName: z.string().trim().min(2).max(140),
  industry: z.string().trim().max(120).optional().default(""),
  tone: z.string().trim().max(80).optional().default(""),
  goal: z.string().trim().max(800).optional().default(""),
  keyPoints: z.array(z.string().trim().min(1).max(200)).max(20).optional().default([]),
});

export const creatorAgentBuildSchema = z.object({
  objective: z.string().trim().min(8).max(4000),
  workspaceType: z.enum(["web", "docs", "consult", "mixed"]).optional().default("mixed"),
  companyName: z.string().trim().max(140).optional().default(""),
  audience: z.string().trim().max(140).optional().default(""),
  depth: z.enum(["quick", "standard", "deep"]).optional().default("standard"),
  forcedModes: z.array(z.enum(["web", "docs", "consult"])) .max(3).optional().default([]),
});
