import { Fragment } from "react";

/**
 * Splits a heading into per-word spans so it can reveal word by word.
 *
 * A server component on purpose: this is markup, not behaviour. The words are
 * in the HTML, so the heading is one ordinary string to a crawler, a screen
 * reader and a visitor with no JavaScript — the only thing the observer adds
 * is the `is-in` class that starts the transition.
 *
 * Whitespace lives BETWEEN the spans rather than inside them. Each word is
 * `display: inline-block` so it can be transformed, and inline-block elements
 * separated only by source newlines collapse their gaps — the explicit space
 * text node is what keeps the heading from reading as "onelongword". It also
 * keeps the space unanimated, so lines break normally.
 */
export function Words({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span className={`words ${className}`}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <span className="w" style={{ ["--i" as string]: i } as object}>
            {word}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
