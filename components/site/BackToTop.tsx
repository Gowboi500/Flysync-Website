"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Back-to-top action.
 *
 * The pages are long, so this gives a sense of position as well as an escape
 * hatch. It sits above the WhatsApp bubble on desktop and clears the sticky
 * CTA bar on mobile. Progress is written to a CSS variable rather than React
 * state per frame, so scrolling never triggers a re-render.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setVisible(window.scrollY > 900);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          })
        }
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className={[
          "fixed bottom-24 right-7 z-40 hidden h-11 w-11 place-items-center rounded-full border border-slate-300 bg-surface text-slate-500 backdrop-blur transition-all duration-[250ms] hover:border-black hover:bg-black hover:text-white lg:grid",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        ].join(" ")}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </>
  );
}
