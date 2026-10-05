"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { site } from "@/lib/site";

/** WhatsApp glyph — not available in Lucide, so inlined. */
export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 0 16.48Z" />
    </svg>
  );
}

/**
 * Both bars stay mounted and slide/fade via CSS. They are two small nodes, so
 * keeping them in the tree costs less than the machinery needed to animate a
 * mount and an unmount.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reveal once the visitor is past the hero. On the demo page itself the
    // form is the page, so the bar would be redundant.
    const onDemoPage = window.location.pathname.startsWith("/demo");
    const onScroll = () => setVisible(!onDemoPage && window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = "translate-y-0 opacity-100";
  const hidden = "pointer-events-none translate-y-full opacity-0";

  return (
    <>
      {/* ---- Mobile: bottom action bar ---- */}
      <div
        aria-hidden={!visible}
        className={[
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden",
          "transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible ? shown : hidden,
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/demo"
            tabIndex={visible ? 0 : -1}
            className="btn btn-primary flex-1"
          >
            <CalendarCheck className="h-4 w-4" strokeWidth={2} />
            Book Free Demo
          </Link>
          <a
            href={site.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visible ? 0 : -1}
            aria-label="Chat with Flysync sales on WhatsApp"
            className="grid h-[2.875rem] w-[2.875rem] shrink-0 place-items-center rounded-full bg-[#25D366] text-black ring-2 ring-white shadow-[0_6px_18px_rgba(15,23,42,0.14)]"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* ---- Desktop: floating WhatsApp ---- */}
      <a
        href={site.contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Flysync sales on WhatsApp"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={[
          // The white ring is what keeps the green disc clean on a tinted
          // section: brand green straight onto a purple-washed background
          // reads as a sticker. Ring, not border, so the disc does not grow.
          "group fixed bottom-7 right-7 z-40 hidden items-center gap-0 overflow-hidden rounded-full bg-[#25D366] p-3.5 text-black ring-2 ring-white shadow-[0_8px_24px_rgba(15,23,42,0.16)] lg:flex",
          "transition-[gap,padding,opacity,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-2 hover:pr-5",
          visible
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-75 opacity-0",
        ].join(" ")}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-[250ms] group-hover:max-w-[10rem] group-hover:opacity-100">
          Chat with sales
        </span>
      </a>
    </>
  );
}
