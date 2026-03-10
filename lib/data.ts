export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/creator", label: "Creator" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
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

export const servicePackages = {
  "Software Development": [
    {
      tier: "Starter",
      bestFor: "MVPs and internal tools",
      timeline: "4-8 weeks",
      startingAt: "R60,000",
      outcomes: ["Core workflow build", "Admin panel", "Deployment setup"],
    },
    {
      tier: "Growth",
      bestFor: "Operational systems and portals",
      timeline: "8-14 weeks",
      startingAt: "R150,000",
      outcomes: ["Role-based workflows", "Automation flows", "Reporting dashboards"],
    },
    {
      tier: "Scale",
      bestFor: "Multi-team and integration-heavy systems",
      timeline: "14+ weeks",
      startingAt: "R300,000",
      outcomes: ["Complex integrations", "Performance architecture", "Advanced observability"],
    },
  ],
  "Graphic Design": [
    {
      tier: "Starter",
      bestFor: "Early-stage brand direction",
      timeline: "2-4 weeks",
      startingAt: "R25,000",
      outcomes: ["Logo suite", "Typography pairings", "Color direction"],
    },
    {
      tier: "Growth",
      bestFor: "Campaign-ready brand systems",
      timeline: "4-7 weeks",
      startingAt: "R55,000",
      outcomes: ["Brand guidelines", "Template systems", "Social/marketing assets"],
    },
    {
      tier: "Scale",
      bestFor: "Multi-channel brand operations",
      timeline: "7+ weeks",
      startingAt: "R95,000",
      outcomes: ["Design system", "Cross-platform library", "Creative operations framework"],
    },
  ],
  "Business Consultancy": [
    {
      tier: "Starter",
      bestFor: "Process diagnostics",
      timeline: "2-3 weeks",
      startingAt: "R30,000",
      outcomes: ["Systems audit", "Priority map", "Execution recommendations"],
    },
    {
      tier: "Growth",
      bestFor: "Operational redesign",
      timeline: "4-8 weeks",
      startingAt: "R70,000",
      outcomes: ["Workflow redesign", "Automation roadmap", "Team implementation plan"],
    },
    {
      tier: "Scale",
      bestFor: "Transformation programs",
      timeline: "8+ weeks",
      startingAt: "R140,000",
      outcomes: ["Quarterly strategy model", "KPI architecture", "Leadership operating cadence"],
    },
  ],
} as const;

