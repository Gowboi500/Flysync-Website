import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { iconTint } from "@/components/ui/iconTints";
import { Counter } from "@/components/ui/Counter";
import { home } from "@/lib/pages";

/**
 * Customer Success + "more than software".
 *
 * Most of these figures are qualitative — "Millions", "Multiple",
 * "Dedicated" — and stay as plain text. Only a value that is actually a
 * number counts up, and the suffix is split off and left outside the
 * counter so the "+" holds still while the digits move.
 *
 * Counter itself never renders a zero: the real value is its initial state,
 * so it is correct in the HTML and correct on first paint, and it only
 * rewinds to animate when the element is below the fold where the rewind is
 * invisible. A counter that starts at zero next to a trust claim is worse
 * than no animation at all.
 */
const NUMERIC = /^(\d+(?:\.\d+)?)(\D*)$/;

const PARTNER_BODY_LINES = [
  ["Built by experts in travel operations", "and distribution challenges."],
  ["Frequent upgrades keep your business", "ahead of market changes."],
  ["Guided support from implementation", "through everyday growth."],
  ["Scales from startups to agencies", "and enterprise travel teams."],
];

function Metric({ value }: { value: string }) {
  const parts = NUMERIC.exec(value);
  if (!parts) return <>{value}</>;

  const [, digits, suffix] = parts;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;

  return (
    <>
      <Counter value={Number(digits)} decimals={decimals} className="tnum" />
      {suffix}
    </>
  );
}
export function CustomerSuccess() {
  return (
    <section id="customers" className="section atmo atmo-stats relative">
      <div className="container-page">
        <SectionHeading
          eyebrow={home.success.eyebrow}
          title={home.success.heading}
          body={home.success.body}
        />

        {/* One gradient band rather than four white cards — the figures are
            reversed out of the brand ramp. Same metrics, same order, same
            copy; only the surface they sit on changed.

            The band takes --brand-gradient-ink because it carries text: the
            label is 14px and needs the full 4.5:1, which the decorative
            pink tail does not give. See .brand-band. */}
        <StaggerGroup className="brand-band mt-[var(--heading-gap)] grid overflow-hidden rounded-[var(--radius-band-lux)] shadow-[var(--shadow-stats)] sm:grid-cols-2 lg:grid-cols-4">
          {home.success.metrics.map((m, i) => (
            <StaggerItem key={m.label} index={i} className="brand-band-item">
              <div className="h-full px-6 py-9 text-center">
                <p className="text-[length:var(--text-h3)] font-semibold tracking-[-0.03em] text-white">
                  <Metric value={m.value} />
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-snug text-white">
                  {m.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ---- More than software ---- */}
        <Reveal delay={0.12}>
          <div className="mt-[var(--heading-gap)] rounded-card border border-line bg-canvas-alt px-6 py-12 sm:px-10 sm:py-14">
            <h3 className="mx-auto max-w-2xl text-center text-[length:var(--text-h3)] font-semibold leading-[1.14] tracking-[-0.03em] text-fg">
              {home.partner.heading}
            </h3>

            <div className="mt-10 grid gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
              {home.partner.points.map((p, i) => (
                <div
                  key={p.title}
                  className={`lg:px-8 ${
                    i === 0 ? "" : "lg:border-l lg:border-line"
                  }`}
                >
                  <span className={`grad-badge ${iconTint(i)} grid h-10 w-10 place-items-center rounded-control border`}>
                    <Icon name={p.icon} className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <h4 className="mt-4 text-[0.9375rem] font-semibold text-fg">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                    {(PARTNER_BODY_LINES[i] ?? [p.body]).map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
