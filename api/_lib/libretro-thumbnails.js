const THUMB_BASE = 'https://thumbnails.libretro.com'

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
    [/^(playstation|psx|ps1|psone)$/, ['Sony - PlayStation']],
    [/^(playstation2|ps2)$/, ['Sony - PlayStation 2']],
    [/^(playstation3|ps3)$/, ['Sony - PlayStation 3']],
    [/^(playstation4|ps4)$/, ['Sony - PlayStation 4']],
    [/^(playstation5|ps5)$/, ['Sony - PlayStation 5']],
    [/^(psp)$/, ['Sony - PlayStation Portable']],
    [/^(psvita|vita)$/, ['Sony - PlayStation Vita']],
    [/^(switch|nintendoswitch)$/, ['Nintendo - Nintendo Switch']],
    [/^(xbox)$/, ['Microsoft - Xbox']],
    [/^(xbox360)$/, ['Microsoft - Xbox 360']],
    [/^(xboxone)$/, ['Microsoft - Xbox One']],
    [/^(pcengine|turbografx16|tg16)$/, ['NEC - PC Engine - TurboGrafx 16']],
  ]

  for (const [re, systems] of table) {
    if (re.test(key)) return systems
  }
  return []
}

function stripExt(name) {
  return name.replace(/\.(png|jpg|jpeg|webp)$/i, '')
}

/** Build filename candidates (Libretro uses No-Intro-ish names). */
export function buildNameCandidates(raw) {
  const base = stripExt(String(raw || '').trim())
  if (!base) return []

  const cleaned = base
    .replace(/\s+/g, ' ')
    .replace(/[:]+/g, ' - ')
    .replace(/[®™©]/g, '')
    .trim()

  const noArticles = cleaned.replace(/^(the|a|an|le|la|les|l')\s+/i, '').trim()
  const regions = [
    '',
    ' (USA)',
    ' (Europe)',
    ' (Japan)',
    ' (World)',
    ' (USA, Europe)',
    ' (Europe, USA)',
    ' (Japan, USA)',
    ' (En, Fr, De, Es, It)',
  ]

  const seeds = [...new Set([cleaned, noArticles].filter(Boolean))]
  const out = []
  for (const seed of seeds) {
    for (const region of regions) {
      out.push(`${seed}${region}`)
    }
  }
  return out.slice(0, 24)
}

export function boxartUrl(system, gameName) {
  return `${THUMB_BASE}/${encodeURIComponent(system)}/Named_Boxarts/${encodeURIComponent(gameName)}.png`
}

export async function urlExists(url) {
  try {
    const head = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (head.ok) return true
    // Some CDNs dislike HEAD — fall back to a tiny range GET
    if (head.status === 403 || head.status === 405) {
      const get = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        redirect: 'follow',
      })
      return get.ok || get.status === 206
    }
    return false
  } catch {
    return false
  }
}

/**
 * Probe Libretro CDN for matching Named_Boxarts.
 * If no hardware mapping, try a short list of popular systems.
 */
export async function searchLibretroBoxarts(query, hardware = '') {
  let systems = resolveLibretroSystems(hardware)
  if (!systems.length) {
    systems = [
      'Sega - Dreamcast',
      'Sony - PlayStation',
      'Sony - PlayStation 2',
      'Sega - Mega Drive - Genesis',
      'Nintendo - Super Nintendo Entertainment System',
      'Nintendo - Nintendo Entertainment System',
    ]
  }

  const names = buildNameCandidates(query)
  const candidates = []
  const seen = new Set()

  for (const system of systems) {
    for (const name of names) {
      const url = boxartUrl(system, name)
      if (seen.has(url)) continue
      seen.add(url)
      candidates.push({ system, name, url })
    }
  }

  const limited = candidates.slice(0, 40)
  const checks = await Promise.all(
    limited.map(async (c) => ({ ...c, ok: await urlExists(c.url) })),
  )

  const found = []
  for (const c of checks) {
    if (!c.ok) continue
    const regionMatch = c.name.match(/\(([^)]+)\)\s*$/)
    found.push({
      id: found.length + 1,
      name: c.name.replace(/\s*\([^)]+\)\s*$/, ''),
      system: c.system,
      region: regionMatch?.[1] || 'wor',
      mediaUrl: c.url,
      thumb: c.url,
      alternatives: [],
    })
    if (found.length >= 12) break
  }

  return found
}
