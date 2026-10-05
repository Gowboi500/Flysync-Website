import type { ReactNode } from "react";
import {
  Check,
  CircleCheck,
  Layers3,
  Rocket,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { accentBarTint, cardTint, iconTint } from "@/components/ui/iconTints";

/* ------------------------------------------------------------------ */
/* Page hero — used by every route except the homepage                 */
/* ------------------------------------------------------------------ */

export function PageHero({
  eyebrow,
  headline,
  sub,
  children,
  aside,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  headline: string;
  sub?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden pb-14 sm:pb-16 lg:pb-20 ${className}`}
      style={{ paddingTop: "calc(var(--nav-height) + var(--hero-top, var(--hero-pad-top)))" }}
    >
      {/* The homepage hero signature, applied verbatim. `.hero-wash` was
          built as a token-driven utility for exactly this — the same four
          layers, no values duplicated, no per-page variant.

          These banners are shorter than the homepage hero, so the radials
          (defined in px) crop rather than squash: what shows is a slice of
          the same diagonal, which is what keeps the family resemblance
          without every page looking like the homepage.

          All four are backdrops — absolute, aria-hidden, pointer-none,
          z-index -1 — so they cannot affect layout or hit-testing. */}
      <div aria-hidden="true" className="hero-wash" />
      <div aria-hidden="true" className="texture-grid" />
      <div aria-hidden="true" className="hero-rays" />
      <div aria-hidden="true" className="texture-noise" />

      <div className="container-page relative">
        <div
          className={
            aside
              ? `grid gap-12 lg:grid-cols-[1.05fr_1fr] ${
                  align === "start" ? "items-start" : "items-center"
                }`
              : "mx-auto max-w-3xl text-center"
          }
        >
          <div>
            {eyebrow && (
              <p className="eyebrow rise">
                <span data-flap>{eyebrow}</span>
              </p>
            )}
            <h1
              className="rise mt-5 text-[length:var(--text-h1)] font-bold leading-[1.02] tracking-[-0.032em] text-fg"
              style={{ ["--d" as string]: "0.06s" }}
            >
              {headline}
            </h1>
            {sub && (
              <div
                className={`rise mt-6 text-[0.9375rem] leading-[1.65] text-fg-muted sm:text-base ${
                  aside ? "max-w-xl" : "mx-auto max-w-2xl"
                }`}
                style={{ ["--d" as string]: "0.12s" }}
              >
                {sub}
              </div>
            )}
            {children && (
              <div
                className={`rise mt-8 flex flex-wrap gap-3 ${aside ? "" : "justify-center"}`}
                style={{ ["--d" as string]: "0.18s" }}
              >
                {children}
              </div>
            )}
          </div>

          {/* `rise-lg` was never defined in the stylesheet, so every hero
              aside — the product screenshots included — had no entrance at
              all. Above the fold, so it runs the CSS keyframe on load and
              replays via the observer afterwards. */}
          {aside && (
            <div
              data-replay="shot"
              className="rise-shot"
              style={{ ["--d" as string]: "0.24s" }}
            >
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Card grids                                                          */
/* ------------------------------------------------------------------ */

type Item = { title: string; body?: string; icon?: string };

/** Problem statements — deliberately flatter than the solution cards. */
export function ChallengeGrid({
  heading,
  eyebrow,
  items,
  tint = false,
}: {
  heading: string;
  eyebrow?: string;
  items: Item[];
  /** Type B band. */
  tint?: boolean;
}) {
  return (
    <section className={`section relative ${tint ? "bg-tint" : ""}`}>
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow ?? "The problem"} title={heading} />
        <StaggerGroup className="mt-[var(--heading-gap)] grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((it, i) => (
            <StaggerItem key={it.title} index={i}>
              <article className="h-full rounded-card border border-line bg-surface p-6">
                <span
                  aria-hidden="true"
                  className={`mb-4 block h-1 w-8 rounded-full ${accentBarTint(i)}`}
                />
                <h3 className="text-[0.9375rem] font-semibold text-fg">
                  {it.title}
                </h3>
                {it.body && (
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                    {it.body}
                  </p>
                )}
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/** Capability cards — the standard elevated surface. */
export function FeatureGrid({
  heading,
  eyebrow,
  body,
  items,
  columns = 3,
  compact = false,
  tint = false,
}: {
  heading: string;
  eyebrow?: string;
  body?: string;
  items: Item[];
  columns?: 2 | 3;
  compact?: boolean;
  /** Type B band. One per page, to break a run of base-white sections. */
  tint?: boolean;
}) {
  return (
    <section className={`section relative ${tint ? "bg-tint" : ""}`}>
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={heading} body={body} />
        <SpotlightGroup
          className={`reveal-group mt-[var(--heading-gap)] grid gap-4 sm:grid-cols-2 ${
            compact ? "lg:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {items.map((it, i) => (
            <StaggerItem key={it.title} index={i}>
              <article
                data-spotlight
                className={`card-lux ${cardTint(i)} group h-full ${compact ? "p-6" : "p-8"}`}
              >
                <span className={`mb-4 grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}>
                  <Icon name={it.icon ?? "Check"} className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <h3 className="text-[0.9375rem] font-semibold text-fg">
                  {it.title}
                </h3>
                {it.body && (
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                    {it.body}
                  </p>
                )}
              </article>
            </StaggerItem>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}

/** Tick list — used where the source content is a plain checklist. */
export function CheckList({
  heading,
  eyebrow,
  items,
  columns = 2,
}: {
  heading: string;
  eyebrow?: string;
  items: string[];
  columns?: 2 | 3;
}) {
  return (
    <section className="section relative">
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={heading} />
        <StaggerGroup
          className={`mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 ${
            columns === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {items.map((t, i) => (
            <StaggerItem key={t} index={i}>
              <div className="surface flex h-full items-center gap-3 rounded-control px-4 py-3.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50">
                  <Check className="h-3 w-3 text-emerald-600" strokeWidth={3.5} />
                </span>
                <span className="text-[0.9375rem] font-medium text-fg">{t}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Numbered steps                                                      */
/* ------------------------------------------------------------------ */

const STEP_META = [
  { icon: Layers3, label: "Set up", status: "Foundation ready" },
  { icon: SlidersHorizontal, label: "Configure", status: "Rules in place" },
  { icon: Rocket, label: "Go live", status: "Ready to grow" },
];

const STEP_STYLES = [
  {
    card: "border-line",
    glow: "bg-emerald-100",
    badge: "bg-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
    accent: "text-emerald-600",
    progress: "bg-emerald-600",
  },
  {
    card: "border-line",
    glow: "bg-rose-100",
    badge: "bg-rose-500",
    icon: "bg-rose-50 text-rose-500",
    accent: "text-rose-500",
    progress: "bg-rose-500",
  },
  {
    card: "border-line",
    glow: "bg-amber-100",
    badge: "bg-amber-500",
    icon: "bg-amber-50 text-amber-600",
    accent: "text-amber-600",
    progress: "bg-amber-500",
  },
];

export function Steps({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <section className="section relative">
      <div className="container-page">
        <SectionHeading eyebrow="How it works" title={heading} />
        <StaggerGroup className="mt-[var(--heading-gap)] grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map((step, i) => {
            const { icon: StepIcon, label, status } = STEP_META[i % STEP_META.length];
            const style = STEP_STYLES[i % STEP_STYLES.length];

            return (
              <StaggerItem key={step} index={i}>
                <div className={`surface relative h-full min-h-[12.5rem] overflow-visible rounded-card p-5 sm:p-6 ${style.card}`}>
                  <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/3 rounded-full opacity-70 blur-2xl ${style.glow}`} />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white ${style.badge}`}>
                        0{i + 1}
                      </span>
                      <div>
                        <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                          Step {i + 1}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-fg">{label}</span>
                      </div>
                    </div>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${style.icon}`}>
                      <StepIcon className="h-4.5 w-4.5" strokeWidth={2.25} />
                    </span>
                  </div>

                  <p className="relative mt-6 text-[0.9375rem] leading-relaxed text-fg">
                    {step}
                  </p>

                  <div className="relative mt-6 flex items-center gap-2 border-t border-line pt-4">
                    <CircleCheck className={`h-4 w-4 shrink-0 ${style.accent}`} strokeWidth={2.25} />
                    <span className="text-[0.8125rem] font-medium text-fg-muted">{status}</span>
                    <div className="ml-auto flex gap-1">
                      {STEP_META.map((_, progressIndex) => (
                        <span
                          key={progressIndex}
                          className={`h-1.5 w-4 rounded-full ${progressIndex <= i ? style.progress : "bg-line"}`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Split band — heading + body beside a visual                         */
/* ------------------------------------------------------------------ */

export function SplitBand({
  eyebrow,
  heading,
  body,
  aside,
  reverse = false,
  clip = false,
  stretchAside = false,
}: {
  eyebrow?: string;
  heading: string;
  body: ReactNode;
  aside?: ReactNode;
  reverse?: boolean;
  stretchAside?: boolean;
  /**
   * Give the aside the shared screenshot entrance (fade + rise + slight
   * scale) instead of the sideways slide used for content. For product
   * mockups, so every screenshot on the site enters the same way. Left off
   * for asides that are ordinary content cards.
   */
  clip?: boolean;
}) {
  return (
    <section className="section relative">
      <div className="container-page">
        <div
          className={`grid gap-10 lg:grid-cols-2 lg:gap-16 ${
            stretchAside ? "items-start lg:items-stretch" : "items-start"
          }`}
        >
          <Reveal
            direction={reverse ? "left" : "right"}
            className={reverse ? "lg:order-2" : ""}
          >
            {eyebrow && (
              <p className="eyebrow">
                <span data-flap>{eyebrow}</span>
              </p>
            )}
            <h2 className="mt-4 text-[length:var(--text-h2)] font-bold leading-[1.06] tracking-[-0.028em] text-fg">
              {heading}
            </h2>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted">
              {body}
            </div>
          </Reveal>
          {aside &&
            (clip ? (
              <div
                className={`shot-reveal ${reverse ? "lg:order-1" : ""}`}
                style={{ ["--d" as string]: "0.08s" } as object}
              >
                {aside}
              </div>
            ) : (
              <Reveal
                direction={reverse ? "right" : "left"}
                delay={0.08}
                className={`${reverse ? "lg:order-1" : ""} ${
                  stretchAside ? "lg:h-full" : ""
                }`}
              >
                {aside}
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA banner                                                  */
/* ------------------------------------------------------------------ */

/**
 * The closing CTA is the one bold moment on the page: a CONTAINED gradient
 * panel inset from the page edges, with everything around it white.
 *
 * It used to be a Type C dark anchor — a near-black full-bleed band — which
 * read as a different site's footer rather than as the end of this page's
 * lighting. `.cta-panel` is the whole treatment now: it carries the fill and
 * redefines the colour tokens inside itself, so the heading, body and both
 * buttons adapt without special-casing, exactly as `.on-dark` did.
 *
 * `data-anchor` is GONE with the dark band. It is what ScrollChrome watches
 * to invert the header, and the section behind the header here is now white —
 * leaving the attribute would flip the nav to its dark treatment over a white
 * page. `.on-dark` itself stays in globals.css; it is still the Type C scope,
 * this just is not a Type C section any more.
 */
export function CTABanner({
  heading,
  body,
  children,
}: {
  heading: string;
  body?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate">
      <div className="container-page section relative">
        <div className="cta-panel relative overflow-hidden rounded-[var(--radius-band-lux)] px-6 py-14 text-center sm:px-10 sm:py-16">
          <div className="relative mx-auto max-w-2xl">
            <Reveal>
              <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.04] tracking-[-0.028em] text-fg">
                {heading}
              </h2>
            </Reveal>
            {body && (
              <Reveal delay={0.06}>
                <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                  {body}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.12}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                {children}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
