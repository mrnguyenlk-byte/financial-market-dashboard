"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLang } from "@/lib/i18n"
import { spark, toTrend } from "@/lib/market-utils"
import { marketPagePath } from "@/lib/symbol-detail"
import { useSymbolDetail } from "@/lib/symbol-detail-context"
import { useWatchlist } from "@/lib/use-watchlist"
import { ChangePill, Sparkline, fmt } from "./shared"
import { SymbolLogo } from "./symbol-logo"
import { cn } from "@/lib/utils"

export function SymbolDetailModal() {
  const { t, lang } = useLang()
  const { record, openSymbol, closeDetail } = useSymbolDetail()
  const { symbols, add, remove } = useWatchlist()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (openSymbol && record) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [openSymbol, record])

  if (!record) return null

  const up = record.mockChangePercent >= 0
  const trend = toTrend(record.mockChangePercent)
  const sparkData = spark(record.symbol.length * 7, 14, trend === "up" ? 1 : -1)
  const inWatchlist =
    record.watchlistSymbol != null && symbols.includes(record.watchlistSymbol)
  const canWatchlist = record.watchlistSymbol != null
  const fullPageHref = record.marketPageSlug
    ? marketPagePath(record.marketPageSlug)
    : null

  return (
    <dialog
      ref={dialogRef}
      onClose={closeDetail}
      className="fixed inset-0 z-50 m-auto w-[min(100%,560px)] max-h-[min(90vh,720px)] overflow-hidden rounded-lg border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/60 open:flex open:flex-col"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border bg-card/95 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <SymbolLogo symbol={record.symbol} size="md" />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">{record.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{record.name[lang]}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {canWatchlist && record.watchlistSymbol && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={
                inWatchlist ? t("watchlist.remove") : t("symbolDetail.addWatchlist")
              }
              onClick={() =>
                inWatchlist
                  ? remove(record.watchlistSymbol!)
                  : add(record.watchlistSymbol!)
              }
            >
              <Star
                className={cn("size-4", inWatchlist && "fill-primary text-primary")}
                aria-hidden
              />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("action.close")}
            onClick={closeDetail}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="border-b border-border px-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {fmt(record.mockPrice)}
            </p>
            <ChangePill value={record.mockChangePercent} className="mt-1" />
          </div>
          <Sparkline data={sparkData} positive={up} className="h-10 w-24" width={96} height={40} />
        </div>
        {record.region && (
          <p className="mt-2 text-xs text-muted-foreground">
            {record.region[lang]}
            {record.exchange ? ` · ${record.exchange}` : ""}
            {record.sector ? ` · ${record.sector}` : ""}
          </p>
        )}
      </div>

      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList variant="line" className="w-full shrink-0 justify-start rounded-none border-b border-border bg-transparent px-4">
          <TabsTrigger value="overview">{t("symbolDetail.overview")}</TabsTrigger>
          <TabsTrigger value="chart">{t("symbolDetail.chart")}</TabsTrigger>
          <TabsTrigger value="financials">{t("symbolDetail.financials")}</TabsTrigger>
          <TabsTrigger value="news">{t("symbolDetail.news")}</TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <TabsContent value="overview" className="mt-0 space-y-3">
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">{t("label.symbol")}</dt>
                <dd className="font-semibold text-foreground">{record.symbol}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("label.last")}</dt>
                <dd className="font-mono tabular-nums text-foreground">{fmt(record.mockPrice)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("label.changePct")}</dt>
                <dd>
                  <ChangePill value={record.mockChangePercent} showIcon={false} />
                </dd>
              </div>
              {record.exchange && (
                <div>
                  <dt className="text-muted-foreground">{t("symbolDetail.exchange")}</dt>
                  <dd className="font-semibold text-foreground">{record.exchange}</dd>
                </div>
              )}
            </dl>
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            <div className="flex h-40 items-center justify-center rounded-md border border-border bg-chart-bg">
              <Sparkline
                data={sparkData}
                positive={up}
                className="h-28 w-full max-w-sm px-4"
                width={320}
                height={112}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{t("misc.delayed")}</p>
          </TabsContent>

          <TabsContent value="financials" className="mt-0">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("symbolDetail.financialsPlaceholder")}
            </p>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("symbolDetail.newsPlaceholder")}
            </p>
          </TabsContent>
        </div>
      </Tabs>

      <div className="shrink-0 space-y-2 border-t border-border bg-card/95 px-4 py-3">
        {fullPageHref && (
          <Link
            href={fullPageHref}
            onClick={closeDetail}
            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary/60"
          >
            {t("symbolDetail.viewFullPage")}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        )}
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          {t("symbolDetail.disclaimer")}
        </p>
      </div>
    </dialog>
  )
}
