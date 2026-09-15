import { handleOptions } from '../_lib/db.js'
import { errorResponse, json } from '../_lib/respond.js'

const ALLOWED_HOSTS = new Set([
  'media.rawg.io',
  'thumbnails.libretro.com',
  'raw.githubusercontent.com',
  'images.igdb.com',
])

function sniffMime(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png'
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  ) {
    return 'image/gif'
  }
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  try {
    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' })
    }

    const raw = typeof req.query.url === 'string' ? req.query.url : ''
    if (!raw) {
      return json(res, 400, { error: 'url is required' })
    }

    let target
    try {
      target = new URL(raw)
    } catch {
      return json(res, 400, { error: 'Invalid url' })
    }

    if (target.protocol !== 'https:' && target.protocol !== 'http:') {
      return json(res, 400, { error: 'Invalid protocol' })
    }
    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return json(res, 403, { error: 'Host not allowed' })
    }

    const upstream = await fetch(target.toString(), {
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent': 'VGC-ImageProxy/1.0',
      },
      redirect: 'follow',
    })
    if (!upstream.ok) {
      return json(res, 502, { error: `Upstream ${upstream.status}` })
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())
    const sniffed = sniffMime(buffer)
    const headerType = (upstream.headers.get('content-type') || '')
      .split(';')[0]
      .trim()
    const contentType =
      sniffed ||
      (headerType.startsWith('image/') ? headerType : null) ||
      'image/jpeg'

    const asDataUrl = req.query.format === 'dataurl'
    if (asDataUrl) {
      return json(res, 200, {
        dataUrl: `data:${contentType};base64,${buffer.toString('base64')}`,
      })
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).end(buffer)
  } catch (err) {
    return errorResponse(res, err)
  }
}
