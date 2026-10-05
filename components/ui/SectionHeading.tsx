import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Words } from "./Words";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={[
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      ].join(" ")}
    >
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">
            {/* The one playful note on the page — see splitFlap.ts. The real
                text is server-rendered; the flap only ever rewrites it. */}
            <span data-flap>{eyebrow}</span>
          </p>
        </Reveal>
      )}
      {/* Typography carries this design, so the heading is deliberately much
          larger than the body copy beneath it — the SIZE CONTRAST is what
          reads as premium, not decoration.

          A string title reveals word by word; anything richer falls back to
          the plain block reveal, because splitting arbitrary JSX into words
          would mean walking children and rebuilding them, and every heading
          on the site is a string. */}
      <h2 className="mt-5 text-[length:var(--text-h2)] font-bold leading-[1.04] tracking-[-0.028em] text-fg">
        {typeof title === "string" ? <Words text={title} /> : title}
      </h2>
      {body && (
        <Reveal delay={0.12}>
          <p
            className={[
              "mt-6 max-w-2xl text-[0.9375rem] leading-[1.65] text-fg-muted sm:text-base",
              centered ? "mx-auto max-w-2xl" : "",
            ].join(" ")}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
