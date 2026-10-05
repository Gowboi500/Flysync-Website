"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Makes one product mockup "live" while it is on screen.
 *
 * Every animated detail inside a mock — counting KPIs, the drawing chart, the
 * growing donut, the staggered rows — hangs off this single component. It
 * owns ONE IntersectionObserver per mockup rather than each detail owning its
 * own, which matters because there are three mocks on the homepage and half a
 * dozen animated pieces inside each.
 *
 * Two flags, not one:
 *
 *  - `live` gates the one-shot entrances (count-ups, chart draws, bars). Off
 *    when the mock is off screen, and permanently off under reduced motion,
 *    where every value simply renders final.
 *  - `loops` additionally gates the repeating ones (the KPI tick, the sidebar
 *    moving, the booking feed). Off on coarse pointers, so a phone renders
 *    the entrance animations and then goes quiet instead of running timers
 *    against someone's battery for as long as the section is in view.
 *
 * It also drops `loops` when the tab is hidden. A backgrounded tab throttles
 * timers rather than stopping them, which just queues work to replay in a
 * burst on return.
 */
type LiveState = { live: boolean; loops: boolean };

const LiveContext = createContext<LiveState>({ live: true, loops: false });

/** Read by every animated piece inside a mockup. */
export function useLive(): LiveState {
  return useContext(LiveContext);
}

export function LiveMock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<LiveState>({ live: false, loops: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    if (still.matches) {
      // Final state, no motion, nothing scheduled.
      setState({ live: true, loops: false });
      return;
    }

    let onScreen = false;
    const sync = () =>
      setState({
        live: onScreen,
        loops: onScreen && !coarse.matches && !document.hidden,
      });

    if (typeof IntersectionObserver === "undefined") {
      onScreen = true;
      sync();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <LiveContext.Provider value={state}>
      {/* `data-live` lets the purely declarative pieces — chart draw, donut
          growth, row stagger — key off CSS alone and stay server-rendered. */}
      <div ref={ref} data-live={state.live ? "" : undefined} className={className}>
        {children}
      </div>
    </LiveContext.Provider>
  );
}

/**
 * A number that counts up to its value the first time the mock goes live, and
 * can then drift upward as if bookings were landing.
 *
 * Formatting is declarative props rather than a `format` callback. Most of
 * the callers are server components, and a function cannot cross the
 * server/client boundary — Next fails the prerender outright with
 * "Functions cannot be passed directly to Client Components". Prefix,
 * suffix, decimals and grouping cover every number in these mocks.
 *
 * The final value is the initial state and the server-rendered text, so the
 * mock never ships a zero and never shows one to a visitor who has motion
 * turned off. The count-up rewinds only when `live` first becomes true, which
 * off-screen is invisible.
 */
export function LiveNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = false,
  countMs = 1200,
  /** Average seconds between spontaneous +1s. Omit for a number that holds. */
  tickEvery,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands separators, Indian grouping. */
  group?: boolean;
  countMs?: number;
  tickEvery?: number;
  className?: string;
}) {
  const { live, loops } = useLive();
  const [shown, setShown] = useState(value);
  const target = useRef(value);

  // ---- count up on first sight ----
  useEffect(() => {
    if (!live) return;

    let frame = 0;
    const to = target.current;
    const start = performance.now();

    const tick = (now: number) => {
      // Clamped at BOTH ends. A rAF timestamp can be marginally earlier than
      // a performance.now() read taken just before the frame, which makes t
      // negative for one tick — and easeOutExpo of a negative t is negative,
      // so the first painted frame was "-19" and "₹-1.4L".
      const t = Math.min(Math.max((now - start) / countMs, 0), 1);
      // easeOutExpo — fast out of the gate, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setShown(to * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [live, countMs]);

  // ---- occasional drift, once it has settled ----
  useEffect(() => {
    if (!loops || !tickEvery) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      // Jittered, so several mocks on one page never tick in lockstep.
      const wait = (tickEvery * 0.6 + Math.random() * tickEvery * 0.8) * 1000;
      timer = setTimeout(() => {
        target.current += 1;
        setShown(target.current);
        schedule();
      }, wait);
    };
    schedule();

    return () => clearTimeout(timer);
  }, [loops, tickEvery]);

  const text = group
    ? shown.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : shown.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
