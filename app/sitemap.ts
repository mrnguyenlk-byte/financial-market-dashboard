import type { MetadataRoute } from "next"

const baseUrl = "https://btrading.org"

/** Production routes verified to return HTTP 200. */
const SITEMAP_ROUTES = [
  { path: "/", changeFrequency: "hourly" as const, priority: 1 },
  { path: "/brokers", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/legal/terms", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/cookies", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/risk-disclosure", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/disclaimer", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/partner-disclosure", changeFrequency: "yearly" as const, priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return SITEMAP_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
