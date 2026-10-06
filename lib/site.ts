import { productPages } from "./products";

/**
 * Single source of truth for global site data.
 * Marketing copy, contact details and data lists live here so they can be
 * updated without touching component code.
 */

export const site = {
  name: "Flysync",
  legalName: "Flysync Technologies Private Limited",
  tagline: "Digitally Sure",
  url: "https://flysync.in",
  description:
    "Complete travel technology platform for B2B, B2C, corporate travel, fixed departures and API distribution. Built in Chennai for travel businesses across India.",

  contact: {
    phone: "+91 95005 31771",
    phoneHref: "tel:+919500531771",
    email: "support@flysync.in",
    emailHref: "mailto:support@flysync.in",
    whatsapp: "919500531771",
    whatsappHref:
      "https://wa.me/919500531771?text=Hi%20Flysync%2C%20I%27d%20like%20to%20know%20more%20about%20your%20travel%20technology%20platform.",
    address: {
      line1: "3rd Floor, Sri Sakthi Towers",
      line2: "Babu St Junction, Balaji Avenue",
      line3: "Chitlapakkam Main Road, Indira Nagar",
      city: "Chitlapakkam, Chennai",
      state: "Tamil Nadu",
      postalCode: "600073",
      country: "India",
    },
    hours: "Monday – Saturday · 9:30 AM – 7:30 PM",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/flysync-technologies",
    facebook: "https://www.facebook.com/profile.php?id=61569392498400",
    youtube: "https://www.youtube.com/@FlysyncTechnologies",
  },
} as const;




/* ------------------------------------------------------------------ */
/* Platform features — 12 cards                                        */
/* ------------------------------------------------------------------ */

export const features = [
  {
    icon: "Zap",
    title: "Real-Time Booking",
    body: "Live availability and instant confirmation across every connected supplier.",
  },
  {
    icon: "TrendingUp",
    title: "Markup Management",
    body: "Rule-based margins by agent, route, supplier, fare class or date range.",
  },
  {
    icon: "Wallet",
    title: "Agent Wallet",
    body: "Prepaid balances, credit limits, auto top-up and a full transaction trail.",
  },
  {
    icon: "Users",
    title: "Vacay 365 CRM",
    body: "Holiday enquiries, costed itineraries, branded quotations and follow-ups in one pipeline.",
  },
  {
    icon: "FileBarChart2",
    title: "Reports",
    body: "Sales, margin, supplier and agent reports exportable to Excel or PDF.",
  },
  {
    icon: "LineChart",
    title: "Analytics",
    body: "Route performance, conversion and revenue trends surfaced automatically.",
  },
  {
    icon: "ShieldCheck",
    title: "Role Management",
    body: "Granular permissions across branches, teams, desks and individual users.",
  },
  {
    icon: "Lock",
    title: "Secure Payments",
    body: "PCI-compliant gateways with tokenisation and automated reconciliation.",
  },
  {
    icon: "Briefcase",
    title: "Corporate Module",
    body: "Approval chains, policy enforcement and cost-centre reporting per client.",
  },
  {
    icon: "Smartphone",
    title: "Mobile Friendly",
    body: "Every screen built mobile-first — your agents book from anywhere.",
  },
  {
    icon: "Cloud",
    title: "Cloud Hosted",
    body: "Auto-scaling infrastructure, daily backups and 99.9% platform uptime.",
  },
];

/* ------------------------------------------------------------------ */
/* Integrations                                                        */
/* ------------------------------------------------------------------ */

export const integrations = {
  gds: {
    label: "GDS & Global Content",
    items: ["Amadeus", "Travelport", "Sabre", "Galileo"],
  },
  consolidators: {
    label: "Consolidators & Aggregators",
    items: [
      "Flight consolidators",
      "Hotel aggregators",
      "Destination suppliers",
      "DMC partners",
    ],
  },
  airlines: {
    label: "Direct Airline Connects",
    items: [
      "SpiceJet",
      "Akasa Air",
      "Air India Express",
      "Air Arabia",
      "Scoot",
    ],
  },
  payments: {
    label: "Payment Gateways",
    items: [
      "Razorpay",
      "CCAvenue",
      "PhonePe",
      "Stripe",
      "Easebuzz",
      "HDFC Bank",
    ],
  },
  finance: {
    label: "Accounting & Back Office",
    items: ["Tally", "Marg ERP"],
  },
};

/* The flat `partnerLogos` list that used to feed the supplier marquee under
   the customer wall lived here. The marquee has been removed; the supplier
   names themselves survive in `integrations` above, grouped by what they
   actually are, which is the form any future treatment would want. */

/* Customers currently running on Flysync are now their real marks rather
   than their names — see lib/clients.ts. */



/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = {
  products: productPages.map((p) => ({
    name: p.name,
    subtitle: p.subtitle,
    href: `/products/${p.slug}`,
    icon: p.icon,
    blurb: p.card.headline,
  })),
  links: [
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
};
