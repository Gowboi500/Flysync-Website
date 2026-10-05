import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="grid min-h-[70vh] place-items-center px-5 pt-24">
        <div className="text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="mt-5 text-[length:var(--text-h2)] font-semibold tracking-[-0.02em] text-fg">
            This route doesn&apos;t exist.
          </h1>
          <p className="mt-4 text-[1.0625rem] text-fg-body">
            <span className="tnum font-medium text-fg">MAA → Home</span>?
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn btn-primary btn-lg">
              Back to home
            </Link>
            <Link href="/products" className="btn btn-secondary btn-lg">
              Browse products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
