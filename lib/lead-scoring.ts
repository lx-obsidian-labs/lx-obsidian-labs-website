type LeadLike = {
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  currentTools?: string;
  primaryGoal?: string;
};

export type LeadPriority = "low" | "medium" | "high";

export function scoreLead(lead: LeadLike) {
  let score = 0;

  if (lead.budgetRange === "R300k+") score += 40;
  else if (lead.budgetRange === "R150k - R300k") score += 30;
  else if (lead.budgetRange === "R50k - R150k") score += 20;
  else score += 10;

  if (lead.timeline === "2-4 months") score += 25;
  else if (lead.timeline === "4-6 months") score += 22;
  else if (lead.timeline === "Flexible") score += 18;
  else score += 8;

  if (lead.projectType === "Automation System" || lead.projectType === "Web Application" || lead.projectType === "CMS System") {
    score += 22;
  } else {
    score += 16;
  }

  if ((lead.message || "").trim().length > 80) score += 8;
  if ((lead.currentTools || "").trim().length > 5) score += 3;
  if ((lead.primaryGoal || "").trim().length > 5) score += 2;

  score = Math.min(100, Math.max(0, score));

  const priority: LeadPriority = score >= 80 ? "high" : score >= 60 ? "medium" : "low";
  const routingTag = priority === "high" ? "priority-fast-track" : priority === "medium" ? "priority-standard" : "priority-nurture";

  return {
    score,
    priority,
    routingTag,
  };
}
