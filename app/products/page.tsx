import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, PageHero } from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { cardTint, iconTint } from "@/components/ui/iconTints";
import { StaggerItem } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { productPages, productsOverview } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: productsOverview.body,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        {/* Same calm ambient the homepage carries below its hero. */}
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          eyebrow={productsOverview.eyebrow}
          headline={productsOverview.heading}
          sub={productsOverview.body}
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Request a Demo
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact Us
          </Link>
        </PageHero>

        <section className="section pt-10 sm:pt-12">
          <div className="container-page">
            <SpotlightGroup className="reveal-group grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {productPages.map((p, i) => (
                <StaggerItem key={p.slug} index={i}>
                  <Link
                    href={`/products/${p.slug}`}
                    data-spotlight
                    className={`surface card-hover ${cardTint(i)} group flex h-full flex-col rounded-card p-6`}
                  >
                    <span className={`grad-badge ${iconTint(i)} grid h-11 w-11 place-items-center rounded-control border`}>
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>

                    <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-fg">
                      {p.name}
                      {p.subtitle && (
                        <span className="font-normal text-fg-subtle">
                          {" "}
                          ({p.subtitle})
                        </span>
                      )}
                    </h2>
                    <p className="mt-1.5 text-[0.9375rem] font-medium text-fg-muted">
                      {p.card.headline}
                    </p>
                    <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-fg-muted">
                      {p.card.body}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Try Now
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
                        strokeWidth={2.25}
                      />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </SpotlightGroup>
          </div>
        </section>

        <CTABanner
          heading={productsOverview.cta.heading}
          body={productsOverview.cta.body}
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Get Started Today
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact Us
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
