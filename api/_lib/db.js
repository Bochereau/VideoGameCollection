import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client

export async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI is missing')
  }
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db('vgc')
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Requested-With',
  )
}

export function handleOptions(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}
