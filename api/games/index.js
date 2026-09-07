import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json, serializeGame } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const games = db.collection('games')

    if (req.method === 'GET') {
      const filter = { userId }

      if (req.query.wishlist === 'true') filter.wishlist = true
      else if (req.query.wishlist === 'false') filter.wishlist = false

      if (typeof req.query.hardware === 'string' && req.query.hardware) {
        filter.hardware = req.query.hardware
      }

      if (req.query.finished === 'true') filter.finished = true
      else if (req.query.finished === 'false') filter.finished = false

      if (typeof req.query.q === 'string' && req.query.q.trim()) {
        const term = req.query.q.trim()
        filter.$or = [
          { name: { $regex: term, $options: 'i' } },
          { developer: { $regex: term, $options: 'i' } },
          { editor: { $regex: term, $options: 'i' } },
          { hardware: { $regex: term, $options: 'i' } },
        ]
      }

      const docs = await games.find(filter).sort({ name: 1 }).toArray()
      return json(res, 200, docs.map(serializeGame))
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const name = String(body?.name ?? '').trim()
      const hardware = String(body?.hardware ?? '').trim()

      if (!name || !hardware) {
        return json(res, 400, { error: 'name and hardware are required' })
      }

      const now = new Date()
      const doc = {
        userId,
        name,
        hardware,
        developer: String(body?.developer ?? '').trim(),
        editor: String(body?.editor ?? '').trim(),
        release:
          body?.release === null || body?.release === '' || body?.release === undefined
            ? null
            : Number(body.release),
        finished: Boolean(body?.finished),
        wishlist: Boolean(body?.wishlist),
        cover: body?.cover ? String(body.cover) : null,
        rawgId: body?.rawgId != null ? Number(body.rawgId) : null,
        createdAt: now,
        updatedAt: now,
      }

      const result = await games.insertOne(doc)
      return json(res, 201, serializeGame({ ...doc, _id: result.insertedId }))
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
