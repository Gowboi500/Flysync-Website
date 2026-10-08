/**
 * One representative screen per product. Built from shared atoms so all
 * eight read as the same product, not eight different apps.
 */

import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleDot,
  Clock,
  Plane,
  Search,
  Users,
} from "lucide-react";
import { LiveMock, LiveNumber } from "./LiveMock";
import { ScreenLogo } from "./DashboardLive";

/* ---------------- shared atoms ---------------- */

function Frame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <LiveMock className="screen-ui flex h-full flex-col overflow-hidden">
      <div className="sc-well flex items-center gap-2 border-x-0 border-t-0 px-3 py-2">
        <ScreenLogo className="h-[0.875rem]" />
        <span className="sc-divide border-l pl-2 text-[0.625rem] font-medium text-fg">
          {title}
        </span>
        <span className="ml-auto flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--screen-line-strong)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--screen-line-strong)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--screen-line-strong)]" />
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">{children}</div>
    </LiveMock>
  );
}

function SearchBar({ text = "MAA → DXB · 12 Aug · 2 Adults" }: { text?: string }) {
  return (
    <div className="sc-well flex items-center gap-2 rounded-md px-2.5 py-2">
      <Search className="sc-accent h-3 w-3 shrink-0" strokeWidth={2.25} />
      <span className="min-w-0 flex-1 truncate text-[0.625rem] text-fg-muted">
        {text}
      </span>
      <span className="sc-badge shrink-0 rounded px-1.5 py-0.5 text-[0.5rem] font-semibold">
        Search
      </span>
    </div>
  );
}

function FareRow({
  carrier,
  time,
  price,
  badge,
  highlight,
  i = 0,
}: {
  carrier: string;
  time: string;
  price: string;
  badge?: string;
  highlight?: boolean;
  /** Stagger position. */
  i?: number;
}) {
  return (
    <div
      style={{ ["--i" as string]: i } as React.CSSProperties}
      className={[
        "lv-row flex items-center gap-2 rounded-md px-2.5 py-2",
        highlight ? "sc-well border-[var(--screen-accent)]/40 bg-[var(--screen-accent-soft)]" : "sc-well",
      ].join(" ")}
    >
      <span className="sc-accent-bg grid h-5 w-5 shrink-0 place-items-center rounded">
        <Plane className="sc-accent h-2.5 w-2.5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.5625rem] font-medium text-fg">
          {carrier}
        </span>
        <span className="block text-[0.5rem] text-fg-subtle">{time}</span>
      </span>
      {badge && (
        <span
          className={[
            "shrink-0 rounded px-1.5 py-0.5 text-[0.4375rem] font-medium",
            // Only the winning fare breathes. A pulse on every badge is
            // three things blinking; a pulse on one is the recommendation.
            highlight
              ? "lv-breathe bg-[#eeedfe] sc-accent"
              : "bg-[#eeeef2] text-fg-muted",
          ].join(" ")}
        >
          {badge}
        </span>
      )}
      <span className="shrink-0 text-[0.625rem] font-semibold text-fg">
        {price}
      </span>
    </div>
  );
}

/**
 * `count` opts one stat into a count-up. Deliberately one per screen: a strip
 * where every number is moving reads as a slot machine, whereas a single
 * number climbing reads as the one metric the screen is about.
 */
