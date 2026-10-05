"use client";

import { useEffect } from "react";

/**
 * The page's scroll-linked chrome: the `data-scrolled` flag the header styles
 * itself from.
 *
 * One passive scroll listener for the whole site. The header used to run its
 * own to toggle a React state at a 12px threshold, which re-rendered the
 * entire nav — including the products dropdown — on every crossing. The flag
 * is now an attribute on <html> and the header reacts to it in CSS, so
 * nothing re-renders at all.
 *
 * The listener stores nothing and measures nothing; a rAF callback does both,
 * and the two values that need layout (document height, viewport height) are
 * cached and only recomputed when something can actually have changed them.
 * That is what keeps this off the "scroll handler doing layout reads" list.
 */
const HEADER_AT = 80; // px of scroll before the header takes on its surface

export function ScrollChrome() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let scrolled = false;
    let overDark = false;

    // Type C sections. Collected once — they do not appear or vanish.
    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>("[data-anchor]"),
    );
    // Header height, read once rather than every frame.
    const headerH =
      document.querySelector("header")?.getBoundingClientRect().height ?? 64;

    const update = () => {
      frame = 0;
      const y = window.scrollY;

      const past = y > HEADER_AT;
      if (past !== scrolled) {
        scrolled = past;
        if (past) root.setAttribute("data-scrolled", "");
        else root.removeAttribute("data-scrolled");
      }

      // Is a dark section currently behind the header? A couple of rect
      // reads against a fixed list, inside the frame that is already
      // measuring — cheaper and more reliable than elementFromPoint, which
      // would just hit the header itself.
      const dark = anchors.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= headerH * 0.6 && r.bottom >= headerH * 0.4;
      });
      if (dark !== overDark) {
        overDark = dark;
        if (dark) root.setAttribute("data-over-dark", "");
        else root.removeAttribute("data-over-dark");
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.removeAttribute("data-scrolled");
      root.removeAttribute("data-over-dark");
    };
  }, []);

  return null;
}
