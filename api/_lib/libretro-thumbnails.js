const THUMB_BASE = 'https://thumbnails.libretro.com'

const POPULAR_SYSTEMS = [
  'Sony - PlayStation 2',
  'Sony - PlayStation',
  'Sony - PlayStation 3',
  'Sony - PlayStation 4',
  'Sega - Dreamcast',
  'Sega - Mega Drive - Genesis',
  'Sega - Saturn',
  'Nintendo - Super Nintendo Entertainment System',
  'Nintendo - Nintendo Entertainment System',
  'Nintendo - GameCube',
  'Nintendo - Nintendo 64',
  'Nintendo - Wii',
  'Nintendo - Game Boy Advance',
  'Nintendo - Nintendo DS',
  'Sony - PlayStation Portable',
  'Microsoft - Xbox',
  'Microsoft - Xbox 360',
]

/** Map loose console names → Libretro playlist system folder(s) */
export function resolveLibretroSystems(hardware = '') {
  const key = hardware
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')

  const table = [
    [/^(megadrive|genesis|segagenesis|segamegadrive)$/, ['Sega - Mega Drive - Genesis']],
    [/^(mastersystem|sms|segamastersystem)$/, ['Sega - Master System - Mark III']],
    [/^(nes|famicom)$/, ['Nintendo - Nintendo Entertainment System']],
    [/^(snes|supernintendo|superfamicom)$/, ['Nintendo - Super Nintendo Entertainment System']],
    [/^(gameboy|gb)$/, ['Nintendo - Game Boy']],
    [/^(gameboycolor|gbc)$/, ['Nintendo - Game Boy Color']],
    [/^(virtualboy)$/, ['Nintendo - Virtual Boy']],
    [/^(gameboyadvance|gba)$/, ['Nintendo - Game Boy Advance']],
    [/^(gamecube|ngc|gc)$/, ['Nintendo - GameCube']],
    [/^(n64|nintendo64)$/, ['Nintendo - Nintendo 64']],
    [/^(nds|nintendods)$/, ['Nintendo - Nintendo DS']],
    [/^(wii)$/, ['Nintendo - Wii']],
    [/^(3ds|nintendo3ds)$/, ['Nintendo - Nintendo 3DS']],
    [/^(wiiu)$/, ['Nintendo - Wii U']],
    [/^(32x|sega32x)$/, ['Sega - 32X']],
    [/^(segacd|megacd)$/, ['Sega - Mega-CD - Sega CD']],
    [/^(gamegear|gg)$/, ['Sega - Game Gear']],
    [/^(saturn|segasaturn)$/, ['Sega - Saturn']],
    [/^(dreamcast|dc)$/, ['Sega - Dreamcast']],
    [/^(neogeo)$/, ['SNK - Neo Geo']],
    [/^(neogeocd)$/, ['SNK - Neo Geo CD']],
    // One primary system only — multi-system fetch times out on large indexes (PS2…)
    [/^(playstation2|ps2|sonyplaystation2)$/, ['Sony - PlayStation 2']],
    [/^(playstation3|ps3|sonyplaystation3)$/, ['Sony - PlayStation 3']],
    [/^(playstation4|ps4|sonyplaystation4)$/, ['Sony - PlayStation 4']],
    [/^(playstation5|ps5|sonyplaystation5)$/, ['Sony - PlayStation 5']],
    [/^(playstation|psx|ps1|psone|sonyplaystation)$/, ['Sony - PlayStation']],
    [/^(psp|sonypsp)$/, ['Sony - PlayStation Portable']],
    [/^(psvita|vita)$/, ['Sony - PlayStation Vita']],
    [/^(switch|nintendoswitch)$/, ['Nintendo - Nintendo Switch']],
    [/^(xbox360|microsoftxbox360)$/, ['Microsoft - Xbox 360']],
    [/^(xboxone|microsoftxboxone)$/, ['Microsoft - Xbox One']],
    [/^(xbox|microsoftxbox)$/, ['Microsoft - Xbox']],
    [/^(pcengine|turbografx16|tg16)$/, ['NEC - PC Engine - TurboGrafx 16']],
  ]

  for (const [re, systems] of table) {
    if (re.test(key)) return systems
  }

  // Soft contains match (e.g. "Sony PlayStation 2 Fat")
  if (key.includes('playstation2') || key.includes('ps2')) {
    return ['Sony - PlayStation 2']
  }
  if (key.includes('playstation3') || key.includes('ps3')) {
    return ['Sony - PlayStation 3']
  }
  if (key.includes('playstation4') || key.includes('ps4')) {
    return ['Sony - PlayStation 4']
  }
  if (key.includes('dreamcast')) return ['Sega - Dreamcast']
  if (key.includes('megadrive') || key.includes('genesis')) {
    return ['Sega - Mega Drive - Genesis']
  }
  if (key.includes('playstation') || key.includes('psx') || key.includes('ps1')) {
    return ['Sony - PlayStation']
  }

  return []
}

