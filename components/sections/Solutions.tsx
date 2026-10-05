import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { Icon } from "@/components/ui/Icon";
import { cardTint, iconTint } from "@/components/ui/iconTints";
import { productPages } from "@/lib/products";
import { home } from "@/lib/pages";

/** "Our Solutions" — the five products, each linking to its own page. */
export function Solutions() {
  return (
    <section id="solutions" className="section atmo atmo-cards relative">
      <div className="container-page">
        <SectionHeading
          eyebrow={home.solutions.eyebrow}
          title={home.solutions.heading}
          body={home.solutions.body}
        />

        {/* One div is both the stagger group and the spotlight host. */}
        {/* card-field: purple light under the left column, pink under the
            right, painted behind the grid. The cards themselves stay white. */}
        <SpotlightGroup className="card-field reveal-group mt-[var(--heading-gap)] grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productPages.map((p, i) => (
            <StaggerItem key={p.slug} index={i}>
              <Link
                href={`/products/${p.slug}`}
                data-spotlight
                className={`card-lux ${cardTint(i)} group flex h-full flex-col p-8`}
              >
                <span className={`grad-badge ${iconTint(i)} grid h-11 w-11 place-items-center rounded-control border`}>
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-[-0.015em] text-fg">
                  {p.name}
                  {p.subtitle && (
                    <span className="font-normal text-fg-subtle">
                      {" "}
                      – {p.subtitle}
                    </span>
                  )}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-fg-muted">
                  {p.card.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
                    strokeWidth={2.25}
                  />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </SpotlightGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 text-center">
            <Link href="/products" className="solutions-cta btn btn-secondary btn-lg">
              {home.solutions.cta}
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
