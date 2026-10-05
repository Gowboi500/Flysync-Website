/**
 * Product UI mockups rendered as real DOM — not stock imagery.
 *
 * These are pixel-crisp at any density, weigh nothing, and can be swapped
 * for genuine product screenshots by replacing each component's body with
 * a next/image. Data shown is representative sample data.
 *
 * The UI is LIGHT: white cards, hairline borders, dark type, a violet active
 * state and soft drop shadows. Every colour comes from the `.screen-ui`
 * scope in globals.css — nothing here hard-codes a grey.
 */

import { BookingsFeed } from "./BookingsFeed";
import { LiveMock } from "./LiveMock";
import { KpiRow, ScreenLogo, Sidebar, SupplierSplit } from "./DashboardLive";
import { ArrowUpRight, Bell, Plane, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="sc-well flex items-center gap-2 border-x-0 border-t-0 px-3 py-2.5 sm:px-4">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--screen-line-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--screen-line-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--screen-line-strong)]" />
      </div>
      <div className="sc-card mx-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.5625rem] text-fg-subtle sm:text-[0.625rem]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--screen-pos)]" />
        {title}
      </div>
    </div>
  );
}

function TopBar({ heading }: { heading: string }) {
  return (
    <div className="sc-divide flex items-center gap-3 border-b px-3 py-2.5 sm:px-4">
      <p className="text-[0.75rem] font-semibold tracking-tight text-fg">
        {heading}
      </p>
      <div className="sc-well ml-auto hidden items-center gap-1.5 rounded-md px-2 py-1 text-[0.5625rem] text-fg-subtle md:flex">
        <Search className="h-2.5 w-2.5" strokeWidth={2} />
        <span>Search PNR, agent…</span>
      </div>
      <div className="relative">
        <Bell className="h-3 w-3 text-fg-subtle" strokeWidth={1.75} />
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--screen-magenta)]" />
      </div>
      <span className="sc-badge grid h-5 w-5 place-items-center rounded-full text-[0.5rem] font-semibold">
        AR
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart                                                               */
/* ------------------------------------------------------------------ */

const SERIES = [
  38, 44, 41, 52, 49, 61, 58, 67, 63, 74, 71, 82, 78, 88, 84, 95, 91, 103,
];

function AreaChart() {
  const w = 300;
  const h = 84;
  const max = Math.max(...SERIES) * 1.12;
  // Rounded to 1dp: full float precision made this path string ~4x longer
  // for no visual difference, and it ships three times per page.
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const pts = SERIES.map((v, i) => {
    const x = r1((i / (SERIES.length - 1)) * w);
    const y = r1(h - (v / max) * h);
    return [x, y] as const;
  });

  // Catmull-Rom-ish smoothing for an organic curve
  const line = pts.reduce((d, [x, y], i, arr) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = arr[i - 1];
    const cx = r1((px + x) / 2);
    return `${d}C${cx} ${py} ${cx} ${y} ${x} ${y}`;
  }, "");

  // The dash has to be at least the path length or the line stops short of
  // the right edge. Polyline length is a lower bound on the smoothed curve;
  // +6% covers the bow. Over-long is invisible — it just finishes early.
  const lineLength = Math.round(
    pts.reduce(
      (sum, [x, y], i) =>
        i === 0 ? 0 : sum + Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]),
      0,
    ) * 1.06,
  );

  return (
    <div className="sc-card rounded-md p-3">
      <div className="mb-2 flex items-baseline gap-2">
        <p className="text-[0.625rem] font-medium text-fg">Sales volume</p>
        <p className="text-[0.5625rem] text-fg-subtle">Last 18 days</p>
        <p className="sc-pos ml-auto text-[0.5625rem] font-medium">▲ 24.6%</p>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-14 w-full sm:h-[4.5rem]"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* The line runs the brand gradient left to right; the fill is the
              same ramp fading down into the white panel. */}
          <linearGradient id="area-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-1)" />
            <stop offset="100%" stopColor="var(--brand-3)" />
          </linearGradient>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-2)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0" />
          </linearGradient>
          {/* A soft violet bloom under the series line. Cheap: one blur on a
              single stroked path, and the mock is static once drawn. */}
          <filter id="line-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feDropShadow
              dx="0"
              dy="1.5"
              stdDeviation="2"
              floodColor="var(--brand-purple)"
              floodOpacity="0.35"
            />
          </filter>
        </defs>
        {/* Dashed gridlines, lighter than before — present enough to read a
            value against, quiet enough that the series is the only thing
            with weight. */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={w}
            y1={h * f}
            y2={h * f}
            stroke="#101322"
            strokeOpacity="0.045"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}
        <path
          className="lv-fill"
          d={`${line}L${w} ${h}L0 ${h}Z`}
          fill="url(#area-fill)"
        />
        <path
          className="lv-draw"
          d={line}
          stroke="url(#area-stroke)"
          strokeWidth="2.25"
          strokeLinecap="round"
          filter="url(#line-glow)"
          style={{ ["--len" as string]: lineLength } as React.CSSProperties}
        />
        {/* The head of the series: a haloed dot, so the eye lands on "now". */}
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="5.5"
          fill="var(--brand-3)"
          fillOpacity="0.18"
        />
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="2.75"
          fill="var(--brand-3)"
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Primary: booking dashboard                                          */
/* ------------------------------------------------------------------ */

