import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json, serializeConsole } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const consoles = db.collection('consoles')
    const games = db.collection('games')

    if (req.method === 'GET') {
      const docs = await consoles.find({ userId }).sort({ name: 1 }).toArray()
      const counts = await games
        .aggregate([
          { $match: { userId, wishlist: false } },
          { $group: { _id: '$hardware', count: { $sum: 1 } } },
        ])
        .toArray()
      const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]))

      return json(
        res,
        200,
        docs.map((c) => serializeConsole(c, countMap[c.name] ?? 0)),
      )
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const name = String(body?.name ?? '').trim()
      if (!name) {
        return json(res, 400, { error: 'name is required' })
      }

      const existing = await consoles.findOne({ userId, name })
      if (existing) {
        return json(res, 409, { error: 'Console already exists' })
      }

      const doc = { userId, name, createdAt: new Date() }
      const result = await consoles.insertOne(doc)
      return json(res, 201, serializeConsole({ ...doc, _id: result.insertedId }, 0))
    }

    if (req.method === 'DELETE') {
      const id = req.query.id
      if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        return json(res, 400, { error: 'Invalid console id' })
      }
      const result = await consoles.deleteOne({
        _id: new ObjectId(id),
        userId,
      })
      if (result.deletedCount === 0) {
        return json(res, 404, { error: 'Console not found' })
      }
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
