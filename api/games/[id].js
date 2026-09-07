import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json, serializeGame } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const id = req.query.id

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return json(res, 400, { error: 'Invalid game id' })
    }

    const games = db.collection('games')
    const _id = new ObjectId(id)

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const existing = await games.findOne({ _id, userId })
      if (!existing) {
        return json(res, 404, { error: 'Game not found' })
      }

      const $set = { updatedAt: new Date() }
      if (body?.name !== undefined) $set.name = String(body.name).trim()
      if (body?.hardware !== undefined) $set.hardware = String(body.hardware).trim()
      if (body?.developer !== undefined) $set.developer = String(body.developer).trim()
      if (body?.editor !== undefined) $set.editor = String(body.editor).trim()
      if (body?.release !== undefined) {
        $set.release =
          body.release === null || body.release === '' ? null : Number(body.release)
      }
      if (body?.finished !== undefined) $set.finished = Boolean(body.finished)
      if (body?.wishlist !== undefined) $set.wishlist = Boolean(body.wishlist)
      if (body?.cover !== undefined) $set.cover = body.cover ? String(body.cover) : null
      if (body?.rawgId !== undefined) {
        $set.rawgId = body.rawgId != null ? Number(body.rawgId) : null
      }

      const name = $set.name ?? existing.name
      const hardware = $set.hardware ?? existing.hardware
      if (!name || !hardware) {
        return json(res, 400, { error: 'name and hardware are required' })
      }

      await games.updateOne({ _id, userId }, { $set })
      const updated = await games.findOne({ _id, userId })
      return json(res, 200, serializeGame(updated))
    }

    if (req.method === 'DELETE') {
      const result = await games.deleteOne({ _id, userId })
      if (result.deletedCount === 0) {
        return json(res, 404, { error: 'Game not found' })
      }
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
