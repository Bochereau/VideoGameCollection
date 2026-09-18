import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { mapIgdbGame, sanitizeQuery, searchIgdbGames } from '../../_lib/igdb.js'
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

    const hardware = typeof req.query.hardware === 'string' ? req.query.hardware : ''
    const rows = await searchIgdbGames(q, { hardware, limit: 8 })
    return json(res, 200, rows.map(mapIgdbGame))
  } catch (err) {
    return errorResponse(res, err)
  }
}
