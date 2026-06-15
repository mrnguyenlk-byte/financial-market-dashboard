import type { MetadataRoute } from "next"
import { legalPages } from "@/lib/legal-content"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/brokers`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ]

  const legalRoutes: MetadataRoute.Sitemap = Object.keys(legalPages).map((slug) => ({
    url: `${SITE_URL}/legal/${slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }))

  return [...staticRoutes, ...legalRoutes]
}
