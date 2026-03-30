import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/interactive/floating-actions";
import { GlobalDonationForm } from "@/components/interactive/global-donation-form";
import { companyContent } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lxobsidianlabs.vercel.app";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LX Obsidian Labs | Software Development & Automation Systems",
    template: "%s | LX Obsidian Labs",
  },
  description:
    "LX Obsidian Labs builds custom software, automation systems, AI-powered tools, and digital platforms that help businesses scale efficiently.",
  keywords: [
    "software development",
    "automation systems",
    "custom web development",
    "AI systems",
    "business automation",
    "technology solutions",
    "Next.js development",
    "software engineering",
    "digital platforms",
    "enterprise systems",
    "graphic design",
    "business consultancy",
    "LX Obsidian Labs",
  ],
  authors: [{ name: "LX Obsidian Labs" }],
  creator: "LX Obsidian Labs",
  publisher: "LX Obsidian Labs",
  openGraph: {
    title: "LX Obsidian Labs",
    description:
      "Custom software development, automation systems, and intelligent digital platforms for modern businesses.",
    type: "website",
    url: siteUrl,
    siteName: "LX Obsidian Labs",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LX Obsidian Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LX Obsidian Labs",
    description:
      "Custom software development, automation systems, and digital infrastructure.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyContent.name,
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    email: "vilanenathan@gmail.com",
    telephone: "+27762982399",
    description: companyContent.intro,
    sameAs: ["https://wa.me/27762982399"],
  };

  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar />
        <main className="relative min-h-[60vh]">{children}</main>
        <GlobalDonationForm />
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
