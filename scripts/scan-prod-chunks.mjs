#!/usr/bin/env node
const origin = process.argv[2] ?? "https://btrading.org"
const patterns = [
  "provider:crypto",
  "cachedProvider",
  "revalidate",
  "server-only",
  "market-provider",
  "safeFetchJson",
  "process.env",
  "build-dashboard-data",
]

async function main() {
  const html = await (await fetch(origin)).text()
  const chunks = [
    ...new Set([...html.matchAll(/\/_next\/static\/chunks\/[^"'\s>\\]+/g)].map((m) => m[0])),
  ]

  console.log(`Origin: ${origin}`)
  console.log(`Chunks: ${chunks.length}`)

  const hits = []
  for (const path of chunks) {
    const url = `${origin}${path}`
    const res = await fetch(url)
    if (!res.ok) {
      hits.push({ path, pattern: `HTTP ${res.status}` })
      continue
    }
    const js = await res.text()
    for (const pattern of patterns) {
      if (js.includes(pattern)) hits.push({ path, pattern })
    }
  }

  if (!hits.length) {
    console.log("OK: no server/provider patterns in production client chunks")
    return
  }

  console.log(`WARN: ${hits.length} hit(s):`)
  for (const { path, pattern } of hits) console.log(`  ${path}: ${pattern}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
