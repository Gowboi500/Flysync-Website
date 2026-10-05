"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/lib/pages";
import { site } from "@/lib/site";

/**
 * FAQ accordion.
 *
 * Behaviour, deliberately:
 *  - every item starts collapsed (`open` is null), so the section reads as a
 *    scannable list of questions rather than one pre-expanded answer;
 *  - one item open at a time — opening another closes the current one;
 *  - the trigger is a real <button> inside the heading, so it is reachable by
 *    Tab, toggles on Enter/Space for free, and exposes aria-expanded plus
 *    aria-controls to screen readers.
 *
 * The panel animates with grid-template-rows rather than mounting/unmounting,
 * which keeps every answer in the HTML for search engines.
 */
export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="section relative">
      <div className="container-page relative">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          body="Straight answers on response times, customisation, integrations and getting started."
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-2.5">
          {faqs.map((f) => {
            const isOpen = open === f.q;
            const panelId = `faq-panel-${f.q.slice(0, 24).replace(/\W+/g, "-")}`;
            return (
              <div
                key={f.q}
                className={[
                  "overflow-hidden rounded-card border transition-colors duration-[250ms]",
                  isOpen
                    ? "border-accent/45 bg-surface"
                    : "border-accent/30 bg-canvas-alt hover:border-accent/45",
                ].join(" ")}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="flex-1 text-[0.9375rem] font-medium leading-snug text-fg sm:text-base">
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={[
                        "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-[250ms]",
                        isOpen
                          ? "rotate-180 border-accent/40 bg-accent-soft text-accent"
                          : "border-accent/30 text-accent",
                      ].join(" ")}
                    >
                      <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-[var(--duration-base)] ease-[cubic-bezier(0.65,0,0.35,1)]",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[0.9375rem] leading-relaxed text-fg-muted sm:px-6 sm:pb-6 sm:pr-14">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 rounded-card border border-accent/30 bg-canvas-alt px-6 py-7 text-center">
            <p className="text-[0.9375rem] text-fg-muted">
              Still have a question about your specific setup?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/demo" className="btn btn-primary">
                Book a free demo
              </Link>
              <a href={site.contact.emailHref} className="btn btn-secondary">
                Email {site.contact.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
