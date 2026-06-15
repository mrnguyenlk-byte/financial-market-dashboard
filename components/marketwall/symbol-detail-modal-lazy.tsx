"use client"

import dynamic from "next/dynamic"

export const SymbolDetailModal = dynamic(
  () =>
    import("@/components/marketwall/symbol-detail-modal").then((mod) => ({
      default: mod.SymbolDetailModal,
    })),
  { ssr: false },
)
