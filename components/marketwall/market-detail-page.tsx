"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLang } from "@/lib/i18n"
import { spark, toTrend } from "@/lib/market-utils"
import type { SymbolDetailRecord } from "@/lib/symbol-detail"
import { ChangePill, fmt } from "./shared"
import { LightweightChart, pointsFromValues } from "./lightweight-chart"
import { SymbolLogo } from "./symbol-logo"
import { RiskWarning } from "./risk-warning"

export function MarketDetailPage({ record }: { record: SymbolDetailRecord }) {
  const { t, lang } = useLang()
  const up = record.mockChangePercent >= 0
  const trend = toTrend(record.mockChangePercent)
  const sparkData = spark(record.symbol.length * 7, 24, trend === "up" ? 1 : -1)
  const chartSeries = useMemo(
    () => [
      {
        data: pointsFromValues(sparkData),
        color: up ? "var(--gain)" : "var(--loss)",
        lineWidth: 2,
      },
    ],
    [sparkData, up],
  )

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium text-primary transition-colors hover:bg-secondary/60"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("nav.dashboard")}
        </Link>
      </div>

      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <SymbolLogo symbol={record.symbol} size="md" />
              <div>
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  {record.name[lang]}
                </h1>
                <p className="text-sm text-muted-foreground">{record.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                {fmt(record.mockPrice)}
              </p>
              <ChangePill value={record.mockChangePercent} className="mt-1" />
            </div>
          </div>

          {record.region && (
            <p className="text-xs text-muted-foreground">
              {record.region[lang]}
              {record.exchange ? ` · ${record.exchange}` : ""}
              {record.sector ? ` · ${record.sector}` : ""}
            </p>
          )}

          <Tabs defaultValue="overview">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="overview">{t("symbolDetail.overview")}</TabsTrigger>
              <TabsTrigger value="chart">{t("symbolDetail.chart")}</TabsTrigger>
              <TabsTrigger value="financials">{t("symbolDetail.financials")}</TabsTrigger>
              <TabsTrigger value="news">{t("symbolDetail.news")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">{t("label.symbol")}</dt>
                  <dd className="font-semibold">{record.symbol}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("label.last")}</dt>
                  <dd className="font-mono tabular-nums">{fmt(record.mockPrice)}</dd>
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
                    <dd className="font-semibold">{record.exchange}</dd>
                  </div>
                )}
              </dl>
            </TabsContent>

            <TabsContent value="chart" className="mt-4">
              <div className="overflow-hidden rounded-lg border border-border bg-chart-bg">
                <LightweightChart
                  series={chartSeries}
                  height={224}
                  variant="area"
                  showGrid
                  className="h-56 w-full"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t("misc.delayed")}</p>
            </TabsContent>

            <TabsContent value="financials" className="mt-4">
              <p className="text-sm text-muted-foreground">
                {t("symbolDetail.financialsPlaceholder")}
              </p>
            </TabsContent>

            <TabsContent value="news" className="mt-4">
              <p className="text-sm text-muted-foreground">{t("symbolDetail.newsPlaceholder")}</p>
            </TabsContent>
          </Tabs>

          <p className="border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
            {t("symbolDetail.disclaimer")}
          </p>
        </CardContent>
      </Card>

      <RiskWarning />
    </div>
  )
}
