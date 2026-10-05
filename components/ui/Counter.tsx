"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up that NEVER renders a zero to a real visitor.
 *
 * The naive version initialises at 0 and animates on scroll-into-view, which
 * means the server-rendered HTML says "0", and anyone without JS — or anyone
 * who looks before hydration — sees a literal zero next to a trust claim.
 *
 * Instead the real value is the initial state, so it is correct in the HTML
 * and correct on first paint. The animation is layered on afterwards, and
 * only for elements that are still BELOW the fold: resetting to zero is
 * invisible there, so the count-up reads as a flourish rather than a flash.
 * An element already on screen simply keeps its final value.
 */
export function Counter({
  value,
  decimals = 0,
  duration = 1.4,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    // Already visible on load? Leave the real number alone.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    let frame = 0;
    setDisplay(0);

    const run = () => {
      const start = performance.now();
      const ms = duration * 1000;
      const tick = (now: number) => {
        const t = Math.min((now - start) / ms, 1);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
        setDisplay(value * eased);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      // Guard against unmounting mid-animation on a partial value
      setDisplay(value);
    };
  }, [value, duration]);

  // Tabular figures keep every digit the same WIDTH but say nothing about
  // how MANY there are, and the count-up runs 0 -> 100. Without a reserved
  // slot the element is one character wide for the first frames and three by
  // the end, which moves the suffix and registers as layout shift. The slot
  // is sized from the settled value and the digits are right-aligned into
  // it, so at rest it fits exactly and nothing looks padded.
  const settled = value.toFixed(decimals);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        minWidth: `${settled.length}ch`,
        textAlign: "right",
      }}
    >
      {display.toFixed(decimals)}
    </span>
  );
}
