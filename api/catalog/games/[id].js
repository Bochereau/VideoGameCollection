import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { rawgFetch } from '../../_lib/rawg.js'
import { errorResponse, json } from '../../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const id = req.query.id
    if (!id) {
      return json(res, 400, { error: 'Missing game id' })
    }

    const g = await rawgFetch(`/games/${id}`)
    const year = g.released ? Number(String(g.released).slice(0, 4)) : null

    const developers = (g.developers || []).map((d) => d.name).filter(Boolean)
    const publishers = (g.publishers || []).map((p) => p.name).filter(Boolean)

    return json(res, 200, {
      rawgId: g.id,
      name: g.name,
      release: Number.isFinite(year) ? year : null,
      cover: g.background_image || null,
      developer: developers[0] || '',
      editor: publishers[0] || '',
      platforms: (g.platforms || [])
        .map((p) => p?.platform?.name)
        .filter(Boolean),
    })
  } catch (err) {
    return errorResponse(res, err)
  }
}
