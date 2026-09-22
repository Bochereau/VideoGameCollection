import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { resolvePlatformLogos } from '../_lib/igdb.js'
import { errorResponse, json, serializeConsole } from '../_lib/respond.js'

function parseIgdbId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

async function lookupLogo(name, igdbId) {
  try {
    const found = await resolvePlatformLogos([{ name, igdbId }])
    return found.get(name) ?? { igdbId: igdbId ?? null, logo: null }
  } catch (err) {
    console.error('Platform logo lookup failed:', err?.message || err)
    return null
  }
}

async function backfillLogos(consoles, userId, docs) {
  const pending = docs.filter((doc) => !doc.logoChecked)
  if (!pending.length) return

  let found
  try {
    found = await resolvePlatformLogos(
      pending.map((doc) => ({ name: doc.name, igdbId: doc.igdbId })),
    )
  } catch (err) {
    console.error('Platform logo backfill failed:', err?.message || err)
    return
  }

  await Promise.all(
    pending.map(async (doc) => {
      if (!found.has(doc.name)) return
      const hit = found.get(doc.name)
      const logo = hit?.logo || null
      const igdbId = hit?.igdbId ?? null
      await consoles.updateOne(
        { _id: doc._id, userId },
        { $set: { logo, igdbId, logoChecked: true } },
      )
      doc.logo = logo
      doc.igdbId = igdbId
      doc.logoChecked = true
    }),
  )
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const consoles = db.collection('consoles')
    const games = db.collection('games')

    if (req.method === 'GET') {
      const docs = await consoles
        .find({ userId })
        .collation({ locale: 'fr', strength: 2 })
        .sort({ name: 1 })
        .toArray()
      const wishlistMode = req.query.wishlist === 'true'
      const countMatch = wishlistMode
        ? { userId, wishlist: true }
        : {
            userId,
            $nor: [{ wishlist: true }, { wishlist: 'true' }],
          }

      const counts = await games
        .aggregate([
          { $match: countMatch },
          { $group: { _id: '$hardware', count: { $sum: 1 } } },
        ])
        .toArray()
      const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]))
      await backfillLogos(consoles, userId, docs)

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

      const requestedId = parseIgdbId(body?.igdbId)
      const logoHit = await lookupLogo(name, requestedId)
      const doc = {
        userId,
        name,
        logo: logoHit?.logo || null,
        igdbId: logoHit?.igdbId ?? requestedId,
        logoChecked: logoHit != null,
        createdAt: new Date(),
      }
      const result = await consoles.insertOne(doc)
      return json(res, 201, serializeConsole({ ...doc, _id: result.insertedId }, 0))
    }

    if (req.method === 'PATCH') {
      const id = req.query.id
      if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        return json(res, 400, { error: 'Invalid console id' })
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const name = String(body?.name ?? '').trim()
      if (!name) {
        return json(res, 400, { error: 'name is required' })
      }

      const _id = new ObjectId(id)
      const existing = await consoles.findOne({ _id, userId })
      if (!existing) {
        return json(res, 404, { error: 'Console not found' })
      }

      const clash = await consoles.findOne(
        { userId, name, _id: { $ne: _id } },
        { collation: { locale: 'fr', strength: 2 } },
      )
      if (clash) {
        return json(res, 409, { error: 'Une console porte déjà ce nom.' })
      }

      if (name !== existing.name) {
        await games.updateMany(
          { userId, hardware: existing.name },
          { $set: { hardware: name, updatedAt: new Date() } },
        )
        await consoles.updateOne({ _id, userId }, { $set: { name } })
      }

      const updated = await consoles.findOne({ _id, userId })
      const count = await games.countDocuments({
        userId,
        hardware: updated.name,
      })
      return json(res, 200, serializeConsole(updated, count))
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
