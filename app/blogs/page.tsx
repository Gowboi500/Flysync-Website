import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner, PageHero } from "@/components/ui/Blocks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

const blogCards = [
  {
    title: "Why Every Travel Agency Needs a B2B Flight Booking Portal",
    category: "B2B Flight Booking",
    keywords: [
      "B2B flight booking portal",
      "travel agency booking platform",
      "online flight booking for travel agents",
    ],
    date: "Oct 2026",
    isoDate: "2026-10",
    readTime: "5 min read",
    image: "/images/blogs/b2b-flight-booking-portal.webp",
    imageAlt:
      "Travel agent using an online flight booking platform in a modern agency office",
  },
  {
    title: "What Is Series Flight Booking? A Complete Guide for Travel Agents",
    category: "Series Flight Booking",
    keywords: [
      "Series flight booking",
      "airline series seats",
      "group flight booking",
      "flight inventory for travel agents",
    ],
    date: "Nov 2026",
    isoDate: "2026-11",
    readTime: "6 min read",
    image: "/images/blogs/series-flight-booking-guide.jpg",
    imageAlt:
      "Passengers boarding a flight through a jet bridge at an airport gate",
  },
  {
    title: "B2B Flight Booking vs Series Flight Booking — What's the Difference?",
    category: "Flight Booking Guide",
    keywords: [
      "B2B flight booking vs series booking",
      "group airline booking",
      "travel agent flight booking",
    ],
    date: "Dec 2026",
    isoDate: "2026-12",
    readTime: "5 min read",
    image: "/images/blogs/b2b-vs-series-flight-booking.jpg",
    imageAlt:
      "Travelers checking an airport departures board before their flight",
  },
];

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read Flysync blogs on travel technology, B2B booking platforms, API integrations, booking operations and product updates.",
  keywords: blogCards.flatMap((card) => card.keywords),
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />
        <PageHero
          eyebrow="Blogs"
          headline="Travel Technology insights from Flysync"
          sub="Practical articles, product notes and operations guides for travel businesses building better booking, distribution and agent workflows."
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book a Demo
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Talk to Us
          </Link>
        </PageHero>

        <section className="section pt-0">
          <div className="container-page">
            <SectionHeading
              eyebrow="Latest insights"
              title="Travel technology articles for growing agencies"
              body="Practical reads on travel booking systems, B2B flight booking portals, API connectivity, CRM workflows and digital growth."
            />

            <StaggerGroup className="mt-[var(--heading-gap)] grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {blogCards.map((post, index) => (
                <StaggerItem key={post.title} index={index}>
                  <article
                    className="group h-full rounded-card border border-line bg-surface p-4 transition-[border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-entrance)] hover:-translate-y-1 hover:border-accent-line"
                    data-keywords={post.keywords.join(", ")}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-control border border-line bg-canvas-alt">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 31vw, (min-width: 768px) 46vw, 92vw"
                        className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-entrance)] group-hover:scale-[1.03]"
                        priority={index === 0}
                      />
                    </div>

                    <div className="px-1 pb-2 pt-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-accent">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-[0.8125rem] text-fg-subtle">
                          <Clock3
                            className="h-3.5 w-3.5 shrink-0"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="mt-4 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-fg">
                        {post.title}
                      </h2>
                      <p className="mt-5 flex items-center gap-2 text-[0.875rem] text-fg-muted">
                        <CalendarDays
                          className="h-4 w-4 shrink-0"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        <time dateTime={post.isoDate}>{post.date}</time>
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}

            </StaggerGroup>
          </div>
        </section>

        <CTABanner
          heading="Want help with your travel technology stack?"
          body="Book a walkthrough and see how Flysync can support your booking, CRM, distribution and reporting workflows."
        >
          <Link href="/demo" className="btn btn-primary btn-lg">
            Book Free Demo
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact Team
          </Link>
        </CTABanner>
      </main>
      <Footer />
      <StickyCTA />
      <BackToTop />
      <RevealObserver />
      <ScrollChrome />
    </>
  );
}