/** Keep CDN path casing intact (use encoded href from the index when possible). */
export function boxartUrl(system, fileNameOrHref) {
  const raw = String(fileNameOrHref || '')
  // Already percent-encoded from directory listing
  if (/%[0-9A-Fa-f]{2}/.test(raw) && !raw.includes('/')) {
    return `${THUMB_BASE}/${encodeURIComponent(system)}/Named_Boxarts/${raw}`
  }
  const file = raw.endsWith('.png') || raw.endsWith('.PNG') ? raw : `${raw}.png`
  return `${THUMB_BASE}/${encodeURIComponent(system)}/Named_Boxarts/${encodeURIComponent(file)}`
}

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'and',
  'or',
  'le',
  'la',
  'les',
  'du',
  'de',
  'des',
  'un',
  'une',
  'in',
  'for',
  'to',
  'on',
  'el',
  'los',
  'las',
  'edition',
  'version',
  'game',
  'jeux',
])

/** Case/accent/punct insensitive — Libretro `_` stands for & * / : ` < > ? \\ | */
function normalizeTitle(value) {
  let s = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\.png$/i, '')
    .replace(/\([^)]*\)/g, ' ')
    // Libretro forbidden playlist chars become underscore in filenames
    .replace(/[_]+/g, ' ')

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

  return s
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function significantTokens(text) {
  return normalizeTitle(text)
    .split(' ')
    .filter((t) => t && (t.length > 1 || /^\d+$/.test(t)) && !STOPWORDS.has(t))
}

function queryVariants(query) {
  const raw = String(query || '').trim()
  if (!raw) return []
  const out = [raw]
  const nums = significantTokens(raw).filter((t) => /^\d+$/.test(t))

  const keepNums = (variant) => {
    if (!nums.length) return true
    const tokens = new Set(significantTokens(variant))
    return nums.every((n) => tokens.has(n))
  }

  if (raw.includes(':')) {
    const head = raw.split(':')[0].trim()
    if (keepNums(head)) out.push(head)
  }
  if (raw.includes(' - ')) {
    const head = raw.split(/\s+-\s+/)[0].trim()
    if (keepNums(head)) out.push(head)
  }
  if (raw.includes('–')) {
    const head = raw.split(/\s*–\s*/)[0].trim()
    if (keepNums(head)) out.push(head)
  }

  const cleaned = raw
    .replace(
      /\b(remastered|remake|hd|definitive|complete|goty|edition|collection)\b.*/i,
      '',
    )
    .trim()
  if (cleaned && keepNums(cleaned)) out.push(cleaned)

  const tokens = significantTokens(raw)
  if (tokens.length > 3) {
    const head = tokens.slice(0, 3).join(' ')
    if (keepNums(head)) out.push(head)
  }

  return [...new Set(out.filter((v) => v && v.length >= 2))]
}

