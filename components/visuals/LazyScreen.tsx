"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * Defers a decorative UI mockup until it is near the viewport.
 *
 * The showcase mockups are the densest markup on the page — the operations
 * dashboard alone is ~250 elements — and they are purely illustrative. Server
 * rendering them put that markup in both the HTML and the RSC payload, and
 * then made React hydrate it, all for something the visitor may never scroll
 * to. Loading them on approach keeps that entirely off the initial response.
 *
 * There is no layout shift: the enclosing FitScreen reserves the exact box
 * via `aspect-ratio`, so the space is already correct while empty.
 */
const LOADERS = {
  dashboard: () =>
    import("./DashboardMock").then((m) => m.BookingDashboard as ComponentType),
  reports: () =>
    import("./DashboardMock").then((m) => m.ReportsPanel as ComponentType),
  wallet: () =>
    import("./DashboardMock").then((m) => m.MobileWallet as ComponentType),
};

export function LazyScreen({ kind }: { kind: keyof typeof LOADERS }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Screen, setScreen] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const load = () =>
      LOADERS[kind]().then((C) => {
        if (!cancelled) setScreen(() => C);
      });

    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        load();
      },
      // Generous margin so it is already painted by the time it scrolls in
      { rootMargin: "700px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [kind]);

  return (
    <div ref={ref} className="h-full w-full">
      {Screen ? <Screen /> : null}
    </div>
  );
}
