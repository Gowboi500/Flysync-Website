import {
  Building2,
  Database,
  Globe,
  Layers,
  Plane,
  ShoppingBag,
  Store,
  UserRound,
} from "lucide-react";
import { Reveal, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/lib/pages";

/* ------------------------------------------------------------------ */
/* Connector band                                                      */
/* ------------------------------------------------------------------ */

/**
 * Arc length of a cubic Bézier, in viewBox units.
 *
 * `stroke-dasharray` is measured along the path in user units, so the draw
 * and the running dash both need to know how long each arc actually is.
 *
 * 64 chords is well past the point where more makes any visible difference
 * for curves this gentle, and this runs once at build time: the section is a
 * server component, so nothing here reaches the browser.
 */
function cubicLength(
  p: readonly [number, number][],
  steps = 64,
): number {
  const at = (t: number) => {
    const u = 1 - t;
    return [
      u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
    ] as const;
  };

  let len = 0;
  let prev = at(0);
  for (let i = 1; i <= steps; i++) {
    const cur = at(i / steps);
    len += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    prev = cur;
  }
  return Math.round(len * 10) / 10;
}

/**
 * Flight paths: they draw once on scroll, then keep running.
 *
 * The arcs are deliberately not straight: each route leaves its supplier
 * vertically, bows a little toward the centre line, and arrives vertically
 * at the platform — the shape a route draws on a flight map, not a wiring
 * diagram.
 *
 * The draw is a pure CSS transition released by `is-in`. No rAF loop, no
 * per-frame React state, and this whole file stays a server component.
 * Each arc publishes its own measured length as `--dash-len`, so the draw
 * and the running dash are exact on every route.
 *
 * Once drawn, the routes keep running: each carries a travelling dash that
 * loops for as long as the band is on screen — see the `.flow-dash` note in
 * globals.css for why it is a dash and not a circle on animateMotion.
 *
 * The viewBox is authored at the band's real desktop size rather than a
 * convenient 0–100 square, and there is deliberately no
 * `vector-effect: non-scaling-stroke`. Both follow from the same constraint:
 * non-scaling-stroke moves the dash pattern into SCREEN space, so a dash
 * measured along the path in user units tiles across the band and every arc
 * comes out chopped into pieces. Without it the dash is measured on the path
 * where it belongs — and a 1:1 viewBox keeps the stroke from being distorted
 * by `preserveAspectRatio="none"` on the way there.
 */
const BAND_W = 896;
const BAND_H = 96;
function Connector({
  mode,
  count = 4,
  baseDelay = 0,
  step = 90,
  duration = 550,
  flowFrom = 0,
}: {
  mode: "converge" | "diverge";
  count?: number;
  /** ms after the diagram is triggered before this band starts drawing. */
  baseDelay?: number;
  /** ms between adjacent routes. */
  step?: number;
  duration?: number;
  /** ms before the first route starts its running dash. */
  flowFrom?: number;
}) {
  const cols = Array.from(
    { length: count },
    (_, i) => ((i + 0.5) / count) * BAND_W,
  );
  const mid = BAND_W / 2;

  return (
    <div className="relative h-20 w-full sm:h-24" aria-hidden="true">
      <svg
        viewBox={`0 0 ${BAND_W} ${BAND_H}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id={`route-${mode}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#16b9ff" />
            <stop offset="0.48" stopColor="#5d5df6" />
            <stop offset="1" stopColor="#ea4aab" />
          </linearGradient>
        </defs>
        {cols.map((x, i) => {
          // A symmetric S: leaves the node vertically, crosses the middle on
          // the diagonal, arrives vertically. The control points sit at 36%
          // and 64% of the band's height — held that far apart because
          // bunching them collapses the middle third into a flat sweep
          // instead of an arc.
          const c1 = BAND_H * 0.36;
          const c2 = BAND_H * 0.64;
          const pts: readonly [number, number][] =
            mode === "converge"
              ? [
                  [x, 0],
                  [x, c1],
                  [mid, c2],
                  [mid, BAND_H],
                ]
              : [
                  [mid, 0],
                  [mid, c1],
                  [x, c2],
                  [x, BAND_H],
                ];
          const d = `M${pts[0][0]} ${pts[0][1]}C${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]} ${pts[3][0]} ${pts[3][1]}`;
          const len = cubicLength(pts);

          return (
            <g key={i} style={{ ["--dash-len"]: len } as React.CSSProperties}>
              <path
                className="draw-line"
                d={d}
                stroke={`url(#route-${mode})`}
                strokeOpacity="0.58"
                strokeWidth="1.6"
                strokeLinecap="round"
                style={
                  {
                    ["--draw-delay"]: `${baseDelay + i * step}ms`,
                    ["--draw-dur"]: `${duration}ms`,
                  } as React.CSSProperties
                }
              />
              {/* 780ms apart across four routes on a 3.2s loop: the traffic
                  never marches in step, and never all arrives at once. */}
              <path
                className="flow-dash"
                d={d}
                stroke={`url(#route-${mode})`}
                strokeWidth="3"
                strokeLinecap="round"
                style={
                  {
                    ["--flow-delay"]: `${flowFrom + i * 780}ms`,
                  } as React.CSSProperties
                }
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier nodes                                                          */
/* ------------------------------------------------------------------ */

function Node({
  icon: Icon,
  label,
  sub,
  tone,
}: {
  icon: typeof Plane;
  label: string;
  sub: string;
  tone: "cyan" | "violet" | "pink" | "amber";
}) {
  return (
    <div className={`arch-node arch-node--${tone} flex h-full flex-col items-center gap-2 px-2 py-4 text-center sm:px-3 sm:py-5`}>
      <span className="arch-node__badge grid h-9 w-9 place-items-center rounded-control">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="text-[0.75rem] font-semibold leading-tight text-fg sm:text-[0.8125rem]">
        {label}
      </span>
      <span className="text-[0.625rem] leading-tight text-fg-subtle sm:text-[0.6875rem]">
        {sub}
      </span>
    </div>
  );
}

const SUPPLIERS = [
  { icon: Globe, label: "GDS", sub: "Amadeus · Travelport · Sabre" },
  { icon: Plane, label: "Airlines", sub: "LCC direct connects" },
  { icon: Database, label: "Consolidators", sub: "Multi-supplier inventory" },
  { icon: Building2, label: "Hotels & Land", sub: "Aggregators · DMCs" },
];

const CHANNELS = [
  { icon: Store, label: "Head Office", sub: "Branches & desks" },
  { icon: Layers, label: "Sub-Agents", sub: "Wallet & credit" },
  { icon: Building2, label: "Corporates", sub: "Policy & approvals" },
  { icon: ShoppingBag, label: "B2C Website", sub: "Your own brand" },
];

const CORE = [
  "Search & pricing engine",
  "Markup rules",
  "Wallet & credit",
  "Ticketing automation",
  "Holiday CRM",
  "Reports & analytics",
];

export function PlatformOverview() {
  return (
    <section id="platform" className="section atmo atmo-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={home.about.eyebrow}
          title={home.about.heading}
          body={home.about.body[0]}
        />

        {/* One `reveal-group` wraps the whole diagram, so a single observer
            trigger sequences all four tiers. The inner tiers are plain divs
            carrying a `--d0` offset — if each were its own reveal-group they
            would fire in scroll order, not story order. */}
        <div className="arch reveal-group mx-auto mt-[var(--heading-gap)] max-w-4xl">
          {/* ---- Tier 1: Supply. Nodes light up in sequence. ---- */}
          <div>
            <p className="mb-4 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Supply
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {SUPPLIERS.map((s, i) => (
                <StaggerItem key={s.label} index={i} className="h-full">
                  <Node {...s} tone={["cyan", "violet", "pink", "amber"][i] as "cyan" | "violet" | "pink" | "amber"} />
                </StaggerItem>
              ))}
            </div>
          </div>

          <Connector mode="converge" baseDelay={200} flowFrom={1100} />

          {/* ---- Tier 2: the platform ----
              The gradient hairline on the top border is the third sanctioned
              gradient use, traded across from the testimonial metric
              treatment (that section no longer exists). */}
          <div className="arch-core arch-core--vivid relative overflow-hidden rounded-card border p-5 text-center sm:p-7">
            <span aria-hidden="true" className="arch-core__aurora" />
            <span className="arch-core__chip chip relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/fs-fav-white.svg"
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain"
              />
              Flysync Platform
            </span>
            <p className="arch-core__copy relative mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed">
              One engine that normalises supply, enforces your commercial
              rules and keeps finance, inventory and reporting in sync.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
              {CORE.map((c) => (
                <li
                  key={c}
                  className="arch-core__tag relative rounded-full px-2.5 py-1 text-[0.6875rem] font-medium sm:text-xs"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <Connector mode="diverge" baseDelay={1000} duration={500} flowFrom={1900} />

          {/* ---- Tier 3: Channels ---- */}
          <div style={{ ["--d0"]: "1250ms" } as React.CSSProperties}>
            <p className="mb-4 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Your channels
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {CHANNELS.map((c, i) => (
                <StaggerItem key={c.label} index={i} className="h-full">
                  <Node {...c} tone={["cyan", "violet", "pink", "amber"][i] as "cyan" | "violet" | "pink" | "amber"} />
                </StaggerItem>
              ))}
            </div>
          </div>

          {/* ---- Tier 4: the traveller ---- */}
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center">
              <span aria-hidden="true" className="arch-traveller-line h-8 w-px" />
              <div className="arch-traveller mt-6 inline-flex items-center gap-3 rounded-full px-5 py-3">
                <span className="arch-traveller__icon grid h-8 w-8 place-items-center rounded-control border">
                  <UserRound className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-fg">
                    The traveller
                  </span>
                  <span className="block text-xs text-fg-subtle">
                    Booked, ticketed and served under your brand
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
