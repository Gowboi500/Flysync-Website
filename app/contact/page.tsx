import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, PageHero } from "@/components/ui/Blocks";
import { ContactForm } from "@/components/sections/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { cardTint, iconTint } from "@/components/ui/iconTints";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { contact } from "@/lib/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to the Flysync team in Chennai about B2B portals, B2C booking engines, series bookings, corporate travel and Vacay365 CRM.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        {/* Same calm ambient the homepage carries below its hero. */}
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          eyebrow={contact.hero.eyebrow}
          headline={contact.hero.headline}
          sub={contact.hero.body.map((p) => (
            <p key={p} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book a Free Demo
          </Link>
          <a href={site.contact.phoneHref} className="btn btn-secondary btn-lg">
            {site.contact.phone}
          </a>
        </PageHero>

        {/* ---- Quick contact ---- */}
        <section className="pb-4 pt-12 sm:pt-14 lg:pt-16">
          <div className="container-page">
            <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contact.quick.map((c, i) => {
                const inner = (
                  <>
                    <span className={`grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}>
                      <Icon name={c.icon} className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <h2 className="mt-4 text-[0.9375rem] font-semibold text-fg">
                      {c.title}
                    </h2>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-muted">
                      {c.body}
                    </p>
                    <p className="mt-2 text-[0.9375rem] font-medium text-accent">
                      {c.value}
                    </p>
                  </>
                );
                return (
                  <StaggerItem key={c.title} index={i}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className={`surface card-hover ${cardTint(i)} block h-full rounded-card p-6`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={`surface ${cardTint(i)} h-full rounded-card p-6`}>{inner}</div>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </section>

        {/* ---- Form ---- */}
        <section id="consultation-form" className="section">
          <div className="container-page">
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* ---- Office ---- */}
        <section className="section pt-0">
          <div className="container-page">
            <Reveal>
              <div className="surface grid gap-8 rounded-card p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-[length:var(--text-h4)] font-semibold tracking-[-0.028em] text-fg">
                    {contact.office.heading}
                  </h2>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">
                    {contact.office.body}
                  </p>
                  <address className="mt-6 not-italic leading-relaxed text-fg">
                    {contact.office.lines.map((l) => (
                      <span key={l} className="block text-[0.9375rem]">
                        {l}
                      </span>
                    ))}
                  </address>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    <a
                      href={contact.office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Get Directions
                    </a>
                    <a href="#main" className="btn btn-secondary">
                      Contact Team
                    </a>
                  </div>
                </div>

                <div className="overflow-hidden rounded-card border border-line">
                  <iframe
                    title="Flysync Technologies Private Limited office location, Chitlapakkam, Chennai"
                    src="https://www.google.com/maps?q=3rd+floor+Sri+Sakthi+Towers+Babu+St+junction+Balaji+Ave+Chitlapakkam+Main+Rd+Chitlapakkam+Tambaram+Tamil+Nadu+600073+India&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full lg:h-80"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <CTABanner heading={contact.cta.heading} body={contact.cta.body}>
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book a Free Demo
          </Link>
          <a href={site.contact.phoneHref} className="btn btn-secondary btn-lg">
            Contact Our Team
          </a>
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
