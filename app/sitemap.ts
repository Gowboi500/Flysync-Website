import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { productPages } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "/products", priority: 0.9 },
    ...productPages.map((p) => ({ path: `/products/${p.slug}`, priority: 0.8 })),
    { path: "/about", priority: 0.7 },
    { path: "/blogs", priority: 0.6 },
    { path: "/demo", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/careers", priority: 0.5 },
  ];

  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
