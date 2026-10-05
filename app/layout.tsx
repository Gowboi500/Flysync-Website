import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

// No `weight` array on purpose: that ships one static file per weight (which
// measured 134 KB across two requests). Omitting it serves Inter's variable
// font — every weight the design uses, in a single ~45 KB file.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// The single permitted flourish: one italic serif word in the hero headline.
// Italic 400 only — nothing else on the site uses it.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-serif",
});

const title = "Flysync — Complete Travel Technology Platform for Travel Businesses";
const description =
  "Run your entire travel business on one platform: B2B sub-agent portal, B2C booking engine, corporate travel, fixed departures, supplier APIs, accounting and reporting. Trusted by travel agencies across India. Book a free demo.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s | Flysync",
  },
  description,
  applicationName: site.name,
  keywords: [
    "travel technology platform",
    "B2B travel software India",
    "travel agency software",
    "B2C booking engine",
    "corporate travel management software",
    "white label travel portal",
    "travel CRM",
    "GDS API integration",
    "flight booking API India",
    "travel agency software Chennai",
    "fixed departure software",
    "sub agent portal",
  ],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Organization + SoftwareApplication + FAQ schema is emitted on the page. */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  slogan: site.tagline,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.line3}`,
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.state,
    postalCode: site.contact.address.postalCode,
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.contact.phone,
      contactType: "sales",
      email: site.contact.email,
      areaServed: ["IN"],
      availableLanguage: ["en", "ta", "hi"],
    },
  ],
  sameAs: [site.social.linkedin, site.social.youtube, site.social.facebook],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`no-js ${inter.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Scroll reveals start hidden and are un-hidden by an observer.
            Dropping `no-js` before first paint means the reveals arm only
            when scripting is actually available — with JS off the class
            stays and every section renders visible.

            The timer is the other half of that guarantee. "Scripting is
            available" and "our bundle actually arrived" are different
            claims: a 404 on a chunk, a CDN blip or a blocking extension
            leaves inline script running and the observer never mounting, and
            every reveal on the page then stays at opacity 0 forever. So the
            class is put BACK unless RevealObserver has stamped the document
            within 2.5s, and the page degrades to plain visible content. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.remove('no-js');" +
              "setTimeout(function(){if(!d.hasAttribute('data-reveal-armed'))" +
              "d.classList.add('no-js')},2500)",
          }}
        />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
