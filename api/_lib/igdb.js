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

const GAME_FIELDS =
  'name, first_release_date, cover.image_id, platforms.name, aggregated_rating, rating, version_parent, version_title'

export function hardwareKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

/** More specific consoles first — "ps3" must not fall through to PlayStation 1. */
const IGDB_PLATFORM_RULES = [
  { re: /(switch2|nintendoswitch2)/, ids: [508], names: ['Nintendo Switch 2'] },
  { re: /(nintendoswitch|switch)/, ids: [130], names: ['Nintendo Switch'] },
  { re: /(playstation5|ps5)/, ids: [167], names: ['PlayStation 5'] },
  { re: /(playstation4|ps4)/, ids: [48], names: ['PlayStation 4'] },
  { re: /(playstation3|ps3)/, ids: [9], names: ['PlayStation 3'] },
  { re: /(playstation2|ps2)/, ids: [8], names: ['PlayStation 2'] },
  { re: /(playstationportable|^psp$|sonypsp)/, ids: [38], names: ['PlayStation Portable'] },
  { re: /(psvita|vita)/, ids: [46], names: ['PlayStation Vita'] },
  { re: /(playstationvr2|psvr2)/, ids: [390], names: ['PlayStation VR2'] },
  { re: /(playstationvr|psvr)/, ids: [165], names: ['PlayStation VR'] },
  { re: /(playstation|psx|ps1|psone)/, ids: [7], names: ['PlayStation'] },
  { re: /(xboxseries|seriesx|seriesxs)/, ids: [169], names: ['Xbox Series X|S'] },
  { re: /(xboxone)/, ids: [49], names: ['Xbox One'] },
  { re: /(xbox360)/, ids: [12], names: ['Xbox 360'] },
  { re: /(^xbox|microsoftxbox)/, ids: [11], names: ['Xbox'] },
  { re: /(wiiu)/, ids: [41], names: ['Wii U'] },
  { re: /(^wii|nintendowii)/, ids: [5], names: ['Wii'] },
  { re: /(gamecube|ngc|^gc$)/, ids: [21], names: ['Nintendo GameCube'] },
  { re: /(n64|nintendo64)/, ids: [4], names: ['Nintendo 64'] },
  { re: /(3ds|nintendo3ds)/, ids: [37, 137], names: ['Nintendo 3DS', 'New Nintendo 3DS'] },
  { re: /(nds|nintendods)/, ids: [20], names: ['Nintendo DS'] },
  { re: /(snes|supernintendo|superfamicom)/, ids: [19], names: ['Super Nintendo Entertainment System'] },
  { re: /(^nes$|famicom|nintendoentertainment)/, ids: [18], names: ['Nintendo Entertainment System'] },
  { re: /(gameboyadvance|gba)/, ids: [24], names: ['Game Boy Advance'] },
  { re: /(gameboycolor|gbc)/, ids: [22], names: ['Game Boy Color'] },
  { re: /(gameboy|^gb$)/, ids: [33], names: ['Game Boy'] },
  { re: /(virtualboy)/, ids: [87], names: ['Virtual Boy'] },
  { re: /(dreamcast|^dc$)/, ids: [23], names: ['Dreamcast'] },
  { re: /(saturn)/, ids: [32], names: ['Sega Saturn'] },
  { re: /(megadrive|genesis)/, ids: [29], names: ['Sega Mega Drive/Genesis'] },
  { re: /(mastersystem|^sms$)/, ids: [64], names: ['Sega Master System/Mark III'] },
  { re: /(gamegear|^gg$)/, ids: [35], names: ['Sega Game Gear'] },
  { re: /(32x)/, ids: [30], names: ['Sega 32X'] },
  { re: /(segacd|megacd)/, ids: [78], names: ['Sega CD'] },
  { re: /(neogeocd)/, ids: [136], names: ['Neo Geo CD'] },
  { re: /(neogeo)/, ids: [80], names: ['Neo Geo AES'] },
  { re: /(pcengine|turbografx)/, ids: [86], names: ['TurboGrafx-16/PC Engine'] },
  { re: /(^pc$|windows|steam)/, ids: [6], names: ['PC (Microsoft Windows)'] },
]

