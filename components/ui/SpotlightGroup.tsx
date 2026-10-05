"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * One delegated pointer listener for a whole grid of cards.
 *
 * Each card only needs `data-spotlight` on it; this writes `--mx`/`--my` onto
 * whichever card the pointer is over and the styling is entirely CSS (see
 * `[data-spotlight]` in globals.css). Doing it here rather than per card
 * keeps the cards themselves server-rendered markup.
 *
 * It renders the grid element itself rather than wrapping one, so combining
 * it with a stagger group costs no extra DOM — pass `reveal-group` in the
 * className and one div does both jobs.
 *
 * Two performance rules it follows:
 *
 *  - The handler stores coordinates and nothing else. Measuring the card
 *    inside the handler would force a synchronous layout on every pointer
 *    move; the read happens in the rAF callback instead, batched ahead of
 *    the writes.
 *  - Moves are coalesced to one frame. A fine pointer emits well above
 *    display rate, and every event past the first in a frame is work the
 *    compositor throws away.
 *
 * Touch is filtered here as well as in CSS: a tap reports as a pointermove
 * before it reports as a click, which would otherwise leave the glow stuck
 * wherever the finger last landed.
 */
export function SpotlightGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frame = useRef(0);
  const pending = useRef<{ card: HTMLElement; x: number; y: number } | null>(
    null,
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;

    const card = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-spotlight]",
    );
    if (!card) return;

    pending.current = { card, x: e.clientX, y: e.clientY };
    if (frame.current) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const p = pending.current;
      if (!p) return;
      const r = p.card.getBoundingClientRect();
      p.card.style.setProperty("--mx", `${p.x - r.left}px`);
      p.card.style.setProperty("--my", `${p.y - r.top}px`);
    });
  }, []);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
