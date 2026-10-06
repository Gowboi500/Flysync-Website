import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, PageHero } from "@/components/ui/Blocks";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read Flysync blogs on travel technology, B2B booking platforms, API integrations, booking operations, and product updates.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          eyebrow="Blogs"
          headline="Travel technology insights from Flysync"
          sub="Practical articles, product notes, and operations guides for travel businesses building better booking, distribution, and agent workflows."
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book a Demo
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Talk to Us
          </Link>
        </PageHero>

        <section className="section pt-0">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">Coming soon</p>
              <h2 className="mt-3 text-[length:var(--text-h3)] font-semibold leading-[1.14] tracking-[-0.03em] text-fg">
                New articles are being prepared
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-fg-muted">
                We are putting together useful reads on travel booking systems,
                API connectivity, CRM workflows, agent management, and digital
                growth for modern travel companies.
              </p>
            </div>
          </div>
        </section>

        <CTABanner
          heading="Want help with your travel technology stack?"
          body="Book a walkthrough and see how Flysync can support your booking, CRM, distribution, and reporting workflows."
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book Free Demo
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact Team
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
