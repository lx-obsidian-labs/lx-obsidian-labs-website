const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lxobsidianlabs.vercel.app";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LX Obsidian Labs",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
  description: "Software development, graphic design, and business consultancy. Founded by Nathan Vilane.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Nathan Vilane",
    jobTitle: "Founder & Lead Developer",
    url: `${siteUrl}/about`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+27-76-298-2399",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://wa.me/27762982399",
  ],
  areaServed: {
    "@type": "Country",
    name: "South Africa",
  },
  serviceType: ["Software Development", "Web Design", "Graphic Design", "Business Consultancy", "AI Automation"],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "LX Obsidian Labs",
  image: `${siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZA",
  },
  telephone: "+27-76-298-2399",
  email: "vilanenathan@gmail.com",
  url: siteUrl,
  priceRange: "R25,000 - R300,000",
  openingHours: "Mo-Fr 08:00-18:00",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does LX Obsidian Labs offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer software development (web apps, CMS systems, automation), graphic design (brand identity, UI design, marketing collateral), and business consultancy (digital transformation, workflow optimization, technology strategy).",
      },
    },
    {
      "@type": "Question",
      name: "How much does a website cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Website projects start from R60,000 for MVPs and internal tools. Larger systems with integrations start from R150,000. Design-only projects start from R25,000.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a project take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Timelines vary: design projects 2-4 weeks, software MVPs 4-8 weeks, complex systems 8-14 weeks. We provide clear timelines during discovery.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer ongoing support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer managed delivery and ongoing support packages. Contact us to discuss your maintenance needs.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help with AI automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we build AI-powered workflows, automation systems, and custom AI assistants for business operations.",
      },
    },
    {
      "@type": "Question",
      name: "Where are you located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are based in South Africa and serve clients remotely across the country and internationally.",
      },
    },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BIMAX Audio Player",
  description: "Beautiful YouTube Music Player for Windows with offline mode, smart search, and dark neon interface.",
  brand: {
    "@type": "Brand",
    name: "LX Obsidian Labs",
  },
  offers: {
    "@type": "Offer",
    price: "2.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  creator: {
    "@type": "Person",
    name: "Nathan Vilane",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Obsidian Creator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  description: "AI-powered workspace for building websites, documents, and automation workflows.",
  creator: {
    "@type": "Organization",
    name: "LX Obsidian Labs",
  },
};

export function StructuredData() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
    </>
  );
}
