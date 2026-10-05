import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  MapPin,
  MessageCircle,
  Plane,
  Plug,
  Ticket,
  Users,
} from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { home } from "@/lib/pages";

/**
 * The hero carries the site's one signature moment: a continuous
 * purple-to-pink wash, strongest along the bottom edge, resolving to near
 * white under the nav. That treatment is `.hero-wash` — a token-driven
 * utility, not styling local to this file, so the same banner can be put on
 * every other route later without touching a value.
 *
 * Layout is asymmetric on purpose: 45/55, copy left, composition right, and
 * NOT vertically centred. Centring everything is what makes a landing page
 * read as a template.
 *
 * The entrance runs on CSS, not JS, so the headline paints on the first
 * frame: LCP does not wait for hydration, and the hero reads with
 * JavaScript disabled.
 */
const d = (seconds: number) => ({ ["--d" as string]: `${seconds}s` });

/**
 * The headline is the content pack's, split around its one italic-serif
 * word. Only that word takes the gradient — a whole sentence in gradient is
 * the single fastest way to look like a template.
 */
const [before, after] = home.hero.headline.split(home.hero.flourish);

/**
 * Capability chips orbiting the dashboard. Deliberately GENERIC icons, not
 * partner logos: the platform's real named suppliers live in TrustedBy, and
 * inventing branded integration marks here would be a claim the site does
 * not otherwise make. `fd` staggers the float so they never move in unison.
 *
 * POSITIONING RULE, and it is the whole reason these classes look the way
 * they do: a chip may overlap the panel's EDGE, never its data. They are
 * anchored to the panel box itself (`right-full` / `left-full` /
 * `bottom-full` / `top-full` + a negative margin), not to the column, so
 * the overlap is a fixed number of pixels at every width instead of
 * whatever the gutter happens to be.
 *
 * Which edge each one gets is decided by what is under it:
 *   left   the mock's own sidebar — chrome, not data, so 16px of overlap
 *          is free. Flights, Hotels, Payments.
 *   top    the mock's title bar. Bookings.
 *   right  KPI cards start immediately inside the panel edge, so only a
 *          short chip fits in the 14px of border it can safely cover, and
 *          only one is short enough. CRM.
 *   below  the two long labels that used to sit ON the bookings table and
 *          the KPI row. Supplier APIs, WhatsApp — clear of the panel now.
 */
const CHIPS = [
  { icon: Plane, label: "Flights", cls: "-left-7 top-[9%]", fd: "0s", tone: "text-sky-500" },
  { icon: Building2, label: "Hotels", cls: "-left-7 top-[45%]", fd: "1.2s", alt: true, tone: "text-violet-500" },
  { icon: CreditCard, label: "Payments", cls: "-left-7 top-[78%]", fd: "2.4s", tone: "text-emerald-500" },
  { icon: Users, label: "CRM", cls: "-right-7 top-[17%]", fd: "0.6s", alt: true, tone: "text-rose-500" },
  { icon: Ticket, label: "Bookings", cls: "bottom-full -mb-3.5 right-[34%]", fd: "2.1s", tone: "text-indigo-500" },
  { icon: Plug, label: "Supplier APIs", cls: "top-full mt-3 left-[24%]", fd: "1.8s", tone: "text-cyan-500" },
  { icon: MessageCircle, label: "WhatsApp", cls: "top-full mt-3 right-[12%]", fd: "3s", alt: true, tone: "text-green-500" },
];

const BENEFITS = [
  "No credit card required",
  "Live in 2–3 weeks",
  "30-minute walkthrough",
];

