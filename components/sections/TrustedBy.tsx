import { Reveal } from "@/components/ui/Reveal";
import { clientLogos, type ClientLogo } from "@/lib/clients";
import { home } from "@/lib/pages";

const PARTNER_NAMES = ["FlyNext", "FlyforSure", "Flybest", "Fly360"];
const PARTNERS = PARTNER_NAMES.map((name) => clientLogos.find((logo) => logo.name === name)).filter(
  (logo): logo is (typeof clientLogos)[number] => Boolean(logo),
);

/**
 * The customer wall, and nothing else.
 *
 * Customers are their own marks — thirty-seven real logo files in their own
 * colours, in two rows drifting against each other, with nothing drawn
 * around them. No pill, no card, no border: the only geometry in the row is
 * the artwork.
 *
 * That is the whole difficulty. An earlier pass ran the wall in grayscale,
 * which quietly solved three problems at once — thirty-seven palettes
 * flattened to one texture, wildly different ink densities hidden, contrast
 * guaranteed. Bare colour gives all three back, and they are solved instead
 * by space (a fixed bounding area and 56px of air), by a borderless white
 * bloom under each mark, and by a whisper of drop-shadow. The rules live in
 * lib/clients.ts and the .logo-* block in globals.css.
 *
 * Two rows of text used to sit under it — pills for the three customers
 * with no logo file, and a marquee of supplier/GDS names. Both are gone by
 * request: the section is the logos now, and a row of names underneath a
 * row of marks reads as the thing you show when you have no marks.
 *
 * Every duplicated track is aria-hidden: the copy exists purely so the -50%
 * translate loops seamlessly, and a screen reader should hear each company
 * once. The first copy carries the real alt text.
 *
 * Spacing is unchanged from the pill version — 64/96px section padding and
 * 40px from the heading block to the logos.
 */

/**
 * One normalised cell.
 *
 * `--i` drives the entrance stagger; duplicates share their original's index
 * so the two copies move together.
 *
 * `--bob-delay` and `--bob-dur` are the idle float. They have to look random
 * and be anything but: a real random number renders differently on the
 * server than on the client and React throws out the whole subtree. These
 * are irrational-ish multiples of the index, wrapped — the sequence never
 * repeats within a row and is identical on both sides of hydration.
 */
function LogoCell({
  logo,
  index,
  duplicate = false,
}: {
  logo: ClientLogo;
  index: number;
  duplicate?: boolean;
}) {
  return (
    <div
      data-shape={logo.shape}
      data-plate={logo.plate ? "" : undefined}
      style={{
        ["--i" as string]: index,
        ["--bob-delay" as string]: `${((index * 0.73) % 4).toFixed(2)}s`,
        ["--bob-dur" as string]: `${(7 + ((index * 1.37) % 2)).toFixed(2)}s`,
      }}
      className={`logo-cell${duplicate ? " logo-cell-dup" : ""}`}
    >
      <span className="logo-plate">
        {/* Plain <img>, not next/image: these are pre-normalised 340px PNGs
            averaging 6KB, painted into a 180px box. The optimizer's srcset
            would be one entry wide and the request round-trip costs more
            than the bytes it could save. Explicit width/height all the same
            — the cell is fixed, but the intrinsic ratio has to be on the
            element while the file is still in flight.

            `loading="lazy"` is the markup default and LogoWall lifts it as
            the wall approaches. It cannot be left to the browser: native
            lazy loading tests against the VIEWPORT, and most of this track
            is clipped horizontally by the marquee, so a logo 3000px along it
            never counts as approaching and pops in mid-scroll instead. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={duplicate ? "" : logo.name}
          aria-hidden={duplicate || undefined}
          width={logo.w}
          height={logo.h}
          loading="lazy"
          decoding="async"
          className="client-mark"
        />
      </span>
    </div>
  );
}

function LogoRow({
  logos,
  duration,
  reverse = false,
}: {
  logos: ClientLogo[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div data-marquee-gated="" className="marquee-host logo-host mask-fade-x-lg">
      <div
        className={`marquee-track logo-track${reverse ? " logo-track-reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {logos.map((logo, i) => (
          <LogoCell key={`a-${logo.name}`} logo={logo} index={i} />
        ))}
        {logos.map((logo, i) => (
          <LogoCell key={`b-${logo.name}`} logo={logo} index={i} duplicate />
        ))}
      </div>
    </div>
  );
}

export function TrustedBy() {
  return (
    <section
      id="trusted"
      aria-labelledby="trusted-heading"
      className="atmo atmo-clients relative overflow-hidden py-16 sm:py-20"
    >
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="trusted-heading"
              className="text-[length:var(--text-h4)] font-semibold tracking-[-0.015em] text-fg"
            >
              Trusted by <span className="text-accent">75+</span> Travel Companies Globally
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-body">
              {home.trusted.body}
            </p>
          </div>
        </Reveal>
      </div>

      {/* ---- The customer wall ----
          Full bleed, outside container-page: a marquee that stops short of
          the viewport edge has a visible start and end, which is the one
          thing the edge masks exist to deny. 45s and 55s rather than one
          speed for both — matched speeds read as a mechanism, mismatched
          ones as drift.

          The beams are a sibling of the rows rather than a background on
          the section, so they can bleed past its padding and cross behind
          the logos instead of stopping at the heading. */}
      <div className="container-page">
        <Reveal delay={0.1}>
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 justify-items-center gap-4 sm:grid-cols-4 sm:gap-5">
            {PARTNERS.map((partner) => (
              <li
                key={partner.name}
                className="flex h-[4.5rem] w-full max-w-[11.5rem] items-center justify-center rounded-[1.25rem] border border-line bg-white px-6 ring-1 ring-sky-100/70 sm:h-[4.75rem] sm:max-w-[12.5rem]"
              >
                {/* These are the supplied, original partner marks. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.src}
                  alt={partner.name}
                  width={partner.w}
                  height={partner.h}
                  className="max-h-9 w-full object-contain"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
