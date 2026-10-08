"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Building2,
  CalendarRange,
  ChevronDown,
  Globe,
  Menu,
  Network,
  Phone,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { iconTint } from "@/components/ui/iconTints";
import { useMountTransition } from "@/components/ui/useMountTransition";
import { nav, site } from "@/lib/site";

const ICONS = {
  Network,
  CalendarRange,
  Globe,
  Users,
  Building2,
} as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  const menu = useMountTransition(menuOpen, 240);
  const dropdown = useMountTransition(productsOpen, 200);

  /* ---- Sliding underline ----
     One indicator for the whole row. It rests under whichever nav item owns
     the current route and slides to whatever is hovered, so it reads as a
     single object moving rather than as separate underlines fading in and
     out. Position is written straight to CSS custom properties instead of
     going through React state: this fires on every pointerenter, and a
     re-render of the nav (and its dropdown) per hover is not worth it. */
  const rowRef = useRef<HTMLDivElement>(null);

  const moveUnderline = useCallback((target: HTMLElement | null) => {
    const row = rowRef.current;
    if (!row) return;

    if (!target) {
      row.style.setProperty("--nav-o", "0");
      return;
    }

    const r = target.getBoundingClientRect();
    const base = row.getBoundingClientRect();
    row.style.setProperty("--nav-x", `${r.left - base.left}px`);
    row.style.setProperty("--nav-w", `${r.width}`);
    row.style.setProperty("--nav-o", "1");
  }, []);

  const restUnderline = useCallback(() => {
    const row = rowRef.current;
    moveUnderline(
      row?.querySelector<HTMLElement>("[data-nav-current]") ?? null,
    );
  }, [moveUnderline]);

  // Settle on the current route's item after mount and whenever the route
  // changes. Fonts land after first paint and shift these widths, so this
  // waits for them rather than measuring a fallback-metrics layout.
  useEffect(() => {
    let cancelled = false;
    const settle = () => {
      if (!cancelled) restUnderline();
    };

    settle();
    document.fonts?.ready.then(settle);
    window.addEventListener("resize", settle);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", settle);
    };
  }, [pathname, restUnderline]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setProductsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* The "Skip to content" link was removed by request. Bypassing the
          nav still works for keyboard and screen-reader users via the page's
          landmarks â€” <header>, <nav aria-label="Primary">, <main id="main">,
          <footer> â€” plus a single h1 and an ordered heading tree, which is
          the accepted alternative technique for WCAG 2.4.1. Keep those
          landmarks intact; they are now the only bypass mechanism. */}
      {/* The blur + hairline at 80px is driven by `html[data-scrolled]` from
          ScrollChrome, in CSS â€” see .site-header. */}
      <header className="site-header fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Primary"
          className="container-page flex h-[4.5rem] items-center gap-6 lg:h-[var(--nav-height)]"
        >
          <Link
            href="/"
            // min-h-11: the logo's own artwork is 42px tall, which is under
            // the 44px tap-target floor on a phone.
            className="flex min-h-11 shrink-0 items-center rounded-control"
            aria-label={`${site.name} â€” home`}
          >
            <Logo invertible />
          </Link>

          {/* ---- Desktop nav ---- */}
          <div
            ref={rowRef}
            onPointerLeave={restUnderline}
            className="relative hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            <span aria-hidden="true" className="nav-underline" />
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                onClick={() => setProductsOpen((v) => !v)}
                onPointerEnter={(e) => moveUnderline(e.currentTarget)}
                data-nav-current={
                  pathname.startsWith("/products") ? "" : undefined
                }
                className="nav-link flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-fg-muted"
                data-nav-solid={pathname.startsWith("/products") ? "" : undefined}
              >
                Products
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-[var(--duration-base)] ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.25}
                />
              </button>

              {/* Anchored to the trigger's LEFT edge, not centred on it. The
                  Products button sits near the left of the page, so a centred
                  42rem panel hung off the viewport at every width below 1440
                  â€” measured at -96px on a 1024 screen. Opening rightwards
                  from the trigger keeps it on screen from 1024 (where the
                  dropdown first appears) up, and the max-width is the
                  backstop for anything narrower. */}
              {dropdown.mounted && (
                <div
                  className={[
                    "absolute left-0 top-full w-[40rem] max-w-[calc(100vw-3rem)] pt-3",
                    "origin-top-left transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    dropdown.active
                      ? "translate-y-0 scale-100 opacity-100"
                      : "-translate-y-2 scale-[0.985] opacity-0",
                  ].join(" ")}
                >
                  {/* No backdrop-blur: the surface behind it is opaque
                      white, so the filter had nothing to blur and only cost
                      a compositing layer â€” one that rendered the panel
                      intermittently translucent over the hero. */}
                  <div className="dropdown-panel">
                    {/* auto-rows-fr: the five products go into a 2-column
                        grid and one of the names wraps to two lines, which
                        left the rows ragged and the columns out of step.
                        Equal-height rows fix it without truncating anything. */}
                    <div className="grid auto-rows-fr grid-cols-2 gap-1.5">
                      {nav.products.map((p, i) => {
                        const Icon =
                          ICONS[p.icon as keyof typeof ICONS] ?? Network;
                        // An odd product count leaves the last cell beside an
                        // empty one. Spanning it reads as deliberate and buys
                        // the longest blurb a single line.
                        const lonely =
                          i === nav.products.length - 1 &&
                          nav.products.length % 2 === 1;
                        const content = (
                          <>
                            <span className={`grad-badge ${iconTint(i)} mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-control border`}>
                              <Icon className="h-4 w-4" strokeWidth={1.75} />
                            </span>
                            <span className="min-w-0">
                              {/* Subtitle on its own line. Inline, a long
                                  name like "Series Booking Portal (Fixed
                                  Departures)" wrapped mid-parenthesis and
                                  dragged that row taller than its neighbour. */}
                              <span className="block text-sm font-medium leading-snug text-fg">
                                {p.name}
                                {p.subtitle && (
                                  <span className="font-normal text-fg-subtle">
                                    {" "}
                                    {" - "}
                                    {p.subtitle}
                                  </span>
                                )}
                              </span>
                              <span className="mt-1 block text-xs leading-relaxed text-fg-subtle">
                                {p.blurb}
                              </span>
                            </span>
                          </>
                        );

                        return (
                          <a
                            key={p.href}
                            href={p.href}
                            onClick={() => setProductsOpen(false)}
                            className={`dropdown-item group flex h-full gap-3 p-3 ${
                              lonely ? "col-span-2" : ""
                            }`}
                          >
                            {content}
                          </a>
                        );
                      })}
                    </div>
                    <div className="dropdown-footer mt-2.5 flex items-center justify-between gap-4 px-4 py-3">
                      <p className="text-xs text-fg-muted">
                        Not sure which product you need?
                      </p>
                      <a
                        href="/contact#consultation-form"
                        onClick={() => setProductsOpen(false)}
                        className="text-xs font-semibold text-accent hover:text-accent-hover"
                      >
                        Request a consultation -&gt;
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onPointerEnter={(e) => moveUnderline(e.currentTarget)}
                data-nav-current={pathname === l.href ? "" : undefined}
                aria-current={pathname === l.href ? "page" : undefined}
                className="nav-link rounded-control px-3 py-2 text-sm font-medium text-fg-body aria-[current=page]:text-fg"
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* ---- Desktop actions ----
              CTA HIERARCHY. Three purple CTAs used to share the first
              viewport â€” this one, "Request a Demo" and "Explore the
              platform" â€” and the eye had no reason to land on the hero
              first. The hero CTA keeps the gradient; this one drops to the
              outlined treatment and the phone number drops to plain muted
              text, so the row reads as: number, quiet button, and the loud
              one is down in the hero where the argument is. */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-normal text-accent"
            >
              <Phone className="h-4 w-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
              {site.contact.phone}
            </a>
            {/* Always on. Phase 1 held this back until the hero CTA had
                scrolled away, on the rule that two demo CTAs must never share
                a viewport; the demo button being reachable from anywhere on
                the page wins that trade. */}
            <Link href="/demo" className="nav-demo-cta btn btn-secondary">
              Book demo
            </Link>
          </div>

          {/* ---- Mobile actions: one CTA, then the toggle ----
              The phone number is not here by design â€” it lives in the sheet.
              Logo + one CTA + hamburger is all a 375px bar holds. */}
          <Link
            href="/demo"
            className="btn btn-primary ml-auto h-11 px-4 text-sm lg:hidden"
          >
            Book demo
          </Link>

          {/* ---- Mobile toggle ---- */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong bg-canvas-alt text-fg lg:hidden"
          >
            {menuOpen ? (
              <X className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
            ) : (
              <Menu className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
            )}
          </button>
        </nav>
      </header>

      {/* ---- Mobile sheet ---- */}
      {menu.mounted && (
        <div
          id="mobile-menu"
          className={[
            "fixed inset-0 z-40 overflow-y-auto bg-canvas/97 pb-28 pt-16 backdrop-blur-xl lg:hidden",
            "transition-opacity duration-[var(--duration-fast)]",
            menu.active ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div className="container-page py-6">
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Products
            </p>
            <div className="grid gap-1">
              {nav.products.map((p) => {
                const Icon = ICONS[p.icon as keyof typeof ICONS] ?? Network;
                const content = (
                  <>
                    <span className="grad-badge grid h-8 w-8 shrink-0 place-items-center rounded-control border">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="text-[0.9375rem] font-medium text-fg">
                      {p.name}
                      {p.subtitle && (
                        <span className="font-normal text-fg-subtle">
                          {" "}
                          ({p.subtitle})
                        </span>
                      )}
                    </span>
                  </>
                );

                return (
                  <a
                    key={p.href}
                    href={p.href}
                    onClick={() => setMenuOpen(false)}
                    className="dropdown-item flex items-center gap-3 border border-line bg-surface px-3.5 py-3"
                  >
                    {content}
                  </a>
                );
              })}
            </div>

            <p className="mb-3 mt-8 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Company
            </p>
            <div className="grid gap-0.5">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="rounded-control px-1 py-2.5 text-[0.9375rem] font-medium text-fg-muted aria-[current=page]:text-accent"
                >
                  {l.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-2">
              {/* /demo, not #demo. There has never been a #demo section on
                  any page, so this button silently did nothing. */}
              <Link
                href="/demo"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary btn-lg w-full"
              >
                Book Free Demo
              </Link>
              <a
                href={site.contact.phoneHref}
                className="btn btn-secondary btn-lg w-full"
              >
                Call {site.contact.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
