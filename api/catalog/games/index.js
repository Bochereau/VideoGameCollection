import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { rawgFetch } from '../../_lib/rawg.js'
import { errorResponse, json } from '../../_lib/respond.js'

function mapGame(g) {
  const year = g.released ? Number(String(g.released).slice(0, 4)) : null
  return {
    rawgId: g.id,
    name: g.name,
    release: Number.isFinite(year) ? year : null,
    cover: g.background_image || null,
    platforms: (g.platforms || [])
      .map((p) => p?.platform?.name)
      .filter(Boolean),
    rating: g.rating || null,
  }
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    if (q.length < 2) {
      return json(res, 200, [])
    }

    const data = await rawgFetch('/games', {
      search: q,
      page_size: 8,
    })

    return json(res, 200, (data.results || []).map(mapGame))
  } catch (err) {
    return errorResponse(res, err)
  }
}
