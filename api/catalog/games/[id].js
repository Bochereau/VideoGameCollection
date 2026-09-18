import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { igdbQuery, mapIgdbGameDetails } from '../../_lib/igdb.js'
import { errorResponse, json } from '../../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const id = Number(req.query.id)
    if (!Number.isInteger(id) || id <= 0) {
      return json(res, 400, { error: 'Missing game id' })
    }

    const data = await igdbQuery(
      'games',
      `fields name, first_release_date, cover.image_id, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; where id = ${id};`,
    )

    const g = Array.isArray(data) ? data[0] : null
    if (!g) {
      return json(res, 404, { error: 'Game not found' })
    }

    return json(res, 200, mapIgdbGameDetails(g))
  } catch (err) {
    return errorResponse(res, err)
  }
}
