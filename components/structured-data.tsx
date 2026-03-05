const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lxobsidianlabs.vercel.app";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LX Obsidian Labs",
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+27-76-298-2399",
      contactType: "customer service",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
