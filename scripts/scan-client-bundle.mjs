#!/usr/bin/env node
/**
 * Scan .next/static/chunks for server-only / provider leakage patterns.
 */
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = join(process.cwd(), ".next", "static", "chunks")
const PATTERNS = [
  "provider:crypto",
  "cachedProvider",
  "build-dashboard-data",
  "vietnam-market-provider",
  "market-provider",
  "server-only",
  "safeFetchJson",
  "fetchWithTimeout",
  "next: { revalidate",
  "process.env.",
  "node:fs",
  "node:crypto",
]

async function main() {
  const files = (await readdir(ROOT)).filter((f) => f.endsWith(".js"))
  const hits = []

  for (const file of files) {
    const content = await readFile(join(ROOT, file), "utf8")
    for (const pattern of PATTERNS) {
      if (content.includes(pattern)) {
        hits.push({ file, pattern })
      }
    }
  }

  if (!hits.length) {
    console.log("OK: no server/provider patterns in client chunks")
    return
  }

  console.log(`WARN: ${hits.length} pattern hit(s):`)
  for (const { file, pattern } of hits) {
    console.log(`  ${file}: ${pattern}`)
  }
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
