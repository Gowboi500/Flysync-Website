"use client";

import { useEffect, useState } from "react";

/**
 * The office coordinates in the footer, with the local time on hover.
 *
 * Two constraints shaped this.
 *
 * It cannot render a clock on the server. The build machine's clock and the
 * visitor's are different numbers, so any time in the initial HTML is a
 * hydration mismatch — and a stale one, since a statically-rendered page
 * would ship whatever time the build ran at. The slot is empty until the
 * component mounts.
 *
 * It cannot lay the time out on hover. Adding a node when the pointer
 * arrives reflows the footer's bottom bar and registers as layout shift on
 * an interaction the visitor did not ask to be jarring. The slot is a fixed
 * width in tabular figures, present from the start, and only its opacity
 * changes.
 *
 * The interval only exists while the pointer is over the label. It is one
 * timer either way, but a clock nobody is looking at should not be waking
 * the main thread once a second for the length of the session.
 */
const IST = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function Coordinates({ lat, lon }: { lat: string; lon: string }) {
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!hovered) return;

    const tick = () => setTime(IST.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <span
      className="flex items-center gap-2"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <span className="tnum font-mono text-[0.6875rem]">
        {lat}, {lon}
      </span>
      <span
        // aria-hidden: the coordinates are the content, the clock is a
        // flourish, and a value that changes every second is noise to a
        // screen reader.
        aria-hidden="true"
        className={`tnum w-[6.25rem] whitespace-nowrap font-mono text-[0.6875rem] transition-opacity duration-[250ms] ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {time && `· ${time} IST`}
      </span>
    </span>
  );
}
