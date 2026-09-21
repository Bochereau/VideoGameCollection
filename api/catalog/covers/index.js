import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import {
  fetchIgdbCoverOptions,
  igdbRegionPreference,
  libretroRegionPreference,
  sanitizeQuery,
  scoreTitleMatch,
} from '../../_lib/igdb.js'
import { searchLibretroBoxarts } from '../../_lib/libretro-thumbnails.js'
import { errorResponse, json } from '../../_lib/respond.js'

function sortByTitleThenRegion(items, q, regionRank) {
  return [...items].sort((a, b) => {
    const score = scoreTitleMatch(b.name, q) - scoreTitleMatch(a.name, q)
    if (score) return score
    return regionRank(a.region) - regionRank(b.region)
  })
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

    const [igdbResults, libretro] = await Promise.all([
      fetchIgdbCoverOptions(q, {
        hardware,
        igdbId: Number.isInteger(igdbId) && igdbId > 0 ? igdbId : null,
        limit: 24,
      }),
      searchLibretroBoxarts(q, hardware).catch(() => []),
    ])

    const seen = new Set(igdbResults.map((item) => item.mediaUrl))
    const libretroResults = (Array.isArray(libretro) ? libretro : [])
      .filter((item) => item?.mediaUrl && !seen.has(item.mediaUrl))
      .map((item) => ({
        ...item,
        source: 'libretro',
      }))

    const results = [
      ...sortByTitleThenRegion(igdbResults, q, igdbRegionPreference),
      ...sortByTitleThenRegion(libretroResults, q, libretroRegionPreference),
    ].slice(0, 40)

    return json(res, 200, {
      configured: true,
      source: 'igdb',
      results,
    })
  } catch (err) {
    return errorResponse(res, err)
  }
}
