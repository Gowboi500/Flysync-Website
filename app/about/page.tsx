import type { Metadata } from "next";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import {
  CTABanner,
  CheckList,
  FeatureGrid,
  SplitBand,
} from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { cardTint, iconTint } from "@/components/ui/iconTints";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/lib/pages";

export const metadata: Metadata = {
  title: "About Us",
  description: about.hero.sub,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate pt-8 sm:pt-10 lg:pt-12">
        {/* Same calm ambient the homepage carries below its hero. */}
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />

        <SplitBand
          eyebrow="Our story"
          heading={about.story.heading}
          body={about.story.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          aside={
            <div className="grid h-full gap-4 lg:grid-rows-2">
              {about.missionVision.map((m, i) => (
                <article key={m.title} className="surface rounded-card p-8">
                  <span className={`grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}>
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-fg">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                    {m.body}
                  </p>
                </article>
              ))}
            </div>
          }
          reverse
          stretchAside
        />

        <FeatureGrid
          eyebrow="What we do"
          heading={about.whatWeDo.heading}
          body={about.whatWeDo.body}
          items={about.whatWeDo.items}
        />

        <CheckList
          eyebrow="Why Flysync"
          heading={about.whyChoose.heading}
          items={[...about.whyChoose.items]}
          columns={3}
        />

        {/* ---- Leadership ---- */}
        <section className="section relative">
          <div className="container-page">
            <SectionHeading eyebrow="Leadership" title={about.leadership.heading} />
            <Reveal>
              <div className="surface mx-auto mt-14 max-w-4xl rounded-card p-8 sm:p-10">
                <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="flex items-center gap-4 sm:block">
                    <span className="block h-24 w-24 shrink-0 overflow-hidden rounded-card sm:h-28 sm:w-28">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/people/arun-founder-professional.png"
                        alt={about.leadership.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <div className="sm:mt-4">
                      <p className="text-lg font-semibold text-fg">
                        {about.leadership.name}
                      </p>
                      <p className="text-sm text-fg-subtle">
                        {about.leadership.role}
                      </p>
                    </div>
                  </div>

                  <div>
                    {about.leadership.body.map((p) => (
                      <p
                        key={p}
                        className="mb-4 text-[0.9375rem] leading-relaxed text-fg-muted"
                      >
                        {p}
                      </p>
                    ))}
                    <blockquote className="mt-6 rounded-card border border-accent/35 bg-accent-soft p-5">
                      <Quote
                        className="h-5 w-5 text-accent/50"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-[0.9375rem] italic leading-relaxed text-fg">
                        {about.leadership.quote}
                      </p>
                      <footer className="mt-3 text-[0.8125rem] font-medium text-fg-subtle">
                        — {about.leadership.name}, {about.leadership.role}
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Core values ---- */}
        <section className="section relative">
          <div className="container-page">
            <SectionHeading eyebrow="Core values" title={about.values.heading} />
            <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.items.map((v, i) => (
                <StaggerItem key={v.title} index={i}>
                  <article className={`surface ${cardTint(i)} group h-full rounded-card p-6`}>
                    <span className={`grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}>
                      <Icon name={v.icon} className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-fg">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                      {v.body}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        <CTABanner heading={about.cta.heading} body={about.cta.body}>
          <Link href="/demo" className="btn btn-primary btn-lg">
            Request a Demo
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
