"use client";

import { useEffect } from "react";
import { splitFlap } from "./splitFlap";

/**
 * The single client component behind every scroll-triggered effect.
 *
 * Mounted once. It finds all `.reveal` / `.reveal-group` / `.words` /
 * `.shot-reveal` elements and drives them from `is-in`, plus the eyebrow
 * labels marked `data-flap`.
 *
 * Reveals REPLAY. An element that scrolls away is re-armed, so scrolling back
 * up and down plays it again. (Phase 2 originally specified play-once; this
 * is a deliberate reversal.) Two consequences worth knowing:
 *
 *  - There are two observers, not one, and they stay subscribed for the
 *    session rather than draining to empty.
 *  - Re-arming has to be invisible, which is the fiddly part. Removing
 *    `is-in` runs every transition in reverse — a 600ms fade-out, in front of
 *    the visitor, if the element is still even slightly on screen. So the
 *    exit observer deliberately uses generous margins (the entry observer's
 *    -10% bottom would report "gone" while the element is still visible in
 *    the bottom strip), AND the reset is done with transitions switched off
 *    via `.reveal-rearm` so the element snaps back to hidden instead of
 *    animating there.
 *
 * Two details on the entry side:
 *
 *  - The entry trigger is margin-based, not ratio-based — see the note on
 *    the observer itself. A visible-ratio test cannot be trusted on a page
 *    using `content-visibility: auto`.
 *  - `will-change` is a promise to the compositor to keep a layer alive. Left
 *    standing on every revealing element it costs more than it saves, so it
 *    goes on immediately before the transition and comes off once the whole
 *    thing — including a stagger group's last child — has settled.
 */
const REVEAL_MS = 600;

export function RevealObserver() {
  useEffect(() => {
    // Tells the inline head script that the bundle arrived and the reveals
    // are in hand; without this stamp it restores `no-js` and everything
    // falls back to plain visible content. See app/layout.tsx.
    document.documentElement.setAttribute("data-reveal-armed", "");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-group, .words, .shot-reveal, [data-flap], [data-replay]",
      ),
    );
    if (!targets.length) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();

    const play = (el: HTMLElement) => {
      // `is-in` doubles as the "already playing" flag, including on flap
      // spans where it has no styling attached. Without it, every scroll
      // that nudges the intersection ratio would restart the effect.
      if (!el.hasAttribute("data-replay")) {
        if (el.classList.contains("is-in")) return;
        el.classList.add("is-in");
      }

      /* Above-the-fold elements animate on load in pure CSS and are parked
         at `.rise-armed` once they scroll away. Restarting means removing
         the animation class, flushing layout so the browser sees the
         element genuinely lose it, then putting it back — re-adding a class
         the element still has is a no-op and the keyframe never replays. */
      if (el.hasAttribute("data-replay")) {
        const animation = el.dataset.replay === "shot" ? "rise-shot" : "rise";
        if (!el.classList.contains("rise-armed")) return;
        el.classList.remove("rise-armed", animation);
        void el.offsetWidth;
        el.classList.add(animation);
        return;
      }

      if (el.hasAttribute("data-flap")) {
        // The eyebrow's own reveal takes 600ms and the flap takes 400, so
        // starting 200ms in lands the last character exactly as the label
        // finishes fading up. Fired immediately, the board would finish
        // resolving while the text was still invisible.
        const t = setTimeout(() => {
          splitFlap(el);
          timers.delete(t);
        }, 200);
        timers.add(t);
        return;
      }

      el.style.willChange = "opacity, transform";

      // A group's children stagger, so the last one finishes well after the
      // container's own transition. Clear on the outer bound rather than
      // listening on every child.
      const children = el.classList.contains("reveal-group")
        ? el.querySelectorAll(".reveal-item").length
        : 0;
      const settle = REVEAL_MS + children * 70 + 120;

      const t = setTimeout(() => {
        el.style.willChange = "";
        timers.delete(t);
      }, settle);
      timers.add(t);
    };

    const rearm = (el: HTMLElement) => {
      if (el.hasAttribute("data-replay")) {
        // Park it hidden with no animation, ready to be restarted on return.
        el.classList.add("rise-armed");
        el.classList.remove("is-in");
        return;
      }

      if (!el.classList.contains("is-in")) return;

      /* Confirm with a real measurement before un-revealing anything.
 
         The observer's word is not good enough here. Sections carry
         `content-visibility: auto`, and while one is still skipped its
         children have no box — they report fictional geometry, which arrives
         at this callback as "gone" for an element the visitor is looking at.
         Acting on that un-revealed sections mid-screen and they never came
         back, because no further intersection change was coming to correct
         it.
 
         By the time this runs the element is either genuinely off screen, or
         on screen and therefore rendered — and a rendered element's rect is
         true. One layout read, only on re-arm, never per scroll. */
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const nearby = r.bottom > -vh * 0.25 && r.top < vh * 1.25;
      if (nearby) return;

      el.classList.add("reveal-rearm");
      el.classList.remove("is-in");
      el.style.willChange = "";

      // Two frames: one for the un-transitioned hidden state to be committed,
      // then transitions come back for the next entrance. Doing it in one
      // frame lets the reverse transition start.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.remove("reveal-rearm")),
      );
    };

    /* Any intersection past the -10% bottom margin plays. There is
       deliberately no visible-ratio test.
 
       A ratio gate is the obvious way to express "20% visible", and it does
       not survive `content-visibility: auto`: while a section is still
       skipped its children have no box, so the ratio is computed from
       fiction. Measured on the Why grid mid-approach — ratio 0.15 for an
       element that was about to fill a third of the screen. The gate
       rejected it, no further intersection change was coming to correct the
       reading, and the section never revealed at all.
 
       The margin already does the job the ratio was there for: it delays the
       trigger until the element is 10% of a viewport past the fold. And the
       failure directions are not symmetric — playing slightly early costs
       nothing, never playing leaves the page blank. */
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    /* Half a viewport of slack on each side, so an element is only re-armed
       once it is comfortably out of sight — and then a 200ms debounce on top.
 
       The debounce is not politeness, it is correctness. Sections carry
       `content-visibility: auto`, so while one is still skipped its children
       have no real box and report fictional geometry: the Why grid was
       measured mid-approach reporting a 58px intersection for an element
       ~600px tall, which lands here as "gone" for an element about to be on
       screen. Re-arming on that reading un-revealed sections the visitor was
       looking at. Waiting one beat lets the corrected reading arrive and
       cancel the pending re-arm. */
    const pendingExit = new Map<Element, ReturnType<typeof setTimeout>>();

    const exit = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const queued = pendingExit.get(el);

          if (entry.isIntersecting) {
            if (queued) {
              clearTimeout(queued);
              pendingExit.delete(el);
            }
            continue;
          }

          if (queued) continue;
          pendingExit.set(
            el,
            setTimeout(() => {
              pendingExit.delete(el);
              rearm(el);
            }, 200),
          );
        }
      },
      { rootMargin: "50% 0px 50% 0px", threshold: 0 },
    );

    targets.forEach((el) => {
      enter.observe(el);
      exit.observe(el);
    });

    return () => {
      enter.disconnect();
      exit.disconnect();
      timers.forEach(clearTimeout);
      pendingExit.forEach(clearTimeout);
    };
  }, []);

  return null;
}
