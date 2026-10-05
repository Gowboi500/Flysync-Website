"use client";

import { useEffect, useState } from "react";

/**
 * Mount/unmount with enter *and* exit transitions, without an animation
 * library.
 *
 * The problem AnimatePresence solves is that a component removed from the
 * tree cannot animate out — it is simply gone. This keeps the node mounted
 * for `duration` after `open` flips to false, and drives the visual state
 * through a class instead:
 *
 *   mounted -> render the node at all
 *   active  -> the "open" visual state; toggled one frame after mount so the
 *              browser has a chance to paint the closed state first, which is
 *              what makes the enter transition run.
 */
export function useMountTransition(open: boolean, duration = 260) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Two frames: one to commit the mount, one to flip to the open state.
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setActive(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    setActive(false);
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return { mounted, active };
}
