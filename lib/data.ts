export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/lab", label: "Lab" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    title: "Software Development",
    description:
      "Build reliable digital products that scale with your operations and customer demand.",
    items: [
      "Web Applications",
      "CMS Systems",
      "Automation Systems",
      "Custom Dashboards",
      "API Integrations",
    ],
  },
  {
    title: "Graphic Design",
    description:
      "Design visual systems that strengthen recognition, trust, and conversion across channels.",
    items: [
      "Brand Identity Systems",
      "Marketing Collateral",
      "UI Design Kits",
      "Pitch Deck Design",
      "Social Media Assets",
    ],
  },
  {
    title: "Business Consultancy",
    description:
      "Create operational clarity through process design, technology strategy, and measurable outcomes.",
    items: [
      "Digital Transformation Planning",
      "Workflow Optimization",
      "Technology Stack Advisory",
      "Systems Audits",
      "Growth Roadmapping",
    ],
  },
];

export const industrySolutions = [
  {
    industry: "Education",
    solutions: [
      "College management systems",
      "Student lifecycle automation",
      "Learning platforms",
    ],
  },
  {
    industry: "Small Business",
    solutions: [
      "Inventory systems",
      "CRM dashboards",
      "Operations automation",
    ],
  },
  {
    industry: "Agencies",
    solutions: [
      "Client portals",
      "Project delivery workflows",
      "Campaign reporting systems",
    ],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  problem: string;
  solution: string;
  technology: string[];
  results: string[];
  updatedAt: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "atlas-operations-platform",
    title: "Atlas Operations Platform",
    category: "Software Development",
    description:
      "A custom operations dashboard that unified data, approvals, and reporting for a logistics team.",
    image: "/portfolio/atlas.svg",
    problem:
      "The operations team managed shipment updates and approvals across spreadsheets, causing delays and missing data.",
    solution:
      "We developed a centralized dashboard with role-based workflows, real-time status views, and API integrations.",
    technology: ["Next.js", "PostgreSQL", "Role-Based Access", "Workflow Automations"],
    results: ["62% faster approvals", "Single source of operational truth", "Reduced manual reporting time"],
    updatedAt: "2026-02-10",
  },
  {
    slug: "nexa-brand-identity",
    title: "Nexa Brand Identity",
    category: "Graphic Design",
    description:
      "Full visual identity refresh with high-clarity typography and modular marketing templates.",
    image: "/portfolio/nexa.svg",
    problem:
      "The company had fragmented branding across web, print, and social channels that weakened market trust.",
    solution:
      "We designed a complete identity system with scalable templates and clear brand governance rules.",
    technology: ["Design Systems", "Brand Toolkit", "UI Components", "Content Templates"],
    results: ["Consistent cross-channel presentation", "Faster campaign production", "Clearer brand recognition"],
    updatedAt: "2026-01-20",
  },
  {
    slug: "crestline-process-redesign",
    title: "Crestline Process Redesign",
    category: "Business Consultancy",
    description:
      "Business systems redesign that reduced approval bottlenecks and improved team responsiveness.",
    image: "/portfolio/crestline.svg",
    problem:
      "Manual handovers and disconnected tools created operational bottlenecks in critical client delivery steps.",
    solution:
      "We restructured process maps and implemented digital checkpoints with automation triggers.",
    technology: ["Systems Mapping", "Automation Rules", "Digital SOPs", "Performance Dashboards"],
    results: ["70% less administrative overhead", "Shorter delivery cycles", "Greater leadership visibility"],
    updatedAt: "2026-02-02",
  },
  {
    slug: "pulse-client-portal",
    title: "Pulse Client Portal",
    category: "Software Development",
    description:
      "A secure portal for project visibility, document sharing, and client communication workflows.",
    image: "/portfolio/pulse.svg",
    problem:
      "Clients lacked transparency on project status and depended on email chains for updates.",
    solution:
      "We built a secure portal with milestones, document access, threaded updates, and alerts.",
    technology: ["Next.js", "Secure Authentication", "Notifications", "Document Management"],
    results: ["Higher client confidence", "Reduced status meeting load", "Faster approvals and feedback"],
    updatedAt: "2026-02-18",
  },
  {
    slug: "kinetic-campaign-system",
    title: "Kinetic Campaign System",
    category: "Graphic Design",
    description:
      "A scalable campaign design language used across web, print, and social launch assets.",
    image: "/portfolio/kinetic.svg",
    problem:
      "Campaign teams recreated assets from scratch each launch, increasing production time and inconsistency.",
    solution:
      "We built a modular campaign design system with reusable patterns and copy-fit guidance.",
    technology: ["Figma System", "Component Library", "Creative Ops", "Asset Automation"],
    results: ["Faster campaign turnarounds", "Improved visual consistency", "Lower creative production cost"],
    updatedAt: "2026-01-28",
  },
  {
    slug: "vantage-growth-blueprint",
    title: "Vantage Growth Blueprint",
    category: "Business Consultancy",
    description:
      "A 12-month systems and technology roadmap aligned to revenue and operational milestones.",
    image: "/portfolio/vantage.svg",
    problem:
      "Leadership lacked a phased plan connecting technology spend with measurable business outcomes.",
    solution:
      "We delivered a growth blueprint with quarterly milestones, budget sequencing, and execution KPIs.",
    technology: ["Roadmapping", "KPI Design", "Ops Strategy", "Technology Advisory"],
    results: ["Clear implementation priorities", "Improved resource allocation", "Executive alignment on growth plan"],
    updatedAt: "2026-02-05",
  },
];

