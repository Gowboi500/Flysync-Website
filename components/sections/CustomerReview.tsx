import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const testimonial =
  "They are a very advanced technology provider, and have given us an excellent portal for our travel business with advanced features. It is easy to use, and their service is excellent. Highly recommended!";

export function CustomerReview() {
  return (
    <section id="reviews" aria-label="Customer review" className="section atmo atmo-heading relative">
      <div className="container-page">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="h-full">
            <div className="w-full max-w-none">
              <p className="eyebrow">Customer review</p>
              <h2 className="mt-4 text-[length:var(--text-h3)] font-semibold leading-[1.14] tracking-[-0.03em] text-fg">
                Travel businesses choose Flysync with confidence.
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-fg-muted">
                Built for practical travel workflows, our platforms help teams serve customers better and grow without operational friction.
              </p>
              <Link href="/demo" className="solutions-cta btn btn-secondary mt-7">
                Book a demo
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="review-card-align h-full">
            <figure className="relative overflow-hidden rounded-card border border-line bg-surface px-6 py-8 sm:px-10 sm:py-10 lg:pt-[3.75rem]">
              <Quote className="h-8 w-8 text-accent" strokeWidth={2} aria-hidden="true" />
              <blockquote className="mt-6 max-w-2xl text-[1.125rem] font-medium leading-relaxed tracking-[-0.015em] text-fg-body sm:text-[1.375rem]">
                “{testimonial}”
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6">
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logos/flybest.png"
                      alt="Flybest"
                      width={340}
                      height={120}
                      className="max-h-6 w-full object-contain"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">Sathish</span>
                    <span className="mt-0.5 block text-xs text-fg-muted">CEO of Flybest</span>
                  </span>
                </span>
                <span className="flex items-center gap-1 text-amber-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" strokeWidth={1.75} aria-hidden="true" />
                  ))}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