function StatStrip({
  items,
}: {
  items: { l: string; v: string; count?: { to: number; group?: boolean } }[];
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))` }}>
      {items.map((s) => (
        <div key={s.l} className="sc-card rounded-md px-2 py-1.5">
          <p className="truncate text-[0.5rem] text-fg-subtle">{s.l}</p>
          <p className="mt-0.5 text-[0.75rem] font-semibold tracking-tight text-fg">
            {s.count ? (
              <LiveNumber value={s.count.to} group={s.count.group} countMs={1100} />
            ) : (
              s.v
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- per-product screens ---------------- */

function B2BScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/insight-b2b.png"
        alt="Flysync B2B portal insights dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
        priority
      />
    </LiveMock>
  );

  return (
    <Frame title="Sub-agent portal">
      <div className="space-y-2">
        <StatStrip
          items={[
            { l: "Active agents", v: "184" },
            { l: "Wallet float", v: "₹62.4L" },
            {
              l: "Today",
              v: "312",
              count: { to: 312 },
            },
          ]}
        />
        {[
          { n: "Manpasand Travels", tier: "Platinum · 4.5% markup", bal: "₹4.86L", ok: true },
          { n: "Raj Travels", tier: "Gold · 5.0% markup", bal: "₹1.24L", ok: true },
          { n: "Flybest Holidays", tier: "Silver · 6.0% markup", bal: "₹12,400", ok: false },
          { n: "Maruti Trips", tier: "Gold · 5.0% markup", bal: "₹2.10L", ok: true },
        ].map((a, i) => (
          <div
            key={a.n}
            className="lv-row sc-well flex items-center gap-2 rounded-md px-2.5 py-2"
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <span className="sc-badge grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.4375rem] font-semibold">
              {a.n.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.5625rem] font-medium text-fg">
                {a.n}
              </span>
              <span className="block truncate text-[0.5rem] text-fg-subtle">
                {a.tier}
              </span>
            </span>
            <span
              className={`shrink-0 text-[0.5625rem] font-semibold ${a.ok ? "text-fg" : "sc-accent"}`}
            >
              {a.bal}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function B2CScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/b2c-booking-home.png"
        alt="Flysync B2C online travel booking platform"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-contain object-top"
        priority
      />
    </LiveMock>
  );

  return (
    <Frame title="yourbrand.com">
      <div className="space-y-2">
        <SearchBar />
        <FareRow carrier="IndiGo 6E-64" time="02:15 · Non-stop" price="₹18,240" badge="Cheapest" highlight i={0} />
        <FareRow carrier="Air India Express" time="04:40 · Non-stop" price="₹19,980" i={1} />
        <FareRow carrier="Air Arabia G9-464" time="06:20 · 1 stop" price="₹16,750" badge="Saver" i={2} />
        <FareRow carrier="Emirates EK-545" time="03:05 · Non-stop" price="₹28,410" badge="Fastest" i={3} />
        <div className="sc-well flex items-center justify-between rounded-md px-2.5 py-1.5">
          <span className="text-[0.5rem] text-fg-subtle">
            42 fares from 6 suppliers
          </span>
          <span className="sc-accent flex items-center gap-1 text-[0.5rem] font-medium">
            Continue <ArrowRight className="h-2 w-2" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Frame>
  );
}

function B2CResultsScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/b2c-booking-results.png"
        alt="Flysync B2C online flight search results"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-contain object-top"
      />
    </LiveMock>
  );
}

function B2CAddOnsScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/b2c-add-ons.png"
        alt="Flysync B2C add-ons and fare summary"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-contain object-top"
      />
    </LiveMock>
  );
}

function B2BBookingsScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/b2b-solution-manage-booking.jpg"
        alt="Flysync B2B portal manage booking dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
      />
    </LiveMock>
  );
}

function CorporateScreen() {
  return (
    <Frame title="Corporate travel desk">
      <div className="space-y-2">
        <StatStrip
          items={[
            {
              l: "Pending approval",
              v: "7",
              count: { to: 7 },
            },
            { l: "In policy", v: "94%" },
            { l: "MTD spend", v: "₹18.2L" },
          ]}
        />
        {[
          { n: "Ravi Shankar · BLR → SIN", cc: "Sales · CC-2041", st: "Approved", ok: true },
          { n: "Meera Iyer · MAA → DEL", cc: "Finance · CC-1180", st: "Awaiting L2", ok: false },
          { n: "Arjun Nair · HYD → DXB", cc: "Delivery · CC-3307", st: "Out of policy", ok: false },
        ].map((r, i) => (
          <div
            key={r.n}
            className="lv-row sc-well rounded-md px-2.5 py-2"
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-[0.5625rem] font-medium text-fg">
                {r.n}
              </span>
              <span
                className={[
                  "shrink-0 rounded px-1.5 py-0.5 text-[0.4375rem] font-medium",
                  r.ok
                    ? "bg-[#e8f5f0] sc-pos"
                    : r.st === "Out of policy"
                      ? "bg-[#fdeaee] sc-neg"
                      : "bg-[#eeedfe] sc-accent",
                ].join(" ")}
              >
                {r.st}
              </span>
            </div>
            <p className="mt-0.5 text-[0.5rem] text-fg-subtle">{r.cc}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function CorporateSignInScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/corporate-booking-sign-in.png"
        alt="Flysync Corporate Booking Portal sign-in screen"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-contain"
        priority
      />
    </LiveMock>
  );
}

function CorporateTripSearchScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/corporate-booking-trip-search.png"
        alt="Flysync Corporate Booking Portal trip search dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-contain"
      />
    </LiveMock>
  );
}

function SeriesScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/series-booking-fd-top.png"
        alt="Flysync series booking overview and bookings dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
        priority
      />
    </LiveMock>
  );

  const dep = [
    { d: "12 Aug", route: "MAA → CMB", sold: 138, cap: 160 },
    { d: "19 Aug", route: "MAA → CMB", sold: 96, cap: 160 },
    { d: "26 Aug", route: "MAA → BKK", sold: 152, cap: 180 },
    { d: "02 Sep", route: "MAA → BKK", sold: 41, cap: 180 },
  ];
  return (
    <Frame title="Fixed departures">
      <div className="space-y-2">
        <StatStrip
          items={[
            { l: "Departures", v: "24" },
            {
              l: "Seats sold",
              v: "1,842",
              count: { to: 1842, group: true },
            },
            { l: "Load factor", v: "78%" },
          ]}
        />
        {dep.map((r, i) => {
          const pct = Math.round((r.sold / r.cap) * 100);
          return (
            <div
              key={r.d + r.route}
              className="sc-well rounded-md px-2.5 py-2"
            >
              <div className="flex items-center gap-2 text-[0.5625rem]">
                <Clock className="h-2.5 w-2.5 shrink-0 text-fg-subtle" strokeWidth={2} />
                <span className="font-medium text-fg">{r.d}</span>
                <span className="text-fg-subtle">{r.route}</span>
                <span className="ml-auto font-medium text-fg-muted">
                  {r.sold}/{r.cap}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#101322]/[0.08]">
                <div
                  className="lv-meter block h-full rounded-full"
                  style={{
                    ["--i" as string]: i,
                    width: `${pct}%`,
                    background:
                      pct > 80
                        ? "var(--brand-gradient)"
                        : "#b9bdcc",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

function SeriesFaresScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/series-booking-fd-fares.png"
        alt="Flysync series booking fixed departures dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
      />
    </LiveMock>
  );
}


function CrmScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/vacay365-dashboard.png"
        alt="Vacay365 holiday CRM dashboard"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
        priority
      />
    </LiveMock>
  );

  // The pipeline reads left-to-right along the brand ramp as a lead warms
  // up, closing on the success green. `bg-brand` was never a defined token,
  // so two of these four meters had no fill at all.
  const stages = [
    { s: "New enquiry", n: 24, c: "bg-[#b9bdcc]" },
    { s: "Quotation sent", n: 16, c: "bg-[var(--brand-2)]" },
    { s: "Negotiation", n: 9, c: "bg-[var(--brand-3)]" },
    { s: "Confirmed", n: 6, c: "bg-[var(--screen-pos)]" },
  ];
  return (
    <Frame title="Vacay 365 · Pipeline">
      <div className="space-y-2">
        <StatStrip
          items={[
            {
              l: "Open leads",
              v: "55",
              count: { to: 55 },
            },
            { l: "Conversion", v: "28%" },
            { l: "Pipeline", v: "₹41.6L" },
          ]}
        />
        {stages.map((st, i) => (
          <div
            key={st.s}
            className="sc-well flex items-center gap-2 rounded-md px-2.5 py-2"
          >
            <CircleDot className="h-2.5 w-2.5 shrink-0 text-fg-subtle" strokeWidth={2} />
            <span className="min-w-0 flex-1 truncate text-[0.5625rem] text-fg">
              {st.s}
            </span>
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[#101322]/[0.08] sm:w-24">
              <span
                className={`lv-meter block h-full rounded-full ${st.c}`}
                style={{
                  ["--i" as string]: i,
                  width: `${(st.n / 24) * 100}%`,
                }}
              />
            </span>
            <span className="w-5 shrink-0 text-right text-[0.5625rem] font-semibold text-fg">
              {st.n}
            </span>
          </div>
        ))}
        <div className="sc-well flex items-center gap-1.5 rounded-md px-2.5 py-1.5">
          <Users className="sc-accent h-2.5 w-2.5" strokeWidth={2} />
          <span className="text-[0.5rem] text-fg-subtle">
            12 follow ups due today
          </span>
        </div>
      </div>
    </Frame>
  );
}

function CrmCustomerScreen() {
  return (
    <LiveMock className="screen-ui relative h-full overflow-hidden bg-white">
      <Image
        src="/images/mockups/vacay365-customer-form.png"
        alt="Vacay365 create customer form"
        fill
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="object-cover"
      />
    </LiveMock>
  );
}



/* ---------------- registry ---------------- */

export const PRODUCT_SCREENS: Record<string, () => React.JSX.Element> = {
  "b2b-portal": B2BScreen,
  "b2b-portal-solution": B2BBookingsScreen,
  "series-booking-portal": SeriesScreen,
  "series-booking-portal-solution": SeriesFaresScreen,
  "b2c-portal": B2CScreen,
  "b2c-portal-solution": B2CResultsScreen,
  "b2c-portal-built-in": B2CAddOnsScreen,
  vacay365: CrmScreen,
  "vacay365-solution": CrmCustomerScreen,
  "corporate-booking-portal-sign-in": CorporateSignInScreen,
  "corporate-booking-portal-trip-search": CorporateTripSearchScreen,
  "corporate-booking-portal": CorporateScreen,
};
