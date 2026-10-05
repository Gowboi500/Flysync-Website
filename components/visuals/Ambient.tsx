/**
 * The ambient brand blooms.
 *
 * Two low-opacity radial washes — one cool (purple/violet), one warm
 * (pink/violet) — sit behind hero content to give the white ground depth.
 * Both are declared as tokens (`--gradient-blob-cool` / `--gradient-blob-warm`)
 * and only blurred here; no component picks its own colour or opacity.
 *
 * Nothing is ever laid on top of a bloom, so they use the decorative ramp and
 * never have to clear a contrast floor. They are `aria-hidden` and
 * pointer-transparent — purely atmosphere.
 *
 * `-z-10` keeps them behind content; the host section must own
 * `overflow-hidden` or a bloom placed off the edge widens the document and
 * gives a phone a horizontal scrollbar.
 */
export function HeroGlow({
  className = "",
  warm = false,
}: {
  className?: string;
  /** The pink-led bloom. Pair one of each; never two of the same. */
  warm?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${warm ? "hero-glow-warm" : "hero-glow"} pointer-events-none absolute -z-10 rounded-full ${className}`}
    />
  );
}
