/** Shared JSON fetcher for SWR hooks. */
export async function jsonFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
  return res.json() as Promise<T>
}
