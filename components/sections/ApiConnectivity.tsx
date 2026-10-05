import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

const API_PARTNERS = [
  { name: "TBO", logo: "/images/api-logos/tbo-official.svg" },
  {
    name: "Riya",
    logo: "/images/api-logos/riya-official.png",
    className: "h-16 w-auto max-w-[8.5rem] object-contain",
  },
  { name: "AIR IQ", logo: "/images/api-logos/airiq-official.png" },
  { name: "BookNTravel", logo: "/images/api-logos/bookntravel-official.png" },
  { name: "Alhind", logo: "/images/api-logos/alhind.png" },
  { name: "Cleartrip", logo: "/images/api-logos/cleartrip-cropped.png" },
  { name: "Tripjack", logo: "/images/api-logos/tripjack-official.png" },
  {
    name: "ORN",
    logo: "/images/api-logos/orn.png",
    className: "max-h-14 max-w-[4.25rem] object-contain",
  },
  { name: "FlightsMojo", logo: "/images/api-logos/flightsmojo.png" },
  { name: "Travelogy", logo: "/images/api-logos/travelogy-replacement.png" },
];

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
            <p className="section-eyebrow">API Connectivity</p>
            <h2
              id="api-connectivity-heading"
              className="mt-3 text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.045em] text-fg"
            >
              Connecting <span className="text-accent">150+</span> Travel Businesses Through APIs
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed text-fg-body">
              Flysync brings flight, hotel, payment, and supplier API connections into one reliable
              platform, helping travel teams search, book, manage fares, and distribute inventory
              without switching between systems.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <StaggerGroup className="mx-auto mt-10 grid max-w-6xl grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {API_PARTNERS.map((partner, index) => (
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
