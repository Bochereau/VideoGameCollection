import { randomBytes } from 'node:crypto'
import { requireUserId } from '../_lib/auth.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json, serializeGame } from '../_lib/respond.js'

const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/

let indexesReady

function ensureIndexes(shares) {
  if (!indexesReady) {
    indexesReady = Promise.all([
      shares.createIndex({ userId: 1 }, { unique: true }),
      shares.createIndex({ token: 1 }, { unique: true }),
    ]).catch((err) => {
      indexesReady = undefined
      throw err
    })
  }
  return indexesReady
}

function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
}

function parseOwnerName(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, 80)
}

function newToken() {
  return randomBytes(18).toString('base64url')
}

function serializeShare(doc) {
  return {
    token: doc.token,
    ownerName: doc.ownerName ?? '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function serializePublicGame(doc) {
  const game = serializeGame(doc)
  return {
    id: game.id,
    name: game.name,
    hardware: game.hardware,
    developer: game.developer,
    editor: game.editor,
    release: game.release,
    priority: game.priority,
    cover: game.cover,
    format: game.format,
    edition: game.edition,
  }
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const shares = db.collection('wishlistShares')
    await ensureIndexes(shares)

    const tokenQuery = typeof req.query.token === 'string' ? req.query.token : ''

    if (req.method === 'GET' && tokenQuery) {
      res.setHeader('Cache-Control', 'no-store')
      if (!TOKEN_RE.test(tokenQuery)) {
        return json(res, 404, { error: 'Lien introuvable' })
      }

      const share = await shares.findOne({ token: tokenQuery })
      if (!share) {
        return json(res, 404, { error: 'Lien introuvable' })
      }

      const [docs, consoleDocs] = await Promise.all([
        db
          .collection('games')
          .find({
            userId: share.userId,
            $or: [{ wishlist: true }, { wishlist: 'true' }],
          })
          .collation({ locale: 'fr', strength: 2 })
          .sort({ name: 1 })
          .toArray(),
        db.collection('consoles').find({ userId: share.userId }).toArray(),
      ])

      const logos = {}
      for (const consoleDoc of consoleDocs) {
        if (consoleDoc?.name && consoleDoc.logo) logos[consoleDoc.name] = consoleDoc.logo
      }

      return json(res, 200, {
        ownerName: share.ownerName ?? '',
        games: docs.map(serializePublicGame),
        logos,
      })
    }

    const userId = await requireUserId(req)

    if (req.method === 'GET') {
      const existing = await shares.findOne({ userId })
      if (!existing) return json(res, 200, { token: null })
      return json(res, 200, serializeShare(existing))
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const ownerName = parseOwnerName(body?.ownerName)
      const rotate = body?.rotate === true
      const existing = await shares.findOne({ userId })
      const now = new Date()

      if (existing && !rotate) {
        if (ownerName !== (existing.ownerName ?? '')) {
          await shares.updateOne(
            { userId },
            { $set: { ownerName, updatedAt: now } },
          )
          existing.ownerName = ownerName
          existing.updatedAt = now
        }
        return json(res, 200, serializeShare(existing))
      }

      const token = newToken()
      if (existing) {
        await shares.updateOne(
          { userId },
          { $set: { token, ownerName, updatedAt: now } },
        )
        return json(res, 200, serializeShare({ ...existing, token, ownerName, updatedAt: now }))
      }

      const doc = { userId, token, ownerName, createdAt: now, updatedAt: now }
      try {
        await shares.insertOne(doc)
      } catch (err) {
        if (err?.code === 11000) {
          const again = await shares.findOne({ userId })
          if (again) return json(res, 200, serializeShare(again))
        }
        throw err
      }
      return json(res, 201, serializeShare(doc))
    }

    if (req.method === 'DELETE') {
      await shares.deleteOne({ userId })
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
