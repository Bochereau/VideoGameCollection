const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const IGDB_BASE = 'https://api.igdb.com/v4'

/** Card / stored covers: 528×748 box art (retina of cover_big). */
export const IGDB_COVER_SIZE = 'cover_big_2x'
export const IGDB_THUMB_SIZE = 'cover_big'

let cachedToken = null
let cachedUntil = 0

export function igdbImageUrl(imageId, size = IGDB_COVER_SIZE) {
  if (!imageId) return null
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
}

export function unixToYear(ts) {
  if (ts == null || ts === '') return null
  const year = new Date(Number(ts) * 1000).getUTCFullYear()
  return Number.isFinite(year) ? year : null
}

export function sanitizeQuery(q) {
  return String(q || '')
    .replace(/["\\;*()&|=<>~\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

function getCredentials() {
  const clientId = process.env.IGDB_CLIENT_ID
  const clientSecret = process.env.IGDB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    const err = new Error('IGDB_CLIENT_ID / IGDB_CLIENT_SECRET are missing')
    err.status = 500
    throw err
  }
  return { clientId, clientSecret }
}

async function fetchAccessToken() {
  const { clientId, clientSecret } = getCredentials()
  const url = new URL(TWITCH_TOKEN_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('client_secret', clientSecret)
  url.searchParams.set('grant_type', 'client_credentials')

  const res = await fetch(url.toString(), { method: 'POST' })
  if (!res.ok) {
    const err = new Error(`IGDB auth error (${res.status})`)
    err.status = 502
    throw err
  }

  const data = await res.json()
  const expiresIn = Number(data.expires_in) || 0
  cachedToken = data.access_token
  cachedUntil = Date.now() + Math.max(60, expiresIn - 120) * 1000
  return cachedToken
}

async function getAccessToken(force = false) {
  if (!force && cachedToken && Date.now() < cachedUntil) return cachedToken
  return fetchAccessToken()
}

export async function igdbQuery(endpoint, body) {
  const { clientId } = getCredentials()

  const run = async (force) => {
    const token = await getAccessToken(force)
    return fetch(`${IGDB_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body,
    })
  }

  let res = await run(false)
  if (res.status === 401) res = await run(true)
  if (!res.ok) {
    const err = new Error(`IGDB error (${res.status})`)
    err.status = 502
    throw err
  }
  return res.json()
}

export function pickCompanies(involved = []) {
  const developers = involved
    .filter((row) => row?.developer)
    .map((row) => row.company?.name)
    .filter(Boolean)
  const publishers = involved
    .filter((row) => row?.publisher)
    .map((row) => row.company?.name)
    .filter(Boolean)
  return {
    developer: developers[0] || '',
    editor: publishers[0] || '',
  }
}

export function mapIgdbGame(g) {
  return {
    igdbId: g.id,
    name: g.name,
    release: unixToYear(g.first_release_date),
    cover: igdbImageUrl(g.cover?.image_id),
    platforms: (g.platforms || []).map((p) => p?.name).filter(Boolean),
    rating: g.aggregated_rating || g.rating || null,
  }
}

export function mapIgdbGameDetails(g) {
  const companies = pickCompanies(g.involved_companies)
  return {
    ...mapIgdbGame(g),
    developer: companies.developer,
    editor: companies.editor,
  }
}
