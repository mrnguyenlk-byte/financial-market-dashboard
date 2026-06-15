import type { MetadataRoute } from "next"
import { SITE_HOST } from "@/lib/brand"

const baseUrl = "https://btrading.org"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    host: SITE_HOST,
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
