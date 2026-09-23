export type StoredClaim = {
  token: string
  name: string
}

export type StoredClaims = Record<string, StoredClaim>

function storageKey(shareToken: string) {
  return `vgc-wishlist-claim:${shareToken}`
}

export function readClaims(shareToken: string): StoredClaims {
  try {
    const raw = localStorage.getItem(storageKey(shareToken))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const claims: StoredClaims = {}
    for (const [gameId, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue
      const token = 'token' in value ? value.token : ''
      const name = 'name' in value ? value.name : ''
      if (typeof token === 'string' && token && typeof name === 'string' && name) {
        claims[gameId] = { token, name }
      }
    }
    return claims
  } catch {
    return {}
  }
}

export function writeClaims(shareToken: string, claims: StoredClaims) {
  const key = storageKey(shareToken)
  try {
    if (Object.keys(claims).length === 0) {
      localStorage.removeItem(key)
      return
    }
    localStorage.setItem(key, JSON.stringify(claims))
  } catch {
    // L’annulation reste possible tant que l’onglet n’est pas fermé.
  }
}
