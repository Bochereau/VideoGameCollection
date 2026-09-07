import { verifyToken } from '@clerk/backend'

export async function requireUserId(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }

  const token = header.slice('Bearer '.length)
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!secretKey) {
    const err = new Error('Server misconfigured')
    err.status = 500
    throw err
  }

  try {
    const payload = await verifyToken(token, { secretKey })
    if (!payload.sub) throw new Error('Missing subject')
    return payload.sub
  } catch {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
}
