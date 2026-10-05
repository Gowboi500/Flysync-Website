import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/lib/pages";
import { Reveal } from "@/components/ui/Reveal";
import { FitScreen } from "@/components/visuals/FitScreen";
import { SCREEN_SIZE } from "@/lib/screens";

/* ------------------------------------------------------------------ */
/* Device frames — pure CSS, no images                                 */
/* ------------------------------------------------------------------ */

function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* Lid */}
      <div className="relative rounded-t-[0.875rem] border border-ink-600 border-b-0 bg-gradient-to-b from-ink-700 to-ink-850 p-[0.4375rem] pb-0 shadow-[var(--shadow-device)] sm:rounded-t-xl sm:p-2.5 sm:pb-0">
        {/* Camera notch */}
        <div className="absolute left-1/2 top-[0.1875rem] h-1 w-1 -translate-x-1/2 rounded-full bg-line-strong sm:top-1" />
        <div className="overflow-hidden rounded-t-[0.5rem] border border-ink-800 border-b-0 bg-white sm:rounded-t-md">
          <FitScreen
            designWidth={SCREEN_SIZE.dashboard.w}
            designHeight={SCREEN_SIZE.dashboard.h}
            className="w-full"
          >
            {children}
          </FitScreen>
        </div>
      </div>
      {/* Base */}
      <div className="relative h-2.5 rounded-b-[0.625rem] border border-ink-600 bg-gradient-to-b from-ink-700 to-ink-800 sm:h-3.5">
        <div className="absolute left-1/2 top-0 h-1 w-14 -translate-x-1/2 rounded-b-lg bg-canvas-alt sm:w-20" />
      </div>
      {/* Foot shadow */}
      <div
        aria-hidden="true"
        className="mx-auto h-6 w-[86%] rounded-[50%] bg-black/20 blur-xl"
      />
    </div>
  );
}

function Tablet({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.125rem] border border-ink-600 bg-gradient-to-b from-ink-700 to-ink-850 p-2 shadow-[var(--shadow-device)] sm:rounded-[1.375rem] sm:p-2.5">
      <div className="overflow-hidden rounded-[0.625rem] border border-ink-800 bg-white sm:rounded-control">
        <FitScreen
          designWidth={SCREEN_SIZE.reports.w}
          designHeight={SCREEN_SIZE.reports.h}
          className="w-full"
        >
          {children}
        </FitScreen>
      </div>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.375rem] border border-ink-600 bg-gradient-to-b from-ink-700 to-ink-850 p-[0.3125rem] shadow-[var(--shadow-device)] sm:rounded-[1.625rem] sm:p-1.5">
      <div className="relative overflow-hidden rounded-[1.0625rem] border border-ink-800 bg-white sm:rounded-[1.25rem]">
        {/* Dynamic-island style cutout */}
        <div className="absolute left-1/2 top-1.5 z-10 h-2.5 w-12 -translate-x-1/2 rounded-full bg-black" />
        <FitScreen
          designWidth={SCREEN_SIZE.wallet.w}
          designHeight={SCREEN_SIZE.wallet.h}
          className="w-full"
        >
          {children}
        </FitScreen>
      </div>
    </div>
  );
}

function DashboardScreenshot({
  className = "",
  sizes,
}: {
  className?: string;
  sizes: string;
}) {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/admin-dashboard-series-logo-lg.jpg"
        alt=""
        fill
        sizes={sizes}
        className={`object-cover object-top ${className}`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */



/* atmo-stage is the one section allowed to echo the hero at full strength —
   purple left, pink right at 8% — so the device cluster floats rather than
   sitting on paper. It replaces the single centred --brand-glow blob, which
   lit the middle and left both edges flat. */
export function Showcase() {
  return (
    <section
      id="showcase"
      className="section atmo atmo-stage relative overflow-hidden"
    >
      <div className="container-page relative">
        <SectionHeading
          eyebrow={home.dashboard.eyebrow}
          title={home.dashboard.heading}
          body={home.dashboard.body}
        />

        <div className="relative mx-auto mt-[var(--heading-gap)] max-w-6xl">
          {/* One DOM tree for both layouts. Rendering separate desktop and
              mobile compositions duplicated three large mockup subtrees into
              every response; CSS `order` reflows the same nodes instead.
              Small: laptop full width, then tablet + phone side by side.
              Large: tablet | laptop | phone in a single row. */}
          <div className="grid grid-cols-[1.55fr_1fr] items-center gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-[0.92fr_2.55fr_0.7fr] lg:gap-5">
            <div className="order-2 lg:order-1 lg:translate-y-4">
              <div
                className="shot-reveal"
                style={{ ["--d" as string]: "0.14s" } as object}
              >
                <Tablet>
                  <DashboardScreenshot
                    sizes="(min-width: 1024px) 215px, 37vw"
                    className="object-[58%_top]"
                  />
                </Tablet>
              </div>
            </div>

            <div className="order-1 col-span-2 lg:order-2 lg:col-span-1">
              <div className="shot-reveal">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-8 rounded-[3rem]"
                    style={{
                      background:
                        "var(--brand-glow)",
                    }}
                  />
                  <div className="relative">
                    <Laptop>
                      <DashboardScreenshot
                        sizes="(min-width: 1280px) 590px, (min-width: 1024px) 50vw, 100vw"
                      />
                    </Laptop>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-3 lg:-translate-y-4">
              <div
                className="shot-reveal"
                style={{ ["--d" as string]: "0.28s" } as object}
              >
                <Phone>
                  <DashboardScreenshot
                    sizes="(min-width: 1024px) 165px, 28vw"
                    className="object-[60%_top]"
                  />
                </Phone>
              </div>
            </div>
          </div>

          {/* ---- Dashboard highlights ---- */}
          <Reveal delay={0.2}>
            <ul className="mt-14 flex flex-wrap justify-center gap-2 border-t border-line pt-10">
              {home.dashboard.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-[0.8125rem] font-medium text-fg-muted"
                >
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
