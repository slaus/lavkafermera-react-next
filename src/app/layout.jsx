import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { metadata, viewport } from "./metadata";
import { AppProviders } from "@/context/AppContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const inter = Inter({ subsets: ["cyrillic"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://perepel-club.com';
const phone = process.env.NEXT_PUBLIC_PHONE;
const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export { metadata, viewport };

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Перепелиний клуб",
    url: siteUrl,
    logo: `${siteUrl}/images/banner-bg.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
    },
    sameAs: [facebook, instagram].filter(Boolean),
  };

  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <AppProviders>
            {children}
          </AppProviders>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}