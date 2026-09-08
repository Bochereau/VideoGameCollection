import { requireUserId } from '../../_lib/auth.js'
import { handleOptions } from '../../_lib/db.js'
import { errorResponse, json } from '../../_lib/respond.js'
import { searchLibretroBoxarts } from '../../_lib/libretro-thumbnails.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    await requireUserId(req)

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const q = String(req.query.q || '').trim()
    if (q.length < 2) {
      return json(res, 400, { error: 'Query too short' })
    }

    const hardware = typeof req.query.hardware === 'string' ? req.query.hardware : ''
    const results = await searchLibretroBoxarts(q, hardware)

    return json(res, 200, {
      configured: true,
      source: 'libretro-thumbnails',
      results,
    })
  } catch (err) {
    return errorResponse(res, err)
  }
}