export const portfolioProjects = caseStudies.map((study) => ({
  title: study.title,
  category: study.category,
  description: study.description,
  image: study.image,
  link: `/portfolio/${study.slug}`,
}));

export const labProjects = [
  {
    title: "College Management System",
    type: "Internal Product",
    summary: "A modular student operations platform with attendance, billing, and analytics automation.",
    status: "Beta",
  },
  {
    title: "AI Agent Platform",
    type: "Experiment",
    summary: "A task-specific AI assistant framework for lead qualification and team support operations.",
    status: "Active",
  },
  {
    title: "Student Data Automation",
    type: "Automation Suite",
    summary: "A rules engine that synchronizes student records across admissions and reporting tools.",
    status: "Pilot",
  },
  {
    title: "Custom CMS Builder",
    type: "Developer Toolkit",
    summary: "A reusable CMS architecture for rapid deployment of role-based business dashboards.",
    status: "R&D",
  },
];

export const processSteps = [
  {
    title: "Discovery",
    detail: "We identify constraints, priorities, and growth targets before any build decisions are made.",
  },
  {
    title: "System Design",
    detail: "We map architecture, workflows, interfaces, and automation paths for performance and scalability.",
  },
  {
    title: "Development",
    detail: "We implement in focused sprints with iterative demos and operational feedback.",
  },
  {
    title: "Testing",
    detail: "We validate core flows, edge cases, data integrity, and usability before release.",
  },
  {
    title: "Deployment",
    detail: "We launch with observability, handover docs, and a roadmap for optimization.",
  },
];

export const insights = [
  {
    slug: "why-businesses-fail-digitally",
    title: "Why Most Businesses Fail Digitally",
    excerpt: "The gap is rarely technology. It is the lack of system thinking between strategy and execution.",
    content:
      "Most digital failures are process failures, not tooling failures. Teams adopt platforms before clarifying ownership, lifecycle, and measurable outcomes. At LX Obsidian Labs, we start with system mapping so software, design, and operations align before implementation.",
    updatedAt: "2026-02-07",
  },
  {
    slug: "future-of-ai-agents",
    title: "The Future of AI Agents in Operations",
    excerpt: "High-value teams use AI agents for process acceleration, not just chat interfaces.",
    content:
      "The practical value of AI agents comes from workflow integration. Agents should support qualification, triage, handoff, and reporting inside core business systems. This creates repeatable leverage instead of one-off novelty.",
    updatedAt: "2026-02-12",
  },
  {
    slug: "automating-operations-without-chaos",
    title: "Automating Operations Without Creating Chaos",
    excerpt: "Automation succeeds when process clarity comes before tool selection.",
    content:
      "Automation adds complexity when the underlying process is unstable. Teams should define state transitions, escalation rules, and accountability before wiring triggers. Reliable automation is designed as a system, not as scattered scripts.",
    updatedAt: "2026-02-19",
  },
];
