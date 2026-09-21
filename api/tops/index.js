import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import {
  errorResponse,
  json,
  serializeGame,
  serializeTop,
  serializeTopEntry,
} from '../_lib/respond.js'

function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
}

function clampSize(value, fallback = 10) {
  const n = Number(value)
  if (!Number.isInteger(n)) return fallback
  return Math.min(100, Math.max(1, n))
}

function defaultColumnsPerRow(size) {
  if (size >= 80) return 20
  if (size >= 30) return 15
  if (size >= 15) return 10
  return 5
}

function parseColumnsPerRow(value, fallback = 5) {
  const n = Number(value)
  if (n === 5 || n === 10 || n === 15 || n === 20) return n
  return fallback
}

function normalizeEntry(raw, size) {
  const rank = Number(raw?.rank)
  if (!Number.isInteger(rank) || rank < 1 || rank > size) return null
  const name = String(raw?.name ?? '').trim()
  if (!name) return null

  let gameId = null
  if (raw?.gameId) {
    const id = String(raw.gameId)
    if (ObjectId.isValid(id)) gameId = id
  }

  const releaseRaw = raw?.release
  let release = null
  if (releaseRaw !== null && releaseRaw !== undefined && releaseRaw !== '') {
    const y = Number(releaseRaw)
    if (Number.isInteger(y)) release = y
  }

  let igdbId = null
  if (raw?.igdbId !== null && raw?.igdbId !== undefined && raw?.igdbId !== '') {
    const id = Number(raw.igdbId)
    if (Number.isInteger(id)) igdbId = id
  }

  let rawgId = null
  if (raw?.rawgId !== null && raw?.rawgId !== undefined && raw?.rawgId !== '') {
    const id = Number(raw.rawgId)
    if (Number.isInteger(id)) rawgId = id
  }

  return {
    rank,
    gameId,
    name,
    cover: raw?.cover ? String(raw.cover) : null,
    release,
    igdbId,
    rawgId,
  }
}

function normalizeEntries(rawEntries, size) {
  if (!Array.isArray(rawEntries)) {
    throw Object.assign(new Error('entries must be an array'), { status: 400 })
  }
  if (rawEntries.length > size) {
    throw Object.assign(new Error(`At most ${size} entries allowed`), {
      status: 400,
    })
  }

  const seen = new Set()
  const entries = []
  for (const raw of rawEntries) {
    const entry = normalizeEntry(raw, size)
    if (!entry) {
      throw Object.assign(new Error('Invalid top entry'), { status: 400 })
    }
    if (seen.has(entry.rank)) {
      throw Object.assign(new Error('Duplicate rank in entries'), { status: 400 })
    }
    seen.add(entry.rank)
    entries.push(entry)
  }
  entries.sort((a, b) => a.rank - b.rank)
  return entries
}

async function hydrateEntries(db, userId, entries) {
  const gameIds = entries
    .map((e) => e.gameId)
    .filter(Boolean)
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id))

  if (gameIds.length === 0) {
    return entries.map(serializeTopEntry)
  }

  const games = await db
    .collection('games')
    .find({ userId, _id: { $in: gameIds } })
    .toArray()
  const byId = Object.fromEntries(games.map((g) => [String(g._id), serializeGame(g)]))

  return entries.map((entry) => {
    const base = serializeTopEntry(entry)
    if (!entry.gameId) return base
    const live = byId[String(entry.gameId)]
    if (!live) return base
    return {
      ...base,
      name: live.name,
      cover: live.cover,
      release: live.release,
      igdbId: live.igdbId,
      rawgId: live.rawgId,
    }
  })
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const userId = await requireUserId(req)
    const tops = db.collection('tops')

    if (req.method === 'GET') {
      const id = req.query.id
      if (typeof id === 'string') {
        if (!ObjectId.isValid(id)) {
          return json(res, 400, { error: 'Invalid top id' })
        }
        const doc = await tops.findOne({ _id: new ObjectId(id), userId })
        if (!doc) {
          return json(res, 404, { error: 'Top not found' })
        }
        const entries = Array.isArray(doc.entries) ? doc.entries : []
        const hydrated = await hydrateEntries(db, userId, entries)
        return json(res, 200, {
          ...serializeTop(doc, { summary: true }),
          entries: hydrated,
        })
      }

      const docs = await tops
        .find({ userId })
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray()
      return json(
        res,
        200,
        docs.map((doc) => serializeTop(doc, { summary: true })),
      )
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const name = String(body?.name ?? '').trim()
      if (!name) {
        return json(res, 400, { error: 'name is required' })
      }
      const size = clampSize(body?.size, 10)
      const columnsPerRow = parseColumnsPerRow(
        body?.columnsPerRow,
        defaultColumnsPerRow(size),
      )
      const now = new Date()
      const doc = {
        userId,
        name,
        size,
        columnsPerRow,
        entries: [],
        createdAt: now,
        updatedAt: now,
      }
      const result = await tops.insertOne(doc)
      return json(res, 201, serializeTop({ ...doc, _id: result.insertedId }))
    }

    if (req.method === 'PATCH') {
      const id = req.query.id
      if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        return json(res, 400, { error: 'Invalid top id' })
      }

      const existing = await tops.findOne({ _id: new ObjectId(id), userId })
      if (!existing) {
        return json(res, 404, { error: 'Top not found' })
      }

      const body = parseBody(req)
      const update = { updatedAt: new Date() }

      if (body.name !== undefined) {
        const name = String(body.name ?? '').trim()
        if (!name) {
          return json(res, 400, { error: 'name is required' })
        }
        update.name = name
      }

      let nextSize = existing.size
      if (body.size !== undefined) {
        nextSize = clampSize(body.size, existing.size)
        update.size = nextSize
      }

      if (body.columnsPerRow !== undefined) {
        update.columnsPerRow = parseColumnsPerRow(
          body.columnsPerRow,
          defaultColumnsPerRow(nextSize),
        )
      }

      if (body.entries !== undefined) {
        update.entries = normalizeEntries(body.entries, nextSize)
      } else if (body.size !== undefined && nextSize < existing.size) {
        const entries = Array.isArray(existing.entries) ? existing.entries : []
        update.entries = entries.filter((e) => Number(e.rank) <= nextSize)
      }

      await tops.updateOne({ _id: existing._id, userId }, { $set: update })
      const doc = await tops.findOne({ _id: existing._id, userId })
      const entries = Array.isArray(doc.entries) ? doc.entries : []
      const hydrated = await hydrateEntries(db, userId, entries)
      return json(res, 200, {
        ...serializeTop(doc, { summary: true }),
        entries: hydrated,
      })
    }

    if (req.method === 'DELETE') {
      const id = req.query.id
      if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        return json(res, 400, { error: 'Invalid top id' })
      }
      const result = await tops.deleteOne({
        _id: new ObjectId(id),
        userId,
      })
      if (result.deletedCount === 0) {
        return json(res, 404, { error: 'Top not found' })
      }
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
