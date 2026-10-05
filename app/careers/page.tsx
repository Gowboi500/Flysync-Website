import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, FeatureGrid, PageHero } from "@/components/ui/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { CareersOpenings } from "@/components/sections/CareersOpenings";
import { careers } from "@/lib/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team shaping travel technology. Flysync is hiring across engineering, design, marketing, business development and customer success in Chennai.",
  alternates: { canonical: "/careers" },
};

const applyHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
  "Application — Flysync Talent Network",
)}&body=${encodeURIComponent(
  "Hi Flysync team,\n\nI'd like to be considered for opportunities at Flysync.\n\nRole of interest:\nYears of experience:\nLinkedIn / portfolio:\n\n(Please attach your resume to this email.)\n\nThank you.",
)}`;

export default function CareersPage() {
  return (
    <>
      <Header />
      <main id="main" className="career-system relative isolate">
        {/* Same calm ambient the homepage carries below its hero. */}
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          className="career-hero"
          eyebrow="Careers"
          headline={careers.hero.headline}
          sub={
            <>
              {careers.hero.body.map((p) => (
                <p key={p} className="mb-4 last:mb-0">
                  {p}
                </p>
              ))}
              <p className="mt-5 font-semibold text-fg">{careers.hero.kicker}</p>
            </>
          }
        >
          <a href="#openings" className="btn btn-primary btn-lg">
            View Open Positions
          </a>
          <a href={applyHref} className="btn btn-secondary btn-lg">
            Submit Resume
          </a>
        </PageHero>

        <FeatureGrid
          eyebrow="Why join us"
          heading={careers.why.heading}
          items={careers.why.items}
          columns={2}
          compact
        />

        {/* ---- Life at Flysync ---- */}
        <section className="section pt-0">
          <div className="container-page">
            <Reveal>
              <div className="career-life-panel relative overflow-hidden rounded-card border border-line px-6 py-14 text-center sm:px-12 sm:py-16">
                <h2 className="mx-auto max-w-2xl text-[length:var(--text-h3)] font-semibold leading-[1.14] tracking-[-0.03em] text-fg">
                  {careers.life.heading}
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-fg-muted">
                  {careers.life.body}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <CareersOpenings
          roles={careers.openings.roles}
          email={site.contact.email}
          note={careers.openings.note}
        />

        <CTABanner heading={careers.talent.heading} body={careers.talent.body}>
          <a href={applyHref} className="btn btn-primary btn-lg">
            Upload Resume
          </a>
          <Link href="/about" className="btn btn-secondary btn-lg">
            Learn about Flysync
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
