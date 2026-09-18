/** Card covers are ~150–300px wide; avoid shipping full originals. */
const CARD_COVER_WIDTH = 640
const IGDB_CARD_SIZE = 'cover_big_2x'

/**
 * Request a display-sized variant when the CDN supports it.
 * Original URL stays in DB.
 */
export function cardCoverUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'images.igdb.com') {
      parsed.pathname = parsed.pathname.replace(
        /\/t_[^/]+\//,
        `/t_${IGDB_CARD_SIZE}/`,
      )
      return parsed.toString()
    }

    if (parsed.hostname !== 'media.rawg.io') return url

    // Already a transformed asset
    if (/\/media\/(?:resize|crop)\//.test(parsed.pathname)) return url

    // /media/games/... → /media/resize/640/-/games/...
    if (!parsed.pathname.startsWith('/media/')) return url
    parsed.pathname = parsed.pathname.replace(
      /^\/media\//,
      `/media/resize/${CARD_COVER_WIDTH}/-/`,
    )
    return parsed.toString()
  } catch {
    return url
  }
}
