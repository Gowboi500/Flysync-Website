import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, FeatureGrid, PageHero } from "@/components/ui/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { CareersOpenings } from "@/components/sections/CareersOpenings";
import { ResumeUploadButton } from "@/components/sections/ResumeUploadButton";
import { careers } from "@/lib/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team shaping travel technology. Flysync is hiring across engineering, design, marketing, business development and customer success in Chennai.",
  alternates: { canonical: "/careers" },
};

const careersPhone = "+91 9600731771";
const careersPhoneHref = "tel:+919600731771";

const careerContactItems = [
  {
    label: "Email",
    value: site.contact.email,
    href: site.contact.emailHref,
    icon: Mail,
  },
  {
    label: "Phone",
    value: careersPhone,
    href: careersPhoneHref,
    icon: Phone,
  },
  {
    label: "Location",
    value: `${site.contact.address.city}, ${site.contact.address.state}`,
    href: "/contact",
    icon: MapPin,
  },
  {
    label: "Hours",
    value: site.contact.hours,
    href: undefined,
    icon: Clock3,
  },
] as const;

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
          <ResumeUploadButton className="btn btn-secondary btn-lg">
            Upload Resume
          </ResumeUploadButton>
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

        <section className="section pt-0">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Contact info</p>
              <h2 className="mt-5 text-[length:var(--text-h2)] font-bold leading-[1.04] tracking-[-0.028em] text-fg">
                Questions about careers?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-[0.9375rem] leading-[1.65] text-fg-muted sm:text-base">
                Reach our team for applications, openings, and hiring conversations.
              </p>
            </div>

            <div className="mt-[var(--heading-gap)] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {careerContactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="career-icon-shape grid h-10 w-10 place-items-center rounded-control border">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <span className="mt-5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      {item.label}
                    </span>
                    <span className="mt-2 text-[0.9375rem] font-semibold leading-relaxed text-fg">
                      {item.value}
                    </span>
                  </>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="surface card-hover flex h-full flex-col p-6"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="surface flex h-full flex-col p-6">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTABanner heading={careers.talent.heading} body={careers.talent.body}>
          <ResumeUploadButton className="btn btn-primary btn-lg" />
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
