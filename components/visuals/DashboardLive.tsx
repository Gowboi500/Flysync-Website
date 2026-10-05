"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  LayoutDashboard,
  Plane,
  Receipt,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { LiveNumber, useLive } from "./LiveMock";
import lockup from "@/public/brand/flysync-logo.png";

/**
 * The three pieces of the operations dashboard that need JavaScript to feel
 * alive. Everything else in the mock stays server-rendered and animates from
 * CSS keyed off `[data-live]`.
 *
 * All of it hangs off the single LiveMock observer wrapping the dashboard —
 * none of these components watch the viewport themselves.
 */

/* ------------------------------------------------------------------ */
/* The product's own logo, inside the product                          */
/* ------------------------------------------------------------------ */

/**
 * The real Flysync lockup, used wherever a mockup shows the app's own
 * chrome. Previously an "F" in a blue rounded square, which was a
 * placeholder and not the brand mark.
 */
export function ScreenLogo({ className = "h-4" }: { className?: string }) {
  return (
    <Image
      src={lockup}
      alt=""
      aria-hidden="true"
      sizes="120px"
      className={`w-auto shrink-0 ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* KPI tiles                                                           */
/* ------------------------------------------------------------------ */

/**
 * Values are declared as numbers plus formatting props rather than as the
 * final strings: a count-up has to interpolate the number and reapply the
 * formatting every frame — "₹94.2L" cannot be counted, 94.2 can.
 */
const KPIS = [
  {
    label: "Bookings today",
    value: 1284,
    group: true,
    delta: "+12.4%",
    up: true,
    // The only KPI that drifts. One moving number reads as a live feed;
    // four moving numbers read as a screensaver.
    tickEvery: 6,
  },
  { label: "Gross sales", value: 94.2, prefix: "₹", decimals: 1, suffix: "L", delta: "+8.1%", up: true },
  { label: "Net margin", value: 7.86, prefix: "₹", decimals: 2, suffix: "L", delta: "+18.3%", up: true },
  { label: "Cancellations", value: 23, delta: "−4.2%", up: false },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="sc-card rounded-md p-2.5">
          <p className="truncate text-[0.5625rem] text-fg-subtle">{k.label}</p>
          <p className="mt-1 text-[0.9375rem] font-semibold tracking-tight text-fg">
            <LiveNumber
              value={k.value}
              decimals={k.decimals}
              prefix={k.prefix}
              suffix={k.suffix}
              group={k.group}
              tickEvery={k.tickEvery}
            />
          </p>
          <p
            className={[
              "mt-0.5 flex items-center gap-0.5 text-[0.5625rem] font-medium",
              k.up ? "sc-pos" : "sc-neg",
            ].join(" ")}
          >
            {k.up ? (
              <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={2.5} />
            ) : (
              <ArrowDownRight className="h-2.5 w-2.5" strokeWidth={2.5} />
            )}
            {k.delta}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar — the highlight moves, as if someone were navigating        */
/* ------------------------------------------------------------------ */

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Plane, label: "Bookings" },
  { icon: Users, label: "Sub-Agents" },
  { icon: CalendarRange, label: "Series" },
  { icon: Wallet, label: "Wallet" },
  { icon: Receipt, label: "Holidays" },
  { icon: Settings, label: "Settings" },
];

/** Where the highlight wanders. Never further than two rows at a time. */
const WALK = [0, 1, 0, 2, 0];

export function Sidebar() {
  const { loops } = useLive();
  const [step, setStep] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const active = WALK[step % WALK.length];

  useEffect(() => {
    if (!loops) return;
    const id = setInterval(() => setStep((n) => n + 1), 7000);
    return () => clearInterval(id);
  }, [loops]);

  // The indicator is one element that slides, rather than a background that
  // fades on each item — a single object moving reads as navigation, whereas
  // crossfading backgrounds reads as two things blinking. Offsets are
  // measured because the mock is scaled by FitScreen, so no row height can
  // be assumed.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (item) setOffset(item.offsetTop);
  }, [active]);

  return (
    <aside className="sc-divide hidden w-[8.5rem] shrink-0 flex-col gap-0.5 border-r p-2.5 sm:flex lg:w-[9.5rem]">
      <div className="mb-3 flex items-center gap-1.5 px-1.5 py-1">
        <ScreenLogo className="h-[0.9375rem]" />
      </div>

      <div ref={listRef} className="relative flex flex-col gap-0.5">
        <span
          aria-hidden="true"
          className="sc-accent-bg absolute inset-x-0 h-[1.375rem] rounded-md transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateY(${offset}px)` }}
        />
        {/* The active row also carries a 2px gradient stub on its left edge —
            the same brand ramp the marketing nav indicator uses. */}
        <span
          aria-hidden="true"
          className="absolute left-0 h-[1.375rem] w-[2px] rounded-full transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            transform: `translateY(${offset}px)`,
            backgroundImage: "var(--brand-gradient)",
          }}
        />
        {SIDEBAR.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className={[
              "relative flex items-center gap-2 rounded-md px-2 py-[0.3125rem] text-[0.625rem] transition-colors duration-[400ms]",
              i === active ? "sc-accent font-semibold" : "text-fg-subtle",
            ].join(" ")}
          >
            <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Supplier mix — each arc grows to its share                          */
/* ------------------------------------------------------------------ */

/** The brand ramp, indigo → magenta, with a neutral for the tail slice. */
const SUPPLIERS = [
  { name: "Amadeus", pct: 34, color: "var(--brand-1)" },
  { name: "TBO", pct: 26, color: "var(--brand-2)" },
  { name: "Travelport", pct: 21, color: "var(--brand-3)" },
  { name: "Direct LCC", pct: 19, color: "#cfd3e2" },
];

export function SupplierSplit() {
  const { live } = useLive();
  const arcs = useRef<(SVGCircleElement | null)[]>([]);

  const r = 26;
  const c = 2 * Math.PI * r;

  /**
   * Grown with the Web Animations API rather than a CSS transition.
   *
   * The property that has to move is `stroke-dasharray`, and its two ends
   * here are "0, full circle" and "arc, remainder" — a pair of comma lists
   * whose values both change. Expressed in CSS that needs the length in a
   * custom property, and an unresolved var() makes the endpoints
   * non-interpolable, so the browser hard-swaps at 50% instead of animating.
   * WAAPI takes the concrete values and interpolates them properly.
   */
  useEffect(() => {
    if (!live) return;

    let offset = 0;
    const anims = SUPPLIERS.map((s, i) => {
      const el = arcs.current[i];
      const len = (s.pct / 100) * c;
      const from = offset;
      offset += len;
      if (!el) return null;

      return el.animate(
        [
          { strokeDasharray: `0 ${c}`, strokeDashoffset: -from },
          { strokeDasharray: `${len} ${c - len}`, strokeDashoffset: -from },
        ],
        {
          duration: 700,
          delay: 120 + i * 100,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        },
      );
    });

    return () => anims.forEach((a) => a?.cancel());
  }, [live, c]);

  let offset = 0;

  return (
    <div className="sc-card rounded-md p-3">
      <p className="mb-2 text-[0.625rem] font-medium text-fg">Supplier mix</p>
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 64 64"
          className="h-16 w-16 shrink-0 -rotate-90"
          aria-hidden="true"
        >
          {SUPPLIERS.map((s, i) => {
            const len = (s.pct / 100) * c;
            const el = (
              <circle
                key={s.name}
                ref={(node) => {
                  arcs.current[i] = node;
                }}
                cx="32"
                cy="32"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="8"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1">
          {SUPPLIERS.map((s, i) => (
            <li
              key={s.name}
              className="lv-row flex items-center gap-1.5 text-[0.5625rem]"
              style={{ ["--i" as string]: i } as React.CSSProperties}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-sm"
                style={{ background: s.color }}
              />
              <span className="truncate text-fg-muted">{s.name}</span>
              <span className="ml-auto font-medium text-fg">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
