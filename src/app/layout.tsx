import type { Metadata, Viewport } from "next";
import { Archivo, Bangers, Comic_Neue, Dela_Gothic_One } from "next/font/google";
import { seo } from "./seo";
import "./globals.css";

// Display logotype + titles; SFX lettering; manga caption lettering; body/UI.
const dela = Dela_Gothic_One({ variable: "--font-dela", weight: "400", subsets: ["latin"] });
const bangers = Bangers({ variable: "--font-bangers", weight: "400", subsets: ["latin"] });
const comic = Comic_Neue({ variable: "--font-comic", weight: ["400", "700"], subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

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
  themeColor: "#F4F4F1",
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
      className={`${dela.variable} ${bangers.variable} ${comic.variable} ${archivo.variable} h-full antialiased`}
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