export function resolveIgdbPlatforms(hardware = '') {
  const key = hardwareKey(hardware)
  if (!key) return { ids: [], names: [] }

  for (const rule of IGDB_PLATFORM_RULES) {
    if (rule.re.test(key)) return { ids: rule.ids, names: rule.names }
  }

  return { ids: [], names: [] }
}

function platformKeys(game) {
  return (game.platforms || [])
    .map((p) => hardwareKey(typeof p === 'string' ? p : p?.name))
    .filter(Boolean)
}

export function gameMatchesHardware(game, hardware) {
  const { names } = resolveIgdbPlatforms(hardware)
  if (!names.length) return true
  const accepted = new Set(names.map(hardwareKey))
  return platformKeys(game).some((key) => accepted.has(key))
}

export function preferredPlatformName(game, hardware) {
  const { names } = resolveIgdbPlatforms(hardware)
  const list = (game.platforms || [])
    .map((p) => (typeof p === 'string' ? p : p?.name))
    .filter(Boolean)
  if (names.length) {
    const accepted = new Set(names.map(hardwareKey))
    const hit = list.find((name) => accepted.has(hardwareKey(name)))
    if (hit) return hit
  }
  return list[0] || ''
}

function normalizeTitle(value) {
  let s = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')

  const romans = [
    ['xviii', '18'],
    ['xvii', '17'],
    ['xvi', '16'],
    ['xv', '15'],
    ['xiv', '14'],
    ['xiii', '13'],
    ['xii', '12'],
    ['xi', '11'],
    ['viii', '8'],
    ['vii', '7'],
    ['iii', '3'],
    ['ii', '2'],
    ['iv', '4'],
    ['vi', '6'],
    ['ix', '9'],
    ['x', '10'],
  ]
  for (const [r, n] of romans) {
    s = s.replace(new RegExp(`\\b${r}\\b`, 'g'), n)
  }

  return s.replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function scoreTitleMatch(name, query) {
  const n = normalizeTitle(name)
  const q = normalizeTitle(query)
  if (!n || !q) return 0
  if (n === q) return 400
  if (n.startsWith(`${q} `)) return 300
  if (n.startsWith(q)) return 260
  if (n.includes(` ${q} `) || n.endsWith(` ${q}`)) return 180
  if (n.includes(q)) return 120
  return 0
}

function sortGamesByQuery(rows, query) {
  return [...rows].sort((a, b) => {
    const score =
      scoreTitleMatch(b.name, query) - scoreTitleMatch(a.name, query)
    if (score) return score
    const coverA = Number(Boolean(a.cover?.image_id))
    const coverB = Number(Boolean(b.cover?.image_id))
    if (coverB !== coverA) return coverB - coverA
    const dateA = Number(a.first_release_date) || 0
    const dateB = Number(b.first_release_date) || 0
    if (dateA && dateB && dateA !== dateB) return dateA - dateB
    return String(a.name || '').localeCompare(String(b.name || ''), 'fr')
  })
}

function nameWhereClause(query) {
  const variants = queryNameVariants(query)
  if (variants.length === 1) return `name ~ *"${variants[0]}"*`
  return `(${variants.map((v) => `name ~ *"${v}"*`).join(' | ')})`
}

export function queryNameVariants(query) {
  const cleaned = sanitizeQuery(query).toLowerCase().replace(/['’]/g, '')
  const normalized = normalizeTitle(query)
  const variants = []
  const add = (value) => {
    if (value && value.length >= 2 && !variants.includes(value)) variants.push(value)
  }
  add(cleaned)
  add(normalized)

  const arabicToRoman = [
    [18, 'xviii'],
    [17, 'xvii'],
    [16, 'xvi'],
    [15, 'xv'],
    [14, 'xiv'],
    [13, 'xiii'],
    [12, 'xii'],
    [11, 'xi'],
    [10, 'x'],
    [9, 'ix'],
    [8, 'viii'],
    [7, 'vii'],
    [6, 'vi'],
    [4, 'iv'],
    [3, 'iii'],
    [2, 'ii'],
  ]
  let romanized = normalized
  for (const [n, r] of arabicToRoman) {
    romanized = romanized.replace(new RegExp(`\\b${n}\\b`, 'g'), r)
  }
  add(romanized)
  return variants
}

const REGION_LABELS = {
  1: 'Europe',
  2: 'Amérique du Nord',
  3: 'Australie',
  4: 'Nouvelle-Zélande',
  5: 'Japon',
  6: 'Chine',
  7: 'Asie',
  8: 'World',
  9: 'Corée',
  10: 'Brésil',
}

/** Lower is better: Europe, then US, then the rest. */
export function regionPreference(region = '') {
  const key = String(region)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (
    /europe|france|germany|allemagne|ital|spain|espagne|uk\b|united kingdom|angleterre|en-europe|\bpal\b|sles|sces/.test(
      key,
    )
  ) {
    return 0
  }
  if (
    /amerique du nord|north america|\busa\b|\bus\b|ntsc-u|slus/.test(key) &&
    !/japan|ntsc-j/.test(key)
  ) {
    return 1
  }
  if (/world|worldwide|officielle|official/.test(key)) return 2
  if (/austral|new zealand|nouvelle-zelande/.test(key)) return 3
  if (/japon|japan/.test(key)) return 4
  return 5
}

function localizationRank(regionEnum) {
  if (regionEnum === 1) return 0
  if (regionEnum === 2) return 1
  if (regionEnum === 8) return 2
  return 4
}

export async function applyPreferredRegionalCovers(games) {
  const ids = (Array.isArray(games) ? games : [])
    .map((g) => g?.id)
    .filter((id) => Number.isInteger(id))
  if (!ids.length) return games

  const locs = await igdbQuery(
    'game_localizations',
    `fields region, cover.image_id, game; where game = (${ids.join(',')}) & cover != null; limit 100;`,
  ).catch(() => [])

  const bestByGame = new Map()
  for (const loc of Array.isArray(locs) ? locs : []) {
    const gameId = Number(loc.game?.id || loc.game)
    const imageId = loc.cover?.image_id
    if (!gameId || !imageId) continue
    const rank = localizationRank(loc.region)
    const prev = bestByGame.get(gameId)
    if (!prev || rank < prev.rank) bestByGame.set(gameId, { rank, imageId })
  }

  return games.map((g) => {
    const best = bestByGame.get(g.id)
    if (!best || best.rank > 1) return g
    return {
      ...g,
      cover: {
        ...(g.cover && typeof g.cover === 'object' ? g.cover : {}),
        image_id: best.imageId,
      },
    }
  })
}

function collectGameIds(rows, into) {
  for (const row of Array.isArray(rows) ? rows : []) {
    if (Number.isInteger(row?.id)) into.add(row.id)
    if (Number.isInteger(row?.version_parent)) into.add(row.version_parent)
    if (Number.isInteger(row?.game)) into.add(row.game)
    if (Number.isInteger(row?.game?.id)) into.add(row.game.id)
  }
}

export async function fetchIgdbCoverOptions(
  q,
  { hardware = '', igdbId = null, limit = 32 } = {},
) {
  const games = await searchIgdbGames(q, { hardware, limit: 12 })
  const focused = games.filter((g) => scoreTitleMatch(g.name, q) >= 260)
  const seed = focused.length ? focused : games.slice(0, 4)
  const ids = new Set()
  if (Number.isInteger(igdbId) && igdbId > 0) ids.add(igdbId)
  collectGameIds(seed, ids)

  if (!ids.size) return []

  const idList = [...ids].join(',')
  const [details, versions] = await Promise.all([
    igdbQuery(
      'games',
      `fields name, cover.image_id, platforms.name, version_parent, version_title; where id = (${idList});`,
    ).catch(() => []),
    igdbQuery(
      'games',
      `fields name, cover.image_id, platforms.name, version_parent, version_title; where version_parent = (${idList}); limit 50;`,
    ).catch(() => []),
  ])

  collectGameIds(details, ids)
  collectGameIds(versions, ids)
  const allIds = [...ids].join(',')

  const [covers, localizations] = await Promise.all([
    igdbQuery(
      'covers',
      `fields id, image_id, game, game.name, game.platforms.name; where game = (${allIds}); limit 100;`,
    ).catch(() => []),
    igdbQuery(
      'game_localizations',
      `fields name, region, cover.image_id, game, game.name, game.platforms.name; where game = (${allIds}) & cover != null; limit 100;`,
    ).catch(() => []),
  ])

  const gameById = new Map()
  for (const g of [...games, ...(details || []), ...(versions || [])]) {
    if (g?.id != null) gameById.set(g.id, g)
  }

  const results = []
  const seen = new Set()
  const push = (item) => {
    if (!item?.mediaUrl || seen.has(item.mediaUrl)) return
    seen.add(item.mediaUrl)
    results.push(item)
  }

  const coverItem = (imageId, gameLike, region, name) => {
    if (!imageId) return null
    const gameId =
      Number(gameLike?.id) ||
      Number(gameLike?.game?.id) ||
      Number(gameLike?.game) ||
      Number(gameLike)
    const game =
      gameById.get(gameId) ||
      (typeof gameLike === 'object' && gameLike?.name ? gameLike : { id: gameId })
    return {
      id: gameId,
      name: name || game.name || q,
      system: preferredPlatformName(game, hardware),
      region,
      mediaUrl: igdbImageUrl(imageId),
      thumb: igdbImageUrl(imageId, IGDB_THUMB_SIZE),
      alternatives: [],
      source: 'igdb',
    }
  }

  const coverById = new Map(
    (Array.isArray(covers) ? covers : [])
      .filter((cover) => cover?.id != null && cover.image_id)
      .map((cover) => [cover.id, cover]),
  )

  const locImageId = (loc) => {
    if (loc.cover?.image_id) return loc.cover.image_id
    const coverId =
      typeof loc.cover === 'number' ? loc.cover : loc.cover?.id
    return coverById.get(coverId)?.image_id || null
  }

  for (const loc of Array.isArray(localizations) ? localizations : []) {
    const gameId = Number(loc.game?.id || loc.game)
    push(
      coverItem(
        locImageId(loc),
        loc.game || gameById.get(gameId) || { id: gameId },
        REGION_LABELS[loc.region] || 'IGDB',
        loc.name,
      ),
    )
  }

  for (const cover of Array.isArray(covers) ? covers : []) {
    push(
      coverItem(
        cover.image_id,
        cover.game,
        'Officielle',
        cover.game?.name,
      ),
    )
  }

  for (const g of [...(details || []), ...(versions || []), ...games]) {
    push(
      coverItem(
        g.cover?.image_id,
        g,
        g.version_title || 'Officielle',
        g.name,
      ),
    )
  }

  const query = sanitizeQuery(q)
  results.sort((a, b) => {
    const score = scoreTitleMatch(b.name, query) - scoreTitleMatch(a.name, query)
    if (score) return score
    return regionPreference(a.region) - regionPreference(b.region)
  })

  return results.slice(0, limit)
}

export async function searchIgdbGames(q, { hardware = '', limit = 8 } = {}) {
  const query = sanitizeQuery(q)
  if (query.length < 2) return []

  const { ids, names } = resolveIgdbPlatforms(hardware)
  const pool = Math.min(50, Math.max(24, limit * 6))
  const nameWhere = nameWhereClause(query)

  const requests = [
    igdbQuery('games', `search "${query}"; fields ${GAME_FIELDS}; limit ${pool};`),
  ]
  const extraSearch = queryNameVariants(query).find(
    (variant) => variant !== query.toLowerCase(),
  )
  if (extraSearch) {
    requests.push(
      igdbQuery(
        'games',
        `search "${extraSearch}"; fields ${GAME_FIELDS}; limit ${Math.min(25, pool)};`,
      ).catch(() => []),
    )
  }
  if (ids.length) {
    requests.push(
      igdbQuery(
        'games',
        `fields ${GAME_FIELDS}; where ${nameWhere} & platforms = (${ids.join(',')}); limit ${pool};`,
      ).catch(() => []),
    )
  }

  const chunks = await Promise.all(requests)
  const byId = new Map()
  for (const chunk of chunks) {
    for (const row of Array.isArray(chunk) ? chunk : []) {
      if (row?.id != null && !byId.has(row.id)) byId.set(row.id, row)
    }
  }

  let rows = [...byId.values()]
  if (names.length) {
    const filtered = rows.filter((g) => gameMatchesHardware(g, hardware))
    if (filtered.length) rows = filtered
  }

  return applyPreferredRegionalCovers(sortGamesByQuery(rows, query).slice(0, limit))
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
