import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json } from '../_lib/respond.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const id = req.query.id

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return json(res, 400, { error: 'Invalid console id' })
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('consoles').deleteOne({
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
