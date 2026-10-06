// Applique scripts/genres-classification.json (nom du jeu -> ids de genres) en base.
// Usage : node --env-file=.env scripts/apply-genres.mjs [--dry] [--force]
//   --dry   : n'écrit rien
//   --force : écrase aussi les genres déjà renseignés (par défaut : seulement les jeux sans genre)
import dns from 'node:dns'
import { readFileSync } from 'node:fs'
import { connectToDatabase } from '../api/_lib/db.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const dry = process.argv.includes('--dry')
const force = process.argv.includes('--force')
const classification = JSON.parse(
  readFileSync(new URL('./genres-classification.json', import.meta.url), 'utf8'),
)

const games = (await connectToDatabase()).collection('games')
const docs = await games.find({}, { projection: { name: 1, genres: 1 } }).toArray()

let updated = 0
let skipped = 0
const unknown = []
for (const doc of docs) {
  const genres = classification[doc.name]
  if (!genres) {
    unknown.push(doc.name)
    continue
  }
  if (!force && Array.isArray(doc.genres) && doc.genres.length) {
    skipped++
    continue
  }
  console.log(`  ${doc.name} → ${genres.join(', ')}`)
  if (!dry) await games.updateOne({ _id: doc._id }, { $set: { genres } })
  updated++
}

console.log(
  `${dry ? '[dry] ' : ''}${updated} mis à jour, ${skipped} déjà renseignés (ignorés), ` +
    `${unknown.length} sans classement : ${unknown.join(' ; ') || '—'}`,
)
process.exit(0)