export const customerNeedPaths = [
  {
    title: "I need a business system",
    problem: "Manual workflows are slowing delivery and creating decision bottlenecks.",
    recommendation: "Custom dashboard + role-based workflows + reporting automation",
    href: "/contact",
  },
  {
    title: "I need automation",
    problem: "Teams are repeating admin tasks that should be triggered automatically.",
    recommendation: "Automation engine + API integrations + alerting",
    href: "/creator/web",
  },
  {
    title: "I need branding that converts",
    problem: "Current brand presentation lacks consistency and trust across channels.",
    recommendation: "Identity system + campaign templates + conversion-focused visual direction",
    href: "/services/design-order",
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
  metrics: Array<{ label: string; value: string }>;
  related: string[];
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
    metrics: [
      { label: "Approval Speed", value: "+62%" },
      { label: "Report Time", value: "-48%" },
      { label: "Operational Visibility", value: "Realtime" },
    ],
    related: ["pulse-client-portal", "crestline-process-redesign"],
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
    metrics: [
      { label: "Campaign Production", value: "+37%" },
      { label: "Brand Consistency", value: "+52%" },
      { label: "Creative Reuse", value: "High" },
    ],
    related: ["kinetic-campaign-system", "vantage-growth-blueprint"],
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
    metrics: [
      { label: "Admin Load", value: "-70%" },
      { label: "Cycle Time", value: "-31%" },
      { label: "Escalation Clarity", value: "+44%" },
    ],
    related: ["atlas-operations-platform", "vantage-growth-blueprint"],
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
    metrics: [
      { label: "Client Response Time", value: "-42%" },
      { label: "Status Meetings", value: "-35%" },
      { label: "Feedback Loop", value: "Faster" },
    ],
    related: ["atlas-operations-platform", "kinetic-campaign-system"],
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
    metrics: [
      { label: "Creative Turnaround", value: "+41%" },
      { label: "Design Consistency", value: "+49%" },
      { label: "Production Cost", value: "-23%" },
    ],
    related: ["nexa-brand-identity", "pulse-client-portal"],
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
    metrics: [
      { label: "Planning Clarity", value: "+58%" },
      { label: "Resource Efficiency", value: "+29%" },
      { label: "Leadership Alignment", value: "Strong" },
    ],
    related: ["crestline-process-redesign", "nexa-brand-identity"],
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

export type TechBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  updatedAt: string;
  readTime: string;
  topic: string;
};

export const techBlogPosts: TechBlogPost[] = [
  {
    slug: "engineering-agentic-workflows-for-real-business-use",
    title: "Engineering Agentic Workflows for Real Business Use",
    excerpt: "Agentic systems become useful when they can plan, execute, and persist outputs across real workflows.",
    content:
      "Agentic workflows should not be designed as single chat completions. They need planning, checkpointing, and versioning. Teams get measurable value when agent outputs are connected to execution surfaces like project boards, delivery docs, and deployment processes. The practical implementation pattern is prompt -> plan -> build -> validate -> iterate -> ship.",
    updatedAt: "2026-03-10",
    readTime: "5 min",
    topic: "AI Engineering",
  },
  {
    slug: "designing-conversion-pages-that-dont-feel-generic",
    title: "Designing Conversion Pages That Don’t Feel Generic",
    excerpt: "Conversion and brand expression can coexist when hierarchy, proof, and CTA paths are intentional.",
    content:
      "Most landing pages fail because they stack sections without strategic sequencing. Strong conversion pages establish context quickly, provide trust anchors, and reduce decision friction with clear next actions. A reliable approach is to align page structure with user intent: orientation, proof, decision support, then action.",
    updatedAt: "2026-03-08",
    readTime: "4 min",
    topic: "Product Design",
  },
  {
    slug: "how-to-ship-ai-generated-outputs-with-quality-control",
    title: "How to Ship AI-Generated Outputs With Quality Control",
    excerpt: "Generated content needs normalization, scoring, and launch checklists before publication.",
    content:
      "AI generation speed is not enough for production environments. Teams should add output normalization, acceptance criteria, and quality scoring to every generation pipeline. This ensures consistency and reduces regressions. The best systems expose recommendations directly in the UI so iteration happens immediately.",
    updatedAt: "2026-03-06",
    readTime: "6 min",
    topic: "Quality Systems",
  },
];

export type NewsUpdate = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  updatedAt: string;
  category: "Platform" | "Company" | "Release";
};

export const newsUpdates: NewsUpdate[] = [
  {
    slug: "creator-ide-workspace-update",
    title: "Creator Workspace Updated With IDE-Style Editing",
    excerpt: "Projects now support file-style draft editing for faster iteration before persisted AI edits.",
    content:
      "We shipped an IDE-style workflow inside Creator project detail pages. Users can browse generated files, edit drafts, copy snippets, and continue with instruction-based versioning. This improves iteration speed and makes generated outputs more practical for implementation handoff.",
    updatedAt: "2026-03-10",
    category: "Release",
  },
  {
    slug: "creator-transient-mode-live",
    title: "Creator Transient Mode Is Live",
    excerpt: "Creator generation now works even when database persistence is not configured.",
    content:
      "We introduced transient mode to reduce setup friction. Users can generate websites and documents without immediate database configuration. Outputs remain usable via copy/download actions, while persistence becomes available automatically when DATABASE_URL is configured.",
    updatedAt: "2026-03-10",
    category: "Platform",
  },
  {
    slug: "homepage-navigation-and-start-path-upgrade",
    title: "Homepage Start Paths and Navigation Improved",
    excerpt: "The homepage now routes visitors faster into Creator, managed delivery, or design fast-track flows.",
    content:
      "We restructured the homepage with clearer start paths and stronger conversion guidance. Users now see direct routes based on objective, urgency, and service intent. This reduces decision friction and improves onboarding into the most relevant workflow.",
    updatedAt: "2026-03-09",
    category: "Company",
  },
];
