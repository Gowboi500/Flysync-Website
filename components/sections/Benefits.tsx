import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { Icon } from "@/components/ui/Icon";
import { cardTint, iconTint } from "@/components/ui/iconTints";
import { home } from "@/lib/pages";

/**
 * "Why Travel Businesses Choose Flysync" — outcomes, not capabilities.
 *
 * This section deliberately talks about business results (revenue, time,
 * visibility). The product cards above it cover *what* each product is, and
 * the dashboard band below covers *what you see*. Keeping those three angles
 * separate is what stops the page repeating itself.
 */
export function Benefits() {
  return (
    <section id="why" className="section atmo atmo-pink-top relative">
      <div
        aria-hidden="true"
        className="bg-grid-sm pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_8%,transparent_62%)]"
      />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={home.why.eyebrow}
          title={home.why.heading}
          body={home.why.body}
        />

        {/* Same light field as Solutions: purple left, pink right, behind
            the grid rather than on the cards. */}
        <SpotlightGroup className="card-field reveal-group mt-[var(--heading-gap)] grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {home.why.benefits.map((b, i) => (
            <StaggerItem key={b.title} index={i}>
              <article
                data-spotlight
                className={`surface ${cardTint(i)} group h-full rounded-card p-6`}
              >
                <span
                  className={`grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}
                >
                  <Icon name={b.icon} className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-semibold text-fg">
                  {b.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                  {b.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
