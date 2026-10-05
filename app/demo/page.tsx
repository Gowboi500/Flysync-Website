import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { PageHero } from "@/components/ui/Blocks";
import { DemoForm } from "@/components/sections/DemoForm";
import { Reveal } from "@/components/ui/Reveal";
import { demo } from "@/lib/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Book a personalised walkthrough of the Flysync travel technology platform. Our Chennai team responds within one business day.",
  alternates: { canonical: "/demo" },
};

const assurances = [
  "A walkthrough tailored to how you operate today",
  "Pricing shared on the call",
  "No credit card, no commitment",
  "Answered by a product specialist, not a bot",
];

export default function DemoPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        {/* Same calm ambient the homepage carries below its hero. */}
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          eyebrow="Book a demo"
          headline={demo.heading}
          sub={demo.sub}
          aside={<DemoForm />}
          align="start"
        >
          <ul className="grid gap-2.5">
            {assurances.map((a) => (
              <li key={a} className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                  <Check className="h-3 w-3 text-accent" strokeWidth={3.5} />
                </span>
                <span className="text-[0.9375rem] text-fg-muted">{a}</span>
              </li>
            ))}
          </ul>
        </PageHero>

        <section className="pb-20">
          <div className="container-page">
            <Reveal>
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-line pt-8 text-[0.875rem] text-fg-muted">
                <span>
                  Prefer to talk?{" "}
                  <a
                    href={site.contact.phoneHref}
                    className="font-semibold text-accent hover:text-accent-hover"
                  >
                    {site.contact.phone}
                  </a>
                </span>
                <span>
                  Or email{" "}
                  <a
                    href={site.contact.emailHref}
                    className="font-semibold text-accent hover:text-accent-hover"
                  >
                    {site.contact.email}
                  </a>
                </span>
                <span className="text-fg-subtle">{site.contact.hours}</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <RevealObserver />
      <ScrollChrome />
    </>
  );
}
