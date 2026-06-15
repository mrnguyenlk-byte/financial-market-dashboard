#!/usr/bin/env node
/**
 * Verify production HTML references only JS chunks that return HTTP 200.
 * Usage: node scripts/check-prod-chunks.mjs [origin]
 */
const origin = process.argv[2] ?? "https://btrading.org"

async function main() {
  const htmlRes = await fetch(origin)
  if (!htmlRes.ok) {
    console.error(`FAIL: ${origin} returned ${htmlRes.status}`)
    process.exit(1)
  }

  const html = await htmlRes.text()
  const chunkPaths = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/[^"'\s>]+/g)].map((m) => m[0]),
    ),
  ]

  console.log(`Origin: ${origin}`)
  console.log(`Chunks referenced: ${chunkPaths.length}`)

  const failures = []
  for (const path of chunkPaths) {
    const url = `${origin}${path}`
    const res = await fetch(url, { method: "HEAD" })
    const status = res.status
    console.log(`${status} ${path}`)
    if (!res.ok) failures.push({ path, status })
  }

  if (failures.length) {
    console.error(`\nFAIL: ${failures.length} chunk(s) missing`)
    process.exit(1)
  }

  console.log("\nOK: all referenced chunks return 200")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
