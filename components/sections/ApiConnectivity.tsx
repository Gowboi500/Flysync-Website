import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { API_IN_PARTNERS } from "@/lib/apiPartners";

export function ApiConnectivity() {
  return (
    <section
      id="api-connectivity"
      className="relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="api-connectivity-heading"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">API In Connectivity</p>
            <h2
              id="api-connectivity-heading"
              className="mt-3 text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.045em] text-fg"
            >
              Connecting <span className="text-accent">150+</span> Travel Businesses Through APIs
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed text-fg-body">
              Flysync brings airline, GDS, consolidator and supplier API-in connections into one
              reliable platform, helping travel teams search, book, manage fares and control
              inventory without switching between systems.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <StaggerGroup className="mx-auto mt-10 grid max-w-6xl grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {API_IN_PARTNERS.map((partner, index) => (
              <StaggerItem key={partner.name} index={index} className="w-full max-w-[11.5rem]">
                <div className="flex h-[5rem] w-full items-center justify-center rounded-[1.25rem] border border-line bg-white px-6 ring-1 ring-sky-100/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className={partner.className ?? "max-h-11 max-w-[9.75rem] object-contain"}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </div>
    </section>
  );
}
