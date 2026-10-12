import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";
import { BackToTop } from "@/components/site/BackToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollChrome } from "@/components/site/ScrollChrome";
import { CTABanner } from "@/components/ui/Blocks";
import { getPublishedBlogPost, publishedBlogPosts } from "../blogData";

export function generateStaticParams() {
  return publishedBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);
  if (!post || !post.article) return {};

  const description = post.article.intro[0];

  return {
    title: post.title,
    description,
    keywords: post.keywords,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);
  if (!post || !post.article) notFound();

  const article = post.article;

  return (
    <>
      <Header />
      <main id="main" className="relative isolate">
        <div aria-hidden="true" className="ambient-wash" />
        <div aria-hidden="true" className="texture-grid" />

        <section
          className="relative isolate overflow-hidden pb-12 sm:pb-16 lg:pb-20"
          style={{
            paddingTop: "calc(var(--nav-height) + var(--hero-top, var(--hero-pad-top)))",
          }}
        >
          <div aria-hidden="true" className="hero-wash" />
          <div aria-hidden="true" className="texture-grid" />
          <div aria-hidden="true" className="hero-rays" />
          <div aria-hidden="true" className="texture-noise" />

          <div className="container-page relative">
            <Link
              href="/blogs"
              className="rise inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
              Back to Blogs
            </Link>

            <div className="mx-auto mt-10 max-w-4xl text-center">
              <p className="eyebrow rise">
                <span data-flap>{post.category}</span>
              </p>
              <h1
                className="rise mt-5 text-[length:var(--text-h1)] font-bold leading-[1.02] tracking-[-0.032em] text-fg"
                style={{ ["--d" as string]: "0.06s" }}
              >
                {post.title}
              </h1>
              <div
                className="rise mt-6 flex flex-wrap items-center justify-center gap-4 text-[0.875rem] text-fg-muted"
                style={{ ["--d" as string]: "0.12s" }}
              >
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <time dateTime={post.isoDate}>{post.date}</time>
                </span>
              </div>
            </div>

            <div
              className="rise-shot mx-auto mt-10 max-w-5xl overflow-hidden rounded-card border border-line bg-canvas-alt shadow-[var(--shadow-soft)]"
              style={{ ["--d" as string]: "0.18s" }}
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-page">
            <article className="mx-auto max-w-3xl">
              <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-fg-muted">
                {article.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {article.sections.map((section) => (
                <section key={section.heading} className="mt-12">
                  <h2 className="text-[length:var(--text-h3)] font-bold leading-tight tracking-[-0.02em] text-fg">
                    {section.heading}
                  </h2>

                  {section.paragraphs && (
                    <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.75] text-fg-muted">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {section.benefits && (
                    <ol className="mt-6 space-y-4">
                      {section.benefits.map((benefit, index) => (
                        <li
                          key={benefit.title}
                          className="rounded-control border border-line bg-surface p-5"
                        >
                          <div className="flex gap-4">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="text-[1rem] font-semibold text-fg">
                                {benefit.title}
                              </h3>
                              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">
                                {benefit.body}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}

              <section className="mt-12 border-t border-line pt-10">
                <h2 className="text-[length:var(--text-h3)] font-bold leading-tight tracking-[-0.02em] text-fg">
                  Conclusion
                </h2>
                <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.75] text-fg-muted">
                  {article.conclusion.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </section>

        <CTABanner
          heading="Ready to simplify flight booking operations?"
          body="Book a walkthrough and see how Flysync helps travel agencies organize bookings, suppliers and agent workflows."
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
