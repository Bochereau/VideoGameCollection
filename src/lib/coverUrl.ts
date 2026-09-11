/** Card covers are ~150–300px wide; 640 covers Retina without full RAWG originals. */
const CARD_COVER_WIDTH = 640

/**
 * For RAWG CDN URLs, request a resized variant.
 * Libretro / other hosts are returned unchanged. Original URL stays in DB.
 */
export function cardCoverUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
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
