#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const files = [
  "lib/market-data.ts",
  "lib/providers/build-dashboard-data.ts",
  "lib/providers/cache.ts",
  "lib/providers/calendar-provider.ts",
  "lib/providers/crypto-provider.ts",
  "lib/providers/currency-provider.ts",
  "lib/providers/economic-provider.ts",
  "lib/providers/fallback.ts",
  "lib/providers/fetch-utils.ts",
  "lib/providers/global-market-provider.ts",
  "lib/providers/heatmap-provider.ts",
  "lib/providers/market-provider.ts",
  "lib/providers/mappers.ts",
  "lib/providers/news-provider.ts",
  "lib/providers/vietnam-market-provider.ts",
  "lib/news/rss.ts",
  ...readdirSync(join(root, "lib/adapters/vietnam"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => `lib/adapters/vietnam/${f}`),
]

for (const file of files) {
  const path = join(root, file)
  if (!existsSync(path)) continue
  const src = readFileSync(path, "utf8")
  if (src.includes("server-only")) continue
  writeFileSync(path, `import "server-only"\n\n${src}`)
  console.log("tagged", file)
}
