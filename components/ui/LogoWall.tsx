"use client";

import { useEffect } from "react";

/**
 * The only script behind the customer logo wall.
 *
 * Everything visible is CSS. This exists for the four things CSS cannot
 * answer on its own, and it is deliberately the whole of the JavaScript for
 * this section:
 *
 *  1. When the wall is on screen, so the entrance can play — once.
 *  2. When a marquee row is on screen, so it is not animating for nobody.
 *  3. When the tab goes to the background, same reason.
 *  4. Which half of the viewport a hovered logo is in, so the spotlight
 *     picks up the page's purple or its pink. A marquee moves, so this
 *     cannot be baked in by index the way the static pill row does it — the
 *     logo that started on the left is on the right ninety seconds later.
 *
 * Order matters between (1) and (2). The rows start paused, the stagger
 * plays against a still track, and only then does the drift begin: entrance
 * and marquee running together reads as two unrelated things happening at
 * once rather than one sequence. `released` is that handoff, and the live
 * observer holds off on any row whose wall has not reached it.
 *
 * Nothing here re-arms. The brief asks for an entrance that plays once per
 * load, which is a deliberate departure from the site's replaying reveals
 * (see RevealObserver) — a wall of thirty-nine logos restaging itself every
 * time it passes the fold is a lot of movement to ask for twice.
 */

/** Stagger tail (14 x 45ms) plus the cell transition, plus a beat. */
const RELEASE_MS = 1200;

const PURPLE = "rgba(109,91,255,0.20)";
const PINK = "rgba(255,79,173,0.20)";

export function LogoWall() {
  useEffect(() => {
    const walls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-logo-wall]"),
    );
    const hosts = Array.from(
      document.querySelectorAll<HTMLElement>("[data-marquee-gated]"),
    );
    if (!walls.length && !hosts.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported = typeof IntersectionObserver !== "undefined";

    const timers = new Set<ReturnType<typeof setTimeout>>();
    /* Last known visibility per row, so a row that came on screen during the
       entrance can be started the moment the wall releases it rather than
       waiting for the next intersection change — which, for a row already
       fully in view, is not coming. */
    const onScreen = new WeakMap<HTMLElement, boolean>();

    let teardown: (() => void) | undefined;

    const wallOf = (el: HTMLElement) =>
      el.closest<HTMLElement>("[data-logo-wall]");

    const held = (el: HTMLElement) => {
      const wall = wallOf(el);
      return wall ? !wall.hasAttribute("data-released") : false;
    };

    const setLive = (el: HTMLElement, live: boolean) => {
      if (live && !held(el)) el.setAttribute("data-live", "");
      else el.removeAttribute("data-live");
    };

    /* Native lazy loading measures against the viewport, and a marquee clips
       horizontally: a logo three thousand pixels along the track is on
       screen as far as the browser is concerned only once it has scrolled
       into the visible slice, which means it arrives unloaded and pops in.
       So the wall does its own: still lazy in the markup, lifted in one pass
       when the wall is within a screenful. Nothing is fetched for a visitor
       who never scrolls this far, and nothing pops for one who does. */
    const loadAll = (wall: HTMLElement) =>
      wall
        .querySelectorAll<HTMLImageElement>('.client-mark[loading="lazy"]')
        .forEach((img) => {
          img.loading = "eager";
        });

    if (reduce || !supported) {
      // No entrance to sequence and no motion to throttle: settle everything.
      walls.forEach((w) => {
        w.classList.add("is-in");
        w.setAttribute("data-released", "");
        w.setAttribute("data-live", "");
        loadAll(w);
      });
      hosts.forEach((h) => h.setAttribute("data-live", ""));
    } else {
      const release = (wall: HTMLElement) => {
        wall.setAttribute("data-released", "");
        wall
          .querySelectorAll<HTMLElement>("[data-marquee-gated]")
          .forEach((h) => setLive(h, onScreen.get(h) ?? true));
      };

      const entrance = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const wall = entry.target as HTMLElement;
            obs.unobserve(wall); // plays once, never re-arms
            wall.classList.add("is-in");
            wall.setAttribute("data-live", "");
            const t = setTimeout(() => {
              release(wall);
              timers.delete(t);
            }, RELEASE_MS);
            timers.add(t);
          }
        },
        { threshold: 0.25 },
      );
      walls.forEach((w) => entrance.observe(w));

      /* A screenful of lead time, so the files are in by the time the
         entrance plays rather than fading in behind it. */
      const preload = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            obs.unobserve(entry.target);
            loadAll(entry.target as HTMLElement);
          }
        },
        { rootMargin: "800px 0px" },
      );
      walls.forEach((w) => preload.observe(w));

      const live = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            onScreen.set(el, entry.isIntersecting);
            setLive(el, entry.isIntersecting);
          }
        },
        { rootMargin: "120px 0px" },
      );
      hosts.forEach((h) => live.observe(h));

      /* A row taller than the viewport would never reach threshold 0.25 and
         the wall would sit hidden forever. Belt and braces, same spirit as
         the head script's 2.5s watchdog. */
      const guard = setTimeout(() => {
        walls.forEach((w) => {
          if (w.classList.contains("is-in")) return;
          entrance.unobserve(w);
          w.classList.add("is-in");
          w.setAttribute("data-live", "");
          release(w);
        });
      }, 4000);
      timers.add(guard);

      teardown = () => {
        entrance.disconnect();
        preload.disconnect();
        live.disconnect();
      };
    }

    const doc = document.documentElement;
    const onVisibility = () => {
      if (document.hidden) doc.setAttribute("data-tab-hidden", "");
      else doc.removeAttribute("data-tab-hidden");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    /* Delegated, so thirty-nine logos (seventy-eight cells) cost one
       listener. One rect read per hover, never per scroll. */
    const onPointer = (e: Event) => {
      const cell = (e.target as Element | null)?.closest<HTMLElement>(
        ".logo-cell",
      );
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      const rightHalf = r.left + r.width / 2 > window.innerWidth / 2;
      cell.style.setProperty("--logo-glow", rightHalf ? PINK : PURPLE);
    };
    walls.forEach((w) => w.addEventListener("pointerover", onPointer));

    return () => {
      teardown?.();
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVisibility);
      walls.forEach((w) => w.removeEventListener("pointerover", onPointer));
      doc.removeAttribute("data-tab-hidden");
    };
  }, []);

  return null;
}
