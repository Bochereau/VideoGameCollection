import { requireUserId } from '../_lib/auth.js'
import { handleOptions } from '../_lib/db.js'
import { rawgFetch } from '../_lib/rawg.js'
import { errorResponse, json } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : ''
    const data = await rawgFetch('/platforms', { page_size: 40 })

    let platforms = (data.results || []).map((p) => ({
      rawgId: p.id,
      name: p.name,
      gamesCount: p.games_count ?? 0,
    }))

    if (q) {
      platforms = platforms.filter((p) => p.name.toLowerCase().includes(q))
    }

    platforms.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    return json(res, 200, platforms)
  } catch (err) {
    return errorResponse(res, err)
  }
}
