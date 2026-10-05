/**
 * The Flysync logo.
 *
 * These are the client's own artwork — `FS LOGO HORIZONTAL.png` — not a
 * redrawn or traced mark. Four derivatives are generated from that one file
 * and live in /public/brand:
 *
 *   flysync-logo.png            mark + "Flysync"                (nav, menus)
 *   flysync-logo-dark.png       same, wordmark knocked to white
 *   flysync-logo-full.png       mark + "Flysync" + tagline      (footer)
 *   flysync-logo-full-dark.png  same, wordmark knocked to white
 *   flysync-mark.png            the flight-path mark alone      (product UI)
 *
 * The mark itself is never recoloured — its crimson→purple→blue gradient is
 * the brand. Only the navy type is knocked out for dark backgrounds, which is
 * what the previous hand-rolled gradient-clip on `.logo-word` was standing in
 * for.
 */

import Image from "next/image";
import lockup from "@/public/brand/flysync-logo.png";
import lockupDark from "@/public/brand/flysync-logo-dark.png";
import lockupFull from "@/public/brand/flysync-logo-full.png";
import lockupFullDark from "@/public/brand/flysync-logo-full-dark.png";
import mark from "@/public/brand/flysync-mark.png";

/** The flight-path mark on its own. Used inside the product mockups. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src={mark}
      alt=""
      aria-hidden="true"
      className={className}
      sizes="48px"
      priority={false}
    />
  );
}

export function Logo({
  className = "",
  showTagline = false,
  invertible = false,
}: {
  className?: string;
  /** Footer lockup — includes the "Digitally Sure" tagline. */
  showTagline?: boolean;
  /**
   * Also ship the knocked-out variant, for the header — the only place that
   * ever sits over a Type C dark section. Off everywhere else so the second
   * PNG is not downloaded for nothing.
   */
  invertible?: boolean;
}) {
  const light = showTagline ? lockupFull : lockup;
  const dark = showTagline ? lockupFullDark : lockupDark;
  const height = showTagline ? "h-14" : "h-9";

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {/* Both variants ship; which one shows is decided in CSS by
          `html[data-over-dark]`, the same attribute the header already uses to
          invert the nav. A React swap would re-render the whole nav on every
          scroll threshold crossing. */}
      <Image
        src={light}
        alt="Flysync"
        className={`logo-img logo-img-light w-auto ${height}`}
        sizes="220px"
        priority
      />
      {invertible && (
        <Image
          src={dark}
          alt=""
          aria-hidden="true"
          className={`logo-img logo-img-dark absolute left-0 top-0 w-auto ${height}`}
          sizes="220px"
        />
      )}
    </span>
  );
}
