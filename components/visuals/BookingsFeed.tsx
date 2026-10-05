"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

/**
 * The "Recent bookings" panel inside the operations mock — the one thing on
 * the page that is allowed to loop forever, because it is diegetic: it is
 * the product doing what the product does.
 *
 * Behaviour
 * ---------
 * Every 5–8s a booking lands: the new row slides in at the top, the list
 * slides down under it, and whatever falls past the bottom edge is clipped
 * away. Every ~15s a pending booking gets ticketed, its chip crossfading to
 * green and picking up a check. The Live badge pulses throughout.
 *
 * Everything stops when the mock is off screen, and none of it exists under
 * `prefers-reduced-motion` — the panel then renders as a still list, which
 * is exactly what it looked like before.
 *
 * Why this is a grid and not a <table>
 * ------------------------------------
 * The slide is one transform on the row container. `transform` on <tbody>
 * and <tr> is under-specified and unreliable across engines, and the
 * alternative — letting React swap the rows and shift the list instantly —
 * flickers seven rows of text to draw attention to one. A grid with the
 * matching ARIA roles keeps the semantics and makes the container
 * transformable.
 *
 * Why there is no measurement
 * ---------------------------
 * The whole mock renders at a fixed design size inside FitScreen and is
 * scaled as a unit, so the row height is a known constant rather than
 * something to read back from layout. `transform` is applied in the
 * element's own coordinate space, so it stays correct at every scale.
 */

type Status = "Ticketed" | "On hold" | "Pending";

type Row = {
  pnr: string;
  route: string;
  agent: string;
  amt: string;
  status: Status;
};

/** Twelve bookings, cycled. The first eight are the Phase 1 static set. */
const POOL: readonly Row[] = [
  { pnr: "6QK4TR", route: "MAA → DXB", agent: "Manpasand", amt: "₹42,180", status: "Ticketed" },
  { pnr: "H8ZP2M", route: "DEL → SIN", agent: "Raj Travels", amt: "₹68,940", status: "Ticketed" },
  { pnr: "K3WD9L", route: "BLR → LHR", agent: "Fareport", amt: "₹1,12,500", status: "On hold" },
  { pnr: "P7NX5V", route: "MAA → BKK", agent: "Flybest", amt: "₹31,260", status: "Ticketed" },
  { pnr: "R2YC8B", route: "COK → AUH", agent: "Make Voyage", amt: "₹27,840", status: "Pending" },
  { pnr: "T9MB3F", route: "MAA → CMB", agent: "Maruti Trips", amt: "₹18,420", status: "Ticketed" },
  { pnr: "W5LQ7D", route: "HYD → DOH", agent: "Travelone", amt: "₹54,300", status: "Ticketed" },
  { pnr: "Z4VH6N", route: "BLR → SIN", agent: "VoloFly", amt: "₹47,120", status: "On hold" },
  { pnr: "J6TF1C", route: "MAA → KUL", agent: "Sri Balaji Tours", amt: "₹36,750", status: "Pending" },
  { pnr: "N2QG7K", route: "AMD → SHJ", agent: "Westline Travel", amt: "₹22,910", status: "Ticketed" },
  { pnr: "X8RD4P", route: "CCU → BKK", agent: "Eastbound", amt: "₹39,480", status: "Ticketed" },
  { pnr: "B5LK9W", route: "TRV → MCT", agent: "Coastal Trips", amt: "₹29,630", status: "Pending" },
];

/** Rendered row count. More than fits, so the list never shows its bottom. */
const RENDERED = 12;

/**
 * Coprime with POOL.length, so the pointer visits all twelve bookings in a
 * scrambled order before any of them repeats. A real shuffle would have to
 * happen after mount to stay deterministic for hydration; this gets the same
 * "no obvious cycle" read for nothing.
 */
const STEP = 5;

const ROW_H = 26; // px, at the mock's design size
const SLIDE_MS = 400;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/* OPAQUE fills, not alpha tints.
   The panels behind these chips are glass now (72% white + backdrop blur),
   so a translucent chip composites against whatever happens to be underneath
   and its contrast stops being knowable — "On hold" measured 4.45:1 that way,
   under the floor. Solid fills make it deterministic: 5.9:1 (ticketed),
   4.9:1 (on hold), 6.0:1 (pending), whatever is behind the card. */
const STATUS_STYLE: Record<Status, string> = {
  Ticketed: "bg-[#e8f5f0] sc-pos",
  "On hold": "bg-[#eeedfe] sc-accent",
  Pending: "bg-[#eeeef2] text-fg-muted",
};

/** Header and body share this template so the columns line up. */
const COLS =
  "grid grid-cols-[4.5rem_5.5rem_5rem_4.75rem] sm:grid-cols-[4.5rem_5.5rem_1fr_5rem_4.75rem]";

/**
 * Rows are keyed on a serial, not on the PNR.
 *
 * The PNR is the natural key right up until the pool wraps: the same booking
 * comes round again, gets a rotated locator so it does not read as a
 * duplicate, and now two different rows can carry the same string. React
 * would reconcile them as one and the slide would animate the wrong element.
 * A serial cannot collide.
 */
type FeedRow = Row & { id: number };

