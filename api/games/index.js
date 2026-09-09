import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json, serializeGame } from '../_lib/respond.js'

function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
}

const CONDITIONS = new Set(['complete', 'box', 'manual', 'loose', 'none'])
const EDITIONS = new Set(['standard', 'steelbook', 'special', 'deluxe', 'collector'])

function parseCopyFields(body, existing = {}) {
  const rawFormat = body?.format ?? existing.format
  const format = rawFormat === 'digital' ? 'digital' : 'physical'

  let condition = 'none'
  if (format === 'physical') {
    const raw = body?.condition ?? existing.condition
    if (CONDITIONS.has(raw)) {
      condition = raw
    } else if (body?.condition === undefined && existing.condition === undefined) {
      // legacy
      const box = Boolean(existing.hasBox)
      const manual = Boolean(existing.hasManual)
      if (box && manual) condition = 'complete'
      else if (box) condition = 'box'
      else if (manual) condition = 'manual'
      else condition = 'none'
    }
  }

  const rawEdition = body?.edition ?? existing.edition
  let edition = 'standard'
  if (EDITIONS.has(rawEdition)) {
    edition = rawEdition
  } else if (body?.edition === undefined && Boolean(existing.isCollector)) {
    edition = 'collector'
  }

  return { format, condition, edition }
}

function conditionFilterClause(value) {
  if (value === 'complete') {
    return {
      $or: [
        { condition: 'complete' },
        {
          condition: { $exists: false },
          hasBox: true,
          hasManual: true,
        },
      ],
    }
  }
  if (value === 'box') {
    return {
      $or: [
        { condition: 'box' },
        {
          condition: { $exists: false },
          hasBox: true,
          hasManual: { $ne: true },
        },
      ],
    }
  }
  if (value === 'manual') {
    return {
      $or: [
        { condition: 'manual' },
        {
          condition: { $exists: false },
          hasManual: true,
          hasBox: { $ne: true },
        },
      ],
    }
  }
  if (value === 'loose') {
    return { condition: 'loose' }
  }
  // none
  return {
    $or: [
      { condition: 'none' },
      {
        condition: { $exists: false },
        hasBox: { $ne: true },
        hasManual: { $ne: true },
      },
    ],
  }
}

function editionFilterClause(value) {
  if (value === 'collector') {
    return {
      $or: [
        { edition: 'collector' },
        { edition: { $exists: false }, isCollector: true },
      ],
    }
  }
  if (value === 'special') return { edition: 'special' }
  if (value === 'steelbook') return { edition: 'steelbook' }
  if (value === 'deluxe') return { edition: 'deluxe' }
  // standard
  return {
    $or: [
      { edition: 'standard' },
      {
        edition: { $exists: false },
        isCollector: { $ne: true },
      },
    ],
  }
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const games = db.collection('games')

    if (req.method === 'GET') {
      const filter = { userId }
      const and = []

      if (req.query.wishlist === 'true') {
        filter.wishlist = true
      } else if (req.query.wishlist === 'false') {
        // Owned collection: exclude wishlist (and treat missing flag as owned)
        and.push({
          $nor: [{ wishlist: true }, { wishlist: 'true' }],
        })
      }

      if (typeof req.query.hardware === 'string' && req.query.hardware) {
        filter.hardware = req.query.hardware
      }

      if (req.query.finished === 'true') filter.finished = true
      else if (req.query.finished === 'false') filter.finished = false

      if (req.query.format === 'digital') {
        filter.format = 'digital'
      } else if (req.query.format === 'physical') {
        and.push({
          $or: [
            { format: 'physical' },
            { format: { $exists: false } },
            { format: null },
          ],
        })
      }

      if (CONDITIONS.has(req.query.condition)) {
        and.push(conditionFilterClause(req.query.condition))
      }

      if (EDITIONS.has(req.query.edition)) {
        and.push(editionFilterClause(req.query.edition))
      }

      if (typeof req.query.q === 'string' && req.query.q.trim()) {
        const term = req.query.q.trim()
        and.push({
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { developer: { $regex: term, $options: 'i' } },
            { editor: { $regex: term, $options: 'i' } },
            { hardware: { $regex: term, $options: 'i' } },
          ],
        })
      }

      if (and.length) filter.$and = and

      const docs = await games
        .find(filter)
        .collation({ locale: 'fr', strength: 2 })
        .sort({ name: 1 })
        .toArray()
      return json(res, 200, docs.map(serializeGame))
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const name = String(body?.name ?? '').trim()
      const hardware = String(body?.hardware ?? '').trim()

      if (!name || !hardware) {
        return json(res, 400, { error: 'name and hardware are required' })
      }

      const now = new Date()
      const copy = parseCopyFields(body)
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
        wishlist: body?.wishlist === true || body?.wishlist === 'true',
        cover: body?.cover ? String(body.cover) : null,
        rawgId: body?.rawgId != null ? Number(body.rawgId) : null,
        ...copy,
        createdAt: now,
        updatedAt: now,
      }

      const result = await games.insertOne(doc)
      return json(res, 201, serializeGame({ ...doc, _id: result.insertedId }))
    }

    const id = req.query.id
    if (
      (req.method === 'PATCH' || req.method === 'DELETE') &&
      (typeof id !== 'string' || !ObjectId.isValid(id))
    ) {
      return json(res, 400, { error: 'Invalid game id' })
    }

    if (req.method === 'PATCH' && typeof id === 'string') {
      const body = parseBody(req)
      const _id = new ObjectId(id)
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
      if (body?.wishlist !== undefined) {
        $set.wishlist = body.wishlist === true || body.wishlist === 'true'
      }
      if (body?.cover !== undefined) $set.cover = body.cover ? String(body.cover) : null
      if (body?.rawgId !== undefined) {
        $set.rawgId = body.rawgId != null ? Number(body.rawgId) : null
      }

      if (
        body?.format !== undefined ||
        body?.condition !== undefined ||
        body?.edition !== undefined
      ) {
        Object.assign($set, parseCopyFields(body, existing))
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

    if (req.method === 'DELETE' && typeof id === 'string') {
      const result = await games.deleteOne({ _id: new ObjectId(id), userId })
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
