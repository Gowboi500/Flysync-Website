"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Magnetic pull for the primary CTA. One button, one page, desktop only.
 *
 * Inside a 40px field around the button the wrapper leans toward the cursor
 * by at most 4px, and springs back the moment the cursor leaves. If you
 * notice it happening, it is too strong — the point is that the button feels
 * slightly eager to be clicked, not that it moves.
 *
 * The transform goes on this wrapper rather than on the button so it cannot
 * collide with the button's own hover lift and active scale, which live in
 * CSS on `.btn`. One `transform` property cannot be owned by two things.
 *
 * The listener is on the document because proximity means "near the button",
 * which by definition includes points the button never receives events for.
 * It is kept honest three ways: it only exists on fine-pointer devices with
 * motion enabled, it is detached whenever the button is off screen, and it
 * does nothing per event except store coordinates — the measuring and
 * writing happen once per frame in rAF.
 */
const FIELD = 40; // px of proximity that counts as "near"
const PULL = 4; // px, maximum lean

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let point: { x: number; y: number } | null = null;
    let engaged = false;

    const apply = () => {
      frame = 0;
      if (!point) return;

      const r = el.getBoundingClientRect();
      const dx = point.x - (r.left + r.width / 2);
      const dy = point.y - (r.top + r.height / 2);

      // Distance to the button's EDGE, not its centre — otherwise a wide
      // button has a field that starts inside itself at the ends.
      const outX = Math.max(Math.abs(dx) - r.width / 2, 0);
      const outY = Math.max(Math.abs(dy) - r.height / 2, 0);
      const distance = Math.hypot(outX, outY);

      if (distance > FIELD) {
        if (!engaged) return;
        engaged = false;
        el.style.transition = `transform var(--dur-ui) var(--ease-out)`;
        el.style.transform = "";
        return;
      }

      // Falls off toward the edge of the field so nothing snaps on entry.
      const strength = 1 - distance / FIELD;
      const tx = Math.max(-1, Math.min(1, dx / (r.width / 2)));
      const ty = Math.max(-1, Math.min(1, dy / (r.height / 2)));

      // A short transition while engaged smooths the gap between pointer
      // samples without making the button feel like it is lagging.
      el.style.transition = "transform 80ms linear";
      el.style.transform = `translate(${(tx * PULL * strength).toFixed(2)}px, ${(
        ty *
        PULL *
        strength
      ).toFixed(2)}px)`;
      engaged = true;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      point = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const attach = () => document.addEventListener("pointermove", onMove);
    const detach = () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      engaged = false;
      el.style.transition = "";
      el.style.transform = "";
    };

    if (typeof IntersectionObserver === "undefined") {
      attach();
      return detach;
    }

    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? attach() : detach(),
    );
    io.observe(el);

    return () => {
      io.disconnect();
      detach();
    };
  }, []);

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