export function BookingDashboard() {
  return (
    <LiveMock className="screen-ui flex h-full flex-col overflow-hidden rounded-[0.625rem]">
      <WindowChrome title="app.flysync.in/dashboard" />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar heading="Operations overview" />
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3 sm:p-4">
            <KpiRow />
            <div className="grid gap-2.5 lg:grid-cols-[1.35fr_1fr]">
              <AreaChart />
              <SupplierSplit />
            </div>
            <BookingsFeed />
          </div>
        </div>
      </div>
    </LiveMock>
  );
}

/* ------------------------------------------------------------------ */
/* Tablet: reports                                                     */
/* ------------------------------------------------------------------ */

const REPORT_BARS = [62, 78, 45, 88, 71, 94, 58, 82];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export function ReportsPanel() {
  return (
    <LiveMock className="screen-ui flex h-full flex-col overflow-hidden rounded-[0.5rem]">
      <div className="sc-divide flex items-center gap-2 border-b px-3 py-2">
        <ScreenLogo className="h-3" />
        <p className="text-[0.6875rem] font-semibold tracking-tight text-fg">
          Revenue report
        </p>
        <span className="sc-well ml-auto rounded px-1.5 py-0.5 text-[0.5rem] text-fg-subtle">
          FY 2026–27
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Gross", v: "₹11.4Cr" },
            { l: "Margin", v: "₹96.2L" },
            { l: "GST", v: "₹18.7L" },
          ].map((s) => (
            <div key={s.l} className="sc-card rounded-md px-2 py-1.5">
              <p className="text-[0.5rem] text-fg-subtle">{s.l}</p>
              <p className="text-[0.75rem] font-semibold tracking-tight text-fg">
                {s.v}
              </p>
            </div>
          ))}
        </div>
        {/* Columns need a definite height for the percentage bars to resolve */}
        <div className="sc-card flex min-h-0 flex-1 items-stretch gap-1.5 rounded-md p-2.5">
          {REPORT_BARS.map((b, i) => (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <div
                className="lv-bar w-full rounded-t-sm"
                style={{
                  ["--i" as string]: i,
                  height: `${b}%`,
                  minHeight: 6,
                  background:
                    i === 5
                      ? "var(--brand-gradient)"
                      : "#e6e3f3",
                }}
              />
              <span className="shrink-0 text-[0.4375rem] text-fg-subtle">
                {MONTHS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </LiveMock>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: agent wallet                                                */
/* ------------------------------------------------------------------ */

function TxnRow({
  t,
  a,
  ok,
  i,
}: {
  t: string;
  a: string;
  ok: boolean;
  i: number;
}) {
  return (
    <div
      className="lv-row sc-well flex items-center gap-2 rounded-md px-2 py-1.5"
      style={{ ["--i" as string]: i } as React.CSSProperties}
    >
      <span className="sc-accent-bg grid h-4 w-4 shrink-0 place-items-center rounded">
        <Plane className="sc-accent h-2 w-2" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.5rem] text-fg-muted">
        {t}
      </span>
      <span
        className={`shrink-0 text-[0.5rem] font-medium ${ok ? "sc-pos" : "text-fg"}`}
      >
        {a}
      </span>
    </div>
  );
}

export function MobileWallet() {
  return (
    <LiveMock className="screen-ui flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3.5 pb-1 pt-2.5 text-[0.5rem] font-medium text-fg-subtle">
        <span>9:41</span>
        <span className="flex gap-1">
          <span>●●●</span>
          <span>▮</span>
        </span>
      </div>

      <div className="px-3.5 pb-2 pt-1">
        <p className="text-[0.5625rem] text-fg-subtle">Agent wallet</p>
        <p className="mt-0.5 text-[1.125rem] font-semibold tracking-tight text-fg">
          ₹4,86,200
        </p>
        <div className="sc-pos mt-1 flex items-center gap-1 text-[0.5rem]">
          <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={2.5} />
          Credit limit ₹2.0L available
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 px-3.5">
        <button className="sc-badge rounded-md py-1.5 text-[0.5625rem] font-semibold">
          Top up
        </button>
        <button className="sc-well rounded-md py-1.5 text-[0.5625rem] font-medium text-fg">
          Statement
        </button>
      </div>

      {/* Weekly spend sparkline */}
      <div className="mt-3 px-3.5">
        <div className="sc-card rounded-md p-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-[0.5rem] text-fg-subtle">This week</p>
            <p className="ml-auto text-[0.5rem] font-medium text-fg">₹2.14L</p>
          </div>
          <div className="mt-1.5 flex h-8 items-end gap-1">
            {[42, 58, 36, 71, 64, 88, 52].map((h, i) => (
              <span
                key={i}
                className="lv-bar flex-1 rounded-sm"
                style={{
                  ["--i" as string]: i,
                  height: `${h}%`,
                  background:
                    i === 5
                      ? "var(--brand-gradient)"
                      : "#e6e3f3",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-1.5 px-3.5">
        <p className="text-[0.5rem] uppercase tracking-wider text-fg-subtle">
          Today
        </p>
        {[
          { t: "MAA → DXB · 2 pax", a: "−₹42,180", ok: false },
          { t: "Wallet top-up · UPI", a: "+₹1,00,000", ok: true },
          { t: "MAA → BKK · 1 pax", a: "−₹31,260", ok: false },
          { t: "Refund · H8ZP2M", a: "+₹18,450", ok: true },
        ].map((r, i) => (
          <TxnRow key={r.t} {...r} i={i} />
        ))}

        <p className="pt-1 text-[0.5rem] uppercase tracking-wider text-fg-subtle">
          Yesterday
        </p>
        {[
          { t: "DEL → SIN · 4 pax", a: "−₹68,940", ok: false },
          { t: "COK → AUH · 1 pax", a: "−₹27,840", ok: false },
          { t: "Commission credit", a: "+₹9,260", ok: true },
          { t: "BLR → LHR · 2 pax", a: "−₹1,12,500", ok: false },
        ].map((r, i) => (
          <TxnRow key={r.t} {...r} i={i + 4} />
        ))}
      </div>

      <div className="mx-auto mb-1.5 mt-2 h-0.5 w-10 shrink-0 rounded-full bg-[var(--screen-line-strong)]" />
    </LiveMock>
  );
}
