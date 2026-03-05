import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/interactive/floating-actions";
import { companyContent } from "@/content/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lxobsidianlabs.com"),
  title: {
    default: "LX Obsidian Labs | Software, Design & Business Systems",
    template: "%s | LX Obsidian Labs",
  },
  description: companyContent.intro,
  keywords: [
    "software development",
    "graphic design",
    "business consultancy",
    "technology infrastructure",
    "LX Obsidian Labs",
  ],
  openGraph: {
    title: "LX Obsidian Labs",
    description:
      "Software, design, and systems for modern businesses. Build, scale, and operate with clarity.",
    type: "website",
    url: "https://lxobsidianlabs.com",
    siteName: "LX Obsidian Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "LX Obsidian Labs",
    description:
      "Software, design, and systems for modern businesses. Build, scale, and operate with clarity.",
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
    url: "https://lxobsidianlabs.com",
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
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
