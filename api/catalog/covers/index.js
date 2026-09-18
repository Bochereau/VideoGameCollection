import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import {
  igdbImageUrl,
  igdbQuery,
  IGDB_THUMB_SIZE,
  sanitizeQuery,
} from '../../_lib/igdb.js'
import { searchLibretroBoxarts } from '../../_lib/libretro-thumbnails.js'
import { errorResponse, json } from '../../_lib/respond.js'

function mapIgdbCover(g) {
  const imageId = g.cover?.image_id
  if (!imageId) return null
  const system = (g.platforms || []).map((p) => p?.name).filter(Boolean)[0] || ''
  return {
    id: g.id,
    name: g.name,
    system,
    region: 'Officielle',
    mediaUrl: igdbImageUrl(imageId),
    thumb: igdbImageUrl(imageId, IGDB_THUMB_SIZE),
    alternatives: [],
    source: 'igdb',
  }
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = sanitizeQuery(String(req.query.q || '').trim())
    if (q.length < 2) {
      return json(res, 400, { error: 'Query too short' })
    }

    const hardware = typeof req.query.hardware === 'string' ? req.query.hardware : ''
    const igdbId = Number(req.query.igdbId)

    const exactPromise =
      Number.isInteger(igdbId) && igdbId > 0
        ? igdbQuery(
            'games',
            `fields name, cover.image_id, platforms.name; where id = ${igdbId};`,
          )
        : Promise.resolve([])

    const searchPromise = igdbQuery(
      'games',
      `search "${q}"; fields name, cover.image_id, platforms.name; limit 16;`,
    )

    const libretroPromise = searchLibretroBoxarts(q, hardware).catch(() => [])

    const [exact, search, libretro] = await Promise.all([
      exactPromise,
      searchPromise,
      libretroPromise,
    ])

    const igdbResults = []
    const seen = new Set()

    const pushCover = (item) => {
      if (!item?.mediaUrl || seen.has(item.mediaUrl)) return
      seen.add(item.mediaUrl)
      igdbResults.push(item)
    }

    const exactHit = Array.isArray(exact) ? exact[0] : null
    if (exactHit) pushCover(mapIgdbCover(exactHit))
    for (const g of Array.isArray(search) ? search : []) {
      pushCover(mapIgdbCover(g))
    }

    const libretroResults = (Array.isArray(libretro) ? libretro : []).map((item) => ({
      ...item,
      source: 'libretro',
    }))

    const results = [...igdbResults, ...libretroResults].slice(0, 24)

    return json(res, 200, {
      configured: true,
      source: 'igdb',
      results,
    })
  } catch (err) {
    return errorResponse(res, err)
  }
}
