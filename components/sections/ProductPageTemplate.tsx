import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  CTABanner,
  ChallengeGrid,
  FeatureGrid,
  PageHero,
  SplitBand,
  Steps,
} from "@/components/ui/Blocks";
import { CheckList } from "@/components/ui/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FitScreen } from "@/components/visuals/FitScreen";
import { PRODUCT_SCREENS } from "@/components/visuals/ProductScreens";
import { API_OUT_PARTNERS } from "@/lib/apiPartners";
import { SCREEN_SIZE } from "@/lib/screens";
import type { ProductPage } from "@/lib/products";

function featureIconFor(title: string, fallback: string) {
  const text = title.toLowerCase();

  if (text.includes("agent") || text.includes("sub agent")) return "Users";
  if (text.includes("markup") || text.includes("pricing") || text.includes("fare") || text.includes("promotion") || text.includes("offer")) return "Tags";
  if (text.includes("inventory") || text.includes("package")) return "Layers";
  if (text.includes("credit") || text.includes("wallet") || text.includes("payment") || text.includes("expense") || text.includes("cost")) return "Wallet";
  if (text.includes("booking") || text.includes("reservation")) return "CalendarRange";
  if (text.includes("report") || text.includes("analytics") || text.includes("insight") || text.includes("dashboard")) return "LineChart";
  if (text.includes("supplier") || text.includes("api") || text.includes("integration")) return "Plug";
  if (text.includes("notification") || text.includes("reminder") || text.includes("follow up")) return "Bell";
  if (text.includes("departure") || text.includes("calendar")) return "CalendarRange";
  if (text.includes("passenger") || text.includes("customer") || text.includes("employee") || text.includes("team")) return "Users";
  if (text.includes("website") || text.includes("seo")) return "Globe";
  if (text.includes("flight")) return "Plane";
  if (text.includes("hotel")) return "Hotel";
  if (text.includes("mobile") || text.includes("responsive")) return "Smartphone";
  if (text.includes("secure") || text.includes("policy") || text.includes("access")) return "ShieldCheck";
  if (text.includes("inquiries") || text.includes("respond")) return "Search";
  if (text.includes("productivity") || text.includes("workflow") || text.includes("approval")) return "Zap";
  if (text.includes("scale") || text.includes("growth")) return "TrendingUp";
  if (text.includes("platform") || text.includes("centralized")) return "LayoutDashboard";

  return fallback;
}

/** The framed dark mockup used in each product hero. */
function ProductScreen({ slug }: { slug: string }) {
  const Screen = PRODUCT_SCREENS[slug];
  if (!Screen) return null;
  const screenSize =
    slug === "corporate-booking-portal-sign-in"
      ? { w: 1440, h: 1024 }
      : slug === "corporate-booking-portal-trip-search"
      ? { w: 2974, h: 2116 }
      : slug === "b2b-portal"
      ? { w: 2880, h: 2048 }
      : slug === "b2b-portal-solution"
        ? { w: 2880, h: 2304 }
        : slug === "series-booking-portal"
        ? { w: 2176, h: 1731 }
        : slug === "series-booking-portal-solution"
          ? { w: 2880, h: 2048 }
        : slug === "vacay365"
          ? { w: 4320, h: 3123 }
        : slug === "vacay365-solution"
          ? { w: 2880, h: 2240 }
        : slug === "b2c-portal"
          ? { w: 3840, h: 2048 }
        : slug === "b2c-portal-solution"
          ? { w: 3840, h: 2274 }
        : slug === "b2c-portal-built-in"
          ? { w: 3840, h: 3004 }
        : SCREEN_SIZE.product;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-card"
        style={{
          background:
            "var(--brand-glow)",
        }}
      />
      <div className="relative overflow-hidden rounded-card border border-line bg-white shadow-[var(--shadow-lifted)]">
        <FitScreen
          designWidth={screenSize.w}
          designHeight={screenSize.h}
          className="w-full"
        >
          <Screen />
        </FitScreen>
      </div>
    </div>
  );
}

