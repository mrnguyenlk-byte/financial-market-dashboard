"use client"

import { useEffect } from "react"
import Link from "next/link"

import { BrandLogo } from "@/components/marketwall/brand-logo"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error)
    }
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <BrandLogo href="/" height={40} priority />
          <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            The application could not load correctly. Please try again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reload
            </button>
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