export function BookingsFeed() {
  const [rows, setRows] = useState<readonly FeedRow[]>(() =>
    POOL.slice(0, RENDERED).map((r, i) => ({ ...r, id: i })),
  );
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Bumped on every arrival so the layout effect knows to play the slide.
  const [arrival, setArrival] = useState(0);
  const cursor = useRef(RENDERED);
  const nextId = useRef(RENDERED);

  const addRow = useCallback(() => {
    cursor.current = (cursor.current + STEP) % POOL.length;
    const next = POOL[cursor.current];
    setRows((prev) => [
      {
        ...next,
        // A booking still on screen would read as a duplicate record, so
        // recycle it under a fresh locator rather than skipping the tick.
        pnr: prev.some((r) => r.pnr === next.pnr)
          ? rotatePnr(next.pnr)
          : next.pnr,
        id: nextId.current++,
      },
      ...prev.slice(0, RENDERED - 1),
    ]);
    setArrival((n) => n + 1);
  }, []);

  const ticketOne = useCallback(() => {
    setRows((prev) => {
      // Only the rows a visitor can actually see are worth flipping.
      const i = prev.findIndex((r, idx) => idx < 8 && r.status === "Pending");
      if (i === -1) return prev;
      const next = prev.slice();
      next[i] = { ...prev[i], status: "Ticketed" };
      return next;
    });
  }, []);

  /* ---- The slide ----
     Run in a layout effect: the row is already in the DOM and the list has
     already grown by ROW_H at the top, so the animation starts one row back
     and settles at rest. Doing it in useEffect would let the shifted frame
     paint first. */
  useLayoutEffect(() => {
    if (!arrival) return;
    const list = listRef.current;
    if (!list) return;

    list.animate(
      [{ transform: `translateY(-${ROW_H}px)` }, { transform: "translateY(0)" }],
      { duration: SLIDE_MS, easing: EASE_OUT },
    );
    (list.firstElementChild as HTMLElement | null)?.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: SLIDE_MS, easing: EASE_OUT },
    );
  }, [arrival]);

  /* ---- Scheduling ----
     Two self-rescheduling timers rather than intervals, so the arrival gap
     can vary between 5s and 8s and the feed never falls into a metronome.
     Both are gated on visibility: a mock scrolled past has no business
     waking the main thread. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let arrive: ReturnType<typeof setTimeout> | undefined;
    let ticket: ReturnType<typeof setTimeout> | undefined;
    let live = false;

    const scheduleArrival = () => {
      arrive = setTimeout(
        () => {
          addRow();
          scheduleArrival();
        },
        5000 + Math.random() * 3000,
      );
    };
    const scheduleTicket = () => {
      ticket = setTimeout(
        () => {
          ticketOne();
          scheduleTicket();
        },
        14000 + Math.random() * 3000,
      );
    };

    const start = () => {
      if (live) return;
      live = true;
      scheduleArrival();
      scheduleTicket();
    };
    const stop = () => {
      live = false;
      clearTimeout(arrive);
      clearTimeout(ticket);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return stop;
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.15 },
    );
    io.observe(panel);

    // A backgrounded tab already throttles timers, but stopping outright
    // means we are not queueing a burst of arrivals to replay on return.
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [addRow, ticketOne]);

  return (
    <div
      ref={panelRef}
      className="sc-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-md"
    >
      <div className="sc-divide flex items-center gap-2 border-b px-3 py-2">
        <p className="text-[0.625rem] font-medium text-fg">Recent bookings</p>
        <span className="sc-well flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.5rem] text-fg-subtle">
          <span
            aria-hidden="true"
            className="pnr-live h-[1.5px] w-[1.5px] rounded-full bg-[var(--screen-pos)]"
          />
          Live
        </span>
      </div>

      <div
        role="table"
        aria-label="Recent bookings"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div
          role="row"
          className={`${COLS} sc-divide sc-well border-x-0 border-t-0 px-3 py-1.5 text-[0.5rem] uppercase tracking-wider text-fg-subtle`}
        >
          <span role="columnheader" className="font-medium">
            PNR
          </span>
          <span role="columnheader" className="font-medium">
            Route
          </span>
          <span role="columnheader" className="hidden font-medium sm:block">
            Agent
          </span>
          <span role="columnheader" className="text-right font-medium">
            Amount
          </span>
          <span role="columnheader" className="text-right font-medium">
            Status
          </span>
        </div>

        {/* The clip. More rows are rendered than can fit, so the list never
            shows its own bottom, and a mask fades the last row out against
            the panel edge instead of guillotining it. That fade IS the
            "bottom row leaves" half of the ticker — no second animation, no
            exit bookkeeping. */}
        <div className="pnr-clip min-h-0 flex-1 overflow-hidden">
          <div ref={listRef} role="rowgroup">
            {rows.map((r, i) => (
              <div
                key={r.id}
                role="row"
                // Only the first screenful staggers; anything past that is
                // clipped anyway, and delaying rows nobody can see just
                // holds `will-change` open on them.
                className={`lv-row ${COLS} sc-divide h-[26px] items-center border-t px-3 text-[0.5625rem]`}
                style={{ ["--i" as string]: Math.min(i, 9) } as React.CSSProperties}
              >
                <span role="cell" className="font-mono text-fg">
                  {r.pnr}
                </span>
                <span role="cell" className="text-fg-muted">
                  {r.route}
                </span>
                <span
                  role="cell"
                  className="hidden truncate text-fg-muted sm:block"
                >
                  {r.agent}
                </span>
                <span role="cell" className="text-right font-medium text-fg">
                  {r.amt}
                </span>
                <span role="cell" className="flex justify-end">
                  <span
                    className={`pnr-chip lv-badge inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[0.5rem] font-medium ${STATUS_STYLE[r.status]}`}
                    style={{ ["--i" as string]: Math.min(i, 9) } as React.CSSProperties}
                  >
                    {r.status === "Ticketed" && (
                      <Check
                        className="h-1.5 w-1.5"
                        strokeWidth={4}
                        aria-hidden="true"
                      />
                    )}
                    {r.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Keeps recycled bookings looking like distinct records. */
function rotatePnr(pnr: string): string {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return pnr
    .split("")
    .map((c) => {
      const i = A.indexOf(c);
      return i === -1 ? c : A[(i + 7) % A.length];
    })
    .join("");
}
