import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { igdbQuery, mapIgdbGame, sanitizeQuery } from '../../_lib/igdb.js'
import { errorResponse, json } from '../../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = sanitizeQuery(typeof req.query.q === 'string' ? req.query.q : '')
    if (q.length < 2) {
      return json(res, 200, [])
    }

    const data = await igdbQuery(
      'games',
      `search "${q}"; fields name, first_release_date, cover.image_id, platforms.name, aggregated_rating, rating; limit 8;`,
    )

    const games = (Array.isArray(data) ? data : []).map(mapIgdbGame)
    games.sort((a, b) => Number(Boolean(b.cover)) - Number(Boolean(a.cover)))
    return json(res, 200, games)
  } catch (err) {
    return errorResponse(res, err)
  }
}
