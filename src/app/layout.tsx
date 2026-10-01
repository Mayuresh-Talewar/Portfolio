import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { seo } from "./seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: { default: `${seo.name} | ${seo.title}`, template: `%s | ${seo.name}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.name, url: seo.url }],
  creator: seo.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: seo.name,
    title: `${seo.name} | ${seo.title}`,
    description: seo.description,
    locale: "en_IN",
    firstName: "Mayuresh",
    lastName: "Talewar",
  },
  twitter: {
    card: "summary_large_image",
    title: `${seo.name} | ${seo.title}`,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: seo.name,
  jobTitle: seo.title,
  description: seo.description,
  url: seo.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: "Crestline Intelligence" },
  knowsAbout: seo.knowsAbout,
  sameAs: seo.sameAs,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
