import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner } from "@/components/ui/Blocks";

import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { ApiConnectivity } from "@/components/sections/ApiConnectivity";
import { PlatformOverview } from "@/components/sections/PlatformOverview";
import { Solutions } from "@/components/sections/Solutions";
import { Benefits } from "@/components/sections/Benefits";
import { Showcase } from "@/components/sections/Showcase";
import { CustomerSuccess } from "@/components/sections/CustomerSuccess";
import { CustomerReview } from "@/components/sections/CustomerReview";
import { FAQ } from "@/components/sections/FAQ";
import { TrustStrip } from "@/components/sections/TrustStrip";

import { faqs } from "@/lib/pages";
import { home } from "@/lib/pages";
import { productPages } from "@/lib/products";
import { site } from "@/lib/site";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: `${site.name} Travel Technology Platform`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: site.description,
  url: site.url,
  provider: { "@type": "Organization", name: site.legalName, url: site.url },
  featureList: productPages.map((p) => p.name),
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    description:
      "Monthly platform subscription. Pricing shared during the free demo.",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Header />

      <main id="main" className="relative isolate">
        {/* Below the hero the page stays calm: the same two sources at a
            fraction of the strength, so the signature reads as a deliberate
            opening rather than as wallpaper. Backdrop only — absolutely
            positioned, aria-hidden, negative z-index.

            The page-wide `texture-grid` that used to sit here is GONE. The
            grid belongs to the hero: down the page it was drawing lines
            across the clients strip and every tinted section under it,
            which is the noise-over-colour problem the hero's own grid was
            already moved beneath the light to solve. Each section now
            carries its own atmosphere instead — see the .atmo-* tokens. */}
        <div aria-hidden="true" className="ambient-wash" />

        <Hero />
        <TrustedBy />
        <ApiConnectivity />
        <PlatformOverview />
        <Solutions />
        <Benefits />
        <Showcase />
        <CustomerSuccess />
        <CustomerReview />
        <FAQ />
        <TrustStrip />

        <CTABanner
          heading={home.finalCta.heading}
          body={home.finalCta.body}
        >
          <Link href="/demo" className="btn btn-primary btn-lg group">
            {home.finalCta.primary}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
              strokeWidth={2.25}
            />
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            {home.finalCta.secondary}
          </Link>
        </CTABanner>
      </main>

      <Footer />
      <StickyCTA />
      <BackToTop />
      <RevealObserver />
      <ScrollChrome />
    </>
  );
}