function ApiOutPartnersBlock({
  content,
}: {
  content: NonNullable<ProductPage["apiOutPartners"]>;
}) {
  const [bodyBeforeCount, bodyAfterCount] = content.body.split("250+");
  const body =
    bodyAfterCount === undefined ? (
      content.body
    ) : (
      <>
        {bodyBeforeCount}
        <span className="font-semibold text-accent">250+</span>
        {bodyAfterCount}
      </>
    );

  return (
    <section className="section relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="API Out"
          title={content.heading}
          body={body}
        />
        <Reveal delay={0.08}>
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {API_OUT_PARTNERS.map((partner) => (
              <li key={partner.name} className="w-full max-w-[11.5rem]">
                <div className="flex h-[5rem] w-full items-center justify-center rounded-[1.25rem] border border-line bg-white px-6 ring-1 ring-sky-100/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className={
                      partner.className ??
                      "max-h-11 max-w-[9.75rem] object-contain"
                    }
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function ProductPageTemplate({ product }: { product: ProductPage }) {
  // Vacay365's benefit list is a plain checklist in the source content
  const benefitsAreChecklist = product.benefits.items.every((b) => !b.body);
  const heroScreenSlug =
    product.slug === "corporate-booking-portal"
      ? "corporate-booking-portal-sign-in"
      : product.slug;
  const solutionScreenSlug =
    product.slug === "corporate-booking-portal"
      ? "corporate-booking-portal-trip-search"
      : product.slug === "b2b-portal"
        ? "b2b-portal-solution"
        : product.slug === "series-booking-portal"
          ? "series-booking-portal-solution"
          : product.slug === "b2c-portal"
            ? "b2c-portal-solution"
            : product.slug === "vacay365"
              ? "vacay365-solution"
              : product.slug;

  return (
    <>
      <PageHero
        eyebrow={
          product.subtitle ? `${product.name} · ${product.subtitle}` : product.name
        }
        headline={product.hero.headline}
        sub={product.hero.sub}
        aside={<ProductScreen slug={heroScreenSlug} />}
      >
        <Link href="/demo" className="btn btn-primary btn-lg group">
          Request Demo
          <ArrowRight
            className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
            strokeWidth={2.25}
          />
        </Link>
        <Link href="/products" className="btn btn-secondary btn-lg">
          All products
        </Link>
      </PageHero>

      {/* ---- Trusted by ---- */}
      <section className="relative border-y border-line bg-canvas-alt py-14">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[length:var(--text-h4)] font-semibold tracking-[-0.025em] text-fg">
                {product.trusted.heading}
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">
                {product.trusted.body}
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2">
                {product.heroShows.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {product.apiOutPartners && (
        <ApiOutPartnersBlock content={product.apiOutPartners} />
      )}

      <ChallengeGrid
        tint
        eyebrow="Common challenges"
        heading={product.challenges.heading}
        items={product.challenges.items}
      />

      {/* ---- Solution ---- */}
      <SplitBand
        eyebrow="The solution"
        heading={product.solution.heading}
        body={<p>{product.solution.body}</p>}
        aside={<ProductScreen slug={solutionScreenSlug} />}
        clip
        reverse
      />

      {/* The one Type B band on a product page: it sits between the solution
          split and the benefits, breaking what was five base-white sections
          in a row. The dark anchor and dark footer come from CTABanner. */}
      <FeatureGrid
        tint
        eyebrow="Key features"
        heading={product.features.heading}
        items={product.features.items.map((f) => ({
          ...f,
          icon: featureIconFor(f.title, product.icon),
        }))}
      />

      {benefitsAreChecklist ? (
        <CheckList
          eyebrow="Business benefits"
          heading={product.benefits.heading}
          items={product.benefits.items.map((b) => b.title)}
        />
      ) : (
        <section className="section product-benefits--green relative">
          <div className="container-page">
            <SectionHeading
              eyebrow="Business benefits"
              title={product.benefits.heading}
            />
            <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
              {product.benefits.items.map((b, i) => (
                <Reveal key={b.title}>
                  <article className="surface card-tint-border--green h-full rounded-card p-6">
                    <span className="grad-badge grad-badge--green grid h-8 w-8 place-items-center rounded-control">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-fg">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                      {b.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Steps heading={product.steps.heading} items={product.steps.items} />

      {product.slug !== "corporate-booking-portal" &&
        product.extras?.map((x) => (
          <SplitBand
            key={x.heading}
            eyebrow="Built in"
            heading={x.heading}
            body={<p>{x.body}</p>}
            aside={
              <ProductScreen
                slug={
                  product.slug === "b2c-portal"
                    ? "b2c-portal-built-in"
                    : product.slug
                }
              />
            }
            clip
          />
        ))}

      {product.integrations && (
        <section className="section relative">
          <div className="container-page">
            <SectionHeading
              eyebrow="Integrations"
              title={product.integrations.heading}
              body={product.integrations.body}
            />
          </div>
        </section>
      )}

      <CTABanner heading={product.cta.heading} body={product.cta.body}>
        <Link href="/demo" className="btn btn-primary btn-lg group">
          Request a Free Demo
          <ArrowRight
            className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
            strokeWidth={2.25}
          />
        </Link>
        <Link href="/contact" className="btn btn-secondary btn-lg">
          Talk to our team
        </Link>
      </CTABanner>
    </>
  );
}