function scoreOne(fileName, query) {
  const file = normalizeTitle(fileName)
  const q = normalizeTitle(query)
  if (!file || !q) return 0

  if (file === q) return 300
  if (file.startsWith(`${q} `)) return 260
  if (file.includes(` ${q} `) || file.endsWith(` ${q}`)) return 220
  if (file.includes(q)) return 180

  const qTokens = significantTokens(query)
  const fileTokens = significantTokens(fileName)
  if (!qTokens.length || !fileTokens.length) return 0

  const fileSet = new Set(fileTokens)

  const nums = qTokens.filter((t) => /^\d+$/.test(t))
  if (nums.some((n) => !fileSet.has(n))) return 0

  const hits = qTokens.filter((t) => fileSet.has(t))
  if (!hits.length) return 0

  const first = qTokens[0]
  if (!fileSet.has(first) && !file.startsWith(first)) {
    if (hits.length < Math.min(2, qTokens.length)) return 0
  }

  const ratio = hits.length / qTokens.length
  if (qTokens.length === 1) return hits.length ? 120 : 0
  if (qTokens.length === 2) {
    return hits.length >= 2 ? 150 + hits.length * 5 : 0
  }
  const need = Math.ceil(qTokens.length * 0.6)
  if (hits.length < need) return 0
  return Math.round(ratio * 130) + hits.length * 8
}

function scoreMatch(fileName, query) {
  let best = 0
  for (const variant of queryVariants(query)) {
    best = Math.max(best, scoreOne(fileName, variant))
  }
  return best
}

const listingCache = new Map()

/**
 * @returns {{ name: string, href: string }[]}
 * name = decoded display/compare name, href = encoded path segment for CDN
 */
export async function listNamedBoxarts(system) {
  if (listingCache.has(system)) return listingCache.get(system)

  const url = `${THUMB_BASE}/${encodeURIComponent(system)}/Named_Boxarts/`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'VGC/1.0' },
  })
  if (!res.ok) {
    listingCache.set(system, [])
    return []
  }

  const html = await res.text()
  const files = new Map()
  for (const match of html.matchAll(/href="([^"]+\.png)"/gi)) {
    const href = match[1]
    if (!href || href.startsWith('?') || href.startsWith('/') || href.startsWith('..')) {
      continue
    }
    // Skip nested paths but allow "./file.png"
    const segment = href.replace(/^\.\//, '')
    if (segment.includes('/')) continue

    let name = segment
    try {
      name = decodeURIComponent(segment)
    } catch {
      // keep raw
    }
    // Key by lowercase so duplicate casings collapse; keep first CDN href
    const key = name.toLowerCase()
    if (!files.has(key)) {
      files.set(key, { name, href: segment })
    }
  }

  const list = [...files.values()]
  listingCache.set(system, list)
  return list
}

/**
 * Fuzzy search via Libretro directory indexes — case/region insensitive.
 * Fetches at most one system index at a time (PS2 listing alone is ~0.6MB).
 */
export async function searchLibretroBoxarts(query, hardware = '') {
  const preferred = resolveLibretroSystems(hardware)
  const queue = preferred.length
    ? preferred
    : POPULAR_SYSTEMS.slice(0, 6)

  const preferredSet = new Set(preferred)
  const found = []
  const seenNames = new Set()

  for (const system of queue) {
    const files = await listNamedBoxarts(system)
    const boost = preferredSet.has(system) ? 40 : 0
    const scored = []

    for (const file of files) {
      const score = scoreMatch(file.name, query)
      if (score < 45) continue
      scored.push({ file, score: score + boost })
    }

    scored.sort((a, b) => b.score - a.score || a.file.name.localeCompare(b.file.name))

    for (const hit of scored) {
      const base = hit.file.name.replace(/\.png$/i, '')
      const dedupeKey = `${system}::${base.replace(/\s*\(Disc \d+\)/i, '').toLowerCase()}`
      if (seenNames.has(dedupeKey)) continue
      seenNames.add(dedupeKey)

      const parens = [...base.matchAll(/\(([^)]+)\)/g)].map((m) => m[1])
      const region =
        parens.find((p) =>
          /usa|europe|japan|world|france|germany|italy|spain|korea|asia|australia/i.test(
            p,
          ),
        ) ||
        parens[0] ||
        system.replace(/^(Sony|Sega|Nintendo|Microsoft|SNK|NEC) - /i, '')

      found.push({
        id: found.length + 1,
        name: base.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim(),
        system,
        region,
        mediaUrl: boxartUrl(system, hit.file.href),
        thumb: boxartUrl(system, hit.file.href),
        alternatives: [],
      })
      if (found.length >= 24) return found
    }

    // Mapped console already produced hits — stop (avoid extra huge indexes)
    if (preferred.length && found.length) return found
  }

  return found
}
