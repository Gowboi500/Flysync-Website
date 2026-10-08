import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Coordinates } from "@/components/site/Coordinates";
import { nav, site } from "@/lib/site";

const columns = [
  {
    heading: "Product",
    links: nav.products.map((p) => ({
      name: p.subtitle ? `${p.name} (${p.subtitle})` : p.name,
      href: p.href,
    })),
  },
  {
    heading: "Platform",
    links: [
      { name: "How it works", href: "#platform" },
      // #features has never existed. The product ecosystem grid is #solutions.
      { name: "Platform features", href: "#solutions" },
      { name: "See it working", href: "#showcase" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "Why Flysync", href: "#why" },
      { name: "Customers", href: "#customers" },
      { name: "FAQ", href: "#faq" },
      { name: "Careers", href: "/careers" },
      { name: "Contact sales", href: "/demo" },
    ],
  },
];

/**
 * The footer is light, by request — reversing the dark treatment from the
 * colour-rhythm pass.
 *
 * It sits on `canvas-alt` rather than the base canvas so it still reads as a
 * deliberate close to the page rather than blending into the last section,
 * and it now follows the dark CTA anchor directly, which gives the page a
 * hard light/dark edge at the bottom instead of a dark run.
 */
export function Footer() {
  const { address } = site.contact;

  return (
    <footer className="relative border-t border-line bg-canvas-alt">

      {/* pb-28 below lg: StickyCTA's mobile action bar is fixed to the
          bottom of the viewport and is ~76px tall with the safe-area inset.
          Without this the last row of footer links sits under it and cannot
          be tapped at the end of the page. */}
      <div className="container-page py-16 pb-28 lg:py-20 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* ---- Brand + contact ---- */}
          <div className="max-w-sm">
            {/* Solid accent, matching the header. The gradient wordmark existed
                because the accent was unreadable on the dark footer; on light
                it is not, and the gradient's magenta end measures 4.49:1 here
                — a hair under the AA floor. */}
            <Logo showTagline />
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">
              Complete travel technology for B2B, B2C, corporate and group
              travel businesses. Built in Chennai, running across India.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm">
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="group flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-fg-subtle transition-colors group-hover:text-accent"
                    strokeWidth={1.75}
                  />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.emailHref}
                  className="group flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-fg-subtle transition-colors group-hover:text-accent"
                    strokeWidth={1.75}
                  />
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-3 text-fg-muted">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-fg-subtle"
                  strokeWidth={1.75}
                />
                <address className="not-italic leading-relaxed">
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.line3}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </address>
              </li>
            </ul>

            <p className="mt-5 text-xs text-fg-subtle">{site.contact.hours}</p>
          </div>

          {/* ---- Link columns ---- */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg">
                  {col.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        className="link-underline text-sm text-fg-muted transition-colors hover:text-accent"
                      >
                        {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs text-fg-subtle transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs text-fg-subtle transition-colors hover:text-accent"
            >
              YouTube
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs text-fg-subtle transition-colors hover:text-accent"
            >
              Facebook
            </a>
            {/* The divider went with the "Made in Chennai" line it used to
                separate — a rule with nothing on its left is just a mark. */}
            <span className="flex items-center text-xs text-fg-subtle">
              <Coordinates lat="12.92° N" lon="80.14° E" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
