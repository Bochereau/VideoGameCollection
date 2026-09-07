const RAWG_BASE = 'https://api.rawg.io/api'

export function getRawgKey() {
  const key = process.env.RAWG_API_KEY
  if (!key) {
    const err = new Error('RAWG_API_KEY is missing')
    err.status = 500
    throw err
  }
  return key
}

export async function rawgFetch(path, params = {}) {
  const key = getRawgKey()
  const url = new URL(`${RAWG_BASE}${path}`)
  url.searchParams.set('key', key)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v))
    }
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = new Error(`RAWG error (${res.status})`)
    err.status = 502
    throw err
  }
  return res.json()
}
