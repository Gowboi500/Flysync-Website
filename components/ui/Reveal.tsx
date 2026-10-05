import type { ReactNode } from "react";

/**
 * Scroll reveal primitives.
 *
 * These are plain SERVER components — they emit markup and nothing else. The
 * actual reveal is driven by a single page-level IntersectionObserver (see
 * RevealObserver) that watches every `.reveal` / `.reveal-group` on the page.
 *
 * That distinction matters: the page uses this ~80 times, and making each one
 * a client component meant ~80 React components to ship and hydrate. As
 * markup, they cost nothing at runtime, and whole sections (comparisons,
 * integrations, testimonials, the architecture diagram) stay server-only.
 *
 * The transition itself lives in globals.css.
 */

type Direction = "up" | "down" | "left" | "right" | "none";

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  return (
    <div
      className={`reveal reveal-${direction} ${className}`}
      style={delay ? ({ ["--d" as string]: `${delay}s` } as object) : undefined}
    >
      {children}
    </div>
  );
}

export function StaggerGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal-group ${className}`}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <div
      className={`reveal-item ${className}`}
      style={{ ["--i" as string]: index } as object}
    >
      {children}
    </div>
  );
}
