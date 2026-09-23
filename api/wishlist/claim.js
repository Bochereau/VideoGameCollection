import { createHash, randomBytes } from 'node:crypto'
import { ObjectId } from 'mongodb'
import { requireUserId } from '../_lib/auth.js'
import { readyClaims } from '../_lib/claims.js'
import { connectToDatabase, handleOptions } from '../_lib/db.js'
import { errorResponse, json } from '../_lib/respond.js'

const SHARE_TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/
const CLAIM_TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/
const NAME_RE = /^[\p{L}][\p{L}\s'’-]{0,39}$/u

function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

function parseName(value) {
  const name = String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
  if (!name || name.length > 40 || !NAME_RE.test(name)) return ''
  return name
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    const db = await connectToDatabase()
    const claims = await readyClaims(db)

    if (req.method === 'GET') {
      const shareToken = typeof req.query.token === 'string' ? req.query.token : ''
      if (shareToken) {
        res.setHeader('Cache-Control', 'no-store')
        if (!SHARE_TOKEN_RE.test(shareToken)) {
          return json(res, 404, { error: 'Lien introuvable' })
        }
        const share = await db.collection('wishlistShares').findOne({ token: shareToken })
        if (!share) return json(res, 404, { error: 'Lien introuvable' })

        const proofs = String(req.query.proofs ?? '')
          .split(',')
          .map((value) => value.trim())
          .filter((value) => CLAIM_TOKEN_RE.test(value))
          .slice(0, 40)
        if (!proofs.length) return json(res, 200, { mine: [] })

        const docs = await claims
          .find({
            userId: share.userId,
            tokenHash: { $in: proofs.map(hashToken) },
          })
          .project({ gameId: 1, name: 1, tokenHash: 1 })
          .toArray()

        const byHash = new Map(docs.map((doc) => [doc.tokenHash, doc]))
        const mine = []
        for (const proof of proofs) {
          const doc = byHash.get(hashToken(proof))
          if (!doc?.name) continue
          mine.push({ gameId: String(doc.gameId), name: doc.name })
        }
        return json(res, 200, { mine })
      }

      const userId = await requireUserId(req)
      const count = await claims.countDocuments({ userId })
      return json(res, 200, { count })
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const shareToken = String(body?.token ?? '')
      const gameId = String(body?.gameId ?? '')
      const name = parseName(body?.name)
      if (!SHARE_TOKEN_RE.test(shareToken)) {
        return json(res, 404, { error: 'Lien introuvable' })
      }
      if (!ObjectId.isValid(gameId)) {
        return json(res, 400, { error: 'Jeu introuvable' })
      }
      if (!name) {
        return json(res, 400, { error: 'Indique un prénom.' })
      }

      const share = await db.collection('wishlistShares').findOne({ token: shareToken })
      if (!share) return json(res, 404, { error: 'Lien introuvable' })

      const game = await db.collection('games').findOne({
        _id: new ObjectId(gameId),
        userId: share.userId,
        $or: [{ wishlist: true }, { wishlist: 'true' }],
      })
      if (!game) return json(res, 404, { error: 'Ce jeu n’est plus dans la liste.' })

      const claimToken = randomBytes(18).toString('base64url')
      try {
        await claims.insertOne({
          userId: share.userId,
          gameId: game._id,
          name,
          tokenHash: hashToken(claimToken),
          createdAt: new Date(),
        })
      } catch (err) {
        if (err?.code === 11000) {
          return json(res, 409, { error: 'Ce jeu est déjà réservé.' })
        }
        throw err
      }

      return json(res, 201, {
        claimToken,
        gameId: String(game._id),
        name,
      })
    }

    if (req.method === 'DELETE') {
      const body = parseBody(req)
      const claimToken = String(body?.claimToken ?? '')
      if (claimToken) {
        if (!CLAIM_TOKEN_RE.test(claimToken)) {
          return json(res, 404, { error: 'Réservation introuvable.' })
        }
        const claim = await claims.findOne({ tokenHash: hashToken(claimToken) })
        if (!claim) return json(res, 404, { error: 'Réservation introuvable.' })
        await claims.deleteOne({ _id: claim._id })
        return json(res, 200, { ok: true })
      }

      const userId = await requireUserId(req)
      const gameId = typeof req.query.gameId === 'string' ? req.query.gameId : ''
      if (!ObjectId.isValid(gameId)) {
        return json(res, 400, { error: 'Jeu introuvable' })
      }
      await claims.deleteOne({ userId, gameId: new ObjectId(gameId) })
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    return errorResponse(res, err)
  }
}
