import type { MetadataRoute } from "next";
import { caseStudies, insights } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lxobsidianlabs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;
  const staticRoutes: Array<{ route: string; lastModified: string; priority: number }> = [
    { route: "", lastModified: "2026-03-05", priority: 1 },
    { route: "/services", lastModified: "2026-03-05", priority: 0.9 },
    { route: "/services/design-order", lastModified: "2026-03-05", priority: 0.9 },
    { route: "/lab", lastModified: "2026-03-05", priority: 0.85 },
    { route: "/resources", lastModified: "2026-03-05", priority: 0.8 },
    { route: "/portfolio", lastModified: "2026-03-05", priority: 0.9 },
    { route: "/about", lastModified: "2026-03-05", priority: 0.8 },
    { route: "/insights", lastModified: "2026-03-05", priority: 0.85 },
    { route: "/contact", lastModified: "2026-03-05", priority: 0.9 },
  ];

  const caseStudyRoutes = caseStudies.map((study) => ({
    route: `/portfolio/${study.slug}`,
    lastModified: study.updatedAt,
    priority: 0.8,
  }));

  const insightRoutes = insights.map((insight) => ({
    route: `/insights/${insight.slug}`,
    lastModified: insight.updatedAt,
    priority: 0.75,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...insightRoutes].map((entry) => ({
    url: `${baseUrl}${entry.route}`,
    lastModified: new Date(entry.lastModified),
    changeFrequency: "weekly",
    priority: entry.priority,
  }));
}