export function Hero() {
  return (
    <section
      id="top"
      // pb down from 24/28/32: at 128px the hero's bottom padding plus the
      // clients strip's 96px top made a 249px seam, the widest on the page.
      // 96px still clears the two chips that hang below the panel.
      className="relative isolate overflow-hidden pb-16 sm:pb-20 lg:pb-24"
      style={{
        paddingTop: "calc(var(--nav-height) + var(--hero-pad-top))",
        minHeight: "var(--hero-min-h)",
      }}
    >
      {/* The signature, in five layers. All are backdrops: absolutely
          positioned, aria-hidden, pointer-transparent, negative z-index.
          They can never affect layout or hit-testing. Order here is DOM
          order; the z-index each one carries is in globals.css. */}
      <div aria-hidden="true" className="texture-grid" />
      <div aria-hidden="true" className="hero-wash" />
      <div aria-hidden="true" className="hero-rays-left" />
      <div aria-hidden="true" className="hero-rays" />
      <div aria-hidden="true" className="texture-noise" />

      <div className="container-page relative">
        <div className="grid items-start gap-14 lg:grid-cols-[46fr_54fr] lg:gap-12 xl:grid-cols-[45fr_55fr] xl:gap-14">
          {/* ---------------- Left: the argument ---------------- */}
          <div className="max-w-[43.5rem] lg:pt-6">
            <div data-replay className="rise" style={d(0)}>
              <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8125rem] text-fg-body">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                <span className="font-medium text-fg">Travel technology company</span>
              </span>
            </div>

            {/* The LCP element. Not animated and not gradient-clipped as a
                whole, so it paints on the first frame and counts as the
                largest paint; only the flourish word is clipped. */}
            <h1
              data-replay
              className="mt-7 text-[clamp(3.25rem,4.8vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-fg"
            >
              {before}
              <em className="grad-text font-serif font-normal not-italic italic tracking-[-0.01em]">
                {home.hero.flourish}
              </em>
              {after}
            </h1>

            <p
              data-replay
              className="rise mt-7 max-w-[620px] text-[clamp(1rem,1.3vw,1.12rem)] leading-[1.6] text-fg-muted"
              style={d(0.06)}
            >
              {home.hero.sub}
            </p>

            <div
              data-replay
              className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={d(0.12)}
            >
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href="/demo"
                  // Stable hook for the visual regression harness.
                  data-hero-cta
                  className="btn btn-primary btn-lux group w-full"
                >
                  {home.hero.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
                    strokeWidth={2.25}
                  />
                </Link>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href="/products"
                  className="hero-explore-cta btn btn-secondary btn-lux w-full"
                >
                  Explore the platform
                </Link>
              </Magnetic>
            </div>

            {/* Same three proof points the line below the buttons always
                carried — now a list, so each one can be read on its own. */}
            <ul
              data-replay
              className="rise mt-8 flex flex-wrap gap-x-6 gap-y-2.5"
              style={d(0.18)}
            >
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  // fg-muted, not fg-subtle: this list sits low in the hero
                  // where the pink wash is strongest, and #676d79 measured
                  // 4.24–4.49:1 there — under the floor. #5a5f6a is 5.6:1
                  // against the same pixels.
                  className="flex items-center gap-2 text-[length:var(--text-small)] text-fg-muted"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-accent/60"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Right: the composition ---------------- */}
          <div
            data-replay="shot"
            className="rise-shot relative lg:pt-2"
            style={d(0.24)}
          >
            {/* This box IS the panel box, and it is what the chips anchor
                to. Previously they were positioned against the COLUMN,
                whose edges sit `mx-9` outside the panel — which is why a
                chip at `-right-5` landed 68px inside the panel, on top of
                the KPI cards, instead of beside it. */}
            <div className="relative mx-1 sm:mx-4 lg:-ml-4 lg:mr-4 xl:-ml-6 xl:mr-6">
              {/* Three-layer glow behind the panel, so the glass has
                  something to catch and the panel reads as lit from
                  behind. Sits under the panel, over the wash. */}
              <div aria-hidden="true" className="dashboard-glow" />

              <div className="glass-panel relative overflow-hidden rounded-[var(--radius-card-lux)] p-1.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.125rem]">
                  <Image
                    src="/images/admin-dashboard-series-logo-lg.jpg"
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1280px) 730px, (min-width: 1024px) 54vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              {/* Capability chips. Desktop only: below `lg` the composition
                  is full-width, there is no gutter for them to float in, and
                  they end up sitting on the dashboard's own chrome rather
                  than around it. The panel stands alone at those sizes. */}
              <div aria-hidden="true" className="hidden lg:block">
                {CHIPS.map(({ icon: Icon, label, cls, fd, alt, tone }) => (
                  <span
                    key={label}
                    style={{ ["--fd" as string]: fd }}
                    className={`glass-chip lux-float ${alt ? "lux-float-alt" : ""} absolute z-10 flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.75rem] font-medium text-fg-body ${cls}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${tone}`} strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
