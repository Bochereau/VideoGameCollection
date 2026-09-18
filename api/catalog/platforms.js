import { requireUserId } from '../_lib/auth.js'
import { handleOptions } from '../_lib/db.js'
import { igdbQuery, sanitizeQuery } from '../_lib/igdb.js'
import { errorResponse, json } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = sanitizeQuery(
      typeof req.query.q === 'string' ? req.query.q.trim() : '',
    )

    const body = q
      ? `fields name; where name ~ *"${q.toLowerCase()}"*; limit 20;`
      : 'fields name; where category = (1, 5, 6); limit 50; sort name asc;'

    const data = await igdbQuery('platforms', body)

    const platforms = (Array.isArray(data) ? data : []).map((p) => ({
      igdbId: p.id,
      name: p.name,
      gamesCount: 0,
    }))

    platforms.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    return json(res, 200, platforms)
  } catch (err) {
    return errorResponse(res, err)
  }
}
