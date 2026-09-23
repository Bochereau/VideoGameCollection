let indexesReady

export function claimsCollection(db) {
  const claims = db.collection('wishlistClaims')
  if (!indexesReady) {
    indexesReady = Promise.all([
      claims.createIndex({ userId: 1, gameId: 1 }, { unique: true }),
      claims.createIndex({ tokenHash: 1 }, { unique: true }),
    ]).catch((err) => {
      indexesReady = undefined
      throw err
    })
  }
  return claims
}

export async function readyClaims(db) {
  const claims = claimsCollection(db)
  await indexesReady
  return claims
}

export async function reservedIdSet(db, userId, gameIds) {
  if (!gameIds.length) return new Set()
  const claims = await readyClaims(db)
  const docs = await claims
    .find({ userId, gameId: { $in: gameIds } }, { projection: { gameId: 1 } })
    .toArray()
  return new Set(docs.map((doc) => String(doc.gameId)))
}

export async function clearClaim(db, userId, gameId) {
  const claims = await readyClaims(db)
  await claims.deleteOne({ userId, gameId })
}
