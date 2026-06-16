import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/marketwall/header"
import { Footer } from "@/components/marketwall/footer"
import { LegalPageContent } from "@/components/marketwall/legal-page"
import { legalPages, type LegalSlug } from "@/lib/legal-content"
import { SITE_NAME } from "@/lib/brand"
import { buildPageMetadata } from "@/lib/seo"

const SLUGS = Object.keys(legalPages) as LegalSlug[]

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = legalPages[slug as LegalSlug]
  if (!page) return {}

  return buildPageMetadata({
    title: `${page.title.en} | ${SITE_NAME}`,
    description: `${page.title.en} — ${SITE_NAME} legal information.`,
    path: `/legal/${slug}`,
  })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!SLUGS.includes(slug as LegalSlug)) notFound()

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="w-full px-4 py-6">
        <LegalPageContent slug={slug as LegalSlug} />
      </main>
      <Footer />
    </div>
  )
}
