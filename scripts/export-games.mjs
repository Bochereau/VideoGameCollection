// Exporte nom + console + genres actuels de chaque jeu, pour classement.
// Usage : node --env-file=.env scripts/export-games.mjs > games-to-classify.json
import dns from 'node:dns'
import { connectToDatabase } from '../api/_lib/db.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const db = await connectToDatabase()
const docs = await db
  .collection('games')
  .find({}, { projection: { name: 1, hardware: 1, release: 1, genres: 1 } })
  .sort({ name: 1 })
  .toArray()

const rows = docs.map((d) => ({
  id: String(d._id),
  name: d.name,
  hardware: d.hardware,
  release: d.release ?? null,
  genres: d.genres ?? [],
}))
console.log(JSON.stringify(rows, null, 1))
process.exit(0)
